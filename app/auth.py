from datetime import datetime,timedelta
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException, Depends
from sqlalchemy.orm import Session
from dotenv import load_dotenv
from .models import User,Post
from .database import get_db_session
import os
import bcrypt

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
if not SECRET_KEY:
    raise RuntimeError("SECRET_KEY environment variable is not set.")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30


security = HTTPBearer()

def hash_password(password: str) -> str:
    """hash password"""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")

def verify_password(password: str, hashed_password: str) -> bool:
    """verify password against hashed password"""
    return bcrypt.checkpw(password.encode("utf-8"), hashed_password.encode("utf-8"))

def create_token(data:dict):
    """generates jwt token"""

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)

    to_encode.update({'exp':expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def get_user_details(credentials: HTTPAuthorizationCredentials = Depends(security),
                      db: Session = Depends(get_db_session)):
    """get authenticated user"""
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get('sub')
        exp = payload.get('exp')

        if email is None:
            raise HTTPException(status_code=401, detail='Invalid Token')
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid Token')
    
    user = db.query(User).filter(User.email == email).first()

    if user is None:
        raise HTTPException(status_code=401,detail="User not found")
    return user



    
