# CHAKRAVYUH — IMMERSIVE COLLEGE HACKATHON PORTAL

> **"Every great solution begins with the courage to enter."**  
> An ancient Indian war strategy brought into a futuristic technology arena. Built with React, TypeScript, Tailwind CSS, Framer Motion, Spline 3D, and Supabase.

---

## 🏛️ ARCHITECTURE OVERVIEW

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Spline Viewer, Lucide Icons, Canvas Confetti.
- **Backend & Database**: Supabase PostgreSQL with Row Level Security (RLS) and atomic lock RPC function (`lock_team_selection`).
- **Storage**: Supabase Storage private bucket (`hackathon-ppts`) with 25MB max limit.
- **Spreadsheet Synchronization**: Supabase Edge Function (`supabase/functions/sync-sheets`) using Google Service Account JWT authentication.
- **Resilient Sandbox Fallback**: Built-in persistent browser sandbox mode if Supabase credentials are not provided initially, allowing instant end-to-end evaluation.

---

## 🌟 CORE ROUTES & APPLICATION FLOW

| Route | Page Name | Description |
|---|---|---|
| `/login` | **Entry to the Arena** | Full-screen cinematic portal with team registration, duplicate prevention, email validation, and automatic session restoration. |
| `/tracks` | **Chakravyuh Track Selection** | Signature 7-concentric-ring circular formation that smoothly rotates to align selected track gates to the entrance, plus Spline 3D scene toggle. |
| `/problems` | **Problem Statement Selection** | 10 track-specific problem challenges with accordion dossiers, single-choice selection, and a strict two-step confirmation modal with database-level immutable lock. |
| `/submit` | **The Inner Chamber** | Final submission portal with GitHub repository regex validation, PowerPoint drag-and-drop (.ppt, .pptx) uploader with progress tracking, storage upload, and celebratory sealed golden receipt. |

---

## 🎨 THE FIVE BATTLE TRACKS

All track names, descriptions, and problem statements are fully editable in [`src/config/hackathonConfig.ts`](./src/config/hackathonConfig.ts) or directly in the Supabase `tracks` and `problem_statements` tables.

1. **AGNI** — Ember Red (`#E05A47`), Molten Orange & Copper. Focus: Cybersecurity, Cryptographic Defense, Zero-Day Detection.
2. **VAJRA** — Electric Blue (`#3B82F6`), Steel & Silver. Focus: AI/ML, Autonomous Tactical Swarms, Computer Vision, Edge Intelligence.
3. **VAYU** — Cyan (`#06B6D4`), Pale Blue & Flowing Light. Focus: Decentralized Ledgers, P2P Mesh Networks, Drone Corridors, CRDTs.
4. **VANAM** — Forest Green (`#10B981`), Jade & Earthy Bronze. Focus: AgriTech, Solar Microgrids, Climate Analytics, Bio-Inspired Systems.
5. **SURYA** — Antique Gold (`#D8B46A`), Amber & Warm Ivory. Focus: FinTech Fraud Graphs, Vernacular GovTech, Assistive Interfaces.

---

## 🚀 LOCAL SETUP & QUICKSTART

### 1. Prerequisites
- Node.js 18+ (tested with Node 20 / Node 24)
- npm or pnpm

### 2. Install Dependencies
```bash
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗄️ SUPABASE CONFIGURATION (PRODUCTION)

Without Supabase credentials the app runs in a local **Sandbox Mode** (data stays in the browser; demo admin `admin@chakravyuh.local` / `admin2026`). With credentials, registrations are stored in Supabase.

### 1. Run the database schema
Open your Supabase Dashboard -> **SQL Editor**, paste and run
[`supabase/migrations/20250101000000_chakravyuh_schema.sql`](./supabase/migrations/20250101000000_chakravyuh_schema.sql)
(it is safe to run more than once). It creates:
- `teams` and `team_members`: a team is the leader plus **1 to 3 members, so 2 to 4 people**. The limit is enforced inside the database, not just in the UI.
- `team_selections` and `submissions`: one problem lock and one submission per team.
- `problem_catalog`: the 50 problem ids, used to validate locks. If you add or rename problems in `hackathonConfig.ts`, update its rows.
- `admins`: the people allowed to use the admin console.
- Functions: `register_team`, `lock_team_selection`, `submit_solution` (participants) and `admin_stats`, `admin_list_teams`, `admin_update_team`, `admin_delete_team`, `admin_reset_selection`, `admin_reset_submission` (admins only, each checks `is_admin()`).

**Who can change what:** participants can only *read* their own team; they register, lock and submit through the functions above and have no update or delete rights at all. After registration, only an admin can edit a team (name, leader, members), reset its problem lock or submission, or delete it.

### 2. Create your admin
1. Dashboard -> **Authentication -> Users -> Add user** (email + password).
2. In the SQL Editor run (with that email):
```sql
INSERT INTO public.admins (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@example.com'
ON CONFLICT (user_id) DO NOTHING;
```
3. Sign in at `/admin` (the page is not linked anywhere in the public site).

### 3. Authentication settings (recommended)
Dashboard -> **Authentication -> Providers -> Email**:
- Turn **Confirm email** OFF so participants are registered the moment they submit the form. If it stays ON, registration still works: participants confirm their email, sign in once, and the squad is created at that first sign-in. Note Supabase's built-in email sender is limited to a few emails per hour, so use a custom SMTP provider if you keep confirmation on.
- Consider enabling CAPTCHA protection (Authentication -> Attack Protection) to stop bots mass-registering.

### 4. Configure environment variables
Copy `.env.example` to `.env` (never commit it) and fill in your project values:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```
Use the **publishable** (or legacy anon) key only, never the secret/service_role key. Set the same two variables in your hosting provider (e.g. Vercel -> Project Settings -> Environment Variables) and redeploy.

---

## 📊 GOOGLE SHEETS SYNCHRONIZATION SETUP

The Google Sheets integration runs securely on the server via Supabase Edge Functions, keeping service account private keys strictly hidden from frontend code.

### 1. Create a Google Service Account
1. Open the [Google Cloud Console](https://console.cloud.google.com).
2. Create a service account and download the JSON key.
3. Enable the **Google Sheets API**.
4. Create a Google Spreadsheet and create a sheet tab named `Submissions`.
5. Share the spreadsheet with the Service Account email with **Editor** permissions.

### 2. Set Supabase Edge Function Secrets
Using the Supabase CLI or Dashboard:
```bash
supabase secrets set GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@project.iam.gserviceaccount.com"
supabase secrets set GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
supabase secrets set GOOGLE_SPREADSHEET_ID="your_spreadsheet_id_here"
```

### 3. Deploy the Edge Function
```bash
supabase functions deploy sync-sheets
```

When a team submits their PowerPoint presentation:
1. The presentation is saved to Supabase Storage `hackathon-ppts`.
2. The metadata is recorded in PostgreSQL.
3. The Edge Function appends the submission row to Google Sheets with automatic duplicate protection!

---

## ⚙️ EDITING TRACKS & OFFICIAL PROBLEM STATEMENTS

Organizers can customize college names, hackathon titles, deadlines, tracks, and official problem statements in one central location:
[`src/config/hackathonConfig.ts`](./src/config/hackathonConfig.ts)

```typescript
export const HACKATHON_CONFIG = {
  hackathonName: "CHAKRAVYUH",
  collegeName: "Aryabhatta Institute of Technology & Engineering",
  maxPptSizeBytes: 25 * 1024 * 1024, // 25 MB
  tracks: [ ... ],
  problemStatements: [ ... ],
};
```
