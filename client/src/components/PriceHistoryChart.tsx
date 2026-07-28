import React from 'react';
import { Product, PriceHistoryItem } from '../types';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';
import { TrendingDown, DollarSign } from 'lucide-react';

interface Props {
  product1: Product;
  product2?: Product;
}

export const PriceHistoryChart: React.FC<Props> = ({ product1, product2 }) => {
  const history1: PriceHistoryItem[] = JSON.parse(product1.priceHistoryJson || '[]');
  const history2: PriceHistoryItem[] = product2 ? JSON.parse(product2.priceHistoryJson || '[]') : [];

  // Combine monthly price trend data
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const chartData = months.map((month) => {
    const item1 = history1.find((h) => h.month === month);
    const item2 = history2.find((h) => h.month === month);

    const row: any = {
      month,
      [product1.title]: item1 ? item1.price : product1.price,
    };
    if (product2) {
      row[product2.title] = item2 ? item2.price : product2.price;
    }
    return row;
  });

  // Calculate statistics for product 1
  const prices1 = history1.map((h) => h.price);
  const min1 = prices1.length > 0 ? Math.min(...prices1) : product1.price;
  const max1 = prices1.length > 0 ? Math.max(...prices1) : product1.price;
  const avg1 = prices1.length > 0 ? Math.round(prices1.reduce((a, b) => a + b, 0) / prices1.length) : product1.price;

  const isLow1 = product1.price <= min1;

  // Calculate statistics for product 2 if present
  const prices2 = history2.map((h) => h.price);
  const min2 = prices2.length > 0 ? Math.min(...prices2) : (product2 ? product2.price : 0);
  const max2 = prices2.length > 0 ? Math.max(...prices2) : (product2 ? product2.price : 0);
  const avg2 = prices2.length > 0 ? Math.round(prices2.reduce((a, b) => a + b, 0) / prices2.length) : (product2 ? product2.price : 0);
  const isLow2 = product2 ? product2.price <= min2 : false;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-2">
            <DollarSign className="h-3.5 w-3.5" />
            <span>Price History & Trend Analytics</span>
          </div>
          <h2 className="text-xl font-bold text-white">6-Month Historical Price Trend</h2>
          <p className="text-xs text-slate-400">Track historical discounts and evaluate current buying timing</p>
        </div>

        {/* Buying Alert Badges */}
        <div className="flex items-center space-x-2">
          {isLow1 && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center space-x-1.5">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{product1.brand} at 6-Mo Low</span>
            </span>
          )}
          {product2 && isLow2 && (
            <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center space-x-1.5">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{product2.brand} at 6-Mo Low</span>
            </span>
          )}
        </div>
      </div>

      {/* Recharts Line Graph */}
      <div className="h-72 w-full pt-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 20, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
            <XAxis dataKey="month" stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 12 }} />
            <YAxis
              stroke="#64748b"
              tick={{ fill: '#94a3b8', fontSize: 12 }}
              tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
              formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Price']}
            />
            <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
            <Line
              type="monotone"
              dataKey={product1.title}
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ r: 5, fill: '#6366f1' }}
              activeDot={{ r: 8 }}
            />
            {product2 && (
              <Line
                type="monotone"
                dataKey={product2.title}
                stroke="#a855f7"
                strokeWidth={3}
                dot={{ r: 5, fill: '#a855f7' }}
                activeDot={{ r: 8 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Statistical Summary Metrics Grid */}
      <div className={`grid grid-cols-1 ${product2 ? 'md:grid-cols-2' : 'grid-cols-1'} gap-4 pt-4 border-t border-slate-800`}>
        {/* Product 1 Stats */}
        <div className="glass-card p-4 rounded-2xl border border-indigo-500/20 space-y-2">
          <div className="text-xs font-bold text-indigo-300 truncate">{product1.title}</div>
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">6-Mo Low</div>
              <div className="font-bold text-emerald-400 mt-0.5">₹{min1.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">Average</div>
              <div className="font-semibold text-slate-200 mt-0.5">₹{avg1.toLocaleString('en-IN')}</div>
            </div>
            <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400">6-Mo High</div>
              <div className="font-semibold text-slate-400 mt-0.5">₹{max1.toLocaleString('en-IN')}</div>
            </div>
          </div>
        </div>

        {/* Product 2 Stats (if present) */}
        {product2 && (
          <div className="glass-card p-4 rounded-2xl border border-purple-500/20 space-y-2">
            <div className="text-xs font-bold text-purple-300 truncate">{product2.title}</div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">6-Mo Low</div>
                <div className="font-bold text-emerald-400 mt-0.5">₹{min2.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">Average</div>
                <div className="font-semibold text-slate-200 mt-0.5">₹{avg2.toLocaleString('en-IN')}</div>
              </div>
              <div className="bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <div className="text-[10px] text-slate-400">6-Mo High</div>
                <div className="font-semibold text-slate-400 mt-0.5">₹{max2.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
