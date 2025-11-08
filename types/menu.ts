import { DayOfWeek as DayOfWeekConst } from '@/const/day-of-week';
import { MealType as MealTypeConst } from '@/const/meal-type';

export type DayOfWeek = (typeof DayOfWeekConst)[keyof typeof DayOfWeekConst];
export type MealType = (typeof MealTypeConst)[keyof typeof MealTypeConst];

export type Menu = {
  id: string;
  userId: string;
  dayOfWeek: DayOfWeek;
  mealType: MealType;
  dishName: string;
  memo?: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
