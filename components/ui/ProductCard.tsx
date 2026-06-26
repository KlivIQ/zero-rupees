import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useCartStore } from '@/store/cartStore';
import { Fonts } from '@/constants/fonts';
import { formatINR } from '@/utils/formatCurrency';
import { useTheme } from '@/context/ThemeContext';
import type { Product } from '@/data/products';

type Props = {
  product: Product;
  compact?: boolean;
};

export function ProductCard({ product, compact = false }: Props) {
  const { t } = useTranslation();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);
  const { theme } = useTheme();

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
    <View style={[
      styles.card,
      compact && styles.cardCompact,
      { backgroundColor: theme.cardBg, shadowColor: '#000' },
    ]}>
      <View style={[styles.imageArea, compact && styles.imageAreaCompact]}>
        <Image
          source={{ uri: product.imageUrl }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
        />
        {product.urgency && (
          <View style={styles.urgencyTag}>
            <Text style={styles.urgencyText}>🔥 Only 2 left!</Text>
          </View>
        )}
      </View>
      <View style={[styles.info, { backgroundColor: theme.cardBg }]}>
        <Text style={[styles.name, { color: theme.text }]} numberOfLines={compact ? 1 : 2}>
          {product.name}
        </Text>
        {product.region && (
          <Text style={[styles.regionTag, { color: theme.textMuted, borderColor: theme.border }]}>
            📍 {product.region}
          </Text>
        )}
        <View style={styles.priceRow}>
          <Text style={[styles.fakePrice, { color: theme.priceStrike }]}>
            ₹{formatINR(product.fakePrice)}
          </Text>
        </View>
        <View style={styles.finalRow}>
          <View style={styles.freeBadge}>
            <Text style={styles.freeLabel}>{t('product.free')}</Text>
          </View>
          <Text style={[styles.zeroPrice, { color: theme.primary }]}>{t('product.rupeeZero')}</Text>
        </View>
        <Pressable
          style={[styles.addButton, { backgroundColor: added ? '#43A047' : theme.primary }]}
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
    borderRadius: 16,
    overflow: 'hidden',
    margin: 6,
    flex: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  cardCompact: {
    width: 180,
    flex: 0,
    margin: 0,
  },
  imageArea: {
    height: 140,
    backgroundColor: '#F0F0F0',
    overflow: 'hidden',
  },
  imageAreaCompact: {
    height: 110,
  },
  urgencyTag: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#EF5350',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  urgencyText: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  info: {
    padding: 10,
  },
  name: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    marginBottom: 4,
    lineHeight: 18,
  },
  regionTag: {
    fontSize: 10,
    fontFamily: Fonts.semiBold,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  fakePrice: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    textDecorationLine: 'line-through',
  },
  finalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  freeBadge: {
    backgroundColor: '#C2185B',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  freeLabel: {
    fontSize: 10,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
  zeroPrice: {
    fontSize: 18,
    fontFamily: Fonts.black,
  },
  addButton: {
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 12,
    fontFamily: Fonts.bold,
    color: '#FFFFFF',
  },
});
