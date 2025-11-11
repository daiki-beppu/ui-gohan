import { DaySection } from '@/components/day-section';
import { EditMenuDialog } from '@/components/edit-menu-dialog';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { DAY_LABELS } from '@/const/day-of-week';
import { MEAL_TYPE } from '@/const/meal-type';
import { useMenuAPI } from '@/lib/api/menus';
import type { DayOfWeekType, MealTypeType, Menu } from '@/types/menu';
import { Link, Stack } from 'expo-router';
import { Bug } from 'lucide-react-native';
import { useCallback, useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [menuData, setMenuData] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [editingMenu, setEditingMenu] = useState<Menu | null>(null);

  // Menu API フックを取得
  const { getMenus, createMenu, updateMenu, deleteMenu } = useMenuAPI();

  // 初回マウント時に献立データを取得
  useEffect(() => {
    const fetchMenus = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const menus = await getMenus();

        // データ確認用のログ出力
        console.log('=== 献立データ取得完了 ===');
        console.log('件数:', menus.length);
        console.log('データ:', JSON.stringify(menus, null, 2));
        console.table(
          menus.map((m) => ({
            料理名: m.dishName,
            曜日: DAY_LABELS[m.dayOfWeek],
            食事: m.mealType,
            メモ: m.memo || '-',
          }))
        );

        setMenuData(menus);
      } catch (err) {
        console.error('Failed to fetch menus:', err);
        setError(err instanceof Error ? err : new Error('献立の取得に失敗しました'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchMenus();
  }, [getMenus]);

  // 献立を追加するハンドラー
  const handleAddMenu = useCallback(
    async (dayOfWeek: DayOfWeekType) => {
      try {
        // 新しい献立を作成（デフォルト値）
        const newMenu = await createMenu({
          dayOfWeek,
          mealType: MEAL_TYPE.Dinner, // デフォルトは夕食
          dishName: '新しい献立',
          memo: null,
          sortOrder: menuData.filter((m) => m.dayOfWeek === dayOfWeek).length,
        });

        // ローカルの状態を更新
        setMenuData((prev) => [...prev, newMenu]);
      } catch (err) {
        console.error('Failed to create menu:', err);
        setError(err instanceof Error ? err : new Error('献立の追加に失敗しました'));
      }
    },
    [createMenu, menuData]
  );

  // 献立を削除するハンドラー
  const handleDeleteMenu = useCallback(
    async (menuId: string) => {
      try {
        await deleteMenu(menuId);

        // ローカルの状態を更新
        setMenuData((prev) => prev.filter((menu) => menu.id !== menuId));
      } catch (err) {
        console.error('Failed to delete menu:', err);
        setError(err instanceof Error ? err : new Error('献立の削除に失敗しました'));
      }
    },
    [deleteMenu]
  );

  // 献立を編集するハンドラー
  const handleEditMenu = useCallback(
    (menuId: string) => {
      const menu = menuData.find((m) => m.id === menuId);
      if (menu) {
        setEditingMenu(menu);
      }
    },
    [menuData]
  );

  // 献立を保存するハンドラー
  const handleSaveMenu = useCallback(
    async (updates: {
      dayOfWeek: DayOfWeekType;
      mealType: MealTypeType;
      dishName: string;
      memo: string | null;
    }) => {
      if (!editingMenu) return;

      try {
        const updatedMenu = await updateMenu(editingMenu.id, updates);

        // ローカルの状態を更新
        setMenuData((prev) =>
          prev.map((menu) => (menu.id === editingMenu.id ? updatedMenu : menu))
        );
      } catch (err) {
        console.error('Failed to update menu:', err);
        setError(err instanceof Error ? err : new Error('献立の更新に失敗しました'));
      }
    },
    [editingMenu, updateMenu]
  );

  // 曜日ごとにグループ化
  const menusByDay = DAY_LABELS.map((label, index) => ({
    label,
    dayOfWeek: index,
    menus: menuData.filter((menu) => menu.dayOfWeek === index),
  }));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'ういごはん',
          headerRight: () =>
            __DEV__ ? (
              <Link href="/debug" asChild>
                <Button variant="ghost" size="icon">
                  <Bug className="h-5 w-5" />
                </Button>
              </Link>
            ) : null,
        }}
      />

      <ScrollView className="flex-1 bg-background">
        <View className="gap-4 p-4">
          {isLoading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-muted-foreground">献立を読み込んでいます...</Text>
            </View>
          ) : error ? (
            <View className="items-center justify-center py-8">
              <Text className="text-destructive">エラーが発生しました</Text>
              <Text className="mt-2 text-sm text-muted-foreground">{error.message}</Text>
            </View>
          ) : (
            menusByDay.map(({ label, dayOfWeek, menus: dayMenus }) => (
              <DaySection
                key={dayOfWeek}
                dayLabel={label}
                dayOfWeek={dayOfWeek}
                menus={dayMenus}
                onAddPress={() => handleAddMenu(dayOfWeek as DayOfWeekType)}
                onEditMenu={handleEditMenu}
                onDeleteMenu={handleDeleteMenu}
              />
            ))
          )}
        </View>
      </ScrollView>

      {/* 編集ダイアログ */}
      {editingMenu && (
        <EditMenuDialog
          menu={editingMenu}
          open={!!editingMenu}
          onOpenChange={(open) => !open && setEditingMenu(null)}
          onSave={handleSaveMenu}
        />
      )}
    </SafeAreaView>
  );
}
