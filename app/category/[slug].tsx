import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { products } from '@/data/products';
import { categories } from '@/data/categories';
import { Fonts } from '@/constants/fonts';
import { useTheme } from '@/context/ThemeContext';
import { ProductCard } from '@/components/ui/ProductCard';

const { width: SCREEN_W } = Dimensions.get('window');
const NUM_COLS = SCREEN_W >= 768 ? 3 : 2;

type PriceFilter = 'all' | 'under10l' | '10l-1cr' | '1cr-10cr' | 'above10cr';
type RegionFilter = 'all' | 'north' | 'south' | 'east' | 'west' | 'northeast' | 'international';
type SortOption = 'expensive' | 'cheapest' | 'az';

const PRICE_FILTERS: { id: PriceFilter; label: string }[] = [
  { id: 'all', label: 'All Prices' },
  { id: 'under10l', label: 'Under ₹10L' },
  { id: '10l-1cr', label: '₹10L – 1Cr' },
  { id: '1cr-10cr', label: '₹1Cr – 10Cr' },
  { id: 'above10cr', label: 'Above ₹10Cr' },
];

const REGION_FILTERS: { id: RegionFilter; label: string }[] = [
  { id: 'all', label: 'Pan India' },
  { id: 'north', label: 'North' },
  { id: 'south', label: 'South' },
  { id: 'east', label: 'East' },
  { id: 'west', label: 'West' },
  { id: 'northeast', label: 'Northeast' },
  { id: 'international', label: 'International' },
];

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: 'expensive', label: 'Most Expensive' },
  { id: 'cheapest', label: 'Lowest Price' },
  { id: 'az', label: 'A–Z' },
];

const SOUTH_REGIONS = ['Tamil Nadu', 'Kerala', 'Karnataka', 'Telangana', 'Andhra Pradesh', 'Goa'];
const NORTH_REGIONS = ['Delhi', 'Punjab', 'Chandigarh', 'Himachal Pradesh', 'Uttarakhand', 'Uttar Pradesh', 'Rajasthan', 'Jammu & Kashmir'];
const EAST_REGIONS = ['West Bengal', 'Bihar', 'Odisha', 'Jharkhand'];
const NORTHEAST_REGIONS = ['Assam', 'Sikkim', 'Meghalaya', 'Manipur', 'Nagaland', 'Tripura', 'Mizoram', 'Arunachal Pradesh'];
const WEST_REGIONS = ['Maharashtra', 'Mumbai', 'Pune', 'Gujarat'];
const INTERNATIONAL_REGIONS = ['International', 'Maldives', 'Moon', 'Universe', 'Andaman', 'Lakshadweep'];

function regionMatches(region: string | undefined, filter: RegionFilter): boolean {
  if (filter === 'all') return true;
  if (!region) return false;
  const r = region;
  if (filter === 'south') return SOUTH_REGIONS.some((s) => r.includes(s));
  if (filter === 'north') return NORTH_REGIONS.some((s) => r.includes(s));
  if (filter === 'east') return EAST_REGIONS.some((s) => r.includes(s));
  if (filter === 'northeast') return NORTHEAST_REGIONS.some((s) => r.includes(s));
  if (filter === 'west') return WEST_REGIONS.some((s) => r.includes(s));
  if (filter === 'international') return INTERNATIONAL_REGIONS.some((s) => r.includes(s));
  return true;
}

export default function CategoryPage() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();
  const { theme } = useTheme();

  const [priceFilter, setPriceFilter] = useState<PriceFilter>('all');
  const [regionFilter, setRegionFilter] = useState<RegionFilter>('all');
  const [sort, setSort] = useState<SortOption>('expensive');

  const category = categories.find((c) => c.id === slug);

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.categoryId === slug);

    if (priceFilter === 'under10l') list = list.filter((p) => p.fakePrice < 1000000);
    else if (priceFilter === '10l-1cr') list = list.filter((p) => p.fakePrice >= 1000000 && p.fakePrice < 10000000);
    else if (priceFilter === '1cr-10cr') list = list.filter((p) => p.fakePrice >= 10000000 && p.fakePrice < 100000000);
    else if (priceFilter === 'above10cr') list = list.filter((p) => p.fakePrice >= 100000000);

    list = list.filter((p) => regionMatches(p.region, regionFilter));

    if (sort === 'expensive') list = [...list].sort((a, b) => b.fakePrice - a.fakePrice);
    else if (sort === 'cheapest') list = [...list].sort((a, b) => a.fakePrice - b.fakePrice);
    else if (sort === 'az') list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [slug, priceFilter, regionFilter, sort]);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={[styles.headerBar, { backgroundColor: theme.primary }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>
          {category ? `${category.emoji} ${category.label}` : 'Category'}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={[styles.filterRow, { backgroundColor: theme.cardBg, borderBottomColor: theme.border }]}
        contentContainerStyle={styles.filterContent}
      >
        {PRICE_FILTERS.map((f) => (
          <Pressable
            key={f.id}
            style={[
              styles.filterChip,
              { borderColor: theme.border, backgroundColor: theme.background },
              priceFilter === f.id && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}
            onPress={() => setPriceFilter(f.id)}
          >
            <Text style={[
              styles.filterChipText,
              { color: theme.textMuted },
              priceFilter === f.id && { color: '#FFFFFF' },
            ]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
        <View style={styles.filterSep} />
        {REGION_FILTERS.map((f) => (
          <Pressable
            key={f.id}
            style={[
              styles.filterChip,
              { borderColor: theme.border, backgroundColor: theme.background },
              regionFilter === f.id && { backgroundColor: theme.primary, borderColor: theme.primary },
            ]}
            onPress={() => setRegionFilter(f.id)}
          >
            <Text style={[
              styles.filterChipText,
              { color: theme.textMuted },
              regionFilter === f.id && { color: '#FFFFFF' },
            ]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
        <View style={styles.filterSep} />
        {SORT_OPTIONS.map((f) => (
          <Pressable
            key={f.id}
            style={[
              styles.filterChip,
              { borderColor: theme.border, backgroundColor: theme.background },
              sort === f.id && { backgroundColor: '#1A1A1A', borderColor: '#1A1A1A' },
            ]}
            onPress={() => setSort(f.id)}
          >
            <Text style={[
              styles.filterChipText,
              { color: theme.textMuted },
              sort === f.id && { color: '#FFFFFF' },
            ]}>
              {f.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {filtered.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={[styles.emptyText, { color: theme.text }]}>No products match these filters.</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          numColumns={NUM_COLS}
          renderItem={({ item }) => (
            <View style={[styles.cardWrapper, { width: `${100 / NUM_COLS}%` }]}>
              <ProductCard product={item} />
            </View>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: {
    fontSize: 17,
    fontFamily: Fonts.black,
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  filterRow: {
    borderBottomWidth: 1,
    maxHeight: 56,
  },
  filterContent: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 8,
  },
  filterChip: {
    borderWidth: 1.5,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
  },
  filterSep: {
    width: 1,
    height: 20,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 4,
  },
  listContent: {
    padding: 8,
  },
  cardWrapper: {
    padding: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: { fontSize: 48, marginBottom: 16 },
  emptyText: { fontSize: 16, fontFamily: Fonts.semiBold, textAlign: 'center' },
});
