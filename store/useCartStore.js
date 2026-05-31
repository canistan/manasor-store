import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      showToast: false,
      lastAddedItem: null,
      
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),
      hideToast: () => set({ showToast: false }),

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.variationId === item.variationId);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.variationId === item.variationId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            lastAddedItem: item,
            showToast: true
          };
        }
        return { 
          items: [...state.items, item],
          lastAddedItem: item,
          showToast: true
        };
      }),

      removeItem: (variationId) => set((state) => ({
        items: state.items.filter(i => i.variationId !== variationId)
      })),

      updateQuantity: (variationId, quantity) => set((state) => ({
        items: state.items.map(i => 
          i.variationId === variationId ? { ...i, quantity } : i
        )
      })),

      clearCart: () => set({ items: [] }),

      getCartTotal: () => {
        const state = get();
        return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
      
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
