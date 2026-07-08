import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Fonts } from '@/constants/fonts';

type Slide = {
  headline: string;
  subtext: string;
  cta: string;
  ctaRoute: string;
  colors: [string, string, string];
  textColor: string;
  subtextColor: string;
  ctaBg: string;
  ctaTextColor: string;
};

const SLIDES: Slide[] = [
  {
    headline: 'Shop Without Limits.\nPay ₹0 Always.',
    subtext: "India's only store where your cart total is always zero.",
    cta: 'Start Shopping Free 🛒',
    ctaRoute: '/category/jewellery',
    colors: ['#C2185B', '#D81B60', '#880E4F'],
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255,255,255,0.88)',
    ctaBg: '#FFFFFF',
    ctaTextColor: '#C2185B',
  },
  {
    headline: 'Gold, Cars, Land.\nAll ₹0.',
    subtext: "Because why not? It's all fake anyway.",
    cta: 'Browse Luxury →',
    ctaRoute: '/category/luxury-cars',
    colors: ['#1A1205', '#2D2210', '#0D0900'],
    textColor: '#FFD700',
    subtextColor: 'rgba(255,215,0,0.75)',
    ctaBg: '#FFD700',
    ctaTextColor: '#1A1205',
  },
  {
    headline: 'Buy an IPL Team\nToday.',
    subtext: 'No budget limits. No real consequences.',
    cta: 'Shop Absurd Gifts →',
    ctaRoute: '/category/absurd',
    colors: ['#0A1628', '#0D2137', '#050D18'],
    textColor: '#FFFFFF',
    subtextColor: 'rgba(255,255,255,0.8)',
    ctaBg: '#C2185B',
    ctaTextColor: '#FFFFFF',
  },
];

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { width: screenW } = useWindowDimensions();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = (idx: number) => {
    scrollRef.current?.scrollTo({ x: idx * screenW, animated: true });
    setActive(idx);
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % SLIDES.length;
        scrollRef.current?.scrollTo({ x: next * screenW, animated: true });
        return next;
      });
    }, 3500);
  };

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [screenW]);

  const handleScroll = (e: { nativeEvent: { contentOffset: { x: number } } }) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / screenW);
    if (idx >= 0 && idx < SLIDES.length && idx !== active) {
      setActive(idx);
    }
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
        style={{ width: screenW }}
      >
        {SLIDES.map((slide, i) => (
          <LinearGradient
            key={i}
            colors={slide.colors}
            style={[styles.slide, { width: screenW }]}
          >
            <View style={styles.slideInner}>
              <Text style={[styles.headline, { color: slide.textColor }]}>
                {slide.headline}
              </Text>
              <Text style={[styles.subtext, { color: slide.subtextColor }]}>
                {slide.subtext}
              </Text>
              <Pressable
                style={[styles.ctaBtn, { backgroundColor: slide.ctaBg }]}
                onPress={() => router.push(slide.ctaRoute as any)}
              >
                <Text style={[styles.ctaBtnText, { color: slide.ctaTextColor }]}>
                  {slide.cta}
                </Text>
              </Pressable>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
      <View style={styles.dotsRow}>
        {SLIDES.map((_, i) => (
          <Pressable key={i} onPress={() => { goTo(i); resetTimer(); }} hitSlop={8}>
            <View style={[styles.dot, i === active && styles.dotActive]} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {},
  slide: {
    paddingHorizontal: 24,
    paddingVertical: 44,
    minHeight: 220,
    justifyContent: 'center',
  },
  slideInner: {
    maxWidth: 480,
  },
  headline: {
    fontSize: 30,
    fontFamily: Fonts.black,
    lineHeight: 38,
    marginBottom: 10,
  },
  subtext: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    lineHeight: 21,
    marginBottom: 24,
    maxWidth: 320,
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    borderRadius: 30,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  ctaBtnText: {
    fontSize: 14,
    fontFamily: Fonts.extraBold,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#D0D0D0',
  },
  dotActive: {
    backgroundColor: '#C2185B',
    width: 22,
    borderRadius: 4,
  },
});
