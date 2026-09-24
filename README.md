# KPI Express REST API

A RESTful API built with Express.js and Prisma ORM for tracking and managing employee performance data. This backend service is designed to support KPI (Key Performance Indicator) evaluation by centralizing four core areas of employee data: attendance, project and task management, and behavioral assessment.

This project is built as a decoupled backend. It does not render any HTML views. Instead, it exposes a set of JSON endpoints that any frontend application can consume, whether that frontend is built with React, Vue, Angular, or a mobile client.

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Core Features](#core-features)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Authentication](#authentication)
- [API Endpoints Overview](#api-endpoints-overview)
- [Connecting a Frontend Application](#connecting-a-frontend-application)
- [Development Notes](#development-notes)
- [Roadmap](#roadmap)

## Architecture Overview

This project follows a three-tier architecture. The backend, built with Express.js on top of Node.js, sits between the frontend application and the database. It exposes a REST API, meaning all communication happens over HTTP using standard methods (GET, POST, PUT, PATCH, DELETE) and JSON as the data format.

Because the backend is fully decoupled from the frontend, any frontend framework can be connected to it as long as it can send HTTP requests and read JSON responses.

![Application Architecture](docs/architecture.png)

As shown in the diagram above, the frontend layer (which can be built with React, Vue, Angular, or any other framework) communicates with the Node.js environment running Express.js. Express.js then queries the database, currently implemented with MySQL, though the same pattern applies to other relational or document databases.

## Tech Stack

- Runtime: Node.js
- Framework: Express.js
- ORM: Prisma
- Database: MySQL
- Authentication: JSON Web Token (JWT)
- Password Hashing: bcrypt

## Core Features

- User authentication with JWT, including login and logout
- Password hashing using bcrypt, so plain text passwords are never stored
- Employee management with unique validation for employee ID number and email
- Daily attendance tracking with check-in and check-out endpoints, including automatic late detection and duplicate-entry prevention for the same day
- Project management with a many-to-many relationship between projects and employees through a dedicated membership table
- Task management within each project, including task priority, status, and assignment to a specific employee
- Automatic calculation of task completion duration and deadline compliance, based on the recorded start and completion timestamps
- Periodic behavioral assessment for each employee, using a rating scale from very good to very poor, with an automatic scoring calculation
- Centralized error handling, so all endpoints return consistent JSON error responses

## Database Schema

The application currently uses seven interconnected tables:

- users: application accounts with role-based access (Admin, Manager, Employee)
- employees: master data for each employee
- attendances: daily attendance records, one entry per employee per day
- projects: project records with status and deadline tracking
- project_members: a pivot table connecting employees to the projects they are part of
- project_tasks: tasks belonging to a project, optionally assigned to an employee
- behaviors: periodic behavioral assessments for each employee

Relationships, unique constraints, and cascading deletes are defined in the Prisma schema file at `prisma/schema.prisma`. This file is the single source of truth for the database structure and should be reviewed before making any schema changes.

## Project Structure

```
kpi-express-rest-api/
├── docs/
│   └── architecture.png
├── generated/
│   └── prisma/                (auto-generated Prisma files, not committed)
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── src/
│   ├── config/
│   │   └── db.js              (Prisma client and database connection)
│   ├── controllers/            (request handling and response formatting)
│   ├── services/                (business logic and database queries)
│   ├── middlewares/
│   │   ├── auth.js             (JWT verification)
│   │   └── error-handler.js    (centralized error responses)
│   ├── routes/                  (endpoint definitions per module)
│   ├── app.js                   (Express app configuration)
│   └── server.js                 (application entry point)
├── .env                          (local environment variables, not committed)
├── .gitignore
├── package.json
└── README.md
```

The codebase follows a layered pattern inspired by MVC. Routes define the available endpoints, controllers handle the HTTP request and response, and services contain the actual business logic and database queries through Prisma. This separation keeps the codebase predictable and easier to extend as new modules are added.

## Installation

The following steps assume Node.js and a running MySQL server are already installed on your machine.

1. Clone the repository

```bash
git clone https://github.com/sona2503/kpi-express-rest-api.git
cd kpi-express-rest-api
```

2. Install dependencies

```bash
npm install
```

3. Create the database

Create an empty MySQL database. The name used throughout this documentation is `kpi`.

```sql
CREATE DATABASE kpi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

4. Configure environment variables

Copy the example file if one is provided, or create a new `.env` file in the project root as described in the next section.

5. Run database migrations

```bash
npx prisma migrate dev
npx prisma generate
```

This creates all required tables based on the schema defined in `prisma/schema.prisma` and generates the Prisma client used by the application.

## Environment Variables

Create a `.env` file in the project root with the following variables.

```
PORT=3000
DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/kpi"
JWT_SECRET="a-long-random-secret-string"
JWT_EXPIRES_IN="8h"
```

Notes on each variable:

- PORT: the port on which the Express server will listen
- DATABASE_URL: the MySQL connection string, including username, password, host, port, and database name
- JWT_SECRET: a secret key used to sign and verify authentication tokens. This should be a long, random, and unpredictable string, especially in production
- JWT_EXPIRES_IN: how long an issued token remains valid before the user needs to log in again

The `.env` file should never be committed to version control, since it contains credentials and secrets.

## Running the Application

Start the server in standard mode:

```bash
npm start
```

Or in development mode, which automatically restarts the server whenever a file changes:

```bash
npm run dev
```

Once running, the server will be available at:

```
http://localhost:3000
```

You can verify that the server is running correctly by requesting the health check endpoint:

```bash
curl http://localhost:3000/api/health
```

A successful response returns:

```json
{ "status": "ok" }
```

## Authentication

This API uses JWT for authentication. Since REST APIs are stateless by design, the server does not maintain session data. Instead, the client is responsible for storing the token returned after login and attaching it to every subsequent request that requires authentication.

Login request:

```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"your_username","password":"your_password"}'
```

A successful login returns a token along with basic user information:

```json
{
  "message": "Login berhasil",
  "token": "your.jwt.token",
  "user": { "id": 1, "username": "your_username", "role": "ADMIN" }
}
```

For any protected endpoint, include the token in the Authorization header:

```
Authorization: Bearer your.jwt.token
```

Logging out on the client side simply means discarding the stored token, since the token itself remains valid until it expires or the server implements a token revocation mechanism.

## API Endpoints Overview

All endpoints are prefixed with `/api`. Endpoints marked as protected require a valid JWT in the Authorization header.

| Module | Method | Endpoint | Protected | Description |
|---|---|---|---|---|
| Auth | POST | /login | No | Authenticate and receive a token |
| Auth | POST | /logout | Yes | Invalidate the session on the client side |
| Users | POST | /users | No | Create a new user account |
| Users | DELETE | /users/:id | No | Delete a user account |
| Employees | GET | /employees | Yes | List all employees |
| Employees | GET | /employees/:id | Yes | Get a single employee |
| Employees | POST | /employees | Yes | Create a new employee |
| Employees | PUT | /employees/:id | Yes | Update an employee |
| Employees | DELETE | /employees/:id | Yes | Delete an employee |
| Attendance | GET | /attendances | Yes | List attendance records |
| Attendance | POST | /attendances/check-in | Yes | Record a check-in for today |
| Attendance | PATCH | /attendances/:id/check-out | Yes | Record a check-out |
| Attendance | POST | /attendances | Yes | Manually create an attendance record |
| Projects | GET | /projects | Yes | List all projects |
| Projects | POST | /projects | Yes | Create a new project |
| Projects | POST | /projects/:id/members | Yes | Add an employee to a project |
| Projects | DELETE | /projects/:id/members/:employeeId | Yes | Remove an employee from a project |
| Tasks | GET | /tasks | Yes | List tasks, filterable by project, assignee, or status |
| Tasks | POST | /tasks | Yes | Create a new task |
| Tasks | PATCH | /tasks/:id/start | Yes | Mark a task as started |
| Tasks | PATCH | /tasks/:id/complete | Yes | Mark a task as completed |
| Behaviors | GET | /behaviors | Yes | List behavioral assessments |
| Behaviors | POST | /behaviors | Yes | Create a new assessment for a given period |
| Behaviors | GET | /employees/:employeeId/behaviors/average | Yes | Get the average behavior score for an employee |

This table summarizes the primary endpoints. For a complete and up-to-date reference, including request bodies and response formats, refer to the route definitions in `src/routes/` and their corresponding controllers.

## Connecting a Frontend Application

Since this API does not render any views, connecting a frontend requires only that the frontend application can send HTTP requests and handle JSON responses. The following points apply regardless of which frontend framework is used.

Base URL: during local development, the API is available at `http://localhost:3000/api`. This should be stored as a configurable environment variable in the frontend project, so it can be changed when the API is deployed to a different environment.

Authentication flow: after a successful login, store the returned token on the client side, for example in memory, a secure cookie, or local storage depending on the security requirements of your frontend application. Attach this token as a Bearer token in the Authorization header for every request to a protected endpoint.

CORS: if the frontend application runs on a different origin than the API, such as a React application running on `http://localhost:5173`, Cross-Origin Resource Sharing must be enabled on the server. The `cors` package can be installed and configured in `src/app.js` to allow requests from the frontend's origin.

Error handling: all error responses follow a consistent JSON structure with a `message` field, along with an appropriate HTTP status code, such as 400 for invalid input, 401 for authentication failures, 404 for missing resources, and 409 for conflicts such as duplicate entries. Frontend applications should handle these status codes explicitly rather than relying solely on the response body.

Suggested integration steps for a new frontend project:

1. Set up an HTTP client, such as Axios or the native Fetch API
2. Create a base API configuration that reads the backend URL from an environment variable
3. Implement a login screen that calls the login endpoint and stores the returned token
4. Attach the stored token to all subsequent requests through an interceptor or a shared request wrapper
5. Build the remaining screens around the available endpoints listed above

## Development Notes

This project uses Prisma's `prisma-client-js` generator, which outputs the generated client into `node_modules/@prisma/client`. Any change to `prisma/schema.prisma` requires running both a migration and a client regeneration:

```bash
npx prisma migrate dev --name describe_your_change
npx prisma generate
```

The server must be restarted after regenerating the Prisma client, since the client is loaded once when the application starts.

Raw SQL queries are also supported through Prisma's `$queryRaw` and `$executeRaw` methods, for cases where a query is easier to express directly in SQL rather than through the standard Prisma query API.

## Roadmap

The following areas are being considered for future development:

- Role-based authorization middleware, restricting certain endpoints based on user role
- A dedicated periods table for behavioral assessments, replacing the current plain string format
- Automated tests for services and controllers
- API documentation generated with a tool such as Swagger or Postman's published documentation
- Deployment configuration for a cloud environment
