from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv


load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL","sqlite:///./users.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread":False} if DATABASE_URL.startswith("sqlite") else {})

session = sessionmaker(autoflush=False,autocommit=False,bind=engine)

Base = declarative_base

