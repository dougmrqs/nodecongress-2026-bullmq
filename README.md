# Bulk User Registration with BullMQ

## Prerequisites

- Node.js 24.13.0 (see `.tool-versions`)
- Docker & Docker Compose

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start Redis
npm run docker:up

# 3. Start registration server (terminal 1)
npm run dev:registration

# 4. Start main server (terminal 2)
npm run dev

# 5. Run test script (terminal 3)
npx tsx test/bulk-ingestion.ts
```

## Endpoints

- **Main server**: `http://localhost:3000`
  - `POST /bulk-ingestion` - Submit bulk user registration
  - `GET /queues` - BullBoard dashboard
- **Registration server**: `http://localhost:3001`
  - `POST /register` - Register single user
