import React, { useState } from 'react';
import { SellerTrustBreakdown } from '../types';
import { ShieldCheck, Truck, RotateCcw, Star, AlertCircle } from 'lucide-react';

interface Props {
  trust?: SellerTrustBreakdown;
  sellerName: string;
}

export const SellerTrustBadge: React.FC<Props> = ({ trust, sellerName }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  if (!trust) {
    return (
      <div className="flex items-center space-x-1.5 text-xs text-slate-400">
        <ShieldCheck className="h-4 w-4 text-emerald-400" />
        <span>{sellerName}</span>
      </div>
    );
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'EXCELLENT':
        return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
      case 'HIGH':
        return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30';
      case 'MODERATE':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
      default:
        return 'text-slate-400 bg-slate-500/10 border-slate-500/30';
    }
  };

  return (
    <div className="relative inline-block" onMouseEnter={() => setShowTooltip(true)} onMouseLeave={() => setShowTooltip(false)}>
      <div className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center space-x-1.5 cursor-pointer transition-all ${getTierColor(trust.trustTier)}`}>
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>{trust.trustScore}/100 Trust Score</span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-72 p-4 glass-panel rounded-2xl border border-slate-700 shadow-2xl z-50 animate-fadeIn space-y-2 text-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <span className="font-bold text-white">{sellerName}</span>
            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${getTierColor(trust.trustTier)}`}>
              {trust.trustTier}
            </span>
          </div>

          <p className="text-[11px] text-slate-300 leading-relaxed">{trust.explanation}</p>

          <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80 text-[10px]">
            <div className="flex items-center space-x-1 text-slate-400">
              <Star className="h-3 w-3 text-amber-400" />
              <span>Rating: {trust.ratingScore}/30</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <Truck className="h-3 w-3 text-indigo-400" />
              <span>Delivery: {trust.deliveryScore}/25</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <RotateCcw className="h-3 w-3 text-emerald-400" />
              <span>Returns: {trust.returnPolicyScore}/10</span>
            </div>
            <div className="flex items-center space-x-1 text-slate-400">
              <AlertCircle className="h-3 w-3 text-purple-400" />
              <span>Stability: {trust.priceStabilityScore}/15</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
