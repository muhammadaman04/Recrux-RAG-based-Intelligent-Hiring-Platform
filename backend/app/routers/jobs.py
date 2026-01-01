"""
Job management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.config.database import get_db
from app.schemas.jobs import (
    JobCreate, 
    JobResponse, 
    ExtractRequirementsRequest,
    ExtractRequirementsResponse
)
from app.services.ai_service import ai_service
from app.config.logging_config import logger
from app.utils.jwt import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user info from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(401, "Invalid token")
    return payload

@router.post("/extract-requirements", response_model=ExtractRequirementsResponse)
async def extract_requirements(
    data: ExtractRequirementsRequest,
    current_user: dict = Depends(get_current_user)
):
    """Extract job requirements using AI"""
    logger.info(f"User {current_user['email']} extracting requirements")
    
    try:
        requirements = await ai_service.extract_job_requirements(data.description)
        return requirements
    except Exception as e:
        logger.error(f"Requirement extraction failed: {str(e)}")
        raise HTTPException(500, "Failed to extract requirements")

@router.post("", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
def create_job(
    data: JobCreate,
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Create new job posting"""
    tenant_id = current_user["tenant_id"]
    
    logger.info(f"Creating job '{data.title}' for tenant {tenant_id}")
    
    # Insert job
    result = db.table("job_postings").insert({
        "tenant_id": tenant_id,
        "title": data.title,
        "description": data.description,
        "requirements": data.requirements,
        "must_have_skills": data.must_have_skills,
        "nice_to_have_skills": data.nice_to_have_skills,
        "min_experience": data.min_experience,
        "status": "active"
    }).execute()
    
    if not result.data:
        logger.error("Failed to create job")
        raise HTTPException(500, "Failed to create job")
    
    job = result.data[0]
    logger.info(f"Job created with ID {job['id']}")
    
    return job

@router.get("", response_model=List[JobResponse])
def list_jobs(
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """List all jobs for current tenant"""
    tenant_id = current_user["tenant_id"]
    
    logger.info(f"Fetching jobs for tenant {tenant_id}")
    
    result = db.table("job_postings")\
        .select("*")\
        .eq("tenant_id", tenant_id)\
        .order("created_at", desc=True)\
        .execute()
    
    return result.data

@router.get("/{job_id}", response_model=JobResponse)
def get_job(
    job_id: int,
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get job details"""
    tenant_id = current_user["tenant_id"]
    
    result = db.table("job_postings")\
        .select("*")\
        .eq("id", job_id)\
        .eq("tenant_id", tenant_id)\
        .execute()
    
    if not result.data:
        raise HTTPException(404, "Job not found")
    
    return result.data[0]
