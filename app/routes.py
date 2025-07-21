from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from .models import User
from .schema import UserCreate,TokenResponse,UserResponse,UserLogin
from .auth import hash_password,verify_password,get_user_details,create_token
from .database import get_db_session
import uuid


router = APIRouter()

@router.post("/register", response_model= TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db_session)):

    # check if email already exits
    existing_email = db.query(User).filter(User.email ==user_data.email).first()
    if existing_email:
        raise HTTPException(status_code=400,detail="Email already registered")
    
    # check if username already exits
    existing_username = db.query(User).filter(User.username ==user_data.username).first()
    if existing_username:
        raise HTTPException(status_code=400,detail="Username already exits")
    
    # validate password length
    if len(user_data.password) < 6:
        raise HTTPException(status_code=400,detail="Password has to be at least 6 charaters")
    
    hashed_password = hash_password(user_data.password) 
    id = str(uuid.uuid4())
    db_user = User(
        id = id,
        username = user_data.username,
        email = user_data.email,
        hashed_password = hashed_password
    )
    db.add(db_user)
    db.commit()

    access_token = create_token(data={"sub":db_user.email})
    return {
        "user": UserResponse(**db_user.to_dict()),
        "token": access_token
    }

@router.post("/login",response_model=TokenResponse)
async def login(user_data: UserLogin, db : Session = Depends(get_db_session)):

    # Find user
    user = db.query(User).filter(User.email == user_data.email).first()

    if not user or not verify_password(user_data.password, user.hashed_password):
        raise HTTPException(status_code=401,detail="Invalid credentials")
    
    access_token = create_token(data={"sub":user.email})

    return{
        "user": UserResponse(**user.to_dict()),
        "token": access_token
    }

@router.get("/profile")
async def show_profile(current_user : User = Depends(get_user_details)):
    return {"user":UserResponse(**current_user.to_dict())}

