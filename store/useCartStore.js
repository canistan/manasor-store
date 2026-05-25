import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      
      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      addItem: (item) => set((state) => {
        const existingItem = state.items.find(i => i.variationId === item.variationId);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.variationId === item.variationId 
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            ),
            isDrawerOpen: true
          };
        }
        return { 
          items: [...state.items, item],
          isDrawerOpen: true 
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
