## TaskBoard

TaskBoard is a small full-stack project that provides a calendar/agenda-driven task and notes app. It uses a static frontend (plain HTML/JS/CSS), a Node.js + Express backend (with MongoDB), and an optional Spring Boot Java service.

This README explains the project structure, environment variables, and how to run each service for development.

## Repository layout

- `Frontend/` — static client files (HTML, CSS, JS). Designed to be served from a static server or Live Server during development.
- `node-backend/` — Express API server (Node 18+, ES modules) that implements authentication, tasks, and notes. Uses MongoDB + Mongoose.
- `java-service/` — Spring Boot service (optional). Contains `pom.xml` and the Java code under `src/`.

## Quick prerequisites

- Node.js (v16+/v18+ recommended) and npm
- MongoDB (local or cloud Atlas) accessible from your machine
- Java 17+ and Maven (only if you want to run the Java service)
- A modern browser for the frontend

## Environment variables

Create a `.env` file inside `node-backend/` with at least the following values:

```
MONGO_URI=mongodb://localhost:27017/taskboard
JWT_SECRET=your_jwt_secret_here
PORT=8080    # optional, defaults to 8080
```

Notes:
- `MONGO_URI` — connection string to your MongoDB database. For Atlas include the full connection string.
- `JWT_SECRET` — used to sign authentication tokens. Keep this secret in real deployments.
- `PORT` — port for the Node backend. Default in code is `8080` when not set.

The Java service, if run, uses Spring Boot defaults (typically port 8080). If you run both the Node backend and the Java service locally you may need to change one of their ports to avoid conflicts (see Troubleshooting).

## Install & run

1) Node backend

```bash
cd node-backend
npm install
# create .env as shown above
npm run dev   # uses nodemon for development
# or
npm start     # run node server.js
```

The Node backend exposes API routes under `/api/*`. See API section below.

2) Frontend

The frontend files are static and live in the `Frontend/` folder. You can open `Frontend/index.html` directly in the browser or serve the folder with a static server. For development using VS Code, the Live Server extension (or `live-server`) works well. The code also expects the backend to be reachable from the origins listed in `node-backend/server.js` (common local dev ports like 5500 and 3000 are allowed by default).

Example (serve with a simple npm package globally installed):

```bash
# from repo root
cd Frontend
# if you have live-server installed
live-server --port=5500
# or open index.html directly
```

3) Java service (optional)

```bash
cd java-service
mvn spring-boot:run
# or build and run the jar
mvn package
java -jar target/taskboard-service-1.0.0.jar
```

## API (summary)

Node backend endpoints (authenticated routes require a Bearer token returned by the login/register endpoints):

- POST `/api/auth/register` — register a user. Body: `{ name, email, password }`.
- POST `/api/auth/login` — login. Body: `{ email, password }`. Returns `{ user, token }`.
- GET  `/api/health` — simple health check (no auth).

- GET  `/api/tasks?date=YYYY-MM-DD` — list tasks for authenticated user (filter by date optional).
- GET  `/api/tasks/agenda` — next 7 days (including today) agenda.
- POST `/api/tasks` — create a task. Body: `{ title, description?, date?, time? }`.
- PUT  `/api/tasks/:id` — update a task (owner-only).
- DELETE `/api/tasks/:id` — delete a task (owner-only).

- GET  `/api/tasks/notes/:date` — get notes for `YYYY-MM-DD`.
- POST `/api/tasks/notes/:date` — save notes for a date. Body: `{ text }`.

Authentication: send `Authorization: Bearer <token>` header for protected endpoints.

## Development notes

- The Node backend uses `mongoose` for DB access and `jsonwebtoken` for auth.
- CORS in `server.js` allows common dev origins. If you run the frontend on a different host/port, add it to the `cors` origin array.
- The frontend is intentionally small and not framework-based — it expects a running backend at the configured port.

## Troubleshooting

- Port conflicts: both the Node backend and Spring Boot default to port 8080. If you plan to run both, either set `PORT` in `node-backend/.env` to another value (e.g., 8081) or override Spring Boot's port in `application.properties` or via `--server.port`.
- MongoDB connection failures: check `MONGO_URI`, ensure MongoDB is running and accessible from your network.
- JWT errors: ensure `JWT_SECRET` is set and identical for any processes expecting to validate tokens.

## Tests

There are no automated tests included in the repository at the moment. Adding unit/integration tests for the backend (Jest or Mocha) and basic smoke tests for the frontend would be a recommended next step.

## Suggestions / Next steps

- Add a `start` script at repo root that boots both services for dev with `concurrently`.
- Provide an example `docker-compose.yml` for a one-command local environment (Mongo + Node + frontend static server).
- Add basic API tests and a CI workflow.

## License

This repository currently doesn't specify a license file. If you want to open-source it, add a `LICENSE` file (MIT/Apache-2.0/etc.).

---

If you'd like, I can also:

- Add a minimal `docker-compose.yml` that brings up MongoDB + node-backend for local testing.
- Add example `.env.example` files into `node-backend/`.

Tell me which of those you'd like next.
