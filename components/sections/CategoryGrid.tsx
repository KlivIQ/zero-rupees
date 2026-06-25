import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { categories } from '@/data/categories';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type Props = {
  activeCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
};

export function CategoryGrid({ activeCategory, onSelectCategory }: Props) {
  const { t } = useTranslation();

  const displayCategories = categories.filter((c) => c.id !== 'all');

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>{t('categories.title')}</Text>
      <View style={styles.grid}>
        {displayCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.cell, isActive && styles.cellActive]}
              onPress={() => onSelectCategory(isActive ? null : cat.id)}
            >
              <Text style={styles.cellEmoji}>{cat.emoji}</Text>
              <Text style={[styles.cellLabel, isActive && styles.cellLabelActive]} numberOfLines={2}>
                {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.pillsRow}
        contentContainerStyle={styles.pillsContent}
      >
        <Pressable
          style={[styles.pill, activeCategory === null && styles.pillActive]}
          onPress={() => onSelectCategory(null)}
        >
          <Text style={[styles.pillText, activeCategory === null && styles.pillTextActive]}>
            🛍️ All
          </Text>
        </Pressable>
        {displayCategories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <Pressable
              key={cat.id}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelectCategory(isActive ? null : cat.id)}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {cat.emoji} {cat.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
    marginBottom: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cell: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderRadius: 12,
    marginBottom: 4,
  },
  cellActive: {
    backgroundColor: Colors.primaryLight,
  },
  cellEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  cellLabel: {
    fontSize: 11,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 14,
  },
  cellLabelActive: {
    color: Colors.primary,
  },
  pillsRow: {
    marginTop: 12,
  },
  pillsContent: {
    paddingRight: 8,
  },
  pill: {
    backgroundColor: Colors.accent,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  pillTextActive: {
    color: Colors.primary,
  },
});
