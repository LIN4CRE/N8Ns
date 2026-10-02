import React, { useState } from 'react';
import { ScheduledPostItem } from '../types/workflow';
import { BulkScheduleModal } from './BulkScheduleModal';
import { useOmniFlow } from '../context/OmniFlowContext';
import {
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Webhook,
  Sparkles,
  Zap,
  RefreshCw,
  FileSpreadsheet,
  AlertCircle,
  ExternalLink,
  Sliders
} from 'lucide-react';

interface WorkflowSchedulerProps {
  onSimulatePost: (post: ScheduledPostItem) => void;
}

export const WorkflowScheduler: React.FC<WorkflowSchedulerProps> = ({ onSimulatePost }) => {
  const {
    posts,
    addPost,
    deletePost,
    clearPosts,
    resetDefaultPosts,
    config,
    updateConfig,
    dispatchLiveWebhook,
    generateAiPostContent,
    serviceStatuses,
  } = useOmniFlow();

  const [cronPreset, setCronPreset] = useState<'peak' | 'twice' | 'hourly' | 'custom'>('peak');
  const [customCron, setCustomCron] = useState('0 13,17,21 * * *');
  const [copiedWebhook, setCopiedWebhook] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);

  // New post modal / form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('Today at 1:00 PM EST');
  const [newTags, setNewTags] = useState('growth, automation, tech');

  // AI Assistant State
  const [aiTopic, setAiTopic] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  // Live dispatch state
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [dispatchResult, setDispatchResult] = useState<{ id: string; success: boolean; message: string } | null>(null);

  // Webhook URL inline editing
  const [editingWebhook, setEditingWebhook] = useState(false);
  const [tempWebhookUrl, setTempWebhookUrl] = useState(config.n8nWebhookUrl);

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(config.n8nWebhookUrl);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleSaveWebhook = () => {
    updateConfig({ n8nWebhookUrl: tempWebhookUrl });
    setEditingWebhook(false);
  };

  const handleBulkAdd = (newPosts: ScheduledPostItem[]) => {
    for (const p of newPosts) {
      addPost(p);
    }
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addPost({
      title: newTitle.trim(),
      caption: newCaption.trim() || 'Automated multi-platform distribution powered by n8n.',
      mediaUrl: newMediaUrl.trim() || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      tags: newTags.split(',').map((t) => t.trim().replace(/^#/, '')).filter(Boolean),
      scheduledTime: newScheduleTime,
      status: 'SCHEDULED',
      platforms: ['tiktok', 'youtube', 'instagram'],
    });

    setNewTitle('');
    setNewCaption('');
    setNewMediaUrl('');
    setIsAdding(false);
  };

  const handleGenerateWithAi = async () => {
    if (!aiTopic.trim()) return;
    setIsGeneratingAi(true);
    setAiSuccessMessage('');
    try {
      const generated = await generateAiPostContent(aiTopic);
      setNewTitle(generated.title);
      setNewCaption(generated.caption);
      setNewTags(generated.tags.join(', '));
      setNewScheduleTime(generated.recommendedHour);
      setIsAdding(true);
      setAiSuccessMessage('Generated post parameters from Gemini AI!');
      setTimeout(() => setAiSuccessMessage(''), 4000);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleDispatchLive = async (post: ScheduledPostItem) => {
    setDispatchingId(post.id);
    setDispatchResult(null);
    try {
      const result = await dispatchLiveWebhook(post);
      setDispatchResult({
        id: post.id,
        success: result.success,
        message: result.message,
      });
      setTimeout(() => setDispatchResult(null), 6000);
    } finally {
      setDispatchingId(null);
    }
  };

  const getCronDescription = () => {
    switch (cronPreset) {
      case 'peak':
        return 'Fires daily at 9:00 AM, 1:00 PM, and 5:00 PM EST (Peak social virality windows).';
      case 'twice':
        return 'Fires daily at 12:00 PM and 6:00 PM EST.';
      case 'hourly':
        return 'Fires at the start of every hour (0 * * * *).';
      default:
        return `Custom Expression: ${customCron}`;
    }
  };

  const n8nStatus = serviceStatuses.n8n?.status || 'UNKNOWN';

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0b0f17]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <span>Schedule Engine & Queue Management</span>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded border uppercase ${
                n8nStatus === 'ONLINE'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                  : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              }`}
            >
              n8n: {n8nStatus}
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated cron dispatch windows or push payloads live via n8n Webhook Trigger
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {posts.length > 0 ? (
            <button
              onClick={clearPosts}
              className="px-3 py-1.5 text-xs font-semibold text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 hover:border-rose-900/50 rounded-lg transition-colors cursor-pointer"
              title="Wipe queue to start completely fresh with zero sample items"
            >
              Clear Queue
            </button>
          ) : (
            <button
              onClick={resetDefaultPosts}
              className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              Load Starter Queue
            </button>
          )}

          <button
            onClick={() => setIsBulkModalOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Bulk CSV</span>
          </button>

          <button
            onClick={() => setIsAdding(!isAdding)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-950"
          >
            <Plus className="w-4 h-4" />
            <span>Queue New Content</span>
          </button>
        </div>
      </div>

      {/* AI Content Generation Assistant Bar */}
      <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-rose-950/40 border border-purple-500/30 rounded-xl p-4 shadow-lg">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span>Gemini AI Content Generator</span>
                <span className="text-[10px] text-purple-400 font-mono font-normal">v2.5 Flash</span>
              </h4>
              <p className="text-xs text-slate-400">
                Type any video topic or concept to generate optimized titles, hooks, and hashtags instantly.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-1 md:max-w-md">
            <input
              type="text"
              placeholder="e.g. 3 n8n hacks to automate social publishing"
              value={aiTopic}
              onChange={(e) => setAiTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleGenerateWithAi()}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-purple-500"
            />
            <button
              onClick={handleGenerateWithAi}
              disabled={isGeneratingAi || !aiTopic.trim()}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-500 disabled:opacity-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              {isGeneratingAi ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>{isGeneratingAi ? 'Generating...' : 'Generate'}</span>
            </button>
          </div>
        </div>

        {aiSuccessMessage && (
          <div className="mt-2.5 text-xs text-emerald-400 flex items-center gap-1.5 font-medium animate-pulse">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{aiSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Global Dispatch Result Notification */}
      {dispatchResult && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs ${
            dispatchResult.success
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {dispatchResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            )}
            <span>{dispatchResult.message}</span>
          </div>
          <span className="text-[11px] font-mono opacity-75">Recorded to Execution Logs</span>
        </div>
      )}

      {/* Trigger Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cron Interval Box */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-rose-400" />
              <span>Cron Schedule Engine (Active Node)</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Active
            </span>
          </div>

          <div className="space-y-3">
            <label className="text-xs text-slate-400 block font-medium">Select Virality Window</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {(['peak', 'twice', 'hourly', 'custom'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setCronPreset(mode)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer capitalize ${
                    cronPreset === mode
                      ? 'bg-rose-600/20 border-rose-500 text-white font-semibold'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {mode === 'peak' ? 'Peak (3x/day)' : mode}
                </button>
              ))}
            </div>

            {cronPreset === 'custom' && (
              <div className="pt-2">
                <label className="text-xs text-slate-400 block mb-1 font-medium">Custom Cron Expression</label>
                <input
                  type="text"
                  value={customCron}
                  onChange={(e) => setCustomCron(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-xs text-rose-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            )}

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs text-slate-300">
              <div className="font-semibold text-rose-400 mb-1">Execution Rule:</div>
              <div>{getCronDescription()}</div>
            </div>
          </div>
        </div>

        {/* Webhook Endpoint Box */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-emerald-400" />
              <span>Headless CMS & Ingestion Webhook</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">POST Endpoint</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Trigger instant multi-platform publishing on-demand from Airtable, Notion, or external webhooks:
            </p>

            {editingWebhook ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempWebhookUrl}
                  onChange={(e) => setTempWebhookUrl(e.target.value)}
                  className="flex-1 bg-slate-950 border border-emerald-500 rounded-lg px-3 py-1.5 font-mono text-xs text-emerald-300 focus:outline-none"
                />
                <button
                  onClick={handleSaveWebhook}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingWebhook(false)}
                  className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <code className="text-xs font-mono text-emerald-400 truncate flex-1 select-all">
                  {config.n8nWebhookUrl}
                </code>
                <button
                  onClick={() => {
                    setTempWebhookUrl(config.n8nWebhookUrl);
                    setEditingWebhook(true);
                  }}
                  className="px-2 py-1 text-xs text-slate-400 hover:text-white rounded hover:bg-slate-800 cursor-pointer shrink-0"
                >
                  Edit
                </button>
                <button
                  onClick={handleCopyWebhook}
                  className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                >
                  {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}

            <div className="text-[11px] font-mono text-slate-500 flex items-center justify-between">
              <span>Headers: Content-Type: application/json · Method: POST</span>
              <span className={n8nStatus === 'ONLINE' ? 'text-emerald-400' : 'text-slate-500'}>
                Target: {config.n8nBaseUrl}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Post Form Accordion */}
      {isAdding && (
        <form
          onSubmit={handleAddPost}
          className="bg-[#111726] border border-rose-500/40 rounded-xl p-5 space-y-4 shadow-xl"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Queue New Content for Distribution</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Post Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Master n8n Automation Workflows in 2026"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Scheduled Time</label>
              <input
                type="text"
                value={newScheduleTime}
                onChange={(e) => setNewScheduleTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="text-slate-300 block mb-1 font-medium">Direct Video URL</label>
              <input
                type="text"
                placeholder="https://commondatastorage.googleapis.com/.../sample.mp4"
                value={newMediaUrl}
                onChange={(e) => setNewMediaUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 font-mono text-[11px] text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="text-slate-300 block mb-1 font-medium">Hashtags (comma separated)</label>
              <input
                type="text"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 text-xs block mb-1 font-medium">Caption Copy</label>
            <textarea
              rows={3}
              placeholder="Write your universal body copy. The n8n format node will automatically tailor character limits and platform tags for TikTok, Shorts, and Reels."
              value={newCaption}
              onChange={(e) => setNewCaption(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-1.5 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
            >
              Add to Queue
            </button>
          </div>
        </form>
      )}

      {/* Content Distribution Queue */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-rose-400" />
            <h3 className="text-sm font-bold text-white">Scheduled Distribution Queue</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {posts.length} {posts.length === 1 ? 'Item' : 'Items'} in Queue
          </span>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Queue is currently empty</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                You have a clean slate! Add a new video post above, import a CSV batch, or load starter templates.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setIsAdding(true)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors cursor-pointer"
              >
                Add First Post
              </button>
              <button
                onClick={resetDefaultPosts}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
              >
                Load Starter Templates
              </button>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {posts.map((post) => {
              const isDispatching = dispatchingId === post.id;
              return (
                <div
                  key={post.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/40 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-semibold text-slate-200 truncate">{post.title}</h4>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          post.status === 'PUBLISHED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        }`}
                      >
                        {post.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-1">{post.caption}</p>
                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1 flex-wrap">
                      <span>Target: {post.scheduledTime}</span>
                      <span>·</span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#25F4EE]">TikTok</span>
                        <span className="text-red-400">YouTube</span>
                        <span className="text-pink-400">Instagram</span>
                      </div>
                      {post.mediaUrl && (
                        <>
                          <span>·</span>
                          <span className="text-slate-400 truncate max-w-[200px]" title={post.mediaUrl}>
                            {post.mediaUrl}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleDispatchLive(post)}
                      disabled={isDispatching}
                      className="px-3 py-1.5 text-xs text-white bg-emerald-600/90 hover:bg-emerald-500 border border-emerald-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-emerald-950/40"
                      title="Send real POST request to n8n Webhook right now"
                    >
                      {isDispatching ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Zap className="w-3 h-3" />}
                      <span>{isDispatching ? 'Dispatching...' : 'Dispatch to n8n'}</span>
                    </button>

                    <button
                      onClick={() => onSimulatePost(post)}
                      className="px-3 py-1.5 text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Send className="w-3 h-3 text-slate-300" />
                      <span>Simulate</span>
                    </button>

                    <button
                      onClick={() => deletePost(post.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
                      title="Remove from queue"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bulk Scheduling Modal */}
      <BulkScheduleModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onBulkAdd={handleBulkAdd}
      />
    </div>
  );
};
