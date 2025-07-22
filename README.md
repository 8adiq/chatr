# Auth App (FastAPI + React)

A fullstack authentication application with a FastAPI backend and a React (Vite) frontend. Supports user registration, login, JWT-based authentication, and profile viewing.

---

## Features
- User registration with email, username, and password
- User login with JWT token authentication
- Profile endpoint (protected)
- Passwords securely hashed (bcrypt)
- CORS enabled for frontend-backend communication
- Modern React frontend (Vite)

---

## Project Structure
```
auth-app-fastapi/
  ├── app/                # FastAPI backend
  ├── auth-app-frontend/  # React frontend
  ├── requirements.txt    # Python dependencies
  ├── users.db            # SQLite database
  └── README.md           # This file
```

---

## Backend Setup (FastAPI)

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```
2. **Set environment variables:**
   - Create a `.env` file in `app/` with:
     ```env
     SECRET_KEY=your_secret_key
     DATABASE_URL=sqlite:///../users.db
     CORS_ALLOWED_ORIGINS=http://localhost:5173
     ```
3. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload
   ```
   - The API will be available at `http://127.0.0.1:8000`
   - Interactive docs: `http://127.0.0.1:8000/docs`

---

## Frontend Setup (React)

1. **Install dependencies:**
   ```bash
   cd auth-app-frontend
   npm install
   ```
2. **Start the frontend:**
   ```bash
   npm run dev
   ```
   - The app will run at `http://localhost:5173`

---

## Usage
- Register a new user.
- Log in with your credentials.
- View your profile after authentication.
- Log out to end your session.

---

## API Endpoints
- `POST /api/register` — Register a new user
- `POST /api/login` — Log in and receive JWT token
- `GET /api/profile` — Get current user profile (requires `Authorization: Bearer <token>`)

---

## Notes
- Make sure the backend is running before using the frontend.
- The frontend expects the backend at `http://127.0.0.1:8000` (update `src/api.js` if needed).
- Passwords must be at least 6 characters.

---

## License
MIT 