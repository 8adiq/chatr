from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username : str
    email : str

class UserCreate(UserBase):
    password : str

class UserLogin(BaseModel):
    email : str
    password : str

class UserResponse(UserBase):
    id : int

class TokenResponse(BaseModel):
    user : UserBase
    token : str