import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { expo } from '@better-auth/expo';
import { anonymous } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: 'process.env.BETTER_AUTH_URL!,',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => nanoid(10),
    },
  },
  plugins: [expo(), anonymous()],
  trustedOrigins: ['ui-gohan://'],
});
