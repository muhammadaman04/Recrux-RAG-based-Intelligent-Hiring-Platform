from datetime import datetime, timedelta
from jose import JWTError, jwt
from app.config.settings import settings

def create_access_token(data: dict) -> str:
    """
    Create JWT access token
    
    Args:
        data: Dictionary with user info (user_id, tenant_id, email, role)
    
    Returns:
        Encoded JWT token string
    """
    to_encode = data.copy()
    
    # Add expiration time
    expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    
    # Encode token
    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM
    )
    
    return encoded_jwt

def decode_token(token: str) -> dict | None:
    """
    Decode and verify JWT token
    
    Args:
        token: JWT token string
    
    Returns:
        Decoded payload dict or None if invalid
    """
    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )
        return payload
    except JWTError:
        return None
