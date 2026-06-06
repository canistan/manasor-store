import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      showToast: false,
      lastAddedItem: null,
      shippingSettings: null,
      appliedCoupon: null,
      
      fetchShippingSettings: async () => {
        try {
          const res = await fetch('/api/settings');
          if (res.ok) {
            const data = await res.json();
            set({ shippingSettings: data });
          }
        } catch (err) {
          console.error("Kargo ayarları çekilemedi:", err);
        }
      },

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      hideToast: () => set({ showToast: false }),

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.variationId === item.variationId);
        let newItems;
        if (existingItem) {
          newItems = state.items.map(i => 
            i.variationId === item.variationId 
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          );
        } else {
          newItems = [...state.items, item];
        }
        
        get().syncToServer(newItems);

        return { 
          items: newItems,
          lastAddedItem: item,
          showToast: true
        };
      }),

      removeItem: (variationId) => set((state) => {
        const newItems = state.items.filter(i => i.variationId !== variationId);
        get().syncToServer(newItems);
        return { items: newItems };
      }),

      updateQuantity: (variationId, quantity) => set((state) => {
        const newItems = state.items.map(i => 
          i.variationId === variationId ? { ...i, quantity } : i
        );
        get().syncToServer(newItems);
        return { items: newItems };
      }),

      clearCart: () => {
        set({ items: [] });
        get().syncToServer([]);
      },

      setCart: (items) => {
        set({ items });
      },

      syncToServer: async (itemsToSync) => {
        // Sepette değişiklik olduğunda DB ile senkronize etmek için fire-and-forget çağrı yaparız.
        // Sadece kullanıcı giriş yapmışsa başarılı olur, yapmamışsa 401 döner, sorun değil.
        try {
          await fetch('/api/customers/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart: itemsToSync }),
          });
        } catch (e) {
          // ignore error
        }
      },

      getCartTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
      getCartWeight: () => {
        const state = get();
        return state.items.reduce((total, item) => total + ((item.weight_kg || 0) * item.quantity), 0);
      },

      getShippingTotal: () => {
        const state = get();
        if (state.appliedCoupon && state.appliedCoupon.discountType === 'free_shipping') {
          return 0;
        }

        const total = state.getCartTotal();
        const weight = state.getCartWeight();
        const settings = state.shippingSettings || {
          freeShippingThreshold: 1500,
          shippingRules: [
            { minWeight: 0, maxWeight: 5, price: 79.90 },
            { minWeight: 5, maxWeight: 15, price: 119.90 },
            { minWeight: 15, maxWeight: 999, price: 159.90 }
          ]
        };

        if (total >= settings.freeShippingThreshold) {
          return 0;
        }

        const rule = settings.shippingRules.find(
          r => weight >= r.minWeight && weight < r.maxWeight
        );

        return rule ? rule.price : 159.90; // Kural bulunamazsa varsayılan
      },

      getDiscountAmount: () => {
        const state = get();
        const { appliedCoupon } = state;
        if (!appliedCoupon) return 0;
        
        const cartTotal = state.getCartTotal();
        
        if (appliedCoupon.discountType === 'percentage') {
          return cartTotal * (appliedCoupon.discountValue / 100);
        } else if (appliedCoupon.discountType === 'fixed_amount') {
          return Math.min(cartTotal, appliedCoupon.discountValue);
        } else if (appliedCoupon.discountType === 'free_shipping') {
          return 0; // Kargo adımında sıfırlanacak
        }
        return 0;
      },
      
      getDiscountedTotal: () => {
        const state = get();
        const total = state.getCartTotal();
        const discount = state.getDiscountAmount();
        return Math.max(0, total - discount);
      },

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),
      
      getCartCount: () => {
        const state = get();
        return state.items.reduce((count, item) => count + item.quantity, 0);
      }
    }),
    {
      name: 'manasor-cart',
    }
  )
);
