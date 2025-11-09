import type { DayOfWeekType, MealTypeType, Menu } from '@/types/menu';
import { useSQLiteContext } from 'expo-sqlite';
import { nanoid } from 'nanoid/non-secure';
import { useCallback } from 'react';

if (!process.env.EXPO_PUBLIC_TURSO_DATABASE_URL || !process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN) {
  throw new Error('Turso DB URL and Auth Token must be set in .env.local');
}

export const DB_NAME = 'ui-gohan-db.db';

export const tursoOptions = {
  url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL,
  authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN,
};

/**
 * Generate nanoid (10 characters)
 * React Native環境では non-secure版を使用
 */
function generateId(): string {
  return nanoid(10);
}

/**
 * Convert database row to Menu type
 */
function rowToMenu(row: any): Menu {
  return {
    id: row.id,
    userId: row.user_id,
    dayOfWeek: row.day_of_week as DayOfWeekType,
    mealType: row.meal_type as MealTypeType,
    dishName: row.dish_name,
    memo: row.memo,
    sortOrder: row.sort_order,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

/**
 * Menu API hook - provides CRUD operations without Context
 */
export function useMenuAPI() {
  const db = useSQLiteContext();

  /**
   * Sync with Turso DB
   */
  const syncMenus = useCallback(async () => {
    console.log('Syncing menus with Turso DB...');

    try {
      await db.syncLibSQL();
      console.log('Synced menus with Turso DB');
    } catch (e) {
      console.error('Failed to sync menus:', e);
      throw e;
    }
  }, [db]);

  /**
   * Get all menus
   */
  const getMenus = useCallback(async (): Promise<Menu[]> => {
    const rows = await db.getAllAsync<any>('SELECT * FROM menus ORDER BY sort_order ASC');
    return rows.map(rowToMenu);
  }, [db]);

  /**
   * Get a specific menu by ID
   */
  const getMenuById = useCallback(
    async (menuId: string): Promise<Menu | null> => {
      const row = await db.getFirstAsync<any>('SELECT * FROM menus WHERE id = ?', [menuId]);

      if (!row) {
        return null;
      }

      return rowToMenu(row);
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
      const id = generateId();
      const now = Date.now();
      const sortOrder = data.sortOrder ?? 0;
      const userId = ''; // 認証なしの場合は空文字列

      await db.runAsync(
        `INSERT INTO menus (id, user_id, day_of_week, meal_type, dish_name, memo, sort_order, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id,
          userId,
          data.dayOfWeek,
          data.mealType,
          data.dishName,
          data.memo ?? null,
          sortOrder,
          now,
          now,
        ]
      );

      return {
        id,
        userId,
        dayOfWeek: data.dayOfWeek,
        mealType: data.mealType,
        dishName: data.dishName,
        memo: data.memo ?? null,
        sortOrder,
        createdAt: new Date(now),
        updatedAt: new Date(now),
      };
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
      // Get existing menu
      const existingMenu = await getMenuById(menuId);

      if (!existingMenu) {
        throw new Error('Menu not found');
      }

      // Merge existing values with updates
      const updatedMenu = {
        dayOfWeek: data.dayOfWeek ?? existingMenu.dayOfWeek,
        mealType: data.mealType ?? existingMenu.mealType,
        dishName: data.dishName ?? existingMenu.dishName,
        memo: data.memo !== undefined ? data.memo : existingMenu.memo,
        sortOrder: data.sortOrder ?? existingMenu.sortOrder,
        updatedAt: Date.now(),
      };

      await db.runAsync(
        `UPDATE menus
         SET day_of_week = ?, meal_type = ?, dish_name = ?, memo = ?, sort_order = ?, updated_at = ?
         WHERE id = ?`,
        [
          updatedMenu.dayOfWeek,
          updatedMenu.mealType,
          updatedMenu.dishName,
          updatedMenu.memo ?? null,
          updatedMenu.sortOrder,
          updatedMenu.updatedAt,
          menuId,
        ]
      );

      return {
        id: menuId,
        userId: existingMenu.userId,
        dayOfWeek: updatedMenu.dayOfWeek,
        mealType: updatedMenu.mealType,
        dishName: updatedMenu.dishName,
        memo: updatedMenu.memo,
        sortOrder: updatedMenu.sortOrder,
        createdAt: existingMenu.createdAt,
        updatedAt: new Date(updatedMenu.updatedAt),
      };
    },
    [db, getMenuById]
  );

  /**
   * Delete a menu
   */
  const deleteMenu = useCallback(
    async (menuId: string): Promise<void> => {
      const result = await db.runAsync('DELETE FROM menus WHERE id = ?', [menuId]);

      if (result.changes === 0) {
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
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM menus WHERE day_of_week = ? ORDER BY sort_order ASC',
        [dayOfWeek]
      );
      return rows.map(rowToMenu);
    },
    [db]
  );

  /**
   * Get menus filtered by meal type
   */
  const getMenusByMealType = useCallback(
    async (mealType: MealTypeType): Promise<Menu[]> => {
      const rows = await db.getAllAsync<any>(
        'SELECT * FROM menus WHERE meal_type = ? ORDER BY sort_order ASC',
        [mealType]
      );
      return rows.map(rowToMenu);
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
