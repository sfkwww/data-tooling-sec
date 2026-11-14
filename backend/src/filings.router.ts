import { Router } from 'express';
import type { FilingsService } from './filings.service.js';
import { filingsQuerySchema, summaryQuerySchema } from './sec.schema.js';

export const createFilingsRouter = (service: FilingsService) =>
  Router()
    .get('/companies/:ticker/filings', async (req, res) => {
      const query = filingsQuerySchema.parse(req.query);
      res.json(await service.getFilings(req.params.ticker, query));
    })
    .get('/filings/summary', async (req, res) => {
      const query = summaryQuerySchema.parse(req.query);
      res.json(await service.getSummary(query));
    });
