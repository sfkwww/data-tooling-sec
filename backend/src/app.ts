import cors from 'cors';
import express, { type Express } from 'express';
import type { FilingsRepository } from './repository/filings.repository.js';
import { createFilingsRouter } from './filings.router';
import { createFilingsService } from './filings.service.js';
import { errorHandler, notFoundHandler } from './middleware/error-handler.js';

interface AppDeps {
  corsOrigin: string;
  filingsRepository: FilingsRepository;
}

export function createApp({ corsOrigin, filingsRepository }: AppDeps): Express {
  const app = express();
  app.use(cors({ origin: corsOrigin }));
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use(createFilingsRouter(createFilingsService(filingsRepository)));

  app.use(notFoundHandler);
  app.use(errorHandler);
  return app;
}
