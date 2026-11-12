import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000),
  SEC_USER_AGENT: z
    .string()
    .min(1, 'SEC requires a User-Agent with contact info, e.g. "Acme Inc dev@acme.com"'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
});

export type Env = z.infer<typeof envSchema>;

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error(
    `Invalid environment (see backend/.env.example):\n${z.prettifyError(parsed.error)}`,
  );
  process.exit(1);
}

export const env: Env = parsed.data;
