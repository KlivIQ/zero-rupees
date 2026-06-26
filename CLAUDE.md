# ZeroRupees — Claude Code Brief

Fake e-commerce "dopamine site". Users browse, add to cart, and fake-checkout without spending real money. India-first audience. Everything costs ₹0.

**Tagline:** Buy Anything. Pay Nothing.
**Brand color:** #C2185B (deep magenta)

---

## Commands

```bash
npm install          # install deps
npm run web          # expo start --web (dev server at localhost:8081)
npm run start        # expo start (with QR code for mobile)
npm run lint         # tsc --noEmit (TypeScript check)
npm run export:web   # expo export --platform web → dist/ (Vercel-ready)
```

---

## Architecture

**Expo SDK 52 + Expo Router 4** (file-based routing under `/app`). Single codebase for web, Android, iOS.

```
app/
  _layout.tsx              root layout — font loading, i18n init, Stack navigator
  index.tsx                homepage — composes all section components
  (catalog)/
    _layout.tsx            catalog route group layout
    index.tsx              full catalog screen (accepts ?category= query param)

components/
  sections/
    Header.tsx             navbar: logo, cart badge, search bar, language selector
    HeroBanner.tsx         headline + "Start Shopping Free" CTA + floating coin animation
    CategoryGrid.tsx       4×2 emoji grid + horizontal filter pills
    FeaturedProducts.tsx   horizontal FlatList of isFeatured products
    ProductCatalogGrid.tsx filterable + sortable vertical 2-col FlatList
    MarqueeStrip.tsx       looping magenta marquee strip
    Footer.tsx             tagline + links + disclaimer
  ui/
    ProductCard.tsx        reusable card: emoji placeholder, struck price, ₹0, Add to Cart
    CategoryPill.tsx       tappable category chip with active state

data/
  products.ts              32 products, type Product
  categories.ts            8 categories, type Category

store/
  cartStore.ts             Zustand v5 cart store

i18n/
  index.ts                 i18next init (all 9 languages registered)

locales/
  en/translation.json      complete English strings
  hi/ ta/ te/ mr/ bn/ gu/ kn/ ml/   empty {} — falls back to English

constants/
  colors.ts                Colors object (all brand tokens)
  fonts.ts                 Nunito font family names

utils/
  formatCurrency.ts        formatINR() — Intl.NumberFormat('en-IN')
```

---

## Key Rules

1. **All prices show struck-through original + ₹0 final.** Cart total is always ₹0. Never compute a real total.
2. **Indian number formatting everywhere** — use `formatINR()` from `utils/formatCurrency.ts`, not manual string building. Produces lakh/crore grouping: `₹49,99,900`.
3. **No raw strings in components** — all UI text uses `const { t } = useTranslation()` and `t('key.path')`. Add new keys to `locales/en/translation.json` first.
4. **No real payment UI** — V1 has no checkout forms, no real transactions.
5. **`FlatList` not `ScrollView + map`** for any list of products (virtualization matters at 30+ items). Never set both `numColumns` and `horizontal` on the same FlatList.

---

## Data Types

```ts
// data/products.ts
type Product = {
  id: string;
  name: string;
  categoryId: string;   // matches Category.id
  fakePrice: number;    // in rupees, e.g. 2800000 = ₹28,00,000
  emoji: string;        // used as image placeholder
  description: string;
  isFeatured: boolean;
};

// data/categories.ts
type Category = {
  id: string;
  label: string;
  emoji: string;
  translationKey: string;
};
```

---

## State Management

```ts
// store/cartStore.ts — Zustand v5
import { create } from 'zustand'; // named export, not default

useCartStore(state => state.addItem({ productId, name, fakePrice }))
useCartStore(state => state.totalItems())  // getter fn, not plain selector
useCartStore(state => state.items)
useCartStore(state => state.clearCart)
```

Cart is in-memory only (no persistence). Refreshing clears it — expected for V1.

---

## i18n

```ts
// All components that render text:
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
<Text>{t('hero.headline')}</Text>

// Change language (dev console):
import i18n from '@/i18n';
i18n.changeLanguage('hi');  // falls back to English since 'hi' is empty {}
```

i18n is initialized in `i18n/index.ts` and imported at the top of `app/_layout.tsx` before any screen renders.

---

## Animation Strategy

| Platform | Approach |
|---|---|
| Native (iOS/Android) | `react-native-reanimated` — `withRepeat`, `withSequence`, `withTiming` |
| Web | CSS `@keyframes` injected via `document.createElement('style')` inside `Platform.OS === 'web'` guard in `_layout.tsx`. Components use `animationName` in style objects. |
| Marquee strip | `Animated.loop` + double-text trick (both platforms) |

---

## Fonts

Nunito via `@expo-google-fonts/nunito`. Loaded in `app/_layout.tsx`:
```ts
useFonts({ Nunito_400Regular, Nunito_600SemiBold, Nunito_700Bold, Nunito_800ExtraBold })
```
Font names are exported from `constants/fonts.ts`. Use `Fonts.bold` etc., never hardcode the string.

---

## Web / Vercel Deployment

`app.json` sets `"web": { "output": "static", "bundler": "metro" }`.

```bash
npm run export:web   # produces dist/
npx serve dist       # test locally
```

Vercel config: build command `npx expo export --platform web`, output directory `dist`. No `vercel.json` needed.

---

## V2 Ideas (not built yet)

- Product detail screen `app/product/[id].tsx`
- Cart screen with fake checkout flow
- Fake order confirmation ("Your Rolls Royce is on the way!")
- Filled Indian language translations
- Persistent cart via `zustand/middleware` `persist` + AsyncStorage
- Search functionality
