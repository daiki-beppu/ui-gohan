import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8081', // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'ui-gohan',
      storagePrefix: 'ui-gohan-auth-',
      storage: SecureStore,
    }),
  ],
});

// パスワードリセットリクエスト
/**
 * パスワードリセットをリクエストする
 * @param email - ユーザーのメールアドレス
 * @returns Promise<{ success: boolean }>
 * @throws エラーが発生した場合は例外をスロー
 */
export const requestPasswordReset = async (email: string) => {
  try {
    const result = await authClient.forgetPassword({
      email,
      redirectTo: '/reset-password', // アプリ内のリセット画面パス
    });

    // Better Auth は成功時に { success: true } を返す
    return result;
  } catch (error: any) {
    // エラーハンドリング
    if (error.status === 404) {
      // ユーザーが見つからない場合でも、セキュリティのため成功として扱う
      // (メールアドレスの存在を外部に漏らさないため)
      return { success: true };
    }

    // その他のエラーはそのままスロー
    throw new Error(error.message || 'パスワードリセットリクエストに失敗しました');
  }
};

/**
 * パスワードをリセットする
 * @param token - リセットトークン(メールリンクから取得)
 * @param newPassword - 新しいパスワード
 * @returns Promise<{ success: boolean }>
 */
export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const result = await authClient.resetPassword({
      token,
      newPassword,
    });

    return result;
  } catch (error: any) {
    // トークンが無効または期限切れの場合
    if (error.status === 400) {
      throw new Error('リセットリンクが無効または期限切れです');
    }

    throw new Error(error.message || 'パスワードのリセットに失敗しました');
  }
};
