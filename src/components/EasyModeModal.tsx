import React, { useState } from 'react';
import {
  X,
  Zap,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Download,
  RefreshCw,
  Key,
  ShieldCheck,
  Server,
  Sparkles,
  Youtube,
  Globe,
  Radio,
  FileCode2,
} from 'lucide-react';
import { useOmniFlow } from '../context/OmniFlowContext';
import { DISTRIBUTION_WORKFLOW, ANALYTICS_WORKFLOW, UNIFIED_MASTER_WORKFLOW } from '../data/n8nWorkflows';

interface EasyModeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EasyModeModal: React.FC<EasyModeModalProps> = ({ isOpen, onClose }) => {
  const { config, updateConfig, serviceStatuses, pingAllServices, isPingingServices } = useOmniFlow();

  const [copiedAction, setCopiedAction] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    n8nWebhookUrl: config.n8nWebhookUrl || 'http://localhost:5678/webhook/publish-content',
    n8nBaseUrl: config.n8nBaseUrl || 'http://localhost:5678',
    geminiApiKey: config.geminiApiKey || '',
    youtubeClientId: config.youtubeClientId || '',
    youtubeClientSecret: config.youtubeClientSecret || '',
    youtubeRefreshToken: config.youtubeRefreshToken || '',
    tiktokClientKey: config.tiktokClientKey || '',
    tiktokAccessToken: config.tiktokAccessToken || '',
    instagramAccountId: config.instagramAccountId || '',
    instagramAccessToken: config.instagramAccessToken || '',
    discordWebhookUrl: config.discordWebhookUrl || '',
  });

  if (!isOpen) return null;

  const n8nStatus = serviceStatuses['n8n']?.status || 'OFFLINE';

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAction(label);
    setTimeout(() => setCopiedAction(null), 2500);
  };

  const handleSave = () => {
    updateConfig(formData);
    pingAllServices();
    handleCopy('saved', 'saved');
  };

  const handleCopyAllWorkflows = () => {
    const combined = {
      name: "n8n-Social-OmniFlow-Suite",
      distribution: DISTRIBUTION_WORKFLOW,
      analytics: ANALYTICS_WORKFLOW,
      master: UNIFIED_MASTER_WORKFLOW,
      instructions: "Paste or import into your local n8n instance at http://localhost:5678"
    };
    handleCopy(JSON.stringify(combined, null, 2), 'workflows');
  };

  const generateEnvFileContent = () => {
    return `# ==============================================================================
# n8n Social OmniFlow - Generated Environment Configuration
# ==============================================================================

# --- AI & Application Hosting ---
GEMINI_API_KEY="${formData.geminiApiKey}"
VITE_GEMINI_API_KEY="${formData.geminiApiKey}"
APP_URL="http://localhost:3000"
PORT=3000
HOST="0.0.0.0"

# --- n8n Core Engine (Self-Hosted Docker / Local) ---
N8N_HOST="localhost"
N8N_PORT=5678
N8N_PROTOCOL="http"
WEBHOOK_URL="${formData.n8nWebhookUrl}"
N8N_DEFAULT_BINARY_DATA_MODE="filesystem"

# --- YouTube Data API v3 Credentials ---
YOUTUBE_CLIENT_ID="${formData.youtubeClientId}"
YOUTUBE_CLIENT_SECRET="${formData.youtubeClientSecret}"
YOUTUBE_REFRESH_TOKEN="${formData.youtubeRefreshToken}"

# --- TikTok Open API v2 Credentials ---
TIKTOK_CLIENT_KEY="${formData.tiktokClientKey}"
TIKTOK_ACCESS_TOKEN="${formData.tiktokAccessToken}"

# --- Meta Instagram Graph API v21.0 Credentials ---
INSTAGRAM_ACCOUNT_ID="${formData.instagramAccountId}"
INSTAGRAM_USER_ACCESS_TOKEN="${formData.instagramAccessToken}"

# --- Notifications & Dispatch Alerts ---
DISCORD_WEBHOOK_URL="${formData.discordWebhookUrl}"
`;
  };

  const handleDownloadEnv = () => {
    const content = generateEnvFileContent();
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '.env';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    handleCopy('env_download', 'env_download');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-[#0c1017] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-[#0d121c] to-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-rose-900/30">
              <Zap className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">1-Click Easy Mode & API Key Hub</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Zero Config Ready
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Direct links to developer portals, instant local engine connection, and auto-generated credentials.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => pingAllServices()}
              disabled={isPingingServices}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
              title="Ping All Services"
            >
              <RefreshCw className={`w-4 h-4 ${isPingingServices ? 'animate-spin text-rose-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Quickbar */}
        <div className="px-6 py-3 bg-[#080c13] border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="text-slate-400 font-medium">Platform Readiness:</span>
            
            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${n8nStatus === 'ONLINE' ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-rose-400'}`} />
              <span className={n8nStatus === 'ONLINE' ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                Local n8n: {n8nStatus}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${formData.geminiApiKey ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              <span className={formData.geminiApiKey ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                Gemini AI: {formData.geminiApiKey ? 'Active' : 'Missing'}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${formData.youtubeClientId ? 'bg-emerald-400' : 'bg-slate-600'}`} />
              <span className={formData.youtubeClientId ? 'text-emerald-400 font-medium' : 'text-slate-400'}>
                YouTube: {formData.youtubeClientId ? 'Linked' : 'Ready'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy('powershell -NoProfile -ExecutionPolicy Bypass -File setup.ps1', 'cmd')}
              className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedAction === 'cmd' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>Copy 1-Click Launcher</span>
            </button>
            <button
              onClick={handleCopyAllWorkflows}
              className="px-2.5 py-1 text-[11px] bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 rounded border border-rose-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedAction === 'workflows' ? <Check className="w-3 h-3 text-emerald-400" /> : <FileCode2 className="w-3 h-3" />}
              <span>Copy All Workflows</span>
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Engine Section */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">1. Local n8n Automation Engine</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="http://localhost:5678"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-indigo-300 hover:text-white bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>Open n8n Web UI</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Local Webhook URL
                </label>
                <input
                  type="text"
                  value={formData.n8nWebhookUrl}
                  onChange={(e) => setFormData({ ...formData, n8nWebhookUrl: e.target.value })}
                  placeholder="http://localhost:5678/webhook/publish-content"
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
                <p className="text-[10px] text-slate-500 mt-1">
                  Target for simulation dispatches and production content jobs.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fast Setup Options
                </label>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2.5 py-1.5 text-[11px] bg-[#0b0f17] border border-slate-800 rounded font-mono text-slate-300 truncate">
                      docker compose up -d
                    </code>
                    <button
                      onClick={() => handleCopy('docker compose up -d', 'docker')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                      title="Copy Docker command"
                    >
                      {copiedAction === 'docker' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-2.5 py-1.5 text-[11px] bg-[#0b0f17] border border-slate-800 rounded font-mono text-slate-300 truncate">
                      npx n8n
                    </code>
                    <button
                      onClick={() => handleCopy('npx n8n', 'npx')}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 cursor-pointer"
                      title="Copy npx command"
                    >
                      {copiedAction === 'npx' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Credentials */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">2. Google Gemini AI Studio</h3>
              </div>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 text-xs text-amber-300 hover:text-white bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded flex items-center gap-1 transition-colors"
              >
                <span>Get Free Gemini Key (1-Click)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Gemini API Key
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="password"
                  value={formData.geminiApiKey}
                  onChange={(e) => setFormData({ ...formData, geminiApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="flex-1 px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
                <button
                  onClick={() => {
                    updateConfig({ geminiApiKey: formData.geminiApiKey });
                    handleCopy('gemini', 'gemini');
                  }}
                  className="px-3 py-2 text-xs font-semibold bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
                >
                  {copiedAction === 'gemini' ? 'Saved!' : 'Save Key'}
                </button>
              </div>
              <p className="text-[10px] text-slate-500 mt-1">
                Powers the AI Title & Caption Studio in the Scheduler Queue. Free tier provides 15 RPM.
              </p>
            </div>
          </div>

          {/* YouTube Data API */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Youtube className="w-5 h-5 text-red-400" />
                <h3 className="text-sm font-bold text-white">3. YouTube Data API v3 (Shorts Uploads)</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://console.cloud.google.com/apis/library/youtube.googleapis.com"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>1. Enable API</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://console.cloud.google.com/apis/credentials"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-red-300 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>2. Credentials</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Client ID
                </label>
                <input
                  type="text"
                  value={formData.youtubeClientId}
                  onChange={(e) => setFormData({ ...formData, youtubeClientId: e.target.value })}
                  placeholder="439642...apps.googleusercontent.com"
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Google Client Secret
                </label>
                <input
                  type="password"
                  value={formData.youtubeClientSecret}
                  onChange={(e) => setFormData({ ...formData, youtubeClientSecret: e.target.value })}
                  placeholder="GOCSPX-..."
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* TikTok Open API */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Globe className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">4. TikTok Open API v2 (Direct Post)</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://developers.tiktok.com/apps"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>TikTok Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://developers.tiktok.com/doc/content-posting-api-get-started"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>Posting Guide</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  TikTok Client Key
                </label>
                <input
                  type="text"
                  value={formData.tiktokClientKey}
                  onChange={(e) => setFormData({ ...formData, tiktokClientKey: e.target.value })}
                  placeholder="aw..."
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  TikTok Access Token
                </label>
                <input
                  type="password"
                  value={formData.tiktokAccessToken}
                  onChange={(e) => setFormData({ ...formData, tiktokAccessToken: e.target.value })}
                  placeholder="act.example..."
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Meta Instagram Graph API */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Radio className="w-5 h-5 text-pink-400" />
                <h3 className="text-sm font-bold text-white">5. Meta Instagram Graph API v21.0 (Reels)</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://developers.facebook.com/apps"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>Meta Apps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                <a
                  href="https://developers.facebook.com/tools/explorer"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 text-xs text-pink-300 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded flex items-center gap-1 transition-colors"
                >
                  <span>Graph Explorer</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Instagram Business Account ID
                </label>
                <input
                  type="text"
                  value={formData.instagramAccountId}
                  onChange={(e) => setFormData({ ...formData, instagramAccountId: e.target.value })}
                  placeholder="1784140..."
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  User Access Token (Long-Lived)
                </label>
                <input
                  type="password"
                  value={formData.instagramAccessToken}
                  onChange={(e) => setFormData({ ...formData, instagramAccessToken: e.target.value })}
                  placeholder="EAA..."
                  className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Discord Alert Webhook */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">6. Notifications & Discord Webhook (Optional)</h3>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Discord Webhook URL
              </label>
              <input
                type="text"
                value={formData.discordWebhookUrl}
                onChange={(e) => setFormData({ ...formData, discordWebhookUrl: e.target.value })}
                placeholder="https://discord.com/api/webhooks/..."
                className="w-full px-3 py-2 text-xs bg-[#0b0f17] border border-slate-700 rounded-lg text-white font-mono focus:border-rose-500 focus:outline-none"
              />
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-[#080c13] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadEnv}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .env File</span>
            </button>
            <button
              onClick={() => handleCopy(generateEnvFileContent(), 'env_copy')}
              className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors flex items-center gap-2 cursor-pointer shadow-sm"
            >
              {copiedAction === 'env_copy' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>Copy .env</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              Dismiss
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 text-xs font-bold text-white bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 rounded-lg transition-all shadow-lg shadow-rose-900/40 cursor-pointer flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Save & Connect Everything</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
