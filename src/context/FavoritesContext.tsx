import React, { createContext, useContext, useMemo, useState } from "react";
import { getFavorites, saveFavorites } from "../lib/storage";

type Ctx = {
  favorites: Set<string>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const FavoritesCtx = createContext<Ctx | null>(null);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<Set<string>>(() => getFavorites());

  const api = useMemo<Ctx>(() => ({
    favorites,
    isFavorite: (id) => favorites.has(id),
    toggleFavorite: (id) => {
      setFavorites(prev => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        saveFavorites(next);
        return next;
      });
    }
  }), [favorites]);

  return <FavoritesCtx.Provider value={api}>{children}</FavoritesCtx.Provider>;
};

export function useFavorites() {
  const ctx = useContext(FavoritesCtx);
  if (!ctx) throw new Error("useFavorites must be used within FavoritesProvider");
  return ctx;
}
