import React, { useState } from 'react';
import { INITIAL_SCHEDULED_POSTS } from '../data/mockAnalytics';
import { ScheduledPostItem } from '../types/workflow';
import {
  Clock,
  Calendar,
  Plus,
  Trash2,
  CheckCircle2,
  Copy,
  Check,
  Send,
  Webhook,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface WorkflowSchedulerProps {
  onSimulatePost: (post: ScheduledPostItem) => void;
}

export const WorkflowScheduler: React.FC<WorkflowSchedulerProps> = ({ onSimulatePost }) => {
  const [posts, setPosts] = useState<ScheduledPostItem[]>(INITIAL_SCHEDULED_POSTS);
  const [cronPreset, setCronPreset] = useState<'peak' | 'twice' | 'hourly' | 'custom'>('peak');
  const [customCron, setCustomCron] = useState('0 13,17,21 * * *');
  const [copiedWebhook, setCopiedWebhook] = useState(false);

  // New post modal / form state
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCaption, setNewCaption] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('Tomorrow at 1:00 PM EST');
  const [newTags, setNewTags] = useState('growth, automation, tips');

  const webhookEndpoint = 'https://n8n.yourdomain.com/webhook/publish-content';

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(webhookEndpoint);
    setCopiedWebhook(true);
    setTimeout(() => setCopiedWebhook(false), 2000);
  };

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newItem: ScheduledPostItem = {
      id: 'post_' + Date.now().toString().slice(-4),
      title: newTitle,
      caption: newCaption || 'Automated multi-platform distribution powered by n8n.',
      mediaUrl: newMediaUrl || 'https://storage.googleapis.com/omnichannel-media-cdn/videos/demo.mp4',
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
      scheduledTime: newScheduleTime,
      status: 'SCHEDULED',
      platforms: ['tiktok', 'youtube', 'instagram'],
    };

    setPosts([newItem, ...posts]);
    setNewTitle('');
    setNewCaption('');
    setNewMediaUrl('');
    setIsAdding(false);
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
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

  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#0b0f17]">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Schedule Engine & Queue Management
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure automated cron dispatch windows or push payloads via n8n Webhook Trigger
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-sm shadow-rose-950 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Queue New Content</span>
        </button>
      </div>

      {/* Scheduler Configuration Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cron Schedule Generator */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>n8n Schedule Trigger Cron Rule</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Active in Workflow</span>
          </div>

          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setCronPreset('peak');
                  setCustomCron('0 13,17,21 * * *');
                }}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  cronPreset === 'peak'
                    ? 'border-rose-500 bg-rose-500/10 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                3x Daily Peak
              </button>
              <button
                onClick={() => {
                  setCronPreset('twice');
                  setCustomCron('0 16,22 * * *');
                }}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  cronPreset === 'twice'
                    ? 'border-rose-500 bg-rose-500/10 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                2x Daily
              </button>
              <button
                onClick={() => {
                  setCronPreset('hourly');
                  setCustomCron('0 * * * *');
                }}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  cronPreset === 'hourly'
                    ? 'border-rose-500 bg-rose-500/10 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Hourly Queue
              </button>
              <button
                onClick={() => setCronPreset('custom')}
                className={`py-2 px-3 text-xs rounded-lg border text-center transition-colors cursor-pointer ${
                  cronPreset === 'custom'
                    ? 'border-rose-500 bg-rose-500/10 text-white font-semibold'
                    : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                }`}
              >
                Custom
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Cron Expression:</span>
              <code className="text-xs font-mono font-bold text-amber-300">
                {customCron}
              </code>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">{getCronDescription()}</p>
          </div>
        </div>

        {/* Webhook Instant Publish Trigger */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Webhook className="w-4 h-4 text-emerald-400" />
              <span>Headless CMS & Ingestion Webhook</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">POST Request</span>
          </div>

          <div className="space-y-3">
            <p className="text-xs text-slate-400 leading-relaxed">
              Trigger content publishing on-demand from Airtable automations, Notion databases, or backend microservices:
            </p>

            <div className="flex items-center gap-2 bg-slate-950 p-2.5 rounded-lg border border-slate-800">
              <code className="text-xs font-mono text-emerald-400 truncate flex-1 select-all">
                {webhookEndpoint}
              </code>
              <button
                onClick={handleCopyWebhook}
                className="px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors flex items-center gap-1 cursor-pointer shrink-0"
              >
                {copiedWebhook ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedWebhook ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500">
              Headers: Content-Type: application/json · Method: POST
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
            <h3 className="text-sm font-bold text-white">Queue New Content for Distribution</h3>
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
              <label className="text-slate-300 block mb-1 font-medium">Media CDN Video URL</label>
              <input
                type="text"
                placeholder="https://storage.googleapis.com/.../video.mp4"
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
              rows={2}
              placeholder="Write the universal body copy. The n8n format node will automatically format for TikTok, Shorts, and Reels."
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
            {posts.length} Items in Queue
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {posts.map((post) => (
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
                <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                  <span>Target: {post.scheduledTime}</span>
                  <span>·</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#25F4EE]">TikTok</span>
                    <span className="text-red-400">YouTube</span>
                    <span className="text-pink-400">Instagram</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => onSimulatePost(post)}
                  className="px-3 py-1.5 text-xs text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3 h-3 text-emerald-400" />
                  <span>Test Distribute</span>
                </button>
                <button
                  onClick={() => handleDeletePost(post.id)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors cursor-pointer rounded-lg hover:bg-slate-800"
                  title="Remove from queue"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
