import React, { useState, useEffect } from 'react';
import { AdminAnalytics } from '../types';
import { adminService } from '../services/apiService';
import {
  Users,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  Activity,
  Loader2,
  BarChart2,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      console.error('Admin Analytics error:', err);
      setError('Forbidden: Administrator authorization required to view platform metrics.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mx-auto" />
          <p className="text-xs text-slate-400">Loading admin analytics dashboard...</p>
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-24 text-center space-y-4">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 w-fit mx-auto">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h2 className="text-lg font-bold text-white">Access Denied</h2>
          <p className="text-xs text-slate-400 max-w-md mx-auto">{error}</p>
        </div>
      </div>
    );
  }

  const COLORS = ['#6366f1', '#a855f7', '#ec4899', '#10b981'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8 animate-fadeIn">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <BarChart2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white">Executive Admin Analytics</h1>
              <p className="text-xs text-slate-400">Real-time platform usage metrics, user registrations & AI requests</p>
            </div>
          </div>

          <div className="px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-1.5">
            <ShieldCheck className="h-4 w-4" />
            <span>Admin Guard Active</span>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Registered Users</span>
              <Users className="h-4 w-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-black text-white">{analytics.totalUsers}</div>
            <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>+100% active retention</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Products Cataloged</span>
              <Package className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-3xl font-black text-white">{analytics.totalProducts}</div>
            <div className="text-[11px] text-purple-400 font-semibold">High-spec electronics</div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Total Product Comparisons</span>
              <Layers className="h-4 w-4 text-pink-400" />
            </div>
            <div className="text-3xl font-black text-white">{analytics.totalComparisons}</div>
            <div className="text-[11px] text-pink-400 font-semibold">Multi-dimensional scoring</div>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-slate-400 text-xs">
              <span>Gemini AI API Calls</span>
              <Sparkles className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-white">{analytics.totalAIRequests}</div>
            <div className="text-[11px] text-amber-400 font-semibold">Gemini 2.5 Flash</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Category Distribution Bar Chart */}
          <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-indigo-400" />
              <span>Products by Category</span>
            </h3>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.topSearchedCategories}>
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Activity Log Panel */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Activity className="h-5 w-5 text-purple-400" />
              <span>Recent System Activity</span>
            </h3>

            <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1 text-xs">
              {analytics.recentEvents.map((evt, idx) => (
                <div key={evt.id || idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-200">{evt.type}</span>
                    <p className="text-[10px] text-slate-400 truncate max-w-[200px]">{evt.metadataJson || 'System Event'}</p>
                  </div>
                  <span className="text-[10px] text-slate-500">{new Date(evt.createdAt).toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
