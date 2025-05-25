# Subscription Backend Service

A microservice for managing user subscriptions and plans for a SaaS platform.  
Implements JWT authentication, PostgreSQL persistence, RabbitMQ events, and follows MVC architecture.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Setup Instructions](#setup-instructions)
- [Environment Variables](#environment-variables)
- [Database Models](#database-models)
- [API Endpoints](#api-endpoints)
  - [Auth](#auth)
  - [Plans](#plans)
  - [Subscriptions](#subscriptions)
- [Error Handling](#error-handling)
- [Bonus Features](#bonus-features)
- [Postman Usage Guide](#postman-usage-guide)
- [Notes](#notes)

---

## Features

- User registration and login with JWT authentication
- CRUD for user subscriptions (with userId in path, as required)
- Subscription plan management
- Subscription status: ACTIVE, INACTIVE, CANCELLED, EXPIRED
- Automatic expiry of subscriptions
- Retry logic for DB writes
- RabbitMQ integration for subscription events
- Modular MVC codebase

---

## Tech Stack

- **Node.js** (Express)
- **PostgreSQL** (Sequelize ORM)
- **RabbitMQ** (amqplib)
- **JWT** for authentication
- **bcryptjs** for password hashing

---

## Folder Structure

```
/controllers         # Route handlers (auth, plan, subscription)
  authController.js
  planController.js
  subscriptionController.js
/models              # Sequelize models
  index.js
  user.js
  plan.js
  subscription.js
/routes              # Express routers
  authRoutes.js
  planRoutes.js
  subscriptionRoutes.js
/middleware          # Auth, validation, error handling
  auth.js
  validation.js
  errorHandler.js
/services            # Business logic (subscriptionService.js)
/config              # DB and RabbitMQ config
  db.js
  rabbitmq.js
/utils               # Utility functions (retry.js)
server.js            # Entry point
.env                 # Environment variables
```

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd subscription_backend_assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the root directory:

```ini
PORT=3000
DB_NAME=subscription_db
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
JWT_SECRET=your_jwt_secret
RABBITMQ_URL=amqp://localhost
NODE_ENV=development
```

### 4. Start PostgreSQL and RabbitMQ

- Ensure PostgreSQL is running and a database named as in `DB_NAME` exists.
- Ensure RabbitMQ is running (or comment out RabbitMQ code if not using).

### 5. Start the server

```bash
npm run dev    # For development (nodemon)
# or
npm start      # For production
```

Server runs on: `http://localhost:3000` (or your specified port)

---

## Environment Variables

| Variable     | Description                | Example          |
| ------------ | -------------------------- | ---------------- |
| PORT         | Server port                | 3000             |
| DB_NAME      | PostgreSQL database name   | subscription_db  |
| DB_USER      | PostgreSQL user            | postgres         |
| DB_PASSWORD  | PostgreSQL password        | yourpassword     |
| DB_HOST      | PostgreSQL host            | localhost        |
| JWT_SECRET   | JWT signing secret         | your_jwt_secret  |
| RABBITMQ_URL | RabbitMQ connection string | amqp://localhost |

---

## Database Models

### User

| Field    | Type   | Notes            |
| -------- | ------ | ---------------- |
| id       | int    | Primary key      |
| name     | string | Required         |
| email    | string | Unique, required |
| password | string | Hashed           |

### Plan

| Field    | Type   | Notes            |
| -------- | ------ | ---------------- |
| id       | int    | Primary key      |
| name     | string | Unique, required |
| price    | float  | Required         |
| features | array  | Required         |
| duration | int    | Days             |

### Subscription

| Field     | Type | Notes                                |
| --------- | ---- | ------------------------------------ |
| id        | int  | Primary key                          |
| status    | enum | ACTIVE, INACTIVE, CANCELLED, EXPIRED |
| startDate | date |                                      |
| endDate   | date |                                      |
| UserId    | int  | Foreign key                          |
| PlanId    | int  | Foreign key                          |

---

## API Endpoints

### Auth

#### **POST /auth/register**

Register a new user and receive a JWT and userId.

**Request Body:**

```json
{
  "name": "Alice",
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "<jwt_token>",
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com" }
}
```

#### **POST /auth/login**

Login and receive a JWT and userId.

**Request Body:**

```json
{
  "email": "alice@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "token": "<jwt_token>",
  "user": { "id": 1, "name": "Alice", "email": "alice@example.com" }
}
```

---

### Plans

#### **GET /plans**

Get all available subscription plans.

**Response:**

```json
[
  {
    "id": 1,
    "name": "Basic",
    "price": 9.99,
    "features": ["Feature A", "Feature B"],
    "duration": 30
  },
  ...
]
```

---

### Subscriptions

> **All subscription endpoints require JWT in the `Authorization` header:**  
> `Authorization: Bearer <jwt_token>`

#### **POST /subscriptions**

Create a new subscription for the authenticated user.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{ "planId": 1 }
```

**Response:**

```json
{
  "message": "Subscription created",
  "subscription": {
    "id": 1,
    "UserId": 1,
    "PlanId": 1,
    "status": "ACTIVE",
    "startDate": "...",
    "endDate": "..."
  }
}
```

---

#### **GET /subscriptions/:userId**

Get the subscription for a user.  
**Note:** Only the user themselves can access this endpoint (ownership enforced).

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Example:**  
`GET /subscriptions/1`

**Response:**

```json
{
  "id": 1,
  "status": "ACTIVE",
  "startDate": "...",
  "endDate": "...",
  "plan": { "name": "...", "price": ..., "features": [...], "duration": ... }
}
```

---

#### **PUT /subscriptions/:userId**

Update (change plan) for a user's subscription.  
**Note:** Only the user themselves can access this endpoint.

**Headers:**

```
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Request Body:**

```json
{ "planId": 2 }
```

**Example:**  
`PUT /subscriptions/1`

**Response:**  
Returns updated subscription object.

---

#### **DELETE /subscriptions/:userId**

Cancel a user's subscription.  
**Note:** Only the user themselves can access this endpoint.

**Headers:**

```
Authorization: Bearer <jwt_token>
```

**Example:**  
`DELETE /subscriptions/1`

**Response:**  
Returns cancelled subscription object.

---

## Error Handling

- All errors return JSON with `success: false` and a message.
- Example:
  ```json
  {
    "success": false,
    "message": "Invalid credentials"
  }
  ```

---

## Bonus Features

- **Retry logic** All critical database operations are wrapped in (`utils/retry.js`)
  - Behavior: Up to 3 attempts per operation, with a 500 ms back-off between retries.
  - See utils/retry.js for configuration and error-handling details.
- **RabbitMQ** events for subscription changes (`config/rabbitmq.js`)
- **Clustering** The server uses Node’s cluster module to fork worker processes equal to the number of CPU cores for multi-core scalability (`server.js`)
- **Automatic subscription expiry** (runs hourly) and when subscription is retrieved, a check of expiry for the user is performed.

---

## Postman Usage Guide

### 1. Register a user to get JWT token and userId

- **POST** `http://localhost:3000/auth/register`
- **Body:**
  ```json
  {
    "name": "Alice",
    "email": "alice@example.com",
    "password": "password123"
  }
  ```

### 2. Login to get JWT token and userId

- **POST** `http://localhost:3000/auth/login`
- **Body:**
  ```json
  {
    "email": "alice@example.com",
    "password": "password123"
  }
  ```
- **Copy the `token` and `userId` from the response.**

### 3. Use JWT token for all subscription endpoints

- In Postman, set header:

  ```
  Authorization: Bearer <your_token>
  ```

- **Get your userId** from the login/register response (`user.id`).

### 4. Example: Create a subscription

- **POST** `http://localhost:3000/subscriptions`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Body:**
  ```json
  { "planId": 1 }
  ```

### 5. Example: Get your subscription

- **GET** `http://localhost:3000/subscriptions/<your_user_id>`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  ```

### 6. Example: Update your subscription

- **PUT** `http://localhost:3000/subscriptions/<your_user_id>`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  Content-Type: application/json
  ```
- **Body:**
  ```json
  { "planId": 2 }
  ```

### 7. Example: Cancel your subscription

- **DELETE** `http://localhost:3000/subscriptions/<your_user_id>`
- **Headers:**
  ```
  Authorization: Bearer <your_token>
  ```

## Note:

#### When NODE_ENV="production", all HTTP requests are 301‐redirected to HTTPS. In local Postman or dev environments without TLS, set NODE_ENV="development" to avoid SSL handshake errors.

---
