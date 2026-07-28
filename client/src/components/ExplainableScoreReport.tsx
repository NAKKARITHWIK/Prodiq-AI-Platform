import React from 'react';
import { Product } from '../types';
import { Award, CheckCircle, Info, Sparkles, TrendingUp } from 'lucide-react';

interface Props {
  product: Product;
  opponent?: Product;
}

export const ExplainableScoreReport: React.FC<Props> = ({ product, opponent }) => {
  // Calculate weighted sub-scores
  const priceScore = Math.min(100, Math.round(((product.originalPrice - product.price + 5000) / product.originalPrice) * 100 + 70));
  const performanceScore = product.specsJson.includes('32GB') || product.specsJson.includes('M3 Max') ? 96 : 88;
  const displayScore = product.specsJson.includes('OLED') || product.specsJson.includes('Liquid Retina') ? 95 : 86;
  const batteryScore = product.specsJson.includes('18-hour') || product.specsJson.includes('100Wh') ? 94 : 85;
  const buildQualityScore = product.brand === 'Apple' || product.brand === 'ASUS' ? 95 : 88;
  const reviewScore = Math.round((product.rating / 5.0) * 100);
  const valueForMoneyScore = Math.round((priceScore * 0.4) + (performanceScore * 0.4) + (reviewScore * 0.2));

  const overallScore = Math.round(
    priceScore * 0.25 +
    performanceScore * 0.25 +
    displayScore * 0.15 +
    batteryScore * 0.15 +
    buildQualityScore * 0.10 +
    reviewScore * 0.10
  );

  const subMetrics = [
    { label: 'Overall Intelligence Rating', score: overallScore, weight: '100%', color: 'from-indigo-500 to-purple-500' },
    { label: 'Value for Money', score: valueForMoneyScore, weight: '25%', color: 'from-emerald-500 to-teal-500' },
    { label: 'Hardware Performance', score: performanceScore, weight: '25%', color: 'from-blue-500 to-indigo-500' },
    { label: 'Display & Color Accuracy', score: displayScore, weight: '15%', color: 'from-purple-500 to-pink-500' },
    { label: 'Battery & Thermal Efficiency', score: batteryScore, weight: '15%', color: 'from-amber-500 to-orange-500' },
    { label: 'Build Quality & Chassis', score: buildQualityScore, weight: '10%', color: 'from-cyan-500 to-blue-500' },
    { label: 'Customer Satisfaction Review', score: reviewScore, weight: '10%', color: 'from-rose-500 to-red-500' },
  ];

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <Award className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Explainable AI Ranking Report</h3>
            <p className="text-xs text-slate-400">Multi-factor mathematical breakdown & transparent score weights</p>
          </div>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center space-x-1">
          <CheckCircle className="h-3.5 w-3.5" />
          <span>Verified Transparent Algorithm</span>
        </div>
      </div>

      {/* Progress Bars Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {subMetrics.map((m, idx) => (
          <div key={idx} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-200">{m.label}</span>
              <span className="font-bold text-white">
                {m.score}/100 <span className="text-[10px] text-slate-500">({m.weight} weight)</span>
              </span>
            </div>
            <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
              <div
                className={`bg-gradient-to-r ${m.color} h-full rounded-full transition-all duration-1000`}
                style={{ width: `${m.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Human Readable Explanation Box */}
      <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 flex items-start space-x-3">
        <Info className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-slate-300 leading-relaxed">
          <span className="font-bold text-indigo-300">Why {product.title} ranked high:</span>
          <p>
            {product.title} achieved an overall intelligence score of <strong className="text-white">{overallScore}/100</strong> due to exceptional performance in <strong>Hardware Performance ({performanceScore}/100)</strong> and <strong>Value for Money ({valueForMoneyScore}/100)</strong>. Its current discount pricing provides high specification density compared to market alternatives.
          </p>
        </div>
      </div>
    </div>
  );
};
