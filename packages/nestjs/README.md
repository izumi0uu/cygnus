# NestJS Backend

This is the NestJS backend service for the Cygnus monorepo.

## Getting Started

### Installation

Install dependencies from the root of the monorepo:

```bash
yarn install
```

### Development

Start the development server:

```bash
# From root
yarn nestjs:start:dev

# Or from this directory
yarn start:dev
```

The server will start on `http://localhost:3000` by default.

### Available Scripts

- `yarn build` - Build the application
- `yarn start` - Start the production server
- `yarn start:dev` - Start the development server with hot reload
- `yarn start:debug` - Start the server in debug mode
- `yarn start:prod` - Start the production server
- `yarn lint` - Run ESLint
- `yarn format` - Format code with Prettier
- `yarn test` - Run unit tests
- `yarn test:e2e` - Run end-to-end tests
- `yarn test:cov` - Run tests with coverage
- `yarn check-types` - Check TypeScript types

### Project Structure

```
src/
├── app.controller.ts      # Root controller
├── app.service.ts         # Root service
├── app.module.ts          # Root module
└── main.ts                # Application entry point
```

### API Endpoints

- `GET /` - Returns "Hello from NestJS!"
- `GET /health` - Health check endpoint

### Environment Variables

- `PORT` - Server port (default: 3000)
- `FRONTEND_URL` - Frontend URL for CORS (default: http://localhost:4321)

### Testing

Run unit tests:

```bash
yarn test
```

Run e2e tests:

```bash
yarn test:e2e
```

### Integration with Frontend

The NestJS backend is configured to allow CORS requests from the Next.js frontend running on port 4321. You can configure this in `src/main.ts`.
