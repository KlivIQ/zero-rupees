import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/sections/Header';
import { HeroCarousel } from '@/components/sections/HeroCarousel';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { CategorySection } from '@/components/sections/CategorySection';
import { MarqueeStrip } from '@/components/sections/MarqueeStrip';
import { Footer } from '@/components/sections/Footer';
import { useTheme } from '@/context/ThemeContext';

const CATEGORY_SECTIONS = [
  { id: 'jewellery', label: 'Jewellery & Gold', emoji: '💍' },
  { id: 'luxury-cars', label: 'Luxury Cars', emoji: '🚗' },
  { id: 'property', label: 'Property & Land', emoji: '🏠' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'audio-entertainment', label: 'Audio & Entertainment', emoji: '🔊' },
  { id: 'home-kitchen', label: 'Home & Kitchen', emoji: '🍳' },
];

export default function HomeScreen() {
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.primary }]} edges={['top']}>
      <Header />
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeroCarousel />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        <CategoryGrid />
        <View style={[styles.divider, { backgroundColor: theme.border }]} />
        {CATEGORY_SECTIONS.map((cat) => (
          <React.Fragment key={cat.id}>
            <CategorySection categoryId={cat.id} title={cat.label} emoji={cat.emoji} />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
          </React.Fragment>
        ))}
        <MarqueeStrip />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
  },
  divider: {
    height: 8,
  },
});
