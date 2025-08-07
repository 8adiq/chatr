# chatr

A fullstack application with a FastAPI backend and a React (Vite) frontend. Supports user registration, login, JWT-based authentication, profile viewing, and social features like posts, comments, and likes.

## 🌐 Live Demo

**Live Application:** [https://basic-user.onrender.com/](https://basic-user.onrender.com/)

*Experience the full application with user registration, authentication, and social features.*

---

## Features
- User registration with email, username, and password
- User login with JWT token authentication
- Profile endpoint (protected)
- Social features: posts, comments, and likes
- Passwords securely hashed (bcrypt)
- CORS enabled for frontend-backend communication
- Modern React frontend (Vite)

---

## Project Structure
```
auth-app-fastapi/
  ├── app/                    # FastAPI backend
  │   ├── main.py             # FastAPI application entry point
  │   ├── models.py           # SQLAlchemy models (User, Post, Comment, Like)
  │   ├── schema.py           # Pydantic schemas
  │   ├── routes.py           # API endpoints
  │   ├── auth.py             # Authentication utilities
  │   ├── database.py         # Database configuration
  │   ├── service.py          # Business logic
  │   └── test.py             # Test suite
  ├── auth-app-frontend/      # React frontend
  ├── migrations/             # Database migrations (Alembic)
  ├── requirements.txt        # Python dependencies
  ├── manage_migrations.py    # Migration management script
  ├── reset_database.py       # Database reset utility
  ├── alembic.ini             # Alembic configuration
  ├── users.db                # SQLite database
  └── README.md               # This file
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

3. **Database setup:**
   ```bash
   # Initialize migrations (first time only)
   python manage_migrations.py init
   
   # Create and apply migrations
   python manage_migrations.py migrate "Initial migration"
   python manage_migrations.py upgrade
   ```

4. **Run the backend:**
   ```bash
   uvicorn app.main:app --reload
   ```
   - The API will be available at `http://127.0.0.1:8000`
   - Interactive docs: `http://127.0.0.1:8000/docs`

---

## Database Management

### Migrations
- **Create migration:** `python manage_migrations.py migrate "Description"`
- **Apply migrations:** `python manage_migrations.py upgrade`
- **Rollback migration:** `python manage_migrations.py downgrade`
- **Check current:** `python manage_migrations.py current`
- **View history:** `python manage_migrations.py history`


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
- Register a new user
- Log in with your credentials
- View your profile after authentication
- Create posts, add comments, and like content
- Log out to end your session

---

## API Endpoints

### Authentication
- `POST /api/register` — Register a new user
- `POST /api/login` — Log in and receive JWT token

### User Management
- `GET /api/profile` — Get current user profile (requires `Authorization: Bearer <token>`)

### Social Features
- `GET /api/posts` — Get all posts
- `POST /api/posts` — Create a new post (requires authentication)
- `GET /api/posts/{post_id}` — Get specific post
- `PUT /api/posts/{post_id}` — Update post (requires ownership)
- `DELETE /api/posts/{post_id}` — Delete post (requires ownership)

- `POST /api/posts/{post_id}/comments` — Add comment to post
- `GET /api/posts/{post_id}/comments` — Get comments for post
- `PUT /api/comments/{comment_id}` — Update comment (requires ownership)
- `DELETE /api/comments/{comment_id}` — Delete comment (requires ownership)

- `POST /api/posts/{post_id}/like` — Like/unlike a post
- `GET /api/posts/{post_id}/likes` — Get likes for a post

---

## Testing

Run the test suite:
```bash
python app/test.py
```

The test suite covers:
- User registration and authentication
- JWT token validation
- Protected endpoint access
- Social features (posts, comments, likes)
- Error handling and edge cases

---

## Notes
- Make sure the backend is running before using the frontend
- The frontend expects the backend at `http://127.0.0.1:8000` (update `src/api.js` if needed)
- Passwords must be at least 6 characters
- Database migrations are managed with Alembic
- All social features require authentication

---

## License
MIT 
