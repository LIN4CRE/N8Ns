import React, { useState } from 'react';
import { N8NNode } from '../types/workflow';
import { X, Copy, Check, Terminal, FileCode, Sliders, ExternalLink } from 'lucide-react';

interface NodeDetailDrawerProps {
  node: N8NNode | null;
  onClose: () => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({ node, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'parameters' | 'json' | 'curl'>('parameters');

  if (!node) return null;

  const handleCopyJSON = () => {
    navigator.clipboard.writeText(JSON.stringify(node, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getCurlEquivalent = () => {
    const params = node.parameters || {};
    if (node.type.includes('httpRequest')) {
      const method = params.method || 'GET';
      const url = params.url || 'https://api.example.com';
      let cmd = `curl -X ${method} "${url}" \\\n  -H "Authorization: Bearer $ACCESS_TOKEN"`;
      if (params.headerParameters?.parameters) {
        params.headerParameters.parameters.forEach((h: any) => {
          cmd += ` \\\n  -H "${h.name}: ${h.value}"`;
        });
      }
      if (params.jsonBody) {
        cmd += ` \\\n  -d '${typeof params.jsonBody === 'string' ? params.jsonBody.trim() : JSON.stringify(params.jsonBody)}'`;
      }
      return cmd;
    }
    return `# This node is an n8n internal logic node (${node.type}).\n# Executed locally inside n8n runtime engine.`;
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[480px] bg-[#0f1422] border-l border-slate-800 shadow-2xl z-40 flex flex-col">
      {/* Header */}
      <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between">
        <div className="min-w-0 pr-4">
          <span className="text-[11px] font-mono text-rose-400 block truncate">
            {node.type}
          </span>
          <h3 className="text-base font-semibold text-white truncate">{node.name}</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-6 bg-slate-900/50">
        <button
          onClick={() => setActiveTab('parameters')}
          className={`py-3 text-xs font-medium border-b-2 mr-6 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'parameters'
              ? 'text-rose-400 border-rose-500 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Parameters</span>
        </button>
        <button
          onClick={() => setActiveTab('json')}
          className={`py-3 text-xs font-medium border-b-2 mr-6 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'json'
              ? 'text-rose-400 border-rose-500 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <FileCode className="w-3.5 h-3.5" />
          <span>n8n Node JSON</span>
        </button>
        <button
          onClick={() => setActiveTab('curl')}
          className={`py-3 text-xs font-medium border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'curl'
              ? 'text-rose-400 border-rose-500 font-semibold'
              : 'text-slate-400 border-transparent hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5" />
          <span>cURL Payload</span>
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        {node.notes && (
          <div className="bg-slate-900/80 border border-slate-800/90 rounded-lg p-3 text-xs text-slate-300 leading-relaxed">
            <span className="font-semibold text-rose-400 block mb-1">Architecture Note:</span>
            {node.notes}
          </div>
        )}

        {activeTab === 'parameters' && (
          <div className="space-y-4">
            {node.parameters.method && (
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  HTTP Method
                </label>
                <div className="text-xs font-mono font-semibold text-emerald-400 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 inline-block">
                  {node.parameters.method}
                </div>
              </div>
            )}

            {node.parameters.url && (
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Endpoint URL
                </label>
                <div className="text-xs font-mono text-slate-200 bg-slate-900 p-2.5 rounded border border-slate-800 break-all select-all">
                  {node.parameters.url}
                </div>
              </div>
            )}

            {node.parameters.jsCode && (
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  JavaScript Transform Code
                </label>
                <pre className="text-xs font-mono text-sky-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                  {node.parameters.jsCode}
                </pre>
              </div>
            )}

            {node.parameters.jsonBody && (
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Request JSON Body
                </label>
                <pre className="text-xs font-mono text-amber-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
                  {typeof node.parameters.jsonBody === 'string'
                    ? node.parameters.jsonBody
                    : JSON.stringify(node.parameters.jsonBody, null, 2)}
                </pre>
              </div>
            )}

            {node.parameters.queryParameters?.parameters && (
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Query Parameters
                </label>
                <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden text-xs">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                        <th className="py-2 px-3">Param</th>
                        <th className="py-2 px-3">Expression / Value</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {node.parameters.queryParameters.parameters.map((p: any, i: number) => (
                        <tr key={i} className="hover:bg-slate-800/40">
                          <td className="py-2 px-3 text-rose-300 font-semibold">{p.name}</td>
                          <td className="py-2 px-3 text-slate-300 break-all">{p.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {node.parameters.rule && (
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-slate-400 block mb-1">
                  Cron Rule
                </label>
                <div className="text-xs font-mono text-amber-400 bg-slate-900 p-2.5 rounded border border-slate-800">
                  {JSON.stringify(node.parameters.rule, null, 2)}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'json' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">Node schema ready to paste into n8n:</span>
              <button
                onClick={handleCopyJSON}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Node'}</span>
              </button>
            </div>
            <pre className="text-xs font-mono text-slate-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto max-h-[420px]">
              {JSON.stringify(node, null, 2)}
            </pre>
          </div>
        )}

        {activeTab === 'curl' && (
          <div className="space-y-2">
            <span className="text-xs text-slate-400">cURL reproduction for manual testing:</span>
            <pre className="text-xs font-mono text-emerald-300 bg-slate-950 p-3 rounded-lg border border-slate-800 overflow-x-auto whitespace-pre leading-relaxed">
              {getCurlEquivalent()}
            </pre>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500 font-mono">
          ID: {node.id} · v{node.typeVersion}
        </span>
        <button
          onClick={handleCopyJSON}
          className="px-4 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Node JSON'}</span>
        </button>
      </div>
    </div>
  );
};
