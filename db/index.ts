import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schemas/menu';

// データベースを開く
const expoDb = openDatabaseSync('ui-gohan-db.db');

// Drizzle インスタンスを作成
export const db = drizzle(expoDb, { schema });

// スキーマをエクスポート
export { schema };
