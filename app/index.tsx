import { Text, View } from 'react-native';

import { text } from '../src/theme';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-bg px-6">
      <View className="rounded-lg bg-accent-soft px-3 py-1.5 mb-3">
        <Text style={text.micro} className="text-accent uppercase tracking-wider">
          fonts loaded
        </Text>
      </View>
      <Text style={text.display} className="text-text-primary mb-1">
        doppop
      </Text>
      <Text style={text.body} className="text-text-muted">
        Space Grotesk + DM Sans
      </Text>
    </View>
  );
}
