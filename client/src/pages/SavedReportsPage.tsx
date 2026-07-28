import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SavedReport } from '../types';
import { reportService } from '../services/apiService';
import { Bookmark, Trash2, ArrowRight, Calendar, Loader2, ArrowLeft } from 'lucide-react';

export const SavedReportsPage: React.FC = () => {
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const data = await reportService.getUserReports();
      setReports(data);
    } catch (err) {
      console.error('Failed to load reports:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await reportService.deleteReport(id);
      setReports(reports.filter((r) => r.id !== id));
    } catch (err) {
      console.error('Failed to delete report:', err);
    }
  };

  const handleOpenReport = (r: SavedReport) => {
    navigate(`/compare?p1=${r.product1Id}&p2=${r.product2Id}`);
  };

  return (
    <div className="min-h-[80vh] w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 animate-fadeIn">
      <div className="flex items-center space-x-4 mb-8">
        <Link
          to="/dashboard"
          className="p-2 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center space-x-2">
            <Bookmark className="h-6 w-6 text-indigo-400" />
            <span>Saved Intelligence Reports</span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">View and revisit your past product evaluations</p>
        </div>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl">
        <div className="space-y-4">
          {loading ? (
            <div className="py-20 text-center text-slate-400 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin mx-auto text-indigo-500" />
              <p className="text-sm">Loading saved intelligence reports...</p>
            </div>
          ) : reports.length === 0 ? (
            <div className="py-20 text-center text-slate-400 glass-card rounded-2xl flex flex-col items-center justify-center border border-dashed border-slate-700">
              <div className="p-4 rounded-full bg-red-950/30 mb-4 border border-red-900/50">
                <Bookmark className="h-10 w-10 text-red-800" />
              </div>
              <p className="text-lg font-bold text-slate-200">No saved reports yet.</p>
              <p className="text-sm text-slate-500 mt-2 max-w-sm mx-auto">
                When comparing products, click "Save Intelligence Report" to bookmark your analysis.
              </p>
              <Link
                to="/dashboard"
                className="mt-8 px-8 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center space-x-2"
              >
                <span>Go Compare Products</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  onClick={() => handleOpenReport(r)}
                  className="p-5 rounded-2xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800 hover:border-indigo-500/50 transition-all cursor-pointer flex flex-col justify-between group space-y-4 shadow-sm hover:shadow-indigo-500/10"
                >
                  <div className="space-y-2">
                    <div className="text-base font-bold text-slate-100 group-hover:text-indigo-300 transition-colors">{r.title}</div>
                    <div className="flex items-center space-x-3 text-xs text-slate-400">
                      <span className="flex items-center space-x-1 bg-slate-950 px-2 py-1 rounded-md border border-slate-800">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(r.createdAt).toLocaleDateString()}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                    <button
                      onClick={(e) => handleDelete(r.id, e)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors flex items-center space-x-1.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Delete</span>
                    </button>
                    <div className="flex items-center space-x-1.5 text-indigo-400 text-xs font-bold group-hover:translate-x-1 transition-transform">
                      <span>View Report</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
