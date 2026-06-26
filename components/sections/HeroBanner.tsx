import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  Animated,
  StyleSheet,
  Platform,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const COIN_CONFIGS = [
  { symbol: '₹', left: '8%', delay: 0 },
  { symbol: '💰', left: '22%', delay: 400 },
  { symbol: '₹', left: '40%', delay: 800 },
  { symbol: '💵', left: '60%', delay: 200 },
  { symbol: '₹', left: '75%', delay: 1000 },
  { symbol: '🪙', left: '88%', delay: 600 },
];

type CoinProps = {
  symbol: string;
  left: string;
  delay: number;
};

function FloatingCoin({ symbol, left, delay }: CoinProps) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const anim = Animated.loop(
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -90,
            duration: 2200,
            easing: Easing.out(Easing.ease),
            useNativeDriver,
          }),
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 600,
              delay: 1000,
              useNativeDriver,
            }),
          ]),
        ]),
        Animated.parallel([
          Animated.timing(translateY, { toValue: 0, duration: 0, useNativeDriver }),
          Animated.timing(opacity, { toValue: 0, duration: 0, useNativeDriver }),
        ]),
        Animated.delay(500),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <Animated.Text
      style={[
        styles.floatingCoin,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { left: left as any, opacity, transform: [{ translateY }] },
      ]}
    >
      {symbol}
    </Animated.Text>
  );
}

type Props = {
  onCtaPress?: () => void;
};

export function HeroBanner({ onCtaPress }: Props) {
  const { t } = useTranslation();

  return (
    <LinearGradient colors={['#FCE4EC', '#F8BBD0', '#FFCDD2']} style={styles.container}>
      <View style={styles.coinsLayer} pointerEvents="none">
        {COIN_CONFIGS.map((coin, i) => (
          <FloatingCoin key={i} {...coin} />
        ))}
      </View>
      <View style={styles.content}>
        <Text style={styles.headline}>{t('hero.headline')}</Text>
        <Text style={styles.headline2}>{t('hero.headline2')}</Text>
        <Text style={styles.subtext}>{t('hero.subtext')}</Text>
        <Pressable style={styles.ctaButton} onPress={onCtaPress}>
          <Text style={styles.ctaText}>{t('hero.cta')} 🛒</Text>
        </Pressable>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>✨ No credit card needed. No UPI. No nothing.</Text>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 280,
    paddingHorizontal: 20,
    paddingVertical: 36,
    overflow: 'hidden',
  },
  coinsLayer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingCoin: {
    position: 'absolute',
    bottom: 20,
    fontSize: 28,
  },
  content: {
    zIndex: 1,
    maxWidth: Math.min(SCREEN_WIDTH - 40, 600),
    alignSelf: 'center',
    width: '100%',
    alignItems: 'center',
  },
  headline: {
    fontSize: 32,
    fontFamily: Fonts.black,
    color: Colors.primaryDark,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 2,
  },
  headline2: {
    fontSize: 32,
    fontFamily: Fonts.black,
    color: Colors.primary,
    textAlign: 'center',
    lineHeight: 38,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 15,
    fontFamily: Fonts.semiBold,
    color: Colors.primaryDark,
    textAlign: 'center',
    opacity: 0.85,
    marginBottom: 24,
    lineHeight: 22,
  },
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 14,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 16,
  },
  ctaText: {
    fontSize: 17,
    fontFamily: Fonts.extraBold,
    color: Colors.white,
    letterSpacing: 0.3,
  },
  badge: {
    backgroundColor: 'rgba(194,24,91,0.1)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(194,24,91,0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: Colors.primaryDark,
    textAlign: 'center',
  },
});
