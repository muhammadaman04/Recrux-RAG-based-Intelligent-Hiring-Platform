"""
Candidates management endpoints
"""
from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from typing import List
from supabase import Client
from app.config.database import get_db
from app.config.logging_config import logger
from app.utils.jwt import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.resume_parser import resume_parser
from app.services.scoring_service import scoring_service

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user info from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(401, "Invalid token")
    return payload

@router.post("/jobs/{job_id}/upload-resumes")
async def upload_resumes(
    job_id: str,
    resumes: List[UploadFile] = File(...),
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Upload and process multiple resumes for a job with AI parsing and scoring
    """
    tenant_id = current_user["tenant_id"]
    
    logger.info(f"Uploading {len(resumes)} resumes for job {job_id}")
    
    # Verify job exists and belongs to tenant
    job = db.table("job_postings")\
        .select("*")\
        .eq("id", job_id)\
        .eq("tenant_id", tenant_id)\
        .single()\
        .execute()
    
    if not job.data:
        raise HTTPException(404, "Job not found")
    
    job_requirements = job.data
    
    results = []
    success_count = 0
    failed_count = 0
    
    for resume_file in resumes:
        try:
            # Validate file type
            if not resume_file.filename.lower().endswith(('.pdf', '.doc', '.docx')):
                results.append({
                    "filename": resume_file.filename,
                    "status": "error",
                    "error": "Invalid file type. Only PDF, DOC, DOCX allowed"
                })
                failed_count += 1
                continue
            
            # Read file content
            content = await resume_file.read()
            
            # Step 1: Extract text from PDF
            logger.info(f"Extracting text from {resume_file.filename}")
            resume_text = await resume_parser.extract_text_from_pdf(content)
            
            if not resume_text or len(resume_text) < 50:
                raise Exception("Could not extract sufficient text from resume")
            
            # Step 2: Parse resume with AI
            logger.info(f"Parsing resume with AI: {resume_file.filename}")
            parsed_data = await resume_parser.parse_resume(resume_text)
            
            # Step 3: Score candidate with AI
            logger.info(f"Scoring candidate: {parsed_data.get('name', 'Unknown')}")
            evaluation = await scoring_service.score_candidate(
                resume_text,
                parsed_data,
                job_requirements
            )
            
            # Step 4: Create candidate record
            candidate = db.table("candidates").insert({
                "tenant_id": tenant_id,
                "job_id": job_id,
                "name": parsed_data.get("name", "Unknown"),
                "email": parsed_data.get("email"),
                "phone": parsed_data.get("phone"),
                "location": parsed_data.get("location"),
                "resume_url": f"uploaded/{resume_file.filename}",  # TODO: Upload to Supabase Storage
                "resume_text": resume_text,
                "parsed_data": parsed_data,
                "match_score": evaluation["overall_score"],
                "skills_matched": evaluation["skills_matched"],
                "skills_missing": evaluation["skills_missing"],
                "experience_years": parsed_data.get("experience_years", 0),
                "ai_evaluation": evaluation,
                "strengths": evaluation["strengths"],
                "concerns": evaluation.get("concerns", []),
                "recommendation": evaluation["recommendation"],
                "status": "screened"
            }).execute()
            
            results.append({
                "filename": resume_file.filename,
                "candidate_id": candidate.data[0]["id"],
                "name": parsed_data.get("name", "Unknown"),
                "score": evaluation["overall_score"],
                "recommendation": evaluation["recommendation"],
                "status": "success"
            })
            success_count += 1
            
            logger.info(f"✅ Processed: {resume_file.filename} - Score: {evaluation['overall_score']}/100")
            
        except Exception as e:
            logger.error(f"❌ Error processing {resume_file.filename}: {str(e)}")
            results.append({
                "filename": resume_file.filename,
                "status": "error",
                "error": str(e)
            })
            failed_count += 1
    
    return {
        "message": f"Processed {len(resumes)} resumes",
        "job_id": job_id,
        "results": results,
        "summary": {
            "total": len(resumes),
            "success": success_count,
            "failed": failed_count
        }
    }

@router.get("/jobs/{job_id}/candidates")
async def get_job_candidates(
    job_id: str,
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """Get all candidates for a specific job"""
    tenant_id = current_user["tenant_id"]
    
    candidates = db.table("candidates")\
        .select("*")\
        .eq("job_id", job_id)\
        .eq("tenant_id", tenant_id)\
        .order("match_score", desc=True)\
        .execute()
    
    return {
        "job_id": job_id,
        "total": len(candidates.data),
        "candidates": candidates.data
    }
