import React from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCartStore } from '@/store/cartStore';
import { Fonts } from '@/constants/fonts';
import { useTheme } from '@/context/ThemeContext';

export function Header() {
  const router = useRouter();
  const totalItems = useCartStore((s) => s.totalItems());
  const { isDark, toggleTheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Pressable onPress={() => router.replace('/')} style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <Text style={styles.logoText}>ZeroRupees</Text>
        </Pressable>
        <View style={styles.actions}>
          <Pressable style={styles.themeBtn} onPress={toggleTheme} hitSlop={8}>
            <Text style={styles.themeBtnText}>{isDark ? '☀️' : '🕶️'}</Text>
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
        <Ionicons name="search-outline" size={17} color="#999999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search anything — it's all ₹0"
          placeholderTextColor="#999999"
          editable={false}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#C2185B',
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoImage: {
    width: 36,
    height: 36,
  },
  logoText: {
    fontSize: 22,
    fontFamily: Fonts.black,
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  themeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeBtnText: {
    fontSize: 17,
  },
  cartButton: {
    padding: 4,
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -4,
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
    borderRadius: 26,
    paddingHorizontal: 14,
    paddingVertical: 10,
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
