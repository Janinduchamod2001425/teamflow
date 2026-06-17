# 🚀 TeamFlow Backend

<p align="left">
  <b>Modern Project Management & Team Collaboration Platform API</b>
</p>

<p align="left">
Built with NestJS • Prisma • PostgreSQL • Redis • Socket.IO
</p>

---

## 📖 Overview

TeamFlow Backend is a scalable and modular REST API designed for modern team collaboration and project management. It provides secure authentication, workspace management, project and task tracking, real-time notifications, activity logging, dashboard analytics, file attachments, and Redis-powered caching.

The project follows clean architecture principles using NestJS modules, Prisma ORM, PostgreSQL, and JWT authentication while supporting real-time communication through Socket.IO.

---

# ✨ Features

## 🔐 Authentication & Authorization

- JWT Authentication
- User Registration & Login
- Protected Routes
- Current User API
- Role-Based Access Control (RBAC)
- Workspace-Level Permissions

---

## 👤 User Management

- User CRUD Operations
- User Profile Management
- Avatar Support
- Workspace Membership

---

## 🏢 Workspace Management

- Create Workspaces
- Update Workspaces
- Delete Workspaces
- Invite Members
- Update Member Roles
- Member Listing

Supported Roles:

- ADMIN
- MANAGER
- MEMBER

---

## 📁 Project Management

- Create Projects
- Update Projects
- Delete Projects
- List Projects
- Workspace Project Organization

---

## ✅ Task Management

- Create Tasks
- Update Tasks
- Delete Tasks
- Task Assignment
- Status Updates

Task Status

- TODO
- IN_PROGRESS
- REVIEW
- DONE

Priority Levels

- LOW
- MEDIUM
- HIGH

---

## 📋 Kanban Board API

Retrieve tasks grouped by status for Kanban visualization.

```
TODO
IN_PROGRESS
REVIEW
DONE
```

---

## 🔍 Advanced Search & Filtering

Supports

- Keyword Search
- Status Filter
- Priority Filter
- Assignee Filter
- Project Filter
- Due Date Filter
- Pagination
- Sorting

---

## 💬 Comments

- Create Comments
- Update Comments
- Delete Comments
- Retrieve Task Comments

---

## 🔔 Notifications

Persistent Notifications

- Workspace Invitations
- Task Assignments
- Task Updates
- Status Changes
- Comment Notifications

Real-Time Notifications

- Socket.IO
- User Rooms
- Workspace Rooms

Additional APIs

- Get Notifications
- Unread Count
- Mark as Read
- Mark All as Read

---

## 📊 Dashboard Analytics

Workspace Dashboard includes

- Total Projects
- Total Members
- Total Tasks
- Completed Tasks
- Overdue Tasks
- Completion Rate
- Task Status Summary
- Recent Activities

---

## 📝 Activity Logging

Automatically records

- Workspace Events
- Project Events
- Task Events
- Comment Events

---

## 📎 File Attachments

Supports

- Upload Attachments
- Retrieve Attachments
- Delete Attachments

---

## ⚡ Redis Caching

Dashboard API caching

Automatic cache invalidation after

- Project Updates
- Task Updates
- Comment Updates
- Workspace Changes

---

# 🏗 Architecture

```
                    Next.js Frontend
                           │
                           ▼
                    NestJS Backend API
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
        ▼                  ▼                  ▼
    PostgreSQL         Redis Cache       Socket.IO
        │
        ▼
    Prisma ORM
```

---

# 🛠 Tech Stack

### Backend

- NestJS
- TypeScript
- Prisma ORM
- PostgreSQL

### Authentication

- JWT
- bcrypt

### Real-Time

- Socket.IO

### Validation

- class-validator
- class-transformer

### Documentation

- Swagger / OpenAPI

### Cache

- Redis
- ioredis

### File Upload

- Multer

### Containerization

- Docker
- Docker Compose

---

# 📂 Project Structure

```
src/

├── auth/
├── users/
├── workspaces/
├── workspace-members/
├── workspace-access/
├── projects/
├── tasks/
├── comments/
├── activities/
├── notifications/
├── attachments/
├── dashboard/
├── cache/
├── prisma/
├── common/
└── health/
```

---

# 📡 REST API Modules

```
Authentication

POST    /auth/register
POST    /auth/login
GET     /auth/me

Users

GET
POST
PATCH
DELETE

Workspaces

Create
Update
Delete
Members

Projects

CRUD

Tasks

CRUD
Kanban
Search
Status Update

Comments

CRUD

Notifications

Get All
Unread Count
Mark Read
Mark All Read

Dashboard

Workspace Analytics

Attachments

Upload
List
Delete
```

---

# 🔐 Role-Based Permissions

| Feature | Admin | Manager | Member |
|---------------|---------|------------|------------|
| Workspace Management | ✅ | ❌ | ❌ |
| Invite Members | ✅ | ❌ | ❌ |
| Manage Projects | ✅ | ✅ | ❌ |
| Manage Tasks | ✅ | ✅ | ✅ |
| Comments | ✅ | ✅ | ✅ |

---

# 📈 Dashboard Response

```json
{
  "overview": {
    "totalProjects": 10,
    "totalMembers": 12,
    "totalTasks": 150,
    "completedTasks": 85,
    "overdueTasks": 7,
    "completionRate": 56
  },
  "tasksByStatus": {
    "TODO": 25,
    "IN_PROGRESS": 40,
    "REVIEW": 15,
    "DONE": 70
  },
  "recentActivities": []
}
```

---

# 🚀 Getting Started

## Clone

```bash
git clone https://github.com/yourusername/teamflow-backend.git

cd backend
```

---

## Install

```bash
pnpm install
```

---

## Environment Variables

Create

```
.env
```

Example

```env
DATABASE_URL="postgresql://teamflow_user:teamflow_pass@localhost:5432/teamflow_db"

JWT_SECRET=your_super_secret_key

JWT_EXPIRES_IN=7d
```

---

## Database

```bash
pnpm prisma migrate dev

pnpm prisma generate
```

---

## Run

```bash
pnpm start:dev
```

---

# 🐳 Docker

Start services

```bash
docker compose up -d
```

Services

```
PostgreSQL

Redis

PgAdmin
```

PgAdmin

```
http://localhost:5050
```

---

# 📖 Swagger

```
http://localhost:3000/api/docs
```

Interactive API documentation for every endpoint.

---

# ⚡ Performance Features

- Redis Dashboard Cache
- Automatic Cache Invalidation
- Optimized Prisma Queries
- Modular Architecture
- Workspace-Based Authorization

---

# 🔄 Real-Time Features

Socket.IO

```
Workspace Rooms

User Rooms

Instant Notifications

Live Collaboration
```

---

# 📚 Future Improvements

- Email Notifications
- AWS S3 File Storage
- Background Jobs
- Rate Limiting
- Unit Tests
- Integration Tests
- CI/CD Deployment
- Kubernetes Support

---

# 👨‍💻 Author

**Janindu Chamod**

Software Engineering Undergraduate

Full Stack Developer

---

# ⭐ Project Status

✅ Backend API Completed

✅ Authentication

✅ Project Management

✅ Task Management

✅ Dashboard Analytics

✅ Redis Caching

✅ Socket.IO Notifications

✅ File Attachments

✅ PostgreSQL + Prisma

✅ Docker Support

Ready for Vue.js Frontend Development 🚀