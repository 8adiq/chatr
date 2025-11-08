from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from backend.users.models import User
from backend.likes.schema import LikeResponse,LikeCreate
from backend.auth.service import get_user_details
from backend.database.main import get_db_session
from backend.likes.service import LikeService
from datetime import datetime


router = APIRouter()

@router.post("/likes",response_model=LikeResponse,status_code=status.HTTP_201_CREATED)
async def like_post(post_id : str , current_user : User = Depends(get_user_details), 
                    db: Session = Depends(get_db_session)):
    
    like_service = LikeService(db)
    new_like = like_service.like_post(post_id, current_user.id)
    return LikeResponse(**new_like.to_dict())


@router.delete("/likes",status_code=status.HTTP_204_NO_CONTENT)
async def unlike(post_id : str, db : Session = Depends(get_db_session),current_user :User=Depends(get_user_details)):

    like_service = LikeService(db)
    like_service.unlike_post(post_id, current_user.id)
    return None

@router.get("/user/likes")
async def get_user_likes(current_user: User = Depends(get_user_details), db: Session = Depends(get_db_session)):
    """Get all posts liked by the current user"""
    like_service = LikeService(db)
    likes = like_service.get_user_likes(current_user.id)
    return [{"post_id": like.post_id} for like in likes]