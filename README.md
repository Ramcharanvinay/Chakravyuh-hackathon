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

All track names, descriptions, and problem statements are fully editable in [`src/config/hackathonConfig.ts`](file:///c:/chakravuyh/src/config/hackathonConfig.ts) or directly in the Supabase `tracks` and `problem_statements` tables.

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

### 1. Run PostgreSQL Migrations
Open your Supabase Project Dashboard -> **SQL Editor**, and execute the migration file:
[`supabase/migrations/20250101000000_chakravyuh_schema.sql`](file:///c:/chakravuyh/supabase/migrations/20250101000000_chakravyuh_schema.sql)

This script automatically creates:
- `teams` table (with unique team names and owner constraints)
- `tracks` table (5 tracks)
- `problem_statements` table (50 rich problem statements)
- `team_selections` table (enforcing 1 selection per team)
- `submissions` table (enforcing 1 submission per team, GitHub regex, and max size constraints)
- `lock_team_selection(...)` atomic security definer PostgreSQL function
- Private `hackathon-ppts` storage bucket and RLS policies

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_SPLINE_SCENE_URL=https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode
```

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
[`src/config/hackathonConfig.ts`](file:///c:/chakravuyh/src/config/hackathonConfig.ts)

```typescript
export const HACKATHON_CONFIG = {
  hackathonName: "CHAKRAVYUH",
  collegeName: "Aryabhatta Institute of Technology & Engineering",
  maxPptSizeBytes: 25 * 1024 * 1024, // 25 MB
  tracks: [ ... ],
  problemStatements: [ ... ],
};
```
