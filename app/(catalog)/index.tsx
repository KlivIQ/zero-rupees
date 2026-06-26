import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/sections/Header';
import { ProductCatalogGrid } from '@/components/sections/ProductCatalogGrid';
import { Footer } from '@/components/sections/Footer';
import { useTheme } from '@/context/ThemeContext';

export default function CatalogScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [activeCategory] = useState<string | null>(category ?? null);
  const { theme } = useTheme();

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.primary }]} edges={['top']}>
      <Header />
      <ScrollView
        style={[styles.scroll, { backgroundColor: theme.background }]}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ProductCatalogGrid filterCategoryId={activeCategory} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  content: { flexGrow: 1 },
});
