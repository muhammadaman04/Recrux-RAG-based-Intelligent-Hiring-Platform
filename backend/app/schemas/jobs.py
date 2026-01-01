"""
Pydantic schemas for job-related requests and responses
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ExtractRequirementsRequest(BaseModel):
    """Request schema for AI requirement extraction"""
    description: str

class ExtractRequirementsResponse(BaseModel):
    """Response schema for AI requirement extraction"""
    must_have_skills: List[str]
    nice_to_have_skills: List[str]
    min_experience: int
    summary: str

class JobCreate(BaseModel):
    """Request schema for creating a job"""
    title: str
    description: str
    requirements: Optional[dict] = None
    must_have_skills: List[str]
    nice_to_have_skills: List[str]
    min_experience: int

class JobResponse(BaseModel):
    """Response schema for job data"""
    id: int
    tenant_id: int
    title: str
    description: str
    must_have_skills: List[str]
    nice_to_have_skills: List[str]
    min_experience: int
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True
