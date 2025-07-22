from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
from .routes import router
from .database import init_db

app = FastAPI(title="Authentication API")

app.mount("/", StaticFiles(directory="auth-app-frontend/dist", html=True), name="static")

allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "http://localhost:5173").split(",")

# CORS middleware connecting to the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(router,prefix='/api')

@app.on_event("startup")
async def startup():
    """ initializing database on startup"""
    init_db()

@app.get("/")
async def root():
    return {"message": "Authentication API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)