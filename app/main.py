from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import router
from database import init_db

app = FastAPI(title="Authentication API")

# CORS middleware connecting to the frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

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