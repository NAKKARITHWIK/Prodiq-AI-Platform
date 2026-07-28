import React, { useState } from 'react';
import { UserPreference } from '../types';
import { Code, Gamepad2, GraduationCap, Wallet, X, Check, Sliders } from 'lucide-react';

interface Props {
  preference: UserPreference;
  onSave: (updated: Partial<UserPreference>) => Promise<void>;
  onClose: () => void;
}

export const UserPreferenceModal: React.FC<Props> = ({ preference, onSave, onClose }) => {
  const [profileType, setProfileType] = useState<UserPreference['profileType']>(preference.profileType);
  const [maxPrice, setMaxPrice] = useState<number>(preference.maxPrice);
  const [primaryPriority, setPrimaryPriority] = useState<UserPreference['primaryPriority']>(preference.primaryPriority);
  const [loading, setLoading] = useState(false);

  const profiles = [
    {
      id: 'DEVELOPER',
      label: 'Software Developer',
      icon: Code,
      desc: 'High RAM (16GB+), multi-core CPU performance, 4K monitor support.',
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'GAMER',
      label: 'Gaming Enthusiast',
      icon: Gamepad2,
      desc: 'Dedicated NVIDIA/AMD GPU, high refresh rate OLED displays (120Hz+).',
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'STUDENT',
      label: 'Student / Portable',
      icon: GraduationCap,
      desc: 'Lightweight portability (<1.5kg), long battery life (12+ hrs), great value.',
      color: 'from-emerald-600 to-teal-600',
    },
    {
      id: 'BUDGET',
      label: 'Budget Conscious',
      icon: Wallet,
      desc: 'Maximum features per rupee, low price tag, warranty & reliability priority.',
      color: 'from-amber-600 to-orange-600',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSave({
        profileType,
        maxPrice,
        primaryPriority,
      });
      onClose();
    } catch (err) {
      console.error('Failed to save profile preferences:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative animate-fadeIn">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sliders className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Target User Preference Profile</h2>
              <p className="text-xs text-slate-400">Tailors ProdIQ's multi-dimensional scoring engine to your priorities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-3">Select Primary User Persona</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profiles.map((p) => {
                const Icon = p.icon;
                const isSelected = profileType === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => setProfileType(p.id as any)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-slate-900 border-indigo-500 shadow-lg shadow-indigo-500/10'
                        : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-gradient-to-r ${p.color} text-white`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-indigo-400" />}
                    </div>
                    <div className="text-xs font-bold text-slate-100">{p.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-snug">{p.desc}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Max Budget Limit */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300">Maximum Budget Limit</label>
              <span className="text-xs font-bold text-indigo-400">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="20000"
              max="300000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Apply Persona Preferences'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
