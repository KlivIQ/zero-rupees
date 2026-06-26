import React, { useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Header } from '@/components/sections/Header';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { ProductCatalogGrid } from '@/components/sections/ProductCatalogGrid';
import { Footer } from '@/components/sections/Footer';
import { Colors } from '@/constants/colors';

export default function CatalogScreen() {
  const { category } = useLocalSearchParams<{ category?: string }>();
  const [activeCategory, setActiveCategory] = useState<string | null>(
    category ?? null
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <CategoryGrid
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <ProductCatalogGrid filterCategoryId={activeCategory} />
        <Footer />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  scroll: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
  },
});
