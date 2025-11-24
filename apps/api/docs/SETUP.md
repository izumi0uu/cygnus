# Cygnus API Service - Environment Setup Guide

This guide will walk you through setting up the environment for the Cygnus API Service.

## 1. Environment Preparation

### 1.1 Install Node.js

The project uses TypeScript 5.x and requires Node.js >= 20.18.3.

**Check Node.js version:**

```bash
node --version
```

**If not installed or version is too low:**

- Visit [Node.js official website](https://nodejs.org/) to download and install
- Or use nvm (Node Version Manager):
  ```bash
  # macOS/Linux
  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
  nvm install 20.18.3
  nvm use 20.18.3
  ```

### 1.2 Install PostgreSQL Database

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

#### Linux (Ubuntu/Debian)

```bash
# Update package list
sudo apt update

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib

# Start service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
psql --version
```

#### Create Database

```bash
# Connect to PostgreSQL (macOS uses current system user, Linux uses postgres user)
# macOS:
psql postgres

# Linux:
sudo -u postgres psql

# Execute in PostgreSQL command line:
CREATE DATABASE cygnus;

# Optional: Create dedicated user
CREATE USER cygnus_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cygnus TO cygnus_user;

# Exit
\q
```

### 1.3 Install Redis Server

Redis is used for BullMQ message queue.

#### macOS (using Homebrew)

```bash
# Install Redis
brew install redis

# Start Redis service
brew services start redis

# Verify installation
redis-cli ping
# Should return: PONG
```

#### Linux (Ubuntu/Debian)

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Start service
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Verify installation
redis-cli ping
# Should return: PONG
```

### 1.4 Configure Environment Variables

1. **Copy environment variable template:**

   ```bash
   cd apps/api
   cp env.example .env
   ```

2. **Edit `.env` file with your configuration:**

   ```bash
   # Use your preferred editor
   nano .env
   # or
   code .env
   ```

3. **Required configuration items:**
   - `DB_HOST` - Database host (default: localhost)
   - `DB_PORT` - Database port (default: 5432)
   - `DB_USERNAME` - Database username (default: postgres)
   - `DB_PASSWORD` - Database password
   - `DB_DATABASE` - Database name (default: cygnus)
   - `REDIS_HOST` - Redis host (default: localhost)
   - `REDIS_PORT` - Redis port (default: 6379)

## 2. Install Dependencies

Execute from the project root directory:

```bash
# From project root
yarn install
```

This will install dependencies for all services, including:

- NestJS framework
- TypeORM (database ORM)
- BullMQ (message queue)
- PostgreSQL driver

## 3. Verify Environment

### Check Service Status

**PostgreSQL:**

```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

**Redis:**

```bash
# macOS
brew services list | grep redis

# Linux
sudo systemctl status redis-server

# Test connection
redis-cli ping
```

### Test Database Connection

```bash
# Connect to database
psql -h localhost -U postgres -d cygnus

# If connection is successful, you'll see PostgreSQL prompt
# Type \q to exit
```

## 4. Next Steps

After environment preparation is complete, you can:

1. **Start the development server:**

   ```bash
   # From root directory
   yarn api:dev

   # Or from apps/api directory
   cd apps/api
   yarn start:dev
   ```

2. **Verify service is running:**

   ```bash
   curl http://localhost:3000/health
   ```

3. **Continue with database migrations and module configuration** (see next steps)

## Troubleshooting

### PostgreSQL Connection Failed

- Check if service is running: `brew services list` or `sudo systemctl status postgresql`
- Verify database credentials are correct
- Check `pg_hba.conf` configuration (Linux)

### Redis Connection Failed

- Check if service is running: `redis-cli ping`
- Verify Redis host and port configuration
- Check firewall settings

### Port Already in Use

- Check port usage: `lsof -i :3000` (macOS) or `netstat -tulpn | grep 3000` (Linux)
- Modify `PORT` configuration in `.env`

## Reference Documentation

- [Environment Variables Configuration](./ENVIRONMENT.md) - Detailed environment variables reference
- [PostgreSQL Official Documentation](https://www.postgresql.org/docs/)
- [Redis Official Documentation](https://redis.io/docs/)
