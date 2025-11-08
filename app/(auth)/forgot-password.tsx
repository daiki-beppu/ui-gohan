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
