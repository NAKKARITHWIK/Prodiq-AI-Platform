import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Product } from '../types';
import { useWishlist } from '../context/WishlistContext';
import { SellerTrustBadge } from './SellerTrustBadge';
import { Star, ShieldCheck, Heart, ArrowRight, Check } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onToggleSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected = false,
  onToggleSelect,
}) => {
  const navigate = useNavigate();
  const specs = JSON.parse(product.specsJson || '{}');
  const priceHistory = JSON.parse(product.priceHistoryJson || '[]');

  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.includes(product.id);

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  // Calculate 6-month low discount
  const minHistoricalPrice = priceHistory.length > 0
    ? Math.min(...priceHistory.map((h: any) => h.price))
    : product.price;
  const is6MonthLow = product.price <= minHistoricalPrice;

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className={`glass-card rounded-2xl p-5 flex flex-col justify-between space-y-4 border transition-all duration-300 hover:-translate-y-1 cursor-pointer group relative ${
        isSelected
          ? 'border-indigo-500 bg-indigo-950/20 shadow-xl shadow-indigo-500/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Top Badge Overlay Bar */}
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center space-x-1.5">
          {is6MonthLow && (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1">
              <ShieldCheck className="h-3 w-3" />
              <span>6-Month Low</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-900/90 text-slate-300 border border-slate-800">
            {product.category}
          </span>
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          className={`p-2 rounded-xl transition-colors cursor-pointer ${
            isWishlisted ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-900/80 text-slate-400 hover:text-rose-400'
          }`}
          title="Toggle Wishlist"
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Container */}
      <div className="w-full h-44 rounded-xl overflow-hidden bg-slate-900/50 border border-slate-800/80 flex items-center justify-center p-3 relative">
        <img
          src={product.image}
          alt={product.title}
          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Title & Brand */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="font-semibold text-indigo-400 uppercase tracking-wider">{product.brand}</span>
          <SellerTrustBadge trust={product.sellerTrust} sellerName={product.sellerName} />
        </div>
        <h3 className="text-sm font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
          {product.title}
        </h3>
      </div>

      {/* Key Hardware Specs Chips */}
      <div className="grid grid-cols-2 gap-1.5 py-1">
        {specs.processor && (
          <div className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 truncate">
            <span className="text-slate-500 font-medium">CPU: </span>{specs.processor}
          </div>
        )}
        {specs.ram && (
          <div className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 truncate">
            <span className="text-slate-500 font-medium">RAM: </span>{specs.ram}
          </div>
        )}
        {specs.storage && (
          <div className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 truncate">
            <span className="text-slate-500 font-medium">SSD: </span>{specs.storage}
          </div>
        )}
        {specs.display && (
          <div className="px-2 py-1 rounded-lg bg-slate-900/80 border border-slate-800/80 text-[11px] text-slate-300 truncate">
            <span className="text-slate-500 font-medium">Disp: </span>{specs.display.split(',')[0]}
          </div>
        )}
      </div>

      {/* Pricing & Compare Checkbox Bar */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
        <div>
          <div className="text-[10px] text-slate-400">Best Price</div>
          <div className="flex items-baseline space-x-1.5">
            <span className="text-lg font-extrabold text-white">₹{product.price.toLocaleString('en-IN')}</span>
            <span className="text-[11px] text-slate-500 line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {onToggleSelect ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSelect(product);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {isSelected ? (
              <>
                <Check className="h-3.5 w-3.5" />
                <span>Selected</span>
              </>
            ) : (
              <>
                <span>Compare</span>
              </>
            )}
          </button>
        ) : (
          <Link
            to={`/product/${product.id}`}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
    </div>
  );
};
