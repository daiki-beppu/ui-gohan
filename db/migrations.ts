// Drizzle Kitで生成されたSQLマイグレーション
// pnpm drizzle-kit generate を実行後、手動でここにコピーする

export const migrations = {
  version: 1,
  statements: [
    `CREATE TABLE IF NOT EXISTS menus (
      id TEXT PRIMARY KEY NOT NULL,
      user_id TEXT DEFAULT '' NOT NULL,
      day_of_week INTEGER NOT NULL,
      meal_type TEXT NOT NULL,
      dish_name TEXT NOT NULL,
      memo TEXT,
      sort_order INTEGER DEFAULT 0 NOT NULL,
      created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      updated_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
    );`,
  ],
};
