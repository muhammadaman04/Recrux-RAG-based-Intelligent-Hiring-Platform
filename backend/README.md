# Recrux Backend - FastAPI

AI-powered recruitment platform backend built with FastAPI, LangChain, and RAG technology.

## Setup

### 1. Create Virtual Environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

```bash
# Copy example env file
copy .env.example .env

# Edit .env with your credentials
```

### 4. Run Database Migrations

```bash
alembic upgrade head
```

### 5. Start Development Server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API will be available at: http://localhost:8000

API Documentation: http://localhost:8000/docs

## Project Structure

```
backend/
├── app/
│   ├── routers/          # API endpoints
│   ├── services/         # Business logic
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── utils/            # Helper functions
│   ├── config/           # Configuration
│   └── main.py           # FastAPI app
├── alembic/              # Database migrations
├── tests/                # Unit tests
├── requirements.txt      # Dependencies
└── .env                  # Environment variables
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new company
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Jobs
- `POST /api/jobs` - Create job posting
- `GET /api/jobs` - List job postings
- `GET /api/jobs/{id}` - Get job details
- `PUT /api/jobs/{id}` - Update job posting
- `DELETE /api/jobs/{id}` - Delete job posting

### Candidates
- `POST /api/jobs/{id}/candidates/upload` - Upload resumes
- `POST /api/jobs/{id}/rank-candidates` - Trigger AI ranking
- `GET /api/candidates/ranked` - Get ranked candidates
- `GET /api/candidates/{id}` - Get candidate details
- `PUT /api/candidates/{id}/status` - Update candidate status

### AI Chat
- `POST /api/ai/chat` - Chat about candidate
- `POST /api/ai/generate-questions` - Generate interview questions

### Talent Pool
- `POST /api/talent-pool/search` - Search past candidates

## Development

### Run Tests

```bash
pytest
```

### Code Formatting

```bash
black app/
isort app/
```

### Type Checking

```bash
mypy app/
```

## Deployment

See deployment documentation for production setup.
