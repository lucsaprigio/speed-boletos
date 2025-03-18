import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'dev', 'production']).default('development'),
    NEXT_API_HOST: z.string(),
    NEXT_API_PORT: z.string(),
    NEXT_API_DATABASE: z.string(),
    NEXT_API_USER: z.string(),
    NEXT_API_PASSWORD: z.string(),
    NEXT_PUBLIC_API_FILE:z.string(),
    NEXT_PUBLIC_API_LOCAL: z.string(),
    MP_NOTIFICATION_URL: z.string(),
    MP_ACCESS_TOKEN: z.string(),
    MP_PUBLIC_KEY: z.string()
})

const _env = envSchema.safeParse(process.env);

export const env = _env.data;