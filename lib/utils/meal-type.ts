import { MEAL_TYPE_LABELS } from '@/const/meal-type';

/**
 * 食事タイプラベル取得
 * @param mealType
 * @returns
 */
export const getMealTypeLabel = (mealType: string): string => {
  return MEAL_TYPE_LABELS[mealType] || '不明';
};
