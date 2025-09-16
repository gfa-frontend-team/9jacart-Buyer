import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";

export interface WishlistItem {
  id: string;
  product: Product;
  addedAt: Date;
}

interface WishlistStore {
  items: WishlistItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearWishlist: () => void;
  isItemInWishlist: (productId: string) => boolean;
  getTotalItems: () => number;
  getItemById: (productId: string) => WishlistItem | undefined;
  moveToCart: (
    productId: string,
    addToCartFn: (product: Product) => void
  ) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            return state; // Item already exists, don't add duplicate
          }

          const newItem: WishlistItem = {
            id: product.id,
            product,
            addedAt: new Date(),
          };

          return {
            items: [...state.items, newItem],
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      clearWishlist: () => set({ items: [] }),

      isItemInWishlist: (productId: string) => {
        return get().items.some((item) => item.product.id === productId);
      },

      getTotalItems: () => {
        return get().items.length;
      },

      getItemById: (productId: string) => {
        return get().items.find((item) => item.product.id === productId);
      },

      moveToCart: (
        productId: string,
        addToCartFn: (product: Product) => void
      ) => {
        const item = get().getItemById(productId);
        if (item) {
          addToCartFn(item.product);
          get().removeItem(productId);
        }
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
