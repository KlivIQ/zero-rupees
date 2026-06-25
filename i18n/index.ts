import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '@/locales/en/translation.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const empty: any = {};

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: empty },
    ta: { translation: empty },
    te: { translation: empty },
    mr: { translation: empty },
    bn: { translation: empty },
    gu: { translation: empty },
    kn: { translation: empty },
    ml: { translation: empty },
  },
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
