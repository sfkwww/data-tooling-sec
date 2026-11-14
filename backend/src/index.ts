import { createApp } from './app.js';
import { env } from './config/env.js';
import { createFilingsRepository } from './repository/filings.repository.js';

const app = createApp({
  corsOrigin: env.CORS_ORIGIN,
  filingsRepository: createFilingsRepository(env.SEC_USER_AGENT),
});

app.listen(env.PORT, () => {
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});
