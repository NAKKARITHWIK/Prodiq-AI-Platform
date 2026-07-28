import React, { createContext, useContext, useState, useEffect } from 'react';
import { wishlistService } from '../services/apiService';
import { useAuth } from './AuthContext';

interface WishlistContextType {
  wishlistIds: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistIds();
    } else {
      setWishlistIds([]);
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  const fetchWishlistIds = async () => {
    try {
      setIsLoading(true);
      const ids = await wishlistService.getWishlistIds();
      setWishlistIds(ids);
    } catch (err) {
      console.error('Failed to fetch wishlist IDs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    try {
      const res = await wishlistService.toggleWishlist(productId);
      if (res.isWishlisted) {
        setWishlistIds((prev) => [...prev, productId]);
      } else {
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      }
      return res.isWishlisted;
    } catch (err) {
      console.error('Wishlist toggle error:', err);
      throw err;
    }
  };

  return (
    <WishlistContext.Provider value={{ wishlistIds, toggleWishlist, isLoading }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
