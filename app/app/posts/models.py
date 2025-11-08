from sqlalchemy import Column, String, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
import uuid
from app.database.main import Base


class Post(Base):
    __tablename__ = 'Posts'
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    text = Column(String(1000), nullable=True)
    user_id = Column(String(36), ForeignKey("Users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="posts")
    likes = relationship("Like", back_populates="post", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="post", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "user_id": self.user_id,
            "username": self.user.username,
            "created_at": self.created_at.isoformat(),
            "like_count": len(self.likes),
            "comment_count": len(self.comments)
        }
    
    def __repr__(self):
        return f"<Post(id={self.id}, text={self.text}, user_id={self.user_id})>"