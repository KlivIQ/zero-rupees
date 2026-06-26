import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={styles.logoContainer}>
          <Text style={styles.logoZero}>Zero</Text>
          <Text style={styles.logoRupee}>₹0</Text>
        </View>
        <View style={styles.actions}>
          <Pressable style={styles.langButton}>
            <Text style={styles.langText}>{t('header.language')} ▾</Text>
          </Pressable>
          <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={26} color={Colors.white} />
            {totalItems > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalItems > 99 ? '99+' : totalItems}
                </Text>
              </View>
            )}
          </Pressable>
        </View>
      </View>
      <Text style={styles.tagline}>{t('header.tagline')}</Text>
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={17} color={Colors.textMuted} />
        <TextInput
          style={styles.searchInput}
          placeholder={t('header.search')}
          placeholderTextColor={Colors.textMuted}
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 2,
  },
  logoZero: {
    fontSize: 24,
    fontFamily: Fonts.black,
    color: Colors.white,
    letterSpacing: -0.5,
  },
  logoRupee: {
    fontSize: 24,
    fontFamily: Fonts.black,
    color: Colors.gold,
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  langButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  langText: {
    color: Colors.white,
    fontFamily: Fonts.semiBold,
    fontSize: 13,
  },
  cartButton: {
    padding: 2,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -6,
    backgroundColor: Colors.gold,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: Fonts.black,
    color: Colors.secondary,
  },
  tagline: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.text,
    padding: 0,
    margin: 0,
  },
});
