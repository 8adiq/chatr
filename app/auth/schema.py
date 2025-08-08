from pydantic import BaseModel,EmailStr
from app.users.schema import UserResponse

class TokenResponse(BaseModel):
    user: UserResponse
    token: str
    refresh_token : str

class RequestTokenResponse(BaseModel):
    refresh_token : str
