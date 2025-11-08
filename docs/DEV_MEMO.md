# 開発メモ

## セットアップ手順

### expo のセットアップ

```bash
pnpx create-expo-app@latest . --template blank-typescript
```

### ESLint のセットアップ

```bash
pnpx expo lint
```

### Prettier のセットアップ

```bash
pnpx expo install prettier eslint-config-prettier eslint-plugin-prettier --dev
```

## UI ライブラリの導入

### React Native Reusables セットアップ

```bash
pnpm dlx @react-native-reusables/cli@latest init
```

`pnpm dev` で エラーが発生
`node v24.11.0` だったらエラーが出たので `node v20` 系で縛って実行すると正常に動作

こちらを実行すれば `React Native Reusables` で最適化された `expo` のプロジェクトが作成される
`pnpx shadcn@latest` と一緒

## データベース・ORM設定

### Turso のセットアップ

```bash
brew install tursodatabase/tap/turso
```

公式ドキュメントでは

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/tursodatabase/turso/releases/latest/download/turso_cli-installer.sh | sh
```

### Drizzle ORM インストール

```bash
pnpm add drizzle-orm dotenv @libsql/client
pnpm add -D drizzle-kit
```

### ローカルDBと接続

ローカルDB と接続するためにプロジェクトのルートに
`db/local/local.db` を作成

```bash
turso dev -f db/local/local.db
```

`.env.local` を作成して下記の内容を追加

```env
TURSO_DATABASE_URL=http://127.0.0.1:8080
```

.gitignore に下記の内容を追加

```gitignore
# DB
/db/local/
```

### Drizzle と連携

`db/index.ts` を作成して下記の内容を追加

```ts
import { drizzle } from 'drizzle-orm/libsql/web';
// まだ存在しない場合コメントアウト
// import * as authSchema from "./schemas/auth";

export const db = drizzle({
  connection: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
  schema: {
    // ...authSchema,
  },
});
```

`drizzle.config.ts` を作成して下記の内容を追加

```ts
import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './db/migrations',
  schema: './db/schemas/*.ts',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN! || 'local',
  },
});
```

## 認証の設定

### Better Auth のインストール

```bash
  pnpm add better-auth
```

`.env.local` に `Secret Key` と `Base URL` を追加

```env
# better auth の公式ドキュメントで自動生成
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=http://localhost:8081
```

### Better Auth のインスタンスを作成

`/lib` 配下に `auth.ts` を作成 (`lib/auth.ts`) して下記の内容を追加

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { expo } from '@better-auth/expo';

export const auth = betterAuth({
  baseURL: 'process.env.BETTER_AUTH_URL!,',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => nanoid(10),
    },
  },
  plugins: [expo()],
  trustedOrigins: ['ui-gohan://'],
});
```

### expo と連携

ライブラリのインストール

```bash
pnpm add better-auth @better-auth/expo
pnpm add expo-linking expo-web-browser expo-constants
pnpm add expo-secure-store
pnpm add -D babel-plugin-module-resolver
```

`/lib` 配下に `auth-client.ts` を作成(`/lib/auth-client.ts`)して下記の内容を追加

```ts
import { createAuthClient } from 'better-auth/react';
import { expoClient } from '@better-auth/expo/client';
import * as SecureStore from 'expo-secure-store';

export const authClient = createAuthClient({
  baseURL: 'http://localhost:8081', // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: 'myapp',
      storagePrefix: 'myapp',
      storage: SecureStore,
    }),
  ],
});
```

`app/api/auth/[...auth]+api.ts` を作成して下記の内容を追加

```ts
import { auth } from '@/lib/auth';

const handler = auth.handler;
export { handler as GET, handler as POST }; // export handler for both GET and POST requests
```

`metro.config.js` に下記の内容を追加

```js
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.resolver.unstable_enablePackageExports = true;

module.exports = config;
```

`babel.config.ts` に下記の内容を追加

```ts
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [['babel-preset-expo', { jsxImportSource: 'nativewind' }], 'nativewind/babel'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'better-auth/react': './node_modules/better-auth/dist/client/react/index.cjs',
            'better-auth/client/plugins':
              './node_modules/better-auth/dist/client/plugins/index.cjs',
            '@better-auth/expo/client': './node_modules/@better-auth/expo/dist/client.cjs',
          },
        },
      ],
    ],
  };
};
```

### 匿名ログインの設定

`auth.ts` に下記の内容を追加

```ts
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/db';
import { nanoid } from 'nanoid';
import { expo } from '@better-auth/expo';
import { anonymous } from 'better-auth/plugins';

export const auth = betterAuth({
  baseURL: 'process.env.BETTER_AUTH_URL!,',
  database: drizzleAdapter(db, {
    provider: 'sqlite',
    usePlural: true,
  }),
  advanced: {
    database: {
      generateId: () => nanoid(10),
    },
  },
  plugins: [expo(), anonymous()],
  trustedOrigins: ['ui-gohan://'],
});
```

## Jest のセットアップ

### ライブラリのインストール

```bash
pnpx expo install jest-expo jest @types/jest --dev
```

### スクリプトコマンドの追加

`package.json` に下記の内容を追加

```json
{
  "scripts": {
    "test": "jest --watchAll"
  }
}
```

### プリセットの設定

`package.json` に下記の内容を追加

```json
"jest": {
    "preset": "jest-expo"
  }
```

## パスワードリセット画面の作成

AI が作ってくれた画面を `React Native Reusables` に置き換える

置き換え前

```tsx
// forgot-password.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { requestPasswordReset } from '@/lib/auth-client';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert('エラー', 'メールアドレスを入力してください');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'リクエストに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, marginBottom: 20 }}>メールを送信しました</Text>
        <Text style={{ marginBottom: 20 }}>
          {email} にパスワードリセット用のメールを送信しました。
          メール内のリンクをクリックして、新しいパスワードを設定してください。
        </Text>
        <Pressable onPress={() => router.back()}>
          <Text style={{ color: '#007AFF', textAlign: 'center' }}>戻る</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>パスワードリセット</Text>
      <Text style={{ marginBottom: 20 }}>
        登録したメールアドレスを入力してください。パスワードリセット用のメールをお送りします。
      </Text>

      <TextInput
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Pressable
        onPress={handleResetRequest}
        disabled={loading}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {loading ? '送信中...' : 'リセットメールを送信'}
        </Text>
      </Pressable>

      <Pressable onPress={() => router.back()} style={{ marginTop: 20 }}>
        <Text style={{ textAlign: 'center', color: '#007AFF' }}>戻る</Text>
      </Pressable>
    </View>
  );
}
```

置き換え後

```tsx
import { useState } from 'react';
import { View, TextInput, Alert } from 'react-native';
import { resetPassword } from '@/lib/auth-client';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Button } from '@/components/ui/button';
import { Text } from '@/components/ui/text';
import { Input } from '@/components/ui/input';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('エラー', '新しいパスワードを入力してください');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('エラー', 'パスワードは8文字以上で入力してください');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }

    if (!token) {
      Alert.alert('エラー', '無効なリセットリンクです');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      Alert.alert('成功', 'パスワードが変更されました', [
        { text: 'OK', onPress: () => router.replace('/(auth)/sign-in') },
      ]);
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'パスワード変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>新しいパスワードを設定</Text>

      <Input
        placeholder="新しいパスワード(8文字以上)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Input
        placeholder="パスワード確認"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Button onPress={handleReset} disabled={loading}>
        <Text>{loading ? '変更中...' : 'パスワードを変更'}</Text>
      </Button>
    </View>
  );
}
```

置き換え前

```tsx
// reset-password.tsx
import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';
import { resetPassword } from '@/lib/auth-client';
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { token } = useLocalSearchParams<{ token: string }>();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('エラー', '新しいパスワードを入力してください');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('エラー', 'パスワードは8文字以上で入力してください');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('エラー', 'パスワードが一致しません');
      return;
    }

    if (!token) {
      Alert.alert('エラー', '無効なリセットリンクです');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, newPassword);
      Alert.alert('成功', 'パスワードが変更されました', [
        { text: 'OK', onPress: () => router.replace('/(auth)/sign-in') },
      ]);
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'パスワード変更に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>新しいパスワードを設定</Text>

      <TextInput
        placeholder="新しいパスワード(8文字以上)"
        value={newPassword}
        onChangeText={setNewPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <TextInput
        placeholder="パスワード確認"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />

      <Pressable
        onPress={handleReset}
        disabled={loading}
        style={{ backgroundColor: '#007AFF', padding: 15, borderRadius: 8 }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {loading ? '変更中...' : 'パスワードを変更'}
        </Text>
      </Pressable>
    </View>
  );
}
```

置き換え後

```tsx
import { useState } from 'react';
import { View, Alert } from 'react-native';
import { requestPasswordReset } from '@/lib/auth-client';
import { useRouter } from 'expo-router';
import { Text } from '@/components/ui/text';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleResetRequest = async () => {
    if (!email) {
      Alert.alert('エラー', 'メールアドレスを入力してください');
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (error: any) {
      Alert.alert('エラー', error.message || 'リクエストに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <View className="p-5">
        <Text className="mb-5 text-2xl">メールを送信しました</Text>
        <Text className="mb-5">
          {email} にパスワードリセット用のメールを送信しました。
          メール内のリンクをクリックして、新しいパスワードを設定してください。
        </Text>
        <Button onPress={() => router.back()}>
          <Text>戻る</Text>
        </Button>
      </View>
    );
  }

  return (
    <View className="p-4">
      <Text className="mb-4 text-2xl">パスワードリセット</Text>
      <Text className="mb-4">
        登録したメールアドレスを入力してください。パスワードリセット用のメールをお送りします。
      </Text>

      <Input
        placeholder="メールアドレス"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        className="mb-5"
      />

      <Button className="mb-5" onPress={handleResetRequest} disabled={loading}>
        <Text>{loading ? '送信中...' : 'リセットメールを送信'}</Text>
      </Button>

      <Button onPress={() => router.back()} className="mb-5">
        <Text>戻る</Text>
      </Button>
    </View>
  );
}
```
