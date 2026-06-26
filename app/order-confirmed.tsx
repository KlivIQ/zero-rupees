import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Animated,
  Dimensions,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { formatINR } from '@/utils/formatCurrency';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const CONFETTI_COLORS = ['#C2185B', '#FFD700', '#000000', '#FFFFFF', '#F48FB1', '#FFF176'];
const PIECE_COUNT = 40;

function ConfettiPiece({ index }: { index: number }) {
  const x = useRef(new Animated.Value(Math.random() * SCREEN_W)).current;
  const y = useRef(new Animated.Value(-20)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const delay = Math.random() * 800;
    const duration = 1800 + Math.random() * 1200;
    Animated.parallel([
      Animated.timing(y, {
        toValue: SCREEN_H * 0.7,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: 360 * (Math.random() > 0.5 ? 1 : -1),
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(delay + duration * 0.7),
        Animated.timing(opacity, {
          toValue: 0,
          duration: duration * 0.3,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const color = CONFETTI_COLORS[index % CONFETTI_COLORS.length];
  const size = 8 + Math.random() * 8;
  const isCircle = index % 3 === 0;

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: x,
        width: size,
        height: isCircle ? size : size * 1.6,
        borderRadius: isCircle ? size / 2 : 2,
        backgroundColor: color,
        transform: [
          { translateY: y },
          {
            rotate: rotate.interpolate({
              inputRange: [0, 360],
              outputRange: ['0deg', '360deg'],
            }),
          },
        ],
        opacity,
      }}
    />
  );
}

function Confetti() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      {Array.from({ length: PIECE_COUNT }, (_, i) => (
        <ConfettiPiece key={i} index={i} />
      ))}
    </View>
  );
}

export default function OrderConfirmedScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const lastOrder = useCartStore((s) => s.lastOrder);
  const shareCardRef = useRef<View>(null);
  const [sharing, setSharing] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  if (!lastOrder) {
    return (
      <View style={styles.noOrder}>
        <Text style={styles.noOrderText}>No order found.</Text>
        <Pressable onPress={() => router.replace('/')}>
          <Text style={styles.noOrderLink}>← Go home</Text>
        </Pressable>
      </View>
    );
  }

  const paymentLabel =
    lastOrder.paymentMethod === 'upi'
      ? t('confirmation.upi')
      : lastOrder.paymentMethod === 'card'
      ? t('confirmation.card')
      : t('confirmation.cod');

  async function handleSaveImage() {
    if (Platform.OS === 'web') {
      Alert.alert('Save Image', 'Right-click the share card to save it as an image.');
      return;
    }
    try {
      setSharing(true);
      const uri = await captureRef(shareCardRef, { format: 'png', quality: 1 });
      await Sharing.shareAsync(uri, { mimeType: 'image/png' });
    } catch {
      Alert.alert('Oops', 'Could not save image. Try screenshot instead!');
    } finally {
      setSharing(false);
    }
  }

  async function handleShare() {
    if (!lastOrder) return;
    const text = `😎 I just fake-bought:\n${lastOrder.items.map((i) => `• ${i.name}`).join('\n')}\n\nWorth ₹${formatINR(lastOrder.totalFakePrice)}\nAmount Paid: ₹0.00\nOrder: ${lastOrder.orderId}\n\nBuy Anything. Pay Nothing.\nzerorupees.vercel.app`;

    if (Platform.OS === 'web' && typeof navigator !== 'undefined' && (navigator as any).share) {
      try {
        await (navigator as any).share({ text, title: 'ZeroRupees' });
      } catch {
        // user cancelled
      }
      return;
    }
    if (Platform.OS !== 'web') {
      try {
        setSharing(true);
        const uri = await captureRef(shareCardRef, { format: 'png', quality: 1 });
        await Sharing.shareAsync(uri, { mimeType: 'image/png', dialogTitle: 'Share your ZeroRupees order' });
      } catch {
        Alert.alert('Share', text);
      } finally {
        setSharing(false);
      }
      return;
    }
    // web fallback: copy
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      Alert.alert('Copied!', 'Share text copied to clipboard.');
    }
  }

  return (
    <View style={styles.root}>
      {showConfetti && <Confetti />}

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Big success badge */}
        <View style={styles.successBadge}>
          <Ionicons name="checkmark-circle" size={64} color="#43A047" />
          <Text style={styles.confirmedTitle}>{t('confirmation.title')}</Text>
          <Text style={styles.confirmedSubtitle}>{t('confirmation.subtitle')}</Text>
        </View>

        {/* Receipt card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptHeader}>
            <Text style={styles.receiptBrand}>ZeroRupees</Text>
            <Text style={styles.receiptOrderId}>
              {t('confirmation.orderId')}: {lastOrder.orderId}
            </Text>
          </View>

          <View style={styles.receiptDivider} />

          {lastOrder.items.map((item) => (
            <View key={item.productId} style={styles.receiptItem}>
              <Text style={styles.receiptItemName} numberOfLines={1}>
                {item.name} ×{item.quantity}
              </Text>
              <Text style={styles.receiptItemZero}>₹0</Text>
            </View>
          ))}

          <View style={styles.receiptDivider} />

          <ReceiptRow
            label={t('confirmation.subtotalLabel')}
            value={`₹${formatINR(lastOrder.totalFakePrice)}`}
            strike
          />
          <ReceiptRow
            label={t('confirmation.youSaved')}
            value={`₹${formatINR(lastOrder.totalFakePrice)}`}
            green
          />
          <ReceiptRow label={t('confirmation.amountPaid')} value={t('confirmation.amountPaidValue')} bold />
          <ReceiptRow label={t('confirmation.paymentVia')} value={paymentLabel} />
          <ReceiptRow label={t('confirmation.delivery')} value={t('confirmation.deliveryValue')} />

          <View style={styles.etaBox}>
            <Text style={styles.etaLabel}>{t('confirmation.eta')}</Text>
            <Text style={styles.etaValue}>{t('confirmation.etaValue')}</Text>
          </View>
        </View>

        {/* Share card */}
        <View ref={shareCardRef} style={styles.shareCard} collapsable={false}>
          <View style={styles.shareCardHeader}>
            <Text style={styles.shareCardBrand}>Zero</Text>
            <Text style={styles.shareCardRupee}>₹0</Text>
          </View>
          <Text style={styles.shareCardTitle}>{t('confirmation.shareTitle')}</Text>
          {lastOrder.items.slice(0, 4).map((item) => (
            <Text key={item.productId} style={styles.shareCardItem} numberOfLines={1}>
              • {item.name}
            </Text>
          ))}
          {lastOrder.items.length > 4 && (
            <Text style={styles.shareCardItem}>+{lastOrder.items.length - 4} more items</Text>
          )}
          <Text style={styles.shareCardWorth}>
            {t('confirmation.shareWorth')} ₹{formatINR(lastOrder.totalFakePrice)}
          </Text>
          <Text style={styles.shareCardPaid}>{t('confirmation.shareAmountPaid')}</Text>
          <Text style={styles.shareCardOrder}>{lastOrder.orderId}</Text>
          <View style={styles.shareCardDivider} />
          <Text style={styles.shareCardTagline}>{t('confirmation.shareTagline')}</Text>
          <Text style={styles.shareCardUrl}>zerorupees.vercel.app</Text>
        </View>

        {/* Share buttons */}
        <View style={styles.shareButtons}>
          <Pressable style={styles.shareBtn} onPress={handleSaveImage} disabled={sharing}>
            <Text style={styles.shareBtnText}>{t('confirmation.saveImage')}</Text>
          </Pressable>
          <Pressable style={[styles.shareBtn, styles.shareBtnPrimary]} onPress={handleShare} disabled={sharing}>
            <Text style={[styles.shareBtnText, styles.shareBtnTextPrimary]}>{t('confirmation.shareWhatsApp')}</Text>
          </Pressable>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.actionBtn} onPress={() => router.replace('/')}>
            <Text style={styles.actionBtnText}>{t('confirmation.shopMore')}</Text>
          </Pressable>
          <Pressable
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={() => Alert.alert('V3 Feature', t('confirmation.trackComingSoon'))}
          >
            <Text style={[styles.actionBtnText, styles.actionBtnOutlineText]}>
              {t('confirmation.trackOrder')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function ReceiptRow({
  label,
  value,
  strike,
  green,
  bold,
}: {
  label: string;
  value: string;
  strike?: boolean;
  green?: boolean;
  bold?: boolean;
}) {
  return (
    <View style={styles.receiptRow}>
      <Text style={styles.receiptRowLabel}>{label}</Text>
      <Text
        style={[
          styles.receiptRowValue,
          strike && styles.strikeText,
          green && styles.greenText,
          bold && styles.boldText,
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  noOrder: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noOrderText: { fontSize: 16, fontFamily: Fonts.regular, color: Colors.text, marginBottom: 12 },
  noOrderLink: { fontSize: 15, fontFamily: Fonts.bold, color: Colors.primary },
  successBadge: {
    alignItems: 'center',
    marginBottom: 28,
  },
  confirmedTitle: {
    fontSize: 28,
    fontFamily: Fonts.black,
    color: Colors.text,
    marginTop: 10,
    marginBottom: 6,
    textAlign: 'center',
  },
  confirmedSubtitle: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  // Receipt
  receiptCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  receiptHeader: { alignItems: 'center', marginBottom: 14 },
  receiptBrand: { fontSize: 22, fontFamily: Fonts.black, color: Colors.primary },
  receiptOrderId: { fontSize: 12, fontFamily: Fonts.semiBold, color: Colors.textMuted, marginTop: 2 },
  receiptDivider: { height: 1, backgroundColor: Colors.accent, marginVertical: 12 },
  receiptItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  receiptItemName: {
    flex: 1,
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: Colors.text,
    marginRight: 8,
  },
  receiptItemZero: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.primary },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  receiptRowLabel: { fontSize: 13, fontFamily: Fonts.regular, color: Colors.textMuted },
  receiptRowValue: { fontSize: 13, fontFamily: Fonts.semiBold, color: Colors.text },
  strikeText: { textDecorationLine: 'line-through', color: Colors.priceStrike },
  greenText: { color: '#43A047', fontFamily: Fonts.bold },
  boldText: { fontSize: 16, fontFamily: Fonts.black, color: Colors.primary },
  etaBox: {
    backgroundColor: Colors.accent,
    borderRadius: 12,
    padding: 14,
    marginTop: 10,
  },
  etaLabel: { fontSize: 12, fontFamily: Fonts.bold, color: Colors.textMuted, marginBottom: 4 },
  etaValue: { fontSize: 13, fontFamily: Fonts.semiBold, color: Colors.text },
  // Share card
  shareCard: {
    backgroundColor: Colors.primary,
    borderRadius: 18,
    padding: 22,
    marginBottom: 16,
  },
  shareCardHeader: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 14 },
  shareCardBrand: { fontSize: 20, fontFamily: Fonts.black, color: Colors.white },
  shareCardRupee: { fontSize: 20, fontFamily: Fonts.black, color: Colors.gold },
  shareCardTitle: {
    fontSize: 16,
    fontFamily: Fonts.black,
    color: Colors.white,
    marginBottom: 10,
  },
  shareCardItem: {
    fontSize: 13,
    fontFamily: Fonts.regular,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 3,
  },
  shareCardWorth: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.gold,
    marginTop: 10,
    textDecorationLine: 'line-through',
  },
  shareCardPaid: { fontSize: 20, fontFamily: Fonts.black, color: Colors.white, marginTop: 4 },
  shareCardOrder: {
    fontSize: 12,
    fontFamily: Fonts.semiBold,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
  },
  shareCardDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 12 },
  shareCardTagline: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.white },
  shareCardUrl: { fontSize: 11, fontFamily: Fonts.regular, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  // Share buttons
  shareButtons: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  shareBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 30,
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  shareBtnPrimary: { backgroundColor: Colors.primary, borderWidth: 0 },
  shareBtnText: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.primary },
  shareBtnTextPrimary: { color: Colors.white },
  // Action buttons
  actionButtons: { gap: 10 },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  actionBtnText: { fontSize: 15, fontFamily: Fonts.black, color: Colors.white },
  actionBtnOutline: { backgroundColor: 'transparent', borderWidth: 2, borderColor: Colors.primary },
  actionBtnOutlineText: { color: Colors.primary },
});
