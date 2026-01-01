from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, jobs
from app.config.settings import settings
from app.config.logging_config import logger

app = FastAPI(
    title="Recrux API",
    description="AI-Powered Recruitment Platform",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(jobs.router, prefix="/api/jobs", tags=["Jobs"])

@app.on_event("startup")
async def startup_event():
    logger.info("🚀 Recrux API starting up...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("👋 Recrux API shutting down...")

@app.get("/")
def root():
    return {
        "message": "Recrux API is running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
