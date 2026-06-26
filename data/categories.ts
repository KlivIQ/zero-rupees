export type Category = {
  id: string;
  label: string;
  emoji: string;
};

export const categories: Category[] = [
  { id: 'all', label: 'All Products', emoji: '🛍️' },
  { id: 'jewellery', label: 'Jewellery & Gold', emoji: '💍' },
  { id: 'luxury-cars', label: 'Luxury Cars', emoji: '🚗' },
  { id: 'property', label: 'Property & Land', emoji: '🏠' },
  { id: 'electronics', label: 'Electronics', emoji: '📱' },
  { id: 'audio-entertainment', label: 'Audio & Entertainment', emoji: '🔊' },
  { id: 'home-kitchen', label: 'Home & Kitchen', emoji: '🍳' },
  { id: 'interiors-furniture', label: 'Interiors & Furniture', emoji: '🛋️' },
  { id: 'travel', label: 'Travel & Experiences', emoji: '✈️' },
  { id: 'diamonds', label: 'Diamonds', emoji: '💎' },
  { id: 'yachts-jets', label: 'Yachts & Jets', emoji: '🛥️' },
  { id: 'absurd', label: 'Absurd Gifts', emoji: '🎁' },
  { id: 'estates-farms', label: 'Estates & Farms', emoji: '🌿' },
];
