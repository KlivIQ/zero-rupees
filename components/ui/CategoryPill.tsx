import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import type { Category } from '@/data/categories';

type Props = {
  category: Category;
  isActive: boolean;
  onPress: () => void;
};

export function CategoryPill({ category, isActive, onPress }: Props) {
  return (
    <Pressable
      style={[styles.pill, isActive && styles.pillActive]}
      onPress={onPress}
    >
      <Text style={styles.emoji}>{category.emoji}</Text>
      <Text style={[styles.label, isActive && styles.labelActive]} numberOfLines={1}>
        {category.label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: 'transparent',
    gap: 5,
  },
  pillActive: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
  },
  emoji: {
    fontSize: 14,
  },
  label: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  labelActive: {
    color: Colors.primary,
  },
});
