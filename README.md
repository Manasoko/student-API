# **Student API**

A simple RESTful CRUD API for managing student records. This service exposes a minimal set of endpoints under the `/api/v1` prefix to create, read, update, and delete student profiles.

> NOTE: This README documents the API contract, example requests/responses, validation rules, error handling, and instructions for running and contributing. Adjust environment and datastore details to match your implementation.

---

## Table of contents

- Project Overview
- Key Features
- Requirements
- API Overview (Base URL, Authentication)
- Endpoints
    - GET /students
    - GET /student/:studentId
    - POST /student
    - PUT /student/:studentId
    - DELETE /student/:studentId
- Data Model
- Validation & Error Handling
- Examples (curl)
- Pagination, Filtering & Sorting
- Running Locally
- Testing
- Contributing
- License

---

## Project Overview

This project implements a REST API for storing and retrieving student information. It is intended as a small demo app or starting point for educational projects and bootstrapped services. The API focuses on clarity and predictable behavior with JSON input/output.

## Key Features

- Full CRUD (Create, Read, Update, Delete) for student resources
- Simple, predictable JSON API
- Input validation and clear error responses
- Example request/response payloads included

## Requirements

- Node.js (recommended >= 18) or any runtime you choose to implement with
- npm / yarn (if using a Node implementation)
- MySQL for database
- Docker for containerized development
- Make for running Makefiles

## API Overview

- Base path: `/api/v1`
- Content type: `application/json`
- Authentication: None by default (add JWT/API-key middleware in production)
- All responses are JSON unless otherwise noted

Example base URL:
- Local: `http://localhost:3000/api/v1`

---

## Endpoints

All request and response examples below assume the base path prefix `/api/v1`.

### GET /students
Retrieve a list of all students.

Response:
- 200 OK
```json
[
    {
        "id": 1,
        "name": "Jane Doe",
        "age": 23,
        "course": "Comp. Science"
    },
    {
        "id": 2,
        "name": "John Doe",
        "age": 22,
        "course": "Cybersecurity"
    }
]
```

### GET /student/:studentId
Retrieve a specific student by ID.

Responses:
- 200 OK — returns student object
- 404 Not Found — if student does not exist

Example 200:
```json
{
  "id": "abc123",
  "name": "Jane Doe",
  "age": 23,
  "course": "Comp. Science"
}
```

### POST /student
Create a new student.

Request body (JSON):
- `name` (string, required)
- `age` (number, required)
- `course` (string, required)


Responses:
- 201 Created — returns created student
- 400 Bad Request — validation errors
- 500 Server Error - database issues

Example request:
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane.doe@example.com",
  "dob": "2000-05-15"
}
```

### PUT /student/:studentId
Update fields for an existing student. Accepts partial updates (only send fields to change).

Responses:
- 200 OK — returns updated student
- 400 Bad Request — validation errors
- 404 Not Found — if student does not exist

### DELETE /student/:studentId
Delete a student profile.

Responses:
- 204 No Content — deleted successfully
- 404 Not Found — if student does not exist

---

## Data Model

Student (example)
```json
{
    "id": "number",
    "name": "string",
    "age": "number",
    "course": "string",
    "createdAt": "Date",
    "updatedAt": "Date",
}
```

## Examples (curl)

Check the `Student.postman_collection.json` for examples


## Running Locally

1. Install dependencies: `make install` or `yarn`
2. Configure env (port, DB url). Example `.env`:
```
PORT=3000
DATABASE_NAME=database_name
DATABASE_USER=root
DATABASE_PASSWORD=your_root_password
```
3. Start: `make run` or `make docker-run`
4. API available at `http://localhost:8080/api/v1`

Optional: run with Docker by providing a Dockerfile and docker-compose.yml pointing at the datastore for this repo.

## Testing

- Include unit and integration tests (Jest).
- Example: `make test` runs the test suite and reports coverage.

## Contributing

- Fork the repo, create a feature branch, open a PR.
- Follow existing code style, add tests for new behavior, and update README where necessary.
- Then build it with `make build`

## License

- Specify your license (e.g., MIT). Add a LICENSE file to the project root.

--- 
This README is intentionally implementation-agnostic; adapt validation, auth, and storage details to your chosen stack.
```