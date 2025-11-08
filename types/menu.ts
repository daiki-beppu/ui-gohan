import { DAY_OF_WEEK } from '@/const/day-of-week';
import { MEAL_TYPE } from '@/const/meal-type';

export type DayOfWeekType = (typeof DAY_OF_WEEK)[keyof typeof DAY_OF_WEEK];
export type MealTypeType = (typeof MEAL_TYPE)[keyof typeof MEAL_TYPE];

export type Menu = {
  id: string;
  userId: string;
  dayOfWeek: DayOfWeekType;
  mealType: MealTypeType;
  dishName: string;
  memo?: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};
