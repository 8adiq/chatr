from sqlalchemy import Column, String, ForeignKey, DateTime, UniqueConstraint, Index, func
from sqlalchemy.orm import relationship
import uuid
from backend.database.main import Base


class Comment(Base):
    __tablename__ = "Comments"
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    text = Column(String(500), nullable=True)
    user_id = Column(String(36), ForeignKey("Users.id"), nullable=False)
    post_id = Column(String(36), ForeignKey("Posts.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", backref="comments")
    post = relationship("Post", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "user_id": self.user_id,
            "username": self.user.username,
            "post_id": self.post_id,
            "created_at": self.created_at.isoformat()
        }
    
    def __repr__(self):
        return f"<Comment(id={self.id}, text={self.text}, user_id={self.user_id}, post_id={self.post_id})>"