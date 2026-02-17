# Full-Stack Authentication System

A production-style full-stack authentication system built using React (Vite), Node.js, Express, MongoDB, and JWT.

This project demonstrates secure authentication practices including access tokens, refresh tokens, protected routes, password hashing, and a modern SaaS-style dashboard UI.

---

## Introduction

This project implements a complete authentication flow with:

- User signup and login
- JWT-based authentication
- Access & refresh token mechanism
- Automatic token refresh using Axios interceptors
- Protected frontend and backend routes
- Secure password hashing with bcrypt
- Modern SaaS-style profile dashboard

---

## Tech Stack

Frontend:
- React (Vite)
- Tailwind CSS v4
- shadcn/ui
- Axios
- React Router

Backend:
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (jsonwebtoken)
- bcrypt

---

## Features

Authentication:
- Secure user registration
- Strong password validation
- Password hashing using bcrypt
- Login with JWT access and refresh tokens
- Automatic access token refresh
- Logout functionality

Security:
- Protected backend routes via middleware
- Protected frontend routes
- Refresh token mechanism
- Sensitive data excluded from responses
- Password never returned from database

Frontend:
- Modern SaaS-style UI
- Dynamic profile dashboard
- Avatar generated from username
- Responsive layout
- Clean component structure
- Axios interceptor for auto refresh

---

## Project Structure

```
Authentication_System/
├── client/
│   ├── .gitignore
│   ├── components.json
│   ├── eslint.config.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── README.md
│   ├── tailwind.config.js
│   ├── vite.config.js
│   ├── public/
│   └── src/
│       ├── App.css
│       ├── App.jsx
│       ├── index.css
│       ├── main.jsx
│       ├── components/
│       │   ├── ProtectedRoute.jsx
│       │   └── ui/
│       │       ├── badge.jsx
│       │       ├── button.jsx
│       │       ├── card.jsx
│       │       ├── input.jsx
│       │       ├── label.jsx
│       │       ├── separator.jsx
│       │       └── toast-message.jsx
│       ├── lib/
│       │   ├── auth-validation.js
│       │   └── utils.js
│       ├── pages/
│       │   ├── Login.jsx
│       │   ├── Profile.jsx
│       │   └── Signup.jsx
│       └── services/
│           └── api.js
└── server/
    ├── .env
    ├── .gitignore
    ├── app.js
    ├── package.json
    ├── readME.md
    ├── server.js
    ├── controllers/
    │   └── authController.js
    ├── middleware/
    │   └── authMiddleware.js
    ├── models/
    │   └── User.js
    ├── routes/
    │   └── authRoutes.js
    └── utils/
        └── token.js
```

## Environment Variables

Create a `.env` file inside `server/`:

PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

ACCESS_TOKEN_EXPIRES_IN=15m

REFRESH_TOKEN_EXPIRES_IN=7d


---

## Installation

Clone repository: git clone <your-repo-url>


Install backend: cd server
npm install

Install frontend:

cd client
npm install


---

## Running the Application

Start backend:

cd server
npm run dev


Start frontend:



cd client
npm run dev

Frontend runs on:
http://localhost:5173

Backend runs on:
http://localhost:5000

---

## API Routes

Auth Routes:

POST   /api/auth/signup  
POST   /api/auth/login  
POST   /api/auth/refresh  
GET    /api/auth/profile  

---

## How Authentication Works

1. User logs in.
2. Backend generates:
   - Short-lived Access Token
   - Long-lived Refresh Token
3. Access token is attached to protected requests.
4. If access token expires:
   - Axios interceptor calls refresh endpoint.
   - New access token is issued.
   - Original request retries automatically.
5. If refresh token expires:
   - User is logged out.

---

## Evaluation Criteria Met

- Frontend and backend integrated
- JWT + refresh tokens secure
- Passwords hashed with bcrypt
- Protected routes implemented
- Modern profile dashboard built

---

## Future Improvements (Optional)

- HttpOnly refresh token cookies
- Role-based access control
- Email verification
- Password reset flow
- Dark mode support

---

## Author
Sarthak Garai

Built as part of an internship-level full-stack authentication project.






