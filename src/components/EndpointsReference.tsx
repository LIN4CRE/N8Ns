import React, { useState } from 'react';
import { API_ENDPOINTS_DOCS } from '../data/apiDocs';
import { ApiEndpointDoc } from '../types/workflow';
import {
  BookOpen,
  Search,
  Copy,
  Check,
  ExternalLink,
  Code,
  Shield,
  Send,
  Sliders,
  Terminal,
  FileCode
} from 'lucide-react';

export const EndpointsReference: React.FC = () => {
  const [search, setSearch] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpointDoc>(API_ENDPOINTS_DOCS[0]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const filteredDocs = API_ENDPOINTS_DOCS.filter((doc) => {
    const matchesPlatform = platformFilter === 'all' || doc.platform.toLowerCase() === platformFilter.toLowerCase();
    const matchesSearch =
      doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.endpoint.toLowerCase().includes(search.toLowerCase()) ||
      doc.purpose.toLowerCase().includes(search.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-full overflow-hidden bg-[#0b0f17]">
      {/* Sidebar List of Endpoints */}
      <div className="w-full md:w-96 border-r border-slate-800 bg-[#0d121c] flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-400" />
              <span>Base Integration Endpoints</span>
            </h3>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              Production Verified
            </span>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search endpoints or parameters..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Platform Segmented Tabs */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            {['all', 'tiktok', 'youtube', 'instagram'].map((plat) => (
              <button
                key={plat}
                onClick={() => setPlatformFilter(plat)}
                className={`flex-1 py-1 rounded text-center capitalize transition-colors cursor-pointer ${
                  platformFilter === plat
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {plat}
              </button>
            ))}
          </div>
        </div>

        {/* List of items */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/80">
          {filteredDocs.map((doc, idx) => {
            const isSelected = selectedEndpoint.name === doc.name;
            const badgeColor =
              doc.platform === 'TikTok'
                ? 'text-[#25F4EE] border-[#25F4EE]/30 bg-[#25F4EE]/10'
                : doc.platform === 'YouTube'
                ? 'text-red-400 border-red-500/30 bg-red-500/10'
                : 'text-pink-400 border-pink-500/30 bg-pink-500/10';

            return (
              <div
                key={idx}
                onClick={() => setSelectedEndpoint(doc)}
                className={`p-3.5 hover:bg-slate-800/40 transition-colors cursor-pointer ${
                  isSelected ? 'bg-slate-800/60 border-l-2 border-rose-500' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeColor}`}>
                    {doc.platform}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {doc.method}
                  </span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 truncate">{doc.name}</h4>
                <p className="text-[11px] font-mono text-slate-400 truncate mt-0.5">
                  {doc.endpoint}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Endpoint Details View */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
        {/* Endpoint Header Card */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-6 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold font-mono px-2 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30">
                {selectedEndpoint.method}
              </span>
              <span className="text-xs font-mono text-slate-300 font-semibold select-all">
                {selectedEndpoint.endpoint}
              </span>
            </div>
            <a
              href="https://github.com/LIN4CRE/N8Ns"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium"
            >
              <span>Pattern: {selectedEndpoint.patternRef}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <h2 className="text-lg font-bold text-white">{selectedEndpoint.name}</h2>
          <p className="text-xs text-slate-300 leading-relaxed">{selectedEndpoint.purpose}</p>

          <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono border-t border-slate-800/80">
            <div className="flex items-center gap-1 text-slate-400">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Auth: {selectedEndpoint.auth}</span>
            </div>
            <div className="text-slate-500">·</div>
            <div className="text-slate-400">
              Scopes: <span className="text-emerald-400">{selectedEndpoint.scopes.join(', ')}</span>
            </div>
          </div>
        </div>

        {/* Headers & n8n Node Mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              Required Headers
            </span>
            <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800/80 overflow-x-auto">
              {JSON.stringify(selectedEndpoint.headers, null, 2)}
            </pre>
          </div>

          <div className="bg-[#111726] border border-slate-800 rounded-xl p-4 space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
              n8n Node Equivalent
            </span>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 text-xs font-mono text-rose-300 space-y-1">
              <div>{selectedEndpoint.n8nNodeEquivalent}</div>
              <div className="text-[11px] text-slate-400 font-sans mt-2">
                Configure via HTTP Request node credentials: predefined OAuth2 or Header Auth with access token variable.
              </div>
            </div>
          </div>
        </div>

        {/* Sample Request Payload */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-sky-400" />
              <span>Sample Request Payload / Body</span>
            </span>
            <button
              onClick={() =>
                handleCopy(
                  typeof selectedEndpoint.sampleRequest === 'string'
                    ? selectedEndpoint.sampleRequest
                    : JSON.stringify(selectedEndpoint.sampleRequest, null, 2),
                  'req'
                )
              }
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'req' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'req' ? 'Copied' : 'Copy Payload'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-amber-200 bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
            {typeof selectedEndpoint.sampleRequest === 'string'
              ? selectedEndpoint.sampleRequest
              : JSON.stringify(selectedEndpoint.sampleRequest, null, 2)}
          </pre>
        </div>

        {/* Sample Response Payload */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sample 200 OK API Response</span>
            </span>
            <button
              onClick={() =>
                handleCopy(JSON.stringify(selectedEndpoint.sampleResponse, null, 2), 'res')
              }
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'res' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'res' ? 'Copied' : 'Copy Response'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed">
            {JSON.stringify(selectedEndpoint.sampleResponse, null, 2)}
          </pre>
        </div>

        {/* n8n Code Snippet Expression */}
        <div className="bg-[#111726] border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <FileCode className="w-3.5 h-3.5 text-rose-400" />
              <span>n8n Code Node Transform Handler</span>
            </span>
            <button
              onClick={() => handleCopy(selectedEndpoint.n8nCodeSnippet, 'code')}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
            >
              {copiedKey === 'code' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'code' ? 'Copied' : 'Copy JS Code'}</span>
            </button>
          </div>
          <pre className="text-xs font-mono text-sky-300 bg-slate-950 p-4 rounded-lg border border-slate-800 overflow-x-auto leading-relaxed whitespace-pre">
            {selectedEndpoint.n8nCodeSnippet}
          </pre>
        </div>
      </div>
    </div>
  );
};
