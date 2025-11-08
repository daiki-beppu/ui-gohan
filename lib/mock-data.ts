import { DAY_OF_WEEK } from '@/const/day-of-week';
import { MEAL_TYPE } from '@/const/meal-type';
import type { Menu } from '@/types/menu';
import { parseISO } from 'date-fns';

/**
 * モックユーザーID
 */
const MOCK_USER_ID = 'mock-user-001';

/**
 * 週間献立モックデータ
 * 月曜〜日曜の7日分、一部の曜日は空
 */
export const MOCK_MENUS: Menu[] = [
  // 月曜日
  {
    id: 'menu-001',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Monday,
    mealType: MEAL_TYPE.Breakfast,
    dishName: '納豆ご飯と味噌汁',
    memo: '納豆は小粒が好き',
    sortOrder: 0,
    createdAt: parseISO('2025-01-06T07:00:00'),
    updatedAt: parseISO('2025-01-06T07:00:00'),
  },
  {
    id: 'menu-002',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Monday,
    mealType: MEAL_TYPE.Dinner,
    dishName: 'カレーライス',
    memo: 'じゃがいもと人参たっぷり',
    sortOrder: 1,
    createdAt: parseISO('2025-01-06T18:00:00'),
    updatedAt: parseISO('2025-01-06T18:00:00'),
  },

  // 火曜日
  {
    id: 'menu-003',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Tuesday,
    mealType: MEAL_TYPE.Breakfast,
    dishName: 'トーストとコーヒー',
    memo: null,
    sortOrder: 2,
    createdAt: parseISO('2025-01-07T07:30:00'),
    updatedAt: parseISO('2025-01-07T07:30:00'),
  },
  {
    id: 'menu-004',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Tuesday,
    mealType: MEAL_TYPE.Lunch,
    dishName: 'サラダチキン弁当',
    memo: 'コンビニで購入',
    sortOrder: 3,
    createdAt: parseISO('2025-01-07T12:00:00'),
    updatedAt: parseISO('2025-01-07T12:00:00'),
  },

  // 水曜日は空（献立なし）

  // 木曜日
  {
    id: 'menu-005',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Thursday,
    mealType: MEAL_TYPE.Dinner,
    dishName: '鮭の塩焼き定食',
    memo: 'ほうれん草のおひたし添え',
    sortOrder: 4,
    createdAt: parseISO('2025-01-09T19:00:00'),
    updatedAt: parseISO('2025-01-09T19:00:00'),
  },

  // 金曜日
  {
    id: 'menu-006',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Friday,
    mealType: MEAL_TYPE.Breakfast,
    dishName: 'グラノーラとヨーグルト',
    memo: 'バナナトッピング',
    sortOrder: 5,
    createdAt: parseISO('2025-01-10T07:00:00'),
    updatedAt: parseISO('2025-01-10T07:00:00'),
  },
  {
    id: 'menu-007',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Friday,
    mealType: MEAL_TYPE.Dinner,
    dishName: 'ピザとサラダ',
    memo: '金曜日は外食！',
    sortOrder: 6,
    createdAt: parseISO('2025-01-10T20:00:00'),
    updatedAt: parseISO('2025-01-10T20:00:00'),
  },

  // 土曜日
  {
    id: 'menu-008',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Saturday,
    mealType: MEAL_TYPE.Lunch,
    dishName: 'パスタカルボナーラ',
    memo: null,
    sortOrder: 7,
    createdAt: parseISO('2025-01-11T13:00:00'),
    updatedAt: parseISO('2025-01-11T13:00:00'),
  },
  {
    id: 'menu-009',
    userId: MOCK_USER_ID,
    dayOfWeek: DAY_OF_WEEK.Saturday,
    mealType: MEAL_TYPE.Snack,
    dishName: 'ケーキとコーヒー',
    memo: 'カフェで休憩',
    sortOrder: 8,
    createdAt: parseISO('2025-01-11T15:00:00'),
    updatedAt: parseISO('2025-01-11T15:00:00'),
  },

  // 日曜日は空（献立なし）
];

/**
 * 特定の曜日の献立を取得
 */
export const getMenusByDay = (dayOfWeek: number): Menu[] => {
  return MOCK_MENUS.filter((menu) => menu.dayOfWeek === dayOfWeek);
};

/**
 * すべての献立を曜日ごとにグループ化
 */
export const getMenusGroupedByDay = (): Record<number, Menu[]> => {
  return MOCK_MENUS.reduce(
    (acc, menu) => {
      if (!acc[menu.dayOfWeek]) {
        acc[menu.dayOfWeek] = [];
      }
      acc[menu.dayOfWeek].push(menu);
      return acc;
    },
    {} as Record<number, Menu[]>
  );
};
