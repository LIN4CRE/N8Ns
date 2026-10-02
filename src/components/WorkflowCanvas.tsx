import React, { useState, useMemo } from 'react';
import { N8NWorkflowDefinition, N8NNode, PlatformType, WorkflowSnapshot } from '../types/workflow';
import { SnapshotManagerModal } from './SnapshotManagerModal';
import {
  Play,
  Clock,
  Webhook,
  FileCode,
  Send,
  Layers,
  CheckCircle2,
  Settings,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Copy,
  ExternalLink,
  ChevronRight,
  Database,
  History,
  Camera,
  RotateCcw
} from 'lucide-react';

interface WorkflowCanvasProps {
  currentWorkflow: N8NWorkflowDefinition;
  onSelectWorkflow: (id: string) => void;
  availableWorkflows: { id: string; name: string; category: string }[];
  onSelectNode: (node: N8NNode) => void;
  selectedNode: N8NNode | null;
  onSimulate: () => void;
  onExport: () => void;
  snapshots: WorkflowSnapshot[];
  activeSnapshotId: string | null;
  onSaveSnapshot: (name: string, note: string) => void;
  onRevertSnapshot: (snapshot: WorkflowSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
}

export const WorkflowCanvas: React.FC<WorkflowCanvasProps> = ({
  currentWorkflow,
  onSelectWorkflow,
  availableWorkflows,
  onSelectNode,
  selectedNode,
  onSimulate,
  onExport,
  snapshots,
  activeSnapshotId,
  onSaveSnapshot,
  onRevertSnapshot,
  onDeleteSnapshot,
}) => {
  const [zoom, setZoom] = useState(0.85);
  const [pan, setPan] = useState({ x: 40, y: 30 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [platformFilter, setPlatformFilter] = useState<PlatformType | 'all'>('all');
  const [isSnapshotModalOpen, setIsSnapshotModalOpen] = useState(false);
  const [quickSnapshotSuccess, setQuickSnapshotSuccess] = useState(false);

  const handleQuickSnapshot = () => {
    const timestampStr = new Date().toLocaleTimeString();
    onSaveSnapshot(`Snapshot at ${timestampStr}`, 'Quick checkpoint from canvas toolbar');
    setQuickSnapshotSuccess(true);
    setTimeout(() => setQuickSnapshotSuccess(false), 2000);
  };

  const nodes = currentWorkflow.nodes;

  // Filter nodes if platform filter is active
  const filteredNodes = useMemo(() => {
    if (platformFilter === 'all') return nodes;
    return nodes.filter(
      (n) => n.platform === platformFilter || n.platform === 'general'
    );
  }, [nodes, platformFilter]);

  // Compute connections coordinates
  const connectionsList = useMemo(() => {
    const list: { from: N8NNode; to: N8NNode }[] = [];
    const nodeMap = new Map<string, N8NNode>();
    nodes.forEach((n) => nodeMap.set(n.name, n));

    const connections = currentWorkflow.connections;
    for (const [sourceName, sourceConns] of Object.entries(connections)) {
      const sourceNode = nodeMap.get(sourceName);
      if (!sourceNode) continue;

      if (sourceConns.main) {
        sourceConns.main.forEach((branch) => {
          branch.forEach((targetConn) => {
            const targetNode = nodeMap.get(targetConn.node);
            if (targetNode) {
              list.push({ from: sourceNode, to: targetNode });
            }
          });
        });
      }
    }
    return list;
  }, [nodes, currentWorkflow.connections]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.workflow-node')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const getNodeIcon = (type: string, platform?: string) => {
    if (type.includes('schedule')) return <Clock className="w-4 h-4 text-amber-400" />;
    if (type.includes('webhook')) return <Webhook className="w-4 h-4 text-emerald-400" />;
    if (type.includes('code')) return <FileCode className="w-4 h-4 text-sky-400" />;
    if (type.includes('googleSheets') || type.includes('storage')) return <Database className="w-4 h-4 text-emerald-400" />;
    if (type.includes('if')) return <Settings className="w-4 h-4 text-amber-300" />;
    if (type.includes('wait')) return <Clock className="w-4 h-4 text-orange-400" />;
    
    // Platform icons
    if (platform === 'tiktok') return <span className="font-bold text-xs text-[#25F4EE]">TT</span>;
    if (platform === 'youtube') return <span className="font-bold text-xs text-red-500">YT</span>;
    if (platform === 'instagram') return <span className="font-bold text-xs text-pink-500">IG</span>;

    return <Send className="w-4 h-4 text-rose-400" />;
  };

  const getPlatformBadge = (platform?: string) => {
    if (platform === 'tiktok') return 'TikTok v2';
    if (platform === 'youtube') return 'YouTube v3';
    if (platform === 'instagram') return 'Meta IG v21';
    return 'Core Engine';
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0f17] select-none overflow-hidden relative">
      {/* Workflow Switcher & Toolbar Bar */}
      <div className="h-14 px-6 border-b border-slate-800/80 bg-[#0f1422] flex items-center justify-between z-20 gap-4">
        {/* Workflow Selector Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2 hidden sm:inline">
            Workflow:
          </span>
          <div className="flex items-center bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            {availableWorkflows.map((wf) => (
              <button
                key={wf.id}
                onClick={() => onSelectWorkflow(wf.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                  currentWorkflow.id === wf.id
                    ? 'bg-rose-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {wf.name}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Branch Filter & Zoom Controls */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setPlatformFilter('all')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer ${
                platformFilter === 'all'
                  ? 'bg-slate-700 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All Nodes ({nodes.length})
            </button>
            <button
              onClick={() => setPlatformFilter('tiktok')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                platformFilter === 'tiktok'
                  ? 'bg-slate-700 text-[#25F4EE] font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#25F4EE]" />
              TikTok
            </button>
            <button
              onClick={() => setPlatformFilter('youtube')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                platformFilter === 'youtube'
                  ? 'bg-slate-700 text-red-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              YouTube
            </button>
            <button
              onClick={() => setPlatformFilter('instagram')}
              className={`px-2.5 py-1 text-xs rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                platformFilter === 'instagram'
                  ? 'bg-slate-700 text-pink-400 font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-pink-400" />
              Instagram
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setZoom((z) => Math.max(0.4, z - 0.1))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono tabular-nums text-slate-400 px-1.5">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(1.5, z + 0.1))}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setZoom(0.85);
                setPan({ x: 40, y: 30 });
              }}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition-colors cursor-pointer"
              title="Reset view"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Snapshot Checkpoint Controls */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setIsSnapshotModalOpen(true)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-sky-400 hover:text-sky-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Manage workflow snapshots & revert"
            >
              <History className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Snapshots</span>
              <span className="font-mono text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.2 rounded">
                {snapshots.length}
              </span>
            </button>

            <button
              onClick={handleQuickSnapshot}
              className="p-1.5 text-xs rounded-lg border border-slate-800 bg-slate-900/90 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="Save current state as quick snapshot"
            >
              {quickSnapshotSuccess ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Camera className="w-3.5 h-3.5 text-slate-400 hover:text-white" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Canvas Area with Dot Grid */}
      <div
        className="flex-1 w-full h-full relative cursor-grab active:cursor-grabbing overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          backgroundImage: `radial-gradient(circle, rgba(148, 163, 184, 0.15) 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      >
        <div
          className="absolute origin-top-left transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            width: '2800px',
            height: '1400px',
          }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 pointer-events-none w-full h-full">
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#ef4444" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {connectionsList.map((conn, idx) => {
              const startX = conn.from.position[0] + 250;
              const startY = conn.from.position[1] + 45;
              const endX = conn.to.position[0];
              const endY = conn.to.position[1] + 45;
              const deltaX = Math.max(40, (endX - startX) * 0.5);

              const pathD = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;

              return (
                <g key={`conn-${idx}`}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke="#1e293b"
                    strokeWidth="4"
                  />
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      conn.from.platform === 'tiktok'
                        ? '#06b6d4'
                        : conn.from.platform === 'youtube'
                        ? '#ef4444'
                        : conn.from.platform === 'instagram'
                        ? '#ec4899'
                        : '#64748b'
                    }
                    strokeWidth="2"
                    strokeDasharray="5,4"
                    className="opacity-75"
                  />
                </g>
              );
            })}
          </svg>

          {/* n8n Node Blocks */}
          {nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isDimmed =
              platformFilter !== 'all' &&
              node.platform !== platformFilter &&
              node.platform !== 'general';

            let platformBorder = 'border-slate-800 hover:border-slate-700';
            if (isSelected) {
              platformBorder = 'border-rose-500 ring-2 ring-rose-500/30 shadow-lg shadow-rose-950/40';
            } else if (node.platform === 'tiktok') {
              platformBorder = 'hover:border-[#25F4EE]/60';
            } else if (node.platform === 'youtube') {
              platformBorder = 'hover:border-red-500/60';
            } else if (node.platform === 'instagram') {
              platformBorder = 'hover:border-pink-500/60';
            }

            return (
              <div
                key={node.id}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectNode(node);
                }}
                className={`workflow-node absolute w-[250px] bg-[#111726] rounded-xl border transition-all duration-150 cursor-pointer ${platformBorder} ${
                  isDimmed ? 'opacity-30' : 'opacity-100 shadow-md'
                }`}
                style={{
                  left: `${node.position[0]}px`,
                  top: `${node.position[1]}px`,
                }}
              >
                {/* Node Header */}
                <div className="p-3.5 flex items-start gap-3 border-b border-slate-800/80">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
                    {getNodeIcon(node.type, node.platform)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-semibold text-slate-100 truncate">
                      {node.name}
                    </h4>
                    <p className="text-[10px] text-slate-400 font-mono truncate">
                      {node.type.replace('n8n-nodes-base.', '')}
                    </p>
                  </div>
                </div>

                {/* Node Details Footer */}
                <div className="px-3.5 py-2.5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-900/40 rounded-b-xl">
                  <span className="font-mono text-[10px]">
                    {getPlatformBadge(node.platform)}
                  </span>
                  <div className="flex items-center gap-1.5 text-rose-400 text-[10px] font-medium hover:text-rose-300">
                    <span>Inspect</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Left/Right Connection Port Bullets */}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-slate-700 border-2 border-[#111726]" />
                <div className="absolute -right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-500 border-2 border-[#111726]" />
              </div>
            );
          })}
        </div>

        {/* Floating Quick Action Footer Card */}
        <div className="absolute bottom-6 left-6 right-6 max-w-2xl bg-[#0f1422]/95 border border-slate-800/90 backdrop-blur rounded-xl p-4 shadow-xl flex items-center justify-between gap-4 z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-white">
                {currentWorkflow.name}
              </span>
              <span className="text-[11px] text-slate-400">·</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Ready to Import in n8n
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
              {currentWorkflow.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onSimulate}
              className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              <span>Simulate</span>
            </button>
            <button
              onClick={onExport}
              className="px-3 py-1.5 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Copy className="w-3 h-3" />
              <span>Copy JSON</span>
            </button>
          </div>
        </div>
      </div>

      {/* Snapshot Manager Modal */}
      <SnapshotManagerModal
        isOpen={isSnapshotModalOpen}
        onClose={() => setIsSnapshotModalOpen(false)}
        snapshots={snapshots}
        activeSnapshotId={activeSnapshotId}
        onSaveSnapshot={onSaveSnapshot}
        onRevertSnapshot={onRevertSnapshot}
        onDeleteSnapshot={onDeleteSnapshot}
        currentWorkflow={currentWorkflow}
      />
    </div>
  );
};
