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
