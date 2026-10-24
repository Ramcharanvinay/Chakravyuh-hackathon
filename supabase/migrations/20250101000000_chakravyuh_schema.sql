-- ==============================================================================
-- CHAKRAVYUH HACKATHON PORTAL: SCHEMA (registration + admin)
--
-- Safe to run more than once (idempotent) and safe on top of the earlier version.
--
-- Rules enforced here, in the database, not just in the UI:
--   * A team is the leader plus 1 to 3 members: 2 to 4 people in total.
--   * Participants can NOT insert, update or delete anything directly. They can
--     only register a team, lock a problem and submit through the functions below.
--   * After registration only an admin can change a team (see the admin_* functions).
--
-- After running this file, create your admin (see the end of the file).
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- ADMINS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admins (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid());
$$;

-- ------------------------------------------------------------------------------
-- TEAMS and TEAM MEMBERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.teams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    team_name TEXT NOT NULL,
    leader_name TEXT,
    leader_reg_no TEXT,
    leader_email TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT team_name_length_check CHECK (char_length(team_name) BETWEEN 3 AND 60)
);
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS leader_name TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS leader_reg_no TEXT;
ALTER TABLE public.teams ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE UNIQUE INDEX IF NOT EXISTS teams_team_name_lower_uniq ON public.teams (lower(team_name));

CREATE TABLE IF NOT EXISTS public.team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
    name TEXT NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 80),
    contact TEXT CHECK (contact IS NULL OR char_length(contact) <= 120),
    role TEXT NOT NULL DEFAULT 'Member' CHECK (char_length(role) <= 40),
    position INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_team_members_team_id ON public.team_members(team_id);

-- Team size = leader + members, so members must be 1..3. Checked at COMMIT so that a
-- team and its members can be written together in one transaction.
CREATE OR REPLACE FUNCTION public.enforce_team_size()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_team UUID;
    v_members INT;
BEGIN
    IF TG_TABLE_NAME = 'teams' THEN
        v_team := NEW.id;
    ELSE
        v_team := COALESCE(NEW.team_id, OLD.team_id);
    END IF;

    -- When the whole team is being deleted there is nothing left to validate.
    IF EXISTS (SELECT 1 FROM public.teams WHERE id = v_team) THEN
        SELECT count(*) INTO v_members FROM public.team_members WHERE team_id = v_team;
        IF v_members < 1 OR v_members > 3 THEN
            RAISE EXCEPTION 'A team must have 2 to 4 members including the leader (got %).', v_members + 1
                USING ERRCODE = '23514';
        END IF;
    END IF;
    RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS team_size_on_members ON public.team_members;
CREATE CONSTRAINT TRIGGER team_size_on_members
    AFTER INSERT OR UPDATE OR DELETE ON public.team_members
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION public.enforce_team_size();

DROP TRIGGER IF EXISTS team_size_on_teams ON public.teams;
CREATE CONSTRAINT TRIGGER team_size_on_teams
    AFTER INSERT ON public.teams
    DEFERRABLE INITIALLY DEFERRED
    FOR EACH ROW EXECUTE FUNCTION public.enforce_team_size();

-- ------------------------------------------------------------------------------
-- PROBLEM CATALOG (mirrors src/config/hackathonConfig.ts)
-- Regenerate these rows if you add or rename problem statements.
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.problem_catalog (
    problem_id TEXT PRIMARY KEY,
    track_id TEXT NOT NULL
);
INSERT INTO public.problem_catalog (problem_id, track_id) VALUES
  ('prob-cb-01', 'track-cybersecurity-blockchain'),
  ('prob-cb-02', 'track-cybersecurity-blockchain'),
  ('prob-cb-03', 'track-cybersecurity-blockchain'),
  ('prob-cb-04', 'track-cybersecurity-blockchain'),
  ('prob-cb-05', 'track-cybersecurity-blockchain'),
  ('prob-cb-06', 'track-cybersecurity-blockchain'),
  ('prob-cb-07', 'track-cybersecurity-blockchain'),
  ('prob-cb-08', 'track-cybersecurity-blockchain'),
  ('prob-cb-09', 'track-cybersecurity-blockchain'),
  ('prob-cb-10', 'track-cybersecurity-blockchain'),
  ('prob-st-01', 'track-space-technology'),
  ('prob-st-02', 'track-space-technology'),
  ('prob-st-03', 'track-space-technology'),
  ('prob-st-04', 'track-space-technology'),
  ('prob-st-05', 'track-space-technology'),
  ('prob-st-06', 'track-space-technology'),
  ('prob-st-07', 'track-space-technology'),
  ('prob-st-08', 'track-space-technology'),
  ('prob-st-09', 'track-space-technology'),
  ('prob-st-10', 'track-space-technology'),
  ('prob-qc-01', 'track-quantum-computing'),
  ('prob-qc-02', 'track-quantum-computing'),
  ('prob-qc-03', 'track-quantum-computing'),
  ('prob-qc-04', 'track-quantum-computing'),
  ('prob-qc-05', 'track-quantum-computing'),
  ('prob-qc-06', 'track-quantum-computing'),
  ('prob-qc-07', 'track-quantum-computing'),
  ('prob-qc-08', 'track-quantum-computing'),
  ('prob-qc-09', 'track-quantum-computing'),
  ('prob-qc-10', 'track-quantum-computing'),
  ('prob-ft-01', 'track-fintech'),
  ('prob-ft-02', 'track-fintech'),
  ('prob-ft-03', 'track-fintech'),
  ('prob-ft-04', 'track-fintech'),
  ('prob-ft-05', 'track-fintech'),
  ('prob-ft-06', 'track-fintech'),
  ('prob-ft-07', 'track-fintech'),
  ('prob-ft-08', 'track-fintech'),
  ('prob-ft-09', 'track-fintech'),
  ('prob-ft-10', 'track-fintech'),
  ('prob-es-01', 'track-energy-sustainability'),
  ('prob-es-02', 'track-energy-sustainability'),
  ('prob-es-03', 'track-energy-sustainability'),
  ('prob-es-04', 'track-energy-sustainability'),
  ('prob-es-05', 'track-energy-sustainability'),
  ('prob-es-06', 'track-energy-sustainability'),
  ('prob-es-07', 'track-energy-sustainability'),
  ('prob-es-08', 'track-energy-sustainability'),
  ('prob-es-09', 'track-energy-sustainability'),
  ('prob-es-10', 'track-energy-sustainability')
ON CONFLICT (problem_id) DO UPDATE SET track_id = EXCLUDED.track_id;

-- ------------------------------------------------------------------------------
-- SELECTIONS and SUBMISSIONS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.team_selections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    track_id TEXT NOT NULL,
    problem_statement_id TEXT NOT NULL,
    locked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Earlier versions pointed these at tables that are no longer used.
ALTER TABLE public.team_selections DROP CONSTRAINT IF EXISTS team_selections_track_id_fkey;
ALTER TABLE public.team_selections DROP CONSTRAINT IF EXISTS team_selections_problem_statement_id_fkey;
ALTER TABLE public.team_selections DROP CONSTRAINT IF EXISTS fk_problem_track_match;

CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    team_id UUID NOT NULL UNIQUE REFERENCES public.teams(id) ON DELETE CASCADE,
    github_repo_url TEXT NOT NULL,
    deployed_url TEXT NOT NULL DEFAULT '',
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    spreadsheet_sync_status TEXT NOT NULL DEFAULT 'pending'
        CHECK (spreadsheet_sync_status IN ('pending', 'synced', 'failed', 'not_configured')),
    spreadsheet_synced_at TIMESTAMPTZ,
    sync_error TEXT
);
ALTER TABLE public.submissions ADD COLUMN IF NOT EXISTS deployed_url TEXT NOT NULL DEFAULT '';
DO $$
DECLARE c TEXT;
BEGIN
    FOREACH c IN ARRAY ARRAY['ppt_file_name', 'ppt_storage_path', 'ppt_size_bytes', 'ppt_mime_type'] LOOP
        IF EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_schema = 'public' AND table_name = 'submissions' AND column_name = c) THEN
            EXECUTE format('ALTER TABLE public.submissions ALTER COLUMN %I DROP NOT NULL', c);
        END IF;
    END LOOP;
END $$;
ALTER TABLE public.submissions DROP CONSTRAINT IF EXISTS github_url_format_check;
ALTER TABLE public.submissions ADD CONSTRAINT github_url_format_check
    CHECK (github_repo_url ~* '^https://github\.com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+/?$');

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY: read-only for participants, everything else via functions
-- ------------------------------------------------------------------------------
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_selections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problem_catalog ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own team" ON public.teams;
DROP POLICY IF EXISTS "Users can insert own team" ON public.teams;
DROP POLICY IF EXISTS "Teams can view own selection" ON public.team_selections;
DROP POLICY IF EXISTS "Teams can view own submission" ON public.submissions;
DROP POLICY IF EXISTS "Teams can insert own submission" ON public.submissions;
DROP POLICY IF EXISTS teams_select ON public.teams;
DROP POLICY IF EXISTS team_members_select ON public.team_members;
DROP POLICY IF EXISTS team_selections_select ON public.team_selections;
DROP POLICY IF EXISTS submissions_select ON public.submissions;
DROP POLICY IF EXISTS problem_catalog_select ON public.problem_catalog;

CREATE POLICY teams_select ON public.teams FOR SELECT TO authenticated
    USING (owner_user_id = auth.uid() OR public.is_admin());

CREATE POLICY team_members_select ON public.team_members FOR SELECT TO authenticated
    USING (public.is_admin() OR EXISTS (
        SELECT 1 FROM public.teams t WHERE t.id = team_members.team_id AND t.owner_user_id = auth.uid()));

CREATE POLICY team_selections_select ON public.team_selections FOR SELECT TO authenticated
    USING (public.is_admin() OR EXISTS (
        SELECT 1 FROM public.teams t WHERE t.id = team_selections.team_id AND t.owner_user_id = auth.uid()));

CREATE POLICY submissions_select ON public.submissions FOR SELECT TO authenticated
    USING (public.is_admin() OR EXISTS (
        SELECT 1 FROM public.teams t WHERE t.id = submissions.team_id AND t.owner_user_id = auth.uid()));

CREATE POLICY problem_catalog_select ON public.problem_catalog FOR SELECT TO anon, authenticated USING (true);

-- No participant (or even admin) writes straight to the tables: only the functions below.
REVOKE ALL ON public.admins FROM anon, authenticated;
REVOKE ALL ON public.teams, public.team_members, public.team_selections, public.submissions, public.problem_catalog
    FROM anon, authenticated;
GRANT SELECT ON public.teams, public.team_members, public.team_selections, public.submissions TO authenticated;
GRANT SELECT ON public.problem_catalog TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- INTERNAL HELPERS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public._team_json(p_team_id UUID)
RETURNS JSONB
LANGUAGE sql STABLE SECURITY DEFINER
SET search_path = public
AS $$
    SELECT jsonb_build_object(
        'id', t.id,
        'owner_user_id', t.owner_user_id,
        'team_name', t.team_name,
        'leader_name', t.leader_name,
        'leader_reg_no', t.leader_reg_no,
        'leader_email', t.leader_email,
        'created_at', t.created_at,
        'members', COALESCE((
            SELECT jsonb_agg(jsonb_build_object('id', m.id, 'name', m.name, 'contact', m.contact, 'role', m.role)
                             ORDER BY m.position)
            FROM public.team_members m WHERE m.team_id = t.id), '[]'::jsonb)
    )
    FROM public.teams t WHERE t.id = p_team_id;
$$;

-- Validates and writes a team's members. Used by registration and by admin edits.
CREATE OR REPLACE FUNCTION public._write_members(p_team_id UUID, p_members JSONB)
RETURNS VOID
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    m JSONB;
    i INT := 0;
BEGIN
    IF p_members IS NULL OR jsonb_typeof(p_members) <> 'array' THEN
        RAISE EXCEPTION 'Members must be provided as a list.' USING ERRCODE = '22023';
    END IF;
    IF jsonb_array_length(p_members) < 1 OR jsonb_array_length(p_members) > 3 THEN
        RAISE EXCEPTION 'A team must have 2 to 4 members including the leader.' USING ERRCODE = '23514';
    END IF;

    DELETE FROM public.team_members WHERE team_id = p_team_id;
    FOR m IN SELECT * FROM jsonb_array_elements(p_members) LOOP
        i := i + 1;
        IF btrim(COALESCE(m->>'name', '')) = '' THEN
            RAISE EXCEPTION 'Every team member needs a name.' USING ERRCODE = '22023';
        END IF;
        INSERT INTO public.team_members (team_id, name, contact, role, position)
        VALUES (
            p_team_id,
            btrim(m->>'name'),
            NULLIF(btrim(COALESCE(m->>'contact', '')), ''),
            COALESCE(NULLIF(btrim(COALESCE(m->>'role', '')), ''), 'Member'),
            i
        );
    END LOOP;
END;
$$;

-- ------------------------------------------------------------------------------
-- PARTICIPANT FUNCTIONS
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_team(
    p_team_name TEXT,
    p_leader_name TEXT,
    p_leader_reg_no TEXT,
    p_members JSONB
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_email TEXT;
    v_name TEXT := btrim(COALESCE(p_team_name, ''));
    v_leader TEXT := btrim(COALESCE(p_leader_name, ''));
    v_reg TEXT := btrim(COALESCE(p_leader_reg_no, ''));
    v_team_id UUID;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'You must be signed in to register a team.' USING ERRCODE = '28000';
    END IF;
    SELECT email INTO v_email FROM auth.users WHERE id = v_uid;

    IF EXISTS (SELECT 1 FROM public.teams WHERE owner_user_id = v_uid) THEN
        RAISE EXCEPTION 'This account already has a registered team.' USING ERRCODE = '23505';
    END IF;
    IF char_length(v_name) < 3 OR char_length(v_name) > 60 THEN
        RAISE EXCEPTION 'Team name must be 3 to 60 characters.' USING ERRCODE = '22023';
    END IF;
    IF v_leader = '' THEN
        RAISE EXCEPTION 'Leader name is required.' USING ERRCODE = '22023';
    END IF;
    IF v_reg = '' THEN
        RAISE EXCEPTION 'Leader registration number is required.' USING ERRCODE = '22023';
    END IF;
    IF EXISTS (SELECT 1 FROM public.teams WHERE lower(team_name) = lower(v_name)) THEN
        RAISE EXCEPTION 'The team name "%" is already registered. Please choose another.', v_name
            USING ERRCODE = '23505';
    END IF;

    INSERT INTO public.teams (owner_user_id, team_name, leader_name, leader_reg_no, leader_email)
    VALUES (v_uid, v_name, v_leader, v_reg, COALESCE(v_email, ''))
    RETURNING id INTO v_team_id;

    PERFORM public._write_members(v_team_id, p_members);
    RETURN public._team_json(v_team_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.lock_team_selection(
    p_team_id UUID,
    p_track_id TEXT,
    p_problem_statement_id TEXT
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_owner UUID;
    v_problem_track TEXT;
    v_id UUID;
    v_locked TIMESTAMPTZ;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: user is not authenticated' USING ERRCODE = '28000';
    END IF;

    SELECT owner_user_id INTO v_owner FROM public.teams WHERE id = p_team_id;
    IF v_owner IS NULL THEN
        RAISE EXCEPTION 'Team not found.' USING ERRCODE = '02000';
    END IF;
    IF v_owner <> v_uid THEN
        RAISE EXCEPTION 'Forbidden: you are not the owner of this team.' USING ERRCODE = '42501';
    END IF;
    IF EXISTS (SELECT 1 FROM public.team_selections WHERE team_id = p_team_id) THEN
        RAISE EXCEPTION 'Your choice is already locked. Only an admin can change it.' USING ERRCODE = '23505';
    END IF;

    SELECT track_id INTO v_problem_track FROM public.problem_catalog WHERE problem_id = p_problem_statement_id;
    IF v_problem_track IS NULL THEN
        RAISE EXCEPTION 'Invalid problem statement: %', p_problem_statement_id USING ERRCODE = '22023';
    END IF;
    IF v_problem_track <> p_track_id THEN
        RAISE EXCEPTION 'Problem statement % does not belong to track %', p_problem_statement_id, p_track_id
            USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.team_selections (team_id, track_id, problem_statement_id)
    VALUES (p_team_id, p_track_id, p_problem_statement_id)
    RETURNING id, locked_at INTO v_id, v_locked;

    RETURN jsonb_build_object(
        'selection_id', v_id,
        'team_id', p_team_id,
        'track_id', p_track_id,
        'problem_statement_id', p_problem_statement_id,
        'locked_at', v_locked
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.submit_solution(p_github_url TEXT, p_deployed_url TEXT)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_uid UUID := auth.uid();
    v_team UUID;
    v_gh TEXT := btrim(COALESCE(p_github_url, ''));
    v_dep TEXT := btrim(COALESCE(p_deployed_url, ''));
    v_sub public.submissions;
BEGIN
    IF v_uid IS NULL THEN
        RAISE EXCEPTION 'Unauthorized: user is not authenticated' USING ERRCODE = '28000';
    END IF;
    SELECT id INTO v_team FROM public.teams WHERE owner_user_id = v_uid;
    IF v_team IS NULL THEN
        RAISE EXCEPTION 'No team is registered for this account.' USING ERRCODE = '02000';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.team_selections WHERE team_id = v_team) THEN
        RAISE EXCEPTION 'Lock a problem statement before submitting.' USING ERRCODE = '23514';
    END IF;
    IF EXISTS (SELECT 1 FROM public.submissions WHERE team_id = v_team) THEN
        RAISE EXCEPTION 'Your team has already finalized its submission. Only an admin can change it.'
            USING ERRCODE = '23505';
    END IF;
    IF v_gh !~* '^https://github\.com/[a-zA-Z0-9_.-]+/[a-zA-Z0-9_.-]+/?$' THEN
        RAISE EXCEPTION 'Please provide a valid HTTPS GitHub repository URL.' USING ERRCODE = '22023';
    END IF;
    IF v_dep !~* '^https?://[^[:space:]]+$' THEN
        RAISE EXCEPTION 'Please provide a valid deployed website URL (http or https).' USING ERRCODE = '22023';
    END IF;

    INSERT INTO public.submissions (team_id, github_repo_url, deployed_url)
    VALUES (v_team, v_gh, v_dep)
    RETURNING * INTO v_sub;

    RETURN jsonb_build_object(
        'id', v_sub.id,
        'team_id', v_sub.team_id,
        'github_repo_url', v_sub.github_repo_url,
        'deployed_url', v_sub.deployed_url,
        'submitted_at', v_sub.submitted_at
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- ADMIN FUNCTIONS (every one checks is_admin() itself)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.admin_stats()
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: admin only.' USING ERRCODE = '42501';
    END IF;
    RETURN jsonb_build_object(
        'teams', (SELECT count(*) FROM public.teams),
        'participants', (SELECT count(*) FROM public.teams) + (SELECT count(*) FROM public.team_members),
        'locked', (SELECT count(*) FROM public.team_selections),
        'submitted', (SELECT count(*) FROM public.submissions),
        'size_distribution', COALESCE((
            SELECT jsonb_object_agg(sz::text, c) FROM (
                SELECT sz, count(*) AS c FROM (
                    SELECT 1 + count(m.id) AS sz
                    FROM public.teams t LEFT JOIN public.team_members m ON m.team_id = t.id
                    GROUP BY t.id) s
                GROUP BY sz) d), '{}'::jsonb),
        'by_track', COALESCE((
            SELECT jsonb_object_agg(track_id, c) FROM (
                SELECT track_id, count(*) AS c FROM public.team_selections GROUP BY track_id) x), '{}'::jsonb),
        'registrations_by_day', COALESCE((
            SELECT jsonb_object_agg(d, c) FROM (
                SELECT to_char(created_at AT TIME ZONE 'utc', 'YYYY-MM-DD') AS d, count(*) AS c
                FROM public.teams WHERE created_at > now() - interval '14 days' GROUP BY 1) y), '{}'::jsonb)
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_list_teams()
RETURNS JSONB
LANGUAGE plpgsql STABLE SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: admin only.' USING ERRCODE = '42501';
    END IF;
    RETURN COALESCE((
        SELECT jsonb_agg(x.j ORDER BY x.created_at DESC) FROM (
            SELECT t.created_at,
                   public._team_json(t.id)
                   || jsonb_build_object(
                        'team_size', 1 + (SELECT count(*) FROM public.team_members m WHERE m.team_id = t.id),
                        'track_id', s.track_id,
                        'problem_id', s.problem_statement_id,
                        'locked_at', s.locked_at,
                        'submission', CASE WHEN sub.id IS NULL THEN NULL ELSE jsonb_build_object(
                            'github_repo_url', sub.github_repo_url,
                            'deployed_url', sub.deployed_url,
                            'submitted_at', sub.submitted_at) END
                   ) AS j
            FROM public.teams t
            LEFT JOIN public.team_selections s ON s.team_id = t.id
            LEFT JOIN public.submissions sub ON sub.team_id = t.id
        ) x), '[]'::jsonb);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_update_team(
    p_team_id UUID,
    p_team_name TEXT,
    p_leader_name TEXT,
    p_leader_reg_no TEXT,
    p_leader_email TEXT,
    p_members JSONB
)
RETURNS JSONB
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_name TEXT := btrim(COALESCE(p_team_name, ''));
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: admin only.' USING ERRCODE = '42501';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM public.teams WHERE id = p_team_id) THEN
        RAISE EXCEPTION 'Team not found.' USING ERRCODE = '02000';
    END IF;
    IF char_length(v_name) < 3 OR char_length(v_name) > 60 THEN
        RAISE EXCEPTION 'Team name must be 3 to 60 characters.' USING ERRCODE = '22023';
    END IF;
    IF btrim(COALESCE(p_leader_name, '')) = '' OR btrim(COALESCE(p_leader_reg_no, '')) = ''
       OR btrim(COALESCE(p_leader_email, '')) = '' THEN
        RAISE EXCEPTION 'Leader name, registration number and email are required.' USING ERRCODE = '22023';
    END IF;
    IF EXISTS (SELECT 1 FROM public.teams WHERE lower(team_name) = lower(v_name) AND id <> p_team_id) THEN
        RAISE EXCEPTION 'The team name "%" is already registered.', v_name USING ERRCODE = '23505';
    END IF;

    UPDATE public.teams
    SET team_name = v_name,
        leader_name = btrim(p_leader_name),
        leader_reg_no = btrim(p_leader_reg_no),
        leader_email = btrim(p_leader_email),
        updated_at = now()
    WHERE id = p_team_id;

    PERFORM public._write_members(p_team_id, p_members);
    RETURN public._team_json(p_team_id);
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_delete_team(p_team_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: admin only.' USING ERRCODE = '42501';
    END IF;
    DELETE FROM public.teams WHERE id = p_team_id;
    RETURN FOUND;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reset_selection(p_team_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: admin only.' USING ERRCODE = '42501';
    END IF;
    DELETE FROM public.submissions WHERE team_id = p_team_id;
    DELETE FROM public.team_selections WHERE team_id = p_team_id;
    RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reset_submission(p_team_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Forbidden: admin only.' USING ERRCODE = '42501';
    END IF;
    DELETE FROM public.submissions WHERE team_id = p_team_id;
    RETURN TRUE;
END;
$$;

-- ------------------------------------------------------------------------------
-- FUNCTION PERMISSIONS: signed-in users only; internal helpers are not callable at all
-- ------------------------------------------------------------------------------
REVOKE ALL ON FUNCTION public._team_json(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public._write_members(UUID, JSONB) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.enforce_team_size() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.register_team(TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.lock_team_selection(UUID, TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.submit_solution(TEXT, TEXT) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_stats() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_list_teams() FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_update_team(UUID, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_delete_team(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_reset_selection(UUID) FROM PUBLIC, anon;
REVOKE ALL ON FUNCTION public.admin_reset_submission(UUID) FROM PUBLIC, anon;

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.register_team(TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.lock_team_selection(UUID, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.submit_solution(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_stats() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_list_teams() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_update_team(UUID, TEXT, TEXT, TEXT, TEXT, JSONB) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_delete_team(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reset_selection(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_reset_submission(UUID) TO authenticated;

-- ------------------------------------------------------------------------------
-- CREATE YOUR ADMIN
-- 1. In the Supabase dashboard: Authentication > Users > Add user (email + password).
-- 2. Run this once with that email:
--
--   INSERT INTO public.admins (user_id, email)
--   SELECT id, email FROM auth.users WHERE email = 'admin@example.com'
--   ON CONFLICT (user_id) DO NOTHING;
-- ------------------------------------------------------------------------------
