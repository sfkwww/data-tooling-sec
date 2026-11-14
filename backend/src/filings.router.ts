import { Router } from 'express';
import type { FilingsService } from './filings.service.js';
import { filingsQuerySchema } from './sec.schema.js';

export const createFilingsRouter = (service: FilingsService) =>
  Router().get('/companies/:ticker/filings', async (req, res) => {
    const query = filingsQuerySchema.parse(req.query);
    res.json(await service.getFilings(req.params.ticker, query));
  });
