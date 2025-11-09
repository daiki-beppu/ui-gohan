import { EmptyMenu } from '@/components/empty-menu';
import { MenuCard } from '@/components/menu-card';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Text } from '@/components/ui/text';
import type { Menu } from '@/types/menu';
import { View } from 'react-native';

type DaySectionProps = {
  dayLabel: string;
  dayOfWeek: number;
  menus: Menu[];
  onAddPress?: () => void;
  onEditMenu?: (menuId: string) => void;
  onDeleteMenu?: (menuId: string) => void;
};

export function DaySection({
  dayLabel,
  dayOfWeek,
  menus,
  onAddPress,
  onEditMenu,
  onDeleteMenu,
}: DaySectionProps) {
  return (
    <Card>
      <CardHeader className="border-b border-border">
        <View className="mb-6 flex-row items-center justify-between">
          <CardTitle className="text-lg">{dayLabel}</CardTitle>
          {menus.length > 0 && (
            <Button onPress={onAddPress}>
              <Text>献立を追加</Text>
            </Button>
          )}
        </View>
      </CardHeader>

      <CardContent className="pt-4">
        {menus.length > 0 ? (
          <View className="gap-3">
            {menus.map((menu) => (
              <MenuCard
                key={menu.id}
                menu={menu}
                onEdit={onEditMenu ? () => onEditMenu(menu.id) : undefined}
                onDelete={onDeleteMenu ? () => onDeleteMenu(menu.id) : undefined}
              />
            ))}
          </View>
        ) : (
          <EmptyMenu dayLabel={dayLabel} onAddPress={onAddPress} />
        )}
      </CardContent>
    </Card>
  );
}
