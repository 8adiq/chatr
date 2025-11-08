from fastapi import APIRouter, HTTPException,Depends, status
from sqlalchemy.orm import Session
from typing import List
from backend.users.models import User
from backend.comments.models import Comment
from backend.comments.schema import CommentBase,CommentPublic
from backend.auth.service import get_user_details
from backend.database.main import get_db_session
from backend.comments.service import CommentService
from datetime import datetime


router = APIRouter()

@router.post("/comments",response_model=CommentPublic, status_code=status.HTTP_201_CREATED)
async def create_comment(post_id : str ,comment_data : 
                         CommentBase, db : Session = Depends(get_db_session),
                         current_user : User = Depends(get_user_details)):
    
    comment_service = CommentService(db)
    db_comment = comment_service.create_comment(post_id, comment_data, current_user.id)
    return CommentPublic(**db_comment.to_dict())


@router.get("/{post_id}/comments",response_model=List[CommentPublic])
async def get_comments(post_id : str, db :Session = Depends(get_db_session), skip : int = 0, limit : int = 10):

    comment_service = CommentService(db)
    comments = comment_service.get_post_comments(post_id, skip, limit)
    return [CommentPublic(**comment.to_dict()) for comment in comments]

