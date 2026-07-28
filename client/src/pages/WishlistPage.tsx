import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { wishlistService } from '../services/apiService';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { Heart, Loader2 } from 'lucide-react';

export const WishlistPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const data = await wishlistService.getWishlist();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fadeIn">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-slate-800 pb-6">
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
            <Heart className="h-6 w-6 fill-rose-500" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white">Your Saved Favorites & Wishlist</h1>
            <p className="text-xs text-slate-400">Manage saved hardware options for fast access & intelligence comparison</p>
          </div>
        </div>

        {/* Wishlist Grid */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-rose-500 mx-auto" />
            <p className="text-xs text-slate-400">Loading your saved wishlist items...</p>
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            title="Your Wishlist is Empty"
            description="Browse the product catalog and click the heart icon on any product card to bookmark it here."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
