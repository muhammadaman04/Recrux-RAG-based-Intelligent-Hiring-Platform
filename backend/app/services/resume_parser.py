"""
Resume parsing service using AI
"""
from langchain_groq import ChatGroq
from langchain.schema import HumanMessage
from app.config.settings import settings
from app.config.logging_config import logger
import PyPDF2
import io
import json

class ResumeParser:
    def __init__(self):
        self.llm = ChatGroq(
            api_key=settings.GROQ_API_KEY,
            model="openai/gpt-oss-20b",
            temperature=0
        )
    
    async def extract_text_from_pdf(self, pdf_bytes: bytes) -> str:
        """Extract text from PDF file"""
        try:
            pdf_file = io.BytesIO(pdf_bytes)
            pdf_reader = PyPDF2.PdfReader(pdf_file)
            
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text()
            
            logger.info(f"Extracted {len(text)} characters from PDF")
            return text.strip()
        except Exception as e:
            logger.error(f"PDF extraction failed: {str(e)}")
            raise Exception(f"Failed to extract text from PDF: {str(e)}")
    
    async def parse_resume(self, resume_text: str) -> dict:
        """Parse resume text using AI to extract structured information"""
        
        prompt = f"""
        Extract structured information from this resume. Be precise and only extract information that is clearly stated.
        
        RESUME TEXT:
        {resume_text[:4000]}
        
        Return a JSON object with the following structure:
        {{
            "name": "Full name of the candidate",
            "email": "Email address",
            "phone": "Phone number",
            "location": "City, State/Country",
            "summary": "Brief professional summary (2-3 sentences)",
            "skills": ["skill1", "skill2", "skill3", ...],
            "experience_years": total_years_as_integer,
            "education": [
                {{
                    "degree": "Degree name",
                    "institution": "University/College name",
                    "year": "Graduation year"
                }}
            ],
            "work_experience": [
                {{
                    "title": "Job title",
                    "company": "Company name",
                    "duration": "Duration (e.g., 2020-2023)",
                    "description": "Brief description of responsibilities"
                }}
            ],
            "certifications": ["cert1", "cert2", ...]
        }}
        
        CRITICAL EXTRACTION RULES:
        1. NAME: Extract the full name as it appears, with proper spacing. 
           - CORRECT: "Ahmed Ali Khan" or "Muhammad Aman"
           - WRONG: "A H M E D  A L I  K H A N" or "AHMED ALI KHAN"
           - If name has spaces between each letter, remove them and format properly
        
        2. EMAIL: Extract email address exactly as written, without any special characters or symbols.
           - CORRECT: "amanmuhammed0987@gmail.com"
           - WRONG: "envel⌢peamanmuhammed0987@gmail.com" or "📧amanmuhammed0987@gmail.com"
           - Remove any icons, symbols, or decorative characters before/after email
        
        3. PHONE: Extract phone number with proper formatting
           - Remove any icons or symbols
           - Keep only numbers and standard separators (+ - () space)
        
        4. If a field is not found, use null or empty array
        5. For experience_years, calculate total years from work history
        6. Extract ALL technical skills mentioned
        7. Be accurate with names and dates
        
        Return ONLY the JSON object, no additional text or explanations.
        """
        
        try:
            response = self.llm.invoke([HumanMessage(content=prompt)])
            
            # Parse JSON response
            parsed_data = json.loads(response.content)
            
            logger.info(f"Parsed resume for: {parsed_data.get('name', 'Unknown')}")
            return parsed_data
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse LLM response as JSON: {str(e)}")
            logger.error(f"Response was: {response.content}")
            # Return minimal data if parsing fails
            return {
                "name": "Unknown",
                "email": None,
                "phone": None,
                "location": None,
                "summary": resume_text[:200],
                "skills": [],
                "experience_years": 0,
                "education": [],
                "work_experience": [],
                "certifications": []
            }
        except Exception as e:
            logger.error(f"Resume parsing failed: {str(e)}")
            raise

resume_parser = ResumeParser()
