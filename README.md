
# NestJS CRUD API

A robust RESTful API built with [NestJS](https://nestjs.com), providing full CRUD operations for user management. This project leverages TypeORM for data persistence and PostgreSQL as the database engine.

---

## Project Overview

This API demonstrates best practices for building scalable, maintainable server-side applications using NestJS. It features:

- Modular architecture
- User CRUD endpoints
- Database integration with TypeORM & PostgreSQL
- Environment-based configuration
- Unit and e2e testing

---

## Technologies Used

- **NestJS** – Progressive Node.js framework
- **TypeORM** – ORM for TypeScript & JavaScript
- **PostgreSQL** – Relational database
- **Jest** – Unit testing framework

---

## Installation

```bash
# Clone the repository
git clone https://github.com/your-username/nestjs-crud-api.git
cd nestjs-crud-api

# Install dependencies
npm install
```

---

## Running the Application

### Development

```bash
npm run start:dev
```

---

## CRUD Endpoints (Users)

| Method | Endpoint           | Description           |
|--------|--------------------|----------------------|
| POST   | `/users`           | Create a new user    |
| GET    | `/users`           | Get all users        |
| GET    | `/users/:id`       | Get user by ID       |
| PUT    | `/users/:id`       | Update user by ID    |
| DELETE | `/users/:id`       | Delete user by ID    |

**Example Request:**

```http
POST /users
Content-Type: application/json

{
  "email": "john@example.com",
   "role":"admin"
}
```

## Running Unit Tests

```bash
npm run test
```

For test coverage:

```bash
npm run test:cov
```

---
