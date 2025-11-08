import { sql } from 'drizzle-orm';
import { integer, text } from 'drizzle-orm/sqlite-core';
import { nanoid } from 'nanoid';

/**
 * 共通の日付カラム（Better Auth準拠）
 */
export const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp_ms' })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
};

/**
 * 共通のIDカラム（nanoid 10文字）
 */
export const id = text('id')
  .primaryKey()
  .$defaultFn(() => nanoid(10));
