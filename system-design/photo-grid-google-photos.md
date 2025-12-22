# High-Level Design: Photo Grid System (Google Photos-like)

## Table of Contents

1. [Problem Statement & Requirements](#1-problem-statement--requirements)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Component Architecture (Frontend)](#3-component-architecture-frontend)
4. [Data Flow](#4-data-flow)
5. [API Design & Communication Protocols](#5-api-design--communication-protocols)
6. [Database Design](#6-database-design)
7. [Caching Strategy (Multi-Layer)](#7-caching-strategy-multi-layer)
8. [State Management (Frontend)](#8-state-management-frontend)
9. [Performance Optimization](#9-performance-optimization)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [Interview Cross-Questions & Answers](#11-interview-cross-questions--answers)
12. [Summary & Key Takeaways](#12-summary--key-takeaways)

---

## 1. Problem Statement & Requirements

### 1.1 Functional Requirements

**Core Features:**
- Upload photos/videos (single & batch)
- Display photos in a responsive grid/masonry layout
- Infinite scroll through large collections (10K+ photos)
- Search photos by:
  - Date, location, metadata
  - Content (objects, scenes via ML)
  - People/faces
  - Text in images (OCR)
- Create and manage albums
- Share photos/albums with granular permissions
- Organize by timeline, location, people
- Photo editing (basic filters, crop, rotate)
- Face detection and grouping

**Non-Functional Requirements:**
- Low latency: < 200ms for grid rendering
- Handle millions of users
- 99.9% availability
- Support 10TB+ storage per user
- Efficient bandwidth usage (adaptive quality)
- Resumable uploads for large files
- Cross-device sync
- GDPR/privacy compliance

### 1.2 Scale Estimates

```
Users: 100M active users
Photos per user: ~10K average, 100K for power users
Total photos: ~1 Trillion photos
Upload rate: ~10K photos/sec peak
Read:Write ratio: 100:1 (read-heavy)
Storage: ~100 PB (with compression & deduplication)
Bandwidth:
  - Upload: ~100 Gbps peak
  - Download: ~10 Tbps (with CDN)
```

### 1.3 Out of Scope (for this design)
- Video streaming optimization (separate HLD needed)
- Advanced AI features (auto-enhance, style transfer)
- Print/merchandise ordering
- Live Photos/Motion Photos
- Collaborative editing

---

## 2. High-Level Architecture

```
                                    ┌─────────────────────────────────┐
                                    │   CDN (CloudFront/Cloudflare)   │
                                    │   - Image delivery              │
                                    │   - Thumbnail caching           │
                                    └──────────────┬──────────────────┘
                                                   │
                                                   │
┌─────────────────┐                ┌──────────────▼──────────────────┐
│                 │                │      Load Balancer (L7)         │
│  Mobile Apps    │◄───────────────┤      - SSL Termination          │
│  (iOS/Android)  │                │      - Rate limiting            │
│                 │                └──────────────┬──────────────────┘
└─────────────────┘                               │
                                                   │
┌─────────────────┐                ┌──────────────▼──────────────────┐
│                 │                │      API Gateway                │
│  Web Client     │◄───────────────┤      - Auth validation          │
│  (React/SPA)    │                │      - Request routing          │
│                 │                │      - API composition          │
└─────────────────┘                └──────────────┬──────────────────┘
                                                   │
                        ┌──────────────────────────┼──────────────────────────┐
                        │                          │                          │
                        │                          │                          │
              ┌─────────▼─────────┐    ┌──────────▼──────────┐   ┌──────────▼─────────┐
              │  Upload Service   │    │   Gallery Service   │   │   Search Service   │
              │  - Resumable      │    │   - Photo listing   │   │   - Metadata search│
              │  - Chunked upload │    │   - Timeline view   │   │   - ML-based search│
              │  - Validation     │    │   - Album mgmt      │   │   - Face search    │
              └─────────┬─────────┘    └──────────┬──────────┘   └──────────┬─────────┘
                        │                         │                          │
                        │                         │                          │
              ┌─────────▼─────────┐    ┌──────────▼──────────┐   ┌──────────▼─────────┐
              │ Image Processing  │    │   Metadata Service  │   │   ML/AI Service    │
              │ - Thumbnail gen   │    │   - EXIF extract    │   │   - Face detection │
              │ - Format convert  │    │   - Geo tagging     │   │   - Object detect  │
              │ - Compression     │    │   - Deduplication   │   │   - Scene recog    │
              └─────────┬─────────┘    └──────────┬──────────┘   └──────────┬─────────┘
                        │                         │                          │
                        │                         │                          │
        ┌───────────────┴───────────┐  ┌──────────▼──────────┐   ┌──────────▼─────────┐
        │                           │  │   PostgreSQL        │   │   Elasticsearch    │
        │   Object Storage (S3)     │  │   - User data       │   │   - Search index   │
        │   - Original photos       │  │   - Photo metadata  │   │   - Content tags   │
        │   - Thumbnails (multi)    │  │   - Albums/shares   │   │   - Face vectors   │
        │   - Encrypted at rest     │  │   - Permissions     │   │                    │
        │                           │  └──────────┬──────────┘   └────────────────────┘
        └───────────────────────────┘             │
                                       ┌──────────▼──────────┐
                                       │   Redis Cluster     │
                                       │   - Session cache   │
                                       │   - Metadata cache  │
                                       │   - Rate limit      │
                                       └─────────────────────┘

                        ┌────────────────────────────────────┐
                        │   Message Queue (Kafka/SQS)        │
                        │   - Async processing tasks         │
                        │   - ML pipeline events             │
                        │   - Thumbnail generation jobs      │
                        └────────────────────────────────────┘
```

### 2.1 Architecture Rationale

**Microservices Approach:**
- **Upload Service**: Isolated to handle high write load, implement retry logic
- **Gallery Service**: Read-optimized, heavily cached
- **Search Service**: Separate indexing pipeline, can scale independently
- **Image Processing**: CPU/GPU intensive, can be scaled horizontally with workers

**Storage Strategy:**
- **S3 for blobs**: Cost-effective, durable (11 9's), scales infinitely
- **PostgreSQL for metadata**: ACID guarantees for user data, albums, sharing
- **Elasticsearch**: Full-text search, ML vector search capabilities
- **Redis**: Sub-millisecond latency for hot data

---

## 3. Component Architecture (Frontend)

### 3.1 Component Hierarchy

```
App
│
├── AuthProvider (Context)
│   └── User session, tokens
│
├── Router
│   │
│   ├── PhotoGridView
│   │   ├── VirtualizedGrid (react-window/react-virtuoso)
│   │   │   ├── PhotoTile
│   │   │   │   ├── LazyImage
│   │   │   │   ├── SelectionOverlay
│   │   │   │   └── PhotoActions
│   │   │   └── DateSeparator
│   │   │
│   │   ├── GridControls
│   │   │   ├── ViewToggle (grid/list/map)
│   │   │   ├── SortOptions
│   │   │   └── FilterPanel
│   │   │
│   │   ├── InfiniteScrollTrigger
│   │   └── UploadDropzone
│   │
│   ├── AlbumView
│   │   ├── AlbumHeader
│   │   ├── PhotoGridView (reused)
│   │   └── SharingSettings
│   │
│   ├── SearchView
│   │   ├── SearchBar
│   │   │   ├── Autocomplete
│   │   │   └── FilterChips
│   │   ├── SearchResults (PhotoGridView)
│   │   └── SuggestedSearches
│   │
│   ├── PhotoDetailView (Modal/Route)
│   │   ├── FullResolutionImage
│   │   ├── MetadataPanel
│   │   ├── NavigationControls (prev/next)
│   │   └── ActionBar (share/delete/edit)
│   │
│   └── UploadManager
│       ├── UploadQueue
│       ├── UploadProgress
│       └── RetryManager
│
└── GlobalComponents
    ├── Notification/Toast
    ├── ErrorBoundary
    └── NetworkStatusIndicator
```

### 3.2 Key Frontend Components

**VirtualizedGrid:**
```javascript
// Renders only visible rows + buffer
// Handles 10K+ items efficiently

<VirtualizedGrid
  items={photos}
  itemHeight={calculateDynamicHeight} // Masonry support
  overscan={3} // Preload 3 screens
  onEndReached={loadMore}
/>
```

**LazyImage Component:**
```javascript
// Progressive loading: blur placeholder -> thumbnail -> full
<LazyImage
  placeholder={blurhash}
  thumbnail={thumbnailUrl} // 400px
  src={fullUrl} // 1920px
  srcSet={responsiveSources}
  loading="lazy"
  decoding="async"
/>
```

---

## 4. Data Flow

### 4.1 Upload Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Request upload session
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │  Upload Service    │
     │                          └────────┬───────────┘
     │                                   │
     │ 2. Return signed URL              │
     │    + upload session ID            │
     │◄──────────────────────────────────┤
     │                                   │
     │ 3. Upload chunks directly         │
     │   (multipart upload)              │
     ├───────────────────────────────────┼──────────┐
     │                                   │          ▼
     │                                   │    ┌──────────┐
     │                                   │    │    S3    │
     │                                   │    └──────┬───┘
     │ 4. Chunk uploaded ACK             │           │
     │◄──────────────────────────────────┼───────────┘
     │                                   │
     │ 5. Complete upload (all chunks)   │
     ├──────────────────────────────────►│
     │                                   │
     │                                   │ 6. Merge chunks
     │                                   │    Extract EXIF
     │                                   │    Save metadata
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │  PostgreSQL  │
     │                                   │  └──────────────┘
     │                                   │
     │                                   │ 7. Queue processing
     │                                   │    jobs
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Kafka     │
     │                                   │  └──────┬───────┘
     │ 8. Upload complete                │         │
     │    Return photo ID                │         │
     │◄──────────────────────────────────┤         │
     │                                   │         │
     │                                             │
     │                              ┌──────────────┘
     │                              ▼
     │                     ┌──────────────────┐
     │                     │ Async Workers    │
     │                     │ - Thumbnails     │
     │                     │ - Face detection │
     │                     │ - Object tagging │
     │                     └──────────────────┘
     │
     │ 9. WebSocket/SSE: Processing complete
     │◄─────────────────────────────────────────
     │
```

**Upload Implementation Details:**

1. **Chunked Upload (Resumable):**
   - Split large files into 5MB chunks
   - Each chunk uploaded independently
   - Client tracks uploaded chunks (localStorage)
   - Resume from last successful chunk on failure
   - Use `Content-Range` headers

2. **Why Resumable Uploads:**
   - Mobile networks are unreliable
   - Large files (RAW images: 50-100MB)
   - Better user experience (pause/resume)
   - Reduced bandwidth waste on retries

3. **Direct S3 Upload:**
   - Reduces server load (no proxy)
   - S3 handles multipart upload natively
   - Pre-signed URLs for security (1hr expiry)
   - CORS configured for browser uploads

### 4.2 Photo Grid View Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Request photos (page=1, limit=50)
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │  Gallery Service   │
     │                          └────────┬───────────┘
     │                                   │
     │                                   │ 2. Check cache
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  │  (metadata)  │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 3. Cache miss
     │                                   │◄────────┘
     │                                   │
     │                                   │ 4. Query DB
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │ PostgreSQL   │
     │                                   │  │ SELECT *     │
     │                                   │  │ FROM photos  │
     │                                   │  │ WHERE ...    │
     │                                   │  │ ORDER BY     │
     │                                   │  │   created    │
     │                                   │  │ LIMIT 50     │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 5. Results
     │                                   │◄────────┘
     │                                   │
     │                                   │ 6. Cache results
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  │   (1 hour)   │
     │                                   │  └──────────────┘
     │                                   │
     │ 7. Return photo metadata          │
     │    + CDN URLs (thumbnails)        │
     │◄──────────────────────────────────┤
     │                                   │
     │ 8. Browser requests thumbnails    │
     │    (parallel, HTTP/2)             │
     ├───────────────────────────────────┼──────────┐
     │                                   │          ▼
     │                                   │    ┌──────────┐
     │                                   │    │   CDN    │
     │                                   │    └──────┬───┘
     │                                   │           │
     │                                   │           │ Cache
     │                                   │           │ miss?
     │                                   │           │
     │                                   │           ▼
     │                                   │    ┌──────────┐
     │                                   │    │    S3    │
     │                                   │    └──────┬───┘
     │ 9. Images delivered               │           │
     │◄──────────────────────────────────┼───────────┘
     │                                   │
     │ 10. User scrolls near end         │
     │     Trigger next page load        │
     ├──────────────────────────────────►│
     │     (page=2, limit=50)            │
     │                                   │
```

**View Optimization:**
- **Cursor-based pagination** (not offset): `?cursor=photoId123&limit=50`
- **Thumbnail sizes**: 150px, 400px, 800px (responsive)
- **Intersection Observer** for lazy loading
- **Virtual scrolling**: Only render visible + 3 screen buffer
- **Prefetch next page** when 80% scrolled

### 4.3 Search Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Search query: "beach sunset"
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │  Search Service    │
     │                          └────────┬───────────┘
     │                                   │
     │                                   │ 2. Parse query
     │                                   │    + apply filters
     │                                   │
     │                                   │ 3. Query ES index
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────────┐
     │                                   │  │ Elasticsearch    │
     │                                   │  │ - Text search    │
     │                                   │  │ - Vector search  │
     │                                   │  │ - Filters (date) │
     │                                   │  │ - Aggregations   │
     │                                   │  └──────┬───────────┘
     │                                   │         │
     │                                   │ 4. Photo IDs + score
     │                                   │◄────────┘
     │                                   │
     │                                   │ 5. Enrich metadata
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │ PostgreSQL   │
     │                                   │  │ + Redis      │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │◄────────┘
     │                                   │
     │ 6. Return ranked results          │
     │◄──────────────────────────────────┤
     │                                   │
```

**Search Capabilities:**

1. **Metadata Search** (Elasticsearch):
   - Date ranges, location, camera model
   - File type, size, dimensions
   - Album name, tags

2. **Content Search** (ML + Elasticsearch):
   - Objects: "dog", "car", "sunset"
   - Scenes: "beach", "mountain", "indoor"
   - Colors: "blue", "warm tones"
   - Similarity search (vector embeddings)

3. **Face Search**:
   - Face embeddings stored as vectors (512-dim)
   - k-NN search in Elasticsearch
   - Group by person (clustering)

---

## 5. API Design & Communication Protocols

### 5.1 REST API Design

**Why REST for Photo Grid:**
1. **Request-Response pattern fits perfectly**: User requests photos, server responds
2. **Cacheable by design**: GET requests cached at CDN/browser level
3. **Stateless**: Easy to scale horizontally
4. **Standard HTTP features**: Compression, range requests, conditional GET
5. **No need for real-time**: Photos don't update in real-time (unlike chat)

**When NOT to use REST:**
- Real-time collaborative editing (use WebSocket)
- Live upload progress (use SSE)
- Push notifications (use WebSocket/SSE)

### 5.2 Core API Endpoints

```
Authentication:
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

Photo Management:
GET    /api/v1/photos
       ?cursor=abc123&limit=50&sort=date_desc&filter=favorites
GET    /api/v1/photos/{photoId}
POST   /api/v1/photos/upload/init
       → Returns: { uploadId, signedUrls[], sessionToken }
POST   /api/v1/photos/upload/complete
PUT    /api/v1/photos/{photoId}
DELETE /api/v1/photos/{photoId}
POST   /api/v1/photos/batch-delete

Albums:
GET    /api/v1/albums
POST   /api/v1/albums
GET    /api/v1/albums/{albumId}/photos
POST   /api/v1/albums/{albumId}/photos
       Body: { photoIds: [...] }

Search:
GET    /api/v1/search
       ?q=beach&type=content&date_from=2024-01-01
GET    /api/v1/search/suggestions
       ?q=be → Returns: ["beach", "bedroom", "bear"]

People/Faces:
GET    /api/v1/people
GET    /api/v1/people/{personId}/photos
POST   /api/v1/people/{personId}/merge
       Body: { targetPersonId }

Sharing:
POST   /api/v1/shares
       Body: { photoIds, permissions, recipients }
GET    /api/v1/shares/{shareId}
PUT    /api/v1/shares/{shareId}/permissions
```

### 5.3 API Response Format

```json
{
  "status": "success",
  "data": {
    "photos": [...],
    "cursor": "eyJpZCI6MTIzfQ==",
    "hasMore": true
  },
  "meta": {
    "total": 10523,
    "requestId": "req_abc123"
  }
}
```

**Error Response:**
```json
{
  "status": "error",
  "error": {
    "code": "PHOTO_NOT_FOUND",
    "message": "Photo with ID 123 not found",
    "details": {}
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

### 5.4 When to Use Different Protocols

| Use Case | Protocol | Rationale |
|----------|----------|-----------|
| Photo grid listing | REST | Cacheable, stateless, standard |
| Photo upload progress | SSE | One-way server push, simpler than WebSocket |
| Shared album updates | WebSocket | Bidirectional, multiple collaborators |
| Search autocomplete | REST | Debounced requests, cacheable |
| Image delivery | HTTP/2 | Multiplexing, header compression |
| Large file upload | Resumable HTTP | Chunked, retryable |
| Real-time comments | WebSocket | Low latency, bidirectional |

### 5.5 GraphQL Alternative (Trade-off)

**Why NOT GraphQL for Photo Grid:**
- Over-fetching not a problem (fixed schema for photos)
- REST caching is superior (CDN, browser cache)
- Simpler to implement and debug
- No need for complex nested queries
- Better HTTP caching semantics

**When GraphQL Makes Sense:**
- Multiple related resources in one request
- Mobile app with limited bandwidth
- Flexible client requirements (3rd party APIs)

---

## 6. Database Design

### 6.1 SQL vs NoSQL Decision

**PostgreSQL (Primary Metadata Store)**

**Why SQL:**
1. **ACID guarantees**: Critical for user data, sharing permissions
2. **Complex queries**: JOIN albums, photos, shares, users
3. **Transactions**: Album creation + photo assignment in one transaction
4. **Mature**: Rich ecosystem, excellent tooling
5. **JSON support**: Flexible metadata storage (JSONB)

**Schema Design:**

```sql
-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255),
    storage_used BIGINT DEFAULT 0,
    storage_limit BIGINT DEFAULT 107374182400, -- 100GB
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Photos table (main metadata)
CREATE TABLE photos (
    photo_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Storage
    s3_key VARCHAR(512) NOT NULL,
    s3_bucket VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,

    -- Metadata
    original_filename VARCHAR(512),
    mime_type VARCHAR(100),
    width INTEGER,
    height INTEGER,

    -- EXIF data (JSONB for flexibility)
    exif_data JSONB,

    -- Computed fields
    taken_at TIMESTAMP, -- from EXIF or upload time
    location GEOGRAPHY(POINT), -- PostGIS for geo queries

    -- ML/AI generated
    content_tags TEXT[], -- ['beach', 'sunset', 'ocean']
    detected_faces JSONB[], -- [{bbox, personId, confidence}]

    -- Flags
    is_favorite BOOLEAN DEFAULT FALSE,
    is_archived BOOLEAN DEFAULT FALSE,
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,

    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Indexes
    CONSTRAINT valid_dimensions CHECK (width > 0 AND height > 0)
);

-- Indexes for common queries
CREATE INDEX idx_photos_user_created ON photos(user_id, created_at DESC)
    WHERE is_deleted = FALSE;
CREATE INDEX idx_photos_user_taken ON photos(user_id, taken_at DESC)
    WHERE is_deleted = FALSE;
CREATE INDEX idx_photos_location ON photos USING GIST(location)
    WHERE location IS NOT NULL;
CREATE INDEX idx_photos_tags ON photos USING GIN(content_tags);
CREATE INDEX idx_photos_exif ON photos USING GIN(exif_data);

-- Thumbnails (pre-computed)
CREATE TABLE photo_thumbnails (
    thumbnail_id SERIAL PRIMARY KEY,
    photo_id UUID NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,
    size_variant VARCHAR(50) NOT NULL, -- 'small', 'medium', 'large'
    width INTEGER NOT NULL,
    height INTEGER NOT NULL,
    s3_key VARCHAR(512) NOT NULL,
    file_size BIGINT,
    format VARCHAR(20), -- 'webp', 'avif', 'jpg'
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(photo_id, size_variant, format)
);

CREATE INDEX idx_thumbnails_photo ON photo_thumbnails(photo_id);

-- Albums
CREATE TABLE albums (
    album_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    cover_photo_id UUID REFERENCES photos(photo_id) ON DELETE SET NULL,
    is_shared BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_albums_user ON albums(user_id, created_at DESC);

-- Album Photos (many-to-many)
CREATE TABLE album_photos (
    album_id UUID NOT NULL REFERENCES albums(album_id) ON DELETE CASCADE,
    photo_id UUID NOT NULL REFERENCES photos(photo_id) ON DELETE CASCADE,
    added_at TIMESTAMP DEFAULT NOW(),
    position INTEGER, -- for manual ordering

    PRIMARY KEY (album_id, photo_id)
);

CREATE INDEX idx_album_photos_album ON album_photos(album_id, position);
CREATE INDEX idx_album_photos_photo ON album_photos(photo_id);

-- People/Faces
CREATE TABLE people (
    person_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    name VARCHAR(255),
    cover_photo_id UUID REFERENCES photos(photo_id),
    face_embedding VECTOR(512), -- pgvector extension for similarity search
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(user_id, name)
);

CREATE INDEX idx_people_user ON people(user_id);

-- Shares
CREATE TABLE shares (
    share_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    resource_type VARCHAR(50) NOT NULL, -- 'photo', 'album'
    resource_id UUID NOT NULL,
    share_token VARCHAR(255) UNIQUE NOT NULL,

    -- Permissions
    can_view BOOLEAN DEFAULT TRUE,
    can_download BOOLEAN DEFAULT FALSE,
    can_add_photos BOOLEAN DEFAULT FALSE,

    -- Access control
    is_public BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255), -- optional password protection
    expires_at TIMESTAMP,

    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT valid_resource_type CHECK (resource_type IN ('photo', 'album'))
);

CREATE INDEX idx_shares_owner ON shares(owner_id);
CREATE INDEX idx_shares_token ON shares(share_token) WHERE expires_at > NOW();

-- Share Recipients (for private shares)
CREATE TABLE share_recipients (
    share_id UUID NOT NULL REFERENCES shares(share_id) ON DELETE CASCADE,
    recipient_email VARCHAR(255) NOT NULL,
    has_accessed BOOLEAN DEFAULT FALSE,
    accessed_at TIMESTAMP,

    PRIMARY KEY (share_id, recipient_email)
);
```

### 6.2 NoSQL for Specific Use Cases

**Elasticsearch (Search & ML Features)**

```json
// photos_index mapping
{
  "mappings": {
    "properties": {
      "photo_id": { "type": "keyword" },
      "user_id": { "type": "keyword" },
      "taken_at": { "type": "date" },
      "location": { "type": "geo_point" },

      // Text search
      "content_tags": {
        "type": "text",
        "fields": {
          "keyword": { "type": "keyword" }
        }
      },
      "ocr_text": { "type": "text" },
      "exif_data": {
        "properties": {
          "camera_model": { "type": "keyword" },
          "lens": { "type": "keyword" },
          "iso": { "type": "integer" }
        }
      },

      // Vector search for similarity
      "image_embedding": {
        "type": "dense_vector",
        "dims": 512,
        "index": true,
        "similarity": "cosine"
      },

      // Aggregations
      "date_bucket": { "type": "keyword" }, // "2024-01"
      "location_city": { "type": "keyword" }
    }
  }
}
```

**When to Use Elasticsearch:**
- Full-text search across tags, OCR text
- Vector similarity search (find similar photos)
- Geo-spatial queries (photos near location)
- Aggregations (photos by month, location, camera)

**DynamoDB Alternative (Trade-off):**

**Pros:**
- Infinite scale, fully managed
- Single-digit millisecond latency
- Good for key-value access patterns

**Cons:**
- Expensive for scan operations
- Complex query patterns need careful design
- No JOIN support
- Harder to model relationships (albums, shares)

**Verdict:** PostgreSQL + Elasticsearch is better for photo grid due to:
- Complex relational data (users, photos, albums, shares)
- Need for ACID transactions
- Rich querying capabilities

### 6.3 Data Partitioning Strategy

**Sharding PostgreSQL:**

```
Shard Key: user_id (hash-based)

Why user_id:
- Most queries filtered by user_id
- Avoids cross-shard JOINs
- Even distribution (assuming balanced user base)
- User data co-located (photos, albums, shares)

Shards: 64 logical shards initially
- Shard 0-15: DB cluster A
- Shard 16-31: DB cluster B
- Shard 32-47: DB cluster C
- Shard 48-63: DB cluster D

Routing:
hash(user_id) % 64 → shard_id
```

**Global Tables (No sharding):**
- Users table (replicated across all shards)
- System configuration

---

## 7. Caching Strategy (Multi-Layer)

### 7.1 Caching Layers

```
┌─────────────────────────────────────────────────────────┐
│                    Browser Cache                        │
│  - Thumbnails (7 days)                                  │
│  - Full images (1 day)                                  │
│  - Cache-Control: public, max-age=604800               │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    CDN Cache (CloudFront)               │
│  - Thumbnails (30 days)                                 │
│  - Original images (7 days)                             │
│  - 95%+ cache hit rate for images                       │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                 Redis Cache (Metadata)                  │
│  Layer 1: Hot data (1 hour TTL)                         │
│    - User's recent photos list                          │
│    - Album metadata                                     │
│  Layer 2: Warm data (24 hour TTL)                       │
│    - User preferences                                   │
│    - Share settings                                     │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Application Memory Cache                   │
│  - User session data                                    │
│  - Frequently accessed metadata (LRU, 100MB limit)      │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Redis Caching Patterns

**1. Photo List Cache:**
```
Key: photos:user:{userId}:list:{cursor}:{limit}:{filters}
Value: JSON array of photo metadata
TTL: 1 hour

Example:
photos:user:123:list:null:50:recent
→ [{photoId, url, thumbnail, metadata}, ...]
```

**2. Photo Metadata Cache:**
```
Key: photo:{photoId}
Value: JSON of complete photo metadata
TTL: 24 hours

Invalidation: On photo update/delete
```

**3. Album Cache:**
```
Key: album:{albumId}:photos:{cursor}
Value: Photo IDs list
TTL: 1 hour
```

**4. Search Results Cache:**
```
Key: search:{hash(query)}:{cursor}
Value: Photo IDs + scores
TTL: 15 minutes (shorter due to freshness)
```

**5. User Storage Quota:**
```
Key: user:{userId}:storage
Value: Integer (bytes used)
TTL: 5 minutes

Updated on: Upload complete, photo delete
```

### 7.3 Cache Invalidation

**Write-Through Pattern:**
```javascript
async function updatePhoto(photoId, updates) {
  // 1. Update database
  await db.photos.update(photoId, updates);

  // 2. Invalidate caches
  await Promise.all([
    redis.del(`photo:${photoId}`),
    redis.del(`photos:user:${userId}:list:*`), // Pattern delete
    redis.del(`album:*:photos:*`) // If photo in albums
  ]);

  // 3. Optionally warm cache
  const fresh = await db.photos.get(photoId);
  await redis.set(`photo:${photoId}`, JSON.stringify(fresh), 'EX', 86400);
}
```

**Cache Stampede Prevention:**
```javascript
async function getPhotoWithCache(photoId) {
  // Try cache
  let photo = await redis.get(`photo:${photoId}`);
  if (photo) return JSON.parse(photo);

  // Acquire lock to prevent stampede
  const lock = await redis.set(
    `lock:photo:${photoId}`,
    '1',
    'NX',
    'EX',
    10
  );

  if (lock) {
    // First request: fetch and cache
    photo = await db.photos.get(photoId);
    await redis.set(
      `photo:${photoId}`,
      JSON.stringify(photo),
      'EX',
      86400
    );
    await redis.del(`lock:photo:${photoId}`);
    return photo;
  } else {
    // Wait for first request to finish
    await sleep(100);
    return getPhotoWithCache(photoId); // Retry
  }
}
```

### 7.4 CDN Configuration

**CloudFront Cache Behaviors:**
```
/thumbnails/*
  - TTL: 2592000s (30 days)
  - Compress: Yes (Gzip, Brotli)
  - Cache-Control: public, immutable
  - Query strings: Include (for variations)

/photos/original/*
  - TTL: 604800s (7 days)
  - Compress: No (already compressed)
  - Cache-Control: public, max-age=604800

/api/*
  - TTL: 0 (no cache)
  - Forward all headers
  - Forward cookies
```

**Cache Key Strategy:**
```
Thumbnail URL:
https://cdn.example.com/thumbnails/{userId}/{photoId}_400x300.webp?v={version}

- userId: For distribution across edge locations
- photoId: Unique identifier
- Dimensions: Allows multiple sizes
- Format: WebP/AVIF for modern browsers
- Version: Cache busting on updates
```

---

## 8. State Management (Frontend)

### 8.1 State Architecture

```
┌────────────────────────────────────────────────────────┐
│                  Global State (Redux/Zustand)          │
├────────────────────────────────────────────────────────┤
│  - Auth state (user, token)                            │
│  - Photo collection state                              │
│  - Upload queue state                                  │
│  - UI state (selected photos, view mode)               │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              Server State (React Query/SWR)            │
├────────────────────────────────────────────────────────┤
│  - Photo data (cached, auto-refetch)                   │
│  - Album data                                          │
│  - Search results                                      │
│  - User preferences                                    │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              Local State (useState/useReducer)         │
├────────────────────────────────────────────────────────┤
│  - Component-specific UI (modals, dropdowns)           │
│  - Form inputs                                         │
│  - Temporary selections                                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              URL State (React Router)                  │
├────────────────────────────────────────────────────────┤
│  - Current route (grid/album/search)                   │
│  - Query params (filters, sort, cursor)                │
│  - Share-able links                                    │
└────────────────────────────────────────────────────────┘
```

### 8.2 State Management Implementation

**React Query for Server State:**
```javascript
// Infinite query for photo grid
const {
  data,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage
} = useInfiniteQuery({
  queryKey: ['photos', filters],
  queryFn: ({ pageParam = null }) =>
    api.getPhotos({ cursor: pageParam, ...filters }),
  getNextPageParam: (lastPage) => lastPage.cursor,
  staleTime: 60000, // 1 minute
  cacheTime: 300000, // 5 minutes
});

// Optimistic updates for favorites
const toggleFavorite = useMutation({
  mutationFn: (photoId) => api.toggleFavorite(photoId),
  onMutate: async (photoId) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries(['photos']);

    // Snapshot previous value
    const previous = queryClient.getQueryData(['photos']);

    // Optimistically update
    queryClient.setQueryData(['photos'], (old) => ({
      ...old,
      pages: old.pages.map(page => ({
        ...page,
        photos: page.photos.map(p =>
          p.id === photoId
            ? { ...p, isFavorite: !p.isFavorite }
            : p
        )
      }))
    }));

    return { previous };
  },
  onError: (err, vars, context) => {
    // Rollback on error
    queryClient.setQueryData(['photos'], context.previous);
  }
});
```

**Zustand for UI State:**
```javascript
const usePhotoStore = create((set) => ({
  selectedPhotos: new Set(),
  viewMode: 'grid', // 'grid' | 'list' | 'map'
  gridSize: 'medium', // 'small' | 'medium' | 'large'

  toggleSelection: (photoId) => set((state) => {
    const newSelected = new Set(state.selectedPhotos);
    if (newSelected.has(photoId)) {
      newSelected.delete(photoId);
    } else {
      newSelected.add(photoId);
    }
    return { selectedPhotos: newSelected };
  }),

  clearSelection: () => set({ selectedPhotos: new Set() }),

  setViewMode: (mode) => set({ viewMode: mode }),
}));
```

**Upload Queue State:**
```javascript
const useUploadStore = create((set, get) => ({
  uploads: [], // [{ id, file, progress, status, error }]

  addUpload: (file) => set((state) => ({
    uploads: [
      ...state.uploads,
      {
        id: generateId(),
        file,
        progress: 0,
        status: 'queued', // 'queued' | 'uploading' | 'complete' | 'error'
        error: null
      }
    ]
  })),

  updateProgress: (id, progress) => set((state) => ({
    uploads: state.uploads.map(u =>
      u.id === id ? { ...u, progress } : u
    )
  })),

  setStatus: (id, status, error = null) => set((state) => ({
    uploads: state.uploads.map(u =>
      u.id === id ? { ...u, status, error } : u
    )
  })),

  removeUpload: (id) => set((state) => ({
    uploads: state.uploads.filter(u => u.id !== id)
  }))
}));
```

### 8.3 State Persistence

**LocalStorage for Preferences:**
```javascript
const usePreferences = create(
  persist(
    (set) => ({
      gridSize: 'medium',
      theme: 'light',
      autoUpload: false,

      setGridSize: (size) => set({ gridSize: size }),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'photo-grid-preferences',
      storage: createJSONStorage(() => localStorage)
    }
  )
);
```

**IndexedDB for Offline Support:**
```javascript
// Store photo metadata for offline viewing
const db = new Dexie('PhotoGridDB');
db.version(1).stores({
  photos: 'id, userId, takenAt',
  thumbnails: 'photoId', // Blob storage
  albums: 'id, userId'
});

// Sync on online
window.addEventListener('online', async () => {
  const pending = await db.photos.where({ syncStatus: 'pending' }).toArray();
  await syncWithServer(pending);
});
```

---

## 9. Performance Optimization

### 9.1 Virtual Grid Implementation

**Challenge: Render 10K+ photos without performance degradation**

**Solution: Virtual Scrolling + Dynamic Height**

```javascript
import { Virtuoso } from 'react-virtuoso';

const VirtualPhotoGrid = ({ photos }) => {
  const columns = useGridColumns(); // Responsive: 2-6 columns

  // Group photos into rows
  const rows = useMemo(() =>
    chunk(photos, columns),
    [photos, columns]
  );

  return (
    <Virtuoso
      data={rows}
      overscan={200} // Render 200px above/below viewport
      itemContent={(index, row) => (
        <PhotoRow photos={row} />
      )}
      endReached={loadMore}
      components={{
        Footer: () => isFetchingMore ? <Spinner /> : null
      }}
    />
  );
};
```

**Masonry Layout (Pinterest-style):**
```javascript
import Masonry from 'react-masonry-css';

const MasonryGrid = ({ photos }) => {
  const breakpoints = {
    default: 6,
    1400: 5,
    1100: 4,
    800: 3,
    500: 2
  };

  return (
    <Masonry
      breakpointCols={breakpoints}
      className="photo-masonry-grid"
      columnClassName="photo-masonry-column"
    >
      {photos.map(photo => (
        <PhotoTile
          key={photo.id}
          photo={photo}
          lazy
        />
      ))}
    </Masonry>
  );
};
```

**Trade-off: Fixed Grid vs Masonry**

| Aspect | Fixed Grid | Masonry |
|--------|-----------|---------|
| Performance | Better (predictable heights) | Slower (dynamic layout) |
| Aesthetics | Less engaging | More visually appealing |
| Virtual scrolling | Easy | Complex (varying heights) |
| Use case | Mobile, large collections | Desktop, curated albums |

**Recommendation:** Fixed grid for main library, Masonry for albums

### 9.2 Image Optimization

**Multi-Format Support:**
```html
<picture>
  <source
    srcSet="/thumbnails/photo123_400.avif"
    type="image/avif"
  />
  <source
    srcSet="/thumbnails/photo123_400.webp"
    type="image/webp"
  />
  <img
    src="/thumbnails/photo123_400.jpg"
    loading="lazy"
    decoding="async"
    alt="Photo description"
  />
</picture>
```

**Format Comparison:**

| Format | Size (vs JPEG) | Support | Use Case |
|--------|---------------|---------|----------|
| AVIF | -50% | Chrome 85+, Firefox 93+ | Modern browsers |
| WebP | -30% | All modern browsers | Fallback from AVIF |
| JPEG | Baseline | Universal | Legacy support |

**Responsive Images:**
```javascript
// Generate srcSet for different screen densities
const srcSet = [
  { width: 400, density: 1 },
  { width: 800, density: 2 },
  { width: 1200, density: 3 }
].map(({ width, density }) =>
  `/thumbnails/${photoId}_${width}.webp ${density}x`
).join(', ');

<img
  src={`/thumbnails/${photoId}_400.webp`}
  srcSet={srcSet}
  sizes="(max-width: 768px) 50vw, 25vw"
/>
```

**Thumbnail Generation Pipeline:**
```
Original Upload (5MB JPEG)
        │
        ▼
┌───────────────────┐
│ Image Processor   │
│ (Sharp/ImageMagick│
└────────┬──────────┘
         │
         ├─► Thumbnail 150x150 (WebP, AVIF, JPEG) → 5KB
         ├─► Thumbnail 400x400 (WebP, AVIF, JPEG) → 20KB
         ├─► Thumbnail 800x800 (WebP, AVIF, JPEG) → 60KB
         ├─► Full HD 1920x1080 (WebP, JPEG) → 200KB
         └─► Original (preserved) → 5MB

Quality settings:
- WebP: quality 80
- AVIF: quality 75 (equivalent to JPEG 85)
- JPEG: quality 85
```

**Blur Hash for Progressive Loading:**
```javascript
// Generate blur hash on upload
import { encode } from 'blurhash';

const blurhash = encode(imagePixels, width, height, 4, 3);
// Store in DB: "L6PZfSi_.AyE_3t7t7R**0o#DgR4"

// Decode on client for placeholder
import { decode } from 'blurhash';

const pixels = decode(blurhash, 32, 32);
// Display as CSS background while loading
```

### 9.3 Lazy Loading Strategy

**Intersection Observer:**
```javascript
const LazyImage = ({ src, placeholder }) => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setImageSrc(src);
          observer.unobserve(entry.target);
        }
      },
      {
        rootMargin: '100px' // Start loading 100px before visible
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [src]);

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      onLoad={() => setIsLoaded(true)}
      className={isLoaded ? 'loaded' : 'loading'}
    />
  );
};
```

**Prefetching Next Page:**
```javascript
const usePhotosWithPrefetch = (filters) => {
  const query = useInfiniteQuery({
    queryKey: ['photos', filters],
    queryFn: fetchPhotos,
    // ...
  });

  // Prefetch next page when 80% scrolled
  const handleScroll = useCallback(() => {
    const scrollPct = window.scrollY / document.body.scrollHeight;

    if (scrollPct > 0.8 && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
  }, [query]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return query;
};
```

### 9.4 Network Optimization

**HTTP/2 Multiplexing:**
- Load 6+ thumbnails in parallel over single connection
- Server push for critical resources
- Header compression (HPACK)

**Resource Hints:**
```html
<!-- DNS prefetch for CDN -->
<link rel="dns-prefetch" href="https://cdn.photos.com">

<!-- Preconnect to API -->
<link rel="preconnect" href="https://api.photos.com">

<!-- Prefetch next page of photos -->
<link rel="prefetch" href="/api/photos?cursor=abc123">
```

**Service Worker Caching:**
```javascript
// Cache thumbnails aggressively
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.pathname.includes('/thumbnails/')) {
    event.respondWith(
      caches.open('thumbnails-v1').then((cache) =>
        cache.match(event.request).then((response) => {
          if (response) return response;

          return fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      )
    );
  }
});
```

### 9.5 Bundle Optimization

**Code Splitting:**
```javascript
// Lazy load heavy components
const PhotoEditor = lazy(() => import('./PhotoEditor'));
const MapView = lazy(() => import('./MapView'));
const AlbumCreator = lazy(() => import('./AlbumCreator'));

// Route-based splitting
const routes = [
  { path: '/', component: lazy(() => import('./PhotoGrid')) },
  { path: '/album/:id', component: lazy(() => import('./Album')) },
  { path: '/search', component: lazy(() => import('./Search')) }
];
```

**Tree Shaking:**
- Use ES modules for better tree shaking
- Import only needed functions: `import { debounce } from 'lodash-es'`
- Analyze bundle: `webpack-bundle-analyzer`

**Target Metrics:**
```
Initial bundle size: < 200KB gzipped
Time to Interactive (TTI): < 3s on 3G
Largest Contentful Paint (LCP): < 2.5s
Cumulative Layout Shift (CLS): < 0.1
First Input Delay (FID): < 100ms
```

---

## 10. Error Handling & Edge Cases

### 10.1 Upload Error Scenarios

| Error | Cause | Handling Strategy |
|-------|-------|------------------|
| Network timeout | Slow/unstable connection | Retry with exponential backoff, resume from last chunk |
| Storage quota exceeded | User limit reached | Show quota warning, offer upgrade |
| Invalid file type | User uploaded .exe | Client-side validation, clear error message |
| File too large | > 100MB file | Reject or compress, suggest alternatives |
| Duplicate photo | Same hash exists | Deduplicate, ask user if intentional |
| S3 upload failed | AWS service issue | Retry 3x, fallback to different region |
| Processing timeout | Large RAW file | Queue for async processing, notify when done |
| Corrupted file | Incomplete upload | Validate checksum, request re-upload |

**Retry Logic:**
```javascript
async function uploadWithRetry(chunk, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await uploadChunk(chunk);
      return result;
    } catch (error) {
      if (attempt === maxRetries) throw error;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      await sleep(delay);

      console.log(`Retry ${attempt}/${maxRetries} for chunk ${chunk.id}`);
    }
  }
}
```

### 10.2 Display Error Scenarios

| Error | Cause | Handling Strategy |
|-------|-------|------------------|
| Image 404 | Deleted/moved photo | Show placeholder, offer to remove from library |
| Thumbnail failed | Processing incomplete | Show original or blur hash placeholder |
| CDN timeout | Edge location issue | Fallback to origin, report to monitoring |
| Infinite scroll stuck | API failure | Show retry button, maintain scroll position |
| Search no results | No matches | Suggest alternative queries, show popular searches |
| Slow loading | Poor network | Show skeleton screens, progressive enhancement |

**Graceful Degradation:**
```javascript
const PhotoTile = ({ photo }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
    // Log to error tracking
    logger.error('Image load failed', { photoId: photo.id });
  };

  if (imageError) {
    return (
      <div className="photo-tile-error">
        <BrokenImageIcon />
        <p>Unable to load photo</p>
        <button onClick={() => setImageError(false)}>Retry</button>
      </div>
    );
  }

  return (
    <img
      src={photo.thumbnailUrl}
      onError={handleError}
      alt={photo.description}
    />
  );
};
```

### 10.3 Edge Cases

**Race Conditions:**
- **Concurrent uploads of same file**: Hash-based deduplication
- **Delete while uploading**: Cancel upload, clean up chunks
- **Share link expired mid-view**: Graceful expiration message

**Data Consistency:**
- **Photo deleted but in cache**: Implement cache invalidation, verify on critical operations
- **Album photo count mismatch**: Background reconciliation job
- **Search index out of sync**: Eventual consistency acceptable, manual reindex option

**Mobile-Specific:**
- **App backgrounded during upload**: Use background upload API (iOS/Android)
- **Storage full on device**: Clear thumbnail cache, warn user
- **Photo permissions denied**: Clear permission prompt, explain necessity

**Quota & Limits:**
```javascript
// Rate limiting
const UPLOAD_RATE_LIMIT = {
  maxUploads: 100,
  windowMs: 60 * 60 * 1000 // 1 hour
};

// Storage quota check
async function checkStorageQuota(userId, fileSize) {
  const user = await getUser(userId);

  if (user.storageUsed + fileSize > user.storageLimit) {
    throw new QuotaExceededError({
      used: user.storageUsed,
      limit: user.storageLimit,
      required: fileSize
    });
  }
}
```

**Browser Compatibility:**
- **AVIF not supported**: Fallback to WebP → JPEG
- **Intersection Observer not available**: Use scroll event listener
- **Service Worker not supported**: Graceful degradation, no offline support

---

## 11. Interview Cross-Questions & Answers

### 11.1 Architecture & Design

**Q1: Why REST instead of GraphQL for this system?**

**A:** REST is better suited for photo grid because:
1. **Caching**: REST GET requests are cacheable at CDN/browser level natively
2. **Simplicity**: Photo metadata schema is fixed, no over-fetching problem
3. **HTTP features**: Leverage range requests, conditional GET, compression
4. **Image delivery**: Images are delivered via URLs, not API responses
5. **Performance**: CDN caching gives 95%+ hit rate for photo viewing

GraphQL would add complexity without significant benefits. It's better for:
- Complex, nested data relationships
- Clients with varying data needs (mobile vs web)
- Reducing API calls by fetching multiple resources

**Q2: Why not use WebSockets for real-time photo updates?**

**A:** Photos don't require real-time synchronization because:
1. **User behavior**: Users upload/view their own photos, rare collaboration
2. **Latency tolerance**: 1-5 minute delay for new photos is acceptable
3. **Resource cost**: Maintaining millions of WebSocket connections is expensive
4. **REST suffices**: Pull-based model with periodic refresh works fine

**When WebSockets make sense:**
- Shared album with active collaboration (Google Photos shared albums)
- Live photo upload notifications (optional enhancement)
- Real-time comments on photos

**Trade-off:** Implement WebSocket selectively for shared albums only, not main grid.

**Q3: How would you handle 1 million concurrent users viewing photos?**

**A:**
1. **CDN offloads 95%+ of image traffic**: CloudFront has infinite scale
2. **Read replicas for database**: 100:1 read/write ratio, use 10+ read replicas
3. **Redis cluster for metadata caching**: Reduces DB load by 80%+
4. **Stateless API servers**: Scale horizontally with load balancers (1000+ instances)
5. **Elasticsearch cluster**: Distributed search across 50+ nodes
6. **Database sharding**: 64 shards by user_id for even distribution

**Bottleneck analysis:**
- Images: CDN handles (no bottleneck)
- Metadata API: Redis + read replicas scale to 100K req/s per cluster
- Search: Elasticsearch scales horizontally
- Database writes: Sharding + async processing handles 10K uploads/s

**Q4: SQL vs NoSQL - justify your choice for photo metadata.**

**A:** **PostgreSQL (SQL) is better** because:

**Pros:**
1. **ACID guarantees**: Critical for user data, permissions, sharing
2. **Complex queries**: JOINs for albums, shares, users
3. **Transactions**: Album creation + photo assignment atomically
4. **Data integrity**: Foreign keys, constraints prevent orphaned data
5. **Mature ecosystem**: Excellent tooling, monitoring, backup solutions
6. **JSON support**: JSONB for flexible EXIF data

**When NoSQL (e.g., DynamoDB) works:**
- Key-value access patterns only
- No complex relationships
- Infinite scale required (SQL can shard too)

**Hybrid approach (best):**
- PostgreSQL for metadata, albums, users
- Elasticsearch for search
- S3 for blobs
- Redis for caching

This leverages each database's strengths.

### 11.2 Performance & Scalability

**Q5: How do you handle rendering 100K photos in the browser?**

**A:**
1. **Virtual scrolling**: Render only visible rows + buffer (200 photos max in DOM)
2. **Pagination**: Load 50-100 photos at a time (infinite scroll)
3. **Lazy loading**: Load images only when in viewport (Intersection Observer)
4. **Thumbnail optimization**:
   - Small thumbnails (5-20KB each)
   - WebP/AVIF formats (-50% size)
   - Aggressive CDN caching
5. **Debounced scroll**: Avoid excessive render calls
6. **React.memo**: Prevent unnecessary re-renders of photo tiles

**Memory management:**
- Virtual scrolling keeps DOM size constant (~200 elements)
- Browser native lazy loading unloads off-screen images
- Service worker caches thumbnails (100MB limit)

**Result:** Can scroll through 100K photos smoothly at 60fps.

**Q6: What if S3 or CDN goes down?**

**A:** Multi-layer redundancy:

1. **S3 failover**:
   - Cross-region replication (us-east-1 → us-west-2)
   - Automatic failover to replica region
   - 99.99% availability SLA

2. **CDN failover**:
   - Multi-CDN strategy (CloudFront + Cloudflare)
   - DNS-based failover (Route53 health checks)
   - Origin failover to different S3 region

3. **Graceful degradation**:
   - Show cached thumbnails from browser/service worker
   - Display error state for unavailable photos
   - Queue uploads for retry when service recovers

4. **Monitoring & alerts**:
   - Real-time error rate monitoring
   - Auto-scaling of backup systems
   - PagerDuty alerts for engineering team

**Q7: How do you optimize the initial page load time?**

**A:**
1. **Critical CSS inline**: Above-the-fold styles in HTML (<style>)
2. **Code splitting**: Lazy load non-critical routes and components
3. **Preload key resources**: `<link rel="preload">` for fonts, critical images
4. **Server-side rendering (SSR)**: First page of photos rendered on server
5. **Service worker**: Cache shell for instant subsequent loads
6. **HTTP/2 server push**: Push critical assets before requested
7. **Bundle optimization**: Tree shaking, minification, compression (Brotli)
8. **Image optimization**: Blur hash placeholders, progressive JPEGs

**Metrics:**
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Bundle size: < 200KB gzipped

**Q8: Explain your caching strategy in detail.**

**A:** 4-layer caching:

**Layer 1: Browser Cache**
- Thumbnails: 7 days (Cache-Control: public, max-age=604800)
- CSS/JS: Versioned URLs, cache forever (immutable)

**Layer 2: CDN (CloudFront)**
- Images: 30 days at edge locations
- 95%+ hit rate (reduces origin requests by 20x)
- Regional edge caches for popular content

**Layer 3: Redis (Metadata)**
- Hot data: Photo lists, album metadata (1 hour TTL)
- Warm data: User preferences (24 hour TTL)
- Pattern-based invalidation on updates

**Layer 4: Application Memory**
- User sessions (in-memory LRU cache)
- Frequently accessed config (100MB limit)

**Cache invalidation:**
- Write-through on updates
- Pattern-based deletion for related data
- Stampede prevention with locking

**Trade-off:**
- Aggressive caching = stale data risk
- Mitigation: Short TTLs for mutable data (1 hour), long TTLs for immutable (images)

### 11.3 Advanced Features

**Q9: How would you implement face detection and grouping?**

**A:**

**Pipeline:**
```
Photo Upload
    │
    ▼
┌─────────────────┐
│ Face Detection  │ (ML Model: MTCNN or RetinaFace)
│ - Detect faces  │
│ - Extract bbox  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Face Embeddings │ (FaceNet or ArcFace)
│ - Generate 512  │
│   dim vectors   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Face Clustering │ (DBSCAN or HDBSCAN)
│ - Group similar │
│   faces         │
│ - Create person │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Store in DB     │
│ - person_id     │
│ - embeddings    │
│ - confidence    │
└─────────────────┘
```

**Database schema:**
```sql
CREATE TABLE detected_faces (
    face_id UUID PRIMARY KEY,
    photo_id UUID REFERENCES photos(photo_id),
    person_id UUID REFERENCES people(person_id),

    -- Bounding box
    bbox_x INTEGER,
    bbox_y INTEGER,
    bbox_width INTEGER,
    bbox_height INTEGER,

    -- Face embedding (512 dimensions)
    embedding VECTOR(512),

    -- Confidence score
    confidence FLOAT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_faces_photo ON detected_faces(photo_id);
CREATE INDEX idx_faces_person ON detected_faces(person_id);

-- Vector similarity search (pgvector)
CREATE INDEX idx_faces_embedding ON detected_faces
    USING ivfflat (embedding vector_cosine_ops);
```

**Grouping algorithm:**
```python
# DBSCAN clustering for face grouping
from sklearn.cluster import DBSCAN

# Get all face embeddings
embeddings = get_all_embeddings(user_id)

# Cluster with cosine distance
clustering = DBSCAN(
    eps=0.4,  # Distance threshold
    min_samples=2,  # Min faces to form a group
    metric='cosine'
).fit(embeddings)

# Create person groups
for cluster_id in set(clustering.labels_):
    if cluster_id == -1:
        continue  # Skip noise

    face_ids = [face_id for i, face_id in enumerate(face_ids)
                if clustering.labels_[i] == cluster_id]

    create_person_group(user_id, face_ids)
```

**Search by face:**
```sql
-- Find all photos of a person
SELECT p.*
FROM photos p
JOIN detected_faces f ON p.photo_id = f.photo_id
WHERE f.person_id = 'person_123'
ORDER BY p.taken_at DESC;

-- Find similar faces (vector similarity)
SELECT p.*, 1 - (f.embedding <=> :query_embedding) AS similarity
FROM photos p
JOIN detected_faces f ON p.photo_id = f.photo_id
WHERE 1 - (f.embedding <=> :query_embedding) > 0.7
ORDER BY similarity DESC
LIMIT 50;
```

**Q10: How would you implement content-based image search ("find beach photos")?**

**A:**

**ML Pipeline:**
```
Photo Upload
    │
    ▼
┌──────────────────┐
│ Image Embedding  │ (CLIP or ResNet50)
│ - Generate 512   │
│   dim vector     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Object Detection │ (YOLO or Faster R-CNN)
│ - Detect objects │
│ - Tags: "beach", │
│   "ocean", "sky" │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Scene Recognition│ (Places365)
│ - Classify scene │
│ - "outdoor",     │
│   "natural"      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Store in ES      │
│ - Text tags      │
│ - Image vector   │
│ - Scene labels   │
└──────────────────┘
```

**Elasticsearch index:**
```json
{
  "mappings": {
    "properties": {
      "photo_id": { "type": "keyword" },
      "user_id": { "type": "keyword" },

      // Text search
      "content_tags": { "type": "text" },
      "scene_labels": { "type": "text" },
      "color_palette": { "type": "keyword" },

      // Vector search
      "image_embedding": {
        "type": "dense_vector",
        "dims": 512,
        "index": true,
        "similarity": "cosine"
      },

      // Filters
      "taken_at": { "type": "date" },
      "location": { "type": "geo_point" }
    }
  }
}
```

**Search query:**
```javascript
// Text search: "beach sunset"
const textSearch = {
  multi_match: {
    query: "beach sunset",
    fields: ["content_tags^2", "scene_labels"]
  }
};

// Vector search: Find visually similar
const vectorSearch = {
  script_score: {
    query: { match_all: {} },
    script: {
      source: "cosineSimilarity(params.queryVector, 'image_embedding') + 1.0",
      params: { queryVector: queryEmbedding }
    }
  }
};

// Hybrid search (combine both)
const hybridSearch = {
  bool: {
    should: [
      { ...textSearch, boost: 2 },
      { ...vectorSearch, boost: 1 }
    ]
  }
};
```

**Search flow:**
1. User types "beach sunset"
2. Generate text embedding for "beach sunset" (CLIP text encoder)
3. Search Elasticsearch:
   - Text match on tags/labels
   - Vector similarity on image embeddings
4. Combine scores (text: 60%, visual: 40%)
5. Return ranked results

**Q11: How do you handle photo deduplication?**

**A:**

**Deduplication strategy:**

1. **Hash-based (exact duplicates):**
```javascript
// Compute perceptual hash on upload
import { hash } from 'phash';

const imageHash = await hash(photoBuffer);

// Check for duplicates
const existing = await db.photos.findOne({
    user_id: userId,
    perceptual_hash: imageHash
});

if (existing) {
    return { status: 'duplicate', existingPhotoId: existing.photo_id };
}
```

2. **Similarity-based (near duplicates):**
```sql
-- Find similar photos using image embeddings
SELECT photo_id, 1 - (embedding <=> :new_embedding) AS similarity
FROM photos
WHERE user_id = :user_id
  AND 1 - (embedding <=> :new_embedding) > 0.95
LIMIT 1;
```

3. **User decision:**
```javascript
// If duplicate found, ask user
if (isDuplicate) {
    return {
        status: 'duplicate',
        message: 'This photo already exists',
        existingPhoto: { id, thumbnailUrl, uploadedAt },
        options: [
            'Skip upload',
            'Keep both',
            'Replace existing'
        ]
    };
}
```

**Storage savings:**
- Dedupe identical photos: Save 100% storage for duplicate
- Share same S3 object: Reference counting
- Only store metadata separately

**Q12: Design the sharing feature with different permission levels.**

**A:**

**Permission model:**
```sql
CREATE TABLE shares (
    share_id UUID PRIMARY KEY,
    owner_id UUID REFERENCES users(user_id),
    resource_type VARCHAR(50), -- 'photo' | 'album'
    resource_id UUID,

    -- Access control
    share_token VARCHAR(255) UNIQUE,
    is_public BOOLEAN DEFAULT FALSE,
    password_hash VARCHAR(255),
    expires_at TIMESTAMP,

    -- Permissions (bitflags for efficiency)
    permissions INTEGER, -- 1=view, 2=download, 4=comment, 8=add_photos

    created_at TIMESTAMP DEFAULT NOW()
);

-- Share recipients (for private shares)
CREATE TABLE share_recipients (
    share_id UUID REFERENCES shares(share_id),
    recipient_email VARCHAR(255),
    permission_override INTEGER, -- Override default permissions

    PRIMARY KEY (share_id, recipient_email)
);
```

**Permission levels:**
```javascript
const PERMISSIONS = {
    VIEW: 1 << 0,        // 1
    DOWNLOAD: 1 << 1,    // 2
    COMMENT: 1 << 2,     // 4
    ADD_PHOTOS: 1 << 3,  // 8
    EDIT: 1 << 4,        // 16
    DELETE: 1 << 5       // 32
};

// Check permission
function hasPermission(userPerms, requiredPerm) {
    return (userPerms & requiredPerm) === requiredPerm;
}

// Example: User can view and comment
const userPerms = PERMISSIONS.VIEW | PERMISSIONS.COMMENT;
hasPermission(userPerms, PERMISSIONS.VIEW); // true
hasPermission(userPerms, PERMISSIONS.DELETE); // false
```

**Share types:**

1. **Public link** (anyone with link):
```javascript
{
    shareToken: "abc123",
    isPublic: true,
    permissions: VIEW | DOWNLOAD,
    expiresAt: "2024-12-31"
}
```

2. **Private share** (specific recipients):
```javascript
{
    shareToken: "xyz789",
    isPublic: false,
    recipients: [
        { email: "user@example.com", permissions: VIEW | COMMENT },
        { email: "admin@example.com", permissions: VIEW | EDIT }
    ]
}
```

3. **Password-protected**:
```javascript
{
    shareToken: "secure123",
    isPublic: true,
    passwordHash: "bcrypt_hash",
    permissions: VIEW
}
```

**Access flow:**
```
User visits: /share/abc123
    │
    ▼
Check share validity
    ├─ Expired? → 403
    ├─ Password required? → Prompt
    ├─ Private? → Check recipient
    └─ Valid → Grant access
            │
            ▼
        Apply permissions
            ├─ Can view? → Show photos
            ├─ Can download? → Enable download button
            └─ Can add? → Show upload UI
```

---

## 12. Summary & Key Takeaways

### 12.1 Critical Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| API Protocol | REST | Cacheable, simple, sufficient for non-real-time |
| Database | PostgreSQL | ACID, relationships, mature ecosystem |
| Search | Elasticsearch | Full-text, vector search, geo queries |
| Storage | S3 + CDN | Cost-effective, durable, scales infinitely |
| Caching | Multi-layer (Browser, CDN, Redis) | 95%+ hit rate, reduces DB load 10x |
| Frontend | Virtual scrolling + lazy loading | Handle 10K+ photos at 60fps |
| Image format | AVIF > WebP > JPEG | 50% smaller, faster loading |
| Upload | Resumable chunked | Reliable for large files on mobile |

### 12.2 Scalability Strategies

1. **Horizontal scaling**: Stateless API servers, sharded databases
2. **Caching everywhere**: Browser, CDN, Redis, application memory
3. **Async processing**: Thumbnail generation, ML pipelines via queues
4. **CDN offloading**: 95% of traffic served from edge
5. **Database sharding**: Hash-based on user_id for even distribution

### 12.3 Performance Optimizations

1. **Virtual scrolling**: Constant DOM size for 100K+ photos
2. **Image optimization**: WebP/AVIF, responsive sizes, blur hash
3. **Lazy loading**: Load images only when visible
4. **Prefetching**: Next page loaded at 80% scroll
5. **Code splitting**: Lazy load routes and heavy components

### 12.4 Trade-offs & Alternatives

**REST vs GraphQL:**
- REST chosen for simplicity, caching, standard HTTP features
- GraphQL better for complex nested queries, flexible clients

**SQL vs NoSQL:**
- PostgreSQL for metadata (ACID, relationships)
- NoSQL (DynamoDB) for key-value, infinite scale
- Hybrid approach leverages both strengths

**Fixed Grid vs Masonry:**
- Fixed grid for performance (predictable heights)
- Masonry for aesthetics (Pinterest-style)
- Use fixed for main library, masonry for albums

**Client-side vs Server-side rendering:**
- SSR for initial page load (SEO, performance)
- CSR for interactivity (SPA experience)
- Hybrid approach (Next.js) for best of both

### 12.5 Interview Tips

1. **Start with requirements**: Clarify functional and non-functional requirements
2. **Draw diagrams**: Visual representations help communicate clearly
3. **Discuss trade-offs**: Every decision has pros/cons, explain both
4. **Consider scale**: Design for 100M users, not 100
5. **Real-world examples**: Reference Google Photos, Flickr, Instagram
6. **Ask questions**: Clarify ambiguous requirements
7. **Iterate**: Start simple, add complexity incrementally
8. **Justify choices**: "Why REST?" "Why PostgreSQL?" have clear answers

---

**End of Document**

This HLD covers all aspects of designing a production-grade photo grid system like Google Photos, from architecture to implementation details, with a focus on trade-offs and interview readiness.
