import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
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

  const items = products.filter((p) => p.categoryId === categoryId).slice(0, 6);
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
      <FlatList
        horizontal
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <ProductCard product={item} compact />
          </View>
        )}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
  },
  seeAll: {
    fontSize: 13,
    fontFamily: Fonts.bold,
  },
  listContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  cardWrapper: {
    width: 170,
  },
});
