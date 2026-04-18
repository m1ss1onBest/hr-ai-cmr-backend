# HR AI CRM

## Installation

The installation process requires you to:

- install required packages
- install project dependencies
- set up environment variables
- set up external infrastructure
- run database migrations (if needed)
- build project
- run project

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Docker** & **Docker Compose**

## How to Build & Run

1. **Install dependencies**

```bash
npm install
```

1. **Generate Prisma client**

```bash
npx prisma generate
```

1. **Configure environment variables**

```bash
cp .env.example .env
```

Then edit `.env` file with your database URL and other settings.

1. **Infrastructure**

Since the `docker-compose.dev.yml` was created for local development you can easily set up a Postgres, MinIO, Redis etc...

```bash
docker compose -f docker-compose.dev.yml up -d
```

1. **Run the project**

```bash
npm run build
npm run start:prod
```

## Environment variables

```bash
# Application port
APP_PORT=5000
```

```bash
# the default value for local is
# DATABASE_URL=postgresql://hrcrm:password@localhost:5433/hrcrm_db
DATABASE_URL=
```

```bash
# JWT Options
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRATION=
REFRESH_TOKEN_EXPIRATION=
RESET_PASSWORD_EXPIRATION=
```

```bash
# SMTP
SMTP_FROM=
SMTP_USER=
SMTP_HOST=
SMTP_PASS=
SMTP_PORT=

# Whether users will or not receive emails 
MAIL_ENABLED=

# Frontend url
EMAIL_VERIFICATION_URL=
EMAIL_FORGOT_PASSWORD_URL=
```

```bash
# AI
GEMINI_API_KEY=
AI_MODEL="gemini-1.5-flash"
```

```bash
# Storage

STORAGE_HOST=localhost
STORAGE_PORT=9000
STORAGE_USE_SSL=false
STORAGE_BUCKET=resumes

# If MinIO used

MINIO_ROOT_USER=hrcrm
MINIO_ROOT_PASSWORD=password
```

```bash
# Redis

REDIS_HOST=valkey
REDIS_PORT=6379
REDIS_PASSWORD=password
```

---

## How to run migrations

Create and apply a new migration

```bash
npx prisma migrate dev --name <migration_name>
````

for example:

```bash
# Will create a new migration called `add_user_table`
npx prisma migrate dev --name add_user_table
```

To reset the database (development only):

```bash
npx prisma migrate reset
```

For more detailed info read official [Prisma Official Documantation](https://www.prisma.io/docs/cli)

## Project architecture

```txt
                          ┌───────────────────┐                        
                          │Web / Mobile Client│                        
                          ├───────────────────┤                        
                          └───────────────────┘                        
                                     |                                 
                                     |                                 
                               ┌──────────┐                            
                               │API Server│                            
                               ├──────────┤                            
                               └──────────┘                            
                                     |                                 
                                     |                                 
┌──────────┐  ┌──────────────┐   ┌─────┐   ┌──────┐   ┌───────────────┐
│PostgreSQL│  │Object Storage│   │Redis│   │AI API│   │SMTP / Mail API│
├──────────┤  ├──────────────┤   ├─────┤   ├──────┤   ├───────────────┤
└──────────┘  └──────────────┘   └─────┘   └──────┘   └───────────────┘
```

### Top level structure `project root`

The project is built on a modular layered architecture (modular monolith + clean-ish architecture) with division into:

- API layer (src/api) — business modules and use cases
- Shared layer (src/shared) — Core with reused logic and infrastructure layers
- Infrastructure layer — external services such as: Database, Redis (Valkey), AI, Storage
- Domain layer — Clear entities and tyeps
- DevOps & tooling layer — Docker, Prisma, scripts, tests

```bash
hr-ai-crm top-level architecture
├── docker-compose.dev.yml        # Local development
├── docker-compose.yml            # Production environment
├── Dockerfile                    # production build container
├── prisma                        # ORM level (Prisma)
├── scripts                       # Utility scripts
├── test                          # e2e tests
├── docs                          # Project docs
├── src                           # Application code
└── tsconfig.json / jest config   # Configs
```

---

### Core architecture `src/api`

Responds for: HTTP Controllers, DTO, use-cases, guards, middleware, feature modules

```bash
src/api/auth
├── auth.controller.v1.ts     # HTTP Endpoints
├── auth.module.ts            # DI module
├── dto/                      # in/out API models (a.k.a. requests and responses)
├── modules/                  # inner submodules
│   ├── configs/              # config features
│   ├── guards/               # auth middleware / guards
│   └── ...                   # other modules
└── use-cases/                # business logic
```

### Shared Layer (Core reusable layer) `src/shared`

This is the project core, which is used in every module

### Contracts (Application layer)

Utility stuff and shared contracts / abstractions

```bash
shared/contracts
├── dto/              # general DTOs (pagination meta, search)
├── mail/             # service interface
├── use-cases/        # base use case interface
└── mail/             # base mail interface
```

### Domain layer (Business core)

Stores pure business models

```bash
shared/domain
└── users
    ├── user.entity.ts
    └── user.types.ts
```

### Infrastructure layer

Stores all external infrastructure

```bash
database/
├── prisma.service.ts
├── database.module.ts
├── repositories/
│   ├── users.repository.ts
│   ├── candidates.repository.ts
│   └── ...
```

Which provides an abstraction over AI providers

```bash
ai/
├── ai.service.ts
├── providers/
│   ├── gemini.provider.ts
│   └── disabled-ai.provider.ts
```

```bash
storage/
├── services                # And you basically create a new service
│   │                       # if you need to migrate to s3 for example
│   └── minio.service.ts
├── storage.config.ts
├── storage.interface.ts    # shared storage interface
└── storage.module.ts

```

```bash
mail/
├── mail.service.ts
└── templates/
    ├── verify-email.hbs
    └── forgot-password.hbs
```

### Testing layer

Provides e2e tests and complete API checks

```bash
test/
├── auth.e2e-spec.ts
├── candidates.e2e-spec.ts
└── app.e2e-spec.ts
```

## API Documentation

The application provides automatically generated Swagger/OpenAPI documentation.
Once you start the application, you can access the Swagger UI by navigating to:

**[http://localhost:5000/api/docs](http://localhost:5000/api/docs)**

![Swagger Screenshot](./docs/screenshots/swagger-screenshot.png)

This documentation provides an interactive interface for exploring all available endpoints, parameter requirements, and request/response models.

## Available Scripts

### Building & Running

- `npm run build` - Compiles the project into the `dist` folder
- `npm run start` - Starts the application
- `npm run start:dev` - Starts the application in watch mode (auto-reloads on changes)
- `npm run start:debug` - Starts the application in watch mode with debug enabled
- `npm run start:prod` - Runs the compiled application (`dist/src/main.js`)

### Testing

- `npm run test` - Runs unit tests
- `npm run test:watch` - Runs unit tests in watch mode
- `npm run test:cov` - Runs tests and generates a code coverage report
- `npm run test:e2e` - Runs end-to-end tests

### Code Formatting & Linting

- `npm run lint` - Lints the codebase using ESLint
- `npm run format` - Formats the code using Prettier
