import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import { Stack } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DebugScreen() {
  const db = useSQLiteContext();
  const [menuCount, setMenuCount] = useState<number | null>(null);
  const [allMenus, setAllMenus] = useState<any[]>([]);
  useDrizzleStudio(db);

  const checkMenuCount = async () => {
    const result = await db.getFirstAsync<{ count: number }>('SELECT COUNT(*) as count FROM menus');
    setMenuCount(result?.count ?? 0);
  };

  const showAllMenus = async () => {
    const menus = await db.getAllAsync('SELECT * FROM menus ORDER BY created_at DESC');
    setAllMenus(menus);
  };

  const clearAllMenus = async () => {
    await db.runAsync('DELETE FROM menus');
    setAllMenus([]);
    setMenuCount(0);
    console.log('✓ すべての献立を削除しました');
  };

  const showTableInfo = async () => {
    const tables = await db.getAllAsync(
      "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
    );
    console.log('📊 テーブル一覧:', tables);

    const schema = await db.getAllAsync('SELECT sql FROM sqlite_master WHERE name="menus"');
    console.log('📋 menusテーブルのスキーマ:', schema);
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'デバッグ',
        }}
      />

      <ScrollView className="flex-1">
        <View className="gap-4 p-4">
          <Card>
            <CardHeader>
              <CardTitle>データベース情報</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <Button onPress={checkMenuCount}>
                <Text>献立の件数を確認</Text>
              </Button>
              {menuCount !== null && (
                <Text className="text-center text-lg font-semibold">献立数: {menuCount}件</Text>
              )}

              <Button onPress={showTableInfo} variant="secondary">
                <Text>テーブル情報を表示（コンソール）</Text>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>データ操作</CardTitle>
            </CardHeader>
            <CardContent className="gap-3">
              <Button onPress={showAllMenus} variant="secondary">
                <Text>すべての献立を表示</Text>
              </Button>

              <Button onPress={clearAllMenus} variant="destructive">
                <Text>すべての献立を削除</Text>
              </Button>
            </CardContent>
          </Card>

          {allMenus.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>献立一覧 ({allMenus.length}件)</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollView className="max-h-96">
                  {allMenus.map((menu, index) => (
                    <View key={menu.id} className="mb-4 rounded border border-border p-3">
                      <Text className="font-semibold">{menu.dish_name}</Text>
                      <Text className="text-sm text-muted-foreground">ID: {menu.id}</Text>
                      <Text className="text-sm text-muted-foreground">
                        曜日: {menu.day_of_week}
                      </Text>
                      <Text className="text-sm text-muted-foreground">
                        食事タイプ: {menu.meal_type}
                      </Text>
                      {menu.memo && (
                        <Text className="text-sm text-muted-foreground">メモ: {menu.memo}</Text>
                      )}
                      <Text className="text-xs text-muted-foreground">
                        作成: {new Date(menu.created_at).toLocaleString('ja-JP')}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </CardContent>
            </Card>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
