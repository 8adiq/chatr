from pydantic import BaseModel, EmailStr
from datetime import datetime

class PostBase(BaseModel):
    text: str

class PostCreate(PostBase):
    pass

class PostPublic(PostBase):
    id: str
    user_id: str
    username : str
    created_at: datetime
    like_count: int
    comment_count: int

    class Config:
        from_attributes = True