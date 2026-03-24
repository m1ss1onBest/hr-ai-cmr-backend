# HR AI CRM

> [!WARNING]
> This file is still WIP

---

Make sure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** (comes with Node.js)
- **Docker** & **Docker Compose**

## How to Build & Run

1. **Install dependencies**

```bash
npm install
```

2. **Generate Prisma client**

```bash
npx prisma generate
```

3. **Configure environment variables**

```bash
cp .env.example .env
```

Then edit `.env` file with your database URL and other settings.

4. **Start the database**

```bash
docker compose up -d
```

5. **Run the project**

```bash
# Development mode
mpm run start:dev

# Or other profiles are defined in `package.json`
# npm run start:prod
```

---

## How to run migrations

Create and apply a new migration

```bash
npx prisma migrate dev --name <migration_name>
```

for example:

```bash
npx prisma migrate dev --name add_user_table
```

To reset the database (development only):

```bash
npx prisma migrate reset
```

For more detailed info read official [Prisma Official Documantation](https://www.prisma.io/docs/cli)
