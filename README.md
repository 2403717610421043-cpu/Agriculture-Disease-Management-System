# Agriculture Disease Management System

A full-stack academic web application based on the Agriculture Disease Management System SRS.

## Technology
- Frontend: React + Vite
- Backend: Node.js + Express.js
- Database: MySQL
- Authentication: JWT + bcrypt
- Image upload: Multer
- Charts: Recharts

## Roles
- Farmer
- Agriculture Expert
- Research Scientist
- Administrator

## SRS-aligned modules
- User authentication and role-based access
- Farmer registration/profile
- Crop management
- Disease reporting with image upload
- Expert diagnosis
- Treatment recommendations
- Farmer-expert queries
- Farming tips
- Disease information database
- Notifications
- Research findings and analytics
- Administrator management

## Project Structure
```text
Agriculture-Disease-Management-System/
├── frontend/
├── backend/
├── database/
├── .gitignore
└── README.md
```

## 1. Database Setup

Open MySQL Workbench and run:

`database/schema.sql`

The script creates the database, tables, indexes, sample users, diseases, crops, tips, and research data.

Sample password for all sample accounts:
`Password@123`

Sample accounts:
- farmer@example.com
- expert@example.com
- scientist@example.com
- admin@example.com

## 2. Backend Setup

```bash
cd backend
npm install
```

Copy `.env.example` to `.env` and update the MySQL values.

```bash
npm run dev
```

Backend runs on:
`http://localhost:5000`

## 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on the URL shown by Vite, normally:
`http://localhost:5173`

## 4. Important Notes

- Do not commit `.env`.
- Uploaded images are stored in `backend/uploads`.
- The frontend communicates with the REST API under `/api`.
- The SRS describes email notifications and cloud services; this implementation provides in-app notifications and keeps email as an optional extension.
- Advanced AI disease prediction and IoT/weather integrations are future enhancements in the SRS and are not required for the core implementation.

## API Overview

Authentication:
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me`

Farmer:
- GET `/api/crops`
- POST `/api/crops`
- GET `/api/reports`
- POST `/api/reports`
- GET `/api/notifications`
- GET `/api/diseases`
- GET `/api/tips`
- POST `/api/queries`

Expert:
- GET `/api/reports`
- PUT `/api/reports/:id/diagnose`
- GET `/api/queries`
- PUT `/api/queries/:id/respond`
- POST `/api/tips`
- PUT `/api/tips/:id`

Admin:
- GET `/api/admin/users`
- PUT `/api/admin/users/:id/status`
- POST `/api/diseases`
- PUT `/api/diseases/:id`
- DELETE `/api/diseases/:id`
- GET `/api/analytics`

Research Scientist:
- GET `/api/research`
- POST `/api/research`
- PUT `/api/research/:id`

## Testing Checklist

Test registration, login, protected routes, role access, crop creation, disease report creation, image upload, expert diagnosis, treatment recommendation, query response, disease CRUD, farming tips, notifications, research findings, and analytics.

