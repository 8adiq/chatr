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
    id: int
    
    class Config:
        orm_mode = True

class TokenResponse(BaseModel):
    user: UserResponse
    token: str

# Post schema
class PostBase(BaseModel):
    text: str

class PostCreate(PostBase):
    user_id: int

class PostPublic(PostBase):
    id: int
    user_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Comments schema
class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    user_id: int
    post_id: int

class CommentPublic(CommentBase):
    id: int
    user_id: int
    post_id: int
    created_at: datetime

    class Config:
        orm_mode = True

# Likes schema
class LikeBase(BaseModel):
    user_id: int
    post_id: int

class LikeCreate(LikeBase):
    pass

class LikeResponse(LikeBase):
    id: int
    
    class Config:
        orm_mode = True
