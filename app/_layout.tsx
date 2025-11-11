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
  const DATABASE_NAME = 'ui-gohan-db';
  const { colorScheme } = useColorScheme();

  // ローカルモードかどうかを判定
  const useLocalDB = process.env.EXPO_PUBLIC_USE_LOCAL_DB === 'true';

  return (
    <SQLiteProvider
      databaseName={DATABASE_NAME}
      options={
        useLocalDB
          ? {} // ローカルモード：Turso接続なし（内部ストレージのみ）
          : {
              // プロダクションモード：Turso接続あり
              libSQLOptions: {
                url: process.env.EXPO_PUBLIC_TURSO_DATABASE_URL!,
                authToken: process.env.EXPO_PUBLIC_TURSO_AUTH_TOKEN!,
              },
            }
      }
      onInit={async (db: SQLiteDatabase) => {
        console.log('=== データベース初期化開始 ===');
        console.log('モード:', useLocalDB ? 'ローカルのみ' : 'Turso接続');

        // ローカルモードでない場合のみ同期を試みる
        if (!useLocalDB) {
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
            // 同期エラーでも続行する
          }
        } else {
          console.log('✓ ローカルモード：Turso同期をスキップ');
        }

        try {
          const { migrations } = require('@/db/migrations');

          console.log('データベースバージョンを確認中...');
          const result = await db.getFirstAsync<{ user_version: number } | null>(
            'PRAGMA user_version'
          );

          const currentDbVersion = result?.user_version ?? 0;
          console.log('現在のDBバージョン:', currentDbVersion);

          // マイグレーション不要の場合は早期リターン
          if (currentDbVersion >= migrations.version) {
            console.log('✓ マイグレーション不要');
            return;
          }

          // マイグレーションを実行
          console.log('マイグレーションを実行中...');
          for (const statement of migrations.statements) {
            await db.execAsync(statement);
          }

          // バージョンを更新
          await db.execAsync(`PRAGMA user_version = ${migrations.version};`);
          console.log('✓ マイグレーション完了。DBバージョン:', migrations.version);
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
