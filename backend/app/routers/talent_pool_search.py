"""
Talent Pool Search endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from app.config.database import get_db
from app.config.logging_config import logger
from app.utils.jwt import decode_token
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.services.embedding_service import embedding_service
from app.services.pinecone_service import pinecone_service

router = APIRouter()
security = HTTPBearer()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Extract user info from JWT token"""
    token = credentials.credentials
    payload = decode_token(token)
    if not payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    return payload

@router.post("/search")
async def search_talent_pool(
    search_request: dict,
    db: Client = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Search talent pool using semantic search with Pinecone
    
    Body: {
        "query": "Python developer with AWS experience",
        "min_experience": 2,
        "top_k": 20
    }
    """
    tenant_id = current_user["tenant_id"]
    
    query = search_request.get("query", "").strip()
    min_experience = search_request.get("min_experience", 0)
    top_k = search_request.get("top_k", 20)
    
    if not query:
        raise HTTPException(status_code=400, detail="Query is required")
    
    try:
        # Generate embedding for search query
        logger.info(f"Searching talent pool for: {query}")
        query_embedding = embedding_service.generate_embedding(query)
        
        # Search Pinecone with tenant filter
        search_results = pinecone_service.search_resumes(
            query_embedding=query_embedding,
            top_k=top_k,
            filter_dict={"tenant_id": tenant_id}
        )
        
        if not search_results:
            return {"query": query, "total": 0, "results": []}
        
        # Extract candidate IDs from Pinecone results
        candidate_ids = [int(match["id"].replace("candidate_", "")) for match in search_results]
        
        # Fetch full candidate data from Supabase
        candidates = db.table("candidates")\
            .select("*, job_postings(title)")\
            .in_("id", candidate_ids)\
            .eq("tenant_id", tenant_id)\
            .execute()
        
        # Filter by experience if specified
        filtered_candidates = candidates.data
        if min_experience > 0:
            filtered_candidates = [
                c for c in filtered_candidates 
                if c.get("experience_years", 0) >= min_experience
            ]
        
        # Merge with similarity scores from Pinecone
        results = []
        for candidate in filtered_candidates:
            # Find matching Pinecone result
            pinecone_match = next(
                (m for m in search_results if m["id"] == f"candidate_{candidate['id']}"),
                None
            )
            
            if pinecone_match:
                results.append({
                    **candidate,
                    "similarity_score": pinecone_match["score"],
                    "job_title": candidate.get("job_postings", {}).get("title") if candidate.get("job_postings") else None
                })
        
        # Sort by similarity score
        results.sort(key=lambda x: x.get("similarity_score", 0), reverse=True)
        
        logger.info(f"Found {len(results)} candidates for query: {query}")
        
        return {
            "query": query,
            "total": len(results),
            "results": results
        }
        
    except Exception as e:
        logger.error(f"Talent pool search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
