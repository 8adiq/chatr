from pydantic import BaseModel
from datetime import datetime


class CommentBase(BaseModel):
    text: str

class CommentCreate(CommentBase):
    user_id: str
    post_id: str

class CommentPublic(CommentBase):
    id: str
    user_id: str
    username: str
    post_id: str
    created_at: datetime

    class Config:
        from_attributes = True