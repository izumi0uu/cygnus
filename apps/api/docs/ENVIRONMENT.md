# Environment Configuration Guide

This document explains how to configure environment variables for the Cygnus API Service.

## Quick Start

1. Copy the environment variable template file:

   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file with your configuration values

3. Ensure PostgreSQL and Redis services are running

## Required Environment Variables

### Server Configuration

- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Runtime environment (development/production)
- `FRONTEND_URL` - Frontend URL for CORS configuration (default: http://localhost:4321)

### Database Configuration (PostgreSQL)

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 5432)
- `DB_USERNAME` - Database username (default: postgres)
- `DB_PASSWORD` - Database password
- `DB_DATABASE` - Database name (default: cygnus)

### Redis Configuration

- `REDIS_HOST` - Redis host (default: localhost)
- `REDIS_PORT` - Redis port (default: 6379)
- `REDIS_PASSWORD` - Redis password (optional)

## Optional Environment Variables

### Authentication Configuration

- `JWT_SECRET` - JWT secret key (for user authentication)
- `JWT_EXPIRES_IN` - JWT expiration time (default: 7d)

### External Service API Keys

- `ONEBALANCE_API_KEY` - OneBalance API key (for quotes and balance queries)
- `PIMLICO_API_KEY` - Pimlico API key (for ERC-4337 smart accounts)
- `OPENAI_API_KEY` - OpenAI API key (for AI chat functionality)
- `GROQ_API_KEY` - Groq API key (for AI chat functionality)

### Blockchain RPC URLs

- `RPC_URL_ETHEREUM` - Ethereum mainnet RPC URL
- `RPC_URL_BASE` - Base chain RPC URL
- `RPC_URL_ARBITRUM` - Arbitrum chain RPC URL

## Installing and Configuring Database

### PostgreSQL Installation

#### macOS (using Homebrew)

```bash
brew install postgresql@15
brew services start postgresql@15
```

#### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE cygnus;

# Create user (if needed)
CREATE USER cygnus_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE cygnus TO cygnus_user;

# Exit
\q
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user
sudo -u postgres psql

# Create database
CREATE DATABASE cygnus;
```

### Redis Installation

#### macOS (using Homebrew)

```bash
brew install redis
brew services start redis
```

#### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Verify Redis is Running

```bash
redis-cli ping
# Should return: PONG
```

## Verify Configuration

After starting the application, access the health check endpoint:

```bash
curl http://localhost:3000/health
```

Should return:

```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "service": "api"
}
```

## Troubleshooting

### Database Connection Failed

- Check if PostgreSQL service is running: `brew services list` or `sudo systemctl status postgresql`
- Verify database credentials are correct
- Check firewall settings

### Redis Connection Failed

- Check if Redis service is running: `redis-cli ping`
- Verify Redis host and port configuration
- Check if Redis password is correct (if password is set)

### CORS Errors

- Ensure `FRONTEND_URL` environment variable matches the actual frontend URL
- Check if frontend is running on the correct port (default: 4321)
