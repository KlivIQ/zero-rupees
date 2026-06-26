import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { categories } from '@/data/categories';
import { products } from '@/data/products';
import { Fonts } from '@/constants/fonts';
import { useTheme } from '@/context/ThemeContext';

export function CategoryGrid() {
  const router = useRouter();
  const { theme } = useTheme();

  const displayCategories = categories.filter((c) => c.id !== 'all');

  const countForCategory = (id: string) =>
    products.filter((p) => p.categoryId === id).length;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Shop by Category</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.grid}>
          {displayCategories.map((cat) => {
            const count = countForCategory(cat.id);
            return (
              <Pressable
                key={cat.id}
                style={[styles.cell, { backgroundColor: theme.cardBg, borderColor: theme.border }]}
                onPress={() => router.push(`/category/${cat.id}` as any)}
              >
                <Text style={styles.cellEmoji}>{cat.emoji}</Text>
                <Text style={[styles.cellLabel, { color: theme.text }]} numberOfLines={2}>
                  {cat.label}
                </Text>
                <Text style={[styles.cellCount, { color: theme.primary }]}>{count} items</Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    marginBottom: 14,
    paddingHorizontal: 16,
  },
  grid: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    gap: 10,
  },
  cell: {
    width: 90,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  cellEmoji: {
    fontSize: 28,
    marginBottom: 6,
  },
  cellLabel: {
    fontSize: 11,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    lineHeight: 14,
    marginBottom: 4,
  },
  cellCount: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
});
