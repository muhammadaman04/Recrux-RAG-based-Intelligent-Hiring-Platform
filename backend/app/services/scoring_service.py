"""
Resume scoring service using Direct LLM approach
"""
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from app.config.settings import settings
from app.config.logging_config import logger
import json

class ScoringService:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model="openai/gpt-oss-20b",
            temperature=0.3
        )
    
    async def score_candidate(
        self, 
        resume_text: str, 
        parsed_data: dict,
        job_requirements: dict
    ) -> dict:
        """
        Score candidate using Direct LLM approach
        Provides detailed evaluation with match score and explanations
        """
        
        # Extract job requirements
        job_title = job_requirements.get('title', 'Unknown Position')
        must_have_skills = job_requirements.get('must_have_skills', [])
        nice_to_have_skills = job_requirements.get('nice_to_have_skills', [])
        min_experience = job_requirements.get('min_experience', 0)
        job_description = job_requirements.get('description', '')
        
        # Extract candidate info
        candidate_name = parsed_data.get('name', 'Unknown')
        candidate_skills = parsed_data.get('skills', [])
        candidate_experience = parsed_data.get('experience_years', 0)
        
        prompt = f"""
        You are an expert technical recruiter. Evaluate this candidate for the job position.
        
        JOB REQUIREMENTS:
        Title: {job_title}
        Description: {job_description[:500]}
        Must-have skills: {', '.join(must_have_skills)}
        Nice-to-have skills: {', '.join(nice_to_have_skills)}
        Minimum experience: {min_experience} years
        
        CANDIDATE PROFILE:
        Name: {candidate_name}
        Experience: {candidate_experience} years
        Skills: {', '.join(candidate_skills)}
        
        Resume Summary:
        {resume_text[:2000]}
        
        EVALUATION CRITERIA:
        1. Skills Match (40 points): How many required skills does the candidate have?
        2. Experience Level (30 points): Does experience meet minimum requirement?
        3. Relevance (20 points): Is their background relevant to this role?
        4. Growth Potential (10 points): Can they grow into the role?
        
        Provide a detailed evaluation in JSON format:
        {{
            "overall_score": 0-100,
            "skills_matched": ["skill1", "skill2", ...],
            "skills_missing": ["skill1", "skill2", ...],
            "experience_match": true/false,
            "strengths": [
                "Specific strength 1",
                "Specific strength 2",
                "Specific strength 3"
            ],
            "concerns": [
                "Specific concern 1",
                "Specific concern 2"
            ],
            "recommendation": "hire" | "maybe" | "reject",
            "detailed_explanation": "2-3 sentence explanation of why this score",
            "score_breakdown": {{
                "skills": 0-40,
                "experience": 0-30,
                "relevance": 0-20,
                "growth": 0-10
            }}
        }}
        
        Be honest and specific. Provide actionable insights.
        Return ONLY the JSON object, no additional text.
        """
        
        try:
            logger.info(f"Scoring candidate: {candidate_name} for {job_title}")
            
            response = self.llm.invoke([HumanMessage(content=prompt)])
            
            # Strip markdown code blocks if present
            content = response.content.strip()
            if content.startswith("```json"):
                content = content[7:]  # Remove ```json
            if content.startswith("```"):
                content = content[3:]  # Remove ```
            if content.endswith("```"):
                content = content[:-3]  # Remove trailing ```
            content = content.strip()
            
            evaluation = json.loads(content)
            
            logger.info(f"Score: {evaluation['overall_score']}/100 - {evaluation['recommendation']}")
            
            return evaluation
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse scoring response as JSON: {str(e)}")
            logger.error(f"Response was: {response.content}")
            
            # Return default evaluation if parsing fails
            return {
                "overall_score": 50,
                "skills_matched": [],
                "skills_missing": must_have_skills,
                "experience_match": candidate_experience >= min_experience,
                "strengths": ["Resume submitted"],
                "concerns": ["Unable to fully evaluate"],
                "recommendation": "maybe",
                "detailed_explanation": "Automated evaluation encountered an error. Manual review recommended.",
                "score_breakdown": {
                    "skills": 20,
                    "experience": 15,
                    "relevance": 10,
                    "growth": 5
                }
            }
        except Exception as e:
            logger.error(f"Scoring failed: {str(e)}")
            raise

scoring_service = ScoringService()