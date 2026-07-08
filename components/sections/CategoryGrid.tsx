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
    <View style={[styles.container, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
      <Text style={[styles.sectionTitle, { color: theme.text }]}>Shop by Category</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
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
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 18,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 15,
    fontFamily: Fonts.extraBold,
    marginBottom: 12,
    paddingHorizontal: 16,
    letterSpacing: 0.2,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 10,
  },
  cell: {
    width: 84,
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  cellEmoji: {
    fontSize: 26,
    marginBottom: 6,
  },
  cellLabel: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    textAlign: 'center',
    lineHeight: 13,
    marginBottom: 4,
  },
  cellCount: {
    fontSize: 9,
    fontFamily: Fonts.semiBold,
    textAlign: 'center',
  },
});
