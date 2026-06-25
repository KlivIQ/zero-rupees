import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet, Easing, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

const MARQUEE_WIDTH = 1800;

export function MarqueeStrip() {
  const { t } = useTranslation();
  const translateX = useRef(new Animated.Value(0)).current;

  const marqueeText = t('marquee.text');

  useEffect(() => {
    const useNativeDriver = Platform.OS !== 'web';
    const anim = Animated.loop(
      Animated.timing(translateX, {
        toValue: -MARQUEE_WIDTH / 2,
        duration: 14000,
        easing: Easing.linear,
        useNativeDriver,
      })
    );
    anim.start();
    return () => anim.stop();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.track,
          { transform: [{ translateX }] },
        ]}
      >
        <Text style={styles.text}>{marqueeText}</Text>
        <Text style={styles.text}>{marqueeText}</Text>
        <Text style={styles.text}>{marqueeText}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    overflow: 'hidden',
  },
  track: {
    flexDirection: 'row',
    width: MARQUEE_WIDTH,
  },
  text: {
    fontSize: 13,
    fontFamily: Fonts.extraBold,
    color: Colors.white,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
