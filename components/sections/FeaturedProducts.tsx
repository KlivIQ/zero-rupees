import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export function FeaturedProducts() {
  const { t } = useTranslation();
  const featured = products.filter((p) => p.isFeatured);

  if (featured.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('featured.title')}</Text>
        <View style={styles.liveBadge}>
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} compact />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.accent,
    paddingTop: 20,
    paddingBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 10,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },
  liveBadge: {
    backgroundColor: '#F44336',
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  liveText: {
    fontSize: 10,
    fontFamily: Fonts.black,
    color: Colors.white,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingHorizontal: 10,
    paddingRight: 16,
  },
});
