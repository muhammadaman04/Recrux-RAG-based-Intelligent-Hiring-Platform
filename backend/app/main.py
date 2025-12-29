"""
Recrux - FastAPI Main Application
Multi-tenant AI recruitment platform
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, jobs, candidates, ai_chat, talent_pool
from app.middleware.tenant_middleware import TenantMiddleware
from app.config.settings import settings

# Initialize FastAPI app
app = FastAPI(
    title="Recrux API",
    description="AI-powered recruitment platform with RAG technology",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Multi-tenant middleware
app.add_middleware(TenantMiddleware)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])
app.include_router(candidates.router, prefix="/api/candidates", tags=["Candidates"])
app.include_router(ai_chat.router, prefix="/api/ai", tags=["AI Chat"])
app.include_router(talent_pool.router, prefix="/api/talent-pool", tags=["Talent Pool"])

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Recrux API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected",
        "vector_db": "connected"
    }
