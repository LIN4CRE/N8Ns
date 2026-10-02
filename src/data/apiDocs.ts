import { ApiEndpointDoc } from '../types/workflow';

export const API_ENDPOINTS_DOCS: ApiEndpointDoc[] = [
  {
    platform: 'TikTok',
    name: 'TikTok Direct Post / Content Ingestion API (v2)',
    method: 'POST',
    endpoint: 'https://open.tiktokapis.com/v2/post/publish/video/init/',
    purpose: 'Initializes server-side upload of vertical short video to creator TikTok library from public CDN or cloud storage.',
    auth: 'Bearer {{ $credentials.tiktokOAuth2.accessToken }}',
    scopes: ['video.upload', 'video.publish'],
    headers: {
      'Authorization': 'Bearer <TIKTOK_ACCESS_TOKEN>',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    sampleRequest: {
      post_info: {
        title: "5 Automation Hacks you need in 2026 #productivity #tech #n8n",
        privacy_level: "PUBLIC_TO_EVERYONE",
        disable_duet: false,
        disable_stitch: false,
        disable_comment: false,
        video_cover_timestamp_ms: 1000
      },
      source_info: {
        source: "PULL_FROM_URL",
        video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
      }
    },
    sampleResponse: {
      data: {
        publish_id: "v_pub_file_73928192837190",
        upload_url: ""
      },
      error: {
        code: "ok",
        message: "",
        log_id: "2026100218204901018903"
      }
    },
    n8nNodeEquivalent: 'n8n-nodes-base.httpRequest (HTTP Request node)',
    n8nCodeSnippet: `// TikTok Payload Adapter
return {
  json: {
    post_info: {
      title: $json.tiktok_caption.slice(0, 2200),
      privacy_level: "PUBLIC_TO_EVERYONE",
      disable_duet: false,
      disable_stitch: false,
      disable_comment: false,
      video_cover_timestamp_ms: 1000
    },
    source_info: {
      source: "PULL_FROM_URL",
      video_url: $json.media_url
    }
  }
};`,
    patternRef: 'OmniFlow Core -> "tiktok-direct-video-publisher"'
  },
  {
    platform: 'TikTok',
    name: 'TikTok Publish Status & Poller (v2)',
    method: 'POST',
    endpoint: 'https://open.tiktokapis.com/v2/post/publish/status/fetch/',
    purpose: 'Polls publishing progress after ingestion wait node to ensure video passed platform moderation.',
    auth: 'Bearer {{ $credentials.tiktokOAuth2.accessToken }}',
    scopes: ['video.upload', 'video.publish'],
    headers: {
      'Authorization': 'Bearer <TIKTOK_ACCESS_TOKEN>',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    sampleRequest: {
      publish_id: "v_pub_file_73928192837190"
    },
    sampleResponse: {
      data: {
        status: "PUBLISH_COMPLETE",
        fail_reason: "",
        publicaly_available_post_id: ["73928192837190"]
      },
      error: {
        code: "ok",
        message: ""
      }
    },
    n8nNodeEquivalent: 'n8n-nodes-base.httpRequest + Wait (8s)',
    n8nCodeSnippet: `const status = $input.item.json.data?.status;
if (status === 'PUBLISH_COMPLETE') {
  return { status: 'SUCCESS', post_id: $input.item.json.data.publicaly_available_post_id?.[0] };
}
throw new Error('TikTok Publish not ready: ' + status);`,
    patternRef: 'OmniFlow Core -> "tiktok-polling-webhook-verifier"'
  },
  {
    platform: 'TikTok',
    name: 'TikTok Video Research & Analytics API',
    method: 'POST',
    endpoint: 'https://open.tiktokapis.com/v2/video/list/?fields=id,title,view_count,like_count,comment_count,share_count',
    purpose: 'Retrieves engagement metrics, total view counts, and share ratios for active posts.',
    auth: 'Bearer {{ $credentials.tiktokOAuth2.accessToken }}',
    scopes: ['user.info.stats', 'video.list'],
    headers: {
      'Authorization': 'Bearer <TIKTOK_ACCESS_TOKEN>',
      'Content-Type': 'application/json'
    },
    sampleRequest: {
      filters: {
        video_ids: ["73928192837190"]
      }
    },
    sampleResponse: {
      data: {
        videos: [
          {
            id: "73928192837190",
            title: "5 Automation Hacks...",
            view_count: 38450,
            like_count: 3120,
            comment_count: 245,
            share_count: 890
          }
        ]
      }
    },
    n8nNodeEquivalent: 'n8n-nodes-base.httpRequest (Analytics Branch)',
    n8nCodeSnippet: `const vid = $input.item.json.data?.videos?.[0] || {};
return {
  platform: 'tiktok',
  views: vid.view_count || 0,
  likes: vid.like_count || 0,
  comments: vid.comment_count || 0,
  shares: vid.share_count || 0
};`,
    patternRef: 'OmniFlow Core -> "tiktok-analytics-query-tracker"'
  },
  {
    platform: 'YouTube',
    name: 'YouTube Data API v3 - Videos Upload (Shorts)',
    method: 'POST',
    endpoint: 'https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status',
    purpose: 'Uploads vertical video directly to YouTube as a Short, with snippet metadata and tags.',
    auth: 'OAuth2 (Google Cloud Console Client ID & Secret)',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube'],
    headers: {
      'Authorization': 'Bearer <GOOGLE_ACCESS_TOKEN>',
      'Content-Type': 'application/json; charset=UTF-8'
    },
    sampleRequest: {
      snippet: {
        title: "Automate Everything with n8n #Shorts",
        description: "Watch how you can publish to 3 platforms concurrently using n8n workflows.\\n\\nGitHub: https://github.com/LIN4CRE/N8Ns",
        tags: ["n8n", "automation", "shorts", "tech"],
        categoryId: "22"
      },
      status: {
        privacyStatus: "public",
        selfDeclaredMadeForKids: false
      }
    },
    sampleResponse: {
      id: "dQw4w9WgXcQ",
      kind: "youtube#video",
      snippet: {
        title: "Automate Everything with n8n #Shorts",
        publishedAt: "2026-10-02T16:30:00Z"
      },
      status: {
        privacyStatus: "public",
        uploadStatus: "uploaded"
      }
    },
    n8nNodeEquivalent: 'n8n-nodes-base.youTube (or HTTP Request to Google Upload API)',
    n8nCodeSnippet: `// YouTube Shorts Formatter
const title = $json.title.slice(0, 90) + " #Shorts";
return {
  json: {
    snippet: {
      title: title,
      description: $json.caption + "\\n\\n#n8n #shorts",
      tags: $json.tags,
      categoryId: "22"
    },
    status: {
      privacyStatus: "public",
      selfDeclaredMadeForKids: false
    }
  }
};`,
    patternRef: 'OmniFlow Core -> "youtube-shorts-resumable-publisher"'
  },
  {
    platform: 'YouTube',
    name: 'YouTube Data & Analytics API - Video Statistics',
    method: 'GET',
    endpoint: 'https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id={VIDEO_ID}',
    purpose: 'Queries live view counts, like counts, and comments for published YouTube Shorts.',
    auth: 'OAuth2 (Google YouTube)',
    scopes: ['https://www.googleapis.com/auth/youtube.readonly'],
    headers: {
      'Authorization': 'Bearer <GOOGLE_ACCESS_TOKEN>'
    },
    sampleRequest: "GET https://www.googleapis.com/youtube/v3/videos?part=statistics&id=dQw4w9WgXcQ",
    sampleResponse: {
      items: [
        {
          id: "dQw4w9WgXcQ",
          statistics: {
            viewCount: "52480",
            likeCount: "4210",
            dislikeCount: "0",
            favoriteCount: "0",
            commentCount: "389"
          }
        }
      ]
    },
    n8nNodeEquivalent: 'n8n-nodes-base.youTube / HTTP Request',
    n8nCodeSnippet: `const stats = $input.item.json.items?.[0]?.statistics || {};
return {
  platform: 'youtube',
  views: parseInt(stats.viewCount || 0, 10),
  likes: parseInt(stats.likeCount || 0, 10),
  comments: parseInt(stats.commentCount || 0, 10)
};`,
    patternRef: 'OmniFlow Core -> "youtube-video-metrics-aggregator"'
  },
  {
    platform: 'Instagram',
    name: 'Meta Graph API v21.0 - Create Reel Media Container',
    method: 'POST',
    endpoint: 'https://graph.facebook.com/v21.0/{IG_USER_ID}/media',
    purpose: 'Step 1 of Instagram Reels 2-phase publishing flow. Ingests video URL and prepares container.',
    auth: 'Facebook User Access Token (with instagram_content_publish scope)',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_read_engagement'],
    headers: {
      'Authorization': 'Bearer <FACEBOOK_USER_TOKEN>'
    },
    sampleRequest: {
      media_type: "REELS",
      video_url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      caption: "Streamline your distribution pipeline today! 🚀 #automation #instagramreels",
      share_to_feed: true,
      cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1080&q=80"
    },
    sampleResponse: {
      id: "17940294829103948"
    },
    n8nNodeEquivalent: 'n8n-nodes-base.httpRequest (Meta Graph Container)',
    n8nCodeSnippet: `// Step 1: Create Container Query Params
return {
  parameters: [
    { name: "media_type", value: "REELS" },
    { name: "video_url", value: $json.media_url },
    { name: "caption", value: $json.instagram_caption },
    { name: "share_to_feed", value: "true" }
  ]
};`,
    patternRef: 'OmniFlow Core -> "instagram-reels-container-creator"'
  },
  {
    platform: 'Instagram',
    name: 'Meta Graph API v21.0 - Publish Media Container',
    method: 'POST',
    endpoint: 'https://graph.facebook.com/v21.0/{IG_USER_ID}/media_publish',
    purpose: 'Step 2: Commits transcoded container creation ID to make Reel publicly visible.',
    auth: 'Facebook User Access Token',
    scopes: ['instagram_content_publish'],
    headers: {
      'Authorization': 'Bearer <FACEBOOK_USER_TOKEN>'
    },
    sampleRequest: {
      creation_id: "17940294829103948"
    },
    sampleResponse: {
      id: "18029384729104820"
    },
    n8nNodeEquivalent: 'n8n-nodes-base.httpRequest (Meta Graph Publish)',
    n8nCodeSnippet: `// Step 2: Trigger publish with creation_id
return {
  url: "https://graph.facebook.com/v21.0/" + $credentials.instagram.id + "/media_publish",
  query: { creation_id: $node['Instagram Graph - Create Reel Container'].json.id }
};`,
    patternRef: 'OmniFlow Core -> "instagram-reels-publisher-step2"'
  },
  {
    platform: 'Instagram',
    name: 'Instagram Graph Insights - Reels Telemetry',
    method: 'GET',
    endpoint: 'https://graph.facebook.com/v21.0/{IG_MEDIA_ID}/insights?metric=reach,plays,saved,shares,total_interactions,likes,comments',
    purpose: 'Retrieves comprehensive Reel metrics: reach, plays, saves, and interaction rates.',
    auth: 'Facebook User Token',
    scopes: ['instagram_manage_insights', 'pages_read_engagement'],
    headers: {
      'Authorization': 'Bearer <FACEBOOK_USER_TOKEN>'
    },
    sampleRequest: "GET https://graph.facebook.com/v21.0/18029384729104820/insights?metric=reach,plays,saved,shares,likes,comments",
    sampleResponse: {
      data: [
        { name: "plays", period: "lifetime", values: [{ value: 41800 }] },
        { name: "reach", period: "lifetime", values: [{ value: 36200 }] },
        { name: "saved", period: "lifetime", values: [{ value: 1240 }] },
        { name: "shares", period: "lifetime", values: [{ value: 680 }] },
        { name: "likes", period: "lifetime", values: [{ value: 3410 }] },
        { name: "comments", period: "lifetime", values: [{ value: 210 }] }
      ]
    },
    n8nNodeEquivalent: 'n8n-nodes-base.httpRequest (Reels Insights)',
    n8nCodeSnippet: `const metrics = {};
($input.item.json.data || []).forEach(m => {
  metrics[m.name] = m.values?.[0]?.value || 0;
});
return {
  platform: 'instagram',
  views: metrics.plays || 0,
  reach: metrics.reach || 0,
  likes: metrics.likes || 0,
  comments: metrics.comments || 0,
  shares: metrics.shares || 0,
  saved: metrics.saved || 0
};`,
    patternRef: 'OmniFlow Core -> "instagram-insights-reels-tracker"'
  }
];
