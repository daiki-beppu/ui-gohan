/**
 * Database schema exports for Expo SQLite
 *
 * This file exports database schemas for use with drizzle-orm/expo-sqlite.
 * For React Native/Expo, we use local SQLite with Turso sync via expoDb.syncLibSQL()
 * instead of direct Turso connection (which requires Node.js runtime).
 */

import * as menuSchema from 'db/schemas/menu';

// Export all schemas for use with drizzle(expoDb, { schema })
export const schema = {
  ...menuSchema,
};
