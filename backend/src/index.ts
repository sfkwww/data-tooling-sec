import { createApp } from './app.js';
import { env } from './config/env.js';

const app = createApp({
  corsOrigin: env.CORS_ORIGIN,
});

app.listen(env.PORT, () => {
  console.log(`Backend listening on http://localhost:${env.PORT}`);
});
