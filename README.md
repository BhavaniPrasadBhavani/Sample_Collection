# Sample Collection API

A backend API for a sample collection app built with Node.js, Express.js, TypeScript, and PostgreSQL with Prisma as the ORM.

## 🚀 Current Status

**✅ FULLY IMPLEMENTED AND RUNNING**

The API server is currently running on http://localhost:3000 with all features implemented:
- Authentication with JWT
- Sample management CRUD operations  
- Protected routes with middleware
- Type-safe TypeScript code
- Proper error handling

## Features

- **Authentication**: JWT-based authentication for agents
- **Sample Management**: CRUD operations for sample collection
- **Database**: PostgreSQL with Prisma ORM
- **Type Safety**: Full TypeScript support
- **Security**: Protected routes with middleware

## Project Structure

```
/
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── api/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── auth.controller.ts
│   │   │   └── sample.controller.ts
│   │   ├── services/         # Business logic
│   │   │   ├── auth.service.ts
│   │   │   └── sample.service.ts
│   │   ├── routes/           # API routes
│   │   │   ├── auth.routes.ts
│   │   │   └── sample.routes.ts
│   │   └── middleware/       # Custom middleware
│   │       └── auth.middleware.ts
│   ├── config/               # Configuration files
│   │   └── index.ts
│   ├── types/                # Type definitions
│   │   └── index.ts
│   └── index.ts              # Server entry point
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
Copy `.env` and update with your database credentials:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/sampledb"
JWT_SECRET="your-super-secret-and-long-key-for-jwt"
```

3. Generate Prisma client and push database schema:
```bash
npm run db:generate
npm run db:push
```

4. Build the project:
```bash
npm run build
```

5. Start the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new agent
- `POST /api/v1/auth/login` - Login agent

### Samples (Protected Routes)
- `GET /api/v1/samples/:agentId` - Get samples for an agent
- `POST /api/v1/samples` - Create a new sample
- `PATCH /api/v1/samples/:sampleId/collect` - Mark sample as collected
- `POST /api/v1/samples/:sampleId/report-delay` - Report a delay

## Database Schema

**Currently using SQLite for easy development and testing**

### Agent
- `id`: Unique identifier
- `name`: Agent name
- `phone`: Unique phone number
- `password`: Hashed password

### Sample
- `id`: Unique identifier
- `patientName`: Patient name
- `pickupAddress`: Pickup location
- `status`: String - "SCHEDULED" | "COLLECTED" | "CANCELLED" | "DELAYED"
- `priority`: String - "HIGH" | "MEDIUM" | "LOW"
- `scheduledDate`: Date for collection
- `notes`: Optional notes
- `agentId`: Reference to agent
- `createdAt` / `updatedAt`: Timestamps

## Usage Examples

### Register Agent
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "phone": "1234567890", "password": "securepassword"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"phone": "1234567890", "password": "securepassword"}'
```

### Create Sample
```bash
curl -X POST http://localhost:3000/api/v1/samples \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"patientName": "Jane Smith", "pickupAddress": "123 Main St", "scheduledDate": "2025-08-07", "priority": "HIGH", "agentId": "agent_id"}'
```

## Scripts

- `npm run build` - Build TypeScript to JavaScript
- `npm run dev` - Run in development mode with ts-node
- `npm start` - Run production build
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run database migrations

## Technologies Used

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcrypt
