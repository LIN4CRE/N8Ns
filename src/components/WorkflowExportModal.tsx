import React, { useState } from 'react';
import {
  DISTRIBUTION_WORKFLOW,
  ANALYTICS_WORKFLOW,
  UNIFIED_MASTER_WORKFLOW,
  ERROR_HANDLER_WORKFLOW
} from '../data/n8nWorkflows';
import { N8NWorkflowDefinition } from '../types/workflow';
import {
  X,
  Copy,
  Check,
  Download,
  FileCode,
  CheckCircle2,
  ExternalLink,
  Layers
} from 'lucide-react';

interface WorkflowExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialWorkflowId?: string;
}

export const WorkflowExportModal: React.FC<WorkflowExportModalProps> = ({
  isOpen,
  onClose,
  initialWorkflowId = 'wf_omnichannel_distribution_v1',
}) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState(initialWorkflowId);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  let currentWf: N8NWorkflowDefinition = DISTRIBUTION_WORKFLOW;
  if (selectedWorkflowId === 'wf_omnichannel_analytics_v1') {
    currentWf = ANALYTICS_WORKFLOW;
  } else if (selectedWorkflowId === 'wf_omnichannel_master_v1') {
    currentWf = UNIFIED_MASTER_WORKFLOW;
  } else if (selectedWorkflowId === 'wf_omnichannel_error_handler_v1') {
    currentWf = ERROR_HANDLER_WORKFLOW;
  }

  const jsonString = JSON.stringify(currentWf, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const filename = `${currentWf.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Download className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Export n8n Workflow JSON</h3>
              <p className="text-xs text-slate-400">
                100% compliant n8n JSON ready for instant import
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

        {/* Workflow Switcher Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select Workflow:</span>
            <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setSelectedWorkflowId('wf_omnichannel_distribution_v1')}
                className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedWorkflowId === 'wf_omnichannel_distribution_v1'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Distribution Flow
              </button>
              <button
                onClick={() => setSelectedWorkflowId('wf_omnichannel_analytics_v1')}
                className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedWorkflowId === 'wf_omnichannel_analytics_v1'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Analytics Harvester
              </button>
              <button
                onClick={() => setSelectedWorkflowId('wf_omnichannel_master_v1')}
                className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedWorkflowId === 'wf_omnichannel_master_v1'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Master Full Loop
              </button>
              <button
                onClick={() => setSelectedWorkflowId('wf_omnichannel_error_handler_v1')}
                className={`px-3 py-1 text-xs rounded transition-colors cursor-pointer ${
                  selectedWorkflowId === 'wf_omnichannel_error_handler_v1'
                    ? 'bg-rose-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Error Recovery Hook
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy JSON'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-4 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-rose-950"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>

        {/* JSON Viewer */}
        <div className="flex-1 overflow-hidden p-6 flex flex-col space-y-4">
          {/* Quick Import Instructions */}
          <div className="p-3.5 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>How to import in n8n:</strong> Open your n8n workspace, press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-rose-300">Ctrl + V</kbd> or <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-[11px] font-mono text-rose-300">Cmd + V</kbd> directly on the canvas, or go to <em>Workflows</em> → <em>Import from File</em>.
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-auto bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300">
            <pre className="overflow-x-auto whitespace-pre leading-relaxed">{jsonString}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="h-14 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            {currentWf.nodes.length} Nodes · {Object.keys(currentWf.connections).length} Connections · Schema v1
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
