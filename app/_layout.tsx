import '@/global.css';

import { NAV_THEME } from '@/lib/theme';
import { ThemeProvider } from '@react-navigation/native';
import { PortalHost } from '@rn-primitives/portal';
import { Stack } from 'expo-router';
import { SQLiteDatabase, SQLiteProvider } from 'expo-sqlite';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'nativewind';

export { ErrorBoundary } from 'expo-router';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();

  return (
    <SQLiteProvider
      databaseName="ui-gohan-db"
      options={{
        libSQLOptions: {
          url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL!,
          authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!,
        },
      }}
      onInit={async (db: SQLiteDatabase) => {
        console.log('=== データベース初期化開始 ===');
        console.log('Turso URL:', process.env.EXPO_PUBLIC_TURSO_DATABASE_URL);
        console.log('Token exists:', !!process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN);

        try {
          console.log('Turso DB と同期を開始...');
          await db.syncLibSQL();
          console.log('✓ Turso DB と同期しました');
        } catch (error) {
          if (error instanceof Error && error.message.includes('not supported')) {
            console.warn('⚠️  同期は開発環境ではサポートされていません');
            console.warn('→ ローカルDBのみを使用します（実機では自動同期されます）');
          } else {
            console.error('✗ データベース同期エラー:', error);
            if (error instanceof Error) {
              console.error('エラーメッセージ:', error.message);
              console.error('エラースタック:', error.stack);
            }
          }
          // 同期エラーでも続行する（開発中はローカルDBのみ使用）
        }

        try {
          const DB_VERSION = 1;

          console.log('データベースバージョンを確認中...');
          const result = await db.getFirstAsync<{ user_version: number } | null>(
            'PRAGMA user_version'
          );

          const currentDbVersion = result?.user_version ?? 0;
          console.log('現在のDBバージョン:', currentDbVersion);

          // マイグレーション不要の場合は早期リターン
          if (currentDbVersion >= DB_VERSION) {
            console.log('✓ マイグレーション不要');
            return;
          }

          // 既存のバージョンがある場合
          if (currentDbVersion > 0) {
            console.log('既存のDBバージョンが検出されました:', currentDbVersion);
            return;
          }

          // 初回マイグレーション: menus テーブルを作成
          console.log('初回マイグレーションを実行中...');
          await db.execAsync(`
            CREATE TABLE IF NOT EXISTS menus (
              id TEXT PRIMARY KEY NOT NULL,
              user_id TEXT NOT NULL,
              day_of_week INTEGER NOT NULL,
              meal_type TEXT NOT NULL,
              dish_name TEXT NOT NULL,
              memo TEXT,
              sort_order INTEGER DEFAULT 0 NOT NULL,
              created_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
              updated_at INTEGER DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
            );
          `);
          console.log('✓ menus テーブルを作成しました');

          // バージョンを更新
          await db.execAsync(`PRAGMA user_version = ${DB_VERSION};`);
          console.log('✓ 初回マイグレーション完了。DBバージョン:', DB_VERSION);
        } catch (error) {
          console.error('✗ マイグレーションエラー:', error);
          if (error instanceof Error) {
            console.error('エラーメッセージ:', error.message);
            console.error('エラースタック:', error.stack);
          } else {
            console.error('エラーの型:', typeof error);
            console.error('エラー内容:', error);
          }
          throw error;
        }

        console.log('=== データベース初期化完了 ===');
      }}>
      <ThemeProvider value={NAV_THEME[colorScheme ?? 'light']}>
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        <Stack />
        <PortalHost />
      </ThemeProvider>
    </SQLiteProvider>
  );
}
