import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/fonts';

const { width: SCREEN_W } = Dimensions.get('window');
const SLIDE_W = Math.min(SCREEN_W, 800);

type Slide = {
  headline: string;
  subtext: string;
  cta: string;
  ctaRoute: string;
  colors: [string, string, string];
  textColor: string;
  ctaBg: string;
  ctaText: string;
};

const SLIDES: Slide[] = [
  {
    headline: 'Shop Without Limits.\nPay ₹0 Always.',
    subtext: "India's only store where your cart total is always zero.",
    cta: 'Start Shopping Free 🛒',
    ctaRoute: '/',
    colors: ['#C2185B', '#E91E63', '#880E4F'],
    textColor: '#FFFFFF',
    ctaBg: '#FFFFFF',
    ctaText: '#C2185B',
  },
  {
    headline: 'Gold, Cars, Land.\nAll ₹0.',
    subtext: "Because why not? It's all fake anyway.",
    cta: 'Browse Luxury →',
    ctaRoute: '/category/luxury-cars',
    colors: ['#1A1A1A', '#2D2D1A', '#0D0D00'],
    textColor: '#FFD700',
    ctaBg: '#FFD700',
    ctaText: '#1A1A1A',
  },
  {
    headline: 'Buy an IPL Team\nToday.',
    subtext: 'No budget limits. No real consequences.',
    cta: 'Shop Absurd Gifts →',
    ctaRoute: '/category/absurd',
    colors: ['#0A1628', '#0D2137', '#060E1A'],
    textColor: '#FFFFFF',
    ctaBg: '#C2185B',
    ctaText: '#FFFFFF',
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * SLIDE_W, animated: true });
    setActive(idx);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * SLIDE_W, animated: true });
        return next;
      });
    }, 3000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const handleScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / SLIDE_W);
    if (idx !== active) setActive(idx);
  };

  return (
    <View style={styles.root}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
        style={styles.scroll}
      >
        {SLIDES.map((slide, i) => (
          <LinearGradient key={i} colors={slide.colors} style={styles.slide}>
            <Text style={[styles.headline, { color: slide.textColor }]}>
              {slide.headline}
            </Text>
            <Text style={[styles.subtext, { color: slide.textColor, opacity: 0.85 }]}>
              {slide.subtext}
            </Text>
            <Pressable
              style={[styles.ctaBtn, { backgroundColor: slide.ctaBg }]}
              onPress={() => router.push(slide.ctaRoute as any)}
            >
              <Text style={[styles.ctaBtnText, { color: slide.ctaText }]}>{slide.cta}</Text>
            </Pressable>
          </LinearGradient>
        ))}
      </ScrollView>
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <Pressable key={i} onPress={() => goTo(i)}>
            <View style={[styles.dot, i === active && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { overflow: 'hidden' },
  scroll: { width: SLIDE_W },
  slide: {
    width: SLIDE_W,
    paddingHorizontal: 28,
    paddingVertical: 40,
    minHeight: 240,
    justifyContent: 'center',
  },
  headline: {
    fontSize: 28,
    fontFamily: Fonts.black,
    lineHeight: 36,
    marginBottom: 12,
  },
  subtext: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    lineHeight: 20,
    marginBottom: 24,
    maxWidth: 280,
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  ctaBtnText: {
    fontSize: 15,
    fontFamily: Fonts.extraBold,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E0E0E0',
  },
  dotActive: {
    backgroundColor: '#C2185B',
    width: 20,
  },
});
