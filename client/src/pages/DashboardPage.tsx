import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Product, UserPreference, MultiFacetFilterParams } from '../types';
import { productService, profileService } from '../services/apiService';
import { ProductCard } from '../components/ProductCard';
import { UserPreferenceModal } from '../components/UserPreferenceModal';
import { VisionUploadModal } from '../components/VisionUploadModal';
import { AdvancedFilterDrawer } from '../components/AdvancedFilterDrawer';
import { SkeletonCard } from '../components/SkeletonCard';
import { EmptyState } from '../components/EmptyState';
import {
  Search,
  SlidersHorizontal,
  Camera,
  X,
  ArrowRight,
  UserCheck,
  Filter,
  Activity,
  TrendingUp,
  Zap,
  Scale
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<UserPreference | null>(null);

  // Multi-facet Filter State
  const [filters, setFilters] = useState<MultiFacetFilterParams>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Selected Products for Comparison Bar - Persisted in sessionStorage to fix the selection loop
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(() => {
    const saved = sessionStorage.getItem('prodiq_compare');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep sessionStorage in sync
  useEffect(() => {
    sessionStorage.setItem('prodiq_compare', JSON.stringify(selectedProducts));
  }, [selectedProducts]);

  // Modals & Drawers State
  const [isPreferenceModalOpen, setIsPreferenceModalOpen] = useState(false);
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const categories = [
    { id: 'ALL', label: 'All Intelligence' },
    { id: 'LAPTOP', label: 'Laptops' },
    { id: 'SMARTPHONE', label: 'Smartphones' },
    { id: 'MONITOR', label: 'Monitors' },
    { id: 'HEADPHONES', label: 'Headphones' },
  ];

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (location.state?.preSelectedProduct) {
      const p = location.state.preSelectedProduct;
      setSelectedProducts(prev => {
        if (!prev.find(existing => existing.id === p.id)) {
          if (prev.length >= 2) return [prev[1], p];
          return [...prev, p];
        }
        return prev;
      });
      // Clear the state using React Router to avoid re-triggering
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, location.pathname, navigate]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchProducts();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeCategory, filters]);

  const fetchProfile = async () => {
    try {
      const prof = await profileService.getProfile();
      setUserProfile(prof);
    } catch (err) {
      console.error('Failed to fetch user preference profile:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params: MultiFacetFilterParams = {
        ...filters,
        q: searchQuery || undefined,
        category: activeCategory === 'ALL' ? filters.category : activeCategory,
      };
      const data = await productService.getProducts(params);
      setProducts(data.products);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSelectProduct = (product: Product) => {
    const exists = selectedProducts.some((p) => p.id === product.id);
    if (exists) {
      setSelectedProducts(selectedProducts.filter((p) => p.id !== product.id));
    } else {
      if (selectedProducts.length >= 2) {
        // Limit selection to 2 products
        setSelectedProducts([selectedProducts[1], product]);
      } else {
        setSelectedProducts([...selectedProducts, product]);
      }
    }
  };

  const handleLaunchComparison = () => {
    if (selectedProducts.length === 2) {
      navigate(`/compare?p1=${selectedProducts[0].id}&p2=${selectedProducts[1].id}`);
    }
  };

  const handleResetFilters = () => {
    setFilters({});
    setSearchQuery('');
    setActiveCategory('ALL');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-32">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 space-y-16 animate-fadeIn">
        
        {/* Intelligence Hero Section */}
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-4">
            <Zap className="h-4 w-4" />
            <span>AI Product Intelligence & Comparison Platform</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Make Intelligent <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-indigo-500">
              Purchasing Decisions
            </span>
          </h1>
          
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl leading-relaxed">
            Compare products, analyze prices across marketplaces, and get personalized AI recommendations. We do the research so you don't have to.
          </p>

          {/* Massive Search Bar */}
          <div className="w-full relative group">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all"></div>
            <div className="relative flex items-center w-full bg-slate-900 border-2 border-slate-800 focus-within:border-indigo-500 rounded-full overflow-hidden shadow-2xl transition-all h-16 sm:h-20">
              <Search className="absolute left-6 h-6 w-6 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    document.getElementById('intelligence-dashboard')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                placeholder="Search any product or compare two products..."
                className="w-full h-full pl-16 pr-16 bg-transparent text-lg sm:text-xl text-white placeholder:text-slate-500 focus:outline-none"
              />
              <div className="absolute right-3 flex items-center space-x-2">
                <button
                  onClick={() => setIsVisionModalOpen(true)}
                  className="p-3 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Image-based Product Search"
                >
                  <Camera className="h-5 w-5 text-purple-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => {
                // Focus search or scroll to products
                document.getElementById('intelligence-dashboard')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-6 py-3 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Scale className="h-5 w-5" />
              <span>Compare Products</span>
            </button>
            <button
              onClick={() => setIsPreferenceModalOpen(true)}
              className="px-6 py-3 rounded-2xl text-sm font-bold bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <UserCheck className="h-5 w-5 text-slate-400" />
              <span>Configure AI Persona: {userProfile?.profileType || 'DEVELOPER'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Widgets Section */}
        <div id="intelligence-dashboard" className="space-y-8 pt-8 border-t border-slate-800/60">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <Activity className="h-6 w-6 text-indigo-400" />
              <h2 className="text-2xl font-bold text-white tracking-tight">Intelligence Dashboard</h2>
            </div>
            
            {/* Multi-Facet Filters */}
            <div className="flex items-center space-x-3">
               <button
                onClick={() => setIsFilterDrawerOpen(true)}
                className="px-4 py-2.5 rounded-2xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 transition-colors flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Filter className="h-4 w-4 text-indigo-400" />
                <span>Advanced Analysis Filters</span>
                {Object.keys(filters).length > 0 && (
                  <span className="h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                )}
              </button>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-800/80">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* AI Recommended Products / Search Results */}
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-red-400" />
              <h3 className="text-lg font-semibold text-slate-200">
                {searchQuery ? 'Analysis Results' : 'AI Recommended for You'}
              </h3>
            </div>
            
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <EmptyState onReset={handleResetFilters} />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => {
                  const isSelected = selectedProducts.some((p) => p.id === product.id);
                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isSelected={isSelected}
                      onToggleSelect={handleToggleSelectProduct}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

      </main>

      {/* Floating Selection Counter & Compare Launcher Bar */}
      {selectedProducts.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-slideUp">
          <div className="glass-panel p-4 rounded-3xl border border-indigo-500/40 shadow-2xl flex items-center justify-between bg-slate-900/95">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2 overflow-hidden">
                {selectedProducts.map((p) => (
                  <img
                    key={p.id}
                    src={p.image}
                    alt={p.title}
                    className="inline-block h-10 w-10 rounded-full ring-2 ring-indigo-500 bg-slate-950 object-contain p-1"
                  />
                ))}
              </div>
              <div>
                <div className="text-xs font-bold text-white">
                  {selectedProducts.length} of 2 Products Selected
                </div>
                <div className="text-[10px] text-slate-400">
                  {selectedProducts.length === 1
                    ? 'Select 1 more product to launch intelligence comparison'
                    : 'Ready for side-by-side AI evaluation'}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSelectedProducts([])}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>

              <button
                disabled={selectedProducts.length < 2}
                onClick={handleLaunchComparison}
                className="px-5 py-2.5 rounded-2xl text-xs font-bold bg-gradient-to-r from-red-700 to-indigo-700 hover:from-red-600 hover:to-indigo-600 text-white disabled:opacity-50 transition-all flex items-center space-x-2 shadow-lg shadow-red-900/30 cursor-pointer"
              >
                <Scale className="h-4 w-4" />
                <span>Launch Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modals & Drawers */}
      {isPreferenceModalOpen && userProfile && (
        <UserPreferenceModal
          preference={userProfile}
          onClose={() => setIsPreferenceModalOpen(false)}
          onSave={async (updated) => {
            await profileService.updateProfile(updated);
            fetchProfile();
          }}
        />
      )}

      {isVisionModalOpen && (
        <VisionUploadModal
          onClose={() => setIsVisionModalOpen(false)}
          onMatchFound={(product) => {
            setSearchQuery(product.title);
            document.getElementById('intelligence-dashboard')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />
      )}

      <AdvancedFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={(newF) => setFilters(newF)}
        onReset={handleResetFilters}
      />
    </div>
  );
};
