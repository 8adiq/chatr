from pydantic import BaseModel, EmailStr

class UserBase(BaseModel):
    username : str
    email : EmailStr

class UserCreate(UserBase):
    password : str

class UserResponse(UserBase):
    id : int

    class config:
        orm_mode = True