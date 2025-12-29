# Recrux Backend Directory Structure

## Complete Backend Organization

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                      # FastAPI application entry point
│   │
│   ├── config/                      # Configuration
│   │   ├── __init__.py
│   │   ├── settings.py              # Environment settings (Pydantic)
│   │   └── database.py              # Database connection
│   │
│   ├── models/                      # SQLAlchemy ORM Models
│   │   ├── __init__.py
│   │   ├── company.py               # Company (tenant) model
│   │   ├── user.py                  # User model
│   │   ├── job_posting.py           # Job posting model
│   │   ├── candidate.py             # Candidate model
│   │   └── interview_question.py    # Interview questions model
│   │
│   ├── routers/                     # API Endpoints
│   │   ├── __init__.py
│   │   ├── auth.py                  # Authentication endpoints
│   │   ├── jobs.py                  # Job posting CRUD
│   │   ├── candidates.py            # Candidate management
│   │   ├── ai_chat.py               # AI chat endpoints
│   │   └── talent_pool.py           # Talent pool search
│   │
│   ├── services/                    # Business Logic
│   │   ├── __init__.py
│   │   ├── auth_service.py          # Authentication logic
│   │   ├── resume_service.py        # Resume parsing & processing
│   │   ├── embedding_service.py     # HuggingFace embeddings
│   │   ├── pinecone_service.py      # Pinecone vector operations
│   │   ├── ranking_service.py       # RAG-powered ranking
│   │   ├── llm_service.py           # Groq LLM interactions
│   │   └── storage_service.py       # Supabase file storage
│   │
│   ├── middleware/                  # Custom Middleware
│   │   ├── __init__.py
│   │   ├── tenant_middleware.py     # Multi-tenant context
│   │   └── auth_middleware.py       # JWT validation
│   │
│   └── utils/                       # Helper Functions
│       ├── __init__.py
│       ├── jwt.py                   # JWT token utilities
│       ├── pdf_parser.py            # PDF text extraction
│       ├── validators.py            # Input validation
│       └── exceptions.py            # Custom exceptions
│
├── alembic/                         # Database Migrations
│   ├── versions/                    # Migration files
│   ├── env.py                       # Alembic config
│   └── alembic.ini                  # Alembic settings
│
├── tests/                           # Unit Tests
│   ├── __init__.py
│   ├── test_auth.py
│   ├── test_jobs.py
│   ├── test_candidates.py
│   └── test_services.py
│
├── .env                             # Environment variables (gitignored)
├── .env.example                     # Example environment file
├── .gitignore                       # Git ignore rules
├── requirements.txt                 # Python dependencies
└── README.md                        # Setup instructions
```

## File Purposes

### Core Application
- **`main.py`**: FastAPI app initialization, middleware setup, router registration
- **`config/settings.py`**: Pydantic settings for environment variables
- **`config/database.py`**: SQLAlchemy engine and session management

### Models (Database)
- **`models/company.py`**: Tenant/company table
- **`models/user.py`**: User accounts with roles
- **`models/job_posting.py`**: Job postings with requirements
- **`models/candidate.py`**: Candidates with parsed data and scores
- **`models/interview_question.py`**: AI-generated interview questions

### Routers (API Endpoints)
- **`routers/auth.py`**: `/api/auth/register`, `/api/auth/login`
- **`routers/jobs.py`**: `/api/jobs` CRUD operations
- **`routers/candidates.py`**: `/api/candidates` upload, ranking, status
- **`routers/ai_chat.py`**: `/api/ai/chat` for candidate Q&A
- **`routers/talent_pool.py`**: `/api/talent-pool/search`

### Services (Business Logic)
- **`services/resume_service.py`**: Parse resumes with LangChain
- **`services/embedding_service.py`**: Generate embeddings (HuggingFace)
- **`services/pinecone_service.py`**: Vector upsert/query operations
- **`services/ranking_service.py`**: RAG-powered candidate ranking
- **`services/llm_service.py`**: Groq LLM wrapper
- **`services/storage_service.py`**: Supabase file upload/download

### Middleware
- **`middleware/tenant_middleware.py`**: Extract tenant_id from JWT
- **`middleware/auth_middleware.py`**: Validate JWT tokens

### Utilities
- **`utils/jwt.py`**: Create/verify JWT tokens
- **`utils/pdf_parser.py`**: Extract text from PDF files
- **`utils/validators.py`**: Input validation helpers
- **`utils/exceptions.py`**: Custom exception classes

## Next Steps

1. **Set up virtual environment**:
   ```bash
   cd backend
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment**:
   ```bash
   copy .env.example .env
   # Edit .env with your credentials
   ```

4. **Run development server**:
   ```bash
   uvicorn app.main:app --reload
   ```

5. **Access API docs**: http://localhost:8000/docs

## Development Workflow

1. Create database models in `models/`
2. Create API endpoints in `routers/`
3. Implement business logic in `services/`
4. Add utilities in `utils/` as needed
5. Write tests in `tests/`
6. Run migrations with Alembic

---

**Backend structure is ready for development!** 🚀
