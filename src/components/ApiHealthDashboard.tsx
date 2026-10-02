import React, { useState } from 'react';
import { API_RATE_LIMITS } from '../data/mockAnalytics';
import { ApiRateLimitStatus } from '../types/workflow';
import { useOmniFlow } from '../context/OmniFlowContext';
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  RefreshCw,
  Zap,
  CheckCircle2,
  AlertCircle,
  Activity,
  Server,
  Wifi,
  ExternalLink
} from 'lucide-react';

export const ApiHealthDashboard: React.FC = () => {
  const { serviceStatuses, isPingingServices, pingAllServices, config } = useOmniFlow();
  const [limits, setLimits] = useState<ApiRateLimitStatus[]>(API_RATE_LIMITS);

  const getPlatformIcon = (platform: string) => {
    if (platform === 'TikTok') {
      return (
        <div className="w-6 h-6 rounded bg-[#25F4EE]/10 border border-[#25F4EE]/30 flex items-center justify-center font-bold text-[10px] text-[#25F4EE]">
          TT
        </div>
      );
    }
    if (platform === 'YouTube') {
      return (
        <div className="w-6 h-6 rounded bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-[10px] text-red-500">
          YT
        </div>
      );
    }
    return (
      <div className="w-6 h-6 rounded bg-pink-500/10 border border-pink-500/30 flex items-center justify-center font-bold text-[10px] text-pink-400">
        IG
      </div>
    );
  };

  // Safe capacity estimations
  const youtubeLimit = limits.find((l) => l.platform === 'YouTube');
  const ytRemainingUnits = youtubeLimit ? youtubeLimit.quotaLimit - youtubeLimit.quotaUsed : 0;
  const ytRemainingUploads = Math.floor(ytRemainingUnits / 1600);

  const tiktokLimit = limits.find((l) => l.platform === 'TikTok' && l.endpointGroup.includes('Direct Video'));
  const ttRemainingUploads = tiktokLimit ? tiktokLimit.quotaLimit - tiktokLimit.quotaUsed : 0;

  const igLimit = limits.find((l) => l.platform === 'Instagram' && l.endpointGroup.includes('Reels Publishing'));
  const igRemainingUploads = igLimit ? igLimit.quotaLimit - igLimit.quotaUsed : 0;

  return (
    <div className="space-y-6">
      {/* Component Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>API Health & Connectivity Status</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time ping telemetry for your n8n workflow engine and target social distribution APIs
          </p>
        </div>

        <button
          onClick={() => pingAllServices()}
          disabled={isPingingServices}
          className="px-3 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isPingingServices ? 'animate-spin' : ''}`} />
          <span>{isPingingServices ? 'Pinging APIs...' : 'Ping All Endpoints'}</span>
        </button>
      </div>

      {/* Real-time Connectivity Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(serviceStatuses).map(([key, service]) => {
          const isOnline = service.status === 'ONLINE';
          const isChecking = service.status === 'CHECKING';

          return (
            <div
              key={key}
              className={`bg-[#111726] border rounded-xl p-4 space-y-3 transition-colors ${
                isOnline
                  ? 'border-emerald-500/30'
                  : isChecking
                  ? 'border-slate-800'
                  : 'border-amber-500/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isOnline ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}
                  >
                    {key === 'n8n' ? <Server className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white truncate max-w-[130px]">{service.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {service.latencyMs !== null ? `${service.latencyMs}ms latency` : 'offline'}
                    </span>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase font-bold ${
                    isOnline
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : isChecking
                      ? 'bg-slate-800 text-slate-400 border-slate-700'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  }`}
                >
                  {service.status}
                </span>
              </div>

              <div className="text-[11px] font-mono text-slate-500 truncate" title={service.url}>
                {service.url}
              </div>
            </div>
          );
        })}
      </div>

      {/* Mass Distribution Capacity Summary Banner */}
      <div className="bg-[#111726] border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Platform Quota & Concurrency Advisory
              </h4>
              <span className="text-[11px] font-mono text-slate-400">
                Primary Factor: <strong className="text-red-400">YouTube Daily Quota (10,000 pts)</strong>
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Based on official developer rate limits, your pipeline can safely execute{' '}
              <strong className="text-white font-mono">{ytRemainingUploads} more concurrent cross-platform distribution runs</strong>{' '}
              today before reaching YouTube's default 10,000 daily points quota. TikTok supports{' '}
              <span className="text-[#25F4EE] font-mono">{ttRemainingUploads} uploads/hr</span> and Instagram supports{' '}
              <span className="text-pink-400 font-mono">{igRemainingUploads} Reels/day</span>.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-800/80">
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> TikTok: 30 videos / hr cap
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-amber-400">
                <AlertCircle className="w-3 h-3" /> YouTube: ~6 Shorts / day on standard free quota (1,600 pts/upload)
              </span>
              <span>·</span>
              <span className="flex items-center gap-1 text-emerald-400">
                <CheckCircle2 className="w-3 h-3" /> Instagram: 50 Reels / 24h cap
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Rate Limits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {limits.map((item, idx) => {
          const pct = Math.min(100, Math.round((item.quotaUsed / item.quotaLimit) * 100));
          const isWarning = pct >= 60 && pct < 85;
          const isCritical = pct >= 85;

          let statusBadge = (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Optimal
            </span>
          );
          let barColor = 'bg-emerald-500';
          let borderColor = 'border-slate-800';

          if (isCritical) {
            statusBadge = (
              <span className="text-[10px] font-mono text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                Near Limit
              </span>
            );
            barColor = 'bg-red-500';
            borderColor = 'border-red-500/40';
          } else if (isWarning) {
            statusBadge = (
              <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                Elevated
              </span>
            );
            barColor = 'bg-amber-400';
            borderColor = 'border-amber-500/30';
          }

          return (
            <div
              key={idx}
              className={`bg-[#111726] border ${borderColor} rounded-xl p-4 flex flex-col justify-between space-y-3 transition-colors`}
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getPlatformIcon(item.platform)}
                    <span className="text-xs font-bold text-white">{item.platform}</span>
                  </div>
                  {statusBadge}
                </div>

                <div>
                  <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {item.endpointGroup}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.resetIn}</p>
                </div>
              </div>

              {/* Progress Bar & Numerical Metrics */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">
                    Used: <strong className="text-white">{item.quotaUsed.toLocaleString()}</strong> /{' '}
                    {item.quotaLimit.toLocaleString()}
                  </span>
                  <span className="font-semibold text-slate-300">{pct}%</span>
                </div>

                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${barColor} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
