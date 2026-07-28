import React from 'react';
import { ScoreBreakdown } from '../utils/scoringEngine';
import { Calculator, CheckCircle2, ChevronRight, Award } from 'lucide-react';

interface Props {
  title: string;
  score: ScoreBreakdown;
  colorTheme: 'indigo' | 'purple';
}

export const ValueScoreBreakdown: React.FC<Props> = ({ title, score, colorTheme }) => {
  const themeClasses =
    colorTheme === 'indigo'
      ? {
          border: 'border-indigo-500/30',
          badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          bar: 'bg-indigo-600',
        }
      : {
          border: 'border-purple-500/30',
          badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
          bar: 'bg-purple-600',
        };

  return (
    <div className={`glass-card p-6 rounded-3xl border ${themeClasses.border} space-y-4`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400">ProdIQ Value Score</div>
          <div className="text-base font-bold text-white truncate max-w-[220px]">{title}</div>
        </div>
        <div className={`px-4 py-2 rounded-2xl border text-xl font-extrabold flex items-center space-x-1 ${themeClasses.badge}`}>
          <Award className="h-5 w-5" />
          <span>{score.overallScore}/100</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden p-0.5 border border-slate-800">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${themeClasses.bar}`}
          style={{ width: `${score.overallScore}%` }}
        />
      </div>

      {/* Mathematical Breakdown Categories */}
      <div className="space-y-2 pt-2">
        <div className="text-xs font-bold text-slate-300 flex items-center space-x-1.5 mb-2">
          <Calculator className="h-4 w-4 text-indigo-400" />
          <span>Transparent Mathematical Arithmetic Breakdown:</span>
        </div>

        <ul className="space-y-1.5">
          {score.explanations.map((exp, idx) => (
            <li key={idx} className="text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <span className="flex items-center space-x-2">
                <ChevronRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                <span>{exp.split(':')[0]}</span>
              </span>
              <span className="font-bold text-emerald-400">{exp.split(':')[1]}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
