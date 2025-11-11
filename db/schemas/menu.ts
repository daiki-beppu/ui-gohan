import { id, timestamps } from '@/db/schemas/helpers';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

/**
 * menusテーブル
 */
export const menus = sqliteTable('menus', {
  id,
  userId: text('user_id').notNull().default(''), // 認証なしの場合は空文字列
  dayOfWeek: integer('day_of_week').notNull(), // 0=日曜, 1=月曜, ..., 6=土曜
  mealType: text('meal_type').notNull(), // 'breakfast', 'lunch', 'dinner', 'snack'
  dishName: text('dish_name').notNull(),
  memo: text('memo'),
  sortOrder: integer('sort_order').notNull().default(0),
  ...timestamps,
});

// Drizzle用の型エクスポート
export type Menu = typeof menus.$inferSelect;
export type MenuInsert = typeof menus.$inferInsert;
