import React, { useState } from 'react';
import {
  INITIAL_SCHEDULED_POSTS,
  HOURLY_PERFORMANCE_HEATMAP,
  RETENTION_COMPARISON
} from '../data/mockAnalytics';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  Bookmark,
  MessageCircle,
  Clock,
  ArrowUpRight,
  Filter,
  RefreshCw,
  ExternalLink,
  Zap,
  Award
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const [posts, setPosts] = useState(INITIAL_SCHEDULED_POSTS);
  const [selectedPostId, setSelectedPostId] = useState<string>('post_001');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const selectedPost = posts.find((p) => p.id === selectedPostId) || posts[0];

  // Calculate aggregates
  const publishedPosts = posts.filter((p) => p.status === 'PUBLISHED');

  const totalTikTokViews = publishedPosts.reduce(
    (acc, p) => acc + (p.metrics?.tiktok?.views || 0),
    0
  );
  const totalYouTubeViews = publishedPosts.reduce(
    (acc, p) => acc + (p.metrics?.youtube?.views || 0),
    0
  );
  const totalInstagramViews = publishedPosts.reduce(
    (acc, p) => acc + (p.metrics?.instagram?.views || 0),
    0
  );
  const totalViews = totalTikTokViews + totalYouTubeViews + totalInstagramViews;

  const totalLikes = publishedPosts.reduce(
    (acc, p) =>
      acc +
      (p.metrics?.tiktok?.likes || 0) +
      (p.metrics?.youtube?.likes || 0) +
      (p.metrics?.instagram?.likes || 0),
    0
  );

  const totalShares = publishedPosts.reduce(
    (acc, p) =>
      acc +
      (p.metrics?.tiktok?.shares || 0) +
      (p.metrics?.instagram?.shares || 0),
    0
  );

  const blendedEngagementRate = totalViews > 0 ? ((totalLikes + totalShares) / totalViews) * 100 : 0;

  const handleRefreshHarvester = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Simulate new views increment
      setPosts((prev) =>
        prev.map((p) => {
          if (p.status !== 'PUBLISHED' || !p.metrics) return p;
          return {
            ...p,
            metrics: {
              tiktok: {
                ...p.metrics.tiktok!,
                views: p.metrics.tiktok!.views + Math.floor(Math.random() * 450 + 50),
                likes: p.metrics.tiktok!.likes + Math.floor(Math.random() * 40 + 5),
              },
              youtube: {
                ...p.metrics.youtube!,
                views: p.metrics.youtube!.views + Math.floor(Math.random() * 600 + 80),
                likes: p.metrics.youtube!.likes + Math.floor(Math.random() * 60 + 8),
              },
              instagram: {
                ...p.metrics.instagram!,
                views: p.metrics.instagram!.views + Math.floor(Math.random() * 300 + 40),
                likes: p.metrics.instagram!.likes + Math.floor(Math.random() * 30 + 4),
              },
            },
          };
        })
      );
      setIsRefreshing(false);
    }, 900);
  };

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0b0f17]">
      {/* Top Banner & Refresh Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Cross-Platform Performance & Analytics Tracker
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Harmonized telemetry synchronized from TikTok Open API v2, YouTube Data v3, and Meta Instagram Graph
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs text-slate-400 font-mono hidden sm:inline">
            Harvester Cycle: <span className="text-emerald-400">Every 6 Hours</span>
          </div>
          <button
            onClick={handleRefreshHarvester}
            disabled={isRefreshing}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Sync Live Metrics</span>
          </button>
        </div>
      </div>

      {/* Primary KPI Grid (High density, tabular nums) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#111726] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Omnichannel Views</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {totalViews.toLocaleString()}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+24.8% vs previous cycle</span>
          </div>
        </div>

        <div className="bg-[#111726] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Blended Engagement Rate</span>
            <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {blendedEngagementRate.toFixed(2)}%
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
            <span>Industry Benchmark: 4.8%</span>
          </div>
        </div>

        <div className="bg-[#111726] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Engagements</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {(totalLikes + totalShares).toLocaleString()}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2 font-mono">
            <span>Likes: {totalLikes.toLocaleString()}</span>
            <span>·</span>
            <span>Shares: {totalShares.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-[#111726] border border-slate-800/90 rounded-xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Leading Growth Channel</span>
            <Award className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2 mt-1">
            <span className="text-red-400">YouTube Shorts</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-2 font-mono">
            44.2% of all inbound impressions
          </div>
        </div>
      </div>

      {/* Platform Comparison Split Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* TikTok Card */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#25F4EE]/10 border border-[#25F4EE]/30 flex items-center justify-center font-bold text-xs text-[#25F4EE]">
                TT
              </div>
              <h3 className="text-sm font-bold text-white">TikTok Content Ingestion</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Open API v2</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Total Views:</span>
              <span className="font-bold text-white tabular-nums">{totalTikTokViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Share Ratio:</span>
              <span className="text-[#25F4EE] font-semibold">4.8% (Viral Velocity)</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Avg Completion:</span>
              <span className="text-white">34.2%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="bg-[#25F4EE] h-full" style={{ width: '33%' }} />
            </div>
          </div>
        </div>

        {/* YouTube Card */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center font-bold text-xs text-red-500">
                YT
              </div>
              <h3 className="text-sm font-bold text-white">YouTube Shorts Uploads</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Data API v3</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Total Views:</span>
              <span className="font-bold text-white tabular-nums">{totalYouTubeViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Subscriber Gain:</span>
              <span className="text-red-400 font-semibold">+842 Subscribers</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Avg Completion:</span>
              <span className="text-white">47.0%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="bg-red-500 h-full" style={{ width: '45%' }} />
            </div>
          </div>
        </div>

        {/* Instagram Card */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center font-bold text-xs text-pink-400">
                IG
              </div>
              <h3 className="text-sm font-bold text-white">Instagram Reels Container</h3>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Meta Graph v21</span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Total Plays:</span>
              <span className="font-bold text-white tabular-nums">{totalInstagramViews.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Saves Count:</span>
              <span className="text-pink-400 font-semibold">1,650 Saves</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span className="text-slate-400">Avg Completion:</span>
              <span className="text-white">31.0%</span>
            </div>
            <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden">
              <div className="bg-pink-500 h-full" style={{ width: '22%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Published Posts Telemetry Table */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">
            Active Multi-Platform Publication Registry
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {publishedPosts.length} Tracked Content Units
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
              <tr>
                <th className="py-3 px-4">Post Title & Tags</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">TikTok Views</th>
                <th className="py-3 px-4 text-right">YouTube Views</th>
                <th className="py-3 px-4 text-right">IG Plays</th>
                <th className="py-3 px-4 text-right">Total Aggregate</th>
                <th className="py-3 px-4 text-right">Blended ER</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {posts.map((post) => {
                const ttViews = post.metrics?.tiktok?.views || 0;
                const ytViews = post.metrics?.youtube?.views || 0;
                const igViews = post.metrics?.instagram?.views || 0;
                const totalItemViews = ttViews + ytViews + igViews;
                const totalItemEng =
                  (post.metrics?.tiktok?.likes || 0) +
                  (post.metrics?.youtube?.likes || 0) +
                  (post.metrics?.instagram?.likes || 0) +
                  (post.metrics?.tiktok?.shares || 0);

                const itemEr =
                  totalItemViews > 0
                    ? ((totalItemEng / totalItemViews) * 100).toFixed(1)
                    : '0.0';

                return (
                  <tr
                    key={post.id}
                    onClick={() => setSelectedPostId(post.id)}
                    className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                      selectedPostId === post.id ? 'bg-slate-800/30' : ''
                    }`}
                  >
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-semibold text-slate-200 truncate font-sans">
                        {post.title}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {post.tags.map((t) => `#${t}`).join(' ')}
                      </div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      {post.status === 'PUBLISHED' ? (
                        <span className="text-emerald-400 text-[11px] font-semibold">
                          Published
                        </span>
                      ) : (
                        <span className="text-amber-400 text-[11px] font-semibold">
                          Scheduled ({post.scheduledTime})
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {ttViews > 0 ? ttViews.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {ytViews > 0 ? ytViews.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-slate-300">
                      {igViews > 0 ? igViews.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums font-bold text-white">
                      {totalItemViews > 0 ? totalItemViews.toLocaleString() : '—'}
                    </td>
                    <td className="py-3 px-4 text-right tabular-nums text-rose-400 font-semibold">
                      {totalItemViews > 0 ? `${itemEr}%` : '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Heatmap & Optimal Scheduling Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Optimal Distribution Windows (Hourly Virality Index)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">EST Timezone</span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            {HOURLY_PERFORMANCE_HEATMAP.map((item) => (
              <div key={item.hour} className="flex items-center gap-3">
                <span className="w-12 text-slate-400">{item.hour}</span>
                <div className="flex-1 flex gap-1 h-3.5">
                  <div
                    className="bg-[#25F4EE] rounded-sm transition-all"
                    style={{ width: `${item.tiktok}%` }}
                    title={`TikTok: ${item.tiktok}/100`}
                  />
                  <div
                    className="bg-red-500 rounded-sm transition-all"
                    style={{ width: `${item.youtube}%` }}
                    title={`YouTube: ${item.youtube}/100`}
                  />
                  <div
                    className="bg-pink-500 rounded-sm transition-all"
                    style={{ width: `${item.instagram}%` }}
                    title={`Instagram: ${item.instagram}/100`}
                  />
                </div>
                <span className="w-8 text-right text-slate-300 tabular-nums">
                  {Math.round((item.tiktok + item.youtube + item.instagram) / 3)}
                </span>
              </div>
            ))}
          </div>

          <div className="p-3 bg-slate-900/60 rounded-lg text-xs text-slate-400 border border-slate-800 flex items-center justify-between">
            <span>Recommended n8n Schedule Cron:</span>
            <code className="text-amber-300 font-mono">0 13,17,21 * * *</code>
          </div>
        </div>

        {/* Video Retention Curves */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-sky-400" />
              <span>Audience Watch Retention Benchmarks (0s - 60s)</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Cross-Channel</span>
          </div>

          <div className="space-y-3 text-xs font-mono">
            {RETENTION_COMPARISON.map((ret) => (
              <div key={ret.interval} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Timestamp: {ret.interval}</span>
                  <div className="flex gap-4">
                    <span className="text-[#25F4EE]">TT: {ret.tiktok}%</span>
                    <span className="text-red-400">YT: {ret.youtube}%</span>
                    <span className="text-pink-400">IG: {ret.instagram}%</span>
                  </div>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden flex">
                  <div className="bg-red-500 h-full" style={{ width: `${ret.youtube}%` }} />
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            Shorts with high 0-5s retention on YouTube compound algorithmic recommendations faster than TikTok or Reels.
          </p>
        </div>
      </div>
    </div>
  );
};
