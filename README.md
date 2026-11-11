# Online Notes Management System

A small MERN app (MongoDB, Express, React, Node) where students can register, log in, and add, edit, delete, search and categorize their study notes.

## Folder structure

```
backend/                 Node + Express API
  server.js              starts the server, connects to MongoDB
  models/User.js         user schema (name, email, hashed password)
  models/Note.js         note schema (title, content, category, user)
  middleware/auth.js     checks the login token
  routes/auth.js         POST /api/auth/register, /api/auth/login
  routes/notes.js        GET/POST/PUT/DELETE /api/notes
frontend/                React app (Vite)
  src/App.jsx            decides: show login form or notes page
  src/AuthForm.jsx       login + register form
  src/Notes.jsx          add / edit / delete / search / filter notes
  src/api.js             helper for calling the backend
```

## How to run

You need Node.js and MongoDB (local MongoDB or a free MongoDB Atlas link).

1. Backend (terminal 1)
   ```
   cd backend
   npm install
   npm start
   ```
   Edit `backend/.env` if your MongoDB address is different.

2. Frontend (terminal 2)
   ```
   cd frontend
   npm install
   npm run dev
   ```
   Open http://localhost:5173

## How it works (short)

- Register/Login: password is hashed with bcrypt; the server returns a JWT token, which the browser saves and sends with every request.
- Each note belongs to one user, so users only see their own notes.
- Search and category filter are done by the backend: `GET /api/notes?search=word&category=Maths`.
