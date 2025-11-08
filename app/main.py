from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError
from datetime import datetime
import os
import logging
from database.main import init_db
from app.config import settings

# setting up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Authentication API")



# Global exception handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request : Request, exc : RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
             "error": "Validation Error",
            "message": "Invalid input data",
            "details": exc.errors()
        }
    )

@app.exception_handler(SQLAlchemyError)
async def database_exception_handler(request:Request, exc : SQLAlchemyError):
    logger.error(f"Database error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Database Error",
            "message": "An internal database error occurred"
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request:Request,exc : Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal Server Error",
            "message": "An unexpected error occurred"
        }
    )

allowed_origins = settings.cors_allowed_origins.split(",")

# CORS middleware connecting to the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Include modular routers
from app.auth.routes import router as auth_router
from app.users.routes import router as users_router
from app.posts.routes import router as posts_router
from app.comments.routes import router as comments_router
from app.likes.routes import router as likes_router

app.include_router(auth_router, prefix='/api', tags=['auth'])
app.include_router(users_router, prefix='/api', tags=['users'])
app.include_router(posts_router, prefix='/api', tags=['posts'])
app.include_router(comments_router, prefix='/api', tags=['comments'])
app.include_router(likes_router, prefix='/api', tags=['likes'])


@app.get("/health")
async def health_check():
    """Health check endpoint for monitoring"""
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}

@app.on_event("startup")
async def startup():
    """ initializing database on startup"""
    init_db()

# app.mount("/", StaticFiles(directory="auth-app-frontend/dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True) 