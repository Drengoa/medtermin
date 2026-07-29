# MedTermin

A full-stack appointment booking system for medical clinics, built with **Angular**, **Node.js/Express**, and **MySQL**. MedTermin lets patients find doctors and book appointments online, lets doctors manage their schedule, and gives admins full control over doctors, specializations, and availability.

Built as a university project for the *Advanced Web Programming* course, focused on applying core Angular concepts (modules, routing, guards, reactive & template-driven forms, services, interceptors, RxJS) in a realistic, end-to-end application.

## Features

**Patient**
- Browse doctors, filter by specialization
- View a doctor's profile, bio, and office
- Pick a date and see real-time available time slots
- Book an appointment with a reason for the visit
- View appointment history and cancel upcoming appointments

**Doctor**
- View all incoming appointments
- Confirm pending appointments
- Complete a visit and leave notes for the patient

**Admin**
- Add, edit, and remove doctors
- Assign specializations and offices
- Configure each doctor's weekly availability (custom days/hours per doctor)
- Manage the list of specializations

**Everyone**
- JWT-based authentication with role-based routing (patient / doctor / admin each see a different app)
- Role-aware navigation bar

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21 (NgModule-based architecture), Bootstrap 5, RxJS |
| Backend | Node.js, Express |
| Database | MySQL |
| Auth | JWT (JSON Web Tokens), bcrypt |

## Project Structure

```
medtermin/
├── medtermin-backend/       Node.js / Express REST API
│   ├── config/               MySQL connection
│   ├── controllers/          Route handlers (auth, doctors, appointments, admin)
│   ├── middleware/           JWT auth & role-check middleware
│   ├── routes/                Express route definitions
│   ├── database/               schema.sql + seed.sql  (see Getting Started)
│   └── server.js
│
└── medtermin-frontend/      Angular application
    └── src/app/
        ├── core/              Models, services, guards, interceptor
        ├── shared/            Navbar and shared pipes
        ├── auth/              Login & registration
        ├── patient/           Doctor search & booking
        ├── doctor/            Appointment management
        └── admin/             Doctor & specialization management
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+) and npm
- [MySQL](https://dev.mysql.com/downloads/) server running locally
- [Angular CLI](https://angular.dev/tools/cli): `npm install -g @angular/cli`

### 1. Clone the repository
```bash
git clone https://github.com/Drengoa/medtermin.git
cd medtermin
```

### 2. Set up the database
Log in to MySQL and run the schema, then (optionally) the seed data:
```bash
mysql -u root -p < medtermin-backend/database/schema.sql
mysql -u root -p < medtermin-backend/database/seed.sql
```
This creates a `medtermin` database with all tables, plus a few sample doctors, specializations, and one account per role for quick testing (see [Demo accounts](#demo-accounts)).

### 3. Set up the backend
```bash
cd medtermin-backend
npm install
```
Create a `.env` file in `medtermin-backend/` with:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=medtermin
DB_PORT=3306
JWT_SECRET=any_random_secret_string
PORT=3000
```
Run the server:
```bash
npx nodemon server.js
```
The API will be available at `http://localhost:3000`.

### 4. Set up the frontend
```bash
cd medtermin-frontend
npm install
ng serve
```
The app will be available at `http://localhost:4200`.

## Demo Accounts

If you ran `seed.sql`, you can log in with any of the following (password for all: `password123`):

| Role | Email |
|---|---|
| Patient | `patient@example.com` |
| Doctor | `doctor@example.com` |
| Admin | `admin@example.com` |

> Demo data only — these are placeholder accounts for local testing, not real users.

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new patient |
| POST | `/api/auth/login` | Log in, returns a JWT |
| GET | `/api/doctors` | List doctors (filterable by specialization) |
| GET | `/api/doctors/:id/availability` | Get free time slots for a doctor on a given date |
| POST | `/api/appointments` | Book an appointment |
| GET | `/api/appointments/my` | Patient's own appointments |
| GET | `/api/appointments/doctor` | Logged-in doctor's appointments |
| PUT | `/api/appointments/:id/confirm` | Doctor confirms a pending appointment |
| PUT | `/api/appointments/:id/complete` | Doctor completes a visit and adds notes |
| GET / POST / PUT / DELETE | `/api/admin/doctors` | Admin CRUD for doctors |
| POST | `/api/admin/specializations` | Admin adds a specialization |

All routes except register/login require a `Bearer` JWT token in the `Authorization` header.

## Author

Built by [David](https://github.com/Drengoa) as a university project for Advanced Web Programming.
