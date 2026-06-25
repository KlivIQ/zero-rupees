import React, { useMemo, useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { products } from '@/data/products';
import { ProductCard } from '@/components/ui/ProductCard';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

type SortOption = 'priceHigh' | 'priceLow' | 'name';

type Props = {
  filterCategoryId: string | null;
};

export function ProductCatalogGrid({ filterCategoryId }: Props) {
  const { t } = useTranslation();
  const [sort, setSort] = useState<SortOption>('priceHigh');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const sortOptions: { key: SortOption; label: string }[] = [
    { key: 'priceHigh', label: t('catalog.sortPriceHigh') },
    { key: 'priceLow', label: t('catalog.sortPriceLow') },
    { key: 'name', label: t('catalog.sortName') },
  ];

  const filtered = useMemo(() => {
    let list = filterCategoryId
      ? products.filter((p) => p.categoryId === filterCategoryId)
      : products;
    if (sort === 'priceHigh') return [...list].sort((a, b) => b.fakePrice - a.fakePrice);
    if (sort === 'priceLow') return [...list].sort((a, b) => a.fakePrice - b.fakePrice);
    return [...list].sort((a, b) => a.name.localeCompare(b.name));
  }, [filterCategoryId, sort]);

  // Split into rows of 2 to avoid nested VirtualizedList issues
  const rows: (typeof products)[] = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  const currentSortLabel =
    sortOptions.find((o) => o.key === sort)?.label ?? sortOptions[0].label;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>{t('catalog.title')}</Text>
          <Text style={styles.subtitle}>
            {filtered.length} items • {t('catalog.subtitle')}
          </Text>
        </View>
        <View>
          <Pressable
            style={styles.sortButton}
            onPress={() => setShowSortMenu((v) => !v)}
          >
            <Text style={styles.sortButtonText}>⇅ {t('catalog.sort')}</Text>
          </Pressable>
          {showSortMenu && (
            <View style={styles.sortMenu}>
              {sortOptions.map((opt) => (
                <Pressable
                  key={opt.key}
                  style={[styles.sortMenuItem, sort === opt.key && styles.sortMenuItemActive]}
                  onPress={() => {
                    setSort(opt.key);
                    setShowSortMenu(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sortMenuText,
                      sort === opt.key && styles.sortMenuTextActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>
      </View>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyText}>{t('catalog.noProducts')}</Text>
        </View>
      ) : (
        <View style={styles.grid}>
          {rows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {row.length === 1 && <View style={styles.emptyCell} />}
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 6,
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: Fonts.extraBold,
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sortButton: {
    backgroundColor: Colors.accent,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  sortButtonText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  sortMenu: {
    position: 'absolute',
    right: 0,
    top: 36,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 100,
    minWidth: 190,
    overflow: 'hidden',
  },
  sortMenuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortMenuItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  sortMenuText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: Colors.text,
  },
  sortMenuTextActive: {
    color: Colors.primary,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    width: '100%',
  },
  emptyCell: {
    flex: 1,
    margin: 6,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});
