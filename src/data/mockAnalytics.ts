import { ScheduledPostItem } from '../types/workflow';

export const INITIAL_SCHEDULED_POSTS: ScheduledPostItem[] = [
  {
    id: "post_001",
    title: "How to Build Autonomous n8n AI Agents in 10 Minutes",
    caption: "Stop doing manual copy-pasting between tools. Here is how n8n orchestrates TikTok, YouTube Shorts, and Instagram Reels autonomously.",
    mediaUrl: "https://storage.googleapis.com/omnichannel-media-cdn/videos/ai_agents_mastery_916.mp4",
    coverUrl: "https://storage.googleapis.com/omnichannel-media-cdn/covers/thumb_001.jpg",
    tags: ["n8n", "automation", "tech", "productivity", "growth"],
    scheduledTime: "Today at 1:00 PM EST",
    status: "PUBLISHED",
    platforms: ["tiktok", "youtube", "instagram"],
    metrics: {
      tiktok: { views: 64200, likes: 5120, comments: 418, shares: 1420, publishId: "tt_7392819283719" },
      youtube: { views: 88400, likes: 6940, comments: 532, videoId: "yt_dQw4w9WgX01" },
      instagram: { views: 42900, likes: 3810, comments: 290, shares: 890, mediaId: "ig_1802938472910" }
    }
  },
  {
    id: "post_002",
    title: "3 API Secrets Every Growth Engineer Should Know",
    caption: "Using OAuth2 refresh loops and webhook status callbacks will save you 100+ hours of troubleshooting broken tokens.",
    mediaUrl: "https://storage.googleapis.com/omnichannel-media-cdn/videos/api_secrets_2026.mp4",
    coverUrl: "https://storage.googleapis.com/omnichannel-media-cdn/covers/thumb_002.jpg",
    tags: ["software", "engineering", "coding", "devops"],
    scheduledTime: "Yesterday at 5:00 PM EST",
    status: "PUBLISHED",
    platforms: ["tiktok", "youtube", "instagram"],
    metrics: {
      tiktok: { views: 32100, likes: 2450, comments: 184, shares: 520, publishId: "tt_7392819283720" },
      youtube: { views: 46200, likes: 3790, comments: 310, videoId: "yt_dQw4w9WgX02" },
      instagram: { views: 28400, likes: 2190, comments: 142, shares: 410, mediaId: "ig_1802938472911" }
    }
  },
  {
    id: "post_003",
    title: "Zero to 100k Followers: The Cross-Platform Strategy",
    caption: "The secret is never posting manually. One source video resized to 9:16 automatically formatted with platform-tailored hooks.",
    mediaUrl: "https://storage.googleapis.com/omnichannel-media-cdn/videos/growth_blueprint_2026.mp4",
    coverUrl: "https://storage.googleapis.com/omnichannel-media-cdn/covers/thumb_003.jpg",
    tags: ["contentstrategy", "socialmedia", "creators", "scale"],
    scheduledTime: "Tomorrow at 9:00 AM EST",
    status: "SCHEDULED",
    platforms: ["tiktok", "youtube", "instagram"]
  },
  {
    id: "post_004",
    title: "Setting Up Meta Graph API v21 Container Polling in n8n",
    caption: "Full breakdown of creation_id wait loops in n8n using HTTP request and If nodes.",
    mediaUrl: "https://storage.googleapis.com/omnichannel-media-cdn/videos/meta_graph_walkthrough.mp4",
    coverUrl: "https://storage.googleapis.com/omnichannel-media-cdn/covers/thumb_004.jpg",
    tags: ["metagraph", "tutorials", "n8nworkflows", "developer"],
    scheduledTime: "In 2 days at 1:00 PM EST",
    status: "SCHEDULED",
    platforms: ["tiktok", "youtube", "instagram"]
  }
];

export const HOURLY_PERFORMANCE_HEATMAP = [
  { hour: "6 AM", tiktok: 28, youtube: 35, instagram: 22 },
  { hour: "9 AM", tiktok: 74, youtube: 82, instagram: 68 },
  { hour: "12 PM", tiktok: 86, youtube: 78, instagram: 84 },
  { hour: "1 PM", tiktok: 92, youtube: 94, instagram: 90 },
  { hour: "3 PM", tiktok: 68, youtube: 72, instagram: 76 },
  { hour: "5 PM", tiktok: 96, youtube: 90, instagram: 94 },
  { hour: "8 PM", tiktok: 88, youtube: 85, instagram: 89 },
  { hour: "11 PM", tiktok: 55, youtube: 48, instagram: 60 }
];

export const RETENTION_COMPARISON = [
  { interval: "0s", tiktok: 100, youtube: 100, instagram: 100 },
  { interval: "5s", tiktok: 84, youtube: 89, instagram: 81 },
  { interval: "15s", tiktok: 68, youtube: 76, instagram: 64 },
  { interval: "30s", tiktok: 52, youtube: 62, instagram: 49 },
  { interval: "45s", tiktok: 41, youtube: 54, instagram: 38 },
  { interval: "60s", tiktok: 34, youtube: 47, instagram: 31 }
];

export const MOCK_EXECUTION_LOGS: import('../types/workflow').ExecutionLogItem[] = [
  {
    id: "exec_0918",
    executionId: "#38194",
    workflowName: "OmniChannel Social Distribution",
    workflowId: "wf_omnichannel_distribution_v1",
    triggerType: "Schedule Trigger",
    status: "SUCCESS",
    startTime: "Today at 1:00:03 PM EST",
    durationMs: 4820,
    postTitle: "How to Build Autonomous n8n AI Agents in 10 Minutes",
    nodesExecutedCount: 14,
    platforms: [
      { platform: "tiktok", status: "SUCCESS", id: "tt_7392819283719", httpCode: 200, message: "PUBLISH_COMPLETE" },
      { platform: "youtube", status: "SUCCESS", id: "yt_dQw4w9WgX01", httpCode: 200, message: "Uploaded Shorts" },
      { platform: "instagram", status: "SUCCESS", id: "ig_1802938472910", httpCode: 200, message: "Container Finished & Published" },
      { platform: "storage", status: "SUCCESS", id: "row_381", httpCode: 200, message: "Logged to Google Sheets Active_Publications" },
      { platform: "discord", status: "SUCCESS", httpCode: 204, message: "Dispatched embed notification" }
    ],
    outputPayloadSummary: "3 platform posts active. TikTok (ID: 7392819), YouTube (ID: dQw4w9), Instagram (ID: 180293). Logged to Active_Publications."
  },
  {
    id: "exec_0917",
    executionId: "#38190",
    workflowName: "Cross-Platform Analytics Harvester",
    workflowId: "wf_omnichannel_analytics_v1",
    triggerType: "Schedule Trigger",
    status: "SUCCESS",
    startTime: "Today at 12:00:00 PM EST",
    durationMs: 3140,
    nodesExecutedCount: 8,
    platforms: [
      { platform: "tiktok", status: "SUCCESS", httpCode: 200, message: "Queried 12 video metrics" },
      { platform: "youtube", status: "SUCCESS", httpCode: 200, message: "Queried video statistics" },
      { platform: "instagram", status: "SUCCESS", httpCode: 200, message: "Queried Reels insights" }
    ],
    outputPayloadSummary: "Harvester cycle complete. Total aggregated views: 195,500. Viral alert evaluated (TRUE, post_001 crossed 8% ER threshold)."
  },
  {
    id: "exec_0916",
    executionId: "#38184",
    workflowName: "OmniChannel Social Distribution",
    workflowId: "wf_omnichannel_distribution_v1",
    triggerType: "Webhook",
    status: "WARNING",
    startTime: "Yesterday at 5:02:11 PM EST",
    durationMs: 7650,
    postTitle: "3 API Secrets Every Growth Engineer Should Know",
    nodesExecutedCount: 14,
    platforms: [
      { platform: "tiktok", status: "SUCCESS", id: "tt_7392819283720", httpCode: 200, message: "Ingestion completed" },
      { platform: "youtube", status: "SUCCESS", id: "yt_dQw4w9WgX02", httpCode: 200, message: "Upload completed" },
      { platform: "instagram", status: "SUCCESS", id: "ig_1802938472911", httpCode: 200, message: "Delayed transcode (auto-retried after 20s)", retryAttempt: 1 }
    ],
    errorMessage: "Meta Instagram Graph returned status_code: IN_PROGRESS on initial poll. Handled gracefully via n8n Wait/Retry loop.",
    errorNode: "Instagram - Poll Container Status"
  },
  {
    id: "exec_0915",
    executionId: "#38172",
    workflowName: "OmniChannel Social Distribution",
    workflowId: "wf_omnichannel_distribution_v1",
    triggerType: "Manual Test",
    status: "ERROR",
    startTime: "Oct 1, 2026 at 4:15:30 PM EST",
    durationMs: 2900,
    postTitle: "High-Frequency Batch Video Test #4",
    nodesExecutedCount: 6,
    platforms: [
      { platform: "tiktok", status: "SUCCESS", id: "tt_7392819283710", httpCode: 200 },
      { platform: "youtube", status: "RATE_LIMITED", httpCode: 403, message: "quotaExceeded: The request cannot be completed because you have exceeded your quota." },
      { platform: "instagram", status: "SKIPPED", message: "Branch interrupted by execution boundary" }
    ],
    errorMessage: "Google YouTube Data API 403: The user has exceeded the daily upload quota limit (10,000 units).",
    errorNode: "YouTube Data API - Upload Short",
    outputPayloadSummary: "Execution failed at node 'YouTube Data API - Upload Short'. Re-queued remaining items for midnight quota reset."
  },
  {
    id: "exec_0914",
    executionId: "#38165",
    workflowName: "Cross-Platform Analytics Harvester",
    workflowId: "wf_omnichannel_analytics_v1",
    triggerType: "Schedule Trigger",
    status: "SUCCESS",
    startTime: "Oct 1, 2026 at 6:00:00 AM EST",
    durationMs: 2890,
    nodesExecutedCount: 8,
    platforms: [
      { platform: "tiktok", status: "SUCCESS", httpCode: 200 },
      { platform: "youtube", status: "SUCCESS", httpCode: 200 },
      { platform: "instagram", status: "SUCCESS", httpCode: 200 }
    ],
    outputPayloadSummary: "Telemetry snapshot stored to sheet row #364. No viral alerts triggered."
  }
];

export const API_RATE_LIMITS: import('../types/workflow').ApiRateLimitStatus[] = [
  {
    platform: "TikTok",
    endpointGroup: "Direct Video Posting API (v2)",
    quotaUsed: 28,
    quotaLimit: 50,
    unit: "video uploads / 24h",
    resetIn: "6h 14m",
    status: "healthy",
    description: "TikTok restricts direct creator post ingestion to 50 active uploads per 24 hours per authorized account.",
    recommendation: "Capacity is healthy (56% used). Up to 22 more automated video publishes can be executed before rolling reset.",
    costPerAction: "1 upload per post execution"
  },
  {
    platform: "TikTok",
    endpointGroup: "Video Query & Research API",
    quotaUsed: 42,
    quotaLimit: 100,
    unit: "queries / minute",
    resetIn: "38s",
    status: "healthy",
    description: "Per-minute burst rate limit on POST /v2/video/list/ metrics telemetry retrieval.",
    recommendation: "Safe burst headroom. n8n batch interval handles up to 10 queries per harvester batch.",
    costPerAction: "1 query per 20 tracked video IDs"
  },
  {
    platform: "YouTube",
    endpointGroup: "YouTube Data API v3 Daily Quota",
    quotaUsed: 6400,
    quotaLimit: 10000,
    unit: "quota units / day",
    resetIn: "8h 22m (Midnight PST)",
    status: "warning",
    description: "YouTube allocates a default 10,000 quota units per day. Video uploads cost 1,600 units each; read stats cost 1 unit each.",
    recommendation: "64% quota consumed. You have 3,600 units remaining (~2 video uploads left today). Space upcoming scheduled posts or apply for a YouTube quota extension.",
    costPerAction: "1,600 units per video upload · 1 unit per analytics query"
  },
  {
    platform: "Instagram",
    endpointGroup: "Reels Publishing Limit (Meta Graph v21)",
    quotaUsed: 18,
    quotaLimit: 50,
    unit: "posts / 24h rolling",
    resetIn: "Rolling 24h window",
    status: "healthy",
    description: "Meta Instagram Graph limits automated Reels publishing to 50 posts per 24 hours per connected Instagram Business account.",
    recommendation: "Current velocity is 18/50 (36%). 32 publication slots remaining in current window.",
    costPerAction: "1 container + 1 publish call per Reel"
  },
  {
    platform: "Instagram",
    endpointGroup: "Application Rate Limit (Meta Insights)",
    quotaUsed: 78,
    quotaLimit: 200,
    unit: "calls / hour per user",
    resetIn: "24m 10s",
    status: "healthy",
    description: "Hourly sliding window limit for Graph API /insights and container status polling checks.",
    recommendation: "Safe usage level (39%). Container polling is configured with 15s delay to minimize call waste.",
    costPerAction: "2-3 polling calls per distribution"
  }
];

