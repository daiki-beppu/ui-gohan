import { schema } from '@/db';
import type { DayOfWeekType, MealTypeType, Menu } from '@/types/menu';
import { eq } from 'drizzle-orm';
import type { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useMemo } from 'react';

if (!process.env.EXPO_PUBLIC_TURSO_DATABASE_URL || !process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN) {
  throw new Error('Turso DB URL and Auth Token must be set in .env.local');
}

export const DB_NAME = 'ui-gohan-db.db';

export const tursoOptions = {
  url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL,
  authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN,
};

/**
 * Menu API hook - provides CRUD operations without Context
 */
export function useMenuAPI() {
  const expoDb = useSQLiteContext();

  // Drizzle インスタンスをメモ化
  const db = useMemo(() => {
    const { drizzle } = require('drizzle-orm/expo-sqlite');
    return drizzle(expoDb, { schema }) as ExpoSQLiteDatabase<typeof schema>;
  }, [expoDb]);

  /**
   * Sync with Turso DB
   */
  const syncMenus = useCallback(async () => {
    const useLocalDB = process.env.EXPO_PUBLIC_USE_LOCAL_DB === 'true';

    if (useLocalDB) {
      console.log('ローカルモード：同期をスキップ');
      return;
    }

    console.log('Syncing menus with Turso DB...');

    try {
      await expoDb.syncLibSQL();
      console.log('Synced menus with Turso DB');
    } catch (e) {
      console.error('Failed to sync menus:', e);
      throw e;
    }
  }, [expoDb]);

  /**
   * Get all menus
   */
  const getMenus = useCallback(async (): Promise<Menu[]> => {
    const result = await db.select().from(schema.menus).orderBy(schema.menus.sortOrder);
    return result as Menu[];
  }, [db]);

  /**
   * Get a specific menu by ID
   */
  const getMenuById = useCallback(
    async (menuId: string): Promise<Menu | null> => {
      const result = await db
        .select()
        .from(schema.menus)
        .where(eq(schema.menus.id, menuId))
        .limit(1);

      return result[0] ? (result[0] as Menu) : null;
    },
    [db]
  );

  /**
   * Create a new menu
   */
  const createMenu = useCallback(
    async (data: {
      dayOfWeek: DayOfWeekType;
      mealType: MealTypeType;
      dishName: string;
      memo?: string | null;
      sortOrder?: number;
    }): Promise<Menu> => {
      const result = await db
        .insert(schema.menus)
        .values({
          dayOfWeek: data.dayOfWeek,
          mealType: data.mealType,
          dishName: data.dishName,
          memo: data.memo ?? null,
          sortOrder: data.sortOrder ?? 0,
        })
        .returning();

      return result[0] as Menu;
    },
    [db]
  );

  /**
   * Update an existing menu
   */
  const updateMenu = useCallback(
    async (
      menuId: string,
      data: Partial<{
        dayOfWeek: DayOfWeekType;
        mealType: MealTypeType;
        dishName: string;
        memo: string | null;
        sortOrder: number;
      }>
    ): Promise<Menu> => {
      const result = await db
        .update(schema.menus)
        .set(data)
        .where(eq(schema.menus.id, menuId))
        .returning();

      if (result.length === 0) {
        throw new Error('Menu not found');
      }

      return result[0] as Menu;
    },
    [db]
  );

  /**
   * Delete a menu
   */
  const deleteMenu = useCallback(
    async (menuId: string): Promise<void> => {
      const result = await db.delete(schema.menus).where(eq(schema.menus.id, menuId)).returning();

      if (result.length === 0) {
        throw new Error('Menu not found');
      }
    },
    [db]
  );

  /**
   * Get menus filtered by day of week
   */
  const getMenusByDay = useCallback(
    async (dayOfWeek: DayOfWeekType): Promise<Menu[]> => {
      const result = await db
        .select()
        .from(schema.menus)
        .where(eq(schema.menus.dayOfWeek, dayOfWeek))
        .orderBy(schema.menus.sortOrder);
      return result as Menu[];
    },
    [db]
  );

  /**
   * Get menus filtered by meal type
   */
  const getMenusByMealType = useCallback(
    async (mealType: MealTypeType): Promise<Menu[]> => {
      const result = await db
        .select()
        .from(schema.menus)
        .where(eq(schema.menus.mealType, mealType))
        .orderBy(schema.menus.sortOrder);
      return result as Menu[];
    },
    [db]
  );

  return {
    syncMenus,
    getMenus,
    getMenuById,
    createMenu,
    updateMenu,
    deleteMenu,
    getMenusByDay,
    getMenusByMealType,
  };
}
