import { config } from 'dotenv';

//if we have multiple env files, we can specify the path
config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRY, ARCJET_KEY, ARCJET_ENV } = process.env;