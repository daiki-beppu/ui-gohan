import { db } from '@/db';
import { MenuInsert, menus } from '@/db/schemas/menu';
import { and, eq } from 'drizzle-orm';

/**
 * ユーザーの献立一覧を取得
 * @param userId
 */
export async function getMenus(userId: string) {
  return await db.select().from(menus).where(eq(menus.userId, userId)).orderBy(menus.sortOrder);
}

/**
 * 献立を作成
 */
export async function createMenu(
  userId: string,
  data: Omit<MenuInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>
) {
  const result = await db
    .insert(menus)
    .values({
      ...data,
      userId,
    })
    .returning();

  return result[0];
}

/**
 * 献立を更新
 */
export async function updateMenu(
  userId: string,
  menuId: string,
  data: Partial<Omit<MenuInsert, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
) {
  const result = await db
    .update(menus)
    .set(data)
    .where(and(eq(menus.id, menuId), eq(menus.userId, userId)))
    .returning();

  if (result.length === 0) {
    throw new Error('Menu not found or unauthorized');
  }

  return result[0];
}

/**
 * 献立を削除
 */
export async function deleteMenu(userId: string, menuId: string) {
  const result = await db
    .delete(menus)
    .where(and(eq(menus.id, menuId), eq(menus.userId, userId)))
    .returning();

  if (result.length === 0) {
    throw new Error('Menu not found or unauthorized');
  }
}

/**
 * 特定の献立を取得
 */
export async function getMenuById(userId: string, menuId: string) {
  const result = await db
    .select()
    .from(menus)
    .where(and(eq(menus.id, menuId), eq(menus.userId, userId)))
    .limit(1);

  return result[0] || null;
}
