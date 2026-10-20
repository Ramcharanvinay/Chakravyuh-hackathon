-- ==============================================================================
-- CHAKRAVYUH HACKATHON DATABASE SCHEMA & SECURITY POLICIES
-- PostgreSQL / Supabase Migration
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Clean teardown for clean migration run (optional safe idempotency)
-- DROP TABLE IF EXISTS submissions CASCADE;
-- DROP TABLE IF EXISTS team_selections CASCADE;
-- DROP TABLE IF EXISTS problem_statements CASCADE;
-- DROP TABLE IF EXISTS tracks CASCADE;
-- DROP TABLE IF EXISTS teams CASCADE;

-- ------------------------------------------------------------------------------
-- TABLE 1: TEAMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL UNIQUE,
    leader_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT team_name_length_check CHECK (char_length(team_name) >= 3 AND char_length(team_name) <= 60)
);

CREATE INDEX IF NOT EXISTS idx_teams_owner_user_id ON public.teams(owner_user_id);
CREATE INDEX IF NOT EXISTS idx_teams_team_name ON public.teams(team_name);

-- ------------------------------------------------------------------------------
-- TABLE 2: TRACKS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tracks (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    theme_key TEXT NOT NULL CHECK (theme_key IN ('agni', 'vajra', 'vayu', 'vanam', 'surya')),
    accent_color TEXT NOT NULL,
    secondary_color TEXT NOT NULL,
    glow_color TEXT NOT NULL,
    description TEXT NOT NULL,
    motto TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- TABLE 3: PROBLEM STATEMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.problem_statements (
    id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE CASCADE,
    problem_code TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    full_description TEXT NOT NULL,
    key_requirements JSONB NOT NULL DEFAULT '[]'::jsonb,
    suggested_tech JSONB NOT NULL DEFAULT '[]'::jsonb,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Novice', 'Challenger', 'Grandmaster')),
    display_order INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_problem_statements_track_id ON public.problem_statements(track_id);

-- ------------------------------------------------------------------------------
-- TABLE 4: TEAM SELECTIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_selections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL REFERENCES public.tracks(id) ON DELETE RESTRICT,
    problem_statement_id TEXT NOT NULL REFERENCES public.problem_statements(id) ON DELETE RESTRICT,
    locked_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT fk_problem_track_match FOREIGN KEY (problem_statement_id) REFERENCES public.problem_statements(id)
);

CREATE INDEX IF NOT EXISTS idx_team_selections_team_id ON public.team_selections(team_id);
CREATE INDEX IF NOT EXISTS idx_team_selections_track_problem ON public.team_selections(track_id, problem_statement_id);

-- ------------------------------------------------------------------------------
-- TABLE 5: SUBMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    github_repo_url TEXT NOT NULL,
    ppt_file_name TEXT NOT NULL,
    ppt_storage_path TEXT NOT NULL,
    ppt_size_bytes BIGINT NOT NULL,
    ppt_mime_type TEXT NOT NULL,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    spreadsheet_sync_status TEXT NOT NULL DEFAULT 'pending' CHECK (spreadsheet_sync_status IN ('pending', 'synced', 'failed', 'not_configured')),
    spreadsheet_synced_at TIMESTAMPTZ,
    sync_error TEXT,
    CONSTRAINT github_url_format_check CHECK (
        github_repo_url ~* '^https:\/\/github\.com\/[a-zA-Z0-9_\-\.]+\/[a-zA-Z0-9_\-\.]+\/?$'
    ),
    CONSTRAINT ppt_max_size_check CHECK (ppt_size_bytes <= 26214400) -- 25MB max
);

CREATE INDEX IF NOT EXISTS idx_submissions_team_id ON public.submissions(team_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_statements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 1. Tracks & Problems: Public read-only for authenticated and anon users
CREATE POLICY "Public tracks are viewable by all" 
    ON public.tracks FOR SELECT USING (true);

CREATE POLICY "Public problem statements are viewable by all" 
    ON public.problem_statements FOR SELECT USING (true);

-- 2. Teams Policies:
-- Users can read their own team
CREATE POLICY "Users can read own team" 
    ON public.teams FOR SELECT 
    USING (auth.uid() = owner_user_id);

-- Users can insert their own team on registration
CREATE POLICY "Users can insert own team" 
    ON public.teams FOR INSERT 
    WITH CHECK (auth.uid() = owner_user_id);

-- 3. Team Selections Policies:
-- A team can only select/view its own selection
CREATE POLICY "Teams can view own selection" 
    ON public.team_selections FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE teams.id = team_selections.team_id 
            AND teams.owner_user_id = auth.uid()
        )
    );

-- 4. Submissions Policies:
-- A team can only view their own submission
CREATE POLICY "Teams can view own submission" 
    ON public.submissions FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.teams 
            WHERE teams.id = submissions.team_id 
            AND teams.owner_user_id = auth.uid()
        )
    );

-- A team can only insert their own submission if they have locked a selection
CREATE POLICY "Teams can insert own submission" 
    ON public.submissions FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.teams 
            JOIN public.team_selections ON team_selections.team_id = teams.id
            WHERE teams.id = submissions.team_id 
            AND teams.owner_user_id = auth.uid()
        )
    );

-- ==============================================================================
-- ATOMIC LOCK FUNCTION (Transaction safe & idempotent)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.lock_team_selection(
    p_team_id UUID,
    p_track_id TEXT,
    p_problem_statement_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_calling_user_id UUID;
    v_team_owner_id UUID;
    v_existing_selection_id UUID;
    v_problem_track TEXT;
    v_new_selection_id UUID;
BEGIN
    -- 1. Verify caller identity
    v_calling_user_id := auth.uid();
    IF v_calling_user_id IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: User is not authenticated';
    END IF;

    -- 2. Verify team ownership
    SELECT owner_user_id INTO v_team_owner_id
    FROM public.teams
    WHERE id = p_team_id;

    IF v_team_owner_id IS NULL THEN
        RAISE EXCEPTION 'Team not found: %', p_team_id;
    END IF;

    IF v_team_owner_id <> v_calling_user_id THEN
        RAISE EXCEPTION 'Forbidden: You are not the owner of this team';
    END IF;

    -- 3. Check if already locked (immutable)
    SELECT id INTO v_existing_selection_id
    FROM public.team_selections
    WHERE team_id = p_team_id;

    IF v_existing_selection_id IS NOT NULL THEN
        RAISE EXCEPTION 'Choice is already locked. Changes are not permitted.';
    END IF;

    -- 4. Validate problem belongs to the track
    SELECT track_id INTO v_problem_track
    FROM public.problem_statements
    WHERE id = p_problem_statement_id;

    IF v_problem_track IS NULL THEN
        RAISE EXCEPTION 'Invalid problem statement ID: %', p_problem_statement_id;
    END IF;

    IF v_problem_track <> p_track_id THEN
        RAISE EXCEPTION 'Problem statement % does not belong to track %', p_problem_statement_id, p_track_id;
    END IF;

    -- 5. Insert atomic lock record
    INSERT INTO public.team_selections (team_id, track_id, problem_statement_id, locked_at)
    VALUES (p_team_id, p_track_id, p_problem_statement_id, timezone('utc'::text, now()))
    RETURNING id INTO v_new_selection_id;

    RETURN jsonb_build_object(
        'success', true,
        'selection_id', v_new_selection_id,
        'team_id', p_team_id,
        'track_id', p_track_id,
        'problem_statement_id', p_problem_statement_id,
        'locked_at', now()
    );
END;
$$;

-- Grant execution to authenticated users
GRANT EXECUTE ON FUNCTION public.lock_team_selection(UUID, TEXT, TEXT) TO authenticated;

-- ==============================================================================
-- STORAGE BUCKET CONFIGURATION & POLICIES
-- ==============================================================================
-- Creates the private 'hackathon-ppts' bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'hackathon-ppts',
    'hackathon-ppts',
    false,
    26214400, -- 25 MB
    ARRAY[
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/pdf'
    ]
)
ON CONFLICT (id) DO NOTHING;

-- Storage Policy: Authenticated users can upload to their team directory
CREATE POLICY "Teams can upload their presentation"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'hackathon-ppts' AND
    auth.uid() IS NOT NULL
);

-- Storage Policy: Teams can read their own uploaded files
CREATE POLICY "Teams can read their own presentation"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'hackathon-ppts' AND
    auth.uid() IS NOT NULL
);
