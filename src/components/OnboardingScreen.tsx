import { type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from './Button';
import { ProgressBar } from './ProgressBar';
import { colors, text } from '../theme';

type OnboardingScreenProps = {
  step: number;
  total: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  ctaLabel?: string;
  ctaDisabled?: boolean;
  ctaLoading?: boolean;
  onCta?: () => void;
};

export function OnboardingScreen({
  step,
  total,
  title,
  subtitle,
  children,
  ctaLabel = 'Continue',
  ctaDisabled = false,
  ctaLoading = false,
  onCta,
}: OnboardingScreenProps) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        <ProgressBar step={step} total={total} />
        <ScrollView
          style={{ flex: 1, marginTop: 24 }}
          contentContainerStyle={{ paddingBottom: 24, gap: 24 }}
          showsVerticalScrollIndicator={false}
        >
          <View style={{ gap: 8 }}>
            <Text style={[text.display, { color: colors.textPrimary }]}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={[text.body, { color: colors.textMuted }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          {children}
        </ScrollView>
        {onCta ? (
          <View style={{ paddingVertical: 16 }}>
            <Button
              label={ctaLabel}
              variant="primary"
              fullWidth
              disabled={ctaDisabled}
              loading={ctaLoading}
              onPress={onCta}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
