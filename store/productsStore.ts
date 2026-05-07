/**
 * CACHING STRATEGY:
 * Products list is cached per unique combination of (search, category, page).
 * Categories list is cached indefinitely (rarely changes).
 * Single product views are cached by ID.
 * WHY: Product grids are expensive to render; avoiding refetches keeps the UI snappy.
 */

import { create } from "zustand";
import { Product } from "@/types";

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  data: Product[];
  total: number;
  timestamp: number;
}

interface ProductsState {
  products: Product[];
  total: number;
  currentProduct: Product | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  cache: Record<string, CacheEntry>;
  productCache: Record<number, Product>;

  fetchProducts: (params: {
    limit: number;
    skip: number;
    search?: string;
    category?: string;
  }) => Promise<void>;
  fetchProductById: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  clearCurrentProduct: () => void;
}

const isCacheValid = (entry: CacheEntry) =>
  Date.now() - entry.timestamp < CACHE_TTL_MS;

export const useProductsStore = create<ProductsState>((set, get) => ({
  products: [],
  total: 0,
  currentProduct: null,
  categories: [],
  loading: false,
  error: null,
  cache: {},
  productCache: {},

  fetchProducts: async ({ limit, skip, search = "", category = "" }) => {
    const cacheKey = `${search}-${category}-${skip}`;
    const cached = get().cache[cacheKey];

    if (cached && isCacheValid(cached)) {
      set({ products: cached.data, total: cached.total });
      return;
    }

    set({ loading: true, error: null });
    try {
      let url: string;
      if (search) {
        url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
      } else if (category) {
        url = `https://dummyjson.com/products/category/${encodeURIComponent(category)}?limit=${limit}&skip=${skip}`;
      } else {
        url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch products");

      const json = await res.json();
      const entry: CacheEntry = {
        data: json.products,
        total: json.total,
        timestamp: Date.now(),
      };

      set((state) => ({
        products: json.products,
        total: json.total,
        loading: false,
        cache: { ...state.cache, [cacheKey]: entry },
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  fetchProductById: async (id) => {
    // Check single-product cache
    const cached = get().productCache[id];
    if (cached) {
      set({ currentProduct: cached });
      return;
    }

    set({ loading: true, error: null, currentProduct: null });
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      if (!res.ok) throw new Error("Product not found");
      const product: Product = await res.json();

      set((state) => ({
        currentProduct: product,
        loading: false,
        productCache: { ...state.productCache, [id]: product },
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },

  fetchCategories: async () => {
    if (get().categories.length > 0) return; // Already loaded
    try {
      const res = await fetch("https://dummyjson.com/products/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      // API returns array of { slug, name, url } objects
      const names = data.map((c: any) => (typeof c === "string" ? c : c.slug));
      set({ categories: names });
    } catch {
      // silently fail — categories are optional
    }
  },

  clearCurrentProduct: () => set({ currentProduct: null }),
}));
