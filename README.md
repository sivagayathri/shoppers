# User Service

A microservice for user and admin management in the Shopverse e-commerce platform. Built with NestJS and runs as a Redis-based microservice (no HTTP server).

## Overview

The User Service handles:
- Customer registration and management
- Admin user management
- User authentication (login)
- Password hashing with bcrypt

## Communication

This service runs as a **Redis microservice** (no HTTP port). It communicates via:
- **Redis Transport**: Message patterns for RPC-style communication
- **API Gateway**: All requests are proxied through the API Gateway

## Prerequisites

- Node.js >= 18.x
- MongoDB (local or Atlas)
- Redis server running

## Installation

```bash
npm install
```

## Environment Variables

Create a `.env` file in the root of this service:

```env
REDIS_URL=redis://localhost:6379
MONGO_DB=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/shoppers
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=3600s
```

| Variable | Description | Default |
|----------|-------------|---------|
| REDIS_URL | Redis connection URL | redis://localhost:6379 |
| MONGO_DB | MongoDB connection string | - |
| JWT_SECRET | Secret for JWT tokens | - |
| JWT_EXPIRES_IN | JWT token expiration | 3600s |

## Running the Service

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod

# Debug mode
npm run start:debug
```

## Message Patterns

The service listens for the following Redis message patterns:

| Pattern | Description | Payload |
|---------|-------------|---------|
| `create-user` | Register new customer | CreateUserDto |
| `create-admin` | Create admin user | CreateAdminDto |
| `login` | User authentication | SignInDto |
| `get-user` | Get user by ID | number (id) |
| `updateUser` | Update user profile | UpdateUserDto |
| `removeUser` | Delete user | number (id) |
| `admin-login` | Admin authentication | AdminLogin |

## Data Models

### Customer Schema

```typescript
{
  id: number,          // Required, Unique
  name: string,        // Required
  email: string,       // Required, Unique
  phone: string,       // Required, Unique
  password: string,    // Required (hashed)
  address?: {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country?: string
  }
}
```

### Admin Schema

```typescript
{
  id: number,          // Required, Unique
  name: string,        // Required
  email: string,       // Required, Unique
  phone: string,       // Required, Unique
  password: string,    // Required (hashed)
  companyName: string  // Required
}
```

## DTOs (Data Transfer Objects)

### CreateUserDto

```typescript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  password: string,
  address?: AddressDto
}
```

### SignInDto

```typescript
{
  email: string,
  password: string
}
```

### CreateAdminDto

```typescript
{
  id: number,
  name: string,
  email: string,
  phone: string,
  password: string,
  companyName: string
}
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    USER SERVICE                          │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────────────────────────────────────────┐    │
│  │              NestJS Microservice                 │    │
│  │           (Redis Transport Listener)             │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐    │
│  │              User Controller                     │    │
│  │         (@MessagePattern handlers)               │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
│  ┌────────────────────▼────────────────────────────┐    │
│  │               User Service                       │    │
│  │         (Business logic + bcrypt)                │    │
│  └────────────────────┬────────────────────────────┘    │
│                       │                                  │
└───────────────────────┼──────────────────────────────────┘
                        │
           ┌────────────┴────────────┐
           ▼                         ▼
    ┌─────────────┐           ┌─────────────┐
    │   MongoDB   │           │    Redis    │
    │ (Customers  │           │  (Message   │
    │   Admins)   │           │  Transport) │
    └─────────────┘           └─────────────┘
```

## Usage via API Gateway

All user operations are accessed through the API Gateway:

### Create User

```bash
curl -X POST http://localhost:3000/user \
  -H "Content-Type: application/json" \
  -d '{
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "password": "securePassword123",
    "address": {
      "street": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "postalCode": "400001"
    }
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'
```

### Get User

```bash
curl http://localhost:3000/user/1
```

## Project Structure

```
user-service/
├── src/
│   ├── main.ts                # Microservice entry point
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # App controller
│   ├── app.service.ts         # App service
│   ├── user/
│   │   ├── user.module.ts     # User module
│   │   ├── user.controller.ts # Message pattern handlers
│   │   ├── user.service.ts    # Business logic
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   └── schema/
│   │       ├── user.schema.ts   # Customer schema
│   │       └── admin.schema.ts  # Admin schema
│   └── auth/
│       └── auth.module.ts     # Authentication module
├── .env                       # Environment variables
└── package.json
```

## Dependencies

| Package | Purpose |
|---------|---------|
| @nestjs/core | NestJS framework |
| @nestjs/microservices | Redis transport |
| @nestjs/mongoose | MongoDB integration |
| @nestjs/config | Environment configuration |
| @nestjs/jwt | JWT support |
| bcryptjs | Password hashing |
| class-validator | DTO validation |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run start` | Start in production mode |
| `npm run start:dev` | Start in development mode with hot reload |
| `npm run start:debug` | Start in debug mode |
| `npm run start:prod` | Start compiled production build |
| `npm run build` | Build the application |
| `npm run lint` | Run ESLint |
| `npm test` | Run unit tests |

## Security Notes

- Passwords are hashed using bcrypt with salt rounds of 10
- Never expose this service directly to the internet
- All requests should go through the API Gateway
- JWT tokens are used for authentication

## Troubleshooting

### Redis Connection Error
- Ensure Redis is running: `redis-cli ping`
- Check REDIS_URL format and accessibility

### MongoDB Connection Error
- Verify connection string
- Check MongoDB Atlas network access

### Service Not Responding
- Check if the service is running
- Verify Redis connectivity
- Review service logs for errors
