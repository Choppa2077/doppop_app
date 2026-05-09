import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Avatar } from '../src/components/Avatar';
import { Button } from '../src/components/Button';
import { Card } from '../src/components/Card';
import { Input } from '../src/components/Input';
import { RatingPill } from '../src/components/RatingPill';
import { SportBadge } from '../src/components/SportBadge';
import { colors, text } from '../src/theme';

export default function Showcase() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 56, gap: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ gap: 4 }}>
          <View
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.accentSoft,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 999,
              marginBottom: 8,
            }}
          >
            <Text
              style={[
                text.micro,
                {
                  color: colors.accent,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                },
              ]}
            >
              design system
            </Text>
          </View>
          <Text style={[text.display, { color: colors.textPrimary }]}>doppop</Text>
          <Text style={[text.body, { color: colors.textMuted }]}>
            Component primitives showcase
          </Text>
        </View>

        <Section title="Typography">
          <Card>
            <View style={{ gap: 8 }}>
              <Text style={[text.display, { color: colors.textPrimary }]}>Display 32</Text>
              <Text style={[text.h1, { color: colors.textPrimary }]}>Heading 1 — 24</Text>
              <Text style={[text.h2, { color: colors.textPrimary }]}>Heading 2 — 20</Text>
              <Text style={[text.body, { color: colors.textPrimary }]}>
                Body — quick brown fox jumps over the lazy dog.
              </Text>
              <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                Body strong — quick brown fox jumps over the lazy dog.
              </Text>
              <Text style={[text.caption, { color: colors.textMuted }]}>
                Caption — supporting microcopy
              </Text>
              <Text
                style={[
                  text.micro,
                  {
                    color: colors.accent,
                    textTransform: 'uppercase',
                    letterSpacing: 1.2,
                  },
                ]}
              >
                micro · uppercase · tracked
              </Text>
            </View>
          </Card>
        </Section>

        <Section title="Buttons">
          <View style={{ gap: 12 }}>
            <Button label="Primary action" variant="primary" fullWidth />
            <Button label="Secondary action" variant="secondary" fullWidth />
            <Button label="Leave (transfer captain)" variant="danger" fullWidth />
            <Button label="Ghost action" variant="ghost" fullWidth />
            <Button label="Loading…" variant="primary" loading fullWidth />
            <Button label="Disabled" variant="primary" disabled fullWidth />
          </View>
        </Section>

        <Section title="Inputs">
          <View style={{ gap: 16 }}>
            <Input label="Email" placeholder="you@example.com" autoCapitalize="none" />
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              hint="At least 8 characters"
            />
            <Input
              label="City"
              placeholder="Astana"
              error="Please choose a city"
            />
          </View>
        </Section>

        <Section title="Cards">
          <View style={{ gap: 12 }}>
            <Card>
              <Text style={[text.bodyStrong, { color: colors.textPrimary, marginBottom: 4 }]}>
                Static card
              </Text>
              <Text style={[text.caption, { color: colors.textMuted }]}>
                A surface with soft shadow and 20px radius.
              </Text>
            </Card>
            <Card onPress={() => {}}>
              <Text style={[text.bodyStrong, { color: colors.textPrimary, marginBottom: 4 }]}>
                Pressable card
              </Text>
              <Text style={[text.caption, { color: colors.textMuted }]}>
                Tap me — watch the press scale.
              </Text>
            </Card>
          </View>
        </Section>

        <Section title="Avatars">
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
            <Avatar name="Mukan Idrissov" size={56} />
            <Avatar name="Anna Test" size={48} />
            <Avatar name="Bekzat" size={40} />
            <Avatar name="?" size={32} />
          </View>
        </Section>

        <Section title="Badges & pills">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <SportBadge sport="football" />
            <SportBadge sport="volleyball" />
            <SportBadge sport="basketball" />
            <RatingPill rating={4.7} />
            <RatingPill rating={3.2} />
          </View>
        </Section>

        <Section title="Composed example">
          <Card onPress={() => {}}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Avatar name="Anna Test" size={48} />
              <View style={{ flex: 1 }}>
                <Text style={[text.bodyStrong, { color: colors.textPrimary }]}>
                  Anna Test
                </Text>
                <Text style={[text.caption, { color: colors.textMuted }]}>
                  Astana Arena Mini #1
                </Text>
              </View>
              <RatingPill rating={4.7} />
            </View>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <SportBadge sport="football" size="sm" />
              <SportBadge sport="basketball" size="sm" />
            </View>
          </Card>
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ gap: 12 }}>
      <Text style={[text.h2, { color: colors.textPrimary }]}>{title}</Text>
      {children}
    </View>
  );
}
