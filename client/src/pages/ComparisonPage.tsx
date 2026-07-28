import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { Product, UserPreference } from '../types';
import { productService, profileService, aiService, reportService } from '../services/apiService';
import { ComparisonMatrix } from '../components/ComparisonMatrix';
import { PriceHistoryChart } from '../components/PriceHistoryChart';
import { AIRecommendationPanel } from '../components/AIRecommendationPanel';
import { ArrowLeft, Loader2, RefreshCw, Sparkles, Layers, Bookmark } from 'lucide-react';

export const ComparisonPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const p1Id = searchParams.get('p1');
  const p2Id = searchParams.get('p2');

  const [product1, setProduct1] = useState<Product | null>(null);
  const [product2, setProduct2] = useState<Product | null>(null);
  const [preference, setPreference] = useState<UserPreference | null>(null);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!p1Id || !p2Id) {
      navigate('/dashboard');
      return;
    }
    fetchComparisonData();
  }, [p1Id, p2Id]);

  const fetchComparisonData = async () => {
    try {
      setLoading(true);
      setError('');
      const [res1, res2, pref, aiRes] = await Promise.all([
        productService.getProductById(p1Id!),
        productService.getProductById(p2Id!),
        profileService.getProfile(),
        aiService.getRecommendation(p1Id!, p2Id!),
      ]);

      setProduct1(res1.product);
      setProduct2(res2.product);
      setPreference(pref);
      setAiRecommendation(aiRes);
    } catch (err: any) {
      console.error('Failed to load comparison data:', err);
      setError('Could not load target products for comparison. Please try re-selecting from the catalog.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-300">Computing deterministic multi-metric comparison...</p>
        </div>
      </div>
    );
  }

  if (error || !product1 || !product2) {
    return (
      <div className="glass-card p-12 text-center rounded-3xl max-w-xl mx-auto space-y-4">
        <p className="text-sm text-red-400 font-semibold">{error || 'Invalid product parameters.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          to="/dashboard"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Product Catalog</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={async () => {
              if (product1 && product2) {
                try {
                  await reportService.createReport({
                    title: `${product1.brand} ${product1.title.split(' ')[1] || ''} vs ${product2.brand} ${product2.title.split(' ')[1] || ''}`,
                    product1Id: product1.id,
                    product2Id: product2.id,
                  });
                  alert('Intelligence Report Saved Successfully!');
                } catch (err) {
                  console.error('Failed to save report:', err);
                }
              }
            }}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Bookmark className="h-3.5 w-3.5" />
            <span>Save Intelligence Report</span>
          </button>

          <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 text-xs font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Multi-Dimensional Analytics Active</span>
          </div>
        </div>
      </div>

      {/* Gemini AI Explainable Recommendation Panel */}
      {aiRecommendation && (
        <AIRecommendationPanel
          recommendation={aiRecommendation}
          product1={product1}
          product2={product2}
        />
      )}

      {/* Main Side-by-Side Comparison Matrix */}
      <ComparisonMatrix product1={product1} product2={product2} preference={preference} />

      {/* Recharts Price History Analytics Chart */}
      <PriceHistoryChart product1={product1} product2={product2} />
    </div>
  );
};
