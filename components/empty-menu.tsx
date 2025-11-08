import { Button } from '@/components/ui/button';
import { Icon } from '@/components/ui/icon';
import { Text } from '@/components/ui/text';
import { PlusCircle } from 'lucide-react-native';
import { View } from 'react-native';

interface EmptyMenuProps {
  dayLabel: string;
  onAddPress?: () => void;
}

export function EmptyMenu({ dayLabel, onAddPress }: EmptyMenuProps) {
  return (
    <View className="items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/20 px-4 py-8">
      <Text className="mb-4 text-center text-muted-foreground">{dayLabel}の献立がありません</Text>
      {onAddPress && (
        <Button variant="outline" size="sm" onPress={onAddPress}>
          <Icon as={PlusCircle} size={16} className="mr-2" />
          <Text>献立を追加</Text>
        </Button>
      )}
    </View>
  );
}
