import React, { useState, useEffect } from 'react';
import { SimulationStep } from '../types/workflow';
import {
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  X,
  RefreshCw,
  ExternalLink,
  ChevronRight,
  Database,
  FileCode,
  Check
} from 'lucide-react';

interface SimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SimulatorModal: React.FC<SimulatorModalProps> = ({ isOpen, onClose }) => {
  const [selectedWorkflow, setSelectedWorkflow] = useState<'distribution' | 'analytics'>('distribution');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [finalReport, setFinalReport] = useState<any>(null);

  // Form Inputs
  const [title, setTitle] = useState('Top 3 n8n Automation Hacks to 10x Content Distribution');
  const [caption, setCaption] = useState(
    'Never publish videos manually again. In this workflow, n8n ingests 1 source file and schedules it across TikTok, YouTube Shorts, and Instagram Reels with full analytics tracking.'
  );
  const [mediaUrl, setMediaUrl] = useState('https://storage.googleapis.com/omnichannel-media-cdn/videos/n8n_demo_short_916.mp4');
  const [selectedPlatforms, setSelectedPlatforms] = useState({
    tiktok: true,
    youtube: true,
    instagram: true,
  });

  if (!isOpen) return null;

  const distributionPlan: Array<{ id: string; name: string; duration: number; summary: string }> = [
    {
      id: 'trigger',
      name: 'Trigger: Scheduled Cron / Webhook Event',
      duration: 350,
      summary: 'Triggered execution via cron interval (0 13,17,21 * * *). Payload verified.',
    },
    {
      id: 'transform',
      name: 'Code Node: Platform Formatter & Character Constraints',
      duration: 400,
      summary: 'Prepared TikTok (2.2k chars), YouTube Shorts (95 chars + #Shorts), and Instagram Reels captions.',
    },
    {
      id: 'tiktok_init',
      name: 'TikTok Open API: POST /v2/post/publish/video/init/',
      duration: 800,
      summary: 'Ingested media via PULL_FROM_URL. Received publish_id: v_pub_9847120938',
    },
    {
      id: 'tiktok_poll',
      name: 'TikTok Status Poller: POST /v2/post/publish/status/fetch/',
      duration: 700,
      summary: 'TikTok transcode completed. status: PUBLISH_COMPLETE.',
    },
    {
      id: 'youtube_upload',
      name: 'YouTube Data API v3: POST /upload/youtube/v3/videos',
      duration: 900,
      summary: 'Uploaded Shorts stream. Snippet tags applied. Video ID: yt_83xQ9L1a',
    },
    {
      id: 'ig_container',
      name: 'Meta Instagram Graph: POST /{user-id}/media (REELS)',
      duration: 650,
      summary: 'Created Reels container. Container ID: 179482910394819',
    },
    {
      id: 'ig_poll',
      name: 'Meta Instagram Graph: GET /{container-id}?fields=status_code',
      duration: 750,
      summary: 'Polled container transcoding state: FINISHED (200 OK)',
    },
    {
      id: 'ig_publish',
      name: 'Meta Instagram Graph: POST /{user-id}/media_publish',
      duration: 600,
      summary: 'Reel published to Feed & Reels shelf. Media ID: 18029384729104820',
    },
    {
      id: 'merge_registry',
      name: 'Code Node & Central DB: Save Publication Record',
      duration: 450,
      summary: 'Merged IDs into central registry row. Ready for 6-hour Analytics Harvester.',
    },
    {
      id: 'discord_alert',
      name: 'Notification: POST /discord-webhook',
      duration: 300,
      summary: 'Dispatched success embed card to growth team Discord channel.',
    },
  ];

  const analyticsPlan: Array<{ id: string; name: string; duration: number; summary: string }> = [
    {
      id: 'cron',
      name: 'Trigger: Recurring 6-Hour Harvester Cron',
      duration: 300,
      summary: 'Harvester triggered. Fetching active tracked posts for the last 30 days.',
    },
    {
      id: 'db_fetch',
      name: 'HTTP Request: Fetch 30-Day Active Posts',
      duration: 450,
      summary: 'Retrieved 12 active multi-platform publications from central storage.',
    },
    {
      id: 'tt_query',
      name: 'TikTok Video Query: POST /v2/video/list/',
      duration: 650,
      summary: 'Fetched 64,200 views, 5,120 likes, 1,420 shares.',
    },
    {
      id: 'yt_query',
      name: 'YouTube Statistics API: GET /youtube/v3/videos',
      duration: 700,
      summary: 'Fetched 88,400 views, 6,940 likes, 532 comments.',
    },
    {
      id: 'ig_query',
      name: 'Instagram Insights: GET /{media-id}/insights',
      duration: 600,
      summary: 'Fetched 42,900 plays, 36,200 reach, 1,240 saves.',
    },
    {
      id: 'normalize',
      name: 'Cross-Platform Normalizer & Virality Engine',
      duration: 400,
      summary: 'Aggregated total 195,500 views across 3 platforms. Engagement Rate: 9.2%.',
    },
    {
      id: 'viral_eval',
      name: 'IF Node: Check Viral Breakthrough (>15k views / >7.5% ER)',
      duration: 350,
      summary: 'Condition TRUE! Video is trending. Routed to high-priority alert branch.',
    },
    {
      id: 'slack_alert',
      name: 'Slack / Discord: Dispatch Viral Alert',
      duration: 350,
      summary: 'Pushed executive viral alert to #growth-breakouts channel.',
    },
  ];

  const currentPlan = selectedWorkflow === 'distribution' ? distributionPlan : analyticsPlan;

  const handleStartSimulation = async () => {
    setIsRunning(true);
    setFinalReport(null);
    setCurrentStepIndex(0);

    const initialSteps: SimulationStep[] = currentPlan.map((p) => ({
      nodeId: p.id,
      nodeName: p.name,
      status: 'pending',
      timestamp: '--',
      durationMs: p.duration,
    }));
    setSteps(initialSteps);

    for (let i = 0; i < currentPlan.length; i++) {
      setCurrentStepIndex(i);
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i ? { ...step, status: 'running' } : step
        )
      );

      await new Promise((res) => setTimeout(res, currentPlan[i].duration));

      const nowStr = new Date().toLocaleTimeString();
      setSteps((prev) =>
        prev.map((step, idx) =>
          idx === i
            ? {
                ...step,
                status: 'success',
                timestamp: nowStr,
                outputSummary: currentPlan[i].summary,
              }
            : step
        )
      );
    }

    setIsRunning(false);
    if (selectedWorkflow === 'distribution') {
      setFinalReport({
        content_id: 'post_live_' + Date.now().toString().slice(-6),
        status: 'DISPATCHED_SUCCESSFULLY',
        published_at: new Date().toISOString(),
        platforms: {
          tiktok: { id: 'tt_7392819283719', status: 'PUBLISHED', url: 'https://tiktok.com/@creator/video/7392819283719' },
          youtube: { id: 'yt_dQw4w9WgX01', status: 'PUBLISHED', url: 'https://youtube.com/shorts/dQw4w9WgX01' },
          instagram: { id: 'ig_1802938472910', status: 'PUBLISHED', url: 'https://instagram.com/reel/1802938472910' },
        },
      });
    } else {
      setFinalReport({
        harvest_cycle: 'COMPLETED_200_OK',
        total_tracked_posts: 12,
        cycle_views_harvested: 195500,
        blended_engagement_rate: '9.2%',
        top_platform: 'YOUTUBE_SHORTS',
        viral_alert_triggered: true,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Play className="w-4 h-4 fill-emerald-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">n8n Execution Simulator</h3>
              <p className="text-xs text-slate-400">
                Test and step through cross-platform API calls with realistic telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Mode Tabs */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Pipeline:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                disabled={isRunning}
                onClick={() => {
                  setSelectedWorkflow('distribution');
                  setSteps([]);
                  setFinalReport(null);
                }}
                className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedWorkflow === 'distribution'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Scheduled Distribution Flow
              </button>
              <button
                disabled={isRunning}
                onClick={() => {
                  setSelectedWorkflow('analytics');
                  setSteps([]);
                  setFinalReport(null);
                }}
                className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedWorkflow === 'analytics'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                6-Hour Analytics Harvester
              </button>
            </div>
          </div>

          <button
            onClick={handleStartSimulation}
            disabled={isRunning}
            className={`px-4 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-2 cursor-pointer transition-all ${
              isRunning
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-950'
            }`}
          >
            {isRunning ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>Run Test Execution</span>
              </>
            )}
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Custom Input parameters if distribution mode */}
          {selectedWorkflow === 'distribution' && (
            <div className="bg-slate-900/70 border border-slate-800/80 rounded-xl p-4 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                Test Ingestion Payload (Webhook / DB Queue)
              </span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Post Title</label>
                  <input
                    type="text"
                    disabled={isRunning}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Media CDN URL (9:16 Video)</label>
                  <input
                    type="text"
                    disabled={isRunning}
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-slate-400 text-xs block mb-1">Caption</label>
                <textarea
                  rows={2}
                  disabled={isRunning}
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          {/* Stepper Execution Log */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Step-by-Step Node Execution Telemetry
              </span>
              <span className="text-xs font-mono text-slate-500">
                {steps.filter((s) => s.status === 'success').length} / {currentPlan.length} Nodes Succeeded
              </span>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
              {currentPlan.map((planItem, idx) => {
                const step = steps[idx];
                const status = step?.status || 'pending';

                return (
                  <div
                    key={planItem.id}
                    className={`p-3.5 flex items-start gap-3 transition-colors ${
                      status === 'running'
                        ? 'bg-rose-950/20'
                        : status === 'success'
                        ? 'bg-slate-900/30'
                        : 'opacity-50'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      {status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : status === 'running' ? (
                        <RefreshCw className="w-4 h-4 text-rose-400 animate-spin" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border border-slate-700" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold text-slate-200">
                          {planItem.name}
                        </h4>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                          {status === 'running'
                            ? 'Processing...'
                            : status === 'success'
                            ? `${step.durationMs}ms`
                            : 'Pending'}
                        </span>
                      </div>
                      {step?.outputSummary && (
                        <p className="text-xs text-slate-400 mt-1 font-mono">
                          ↳ {step.outputSummary}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Final Output Report */}
          {finalReport && (
            <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  Pipeline Execution Complete & Verified
                </span>
              </div>
              <pre className="text-xs font-mono text-emerald-200 bg-slate-950/80 p-3 rounded-lg border border-emerald-900/50 overflow-x-auto leading-relaxed">
                {JSON.stringify(finalReport, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="h-14 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Base logic conformant to zie619.github.io/n8n-workflows architecture.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
