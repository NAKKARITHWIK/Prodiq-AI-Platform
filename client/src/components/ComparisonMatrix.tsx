import React from 'react';
import { Product, ProductSpecs, UserPreference } from '../types';
import { calculateDeterministicValueScore } from '../utils/scoringEngine';
import { ValueScoreBreakdown } from './ValueScoreBreakdown';
import { Trophy, CheckCircle, Cpu, HardDrive, Battery, Monitor, ShieldCheck, Tag, Sparkles } from 'lucide-react';

interface Props {
  product1: Product;
  product2: Product;
  preference?: UserPreference | null;
}

export const ComparisonMatrix: React.FC<Props> = ({ product1, product2, preference }) => {
  const specs1: ProductSpecs = JSON.parse(product1.specsJson || '{}');
  const specs2: ProductSpecs = JSON.parse(product2.specsJson || '{}');

  const score1 = calculateDeterministicValueScore(product1, preference);
  const score2 = calculateDeterministicValueScore(product2, preference);

  const winner = score1.overallScore > score2.overallScore ? product1 : score2.overallScore > score1.overallScore ? product2 : null;
  const winDiff = Math.abs(score1.overallScore - score2.overallScore);

  const specRows = [
    { label: 'Processor / Chipset', icon: Cpu, val1: specs1.processor || 'N/A', val2: specs2.processor || 'N/A' },
    { label: 'System RAM', icon: HardDrive, val1: specs1.ram || 'N/A', val2: specs2.ram || 'N/A' },
    { label: 'Storage SSD / Flash', icon: HardDrive, val1: specs1.storage || 'N/A', val2: specs2.storage || 'N/A' },
    { label: 'Graphics GPU', icon: Cpu, val1: specs1.gpu || 'N/A', val2: specs2.gpu || 'N/A' },
    { label: 'Display Panel', icon: Monitor, val1: specs1.display || 'N/A', val2: specs2.display || 'N/A' },
    { label: 'Battery Capacity', icon: Battery, val1: specs1.battery || 'N/A', val2: specs2.battery || 'N/A' },
    { label: 'Portability Weight', icon: Tag, val1: specs1.weight || 'N/A', val2: specs2.weight || 'N/A' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Overall Score Verdict Banner */}
      {winner && (
        <div className="glass-panel p-6 rounded-3xl border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="p-4 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 text-slate-950 shadow-lg shadow-amber-500/20">
              <Trophy className="h-8 w-8" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[11px] font-bold mb-1">
                <Sparkles className="h-3 w-3" />
                <span>Highest Value Score Winner</span>
              </div>
              <h2 className="text-xl font-bold text-white">{winner.title}</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Ranks higher by <span className="font-extrabold text-amber-400">+{winDiff} points</span> based on price efficiency, hardware specs, and user persona alignment.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Side-by-Side Value Score Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ValueScoreBreakdown title={product1.title} score={score1} colorTheme="indigo" />
        <ValueScoreBreakdown title={product2.title} score={score2} colorTheme="purple" />
      </div>

      {/* Feature Comparison Table */}
      <div className="glass-panel rounded-3xl overflow-hidden border border-slate-800">
        <div className="p-6 border-b border-slate-800 bg-slate-900/40">
          <h3 className="text-lg font-bold text-white">Side-by-Side Feature & Technical Matrix</h3>
          <p className="text-xs text-slate-400">Direct technical evaluation of hardware components and seller terms</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-900/80 border-b border-slate-800 text-slate-300">
                <th className="p-4 font-bold w-1/3">Feature / Spec</th>
                <th className="p-4 font-bold w-1/3 text-indigo-400">{product1.title}</th>
                <th className="p-4 font-bold w-1/3 text-purple-400">{product2.title}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {/* Product Preview Row */}
              <tr className="bg-slate-900/20">
                <td className="p-4 font-semibold text-slate-400">Product Preview</td>
                <td className="p-4">
                  <img src={product1.image} alt={product1.title} className="h-24 w-36 object-cover rounded-xl border border-slate-800" />
                </td>
                <td className="p-4">
                  <img src={product2.image} alt={product2.title} className="h-24 w-36 object-cover rounded-xl border border-slate-800" />
                </td>
              </tr>

              {/* Price Row */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Current Price</td>
                <td className="p-4 text-base font-extrabold text-white">₹{product1.price.toLocaleString('en-IN')}</td>
                <td className="p-4 text-base font-extrabold text-white">₹{product2.price.toLocaleString('en-IN')}</td>
              </tr>

              {/* Specs Rows */}
              {specRows.map((row, idx) => {
                const Icon = row.icon;
                return (
                  <tr key={idx} className="hover:bg-slate-900/40 transition-colors">
                    <td className="p-4 font-semibold text-slate-300 flex items-center space-x-2">
                      <Icon className="h-4 w-4 text-indigo-400 shrink-0" />
                      <span>{row.label}</span>
                    </td>
                    <td className="p-4 text-slate-200">{row.val1}</td>
                    <td className="p-4 text-slate-200">{row.val2}</td>
                  </tr>
                );
              })}

              {/* Seller & Warranty */}
              <tr>
                <td className="p-4 font-semibold text-slate-300">Seller & Rating</td>
                <td className="p-4 text-slate-300">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{product1.sellerName} ({product1.sellerRating}★)</span>
                  </div>
                </td>
                <td className="p-4 text-slate-300">
                  <div className="flex items-center space-x-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{product2.sellerName} ({product2.sellerRating}★)</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td className="p-4 font-semibold text-slate-300">Warranty Coverage</td>
                <td className="p-4 text-slate-300">{product1.warrantyMonths} Months Official Warranty</td>
                <td className="p-4 text-slate-300">{product2.warrantyMonths} Months Official Warranty</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
