import React from 'react';
import { Download, Play, GitBranch, BarChart2, BookOpen, Clock } from 'lucide-react';

interface HeaderProps {
  activeTab: 'canvas' | 'simulator' | 'analytics' | 'endpoints' | 'scheduler';
  setActiveTab: (tab: 'canvas' | 'simulator' | 'analytics' | 'endpoints' | 'scheduler') => void;
  onOpenExport: () => void;
  onOpenSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenExport,
  onOpenSimulator,
}) => {
  return (
    <header className="h-16 px-6 border-b border-slate-800 bg-[#0d121c]/90 backdrop-blur sticky top-0 z-30 flex items-center justify-between">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-sm">
          <GitBranch className="w-4 h-4" />
        </div>
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('canvas');
          }}
          className="text-lg font-bold tracking-tight text-white hover:text-rose-400 transition-colors"
        >
          n8n OmniFlow
        </a>
      </div>

      {/* Zone 2: 4-6 clean text navigation links */}
      <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
        <button
          onClick={() => setActiveTab('canvas')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer pb-0.5 ${
            activeTab === 'canvas'
              ? 'text-rose-400 border-b-2 border-rose-500 font-semibold'
              : 'hover:text-white'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5" />
          <span>Workflow Canvas</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer pb-0.5 ${
            activeTab === 'simulator'
              ? 'text-rose-400 border-b-2 border-rose-500 font-semibold'
              : 'hover:text-white'
          }`}
        >
          <Play className="w-3.5 h-3.5" />
          <span>Execution Simulator</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer pb-0.5 ${
            activeTab === 'analytics'
              ? 'text-rose-400 border-b-2 border-rose-500 font-semibold'
              : 'hover:text-white'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Analytics Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab('scheduler')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer pb-0.5 ${
            activeTab === 'scheduler'
              ? 'text-rose-400 border-b-2 border-rose-500 font-semibold'
              : 'hover:text-white'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>Schedule Queue</span>
        </button>

        <button
          onClick={() => setActiveTab('endpoints')}
          className={`transition-colors flex items-center gap-1.5 cursor-pointer pb-0.5 ${
            activeTab === 'endpoints'
              ? 'text-rose-400 border-b-2 border-rose-500 font-semibold'
              : 'hover:text-white'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>API Specs & Endpoints</span>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSimulator}
          className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
          <span>Simulate Flow</span>
        </button>

        <button
          onClick={onOpenExport}
          className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-900/40"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export n8n JSON</span>
        </button>
      </div>
    </header>
  );
};
