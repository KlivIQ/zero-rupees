import { create } from 'zustand';

export type CartItem = {
  productId: string;
  name: string;
  fakePrice: number;
  quantity: number;
};

export type LastOrder = {
  orderId: string;
  items: CartItem[];
  totalFakePrice: number;
  paymentMethod: 'upi' | 'card' | 'cod';
  customerName: string;
};

type CartStore = {
  items: CartItem[];
  lastOrder: LastOrder | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalFakePrice: () => number;
  placeOrder: (paymentMethod: 'upi' | 'card' | 'cod', customerName: string) => string;
};

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  lastOrder: null,

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.productId === item.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === item.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((i) => i.productId !== productId),
    })),

  updateQuantity: (productId, delta) =>
    set((state) => {
      const updated = state.items
        .map((i) =>
          i.productId === productId
            ? { ...i, quantity: i.quantity + delta }
            : i
        )
        .filter((i) => i.quantity > 0);
      return { items: updated };
    }),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalFakePrice: () =>
    get().items.reduce((sum, i) => sum + i.fakePrice * i.quantity, 0),

  placeOrder: (paymentMethod, customerName) => {
    const state = get();
    const orderId = `ZR-FAKE-${Math.floor(10000 + Math.random() * 90000)}`;
    const order: LastOrder = {
      orderId,
      items: [...state.items],
      totalFakePrice: state.totalFakePrice(),
      paymentMethod,
      customerName,
    };
    set({ lastOrder: order, items: [] });
    return orderId;
  },
}));
