# High-Level Design: Video Streaming Platform (YouTube-like)

## Table of Contents
1. [Problem Statement & Requirements](#1-problem-statement--requirements)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Component Architecture](#3-component-architecture)
4. [Data Flow](#4-data-flow)
5. [API Design & Communication Protocols](#5-api-design--communication-protocols)
6. [Database Design](#6-database-design)
7. [Caching Strategy](#7-caching-strategy)
8. [State Management](#8-state-management)
9. [Performance Optimization](#9-performance-optimization)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [Interview Cross-Questions](#11-interview-cross-questions)
12. [Trade-offs & Design Decisions](#12-trade-offs--design-decisions)
13. [Accessibility (a11y)](#13-accessibility-a11y)
14. [Security & Content Protection](#14-security--content-protection)
15. [Mobile & Touch Interactions](#15-mobile--touch-interactions)
16. [Testing Strategy](#16-testing-strategy)
17. [Offline/PWA Capabilities](#17-offlinepwa-capabilities)
18. [Video Player Deep Dive](#18-video-player-deep-dive)
19. [Internationalization (i18n)](#19-internationalization-i18n)
20. [Analytics & Monitoring](#20-analytics--monitoring)
21. [Notification System](#21-notification-system)
22. [Live Streaming Deep Dive](#22-live-streaming-deep-dive)

---

## 1. Problem Statement & Requirements

### Functional Requirements
- **Video Upload**: Users can upload videos in various formats and sizes
- **Video Streaming**: Users can watch videos with adaptive quality
- **Video Player Controls**: Play, pause, seek, volume, quality selection, speed control
- **Comments**: Users can post, read, edit, and delete comments
- **Recommendations**: Personalized video suggestions based on viewing history
- **Search**: Search videos by title, tags, description
- **Thumbnails**: Auto-generate and custom upload thumbnails
- **View Counting**: Track video views accurately (eventual consistency acceptable)
- **Live Streaming**: Support for real-time video streaming (optional)
- **Subscriptions**: Users can subscribe to channels
- **Likes/Dislikes**: User engagement metrics

### Non-Functional Requirements
- **Scalability**: Support millions of concurrent viewers
- **Availability**: 99.9% uptime for streaming service
- **Low Latency**: Video start time < 2 seconds, buffering minimal
- **Consistency**: Eventual consistency acceptable for views, likes
- **Durability**: Videos should never be lost (high durability)
- **Performance**: Support adaptive bitrate streaming (240p to 4K)
- **Cost Efficiency**: Optimize storage and bandwidth costs
- **Global Reach**: CDN-based delivery for worldwide users

### Scale Estimations
- **Users**: 500M daily active users
- **Videos**: 500 hours of video uploaded per minute
- **Concurrent Viewers**: 10M concurrent video streams
- **Storage**: 1PB+ for video storage (multi-resolution)
- **Bandwidth**: 100+ Gbps for video delivery
- **Metadata**: Billions of video records, comments, likes

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            CLIENT LAYER                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                  │
│  │   Web App    │  │  Mobile App  │  │   Smart TV   │                  │
│  │  (React/Vue) │  │ (iOS/Android)│  │     App      │                  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                  │
└─────────┼──────────────────┼──────────────────┼──────────────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Rate Limiting,│
                    │   Auth, Routing)│
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   ┌──────▼──────┐    ┌─────▼──────┐    ┌─────▼──────┐
   │   Video     │    │  Metadata  │    │   User     │
   │  Upload     │    │  Service   │    │  Service   │
   │  Service    │    │            │    │            │
   └──────┬──────┘    └─────┬──────┘    └─────┬──────┘
          │                 │                  │
          │                 │                  │
   ┌──────▼──────┐    ┌─────▼──────┐    ┌─────▼──────┐
   │  Transcode  │    │  Comment   │    │ Recommend. │
   │   Service   │    │  Service   │    │  Service   │
   │  (Queue)    │    │            │    │   (ML)     │
   └──────┬──────┘    └─────┬──────┘    └─────┬──────┘
          │                 │                  │
          │                 │                  │
┌─────────▼─────────────────▼──────────────────▼─────────────┐
│                     DATA LAYER                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │   SQL    │  │  NoSQL   │  │  Object  │  │  Cache   │  │
│  │   (RDS)  │  │(Cassandra│  │ Storage  │  │ (Redis)  │  │
│  │          │  │/DynamoDB)│  │   (S3)   │  │          │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    CDN LAYER                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  CDN Edge│  │  CDN Edge│  │  CDN Edge│  │  CDN Edge│  │
│  │   (US)   │  │   (EU)   │  │  (APAC)  │  │  (Others)│  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                  BACKGROUND JOBS                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │Thumbnail │  │  View    │  │Analytics │  │  CDN     │  │
│  │Generator │  │ Counter  │  │Processor │  │ Warmer   │  │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### 3.1 Frontend Components

```
┌────────────────────────────────────────────────────────┐
│                  VIDEO PLAYER COMPONENT                 │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │         Video Rendering Canvas                 │    │
│  │      (HTML5 Video / WebRTC for live)          │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │              Player Controls                   │    │
│  │  [Play/Pause] [Timeline] [Volume] [Quality]   │    │
│  │  [Speed] [Fullscreen] [Captions] [Settings]   │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │          Adaptive Bitrate Logic                │    │
│  │  - Monitor bandwidth & buffer health           │    │
│  │  - Switch quality based on network             │    │
│  │  - Preload next segments                       │    │
│  └───────────────────────────────────────────────┘    │
│                                                         │
│  ┌───────────────────────────────────────────────┐    │
│  │            Buffer Management                   │    │
│  │  - Maintain 10-30s buffer ahead                │    │
│  │  - Handle network interruptions                │    │
│  │  - Smart preloading                            │    │
│  └───────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              RECOMMENDATION COMPONENT                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │  Video   │  │  Video   │  │  Video   │            │
│  │ Thumbnail│  │ Thumbnail│  │ Thumbnail│  ...       │
│  │  + Meta  │  │  + Meta  │  │  + Meta  │            │
│  └──────────┘  └──────────┘  └──────────┘            │
│  - Personalized based on watch history                │
│  - Trending videos                                     │
│  - Category-based recommendations                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│               COMMENTS COMPONENT                        │
│  ┌──────────────────────────────────────────────┐     │
│  │  Comment Input (with mentions, emojis)       │     │
│  └──────────────────────────────────────────────┘     │
│  ┌──────────────────────────────────────────────┐     │
│  │  Comment List (paginated/infinite scroll)    │     │
│  │  - Top comments                              │     │
│  │  - Newest first                              │     │
│  │  - Threaded replies                          │     │
│  └──────────────────────────────────────────────┘     │
│  - Real-time updates (WebSocket/Polling)              │
│  - Like/Dislike comments                              │
└────────────────────────────────────────────────────────┘
```

### 3.2 Backend Services

#### Video Upload Service
```
┌─────────────────────────────────────────┐
│      VIDEO UPLOAD SERVICE               │
│                                         │
│  1. Validate upload (format, size)     │
│  2. Generate unique video ID           │
│  3. Chunk upload to Object Storage     │
│  4. Create metadata entry              │
│  5. Trigger transcoding job            │
│  6. Generate placeholder thumbnail     │
│                                         │
│  Technologies:                          │
│  - Multipart upload (chunks)           │
│  - Resumable uploads                   │
│  - S3/GCS for raw video storage        │
└─────────────────────────────────────────┘
```

#### Transcoding Service
```
┌─────────────────────────────────────────┐
│      TRANSCODING SERVICE                │
│                                         │
│  Input: Raw video file                 │
│                                         │
│  Process:                               │
│  1. Read from Object Storage           │
│  2. Transcode to multiple resolutions: │
│     - 4K (2160p)                       │
│     - 1080p                            │
│     - 720p                             │
│     - 480p                             │
│     - 360p                             │
│     - 240p                             │
│  3. Encode with H.264/H.265/VP9        │
│  4. Generate HLS/DASH manifests        │
│  5. Extract thumbnails (keyframes)     │
│  6. Store segments in Object Storage   │
│  7. Update metadata with URLs          │
│  8. Warm CDN cache                     │
│                                         │
│  Technologies:                          │
│  - FFmpeg/Elastic Transcoder           │
│  - Worker queue (SQS/RabbitMQ)         │
│  - Distributed workers (Auto-scaling)  │
└─────────────────────────────────────────┘
```

#### Streaming Service
```
┌─────────────────────────────────────────┐
│       STREAMING SERVICE                 │
│                                         │
│  1. Receive video request              │
│  2. Check user authentication          │
│  3. Fetch manifest file (HLS/DASH)     │
│  4. Serve via CDN                      │
│  5. Track playback events              │
│  6. Log analytics                      │
│                                         │
│  Protocols:                             │
│  - HLS (HTTP Live Streaming)           │
│  - DASH (Dynamic Adaptive Streaming)   │
│  - WebRTC (for live streaming)         │
└─────────────────────────────────────────┘
```

---

## 4. Data Flow

### 4.1 Video Upload Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Upload Video
     ▼
┌─────────────────┐
│  Upload Service │
└────┬────────────┘
     │ 2. Chunk & Store Raw Video
     ▼
┌─────────────────┐
│  Object Storage │
│      (S3)       │
└────┬────────────┘
     │ 3. Trigger Transcode
     ▼
┌─────────────────┐
│  Message Queue  │
│   (SQS/Kafka)   │
└────┬────────────┘
     │ 4. Pick Job
     ▼
┌─────────────────┐
│   Transcoder    │
│   Workers       │
└────┬────────────┘
     │ 5. Generate Multiple Resolutions
     ├──────────┬──────────┬──────────┐
     ▼          ▼          ▼          ▼
  [4K.m3u8] [1080p.m3u8] [720p.m3u8] [360p.m3u8]
     │          │          │          │
     └──────────┴──────────┴──────────┘
                    │
                    ▼
          ┌─────────────────┐
          │ Object Storage  │
          │  (Segmented)    │
          └────┬────────────┘
               │ 6. Update Metadata
               ▼
          ┌─────────────────┐
          │   Database      │
          │  (video_id,     │
          │   resolutions)  │
          └────┬────────────┘
               │ 7. Warm CDN
               ▼
          ┌─────────────────┐
          │      CDN        │
          │  Edge Servers   │
          └─────────────────┘
```

### 4.2 Video Streaming Flow

```
┌─────────┐
│  User   │
└────┬────┘
     │ 1. Request Video
     ▼
┌─────────────────┐
│   API Gateway   │
└────┬────────────┘
     │ 2. Auth & Validate
     ▼
┌─────────────────┐
│ Metadata Service│
└────┬────────────┘
     │ 3. Fetch Video Info
     ▼
┌─────────────────┐
│    Database     │
└────┬────────────┘
     │ 4. Return Manifest URL
     ▼
┌─────────────────┐
│   Client        │
│  (Video Player) │
└────┬────────────┘
     │ 5. Request Manifest (master.m3u8)
     ▼
┌─────────────────┐
│   CDN Edge      │
└────┬────────────┘
     │ 6. Serve Manifest
     ▼
┌─────────────────┐
│   Client        │
│  (Parse Quality)│
└────┬────────────┘
     │ 7. Request Segments (720p_001.ts, 720p_002.ts...)
     ▼
┌─────────────────┐
│   CDN Edge      │
│  (Cache Hit)    │
└────┬────────────┘
     │ 8. Stream Video Segments
     ▼
┌─────────────────┐
│  Video Player   │
│  (Buffer & Play)│
└─────────────────┘
```

### 4.3 Adaptive Bitrate Flow

```
Video Player Logic:
┌─────────────────────────────────────────┐
│                                         │
│  while (video playing):                 │
│    monitor_bandwidth()                  │
│    monitor_buffer_health()              │
│                                         │
│    if bandwidth_high && buffer_healthy: │
│        switch_to_higher_quality()       │
│    if bandwidth_low || buffer_starving: │
│        switch_to_lower_quality()        │
│                                         │
│    preload_next_segments()              │
│    update_playback_stats()              │
│                                         │
└─────────────────────────────────────────┘

Quality Ladder:
4K (2160p) ─┐
1080p      ─┤
720p       ─┼─── Switch based on:
480p       ─┤     - Network speed
360p       ─┤     - Buffer status
240p       ─┘     - Device capability
```

### 4.4 View Counting Flow

```
┌─────────┐
│  User   │
│ Watches │
└────┬────┘
     │ 1. Video Play Event (>30s watched)
     ▼
┌─────────────────┐
│ Analytics       │
│ Service         │
└────┬────────────┘
     │ 2. Write to Stream
     ▼
┌─────────────────┐
│  Kafka/Kinesis  │
│   (Event Log)   │
└────┬────────────┘
     │ 3. Aggregate Views
     ▼
┌─────────────────┐
│  Stream         │
│  Processor      │
│ (Flink/Spark)   │
└────┬────────────┘
     │ 4. Batch Update (every 5 min)
     ▼
┌─────────────────┐
│  Redis Counter  │
│  (Fast Reads)   │
└────┬────────────┘
     │ 5. Periodic Flush
     ▼
┌─────────────────┐
│  Database       │
│  (Persistent)   │
└─────────────────┘

Note: Eventual consistency is acceptable
Views may be slightly delayed (5-10 min)
```

---

## 5. API Design & Communication Protocols

### 5.1 REST APIs

#### Video Metadata APIs
```
GET /api/v1/videos/{videoId}
Response:
{
  "videoId": "abc123",
  "title": "Sample Video",
  "description": "...",
  "duration": 600,
  "views": 1000000,
  "likes": 50000,
  "dislikes": 1000,
  "channelId": "channel123",
  "uploadDate": "2025-01-15T10:00:00Z",
  "thumbnailUrl": "https://cdn.example.com/thumbnails/abc123.jpg",
  "manifestUrl": "https://cdn.example.com/videos/abc123/master.m3u8",
  "resolutions": ["2160p", "1080p", "720p", "480p", "360p", "240p"]
}

POST /api/v1/videos/upload
Headers:
  Authorization: Bearer <token>
Body (multipart):
  file: <video_file>
  title: "Video Title"
  description: "..."
  tags: ["tag1", "tag2"]
Response:
{
  "videoId": "abc123",
  "uploadStatus": "processing",
  "uploadUrl": "https://upload.example.com/abc123"
}

GET /api/v1/videos/{videoId}/recommendations
Response:
{
  "videos": [
    {"videoId": "xyz789", "title": "...", "thumbnailUrl": "..."},
    ...
  ]
}
```

#### Comment APIs
```
POST /api/v1/videos/{videoId}/comments
Headers:
  Authorization: Bearer <token>
Body:
{
  "text": "Great video!",
  "parentCommentId": null
}
Response:
{
  "commentId": "comment123",
  "userId": "user456",
  "text": "Great video!",
  "createdAt": "2025-01-15T10:00:00Z"
}

GET /api/v1/videos/{videoId}/comments?limit=20&offset=0&sort=top
Response:
{
  "comments": [
    {
      "commentId": "comment123",
      "userId": "user456",
      "userName": "John Doe",
      "text": "Great video!",
      "likes": 100,
      "replies": 5,
      "createdAt": "2025-01-15T10:00:00Z"
    },
    ...
  ],
  "nextOffset": 20
}
```

#### User Engagement APIs
```
POST /api/v1/videos/{videoId}/like
POST /api/v1/videos/{videoId}/dislike
POST /api/v1/channels/{channelId}/subscribe
POST /api/v1/videos/{videoId}/watch
  Body: { "timestamp": 120, "quality": "720p" }
```

### 5.2 Streaming Protocols

#### HLS (HTTP Live Streaming)
```
Master Playlist (master.m3u8):
#EXTM3U
#EXT-X-STREAM-INF:BANDWIDTH=8000000,RESOLUTION=3840x2160
2160p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=5000000,RESOLUTION=1920x1080
1080p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=2800000,RESOLUTION=1280x720
720p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=1400000,RESOLUTION=854x480
480p/index.m3u8
#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/index.m3u8

Quality Playlist (720p/index.m3u8):
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
segment_001.ts
#EXTINF:10.0,
segment_002.ts
#EXTINF:10.0,
segment_003.ts
...
#EXT-X-ENDLIST
```

#### DASH (Dynamic Adaptive Streaming over HTTP)
```
MPD (Media Presentation Description):
<?xml version="1.0"?>
<MPD>
  <Period>
    <AdaptationSet mimeType="video/mp4">
      <Representation bandwidth="8000000" width="3840" height="2160">
        <BaseURL>2160p/</BaseURL>
        <SegmentTemplate />
      </Representation>
      <Representation bandwidth="5000000" width="1920" height="1080">
        <BaseURL>1080p/</BaseURL>
        <SegmentTemplate />
      </Representation>
      ...
    </AdaptationSet>
  </Period>
</MPD>
```

### 5.3 WebSocket (Real-time Updates)
```
// Comment updates
WS /ws/videos/{videoId}/comments

Client -> Server:
{
  "type": "subscribe",
  "videoId": "abc123"
}

Server -> Client (new comment):
{
  "type": "new_comment",
  "comment": {
    "commentId": "comment789",
    "userId": "user123",
    "text": "Just posted!",
    "createdAt": "2025-01-15T10:05:00Z"
  }
}

// Live view count updates
Server -> Client (every 10s):
{
  "type": "view_count_update",
  "views": 1000543
}
```

---

## 6. Database Design

### 6.1 SQL Database (MySQL/PostgreSQL) - Metadata

#### Videos Table
```sql
CREATE TABLE videos (
    video_id VARCHAR(36) PRIMARY KEY,
    channel_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration INT NOT NULL, -- in seconds
    upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('processing', 'ready', 'failed') DEFAULT 'processing',
    category_id INT,
    privacy ENUM('public', 'unlisted', 'private') DEFAULT 'public',
    manifest_url VARCHAR(512),
    thumbnail_url VARCHAR(512),
    raw_video_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_channel_id (channel_id),
    INDEX idx_upload_date (upload_date),
    INDEX idx_status (status),
    INDEX idx_category (category_id)
);

CREATE TABLE video_resolutions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    video_id VARCHAR(36) NOT NULL,
    resolution VARCHAR(10) NOT NULL, -- '720p', '1080p', etc.
    video_url VARCHAR(512) NOT NULL,
    bitrate INT,
    file_size BIGINT,
    FOREIGN KEY (video_id) REFERENCES videos(video_id),
    INDEX idx_video_id (video_id)
);

CREATE TABLE video_stats (
    video_id VARCHAR(36) PRIMARY KEY,
    view_count BIGINT DEFAULT 0,
    like_count INT DEFAULT 0,
    dislike_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(video_id)
);
```

#### Channels Table
```sql
CREATE TABLE channels (
    channel_id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    channel_name VARCHAR(100) NOT NULL,
    description TEXT,
    subscriber_count BIGINT DEFAULT 0,
    total_views BIGINT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id)
);

CREATE TABLE subscriptions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    channel_id VARCHAR(36) NOT NULL,
    subscribed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notifications_enabled BOOLEAN DEFAULT TRUE,
    UNIQUE KEY unique_subscription (user_id, channel_id),
    INDEX idx_user_id (user_id),
    INDEX idx_channel_id (channel_id)
);
```

#### Users Table
```sql
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100),
    profile_picture_url VARCHAR(512),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_username (username)
);
```

### 6.2 NoSQL Database (Cassandra/DynamoDB) - Comments & Engagement

#### Comments Table (Cassandra Schema)
```cql
CREATE TABLE comments (
    video_id TEXT,
    comment_id TIMEUUID,
    user_id TEXT,
    parent_comment_id TIMEUUID,
    text TEXT,
    like_count INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    PRIMARY KEY (video_id, comment_id)
) WITH CLUSTERING ORDER BY (comment_id DESC);

-- Secondary index for user comments
CREATE TABLE user_comments (
    user_id TEXT,
    comment_id TIMEUUID,
    video_id TEXT,
    text TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (user_id, comment_id)
) WITH CLUSTERING ORDER BY (comment_id DESC);

-- Index for comment replies
CREATE TABLE comment_replies (
    parent_comment_id TIMEUUID,
    reply_id TIMEUUID,
    user_id TEXT,
    text TEXT,
    created_at TIMESTAMP,
    PRIMARY KEY (parent_comment_id, reply_id)
) WITH CLUSTERING ORDER BY (reply_id DESC);
```

#### Watch History (Cassandra Schema)
```cql
CREATE TABLE watch_history (
    user_id TEXT,
    watched_at TIMESTAMP,
    video_id TEXT,
    watch_duration INT, -- seconds watched
    total_duration INT, -- video total duration
    quality TEXT, -- resolution watched
    PRIMARY KEY (user_id, watched_at, video_id)
) WITH CLUSTERING ORDER BY (watched_at DESC);

-- For recommendations
CREATE TABLE user_preferences (
    user_id TEXT PRIMARY KEY,
    favorite_categories SET<TEXT>,
    disliked_categories SET<TEXT>,
    preferred_languages SET<TEXT>,
    watch_time_total BIGINT,
    last_updated TIMESTAMP
);
```

#### Video Analytics (Time-Series Data)
```cql
CREATE TABLE video_analytics (
    video_id TEXT,
    time_bucket TIMESTAMP, -- hourly/daily buckets
    metric_type TEXT, -- 'views', 'watch_time', 'engagement'
    value BIGINT,
    PRIMARY KEY ((video_id, metric_type), time_bucket)
) WITH CLUSTERING ORDER BY (time_bucket DESC);
```

### 6.3 Redis (Caching Layer)

```
# Video metadata cache
Key: video:{videoId}
Value: {JSON of video metadata}
TTL: 1 hour

# Video stats cache (hot data)
Key: video:stats:{videoId}
Value: {views: 1000000, likes: 50000, ...}
TTL: 5 minutes

# Trending videos cache
Key: trending:videos:{region}:{category}
Value: [videoId1, videoId2, ...]
TTL: 10 minutes

# User session cache
Key: user:session:{sessionId}
Value: {userId, preferences, ...}
TTL: 24 hours

# View count buffer (before batch update)
Key: video:views:{videoId}
Value: counter (incremented on each view)
Flush to DB: every 5 minutes

# Comment count cache
Key: video:comments:{videoId}
Value: sorted set of recent comments
TTL: 15 minutes

# Recommendation cache
Key: recommendations:{userId}
Value: [videoId1, videoId2, ...]
TTL: 30 minutes
```

---

## 7. Caching Strategy

### 7.1 Multi-Layer Caching Architecture

```
┌──────────────────────────────────────────────────────┐
│                  CLIENT LAYER                         │
│  Browser Cache: Video segments (24h)                 │
│  IndexedDB: Offline video chunks                     │
└─────────────────┬────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────┐
│                   CDN EDGE CACHE                      │
│  - Video segments (HLS/DASH): 7 days                 │
│  - Thumbnails: 30 days                               │
│  - Popular videos: Indefinite (with LRU)             │
│  - Cache hit ratio target: >95%                      │
└─────────────────┬────────────────────────────────────┘
                  │ (Cache miss)
                  ▼
┌──────────────────────────────────────────────────────┐
│               APPLICATION CACHE (Redis)               │
│  - Video metadata: 1 hour                            │
│  - User sessions: 24 hours                           │
│  - Trending videos: 10 minutes                       │
│  - View counts: 5 minutes                            │
│  - Recommendations: 30 minutes                       │
└─────────────────┬────────────────────────────────────┘
                  │ (Cache miss)
                  ▼
┌──────────────────────────────────────────────────────┐
│                  DATABASE LAYER                       │
│  SQL: Metadata, User data                            │
│  NoSQL: Comments, Analytics                          │
│  Object Storage: Video files                         │
└──────────────────────────────────────────────────────┘
```

### 7.2 CDN Strategy

#### Cache-Control Headers
```
Video Segments (*.ts, *.m4s):
  Cache-Control: public, max-age=604800, immutable
  (7 days, never changes once created)

Manifest Files (*.m3u8, *.mpd):
  Cache-Control: public, max-age=60
  (1 minute, can update for live streams)

Thumbnails:
  Cache-Control: public, max-age=2592000
  (30 days)

Video Metadata API:
  Cache-Control: public, max-age=300
  (5 minutes)
```

#### CDN Optimization Techniques
```
1. Geo-Distributed Edge Servers
   - User routed to nearest edge location
   - Reduces latency from ~200ms to ~20ms

2. Cache Warming
   - Pre-populate CDN with popular videos
   - Triggered on viral video detection

3. Range Requests
   - Support HTTP byte-range requests
   - Enable seeking without downloading entire file

4. Compression
   - Gzip/Brotli for manifests and metadata
   - Video already compressed (H.264/H.265)

5. Cache Tiering
   - Hot tier: Most popular videos (SSD)
   - Warm tier: Moderately popular (HDD)
   - Cold tier: Long-tail (Origin fetch)
```

### 7.3 Cache Invalidation Strategy

```
1. Time-Based Expiration (TTL)
   - Most common approach
   - Acceptable for view counts, stats

2. Event-Based Invalidation
   - Video deleted -> Invalidate all CDN cache
   - Video updated -> Invalidate metadata cache
   - Comment posted -> Invalidate comment cache

3. Write-Through Cache
   - Update cache immediately on write
   - Used for critical data (likes, subscriptions)

4. Cache-Aside Pattern
   - Application checks cache first
   - On miss, fetch from DB and populate cache
   - Used for video metadata
```

---

## 8. State Management

### 8.1 Client-Side State (Video Player)

```javascript
// Video Player State Machine
{
  playbackState: 'playing' | 'paused' | 'buffering' | 'ended',
  currentTime: 120.5, // seconds
  duration: 600,
  bufferedRanges: [[0, 150], [200, 250]], // buffered segments
  currentQuality: '720p',
  availableQualities: ['2160p', '1080p', '720p', '480p'],
  volume: 0.8,
  playbackRate: 1.0,
  isFullscreen: false,
  isMuted: false,
  captionsEnabled: true,

  // Adaptive bitrate state
  networkBandwidth: 5000000, // bps
  bufferHealth: 0.8, // 80% healthy
  qualitySwitchPending: false,

  // Analytics
  watchedSegments: [0, 30, 60, 90], // timestamps watched
  totalWatchTime: 150, // seconds
  bufferingEvents: 2,
  qualitySwitches: 3
}
```

### 8.2 Server-Side State

#### Session State (Redis)
```json
{
  "sessionId": "sess_abc123",
  "userId": "user_456",
  "videoId": "video_789",
  "currentPosition": 120,
  "quality": "720p",
  "lastHeartbeat": "2025-01-15T10:05:00Z",
  "device": "web",
  "location": "US-WEST"
}
```

#### Transcoding Job State (DynamoDB)
```json
{
  "jobId": "job_xyz",
  "videoId": "video_789",
  "status": "processing",
  "progress": 45,
  "currentResolution": "720p",
  "completedResolutions": ["240p", "360p", "480p"],
  "pendingResolutions": ["1080p", "2160p"],
  "startedAt": "2025-01-15T10:00:00Z",
  "estimatedCompletion": "2025-01-15T10:15:00Z"
}
```

### 8.3 State Synchronization

```
User watches video on Mobile -> Switches to TV

1. Mobile app sends position update:
   POST /api/v1/videos/{videoId}/progress
   { "position": 120, "timestamp": "..." }

2. Server updates Redis:
   SET user:video:progress:{userId}:{videoId} "120"

3. TV app polls for progress:
   GET /api/v1/videos/{videoId}/progress
   Response: { "position": 120 }

4. TV resumes from 120 seconds
```

---

## 9. Performance Optimization

### 9.1 Video Player Optimizations

#### Preloading Strategy
```javascript
// Intelligent preloading
function preloadStrategy(currentTime, duration, bufferHealth) {
  const timeRemaining = duration - currentTime;

  // Preload more if user is likely to finish video
  if (timeRemaining < 60 && bufferHealth > 0.7) {
    preloadAhead(30); // 30 seconds ahead
  } else if (bufferHealth > 0.8) {
    preloadAhead(20);
  } else if (bufferHealth < 0.3) {
    preloadAhead(10); // Conservative if buffer is low
  }

  // Preload next video in playlist
  if (timeRemaining < 10) {
    preloadNextVideo();
  }
}
```

#### Adaptive Bitrate Algorithm
```javascript
function selectQuality(bandwidth, bufferHealth, currentQuality) {
  // Quality ladder (bitrates in bps)
  const qualities = [
    { name: '240p', bitrate: 300000 },
    { name: '360p', bitrate: 800000 },
    { name: '480p', bitrate: 1400000 },
    { name: '720p', bitrate: 2800000 },
    { name: '1080p', bitrate: 5000000 },
    { name: '2160p', bitrate: 8000000 }
  ];

  // Conservative switching (bandwidth * 0.8 safety factor)
  const safeBandwidth = bandwidth * 0.8;

  // Upscale if buffer is healthy and bandwidth supports
  if (bufferHealth > 0.7) {
    for (let i = qualities.length - 1; i >= 0; i--) {
      if (safeBandwidth >= qualities[i].bitrate) {
        return qualities[i].name;
      }
    }
  }

  // Downscale immediately if buffering
  if (bufferHealth < 0.3) {
    const currentIndex = qualities.findIndex(q => q.name === currentQuality);
    return qualities[Math.max(0, currentIndex - 1)].name;
  }

  return currentQuality;
}
```

#### Buffering Strategy
```
┌─────────────────────────────────────────────────┐
│         Buffer Management Strategy              │
│                                                 │
│  Initial Buffer:  5 seconds                    │
│  Target Buffer:   15-30 seconds                │
│  Max Buffer:      60 seconds                   │
│                                                 │
│  Rebuffering Threshold: < 3 seconds            │
│  Quality Switch Threshold: < 10 seconds        │
│                                                 │
│  Buffer States:                                │
│  [0-3s]   -> Critical (downscale quality)      │
│  [3-10s]  -> Low (maintain quality)            │
│  [10-30s] -> Healthy (consider upscale)        │
│  [30-60s] -> Optimal (upscale if possible)     │
│  [60s+]   -> Pause preloading                  │
└─────────────────────────────────────────────────┘
```

### 9.2 Thumbnail Optimization

```
1. Generate Multiple Thumbnails
   - Sprite sheet (for seek preview)
   - Default thumbnail (720p)
   - Small thumbnail (360p for lists)
   - WebP format (smaller size)

2. Lazy Loading
   - Load thumbnails only when in viewport
   - Intersection Observer API
   - Placeholder blur image

3. Responsive Images
   <img
     srcset="thumb_360.webp 360w, thumb_720.webp 720w"
     sizes="(max-width: 600px) 360px, 720px"
     loading="lazy"
   />
```

### 9.3 Database Optimizations

#### Read Replicas
```
┌─────────────┐
│   Master    │ (Writes: Upload, Update)
│  Database   │
└──────┬──────┘
       │
       │ Replication
       ├───────────┬───────────┬───────────┐
       ▼           ▼           ▼           ▼
  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐
  │ Read    │ │ Read    │ │ Read    │ │ Read    │
  │ Replica │ │ Replica │ │ Replica │ │ Replica │
  │  (US)   │ │  (EU)   │ │ (APAC)  │ │ (Other) │
  └─────────┘ └─────────┘ └─────────┘ └─────────┘
       ▲           ▲           ▲           ▲
       │           │           │           │
  [Read] [Read] [Read] [Read] [Read] [Read]
  Video metadata, comments, recommendations
```

#### Database Indexing
```sql
-- Composite indexes for common queries
CREATE INDEX idx_video_channel_date
  ON videos(channel_id, upload_date DESC);

CREATE INDEX idx_video_category_views
  ON videos(category_id, view_count DESC);

-- Full-text search index
CREATE FULLTEXT INDEX idx_video_search
  ON videos(title, description, tags);

-- Covering index (includes all columns needed)
CREATE INDEX idx_video_list
  ON videos(status, category_id, upload_date DESC)
  INCLUDE (video_id, title, thumbnail_url, duration);
```

#### Query Optimization
```sql
-- Bad: N+1 query problem
SELECT * FROM videos WHERE channel_id = 'xyz';
-- Then for each video:
SELECT * FROM video_stats WHERE video_id = ?;

-- Good: Single JOIN query
SELECT v.*, vs.view_count, vs.like_count
FROM videos v
LEFT JOIN video_stats vs ON v.video_id = vs.video_id
WHERE v.channel_id = 'xyz'
ORDER BY v.upload_date DESC
LIMIT 20;

-- Use pagination with cursor
SELECT * FROM videos
WHERE upload_date < '2025-01-15T10:00:00Z'
ORDER BY upload_date DESC
LIMIT 20;
```

### 9.4 Backend Optimizations

#### API Response Compression
```
Gzip compression for JSON responses
Reduces response size by 70-90%

Before: 50KB JSON
After: 5KB Gzipped

Headers:
  Content-Encoding: gzip
  Accept-Encoding: gzip, deflate, br
```

#### Database Connection Pooling
```
Connection Pool Settings:
  Min Connections: 10
  Max Connections: 100
  Connection Timeout: 30s
  Idle Timeout: 600s

Reuse connections instead of creating new ones
Reduces latency from ~100ms to ~5ms per query
```

#### Async Processing
```
Synchronous Upload Flow (Slow):
User -> Upload -> Transcode -> Store -> Return
Total: 10+ minutes

Asynchronous Upload Flow (Fast):
User -> Upload -> Queue Job -> Return
                    |
                    v
               Background Worker
                    |
                    v
          Transcode -> Store -> Notify
Total user wait: < 5 seconds
```

---

## 10. Error Handling & Edge Cases

### 10.1 Video Player Errors

```javascript
// Comprehensive error handling
class VideoPlayerErrorHandler {
  handleError(error) {
    switch(error.code) {
      case 'MEDIA_ERR_ABORTED':
        // User aborted playback
        this.logError('User aborted', error);
        break;

      case 'MEDIA_ERR_NETWORK':
        // Network error during download
        this.retryWithBackoff();
        this.switchToLowerQuality();
        this.showUserMessage('Network error. Retrying...');
        break;

      case 'MEDIA_ERR_DECODE':
        // Video decode error
        this.switchToAlternateCodec();
        this.reportCorruptVideo();
        break;

      case 'MEDIA_ERR_SRC_NOT_SUPPORTED':
        // Unsupported video format
        this.showUserMessage('Video format not supported');
        this.fallbackToFlashPlayer(); // Legacy support
        break;

      case 'MANIFEST_LOAD_ERROR':
        // HLS/DASH manifest failed to load
        this.retryManifestLoad();
        break;

      case 'SEGMENT_LOAD_ERROR':
        // Individual segment failed
        this.skipSegment();
        this.continuePlayback();
        break;

      default:
        this.showGenericError();
        this.reportToMonitoring(error);
    }
  }

  retryWithBackoff() {
    const delays = [1000, 2000, 5000, 10000]; // ms
    let attempt = 0;

    const retry = () => {
      if (attempt < delays.length) {
        setTimeout(() => {
          this.reloadVideo();
          attempt++;
        }, delays[attempt]);
      } else {
        this.showUserMessage('Unable to load video. Please try again later.');
      }
    };

    retry();
  }
}
```

### 10.2 Upload Failures

```
Upload Error Scenarios:

1. File Too Large (>10GB)
   - Reject with clear error message
   - Suggest video compression
   - Return 413 Payload Too Large

2. Unsupported Format
   - Check file extension and MIME type
   - Return 415 Unsupported Media Type
   - Provide list of supported formats

3. Network Interruption
   - Resume upload from last chunk
   - Store upload progress in Redis
   - Support multipart upload resume

4. Storage Full
   - Return 507 Insufficient Storage
   - Queue for retry when space available
   - Notify admins

5. Virus/Malware Detection
   - Scan uploaded file
   - Quarantine suspicious files
   - Notify user and reject upload
```

### 10.3 Transcoding Failures

```
Transcoding Error Recovery:

1. Worker Failure
   - Job returns to queue
   - Another worker picks up
   - Max retries: 3

2. Corrupted Video File
   - Attempt repair with FFmpeg
   - If repair fails, notify user
   - Mark video as failed

3. Partial Transcoding Success
   - 720p succeeds, 1080p fails
   - Publish available resolutions
   - Retry failed resolutions

4. Timeout (>1 hour)
   - Split large video into chunks
   - Transcode chunks in parallel
   - Merge transcoded chunks

5. Resource Exhaustion
   - Scale up worker pool
   - Prioritize important videos
   - Queue low-priority videos
```

### 10.4 CDN Failures

```
CDN Failure Scenarios:

1. Edge Server Down
   - DNS failover to next nearest edge
   - Fallback to origin server
   - Auto-healing and alerting

2. Cache Corruption
   - Invalidate corrupted cache
   - Serve from origin
   - Re-warm cache

3. Origin Server Unreachable
   - Serve stale content (if acceptable)
   - Use backup origin server
   - Alert operations team

4. DDoS Attack
   - Rate limiting at edge
   - CAPTCHA for suspicious traffic
   - Geo-blocking if needed
```

### 10.5 Edge Cases

#### Concurrent Video Edits
```
Problem: User uploads video, then immediately updates title/description

Solution:
1. Lock video metadata during initial processing
2. Queue metadata updates
3. Apply updates after processing completes
4. Use optimistic locking with version numbers
```

#### Deleted Video Still Cached
```
Problem: Video deleted but still accessible via CDN

Solution:
1. Immediate cache invalidation on delete
2. Purge CDN cache (max propagation: 5 min)
3. Add "video not found" check in origin
4. Return 404 even if cached (with short TTL)
```

#### View Count Inconsistency
```
Problem: Different view counts across regions

Solution:
1. Accept eventual consistency
2. Batch updates every 5 minutes
3. Use distributed counter (Redis)
4. Periodic reconciliation job
5. Show approximate counts ("1M+" instead of exact)
```

#### Live Stream to VOD Transition
```
Problem: Live stream ends, should become video-on-demand

Solution:
1. Detect stream end event
2. Concatenate live segments
3. Transcode to standard VOD formats
4. Update manifest from live to VOD
5. Archive chat replay alongside video
```

#### Seek in Unbuffered Region
```
Problem: User seeks to 5:00 but only 0:00-1:00 buffered

Solution:
1. Clear existing buffer
2. Request manifest for 5:00 timestamp
3. Load segments starting from 5:00
4. Show loading spinner during seek
5. Resume playback when buffered
```

---

## 11. Interview Cross-Questions

### 11.1 Scalability Questions

**Q: How would you handle 10x traffic spike (e.g., breaking news)?**

A: Multi-pronged approach:
1. **Auto-scaling**: Horizontally scale services (API, transcoders, DB read replicas)
2. **CDN**: Most traffic absorbed by CDN edge caches (95%+ hit rate)
3. **Rate Limiting**: Protect backend services from overload
4. **Graceful Degradation**:
   - Disable non-critical features (recommendations, comments)
   - Serve lower quality videos
   - Queue non-urgent operations
5. **Load Shedding**: Reject requests with 503 when overloaded
6. **Pre-warming**: If spike is predictable, pre-populate CDN caches

**Q: How do you handle millions of concurrent uploads?**

A:
1. **Chunked Uploads**: Break into 5MB chunks, upload in parallel
2. **Upload Service Cluster**: Horizontal scaling with load balancer
3. **Queue-Based Transcoding**: Decouple upload from processing
4. **Priority Queue**: Prioritize verified channels, smaller videos
5. **Backpressure**: Slow down uploads if queue is full
6. **Direct S3 Upload**: Generate pre-signed URLs, client uploads directly to S3

### 11.2 Performance Questions

**Q: Video start time is 5 seconds. How to reduce to <2 seconds?**

A:
1. **Reduce Initial Manifest Size**: Serve only first 30s of manifest
2. **Preload First Segment**: Embed first segment in HTML (inline)
3. **Adaptive Initial Quality**: Start with 360p, upgrade after buffering
4. **CDN Edge Optimization**: Ensure nearest edge has content
5. **HTTP/2 Server Push**: Push manifest + first segment together
6. **Reduce DNS Lookup**: Use DNS prefetching, HTTP keep-alive
7. **Optimize Encoding**: Use faster codec profiles for first segments

**Q: How do you optimize for mobile devices with limited bandwidth?**

A:
1. **Aggressive Quality Downscaling**: Start with 240p on slow networks
2. **Reduce Segment Size**: 2-second segments instead of 10-second
3. **Thumbnail Sprites**: Single image with all seek thumbnails
4. **Data Saver Mode**: Lower quality, disable autoplay
5. **Offline Download**: Allow download for offline viewing
6. **Adaptive Preloading**: Reduce preload buffer on mobile
7. **Video Compression**: Use H.265/VP9 for better compression

### 11.3 Consistency & Reliability Questions

**Q: How do you ensure view counts are accurate?**

A:
- **Challenge**: Exact accuracy is expensive at scale
- **Solution**: Approximate counting with eventual consistency
  1. Client sends view event after 30s of watch time
  2. Event logged to Kafka/Kinesis
  3. Stream processor (Flink) aggregates events in 5-min windows
  4. Batch update to Redis counter
  5. Periodic flush to database (every hour)
  6. Tolerate 5-10 min delay in count updates
- **De-duplication**: Use session ID + video ID to prevent double-counting
- **Bot Detection**: Filter out bot traffic, suspicious IPs

**Q: What happens if transcoding service crashes mid-job?**

A:
1. **Job Queue with Retry**: Job remains in queue until acknowledged
2. **Worker Heartbeat**: Workers send heartbeat every 30s
3. **Job Timeout**: If no heartbeat for 2 min, job returns to queue
4. **Max Retries**: Retry up to 3 times, then mark as failed
5. **Checkpoint State**: Save transcoding progress every 20%
6. **Resume from Checkpoint**: New worker resumes from last checkpoint
7. **Dead Letter Queue**: Failed jobs go to DLQ for manual investigation

### 11.4 Data Modeling Questions

**Q: Why use both SQL and NoSQL databases?**

A:
- **SQL (MySQL/PostgreSQL)**:
  - Structured data with strong relationships
  - ACID transactions (e.g., user subscriptions)
  - Complex queries (e.g., search, recommendations)
  - Examples: Videos, Users, Channels

- **NoSQL (Cassandra/DynamoDB)**:
  - High write throughput (comments, analytics)
  - Flexible schema (user-generated content)
  - Time-series data (watch history, view counts)
  - Scalability (billions of comments)
  - Examples: Comments, Watch History, Analytics

**Q: How do you handle video deletion while ensuring no orphaned data?**

A:
1. **Soft Delete**: Mark video as deleted, don't remove immediately
2. **Background Cleanup Job**:
   - Delete all resolutions from S3
   - Delete thumbnails
   - Delete comments (Cassandra)
   - Delete analytics data
   - Remove from CDN cache
   - Remove from search index
3. **Cascading Delete**: Use database foreign keys with ON DELETE CASCADE
4. **Async Queue**: Queue delete operations for background processing
5. **Audit Log**: Keep deletion record for compliance
6. **Grace Period**: 30-day trash period before permanent deletion

### 11.5 Cost Optimization Questions

**Q: Video storage and bandwidth costs are very high. How to optimize?**

A:
1. **Storage Optimization**:
   - Delete rarely watched videos (after warning user)
   - Archive old videos to cheaper cold storage (Glacier)
   - De-duplicate identical videos
   - Remove redundant resolutions (e.g., skip 1440p)
   - Use better compression (H.265, VP9, AV1)

2. **Bandwidth Optimization**:
   - Aggressive CDN caching (reduce origin bandwidth)
   - Smart preloading (don't preload if user won't watch)
   - Disable autoplay on mobile
   - Lower default quality on slow networks
   - Use P2P delivery for live streams (WebRTC mesh)

3. **Transcoding Optimization**:
   - Adaptive transcoding (don't generate 4K for short videos)
   - On-demand transcoding (only transcode when requested)
   - Use cheaper GPU instances for encoding
   - Batch transcode jobs during off-peak hours

**Q: How do you decide which videos to cache on CDN?**

A:
- **Multi-factor scoring**:
  1. **Popularity**: View count, trending score
  2. **Recency**: Newly uploaded videos
  3. **Geography**: Popular in specific regions
  4. **Channel**: Verified channels, high subscriber count
  5. **Content Type**: Music videos, viral content

- **Cache Tiers**:
  - **Hot Tier** (SSD, all edges): Top 1% most popular
  - **Warm Tier** (HDD, major edges): Top 10%
  - **Cold Tier** (origin fetch): Long-tail content

- **Eviction Policy**: LRU with weighted scoring

### 11.6 Real-Time Features Questions

**Q: How would you implement live streaming?**

A:
1. **Ingest**:
   - Streamer uses RTMP/WebRTC to push to ingest server
   - Ingest server in nearest region

2. **Transcoding**:
   - Real-time transcoding to multiple qualities
   - Low-latency encoding (<3s delay)

3. **Distribution**:
   - HLS for regular live (10-30s delay acceptable)
   - WebRTC for ultra-low latency (<1s delay)
   - CDN edge caching of live segments

4. **Playback**:
   - Adaptive bitrate streaming
   - Live DVR (rewind live stream)
   - Chat synchronization

5. **Fallback**:
   - Automatic archive to VOD after stream ends

**Q: How do you implement real-time comment updates?**

A:
1. **WebSocket Connection**: Persistent connection for real-time updates
2. **Pub/Sub System**: Redis Pub/Sub or Kafka
   - User posts comment -> Publish to topic
   - All connected clients subscribed to topic receive update
3. **Scaling**:
   - Multiple WebSocket servers behind load balancer
   - Sticky sessions for connection persistence
   - Redis for cross-server message passing
4. **Fallback**: HTTP long-polling if WebSocket unavailable
5. **Optimization**: Only send updates for visible comments (top 50)

### 11.7 Security Questions

**Q: How do you prevent unauthorized video access?**

A:
1. **Authentication**: JWT tokens for user identity
2. **Authorization**: Check video privacy settings
   - Public: Anyone can watch
   - Unlisted: Only with direct link
   - Private: Only owner/invited users
3. **Signed URLs**: Time-limited, encrypted video URLs
   ```
   https://cdn.example.com/video.m3u8?token=xyz&expires=1234567890
   ```
4. **Token Rotation**: Short-lived tokens (5-15 min)
5. **DRM**: Encrypted video with Widevine/FairPlay for premium content
6. **Geo-Blocking**: Restrict content by region if required

**Q: How do you prevent video piracy?**

A:
1. **DRM Encryption**: Widevine, FairPlay, PlayReady
2. **Watermarking**: Visible/invisible watermarks with user ID
3. **HDCP**: Prevent screen recording (hardware-level)
4. **Forensic Watermarking**: Trace leaked videos back to source
5. **Download Restrictions**: Disable right-click, inspect element
6. **Rate Limiting**: Prevent bulk downloading
7. **Legal**: DMCA takedown process, content ID matching

---

## 12. Trade-offs & Design Decisions

### SQL vs NoSQL for Comments
**Decision**: Use NoSQL (Cassandra)
- **Pro**: Better write scalability for high-volume comments
- **Pro**: Time-ordered retrieval (TIMEUUID)
- **Con**: Limited query flexibility
- **Con**: Eventual consistency

### HLS vs DASH
**Decision**: Support both, prefer HLS
- **HLS**: Wider browser support (Safari, iOS)
- **DASH**: Open standard, better features
- **Solution**: Serve HLS to Apple devices, DASH to others

### Synchronous vs Asynchronous Transcoding
**Decision**: Asynchronous with job queue
- **Pro**: Fast upload response (<5s)
- **Pro**: Decouple upload from processing
- **Con**: Video not immediately available
- **Mitigation**: Show processing status, estimate completion time

### CDN vs Self-Hosted Streaming
**Decision**: Use CDN (CloudFront, Akamai)
- **Pro**: Global edge caching, low latency
- **Pro**: DDoS protection, high availability
- **Con**: Expensive for high traffic
- **Mitigation**: Aggressive caching, P2P for live streams

### Exact vs Approximate View Counting
**Decision**: Approximate counting with 5-min delay
- **Pro**: Massive scalability improvement
- **Pro**: Reduced database write load
- **Con**: Slight delay in count updates
- **Why**: Users tolerate small delays for view counts

---

## Summary

This design provides a scalable, performant, and reliable video streaming platform similar to YouTube. Key highlights:

1. **Scalability**: Horizontally scalable services, CDN for global reach
2. **Performance**: Adaptive bitrate streaming, multi-layer caching, <2s start time
3. **Reliability**: Queue-based transcoding, retry mechanisms, graceful degradation
4. **Cost Efficiency**: Aggressive caching, smart preloading, compression
5. **User Experience**: Smooth playback, real-time comments, personalized recommendations

The architecture handles millions of concurrent users, supports live and VOD streaming, and provides a YouTube-like experience with adaptive quality, comments, and recommendations.

---

## 13. Accessibility (a11y)

### Video Player Keyboard Controls

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIDEO PLAYER KEYBOARD SHORTCUTS                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Playback Controls:                                                         │
│  ──────────────────                                                          │
│  Space / K         Play / Pause                                            │
│  J                 Rewind 10 seconds                                        │
│  L                 Fast forward 10 seconds                                  │
│  ← / →             Seek backward/forward 5 seconds                         │
│  Home              Go to beginning                                          │
│  End               Go to end                                                │
│  0-9               Jump to 0%-90% of video                                 │
│                                                                              │
│  Volume Controls:                                                           │
│  ────────────────                                                            │
│  M                 Mute / Unmute                                            │
│  ↑ / ↓             Increase / Decrease volume 5%                           │
│                                                                              │
│  Display Controls:                                                          │
│  ─────────────────                                                           │
│  F                 Toggle fullscreen                                        │
│  Escape            Exit fullscreen                                          │
│  C                 Toggle captions                                          │
│  < / >             Decrease / Increase playback speed                      │
│  I                 Toggle mini-player                                       │
│  T                 Toggle theater mode                                      │
│                                                                              │
│  Navigation:                                                                │
│  ───────────                                                                 │
│  Tab               Navigate between controls                               │
│  Shift+N           Next video in playlist                                  │
│  Shift+P           Previous video in playlist                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Accessible Video Player Implementation

```typescript
// AccessibleVideoPlayer.tsx
const AccessibleVideoPlayer = ({ videoId, captions }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [captionsEnabled, setCaptionsEnabled] = useState(false);
  const announcer = useRef<HTMLDivElement>(null);

  // Screen reader announcements
  const announce = (message: string) => {
    if (announcer.current) {
      announcer.current.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        if (announcer.current) announcer.current.textContent = '';
      }, 1000);
    }
  };

  // Keyboard handler
  const handleKeyDown = (e: KeyboardEvent) => {
    const video = videoRef.current;
    if (!video) return;

    // Don't handle if typing in input
    if (e.target instanceof HTMLInputElement) return;

    switch (e.key) {
      case ' ':
      case 'k':
        e.preventDefault();
        togglePlay();
        break;

      case 'j':
        e.preventDefault();
        seekBy(-10);
        announce('Rewound 10 seconds');
        break;

      case 'l':
        e.preventDefault();
        seekBy(10);
        announce('Fast forwarded 10 seconds');
        break;

      case 'ArrowLeft':
        e.preventDefault();
        seekBy(-5);
        announce('Rewound 5 seconds');
        break;

      case 'ArrowRight':
        e.preventDefault();
        seekBy(5);
        announce('Fast forwarded 5 seconds');
        break;

      case 'ArrowUp':
        e.preventDefault();
        adjustVolume(0.05);
        break;

      case 'ArrowDown':
        e.preventDefault();
        adjustVolume(-0.05);
        break;

      case 'm':
        e.preventDefault();
        toggleMute();
        break;

      case 'f':
        e.preventDefault();
        toggleFullscreen();
        break;

      case 'c':
        e.preventDefault();
        toggleCaptions();
        break;

      default:
        // Number keys 0-9 for percentage seek
        if (e.key >= '0' && e.key <= '9') {
          e.preventDefault();
          const percent = parseInt(e.key) * 10;
          seekToPercent(percent);
          announce(`Jumped to ${percent}%`);
        }
    }
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
      announce('Playing');
    } else {
      video.pause();
      setIsPlaying(false);
      announce('Paused');
    }
  };

  const adjustVolume = (delta: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = Math.max(0, Math.min(1, video.volume + delta));
    video.volume = newVolume;
    setVolume(newVolume);
    announce(`Volume ${Math.round(newVolume * 100)}%`);
  };

  const toggleCaptions = () => {
    setCaptionsEnabled(!captionsEnabled);
    announce(captionsEnabled ? 'Captions off' : 'Captions on');
  };

  return (
    <div
      className="video-player-container"
      role="application"
      aria-label="Video player"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Screen reader announcements */}
      <div
        ref={announcer}
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      <video
        ref={videoRef}
        aria-label={`Video: ${title}`}
        onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
        onLoadedMetadata={() => setDuration(videoRef.current?.duration || 0)}
      >
        {captionsEnabled && captions.map(caption => (
          <track
            key={caption.language}
            kind="captions"
            src={caption.url}
            srcLang={caption.language}
            label={caption.label}
            default={caption.isDefault}
          />
        ))}
      </video>

      {/* Accessible controls */}
      <div
        className="video-controls"
        role="toolbar"
        aria-label="Video controls"
      >
        <button
          aria-label={isPlaying ? 'Pause' : 'Play'}
          aria-pressed={isPlaying}
          onClick={togglePlay}
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="timeline-container">
          <input
            type="range"
            aria-label="Video timeline"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={currentTime}
            aria-valuetext={formatTime(currentTime)}
            value={currentTime}
            max={duration}
            onChange={(e) => seekTo(parseFloat(e.target.value))}
          />
          <span className="sr-only">
            {formatTime(currentTime)} of {formatTime(duration)}
          </span>
        </div>

        <button
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          aria-pressed={isMuted}
          onClick={toggleMute}
        >
          {isMuted ? <MuteIcon /> : <VolumeIcon />}
        </button>

        <input
          type="range"
          aria-label="Volume"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(volume * 100)}
          value={volume * 100}
          max={100}
          onChange={(e) => setVolume(parseFloat(e.target.value) / 100)}
        />

        <button
          aria-label={captionsEnabled ? 'Turn off captions' : 'Turn on captions'}
          aria-pressed={captionsEnabled}
          onClick={toggleCaptions}
        >
          <CaptionsIcon />
        </button>

        <button
          aria-label="Enter fullscreen"
          onClick={toggleFullscreen}
        >
          <FullscreenIcon />
        </button>
      </div>
    </div>
  );
};
```

### Captions & Subtitles

```typescript
// CaptionManager.tsx
interface Caption {
  startTime: number;
  endTime: number;
  text: string;
}

const CaptionManager = ({
  captions,
  currentTime,
  enabled,
  style
}: CaptionManagerProps) => {
  const [activeCaption, setActiveCaption] = useState<Caption | null>(null);

  useEffect(() => {
    if (!enabled) {
      setActiveCaption(null);
      return;
    }

    const caption = captions.find(
      c => currentTime >= c.startTime && currentTime <= c.endTime
    );

    setActiveCaption(caption || null);
  }, [currentTime, captions, enabled]);

  if (!activeCaption) return null;

  return (
    <div
      className="caption-container"
      role="region"
      aria-label="Video captions"
      aria-live="off" // Don't announce each caption
      style={{
        backgroundColor: style.backgroundColor,
        color: style.textColor,
        fontSize: style.fontSize,
        fontFamily: style.fontFamily,
      }}
    >
      {activeCaption.text}
    </div>
  );
};

// Caption settings panel
const CaptionSettings = ({ onStyleChange }: CaptionSettingsProps) => {
  return (
    <div
      role="dialog"
      aria-label="Caption settings"
      className="caption-settings"
    >
      <h3 id="caption-settings-title">Caption Settings</h3>

      <div role="group" aria-labelledby="font-size-label">
        <label id="font-size-label">Font Size</label>
        <select
          aria-describedby="font-size-label"
          onChange={(e) => onStyleChange('fontSize', e.target.value)}
        >
          <option value="75%">75%</option>
          <option value="100%">100% (Default)</option>
          <option value="150%">150%</option>
          <option value="200%">200%</option>
        </select>
      </div>

      <div role="group" aria-labelledby="font-family-label">
        <label id="font-family-label">Font Family</label>
        <select
          onChange={(e) => onStyleChange('fontFamily', e.target.value)}
        >
          <option value="sans-serif">Sans-serif</option>
          <option value="serif">Serif</option>
          <option value="monospace">Monospace</option>
        </select>
      </div>

      <div role="group" aria-labelledby="bg-color-label">
        <label id="bg-color-label">Background</label>
        <select
          onChange={(e) => onStyleChange('backgroundColor', e.target.value)}
        >
          <option value="rgba(0,0,0,0.75)">Black (Default)</option>
          <option value="rgba(255,255,255,0.75)">White</option>
          <option value="transparent">Transparent</option>
        </select>
      </div>
    </div>
  );
};
```

### Focus Management

```typescript
// useFocusTrap.ts - Trap focus within video player settings
const useFocusTrap = (isActive: boolean, containerRef: RefObject<HTMLElement>) => {
  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, containerRef]);
};

// VideoSettingsDialog.tsx
const VideoSettingsDialog = ({ isOpen, onClose }: SettingsDialogProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);

  useFocusTrap(isOpen, dialogRef);

  useEffect(() => {
    if (isOpen) {
      // Store previously focused element
      previouslyFocusedRef.current = document.activeElement as HTMLElement;
    } else {
      // Restore focus when closing
      previouslyFocusedRef.current?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      className="settings-dialog"
    >
      <h2 id="settings-title">Video Settings</h2>

      {/* Settings content */}

      <button
        onClick={onClose}
        aria-label="Close settings"
      >
        Close
      </button>
    </div>
  );
};
```

### Screen Reader Optimizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCREEN READER ANNOUNCEMENTS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Playback Events:                                                           │
│  ────────────────                                                            │
│  • "Playing" / "Paused"                                                    │
│  • "Video ended"                                                            │
│  • "Buffering..." / "Playback resumed"                                     │
│  • "Rewound 10 seconds"                                                    │
│  • "Fast forwarded 10 seconds"                                             │
│                                                                              │
│  Quality Changes:                                                           │
│  ────────────────                                                            │
│  • "Quality changed to 1080p"                                              │
│  • "Auto quality: switching to 720p"                                       │
│                                                                              │
│  Volume:                                                                    │
│  ───────                                                                     │
│  • "Volume 50%"                                                             │
│  • "Muted" / "Unmuted"                                                      │
│                                                                              │
│  Captions:                                                                  │
│  ─────────                                                                   │
│  • "Captions on: English"                                                  │
│  • "Captions off"                                                           │
│                                                                              │
│  Navigation:                                                                │
│  ───────────                                                                 │
│  • "Jumped to 50%"                                                          │
│  • "Now playing: [Video Title]"                                            │
│  • "Entered fullscreen" / "Exited fullscreen"                              │
│                                                                              │
│  Implementation:                                                            │
│  ───────────────                                                             │
│  <div                                                                       │
│    role="status"                                                            │
│    aria-live="polite"                                                       │
│    aria-atomic="true"                                                       │
│    className="sr-only"                                                      │
│  >                                                                          │
│    {announcement}                                                           │
│  </div>                                                                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Video Grid Accessibility

```typescript
// AccessibleVideoGrid.tsx
const AccessibleVideoGrid = ({ videos }: VideoGridProps) => {
  return (
    <section aria-label="Video recommendations">
      <h2 id="recommendations-heading">Recommended Videos</h2>

      <ul
        role="list"
        aria-labelledby="recommendations-heading"
        className="video-grid"
      >
        {videos.map((video, index) => (
          <li key={video.id}>
            <article
              className="video-card"
              aria-labelledby={`video-title-${video.id}`}
            >
              <a
                href={`/watch?v=${video.id}`}
                aria-describedby={`video-meta-${video.id}`}
              >
                <img
                  src={video.thumbnailUrl}
                  alt="" // Decorative, title provides context
                  loading="lazy"
                />

                <div className="video-duration" aria-hidden="true">
                  {formatDuration(video.duration)}
                </div>
              </a>

              <div className="video-info">
                <h3 id={`video-title-${video.id}`}>
                  <a href={`/watch?v=${video.id}`}>
                    {video.title}
                  </a>
                </h3>

                <p id={`video-meta-${video.id}`} className="video-meta">
                  <span>{video.channelName}</span>
                  <span aria-label={`${video.views} views`}>
                    {formatViews(video.views)} views
                  </span>
                  <span aria-label={`uploaded ${video.uploadedAt}`}>
                    {formatRelativeTime(video.uploadedAt)}
                  </span>
                  <span className="sr-only">
                    Duration: {formatDurationAccessible(video.duration)}
                  </span>
                </p>
              </div>
            </article>
          </li>
        ))}
      </ul>
    </section>
  );
};

// Accessible duration formatting
const formatDurationAccessible = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? 's' : ''}`);
  if (secs > 0) parts.push(`${secs} second${secs > 1 ? 's' : ''}`);

  return parts.join(' ');
};
```

---

## 14. Security & Content Protection

### DRM (Digital Rights Management) Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DRM ENCRYPTION FLOW                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Video Upload → Encode → Encrypt → Store                                   │
│                                                                              │
│   ┌──────────┐                                                              │
│   │  Raw     │                                                              │
│   │  Video   │                                                              │
│   └────┬─────┘                                                              │
│        │                                                                     │
│        ▼                                                                     │
│   ┌──────────────────────────────────────────────────────────────────┐     │
│   │                  ENCODING & ENCRYPTION                            │     │
│   │                                                                    │     │
│   │  1. Transcode to multiple resolutions                            │     │
│   │  2. Generate encryption keys (per video)                         │     │
│   │  3. Encrypt each segment with AES-128-CTR                        │     │
│   │  4. Create DRM licenses:                                         │     │
│   │     • Widevine (Chrome, Android)                                 │     │
│   │     • FairPlay (Safari, iOS)                                     │     │
│   │     • PlayReady (Edge, Windows)                                  │     │
│   │  5. Store encrypted segments + license server URLs               │     │
│   │                                                                    │     │
│   └──────────────────────────────────────────────────────────────────┘     │
│        │                                                                     │
│        ▼                                                                     │
│   ┌──────────┐   ┌──────────┐   ┌──────────┐                              │
│   │ Encrypted│   │  License │   │   Key    │                              │
│   │ Segments │   │  Server  │   │  Server  │                              │
│   │   (S3)   │   │          │   │          │                              │
│   └──────────┘   └──────────┘   └──────────┘                              │
│                                                                              │
│  Playback Flow:                                                             │
│  ───────────────                                                             │
│  1. Client requests manifest (encrypted video reference)                   │
│  2. Client requests license from License Server                           │
│  3. License Server validates user subscription/rental                     │
│  4. License Server returns decryption key                                 │
│  5. Client CDM (Content Decryption Module) decrypts video                │
│  6. Decrypted video played in protected path                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Widevine DRM Implementation

```typescript
// DRMPlayer.tsx - Multi-DRM Video Player
const DRMPlayer = ({ videoId, manifestUrl }: DRMPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initDRM = async () => {
      const video = videoRef.current;
      if (!video) return;

      // Detect DRM support
      const drmConfig = await detectDRMSupport();

      if (!drmConfig) {
        setError('DRM not supported on this browser');
        return;
      }

      try {
        // Initialize Shaka Player with DRM
        const shaka = await import('shaka-player');
        shaka.polyfill.installAll();

        const player = new shaka.Player(video);

        player.configure({
          drm: {
            servers: {
              'com.widevine.alpha': `${API_URL}/drm/widevine/license?videoId=${videoId}`,
              'com.apple.fps.1_0': `${API_URL}/drm/fairplay/license?videoId=${videoId}`,
              'com.microsoft.playready': `${API_URL}/drm/playready/license?videoId=${videoId}`,
            },
          },
        });

        // FairPlay requires certificate
        if (drmConfig.keySystem === 'com.apple.fps.1_0') {
          const cert = await fetchFairPlayCertificate();
          player.configure('drm.advanced.com\\.apple\\.fps\\.1_0.serverCertificate', cert);
        }

        await player.load(manifestUrl);

      } catch (err) {
        console.error('DRM initialization failed:', err);
        setError('Failed to load protected content');
      }
    };

    initDRM();
  }, [videoId, manifestUrl]);

  return (
    <div className="drm-player">
      {error && (
        <div className="drm-error" role="alert">
          <p>{error}</p>
          <p>Try using Chrome, Safari, or Edge for protected content.</p>
        </div>
      )}
      <video ref={videoRef} controls />
    </div>
  );
};

// Detect which DRM system is supported
const detectDRMSupport = async (): Promise<DRMConfig | null> => {
  const keySystems = [
    { keySystem: 'com.widevine.alpha', name: 'Widevine' },
    { keySystem: 'com.apple.fps.1_0', name: 'FairPlay' },
    { keySystem: 'com.microsoft.playready', name: 'PlayReady' },
  ];

  for (const config of keySystems) {
    try {
      const result = await navigator.requestMediaKeySystemAccess(
        config.keySystem,
        [{
          initDataTypes: ['cenc'],
          videoCapabilities: [{
            contentType: 'video/mp4; codecs="avc1.42E01E"',
          }],
        }]
      );

      if (result) {
        return config;
      }
    } catch (e) {
      // This DRM not supported, try next
    }
  }

  return null;
};
```

### Signed URL Implementation

```typescript
// signedUrl.ts - Generate time-limited signed URLs
interface SignedUrlParams {
  videoId: string;
  userId: string;
  expiresIn: number; // seconds
  ipAddress?: string;
}

// Server-side: Generate signed URL
const generateSignedUrl = (params: SignedUrlParams): string => {
  const expires = Math.floor(Date.now() / 1000) + params.expiresIn;

  const dataToSign = [
    params.videoId,
    params.userId,
    expires.toString(),
    params.ipAddress || '',
  ].join(':');

  const signature = crypto
    .createHmac('sha256', process.env.URL_SIGNING_SECRET!)
    .update(dataToSign)
    .digest('hex');

  const queryParams = new URLSearchParams({
    videoId: params.videoId,
    expires: expires.toString(),
    signature,
    ...(params.ipAddress && { ip: params.ipAddress }),
  });

  return `${CDN_BASE_URL}/videos/${params.videoId}/manifest.m3u8?${queryParams}`;
};

// Client-side: Request signed URL before playback
const getVideoUrl = async (videoId: string): Promise<string> => {
  const response = await fetch(`/api/v1/videos/${videoId}/play`, {
    headers: {
      Authorization: `Bearer ${getAuthToken()}`,
    },
  });

  const { signedUrl, expiresAt } = await response.json();

  // Store expiration for refresh
  videoUrlCache.set(videoId, { url: signedUrl, expiresAt });

  return signedUrl;
};

// Auto-refresh signed URL before expiration
const useSignedUrl = (videoId: string) => {
  const [signedUrl, setSignedUrl] = useState<string | null>(null);
  const refreshTimer = useRef<NodeJS.Timeout>();

  useEffect(() => {
    const fetchAndRefresh = async () => {
      const response = await getVideoUrl(videoId);
      setSignedUrl(response.url);

      // Refresh 1 minute before expiration
      const refreshIn = (response.expiresAt - Date.now() - 60000);
      refreshTimer.current = setTimeout(fetchAndRefresh, refreshIn);
    };

    fetchAndRefresh();

    return () => {
      if (refreshTimer.current) {
        clearTimeout(refreshTimer.current);
      }
    };
  }, [videoId]);

  return signedUrl;
};
```

### Content ID & Copyright Detection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONTENT ID MATCHING FLOW                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Upload Flow with Content ID Check:                                        │
│  ──────────────────────────────────                                          │
│                                                                              │
│   User Upload                                                               │
│       │                                                                      │
│       ▼                                                                      │
│   ┌──────────────────┐                                                      │
│   │  Extract Audio/  │                                                      │
│   │  Video Fingerprint│                                                     │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   ┌──────────────────┐                                                      │
│   │  Compare Against │                                                      │
│   │  Reference DB    │                                                      │
│   │  (100M+ tracks)  │                                                      │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│     ┌──────┴──────┐                                                         │
│     │             │                                                          │
│   Match?        No Match                                                    │
│     │             │                                                          │
│     ▼             ▼                                                          │
│  ┌─────────┐   ┌─────────┐                                                  │
│  │ Check   │   │ Publish │                                                  │
│  │ Policy  │   │ Video   │                                                  │
│  └────┬────┘   └─────────┘                                                  │
│       │                                                                      │
│       ├─────────────┬─────────────┬─────────────┐                          │
│       │             │             │             │                           │
│       ▼             ▼             ▼             ▼                           │
│    Block         Monetize      Track Only    Allow                         │
│  (Takedown)   (Ads for owner)  (Analytics)  (Licensed)                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Age-Restricted Content UI

```typescript
// AgeVerification.tsx
const AgeVerification = ({ videoId, onVerified }: AgeVerificationProps) => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const verifyAge = () => {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = Math.floor((today.getTime() - birth.getTime()) / (365.25 * 24 * 60 * 60 * 1000));

    if (age >= 18) {
      // Store verification in session
      sessionStorage.setItem('ageVerified', 'true');
      onVerified();
    } else {
      setError('You must be 18 or older to view this content.');
    }
  };

  return (
    <div className="age-verification" role="dialog" aria-labelledby="age-title">
      <div className="age-content">
        <WarningIcon />
        <h2 id="age-title">Age-Restricted Content</h2>

        <p>
          This video may be inappropriate for some users.
          Please confirm your age to continue.
        </p>

        <div className="age-form">
          <label htmlFor="birthdate">Date of Birth</label>
          <input
            id="birthdate"
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            aria-describedby={error ? 'age-error' : undefined}
          />

          {error && (
            <p id="age-error" className="error" role="alert">
              {error}
            </p>
          )}

          <button onClick={verifyAge} disabled={!birthDate}>
            Confirm Age
          </button>
        </div>

        <p className="privacy-notice">
          We don't store your date of birth.
          <a href="/privacy">Learn more</a>
        </p>
      </div>
    </div>
  );
};

// AgeRestrictedWrapper.tsx
const AgeRestrictedWrapper = ({ video, children }: AgeRestrictedWrapperProps) => {
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    // Check if already verified this session
    const verified = sessionStorage.getItem('ageVerified') === 'true';
    setIsVerified(verified || !video.isAgeRestricted);
  }, [video]);

  if (!isVerified) {
    return (
      <AgeVerification
        videoId={video.id}
        onVerified={() => setIsVerified(true)}
      />
    );
  }

  return <>{children}</>;
};
```

### Content Moderation UI

```typescript
// ReportContent.tsx
const ReportContent = ({ videoId, onClose }: ReportContentProps) => {
  const [reason, setReason] = useState<string>('');
  const [details, setDetails] = useState<string>('');
  const [timestamp, setTimestamp] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reportReasons = [
    { value: 'sexual', label: 'Sexual content' },
    { value: 'violent', label: 'Violent or graphic content' },
    { value: 'hateful', label: 'Hateful or abusive content' },
    { value: 'harassment', label: 'Harassment or bullying' },
    { value: 'spam', label: 'Spam or misleading' },
    { value: 'copyright', label: 'Copyright infringement' },
    { value: 'privacy', label: 'Privacy violation' },
    { value: 'dangerous', label: 'Dangerous acts' },
    { value: 'child_safety', label: 'Child safety concern' },
    { value: 'other', label: 'Other' },
  ];

  const submitReport = async () => {
    setIsSubmitting(true);

    try {
      await fetch('/api/v1/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          videoId,
          reason,
          details,
          timestamp,
          reportedAt: new Date().toISOString(),
        }),
      });

      onClose();
      showToast('Report submitted. Thank you for helping keep our platform safe.');

    } catch (error) {
      showToast('Failed to submit report. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="report-dialog"
      role="dialog"
      aria-labelledby="report-title"
    >
      <h2 id="report-title">Report Video</h2>

      <fieldset>
        <legend>What's the issue?</legend>
        {reportReasons.map(r => (
          <label key={r.value} className="radio-option">
            <input
              type="radio"
              name="reason"
              value={r.value}
              checked={reason === r.value}
              onChange={() => setReason(r.value)}
            />
            {r.label}
          </label>
        ))}
      </fieldset>

      <div className="form-group">
        <label htmlFor="details">Additional details (optional)</label>
        <textarea
          id="details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          placeholder="Provide more context about your report..."
          maxLength={500}
        />
      </div>

      <div className="form-group">
        <label htmlFor="timestamp">
          Timestamp where issue occurs (optional)
        </label>
        <input
          id="timestamp"
          type="text"
          placeholder="e.g., 2:30"
          onChange={(e) => setTimestamp(parseTimestamp(e.target.value))}
        />
      </div>

      <div className="dialog-actions">
        <button onClick={onClose}>Cancel</button>
        <button
          onClick={submitReport}
          disabled={!reason || isSubmitting}
          className="primary"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Report'}
        </button>
      </div>
    </div>
  );
};
```

### HTTPS & Security Headers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SECURITY HEADERS                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Essential Headers:                                                         │
│  ──────────────────                                                          │
│                                                                              │
│  # Force HTTPS                                                              │
│  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload   │
│                                                                              │
│  # Prevent clickjacking                                                     │
│  X-Frame-Options: DENY                                                      │
│  Content-Security-Policy: frame-ancestors 'none'                           │
│                                                                              │
│  # Prevent MIME sniffing                                                   │
│  X-Content-Type-Options: nosniff                                           │
│                                                                              │
│  # XSS Protection                                                           │
│  X-XSS-Protection: 1; mode=block                                           │
│                                                                              │
│  # Content Security Policy                                                  │
│  Content-Security-Policy:                                                   │
│    default-src 'self';                                                      │
│    script-src 'self' 'unsafe-inline' cdn.example.com;                      │
│    style-src 'self' 'unsafe-inline';                                       │
│    media-src 'self' blob: cdn.example.com *.cloudfront.net;               │
│    img-src 'self' data: cdn.example.com i.ytimg.com;                       │
│    connect-src 'self' api.example.com wss://ws.example.com;               │
│                                                                              │
│  # Referrer Policy                                                          │
│  Referrer-Policy: strict-origin-when-cross-origin                          │
│                                                                              │
│  # Permissions Policy (disable unnecessary features)                       │
│  Permissions-Policy: geolocation=(), microphone=(), camera=()              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Mobile & Touch Interactions

### Double-Tap to Seek

```typescript
// DoubleTapSeek.tsx
const DoubleTapSeek = ({ videoRef, seekAmount = 10 }: DoubleTapSeekProps) => {
  const [showIndicator, setShowIndicator] = useState<'left' | 'right' | null>(null);
  const [tapCount, setTapCount] = useState(0);
  const lastTapTime = useRef(0);
  const tapTimeout = useRef<NodeJS.Timeout>();

  const handleTap = (e: React.TouchEvent, side: 'left' | 'right') => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapTime.current;

    if (timeSinceLastTap < 300) {
      // Double tap detected
      clearTimeout(tapTimeout.current);
      setTapCount(prev => prev + 1);

      const video = videoRef.current;
      if (video) {
        if (side === 'left') {
          video.currentTime = Math.max(0, video.currentTime - seekAmount);
        } else {
          video.currentTime = Math.min(video.duration, video.currentTime + seekAmount);
        }
      }

      setShowIndicator(side);

      // Reset after animation
      setTimeout(() => {
        setShowIndicator(null);
        setTapCount(0);
      }, 500);

    } else {
      // Single tap - wait to see if it's a double tap
      tapTimeout.current = setTimeout(() => {
        // Single tap action (show/hide controls)
        toggleControls();
      }, 300);
    }

    lastTapTime.current = now;
  };

  return (
    <div className="double-tap-container">
      <div
        className="tap-zone tap-zone-left"
        onTouchEnd={(e) => handleTap(e, 'left')}
      >
        {showIndicator === 'left' && (
          <div className="seek-indicator">
            <SeekBackIcon />
            <span>{tapCount * seekAmount}s</span>
          </div>
        )}
      </div>

      <div
        className="tap-zone tap-zone-right"
        onTouchEnd={(e) => handleTap(e, 'right')}
      >
        {showIndicator === 'right' && (
          <div className="seek-indicator">
            <SeekForwardIcon />
            <span>{tapCount * seekAmount}s</span>
          </div>
        )}
      </div>
    </div>
  );
};
```

### Pinch to Zoom (Video Crop)

```typescript
// PinchToZoom.tsx
import { useGesture } from '@use-gesture/react';
import { useSpring, animated } from '@react-spring/web';

const PinchToZoom = ({ children }: PinchToZoomProps) => {
  const [{ scale, x, y }, api] = useSpring(() => ({
    scale: 1,
    x: 0,
    y: 0,
  }));

  const containerRef = useRef<HTMLDivElement>(null);

  useGesture(
    {
      onPinch: ({ offset: [s], memo }) => {
        // Limit scale between 1x and 3x
        const newScale = Math.min(Math.max(s, 1), 3);
        api.start({ scale: newScale });
        return memo;
      },

      onPinchEnd: () => {
        // Snap back to 1x if close
        if (scale.get() < 1.2) {
          api.start({ scale: 1, x: 0, y: 0 });
        }
      },

      onDrag: ({ offset: [ox, oy], pinching }) => {
        // Only allow pan when zoomed in
        if (!pinching && scale.get() > 1) {
          api.start({ x: ox, y: oy });
        }
      },
    },
    {
      target: containerRef,
      pinch: { scaleBounds: { min: 1, max: 3 } },
      drag: {
        from: () => [x.get(), y.get()],
        bounds: () => {
          const currentScale = scale.get();
          const maxOffset = (currentScale - 1) * 100;
          return {
            left: -maxOffset,
            right: maxOffset,
            top: -maxOffset,
            bottom: maxOffset,
          };
        },
      },
    }
  );

  return (
    <div ref={containerRef} className="pinch-container">
      <animated.div
        style={{
          transform: scale.to(s =>
            `scale(${s}) translate(${x.get()}px, ${y.get()}px)`
          ),
        }}
      >
        {children}
      </animated.div>

      {scale.get() > 1 && (
        <button
          className="reset-zoom"
          onClick={() => api.start({ scale: 1, x: 0, y: 0 })}
          aria-label="Reset zoom"
        >
          Reset Zoom
        </button>
      )}
    </div>
  );
};
```

### Swipe Gestures

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIDEO PLAYER SWIPE GESTURES                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Vertical Swipe (Left Side):                                               │
│  ────────────────────────────                                                │
│  ↑ Swipe Up    = Increase brightness                                       │
│  ↓ Swipe Down  = Decrease brightness                                       │
│                                                                              │
│  Vertical Swipe (Right Side):                                              │
│  ─────────────────────────────                                               │
│  ↑ Swipe Up    = Increase volume                                           │
│  ↓ Swipe Down  = Decrease volume                                           │
│                                                                              │
│  Horizontal Swipe:                                                         │
│  ─────────────────                                                           │
│  ← Swipe Left  = Seek backward (proportional to swipe distance)            │
│  → Swipe Right = Seek forward (proportional to swipe distance)             │
│                                                                              │
│  Implementation:                                                            │
│  ───────────────                                                             │
│  const handleSwipe = (direction, distance, side) => {                      │
│    if (direction === 'vertical') {                                         │
│      const delta = distance / containerHeight * 100;                       │
│      if (side === 'left') {                                                │
│        adjustBrightness(delta);                                            │
│      } else {                                                               │
│        adjustVolume(delta);                                                │
│      }                                                                      │
│    } else if (direction === 'horizontal') {                                │
│      const seekTime = (distance / containerWidth) * video.duration * 0.5; │
│      video.currentTime += seekTime;                                        │
│    }                                                                        │
│  };                                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Picture-in-Picture (PiP)

```typescript
// PictureInPicture.tsx
const usePictureInPicture = (videoRef: RefObject<HTMLVideoElement>) => {
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isPiPSupported, setIsPiPSupported] = useState(false);

  useEffect(() => {
    // Check PiP support
    setIsPiPSupported(
      'pictureInPictureEnabled' in document &&
      document.pictureInPictureEnabled
    );

    const video = videoRef.current;
    if (!video) return;

    const handleEnterPiP = () => setIsPiPActive(true);
    const handleLeavePiP = () => setIsPiPActive(false);

    video.addEventListener('enterpictureinpicture', handleEnterPiP);
    video.addEventListener('leavepictureinpicture', handleLeavePiP);

    return () => {
      video.removeEventListener('enterpictureinpicture', handleEnterPiP);
      video.removeEventListener('leavepictureinpicture', handleLeavePiP);
    };
  }, [videoRef]);

  const togglePiP = async () => {
    const video = videoRef.current;
    if (!video) return;

    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await video.requestPictureInPicture();
      }
    } catch (error) {
      console.error('PiP failed:', error);
    }
  };

  return { isPiPActive, isPiPSupported, togglePiP };
};

// Auto-enter PiP when scrolling away from video
const useAutoPiP = (
  videoRef: RefObject<HTMLVideoElement>,
  containerRef: RefObject<HTMLElement>
) => {
  const { togglePiP, isPiPActive } = usePictureInPicture(videoRef);
  const wasPlaying = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    const container = containerRef.current;
    if (!video || !container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !video.paused && !isPiPActive) {
          // Video scrolled out of view while playing
          wasPlaying.current = true;
          togglePiP();
        } else if (entry.isIntersecting && isPiPActive && wasPlaying.current) {
          // Video scrolled back into view
          document.exitPictureInPicture();
          wasPlaying.current = false;
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(container);

    return () => observer.disconnect();
  }, [videoRef, containerRef, isPiPActive]);
};
```

### Mini Player

```typescript
// MiniPlayer.tsx
const MiniPlayer = ({ video, isActive, onClose, onExpand }: MiniPlayerProps) => {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag to reposition
  const bind = useDrag(
    ({ offset: [ox, oy], last }) => {
      api.start({ x: ox, y: oy, immediate: !last });

      if (last) {
        // Snap to corners
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        const snapX = ox > windowWidth / 2 ? windowWidth - 320 : 16;
        const snapY = oy > windowHeight / 2 ? windowHeight - 180 - 16 : 16;

        api.start({ x: snapX, y: snapY });
      }
    },
    { from: () => [x.get(), y.get()] }
  );

  // Swipe down to close
  const handleSwipeDown = () => {
    api.start({ y: window.innerHeight });
    setTimeout(onClose, 300);
  };

  if (!isActive) return null;

  return (
    <animated.div
      ref={containerRef}
      {...bind()}
      className="mini-player"
      style={{
        x,
        y,
        touchAction: 'none',
      }}
      role="complementary"
      aria-label="Mini video player"
    >
      <div className="mini-player-video">
        <video src={video.url} autoPlay />
      </div>

      <div className="mini-player-info">
        <p className="video-title">{video.title}</p>
        <div className="mini-controls">
          <button onClick={() => {}} aria-label="Pause">
            <PauseIcon />
          </button>
          <button onClick={onExpand} aria-label="Expand">
            <ExpandIcon />
          </button>
          <button onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
      </div>

      {/* Drag handle */}
      <div className="drag-handle" aria-hidden="true" />
    </animated.div>
  );
};
```

### Mobile Controls Layout

```typescript
// MobileVideoControls.tsx
const MobileVideoControls = ({
  video,
  isPlaying,
  currentTime,
  duration,
  onPlayPause,
  onSeek,
}: MobileControlsProps) => {
  const [showControls, setShowControls] = useState(true);
  const hideTimer = useRef<NodeJS.Timeout>();

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (isPlaying && showControls) {
      hideTimer.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => clearTimeout(hideTimer.current);
  }, [isPlaying, showControls]);

  const handleTouch = () => {
    setShowControls(true);
    clearTimeout(hideTimer.current);
  };

  return (
    <div
      className={`mobile-controls ${showControls ? 'visible' : 'hidden'}`}
      onTouchStart={handleTouch}
    >
      {/* Top bar - title, settings */}
      <div className="controls-top">
        <button onClick={() => window.history.back()} aria-label="Go back">
          <BackIcon />
        </button>
        <h1 className="video-title">{video.title}</h1>
        <button aria-label="Settings">
          <SettingsIcon />
        </button>
      </div>

      {/* Center - play/pause, seek buttons */}
      <div className="controls-center">
        <button
          onClick={() => onSeek(currentTime - 10)}
          aria-label="Rewind 10 seconds"
        >
          <RewindIcon />
        </button>

        <button
          onClick={onPlayPause}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className="play-button"
        >
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <button
          onClick={() => onSeek(currentTime + 10)}
          aria-label="Forward 10 seconds"
        >
          <ForwardIcon />
        </button>
      </div>

      {/* Bottom bar - timeline, fullscreen */}
      <div className="controls-bottom">
        <span className="time">{formatTime(currentTime)}</span>

        <input
          type="range"
          className="timeline"
          min={0}
          max={duration}
          value={currentTime}
          onChange={(e) => onSeek(parseFloat(e.target.value))}
          aria-label="Video progress"
        />

        <span className="time">{formatTime(duration)}</span>

        <button aria-label="Toggle fullscreen">
          <FullscreenIcon />
        </button>
      </div>
    </div>
  );
};
```

### Responsive Video Grid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RESPONSIVE VIDEO GRID                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Breakpoints:                                                               │
│  ────────────                                                                │
│                                                                              │
│  Mobile (<640px):                                                           │
│  ┌─────────────────────────────────────────────┐                           │
│  │  [VIDEO THUMBNAIL - Full Width]             │                           │
│  │  Title                                       │                           │
│  │  Channel • 1M views • 2 days ago            │                           │
│  └─────────────────────────────────────────────┘                           │
│                                                                              │
│  Tablet (640px - 1024px):                                                  │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │  [THUMBNAIL]    │  │  [THUMBNAIL]    │                                  │
│  │  Title          │  │  Title          │                                  │
│  │  Meta           │  │  Meta           │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
│                                                                              │
│  Desktop (>1024px):                                                         │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐               │
│  │[THUMBNAIL]│  │[THUMBNAIL]│  │[THUMBNAIL]│  │[THUMBNAIL]│               │
│  │ Title     │  │ Title     │  │ Title     │  │ Title     │               │
│  │ Meta      │  │ Meta      │  │ Meta      │  │ Meta      │               │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘               │
│                                                                              │
│  CSS Implementation:                                                        │
│  ───────────────────                                                         │
│  .video-grid {                                                              │
│    display: grid;                                                           │
│    gap: 16px;                                                               │
│    grid-template-columns: 1fr;                                             │
│  }                                                                          │
│                                                                              │
│  @media (min-width: 640px) {                                               │
│    .video-grid {                                                            │
│      grid-template-columns: repeat(2, 1fr);                                │
│    }                                                                        │
│  }                                                                          │
│                                                                              │
│  @media (min-width: 1024px) {                                              │
│    .video-grid {                                                            │
│      grid-template-columns: repeat(4, 1fr);                                │
│    }                                                                        │
│  }                                                                          │
│                                                                              │
│  @media (min-width: 1440px) {                                              │
│    .video-grid {                                                            │
│      grid-template-columns: repeat(5, 1fr);                                │
│    }                                                                        │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 16. Testing Strategy

### Video Player Unit Tests

```typescript
// VideoPlayer.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VideoPlayer } from './VideoPlayer';

// Mock HTMLMediaElement
beforeAll(() => {
  // Mock play/pause
  window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
  window.HTMLMediaElement.prototype.pause = jest.fn();
  window.HTMLMediaElement.prototype.load = jest.fn();

  // Mock seeking
  Object.defineProperty(window.HTMLMediaElement.prototype, 'currentTime', {
    writable: true,
    value: 0,
  });

  Object.defineProperty(window.HTMLMediaElement.prototype, 'duration', {
    writable: true,
    value: 3600, // 1 hour
  });

  Object.defineProperty(window.HTMLMediaElement.prototype, 'paused', {
    writable: true,
    value: true,
  });
});

describe('VideoPlayer', () => {
  const mockVideo = {
    id: 'test-video-1',
    title: 'Test Video',
    url: 'https://example.com/video.mp4',
    duration: 3600,
  };

  describe('Playback Controls', () => {
    it('should play video when play button is clicked', async () => {
      render(<VideoPlayer video={mockVideo} />);

      const playButton = screen.getByRole('button', { name: /play/i });
      await userEvent.click(playButton);

      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it('should pause video when pause button is clicked', async () => {
      render(<VideoPlayer video={mockVideo} autoPlay />);

      const pauseButton = await screen.findByRole('button', { name: /pause/i });
      await userEvent.click(pauseButton);

      expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
    });

    it('should toggle play/pause with spacebar', async () => {
      const { container } = render(<VideoPlayer video={mockVideo} />);

      container.focus();
      await userEvent.keyboard(' ');

      expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    });

    it('should seek forward 10 seconds with arrow right', async () => {
      const { container } = render(<VideoPlayer video={mockVideo} />);
      const videoElement = container.querySelector('video');
      videoElement!.currentTime = 100;

      container.focus();
      await userEvent.keyboard('{ArrowRight}');

      expect(videoElement!.currentTime).toBe(110);
    });
  });

  describe('Timeline/Progress Bar', () => {
    it('should display current time and duration', () => {
      render(<VideoPlayer video={mockVideo} />);

      expect(screen.getByText('0:00')).toBeInTheDocument();
      expect(screen.getByText('1:00:00')).toBeInTheDocument();
    });

    it('should update progress bar on time update', async () => {
      const { container } = render(<VideoPlayer video={mockVideo} />);
      const videoElement = container.querySelector('video');

      // Simulate time update
      Object.defineProperty(videoElement, 'currentTime', { value: 1800 });
      fireEvent.timeUpdate(videoElement!);

      await waitFor(() => {
        const progressBar = screen.getByRole('slider', { name: /progress/i });
        expect(progressBar).toHaveValue('1800');
      });
    });

    it('should seek when clicking on progress bar', async () => {
      const { container } = render(<VideoPlayer video={mockVideo} />);
      const progressBar = screen.getByRole('slider', { name: /progress/i });
      const videoElement = container.querySelector('video');

      fireEvent.change(progressBar, { target: { value: '1800' } });

      expect(videoElement!.currentTime).toBe(1800);
    });
  });

  describe('Volume Controls', () => {
    it('should mute/unmute with M key', async () => {
      const { container } = render(<VideoPlayer video={mockVideo} />);
      const videoElement = container.querySelector('video');

      container.focus();
      await userEvent.keyboard('m');

      expect(videoElement!.muted).toBe(true);

      await userEvent.keyboard('m');
      expect(videoElement!.muted).toBe(false);
    });

    it('should update volume slider', async () => {
      const { container } = render(<VideoPlayer video={mockVideo} />);
      const volumeSlider = screen.getByRole('slider', { name: /volume/i });
      const videoElement = container.querySelector('video');

      fireEvent.change(volumeSlider, { target: { value: '0.5' } });

      expect(videoElement!.volume).toBe(0.5);
    });
  });

  describe('Fullscreen', () => {
    it('should toggle fullscreen with F key', async () => {
      const mockRequestFullscreen = jest.fn();
      document.documentElement.requestFullscreen = mockRequestFullscreen;

      const { container } = render(<VideoPlayer video={mockVideo} />);

      container.focus();
      await userEvent.keyboard('f');

      expect(mockRequestFullscreen).toHaveBeenCalled();
    });
  });
});
```

### HLS.js Streaming Tests

```typescript
// StreamingPlayer.test.tsx
import Hls from 'hls.js';
import { render, waitFor, screen } from '@testing-library/react';
import { StreamingPlayer } from './StreamingPlayer';

// Mock HLS.js
jest.mock('hls.js', () => {
  const mockHls = {
    loadSource: jest.fn(),
    attachMedia: jest.fn(),
    on: jest.fn(),
    destroy: jest.fn(),
    currentLevel: 0,
    levels: [
      { height: 360, bitrate: 800000 },
      { height: 720, bitrate: 2500000 },
      { height: 1080, bitrate: 5000000 },
    ],
  };

  const HlsConstructor = jest.fn(() => mockHls);
  HlsConstructor.isSupported = jest.fn(() => true);
  HlsConstructor.Events = {
    MANIFEST_PARSED: 'hlsManifestParsed',
    LEVEL_SWITCHED: 'hlsLevelSwitched',
    ERROR: 'hlsError',
    BUFFER_APPENDED: 'hlsBufferAppended',
    FRAG_LOADED: 'hlsFragLoaded',
  };
  HlsConstructor.ErrorTypes = {
    NETWORK_ERROR: 'networkError',
    MEDIA_ERROR: 'mediaError',
  };

  return HlsConstructor;
});

describe('StreamingPlayer', () => {
  const mockManifest = 'https://cdn.example.com/video/master.m3u8';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize HLS.js when supported', async () => {
    render(<StreamingPlayer manifestUrl={mockManifest} />);

    await waitFor(() => {
      expect(Hls).toHaveBeenCalled();
    });

    const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
    expect(hlsInstance.loadSource).toHaveBeenCalledWith(mockManifest);
    expect(hlsInstance.attachMedia).toHaveBeenCalled();
  });

  it('should handle manifest parsed event', async () => {
    render(<StreamingPlayer manifestUrl={mockManifest} />);

    await waitFor(() => {
      const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
      const onCall = hlsInstance.on.mock.calls.find(
        ([event]: [string]) => event === Hls.Events.MANIFEST_PARSED
      );
      expect(onCall).toBeDefined();
    });
  });

  it('should display quality selector after manifest loads', async () => {
    render(<StreamingPlayer manifestUrl={mockManifest} showQualitySelector />);

    // Simulate manifest parsed event
    await waitFor(() => {
      const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
      const callback = hlsInstance.on.mock.calls.find(
        ([event]: [string]) => event === Hls.Events.MANIFEST_PARSED
      )?.[1];
      callback?.();
    });

    expect(await screen.findByText('720p')).toBeInTheDocument();
    expect(screen.getByText('1080p')).toBeInTheDocument();
  });

  it('should clean up HLS instance on unmount', () => {
    const { unmount } = render(<StreamingPlayer manifestUrl={mockManifest} />);

    unmount();

    const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
    expect(hlsInstance.destroy).toHaveBeenCalled();
  });

  it('should handle network errors with retry', async () => {
    const onError = jest.fn();
    render(
      <StreamingPlayer manifestUrl={mockManifest} onError={onError} />
    );

    await waitFor(() => {
      const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
      const errorCallback = hlsInstance.on.mock.calls.find(
        ([event]: [string]) => event === Hls.Events.ERROR
      )?.[1];

      errorCallback?.(Hls.Events.ERROR, {
        type: Hls.ErrorTypes.NETWORK_ERROR,
        fatal: true,
        details: 'manifestLoadError',
      });
    });

    expect(onError).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'networkError',
      })
    );
  });
});

// ABR (Adaptive Bitrate) Tests
describe('Adaptive Bitrate Switching', () => {
  it('should auto-select quality based on bandwidth', async () => {
    const onQualityChange = jest.fn();

    render(
      <StreamingPlayer
        manifestUrl="https://cdn.example.com/video.m3u8"
        onQualityChange={onQualityChange}
      />
    );

    await waitFor(() => {
      const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
      const levelCallback = hlsInstance.on.mock.calls.find(
        ([event]: [string]) => event === Hls.Events.LEVEL_SWITCHED
      )?.[1];

      levelCallback?.(Hls.Events.LEVEL_SWITCHED, { level: 2 });
    });

    expect(onQualityChange).toHaveBeenCalledWith(
      expect.objectContaining({ height: 1080 })
    );
  });

  it('should allow manual quality selection', async () => {
    render(
      <StreamingPlayer
        manifestUrl="https://cdn.example.com/video.m3u8"
        showQualitySelector
      />
    );

    // Select 720p
    const qualityButton = await screen.findByRole('button', { name: /720p/i });
    await userEvent.click(qualityButton);

    const hlsInstance = (Hls as jest.Mock).mock.results[0].value;
    expect(hlsInstance.currentLevel).toBe(1);
  });
});
```

### Playback State Machine Tests

```typescript
// useVideoState.test.ts
import { renderHook, act } from '@testing-library/react';
import { useVideoState } from './useVideoState';

describe('useVideoState', () => {
  it('should start in idle state', () => {
    const { result } = renderHook(() => useVideoState());

    expect(result.current.state).toBe('idle');
  });

  it('should transition to loading when load action dispatched', () => {
    const { result } = renderHook(() => useVideoState());

    act(() => {
      result.current.dispatch({ type: 'LOAD', videoId: 'video-1' });
    });

    expect(result.current.state).toBe('loading');
  });

  it('should transition to playing when canPlay + play', () => {
    const { result } = renderHook(() => useVideoState());

    act(() => {
      result.current.dispatch({ type: 'LOAD', videoId: 'video-1' });
      result.current.dispatch({ type: 'CAN_PLAY' });
      result.current.dispatch({ type: 'PLAY' });
    });

    expect(result.current.state).toBe('playing');
  });

  it('should handle buffering state', () => {
    const { result } = renderHook(() => useVideoState());

    act(() => {
      result.current.dispatch({ type: 'LOAD', videoId: 'video-1' });
      result.current.dispatch({ type: 'CAN_PLAY' });
      result.current.dispatch({ type: 'PLAY' });
      result.current.dispatch({ type: 'WAITING' });
    });

    expect(result.current.state).toBe('buffering');
    expect(result.current.wasPlaying).toBe(true);
  });

  it('should resume playing after buffering', () => {
    const { result } = renderHook(() => useVideoState());

    act(() => {
      result.current.dispatch({ type: 'LOAD', videoId: 'video-1' });
      result.current.dispatch({ type: 'CAN_PLAY' });
      result.current.dispatch({ type: 'PLAY' });
      result.current.dispatch({ type: 'WAITING' });
      result.current.dispatch({ type: 'CAN_PLAY' });
    });

    expect(result.current.state).toBe('playing');
  });

  it('should handle error state', () => {
    const { result } = renderHook(() => useVideoState());

    act(() => {
      result.current.dispatch({ type: 'LOAD', videoId: 'video-1' });
      result.current.dispatch({
        type: 'ERROR',
        error: { code: 4, message: 'Network error' },
      });
    });

    expect(result.current.state).toBe('error');
    expect(result.current.error).toEqual({ code: 4, message: 'Network error' });
  });

  it('should handle ended state', () => {
    const { result } = renderHook(() => useVideoState());

    act(() => {
      result.current.dispatch({ type: 'LOAD', videoId: 'video-1' });
      result.current.dispatch({ type: 'CAN_PLAY' });
      result.current.dispatch({ type: 'PLAY' });
      result.current.dispatch({ type: 'ENDED' });
    });

    expect(result.current.state).toBe('ended');
  });
});

// State machine diagram
```

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIDEO PLAYER STATE MACHINE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                           ┌─────────┐                                       │
│                           │  idle   │                                       │
│                           └────┬────┘                                       │
│                                │ LOAD                                       │
│                                ▼                                            │
│                          ┌──────────┐                                       │
│                     ┌───►│ loading  │◄────┐                                 │
│                     │    └────┬─────┘     │                                 │
│                     │         │           │                                 │
│               ERROR │   CAN_PLAY    ERROR │                                 │
│                     │         │           │                                 │
│                     │         ▼           │                                 │
│  ┌─────────┐        │    ┌─────────┐      │        ┌─────────┐              │
│  │  error  │◄───────┴────│  ready  │──────┴───────►│  ended  │              │
│  └─────────┘             └────┬────┘               └────┬────┘              │
│       ▲                       │                         │                   │
│       │                  PLAY │                    LOAD │                   │
│       │                       ▼                         │                   │
│       │                 ┌──────────┐                    │                   │
│       │ ERROR     ┌────►│ playing  │◄───────────────────┘                   │
│       │           │     └────┬─────┘                                        │
│       │      PLAY │          │                                              │
│       │           │    PAUSE │ WAITING                                      │
│       │           │          │    │                                         │
│       │           │          ▼    ▼                                         │
│       │           │    ┌──────────────┐                                     │
│       └───────────┼────│    paused    │                                     │
│                   │    └──────────────┘                                     │
│                   │          ▲                                              │
│                   │          │                                              │
│                   │    CAN_PLAY                                             │
│                   │          │                                              │
│                   │    ┌─────┴──────┐                                       │
│                   └────│ buffering  │                                       │
│                        └────────────┘                                       │
│                                                                              │
│  State Transitions:                                                         │
│  ─────────────────                                                          │
│  • idle → loading: Video URL loaded                                         │
│  • loading → ready: Enough data buffered                                    │
│  • ready → playing: Play triggered                                          │
│  • playing → paused: Pause triggered                                        │
│  • playing → buffering: Buffer underrun                                     │
│  • buffering → playing: Buffer refilled                                     │
│  • playing → ended: Video finished                                          │
│  • any → error: Fatal error occurred                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### E2E Streaming Tests

```typescript
// streaming.e2e.test.ts
import { test, expect, Page } from '@playwright/test';

test.describe('Video Streaming E2E', () => {
  let page: Page;

  test.beforeEach(async ({ browser }) => {
    page = await browser.newPage();
    await page.goto('/watch/test-video-1');
  });

  test('should load video player', async () => {
    const player = page.locator('[data-testid="video-player"]');
    await expect(player).toBeVisible();

    const video = page.locator('video');
    await expect(video).toHaveAttribute('src');
  });

  test('should play video on click', async () => {
    const playButton = page.getByRole('button', { name: /play/i });
    await playButton.click();

    const video = page.locator('video');
    await expect(video).toHaveJSProperty('paused', false);
  });

  test('should display buffered progress', async () => {
    const video = page.locator('video');

    // Wait for some buffering
    await page.waitForFunction(() => {
      const v = document.querySelector('video');
      return v && v.buffered.length > 0 && v.buffered.end(0) > 0;
    });

    const bufferBar = page.locator('[data-testid="buffer-progress"]');
    await expect(bufferBar).toHaveCSS('width', /.+/);
  });

  test('should switch quality levels', async () => {
    // Open quality menu
    const qualityButton = page.getByRole('button', { name: /quality/i });
    await qualityButton.click();

    // Select 720p
    const quality720 = page.getByRole('menuitem', { name: /720p/i });
    await quality720.click();

    // Verify quality changed
    await expect(page.locator('[data-testid="current-quality"]')).toHaveText('720p');
  });

  test('should handle network interruption gracefully', async () => {
    // Start playing
    await page.click('[data-testid="play-button"]');

    // Simulate network offline
    await page.context().setOffline(true);

    // Wait for buffering indicator
    const bufferingIndicator = page.locator('[data-testid="buffering-spinner"]');
    await expect(bufferingIndicator).toBeVisible({ timeout: 10000 });

    // Restore network
    await page.context().setOffline(false);

    // Should resume playing
    await expect(bufferingIndicator).not.toBeVisible({ timeout: 30000 });
    const video = page.locator('video');
    await expect(video).toHaveJSProperty('paused', false);
  });

  test('should persist playback position on refresh', async () => {
    // Play and seek to 30 seconds
    await page.click('[data-testid="play-button"]');

    const video = page.locator('video');
    await video.evaluate((v: HTMLVideoElement) => {
      v.currentTime = 30;
    });

    // Wait for position to be saved
    await page.waitForTimeout(1000);

    // Refresh page
    await page.reload();

    // Verify resumed position
    await page.waitForFunction(() => {
      const v = document.querySelector('video');
      return v && v.currentTime >= 28; // Allow 2 second tolerance
    });
  });

  test('should track watch progress', async () => {
    // Play video
    await page.click('[data-testid="play-button"]');

    // Wait for some progress
    await page.waitForTimeout(5000);

    // Navigate away
    await page.goto('/');

    // Check that progress is saved
    const continueWatching = page.locator('[data-testid="continue-watching"]');
    await expect(continueWatching).toContainText('Test Video');
  });
});

// Caption/Subtitle Tests
test.describe('Captions', () => {
  test('should toggle captions', async ({ page }) => {
    await page.goto('/watch/video-with-captions');

    const captionButton = page.getByRole('button', { name: /captions/i });
    await captionButton.click();

    // Select English
    await page.getByRole('menuitem', { name: /english/i }).click();

    // Verify captions visible
    const captionDisplay = page.locator('.caption-container');
    await expect(captionDisplay).toBeVisible();
  });

  test('should sync captions with video time', async ({ page }) => {
    await page.goto('/watch/video-with-captions');

    // Enable captions
    await page.getByRole('button', { name: /captions/i }).click();
    await page.getByRole('menuitem', { name: /english/i }).click();

    // Seek to known caption time
    const video = page.locator('video');
    await video.evaluate((v: HTMLVideoElement) => {
      v.currentTime = 10;
    });

    // Verify caption content
    const caption = page.locator('.caption-text');
    await expect(caption).toHaveText(/Expected caption text/);
  });
});
```

### Testing Utilities for Video

```typescript
// testUtils.ts
import { screen, waitFor } from '@testing-library/react';

// Wait for video to be ready
export const waitForVideoReady = async () => {
  await waitFor(() => {
    const video = document.querySelector('video');
    expect(video?.readyState).toBeGreaterThanOrEqual(3);
  }, { timeout: 10000 });
};

// Mock video element with full API
export const createMockVideoElement = (overrides?: Partial<HTMLVideoElement>) => {
  const eventListeners: Record<string, Set<EventListener>> = {};

  return {
    play: jest.fn().mockResolvedValue(undefined),
    pause: jest.fn(),
    load: jest.fn(),
    currentTime: 0,
    duration: 3600,
    paused: true,
    muted: false,
    volume: 1,
    playbackRate: 1,
    buffered: {
      length: 1,
      start: () => 0,
      end: () => 100,
    },
    videoWidth: 1920,
    videoHeight: 1080,
    readyState: 4,
    addEventListener: jest.fn((event: string, listener: EventListener) => {
      if (!eventListeners[event]) {
        eventListeners[event] = new Set();
      }
      eventListeners[event].add(listener);
    }),
    removeEventListener: jest.fn((event: string, listener: EventListener) => {
      eventListeners[event]?.delete(listener);
    }),
    dispatchEvent: jest.fn((event: Event) => {
      const listeners = eventListeners[event.type];
      listeners?.forEach(listener => listener(event));
      return true;
    }),
    requestPictureInPicture: jest.fn().mockResolvedValue({}),
    ...overrides,
  } as unknown as HTMLVideoElement;
};

// Simulate streaming events
export const simulateStreamingEvents = async (
  hls: any,
  sequence: Array<{ event: string; data: any; delay?: number }>
) => {
  for (const { event, data, delay = 0 } of sequence) {
    if (delay > 0) {
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    const callback = hls.on.mock.calls.find(
      ([e]: [string]) => e === event
    )?.[1];
    callback?.(event, data);
  }
};

// Wait for quality switch
export const waitForQualitySwitch = async (targetHeight: number) => {
  await waitFor(() => {
    const qualityIndicator = screen.getByTestId('current-quality');
    expect(qualityIndicator).toHaveTextContent(`${targetHeight}p`);
  });
};
```

### Test Coverage Requirements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIDEO PLAYER TEST COVERAGE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Coverage Requirements by Category:                                         │
│  ─────────────────────────────────                                          │
│                                                                              │
│  ┌───────────────────────────┬──────────┬───────────────────────────────┐   │
│  │ Category                  │ Min %    │ Critical Areas                │   │
│  ├───────────────────────────┼──────────┼───────────────────────────────┤   │
│  │ Video Player Controls     │ 95%      │ Play/Pause, Seek, Volume      │   │
│  │ Streaming (HLS/DASH)      │ 90%      │ ABR, Error recovery           │   │
│  │ DRM Integration           │ 85%      │ License fetch, Key rotation   │   │
│  │ Playback State Machine    │ 100%     │ All state transitions         │   │
│  │ Captions/Subtitles        │ 90%      │ Timing sync, Style rendering  │   │
│  │ Keyboard Shortcuts        │ 95%      │ All key bindings              │   │
│  │ Picture-in-Picture        │ 85%      │ Enter/exit, Visibility        │   │
│  │ Progress Persistence      │ 90%      │ Save/restore position         │   │
│  │ Quality Selection         │ 90%      │ Manual/Auto switching         │   │
│  │ Error Handling            │ 95%      │ All error codes               │   │
│  └───────────────────────────┴──────────┴───────────────────────────────┘   │
│                                                                              │
│  Test Types Distribution:                                                   │
│  ────────────────────────                                                   │
│                                                                              │
│  Unit Tests:        60%  ████████████████████████░░░░░░░░░░░░░              │
│  Integration Tests: 25%  ██████████░░░░░░░░░░░░░░░░░░░░░░░░░░░              │
│  E2E Tests:         15%  ██████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░              │
│                                                                              │
│  Mocking Strategy:                                                          │
│  ─────────────────                                                          │
│  • HTMLMediaElement - Mock play/pause/seek                                  │
│  • HLS.js/DASH.js - Mock entire library                                     │
│  • Network requests - MSW for API mocking                                   │
│  • MediaKeySession - Mock for DRM tests                                     │
│  • IntersectionObserver - Mock for visibility tests                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Offline/PWA Capabilities

### Service Worker for Video Caching

```typescript
// sw.ts - Service Worker for video streaming PWA
declare const self: ServiceWorkerGlobalScope;

const CACHE_NAME = 'video-streaming-v1';
const VIDEO_CACHE = 'video-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  '/static/js/main.js',
  '/static/css/main.css',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== VIDEO_CACHE)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle video segment requests
  if (url.pathname.includes('/segments/') || url.pathname.endsWith('.ts')) {
    event.respondWith(handleVideoSegment(request));
    return;
  }

  // Handle HLS manifest requests
  if (url.pathname.endsWith('.m3u8')) {
    event.respondWith(handleManifest(request));
    return;
  }

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleApiRequest(request));
    return;
  }

  // Default: Network first, fallback to cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful GET requests
        if (request.method === 'GET' && response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/offline.html');
        });
      })
  );
});

// Handle video segment caching with range requests
async function handleVideoSegment(request: Request): Promise<Response> {
  const cache = await caches.open(VIDEO_CACHE);
  const cached = await cache.match(request);

  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Only cache if content-length is reasonable (< 10MB per segment)
      const contentLength = response.headers.get('content-length');
      if (contentLength && parseInt(contentLength) < 10 * 1024 * 1024) {
        cache.put(request, response.clone());
      }
    }

    return response;
  } catch (error) {
    // Return offline placeholder for video
    return new Response('Video segment unavailable offline', {
      status: 503,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

// Handle HLS manifest with network-first strategy
async function handleManifest(request: Request): Promise<Response> {
  try {
    const response = await fetch(request);
    const cache = await caches.open(VIDEO_CACHE);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

// Handle API requests with stale-while-revalidate
async function handleApiRequest(request: Request): Promise<Response> {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone());
    }
    return response;
  });

  return cached || fetchPromise;
}

// Background sync for watch history
self.addEventListener('sync', (event: SyncEvent) => {
  if (event.tag === 'sync-watch-history') {
    event.waitUntil(syncWatchHistory());
  }
});

async function syncWatchHistory(): Promise<void> {
  const db = await openIndexedDB();
  const pendingUpdates = await db.getAll('pending-history');

  for (const update of pendingUpdates) {
    try {
      await fetch('/api/v1/watch-history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(update),
      });
      await db.delete('pending-history', update.id);
    } catch (error) {
      // Will retry on next sync
      console.error('Failed to sync watch history:', error);
    }
  }
}
```

### Download Manager for Offline Viewing

```typescript
// DownloadManager.tsx
interface DownloadedVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration: number;
  quality: string;
  size: number;
  downloadedAt: number;
  expiresAt: number;
  segments: string[];
}

const DownloadManager = () => {
  const [downloads, setDownloads] = useState<DownloadedVideo[]>([]);
  const [activeDownloads, setActiveDownloads] = useState<Map<string, number>>(new Map());
  const [storageUsed, setStorageUsed] = useState(0);
  const [storageQuota, setStorageQuota] = useState(0);

  // Check storage quota
  useEffect(() => {
    const checkStorage = async () => {
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        setStorageUsed(estimate.usage || 0);
        setStorageQuota(estimate.quota || 0);
      }
    };
    checkStorage();
  }, [downloads]);

  // Load downloaded videos from IndexedDB
  useEffect(() => {
    const loadDownloads = async () => {
      const db = await openDB('video-downloads', 1, {
        upgrade(db) {
          db.createObjectStore('videos', { keyPath: 'id' });
          db.createObjectStore('segments');
        },
      });

      const videos = await db.getAll('videos');
      setDownloads(videos);
    };
    loadDownloads();
  }, []);

  const downloadVideo = async (videoId: string, quality: string) => {
    // Get video manifest and metadata
    const response = await fetch(`/api/v1/videos/${videoId}/download?quality=${quality}`);
    const { manifest, metadata, segments } = await response.json();

    const db = await openDB('video-downloads', 1);

    // Download segments with progress tracking
    let downloadedCount = 0;
    const totalSegments = segments.length;

    for (const segmentUrl of segments) {
      const segmentResponse = await fetch(segmentUrl);
      const blob = await segmentResponse.blob();

      // Store segment in IndexedDB
      await db.put('segments', blob, `${videoId}:${segmentUrl}`);

      downloadedCount++;
      setActiveDownloads((prev) => {
        const updated = new Map(prev);
        updated.set(videoId, (downloadedCount / totalSegments) * 100);
        return updated;
      });
    }

    // Store video metadata
    const downloadedVideo: DownloadedVideo = {
      id: videoId,
      title: metadata.title,
      thumbnail: metadata.thumbnail,
      duration: metadata.duration,
      quality,
      size: segments.reduce((acc: number, _: string) => acc, 0),
      downloadedAt: Date.now(),
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000, // 30 days
      segments,
    };

    await db.put('videos', downloadedVideo);
    setDownloads((prev) => [...prev, downloadedVideo]);
    setActiveDownloads((prev) => {
      const updated = new Map(prev);
      updated.delete(videoId);
      return updated;
    });
  };

  const deleteDownload = async (videoId: string) => {
    const db = await openDB('video-downloads', 1);

    // Get video to find segments
    const video = await db.get('videos', videoId);
    if (video) {
      // Delete all segments
      for (const segmentUrl of video.segments) {
        await db.delete('segments', `${videoId}:${segmentUrl}`);
      }
    }

    // Delete video metadata
    await db.delete('videos', videoId);
    setDownloads((prev) => prev.filter((v) => v.id !== videoId));
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="download-manager">
      {/* Storage indicator */}
      <div className="storage-info">
        <div className="storage-bar">
          <div
            className="storage-used"
            style={{ width: `${(storageUsed / storageQuota) * 100}%` }}
          />
        </div>
        <p>
          {formatBytes(storageUsed)} of {formatBytes(storageQuota)} used
        </p>
      </div>

      {/* Active downloads */}
      {activeDownloads.size > 0 && (
        <section className="active-downloads">
          <h2>Downloading</h2>
          {Array.from(activeDownloads.entries()).map(([id, progress]) => (
            <div key={id} className="download-progress">
              <span>{id}</span>
              <progress value={progress} max={100} />
              <span>{Math.round(progress)}%</span>
            </div>
          ))}
        </section>
      )}

      {/* Downloaded videos */}
      <section className="downloaded-videos">
        <h2>Downloaded ({downloads.length})</h2>
        {downloads.map((video) => (
          <div key={video.id} className="downloaded-video-card">
            <img src={video.thumbnail} alt={video.title} />
            <div className="video-info">
              <h3>{video.title}</h3>
              <p>
                {video.quality} • {formatBytes(video.size)}
              </p>
              <p className="expires">
                Expires {new Date(video.expiresAt).toLocaleDateString()}
              </p>
            </div>
            <div className="video-actions">
              <button
                onClick={() => window.location.href = `/watch/${video.id}?offline=true`}
                aria-label={`Play ${video.title}`}
              >
                <PlayIcon />
              </button>
              <button
                onClick={() => deleteDownload(video.id)}
                aria-label={`Delete ${video.title}`}
              >
                <DeleteIcon />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};
```

### Offline Video Player

```typescript
// OfflineVideoPlayer.tsx
const OfflineVideoPlayer = ({ videoId }: { videoId: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const sourceBufferRef = useRef<SourceBuffer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOfflineVideo = async () => {
      try {
        const db = await openDB('video-downloads', 1);
        const video = await db.get('videos', videoId);

        if (!video) {
          setError('Video not found offline');
          return;
        }

        // Check if video has expired
        if (Date.now() > video.expiresAt) {
          setError('Download has expired. Please re-download.');
          return;
        }

        // Create MediaSource for segmented playback
        const mediaSource = new MediaSource();
        mediaSourceRef.current = mediaSource;

        videoRef.current!.src = URL.createObjectURL(mediaSource);

        mediaSource.addEventListener('sourceopen', async () => {
          const sourceBuffer = mediaSource.addSourceBuffer('video/mp4; codecs="avc1.640028"');
          sourceBufferRef.current = sourceBuffer;

          // Load segments from IndexedDB
          for (const segmentUrl of video.segments) {
            const segmentData = await db.get('segments', `${videoId}:${segmentUrl}`);

            if (segmentData) {
              await appendToBuffer(sourceBuffer, segmentData);
            }
          }

          mediaSource.endOfStream();
          setIsLoading(false);
        });
      } catch (err) {
        setError('Failed to load offline video');
        console.error(err);
      }
    };

    loadOfflineVideo();

    return () => {
      if (mediaSourceRef.current) {
        URL.revokeObjectURL(videoRef.current?.src || '');
      }
    };
  }, [videoId]);

  const appendToBuffer = (
    sourceBuffer: SourceBuffer,
    data: ArrayBuffer
  ): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (sourceBuffer.updating) {
        sourceBuffer.addEventListener('updateend', () => {
          appendToBuffer(sourceBuffer, data).then(resolve).catch(reject);
        }, { once: true });
        return;
      }

      try {
        sourceBuffer.appendBuffer(data);
        sourceBuffer.addEventListener('updateend', () => resolve(), { once: true });
      } catch (err) {
        reject(err);
      }
    });
  };

  if (error) {
    return (
      <div className="offline-error" role="alert">
        <OfflineIcon />
        <p>{error}</p>
        <button onClick={() => window.location.href = `/watch/${videoId}`}>
          Try Online
        </button>
      </div>
    );
  }

  return (
    <div className="offline-player">
      {isLoading && (
        <div className="loading-overlay">
          <Spinner />
          <p>Loading offline video...</p>
        </div>
      )}
      <video
        ref={videoRef}
        controls
        playsInline
        className="video-element"
      />
      <div className="offline-badge">
        <DownloadIcon /> Playing offline
      </div>
    </div>
  );
};
```

### PWA Manifest & Install Prompt

```typescript
// useInstallPrompt.ts
export const useInstallPrompt = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstall = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    installPrompt.prompt();
    const result = await installPrompt.userChoice;

    if (result.outcome === 'accepted') {
      setInstallPrompt(null);
      return true;
    }

    return false;
  };

  return { canInstall: !!installPrompt, isInstalled, promptInstall };
};

// InstallBanner.tsx
const InstallBanner = () => {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="install-banner" role="complementary">
      <div className="banner-content">
        <AppIcon />
        <div className="banner-text">
          <h3>Install VideoStream</h3>
          <p>Watch videos offline and get a native-like experience</p>
        </div>
      </div>
      <div className="banner-actions">
        <button
          onClick={promptInstall}
          className="install-button"
        >
          Install
        </button>
        <button
          onClick={() => setDismissed(true)}
          className="dismiss-button"
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
};
```

### Offline State Detection

```typescript
// useOnlineStatus.ts
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

// OfflineIndicator.tsx
const OfflineIndicator = () => {
  const isOnline = useOnlineStatus();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    if (!isOnline) {
      setShowBanner(true);
    } else {
      // Delay hiding to show reconnection message
      const timer = setTimeout(() => setShowBanner(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline]);

  if (!showBanner) return null;

  return (
    <div
      className={`offline-indicator ${isOnline ? 'reconnected' : 'offline'}`}
      role="status"
      aria-live="polite"
    >
      {isOnline ? (
        <>
          <CheckIcon />
          <span>Back online</span>
        </>
      ) : (
        <>
          <OfflineIcon />
          <span>You're offline. Downloaded videos are still available.</span>
        </>
      )}
    </div>
  );
};
```

### PWA Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PWA OFFLINE ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                        User Interface                               │    │
│  ├─────────────────────────────────────────────────────────────────────┤    │
│  │  • Install Banner     • Offline Indicator    • Download Manager     │    │
│  │  • Offline Player     • Storage Info         • Sync Status         │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐    │
│  │                       Service Worker                                 │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐  │    │
│  │  │ Cache Strategy │  │  Background    │  │  Push Notifications    │  │    │
│  │  │                │  │  Sync          │  │                        │  │    │
│  │  │ • Static: CF   │  │ • Watch History│  │ • New videos           │  │    │
│  │  │ • API: SWR     │  │ • Preferences  │  │ • Download complete    │  │    │
│  │  │ • Video: NF+C  │  │ • Analytics    │  │ • Subscription updates │  │    │
│  │  └────────────────┘  └────────────────┘  └────────────────────────┘  │    │
│  │                                                                      │    │
│  └──────────────────────────────┬──────────────────────────────────────┘    │
│                                 │                                           │
│  ┌──────────────────────────────▼──────────────────────────────────────┐    │
│  │                         Storage Layer                                │    │
│  ├──────────────────────────────────────────────────────────────────────┤    │
│  │                                                                      │    │
│  │  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐  │    │
│  │  │  Cache API     │  │  IndexedDB     │  │  Local Storage         │  │    │
│  │  │                │  │                │  │                        │  │    │
│  │  │ • HTML/CSS/JS  │  │ • Video Blobs  │  │ • User Preferences     │  │    │
│  │  │ • API Responses│  │ • Metadata     │  │ • Watch Position       │  │    │
│  │  │ • Images       │  │ • Sync Queue   │  │ • Theme                │  │    │
│  │  └────────────────┘  └────────────────┘  └────────────────────────┘  │    │
│  │                                                                      │    │
│  └──────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  Cache Strategies:                                                          │
│  ─────────────────                                                          │
│  • CF (Cache First): Static assets, known to rarely change                  │
│  • SWR (Stale While Revalidate): API data, show cached, update in bg        │
│  • NF+C (Network First + Cache): Video manifests, fresh content preferred   │
│                                                                              │
│  Storage Limits:                                                            │
│  ───────────────                                                            │
│  • Browser quota varies (Chrome: ~60% of disk, Safari: ~1GB)                │
│  • Monitor with navigator.storage.estimate()                                │
│  • Implement LRU eviction for video segments                                │
│  • Expire downloads after 30 days (DRM requirement)                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 18. Video Player Deep Dive

### Custom Video Player Architecture

```typescript
// VideoPlayer.tsx - Complete custom video player
interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  startTime?: number;
  onProgress?: (time: number, duration: number) => void;
  onEnded?: () => void;
  onError?: (error: MediaError) => void;
}

interface PlayerState {
  isPlaying: boolean;
  isMuted: boolean;
  isFullscreen: boolean;
  isPiP: boolean;
  currentTime: number;
  duration: number;
  buffered: number;
  volume: number;
  playbackRate: number;
  quality: string;
  isLoading: boolean;
  isControlsVisible: boolean;
}

const VideoPlayer = ({
  src,
  poster,
  autoPlay = false,
  startTime = 0,
  onProgress,
  onEnded,
  onError,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const [state, setState] = useState<PlayerState>({
    isPlaying: false,
    isMuted: false,
    isFullscreen: false,
    isPiP: false,
    currentTime: 0,
    duration: 0,
    buffered: 0,
    volume: 1,
    playbackRate: 1,
    quality: 'auto',
    isLoading: true,
    isControlsVisible: true,
  });

  // Initialize video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlers = {
      loadedmetadata: () => {
        setState((prev) => ({ ...prev, duration: video.duration }));
        if (startTime > 0) {
          video.currentTime = startTime;
        }
      },
      canplay: () => setState((prev) => ({ ...prev, isLoading: false })),
      waiting: () => setState((prev) => ({ ...prev, isLoading: true })),
      playing: () => setState((prev) => ({ ...prev, isPlaying: true, isLoading: false })),
      pause: () => setState((prev) => ({ ...prev, isPlaying: false })),
      ended: () => {
        setState((prev) => ({ ...prev, isPlaying: false }));
        onEnded?.();
      },
      timeupdate: () => {
        setState((prev) => ({ ...prev, currentTime: video.currentTime }));
        onProgress?.(video.currentTime, video.duration);
      },
      progress: () => {
        if (video.buffered.length > 0) {
          const bufferedEnd = video.buffered.end(video.buffered.length - 1);
          setState((prev) => ({ ...prev, buffered: bufferedEnd }));
        }
      },
      volumechange: () => {
        setState((prev) => ({
          ...prev,
          volume: video.volume,
          isMuted: video.muted,
        }));
      },
      error: () => {
        if (video.error) {
          onError?.(video.error);
        }
      },
    };

    Object.entries(handlers).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [startTime, onProgress, onEnded, onError]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      const video = videoRef.current;
      if (!video) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
        case 'j':
          e.preventDefault();
          seek(video.currentTime - (e.shiftKey ? 5 : 10));
          break;
        case 'arrowright':
        case 'l':
          e.preventDefault();
          seek(video.currentTime + (e.shiftKey ? 5 : 10));
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(Math.min(1, video.volume + 0.1));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(Math.max(0, video.volume - 0.1));
          break;
        case 'home':
        case '0':
          e.preventDefault();
          seek(0);
          break;
        case 'end':
          e.preventDefault();
          seek(video.duration);
          break;
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          e.preventDefault();
          seek((parseInt(e.key) / 10) * video.duration);
          break;
        case ',':
          if (e.shiftKey) {
            e.preventDefault();
            setPlaybackRate(Math.max(0.25, state.playbackRate - 0.25));
          }
          break;
        case '.':
          if (e.shiftKey) {
            e.preventDefault();
            setPlaybackRate(Math.min(2, state.playbackRate + 0.25));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.playbackRate]);

  // Auto-hide controls
  useEffect(() => {
    const showControls = () => {
      setState((prev) => ({ ...prev, isControlsVisible: true }));
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (state.isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({ ...prev, isControlsVisible: false }));
        }, 3000);
      }
    };

    const container = containerRef.current;
    container?.addEventListener('mousemove', showControls);
    container?.addEventListener('mouseleave', () => {
      if (state.isPlaying) {
        setState((prev) => ({ ...prev, isControlsVisible: false }));
      }
    });

    return () => {
      container?.removeEventListener('mousemove', showControls);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, [state.isPlaying]);

  // Player actions
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.paused ? video.play() : video.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.max(0, Math.min(time, video.duration));
  }, []);

  const setVolume = useCallback((volume: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = volume;
    if (volume > 0 && video.muted) {
      video.muted = false;
    }
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setState((prev) => ({ ...prev, isFullscreen: false }));
    } else {
      await container.requestFullscreen();
      setState((prev) => ({ ...prev, isFullscreen: true }));
    }
  }, []);

  const togglePiP = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    if (document.pictureInPictureElement) {
      await document.exitPictureInPicture();
      setState((prev) => ({ ...prev, isPiP: false }));
    } else if (document.pictureInPictureEnabled) {
      await video.requestPictureInPicture();
      setState((prev) => ({ ...prev, isPiP: true }));
    }
  }, []);

  const setPlaybackRate = useCallback((rate: number) => {
    const video = videoRef.current;
    if (!video) return;
    video.playbackRate = rate;
    setState((prev) => ({ ...prev, playbackRate: rate }));
  }, []);

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return h > 0
      ? `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
      : `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div
      ref={containerRef}
      className={`video-player ${state.isFullscreen ? 'fullscreen' : ''}`}
      role="application"
      aria-label="Video player"
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        playsInline
        onClick={togglePlay}
      />

      {/* Loading spinner */}
      {state.isLoading && (
        <div className="loading-overlay" aria-hidden="true">
          <Spinner />
        </div>
      )}

      {/* Controls overlay */}
      <div
        className={`controls-overlay ${state.isControlsVisible ? 'visible' : ''}`}
        aria-hidden={!state.isControlsVisible}
      >
        {/* Progress bar */}
        <div className="progress-container">
          <div
            className="buffered-bar"
            style={{ width: `${(state.buffered / state.duration) * 100}%` }}
          />
          <input
            type="range"
            className="progress-bar"
            min={0}
            max={state.duration || 100}
            value={state.currentTime}
            onChange={(e) => seek(parseFloat(e.target.value))}
            aria-label="Video progress"
          />
        </div>

        {/* Controls bar */}
        <div className="controls-bar">
          <div className="left-controls">
            <button onClick={togglePlay} aria-label={state.isPlaying ? 'Pause' : 'Play'}>
              {state.isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>

            <button onClick={() => seek(state.currentTime - 10)} aria-label="Rewind 10 seconds">
              <RewindIcon />
            </button>

            <button onClick={() => seek(state.currentTime + 10)} aria-label="Forward 10 seconds">
              <ForwardIcon />
            </button>

            <div className="volume-control">
              <button onClick={toggleMute} aria-label={state.isMuted ? 'Unmute' : 'Mute'}>
                {state.isMuted || state.volume === 0 ? <MutedIcon /> : <VolumeIcon />}
              </button>
              <input
                type="range"
                className="volume-slider"
                min={0}
                max={1}
                step={0.1}
                value={state.isMuted ? 0 : state.volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                aria-label="Volume"
              />
            </div>

            <span className="time-display">
              {formatTime(state.currentTime)} / {formatTime(state.duration)}
            </span>
          </div>

          <div className="right-controls">
            <PlaybackRateMenu
              currentRate={state.playbackRate}
              onRateChange={setPlaybackRate}
            />

            <button onClick={togglePiP} aria-label="Picture in Picture">
              <PiPIcon />
            </button>

            <button onClick={toggleFullscreen} aria-label={state.isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
              {state.isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Screen reader announcements */}
      <div className="sr-only" role="status" aria-live="polite">
        {state.isPlaying ? 'Playing' : 'Paused'}
      </div>
    </div>
  );
};
```

### Buffering Strategy & Buffer Management

```typescript
// BufferManager.ts - Intelligent buffer management
interface BufferConfig {
  minBuffer: number;      // Minimum buffer before playback (seconds)
  maxBuffer: number;      // Maximum buffer to maintain (seconds)
  rebufferGoal: number;   // Buffer goal after rebuffer event
  lowLatencyMode: boolean;
}

class BufferManager {
  private config: BufferConfig;
  private hls: Hls | null = null;
  private video: HTMLVideoElement;
  private networkInfo: NetworkInformation | null = null;

  constructor(video: HTMLVideoElement, config?: Partial<BufferConfig>) {
    this.video = video;
    this.config = {
      minBuffer: 10,
      maxBuffer: 30,
      rebufferGoal: 5,
      lowLatencyMode: false,
      ...config,
    };

    this.initNetworkMonitoring();
  }

  private initNetworkMonitoring(): void {
    if ('connection' in navigator) {
      this.networkInfo = (navigator as any).connection;
      this.networkInfo?.addEventListener('change', () => {
        this.adjustBufferForNetwork();
      });
    }
  }

  private adjustBufferForNetwork(): void {
    if (!this.networkInfo || !this.hls) return;

    const { effectiveType, downlink, saveData } = this.networkInfo;

    // Adjust buffer based on network conditions
    let bufferConfig: Partial<BufferConfig> = {};

    if (saveData) {
      // Data saver mode - minimize buffering
      bufferConfig = { minBuffer: 5, maxBuffer: 15 };
    } else if (effectiveType === '4g' && downlink > 10) {
      // Fast connection - larger buffer
      bufferConfig = { minBuffer: 15, maxBuffer: 60 };
    } else if (effectiveType === '3g') {
      // Moderate connection
      bufferConfig = { minBuffer: 10, maxBuffer: 30 };
    } else if (effectiveType === '2g' || effectiveType === 'slow-2g') {
      // Slow connection - aggressive buffering
      bufferConfig = { minBuffer: 20, maxBuffer: 45 };
    }

    this.updateConfig(bufferConfig);
  }

  updateConfig(config: Partial<BufferConfig>): void {
    this.config = { ...this.config, ...config };

    if (this.hls) {
      this.hls.config.maxBufferLength = this.config.maxBuffer;
      this.hls.config.maxMaxBufferLength = this.config.maxBuffer * 2;
    }
  }

  attachHls(hls: Hls): void {
    this.hls = hls;

    // Configure HLS.js buffer settings
    hls.config.maxBufferLength = this.config.maxBuffer;
    hls.config.maxMaxBufferLength = this.config.maxBuffer * 2;
    hls.config.maxBufferHole = 0.5;

    if (this.config.lowLatencyMode) {
      hls.config.liveSyncDuration = 3;
      hls.config.liveMaxLatencyDuration = 5;
      hls.config.maxBufferLength = 8;
    }

    // Listen for buffer events
    hls.on(Hls.Events.BUFFER_APPENDING, (_, data) => {
      this.logBufferState('appending', data);
    });

    hls.on(Hls.Events.BUFFER_EOS, () => {
      this.logBufferState('end-of-stream');
    });

    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.details === 'bufferStalledError') {
        this.handleBufferStall();
      }
    });
  }

  private handleBufferStall(): void {
    console.warn('Buffer stalled, adjusting strategy');

    // Temporarily lower quality to refill buffer
    if (this.hls) {
      const currentLevel = this.hls.currentLevel;
      if (currentLevel > 0) {
        this.hls.nextLevel = currentLevel - 1;
      }

      // Increase buffer goal temporarily
      this.hls.config.maxBufferLength = this.config.rebufferGoal * 2;

      // Reset after buffer is healthy
      setTimeout(() => {
        if (this.hls) {
          this.hls.config.maxBufferLength = this.config.maxBuffer;
          this.hls.nextLevel = -1; // Auto
        }
      }, 10000);
    }
  }

  getBufferHealth(): { current: number; ahead: number; isHealthy: boolean } {
    const video = this.video;
    const currentTime = video.currentTime;
    let bufferedAhead = 0;

    for (let i = 0; i < video.buffered.length; i++) {
      if (video.buffered.start(i) <= currentTime && video.buffered.end(i) > currentTime) {
        bufferedAhead = video.buffered.end(i) - currentTime;
        break;
      }
    }

    return {
      current: currentTime,
      ahead: bufferedAhead,
      isHealthy: bufferedAhead >= this.config.minBuffer,
    };
  }

  private logBufferState(event: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      const health = this.getBufferHealth();
      console.log(`[Buffer] ${event}`, {
        health,
        config: this.config,
        data,
      });
    }
  }
}
```

### Playback Speed & Trick Play

```typescript
// TrickPlay.tsx - Advanced playback controls
const TrickPlay = ({
  video,
  onSeekStart,
  onSeekEnd,
}: {
  video: HTMLVideoElement;
  onSeekStart?: () => void;
  onSeekEnd?: () => void;
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);
  const [thumbnailTime, setThumbnailTime] = useState(0);
  const thumbnailCache = useRef<Map<number, string>>(new Map());

  // Generate thumbnail sprite sheet URL
  const getThumbnailUrl = useCallback((time: number): string => {
    // Thumbnails are typically generated every 10 seconds
    const interval = 10;
    const index = Math.floor(time / interval);
    const row = Math.floor(index / 10);
    const col = index % 10;

    return `/api/thumbnails/${video.dataset.videoId}?t=${index * interval}&row=${row}&col=${col}`;
  }, [video.dataset.videoId]);

  // Preload nearby thumbnails
  const preloadThumbnails = useCallback((centerTime: number) => {
    const preloadRange = 30; // seconds
    for (let t = centerTime - preloadRange; t <= centerTime + preloadRange; t += 10) {
      if (t >= 0 && t <= video.duration && !thumbnailCache.current.has(t)) {
        const img = new Image();
        img.src = getThumbnailUrl(t);
        thumbnailCache.current.set(t, img.src);
      }
    }
  }, [video.duration, getThumbnailUrl]);

  const handleScrubStart = useCallback(() => {
    setIsScrubbing(true);
    onSeekStart?.();
    video.pause();
  }, [video, onSeekStart]);

  const handleScrub = useCallback((time: number) => {
    setThumbnailTime(time);
    setThumbnailUrl(getThumbnailUrl(time));
    preloadThumbnails(time);
  }, [getThumbnailUrl, preloadThumbnails]);

  const handleScrubEnd = useCallback((time: number) => {
    setIsScrubbing(false);
    video.currentTime = time;
    video.play();
    onSeekEnd?.();
  }, [video, onSeekEnd]);

  return (
    <div className="trick-play">
      {isScrubbing && thumbnailUrl && (
        <div
          className="thumbnail-preview"
          style={{
            left: `${(thumbnailTime / video.duration) * 100}%`,
          }}
        >
          <img src={thumbnailUrl} alt={`Preview at ${formatTime(thumbnailTime)}`} />
          <span className="preview-time">{formatTime(thumbnailTime)}</span>
        </div>
      )}

      <SeekBar
        duration={video.duration}
        currentTime={video.currentTime}
        onScrubStart={handleScrubStart}
        onScrub={handleScrub}
        onScrubEnd={handleScrubEnd}
      />
    </div>
  );
};

// Playback speed controls
const PlaybackRateMenu = ({
  currentRate,
  onRateChange,
}: {
  currentRate: number;
  onRateChange: (rate: number) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const rates = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  return (
    <div className="playback-rate-menu">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        {currentRate}x
      </button>

      {isOpen && (
        <ul role="menu" className="rate-options">
          {rates.map((rate) => (
            <li key={rate}>
              <button
                role="menuitem"
                onClick={() => {
                  onRateChange(rate);
                  setIsOpen(false);
                }}
                aria-current={rate === currentRate}
              >
                {rate === 1 ? 'Normal' : `${rate}x`}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Video Player State Management

```typescript
// useVideoPlayer.ts - Comprehensive video player hook
import { useReducer, useCallback, useRef, useEffect } from 'react';

type VideoState = {
  status: 'idle' | 'loading' | 'ready' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';
  currentTime: number;
  duration: number;
  buffered: TimeRanges | null;
  volume: number;
  muted: boolean;
  playbackRate: number;
  quality: number; // -1 for auto
  availableQualities: QualityLevel[];
  captions: TextTrack | null;
  availableCaptions: TextTrack[];
  isFullscreen: boolean;
  isPictureInPicture: boolean;
  error: MediaError | null;
};

type VideoAction =
  | { type: 'LOAD' }
  | { type: 'LOADED'; duration: number }
  | { type: 'PLAY' }
  | { type: 'PAUSE' }
  | { type: 'BUFFERING' }
  | { type: 'TIME_UPDATE'; currentTime: number }
  | { type: 'BUFFER_UPDATE'; buffered: TimeRanges }
  | { type: 'VOLUME_CHANGE'; volume: number; muted: boolean }
  | { type: 'RATE_CHANGE'; playbackRate: number }
  | { type: 'QUALITY_CHANGE'; quality: number }
  | { type: 'QUALITIES_AVAILABLE'; qualities: QualityLevel[] }
  | { type: 'CAPTION_CHANGE'; captions: TextTrack | null }
  | { type: 'CAPTIONS_AVAILABLE'; captions: TextTrack[] }
  | { type: 'FULLSCREEN_CHANGE'; isFullscreen: boolean }
  | { type: 'PIP_CHANGE'; isPictureInPicture: boolean }
  | { type: 'ENDED' }
  | { type: 'ERROR'; error: MediaError };

const initialState: VideoState = {
  status: 'idle',
  currentTime: 0,
  duration: 0,
  buffered: null,
  volume: 1,
  muted: false,
  playbackRate: 1,
  quality: -1,
  availableQualities: [],
  captions: null,
  availableCaptions: [],
  isFullscreen: false,
  isPictureInPicture: false,
  error: null,
};

function videoReducer(state: VideoState, action: VideoAction): VideoState {
  switch (action.type) {
    case 'LOAD':
      return { ...state, status: 'loading', error: null };
    case 'LOADED':
      return { ...state, status: 'ready', duration: action.duration };
    case 'PLAY':
      return { ...state, status: 'playing' };
    case 'PAUSE':
      return { ...state, status: 'paused' };
    case 'BUFFERING':
      return { ...state, status: 'buffering' };
    case 'TIME_UPDATE':
      return { ...state, currentTime: action.currentTime };
    case 'BUFFER_UPDATE':
      return { ...state, buffered: action.buffered };
    case 'VOLUME_CHANGE':
      return { ...state, volume: action.volume, muted: action.muted };
    case 'RATE_CHANGE':
      return { ...state, playbackRate: action.playbackRate };
    case 'QUALITY_CHANGE':
      return { ...state, quality: action.quality };
    case 'QUALITIES_AVAILABLE':
      return { ...state, availableQualities: action.qualities };
    case 'CAPTION_CHANGE':
      return { ...state, captions: action.captions };
    case 'CAPTIONS_AVAILABLE':
      return { ...state, availableCaptions: action.captions };
    case 'FULLSCREEN_CHANGE':
      return { ...state, isFullscreen: action.isFullscreen };
    case 'PIP_CHANGE':
      return { ...state, isPictureInPicture: action.isPictureInPicture };
    case 'ENDED':
      return { ...state, status: 'ended' };
    case 'ERROR':
      return { ...state, status: 'error', error: action.error };
    default:
      return state;
  }
}

export function useVideoPlayer(videoRef: RefObject<HTMLVideoElement>) {
  const [state, dispatch] = useReducer(videoReducer, initialState);

  // Bind video events to dispatch
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const events: Record<string, () => void> = {
      loadstart: () => dispatch({ type: 'LOAD' }),
      loadedmetadata: () => dispatch({ type: 'LOADED', duration: video.duration }),
      play: () => dispatch({ type: 'PLAY' }),
      pause: () => dispatch({ type: 'PAUSE' }),
      waiting: () => dispatch({ type: 'BUFFERING' }),
      playing: () => dispatch({ type: 'PLAY' }),
      timeupdate: () => dispatch({ type: 'TIME_UPDATE', currentTime: video.currentTime }),
      progress: () => dispatch({ type: 'BUFFER_UPDATE', buffered: video.buffered }),
      volumechange: () => dispatch({ type: 'VOLUME_CHANGE', volume: video.volume, muted: video.muted }),
      ratechange: () => dispatch({ type: 'RATE_CHANGE', playbackRate: video.playbackRate }),
      ended: () => dispatch({ type: 'ENDED' }),
      error: () => video.error && dispatch({ type: 'ERROR', error: video.error }),
    };

    Object.entries(events).forEach(([event, handler]) => {
      video.addEventListener(event, handler);
    });

    return () => {
      Object.entries(events).forEach(([event, handler]) => {
        video.removeEventListener(event, handler);
      });
    };
  }, [videoRef]);

  // Actions
  const actions = {
    play: useCallback(() => videoRef.current?.play(), [videoRef]),
    pause: useCallback(() => videoRef.current?.pause(), [videoRef]),
    seek: useCallback((time: number) => {
      if (videoRef.current) videoRef.current.currentTime = time;
    }, [videoRef]),
    setVolume: useCallback((volume: number) => {
      if (videoRef.current) videoRef.current.volume = volume;
    }, [videoRef]),
    setMuted: useCallback((muted: boolean) => {
      if (videoRef.current) videoRef.current.muted = muted;
    }, [videoRef]),
    setPlaybackRate: useCallback((rate: number) => {
      if (videoRef.current) videoRef.current.playbackRate = rate;
    }, [videoRef]),
  };

  return { state, actions, dispatch };
}
```

### Video Player Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIDEO PLAYER COMPONENT HIERARCHY                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ VideoPlayerProvider (Context)                                         │   │
│  │  └── State: currentVideo, playlist, preferences                      │   │
│  │                                                                       │   │
│  │  ┌────────────────────────────────────────────────────────────────┐  │   │
│  │  │ VideoPlayer (Container)                                         │  │   │
│  │  │                                                                 │  │   │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │  │   │
│  │  │  │ VideoCanvas                                              │   │  │   │
│  │  │  │  └── <video> element                                     │   │  │   │
│  │  │  │  └── LoadingOverlay                                      │   │  │   │
│  │  │  │  └── ErrorOverlay                                        │   │  │   │
│  │  │  └─────────────────────────────────────────────────────────┘   │  │   │
│  │  │                                                                 │  │   │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │  │   │
│  │  │  │ ControlsOverlay                                          │   │  │   │
│  │  │  │                                                          │   │  │   │
│  │  │  │  ┌──────────────────────────────────────────────────┐   │   │  │   │
│  │  │  │  │ ProgressBar                                       │   │   │  │   │
│  │  │  │  │  └── BufferedProgress                             │   │   │  │   │
│  │  │  │  │  └── PlayedProgress                               │   │   │  │   │
│  │  │  │  │  └── SeekHandle                                   │   │   │  │   │
│  │  │  │  │  └── ThumbnailPreview                             │   │   │  │   │
│  │  │  │  │  └── ChapterMarkers                               │   │   │  │   │
│  │  │  │  └──────────────────────────────────────────────────┘   │   │  │   │
│  │  │  │                                                          │   │  │   │
│  │  │  │  ┌──────────────────────────────────────────────────┐   │   │  │   │
│  │  │  │  │ ControlsBar                                       │   │   │  │   │
│  │  │  │  │  ├── PlayPauseButton                              │   │   │  │   │
│  │  │  │  │  ├── SeekButtons (-10s, +10s)                     │   │   │  │   │
│  │  │  │  │  ├── VolumeControl                                │   │   │  │   │
│  │  │  │  │  ├── TimeDisplay                                  │   │   │  │   │
│  │  │  │  │  ├── PlaybackRateMenu                             │   │   │  │   │
│  │  │  │  │  ├── QualitySelector                              │   │   │  │   │
│  │  │  │  │  ├── CaptionsMenu                                 │   │   │  │   │
│  │  │  │  │  ├── PiPButton                                    │   │   │  │   │
│  │  │  │  │  └── FullscreenButton                             │   │   │  │   │
│  │  │  │  └──────────────────────────────────────────────────┘   │   │  │   │
│  │  │  │                                                          │   │  │   │
│  │  │  └─────────────────────────────────────────────────────────┘   │  │   │
│  │  │                                                                 │  │   │
│  │  │  ┌─────────────────────────────────────────────────────────┐   │  │   │
│  │  │  │ CaptionDisplay                                           │   │  │   │
│  │  │  │  └── Renders active caption cues                         │   │  │   │
│  │  │  └─────────────────────────────────────────────────────────┘   │  │   │
│  │  │                                                                 │  │   │
│  │  └────────────────────────────────────────────────────────────────┘  │   │
│  │                                                                       │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Internationalization (i18n)

### i18n Architecture

```typescript
// i18n/config.ts - i18n configuration
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// Supported locales with metadata
export const SUPPORTED_LOCALES = {
  'en-US': { name: 'English (US)', dir: 'ltr', dateFormat: 'MM/DD/YYYY' },
  'en-GB': { name: 'English (UK)', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'es': { name: 'Español', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'pt-BR': { name: 'Português (Brasil)', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'fr': { name: 'Français', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'de': { name: 'Deutsch', dir: 'ltr', dateFormat: 'DD.MM.YYYY' },
  'ja': { name: '日本語', dir: 'ltr', dateFormat: 'YYYY/MM/DD' },
  'ko': { name: '한국어', dir: 'ltr', dateFormat: 'YYYY.MM.DD' },
  'zh-CN': { name: '简体中文', dir: 'ltr', dateFormat: 'YYYY-MM-DD' },
  'zh-TW': { name: '繁體中文', dir: 'ltr', dateFormat: 'YYYY/MM/DD' },
  'ar': { name: 'العربية', dir: 'rtl', dateFormat: 'DD/MM/YYYY' },
  'he': { name: 'עברית', dir: 'rtl', dateFormat: 'DD/MM/YYYY' },
  'hi': { name: 'हिन्दी', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'th': { name: 'ไทย', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'vi': { name: 'Tiếng Việt', dir: 'ltr', dateFormat: 'DD/MM/YYYY' },
  'ru': { name: 'Русский', dir: 'ltr', dateFormat: 'DD.MM.YYYY' },
} as const;

export type SupportedLocale = keyof typeof SUPPORTED_LOCALES;

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en-US',
    supportedLngs: Object.keys(SUPPORTED_LOCALES),
    debug: process.env.NODE_ENV === 'development',

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      cookieMinutes: 43200, // 30 days
    },

    interpolation: {
      escapeValue: false, // React already escapes
      format: (value, format, lng) => {
        if (format === 'number') {
          return new Intl.NumberFormat(lng).format(value);
        }
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: 'USD',
          }).format(value);
        }
        return value;
      },
    },

    ns: ['common', 'player', 'search', 'upload', 'settings'],
    defaultNS: 'common',

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
    },
  });

export default i18n;
```

### Translation Files Structure

```typescript
// locales/en-US/player.json
{
  "controls": {
    "play": "Play",
    "pause": "Pause",
    "mute": "Mute",
    "unmute": "Unmute",
    "fullscreen": "Fullscreen",
    "exitFullscreen": "Exit fullscreen",
    "pictureInPicture": "Picture in picture",
    "settings": "Settings",
    "captions": "Subtitles/CC",
    "quality": "Quality",
    "playbackSpeed": "Playback speed",
    "rewind": "Rewind {{seconds}} seconds",
    "forward": "Forward {{seconds}} seconds"
  },
  "quality": {
    "auto": "Auto",
    "hd": "HD",
    "uhd": "4K"
  },
  "speed": {
    "normal": "Normal"
  },
  "captions": {
    "off": "Off",
    "autoGenerated": "Auto-generated"
  },
  "errors": {
    "playback": "An error occurred during playback",
    "network": "Network error. Check your connection.",
    "format": "This video format is not supported"
  },
  "status": {
    "buffering": "Buffering...",
    "loading": "Loading video..."
  },
  "time": {
    "remaining": "{{time}} remaining",
    "duration": "{{current}} / {{total}}"
  }
}

// locales/ja/player.json
{
  "controls": {
    "play": "再生",
    "pause": "一時停止",
    "mute": "ミュート",
    "unmute": "ミュート解除",
    "fullscreen": "全画面",
    "exitFullscreen": "全画面を終了",
    "pictureInPicture": "ピクチャーインピクチャー",
    "settings": "設定",
    "captions": "字幕",
    "quality": "画質",
    "playbackSpeed": "再生速度",
    "rewind": "{{seconds}}秒戻る",
    "forward": "{{seconds}}秒進む"
  },
  "quality": {
    "auto": "自動",
    "hd": "HD",
    "uhd": "4K"
  },
  "speed": {
    "normal": "標準"
  },
  "captions": {
    "off": "オフ",
    "autoGenerated": "自動生成"
  },
  "errors": {
    "playback": "再生中にエラーが発生しました",
    "network": "ネットワークエラー。接続を確認してください。",
    "format": "この動画形式はサポートされていません"
  },
  "status": {
    "buffering": "バッファリング中...",
    "loading": "動画を読み込んでいます..."
  },
  "time": {
    "remaining": "残り{{time}}",
    "duration": "{{current}} / {{total}}"
  }
}

// locales/ar/player.json (RTL)
{
  "controls": {
    "play": "تشغيل",
    "pause": "إيقاف مؤقت",
    "mute": "كتم الصوت",
    "unmute": "إلغاء كتم الصوت",
    "fullscreen": "ملء الشاشة",
    "exitFullscreen": "الخروج من ملء الشاشة",
    "pictureInPicture": "صورة داخل صورة",
    "settings": "الإعدادات",
    "captions": "الترجمة",
    "quality": "الجودة",
    "playbackSpeed": "سرعة التشغيل",
    "rewind": "ترجيع {{seconds}} ثانية",
    "forward": "تقديم {{seconds}} ثانية"
  }
}
```

### RTL (Right-to-Left) Support

```typescript
// hooks/useDirection.ts
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/config';

export const useDirection = () => {
  const { i18n } = useTranslation();
  const locale = i18n.language as SupportedLocale;
  const config = SUPPORTED_LOCALES[locale] || SUPPORTED_LOCALES['en-US'];

  return {
    dir: config.dir,
    isRTL: config.dir === 'rtl',
    locale,
  };
};

// components/DirectionProvider.tsx
import { useDirection } from '@/hooks/useDirection';
import { useEffect } from 'react';

export const DirectionProvider = ({ children }: { children: React.ReactNode }) => {
  const { dir, isRTL } = useDirection();

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = i18n.language;

    // Add RTL class for CSS targeting
    if (isRTL) {
      document.documentElement.classList.add('rtl');
    } else {
      document.documentElement.classList.remove('rtl');
    }
  }, [dir, isRTL]);

  return <>{children}</>;
};

// styles/rtl.css
/* RTL-specific styles */
.rtl .video-controls {
  flex-direction: row-reverse;
}

.rtl .progress-bar {
  direction: rtl;
}

.rtl .time-display {
  direction: ltr; /* Keep numbers LTR */
  unicode-bidi: embed;
}

.rtl .seek-forward {
  transform: scaleX(-1); /* Flip seek icons */
}

.rtl .seek-backward {
  transform: scaleX(-1);
}

.rtl .volume-slider {
  direction: rtl;
}

/* Logical properties for RTL support */
.video-sidebar {
  margin-inline-start: 16px;
  padding-inline-end: 12px;
  border-inline-start: 1px solid var(--border-color);
}

.comment-reply {
  margin-inline-start: 40px;
}
```

### Number & Date Formatting

```typescript
// utils/formatters.ts
import { useTranslation } from 'react-i18next';

// View count formatting (1.2M, 5.4K, etc.)
export const useViewCountFormatter = () => {
  const { i18n } = useTranslation();

  return (count: number): string => {
    const locale = i18n.language;

    if (count >= 1_000_000_000) {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(count);
    }

    if (count >= 1_000_000) {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(count);
    }

    if (count >= 1_000) {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        maximumFractionDigits: 1,
      }).format(count);
    }

    return new Intl.NumberFormat(locale).format(count);
  };
};

// Relative time formatting (2 hours ago, 3 days ago)
export const useRelativeTimeFormatter = () => {
  const { i18n } = useTranslation();

  return (date: Date | string): string => {
    const locale = i18n.language;
    const now = new Date();
    const targetDate = new Date(date);
    const diffMs = now.getTime() - targetDate.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    if (diffSeconds < 60) {
      return rtf.format(-diffSeconds, 'seconds');
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) {
      return rtf.format(-diffMinutes, 'minutes');
    }

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) {
      return rtf.format(-diffHours, 'hours');
    }

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) {
      return rtf.format(-diffDays, 'days');
    }

    const diffWeeks = Math.floor(diffDays / 7);
    if (diffWeeks < 4) {
      return rtf.format(-diffWeeks, 'weeks');
    }

    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) {
      return rtf.format(-diffMonths, 'months');
    }

    const diffYears = Math.floor(diffDays / 365);
    return rtf.format(-diffYears, 'years');
  };
};

// Duration formatting (1:23:45)
export const useDurationFormatter = () => {
  const { i18n } = useTranslation();

  return (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    // Use locale-aware number formatting for parts
    const locale = i18n.language;
    const pad = (n: number) => n.toString().padStart(2, '0');

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(secs)}`;
    }
    return `${minutes}:${pad(secs)}`;
  };
};

// File size formatting
export const useFileSizeFormatter = () => {
  const { i18n, t } = useTranslation();

  return (bytes: number): string => {
    const locale = i18n.language;
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let unitIndex = 0;
    let size = bytes;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 1,
    }).format(size) + ' ' + units[unitIndex];
  };
};
```

### Language Selector Component

```typescript
// LanguageSelector.tsx
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LOCALES, SupportedLocale } from '@/i18n/config';

const LanguageSelector = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = i18n.language as SupportedLocale;
  const currentConfig = SUPPORTED_LOCALES[currentLocale];

  const handleLanguageChange = async (locale: SupportedLocale) => {
    await i18n.changeLanguage(locale);
    setIsOpen(false);

    // Persist preference
    localStorage.setItem('preferred-language', locale);

    // Update API calls to include language header
    document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
  };

  return (
    <div className="language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t('settings.changeLanguage')}
      >
        <GlobeIcon />
        <span>{currentConfig?.name || 'English'}</span>
        <ChevronIcon className={isOpen ? 'rotated' : ''} />
      </button>

      {isOpen && (
        <ul
          role="listbox"
          aria-label={t('settings.selectLanguage')}
          className="language-dropdown"
        >
          {Object.entries(SUPPORTED_LOCALES).map(([code, config]) => (
            <li key={code}>
              <button
                role="option"
                aria-selected={code === currentLocale}
                onClick={() => handleLanguageChange(code as SupportedLocale)}
                className={code === currentLocale ? 'selected' : ''}
              >
                <span className="language-name">{config.name}</span>
                {code === currentLocale && <CheckIcon />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### Pluralization & Complex Translations

```typescript
// locales/en-US/common.json
{
  "views": {
    "count_one": "{{count}} view",
    "count_other": "{{count}} views"
  },
  "subscribers": {
    "count_one": "{{count}} subscriber",
    "count_other": "{{count}} subscribers"
  },
  "comments": {
    "count_zero": "No comments yet",
    "count_one": "{{count}} comment",
    "count_other": "{{count}} comments"
  },
  "likes": {
    "count_one": "{{count}} like",
    "count_other": "{{count}} likes"
  },
  "uploadedBy": "Uploaded by <1>{{channel}}</1>",
  "watchLater": "Watch later",
  "shareVideo": "Share video",
  "reportVideo": "Report video"
}

// locales/ru/common.json (Russian has complex pluralization)
{
  "views": {
    "count_one": "{{count}} просмотр",
    "count_few": "{{count}} просмотра",
    "count_many": "{{count}} просмотров",
    "count_other": "{{count}} просмотров"
  },
  "comments": {
    "count_zero": "Комментариев пока нет",
    "count_one": "{{count}} комментарий",
    "count_few": "{{count}} комментария",
    "count_many": "{{count}} комментариев",
    "count_other": "{{count}} комментариев"
  }
}

// locales/ar/common.json (Arabic has even more complex pluralization)
{
  "views": {
    "count_zero": "لا مشاهدات",
    "count_one": "مشاهدة واحدة",
    "count_two": "مشاهدتان",
    "count_few": "{{count}} مشاهدات",
    "count_many": "{{count}} مشاهدة",
    "count_other": "{{count}} مشاهدة"
  }
}

// Usage in component
const VideoStats = ({ views, likes, comments }) => {
  const { t } = useTranslation();
  const formatViews = useViewCountFormatter();

  return (
    <div className="video-stats">
      <span>{t('views.count', { count: views })}</span>
      <span>{t('likes.count', { count: likes })}</span>
      <span>{t('comments.count', { count: comments })}</span>
    </div>
  );
};
```

### i18n Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERNATIONALIZATION ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Language Detection Flow:                                                   │
│  ────────────────────────                                                   │
│                                                                              │
│   1. URL Parameter (?lang=ja)                                               │
│         │                                                                    │
│         ▼                                                                    │
│   2. Cookie (locale=ja)                                                     │
│         │                                                                    │
│         ▼                                                                    │
│   3. localStorage (preferred-language)                                      │
│         │                                                                    │
│         ▼                                                                    │
│   4. Browser navigator.language                                             │
│         │                                                                    │
│         ▼                                                                    │
│   5. Fallback to en-US                                                      │
│                                                                              │
│  Translation Loading Strategy:                                              │
│  ─────────────────────────────                                              │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐         │
│  │  Critical Path │  │  Lazy Load     │  │  On-Demand             │         │
│  │                │  │                │  │                        │         │
│  │ • common.json  │  │ • player.json  │  │ • upload.json          │         │
│  │ • navigation   │  │ • search.json  │  │ • studio.json          │         │
│  │                │  │ • settings.json│  │ • analytics.json       │         │
│  └────────────────┘  └────────────────┘  └────────────────────────┘         │
│         │                   │                      │                         │
│    Bundled             Route-based            Feature-based                 │
│                                                                              │
│  RTL Support:                                                               │
│  ────────────                                                               │
│  • Arabic (ar)                                                              │
│  • Hebrew (he)                                                              │
│  • Persian (fa)                                                             │
│  • Urdu (ur)                                                                │
│                                                                              │
│  Implementation:                                                            │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │  <html dir="rtl" lang="ar">                                          │   │
│  │    <body class="rtl">                                                │   │
│  │      CSS: margin-inline-start instead of margin-left                 │   │
│  │      CSS: logical properties (start/end vs left/right)               │   │
│  │      Icons: mirror directional icons                                 │   │
│  │    </body>                                                           │   │
│  │  </html>                                                             │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Number Formats by Locale:                                                  │
│  ─────────────────────────                                                  │
│  │ Locale │ Number      │ Currency    │ Percentage │                       │
│  │────────│─────────────│─────────────│────────────│                       │
│  │ en-US  │ 1,234.56    │ $1,234.56   │ 12.34%     │                       │
│  │ de-DE  │ 1.234,56    │ 1.234,56 €  │ 12,34 %    │                       │
│  │ fr-FR  │ 1 234,56    │ 1 234,56 €  │ 12,34 %    │                       │
│  │ ja-JP  │ 1,234.56    │ ¥1,234      │ 12.34%     │                       │
│  │ ar-SA  │ ١٬٢٣٤٫٥٦   │ ١٬٢٣٤٫٥٦ ر.س│ ١٢٫٣٤٪    │                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 20. Analytics & Monitoring

### Video Analytics Tracking

```typescript
// analytics/VideoAnalytics.ts
interface VideoEvent {
  type: 'play' | 'pause' | 'seek' | 'ended' | 'quality_change' | 'buffer' | 'error';
  videoId: string;
  timestamp: number;
  data?: Record<string, any>;
}

interface WatchSession {
  sessionId: string;
  videoId: string;
  userId?: string;
  startTime: number;
  watchDuration: number;
  completionRate: number;
  qualityChanges: number;
  bufferingEvents: number;
  seekEvents: number;
  deviceType: string;
  browser: string;
  country?: string;
}

class VideoAnalytics {
  private sessionId: string;
  private videoId: string;
  private startTime: number = 0;
  private totalWatchTime: number = 0;
  private lastUpdateTime: number = 0;
  private isPlaying: boolean = false;
  private eventQueue: VideoEvent[] = [];
  private flushInterval: number = 10000; // 10 seconds

  constructor(videoId: string) {
    this.sessionId = crypto.randomUUID();
    this.videoId = videoId;
    this.startPeriodicFlush();
  }

  // Track play event
  trackPlay(currentTime: number): void {
    this.isPlaying = true;
    this.lastUpdateTime = Date.now();

    this.queueEvent({
      type: 'play',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: { currentTime },
    });
  }

  // Track pause event
  trackPause(currentTime: number): void {
    this.updateWatchTime();
    this.isPlaying = false;

    this.queueEvent({
      type: 'pause',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: { currentTime },
    });
  }

  // Track seek event
  trackSeek(fromTime: number, toTime: number): void {
    this.queueEvent({
      type: 'seek',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: { fromTime, toTime, seekDistance: toTime - fromTime },
    });
  }

  // Track buffering event
  trackBuffering(currentTime: number, bufferDuration?: number): void {
    this.queueEvent({
      type: 'buffer',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: { currentTime, bufferDuration },
    });
  }

  // Track quality change
  trackQualityChange(fromQuality: string, toQuality: string): void {
    this.queueEvent({
      type: 'quality_change',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: { fromQuality, toQuality },
    });
  }

  // Track video ended
  trackEnded(watchPercentage: number): void {
    this.updateWatchTime();

    this.queueEvent({
      type: 'ended',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: {
        totalWatchTime: this.totalWatchTime,
        watchPercentage,
        completed: watchPercentage >= 90,
      },
    });

    this.flush(); // Immediate flush on video end
  }

  // Track error
  trackError(errorCode: number, errorMessage: string): void {
    this.queueEvent({
      type: 'error',
      videoId: this.videoId,
      timestamp: Date.now(),
      data: { errorCode, errorMessage },
    });

    this.flush(); // Immediate flush on error
  }

  private updateWatchTime(): void {
    if (this.isPlaying && this.lastUpdateTime > 0) {
      this.totalWatchTime += (Date.now() - this.lastUpdateTime) / 1000;
      this.lastUpdateTime = Date.now();
    }
  }

  private queueEvent(event: VideoEvent): void {
    this.eventQueue.push(event);

    // Flush if queue is getting large
    if (this.eventQueue.length >= 20) {
      this.flush();
    }
  }

  private startPeriodicFlush(): void {
    setInterval(() => {
      this.updateWatchTime();
      this.flush();
    }, this.flushInterval);
  }

  private async flush(): Promise<void> {
    if (this.eventQueue.length === 0) return;

    const events = [...this.eventQueue];
    this.eventQueue = [];

    try {
      await fetch('/api/v1/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: this.sessionId,
          events,
          metadata: {
            userAgent: navigator.userAgent,
            screenSize: `${screen.width}x${screen.height}`,
            connectionType: (navigator as any).connection?.effectiveType,
          },
        }),
        keepalive: true, // Ensure request completes even on page unload
      });
    } catch (error) {
      // Re-queue events on failure
      this.eventQueue = [...events, ...this.eventQueue];
    }
  }

  // Clean up on unmount
  destroy(): void {
    this.trackPause(0);
    this.flush();
  }
}
```

### Performance Monitoring

```typescript
// monitoring/PerformanceMonitor.ts
interface PerformanceMetrics {
  // Video metrics
  timeToFirstFrame: number;
  initialBufferTime: number;
  rebufferingRatio: number;
  averageBitrate: number;
  qualitySwitches: number;

  // Page metrics
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte

  // Custom metrics
  videoLoadTime: number;
  thumbnailLoadTime: number;
  apiLatency: Record<string, number>;
}

class PerformanceMonitor {
  private metrics: Partial<PerformanceMetrics> = {};
  private observer: PerformanceObserver | null = null;

  constructor() {
    this.initWebVitals();
    this.initVideoMetrics();
  }

  private initWebVitals(): void {
    // Observe Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      this.observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      this.observer.observe({ entryTypes: ['largest-contentful-paint'] });

      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        this.metrics.fid = entries[0].processingStart - entries[0].startTime;
      }).observe({ entryTypes: ['first-input'] });

      // CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        for (const entry of list.getEntries() as any[]) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
      }).observe({ entryTypes: ['layout-shift'] });
    }

    // FCP
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find((e) => e.name === 'first-contentful-paint');
    if (fcp) {
      this.metrics.fcp = fcp.startTime;
    }

    // TTFB
    const navEntry = performance.getEntriesByType('navigation')[0] as any;
    if (navEntry) {
      this.metrics.ttfb = navEntry.responseStart - navEntry.requestStart;
    }
  }

  private initVideoMetrics(): void {
    // Will be populated by video player
    this.metrics.timeToFirstFrame = 0;
    this.metrics.initialBufferTime = 0;
    this.metrics.rebufferingRatio = 0;
  }

  // Called by video player
  recordTimeToFirstFrame(time: number): void {
    this.metrics.timeToFirstFrame = time;
  }

  recordInitialBufferTime(time: number): void {
    this.metrics.initialBufferTime = time;
  }

  recordRebufferingEvent(duration: number, totalPlayTime: number): void {
    this.metrics.rebufferingRatio = duration / totalPlayTime;
  }

  // Track API latency
  recordApiLatency(endpoint: string, duration: number): void {
    if (!this.metrics.apiLatency) {
      this.metrics.apiLatency = {};
    }
    this.metrics.apiLatency[endpoint] = duration;
  }

  // Get all metrics
  getMetrics(): Partial<PerformanceMetrics> {
    return { ...this.metrics };
  }

  // Report metrics to backend
  async reportMetrics(): Promise<void> {
    await fetch('/api/v1/metrics/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        metrics: this.metrics,
        url: window.location.href,
        timestamp: Date.now(),
      }),
    });
  }
}

// React hook for performance monitoring
export const usePerformanceMonitor = () => {
  const monitorRef = useRef<PerformanceMonitor | null>(null);

  useEffect(() => {
    monitorRef.current = new PerformanceMonitor();

    // Report on page unload
    const handleUnload = () => {
      monitorRef.current?.reportMetrics();
    };

    window.addEventListener('beforeunload', handleUnload);

    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return monitorRef.current;
};
```

### Error Tracking

```typescript
// monitoring/ErrorTracker.ts
interface ErrorReport {
  id: string;
  type: 'js_error' | 'video_error' | 'network_error' | 'api_error';
  message: string;
  stack?: string;
  context: {
    url: string;
    userAgent: string;
    timestamp: number;
    videoId?: string;
    userId?: string;
  };
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private static instance: ErrorTracker;
  private errorQueue: ErrorReport[] = [];

  private constructor() {
    this.setupGlobalHandlers();
  }

  static getInstance(): ErrorTracker {
    if (!ErrorTracker.instance) {
      ErrorTracker.instance = new ErrorTracker();
    }
    return ErrorTracker.instance;
  }

  private setupGlobalHandlers(): void {
    // Catch unhandled errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.captureError({
        type: 'js_error',
        message: String(message),
        stack: error?.stack,
        metadata: { source, lineno, colno },
      });
    };

    // Catch unhandled promise rejections
    window.onunhandledrejection = (event) => {
      this.captureError({
        type: 'js_error',
        message: event.reason?.message || 'Unhandled Promise Rejection',
        stack: event.reason?.stack,
      });
    };

    // Network errors via fetch wrapper
    this.wrapFetch();
  }

  private wrapFetch(): void {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const startTime = performance.now();
      const url = args[0] instanceof Request ? args[0].url : String(args[0]);

      try {
        const response = await originalFetch(...args);

        if (!response.ok && response.status >= 500) {
          this.captureError({
            type: 'api_error',
            message: `API Error: ${response.status} ${response.statusText}`,
            metadata: {
              url,
              status: response.status,
              duration: performance.now() - startTime,
            },
          });
        }

        return response;
      } catch (error) {
        this.captureError({
          type: 'network_error',
          message: error instanceof Error ? error.message : 'Network request failed',
          metadata: { url, duration: performance.now() - startTime },
        });
        throw error;
      }
    };
  }

  captureError(error: Omit<ErrorReport, 'id' | 'context'>): void {
    const report: ErrorReport = {
      id: crypto.randomUUID(),
      ...error,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: Date.now(),
      },
    };

    this.errorQueue.push(report);

    // Immediate report for critical errors
    if (error.type === 'video_error') {
      this.flush();
    } else if (this.errorQueue.length >= 10) {
      this.flush();
    }
  }

  captureVideoError(
    videoId: string,
    errorCode: number,
    errorMessage: string,
    metadata?: Record<string, any>
  ): void {
    this.captureError({
      type: 'video_error',
      message: `Video Error [${errorCode}]: ${errorMessage}`,
      metadata: { videoId, errorCode, ...metadata },
    });
  }

  private async flush(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await fetch('/api/v1/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ errors }),
        keepalive: true,
      });
    } catch {
      // Re-queue on failure
      this.errorQueue = [...errors, ...this.errorQueue];
    }
  }
}

// React Error Boundary with tracking
export class TrackedErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    ErrorTracker.getInstance().captureError({
      type: 'js_error',
      message: error.message,
      stack: error.stack,
      metadata: { componentStack: errorInfo.componentStack },
    });
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### Analytics Dashboard Components

```typescript
// components/AnalyticsDashboard.tsx
const VideoAnalyticsDashboard = ({ videoId }: { videoId: string }) => {
  const { data: analytics, isLoading } = useQuery(
    ['video-analytics', videoId],
    () => fetchVideoAnalytics(videoId)
  );

  if (isLoading) return <Skeleton />;

  return (
    <div className="analytics-dashboard">
      {/* Overview Cards */}
      <div className="overview-grid">
        <MetricCard
          title="Total Views"
          value={formatNumber(analytics.totalViews)}
          change={analytics.viewsChange}
          icon={<ViewsIcon />}
        />
        <MetricCard
          title="Watch Time"
          value={formatDuration(analytics.totalWatchTime)}
          change={analytics.watchTimeChange}
          icon={<ClockIcon />}
        />
        <MetricCard
          title="Avg. View Duration"
          value={formatDuration(analytics.avgViewDuration)}
          change={analytics.avgDurationChange}
          icon={<TimerIcon />}
        />
        <MetricCard
          title="Completion Rate"
          value={`${analytics.completionRate}%`}
          change={analytics.completionChange}
          icon={<CheckCircleIcon />}
        />
      </div>

      {/* Retention Graph */}
      <section className="retention-section">
        <h3>Audience Retention</h3>
        <RetentionGraph data={analytics.retention} duration={analytics.duration} />
      </section>

      {/* Traffic Sources */}
      <section className="traffic-section">
        <h3>Traffic Sources</h3>
        <TrafficSourcesChart data={analytics.trafficSources} />
      </section>

      {/* Device Breakdown */}
      <section className="devices-section">
        <h3>Devices</h3>
        <DeviceBreakdown data={analytics.devices} />
      </section>
    </div>
  );
};

// Retention graph showing where viewers drop off
const RetentionGraph = ({
  data,
  duration,
}: {
  data: { time: number; retention: number }[];
  duration: number;
}) => {
  return (
    <div className="retention-graph">
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="retentionGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="time"
            tickFormatter={(t) => formatTime(t)}
            stroke="#6b7280"
          />
          <YAxis
            tickFormatter={(v) => `${v}%`}
            domain={[0, 100]}
            stroke="#6b7280"
          />
          <Tooltip
            content={({ payload, label }) => (
              <div className="tooltip">
                <p>{formatTime(label)}</p>
                <p>{payload?.[0]?.value}% still watching</p>
              </div>
            )}
          />
          <Area
            type="monotone"
            dataKey="retention"
            stroke="#3b82f6"
            fill="url(#retentionGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Key moments */}
      <div className="key-moments">
        <KeyMoment label="Intro skip" time={10} percentage={85} />
        <KeyMoment label="Most replayed" time={120} percentage={45} />
        <KeyMoment label="Major drop" time={300} percentage={20} />
      </div>
    </div>
  );
};
```

### Analytics Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ANALYTICS & MONITORING ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Data Collection Layer:                                                     │
│  ──────────────────────                                                     │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐         │
│  │ Video Events   │  │ Performance    │  │ Error Tracking         │         │
│  │                │  │                │  │                        │         │
│  │ • Play/Pause   │  │ • Web Vitals   │  │ • JS Errors            │         │
│  │ • Seek         │  │ • TTFF         │  │ • Video Errors         │         │
│  │ • Buffer       │  │ • Buffering    │  │ • Network Errors       │         │
│  │ • Quality      │  │ • API Latency  │  │ • API Errors           │         │
│  │ • Completed    │  │ • Load Times   │  │                        │         │
│  └───────┬────────┘  └───────┬────────┘  └───────────┬────────────┘         │
│          │                   │                       │                       │
│          └───────────────────┼───────────────────────┘                       │
│                              │                                               │
│                              ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Event Queue (Local Buffer)                         │   │
│  │  • Batches events for efficiency                                      │   │
│  │  • Persists to localStorage for reliability                          │   │
│  │  • Flushes every 10s or on 20 events                                 │   │
│  │  • Uses keepalive for page unload                                    │   │
│  └──────────────────────────────┬───────────────────────────────────────┘   │
│                                 │                                           │
│                                 ▼                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Analytics API                                      │   │
│  │  POST /api/v1/analytics/events                                       │   │
│  │  POST /api/v1/metrics/performance                                    │   │
│  │  POST /api/v1/errors                                                 │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Key Metrics Tracked:                                                       │
│  ────────────────────                                                       │
│                                                                              │
│  │ Category     │ Metrics                              │ Target           │  │
│  │──────────────│──────────────────────────────────────│──────────────────│  │
│  │ Playback     │ Time to First Frame (TTFF)          │ < 2s             │  │
│  │              │ Initial Buffer Time                  │ < 1s             │  │
│  │              │ Rebuffering Ratio                    │ < 1%             │  │
│  │              │ Avg. Bitrate Delivered               │ > 2 Mbps         │  │
│  │──────────────│──────────────────────────────────────│──────────────────│  │
│  │ Engagement   │ Watch Time                           │ N/A              │  │
│  │              │ Completion Rate                      │ > 40%            │  │
│  │              │ Retention Curve                      │ Gradual decline  │  │
│  │              │ Replay Rate                          │ N/A              │  │
│  │──────────────│──────────────────────────────────────│──────────────────│  │
│  │ Performance  │ LCP (Largest Contentful Paint)      │ < 2.5s           │  │
│  │              │ FID (First Input Delay)             │ < 100ms          │  │
│  │              │ CLS (Cumulative Layout Shift)       │ < 0.1            │  │
│  │──────────────│──────────────────────────────────────│──────────────────│  │
│  │ Errors       │ Video Error Rate                    │ < 0.1%           │  │
│  │              │ JS Error Rate                       │ < 0.5%           │  │
│  │              │ API Error Rate                      │ < 0.1%           │  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 21. Notification System

### Push Notification Setup

```typescript
// notifications/PushNotificationService.ts
class PushNotificationService {
  private registration: ServiceWorkerRegistration | null = null;
  private subscription: PushSubscription | null = null;

  async initialize(): Promise<boolean> {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      console.warn('Push notifications not supported');
      return false;
    }

    try {
      // Register service worker
      this.registration = await navigator.serviceWorker.register('/sw.js');

      // Check existing subscription
      this.subscription = await this.registration.pushManager.getSubscription();

      return true;
    } catch (error) {
      console.error('Failed to initialize push notifications:', error);
      return false;
    }
  }

  async requestPermission(): Promise<NotificationPermission> {
    const permission = await Notification.requestPermission();
    return permission;
  }

  async subscribe(): Promise<PushSubscription | null> {
    if (!this.registration) {
      await this.initialize();
    }

    try {
      // Get VAPID public key from server
      const response = await fetch('/api/v1/notifications/vapid-public-key');
      const { publicKey } = await response.json();

      const subscription = await this.registration!.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey),
      });

      // Send subscription to server
      await fetch('/api/v1/notifications/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subscription),
      });

      this.subscription = subscription;
      return subscription;
    } catch (error) {
      console.error('Failed to subscribe:', error);
      return null;
    }
  }

  async unsubscribe(): Promise<boolean> {
    if (!this.subscription) return true;

    try {
      await this.subscription.unsubscribe();

      await fetch('/api/v1/notifications/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: this.subscription.endpoint }),
      });

      this.subscription = null;
      return true;
    } catch (error) {
      console.error('Failed to unsubscribe:', error);
      return false;
    }
  }

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, '+')
      .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  isSubscribed(): boolean {
    return this.subscription !== null;
  }
}

// Service Worker Push Handler
// sw.ts
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {};

  const options: NotificationOptions = {
    body: data.body,
    icon: data.icon || '/icons/notification-icon.png',
    badge: '/icons/badge.png',
    image: data.image,
    tag: data.tag || 'default',
    data: {
      url: data.url,
      videoId: data.videoId,
    },
    actions: data.actions || [],
    requireInteraction: data.requireInteraction || false,
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const { url, videoId } = event.notification.data;

  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((clientList) => {
      // Focus existing window if open
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) {
          return client.focus();
        }
      }

      // Open new window
      if (clients.openWindow) {
        return clients.openWindow(url || `/watch/${videoId}`);
      }
    })
  );
});
```

### In-App Notification Center

```typescript
// components/NotificationCenter.tsx
interface Notification {
  id: string;
  type: 'upload' | 'live' | 'comment' | 'mention' | 'subscription' | 'system';
  title: string;
  message: string;
  thumbnail?: string;
  channelAvatar?: string;
  videoId?: string;
  channelId?: string;
  createdAt: Date;
  read: boolean;
}

const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch notifications
  const { data, refetch } = useQuery('notifications', fetchNotifications, {
    refetchInterval: 60000, // Refetch every minute
  });

  // Real-time updates via WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/notifications`);

    ws.onmessage = (event) => {
      const notification = JSON.parse(event.data);
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show browser notification if permitted
      if (Notification.permission === 'granted' && document.hidden) {
        new Notification(notification.title, {
          body: notification.message,
          icon: notification.thumbnail,
        });
      }
    };

    return () => ws.close();
  }, []);

  // Mark as read
  const markAsRead = async (id: string) => {
    await fetch(`/api/v1/notifications/${id}/read`, { method: 'POST' });
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllAsRead = async () => {
    await fetch('/api/v1/notifications/read-all', { method: 'POST' });
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  return (
    <div className="notification-center">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="notification-bell"
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
      >
        <BellIcon />
        {unreadCount > 0 && (
          <span className="notification-badge" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="notification-dropdown"
          role="dialog"
          aria-label="Notifications"
        >
          <header className="notification-header">
            <h2>Notifications</h2>
            {unreadCount > 0 && (
              <button onClick={markAllAsRead} className="mark-all-read">
                Mark all as read
              </button>
            )}
          </header>

          <div className="notification-list" role="list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <BellOffIcon />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                />
              ))
            )}
          </div>

          <footer className="notification-footer">
            <Link href="/notifications">View all notifications</Link>
          </footer>
        </div>
      )}
    </div>
  );
};

const NotificationItem = ({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: () => void;
}) => {
  const handleClick = () => {
    if (!notification.read) {
      onRead();
    }
  };

  const getIcon = () => {
    switch (notification.type) {
      case 'upload':
        return <UploadIcon />;
      case 'live':
        return <LiveIcon className="live-pulse" />;
      case 'comment':
        return <CommentIcon />;
      case 'mention':
        return <AtIcon />;
      case 'subscription':
        return <UserPlusIcon />;
      default:
        return <BellIcon />;
    }
  };

  return (
    <a
      href={notification.videoId ? `/watch/${notification.videoId}` : '#'}
      className={`notification-item ${notification.read ? '' : 'unread'}`}
      onClick={handleClick}
      role="listitem"
    >
      <div className="notification-icon">{getIcon()}</div>

      {notification.thumbnail ? (
        <img
          src={notification.thumbnail}
          alt=""
          className="notification-thumbnail"
        />
      ) : notification.channelAvatar ? (
        <img
          src={notification.channelAvatar}
          alt=""
          className="notification-avatar"
        />
      ) : null}

      <div className="notification-content">
        <p className="notification-title">{notification.title}</p>
        <p className="notification-message">{notification.message}</p>
        <time className="notification-time">
          {formatRelativeTime(notification.createdAt)}
        </time>
      </div>

      {!notification.read && (
        <span className="unread-dot" aria-label="Unread" />
      )}
    </a>
  );
};
```

### Notification Preferences

```typescript
// components/NotificationSettings.tsx
interface NotificationPreferences {
  subscriptions: boolean;
  uploads: boolean;
  liveStreams: boolean;
  premieres: boolean;
  comments: boolean;
  mentions: boolean;
  replies: boolean;
  channelActivity: boolean;
  recommendations: boolean;
  email: {
    enabled: boolean;
    frequency: 'instant' | 'daily' | 'weekly';
  };
  push: {
    enabled: boolean;
    quiet: {
      enabled: boolean;
      start: string; // "22:00"
      end: string;   // "08:00"
    };
  };
}

const NotificationSettings = () => {
  const { data: preferences, isLoading } = useQuery(
    'notification-preferences',
    fetchNotificationPreferences
  );

  const mutation = useMutation(updateNotificationPreferences, {
    onSuccess: () => {
      queryClient.invalidateQueries('notification-preferences');
    },
  });

  const handleToggle = (key: keyof NotificationPreferences, value: boolean) => {
    mutation.mutate({ [key]: value });
  };

  if (isLoading) return <Skeleton />;

  return (
    <div className="notification-settings">
      <h2>Notification Preferences</h2>

      <section className="settings-section">
        <h3>Subscriptions</h3>

        <ToggleRow
          label="New uploads"
          description="Get notified when channels you subscribe to upload new videos"
          checked={preferences.uploads}
          onChange={(v) => handleToggle('uploads', v)}
        />

        <ToggleRow
          label="Live streams"
          description="Get notified when channels go live"
          checked={preferences.liveStreams}
          onChange={(v) => handleToggle('liveStreams', v)}
        />

        <ToggleRow
          label="Premieres"
          description="Get notified about scheduled premieres"
          checked={preferences.premieres}
          onChange={(v) => handleToggle('premieres', v)}
        />
      </section>

      <section className="settings-section">
        <h3>Activity on your content</h3>

        <ToggleRow
          label="Comments"
          description="Get notified about new comments on your videos"
          checked={preferences.comments}
          onChange={(v) => handleToggle('comments', v)}
        />

        <ToggleRow
          label="Mentions"
          description="Get notified when someone mentions you"
          checked={preferences.mentions}
          onChange={(v) => handleToggle('mentions', v)}
        />

        <ToggleRow
          label="Replies"
          description="Get notified about replies to your comments"
          checked={preferences.replies}
          onChange={(v) => handleToggle('replies', v)}
        />
      </section>

      <section className="settings-section">
        <h3>Push Notifications</h3>

        <ToggleRow
          label="Enable push notifications"
          description="Receive notifications even when the app is closed"
          checked={preferences.push.enabled}
          onChange={async (v) => {
            if (v) {
              const permission = await Notification.requestPermission();
              if (permission === 'granted') {
                handleToggle('push', { ...preferences.push, enabled: true });
              }
            } else {
              handleToggle('push', { ...preferences.push, enabled: false });
            }
          }}
        />

        {preferences.push.enabled && (
          <div className="quiet-hours">
            <ToggleRow
              label="Quiet hours"
              description="Pause notifications during specific hours"
              checked={preferences.push.quiet.enabled}
              onChange={(v) =>
                handleToggle('push', {
                  ...preferences.push,
                  quiet: { ...preferences.push.quiet, enabled: v },
                })
              }
            />

            {preferences.push.quiet.enabled && (
              <div className="time-range">
                <TimeInput
                  label="From"
                  value={preferences.push.quiet.start}
                  onChange={(v) =>
                    handleToggle('push', {
                      ...preferences.push,
                      quiet: { ...preferences.push.quiet, start: v },
                    })
                  }
                />
                <TimeInput
                  label="To"
                  value={preferences.push.quiet.end}
                  onChange={(v) =>
                    handleToggle('push', {
                      ...preferences.push,
                      quiet: { ...preferences.push.quiet, end: v },
                    })
                  }
                />
              </div>
            )}
          </div>
        )}
      </section>

      <section className="settings-section">
        <h3>Email Notifications</h3>

        <ToggleRow
          label="Enable email notifications"
          checked={preferences.email.enabled}
          onChange={(v) =>
            handleToggle('email', { ...preferences.email, enabled: v })
          }
        />

        {preferences.email.enabled && (
          <RadioGroup
            label="Frequency"
            value={preferences.email.frequency}
            options={[
              { value: 'instant', label: 'Instant' },
              { value: 'daily', label: 'Daily digest' },
              { value: 'weekly', label: 'Weekly digest' },
            ]}
            onChange={(v) =>
              handleToggle('email', { ...preferences.email, frequency: v })
            }
          />
        )}
      </section>
    </div>
  );
};
```

### Notification Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NOTIFICATION SYSTEM ARCHITECTURE                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Notification Sources:                                                      │
│  ─────────────────────                                                      │
│                                                                              │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐         │
│  │ Content Events │  │ Social Events  │  │ System Events          │         │
│  │                │  │                │  │                        │         │
│  │ • New upload   │  │ • Comment      │  │ • Security alert       │         │
│  │ • Live start   │  │ • Reply        │  │ • Policy update        │         │
│  │ • Premiere     │  │ • Mention      │  │ • Account activity     │         │
│  │ • Community    │  │ • Like         │  │ • Feature announcement │         │
│  └───────┬────────┘  └───────┬────────┘  └───────────┬────────────┘         │
│          │                   │                       │                       │
│          └───────────────────┼───────────────────────┘                       │
│                              │                                               │
│                              ▼                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                    Notification Router                                │   │
│  │                                                                       │   │
│  │  1. Check user preferences                                           │   │
│  │  2. Apply frequency rules                                            │   │
│  │  3. Check quiet hours                                                │   │
│  │  4. Route to appropriate channels                                    │   │
│  └──────────────────────────────┬───────────────────────────────────────┘   │
│                                 │                                           │
│              ┌──────────────────┼──────────────────┐                        │
│              │                  │                  │                        │
│              ▼                  ▼                  ▼                        │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────────────┐         │
│  │ In-App         │  │ Push           │  │ Email                  │         │
│  │                │  │                │  │                        │         │
│  │ • WebSocket    │  │ • Web Push API │  │ • Instant              │         │
│  │ • Notification │  │ • FCM (Mobile) │  │ • Daily digest         │         │
│  │   Center       │  │ • APNs (iOS)   │  │ • Weekly digest        │         │
│  │ • Badge count  │  │                │  │                        │         │
│  └────────────────┘  └────────────────┘  └────────────────────────┘         │
│                                                                              │
│  Delivery Flow:                                                             │
│  ──────────────                                                             │
│                                                                              │
│   Event Occurs                                                              │
│       │                                                                      │
│       ▼                                                                      │
│   ┌──────────────────┐                                                      │
│   │ Get Subscribers  │  (Channels, video owners, mentioned users)           │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   ┌──────────────────┐                                                      │
│   │ Fan-out to each  │  (Batch process for large subscriber counts)        │
│   │ subscriber       │                                                      │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│       ┌────┴────┐                                                           │
│       │         │                                                            │
│       ▼         ▼                                                            │
│   [Queue]   [WebSocket]                                                      │
│       │         │                                                            │
│       ▼         ▼                                                            │
│   Async     Real-time                                                       │
│   Delivery  Delivery                                                        │
│                                                                              │
│  Notification Types:                                                        │
│  ───────────────────                                                        │
│                                                                              │
│  │ Type         │ Priority │ Channels           │ Quiet Hours │             │
│  │──────────────│──────────│────────────────────│─────────────│             │
│  │ Upload       │ Normal   │ Push, In-App       │ Respects    │             │
│  │ Live         │ High     │ Push, In-App, SMS  │ Override    │             │
│  │ Comment      │ Low      │ In-App             │ Respects    │             │
│  │ Mention      │ Normal   │ Push, In-App       │ Respects    │             │
│  │ Security     │ Critical │ Push, Email, SMS   │ Override    │             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 22. Live Streaming Deep Dive

### Low-Latency Live Player

```typescript
// LivePlayer.tsx - Ultra-low latency live streaming player
interface LivePlayerProps {
  streamId: string;
  channel: Channel;
  onChatMessage?: (message: ChatMessage) => void;
}

const LivePlayer = ({ streamId, channel, onChatMessage }: LivePlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [latency, setLatency] = useState(0);
  const [viewerCount, setViewerCount] = useState(0);
  const [quality, setQuality] = useState<'auto' | number>('auto');

  // Initialize low-latency HLS
  useEffect(() => {
    if (!Hls.isSupported()) {
      console.error('HLS not supported');
      return;
    }

    const hls = new Hls({
      // Low-latency configuration
      lowLatencyMode: true,
      liveSyncDuration: 3,          // Target 3 seconds behind live edge
      liveMaxLatencyDuration: 10,   // Max 10 seconds behind
      liveDurationInfinity: true,   // Treat as infinite duration
      highBufferWatchdogPeriod: 1,  // Check buffer every second

      // ABR settings for live
      abrEwmaFastLive: 3,
      abrEwmaSlowLive: 9,
      abrBandWidthFactor: 0.7,      // More conservative for live
      abrBandWidthUpFactor: 0.5,    // Slower to switch up in live

      // Start with lower quality, ramp up
      startLevel: -1,               // Auto-select starting level
      capLevelToPlayerSize: true,   // Don't load higher than viewport

      // Backbuffer for rewind
      backBufferLength: 30,         // Keep 30 seconds for instant replay
    });

    hlsRef.current = hls;
    hls.attachMedia(videoRef.current!);

    // Load manifest
    hls.loadSource(`/api/v1/live/${streamId}/manifest.m3u8`);

    // Track latency
    hls.on(Hls.Events.LEVEL_UPDATED, (_, data) => {
      if (videoRef.current) {
        const liveEdge = data.details.edge || 0;
        const currentLatency = liveEdge - videoRef.current.currentTime;
        setLatency(Math.max(0, currentLatency));
      }
    });

    // Handle manifest errors
    hls.on(Hls.Events.ERROR, (_, data) => {
      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        if (data.details === 'manifestLoadError') {
          // Stream might have ended
          setIsLive(false);
        } else {
          // Network hiccup, try to recover
          hls.startLoad();
        }
      }
    });

    return () => {
      hls.destroy();
    };
  }, [streamId]);

  // Real-time viewer count via WebSocket
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/live/${streamId}/stats`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setViewerCount(data.viewerCount);

      if (data.status === 'ended') {
        setIsLive(false);
      }
    };

    return () => ws.close();
  }, [streamId]);

  // Catch up to live
  const catchUpToLive = useCallback(() => {
    if (videoRef.current && hlsRef.current) {
      const liveEdge = hlsRef.current.liveSyncPosition;
      if (liveEdge) {
        videoRef.current.currentTime = liveEdge;
      }
    }
  }, []);

  // Toggle low latency mode
  const toggleLowLatency = useCallback((enabled: boolean) => {
    if (hlsRef.current) {
      hlsRef.current.config.lowLatencyMode = enabled;
      hlsRef.current.config.liveSyncDuration = enabled ? 3 : 10;
      catchUpToLive();
    }
  }, [catchUpToLive]);

  return (
    <div className="live-player">
      {/* Video element */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="video-element"
      />

      {/* Live badge */}
      {isLive && (
        <div className="live-badge">
          <span className="live-dot" />
          LIVE
        </div>
      )}

      {/* Viewer count */}
      <div className="viewer-count">
        <EyeIcon />
        {formatViewerCount(viewerCount)} watching
      </div>

      {/* Latency indicator */}
      <div className="latency-indicator">
        <button
          onClick={catchUpToLive}
          disabled={latency < 5}
          aria-label={`${latency.toFixed(1)} seconds behind live. Click to catch up.`}
        >
          {latency.toFixed(1)}s behind
          {latency > 10 && <span className="catch-up-hint">Click to catch up</span>}
        </button>
      </div>

      {/* Stream ended overlay */}
      {!isLive && (
        <div className="stream-ended-overlay">
          <h2>Stream has ended</h2>
          <p>Check back later for the replay</p>
          <button onClick={() => window.location.href = `/channel/${channel.id}`}>
            Visit Channel
          </button>
        </div>
      )}

      {/* Custom controls for live */}
      <LiveControls
        videoRef={videoRef}
        quality={quality}
        onQualityChange={setQuality}
        latency={latency}
        onCatchUp={catchUpToLive}
        isLive={isLive}
      />
    </div>
  );
};
```

### Live Chat Integration

```typescript
// LiveChat.tsx - Real-time chat for live streams
interface ChatMessage {
  id: string;
  userId: string;
  username: string;
  avatar: string;
  message: string;
  timestamp: number;
  type: 'message' | 'superchat' | 'membership' | 'sticker';
  badges: string[];
  amount?: number;
  currency?: string;
}

const LiveChat = ({ streamId }: { streamId: string }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingMessagesRef = useRef<ChatMessage[]>([]);

  // WebSocket connection for chat
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/live/${streamId}/chat`);
    wsRef.current = ws;

    ws.onopen = () => setIsConnected(true);
    ws.onclose = () => setIsConnected(false);

    ws.onmessage = (event) => {
      const message: ChatMessage = JSON.parse(event.data);

      if (isPaused) {
        pendingMessagesRef.current.push(message);
        return;
      }

      setMessages((prev) => {
        const updated = [...prev, message];
        // Keep only last 500 messages for performance
        return updated.slice(-500);
      });
    };

    return () => ws.close();
  }, [streamId, isPaused]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (!isPaused && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isPaused]);

  // Resume chat and flush pending
  const resumeChat = useCallback(() => {
    setIsPaused(false);
    setMessages((prev) => [...prev, ...pendingMessagesRef.current].slice(-500));
    pendingMessagesRef.current = [];
  }, []);

  // Send message
  const sendMessage = useCallback(() => {
    if (!inputValue.trim() || !wsRef.current) return;

    wsRef.current.send(JSON.stringify({
      type: 'message',
      message: inputValue.trim(),
    }));

    setInputValue('');
  }, [inputValue]);

  return (
    <div className="live-chat">
      <header className="chat-header">
        <h3>Live Chat</h3>
        <span className={`connection-status ${isConnected ? 'connected' : ''}`}>
          {isConnected ? 'Connected' : 'Reconnecting...'}
        </span>
      </header>

      {/* Chat messages */}
      <div
        ref={chatContainerRef}
        className="chat-messages"
        onScroll={(e) => {
          const isNearBottom =
            e.currentTarget.scrollHeight - e.currentTarget.scrollTop <
            e.currentTarget.clientHeight + 100;
          setIsPaused(!isNearBottom);
        }}
        role="log"
        aria-live="polite"
        aria-label="Chat messages"
      >
        {messages.map((msg) => (
          <ChatMessageItem key={msg.id} message={msg} />
        ))}
      </div>

      {/* Paused indicator */}
      {isPaused && (
        <button className="resume-chat" onClick={resumeChat}>
          Chat paused - {pendingMessagesRef.current.length} new messages
        </button>
      )}

      {/* Input */}
      <div className="chat-input">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Say something..."
          maxLength={200}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!inputValue.trim() || !isConnected}
          aria-label="Send message"
        >
          <SendIcon />
        </button>
      </div>
    </div>
  );
};

const ChatMessageItem = ({ message }: { message: ChatMessage }) => {
  if (message.type === 'superchat') {
    return (
      <div
        className="superchat-message"
        style={{ backgroundColor: getSuperChatColor(message.amount!) }}
      >
        <img src={message.avatar} alt="" className="avatar" />
        <div className="superchat-content">
          <span className="username">{message.username}</span>
          <span className="amount">
            {formatCurrency(message.amount!, message.currency!)}
          </span>
          <p className="message">{message.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-message">
      <img src={message.avatar} alt="" className="avatar" />
      <div className="message-content">
        <span className="badges">
          {message.badges.map((badge) => (
            <img key={badge} src={`/badges/${badge}.png`} alt={badge} />
          ))}
        </span>
        <span className="username">{message.username}</span>
        <span className="message">{message.message}</span>
      </div>
    </div>
  );
};
```

### Live Stream Dashboard (Creator)

```typescript
// LiveDashboard.tsx - Creator's live streaming control panel
const LiveDashboard = ({ streamId }: { streamId: string }) => {
  const [streamStatus, setStreamStatus] = useState<'offline' | 'live' | 'ending'>('offline');
  const [stats, setStats] = useState({
    viewers: 0,
    peakViewers: 0,
    likes: 0,
    chatMessages: 0,
    duration: 0,
  });

  // Real-time stats
  useEffect(() => {
    const ws = new WebSocket(`${WS_URL}/dashboard/${streamId}/stats`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setStats(data);
      setStreamStatus(data.status);
    };

    return () => ws.close();
  }, [streamId]);

  return (
    <div className="live-dashboard">
      {/* Stream preview */}
      <section className="preview-section">
        <div className="preview-container">
          <video
            src={`/api/v1/live/${streamId}/preview`}
            autoPlay
            muted
            className="preview-video"
          />
          <div className="preview-overlay">
            {streamStatus === 'live' && (
              <span className="live-indicator">LIVE</span>
            )}
          </div>
        </div>

        {/* Stream actions */}
        <div className="stream-actions">
          {streamStatus === 'offline' && (
            <button
              onClick={() => startStream(streamId)}
              className="go-live-button"
            >
              Go Live
            </button>
          )}
          {streamStatus === 'live' && (
            <button
              onClick={() => endStream(streamId)}
              className="end-stream-button"
            >
              End Stream
            </button>
          )}
        </div>
      </section>

      {/* Real-time stats */}
      <section className="stats-section">
        <div className="stat-grid">
          <StatCard
            label="Current Viewers"
            value={formatNumber(stats.viewers)}
            icon={<UsersIcon />}
            trend={stats.viewers > stats.peakViewers * 0.9 ? 'up' : 'stable'}
          />
          <StatCard
            label="Peak Viewers"
            value={formatNumber(stats.peakViewers)}
            icon={<TrendingUpIcon />}
          />
          <StatCard
            label="Likes"
            value={formatNumber(stats.likes)}
            icon={<ThumbsUpIcon />}
          />
          <StatCard
            label="Chat Messages"
            value={formatNumber(stats.chatMessages)}
            icon={<MessageIcon />}
          />
          <StatCard
            label="Duration"
            value={formatDuration(stats.duration)}
            icon={<ClockIcon />}
          />
        </div>
      </section>

      {/* Stream health */}
      <section className="health-section">
        <h3>Stream Health</h3>
        <StreamHealthMonitor streamId={streamId} />
      </section>

      {/* Live chat moderation */}
      <section className="chat-section">
        <h3>Chat Moderation</h3>
        <ChatModerationPanel streamId={streamId} />
      </section>
    </div>
  );
};

// Stream health monitoring
const StreamHealthMonitor = ({ streamId }: { streamId: string }) => {
  const [health, setHealth] = useState({
    bitrate: 0,
    fps: 0,
    keyframeInterval: 0,
    droppedFrames: 0,
    connectionQuality: 'good' as 'good' | 'fair' | 'poor',
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const response = await fetch(`/api/v1/live/${streamId}/health`);
      const data = await response.json();
      setHealth(data);
    }, 2000);

    return () => clearInterval(interval);
  }, [streamId]);

  return (
    <div className="health-monitor">
      <div className="health-metric">
        <span className="label">Bitrate</span>
        <span className="value">{(health.bitrate / 1000).toFixed(1)} Kbps</span>
        <HealthIndicator
          status={health.bitrate > 4000 ? 'good' : health.bitrate > 2000 ? 'fair' : 'poor'}
        />
      </div>

      <div className="health-metric">
        <span className="label">Frame Rate</span>
        <span className="value">{health.fps} fps</span>
        <HealthIndicator
          status={health.fps >= 28 ? 'good' : health.fps >= 20 ? 'fair' : 'poor'}
        />
      </div>

      <div className="health-metric">
        <span className="label">Dropped Frames</span>
        <span className="value">{health.droppedFrames}</span>
        <HealthIndicator
          status={health.droppedFrames < 10 ? 'good' : health.droppedFrames < 50 ? 'fair' : 'poor'}
        />
      </div>

      <div className="health-metric">
        <span className="label">Connection</span>
        <span className={`value ${health.connectionQuality}`}>
          {health.connectionQuality.toUpperCase()}
        </span>
      </div>
    </div>
  );
};
```

### Live Streaming Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    LIVE STREAMING ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Ingest Flow:                                                               │
│  ────────────                                                               │
│                                                                              │
│   Broadcaster                                                               │
│   (OBS/StreamLabs)                                                          │
│       │                                                                      │
│       │ RTMP/SRT                                                            │
│       ▼                                                                      │
│   ┌──────────────────┐                                                      │
│   │  Ingest Server   │  (Regional POPs)                                     │
│   │  • Protocol      │                                                      │
│   │    conversion    │                                                      │
│   │  • Authentication│                                                      │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   ┌──────────────────┐                                                      │
│   │  Transcoder      │  (ABR encoding)                                      │
│   │  • Multi-bitrate │                                                      │
│   │  • Low-latency   │                                                      │
│   │    segments      │                                                      │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   ┌──────────────────┐                                                      │
│   │  Origin/Packager │  (HLS-LL, DASH-LL)                                   │
│   │  • Segment       │                                                      │
│   │    packaging     │                                                      │
│   │  • Manifest      │                                                      │
│   │    generation    │                                                      │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   ┌──────────────────┐                                                      │
│   │  CDN Edge        │  (Global distribution)                               │
│   │  • Caching       │                                                      │
│   │  • HTTP/2 Push   │                                                      │
│   └────────┬─────────┘                                                      │
│            │                                                                 │
│            ▼                                                                 │
│   ┌──────────────────┐                                                      │
│   │  Viewer Player   │                                                      │
│   │  • HLS.js        │                                                      │
│   │  • Low-latency   │                                                      │
│   │    mode          │                                                      │
│   └──────────────────┘                                                      │
│                                                                              │
│  Latency Targets:                                                           │
│  ────────────────                                                           │
│                                                                              │
│  │ Mode               │ Target Latency │ Trade-off                        │ │
│  │────────────────────│────────────────│───────────────────────────────────│ │
│  │ Ultra-Low Latency  │ 2-4 seconds    │ More buffering, lower quality    │ │
│  │ Low Latency        │ 4-8 seconds    │ Balanced                         │ │
│  │ Standard           │ 15-30 seconds  │ Best quality, stable playback    │ │
│                                                                              │
│  Live Chat Architecture:                                                    │
│  ───────────────────────                                                    │
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────────────┐          │
│   │   Viewer    │────►│  WebSocket  │────►│  Chat Server        │          │
│   │   Browser   │◄────│  Gateway    │◄────│  (Redis Pub/Sub)    │          │
│   └─────────────┘     └─────────────┘     └─────────────────────┘          │
│                              │                      │                       │
│                              │                      ▼                       │
│                              │            ┌─────────────────────┐          │
│                              │            │  Content Moderation │          │
│                              │            │  • Spam filter      │          │
│                              │            │  • Word filter      │          │
│                              │            │  • Rate limiting    │          │
│                              │            └─────────────────────┘          │
│                              │                                              │
│                              └─────────────────────────────────►            │
│                                    Broadcast to all viewers                 │
│                                                                              │
│  DVR / Rewind Capability:                                                   │
│  ────────────────────────                                                   │
│  • Keep last 2 hours in edge cache                                          │
│  • Allow seeking back within live window                                    │
│  • "Go Live" button to jump to live edge                                    │
│  • Background recording for VOD conversion                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
