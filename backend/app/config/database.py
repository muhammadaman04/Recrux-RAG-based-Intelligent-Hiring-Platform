"""
Supabase Database Client
Handles all database operations using Supabase client
"""
from supabase import create_client, Client
from app.config.settings import settings
import logging

logger = logging.getLogger(__name__)


class SupabaseDB:
    """Supabase database client wrapper"""
    
    def __init__(self):
        """Initialize Supabase client"""
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError(
                "Supabase credentials not configured. "
                "Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in environment variables."
            )
        
        self.client: Client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY
        )
        logger.info("Supabase database client initialized")
    
    def get_client(self) -> Client:
        """Get the Supabase client instance"""
        return self.client


# Global database instance
supabase_db = SupabaseDB()


def get_db():
    """Get Supabase client (for FastAPI dependency injection)"""
    return supabase_db.get_client()
