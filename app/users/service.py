from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status,Depends
from fastapi.security import HTTPAuthorizationCredentials,HTTPBearer
from jose import jwt, JWTError
from app.users.models import User
from app.users.schema import UserCreate, UserLogin
from app.auth.service import hash_password, verify_password
from datetime import datetime
from typing import List


class UserService:
    def __init__(self, db: Session):
        self.db = db

    def check_email_exists(self, email: str) -> bool:
        """Check if email already exists in database"""
        return self.db.query(User).filter(func.lower(User.email) == email.lower()).first() is not None

    def check_username_exists(self, username: str) -> bool:
        """Check if username already exists in database"""
        return self.db.query(User).filter(User.username == username).first() is not None

    def validate_password(self, password: str) -> None:
        """Validate password requirements"""
        if len(password) < 6:
            raise HTTPException(
                status_code=400, 
                detail="Password has to be at least 6 characters"
            )

    def create_user(self, user_data: UserCreate) -> User:
        """Create a new user with validation"""
        # Check if email already exists
        if self.check_email_exists(user_data.email.lower()):
            raise HTTPException(status_code=400, detail="Email already registered")
        
        # Check if username already exists
        if self.check_username_exists(user_data.username):
            raise HTTPException(status_code=400, detail="Username already exists")
        
        # Validate password length
        self.validate_password(user_data.password)
        
        # Create user
        hashed_password = hash_password(user_data.password)
        db_user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, user_data: UserLogin) -> User:
        """Authenticate user login"""
        user = self.db.query(User).filter(func.lower(User.email) == user_data.email.lower()).first()

        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(status_code=401, detail="Invalid credentials")
        
        return user

    def get_user_by_email(self, email: str) -> User:
        """Get user by email"""
        return self.db.query(User).filter(func.lower(User.email) == email.lower()).first()

    def get_user_by_id(self, user_id: str) -> User:
        """Get user by ID"""
        return self.db.query(User).filter(User.id == user_id).first()