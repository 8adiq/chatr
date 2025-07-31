from sqlalchemy import Column, Integer, String,ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = 'Users'
    id = Column(String,primary_key=True,index=True)
    username = Column(String,unique=True,index=True,nullable=False)
    email = Column(String,unique=True,nullable=False,index=True)
    hashed_password = Column(String,nullable=False)

    def to_dict(self):
        """ converting user object to a dictionary"""
        return {
            "id":self.id,
            "username":self.username,
            "email":self.email,
        }
    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"
    
class Post(Base):
    __tablename__ = 'Posts'
    id  = Column(String,unique=True,index=True,nullable=False,primary_key=True)
    text = Column(String,nullable=True)
    user_id = Column(String,ForeignKey("Users.id"),nullable=False)

    user = relationship("User",backref="posts")

    def to_dict(self):

        return {
            "id":self.id,
            "text": self.text,
            "user_id":self.user_id
        }
    def __repr__(self):
        return f"<User(id={self.id}, text={self.text},user_id={self.user_id})>"
    
class Comment(Base):
    __tablename__ = "Comments"
    id = Column(String,unique=True,nullable=False,primary_key=True,index=True)
    text = Column(String,nullable=True)
    user_id = Column(String,ForeignKey("Users.id"),nullable=False)
    post_id = Column(String,ForeignKey("Posts.id"),nullable=False)

    user = relationship("User",backref="comments")
    post = relationship("Post",backref="comments")

    def to_dict(self):

        return {
            "id":self.id,
            "text": self.text,
            "user_id":self.user_id,
            "post_id":self.post_id
        }
    def __repr__(self):
        return f"<User(id={self.id}, text={self.text},user_id={self.user_id}, post_id={self.post_id})>"

class Like(Base):
    __tablename__ = "Likes"
    id = Column(String,unique=True,nullable=False,index=True,primary_key=True)
    user_id = Column(String,ForeignKey("Users.id"),nullable=False)
    post_id = Column(String,ForeignKey("Posts.id"),nullable=False)

    user = relationship("User",backref="likes")
    post = relationship("Post",backref="likes")




