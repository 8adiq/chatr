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

class TokenResponse(BaseModel):
    user: UserResponse
    token: str

# Post schema
class PostBase(BaseModel):
    text: str

class PostCreate(PostBase):
    pass

class PostPublic(PostBase):
    id: str
    user_id: str
    username : str
    created_at: datetime

    class Config:
        from_attributes = True

# Comments schema
class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    user_id: str
    post_id: str

class CommentPublic(CommentBase):
    id: str
    user_id: str
    post_id: str
    created_at: datetime

    class Config:
        from_attributes = True

# Likes schema
class LikeBase(BaseModel):
    user_id: str
    post_id: str

class LikeCreate(LikeBase):
    pass

class LikeResponse(LikeBase):
    id: str
    
    class Config:
        from_attributes = True


