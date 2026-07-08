import React from 'react';
import { View, Text, Pressable, StyleSheet, Linking } from 'react-native';
import { Fonts } from '@/constants/fonts';

export function Footer() {
  return (
    <View style={styles.container}>
      {/* Brand */}
      <Text style={styles.brand}>ZeroRupees</Text>
      <Text style={styles.tagline}>Buy Anything. Pay Nothing.</Text>

      <View style={styles.divider} />

      {/* Disclaimer */}
      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimerTitle}>⚠️ Just For Fun</Text>
        <Text style={styles.disclaimerText}>
          ZeroRupees is a 100% fictional e-commerce experience created purely for
          entertainment. No real products, no real transactions, no real money involved.
          All prices, products, orders, and deliveries are completely made up.
          Nothing here is for sale. Everything is free because nothing exists.
          Please don't try to actually pay ₹0 for a Lamborghini.
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Links row */}
      <View style={styles.links}>
        <Text style={styles.linkText}>About</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.linkText}>How It Works</Text>
        <Text style={styles.dot}>•</Text>
        <Text style={styles.linkText}>Privacy</Text>
      </View>

      {/* KlivIQ credit */}
      <Pressable
        style={styles.kliviqRow}
        onPress={() => Linking.openURL('https://kliviq.com')}
      >
        <Text style={styles.kliviqText}>Designed by </Text>
        <Text style={styles.kliviqBrand}>KlivIQ</Text>
      </Pressable>

      <Text style={styles.copyright}>© 2025 ZeroRupees. All rights reserved (to nothing).</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111111',
    paddingHorizontal: 24,
    paddingTop: 36,
    paddingBottom: 40,
    alignItems: 'center',
  },
  brand: {
    fontSize: 22,
    fontFamily: Fonts.black,
    color: '#C2185B',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: 'rgba(255,255,255,0.55)',
    marginBottom: 24,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    width: '100%',
    marginBottom: 24,
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 14,
    padding: 18,
    width: '100%',
    maxWidth: 480,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  disclaimerTitle: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255,255,255,0.45)',
    textAlign: 'center',
    lineHeight: 19,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  linkText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: 'rgba(255,255,255,0.4)',
  },
  dot: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.2)',
  },
  kliviqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
  },
  kliviqText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: 'rgba(255,255,255,0.5)',
  },
  kliviqBrand: {
    fontSize: 13,
    fontFamily: Fonts.black,
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  copyright: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255,255,255,0.25)',
    textAlign: 'center',
  },
});
