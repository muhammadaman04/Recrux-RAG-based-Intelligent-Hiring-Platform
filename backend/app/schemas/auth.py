from pydantic import BaseModel, EmailStr

class RegisterRequest(BaseModel):
    """Request schema for user registration"""
    company_name: str
    email: EmailStr
    password: str
    full_name: str | None = None

class LoginRequest(BaseModel):
    """Request schema for user login"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """Response schema for authentication"""
    access_token: str
    token_type: str = "bearer"
    user: dict

class UserResponse(BaseModel):
    """User information response"""
    id: int
    email: str
    role: str
    company_name: str | None
    
    class Config:
        from_attributes = True
