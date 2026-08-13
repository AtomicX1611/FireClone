# 🎙️ Fireflies Clone — Meeting Notes & Transcription Platform

A full-stack clone of [Fireflies.ai](https://fireflies.ai) — an AI-powered meeting intelligence platform. Built as a Scalar fullstack engineering assignment.

![Screenshot](./docs/screenshot.png)

---

## 🏗️ Architecture Overview

```
Scalar_Assignment/
├── frontend/          # Next.js 14 (App Router, TypeScript)
└── backend/           # Python FastAPI + SQLite
```

### Tech Stack

| Layer      | Technology                                      |
|------------|-------------------------------------------------|
| Frontend   | Next.js 14 (App Router), TypeScript             |
| Styling    | Vanilla CSS (custom design system), CSS variables |
| Backend    | Python FastAPI                                   |
| ORM        | SQLAlchemy 2.0                                  |
| Database   | SQLite (file-based, zero-config)                |
| Validation | Pydantic v2                                     |
| Fonts      | DM Sans (headings) + Inter (body/transcript)    |

---

## 🗄️ Database Schema

```sql
-- Core meeting record
meetings
  id              INTEGER PK
  title           TEXT NOT NULL
  date            DATETIME NOT NULL
  duration_seconds INTEGER DEFAULT 0
  created_at      DATETIME
  updated_at      DATETIME

-- Meeting attendees with avatar colors
participants
  id              INTEGER PK
  meeting_id      INTEGER FK → meetings.id (CASCADE)
  name            TEXT NOT NULL
  email           TEXT
  color           TEXT            -- Hex color for avatar

-- Individual speaker utterances (ordered by sequence)
transcript_segments
  id              INTEGER PK
  meeting_id      INTEGER FK → meetings.id (CASCADE)
  speaker_name    TEXT NOT NULL
  speaker_color   TEXT
  start_time      FLOAT           -- Seconds from start
  end_time        FLOAT
  text            TEXT NOT NULL
  sequence        INTEGER         -- Ordering index

-- AI-generated meeting summary (one-to-one with meeting)
meeting_summaries
  id              INTEGER PK
  meeting_id      INTEGER FK → meetings.id (CASCADE, UNIQUE)
  overview        TEXT            -- 2-3 sentence summary
  key_topics      JSON            -- ["Topic A", "Topic B", ...]
  chapters        JSON            -- [{"title","start_time","summary"}]
  created_at      DATETIME

-- Tasks extracted from meeting (one-to-many)
action_items
  id              INTEGER PK
  meeting_id      INTEGER FK → meetings.id (CASCADE)
  text            TEXT NOT NULL
  assignee        TEXT
  due_date        DATE
  completed       BOOLEAN DEFAULT FALSE
  created_at      DATETIME
```

**Relationships:**
- `Meeting` → `Participants` (1:N)
- `Meeting` → `TranscriptSegments` (1:N, ordered)
- `Meeting` → `MeetingSummary` (1:1)
- `Meeting` → `ActionItems` (1:N)

---

## 🌐 API Overview

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings` | List with search, filter, sort, paginate |
| `POST` | `/api/meetings` | Create meeting + participants |
| `GET` | `/api/meetings/{id}` | Full meeting detail |
| `PATCH` | `/api/meetings/{id}` | Update metadata + participants |
| `DELETE` | `/api/meetings/{id}` | Delete (cascades all related data) |

### Transcripts
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings/{id}/transcript` | Get all segments (ordered) |
| `POST` | `/api/meetings/{id}/transcript/upload` | Upload .txt/.vtt/.json file |
| `GET` | `/api/meetings/{id}/transcript/search?q=` | Search within transcript |

### Summaries
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings/{id}/summary` | Get summary |
| `POST` | `/api/meetings/{id}/summary` | Create/replace summary |
| `POST` | `/api/meetings/{id}/summary/generate` | Auto-generate from transcript |

### Action Items
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/meetings/{id}/action-items` | List action items |
| `POST` | `/api/meetings/{id}/action-items` | Create action item |
| `PATCH` | `/api/action-items/{id}` | Update (text, assignee, due_date, completed) |
| `DELETE` | `/api/action-items/{id}` | Delete action item |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and **npm**
- **Python** 3.10+
- **pip** or **pip3**

---

### Backend Setup

```bash
# 1. Navigate to the backend directory
cd backend

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Create the environment file
copy .env.example .env        # Windows
cp .env.example .env          # macOS/Linux

# 5. Seed the database with sample meetings
python -m app.seed

# 6. Start the backend server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at **http://localhost:8000**
Interactive API docs at **http://localhost:8000/docs**

---

### Frontend Setup

```bash
# 1. Navigate to the frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Create the environment file
copy .env.local.example .env.local     # Windows
cp .env.local.example .env.local       # macOS/Linux

# 4. Start the development server
npm run dev
```

The app will be available at **http://localhost:3000**

---

## ✨ Features

### ✅ Core Features (Implemented)

#### Meetings Library / Dashboard
- Meeting grid with cards showing title, date, duration, participants
- Search meetings by title (debounced)
- Filter by participant name
- Sort by date, title, or duration (ascending/descending)
- Grid/list view toggle
- Stats cards (total, this week, with summaries)
- Pagination (9 per page)
- Create / Edit / Delete meetings (full CRUD)

#### Meeting Detail View
- Tabbed notepad: **Summary** | **Transcript** | **Action Items**
- Interactive transcript with speaker labels and timestamps
- Clicking timestamps seeks the audio player
- Audio player syncs to active transcript segment (highlighted)
- Search within transcript with highlighted matches
- Upload transcript files (.txt, .vtt, .json)

#### AI Summary & Notes
- AI-generated overview paragraph
- Key topic chips
- Clickable chapter timeline (seeks to timestamp in player)
- Generate/regenerate summary button
- Mock generation from transcript text (or OpenAI if key is set)

#### Meeting Management (CRUD)
- Create meetings with dynamic participant list + color pickers
- Edit meeting title, date, duration, participants
- Delete meetings (with confirmation modal)
- Add / edit / complete / delete action items
- Action item progress bar
- Assignee and due date tracking

#### Audio Player
- Simulated playback with progress tracking
- Waveform visualization (animated)
- Seek bar with click-to-seek
- Playback speed control (0.5x – 2x)
- Skip ±10 seconds
- Bidirectional sync with transcript

### 🔜 Placeholder Features

The following sections show "Coming Soon":
- Real-time bot joining live calls
- Actual speech-to-text transcription
- Zoom, Google Meet, Teams integration
- Google Calendar sync
- CRM integrations (Salesforce, HubSpot)
- Team collaboration & sharing
- Real user authentication (default mock user)
- Analytics dashboard

---

## 🎨 Design System

The frontend uses a custom CSS design system (no Tailwind) with:
- **Colors:** `#6C47FF` primary purple, `#0F0D1A` dark sidebar
- **Typography:** DM Sans (headings), Inter (body/transcript)
- **Components:** Cards, buttons, inputs, modals, toasts, avatars, badges, tabs, player
- **Animations:** Subtle slide/fade transitions, waveform pulse

---

## 📦 Deployment Notes

### Backend (Render / Railway)
1. Set `DATABASE_URL` environment variable (PostgreSQL for production)
2. Change `requirements.txt` to add `psycopg2-binary` for PostgreSQL
3. Update `connect_args` in `database.py` (remove SQLite-specific arg)
4. Set `CORS_ORIGINS` to your frontend production URL
5. Run seed: `python -m app.seed`

### Frontend (Vercel / Netlify)
1. Set `NEXT_PUBLIC_API_URL` to your backend production URL
2. Deploy from the `frontend/` directory
3. Build command: `npm run build`

---

## 🧰 Project Assumptions

1. **Authentication:** A default logged-in user (Alex Johnson) is assumed. No real auth is implemented.
2. **Audio:** The audio player simulates playback with a timer. No real audio files are served per meeting.
3. **AI Summaries:** Seeded with pre-written summaries. The "Generate" button uses a rule-based mock unless `OPENAI_API_KEY` is set.
4. **Transcript Upload:** Supports `.vtt` (WebVTT with `<v Speaker>` tags), `.json` (array of `{speaker, start, end, text}`), and `.txt` (paragraphs with `Speaker Name: text` format).
5. **SQLite:** Used for simplicity. For production deployment, switch to PostgreSQL by updating `DATABASE_URL`.

---

## 🔬 Seed Data

The database is seeded with **6 complete meetings**:

| # | Title | Participants | Duration |
|---|-------|-------------|---------|
| 1 | Q3 Engineering Sprint Planning | 4 | 54 min |
| 2 | Product Review — New Onboarding Flow | 4 | 45 min |
| 3 | TechCorp Enterprise Demo & Discovery Call | 4 | 60 min |
| 4 | August All-Hands — Company Update | 5 | 75 min |
| 5 | Mobile App Design Review — v1 Mockups | 3 | 40 min |
| 6 | Engineering Weekly Standup — Week 32 | 4 | 20 min |

Each meeting includes: full transcript (10–15 segments), AI summary with chapters, key topics, and 3–5 action items.

---

## 📁 Project Structure

```
Scalar_Assignment/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py            # FastAPI app entry point
│   │   ├── config.py          # Settings (env vars)
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── schemas.py         # Pydantic request/response models
│   │   ├── seed.py            # Database seeder
│   │   ├── models/
│   │   │   ├── meeting.py
│   │   │   ├── participant.py
│   │   │   ├── transcript_segment.py
│   │   │   ├── meeting_summary.py
│   │   │   └── action_item.py
│   │   ├── routers/
│   │   │   ├── meetings.py
│   │   │   ├── transcripts.py
│   │   │   ├── summaries.py
│   │   │   └── action_items.py
│   │   └── services/
│   │       ├── meeting_service.py
│   │       ├── transcript_service.py
│   │       ├── summary_service.py
│   │       └── action_item_service.py
│   ├── .env.example
│   └── requirements.txt
│
└── frontend/
    └── src/
        ├── app/
        │   ├── layout.tsx
        │   ├── page.tsx               # Dashboard
        │   ├── meetings/[id]/page.tsx # Meeting detail
        │   ├── search/page.tsx
        │   ├── analytics/page.tsx
        │   ├── team/page.tsx
        │   ├── integrations/page.tsx
        │   └── settings/page.tsx
        ├── components/
        │   ├── layout/ (Sidebar, Topbar)
        │   ├── meetings/ (MeetingCard, CreateModal, EditModal)
        │   ├── transcript/ (TranscriptView, AudioPlayer, UploadModal)
        │   ├── summary/ (SummaryPanel, ActionItems)
        │   └── ui/ (Avatar, Modal, ToastContainer)
        ├── hooks/ (useDebounce, useToast)
        └── lib/ (api.ts, types.ts, utils.ts)
```
