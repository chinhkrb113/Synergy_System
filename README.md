# CRM System — Professional Microservices Monorepo

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6)
![Docker](https://img.shields.io/badge/Docker-ready-0db7ed)
![PRs welcome](https://img.shields.io/badge/PRs-welcome-brightgreen)

A modern, scalable **CRM** platform built as a **microservices** monorepo. The system features a **Next.js** frontend, **NestJS** backend (API Gateway + services), and planned **AI** capabilities for lead scoring, document parsing, and auto‑grading. Containerized with Docker for a one‑command local bootstrap.

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Local Development](#local-development)
- [Quality & Testing](#quality--testing)
- [Database & Migrations](#database--migrations)
- [API](#api)
- [Security](#security)
- [Monitoring & Analytics](#monitoring--analytics)
- [i18n](#i18n)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Roadmap](#roadmap)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

### Core CRM
- **Lead Management**: End‑to‑end lifecycle, scoring, and tier classification.
- **Conversations**: Omni‑channel message history with (planned) sentiment analysis.
- **Appointments**: Scheduling with calendar integration and outcome tracking.
- **Payments**: Secure payment session creation and status handling.

### Modern UI/UX
- **Responsive** mobile‑first layout, **dark/light** themes, and **WCAG 2.1 AA** accessibility.
- **Design System** powered by TailwindCSS and shadcn/ui.
- **Internationalization** (EN, VI).

### Architecture
- **API Gateway** for routing, auth, and rate limiting.
- **Event‑Driven** with NATS for service communication.
- **Type‑safe** end‑to‑end using TypeScript and shared packages.

### AI (Planned/Experimental)
- **Lead Scoring** (ML), **JD Parsing** (NLP), **Auto‑grading** (evaluation workflows).
- **Python FastAPI** microservices.

---

## Tech Stack

**Frontend**: Next.js 14, React 18, TypeScript, TailwindCSS, shadcn/ui, TanStack Query, React Hook Form + Zod, Framer Motion, Recharts  
**Backend**: NestJS (Express), Prisma ORM (MySQL), NATS, Redis, OpenAPI 3.1  
**Infrastructure**: Docker, Docker Compose, MySQL 8, Redis, MinIO, Metabase  
**AI/ML (Planned)**: Python, FastAPI, basic ML/NLP pipelines

---


---

## Getting Started

### Prerequisites
- **Node.js** ≥ 18, **npm** ≥ 9
- **Docker** ≥ 20.10, **Docker Compose** ≥ 2

### Clone & Bootstrap

```bash
git clone <your-repo-url>
cd CRM_system_app
npm install
docker compose -f infra/docker-compose.yml up -d
```

### Access

- **Web**: http://localhost:3000  
- **API Docs**: http://localhost:3001/api/docs  
- **Analytics**: http://localhost:3333 (Metabase)  
- **Object Storage**: http://localhost:9001 (MinIO Console)

> Tip: if you use an older Docker Compose, replace `docker compose` with `docker-compose`.

---

## Local Development

Start core infra first, then services:

```bash
# Infra (DB, cache, message bus, storage)
docker compose -f infra/docker-compose.yml up -d mysql redis nats minio

# Apps & Services
npm run dev:web        # Next.js (3000)
npm run dev:gateway    # API Gateway (3001)
npm run dev:acquisition  # Acquisition Service (3002)
```

Common scripts:

```bash
npm run lint
npm run format
npm run type-check
npm run test
```

---

## Quality & Testing

- **ESLint** and **Prettier** enforced across the monorepo.
- **TypeScript** strict mode.
- **Jest** for unit tests (services and gateway).
- **Conventional Commits** for clean history.

---

## Database & Migrations

Using Prisma ORM with MySQL 8.

```bash
# Generate Prisma client for a service
cd services/acquisition-svc
npx prisma generate

# Run migrations in dev
npx prisma migrate dev

# Inspect data
npx prisma studio
```

Seed data lives under `infra/seed/` (optional).

---

## API

Interactive OpenAPI docs: **http://localhost:3001/api/docs**

### Lead Management
```http
POST   /api/v1/leads              # Create lead (idempotent)
GET    /api/v1/leads              # List with filters
GET    /api/v1/leads/{id}         # Details
PATCH  /api/v1/leads/{id}         # Update
```

### Conversations
```http
POST   /api/v1/conversations/{id}/messages  # Send message
GET    /api/v1/conversations/{id}           # Get conversation
POST   /api/v1/conversations/{id}/escalate  # Escalate
```

### Appointments
```http
POST   /api/v1/appointments       # Create appointment
GET    /api/v1/appointments       # List appointments
```

### Payments
```http
POST   /api/v1/payments/sessions  # Create payment session
```

---

## Security

- **JWT** stateless auth and **RBAC**.
- **Rate limiting** at the gateway.
- Validation via **Zod**; Prisma defends common SQLi patterns.
- **CSP** and XSS mitigations on frontend; HTTPS in production.

> ⚠️ Remember to set strong secrets in production. See `.env` below.

---

## Monitoring & Analytics

- **Health endpoints** for services (liveness/readiness).
- Infra metrics via container logs.
- **Metabase** dashboards for BI (port **3333**).

---

## i18n

- Default **English (en)**; **Vietnamese (vi)** supported.
- Add a locale:
  1. Create `apps/web/src/messages/{locale}.json`
  2. Update `apps/web/src/middleware.ts`
  3. Register the locale in config

---

## Deployment

### Build & Run (Production)

```bash
npm run build
docker compose -f infra/docker-compose.yml up -d --build
```

### Environment Variables

Create a `.env` file (and/or per‑service env files) with at least:

```dotenv
NODE_ENV=production
DATABASE_URL=mysql://user:pass@host:3306/db
REDIS_URL=redis://host:6379
NATS_URL=nats://host:4222
JWT_SECRET=replace-with-a-strong-secret
MINIO_ENDPOINT=http://host:9000
MINIO_ACCESS_KEY=your-access-key
MINIO_SECRET_KEY=your-secret-key
```

> In local development, these are provided by Docker Compose defaults. Override as needed.

---

## Contributing

1. Fork the repo
2. Create a feature branch (`feat/<scope>-<short-desc>`)
3. Implement + add tests
4. `npm run lint && npm run test`
5. Open a Pull Request

We follow **[Conventional Commits](https://www.conventionalcommits.org/)**, e.g.:

```
feat: add new lead scoring algorithm
fix: resolve conversation sentiment calculation
docs: update API documentation
refactor: optimize database queries
test: add unit tests for lead service
```

---

## Roadmap

- [ ] Production‑ready AI services (lead scoring, JD parsing, auto‑grading)
- [ ] E2E tests and contract tests for gateway/services
- [ ] Observability stack (metrics/traces/logs) integration
- [ ] Helm charts / K8s manifests
- [ ] Additional locales and accessibility audits

---

## License

This project is licensed under the **MIT License** — see [LICENSE](./LICENSE).

---

## Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [NestJS](https://nestjs.com/)
