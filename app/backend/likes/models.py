from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint, Index, func
from sqlalchemy.orm import relationship
import uuid
from backend.database.main import Base


class Like(Base):
    __tablename__ = "Likes"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("Users.id"), nullable=False)
    post_id = Column(String(36), ForeignKey("Posts.id"), nullable=False)

    user = relationship("User", backref="likes")
    post = relationship("Post", back_populates="likes")
    
    # Prevent duplicate likes
    __table_args__ = (UniqueConstraint('user_id', 'post_id', name='unique_user_post_like'),)

    def to_dict(self):
        """Convert like object to dictionary"""
        return {
            "id": self.id,
            "user_id": self.user_id,
            "username": self.user.username,
            "post_id": self.post_id
        }
    
    def __repr__(self):
        return f"<Like(id={self.id}, user_id={self.user_id}, post_id={self.post_id})>"