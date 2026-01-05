"""
Pinecone service for vector storage and similarity search
"""
from pinecone import Pinecone, ServerlessSpec
from typing import List, Dict, Optional
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)

class PineconeService:
    def __init__(self):
        """Initialize Pinecone client and index"""
        if not settings.PINECONE_API_KEY:
            logger.warning("⚠️ PINECONE_API_KEY not set. Pinecone features disabled.")
            self.enabled = False
            return
        
        try:
            self.pc = Pinecone(api_key=settings.PINECONE_API_KEY)
            self.index_name = settings.PINECONE_INDEX_NAME
            self.enabled = True
            
            # Check if index exists, create if not
            existing_indexes = self.pc.list_indexes().names()
            
            if self.index_name not in existing_indexes:
                logger.info(f"Creating Pinecone index: {self.index_name}")
                self.pc.create_index(
                    name=self.index_name,
                    dimension=384,  # all-MiniLM-L6-v2 dimension
                    metric="cosine",
                    spec=ServerlessSpec(
                        cloud="aws",
                        region=settings.PINECONE_ENVIRONMENT
                    )
                )
                logger.info(f"✅ Pinecone index '{self.index_name}' created")
            
            self.index = self.pc.Index(self.index_name)
            logger.info(f"✅ Connected to Pinecone index: {self.index_name}")
            
        except Exception as e:
            logger.error(f"❌ Pinecone initialization failed: {e}")
            self.enabled = False
    
    def upsert_resume(
        self,
        candidate_id: int,
        embedding: List[float],
        metadata: Dict
    ) -> bool:
        """
        Store resume embedding in Pinecone
        
        Args:
            candidate_id: Unique candidate ID
            embedding: 384-dim vector
            metadata: {tenant_id, job_id, name, skills, etc.}
            
        Returns:
            True if successful, False otherwise
        """
        if not self.enabled:
            logger.warning("Pinecone not enabled, skipping upsert")
            return False
        
        try:
            vector_id = f"candidate_{candidate_id}"
            
            self.index.upsert(
                vectors=[{
                    "id": vector_id,
                    "values": embedding,
                    "metadata": metadata
                }]
            )
            
            logger.info(f"✅ Upserted candidate {candidate_id} to Pinecone")
            return True
            
        except Exception as e:
            logger.error(f"❌ Pinecone upsert failed for candidate {candidate_id}: {e}")
            return False
    
    def search_similar(
        self,
        query_embedding: List[float],
        top_k: int = 20,
        filter_dict: Optional[Dict] = None
    ) -> List[Dict]:
        """
        Search for similar resumes
        
        Args:
            query_embedding: Query vector
            top_k: Number of results
            filter_dict: Metadata filters (e.g., {"tenant_id": 1})
            
        Returns:
            List of {candidate_id, similarity_score, metadata}
        """
        if not self.enabled:
            logger.warning("Pinecone not enabled, returning empty results")
            return []
        
        try:
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                filter=filter_dict,
                include_metadata=True
            )
            
            matches = []
            for match in results.get("matches", []):
                candidate_id = int(match["id"].replace("candidate_", ""))
                matches.append({
                    "candidate_id": candidate_id,
                    "similarity_score": match["score"],
                    "metadata": match.get("metadata", {})
                })
            
            logger.info(f"✅ Found {len(matches)} similar candidates")
            return matches
            
        except Exception as e:
            logger.error(f"❌ Pinecone search failed: {e}")
            return []
    
    def delete_resume(self, candidate_id: int) -> bool:
        """Delete resume from Pinecone"""
        if not self.enabled:
            return False
        
        try:
            vector_id = f"candidate_{candidate_id}"
            self.index.delete(ids=[vector_id])
            logger.info(f"✅ Deleted candidate {candidate_id} from Pinecone")
            return True
        except Exception as e:
            logger.error(f"❌ Pinecone delete failed: {e}")
            return False
    
    def search_resumes(
        self, 
        query_embedding: list, 
        top_k: int = 20,
        filter_dict: dict = None
    ) -> list:
        """
        Search for similar resumes using vector similarity
        
        Args:
            query_embedding: The query vector (384-dim)
            top_k: Number of results to return
            filter_dict: Metadata filters (e.g., {"tenant_id": 5})
        
        Returns:
            List of matches with id, score, and metadata
        """
        if not self.enabled:
            logger.warning("Pinecone not enabled, returning empty results")
            return []

        try:
            # Query Pinecone
            results = self.index.query(
                vector=query_embedding,
                top_k=top_k,
                filter=filter_dict,
                include_metadata=True
            )
            
            # Format results
            matches = []
            for match in results.matches:
                matches.append({
                    "id": match.id,
                    "score": match.score,
                    "metadata": match.metadata
                })
            
            logger.info(f"✅ Found {len(matches)} matches in Pinecone")
            return matches
            
        except Exception as e:
            logger.error(f"❌ Pinecone search failed: {e}")
            return []
    
    def get_stats(self) -> Dict:
        """Get index statistics"""
        if not self.enabled:
            return {"enabled": False}
        
        try:
            stats = self.index.describe_index_stats()
            return {
                "enabled": True,
                "total_vectors": stats.get("total_vector_count", 0),
                "dimension": stats.get("dimension", 384)
            }
        except Exception as e:
            logger.error(f"❌ Failed to get Pinecone stats: {e}")
            return {"enabled": True, "error": str(e)}

# Singleton instance
pinecone_service = PineconeService()
