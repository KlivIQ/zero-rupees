import React from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore, CartItem } from '@/store/cartStore';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';
import { formatINR } from '@/utils/formatCurrency';

export default function CartScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const totalFakePrice = useCartStore((s) => s.totalFakePrice());
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);

  const isEmpty = items.length === 0;

  function renderItem({ item }: { item: CartItem }) {
    return (
      <View style={styles.itemRow}>
        <View style={styles.itemEmoji}>
          <Text style={styles.itemEmojiText}>🛍️</Text>
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.itemFakePrice}>
            ₹{formatINR(item.fakePrice)}
          </Text>
          <Text style={styles.itemZeroPrice}>₹0</Text>
        </View>
        <View style={styles.itemControls}>
          <View style={styles.qtyRow}>
            <Pressable
              style={[styles.qtyBtn, item.quantity <= 1 && styles.qtyBtnDisabled]}
              onPress={() => item.quantity > 1 && updateQuantity(item.productId, -1)}
              disabled={item.quantity <= 1}
            >
              <Text style={[styles.qtyBtnText, item.quantity <= 1 && styles.qtyBtnTextDisabled]}>−</Text>
            </Pressable>
            <Text style={styles.qtyNum}>{item.quantity}</Text>
            <Pressable
              style={styles.qtyBtn}
              onPress={() => updateQuantity(item.productId, 1)}
            >
              <Text style={styles.qtyBtnText}>+</Text>
            </Pressable>
          </View>
          <Pressable
            style={styles.removeBtn}
            onPress={() => removeItem(item.productId)}
          >
            <Ionicons name="trash-outline" size={18} color="#EF5350" />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header bar */}
      <View style={styles.headerBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('cart.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {isEmpty ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyText}>{t('cart.empty')}</Text>
          <Text style={styles.emptySubtext}>{t('cart.emptySubtext')}</Text>
          <Pressable
            style={styles.shopBtn}
            onPress={() => router.replace('/')}
          >
            <Text style={styles.shopBtnText}>{t('cart.shopNow')}</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            keyExtractor={(item) => item.productId}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListFooterComponent={
              <View style={styles.summaryBox}>
                <Text style={styles.summaryTitle}>Order Summary</Text>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
                  <Text style={styles.summaryStrike}>
                    ₹{formatINR(totalFakePrice)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('cart.discount')}</Text>
                  <Text style={styles.summaryDiscount}>
                    −₹{formatINR(totalFakePrice)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>{t('cart.delivery')}</Text>
                  <Text style={styles.summaryFree}>
                    {t('cart.deliveryFree')}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.totalLabel}>{t('cart.total')}</Text>
                  <Text style={styles.totalAmount}>{t('cart.totalAmount')}</Text>
                </View>
                <Text style={styles.savingsNote}>
                  🎉 You saved ₹{formatINR(totalFakePrice)} on this order!
                </Text>
              </View>
            }
          />
          <View style={styles.checkoutBar}>
            <Pressable
              style={styles.checkoutBtn}
              onPress={() => router.push('/checkout')}
            >
              <Text style={styles.checkoutBtnText}>
                {t('cart.proceedToCheckout')}
              </Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerBar: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: {
    width: 40,
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: Fonts.black,
    color: Colors.white,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 72,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 22,
    fontFamily: Fonts.black,
    color: Colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginBottom: 28,
    textAlign: 'center',
  },
  shopBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  shopBtnText: {
    fontSize: 16,
    fontFamily: Fonts.bold,
    color: Colors.white,
  },
  listContent: {
    padding: 16,
    paddingBottom: 0,
  },
  itemRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  itemEmoji: {
    width: 56,
    height: 56,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmojiText: {
    fontSize: 28,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemName: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 3,
  },
  itemFakePrice: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.priceStrike,
    textDecorationLine: 'line-through',
    marginBottom: 2,
  },
  itemZeroPrice: {
    fontSize: 18,
    fontFamily: Fonts.black,
    color: Colors.primary,
  },
  itemControls: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.accent,
    borderWidth: 1,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    borderColor: Colors.priceStrike,
    backgroundColor: '#F5F5F5',
  },
  qtyBtnText: {
    fontSize: 16,
    fontFamily: Fonts.black,
    color: Colors.primary,
    lineHeight: 20,
  },
  qtyBtnTextDisabled: {
    color: Colors.priceStrike,
  },
  qtyNum: {
    fontSize: 15,
    fontFamily: Fonts.black,
    color: Colors.text,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 4,
  },
  separator: {
    height: 10,
  },
  summaryBox: {
    margin: 16,
    backgroundColor: Colors.accent,
    borderRadius: 16,
    padding: 18,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: Fonts.black,
    color: Colors.text,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
  },
  summaryStrike: {
    fontSize: 14,
    fontFamily: Fonts.semiBold,
    color: Colors.priceStrike,
    textDecorationLine: 'line-through',
  },
  summaryDiscount: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#43A047',
  },
  summaryFree: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: '#43A047',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 10,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: Fonts.black,
    color: Colors.text,
  },
  totalAmount: {
    fontSize: 22,
    fontFamily: Fonts.black,
    color: Colors.primary,
  },
  savingsNote: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: '#43A047',
    textAlign: 'center',
    marginTop: 10,
  },
  checkoutBar: {
    padding: 16,
    paddingBottom: 24,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.accent,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
  },
  checkoutBtnText: {
    fontSize: 17,
    fontFamily: Fonts.black,
    color: Colors.white,
  },
});
