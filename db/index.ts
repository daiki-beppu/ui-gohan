import * as menuSchema from '@/db/schemas/menu';
import { drizzle } from 'drizzle-orm/libsql/web';

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    ...menuSchema,
  },
});
