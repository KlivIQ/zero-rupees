import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { formatINR } from '@/utils/formatCurrency';
import type { Product } from '@/data/products';

type Props = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: Props) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      fakePrice: product.fakePrice,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <LinearGradient
        colors={['#FCE4EC', '#F8BBD0']}
        style={[styles.imageArea, compact && styles.imageAreaCompact]}
      >
        <Text style={[styles.emoji, compact && styles.emojiCompact]}>
          {product.emoji}
        </Text>
      </LinearGradient>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={compact ? 1 : 2}>
          {product.name}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.mrpLabel}>{t('product.mrp')} </Text>
          <Text style={styles.fakePrice}>₹{formatINR(product.fakePrice)}</Text>
        </View>
        <View style={styles.finalRow}>
          <Text style={styles.freeLabel}>{t('product.free')}</Text>
          <Text style={styles.zeroPrice}>{t('product.rupeeZero')}</Text>
        </View>
        <Pressable
          style={[styles.addButton, added && styles.addButtonAdded]}
          onPress={handleAddToCart}
        >
          <Text style={styles.addButtonText}>
            {added ? '✓ Added!' : t('product.addToCart')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    margin: 6,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompact: {
    width: 180,
    flex: 0,
  },
  imageArea: {
    height: 130,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageAreaCompact: {
    height: 110,
  },
  emoji: {
    fontSize: 52,
  },
  emojiCompact: {
    fontSize: 42,
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 4,
    lineHeight: 18,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  mrpLabel: {
    fontSize: 10,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  fakePrice: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.priceStrike,
    textDecorationLine: 'line-through',
  },
  finalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  freeLabel: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: Colors.white,
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  zeroPrice: {
    fontSize: 18,
    fontFamily: Fonts.black,
    color: Colors.primary,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonAdded: {
    backgroundColor: '#43A047',
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
});
