import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Text } from '@/components/ui/text';
import { Textarea } from '@/components/ui/textarea';
import { DAY_LABELS, DAY_OF_WEEK } from '@/const/day-of-week';
import { MEAL_TYPE, MEAL_TYPE_LABELS } from '@/const/meal-type';
import type { DayOfWeekType, MealTypeType, Menu } from '@/types/menu';
import { useMemo, useState } from 'react';
import { View } from 'react-native';

type EditMenuDialogProps = {
  menu?: Menu; // 新規追加の場合は undefined
  dayOfWeek?: DayOfWeekType; // 新規追加時の初期曜日
  mealType?: MealTypeType; // 新規追加時の初期食事タイプ
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updates: {
    dayOfWeek: DayOfWeekType;
    mealType: MealTypeType;
    dishName: string;
    memo: string | null;
  }) => void;
};

export function EditMenuDialog({
  menu,
  dayOfWeek: initialDayOfWeek,
  mealType: initialMealType,
  open,
  onOpenChange,
  onSave,
}: EditMenuDialogProps) {
  // 新規追加モードかどうか
  const isNewMenu = !menu;

  // 各フィールドの初期値を設定
  const [dishName, setDishName] = useState(menu?.dishName || '');
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeekType>(
    menu?.dayOfWeek ?? initialDayOfWeek ?? 0
  );
  const [mealType, setMealType] = useState<MealTypeType>(
    menu?.mealType ?? initialMealType ?? MEAL_TYPE.Dinner
  );
  const [memo, setMemo] = useState(menu?.memo || '');

  const handleSave = () => {
    onSave({
      dayOfWeek,
      mealType,
      dishName: dishName.trim(),
      memo: memo.trim() || null,
    });
    onOpenChange(false);
  };

  const dayOptions = useMemo(
    () =>
      Object.entries(DAY_OF_WEEK).map(([key, value]) => ({
        label: DAY_LABELS[value],
        value: value.toString(),
      })),
    []
  );

  const mealTypeOptions = useMemo(
    () =>
      Object.entries(MEAL_TYPE).map(([key, value]) => ({
        label: MEAL_TYPE_LABELS[value],
        value,
      })),
    []
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-full">
        <DialogHeader>
          <DialogTitle>{isNewMenu ? '献立を追加' : '献立を編集'}</DialogTitle>
        </DialogHeader>

        <View className="gap-4 py-4">
          {/* 献立名 */}
          <View className="gap-2">
            <Label nativeID="dishName">献立名</Label>
            <Input
              placeholder="例: カレーライス"
              value={dishName}
              onChangeText={setDishName}
              aria-labelledby="dishName"
            />
          </View>

          {/* 曜日（編集モードのみ表示） */}
          {!isNewMenu && (
            <View className="gap-2">
              <Label nativeID="dayOfWeek">曜日</Label>
              <Select
                value={{ value: dayOfWeek.toString(), label: DAY_LABELS[dayOfWeek] }}
                onValueChange={(option) => {
                  if (option) {
                    setDayOfWeek(parseInt(option.value) as DayOfWeekType);
                  }
                }}>
                <SelectTrigger>
                  <SelectValue placeholder="曜日を選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {dayOptions.map((option) => (
                      <SelectItem key={option.value} label={option.label} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </View>
          )}

          {/* 食事タイプ */}
          <View className="gap-2">
            <Label nativeID="mealType">食事タイプ</Label>
            <Select
              value={{ value: mealType, label: MEAL_TYPE_LABELS[mealType] }}
              onValueChange={(option) => {
                if (option) {
                  setMealType(option.value as MealTypeType);
                }
              }}>
              <SelectTrigger>
                <SelectValue placeholder="食事タイプを選択" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {mealTypeOptions.map((option) => (
                    <SelectItem key={option.value} label={option.label} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </View>

          {/* メモ */}
          <View className="gap-2">
            <Label nativeID="memo">メモ（任意）</Label>
            <Textarea
              placeholder="例: 辛口で"
              value={memo}
              onChangeText={setMemo}
              aria-labelledby="memo"
              numberOfLines={3}
            />
          </View>
        </View>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              <Text>キャンセル</Text>
            </Button>
          </DialogClose>
          <Button onPress={handleSave} disabled={!dishName.trim()}>
            <Text>保存</Text>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
