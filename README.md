<div align="center">

  <img src="./public/chakravyuh-luxury-wheel.svg" alt="Chakravyuh Supreme Emblem" width="180" height="180" />

  # ⚔️ CHAKRAVYUH 2026 ⚔️
  ### THE ANCIENT LABYRINTH OF INNOVATION // VIT-AP EDITION

  <p align="center">
    <em>"Every great solution begins with the courage to enter."</em><br />
    An ancient strategic military formation engineered into a cutting-edge 48-hour competitive cyber-arena.<br />
    Hosted at <strong>VIT-AP University</strong> &middot; Powered by <strong>Unstop</strong> &middot; Supported by <strong>IIEC, Notion, Qualium AI, & Pocket Lab</strong>
  </p>

  <p align="center">
    <a href="https://react.dev"><img src="https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 18" /></a>
    <a href="https://www.typescriptlang.org"><img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
    <a href="https://vitejs.dev"><img src="https://img.shields.io/badge/Vite-5.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://threejs.org"><img src="https://img.shields.io/badge/Three.js-3D_WebGL-000000?style=for-the-badge&logo=three.js&logoColor=white" alt="Three.js" /></a>
    <a href="https://supabase.com"><img src="https://img.shields.io/badge/Supabase-PostgreSQL_RLS-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" /></a>
    <a href="https://framer.com/motion"><img src="https://img.shields.io/badge/Framer_Motion-11.5-FF0055?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" /></a>
    <a href="https://developers.google.com/sheets/api"><img src="https://img.shields.io/badge/Google_Sheets-Edge_Sync-34A853?style=for-the-badge&logo=google-sheets&logoColor=white" alt="Google Sheets Sync" /></a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/STATUS-PRODUCTION_READY-00C853?style=flat-square&logo=render&logoColor=white" alt="Production Ready" />
    <img src="https://img.shields.io/badge/WORTH_PRIZE_POOL-%E2%82%B97%2C00%2C000_INR-FFD700?style=flat-square&logo=cashapp&logoColor=black" alt="Worth Prize Pool INR 7 Lakhs" />
    <img src="https://img.shields.io/badge/SECURITY-STRICT_DB_RLS-E05A47?style=flat-square&logo=auth0&logoColor=white" alt="Security RLS" />
    <img src="https://img.shields.io/badge/BATTLE_GATES-5_TRACKS-8B5CF6?style=flat-square" alt="5 Battle Gates" />
    <img src="https://img.shields.io/badge/CHALLENGES-50_DOSSIERS-0284C7?style=flat-square" alt="50 Problem Statements" />
    <img src="https://img.shields.io/badge/SQUAD_LIMIT-2_TO_4_WARRIORS-10B981?style=flat-square" alt="2 to 4 per Squad" />
  </p>

---

  ### 🌐 [**Live Site**](https://chakravyuh-sigma.vercel.app) &bull; ⚡ [Explore Arena](#-battle-gates--domains) &bull; [System Architecture](#-system-architecture) &bull; [Participant Journey](#-participant-lifecycle--state-machine) &bull; [Database & RLS](#-security-model--database-schema) &bull; [Quickstart](#-developer-quickstart) &bull; [Edge Functions](#-google-sheets-synchronization-edge-function) &bull; [Admin Console](#-administrative-command-deck)

---

</div>

<br />

## 🌟 Executive Summary

**CHAKRAVYUH** is an enterprise-grade hackathon management and competition portal engineered for high-concurrency national collegiate events. Built for **VIT-AP University**, it reinterprets the ancient, impenetrable multi-tier military labyrinth from Indian epic lore into a high-octane digital arena.

Unlike standard forms or static hackathon listing sites, Chakravyuh is an **interactive visual experience** combining:
1. **CAD-Style 3D Gate Models**: Five procedural Three.js models, one per battle gate (server rack and hash-linked blocks, communications satellite, dilution refrigerator, payment devices, spinning wind turbines), with crisp edge lines and drafting-style labelled callouts.
2. **5 Specialized Battle Gates with Custom Cultural Atmospheres**: Dynamic GPU-accelerated backdrop particle systems (Agni, Vayu, Vajra, Surya, Vanam).
3. **50 Granular Problem Statements**: Categorized dossiers with evaluation criteria, suggested technology stacks, and direct dataset links.
4. **Ironclad Database-Level Atomic Locks**: Zero-trust PostgreSQL Row Level Security (RLS) and stored procedures guaranteeing **strictly one immutable problem lock** per team.
5. **Inner Chamber Submission Pipeline**: Real-time GitHub repository and live-site URL validation (in the browser and again in the database), then automated synchronization to Google Sheets via a serverless Deno Edge Function with RS256 JWT auth.
6. **Zero-Mock Production Integrity**: There is no demo or sandbox mode. Every squad and every admin signs in with a real Supabase account, and without its Supabase connection the site shows a "not connected" screen instead of storing anything.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               CHAKRAVYUH METRIC MATRIX                                 │
├────────────────────┬────────────────────┬────────────────────┬─────────────────────────┤
│    TOTAL PRIZE     │   DURATION & MODE  │   SQUAD CAPACITY   │      SYSTEM STATUS      │
│     ₹7,00,000      │   48 Hours (Onsite)│   2 to 4 Members   │  100% Production Ready  │
│  Cash + Incubator  │   VIT-AP Amaravati │   Strict DB Trigger│  Zero Mock Mode Allowed │
└────────────────────┴────────────────────┴────────────────────┴─────────────────────────┘
```

---

## 🏛️ System Architecture

Chakravyuh separates participant interactions, state mutations, and administrative telemetry into isolated layers:

```mermaid
flowchart TD
    subgraph CLIENT["⚡ FRONTEND CLIENT (React 18 + Vite + Tailwind)"]
        UI_HOME["Landing Page<br/>(Cinematic Editorial + Hero 3D)"]
        UI_WHEEL["3D Gate Models<br/>(CAD-style Three.js scenes)"]
        UI_DOSSIER["50 Problem Dossiers<br/>(Filtered by Track Gate)"]
        UI_SUBMIT["Inner Chamber<br/>(GitHub + Live URL Validation)"]
        UI_ADMIN["Admin Command Deck<br/>(Metrics, Team Editor, Manual Resets)"]
    end

    subgraph AUTH["🔐 IDENTITY & ACCESS (Supabase Auth)"]
        AUTH_PASS["Email + Passcode Authentication"]
        AUTH_RECOVERY["Emailed Password Reset & Session Recovery"]
    end

    subgraph DB["🛡️ DATA TIER (PostgreSQL 15 with Row Level Security)"]
        TBL_TEAMS[("teams & team_members<br/>[Trigger: 2-4 Members]")]
        TBL_LOCKS[("team_selections<br/>[UNIQUE Constraint]")]
        TBL_SUBS[("submissions<br/>[GitHub + Live URL]")]
        TBL_ADMINS[("admins<br/>[is_admin() Security Definer]")]
        
        RPC_LOCK["RPC: lock_team_selection()<br/>• Atomic Row Lock<br/>• Catalog Validation<br/>• Immutable Write"]
        RPC_SUBMIT["RPC: submit_solution()<br/>• Submission Verification<br/>• Idempotent Receipt"]
    end

    subgraph SERVERLESS["⚙️ EDGE COMPUTING (Supabase Deno Edge Function)"]
        EDGE_SYNC["sync-sheets Function<br/>• RS256 JWT Token Gen<br/>• Duplicate Row Prevention<br/>• Async Google Sheets Dispatch"]
    end

    subgraph EXTERNAL["🌐 EXTERNAL ECOSYSTEM"]
        GSHEETS["Google Sheets API v4<br/>(Real-Time Submissions Ledger)"]
        UNSTOP["Unstop Platform Integration"]
    end

    %% Client Interactions
    UI_HOME --> AUTH_PASS
    AUTH_PASS --> TBL_TEAMS
    UI_WHEEL --> UI_DOSSIER
    UI_DOSSIER --> RPC_LOCK
    RPC_LOCK --> TBL_LOCKS
    UI_SUBMIT --> RPC_SUBMIT
    RPC_SUBMIT --> TBL_SUBS
    RPC_SUBMIT -.->|Async Webhook / Fetch| EDGE_SYNC
    EDGE_SYNC --> GSHEETS
    UI_ADMIN --> TBL_ADMINS
```

---

## 🌀 Battle Gates & Domains

The labyrinth is structured into **5 elemental battle gates**. Each gate commands a distinct aesthetic, background atmosphere, soundscape identity, and ten specialized challenges:

```mermaid
graph LR
    C((("CHAKRAVYUH<br/>INNER CORE")))
    
    G1["🔥 GATE 1: AGNI<br/>Cybersecurity & Blockchain<br/>#E05A47"]
    G2["💨 GATE 2: VAYU<br/>Space Technology<br/>#38BDF8"]
    G3["⚡ GATE 3: VAJRA<br/>Quantum Computing<br/>#8B5CF6"]
    G4["☀️ GATE 4: SURYA<br/>FinTech & Financial Systems<br/>#F59E0B"]
    G5["🌿 GATE 5: VANAM<br/>Energy & Sustainability<br/>#10B981"]

    G1 ==> C
    G2 ==> C
    G3 ==> C
    G4 ==> C
    G5 ==> C
```

| Gate | Elemental Theme | Domain Focus | Primary Colors | Flagship Problem Preview |
|:---:|:---:|:---|:---:|:---|
| **01** | **AGNI** *(Fire)* | **Cybersecurity & Blockchain**<br/>Zero-Trust Bastions & Decentralized Ledgers | `Ember Red`<br/>`#E05A47` | **BridgeWatch**: Cross-chain bridge exploit early warning with sub-30s anomaly detection and automated circuit breakers. |
| **02** | **VAYU** *(Wind)* | **Space Technology**<br/>Orbital Telemetry, Satellites & Aerospace | `Electric Sky`<br/>`#38BDF8` | **OrbitNet**: Decentralized satellite constellation mesh routing with resilient high-latency CRDT synchronization. |
| **03** | **VAJRA** *(Lightning)* | **Quantum Computing**<br/>Superposition, Coherence & Hybrid Algorithms | `Quantum Violet`<br/>`#8B5CF6` | **Q-Shield**: Hybrid post-quantum cryptographic key encapsulation and NISQ-friendly error mitigation algorithms. |
| **04** | **SURYA** *(Sun)* | **FinTech Systems**<br/>Smart Ledgers, Fraud Graphs & Vernacular Rails | `Solar Amber`<br/>`#F59E0B` | **GraphSentinel**: Graph neural network real-time AML and mule account cluster detection across high-velocity UPI streams. |
| **05** | **VANAM** *(Earth/Flora)* | **Energy & Sustainability**<br/>Clean Energy Grids, Microgrids & Climate AI | `Emerald Green`<br/>`#10B981` | **GridSense**: Decentralized solar microgrid peer-to-peer energy dispatch with predictive battery wear scheduling. |

---

## 🔄 Participant Lifecycle & State Machine

Each squad navigates an unyielding progressive path through the Chakravyuh. State mutations are guarded by PostgreSQL transactional logic:

```mermaid
stateDiagram-v2
    [*] --> Unauthenticated: Visitor Lands on Portal

    state Unauthenticated {
        ExplorePublic: Browse Editorial, 3D Gate Models, Tracks & Prizes
        AuthModal: Sign In or Register Squad
    }

    Unauthenticated --> Registered: register_team() RPC
    note right of Registered
      Database trigger enforces:
      Leader + 1 to 3 members (2..4 total)
    end note

    state Registered {
        BrowseGates: Explore the 3D Gate Models
        ViewDossiers: Inspect 10 Track Challenges
        ConfirmModal: 2-Step Confirmation Modal
    }

    Registered --> ProblemLocked: lock_team_selection() RPC
    note right of ProblemLocked
      Strict Database Lock:
      Selection is immutable.
      Only Admin can reset.
    end note

    state ProblemLocked {
        ChamberAccess: Unlock Inner Chamber Route (/submit)
        DraftSolution: Build Prototype during 48hr Sprint
        ValidateRepo: GitHub Repository Regex Check
        SubmitLinks: GitHub repository + live deployed URL
    }

    ProblemLocked --> Submitted: submit_solution() RPC
    
    state Submitted {
        SealedReceipt: Golden Cryptographic Receipt Displayed
        ConfettiCelebration: Visual Victory Sequence
        EdgeSync: Background Sync to Google Sheets
    }

    Submitted --> [*]: Awaiting Jury Evaluation
```

---

## 🗄️ Security Model & Database Schema

Chakravyuh utilizes a **Zero-Client Mutation** architecture. Participants possess `SELECT` access scoped exclusively to their own team; all modifications occur via `SECURITY DEFINER` stored procedures.

### Entity Relationship Diagram

```mermaid
erDiagram
    auth_users ||--|| teams : "owns (1:1)"
    teams ||--|{ team_members : "contains (1 to 3)"
    teams ||--o| team_selections : "locks (0..1)"
    teams ||--o| submissions : "submits (0..1)"
    problem_catalog ||--o{ team_selections : "selected_in"
    auth_users ||--o| admins : "elevated_to"

    teams {
        uuid id PK
        uuid owner_user_id FK "REFERENCES auth.users"
        string team_name "UNIQUE, 3-60 chars"
        string leader_name
        string leader_reg_no
        string leader_email "Unique per team"
        timestamp created_at
        timestamp updated_at
    }

    team_members {
        uuid id PK
        uuid team_id FK "ON DELETE CASCADE"
        string name "1-80 chars"
        string contact "Email / Phone"
        string role "Member / Specialist"
        int position "1, 2, or 3"
        timestamp created_at
    }

    team_selections {
        uuid id PK
        uuid team_id FK "UNIQUE - ONE LOCK PER SQUAD"
        string track_id
        string problem_statement_id "Validated against problem_catalog"
        timestamp locked_at
    }

    submissions {
        uuid id PK
        uuid team_id FK "UNIQUE - ONE SUBMISSION PER SQUAD"
        string github_repo_url "Checked with Regex"
        string deployed_url "Live site (http or https)"
        string spreadsheet_sync_status
        timestamp submitted_at
    }

    problem_catalog {
        string problem_id PK "prob-cb-01 to prob-es-10"
        string track_id
    }

    admins {
        uuid user_id PK "REFERENCES auth.users"
        string email
        timestamp created_at
    }
```

### PostgreSQL Access Control Matrix

Only the squad leader has an account; other members are rostered by name. Nobody, including admins, writes to the tables directly: every change goes through a checked function.

| Table / Resource | Anonymous | Squad Leader (Owner) | Platform Admin | Enforced By |
|---|:---:|:---:|:---:|---|
| **`teams`** | Denied | `SELECT` (own team); registers once via `register_team()` | `SELECT` all; edit or delete via `admin_update_team()` / `admin_delete_team()` | RLS + `owner_user_id = auth.uid()` |
| **`team_members`** | Denied | `SELECT` (own team) | `SELECT` all; edited together with the team | RLS + `enforce_team_size()` deferred trigger |
| **`problem_catalog`** | `SELECT` | `SELECT` | `SELECT` | Public catalog policy |
| **`team_selections`** | Denied | `SELECT` (own lock); locks once via `lock_team_selection()` | `SELECT` all; `admin_reset_selection()` | UNIQUE constraint + atomic RPC |
| **`submissions`** | Denied | `SELECT` (own submission); submits once via `submit_solution()` | `SELECT` all; `admin_reset_submission()` | UNIQUE constraint + atomic RPC |
| **`admins`** | Denied | Denied | Denied (checked via `is_admin()` only) | RLS with no policies |

> [!IMPORTANT]
> **Database-Enforced Squad Size**: Unlike naive forms that validate in JavaScript, Chakravyuh enforces the **2 to 4 member rule** directly within PostgreSQL using a deferred constraint trigger (`enforce_team_size`). Any transaction violating this boundary is immediately rolled back by the database engine.

---

## 🎨 Interactive UI & 3D Engineering Showcase

### 1. CAD-Style 3D Gate Models
- **Five procedural Three.js models** (`buildCyberGate`, `buildSpaceGate`, `buildQuantumGate`, `buildFintechGate`, `buildEnergyGate` in `src/components/gateModels.ts`): a 42U server rack with a padlock and hash-linked blocks, a communications satellite with a parabolic dish and sun-tracking solar arrays, a dilution refrigerator with its stage temperatures, a payment phone with EMV cards and a market chart, and wind turbines with airfoil blades and a solar and battery site.
- **Drafting look**: crisp feature-edge outlines on every solid, a ground grid, and boxed callout labels (shown on the single-model view, hidden in the small formation view).
- **Alive**: turbine rotors and the anemometer spin, and the satellite arrays rotate slowly. Lit by a simulated HDRI `RoomEnvironment`, and responsive to orbit controls and touch gestures.
- **Accessibility**: respects `prefers-reduced-motion` in the page animations.

### 2. Strict Two-Step Confirmation Modal
Accidental clicks are lethal in hackathons. Selecting a problem triggers a high-visibility modal requiring:
1. Review of the selected track, problem title, and difficulty badge.
2. Explicit checkbox acknowledgment that **once locked, the selection cannot be undone or switched**.
3. Cryptographic commit via the atomic database RPC.

### 3. Golden Sealed Submission Receipt
Upon solution submission:
- Generates a gilded receipt ticket featuring the squad roster, bound challenge, timestamp, and the GitHub repository and live-site links.
- Automatically triggers a canvas-confetti particle cascade.

---

## 📊 Google Sheets Synchronization (Edge Function)

Submissions trigger an asynchronous dispatch to a **Supabase Deno Edge Function** (`supabase/functions/sync-sheets`).

```mermaid
sequenceDiagram
    autonumber
    actor Team as Squad Leader
    participant App as Chakravyuh Portal
    participant DB as PostgreSQL DB
    participant Edge as Deno Edge Function
    participant Google as Google Sheets API v4

    Team->>App: Enters GitHub URL & live site URL
    App->>DB: CALL submit_solution(github_url, deployed_url)
    DB-->>App: Success receipt generated
    App->>Edge: Trigger sync-sheets(submissionId, teamId)
    Edge->>Edge: Generate RS256 JWT using Google Service Account
    Edge->>Google: OAuth2 Token Exchange
    Google-->>Edge: Bearer Access Token
    Edge->>Google: Read existing rows (Duplicate check)
    Edge->>Google: Append row [Timestamp, Team, Leader, Members, Track, Problem, Live URL, GitHub]
    Google-->>Edge: 200 OK (Row appended)
    Edge-->>App: Sync status confirmed
```

---

## 🛠️ Developer Quickstart

### Prerequisites
- **Node.js**: `v18.0.0` or higher (tested on Node 20 & Node 24)
- **Package Manager**: `npm`, `pnpm`, or `yarn`
- **Supabase Project**: Free or Pro tier project on [supabase.com](https://supabase.com)
- **Google Cloud Platform (Optional)**: For real-time Google Sheets streaming

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/Ramcharanvinay/Chakravyuh-hackathon.git
cd Chakravyuh-hackathon

# Install exact dependencies
npm install
```

### 2. Environment Variables Configuration

Copy `.env.example` to create your local `.env`:

```bash
cp .env.example .env
```

Fill in your configuration credentials:

```env
# ------------------------------------------------------------------------------
# SUPABASE CONFIGURATION (MANDATORY)
# ------------------------------------------------------------------------------
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-or-publishable-key

```

Use the **publishable** (or legacy anon) key only. Never put the secret / service_role key in this file. Without these two variables the site shows a "Registration service not connected" screen.

### 3. Initialize Database Schema

1. Open your **Supabase Dashboard** &rarr; **SQL Editor**.
2. Open [`supabase/migrations/20250101000000_chakravyuh_schema.sql`](./supabase/migrations/20250101000000_chakravyuh_schema.sql).
3. Copy and run the entire file. It is **100% idempotent** and safe to re-run.

### 4. Create an Admin User

1. In Supabase Dashboard, go to **Authentication** &rarr; **Users** &rarr; **Add User**.
2. Enter your admin email and password (e.g. `admin@vitap.ac.in`).
3. In the SQL Editor, promote this user to admin status:

```sql
INSERT INTO public.admins (user_id, email)
SELECT id, email FROM auth.users WHERE email = 'admin@vitap.ac.in'
ON CONFLICT (user_id) DO NOTHING;
```

### 5. Configure Authentication (Supabase Dashboard)

- **Authentication &rarr; URL Configuration**: set **Site URL** to your live address (`https://chakravyuh-sigma.vercel.app`) and add `/login` and `/reset-password` on that address, plus the same two on `http://localhost:5173`, to **Redirect URLs**. Password reset and confirmation emails depend on this.
- **Authentication &rarr; Providers &rarr; Email**: turn **Confirm email** off so squads exist the moment they register. If you keep it on, registration still works (the squad is created at the first sign-in after confirming), but Supabase's built-in email sender allows only a few emails per hour, so use a custom SMTP provider for a real event.
- Participants sign in with **email + passcode (6+ characters)**; "Forgot passcode?" emails a reset link to `/reset-password`.

### 6. Deploy (Vercel)

Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` under **Project Settings &rarr; Environment Variables** (Production) and **redeploy**. The values are baked in at build time, so saving them alone changes nothing.

### 7. Launch Development Server

```bash
npm run dev
```

The portal will launch at `http://localhost:5173`.

---

## ⚡ Administrative Command Deck

The administrative console is located at `/admin` (deliberately unlinked from public navigation).

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║ CHAKRAVYUH ADMIN CONSOLE                              [REFRESH] [EXPORT CSV] [SIGN OUT]║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║ TEAMS REGISTERED │ PEOPLE REGISTERED │ PROBLEMS LOCKED │ SUBMISSIONS │ TEAM SIZE 2-4  ║
║ TEAM SIZE BARS   │ TEAMS PER TRACK   │ REGISTRATIONS, LAST 14 DAYS                    ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║ [ SEARCH ] [ ALL | REGISTERED | LOCKED | SUBMITTED ] [ ANY SIZE v ]                  ║
║                                                                                      ║
║ TEAM            │ LEADER         │ SIZE │ TRACK · PROBLEM    │ STATUS     │ REGISTERED ║
║ ────────────────┼────────────────┼──────┼────────────────────┼────────────┼─────────── ║
║ Squad name      │ Name · reg no  │  3   │ Track · CB-01 ...  │ SUBMITTED  │ [ EDIT ]   ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Admin Capabilities:
- **Real-Time Telemetry**: Aggregated counts of registered squads, locked problems, submissions, and track distribution.
- **Roster Management**: The only way a squad can change after registering. Edit the squad name, leader details and members (always kept at 2 to 4 people), or delete a squad.
- **Lock & Submission Resets**: Clear an accidental problem lock or let a squad submit again.
- **Search, Filter & CSV Export**: Find squads by name, leader, email or member, filter by status or size, and export the filtered roster (with GitHub and live-site links) as CSV. Works on phones too, and the list is paged for large events.

---

## 📁 Repository Structure

```
chakravyuh-portal/
├── public/                               # Static high-res assets & brand vectors
│   ├── chakravyuh-luxury-wheel.svg       # Signature gold & crimson Chakravyuh emblem
│   ├── vit-ap-logo.png                   # Host institution official insignia
│   ├── unstop-logo-transparent.png       # Powered-by platform sponsor logo
│   └── acs.jpeg                          # Association of Computer Science club badge
├── src/
│   ├── assets/                           # Bundled vector graphics
│   ├── components/                       # Reusable UI modules
│   │   ├── admin/                        # TeamEditorModal & admin management panels
│   │   ├── cultural-backgrounds/         # Agni, Vayu, Vajra, Surya, Vanam GPU backdrops
│   │   ├── landing/                      # Hero, Tracks, Rules, Prizes, Sponsors, Venue
│   │   ├── navigation/                   # Tactical PillNav floating navigation bar
│   │   ├── ChakravyuhWheel3D.tsx         # Three.js scene: formation + single-model views
│   │   ├── gateModels.ts                 # The five CAD-style gate models and their callouts
│   │   ├── ChakravyuhWheel.tsx           # Legacy 2D rings wheel (not used by any page)
│   │   ├── SplineChakravyuh.tsx          # Legacy Spline wrapper (not used by any page)
│   │   ├── ConfirmationModal.tsx         # Strict 2-step immutable lock dialog
│   │   ├── SubmissionReceipt.tsx         # Sealed golden certificate with confetti blast
│   │   └── ProgressSteps.tsx             # Breadcrumb arena state indicator
│   ├── config/
│   │   └── hackathonConfig.ts            # Central manifest: Tracks, 50 Problems, Rules
│   ├── context/
│   │   └── AuthContext.tsx               # Supabase session provider & team resolution
│   ├── lib/
│   │   ├── dataService.ts                # PostgreSQL RPC wrapper & data mappings
│   │   ├── supabase.ts                   # Supabase client singleton & configuration check
│   │   └── teamRules.ts                  # Pure functional roster validation (2-4 squad)
│   ├── pages/                            # Top-level view routes
│   │   ├── LandingPage.tsx               # Grand entrance & public event information
│   │   ├── LoginPage.tsx                 # Squad registration, sign-in & forgot-passcode
│   │   ├── TrackSelectionPage.tsx        # Track selection with the 3D gate models
│   │   ├── ThemeDetailPage.tsx           # Deep dive into individual gate specifications
│   │   ├── ProblemSelectionPage.tsx      # 50 problem dossiers & atomic lock trigger
│   │   ├── SubmissionPage.tsx            # Inner Chamber: GitHub + live URL submission
│   │   ├── AdminPage.tsx                 # Unlinked organizer command center
│   │   └── ResetPasswordPage.tsx         # Auth recovery endpoint
│   ├── types/
│   │   └── index.ts                      # Strict TypeScript interfaces
│   ├── App.tsx                           # Main router & configuration fallback guard
│   └── main.tsx                          # React 18 DOM mount point
├── supabase/
│   ├── functions/
│   │   └── sync-sheets/                  # Deno Edge Function for Google Sheets integration
│   │       └── index.ts                  # RS256 JWT auth + Sheets API v4 append
│   └── migrations/
│       └── 20250101000000_chakravyuh_schema.sql # Complete PostgreSQL DDL & RLS rules
├── tailwind.config.js                    # Custom theme colors, fonts & animations
├── vite.config.ts                        # Vite build optimizations
└── package.json                          # Dependencies & build scripts
```

---

## 🏆 Organizing Bodies & Ecosystem Partners

<div align="center">

| Institution / Partner | Role | Focus |
|:---:|:---:|:---|
| **VIT-AP University** | **Host Institution** | School of Computer Science & Engineering (SCOPE). |
| **Unstop** | **Platform Partner** | National registration reach & participant verification. |
| **Association of Computer Science (ACS)** | **Co-Hosting Club** | Technical systems operation, infrastructure & arena management. |
| **IQuest Developer Society** | **Community Partner** | Developer engagement, peer mentorship & participant logistics. |
| **Qualium AI** | **AI Partner** | Category leading intelligence tracks & model evaluation. |
| **Notion** | **Productivity Partner** | Squad collaboration spaces & project templates. |
| **Pocket Lab** | **Hardware Partner** | Embedded IoT kits, sensors & development boards. |
| **IIEC** | **Incubation Partner** | Direct incubation pipeline for top championship prototypes. |

</div>

---

<div align="center">

  <sub>Crafted with architectural precision for the warriors of code.</sub><br />
  <strong>CHAKRAVYUH HACKATHON &copy; 2026 &middot; ALL RIGHTS RESERVED</strong>

</div>
