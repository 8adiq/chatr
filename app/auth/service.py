from datetime import datetime,timedelta
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException, Depends,status
from sqlalchemy.orm import Session
from app.users.models import User
from app.posts.models import  Post
from app.database.main import get_db_session
from app.config import settings
import os
import bcrypt


SECRET_KEY = settings.secret_key
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = int(settings.access_token_expires_minutes)
ACCESS_TOKEN_EXPIRES_DAYS = int(settings.refresh_token_expires_days)


security = HTTPBearer()

def hash_password(password: str) -> str:
    """hash password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    """verify password against hashed password"""
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_access_token(data:dict) -> str:
    """generates jwt access token"""

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)

    to_encode.update({'exp':expire, 'type':'access'})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def create_refresh_token(data:dict) -> str :
    """generates jwt access token"""

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=ACCESS_TOKEN_EXPIRES_DAYS)

    to_encode.update({'exp': expire, 'type': 'refresh'})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def verify_token(token : str, token_type : str = 'access'):

    try:
        payload = jwt.decode(token,SECRET_KEY,algorithms=ALGORITHM)
        email = payload.get('sub')
        token_type_check = payload.get('type')

        if email is None or token_type_check != token_type:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token invalid or expired.")
        return payload
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token invalid or expired.")


def get_user_details(credentials: HTTPAuthorizationCredentials = Depends(security),
                      db: Session = Depends(get_db_session)):
    """get authenticated user's details"""
    try:
        payload = verify_token(credentials.credentials,"access")
        email = payload.get('sub')

        if email is None:
            raise HTTPException(status_code=401, detail='Invalid Token')
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid Token')
    
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401,detail="User not found")
    return user



    
