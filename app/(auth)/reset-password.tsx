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
