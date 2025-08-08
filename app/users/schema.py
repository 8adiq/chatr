from pydantic import BaseModel, EmailStr
from datetime import datetime

# User schema
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    
    class Config:
        from_attributes = True