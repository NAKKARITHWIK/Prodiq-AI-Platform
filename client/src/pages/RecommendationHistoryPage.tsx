import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { RecommendationHistoryEntry } from '../types';
import { historyService } from '../services/apiService';
import { History, Search, Trash2, ArrowRight, Calendar, Sparkles, Loader2 } from 'lucide-react';

export const RecommendationHistoryPage: React.FC = () => {
  const [history, setHistory] = useState<RecommendationHistoryEntry[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchHistory();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await historyService.getHistory(search);
      setHistory(data);
    } catch (err) {
      console.error('Failed to load recommendation history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await historyService.deleteHistory(id);
      setHistory(history.filter((h) => h.id !== id));
    } catch (err) {
      console.error('Delete history error:', err);
    }
  };

  const handleReopen = (entry: RecommendationHistoryEntry) => {
    navigate(`/compare?p1=${entry.product1Id}&p2=${entry.product2Id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6 animate-fadeIn">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <History className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">AI Recommendation History</h1>
              <p className="text-xs text-slate-400">Search and reopen past Gemini AI synthesis reports stored in database</p>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search past product comparisons..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* History List */}
        {loading ? (
          <div className="py-24 text-center space-y-3">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
            <p className="text-xs text-slate-400">Loading recommendation history...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="py-16 text-center glass-panel rounded-3xl border border-slate-800 space-y-3 max-w-md mx-auto">
            <History className="h-10 w-10 text-slate-600 mx-auto" />
            <h3 className="text-sm font-bold text-white">No Recommendation History Found</h3>
            <p className="text-xs text-slate-400">Compare products to save AI recommendations automatically.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((h) => (
              <div
                key={h.id}
                onClick={() => handleReopen(h)}
                className="p-5 rounded-2xl glass-card hover:bg-slate-900/90 border border-slate-800 hover:border-indigo-500/40 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded-full font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>Gemini Recommendation</span>
                    </span>
                    <span className="text-slate-500 text-[11px] flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>{new Date(h.createdAt).toLocaleDateString()}</span>
                    </span>
                  </div>

                  <div className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">
                    {h.product1?.title} <span className="text-slate-500 font-normal">vs</span> {h.product2?.title}
                  </div>

                  {h.result?.whyRankedFirst && (
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed max-w-3xl">
                      "{h.result.whyRankedFirst}"
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                  <button
                    onClick={(e) => handleDelete(h.id, e)}
                    className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors cursor-pointer"
                    title="Delete record"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  <div className="px-3 py-1.5 rounded-xl bg-indigo-600 group-hover:bg-indigo-500 text-white text-xs font-bold transition-colors flex items-center space-x-1">
                    <span>Reopen Report</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
