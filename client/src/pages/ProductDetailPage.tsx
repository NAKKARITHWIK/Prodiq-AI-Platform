import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Product, ProductSpecs } from '../types';
import { productService } from '../services/apiService';
import { useWishlist } from '../context/WishlistContext';
import { ExplainableScoreReport } from '../components/ExplainableScoreReport';
import { SellerTrustBadge } from '../components/SellerTrustBadge';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { ProductCard } from '../components/ProductCard';
import {
  ArrowLeft,
  Heart,
  Star,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  Store,
  Award,
  Clock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

// Simulated Marketplace Generator based on base DB price
const generateMarketplaces = (basePrice: number) => {
  return [
    { name: 'Amazon', price: basePrice, rating: 4.8, delivery: 1, trust: 98, availability: 'In Stock', badge: 'Best Overall' },
    { name: 'Flipkart', price: basePrice - (basePrice * 0.02), rating: 4.6, delivery: 2, trust: 94, availability: 'In Stock', badge: 'Lowest Price' },
    { name: 'Croma', price: basePrice + (basePrice * 0.05), rating: 4.7, delivery: 1, trust: 96, availability: 'Low Stock', badge: 'Fastest Delivery' },
    { name: 'Reliance Digital', price: basePrice + (basePrice * 0.03), rating: 4.5, delivery: 3, trust: 92, availability: 'In Stock', badge: null },
    { name: 'Vijay Sales', price: basePrice, rating: 4.6, delivery: 2, trust: 93, availability: 'Out of Stock', badge: null },
  ];
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { wishlistIds, toggleWishlist } = useWishlist();
  const isWishlisted = product ? wishlistIds.includes(product.id) : false;

  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);

  const fetchProductDetails = async (productId: string) => {
    try {
      setLoading(true);
      const data = await productService.getProductById(productId);
      setProduct(data.product);
      setSimilarProducts(data.similarProducts || []);
    } catch (err) {
      console.error('Failed to load product details:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!product) return;
    try {
      await toggleWishlist(product.id);
    } catch (err) {
      console.error('Wishlist error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
          <Loader2 className="h-10 w-10 animate-spin text-indigo-500 mx-auto" />
          <p className="text-sm text-slate-400">Loading AI Product Intelligence Report...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
          <p className="text-base text-slate-300">Product intelligence data not found.</p>
          <Link to="/dashboard" className="px-4 py-2 bg-indigo-600 rounded-xl text-xs font-semibold text-white inline-block">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const specs: ProductSpecs = JSON.parse(product.specsJson || '{}');
  const offers: string[] = JSON.parse(product.offersJson || '[]');
  const marketplaces = generateMarketplaces(product.price);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fadeIn">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Intelligence Dashboard</span>
          </Link>

          <button
            onClick={handleToggleWishlist}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center space-x-2 transition-all cursor-pointer ${
              isWishlisted
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-400'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{isWishlisted ? 'Saved to Favorites' : 'Save Report'}</span>
          </button>
        </div>

        {/* Intelligence Report Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-4 glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6">
            <div className="w-full h-80 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800/80 flex items-center justify-center p-4 group">
              <img
                src={product.image}
                alt={product.title}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Right Column: Title, Ratings, Pricing, Specs Table */}
          <div className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center space-x-1">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Product Intelligence Report</span>
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-900 border border-slate-800 text-slate-400">
                  {product.category}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">{product.brand}</span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">{product.title}</h1>
              </div>

              {/* Rating Bar */}
              <div className="flex items-center space-x-3 text-xs">
                <div className="flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg font-bold">
                  <Star className="h-3.5 w-3.5 fill-amber-400" />
                  <span>{product.rating} / 5.0 Aggregated</span>
                </div>
                <span className="text-slate-400">({product.reviewCount.toLocaleString('en-IN')} Analyzed Reviews)</span>
              </div>

              {/* Baseline Price & Compare Action */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-400">Median Market Price</div>
                  <div className="text-3xl font-black text-white">
                    ₹{product.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <button
                  onClick={() => navigate('/dashboard', { state: { preSelectedProduct: product } })}
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer"
                >
                  <Layers className="h-4 w-4" />
                  <span>Compare This Product</span>
                </button>
              </div>

              {/* Technical Specifications Grid */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Technical Specifications</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {Object.entries(specs).map(([key, val]) => (
                    <div key={key} className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
                      <span className="text-[10px] text-slate-500 block capitalize">{key}</span>
                      <span className="font-semibold text-slate-200 truncate block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Marketplace Intelligence Simulated Data */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Store className="h-5 w-5 text-indigo-400" />
              <span>Marketplace Intelligence Comparison</span>
            </h3>
            <span className="text-xs text-slate-400">Live prices simulated for demonstration</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="pb-3 font-semibold">Marketplace</th>
                  <th className="pb-3 font-semibold">Price</th>
                  <th className="pb-3 font-semibold">Delivery</th>
                  <th className="pb-3 font-semibold">Availability</th>
                  <th className="pb-3 font-semibold">Seller Trust</th>
                  <th className="pb-3 font-semibold">AI Recommendation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                {marketplaces.map((m) => (
                  <tr key={m.name} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-4 font-semibold text-white flex items-center space-x-2">
                      <span>{m.name}</span>
                    </td>
                    <td className="py-4 font-bold text-slate-200">₹{m.price.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</td>
                    <td className="py-4 text-slate-300">{m.delivery} Day{m.delivery > 1 ? 's' : ''}</td>
                    <td className="py-4">
                      {m.availability === 'In Stock' ? (
                        <span className="flex items-center space-x-1 text-emerald-400 text-xs">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>In Stock</span>
                        </span>
                      ) : m.availability === 'Low Stock' ? (
                        <span className="flex items-center space-x-1 text-amber-400 text-xs">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Low Stock</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-rose-400 text-xs">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      <div className="w-full bg-slate-800 rounded-full h-1.5 max-w-[80px]">
                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${m.trust}%` }}></div>
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">{m.trust}% Trust Score</div>
                    </td>
                    <td className="py-4">
                      {m.badge && (
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold border ${
                          m.badge === 'Best Overall' ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' :
                          m.badge === 'Lowest Price' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
                          'bg-amber-500/20 text-amber-300 border-amber-500/30'
                        }`}>
                          {m.badge}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Explainable AI Ranking Breakdown */}
        <ExplainableScoreReport product={product} />

        {/* Price History Chart */}
        <PriceHistoryChart product1={product} />

        {/* Customer Review Sentiment Pros/Cons */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-indigo-400" />
              <span>AI Review Sentiment Analysis</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-emerald-400">
                  <ThumbsUp className="h-4 w-4" />
                  <span>Key Customer Praise (Pros)</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Superb multi-core computing power and thermal performance</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>High color accuracy display suitable for video editing</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Long battery autonomy during heavy development workloads</span>
                  </li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                <div className="flex items-center space-x-2 text-xs font-bold text-rose-400">
                  <ThumbsDown className="h-4 w-4" />
                  <span>Customer Criticisms (Cons)</span>
                </div>
                <ul className="space-y-1 text-xs text-slate-300">
                  <li className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Higher initial investment cost compared to entry-level options</span>
                  </li>
                  <li className="flex items-center space-x-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
                    <span>Non-upgradable unified memory structure</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Similar Products Carousel */}
        {similarProducts.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-white">Compare Similar Intelligence Reports</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
