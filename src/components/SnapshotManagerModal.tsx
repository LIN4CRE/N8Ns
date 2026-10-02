import React, { useState } from 'react';
import { WorkflowSnapshot, N8NWorkflowDefinition } from '../types/workflow';
import {
  History,
  RotateCcw,
  Plus,
  Trash2,
  X,
  CheckCircle2,
  Clock,
  Layers,
  FileCode,
  AlertCircle
} from 'lucide-react';

interface SnapshotManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  snapshots: WorkflowSnapshot[];
  activeSnapshotId: string | null;
  onSaveSnapshot: (name: string, note: string) => void;
  onRevertSnapshot: (snapshot: WorkflowSnapshot) => void;
  onDeleteSnapshot: (id: string) => void;
  currentWorkflow: N8NWorkflowDefinition;
}

export const SnapshotManagerModal: React.FC<SnapshotManagerModalProps> = ({
  isOpen,
  onClose,
  snapshots,
  activeSnapshotId,
  onSaveSnapshot,
  onRevertSnapshot,
  onDeleteSnapshot,
  currentWorkflow,
}) => {
  const [newSnapshotName, setNewSnapshotName] = useState('');
  const [newSnapshotNote, setNewSnapshotNote] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [revertedAlert, setRevertedAlert] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSnapshotName.trim()) return;
    onSaveSnapshot(newSnapshotName.trim(), newSnapshotNote.trim());
    setNewSnapshotName('');
    setNewSnapshotNote('');
    setIsCreating(false);
  };

  const handleRevert = (snap: WorkflowSnapshot) => {
    onRevertSnapshot(snap);
    setRevertedAlert(`Successfully reverted to "${snap.name}"`);
    setTimeout(() => setRevertedAlert(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-[#0f1422] border border-slate-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="h-16 px-6 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Workflow Configuration Snapshots</h3>
              <p className="text-xs text-slate-400">
                Save checkpoints, experiment with node edits, and revert to previous states
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

        {/* Action Bar */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between">
          <div className="text-xs text-slate-400 font-mono">
            Active Workflow: <span className="text-white font-semibold">{currentWorkflow.name}</span> ({currentWorkflow.nodes.length} nodes)
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm shadow-rose-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Snapshot</span>
          </button>
        </div>

        {/* Revert Toast Notification */}
        {revertedAlert && (
          <div className="mx-6 mt-4 p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-xl flex items-center gap-2 text-xs text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{revertedAlert}</span>
          </div>
        )}

        {/* Create Snapshot Form */}
        {isCreating && (
          <form
            onSubmit={handleCreate}
            className="mx-6 mt-4 p-4 bg-slate-900 border border-sky-500/30 rounded-xl space-y-3"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                Save New Workflow Checkpoint
              </h4>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-300 block mb-1 font-medium">Snapshot Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. v1.2 - Added 15s Instagram Container Wait"
                  value={newSnapshotName}
                  onChange={(e) => setNewSnapshotName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1 font-medium">Notes / Change Log</label>
                <input
                  type="text"
                  placeholder="e.g. Adjusted TikTok hashtag limits and rate limits"
                  value={newSnapshotNote}
                  onChange={(e) => setNewSnapshotNote(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors cursor-pointer"
              >
                Save Checkpoint
              </button>
            </div>
          </form>
        )}

        {/* Snapshots List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {snapshots.length === 0 ? (
            <div className="text-center py-10 text-xs text-slate-400">
              No snapshots saved yet. Click "Create Snapshot" to save your first version.
            </div>
          ) : (
            snapshots.map((snap) => {
              const isActive = activeSnapshotId === snap.id;

              return (
                <div
                  key={snap.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-slate-900 border-sky-500/40 ring-1 ring-sky-500/20'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{snap.name}</h4>
                      {isActive && (
                        <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                          Active Version
                        </span>
                      )}
                    </div>

                    {snap.note && (
                      <p className="text-xs text-slate-400 line-clamp-1">{snap.note}</p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-600" />
                        {snap.timestamp}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Layers className="w-3 h-3 text-slate-600" />
                        {snap.nodeCount} Nodes
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    <button
                      onClick={() => handleRevert(snap)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer ${
                        isActive
                          ? 'bg-slate-800 text-slate-400 hover:text-white'
                          : 'bg-sky-600 hover:bg-sky-500 text-white shadow-sm'
                      }`}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isActive ? 'Reload Version' : 'Revert to This Version'}</span>
                    </button>

                    {snapshots.length > 1 && (
                      <button
                        onClick={() => onDeleteSnapshot(snap.id)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                        title="Delete snapshot"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="h-14 px-6 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-500 font-mono">
            {snapshots.length} Snapshots Stored in Session
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
