"""
Dashboard statistics endpoint
"""
from fastapi import APIRouter, Depends
from supabase import Client
from app.config.database import get_db
from app.config.logging_config import logger
from app.utils.jwt import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user info from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(401, "Invalid token")
    return payload

@router.get("/stats")
def get_dashboard_stats(
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get dashboard statistics for current tenant"""
    tenant_id = current_user["tenant_id"]
    
    logger.info(f"Fetching dashboard stats for tenant {tenant_id}")
    
    # Count active jobs
    jobs_result = db.table("job_postings")\
        .select("id", count="exact")\
        .eq("tenant_id", tenant_id)\
        .eq("status", "active")\
        .execute()
    
    active_jobs = jobs_result.count if jobs_result.count else 0
    
    # Count total candidates
    candidates_result = db.table("candidates")\
        .select("id", count="exact")\
        .eq("tenant_id", tenant_id)\
        .execute()
    
    total_candidates = candidates_result.count if candidates_result.count else 0
    
    # Count shortlisted candidates
    shortlisted_result = db.table("candidates")\
        .select("id", count="exact")\
        .eq("tenant_id", tenant_id)\
        .eq("status", "shortlisted")\
        .execute()
    
    shortlisted = shortlisted_result.count if shortlisted_result.count else 0
    
    return {
        "active_jobs": active_jobs,
        "total_candidates": total_candidates,
        "shortlisted": shortlisted
    }
