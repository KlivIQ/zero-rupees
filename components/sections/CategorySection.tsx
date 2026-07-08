import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { products } from '@/data/products';
import { Fonts } from '@/constants/fonts';
import { useTheme } from '@/context/ThemeContext';
import { ProductCard } from '@/components/ui/ProductCard';

type Props = {
  categoryId: string;
  title: string;
  emoji: string;
};

export function CategorySection({ categoryId, title, emoji }: Props) {
  const router = useRouter();
  const { theme } = useTheme();

  const items = products.filter((p) => p.categoryId === categoryId).slice(0, 8);
  if (items.length === 0) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>
          {emoji} {title}
        </Text>
        <Pressable onPress={() => router.push(`/category/${categoryId}` as any)}>
          <Text style={[styles.seeAll, { color: theme.primary }]}>See All →</Text>
        </Pressable>
      </View>
      {/* Use ScrollView+map instead of FlatList to avoid nested virtualised list crash */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      >
        {items.map((item) => (
          <View key={item.id} style={styles.cardWrapper}>
            <ProductCard product={item} compact />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  title: {
    fontSize: 17,
    fontFamily: Fonts.extraBold,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 4,
    gap: 12,
  },
  cardWrapper: {
    width: 175,
  },
});
