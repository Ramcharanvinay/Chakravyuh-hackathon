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
    <img src="https://img.shields.io/badge/PRIZE_POOL-%E2%82%B97%2C00%2C000_INR-FFD700?style=flat-square&logo=cashapp&logoColor=black" alt="Prize Pool INR 7 Lakhs" />
    <img src="https://img.shields.io/badge/SECURITY-STRICT_DB_RLS-E05A47?style=flat-square&logo=auth0&logoColor=white" alt="Security RLS" />
    <img src="https://img.shields.io/badge/BATTLE_GATES-5_TRACKS-8B5CF6?style=flat-square" alt="5 Battle Gates" />
    <img src="https://img.shields.io/badge/CHALLENGES-50_DOSSIERS-0284C7?style=flat-square" alt="50 Problem Statements" />
    <img src="https://img.shields.io/badge/SQUAD_LIMIT-2_TO_4_WARRIORS-10B981?style=flat-square" alt="2 to 4 per Squad" />
  </p>

---

  ### ⚡ [Explore Arena](#-battle-gates--domains) &bull; [System Architecture](#-system-architecture) &bull; [Participant Journey](#-participant-lifecycle--state-machine) &bull; [Database & RLS](#-security-model--database-schema) &bull; [Quickstart](#-developer-quickstart) &bull; [Edge Functions](#-google-sheets-synchronization-edge-function) &bull; [Admin Console](#-administrative-command-deck)

---

</div>

<br />

## 🌟 Executive Summary

**CHAKRAVYUH** is an enterprise-grade hackathon management and competition portal engineered for high-concurrency national collegiate events. Built for **VIT-AP University**, it reinterprets the ancient, impenetrable multi-tier military labyrinth from Indian epic lore into a high-octane digital arena.

Unlike standard forms or static hackathon listing sites, Chakravyuh is an **interactive visual experience** combining:
1. **Concentric 7-Ring Shortest-Path Rotation Engine**: A mathematically calibrated 2D Canvas/SVG wheel and interactive 3D Three.js WebGL arena.
2. **5 Specialized Battle Gates with Custom Cultural Atmospheres**: Dynamic GPU-accelerated backdrop particle systems (Agni, Vayu, Vajra, Surya, Vanam).
3. **50 Granular Problem Statements**: Categorized dossiers with evaluation criteria, suggested technology stacks, and direct dataset links.
4. **Ironclad Database-Level Atomic Locks**: Zero-trust PostgreSQL Row Level Security (RLS) and stored procedures guaranteeing **strictly one immutable problem lock** per team.
5. **Inner Chamber Submission Pipeline**: Real-time GitHub regex validation, 25MB PowerPoint binary stream directly to Supabase Storage, and instantaneous automated synchronization to Google Sheets via serverless Deno Edge Functions with RS256 JWT auth.
6. **Zero-Mock Production Integrity**: Strict rejection of guest or mock data; every squad is authenticated and backed by real PostgreSQL records.

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

Chakravyuh separates participant interactions, state mutations, file storage, and administrative telemetry into isolated layers:

```mermaid
flowchart TD
    subgraph CLIENT["⚡ FRONTEND CLIENT (React 18 + Vite + Tailwind)"]
        UI_HOME["Landing Page<br/>(Cinematic Editorial + Hero 3D)"]
        UI_WHEEL["Concentric 7-Ring Wheel<br/>(Shortest-Path SVG / Three.js)"]
        UI_DOSSIER["50 Problem Dossiers<br/>(Filtered by Track Gate)"]
        UI_SUBMIT["Inner Chamber<br/>(25MB PPT Uploader + GitHub Regex)"]
        UI_ADMIN["Admin Command Deck<br/>(Metrics, Team Editor, Manual Resets)"]
    end

    subgraph AUTH["🔐 IDENTITY & ACCESS (Supabase Auth)"]
        AUTH_PASS["Email + Passcode Authentication"]
        AUTH_RECOVERY["PKCE Password Reset & Session Recovery"]
    end

    subgraph DB["🛡️ DATA TIER (PostgreSQL 15 with Row Level Security)"]
        TBL_TEAMS[("teams & team_members<br/>[Trigger: 2-4 Members]")]
        TBL_LOCKS[("team_selections<br/>[UNIQUE Constraint]")]
        TBL_SUBS[("submissions<br/>[GitHub + Storage Path]")]
        TBL_ADMINS[("admins<br/>[is_admin() Security Definer]")]
        
        RPC_LOCK["RPC: lock_team_selection()<br/>• Atomic Row Lock<br/>• Catalog Validation<br/>• Immutable Write"]
        RPC_SUBMIT["RPC: submit_solution()<br/>• Submission Verification<br/>• Idempotent Receipt"]
    end

    subgraph STORAGE["📦 OBJECT STORAGE"]
        BUCKET["Private Bucket: hackathon-ppts<br/>(25MB Max File Size Enforced)"]
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
    UI_SUBMIT --> BUCKET
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
        ExplorePublic: Browse Editorial, 3D Wheel, Tracks & Prizes
        AuthModal: Sign In or Register Squad
    }

    Unauthenticated --> Registered: register_team() RPC
    note right of Registered
      Database trigger enforces:
      Leader + 1 to 3 members (2..4 total)
    end note

    state Registered {
        BrowseGates: Rotate Concentric Wheel (2D / 3D)
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
        UploadDeck: Upload PPT/PPTX (<= 25MB) to Supabase Storage
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
        string problem_id FK "REFERENCES problem_catalog"
        timestamp selected_at
    }

    submissions {
        uuid id PK
        uuid team_id FK "UNIQUE - ONE SUBMISSION PER SQUAD"
        string github_url "Checked with Regex"
        string ppt_url "Supabase Storage Path"
        timestamp submitted_at
        timestamp updated_at
    }

    problem_catalog {
        string id PK "prob-cb-01 to prob-es-10"
        string track_id
        string problem_code
        string title
        string difficulty
    }

    admins {
        uuid user_id PK "REFERENCES auth.users"
        string email
        timestamp created_at
    }
```

### PostgreSQL Access Control Matrix

| Table / Resource | Anonymous | Squad Member | Squad Leader (Owner) | Platform Admin | Enforced By |
|---|:---:|:---:|:---:|:---:|---|
| **`teams`** | Denied | `SELECT` (Own Team) | `SELECT` (Own Team) | Full Access | RLS + `owner_user_id = auth.uid()` |
| **`team_members`** | Denied | `SELECT` (Own Team) | `SELECT` (Own Team) | Full Access | RLS + `enforce_team_size()` Deferred Trigger |
| **`problem_catalog`** | `SELECT` | `SELECT` | `SELECT` | Full Access | Public Catalog RLS |
| **`team_selections`** | Denied | `SELECT` (Own Lock) | Insert via `lock_team_selection()` | Admin Reset | Strict UNIQUE constraint + Atomic RPC |
| **`submissions`** | Denied | `SELECT` (Own Sub) | Insert via `submit_solution()` | Admin Reset | Storage Policy + Atomic RPC |
| **`hackathon-ppts`** | Denied | `SELECT` (Own File) | `INSERT` (File <= 25MB) | Full Access | Supabase Storage Bucket Security Rules |

> [!IMPORTANT]
> **Database-Enforced Squad Size**: Unlike naive forms that validate in JavaScript, Chakravyuh enforces the **2 to 4 member rule** directly within PostgreSQL using a deferred constraint trigger (`enforce_team_size`). Any transaction violating this boundary is immediately rolled back by the database engine.

---

## 🎨 Interactive UI & 3D Engineering Showcase

### 1. Dual-Engine Chakravyuh Wheel
- **Geometric 2D Wheel**: 7 concentric SVG labyrinth rings featuring shortest-path angular math. Clicking any gate smoothly spins the wheel clockwise or counter-clockwise across the shortest angular distance, aligning the selected gateway precisely to the 12 o'clock portal position.
- **Three.js WebGL Arena**: Procedural 3D models for each gate (`buildCyberGate`, `buildSpaceGate`, `buildQuantumGate`, `buildFintechGate`, `buildEnergyGate`), lit by simulated HDRI `RoomEnvironment`, responsive to orbit controls and mouse gestures.
- **Accessibility First**: Respects `prefers-reduced-motion` to smoothly disable rotations for sensitive users without degrading functionality.

### 2. Strict Two-Step Confirmation Modal
Accidental clicks are lethal in hackathons. Selecting a problem triggers a high-visibility modal requiring:
1. Review of the selected track, problem title, and difficulty badge.
2. Explicit checkbox acknowledgment that **once locked, the selection cannot be undone or switched**.
3. Cryptographic commit via the atomic database RPC.

### 3. Golden Sealed Submission Receipt
Upon solution submission:
- Generates a gilded receipt ticket featuring team metadata, timestamp, GitHub repository link, and storage receipt ID.
- Automatically triggers a canvas-confetti particle cascade.
- Displays download / print options for team record-keeping.

---

## 📊 Google Sheets Synchronization (Edge Function)

Submissions trigger an asynchronous dispatch to a **Supabase Deno Edge Function** (`supabase/functions/sync-sheets`).

```mermaid
sequenceDiagram
    autonumber
    actor Team as Squad Leader
    participant App as Chakravyuh Portal
    participant Store as Supabase Storage
    participant DB as PostgreSQL DB
    participant Edge as Deno Edge Function
    participant Google as Google Sheets API v4

    Team->>App: Drops 25MB PPTX & GitHub URL
    App->>Store: Uploads file to "hackathon-ppts"
    Store-->>App: Storage object path returned
    App->>DB: CALL submit_solution(team_id, github, ppt_url)
    DB-->>App: Success receipt generated
    App->>Edge: Trigger sync-sheets(submissionId, teamId)
    Edge->>Edge: Generate RS256 JWT using Google Service Account
    Edge->>Google: OAuth2 Token Exchange
    Google-->>Edge: Bearer Access Token
    Edge->>Google: Read existing rows (Duplicate check)
    Edge->>Google: Append row [Timestamp, Team, Leader, Members, Track, Problem, PPT, GitHub]
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
git clone https://github.com/your-username/chakravyuh-portal.git
cd chakravyuh-portal/Chakravyuh-hackathon

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

# ------------------------------------------------------------------------------
# SPLINE 3D SCENE (OPTIONAL)
# ------------------------------------------------------------------------------
VITE_SPLINE_SCENE_URL=https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode
```

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

### 5. Launch Development Server

```bash
npm run dev
```

The portal will launch at `http://localhost:5173`.

---

## ⚡ Administrative Command Deck

The administrative console is located at `/admin` (deliberately unlinked from public navigation).

```
╔══════════════════════════════════════════════════════════════════════════════════════╗
║ CHAKRAVYUH ADMIN CONSOLE                                          [STATUS: ONLINE]  ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║ TOTAL SQUADS: 142  │  LOCKED CHOICES: 128  │  SUBMISSIONS: 94  │  ARENA: ACTIVE      ║
╠══════════════════════════════════════════════════════════════════════════════════════╣
║ [ SEARCH TEAMS ] [ FILTER BY TRACK: ALL ▼ ] [ EXPORT CSV ] [ SYNC GOOGLE SHEETS ]  ║
║                                                                                      ║
║  ID   │ SQUAD NAME      │ TRACK    │ PROBLEM │ PPT   │ GITHUB │ ACTIONS              ║
║ ──────┼─────────────────┼──────────┼─────────┼───────┼────────┼────────────────────  ║
║ #0104 │ CyberSentinels  │ AGNI     │ CB-01   │ [PPT] │ [REPO] │ [Edit] [Reset Lock]  ║
║ #0105 │ OrbitalPioneers │ VAYU     │ ST-04   │ [PPT] │ [REPO] │ [Edit] [Reset Lock]  ║
║ #0106 │ QuantumCore     │ VAJRA    │ QC-07   │ [PPT] │ [REPO] │ [Edit] [Reset Lock]  ║
╚══════════════════════════════════════════════════════════════════════════════════════╝
```

### Admin Capabilities:
- **Real-Time Telemetry**: Aggregated counts of registered squads, locked problems, submissions, and track distribution.
- **Roster Management**: Edit squad names, update member emails, reassign positions, or remove invalid squads.
- **Lock & Submission Resets**: Clear accidental problem locks or allow a squad to re-submit presentation files.
- **CSV & Sheet Export**: One-click export of complete hackathon roster with direct download links for jury members.

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
│   │   ├── ChakravyuhWheel.tsx           # 2D concentric 7-ring shortest-path SVG engine
│   │   ├── ChakravyuhWheel3D.tsx         # Three.js WebGL procedural gate scene
│   │   ├── SplineChakravyuh.tsx          # Spline 3D viewport fallback wrapper
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
│   │   ├── LoginPage.tsx                 # Team registration & authentication portal
│   │   ├── TrackSelectionPage.tsx        # 7-ring concentric gateway navigation
│   │   ├── ThemeDetailPage.tsx           # Deep dive into individual gate specifications
│   │   ├── ProblemSelectionPage.tsx      # 50 problem dossiers & atomic lock trigger
│   │   ├── SubmissionPage.tsx            # Inner Chamber PPT upload & GitHub commit
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
