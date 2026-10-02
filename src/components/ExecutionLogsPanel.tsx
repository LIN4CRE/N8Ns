import React, { useState } from 'react';
import { useOmniFlow } from '../context/OmniFlowContext';
import { ExecutionLogItem } from '../types/workflow';
import { PlatformExecutionMetrics } from './PlatformExecutionMetrics';
import {
  ListChecks,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  Search,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Layers,
  Filter,
  Trash2
} from 'lucide-react';

interface ExecutionLogsPanelProps {
  onOpenSimulatorForLog?: (log: ExecutionLogItem) => void;
}

export const ExecutionLogsPanel: React.FC<ExecutionLogsPanelProps> = ({ onOpenSimulatorForLog }) => {
  const { logs, clearExecutionLogs } = useOmniFlow();
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'SUCCESS' | 'WARNING' | 'ERROR'>('ALL');
  const [triggerFilter, setTriggerFilter] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [expandedLogId, setExpandedLogId] = useState<string | null>(logs[0]?.id || null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((item) => {
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchesTrigger = triggerFilter === 'ALL' || item.triggerType === triggerFilter;
    const matchesSearch =
      item.executionId.toLowerCase().includes(search.toLowerCase()) ||
      item.workflowName.toLowerCase().includes(search.toLowerCase()) ||
      (item.postTitle && item.postTitle.toLowerCase().includes(search.toLowerCase())) ||
      (item.errorMessage && item.errorMessage.toLowerCase().includes(search.toLowerCase()));

    return matchesStatus && matchesTrigger && matchesSearch;
  });

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: 'SUCCESS' | 'WARNING' | 'ERROR') => {
    if (status === 'SUCCESS') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>Success</span>
        </span>
      );
    }
    if (status === 'WARNING') {
      return (
        <span className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20 font-mono">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Warning (Retried)</span>
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 font-mono">
        <XCircle className="w-3.5 h-3.5" />
        <span>Failed</span>
      </span>
    );
  };

  const getPlatformChip = (p: any, idx: number) => {
    let color = 'text-slate-400 bg-slate-900 border-slate-800';
    if (p.status === 'SUCCESS') color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    if (p.status === 'RATE_LIMITED') color = 'text-red-400 bg-red-500/10 border-red-500/30';
    if (p.status === 'SKIPPED') color = 'text-slate-500 bg-slate-900 border-slate-800';

    return (
      <div
        key={idx}
        className={`px-2 py-0.5 rounded border text-[10px] font-mono flex items-center gap-1.5 ${color}`}
      >
        <span className="uppercase font-semibold">{p.platform}</span>
        {p.httpCode && <span className="opacity-75">[{p.httpCode}]</span>}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Platform Reliability & Execution Time Dashboard */}
      <PlatformExecutionMetrics logs={logs} />

      {/* Main Execution Logs Box */}
      <div className="bg-[#111726] border border-slate-800 rounded-xl overflow-hidden space-y-4">
        {/* Header & Controls */}
        <div className="p-5 border-b border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ListChecks className="w-4 h-4 text-rose-400" />
                <span>Historical Execution Logs Audit</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Audit log of automated cron triggers, webhook distributions, API responses, and error traces
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs font-mono text-slate-400">
                Total Logged Executions: <span className="text-white font-bold">{logs.length}</span>
              </div>
              {logs.length > 0 && (
                <button
                  onClick={clearExecutionLogs}
                  className="px-2.5 py-1 text-xs text-slate-400 hover:text-rose-400 bg-slate-900 border border-slate-800 rounded flex items-center gap-1 cursor-pointer"
                  title="Wipe audit log"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Clear Logs</span>
                </button>
              )}
            </div>
          </div>

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              {(['ALL', 'SUCCESS', 'WARNING', 'ERROR'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded transition-colors cursor-pointer text-xs ${
                    statusFilter === st
                      ? 'bg-rose-600 text-white font-semibold'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {st === 'ALL' ? 'All' : st}
                </button>
              ))}
            </div>

            {/* Trigger Filter */}
            <select
              value={triggerFilter}
              onChange={(e) => setTriggerFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-rose-500"
            >
              <option value="ALL">All Triggers</option>
              <option value="Schedule Trigger">Schedule Trigger</option>
              <option value="Webhook">Webhook</option>
              <option value="Manual Test">Manual Test</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search execution ID or error..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      </div>

      {/* Logs Table / List */}
      <div className="divide-y divide-slate-800/80">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No execution logs match the selected filter criteria.
          </div>
        ) : (
          filteredLogs.map((log) => {
            const isExpanded = expandedLogId === log.id;

            return (
              <div key={log.id} className="transition-colors hover:bg-slate-900/30">
                {/* Main Log Row */}
                <div
                  onClick={() => setExpandedLogId(isExpanded ? null : log.id)}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                >
                  <div className="flex items-start md:items-center gap-3 min-w-0 flex-1">
                    <div className="mt-0.5 md:mt-0">{getStatusBadge(log.status)}</div>

                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-white">
                          {log.executionId}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-xs font-medium text-slate-300 truncate">
                          {log.workflowName}
                        </span>
                        <span className="text-[11px] text-slate-400">·</span>
                        <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                          {log.triggerType}
                        </span>
                      </div>

                      {log.postTitle ? (
                        <p className="text-xs text-slate-400 truncate">
                          Post: <span className="text-slate-200">{log.postTitle}</span>
                        </p>
                      ) : (
                        <p className="text-xs text-slate-400 truncate font-mono">
                          {log.outputPayloadSummary}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right Meta & Expand Icon */}
                  <div className="flex items-center gap-3 shrink-0 self-end md:self-auto">
                    <div className="hidden sm:flex items-center gap-1.5">
                      {log.platforms.map((p, pIdx) => getPlatformChip(p, pIdx))}
                    </div>

                    <div className="text-right text-[11px] font-mono text-slate-400">
                      <div>{log.startTime}</div>
                      <div className="text-slate-500 tabular-nums">
                        {log.durationMs}ms · {log.nodesExecutedCount} nodes
                      </div>
                    </div>

                    <div className="text-slate-400 p-1">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Detailed Log Drawer */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 bg-slate-950/70 border-t border-slate-800/80 space-y-3 text-xs">
                    {/* Error Box if any */}
                    {log.errorMessage && (
                      <div className="bg-red-950/30 border border-red-500/40 rounded-lg p-3 text-red-300 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-red-400">
                          <XCircle className="w-4 h-4" />
                          <span>Error in Node: {log.errorNode || 'HTTP Request'}</span>
                        </div>
                        <p className="font-mono text-[11px] leading-relaxed select-all">
                          {log.errorMessage}
                        </p>
                      </div>
                    )}

                    {/* Platform Actions Breakdown */}
                    <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                        Platform Integration Responses
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 font-mono text-[11px]">
                        {log.platforms.map((p, idx) => (
                          <div
                            key={idx}
                            className="bg-slate-950 p-2 rounded border border-slate-800/80 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="uppercase font-bold text-slate-300">{p.platform}</span>
                              <span className={p.status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'}>
                                {p.status}
                              </span>
                            </div>
                            {p.id && (
                              <div className="text-slate-400 truncate">
                                ID: <span className="text-white">{p.id}</span>
                              </div>
                            )}
                            {p.message && (
                              <div className="text-slate-400 line-clamp-1">
                                {p.message}
                              </div>
                            )}
                            {p.retryAttempt && (
                              <div className="text-amber-400">
                                Retried: {p.retryAttempt}x
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Raw Telemetry Summary */}
                    {log.outputPayloadSummary && (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-slate-400 text-[11px]">
                          <span>Execution Output Summary:</span>
                          <button
                            onClick={() => handleCopy(log.outputPayloadSummary || '', log.id)}
                            className="text-rose-400 hover:text-rose-300 flex items-center gap-1 cursor-pointer"
                          >
                            {copiedId === log.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedId === log.id ? 'Copied' : 'Copy Payload'}</span>
                          </button>
                        </div>
                        <pre className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2.5 rounded border border-slate-800 overflow-x-auto whitespace-pre-wrap">
                          {log.outputPayloadSummary}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  </div>
  );
};
