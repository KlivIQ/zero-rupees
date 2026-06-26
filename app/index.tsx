import React, { useState, useRef } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/sections/Header';
import { HeroBanner } from '@/components/sections/HeroBanner';
import { CategoryGrid } from '@/components/sections/CategoryGrid';
import { FeaturedProducts } from '@/components/sections/FeaturedProducts';
import { ProductCatalogGrid } from '@/components/sections/ProductCatalogGrid';
import { MarqueeStrip } from '@/components/sections/MarqueeStrip';
import { Footer } from '@/components/sections/Footer';
import { Colors } from '@/constants/colors';

export default function HomeScreen() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  const handleCtaPress = () => {
    scrollRef.current?.scrollTo({ y: 600, animated: true });
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <Header />
      <ScrollView
        ref={scrollRef}
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <HeroBanner onCtaPress={handleCtaPress} />
        <CategoryGrid
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
        <MarqueeStrip />
        <FeaturedProducts />
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
