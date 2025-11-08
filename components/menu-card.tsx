import { Badge } from '@/components/ui/badge';
import { Text } from '@/components/ui/text';
import { MEAL_TYPE_LABELS } from '@/const/meal-type';
import type { Menu } from '@/types/menu';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type MenuCardProps = {
  menu: Menu;
};

export function MenuCard({ menu }: MenuCardProps) {
  const mealTypeLabel = MEAL_TYPE_LABELS[menu.mealType] || '不明';

  return (
    <Card className="mb-3">
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-base">{menu.dishName}</CardTitle>
        <Badge variant="secondary" className="ml-2">
          <Text className="text-xs">{mealTypeLabel}</Text>
        </Badge>
      </CardHeader>
      {menu.memo && (
        <CardContent>
          <Text className="text-sm text-muted-foreground">{menu.memo}</Text>
        </CardContent>
      )}
    </Card>
  );
}
