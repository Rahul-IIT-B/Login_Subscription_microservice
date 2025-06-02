# Personal Blog Platform

A full-stack personal blog platform where users can sign up, log in, and post articles.  
Built with **Node.js/Express** (backend), **PostgreSQL** (database), and **Next.js 14 + TypeScript + Tailwind CSS** (frontend).  
Implements JWT authentication, secure password storage, and modern SSR/SSG features.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
- [Frontend Pages](#frontend-pages)
- [Security Considerations](#security-considerations)
- [Development Notes & Choices](#development-notes--choices)
- [Commands](#commands)

---

## Features

- User registration and login with JWT authentication
- Secure password hashing with bcrypt
- Authenticated users can create blog posts
- View all posts or filter by author
- Responsive, modern UI with Tailwind CSS and CSS modules
- Server-side rendering (SSR) for homepage
- Static generation (SSG) for individual blog posts
- Protected dashboard for managing user posts

---

## Tech Stack

- **Backend:** Node.js, Express, PostgreSQL, Sequelize ORM, JWT, bcryptjs
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, CSS Modules, Axios

---

## Project Structure

```
/backend
  /config         # DB config and connection
  /controllers    # Route handlers (auth, post)
  /middleware     # Auth, validation, error handling
  /models         # Sequelize models (User, Post)
  /routes         # Express routers (auth, post)
  /migrations     # Sequelize migrations
  /utils          # Utility functions
  server.js       # Entry point
  .env            # Environment variables

/frontend
  /src
    /app          # Next.js app directory (pages, layouts)
    /components   # Reusable UI components
    /context      # React context (Auth)
    /services     # API service (Axios)
    /styles       # CSS modules and global styles
  next.config.mjs
  tailwind.config.ts
  postcss.config.mjs
  tsconfig.json
  .eslintrc.json
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/personal_blog_platform.git
cd personal_blog_platform
```

### 2. Backend Setup

```bash
cd backend
npm install
```

- Create a `.env` file (see [Environment Variables](#environment-variables)).
- Ensure PostgreSQL is running and the database exists.
- Run migrations if needed.

**Start the backend:**
```bash
npm run dev    # For development (nodemon)
# or
npm start      # For production
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

- Create a `.env.local` file if you want to override `NEXT_PUBLIC_API_URL`.

**Start the frontend:**
```bash
npm run dev
```

- Frontend runs on: `http://localhost:3001` (or as configured)
- Backend runs on: `http://localhost:3000` (default)

---

## Environment Variables

### Backend (`backend/.env`)

```ini
PORT=3000
DB_NAME=subscription_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
```

### Frontend (`frontend/.env.local`)

```ini
NEXT_PUBLIC_API_URL=http://localhost:3000
```

---

## Database Models

### User

| Field        | Type    | Notes            |
| ------------ | ------- | ---------------- |
| id           | int     | Primary key      |
| email        | string  | Unique, required |
| passwordHash | string  | Hashed           |

### Post

| Field     | Type    | Notes                   |
| --------- | ------- | ----------------------- |
| id        | int     | Primary key             |
| title     | string  | Required                |
| content   | string  | Required                |
| authorId  | int     | Foreign key (User)      |
| createdAt | date    | Auto-generated          |

---

## API Endpoints

### Auth

- **POST `/signup`**  
  Registers a new user.  
  **Body:** `{ "email": "user@example.com", "password": "password123" }`

- **POST `/login`**  
  Authenticates a user and returns a JWT token.  
  **Body:** `{ "email": "user@example.com", "password": "password123" }`

### Posts

- **POST `/post`**  
  Create a new post (authenticated).  
  **Headers:** `Authorization: Bearer <jwt_token>`  
  **Body:** `{ "title": "My Post", "content": "Hello world" }`

- **GET `/posts`**  
  Get all posts.  
  **Query:** `?author=<userId>` to filter by author.

- **GET `/posts/:id`**  
  Get a single post by ID.

---

## Frontend Pages

- **/**  
  Homepage. Lists all blog posts (SSR).

- **/login**  
  Login page.

- **/signup**  
  Sign-up page.

- **/dashboard**  
  Private dashboard for posting articles and viewing user’s own posts (protected route).

- **/posts/[id]**  
  Individual blog post page (SSG).

---

## Security Considerations

- Passwords are hashed with bcrypt before storage.
- JWT tokens are used for authentication and sent in the `Authorization` header.
- Protected routes on both backend (middleware) and frontend (React context).
- JWT is stored only in cookies (next/headers) for improved security.
- On 401 responses, tokens are cleared and user is redirected to login.

---

## Development Notes & Choices

- **SSR** is used for the homepage for SEO and performance.
- **SSG** is used for individual post pages.
- **Tailwind CSS** and CSS modules are used for styling.
- **Responsive UI** for all major devices.
- **Code Quality:** ESLint and TypeScript strict mode are enabled.
- **Project Choices:**
  - Used Next.js 14 App Router for modern SSR/SSG and routing.
  - Used React Context for authentication state and protected routes.
  - Used Axios for API calls and interceptors for token management.
  - Modular backend with clear separation of concerns (controllers, middleware, routes, models).
  - JWT is stored only in cookies (next/headers) for improved security.

---

## Commands

### Backend

```bash
cd backend
npm install
npm run dev    # Development
npm start      # Production
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Running the Application

1. Start PostgreSQL and ensure the database is created.
2. Start the backend (`npm run dev` in `/backend`).
3. Start the frontend (`npm run dev` in `/frontend`).
4. Visit `http://localhost:3001` (or as configured) to use the app.

---