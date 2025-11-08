import { DaySection } from '@/components/day-section';
import { Text } from '@/components/ui/text';
import { DAY_LABELS } from '@/const/day-of-week';
import { MOCK_MENUS } from '@/lib/mock-data';
import type { Menu } from '@/types/menu';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // モックデータを読み込む（後でAPI呼び出しに置き換え）
  useEffect(() => {
    // ローディングシミュレーション
    setTimeout(() => {
      setMenus(MOCK_MENUS);
      setIsLoading(false);
    }, 500);
  }, []);

  // 曜日ごとにグループ化（月曜=0, 日曜=6）
  const menusByDay = DAY_LABELS.map((label, index) => ({
    label,
    dayOfWeek: index,
    menus: menus.filter((menu) => menu.dayOfWeek === index),
  }));

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['bottom']}>
      <Stack.Screen
        options={{
          title: 'ういごはん',
        }}
      />

      <ScrollView className="flex-1 bg-background">
        {/* 献立リスト */}
        <View className="gap-4 p-4">
          {isLoading ? (
            <View className="items-center justify-center py-8">
              <Text className="text-muted-foreground">献立を読み込んでいます...</Text>
            </View>
          ) : (
            menusByDay.map(({ label, dayOfWeek, menus: dayMenus }) => (
              <DaySection
                key={dayOfWeek}
                dayLabel={label}
                dayOfWeek={dayOfWeek}
                menus={dayMenus}
                onAddPress={() => {
                  // 献立追加画面への遷移（将来実装）
                  console.log('Add menu for:', dayOfWeek);
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
