# Mini Job Queue Dashboard

A full-stack **Job Queue Management Dashboard** built with **React.js**,
**NestJS**, and **PostgreSQL**.

This project was developed as a React + NestJS internship assignment.
The application demonstrates frontend state management, REST API design,
database persistence, validation, error handling, job status
transitions, and safe handling of concurrent status updates.

------------------------------------------------------------------------

## 📌 Project Overview

The Mini Job Queue Dashboard allows users to:

-   Create jobs
-   View all jobs
-   Search jobs
-   Filter jobs by status
-   View job counts
-   Start pending jobs
-   Complete running jobs
-   Mark running jobs as failed
-   Delete jobs
-   See loading and API error states
-   Safely handle concurrent status update requests

The project is intentionally kept focused on the assignment requirements
rather than adding unnecessary complexity.

------------------------------------------------------------------------

## ✨ Features

### Dashboard

The dashboard provides an overview of the job queue.

It displays:

-   Total jobs
-   Pending jobs
-   Running jobs
-   Completed jobs
-   Failed jobs
-   Recent jobs
-   Job search
-   Status filtering
-   Create Job form
-   Status legend

------------------------------------------------------------------------

### Create Job

Users can create a new job by providing:

-   Job Title
-   Job Type

Example:

``` text
Job Title: Generate Monthly Report
Job Type: Report
```

A newly created job starts with:

``` text
pending
```

The backend automatically assigns:

-   `id`
-   `status`
-   `createdAt`

------------------------------------------------------------------------

### All Jobs

The All Jobs page displays all jobs stored in PostgreSQL.

It supports:

-   Search by job title
-   Search by job type
-   Filter by status
-   Status updates
-   Job deletion
-   Loading state
-   Empty state
-   API error state

------------------------------------------------------------------------

## 🔄 Job Status State Machine

A job follows a controlled lifecycle:

``` text
              ┌──────────────┐
              │   PENDING    │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │   RUNNING    │
              └──────┬───────┘
                     │
              ┌──────┴──────┐
              ▼             ▼
       ┌────────────┐  ┌────────────┐
       │ COMPLETED  │  │   FAILED   │
       └────────────┘  └────────────┘
```

Allowed transitions:

``` text
pending → running
running → completed
running → failed
```

Invalid transitions include:

``` text
pending → completed
pending → failed
completed → running
failed → running
completed → failed
failed → completed
```

Completed and failed jobs are terminal states.

------------------------------------------------------------------------

# 🛡️ Concurrency Handling

One of the important requirements of this project is handling two
requests that try to change the same job at nearly the same time.

For example:

``` text
Browser Tab A                 Browser Tab B
     │                              │
     │ Job = pending                │ Job = pending
     │                              │
     ├──── pending → running ──────►│
     │                              │
     │                              ├── pending → running
     │                              │
     ▼                              ▼
   SUCCESS                         CONFLICT
    200                              409
```

The state transition is enforced by the backend instead of relying on
the React frontend.

The update query checks the current database status:

``` sql
UPDATE jobs
SET status = 'running'
WHERE id = 1
AND status = 'pending';
```

Only one request can successfully update the matching row.

If another request tries to perform the same transition after the first
request has changed the status, no row is updated and the API returns a
conflict response.

This prevents an invalid or inconsistent state even if:

-   Two browser tabs send the request simultaneously
-   A user bypasses the React application
-   Someone calls the API directly

------------------------------------------------------------------------

# 🏗️ Technology Stack

## Frontend

-   React.js
-   Vite
-   React Router
-   Redux Toolkit
-   React Redux
-   Axios
-   Tailwind CSS
-   Lucide React
-   SweetAlert2

## Backend

-   NestJS
-   TypeScript
-   TypeORM
-   PostgreSQL
-   class-validator
-   class-transformer

## Development

-   Git
-   GitHub
-   npm

------------------------------------------------------------------------

# 📁 Project Structure

``` text
job-queue-dashboard/
│
├── backend/
│   ├── src/
│   │   ├── jobs/
│   │   │   ├── dto/
│   │   │   │   ├── create-job.dto.ts
│   │   │   │   └── update-job.dto.ts
│   │   │   ├── entities/
│   │   │   │   └── job.entity.ts
│   │   │   ├── jobs.controller.ts
│   │   │   ├── jobs.service.ts
│   │   │   └── jobs.module.ts
│   │   ├── app.controller.ts
│   │   ├── app.service.ts
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── layout/
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Header.jsx
│   │   │   │   └── DashboardLayout.jsx
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Select.jsx
│   │   │       ├── Badge.jsx
│   │   │       └── Modal.jsx
│   │   ├── features/
│   │   │   └── jobs/
│   │   │       ├── components/
│   │   │       ├── services/
│   │   │       └── store/
│   │   ├── pages/
│   │   │   ├── Dashboard/
│   │   │   ├── CreateJob/
│   │   │   └── AllJobs/
│   │   ├── services/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── constants/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── .env.example
│   └── package.json
│
├── .gitignore
└── README.md
```

------------------------------------------------------------------------

# 🔌 Backend API

Base URL for local development:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

## 1. Create Job

### Endpoint

``` http
POST /jobs
```

### Request

``` json
{
  "title": "Generate Monthly Report",
  "type": "Report"
}
```

### Example Response

``` json
{
  "id": 1,
  "title": "Generate Monthly Report",
  "type": "Report",
  "status": "pending",
  "createdAt": "2026-09-16T14:30:00.000Z"
}
```

------------------------------------------------------------------------

## 2. Get All Jobs

### Endpoint

``` http
GET /jobs
```

### Example Response

``` json
[
  {
    "id": 1,
    "title": "Generate Monthly Report",
    "type": "Report",
    "status": "pending",
    "createdAt": "2026-09-16T14:30:00.000Z"
  }
]
```

Jobs are returned with the newest jobs first.

------------------------------------------------------------------------

## 3. Update Job Status

### Endpoint

``` http
PATCH /jobs/:id/status
```

### Request

``` json
{
  "status": "running"
}
```

### Valid examples

``` text
pending → running
running → completed
running → failed
```

### Invalid transition response

``` text
409 Conflict
```

------------------------------------------------------------------------

## 4. Delete Job

### Endpoint

``` http
DELETE /jobs/:id
```

### Example Response

``` json
{
  "message": "Job deleted successfully"
}
```

If the job does not exist:

``` text
404 Not Found
```

------------------------------------------------------------------------

# 🗄️ Database

PostgreSQL is used for persistent storage.

Database:

``` text
job_queue
```

Table:

``` text
jobs
```

The jobs table contains:

  Field       Description
  ----------- ------------------------
  id          Unique job identifier
  title       Job title
  type        Job type
  status      Current job status
  createdAt   Job creation timestamp

------------------------------------------------------------------------

# ✅ Validation

The backend validates incoming data using NestJS validation pipes and
DTOs.

### Create Job

`title`:

-   Required
-   String
-   Maximum 100 characters

`type`:

-   Required
-   String
-   Maximum 50 characters

### Status Update

The status must be one of:

``` text
pending
running
completed
failed
```

Invalid status values are rejected by the backend.

Unknown request fields are also rejected.

------------------------------------------------------------------------

# 🚨 Error Handling

The application handles common API errors including:

### 400 Bad Request

Examples:

-   Invalid request body
-   Missing required fields
-   Invalid status
-   Invalid job ID
-   Unexpected fields

### 404 Not Found

Returned when:

-   Job does not exist

### 409 Conflict

Returned when:

-   Invalid job state transition
-   Another request changed the job before the current request

### Frontend Errors

The React application displays API errors to the user and prevents
failed operations from incorrectly updating the local state.

------------------------------------------------------------------------

# 🧠 Frontend State Management

Redux Toolkit is used to manage job data.

The jobs Redux state contains:

``` text
jobs
loading
creating
updating
deleting
error
```

Async operations are handled with Redux Toolkit `createAsyncThunk`.

Main operations:

``` text
fetchJobs
createJobAsync
updateJobStatusAsync
deleteJobAsync
```

The frontend updates its state only after the backend confirms a
successful operation.

------------------------------------------------------------------------

# 🔎 Search and Filtering

The All Jobs and Dashboard views support:

### Search

Users can search by:

``` text
Job Title
Job Type
```

### Status Filter

Available filters:

``` text
All Status
Pending
Running
Completed
Failed
```

Search and filtering are handled on the frontend using the jobs already
loaded from the API.

------------------------------------------------------------------------

# 🗑️ Delete Confirmation

Deleting a job requires confirmation.

Flow:

``` text
Click Delete
     ↓
Confirmation dialog
     ↓
Cancel ───────────────→ Nothing happens
     │
     ▼
Confirm Delete
     ↓
DELETE /jobs/:id
     ↓
Success message
     ↓
Remove job from UI
```

This prevents accidental deletion.

------------------------------------------------------------------------

# 🎨 UI

The UI uses a simple dashboard layout with:

-   Dark sidebar
-   Navigation
-   Header
-   Dashboard cards
-   Job table
-   Search and filters
-   Status badges
-   Create Job form
-   Responsive layout
-   Loading states
-   Empty states
-   Error messages
-   Confirmation dialogs

The visual design is intentionally kept simple because the assignment
focuses primarily on implementation and engineering decisions.

------------------------------------------------------------------------

# 🚀 Getting Started

## Prerequisites

Install:

-   Node.js
-   npm
-   PostgreSQL
-   Git

Check versions:

``` bash
node --version
npm --version
psql --version
```

------------------------------------------------------------------------

# ⚙️ Backend Setup

Go to the backend directory:

``` bash
cd backend
```

Install dependencies:

``` bash
npm install
```

Create a `.env` file:

``` env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_DATABASE=job_queue
```

Create the PostgreSQL database:

``` sql
CREATE DATABASE job_queue;
```

Start the backend in development mode:

``` bash
npm run start:dev
```

Backend will run at:

``` text
http://localhost:3000
```

------------------------------------------------------------------------

# 💻 Frontend Setup

Open another terminal.

``` bash
cd frontend
```

Install dependencies:

``` bash
npm install
```

Create `.env`:

``` env
VITE_API_URL=http://localhost:3000
```

Start the frontend:

``` bash
npm run dev
```

The Vite development server will normally run at:

``` text
http://localhost:5173
```

------------------------------------------------------------------------

# 🔐 Environment Variables

Never commit real environment secrets.

### Backend `.env`

``` env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=YOUR_POSTGRES_PASSWORD
DB_DATABASE=job_queue
```

### Frontend `.env`

``` env
VITE_API_URL=http://localhost:3000
```

The `.env` files should be excluded from Git.

------------------------------------------------------------------------

# 🌐 CORS

The NestJS backend allows the local React development server to
communicate with the API.

Development origins include:

``` text
http://localhost:5173
http://127.0.0.1:5173
```

For production, the allowed frontend origin should be updated to the
deployed frontend URL.

------------------------------------------------------------------------

# 🧪 Testing the Application

## Test 1 --- Create Job

Create:

``` text
Title: Generate Report
Type: Report
```

Expected:

``` text
Job created successfully
Status: pending
```

------------------------------------------------------------------------

## Test 2 --- Run Job

Click:

``` text
Run
```

Expected:

``` text
pending → running
```

------------------------------------------------------------------------

## Test 3 --- Complete Job

For a running job:

``` text
Complete
```

Expected:

``` text
running → completed
```

------------------------------------------------------------------------

## Test 4 --- Fail Job

For a running job:

``` text
Fail
```

Expected:

``` text
running → failed
```

------------------------------------------------------------------------

## Test 5 --- Invalid Transition

Try:

``` text
completed → running
```

Expected:

``` text
409 Conflict
```

The backend must reject the operation even if the API is called
directly.

------------------------------------------------------------------------

## Test 6 --- Delete Job

Click:

``` text
Delete
```

Confirm the SweetAlert dialog.

Expected:

``` text
DELETE /jobs/:id
```

Then the job disappears from the UI.

------------------------------------------------------------------------

## Test 7 --- Concurrent Update

Create a pending job.

Open the application in two browser tabs.

Both tabs should show:

``` text
pending
```

Try to run the same job from both tabs at nearly the same time.

Expected result:

``` text
Request 1 → 200
Request 2 → 409
```

The database should remain consistent.

------------------------------------------------------------------------

# 🏭 Production Build

## Frontend

``` bash
cd frontend
npm run build
```

The production files are generated in:

``` text
frontend/dist/
```

------------------------------------------------------------------------

## Backend

Build:

``` bash
cd backend
npm run build
```

Start production server:

``` bash
npm run start:prod
```

------------------------------------------------------------------------

# ☁️ Deployment

The application can be deployed as two separate services.

``` text
                 ┌─────────────────┐
                 │     Browser     │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │ React Frontend  │
                 └────────┬────────┘
                          │
                    REST API calls
                          │
                          ▼
                 ┌─────────────────┐
                 │ NestJS Backend  │
                 └────────┬────────┘
                          │
                          ▼
                 ┌─────────────────┐
                 │   PostgreSQL    │
                 └─────────────────┘
```

The frontend uses:

``` env
VITE_API_URL=https://YOUR-BACKEND-URL
```

The backend should allow the deployed frontend origin through CORS.

------------------------------------------------------------------------

# 🔗 Live URLs

Update these after deployment:

### Frontend

``` text
https://your-frontend-url.com
```

### Backend API

``` text
https://your-backend-url.com
```

### GitHub

``` text
https://github.com/YOUR_USERNAME/YOUR_REPOSITORY
```

------------------------------------------------------------------------

# 🔒 Security Considerations

The project follows several basic security practices:

-   Environment variables are used for database credentials.
-   `.env` files should not be committed.
-   Request DTO validation is performed on the backend.
-   Unknown request fields are rejected.
-   Job IDs are validated.
-   Status transitions are enforced server-side.
-   Database state is treated as the source of truth.
-   CORS should be restricted to trusted frontend origins in production.

------------------------------------------------------------------------

# ⚖️ Engineering Decisions

## Why PostgreSQL?

PostgreSQL was selected because the assignment allows PostgreSQL or
SQLite and PostgreSQL provides reliable persistent relational storage
suitable for a job queue.

## Why TypeORM?

TypeORM integrates naturally with NestJS and provides:

-   Entity definitions
-   Repository pattern
-   Database queries
-   PostgreSQL integration

## Why Redux Toolkit?

Redux Toolkit provides predictable centralized state management for:

-   Jobs
-   Loading states
-   API errors
-   Create/update/delete operations

## Why enforce state transitions on the backend?

Frontend validation alone cannot protect the system because users can
bypass the React application and call the API directly.

Therefore, the backend is responsible for enforcing the state machine.

## Why use a conditional database update?

A conditional update helps handle two requests that attempt the same
transition concurrently.

The update succeeds only when the database still contains the expected
current status.

------------------------------------------------------------------------

# 📌 Assumptions

-   A newly created job always starts in `pending`.
-   Jobs do not execute automatically; status changes are controlled
    through the dashboard/API.
-   `completed` and `failed` are terminal states.
-   Job title and type are required.
-   PostgreSQL is available in the development environment.
-   Search and status filtering are performed on the frontend after
    fetching jobs.

------------------------------------------------------------------------

# 🔮 Possible Future Improvements

If more development time were available, possible improvements include:

-   Pagination for large job lists
-   Automated job workers
-   Real-time updates using WebSockets
-   Authentication and authorization
-   Role-based access control
-   Database migrations instead of synchronization
-   Structured application logging
-   Automated unit and integration tests
-   API documentation with Swagger
-   Rate limiting
-   More detailed job execution history
-   Production monitoring and metrics
-   Queue processing using Redis/BullMQ

These are intentionally outside the core assignment scope.

------------------------------------------------------------------------

# ⭐ Production-Ready Improvement

A small production-oriented improvement is adding a backend health
endpoint such as:

``` http
GET /health
```

Example response:

``` json
{
  "status": "ok"
}
```

This can be used by deployment platforms and monitoring systems to
determine whether the backend service is responding.

------------------------------------------------------------------------

# 📊 Assignment Requirement Checklist

  Requirement                   Status
  ----------------------------- --------
  React frontend                ✅
  NestJS backend                ✅
  PostgreSQL persistence        ✅
  Create job API                ✅
  Get all jobs API              ✅
  Update status API             ✅
  Delete job API                ✅
  Job validation                ✅
  Error handling                ✅
  Status state machine          ✅
  Backend state enforcement     ✅
  Concurrent request handling   ✅
  Display all jobs              ✅
  Status filtering              ✅
  Create job UI                 ✅
  Change status UI              ✅
  Delete job UI                 ✅
  Status counts                 ✅
  Loading state                 ✅
  API error state               ✅
  Responsive UI                 ✅
  README documentation          ✅
  Production improvement        ✅

------------------------------------------------------------------------

# 👨‍💻 Author

**Mohd Sohrab Alam**

Full Stack Developer

Built with:

``` text
React + Redux Toolkit
NestJS + TypeORM
PostgreSQL
Tailwind CSS
```

------------------------------------------------------------------------

## License

This project was created for an internship assignment and demonstration
of full-stack development skills.
