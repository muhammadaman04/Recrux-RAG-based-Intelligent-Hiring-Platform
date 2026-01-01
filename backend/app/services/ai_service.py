"""
AI Service for job requirement extraction using Groq LLM
"""
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from app.config.settings import settings
from app.config.logging_config import logger
import json

class AIService:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model="llama-3.1-70b-versatile",
            temperature=0
        )
    
    async def extract_job_requirements(self, job_description: str) -> dict:
        """
        Extract structured requirements from job description
        
        Args:
            job_description: Raw job description text
        
        Returns:
            {
                "must_have_skills": ["Python", "FastAPI", ...],
                "nice_to_have_skills": ["Docker", "AWS", ...],
                "min_experience": 5,
                "summary": "..."
            }
        """
        logger.info(f"Extracting requirements from JD (length: {len(job_description)} chars)")
        
        prompt = ChatPromptTemplate.from_template("""
        Analyze this job description and extract structured requirements.
        
        Job Description:
        {job_description}
        
        Extract and return ONLY a JSON object with:
        - must_have_skills: Array of essential technical skills (max 10)
        - nice_to_have_skills: Array of preferred skills (max 8)
        - min_experience: Minimum years of experience required (integer)
        - summary: One-sentence summary of the role
        
        Return ONLY valid JSON, no markdown or explanation.
        
        JSON:
        """)
        
        try:
            response = await self.llm.ainvoke(
                prompt.format(job_description=job_description)
            )
            
            # Parse JSON from response
            content = response.content.strip()
            
            # Remove markdown code blocks if present
            if content.startswith("```json"):
                content = content.split("```json")[1].split("```")[0]
            elif content.startswith("```"):
                content = content.split("```")[1].split("```")[0]
            
            requirements = json.loads(content)
            
            logger.info(
                f"Extracted {len(requirements.get('must_have_skills', []))} must-have, "
                f"{len(requirements.get('nice_to_have_skills', []))} nice-to-have skills"
            )
            
            return requirements
            
        except Exception as e:
            logger.error(f"Failed to extract requirements: {str(e)}")
            raise

ai_service = AIService()
