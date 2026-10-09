# DOBATO Backend API

Official backend service for **DOBATO** — Nepali dating and meaningful connection platform.
*Brand Slogan:* **"Two Paths. One Connection."**
*Grand Launch Event:* **16 October 2026**

---

## 📌 Project Overview

This repository contains the DOBATO TypeScript backend built with **NestJS**, **Prisma ORM**, and **MongoDB Atlas**.

- **Phase 1**: Architectural foundation, security headers, CORS, rate limiting, structured logging, global error handling, database health checks, OpenAPI/Swagger docs.
- **Phase 2**: Official Event Module providing event details, slogans, poetry competition themes, event highlights, and prize configurations to the frontend.
- **Phase 3**: Extended Event & Poetry Competition API providing poetry competition details, official guidelines, FAQs, live music performance placeholders, and timezone-aware event metadata.
- **Phase 4**: Free Event Registration Module supporting attendance & poetry contest registrations (`ATTEND_ONLY` & `ATTEND_AND_POETRY`), 18+ age validation, unique server-side registration ID generation (`DBT-2026-XXXXXX`), duplicate email/phone prevention, privacy protection, and atomic Prisma transactions.
- **Phase 5**: Verification Token & QR Code Check-in System with cryptographically secure random token generation (`crypto.randomBytes`), SHA-256 token hashing, non-blocking SMTP email confirmation dispatch (`MailService`), QR payload format support (`DOBATO_CHECKIN:<token>`), public verification API (`POST /api/v1/registrations/verify`), rate limiting (20 attempts / 10 min), and check-in state preparation.

> [!IMPORTANT]
> Admin authentication, admin dashboards, participant list management, check-in mutation, and poetry judging APIs are reserved for future phases (Phase 6+).

---

## 🛠️ Technology Stack

- **Framework:** [NestJS](https://nestjs.com/) (TypeScript)
- **Database ORM:** [Prisma](https://www.prisma.io/)
- **Database Engine:** MongoDB Atlas
- **Security:** Helmet, CORS, Throttler (Rate Limiting: 5 requests / 15 min on registration, 20 requests / 10 min on verification)
- **Validation:** class-validator & class-transformer
- **API Documentation:** Swagger / OpenAPI 3.0

---

## 📁 Project Structure

```text
src/
├── app.module.ts              # Root NestJS Application Module
├── main.ts                    # Entry point (Port, CORS, Helmet, Swagger, Pipes)
├── config/
│   └── configuration.ts       # Typed Environment Configuration
├── common/
│   ├── filters/
│   │   └── http-exception.filter.ts # Global Exception Filter
│   └── interceptors/
│       ├── logging.interceptor.ts   # Structured HTTP Access Logs
│       └── transform.interceptor.ts # Global Response Standardizer
├── database/
│   ├── database.module.ts     # Global Database Module
│   └── prisma.service.ts      # Prisma Client lifecycle & DB health mechanism
├── mail/                      # Mail Confirmation Service (Phase 5)
│   ├── mail.service.ts
│   └── mail.module.ts
├── modules/
│   ├── event/                 # Event Module (Phase 2 & 3)
│   │   ├── dto/
│   │   ├── event.controller.ts
│   │   ├── event.service.ts
│   │   └── event.module.ts
│   ├── poetry/                # Poetry Competition Module (Phase 3)
│   │   ├── dto/
│   │   ├── poetry.controller.ts
│   │   ├── poetry.service.ts
│   │   └── poetry.module.ts
│   ├── registration/          # Registration & Verification Module (Phase 4 & 5)
│   │   ├── dto/
│   │   │   ├── create-registration.dto.ts
│   │   │   └── registration-response.dto.ts
│   │   ├── registration.controller.ts
│   │   ├── registration.service.ts
│   │   └── registration.module.ts
│   ├── health/
│   │   ├── health.controller.ts # GET /api/v1/health
│   │   ├── health.module.ts
│   │   └── health.service.ts
│   └── admin/                 # Placeholder for Phase 6+
prisma/
├── schema.prisma              # MongoDB Prisma Schema
└── seed.ts                    # Idempotent Seed Script
```

---

## ⚙️ Environment Variables Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | HTTP Server Port | `5001` |
| `NODE_ENV` | Environment (`development` or `production`) | `development` |
| `FRONTEND_URL` | Frontend URL allowed for CORS | `http://localhost:3000` |
| `DATABASE_URL` | MongoDB connection string | `mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/dobato_db?retryWrites=true&w=majority` |
| `SMTP_HOST` | SMTP Server Host | `smtp.example.com` |
| `SMTP_PORT` | SMTP Server Port | `587` |
| `SMTP_USER` | SMTP Username | `user@example.com` |
| `SMTP_PASSWORD` | SMTP Password | `secretpassword` |
| `SMTP_FROM` | Sender Email Address | `no-reply@dobato.app` |
| `SMTP_FROM_NAME` | Sender Name | `DOBATO Team` |

---

## 📖 API Endpoints

### 1. Health Check
`GET /api/v1/health`

### 2. Active Event (Extended Data)
`GET /api/v1/event`

### 3. Event by Slug
`GET /api/v1/event/:slug`

### 4. Active Poetry Competition
`GET /api/v1/poetry`

### 5. Poetry Competition by Event Slug
`GET /api/v1/event/:slug/poetry`

### 6. Free Event Registration (Phase 4 & 5)
`POST /api/v1/registrations`

**Success Response (201 Created - Returns Verification Token for Frontend QR):**
```json
{
  "success": true,
  "message": "Registration completed successfully.",
  "data": {
    "registrationId": "DBT-2026-000123",
    "verificationToken": "a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef",
    "event": {
      "title": "DOBATO GRAND LAUNCH",
      "date": "2026-10-16"
    },
    "participationType": "ATTEND_ONLY",
    "emailSent": true
  }
}
```

### 7. Token / QR Code Verification (Phase 5)
`POST /api/v1/registrations/verify`

**Request Body Example:**
```json
{
  "token": "DOBATO_CHECKIN:a1b2c3d4e5f678901234567890abcdef1234567890abcdef1234567890abcdef"
}
```

**Success Response (200 OK - Privacy Safe):**
```json
{
  "success": true,
  "message": "Registration is valid.",
  "data": {
    "valid": true,
    "registrationId": "DBT-2026-000123",
    "participationType": "ATTEND_ONLY",
    "checkedIn": false
  }
}
```

---

## 📜 Available NPM Scripts

- `npm run dev`: Start server in development watch mode
- `npm run build`: Compile NestJS application to `dist/`
- `npm run start:prod`: Run production server
- `npm run test`: Run Jest unit test suite
- `npm run prisma:generate`: Generate Prisma Client code
- `npm run prisma:migrate`: Execute Prisma database migrations
- `npm run prisma:seed`: Execute database seed script
