from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.users.models import User
from app.users.schema import UserCreate,UserResponse,UserLogin
from app.auth.schema import TokenResponse,RequestTokenResponse
from app.auth.service import get_user_details,create_access_token,create_refresh_token,verify_token
from app.database.main import get_db_session
from app.users.service import UserService
from app.posts.service import PostService
from app.posts.schema import PostPublic
from datetime import datetime


router = APIRouter()

# User Routes
@router.post("/register", response_model= TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserCreate, db: Session = Depends(get_db_session)):

    user_service = UserService(db)
    
    # Create user with validation
    db_user = user_service.create_user(user_data)

    # creates tokens
    access_token = create_access_token(data={"sub": db_user.email})
    refresh_token = create_refresh_token(data={"sub":db_user.email})

    return {
        "user": UserResponse(**db_user.to_dict()),
        "token": access_token,
        "refresh_token":refresh_token
    }

@router.post("/login",response_model=TokenResponse)
async def login(user_data: UserLogin, db : Session = Depends(get_db_session)):

    user_service = UserService(db)
    user = user_service.authenticate_user(user_data)
    
    # create tokens for authenticated user
    if user is not None:
        access_token = create_access_token(data={"sub": user.email})
        refresh_token = create_refresh_token(data={"sub":user.email})

    return{
        "user": UserResponse(**user.to_dict()),
        "token": access_token,
        "refresh_token":refresh_token
    }

@router.post("/refresh",response_model=TokenResponse)
async def get_refresh_token(refresh_data: RequestTokenResponse, db : Session = Depends(get_db_session)):
    try:

        # verify refresh token and get object of that user
        payload = verify_token(refresh_data.refresh_token,"refresh")
        email = payload.get('sub')
        user = db.query(User).filter(User.email == email).first()

        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="User not found")
        
        new_access_token = create_access_token(data={'sub':email})
        new_refresh_token = create_refresh_token(data={'sub':email})

        return {
            "user" : UserResponse(**user.to_dict()),
            "token": new_access_token,
            "refresh_token":new_refresh_token
        }
    except HTTPException:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,detail="Token invalid or expired.")
        

@router.get("/profile")
async def show_profile(current_user : User = Depends(get_user_details)):
    return {"user": UserResponse(**current_user.to_dict())}

@router.get("/users/{user_id}", response_model=UserResponse)
async def get_user_by_id(user_id: str, db: Session = Depends(get_db_session)):
    """Get user details by user ID"""

    user_service = UserService(db)
    user = user_service.get_user_by_id(user_id)
    
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    return UserResponse(**user.to_dict())

@router.get("/users/{user_id}/posts",response_model=List[PostPublic])
async def get_user_post(user_id : str ,skip :int = 0, limit :  int =10,
                        db: Session = Depends(get_db_session)):
    
    user_service = UserService(db)
    post_service = PostService(db)
    
    user = user_service.get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not Found.")

    posts = post_service.get_user_posts(user_id, skip, limit)
    return [PostPublic(**post.to_dict()) for post in posts]