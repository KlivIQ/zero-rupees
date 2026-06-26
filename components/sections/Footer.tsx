import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

export function Footer() {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <Text style={styles.tagline}>{t('footer.tagline')}</Text>
      <View style={styles.links}>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>{t('footer.about')}</Text>
        </Pressable>
        <Text style={styles.dot}>•</Text>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>{t('footer.howItWorks')}</Text>
        </Pressable>
        <Text style={styles.dot}>•</Text>
        <Pressable style={styles.link}>
          <Text style={styles.linkText}>{t('footer.privacy')}</Text>
        </Pressable>
      </View>
      <View style={styles.disclaimerBox}>
        <Text style={styles.disclaimer}>{t('footer.disclaimer')}</Text>
      </View>
      <Text style={styles.copyright}>{t('footer.copyright')}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 36,
    alignItems: 'center',
  },
  tagline: {
    fontSize: 16,
    fontFamily: Fonts.extraBold,
    color: Colors.white,
    textAlign: 'center',
    marginBottom: 16,
  },
  links: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 20,
  },
  link: {
    paddingHorizontal: 4,
  },
  linkText: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: 'rgba(255,255,255,0.65)',
    textDecorationLine: 'underline',
  },
  dot: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.3)',
  },
  disclaimerBox: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    maxWidth: 420,
  },
  disclaimer: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    lineHeight: 18,
  },
  copyright: {
    fontSize: 11,
    fontFamily: Fonts.regular,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
});
