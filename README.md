# SAMARTHYA AI — Adaptive Learning and Placement Readiness Platform

> **Tagline:** Every College Is Different. Every Student Deserves a Personalized Path.  
> **Global Goals:** Supporting **UN SDG 4** (Quality Education) and **UN SDG 8** (Decent Work and Economic Growth).

---

## 🚀 Live Demo & Deployment

| Resource | Link |
|---|---|
| **🌐 Live Web Application** | **[https://samarthya-placemet.nithishkps.workers.dev/](https://samarthya-placemet.nithishkps.workers.dev/)** |
| **💻 GitHub Repository** | **[https://github.com/NITHISHKUMAR006/samarthya-ai-placement-platform](https://github.com/NITHISHKUMAR006/samarthya-ai-placement-platform)** |
| **⚡ Status** | Active • Cloudflare Workers + Supabase Backend |

## 1. Project Overview

**SAMARTHYA AI** is an enterprise-grade, secure, multi-tenant web application engineered for universities, colleges, students, faculty, and placement officers. The platform bridges institutional curriculum training with corporate recruitment criteria through standardized diagnostic assessments, deterministic skill-gap intelligence, AI document ingestion (PDF, PPT, PPTX), and personalized placement readiness tracking.

### Core Capabilities

- **Multi-Tenant Institutional Isolation:** Isolated college workspaces enforced by Supabase Row Level Security (RLS).
- **Four Purpose-Built Role Dashboards:**
  1. **Student:** Profile, diagnostics, live timed assessments, skill gaps, AI practice quizzes, mock interviews, readiness status.
  2. **Placement Officer / Admin:** Cohort analytics, corporate hiring drives, eligibility filters, CSV exports.
  3. **Faculty / Trainer:** Curate quizzes, upload lecture notes and slides (PDF/PPT/PPTX), monitor class competencies.
  4. **Platform Super Admin:** Provision college workspaces, monitor health metrics, configure subscription limits.
- **AI Document Extraction & Quiz Generation:** Ingests PDF, PPT, and PPTX lecture decks, splits content into semantically coherent chunks, computes vector embeddings, and synthesizes multiple-choice questions with full explanations.
- **Deterministic Skill-Gap Intelligence:** Transparently compares verified student competencies against recruiting company benchmarks (Google Cloud, Microsoft India, Deloitte USI, Infosys Ltd) with zero hallucinated placement guarantees.
- **Configurable OpenAI-Compatible LLM:** Seamlessly connects with OpenAI, OpenRouter, Groq, Ollama, or LM Studio without modifying application logic.
- **Dark & Light Mode:** Accessible contrast, persistent theme toggle, custom typography, and responsive layouts across mobile, tablet, and desktop.

---

## 2. Mandatory Port Configuration

The application strictly adheres to the following port specifications across Docker Compose, Vite, FastAPI, and client API configurations:

| Component | Port | Local Access URL |
|---|:---:|---|
| **Frontend Application** | `8010` | `http://localhost:8010` |
| **FastAPI Backend Server** | `5190` | `http://localhost:5190` |
| **API Documentation (Swagger UI)** | `5190` | `http://localhost:5190/docs` |
| **Backend Health Check** | `5190` | `http://localhost:5190/health` |
| **API Base URL (v1)** | `5190` | `http://localhost:5190/api/v1` |

---

## 3. Technology Stack

### Frontend
- **Framework:** React 18+ with TypeScript
- **Bundler & Dev Server:** Vite 5 (configured strictly on port `8010`)
- **Styling & Design System:** Tailwind CSS with Dark/Light mode tokens
- **Routing:** React Router v6
- **Server State & Caching:** TanStack Query (React Query v5)
- **Data Visualization:** Recharts (Bar charts, Pie distributions)
- **Icons:** Lucide React
- **HTTP Client:** Centralized typed API client (`frontend/src/services/api.ts`)

### Backend
- **Framework:** Python 3.12+ with FastAPI 0.115+
- **Configuration:** Pydantic v2 Settings reading root `config.env`
- **Security:** Supabase JWT validation, role-based dependencies, tenant scoping
- **Document Ingestion:** `pypdf` (PDF extraction) & `python-pptx` (PowerPoint slide text extraction)
- **Database & State:** Supabase Python client & transactional in-memory / SQL repository
- **Unit & Integration Testing:** Pytest and Pytest-Asyncio

### Managed Cloud Backend (Supabase)
- **PostgreSQL Database:** Multi-tenant schema with `uuid-ossp` and `vector` (pgvector) extensions
- **Row Level Security (RLS):** Policies enforcing tenant isolation between colleges
- **Authentication:** Supabase Auth session tokens and JWT claims
- **Storage:** Private buckets for `learning-materials`, `profile-avatars`, and `student-documents`

---

## 4. Centralized Configuration (`config.env`)

Backend services, AI integrations, database parameters, and security policies are centrally managed via `config.env` in the repository root. A template is provided in `config.env.example`.

### Environment Variables Reference

```dotenv
# ==================================================
# SAMARTHYA AI APPLICATION
# ==================================================
APP_NAME=SAMARTHYA_AI
APP_ENV=development
APP_HOST=0.0.0.0
APP_PORT=5190
LOG_LEVEL=INFO

# ==================================================
# FRONTEND AND BACKEND URLS
# ==================================================
FRONTEND_URL=http://localhost:8010
API_BASE_URL=http://localhost:5190
API_PREFIX=/api/v1
CORS_ALLOWED_ORIGINS=http://localhost:8010

# ==================================================
# SUPABASE MANAGED BACKEND
# ==================================================
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SECRET_KEY=eyJhbGciOiJIUzI1Ni...
DATABASE_URL=

# ==================================================
# SUPABASE STORAGE BUCKETS
# ==================================================
SUPABASE_LEARNING_BUCKET=learning-materials
SUPABASE_PROFILE_BUCKET=profile-avatars
SUPABASE_STUDENT_DOCUMENTS_BUCKET=student-documents
MAX_UPLOAD_SIZE_MB=20

# ==================================================
# OPENAI / LLM CONFIGURATION
# (Supports OpenAI, OpenRouter, Groq, Ollama, LM Studio)
# ==================================================
OPENAI_BASE_URL=""
OPENAI_API_KEY=""
OPENAI_MODEL_ID=""
OPENAI_TIMEOUT_SECONDS=60
OPENAI_MAX_RETRIES=2

# ==================================================
# AI FEATURE FLAGS
# ==================================================
AI_ENABLED=false
ENABLE_AI_QUIZZES=true
ENABLE_RAG=true
ENABLE_VECTOR_SEARCH=true

# ==================================================
# EMBEDDING CONFIGURATION
# ==================================================
EMBEDDING_BASE_URL=""
EMBEDDING_API_KEY=""
EMBEDDING_MODEL_ID=""
EMBEDDING_DIMENSIONS=

# ==================================================
# ASSESSMENTS & SECURITY
# ==================================================
DEFAULT_ASSESSMENT_DURATION_MINUTES=30
MAX_ASSESSMENT_ATTEMPTS=3
JWT_AUDIENCE=authenticated
RATE_LIMIT_ENABLED=true
DOCUMENT_PROCESSING_WORKERS=2
```

---

## 5. Pre-Configured Demo Accounts & Instant Role Switcher

For seamless evaluation, SAMARTHYA AI includes pre-seeded demo personas representing all four core roles. You can switch between them with **one click** directly in the top navigation bar or log in manually:

| Persona Name | Role | Email | Password | Primary Capabilities |
|---|---|---|---|---|
| **Aarav Sharma** | Student | `student.aarav@apex.edu` | `Student@123` | Take diagnostic tests, review skill gaps for Google SDE I, practice AI quizzes |
| **Prof. Sunita Rao** | Placement Officer | `placement@apex.edu` | `Placement@123` | View cohort analytics, configure company criteria, export placement reports |
| **Dr. Rajesh Khanna** | Faculty Trainer | `faculty.cs@apex.edu` | `Faculty@123` | Upload lecture notes/slides (PDF/PPTX), create diagnostic assessments |
| **Dr. Alok Verma** | Super Admin | `superadmin@samarthya.ai` | `Admin@123` | Multi-college provisioning, platform operational health, subscriptions |

---

## 6. Local Development Setup

### Prerequisites
- **Python:** 3.12 or 3.13
- **Node.js:** v18+ or v20+ (Node v24 supported)
- **Git**

### Step 1: Clone & Configure
```bash
git clone <repository_url> samarthya-ai
cd samarthya-ai

# Copy configuration template if config.env is not present
cp config.env.example config.env
```

### Step 2: Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### Step 3: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

### Step 4: Verify Database Schemas & Initial Data
```bash
python scripts/setup_db.py
```

### Step 5: Start Development Servers

**Option A: Automated PowerShell Launcher**
```powershell
.\scripts\run_dev.ps1
```

**Option B: Manual Terminal Execution**

*Terminal 1 (Backend - Port 5190):*
```bash
cd backend
python -m uvicorn app.main:app --host 0.0.0.0 --port 5190 --reload
```

*Terminal 2 (Frontend - Port 8010):*
```bash
cd frontend
npm run dev -- --host 0.0.0.0 --port 8010
```

Open `http://localhost:8010` in your web browser.

---

## 7. Supabase Database & Migrations

The database schema is fully defined in standard PostgreSQL and resides in `supabase/migrations/`:

- Schema Migration: `supabase/migrations/20261028000000_initial_schema.sql`
- Development Seed Dataset: `supabase/seed.sql`
- Supabase Project Configuration: `supabase/config.toml`

### Applying Migrations to Remote Supabase
1. Install Supabase CLI (`npm install -g supabase`).
2. Link your remote Supabase project:
   ```bash
   supabase link --project-ref your-project-id
   ```
3. Push schema migrations:
   ```bash
   supabase db push
   ```
4. Load seed dataset:
   ```bash
   supabase db reset
   ```
   *(Or execute `supabase/migrations/20261028000000_initial_schema.sql` and `supabase/seed.sql` directly inside the Supabase SQL Editor).*

### Supabase Storage Buckets
Create the following private storage buckets in the Supabase Dashboard:
- `learning-materials` (Allowed MIME: `application/pdf`, `application/vnd.ms-powerpoint`, `application/vnd.openxmlformats-officedocument.presentationml.presentation`)
- `profile-avatars` (Allowed MIME: `image/png`, `image/jpeg`, `image/svg+xml`)
- `student-documents` (Allowed MIME: `application/pdf`)

---

## 8. OpenAI-Compatible LLM Integration

SAMARTHYA AI's AI service layer (`backend/app/ai/llm_service.py`) supports any OpenAI-compatible API endpoint by simply setting three variables in `config.env`:

### 1. Official OpenAI
```dotenv
OPENAI_BASE_URL=""
OPENAI_API_KEY="sk-..."
OPENAI_MODEL_ID="gpt-4o-mini"
AI_ENABLED=true
```

### 2. Groq (High-Speed Inference)
```dotenv
OPENAI_BASE_URL="https://api.groq.com/openai/v1"
OPENAI_API_KEY="gsk_..."
OPENAI_MODEL_ID="llama-3.1-70b-versatile"
AI_ENABLED=true
```

### 3. OpenRouter
```dotenv
OPENAI_BASE_URL="https://openrouter.ai/api/v1"
OPENAI_API_KEY="sk-or-v1-..."
OPENAI_MODEL_ID="meta-llama/llama-3.1-8b-instruct"
AI_ENABLED=true
```

### 4. Local Ollama (Zero Cost, Offline)
```dotenv
OPENAI_BASE_URL="http://localhost:11434/v1"
OPENAI_API_KEY="ollama"
OPENAI_MODEL_ID="llama3"
AI_ENABLED=true
```

### 5. Local LM Studio
```dotenv
OPENAI_BASE_URL="http://localhost:1234/v1"
OPENAI_API_KEY="lm-studio"
OPENAI_MODEL_ID="local-model"
AI_ENABLED=true
```

> **Deterministic Fallback Guarantee:** When `AI_ENABLED=false` or no API key is supplied, the platform remains 100% operational, delivering deterministic, vetted assessment questions, question explanations, and interview prep items.

---

## 9. Automated Testing & Verification

The test suite covers authentication, role permissions, assessment submission, deterministic scoring, skill-gap analysis, tenant isolation, and health checks.

```bash
# Run backend pytest suite
python -m pytest backend/tests -v
```

### Test Suite Coverage
- `test_auth.py`: Health endpoints, demo credentials, Supabase JWT decoding, profile endpoint.
- `test_assessments.py`: Assessment cataloging, answer key redaction during active tests, attempt submission, deterministic percentage calculation, attempt audit history.
- `test_skill_gap.py`: Candidate matching against corporate criteria, gap identification, readiness status evaluation.
- `test_institutions.py`: Multi-tenant boundary checks, preventing cross-tenant access violations (HTTP 403).
- `test_ai_service.py`: Provider health status, question schema validation, mock interview prompts.

---

## 10. Docker Deployment

A production-ready Docker Compose configuration is provided in `docker-compose.yml`:

```bash
# Build and run with centralized config.env
docker compose --env-file config.env up --build -d

# Inspect running containers
docker compose ps

# View service logs
docker compose logs -f backend
docker compose logs -f frontend
```

### Container Topology
- **Backend Container:** Runs Python 3.12 slim, listens internally and externally on `5190`.
- **Frontend Container:** Builds React bundle and serves production static assets via Nginx on container port `80`, published to host port `8010`.
- **Health Checks:** Compose ensures frontend starts only after the backend passes its `/health` probe.

---

## 11. Project Directory Layout

```text
samarthya-ai/
├── frontend/
│   ├── src/
│   │   ├── components/common/   # Navbar, Sidebar, MetricCard, Badges
│   │   ├── context/             # AuthContext, ThemeContext
│   │   ├── pages/
│   │   │   ├── public/          # LandingPage, LoginPage, Features, HowItWorks
│   │   │   ├── student/         # Dashboard, AssessmentRunner, SkillGap, Quizzes, MockInterview, Library, Profile
│   │   │   ├── admin/           # Dashboard, Students, Companies, Assessments, Materials
│   │   │   └── superadmin/      # SuperAdminDashboard
│   │   ├── services/api.ts      # Centralized typed HTTP client
│   │   ├── types/index.ts       # Domain TypeScript models
│   │   ├── App.tsx              # Router & Layout Shell
│   │   └── main.tsx
│   ├── Dockerfile
│   ├── nginx.conf
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts           # Server port: 8010
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app on port 5190
│   │   ├── core/                # config.py, security.py, permissions.py, logging.py
│   │   ├── api/v1/endpoints/    # auth, assessments, skill_gap, readiness, companies, students, learning, ai, analytics, subscriptions, health
│   │   ├── ai/                  # llm_service.py, embedding_service.py, quiz_generator.py
│   │   ├── tasks/               # document_processor.py (PDF, PPT, PPTX text extraction)
│   │   ├── db/                  # store.py (authoritative data repository)
│   │   └── schemas/             # Pydantic v2 schemas
│   ├── tests/                   # Pytest automated test suite
│   ├── Dockerfile               # Port 5190
│   └── requirements.txt
├── supabase/
│   ├── migrations/              # PostgreSQL schema with RLS & pgvector
│   ├── seed.sql                 # Complete development dataset
│   └── config.toml
├── scripts/
│   ├── run_dev.ps1              # Launch dev servers
│   ├── test_all.ps1             # Run test suite
│   └── setup_db.py              # Database verification utility
├── config.env                   # Active root configuration
├── config.env.example           # Configuration template
├── docker-compose.yml           # Production Docker Compose
├── .gitignore
└── README.md
```

---

## 12. Security & Compliance

- **Zero Client Credential Leakage:** Sensitive keys (`SUPABASE_SECRET_KEY`, `OPENAI_API_KEY`) remain strictly server-side.
- **Answer Key Protection:** The assessment runner sanitizes answer keys and explanations from API payloads until an attempt is officially submitted and evaluated.
- **Tenant Isolation:** Cross-tenant access is validated on all institution-scoped queries; attempts to request another college's resources return an HTTP 403 Forbidden error.
- **Audit Logging:** Every student attempt, score calculation, and readiness snapshot is recorded with timestamps for institutional reporting compliance.

---

**SAMARTHYA AI** — *Every College Is Different. Every Student Deserves a Personalized Path.*

