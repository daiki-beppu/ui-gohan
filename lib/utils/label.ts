import { DAY_LABELS, DAY_SHORT_LABELS } from '@/const/day-of-week';

/**
 * 曜日ラベル取得
 * @param day
 * @returns
 */
export const getDayLabel = (day: number): string => {
  return DAY_LABELS[day] || '不明';
};

/**
 * 曜日ラベル取得(短縮)
 * @param day
 * @returns
 */
export const getDayShortLabel = (day: number): string => {
  return DAY_SHORT_LABELS[day] || '?';
};
