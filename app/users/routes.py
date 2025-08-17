from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from app.users.models import User
from app.users.schema import UserResponse
from app.auth.service import get_user_details
from app.database.main import get_db_session
from app.users.service import UserService
from app.posts.service import PostService
from app.posts.schema import PostPublic


router = APIRouter()

# User Routes
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