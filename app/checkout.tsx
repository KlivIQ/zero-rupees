import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Modal,
  FlatList,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import { useCartStore } from '@/store/cartStore';
import { Colors } from '@/constants/colors';
import { Fonts } from '@/constants/fonts';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman & Nicobar Islands', 'Chandigarh', 'Dadra & Nagar Haveli and Daman & Diu',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

type PaymentMethod = 'upi' | 'card' | 'cod';

export default function CheckoutScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const placeOrder = useCartStore((s) => s.placeOrder);

  const [step, setStep] = useState<1 | 2>(1);
  const [stateModalVisible, setStateModalVisible] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  });

  function setField(key: keyof typeof form, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: '' }));
  }

  function validateAddress() {
    const required: (keyof typeof form)[] = ['fullName', 'phone', 'address1', 'city', 'state', 'pincode'];
    const newErrors: Record<string, string> = {};
    required.forEach((k) => {
      if (!form[k].trim()) newErrors[k] = t('checkout.required');
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleContinue() {
    if (validateAddress()) setStep(2);
  }

  function handlePay() {
    placeOrder(paymentMethod, form.fullName);
    router.replace('/order-confirmed');
  }

  const upiId = form.fullName
    ? form.fullName.trim().split(' ')[0].toLowerCase() + '@fakebank'
    : 'you@fakebank';

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.headerBar}>
        <Pressable
          style={styles.backBtn}
          onPress={() => (step === 2 ? setStep(1) : router.back())}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.white} />
        </Pressable>
        <Text style={styles.headerTitle}>{t('checkout.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Step indicator */}
      <View style={styles.stepIndicator}>
        <View style={[styles.stepDot, step >= 1 && styles.stepDotActive]}>
          <Text style={styles.stepDotText}>1</Text>
        </View>
        <View style={[styles.stepLine, step === 2 && styles.stepLineActive]} />
        <View style={[styles.stepDot, step >= 2 && styles.stepDotActive]}>
          <Text style={styles.stepDotText}>2</Text>
        </View>
      </View>

      {step === 1 ? (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          <Text style={styles.sectionTitle}>{t('checkout.addressTitle')}</Text>

          <Field
            label={t('checkout.fullName')}
            value={form.fullName}
            onChangeText={(v) => setField('fullName', v)}
            placeholder="Rahul Sharma"
            error={errors.fullName}
          />
          <Field
            label={t('checkout.phone')}
            value={form.phone}
            onChangeText={(v) => setField('phone', v)}
            placeholder="9876543210"
            keyboardType="phone-pad"
            error={errors.phone}
          />
          <Field
            label={t('checkout.address1')}
            value={form.address1}
            onChangeText={(v) => setField('address1', v)}
            placeholder="Flat 42, Imaginary Towers"
            error={errors.address1}
          />
          <Field
            label={t('checkout.address2')}
            value={form.address2}
            onChangeText={(v) => setField('address2', v)}
            placeholder="Near Nowhere Circle (optional)"
          />
          <Field
            label={t('checkout.city')}
            value={form.city}
            onChangeText={(v) => setField('city', v)}
            placeholder="Mumbai"
            error={errors.city}
          />

          {/* State dropdown */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>{t('checkout.state')}</Text>
            <Pressable
              style={[styles.input, styles.selectInput, errors.state ? styles.inputError : null]}
              onPress={() => setStateModalVisible(true)}
            >
              <Text style={form.state ? styles.selectValue : styles.selectPlaceholder}>
                {form.state || t('checkout.selectState')}
              </Text>
              <Ionicons name="chevron-down" size={18} color={Colors.textMuted} />
            </Pressable>
            {errors.state ? <Text style={styles.errorText}>{errors.state}</Text> : null}
          </View>

          <Field
            label={t('checkout.pincode')}
            value={form.pincode}
            onChangeText={(v) => setField('pincode', v)}
            placeholder="400001"
            keyboardType="number-pad"
            maxLength={6}
            error={errors.pincode}
          />

          <Text style={styles.disclaimer}>{t('checkout.disclaimer')}</Text>

          <Pressable style={styles.primaryBtn} onPress={handleContinue}>
            <Text style={styles.primaryBtnText}>{t('checkout.continueToPayment')}</Text>
          </Pressable>
        </ScrollView>
      ) : (
        <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
          {/* ZeroPay header */}
          <View style={styles.zeroPayHeader}>
            <Ionicons name="lock-closed" size={18} color="#43A047" />
            <Text style={styles.zeroPayTitle}>{t('payment.title')}</Text>
          </View>
          <Text style={styles.zeroPaySubtitle}>{t('payment.subtitle')}</Text>
          <Text style={styles.zeroPayPowered}>{t('payment.poweredBy')}</Text>

          {/* Payment tabs */}
          <View style={styles.tabs}>
            {(['upi', 'card', 'cod'] as PaymentMethod[]).map((method) => (
              <Pressable
                key={method}
                style={[styles.tab, paymentMethod === method && styles.tabActive]}
                onPress={() => setPaymentMethod(method)}
              >
                <Text style={[styles.tabText, paymentMethod === method && styles.tabTextActive]}>
                  {method === 'upi' ? t('payment.upi') : method === 'card' ? t('payment.card') : t('payment.cod')}
                </Text>
              </Pressable>
            ))}
          </View>

          {paymentMethod === 'upi' && (
            <UpiPanel upiId={upiId} t={t} onPay={handlePay} />
          )}
          {paymentMethod === 'card' && (
            <CardPanel name={form.fullName || 'RAHUL SHARMA'} t={t} onPay={handlePay} />
          )}
          {paymentMethod === 'cod' && (
            <CodPanel t={t} onPay={handlePay} />
          )}

          <Text style={styles.secureNote}>{t('payment.secureNote')}</Text>
        </ScrollView>
      )}

      {/* State picker modal */}
      <Modal
        visible={stateModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setStateModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setStateModalVisible(false)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>{t('checkout.selectState')}</Text>
            <FlatList
              data={INDIAN_STATES}
              keyExtractor={(s) => s}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.stateOption}
                  onPress={() => {
                    setField('state', item);
                    setStateModalVisible(false);
                  }}
                >
                  <Text style={[styles.stateOptionText, form.state === item && styles.stateOptionSelected]}>
                    {item}
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

/* ── Sub-components ── */

function Field({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  keyboardType,
  maxLength,
}: {
  label: string;
  value: string;
  onChangeText: (v: string) => void;
  placeholder?: string;
  error?: string;
  keyboardType?: 'default' | 'phone-pad' | 'number-pad';
  maxLength?: number;
}) {
  return (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textMuted}
        keyboardType={keyboardType ?? 'default'}
        maxLength={maxLength}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}

function UpiPanel({ upiId, t, onPay }: { upiId: string; t: Function; onPay: () => void }) {
  return (
    <View style={styles.payPanel}>
      <Text style={styles.payPanelLabel}>{t('payment.upiId')}</Text>
      <View style={styles.upiIdBox}>
        <Ionicons name="phone-portrait-outline" size={18} color={Colors.primary} />
        <Text style={styles.upiIdText}>{upiId}</Text>
      </View>
      {/* Fake QR */}
      <View style={styles.qrBox}>
        <Text style={styles.qrLabel}>{t('payment.qrPlaceholder')}</Text>
        <View style={styles.qrSquare}>
          <Text style={styles.qrZero}>₹0</Text>
        </View>
      </View>
      <Text style={styles.payingText}>{t('payment.paying')}</Text>
      <Pressable style={styles.payBtn} onPress={onPay}>
        <Text style={styles.payBtnText}>{t('payment.payUpi')}</Text>
      </Pressable>
    </View>
  );
}

function CardPanel({ name, t, onPay }: { name: string; t: Function; onPay: () => void }) {
  return (
    <View style={styles.payPanel}>
      {/* Fake card visual */}
      <View style={styles.cardVisual}>
        <Text style={styles.cardBrandText}>ZeroCard Platinum 💳</Text>
        <Text style={styles.cardNumberText}>0000  1111  2222  3333</Text>
        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.cardMeta}>EXPIRY</Text>
            <Text style={styles.cardValue}>00/00</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.cardMeta}>CARDHOLDER</Text>
            <Text style={styles.cardValue}>{name.toUpperCase() || 'RAHUL SHARMA'}</Text>
          </View>
        </View>
      </View>
      <Text style={styles.payingText}>{t('payment.paying')}</Text>
      <Pressable style={styles.payBtn} onPress={onPay}>
        <Text style={styles.payBtnText}>{t('payment.payCard')}</Text>
      </Pressable>
    </View>
  );
}

function CodPanel({ t, onPay }: { t: Function; onPay: () => void }) {
  return (
    <View style={styles.payPanel}>
      <View style={styles.codIconRow}>
        <Text style={{ fontSize: 52 }}>🚴</Text>
      </View>
      <Text style={styles.codTitle}>{t('payment.codTitle')}</Text>
      <Text style={styles.codSubtext}>{t('payment.codSubtext')}</Text>
      <Pressable style={styles.payBtn} onPress={onPay}>
        <Text style={styles.payBtnText}>{t('payment.placeCod')}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.background },
  headerBar: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  backBtn: { width: 40, alignItems: 'flex-start' },
  headerTitle: { fontSize: 18, fontFamily: Fonts.black, color: Colors.white },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.accent,
    gap: 0,
  },
  stepDot: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepDotActive: { backgroundColor: Colors.primary },
  stepDotText: { fontSize: 14, fontFamily: Fonts.black, color: Colors.white },
  stepLine: { width: 60, height: 3, backgroundColor: Colors.accent, marginHorizontal: 4 },
  stepLineActive: { backgroundColor: Colors.primary },
  scroll: { flex: 1 },
  scrollContent: { padding: 18, paddingBottom: 40 },
  sectionTitle: {
    fontSize: 20,
    fontFamily: Fonts.black,
    color: Colors.text,
    marginBottom: 18,
  },
  fieldWrap: { marginBottom: 14 },
  fieldLabel: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.text,
    marginBottom: 6,
  },
  input: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 15,
    fontFamily: Fonts.regular,
    color: Colors.text,
  },
  inputError: { borderColor: '#E53935' },
  errorText: { fontSize: 11, fontFamily: Fonts.regular, color: '#E53935', marginTop: 4 },
  selectInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectValue: { fontSize: 15, fontFamily: Fonts.regular, color: Colors.text },
  selectPlaceholder: { fontSize: 15, fontFamily: Fonts.regular, color: Colors.textMuted },
  disclaimer: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    textAlign: 'center',
    marginVertical: 16,
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  primaryBtnText: { fontSize: 16, fontFamily: Fonts.black, color: Colors.white },
  // ZeroPay
  zeroPayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  zeroPayTitle: { fontSize: 22, fontFamily: Fonts.black, color: Colors.text },
  zeroPaySubtitle: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.textMuted,
    marginBottom: 2,
  },
  zeroPayPowered: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginBottom: 20,
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: Colors.accent,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 11,
    alignItems: 'center',
  },
  tabActive: { backgroundColor: Colors.white },
  tabText: { fontSize: 13, fontFamily: Fonts.semiBold, color: Colors.textMuted },
  tabTextActive: { color: Colors.primary, fontFamily: Fonts.black },
  payPanel: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    marginBottom: 16,
  },
  payPanelLabel: {
    fontSize: 13,
    fontFamily: Fonts.bold,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  upiIdBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    padding: 12,
    marginBottom: 18,
  },
  upiIdText: { fontSize: 16, fontFamily: Fonts.bold, color: Colors.primary },
  qrBox: { alignItems: 'center', marginBottom: 18 },
  qrLabel: {
    fontSize: 12,
    fontFamily: Fonts.regular,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  qrSquare: {
    width: 140,
    height: 140,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qrZero: { fontSize: 36, fontFamily: Fonts.black, color: Colors.primary },
  payingText: {
    fontSize: 14,
    fontFamily: Fonts.bold,
    color: Colors.textMuted,
    textAlign: 'center',
    marginBottom: 14,
  },
  payBtn: {
    backgroundColor: '#43A047',
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: 'center',
  },
  payBtnText: { fontSize: 16, fontFamily: Fonts.black, color: Colors.white },
  // Card
  cardVisual: {
    backgroundColor: Colors.primary,
    borderRadius: 16,
    padding: 20,
    marginBottom: 18,
  },
  cardBrandText: { fontSize: 14, fontFamily: Fonts.bold, color: 'rgba(255,255,255,0.8)', marginBottom: 20 },
  cardNumberText: { fontSize: 20, fontFamily: Fonts.black, color: Colors.white, letterSpacing: 3, marginBottom: 20 },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  cardMeta: { fontSize: 10, fontFamily: Fonts.regular, color: 'rgba(255,255,255,0.6)', marginBottom: 2 },
  cardValue: { fontSize: 13, fontFamily: Fonts.bold, color: Colors.white },
  // COD
  codIconRow: { alignItems: 'center', marginBottom: 12 },
  codTitle: { fontSize: 18, fontFamily: Fonts.black, color: Colors.text, textAlign: 'center', marginBottom: 8 },
  codSubtext: { fontSize: 14, fontFamily: Fonts.regular, color: Colors.textMuted, textAlign: 'center', marginBottom: 20 },
  secureNote: {
    fontSize: 13,
    fontFamily: Fonts.semiBold,
    color: '#43A047',
    textAlign: 'center',
    marginTop: 4,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontFamily: Fonts.black,
    color: Colors.text,
    marginBottom: 14,
    textAlign: 'center',
  },
  stateOption: { paddingVertical: 13, borderBottomWidth: 1, borderBottomColor: Colors.accent },
  stateOptionText: { fontSize: 15, fontFamily: Fonts.regular, color: Colors.text },
  stateOptionSelected: { color: Colors.primary, fontFamily: Fonts.bold },
});
