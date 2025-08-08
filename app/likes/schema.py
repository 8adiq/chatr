from pydantic import BaseModel

class LikeBase(BaseModel):
    user_id: str
    post_id: str

class LikeCreate(LikeBase):
    pass

class LikeResponse(LikeBase):
    id: str
    username: str
    
    class Config:
        from_attributes = True