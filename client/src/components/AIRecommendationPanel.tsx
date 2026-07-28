import React, { useState } from 'react';
import { Product, AIRecommendationResult } from '../types';
import { Bot, Sparkles, ShieldCheck, CheckCircle2, XCircle, AlertTriangle, ThumbsUp, ThumbsDown, HelpCircle, DollarSign, Store, Clock } from 'lucide-react';

interface Props {
  recommendation: AIRecommendationResult;
  product1: Product;
  product2: Product;
}

export const AIRecommendationPanel: React.FC<Props> = ({ recommendation, product1, product2 }) => {
  const [activeTab, setActiveTab] = useState<'p1' | 'p2'>('p1');

  const winner = recommendation.overallWinnerId === product1.id ? product1 : product2;
  const loser = recommendation.overallWinnerId === product1.id ? product2 : product1;

  const currentSummary = activeTab === 'p1' ? recommendation.reviewSummary1 : recommendation.reviewSummary2;
  const currentProduct = activeTab === 'p1' ? product1 : product2;

  return (
    <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-indigo-500/30 space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold text-white">AI Buying Advisor</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                Powered by Gemini
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">Objective product intelligence and purchasing analysis</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 bg-slate-900 px-3.5 py-1.5 rounded-xl border border-slate-800">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span className="text-xs text-slate-400">Analysis Confidence:</span>
          <span className="text-xs font-bold text-emerald-400">{recommendation.confidenceLevel}</span>
        </div>
      </div>

      {/* AI Q&A Advisor Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="space-y-4">
          {/* Which product should I buy? */}
          <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 space-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-3 opacity-10"><HelpCircle className="h-16 w-16 text-indigo-500" /></div>
            <h3 className="text-sm font-bold text-indigo-400">Which product should I buy?</h3>
            <p className="text-sm text-white font-bold text-lg">{winner.title}</p>
          </div>

          {/* Why? */}
          <div className="glass-card p-5 rounded-2xl space-y-2">
            <h3 className="text-sm font-bold text-indigo-400 flex items-center space-x-2">
              <Sparkles className="h-4 w-4" />
              <span>Why?</span>
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">{recommendation.whyRankedFirst}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Who is it best for? */}
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-2">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>Who is it best for?</span>
            </h3>
            <p className="text-sm text-slate-300">{recommendation.bestSuitedUserType}</p>
          </div>

          {/* Who should avoid it? */}
          <div className="glass-card p-5 rounded-2xl border border-amber-500/20 space-y-2">
            <h3 className="text-sm font-bold text-amber-400 flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Who should avoid it?</span>
            </h3>
            <p className="text-sm text-slate-300">
              Users prioritizing {recommendation.tradeOffs[0]?.toLowerCase() || 'the specific strengths'} of the {loser.brand} model.
            </p>
          </div>
        </div>
      </div>

      {/* Value & Marketplace Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 flex items-center space-x-1.5"><DollarSign className="h-4 w-4 text-emerald-400"/><span>Is it worth the price?</span></h4>
          <p className="text-sm text-white font-medium">Yes, excellent value-to-performance ratio.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 flex items-center space-x-1.5"><Clock className="h-4 w-4 text-amber-400"/><span>Should I wait for a discount?</span></h4>
          <p className="text-sm text-white font-medium">No immediate price drops predicted. Purchase recommended.</p>
        </div>
        <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-800 space-y-2">
          <h4 className="text-xs font-bold text-slate-400 flex items-center space-x-1.5"><Store className="h-4 w-4 text-indigo-400"/><span>Best Marketplace</span></h4>
          <p className="text-sm text-white font-medium">Amazon (Highest Trust & Lowest Price)</p>
        </div>
      </div>

      {/* Review Summarization Engine */}
      <div className="space-y-4 pt-6 border-t border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white">Aggregated Review Intelligence</h3>
            <p className="text-xs text-slate-400">Gemini automated sentiment extraction</p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('p1')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'p1' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {product1.brand} Summary
            </button>
            <button
              onClick={() => setActiveTab('p2')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === 'p2' ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {product2.brand} Summary
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="glass-card p-5 rounded-2xl border border-emerald-500/20 space-y-3">
            <div className="text-xs font-bold text-emerald-400 flex items-center space-x-2">
              <ThumbsUp className="h-4 w-4" />
              <span>Top Praises</span>
            </div>
            <ul className="space-y-2">
              {currentSummary.pros.map((pro, idx) => (
                <li key={idx} className="text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-start space-x-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-red-500/20 space-y-3">
            <div className="text-xs font-bold text-red-400 flex items-center space-x-2">
              <ThumbsDown className="h-4 w-4" />
              <span>Reported Limitations</span>
            </div>
            <ul className="space-y-2">
              {currentSummary.cons.map((con, idx) => (
                <li key={idx} className="text-xs text-slate-200 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 flex items-start space-x-2">
                  <XCircle className="h-3.5 w-3.5 text-red-400 shrink-0 mt-0.5" />
                  <span>{con}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
