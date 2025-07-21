from passlib.context import CryptContext
from datetime import datetime,timedelta
from jose import jwt, JWTError
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi import HTTPException, Depends, status
from dotenv import load_dotenv
from .models import User
import os

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30


pwd_context = CryptContext(schemes=["bcrypt"],deprecated="auto")
security = HTTPBearer()

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str,hashed_password: str) -> bool:
    return pwd_context.verify(password,hashed_password)

def create_token(data:dict):
    """generates jwt token"""

    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)

    to_encode.update({'exp':expire})
    encoded_jwt = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return encoded_jwt

def show_user_details(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get('sub')

        if email is None:
            raise HTTPException(status_code=401, detail='Invalid Token')
    except JWTError:
        raise HTTPException(status_code=401, detail='Invalid Token')
    
    # go the DB and get the user

# def decode_token(token: str,credential_exception):
#     """decodes and verifies jwt token"""
#     try:
#         payload = jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
#         user_id = payload.get(user_id)

#         if user_id is None:
#             raise credential_exception
#         return payload
#     except JWTError:
#         return None
