/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  DISTRIBUTION_WORKFLOW,
  ANALYTICS_WORKFLOW,
  UNIFIED_MASTER_WORKFLOW
} from './data/n8nWorkflows';
import { N8NWorkflowDefinition, N8NNode, ScheduledPostItem, WorkflowSnapshot } from './types/workflow';
import { Header } from './components/Header';
import { WorkflowCanvas } from './components/WorkflowCanvas';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { SimulatorModal } from './components/SimulatorModal';
import { AnalyticsView } from './components/AnalyticsView';
import { EndpointsReference } from './components/EndpointsReference';
import { WorkflowScheduler } from './components/WorkflowScheduler';
import { WorkflowExportModal } from './components/WorkflowExportModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<
    'canvas' | 'simulator' | 'analytics' | 'endpoints' | 'scheduler'
  >('canvas');

  // Mutable workflows dictionary
  const [workflows, setWorkflows] = useState<Record<string, N8NWorkflowDefinition>>({
    wf_omnichannel_distribution_v1: JSON.parse(JSON.stringify(DISTRIBUTION_WORKFLOW)),
    wf_omnichannel_analytics_v1: JSON.parse(JSON.stringify(ANALYTICS_WORKFLOW)),
    wf_omnichannel_master_v1: JSON.parse(JSON.stringify(UNIFIED_MASTER_WORKFLOW)),
  });

  const [currentWorkflowId, setCurrentWorkflowId] = useState<string>(
    'wf_omnichannel_distribution_v1'
  );
  const [selectedNode, setSelectedNode] = useState<N8NNode | null>(null);

  // Workflow Snapshots State
  const [snapshots, setSnapshots] = useState<WorkflowSnapshot[]>([
    {
      id: 'snap_baseline_01',
      name: 'v1.0 - Production Baseline',
      timestamp: 'Today at 9:00 AM EST',
      note: 'Initial verified distribution pipeline with 8s TikTok wait and Meta Reels container polling.',
      workflow: JSON.parse(JSON.stringify(DISTRIBUTION_WORKFLOW)),
      nodeCount: DISTRIBUTION_WORKFLOW.nodes.length,
    },
    {
      id: 'snap_optimized_02',
      name: 'v1.1 - Added Polling Resiliency & Tags',
      timestamp: 'Today at 11:30 AM EST',
      note: 'Extended wait duration to 15s for Instagram container transcoding and added YouTube category 22 tags.',
      workflow: JSON.parse(JSON.stringify(DISTRIBUTION_WORKFLOW)),
      nodeCount: DISTRIBUTION_WORKFLOW.nodes.length,
    },
  ]);
  const [activeSnapshotId, setActiveSnapshotId] = useState<string | null>('snap_baseline_01');

  // Modals state
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  const availableWorkflows = [
    {
      id: 'wf_omnichannel_distribution_v1',
      name: 'OmniChannel Scheduled Distribution',
      category: 'Publishing',
    },
    {
      id: 'wf_omnichannel_analytics_v1',
      name: 'Cross-Platform Analytics Harvester',
      category: 'Analytics',
    },
    {
      id: 'wf_omnichannel_master_v1',
      name: 'OmniFlow Master Loop',
      category: 'Full Suite',
    },
  ];

  const currentWorkflow = workflows[currentWorkflowId] || workflows['wf_omnichannel_distribution_v1'];

  const handleSelectWorkflow = (id: string) => {
    setCurrentWorkflowId(id);
    setSelectedNode(null);
  };

  const handleSaveSnapshot = (name: string, note: string) => {
    const newSnapshot: WorkflowSnapshot = {
      id: 'snap_' + Date.now().toString().slice(-6),
      name,
      timestamp: new Date().toLocaleTimeString() + ' (Just now)',
      note,
      workflow: JSON.parse(JSON.stringify(currentWorkflow)),
      nodeCount: currentWorkflow.nodes.length,
    };
    setSnapshots([newSnapshot, ...snapshots]);
    setActiveSnapshotId(newSnapshot.id);
  };

  const handleRevertSnapshot = (snapshot: WorkflowSnapshot) => {
    setWorkflows((prev) => ({
      ...prev,
      [currentWorkflowId]: JSON.parse(JSON.stringify(snapshot.workflow)),
    }));
    setActiveSnapshotId(snapshot.id);
    setSelectedNode(null);
  };

  const handleDeleteSnapshot = (id: string) => {
    setSnapshots(snapshots.filter((s) => s.id !== id));
    if (activeSnapshotId === id) {
      setActiveSnapshotId(null);
    }
  };

  const handleUpdateNode = (updatedNode: N8NNode) => {
    setWorkflows((prev) => {
      const activeWf = prev[currentWorkflowId];
      if (!activeWf) return prev;

      const updatedNodes = activeWf.nodes.map((n) =>
        n.id === updatedNode.id ? updatedNode : n
      );

      return {
        ...prev,
        [currentWorkflowId]: {
          ...activeWf,
          nodes: updatedNodes,
        },
      };
    });
    setSelectedNode(updatedNode);
  };

  const handleSimulatePost = (post: ScheduledPostItem) => {
    setIsSimulatorModalOpen(true);
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0b0f17] text-slate-100 font-sans overflow-hidden">
      {/* 3-Zone Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenExport={() => setIsExportModalOpen(true)}
        onOpenSimulator={() => setIsSimulatorModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex">
        {activeTab === 'canvas' && (
          <WorkflowCanvas
            currentWorkflow={currentWorkflow}
            onSelectWorkflow={handleSelectWorkflow}
            availableWorkflows={availableWorkflows}
            onSelectNode={(node) => setSelectedNode(node)}
            selectedNode={selectedNode}
            onSimulate={() => setIsSimulatorModalOpen(true)}
            onExport={() => setIsExportModalOpen(true)}
            snapshots={snapshots}
            activeSnapshotId={activeSnapshotId}
            onSaveSnapshot={handleSaveSnapshot}
            onRevertSnapshot={handleRevertSnapshot}
            onDeleteSnapshot={handleDeleteSnapshot}
          />
        )}

        {activeTab === 'simulator' && (
          <div className="flex-1 h-full overflow-hidden flex flex-col items-center justify-center p-6 bg-[#0b0f17]">
            <div className="max-w-xl text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto text-xl font-bold">
                ▶
              </div>
              <h2 className="text-xl font-bold text-white">Live Execution Simulator</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step through multi-platform API calls with real-time logs, status poller checks, and cross-platform performance synthesis.
              </p>
              <button
                onClick={() => setIsSimulatorModalOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors shadow-lg shadow-rose-950 cursor-pointer"
              >
                Launch Simulator Console
              </button>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsView />}

        {activeTab === 'scheduler' && (
          <WorkflowScheduler onSimulatePost={handleSimulatePost} />
        )}

        {activeTab === 'endpoints' && <EndpointsReference />}

        {/* Selected Node Inspector Drawer */}
        {selectedNode && (
          <NodeDetailDrawer
            node={selectedNode}
            onClose={() => setSelectedNode(null)}
            onUpdateNode={handleUpdateNode}
          />
        )}
      </main>

      {/* Global Modals */}
      <SimulatorModal
        isOpen={isSimulatorModalOpen}
        onClose={() => setIsSimulatorModalOpen(false)}
      />

      <WorkflowExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        initialWorkflowId={currentWorkflowId}
      />
    </div>
  );
}
