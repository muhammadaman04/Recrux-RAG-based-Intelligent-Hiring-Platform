from fastapi import APIRouter, Depends, HTTPException, status
from supabase import Client
from app.config.database import get_db
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Client = Depends(get_db)):
    """
    Register new company and user
    
    Steps:
    1. Check if email already exists
    2. Create company
    3. Create user with hashed password
    4. Generate JWT token
    5. Return token and user info
    """
    
    # Check if email already exists
    existing_user = db.table("users").select("*").eq("email", data.email).execute()
    if existing_user.data:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create company
    company_result = db.table("companies").insert({
        "name": data.company_name
    }).execute()
    
    if not company_result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create company"
        )
    
    company = company_result.data[0]
    company_id = company["id"]
    
    # Create user with hashed password
    user_result = db.table("users").insert({
        "tenant_id": company_id,
        "email": data.email,
        "password_hash": hash_password(data.password),
        "role": "admin"
    }).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to create user"
        )
    
    user = user_result.data[0]
    
    # Create JWT token
    token_data = {
        "user_id": user["id"],
        "tenant_id": user["tenant_id"],
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "company_name": company["name"]
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Client = Depends(get_db)):
    """
    Login user
    
    Steps:
    1. Find user by email
    2. Verify password
    3. Generate JWT token
    4. Return token and user info
    """
    
    # Find user by email
    user_result = db.table("users").select("*").eq("email", data.email).execute()
    
    if not user_result.data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    user = user_result.data[0]
    
    # Verify password
    if not verify_password(data.password, user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Get company
    company_result = db.table("companies").select("*").eq("id", user["tenant_id"]).execute()
    company = company_result.data[0] if company_result.data else None
    
    # Create JWT token
    token_data = {
        "user_id": user["id"],
        "tenant_id": user["tenant_id"],
        "email": user["email"],
        "role": user["role"]
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user["id"],
            "email": user["email"],
            "role": user["role"],
            "company_name": company["name"] if company else None
        }
    }
