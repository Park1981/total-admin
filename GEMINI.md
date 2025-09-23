# GEMINI.md: 유니태크(주) 관리시스템

## 🚀 Project Overview

This is a comprehensive management system for "유니텍" (Unitech), built with a modern web stack. It features a Node.js backend, a static frontend, and a Supabase database. The system is designed for easy deployment and development, with separate configurations for Vercel (frontend) and Render (backend).

**Key Technologies:**

*   **Backend:** Node.js, Express.js
*   **Frontend:** HTML, CSS, JavaScript
*   **Database:** Supabase (PostgreSQL)
*   **Deployment:** Vercel (Frontend), Render (Backend)
*   **CI/CD:** GitHub Actions

**Architectural Highlights:**

*   **Decoupled Frontend/Backend:** The frontend is a collection of static files that communicates with the backend via a RESTful API. This separation allows for independent development and deployment.
*   **Database as a Service:** Supabase provides the database, authentication, and other backend services, simplifying development.
*   **Automated Workflows:** The project includes scripts for database type generation, seeding, and a full development pipeline, streamlining common tasks.

## 📚 Documentation Summary

The `docs` directory contains crucial information about the project's planning, status, and deployment.

*   **`PLAN.md` & `DB_PLAN.md`:** These documents outline the project's purpose, scope, and detailed database schema. The system is designed to manage employees, equipment, deliveries, and service tickets.
*   **`CURRENT_STATUS.md` & `2025-09-18.md`:** These files provide a log of development progress, including completed tasks, current issues, and their resolutions. They are a valuable resource for understanding the project's history and current state.
*   **`DEPLOYMENT_MANUAL.md` & `QUICK_START.md`:** These guides offer comprehensive instructions for setting up the development environment, deploying the application to Vercel and Render, and troubleshooting common issues.

## 🛠️ Building and Running

### Development

To run the development server:

```bash
npm install
npm start
```

The server will be available at `http://localhost:3001`.

### Testing

To run the test suite:

```bash
npm test
```

### Deployment

The project is configured for deployment on Vercel and Render.

*   **Vercel (Frontend):** The `vercel.json` file configures the frontend deployment.
*   **Render (Backend):** The `render.yaml` file configures the backend deployment.

Refer to the `DEPLOYMENT_MANUAL.md` for detailed instructions.

## 📝 Development Conventions

*   **API Design:** The backend follows RESTful principles, with routes and controllers clearly separated.
*   **Database Migrations:** Database schema changes are managed through migration files in the `supabase/migrations` directory.
*   **Type Safety:** The project uses `supabase gen types` to generate TypeScript types from the database schema, ensuring type safety between the backend and the database.
*   **Environment Variables:** The application uses a `.env` file for managing environment-specific variables. A `config/render-env-vars.txt` file is provided as a template.
*   **Scripts:** The `scripts` directory contains various utility scripts for development and automation. The `pipeline.ps1` script is particularly important, as it runs a full sequence of development tasks.