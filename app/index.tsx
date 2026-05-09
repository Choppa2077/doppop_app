import { Text, View } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <View className="rounded-lg bg-accent-soft px-3 py-1.5 mb-3">
        <Text className="text-accent text-xs font-bold uppercase tracking-wider">
          nativewind ready
        </Text>
      </View>
      <Text className="text-4xl font-bold text-text-primary mb-1">doppop</Text>
      <Text className="text-base text-text-muted">tailwind classes are live</Text>
    </View>
  );
}
