from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.config.database import get_db
from app.models.company import Company
from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, TokenResponse
from app.utils.password import hash_password, verify_password
from app.utils.jwt import create_access_token

router = APIRouter()

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
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
    existing_user = db.query(User).filter(User.email == data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create company
    company = Company(name=data.company_name)
    db.add(company)
    db.flush()  # Get company.id without committing
    
    # Create user with hashed password
    user = User(
        tenant_id=company.id,
        email=data.email,
        password_hash=hash_password(data.password),
        role="admin"  # First user is admin
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    
    # Create JWT token
    token_data = {
        "user_id": user.id,
        "tenant_id": user.tenant_id,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "company_name": company.name
        }
    }

@router.post("/login", response_model=TokenResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    """
    Login user
    
    Steps:
    1. Find user by email
    2. Verify password
    3. Generate JWT token
    4. Return token and user info
    """
    
    # Find user by email
    user = db.query(User).filter(User.email == data.email).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Verify password
    if not verify_password(data.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Get company
    company = db.query(Company).filter(Company.id == user.tenant_id).first()
    
    # Create JWT token
    token_data = {
        "user_id": user.id,
        "tenant_id": user.tenant_id,
        "email": user.email,
        "role": user.role
    }
    access_token = create_access_token(token_data)
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
            "company_name": company.name if company else None
        }
    }
