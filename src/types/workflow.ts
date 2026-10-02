export type PlatformType = 'tiktok' | 'youtube' | 'instagram' | 'all';

export interface N8NNodeParameter {
  [key: string]: any;
}

export interface N8NNode {
  id: string;
  name: string;
  type: string;
  typeVersion: number;
  position: [number, number];
  parameters: N8NNodeParameter;
  credentials?: Record<string, any>;
  notesInFlow?: boolean;
  notes?: string;
  category?: 'trigger' | 'action' | 'logic' | 'transform' | 'notification' | 'storage';
  platform?: PlatformType | 'general';
}

export interface N8NConnectionItem {
  node: string;
  type: string;
  index: number;
}

export interface N8NConnections {
  [sourceNodeName: string]: {
    main?: N8NConnectionItem[][];
    [key: string]: any;
  };
}

export interface N8NWorkflowDefinition {
  id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
  nodes: N8NNode[];
  connections: N8NConnections;
  settings?: {
    executionOrder?: 'v1';
    saveDataErrorExecution?: 'all';
    saveDataSuccessExecution?: 'all';
    saveManualExecutions?: boolean;
    callerPolicy?: 'workflowsFromSameOwner';
  };
  tags?: Array<{ id: string; name: string }>;
  versionId?: string;
}

export interface ScheduledPostItem {
  id: string;
  title: string;
  caption: string;
  mediaUrl: string;
  coverUrl?: string;
  tags: string[];
  scheduledTime: string;
  status: 'SCHEDULED' | 'PUBLISHING' | 'PUBLISHED' | 'FAILED';
  platforms: ('tiktok' | 'youtube' | 'instagram')[];
  metrics?: {
    tiktok?: { views: number; likes: number; comments: number; shares: number; publishId: string };
    youtube?: { views: number; likes: number; comments: number; videoId: string };
    instagram?: { views: number; likes: number; comments: number; shares: number; mediaId: string };
  };
}

export interface ApiEndpointDoc {
  platform: 'TikTok' | 'YouTube' | 'Instagram';
  name: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  purpose: string;
  headers: Record<string, string>;
  auth: string;
  scopes: string[];
  sampleRequest: Record<string, any> | string;
  sampleResponse: Record<string, any>;
  n8nNodeEquivalent: string;
  n8nCodeSnippet: string;
  zie619PatternRef: string;
}

export interface SimulationStep {
  nodeId: string;
  nodeName: string;
  status: 'pending' | 'running' | 'success' | 'error';
  timestamp: string;
  durationMs: number;
  outputSummary?: string;
  payload?: any;
}

export interface ExecutionLogPlatformStatus {
  platform: 'tiktok' | 'youtube' | 'instagram' | 'storage' | 'discord';
  status: 'SUCCESS' | 'FAILED' | 'SKIPPED' | 'RATE_LIMITED';
  id?: string;
  httpCode?: number;
  message?: string;
  retryAttempt?: number;
}

export interface ExecutionLogItem {
  id: string;
  executionId: string;
  workflowName: string;
  workflowId: string;
  triggerType: 'Schedule Trigger' | 'Webhook' | 'Manual Test';
  status: 'SUCCESS' | 'WARNING' | 'ERROR';
  startTime: string;
  durationMs: number;
  postTitle?: string;
  platforms: ExecutionLogPlatformStatus[];
  errorMessage?: string;
  errorNode?: string;
  nodesExecutedCount: number;
  outputPayloadSummary?: string;
}

export interface ApiRateLimitStatus {
  platform: 'TikTok' | 'YouTube' | 'Instagram';
  endpointGroup: string;
  quotaUsed: number;
  quotaLimit: number;
  unit: string;
  resetIn: string;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  recommendation: string;
  costPerAction: string;
}

export interface WorkflowSnapshot {
  id: string;
  timestamp: string;
  name: string;
  note?: string;
  workflow: N8NWorkflowDefinition;
  nodeCount: number;
}

