import React, { useState } from 'react';
import { Product, VisionMatchResult } from '../types';
import { aiService } from '../services/apiService';
import { Camera, UploadCloud, X, CheckCircle, Loader2, Sparkles, ArrowRight } from 'lucide-react';

interface Props {
  onMatchFound: (product: Product) => void;
  onClose: () => void;
}

export const VisionUploadModal: React.FC<Props> = ({ onMatchFound, onClose }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<VisionMatchResult | null>(null);
  const [error, setError] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setMatchResult(null);
        setError('');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIdentify = async () => {
    if (!selectedImage) return;

    try {
      setLoading(true);
      setError('');
      const res = await aiService.identifyProductImage(selectedImage);
      setMatchResult(res);
    } catch (err: any) {
      console.error('Vision error:', err);
      setError('Failed to identify product image. Please ensure the image is clear and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel p-6 sm:p-8 rounded-3xl border border-slate-700 shadow-2xl relative animate-fadeIn space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Gemini Vision Identification</h2>
              <p className="text-xs text-slate-400">Upload a product photo to find database matches</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Upload Area */}
        <div className="space-y-4">
          {selectedImage ? (
            <div className="relative h-48 w-full rounded-2xl overflow-hidden border border-slate-700 bg-slate-900 group">
              <img src={selectedImage} alt="Uploaded product" className="w-full h-full object-contain" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center h-48 w-full border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl cursor-pointer bg-slate-900/40 hover:bg-slate-900/80 transition-all text-center p-6">
              <UploadCloud className="h-10 w-10 text-indigo-400 mb-2 animate-bounce" />
              <span className="text-xs font-bold text-slate-200">Click to upload product image</span>
              <span className="text-[11px] text-slate-500 mt-1">Supports PNG, JPG, WEBP (Max 10MB)</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          )}

          {/* Action Button */}
          {selectedImage && !matchResult && (
            <button
              onClick={handleIdentify}
              disabled={loading}
              className="w-full py-3 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/30 hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Analyzing with Gemini Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Identify & Match Product</span>
                </>
              )}
            </button>
          )}

          {error && <p className="text-xs text-red-400 text-center">{error}</p>}
        </div>

        {/* Vision Result Card */}
        {matchResult && (
          <div className="p-4 rounded-2xl bg-indigo-950/80 border border-indigo-500/30 space-y-3 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-400 flex items-center space-x-1">
                <CheckCircle className="h-4 w-4" />
                <span>Visual Match Found ({(matchResult.match.confidenceScore * 100).toFixed(0)}% Confidence)</span>
              </span>
            </div>

            <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800">
              <img src={matchResult.product.image} alt={matchResult.product.title} className="h-12 w-12 object-cover rounded-lg" />
              <div>
                <div className="text-xs font-bold text-white truncate max-w-[200px]">{matchResult.product.title}</div>
                <div className="text-[11px] text-indigo-400 font-semibold">₹{matchResult.product.price.toLocaleString('en-IN')}</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 italic">"{matchResult.match.reasoning}"</p>

            <button
              onClick={() => {
                onMatchFound(matchResult.product);
                onClose();
              }}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <span>Select Product in Catalog</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
