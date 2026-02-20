# 🖼️ Image Analyzer — AI-Powered Image Tagging

Full-stack web application that analyzes images and returns descriptive tags using [Imagga](https://imagga.com) AI.

## Tech Stack

| Layer | Technology | Architecture |
|-------|------------|-------------|
| **Backend** | Python Flask | Hexagonal (Ports & Adapters) |
| **Frontend** | React + Vite | Clean Architecture |
| **AI Service** | Imagga API | External driven adapter |
| **Package Manager** | uv (Python), npm (Node.js) | — |

## Architecture

### Backend — Hexagonal Architecture
```
Flask HTTP Adapter → [Driving Port] → Domain Core → [Driven Port] → Imagga Adapter
```

### Frontend — Clean Architecture
```
Presentation (Components) → Application (Hooks) → Domain (Models) → Infrastructure (API)
```

## Quick Start

### Prerequisites
- Python 3.12+
- Node.js 18+
- [uv](https://docs.astral.sh/uv/) (Python package manager)
- [Imagga account](https://imagga.com) (free tier)

### 1. Clone & Setup

```bash
git clone <repo-url>
cd kushki
```

### 2. Backend

```bash
cd server

# Copy env and add your Imagga credentials
cp .env.example .env

# Install dependencies and run
uv sync
uv run python run.py
```

Server starts at `http://localhost:5000`

### 3. Frontend

```bash
cd client
npm install
npm run dev
```

App opens at `http://localhost:5173` (auto-proxies API calls to Flask)

### 4. Run Tests

```bash
# Backend
cd server && uv run python -m pytest tests/ -v

# Frontend
cd client && npx vitest run
```

## API Endpoint

### `POST /api/analyze`

Upload an image for tag analysis.

**Request:** `multipart/form-data` with `image` field (JPEG or PNG, max 5MB)

**Response (200):**
```json
{
  "tags": [
    { "label": "Dog", "confidence": 98.5 },
    { "label": "Golden Retriever", "confidence": 95.2 }
  ]
}
```

**Errors:**
| Code | Meaning |
|------|---------|
| 400 | Invalid file type or missing image |
| 413 | File too large (>5MB) |
| 502 | External AI service failure |
| 500 | Internal server error |

## Project Structure

```
kushki/
├── client/                    # React + Vite (Clean Architecture)
│   ├── src/
│   │   ├── presentation/      # Components (UI only)
│   │   ├── application/       # Hooks / Use Cases
│   │   ├── domain/            # Models (pure)
│   │   ├── infrastructure/    # API calls
│   │   └── styles/
│   └── tests/
├── server/                    # Python Flask (Hexagonal)
│   ├── app/
│   │   ├── domain/            # Models + Ports (pure)
│   │   ├── application/       # Use Cases
│   │   ├── adapters/          # HTTP + Imagga
│   │   └── middleware/        # Error handlers
│   └── tests/
└── docs/
    └── PRD.md
```

## License

MIT
