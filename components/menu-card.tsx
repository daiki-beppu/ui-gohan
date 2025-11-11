import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { MEAL_TYPE_LABELS } from '@/const/meal-type';
import type { Menu } from '@/types/menu';
import { View } from 'react-native';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type MenuCardProps = {
  menu: Menu;
  onEdit?: () => void;
  onDelete?: () => void;
};

export function MenuCard({ menu, onEdit, onDelete }: MenuCardProps) {
  const mealTypeLabel = MEAL_TYPE_LABELS[menu.mealType] || '不明';

  return (
    <Card className="mb-3">
      <CardHeader className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center">
          <CardTitle className="text-base">{menu.dishName}</CardTitle>
          <Badge variant="secondary" className="ml-2">
            <Text className="text-xs">{mealTypeLabel}</Text>
          </Badge>
        </View>
        <View className="flex-row gap-1">
          {onEdit && (
            <Button variant={'outline'} onPress={onEdit}>
              <Text>編集</Text>
            </Button>
          )}
          {onDelete && (
            <Button variant="outline" onPress={onDelete}>
              <Text>削除</Text>
            </Button>
          )}
        </View>
      </CardHeader>
      {menu.memo && (
        <CardContent>
          <Text className="text-sm text-muted-foreground">{menu.memo}</Text>
        </CardContent>
      )}
    </Card>
  );
}
