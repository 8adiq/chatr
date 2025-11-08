from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from fastapi import HTTPException, status,Depends
from backend.posts.models import Post
from backend.comments.models import Comment
from backend.comments.schema import CommentBase
from datetime import datetime
from typing import List

class CommentService:
    def __init__(self, db: Session):
        self.db = db

    def validate_comment_content(self, text: str) -> None:
        """Validate comment content"""
        if not text.strip():
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Comment cannot be empty")

    def create_comment(self, post_id: str, comment_data: CommentBase, user_id: str) -> Comment:
        """Create a new comment"""
        # Check if post exists
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Post found.")

        self.validate_comment_content(comment_data.text)
        
        db_comment = Comment(
            text=comment_data.text,
            user_id=user_id,
            post_id=post_id
        )
        self.db.add(db_comment)
        self.db.commit()
        self.db.refresh(db_comment)
        return db_comment

    def get_post_comments(self, post_id: str, skip: int = 0, limit: int = 10) -> List[Comment]:
        """Get comments for a specific post"""
        # Check if post exists
        post = self.db.query(Post).filter(Post.id == post_id).first()
        if not post:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No Post Found.")
        
        return self.db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.desc()).offset(skip).limit(limit).all()