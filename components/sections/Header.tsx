import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { Fonts } from '@/constants/fonts';
import { useTheme } from '@/context/ThemeContext';

export function Header() {
  const { t } = useTranslation();
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.primary, shadowColor: '#000' }]}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.replace('/')} style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Pressable>
        <View style={styles.actions}>
          <Pressable style={styles.themeBtn} onPress={toggleTheme}>
            <Text style={styles.themeBtnText}>{isDark ? '☀️' : '🕶️'}</Text>
          </Pressable>
          <Pressable style={styles.langButton}>
            <Text style={styles.langText}>{t('header.language')} ▾</Text>
          </Pressable>
          <Pressable style={styles.cartButton} onPress={() => router.push('/cart')}>
            <Ionicons name="cart-outline" size={26} color="#FFFFFF" />
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
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={17} color="#888888" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search anything — it's all ₹0"
          placeholderTextColor="#888888"
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  themeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtnText: {
    fontSize: 18,
  },
  langButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
  },
  langText: {
    color: '#FFFFFF',
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
    backgroundColor: '#FFD700',
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
    color: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 9,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: '#1A1A1A',
    padding: 0,
    margin: 0,
  },
});
