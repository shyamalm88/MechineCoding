# High-Level Design: Instagram-like Social Photo Feed

## Table of Contents

1. [Problem Statement & Requirements](#1-problem-statement--requirements)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Component Architecture (Frontend)](#3-component-architecture-frontend)
4. [Data Flow](#4-data-flow)
5. [API Design & Communication Protocols](#5-api-design--communication-protocols)
6. [Database Design](#6-database-design)
7. [Caching Strategy](#7-caching-strategy)
8. [State Management (Frontend)](#8-state-management-frontend)
9. [Performance Optimization](#9-performance-optimization)
10. [Error Handling & Edge Cases](#10-error-handling--edge-cases)
11. [Interview Cross-Questions & Answers](#11-interview-cross-questions--answers)
12. [Summary & Key Takeaways](#12-summary--key-takeaways)
13. [Accessibility (A11y) Deep Dive](#13-accessibility-a11y-deep-dive)
14. [Security Implementation](#14-security-implementation)
15. [Mobile & Touch Interactions](#15-mobile--touch-interactions)
16. [Testing Strategy](#16-testing-strategy)
17. [Offline/PWA Capabilities](#17-offlinepwa-capabilities)
18. [Internationalization (i18n)](#18-internationalization-i18n)
19. [Analytics & Monitoring](#19-analytics--monitoring)
20. [Reels/Short Video Deep Dive](#20-reelsshort-video-deep-dive)
21. [Direct Messaging Deep Dive](#21-direct-messaging-deep-dive)
22. [Design System & Theming](#22-design-system--theming)

---

## 1. Problem Statement & Requirements

### 1.1 Functional Requirements

**Core Features:**
- User registration, authentication, profile management
- Follow/unfollow users (social graph)
- Create posts (photos, carousels, videos)
- Home feed with personalized content ranking
- Stories (24-hour expiring content)
- Reels (short-form vertical videos)
- Engage with content (like, comment, save, share)
- Explore page (content discovery)
- Direct messaging (DMs)
- Notifications (real-time)
- Search (users, hashtags, locations)
- User profiles with post grid

**Non-Functional Requirements:**
- Low latency: < 200ms for feed load
- High availability: 99.99% uptime
- Handle 2B+ monthly active users
- Real-time notifications: < 1s delivery
- Support 500M+ daily Stories
- Feed personalization at scale
- Content moderation (AI + human)
- GDPR/privacy compliance

### 1.2 Scale Estimates

```
Users: 2B monthly active, 500M daily active
Posts per day: ~100M new posts
Stories per day: ~500M
Feed reads per second: ~10M peak
Likes per second: ~1M peak
Comments per second: ~100K peak
Media storage: ~50 PB (with CDN)
Following relationships: ~500B edges

Read:Write ratio: 1000:1 (extremely read-heavy)
Average feed size: 500-1000 posts to rank
Average following: 500 accounts
Average followers: varies (1 to 500M+)
```

### 1.3 Instagram vs Google Photos (Key Differences)

| Aspect | Instagram | Google Photos |
|--------|-----------|---------------|
| Purpose | Social sharing | Personal storage |
| Content | Curated, edited | Raw, unedited |
| Visibility | Public/followers | Private/shared |
| Feed | Algorithmic | Chronological |
| Engagement | Core feature | Not applicable |
| Stories | Yes (24hr) | No |
| Discovery | Explore, hashtags | Search only |

### 1.4 Out of Scope (for this design)
- Live streaming
- Shopping/e-commerce
- IGTV long-form video
- Creator monetization tools
- Business analytics
- Ads platform

---

## 2. High-Level Architecture

```
                                    ┌─────────────────────────────────┐
                                    │   CDN (CloudFront/Akamai)       │
                                    │   - Media delivery              │
                                    │   - Static assets               │
                                    │   - Edge caching                │
                                    └──────────────┬──────────────────┘
                                                   │
┌─────────────────┐                ┌──────────────▼──────────────────┐
│  Mobile Apps    │                │      Load Balancer (L7)         │
│  (iOS/Android)  │◄───────────────┤      - SSL Termination          │
│                 │                │      - Rate limiting            │
└─────────────────┘                │      - Geographic routing       │
                                   └──────────────┬──────────────────┘
┌─────────────────┐                               │
│  Web Client     │                ┌──────────────▼──────────────────┐
│  (React SPA)    │◄───────────────┤      API Gateway                │
│                 │                │      - Auth validation          │
└─────────────────┘                │      - Request routing          │
                                   │      - Rate limiting            │
                                   └──────────────┬──────────────────┘
                                                  │
        ┌──────────────┬──────────────┬──────────┼──────────┬──────────────┬──────────────┐
        │              │              │          │          │              │              │
        ▼              ▼              ▼          ▼          ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│    User      ││    Feed      ││    Post      ││   Story      ││  Engagement  ││   Search     │
│   Service    ││   Service    ││   Service    ││   Service    ││   Service    ││   Service    │
│              ││              ││              ││              ││              ││              │
│ - Auth       ││ - Ranking    ││ - Upload     ││ - Create     ││ - Likes      ││ - Users      │
│ - Profile    ││ - Timeline   ││ - Media      ││ - View       ││ - Comments   ││ - Hashtags   │
│ - Follow     ││ - Personalize││ - Caption    ││ - Expire     ││ - Saves      ││ - Locations  │
└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘└──────┬───────┘
       │               │               │               │               │               │
       │               │               │               │               │               │
       ▼               ▼               ▼               ▼               ▼               ▼
┌──────────────────────────────────────────────────────────────────────────────────────────────┐
│                                    Message Queue (Kafka)                                      │
│   - Feed fanout events    - Notification events    - Analytics events    - ML pipeline       │
└──────────────────────────────────────────────────────────────────────────────────────────────┘
       │               │               │               │               │               │
       ▼               ▼               ▼               ▼               ▼               ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│  PostgreSQL  ││    Redis     ││     S3       ││ Elasticsearch││   Cassandra  ││  ML/Ranking  │
│              ││   Cluster    ││              ││              ││              ││   Service    │
│ - Users      ││ - Sessions   ││ - Photos     ││ - Search     ││ - Feed store ││ - Feed rank  │
│ - Posts      ││ - Feed cache ││ - Videos     ││ - Hashtags   ││ - Timelines  ││ - Explore    │
│ - Follows    ││ - Counters   ││ - Stories    ││ - Users      ││ - Activities ││ - Recs       │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘

                        ┌──────────────────────────────────────┐
                        │   Real-time Infrastructure           │
                        │   - WebSocket servers                │
                        │   - Push notification service        │
                        │   - Presence service                 │
                        └──────────────────────────────────────┘
```

### 2.1 Architecture Rationale

**Microservices Approach:**
- **User Service**: Authentication, profiles, social graph (follow/unfollow)
- **Feed Service**: Timeline generation, ranking, personalization
- **Post Service**: Content upload, processing, storage
- **Story Service**: Ephemeral content, 24hr expiry, view tracking
- **Engagement Service**: Likes, comments, saves, shares
- **Search Service**: User/hashtag/location discovery

**Why This Architecture:**
1. **Independent scaling**: Feed service handles 10M req/s, Post service handles 1M uploads/day
2. **Fault isolation**: Story service failure doesn't affect feed
3. **Team autonomy**: Different teams own different services
4. **Technology flexibility**: Use best database for each use case

### 2.2 Feed Generation: Push vs Pull Model

**Instagram's Hybrid Approach:**

```
                    ┌─────────────────────────────────────────────┐
                    │           Hybrid Feed Model                 │
                    └─────────────────────────────────────────────┘
                                         │
                    ┌────────────────────┼────────────────────┐
                    │                    │                    │
                    ▼                    ▼                    ▼
            ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
            │  Push Model  │     │  Pull Model  │     │   Hybrid     │
            │  (Fanout)    │     │  (On-demand) │     │              │
            └──────────────┘     └──────────────┘     └──────────────┘
                    │                    │                    │
                    ▼                    ▼                    ▼
            Regular users         Celebrity posts      Combine both
            (< 10K followers)     (> 1M followers)     for optimal
            Posts pushed to       Pulled at read       performance
            all follower feeds    time (lazy)
```

**Why Hybrid:**
- **Pure Push (Fanout on Write)**: Good for regular users, but expensive for celebrities (1 post → 500M writes)
- **Pure Pull (Fanout on Read)**: Good for celebrities, but slow for users following many accounts
- **Hybrid**: Push for regular users, pull for celebrities at read time

**Implementation:**
```javascript
async function generateFeed(userId) {
  // 1. Get pre-computed feed from cache (pushed posts)
  const cachedFeed = await redis.get(`feed:${userId}`);

  // 2. Get celebrity posts (pull at read time)
  const celebrityFollowing = await getCelebrityFollowing(userId);
  const celebrityPosts = await getRecentPosts(celebrityFollowing, limit=50);

  // 3. Merge and rank
  const allPosts = [...cachedFeed, ...celebrityPosts];
  const rankedFeed = await rankingService.rank(allPosts, userId);

  return rankedFeed;
}
```

---

## 3. Component Architecture (Frontend)

### 3.1 Component Hierarchy

```
App
│
├── AuthProvider (Context)
│   └── User session, tokens, permissions
│
├── ThemeProvider (Context)
│   └── Dark/light mode, system preference
│
├── Router
│   │
│   ├── FeedView (/)
│   │   ├── StoriesBar
│   │   │   ├── StoryAvatar (multiple)
│   │   │   └── AddStoryButton
│   │   │
│   │   ├── FeedList (Virtualized)
│   │   │   ├── PostCard
│   │   │   │   ├── PostHeader (avatar, username, menu)
│   │   │   │   ├── PostMedia (image/carousel/video)
│   │   │   │   ├── PostActions (like, comment, share, save)
│   │   │   │   ├── LikeCount
│   │   │   │   ├── Caption
│   │   │   │   └── CommentPreview
│   │   │   └── SuggestedUsers (inline)
│   │   │
│   │   └── InfiniteScrollTrigger
│   │
│   ├── ExploreView (/explore)
│   │   ├── SearchBar
│   │   ├── CategoryTabs
│   │   └── MasonryGrid (posts)
│   │
│   ├── ReelsView (/reels)
│   │   ├── ReelPlayer (full-screen video)
│   │   ├── ReelActions (sidebar)
│   │   └── ReelInfo (caption, audio)
│   │
│   ├── ProfileView (/:username)
│   │   ├── ProfileHeader
│   │   │   ├── Avatar
│   │   │   ├── Stats (posts, followers, following)
│   │   │   ├── Bio
│   │   │   └── FollowButton
│   │   │
│   │   ├── ProfileTabs (posts, reels, tagged)
│   │   └── PostGrid (3-column)
│   │
│   ├── PostDetailView (/p/:postId)
│   │   ├── PostMedia
│   │   ├── PostInfo
│   │   └── CommentSection
│   │
│   ├── StoryViewer (modal)
│   │   ├── StoryMedia
│   │   ├── ProgressBar
│   │   ├── StoryActions
│   │   └── ReplyInput
│   │
│   ├── DirectMessages (/direct)
│   │   ├── ConversationList
│   │   ├── ChatView
│   │   └── MessageComposer
│   │
│   └── CreatePost (modal)
│       ├── MediaUpload
│       ├── FilterEditor
│       ├── CaptionEditor
│       └── LocationPicker
│
└── GlobalComponents
    ├── BottomNavigation (mobile)
    ├── Sidebar (desktop)
    ├── NotificationDropdown
    ├── SearchModal
    └── ErrorBoundary
```

### 3.2 Key Frontend Components

**PostCard Component:**
```typescript
interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onComment: (postId: string) => void;
  onShare: (postId: string) => void;
  onSave: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, ...actions }) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);

  const handleDoubleTapLike = useDoubleTap(() => {
    if (!isLiked) {
      setIsLiked(true);
      setLikeCount(prev => prev + 1);
      actions.onLike(post.id);
      // Show heart animation
      triggerLikeAnimation();
    }
  });

  return (
    <article className="post-card">
      <PostHeader user={post.user} timestamp={post.createdAt} />

      <div {...handleDoubleTapLike}>
        <PostMedia
          media={post.media}
          type={post.mediaType}
          aspectRatio={post.aspectRatio}
        />
      </div>

      <PostActions
        isLiked={isLiked}
        isSaved={post.isSavedByMe}
        onLike={() => handleLike()}
        onComment={() => actions.onComment(post.id)}
        onShare={() => actions.onShare(post.id)}
        onSave={() => actions.onSave(post.id)}
      />

      <LikeCount count={likeCount} />

      <Caption
        username={post.user.username}
        text={post.caption}
        hashtags={post.hashtags}
      />

      <CommentPreview
        comments={post.previewComments}
        totalCount={post.commentCount}
        postId={post.id}
      />

      <Timestamp date={post.createdAt} />
    </article>
  );
};
```

**Stories Bar Component:**
```typescript
const StoriesBar: React.FC = () => {
  const { data: stories, isLoading } = useQuery(['stories'], fetchStories);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Horizontal scroll with touch/mouse
  const { scrollLeft, scrollRight, canScrollLeft, canScrollRight } =
    useHorizontalScroll(scrollRef);

  return (
    <div className="stories-container">
      {canScrollLeft && (
        <button className="scroll-btn left" onClick={scrollLeft}>
          <ChevronLeft />
        </button>
      )}

      <div className="stories-scroll" ref={scrollRef}>
        <AddStoryButton />

        {stories?.map(story => (
          <StoryAvatar
            key={story.userId visibilityId}
            user={story.user}
            hasUnseenStory={story.hasUnseen}
            isLive={story.isLive}
            onClick={() => openStoryViewer(story.userId)}
          />
        ))}
      </div>

      {canScrollRight && (
        <button className="scroll-btn right" onClick={scrollRight}>
          <ChevronRight />
        </button>
      )}
    </div>
  );
};
```

**Feed List with Virtualization:**
```typescript
import { Virtuoso } from 'react-virtuoso';

const FeedList: React.FC = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor
  });

  const posts = useMemo(() =>
    data?.pages.flatMap(page => page.posts) ?? [],
    [data]
  );

  return (
    <Virtuoso
      data={posts}
      endReached={() => hasNextPage && fetchNextPage()}
      overscan={3}
      itemContent={(index, post) => (
        <>
          <PostCard post={post} />
          {/* Insert suggested users every 5 posts */}
          {(index + 1) % 5 === 0 && (
            <SuggestedUsersCard />
          )}
        </>
      )}
      components={{
        Footer: () => isFetchingNextPage ? <Spinner /> : null
      }}
    />
  );
};
```

---

## 4. Data Flow

### 4.1 Post Creation Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Select media (photo/video)
     │    Apply filters, crop
     │
     │ 2. Request upload URL
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │   Post Service     │
     │                          └────────┬───────────┘
     │                                   │
     │ 3. Return signed URL              │
     │◄──────────────────────────────────┤
     │                                   │
     │ 4. Upload media directly          │
     ├───────────────────────────────────┼──────────┐
     │                                   │          ▼
     │                                   │    ┌──────────┐
     │                                   │    │    S3    │
     │                                   │    └──────┬───┘
     │ 5. Upload complete                │           │
     │◄──────────────────────────────────┼───────────┘
     │                                   │
     │ 6. Submit post                    │
     │    (caption, location, tags)      │
     ├──────────────────────────────────►│
     │                                   │
     │                                   │ 7. Process media
     │                                   │    - Generate thumbnails
     │                                   │    - Extract metadata
     │                                   │    - Content moderation
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │ Media Worker │
     │                                   │  └──────────────┘
     │                                   │
     │                                   │ 8. Save to database
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │  PostgreSQL  │
     │                                   │  └──────────────┘
     │                                   │
     │                                   │ 9. Fanout to followers
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Kafka     │
     │                                   │  └──────┬───────┘
     │ 10. Post created                  │         │
     │◄──────────────────────────────────┤         │
     │                                   │         │
     │                                             │
     │                              ┌──────────────┘
     │                              ▼
     │                     ┌──────────────────┐
     │                     │ Fanout Workers   │
     │                     │ - Update feeds   │
     │                     │ - Send notifs    │
     │                     │ - Index hashtags │
     │                     └──────────────────┘
     │
```

### 4.2 Feed Loading Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Request feed
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │   Feed Service     │
     │                          └────────┬───────────┘
     │                                   │
     │                                   │ 2. Check feed cache
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  │ (pre-ranked) │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 3. Cache HIT
     │                                   │◄────────┘
     │                                   │
     │                    ─ ─ OR (Cache MISS) ─ ─
     │                                   │
     │                                   │ 4. Get user's timeline
     │                                   │    from Cassandra
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │  Cassandra   │
     │                                   │  │ (timeline)   │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 5. Get celebrity posts
     │                                   │    (pull model)
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │  PostgreSQL  │
     │                                   │  │ (posts)      │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 6. Rank with ML model
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │  ML Ranking  │
     │                                   │  │  Service     │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 7. Cache ranked feed
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  └──────────────┘
     │                                   │
     │ 8. Return ranked feed             │
     │    with post metadata             │
     │◄──────────────────────────────────┤
     │                                   │
     │ 9. Load media from CDN            │
     ├───────────────────────────────────┼──────────┐
     │                                   │          ▼
     │                                   │    ┌──────────┐
     │                                   │    │   CDN    │
     │                                   │    └──────┬───┘
     │ 10. Media delivered               │           │
     │◄──────────────────────────────────┼───────────┘
     │                                   │
```

### 4.3 Story Flow

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Create story
     │    (photo/video + stickers)
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │  Story Service     │
     │                          └────────┬───────────┘
     │                                   │
     │                                   │ 2. Save story
     │                                   │    TTL: 24 hours
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  │ (EXPIRE 24h) │
     │                                   │  └──────────────┘
     │                                   │
     │                                   │ 3. Fanout to followers
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Kafka     │
     │                                   │  └──────────────┘
     │                                   │
     │ 4. Story created                  │
     │◄──────────────────────────────────┤
     │                                   │

Viewing Story:
     │
     │ 5. User taps story avatar
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │  Story Service     │
     │                          └────────┬───────────┘
     │                                   │
     │                                   │ 6. Get stories for user
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │ 7. Return story list              │         │
     │◄──────────────────────────────────┤◄────────┘
     │                                   │
     │ 8. View story (mark as seen)      │
     ├──────────────────────────────────►│
     │                                   │
     │                                   │ 9. Record view
     │                                   │    (async)
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │  Cassandra   │
     │                                   │  │ (views log)  │
     │                                   │  └──────────────┘
     │                                   │
```

### 4.4 Engagement Flow (Like)

```
┌──────────┐
│  Client  │
└────┬─────┘
     │
     │ 1. Double-tap/tap like
     │    (Optimistic UI update)
     │
     │ 2. Send like request
     ├──────────────────────────────────────┐
     │                                      ▼
     │                          ┌────────────────────┐
     │                          │ Engagement Service │
     │                          └────────┬───────────┘
     │                                   │
     │                                   │ 3. Check if already liked
     │                                   │    (idempotency)
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  │ (like set)   │
     │                                   │  └──────┬───────┘
     │                                   │         │
     │                                   │ 4. Add to like set
     │                                   │    Increment counter
     │                                   │    (atomic)
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Redis     │
     │                                   │  │ SADD + INCR  │
     │                                   │  └──────────────┘
     │                                   │
     │                                   │ 5. Async persist
     │                                   ├────────┐
     │                                   │        ▼
     │                                   │  ┌──────────────┐
     │                                   │  │    Kafka     │
     │                                   │  └──────┬───────┘
     │ 6. Like confirmed                 │         │
     │◄──────────────────────────────────┤         │
     │                                   │         │
     │                              ┌────┘         │
     │                              ▼              ▼
     │                     ┌──────────────┐ ┌──────────────┐
     │                     │  PostgreSQL  │ │ Notification │
     │                     │  (persist)   │ │   Service    │
     │                     └──────────────┘ └──────────────┘
     │                                              │
     │ 7. Push notification (if enabled)           │
     │◄────────────────────────────────────────────┘
     │
```

---

## 5. API Design & Communication Protocols

### 5.1 REST vs GraphQL Decision

**Instagram uses REST + Custom Protocol:**

| Aspect | REST (Instagram) | GraphQL Alternative |
|--------|-----------------|---------------------|
| Caching | Native HTTP caching | Complex, custom caching |
| Simplicity | Simple endpoints | Schema complexity |
| Mobile | Fixed payloads | Flexible queries |
| Real-time | WebSocket separate | Subscriptions built-in |
| Learning | Team familiar | Learning curve |

**Verdict:** REST for main APIs, WebSocket for real-time.

### 5.2 Core API Endpoints

```
Authentication:
POST   /api/v1/auth/login
POST   /api/v1/auth/register
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout

Users & Profiles:
GET    /api/v1/users/:username
PUT    /api/v1/users/me
GET    /api/v1/users/:userId/followers?cursor=abc
GET    /api/v1/users/:userId/following?cursor=abc
POST   /api/v1/users/:userId/follow
DELETE /api/v1/users/:userId/follow

Feed:
GET    /api/v1/feed?cursor=abc&limit=20
GET    /api/v1/feed/suggested
POST   /api/v1/feed/refresh (pull to refresh)

Posts:
GET    /api/v1/posts/:postId
POST   /api/v1/posts
DELETE /api/v1/posts/:postId
GET    /api/v1/posts/:postId/likes?cursor=abc
GET    /api/v1/posts/:postId/comments?cursor=abc
POST   /api/v1/posts/:postId/likes
DELETE /api/v1/posts/:postId/likes
POST   /api/v1/posts/:postId/comments
POST   /api/v1/posts/:postId/save
DELETE /api/v1/posts/:postId/save

Stories:
GET    /api/v1/stories (users with stories)
GET    /api/v1/stories/:userId
POST   /api/v1/stories
DELETE /api/v1/stories/:storyId
POST   /api/v1/stories/:storyId/view
POST   /api/v1/stories/:storyId/reply

Explore:
GET    /api/v1/explore?cursor=abc
GET    /api/v1/explore/tags/:hashtag
GET    /api/v1/explore/locations/:locationId

Search:
GET    /api/v1/search?q=query&type=user|hashtag|location
GET    /api/v1/search/suggestions?q=query

Notifications:
GET    /api/v1/notifications?cursor=abc
POST   /api/v1/notifications/read

Direct Messages:
GET    /api/v1/direct/threads
GET    /api/v1/direct/threads/:threadId/messages
POST   /api/v1/direct/threads/:threadId/messages
```

### 5.3 API Response Format

**Success Response:**
```json
{
  "data": {
    "posts": [...],
    "cursor": "eyJpZCI6MTIzfQ==",
    "hasMore": true
  },
  "meta": {
    "requestId": "req_abc123",
    "timestamp": 1703001234567
  }
}
```

**Error Response:**
```json
{
  "error": {
    "code": "POST_NOT_FOUND",
    "message": "The requested post does not exist",
    "status": 404
  },
  "meta": {
    "requestId": "req_abc123"
  }
}
```

### 5.4 Real-time Communication

**WebSocket for:**
- Direct messages
- Typing indicators
- Online presence
- Live notifications
- Story views (live count)

**Server-Sent Events (SSE) for:**
- Feed updates (new posts badge)
- Notification count updates

```typescript
// WebSocket connection
const ws = new WebSocket('wss://api.instagram.com/realtime');

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);

  switch (message.type) {
    case 'NEW_MESSAGE':
      addMessage(message.payload);
      break;
    case 'TYPING':
      showTypingIndicator(message.payload.userId);
      break;
    case 'NOTIFICATION':
      incrementNotificationCount();
      break;
  }
};
```

### 5.5 Rate Limiting

```
Endpoints:
- Feed: 100 req/min
- Posts: 30 req/min
- Likes: 200 req/min
- Comments: 60 req/min
- Follow: 60 req/hour
- DM: 100 messages/min
- Search: 60 req/min

Headers:
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1703001300
```

---

## 6. Database Design

### 6.1 Database Selection

| Data Type | Database | Rationale |
|-----------|----------|-----------|
| Users, Posts, Comments | PostgreSQL | ACID, relationships, complex queries |
| Feed Timeline | Cassandra | High write throughput, time-series |
| Sessions, Counters, Cache | Redis | Sub-ms latency, atomic operations |
| Search, Hashtags | Elasticsearch | Full-text, autocomplete |
| Media Blobs | S3 | Unlimited scale, durability |
| Social Graph | Neo4j/TAO (optional) | Graph queries, friend-of-friend |

### 6.2 PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    bio TEXT,
    profile_pic_url VARCHAR(512),
    website VARCHAR(255),
    is_private BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,

    -- Denormalized counters (updated async)
    post_count INTEGER DEFAULT 0,
    follower_count INTEGER DEFAULT 0,
    following_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);

-- Follow relationships
CREATE TABLE follows (
    follower_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (follower_id, following_id),
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

CREATE INDEX idx_follows_follower ON follows(follower_id, created_at DESC);
CREATE INDEX idx_follows_following ON follows(following_id, created_at DESC);

-- Posts table
CREATE TABLE posts (
    post_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,

    -- Media (can be multiple for carousels)
    media_type VARCHAR(20) NOT NULL, -- 'image', 'video', 'carousel'
    media_urls JSONB NOT NULL, -- [{url, width, height, type}]
    thumbnail_url VARCHAR(512),

    -- Content
    caption TEXT,
    location_id UUID REFERENCES locations(location_id),
    location_name VARCHAR(255),

    -- Hashtags (denormalized for faster queries)
    hashtags TEXT[], -- ['travel', 'photography']

    -- Mentions
    mentions UUID[], -- user_ids mentioned

    -- Settings
    comments_disabled BOOLEAN DEFAULT FALSE,
    likes_hidden BOOLEAN DEFAULT FALSE,

    -- Denormalized counters
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    save_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_posts_user ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_hashtags ON posts USING GIN(hashtags);
CREATE INDEX idx_posts_location ON posts(location_id) WHERE location_id IS NOT NULL;

-- Post media (for carousels)
CREATE TABLE post_media (
    media_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    position INTEGER NOT NULL,

    media_type VARCHAR(20) NOT NULL, -- 'image', 'video'
    url VARCHAR(512) NOT NULL,
    thumbnail_url VARCHAR(512),
    width INTEGER,
    height INTEGER,
    duration_ms INTEGER, -- for videos

    -- Alt text for accessibility
    alt_text TEXT,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_post_media_post ON post_media(post_id, position);

-- Likes (partitioned by time for scale)
CREATE TABLE likes (
    like_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),

    UNIQUE(post_id, user_id)
) PARTITION BY RANGE (created_at);

-- Create partitions by month
CREATE TABLE likes_2024_01 PARTITION OF likes
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE INDEX idx_likes_post ON likes(post_id, created_at DESC);
CREATE INDEX idx_likes_user ON likes(user_id, created_at DESC);

-- Comments
CREATE TABLE comments (
    comment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(comment_id) ON DELETE CASCADE,

    text TEXT NOT NULL,
    mentions UUID[], -- mentioned user_ids

    like_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_comments_post ON comments(post_id, created_at);
CREATE INDEX idx_comments_user ON comments(user_id, created_at DESC);
CREATE INDEX idx_comments_parent ON comments(parent_id) WHERE parent_id IS NOT NULL;

-- Saved posts
CREATE TABLE saved_posts (
    user_id UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    post_id UUID NOT NULL REFERENCES posts(post_id) ON DELETE CASCADE,
    collection_id UUID REFERENCES collections(collection_id),
    created_at TIMESTAMP DEFAULT NOW(),

    PRIMARY KEY (user_id, post_id)
);

CREATE INDEX idx_saved_user ON saved_posts(user_id, created_at DESC);

-- Hashtags
CREATE TABLE hashtags (
    hashtag_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) UNIQUE NOT NULL,
    post_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_hashtags_name ON hashtags(name);
CREATE INDEX idx_hashtags_count ON hashtags(post_count DESC);

-- Locations
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    address VARCHAR(512),
    city VARCHAR(100),
    country VARCHAR(100),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    post_count INTEGER DEFAULT 0,

    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_locations_geo ON locations USING GIST(
    ST_MakePoint(longitude, latitude)
);
CREATE INDEX idx_locations_name ON locations(name);
```

### 6.3 Cassandra Schema (Feed Timeline)

```cql
-- User feed timeline (pre-computed)
CREATE TABLE user_feed (
    user_id UUID,
    post_id UUID,
    author_id UUID,
    created_at TIMESTAMP,
    ranking_score FLOAT,

    PRIMARY KEY ((user_id), created_at, post_id)
) WITH CLUSTERING ORDER BY (created_at DESC, post_id DESC)
  AND default_time_to_live = 2592000; -- 30 days TTL

-- User activity timeline (for profile)
CREATE TABLE user_posts (
    user_id UUID,
    post_id UUID,
    created_at TIMESTAMP,
    media_type TEXT,
    thumbnail_url TEXT,

    PRIMARY KEY ((user_id), created_at, post_id)
) WITH CLUSTERING ORDER BY (created_at DESC);

-- Story views
CREATE TABLE story_views (
    story_id UUID,
    viewer_id UUID,
    viewed_at TIMESTAMP,

    PRIMARY KEY ((story_id), viewed_at, viewer_id)
) WITH CLUSTERING ORDER BY (viewed_at DESC)
  AND default_time_to_live = 86400; -- 24 hours
```

### 6.4 Redis Data Structures

```
# Session storage
SET session:{sessionId} {userId} EX 86400

# Feed cache (ranked post IDs)
ZSET feed:{userId} {postId} {score}
     TTL: 1 hour

# Like set (who liked a post)
SET likes:{postId} {userId1, userId2, ...}

# Like count (atomic counter)
STRING like_count:{postId} 12345

# User online status
SET online_users {userId1, userId2, ...}

# Rate limiting
STRING ratelimit:{userId}:{endpoint} {count}
       TTL: 60 seconds

# Stories list (users with active stories)
ZSET stories:{userId}:following {followingId} {latestStoryTs}
     TTL: 24 hours

# Active stories for user
LIST stories:{userId} [{storyId1}, {storyId2}]
     TTL: 24 hours

# Story view tracking
SET story_views:{storyId} {viewerId1, viewerId2}
    TTL: 24 hours

# Follow suggestions cache
LIST suggestions:{userId} [{userId1}, {userId2}]
     TTL: 1 hour

# Trending hashtags
ZSET trending_hashtags {hashtag} {score}
     Updated every 15 min
```

### 6.5 Data Partitioning Strategy

**PostgreSQL Sharding (by user_id):**
```
Shard key: user_id (hash-based)

Why user_id:
- Most queries filter by user
- User data co-located (posts, likes, follows)
- Avoids cross-shard joins for common operations

Shards: 256 logical shards
- Shard = hash(user_id) % 256
- Physical clusters: 16 (16 shards each)

Global tables (replicated):
- hashtags
- locations
- config
```

**Cassandra Partitioning:**
```
Feed table:
- Partition key: user_id
- Clustering: created_at DESC

Why:
- Each user's feed is a single partition
- Time-ordered for efficient range queries
- Max partition size: ~10MB (500 posts)
```

---

## 7. Caching Strategy

### 7.1 Multi-Layer Cache Architecture

```
┌─────────────────────────────────────────────────────────┐
│                  Browser/App Cache                       │
│  - Service Worker (PWA)                                  │
│  - Media cached locally                                  │
│  - Feed cached in IndexedDB                              │
│  TTL: 24 hours for media, 5 min for feed                │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                    CDN (Akamai/CloudFront)              │
│  - All media (photos, videos, thumbnails)               │
│  - Static assets (JS, CSS)                              │
│  - Cache-Control: public, max-age=31536000, immutable   │
│  Hit rate: 95%+                                         │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Redis Cluster (Application Cache)          │
├─────────────────────────────────────────────────────────┤
│  Layer 1: Hot Data (1 hour TTL)                         │
│    - User feeds (ranked)                                │
│    - Active stories                                     │
│    - Like/save states for viewer                        │
│                                                         │
│  Layer 2: Warm Data (24 hour TTL)                       │
│    - User profiles                                      │
│    - Post metadata                                      │
│    - Follower/following lists                           │
│                                                         │
│  Layer 3: Counters (no TTL, async persist)              │
│    - Like counts                                        │
│    - Comment counts                                     │
│    - View counts                                        │
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Application Memory (LRU Cache)             │
│  - Frequently accessed user sessions                    │
│  - Config/feature flags                                 │
│  - Size limit: 500MB per instance                       │
└─────────────────────────────────────────────────────────┘
```

### 7.2 Feed Caching Strategy

```javascript
async function getFeed(userId) {
  const cacheKey = `feed:${userId}`;

  // 1. Check Redis cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }

  // 2. Check if feed generation is in progress
  const lockKey = `feed_lock:${userId}`;
  const isLocked = await redis.get(lockKey);

  if (isLocked) {
    // Wait and retry (another request is generating)
    await sleep(100);
    return getFeed(userId);
  }

  // 3. Acquire lock
  await redis.set(lockKey, '1', 'EX', 30);

  try {
    // 4. Generate feed
    const feed = await generateFeed(userId);

    // 5. Cache result
    await redis.set(cacheKey, JSON.stringify(feed), 'EX', 3600);

    return feed;
  } finally {
    // 6. Release lock
    await redis.del(lockKey);
  }
}

async function generateFeed(userId) {
  // Get pre-computed timeline from Cassandra
  const timeline = await cassandra.execute(
    'SELECT * FROM user_feed WHERE user_id = ? LIMIT 500',
    [userId]
  );

  // Get celebrity posts (pull model)
  const celebrities = await getCelebritiesFollowed(userId);
  const celebPosts = await getRecentPostsFromUsers(celebrities);

  // Merge and rank
  const allPosts = [...timeline, ...celebPosts];
  const ranked = await mlRanker.rank(allPosts, userId);

  return ranked.slice(0, 100);
}
```

### 7.3 Cache Invalidation Patterns

```javascript
// On new post
async function onNewPost(post) {
  // 1. Invalidate author's profile cache
  await redis.del(`profile:${post.userId}`);

  // 2. Don't invalidate all follower feeds
  //    Instead, push to Kafka for async fanout
  await kafka.send('post.created', post);
}

// On like
async function onLike(postId, userId) {
  // 1. Increment counter atomically
  await redis.incr(`like_count:${postId}`);

  // 2. Add to like set
  await redis.sadd(`likes:${postId}`, userId);

  // 3. Mark user's like state
  await redis.sadd(`user_likes:${userId}`, postId);

  // 4. Async persist to DB
  await kafka.send('post.liked', { postId, userId });
}

// On follow
async function onFollow(followerId, followingId) {
  // 1. Invalidate follower's feed
  await redis.del(`feed:${followerId}`);

  // 2. Invalidate follower/following counts
  await redis.del(`profile:${followerId}`);
  await redis.del(`profile:${followingId}`);

  // 3. Queue feed regeneration
  await kafka.send('feed.regenerate', { userId: followerId });
}
```

### 7.4 CDN Configuration

```yaml
# CloudFront behaviors

# Media files (photos, videos)
/media/*:
  Cache-Control: public, max-age=31536000, immutable
  Compress: true (for thumbnails)
  Origin: S3 bucket

# Profile pictures
/avatars/*:
  Cache-Control: public, max-age=86400
  Vary: Accept (for WebP/AVIF)
  Origin: S3 bucket

# Static assets (versioned)
/static/*:
  Cache-Control: public, max-age=31536000, immutable
  Compress: true
  Origin: S3 static bucket

# API (no cache)
/api/*:
  Cache-Control: no-store
  Forward all headers
  Origin: API load balancer
```

---

## 8. State Management (Frontend)

### 8.1 State Architecture

```
┌────────────────────────────────────────────────────────┐
│              Global State (Zustand/Redux)              │
├────────────────────────────────────────────────────────┤
│  - Auth state (user, token, permissions)               │
│  - UI state (modals, navigation, theme)                │
│  - Real-time state (notifications, messages)           │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              Server State (React Query/SWR)            │
├────────────────────────────────────────────────────────┤
│  - Feed data (infinite, cached)                        │
│  - Post details                                        │
│  - User profiles                                       │
│  - Comments, likes                                     │
│  - Stories                                             │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              Local State (useState/useReducer)         │
├────────────────────────────────────────────────────────┤
│  - Form inputs                                         │
│  - Component UI (dropdowns, tooltips)                  │
│  - Temporary selections                                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│              URL State (React Router)                  │
├────────────────────────────────────────────────────────┤
│  - Current route                                       │
│  - Query params (search, filters)                      │
│  - Modal routes (/p/:postId)                          │
└────────────────────────────────────────────────────────┘
```

### 8.2 Feed State with React Query

```typescript
// Feed hook with infinite scroll
function useFeed() {
  return useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      const response = await api.get('/feed', {
        params: { cursor: pageParam, limit: 20 }
      });
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
    staleTime: 60 * 1000, // 1 minute
    cacheTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Optimistic like mutation
function useLikePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => api.post(`/posts/${postId}/likes`),

    onMutate: async (postId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries(['feed']);

      // Snapshot previous value
      const previousFeed = queryClient.getQueryData(['feed']);

      // Optimistically update
      queryClient.setQueryData(['feed'], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: any) =>
            post.id === postId
              ? { ...post, isLiked: true, likeCount: post.likeCount + 1 }
              : post
          )
        }))
      }));

      return { previousFeed };
    },

    onError: (err, postId, context) => {
      // Rollback on error
      queryClient.setQueryData(['feed'], context?.previousFeed);
    },

    onSettled: () => {
      // Refetch after error or success
      queryClient.invalidateQueries(['feed']);
    }
  });
}
```

### 8.3 Global UI State with Zustand

```typescript
interface UIStore {
  // Modal state
  activeModal: 'create-post' | 'story-viewer' | 'comments' | null;
  modalData: any;

  // Story viewer
  currentStoryUserId: string | null;
  storyIndex: number;

  // Notification badge
  unreadNotifications: number;
  unreadMessages: number;

  // Actions
  openModal: (modal: UIStore['activeModal'], data?: any) => void;
  closeModal: () => void;
  setStoryViewer: (userId: string, index: number) => void;
  incrementNotifications: () => void;
  clearNotifications: () => void;
}

const useUIStore = create<UIStore>((set) => ({
  activeModal: null,
  modalData: null,
  currentStoryUserId: null,
  storyIndex: 0,
  unreadNotifications: 0,
  unreadMessages: 0,

  openModal: (modal, data) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),

  setStoryViewer: (userId, index) => set({
    activeModal: 'story-viewer',
    currentStoryUserId: userId,
    storyIndex: index
  }),

  incrementNotifications: () => set((state) => ({
    unreadNotifications: state.unreadNotifications + 1
  })),

  clearNotifications: () => set({ unreadNotifications: 0 })
}));
```

### 8.4 Real-time State with WebSocket

```typescript
// WebSocket connection manager
class RealtimeManager {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnects = 5;

  connect(token: string) {
    this.ws = new WebSocket(`wss://api.instagram.com/realtime?token=${token}`);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      console.log('WebSocket connected');
    };

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.handleMessage(message);
    };

    this.ws.onclose = () => {
      this.attemptReconnect(token);
    };
  }

  private handleMessage(message: RealtimeMessage) {
    switch (message.type) {
      case 'NEW_NOTIFICATION':
        useUIStore.getState().incrementNotifications();
        break;

      case 'NEW_MESSAGE':
        // Update messages query
        queryClient.setQueryData(
          ['messages', message.threadId],
          (old: any) => [...old, message.payload]
        );
        break;

      case 'TYPING':
        // Show typing indicator
        useTypingStore.getState().setTyping(message.threadId, message.userId);
        break;

      case 'STORY_VIEWED':
        // Update story view count
        queryClient.invalidateQueries(['story-views', message.storyId]);
        break;
    }
  }

  private attemptReconnect(token: string) {
    if (this.reconnectAttempts < this.maxReconnects) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => this.connect(token), delay);
    }
  }
}
```

---

## 9. Performance Optimization

### 9.1 Feed Performance

**Virtual Scrolling:**
```typescript
import { Virtuoso } from 'react-virtuoso';

const Feed: React.FC = () => {
  const { data, fetchNextPage, hasNextPage } = useFeed();

  const posts = useMemo(() =>
    data?.pages.flatMap(p => p.posts) ?? [],
    [data]
  );

  return (
    <Virtuoso
      data={posts}
      endReached={() => hasNextPage && fetchNextPage()}
      overscan={200}
      itemContent={(index, post) => (
        <PostCard key={post.id} post={post} />
      )}
      components={{
        Header: () => <StoriesBar />,
        Footer: () => <LoadingSpinner />
      }}
    />
  );
};
```

**Image Optimization:**
```typescript
const PostMedia: React.FC<{ media: Media }> = ({ media }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="post-media" style={{ aspectRatio: media.aspectRatio }}>
      {/* Blur placeholder */}
      {!isLoaded && (
        <div
          className="blur-placeholder"
          style={{ backgroundImage: `url(${media.blurHash})` }}
        />
      )}

      <picture>
        <source
          srcSet={`${media.url}?format=avif&w=640 640w,
                   ${media.url}?format=avif&w=1080 1080w`}
          type="image/avif"
        />
        <source
          srcSet={`${media.url}?format=webp&w=640 640w,
                   ${media.url}?format=webp&w=1080 1080w`}
          type="image/webp"
        />
        <img
          src={`${media.url}?w=1080`}
          srcSet={`${media.url}?w=640 640w,
                   ${media.url}?w=1080 1080w`}
          sizes="(max-width: 640px) 100vw, 640px"
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          alt={media.altText}
        />
      </picture>
    </div>
  );
};
```

### 9.2 Story Performance

**Preloading Strategy:**
```typescript
const StoryViewer: React.FC = () => {
  const { stories, currentIndex } = useStoryStore();

  // Preload next 2 stories
  useEffect(() => {
    const preloadRange = [currentIndex + 1, currentIndex + 2];

    preloadRange.forEach(index => {
      if (stories[index]) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = stories[index].type === 'video' ? 'video' : 'image';
        link.href = stories[index].mediaUrl;
        document.head.appendChild(link);
      }
    });
  }, [currentIndex, stories]);

  return (
    <div className="story-viewer">
      <StoryProgressBar
        segments={stories.length}
        currentIndex={currentIndex}
        duration={stories[currentIndex].duration}
      />

      <StoryMedia story={stories[currentIndex]} />

      <StoryNavigation
        onPrev={() => goToStory(currentIndex - 1)}
        onNext={() => goToStory(currentIndex + 1)}
      />
    </div>
  );
};
```

**Auto-advance with Pause:**
```typescript
function useStoryTimer(duration: number, onComplete: () => void) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef<NodeJS.Timer>();

  useEffect(() => {
    if (isPaused) return;

    const interval = 100; // Update every 100ms
    const increment = (interval / duration) * 100;

    intervalRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          onComplete();
          return 0;
        }
        return prev + increment;
      });
    }, interval);

    return () => clearInterval(intervalRef.current);
  }, [duration, isPaused, onComplete]);

  return {
    progress,
    pause: () => setIsPaused(true),
    resume: () => setIsPaused(false),
    reset: () => setProgress(0)
  };
}
```

### 9.3 Bundle Optimization

```javascript
// Route-based code splitting
const Feed = lazy(() => import('./pages/Feed'));
const Explore = lazy(() => import('./pages/Explore'));
const Reels = lazy(() => import('./pages/Reels'));
const Profile = lazy(() => import('./pages/Profile'));
const Direct = lazy(() => import('./pages/Direct'));

// Heavy component splitting
const StoryViewer = lazy(() => import('./components/StoryViewer'));
const PostCreator = lazy(() => import('./components/PostCreator'));
const ImageEditor = lazy(() => import('./components/ImageEditor'));

// Bundle size targets
// Main bundle: < 150KB gzipped
// Per-route chunk: < 50KB gzipped
// Total initial load: < 200KB gzipped
```

### 9.4 Network Optimization

**Request Batching:**
```typescript
// Batch multiple like requests
const likeBatcher = new DataLoader(async (postIds: string[]) => {
  const response = await api.post('/posts/batch-like', { postIds });
  return response.data.results;
}, {
  batchScheduleFn: (callback) => setTimeout(callback, 50) // 50ms window
});

// Usage
await likeBatcher.load(postId);
```

**Prefetching:**
```typescript
// Prefetch user profile on hover
const UserLink: React.FC<{ userId: string }> = ({ userId, children }) => {
  const queryClient = useQueryClient();

  const prefetchProfile = () => {
    queryClient.prefetchQuery({
      queryKey: ['profile', userId],
      queryFn: () => fetchProfile(userId),
      staleTime: 60000
    });
  };

  return (
    <Link
      to={`/profile/${userId}`}
      onMouseEnter={prefetchProfile}
      onFocus={prefetchProfile}
    >
      {children}
    </Link>
  );
};
```

### 9.5 Core Web Vitals Targets

```
LCP (Largest Contentful Paint): < 2.5s
  - Optimize hero image loading
  - Preload critical resources
  - Use CDN for media

FID (First Input Delay): < 100ms
  - Minimize JavaScript execution
  - Use web workers for heavy processing
  - Defer non-critical scripts

CLS (Cumulative Layout Shift): < 0.1
  - Reserve space for images (aspect-ratio)
  - Avoid inserting content above viewport
  - Use skeleton loaders

TTI (Time to Interactive): < 3s
  - Code splitting
  - Tree shaking
  - Lazy load below-fold content
```

---

## 10. Error Handling & Edge Cases

### 10.1 Network Error Handling

```typescript
// Retry logic with exponential backoff
async function fetchWithRetry<T>(
  fn: () => Promise<T>,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) throw error;

      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, attempt - 1) * 1000;
      await sleep(delay);
    }
  }
  throw new Error('Max retries exceeded');
}

// React Query error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      onError: (error) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          authStore.logout();
        }
      }
    }
  }
});
```

### 10.2 Optimistic Update Rollback

```typescript
const useLikePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => api.post(`/posts/${postId}/likes`),

    onMutate: async (postId) => {
      // Optimistic update
      await queryClient.cancelQueries(['feed']);
      const previousData = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) =>
        updatePostInFeed(old, postId, { isLiked: true, likeCount: '+1' })
      );

      // Show heart animation immediately
      showLikeAnimation(postId);

      return { previousData };
    },

    onError: (error, postId, context) => {
      // Rollback on failure
      queryClient.setQueryData(['feed'], context?.previousData);

      // Show error toast
      toast.error('Failed to like post. Please try again.');

      // Log error
      logger.error('Like failed', { postId, error });
    }
  });
};
```

### 10.3 Edge Cases

**Story Expiration:**
```typescript
// Handle story expiring while viewing
const StoryMedia: React.FC<{ story: Story }> = ({ story }) => {
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const expiresAt = new Date(story.expiresAt).getTime();
    const now = Date.now();

    if (now >= expiresAt) {
      setIsExpired(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsExpired(true);
    }, expiresAt - now);

    return () => clearTimeout(timeout);
  }, [story.expiresAt]);

  if (isExpired) {
    return <ExpiredStoryMessage onClose={goToNextStory} />;
  }

  return <MediaContent story={story} />;
};
```

**Deleted Post:**
```typescript
// Handle viewing deleted post
const PostDetail: React.FC<{ postId: string }> = ({ postId }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetchPost(postId)
  });

  if (error?.response?.status === 404) {
    return (
      <div className="deleted-post">
        <h2>This post is no longer available</h2>
        <p>The post may have been deleted by the owner.</p>
        <Button onClick={() => navigate('/')}>Go to Feed</Button>
      </div>
    );
  }

  // ... render post
};
```

**Private Account:**
```typescript
// Handle following private account
const FollowButton: React.FC<{ user: User }> = ({ user }) => {
  const [status, setStatus] = useState<'none' | 'requested' | 'following'>(
    user.followStatus
  );

  const handleFollow = async () => {
    if (user.isPrivate) {
      // Send follow request
      await api.post(`/users/${user.id}/follow-request`);
      setStatus('requested');
      toast.success('Follow request sent');
    } else {
      // Instant follow
      await api.post(`/users/${user.id}/follow`);
      setStatus('following');
    }
  };

  return (
    <Button onClick={handleFollow}>
      {status === 'none' && 'Follow'}
      {status === 'requested' && 'Requested'}
      {status === 'following' && 'Following'}
    </Button>
  );
};
```

**Rate Limiting:**
```typescript
// Handle rate limit errors
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 429) {
      const retryAfter = error.response.headers['retry-after'];

      toast.warning(`Too many requests. Please wait ${retryAfter} seconds.`);

      // Disable action buttons temporarily
      rateLimitStore.setLimited(retryAfter);
    }

    return Promise.reject(error);
  }
);
```

---

## 11. Interview Cross-Questions & Answers

### 11.1 Architecture & Design

**Q1: Why hybrid push/pull model for feed instead of pure push?**

**A:** Pure push (fanout on write) doesn't scale for celebrities:
- Celebrity with 500M followers posts → 500M writes
- Storage: 500M × 100 posts = 50B timeline entries per celebrity
- Latency: 500M writes before post visible

**Hybrid approach:**
- Regular users (< 10K followers): Push to all feeds
- Celebrities (> 1M followers): Pull at read time
- Middle tier: Hybrid based on activity

**Trade-offs:**
| Approach | Write Cost | Read Cost | Latency |
|----------|-----------|-----------|---------|
| Pure Push | O(followers) | O(1) | High for celebrities |
| Pure Pull | O(1) | O(following) | High for active users |
| Hybrid | Optimized | Optimized | Balanced |

**Q2: How would you handle a viral post with 10M likes in 1 hour?**

**A:**
1. **Rate limiting**: Cap likes per user to prevent spam
2. **Counter sharding**: Shard like counter across 100 Redis keys
   ```
   like_count:{postId}:0
   like_count:{postId}:1
   ...
   like_count:{postId}:99

   Total = SUM of all shards
   ```
3. **Approximate counting**: Use HyperLogLog for unique liker count
4. **Async persistence**: Batch writes to database every 5 seconds
5. **CDN caching**: Cache like count with 30s TTL

**Q3: How do you ensure real-time notifications scale to 2B users?**

**A:**
1. **WebSocket servers**: Horizontally scaled, 100K connections per server
2. **Pub/Sub**: Redis or Kafka for notification routing
3. **Connection partitioning**: Users sharded to specific WS servers
4. **Fallback**: Push notifications for mobile when disconnected
5. **Priority queues**: High-priority (DMs) vs low-priority (likes)

```
User connects → Load balancer → Consistent hash(userId) → WS Server

Notification flow:
1. Event (like) → Kafka
2. Notification worker → Find user's WS server
3. Publish to Redis channel → WS server subscribes
4. WS server → Push to user
```

**Q4: SQL vs NoSQL for social graph (follows)?**

**A:** **PostgreSQL is sufficient** for most cases:

```sql
-- Follow relationship
CREATE TABLE follows (
    follower_id UUID,
    following_id UUID,
    created_at TIMESTAMP,
    PRIMARY KEY (follower_id, following_id)
);

-- Get followers (indexed)
SELECT * FROM follows WHERE following_id = ? LIMIT 100;

-- Get following (indexed)
SELECT * FROM follows WHERE follower_id = ? LIMIT 100;
```

**When to use Graph DB (Neo4j/TAO):**
- Friend-of-friend queries
- Mutual followers
- Path finding (6 degrees of separation)
- Instagram uses TAO (custom graph store)

**Trade-off:**
- PostgreSQL: Simpler, ACID, sufficient for 1st-degree queries
- Graph DB: Complex queries, eventual consistency, operational overhead

### 11.2 Performance & Scalability

**Q5: How do you achieve < 200ms feed load time?**

**A:**
1. **Pre-computed feeds**: Ranking done async, stored in Redis
2. **Edge caching**: CDN for media (95% hit rate)
3. **Pagination**: Load 20 posts initially, lazy load more
4. **Parallel requests**: Feed metadata + media loaded simultaneously
5. **Compression**: Brotli for API, WebP/AVIF for images
6. **Connection pooling**: Reuse HTTP/2 connections

```
Timeline breakdown (200ms budget):
- DNS + TCP + TLS: 50ms (connection reuse)
- API request: 50ms (Redis hit)
- Parse + render: 50ms
- First image: 50ms (CDN)
```

**Q6: How would you handle Instagram going down for a region?**

**A:**
1. **Multi-region deployment**: US-East, US-West, Europe, Asia
2. **DNS failover**: Route53 health checks → redirect traffic
3. **Data replication**: Async replication with < 1s lag
4. **Graceful degradation**:
   - Feed: Show cached version
   - Uploads: Queue locally, sync later
   - Stories: Continue from cache
5. **Read replicas**: Multiple read replicas per region

**Q7: How do you prevent spam and abuse?**

**A:**
1. **Rate limiting**: Per-endpoint limits (likes: 200/min)
2. **Account age restrictions**: New accounts limited
3. **ML detection**: Spam patterns, bot behavior
4. **CAPTCHA**: On suspicious activity
5. **Content moderation**: AI + human review
6. **Report system**: User-reported content reviewed

```typescript
// Rate limit middleware
const rateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: (req) => {
    if (req.path.includes('like')) return 200;
    if (req.path.includes('comment')) return 60;
    if (req.path.includes('follow')) return 60;
    return 100;
  },
  keyGenerator: (req) => req.user.id
});
```

### 11.3 Frontend-Specific

**Q8: How do you implement double-tap to like?**

**A:**
```typescript
function useDoubleTap(onDoubleTap: () => void, delay = 300) {
  const lastTapRef = useRef(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeSinceLastTap = now - lastTapRef.current;

    if (timeSinceLastTap < delay && timeSinceLastTap > 0) {
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [onDoubleTap, delay]);

  return { onClick: handleTap };
}

// Usage
const PostMedia = ({ post }) => {
  const { onClick } = useDoubleTap(() => {
    likePost(post.id);
    showHeartAnimation();
  });

  return <img onClick={onClick} src={post.imageUrl} />;
};
```

**Q9: How do you handle infinite scroll without memory leaks?**

**A:**
1. **Virtual scrolling**: Only render visible items
2. **Data windowing**: Keep only recent N pages in memory
3. **Image cleanup**: Remove off-screen images from DOM
4. **WeakRef**: Use weak references for cached data

```typescript
const useFeedWithCleanup = () => {
  const query = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: fetchFeed,
    getNextPageParam: (last) => last.cursor
  });

  // Cleanup old pages when we have too many
  useEffect(() => {
    const maxPages = 5;
    if (query.data?.pages.length > maxPages) {
      queryClient.setQueryData(['feed'], (old: any) => ({
        ...old,
        pages: old.pages.slice(-maxPages),
        pageParams: old.pageParams.slice(-maxPages)
      }));
    }
  }, [query.data?.pages.length]);

  return query;
};
```

**Q10: How do you implement Stories with progress bar and auto-advance?**

**A:**
```typescript
const StoryViewer: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const story = stories[currentIndex];
  const duration = story.type === 'video' ? story.duration : 5000;

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          // Auto-advance to next story
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1);
            return 0;
          } else {
            // Close viewer
            onClose();
            return 100;
          }
        }
        return prev + (100 / (duration / 100));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [currentIndex, isPaused, duration]);

  // Pause on hold
  const handleTouchStart = () => setIsPaused(true);
  const handleTouchEnd = () => setIsPaused(false);

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
    >
      <ProgressBar
        segments={stories.length}
        currentIndex={currentIndex}
        progress={progress}
      />
      <StoryContent story={story} />
    </div>
  );
};
```

---

## 12. Summary & Key Takeaways

### 12.1 Critical Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Feed Model | Hybrid Push/Pull | Balances celebrity scale with regular user latency |
| API Protocol | REST + WebSocket | REST for CRUD, WebSocket for real-time |
| Primary DB | PostgreSQL | ACID, relationships, mature ecosystem |
| Timeline Store | Cassandra | High write throughput, time-series optimized |
| Cache | Redis Cluster | Sub-ms latency, rich data structures |
| Search | Elasticsearch | Full-text, autocomplete, hashtags |
| CDN | Multi-CDN | 95%+ hit rate, global coverage |

### 12.2 Scalability Strategies

1. **Horizontal scaling**: Stateless services, sharded databases
2. **Async processing**: Kafka for fanout, notifications, analytics
3. **Caching**: Multi-layer (Browser → CDN → Redis → App)
4. **Database partitioning**: Hash by user_id
5. **Read replicas**: 10:1 read:write ratio optimization

### 12.3 Frontend Optimizations

1. **Virtual scrolling**: Handle 1000s of posts
2. **Optimistic updates**: Instant UI feedback
3. **Image optimization**: WebP/AVIF, responsive, lazy load
4. **Code splitting**: Route-based, component-based
5. **Prefetching**: Hover-triggered, scroll-triggered

### 12.4 Key Differences from Google Photos

| Aspect | Instagram | Google Photos |
|--------|-----------|---------------|
| Focus | Social engagement | Personal storage |
| Feed | Algorithmic ranking | Chronological |
| Content | Curated, edited | Raw, unedited |
| Discovery | Explore, hashtags | Search only |
| Real-time | Critical (notifications) | Not critical |
| Scale priority | Read latency | Storage efficiency |

### 12.5 Interview Tips

1. **Clarify requirements**: Social vs storage, scale expectations
2. **Draw diagrams**: Show hybrid feed model, data flow
3. **Discuss trade-offs**: Push vs pull, SQL vs NoSQL
4. **Consider scale**: 2B users, 10M posts/day, 500M stories/day
5. **Real-time matters**: Notifications, messaging, presence
6. **Frontend depth**: Virtual scroll, optimistic updates, stories
7. **ML integration**: Feed ranking, content moderation, recommendations

---

## 13. Accessibility (a11y) Deep Dive

### 13.1 Accessibility Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Accessibility Layer Architecture                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │   Screen    │  │  Keyboard   │  │   Focus     │  │   Motion    │ │
│  │   Reader    │  │  Navigation │  │  Management │  │  Reduction  │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │                │        │
│         ▼                ▼                ▼                ▼        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    ARIA Live Regions                         │   │
│  │  • Feed updates    • Like confirmations    • Story progress  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Semantic HTML Structure                    │   │
│  │  <main> → <article> → <section> → Interactive elements       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 13.2 Accessible Post Card

```typescript
interface AccessiblePostCardProps {
  post: Post;
  onLike: () => void;
  onComment: () => void;
  onSave: () => void;
  onShare: () => void;
}

const AccessiblePostCard: React.FC<AccessiblePostCardProps> = ({
  post,
  onLike,
  onComment,
  onSave,
  onShare,
}) => {
  const [isLiked, setIsLiked] = useState(post.isLikedByMe);
  const [likeCount, setLikeCount] = useState(post.likeCount);
  const announceRef = useRef<HTMLDivElement>(null);

  const announceToScreenReader = (message: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = message;
    }
  };

  const handleLike = () => {
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    onLike();
    announceToScreenReader(
      newLiked ? 'Post liked' : 'Post unliked'
    );
  };

  return (
    <article
      aria-labelledby={`post-author-${post.id}`}
      aria-describedby={`post-caption-${post.id}`}
      className="post-card"
    >
      {/* Screen reader announcements */}
      <div
        ref={announceRef}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      />

      {/* Post Header */}
      <header className="post-header">
        <a
          href={`/profile/${post.user.username}`}
          aria-label={`View ${post.user.username}'s profile`}
        >
          <img
            src={post.user.avatarUrl}
            alt=""
            aria-hidden="true"
            className="avatar"
          />
          <span id={`post-author-${post.id}`}>
            {post.user.username}
            {post.user.isVerified && (
              <span aria-label="Verified account">
                <VerifiedBadge aria-hidden="true" />
              </span>
            )}
          </span>
        </a>
        <time dateTime={post.createdAt}>
          {formatRelativeTime(post.createdAt)}
        </time>
      </header>

      {/* Post Media */}
      <figure className="post-media">
        {post.mediaType === 'carousel' ? (
          <AccessibleCarousel
            items={post.media}
            postId={post.id}
          />
        ) : (
          <img
            src={post.media[0].url}
            alt={post.media[0].altText || `Photo by ${post.user.username}`}
            loading="lazy"
          />
        )}
      </figure>

      {/* Action Buttons */}
      <div className="post-actions" role="toolbar" aria-label="Post actions">
        <button
          onClick={handleLike}
          aria-pressed={isLiked}
          aria-label={isLiked ? 'Unlike post' : 'Like post'}
        >
          {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
        </button>

        <button
          onClick={onComment}
          aria-label={`Comment on post. ${post.commentCount} comments`}
        >
          <CommentIcon aria-hidden="true" />
        </button>

        <button
          onClick={onShare}
          aria-label="Share post"
        >
          <ShareIcon aria-hidden="true" />
        </button>

        <button
          onClick={onSave}
          aria-pressed={post.isSavedByMe}
          aria-label={post.isSavedByMe ? 'Remove from saved' : 'Save post'}
        >
          {post.isSavedByMe ? <BookmarkFilledIcon /> : <BookmarkIcon />}
        </button>
      </div>

      {/* Like Count */}
      <div className="like-count" aria-live="polite">
        <span aria-label={`${likeCount} likes`}>
          {formatCount(likeCount)} likes
        </span>
      </div>

      {/* Caption */}
      <div id={`post-caption-${post.id}`} className="caption">
        <a href={`/profile/${post.user.username}`}>
          <strong>{post.user.username}</strong>
        </a>{' '}
        <ExpandableText text={post.caption} maxLength={125} />
      </div>

      {/* Comments Preview */}
      <button
        className="view-comments"
        onClick={onComment}
        aria-label={`View all ${post.commentCount} comments`}
      >
        View all {formatCount(post.commentCount)} comments
      </button>
    </article>
  );
};
```

### 13.3 Accessible Story Viewer

```typescript
const AccessibleStoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  initialIndex,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const story = stories[currentIndex];
  const totalStories = stories.length;

  // Focus trap
  useFocusTrap(containerRef);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsPaused(prev => !prev);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  const goToNext = () => {
    if (currentIndex < totalStories - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  return (
    <div
      ref={containerRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Story by ${story.user.username}, ${currentIndex + 1} of ${totalStories}`}
      className="story-viewer"
    >
      {/* Progress indicators */}
      <div
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Story ${currentIndex + 1} of ${totalStories}, ${Math.round(progress)}% complete`}
        className="story-progress"
      >
        {stories.map((_, index) => (
          <div
            key={index}
            className={`progress-segment ${
              index < currentIndex ? 'completed' :
              index === currentIndex ? 'active' : 'pending'
            }`}
            style={{
              '--progress': index === currentIndex ? `${progress}%` : undefined
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Story header */}
      <header className="story-header">
        <img
          src={story.user.avatarUrl}
          alt=""
          aria-hidden="true"
          className="avatar"
        />
        <div>
          <span className="username">{story.user.username}</span>
          <time dateTime={story.createdAt}>
            {formatRelativeTime(story.createdAt)}
          </time>
        </div>

        <button
          onClick={() => setIsPaused(prev => !prev)}
          aria-label={isPaused ? 'Resume story' : 'Pause story'}
          aria-pressed={isPaused}
        >
          {isPaused ? <PlayIcon /> : <PauseIcon />}
        </button>

        <button onClick={onClose} aria-label="Close story viewer">
          <CloseIcon aria-hidden="true" />
        </button>
      </header>

      {/* Story content */}
      <div className="story-content">
        {story.type === 'image' ? (
          <img
            src={story.mediaUrl}
            alt={story.altText || `Story by ${story.user.username}`}
          />
        ) : (
          <video
            src={story.mediaUrl}
            autoPlay
            muted={false}
            playsInline
            aria-label={`Video story by ${story.user.username}`}
          />
        )}
      </div>

      {/* Navigation regions */}
      <button
        className="story-nav story-nav-prev"
        onClick={goToPrevious}
        disabled={currentIndex === 0}
        aria-label="Previous story"
      >
        <span className="sr-only">Previous</span>
      </button>

      <button
        className="story-nav story-nav-next"
        onClick={goToNext}
        aria-label="Next story"
      >
        <span className="sr-only">Next</span>
      </button>

      {/* Reply input */}
      <div className="story-reply">
        <input
          type="text"
          placeholder={`Reply to ${story.user.username}...`}
          aria-label={`Reply to ${story.user.username}'s story`}
        />
      </div>
    </div>
  );
};
```

### 13.4 Feed Keyboard Navigation

```typescript
const AccessibleFeed: React.FC = () => {
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const postsRef = useRef<HTMLElement[]>([]);
  const { data, fetchNextPage } = useFeed();

  const posts = data?.pages.flatMap(p => p.posts) ?? [];

  // Register post refs
  const registerPost = (index: number) => (el: HTMLElement | null) => {
    if (el) postsRef.current[index] = el;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'j' || e.key === 'ArrowDown') {
        e.preventDefault();
        setFocusedIndex(prev => Math.min(prev + 1, posts.length - 1));
      } else if (e.key === 'k' || e.key === 'ArrowUp') {
        e.preventDefault();
        setFocusedIndex(prev => Math.max(prev - 1, 0));
      } else if (e.key === 'l' && focusedIndex >= 0) {
        // Like current post
        likePost(posts[focusedIndex].id);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [focusedIndex, posts]);

  // Focus management
  useEffect(() => {
    if (focusedIndex >= 0 && postsRef.current[focusedIndex]) {
      postsRef.current[focusedIndex].focus();
      postsRef.current[focusedIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }, [focusedIndex]);

  return (
    <main aria-label="Instagram feed">
      {/* Skip link */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* Keyboard shortcuts help */}
      <div className="sr-only" aria-live="polite">
        Press J to go to next post, K for previous, L to like
      </div>

      <section id="main-content" aria-label="Posts">
        {posts.map((post, index) => (
          <article
            key={post.id}
            ref={registerPost(index)}
            tabIndex={0}
            aria-posinset={index + 1}
            aria-setsize={posts.length}
            className={focusedIndex === index ? 'focused' : ''}
          >
            <AccessiblePostCard post={post} />
          </article>
        ))}
      </section>
    </main>
  );
};
```

### 13.5 Screen Reader Utilities

```typescript
// Visually hidden but accessible to screen readers
const srOnlyStyles: React.CSSProperties = {
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

const ScreenReaderOnly: React.FC<{ children: React.ReactNode }> = ({
  children
}) => (
  <span style={srOnlyStyles}>{children}</span>
);

// Live region for announcements
const useLiveAnnouncer = () => {
  const [message, setMessage] = useState('');

  const announce = useCallback((text: string, priority: 'polite' | 'assertive' = 'polite') => {
    setMessage('');
    // Small delay to ensure screen readers pick up the change
    setTimeout(() => setMessage(text), 100);
  }, []);

  const Announcer = useMemo(() => (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={srOnlyStyles}
    >
      {message}
    </div>
  ), [message]);

  return { announce, Announcer };
};

// Focus trap for modals
const useFocusTrap = (containerRef: React.RefObject<HTMLElement>) => {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    };

    // Focus first element on mount
    firstElement?.focus();

    container.addEventListener('keydown', handleTab);
    return () => container.removeEventListener('keydown', handleTab);
  }, [containerRef]);
};
```

### 13.6 Reduced Motion Support

```typescript
// Hook for respecting user's motion preferences
const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
};

// Accessible like animation
const LikeAnimation: React.FC<{ isActive: boolean }> = ({ isActive }) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (!isActive) return null;

  if (prefersReducedMotion) {
    // Simple fade instead of bouncing heart
    return (
      <div className="like-indicator like-indicator-simple">
        <HeartIcon />
      </div>
    );
  }

  return (
    <div className="like-indicator like-indicator-animated">
      <HeartIcon />
    </div>
  );
};

// CSS for motion preferences
const motionStyles = `
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }

    .story-progress .progress-segment {
      transition: none;
    }

    .carousel-slide {
      scroll-behavior: auto;
    }
  }
`;
```

### 13.7 Accessibility Checklist

```
□ WCAG 2.1 AA Compliance
  ├── □ Color contrast ratio ≥ 4.5:1 for text
  ├── □ Focus indicators visible
  ├── □ Touch targets ≥ 44x44px
  └── □ Text scalable to 200%

□ Screen Reader Support
  ├── □ All images have alt text
  ├── □ Form inputs have labels
  ├── □ Buttons have accessible names
  ├── □ Live regions for dynamic content
  └── □ Landmarks for navigation

□ Keyboard Navigation
  ├── □ All interactive elements focusable
  ├── □ Logical tab order
  ├── □ Skip links for main content
  ├── □ Escape closes modals
  └── □ Arrow keys for carousels/stories

□ Motion & Animation
  ├── □ Respect prefers-reduced-motion
  ├── □ No auto-playing video with sound
  ├── □ Pause controls for animations
  └── □ No flashing content (< 3 flashes/sec)

□ Stories & Media
  ├── □ Pause/play controls accessible
  ├── □ Progress announced to screen readers
  ├── □ Video captions available
  └── □ Touch navigation alternatives
```

---

## 14. Security Implementation

### 14.1 Security Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Frontend Security Layers                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                Content Security Policy (CSP)                  │   │
│  │  script-src 'self'; img-src 'self' cdn.instagram.com;        │   │
│  │  connect-src 'self' api.instagram.com; frame-ancestors 'none'│   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    XSS Prevention                             │   │
│  │  • DOMPurify for user content    • React auto-escaping       │   │
│  │  • CSP nonce for inline scripts  • Trusted Types             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Authentication                             │   │
│  │  • JWT access tokens (15min)     • Refresh tokens (7 days)   │   │
│  │  • Secure HttpOnly cookies       • Token rotation             │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Input Validation                           │   │
│  │  • Zod schema validation         • File type verification    │   │
│  │  • Size limits enforcement       • Rate limiting              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 14.2 Authentication & Token Management

```typescript
// Secure token storage and management
class AuthTokenManager {
  private accessToken: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  // Store access token in memory only (not localStorage)
  setAccessToken(token: string): void {
    this.accessToken = token;
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  // Refresh token stored in HttpOnly cookie by server
  async refreshAccessToken(): Promise<string> {
    // Prevent multiple simultaneous refresh requests
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performRefresh();

    try {
      const token = await this.refreshPromise;
      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performRefresh(): Promise<string> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Send HttpOnly cookie
    });

    if (!response.ok) {
      this.clearAuth();
      throw new AuthenticationError('Session expired');
    }

    const { accessToken } = await response.json();
    this.setAccessToken(accessToken);
    return accessToken;
  }

  clearAuth(): void {
    this.accessToken = null;
    // Server will clear the refresh token cookie
  }
}

// Axios interceptor for automatic token refresh
const setupAuthInterceptor = (tokenManager: AuthTokenManager) => {
  api.interceptors.request.use(async (config) => {
    let token = tokenManager.getAccessToken();

    if (!token) {
      token = await tokenManager.refreshAccessToken();
    }

    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const token = await tokenManager.refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        } catch (refreshError) {
          // Redirect to login
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );
};
```

### 14.3 XSS Prevention

```typescript
import DOMPurify from 'dompurify';

// Sanitize user-generated content
const sanitizeConfig: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'], // Always add target="_blank"
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover'],
};

// Configure DOMPurify to add rel="noopener" to links
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    node.setAttribute('target', '_blank');
    node.setAttribute('rel', 'noopener noreferrer');
  }
});

const sanitizeHTML = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, sanitizeConfig);
};

// Safe caption renderer
const Caption: React.FC<{ text: string; mentions: Mention[] }> = ({
  text,
  mentions,
}) => {
  // Parse and render caption with mentions and hashtags
  const renderCaption = () => {
    let result = text;

    // Escape HTML first
    result = escapeHtml(result);

    // Convert @mentions to links (after escaping)
    mentions.forEach((mention) => {
      const regex = new RegExp(`@${escapeRegex(mention.username)}`, 'g');
      result = result.replace(
        regex,
        `<a href="/profile/${mention.username}" class="mention">@${mention.username}</a>`
      );
    });

    // Convert #hashtags to links
    result = result.replace(
      /#(\w+)/g,
      '<a href="/explore/tags/$1" class="hashtag">#$1</a>'
    );

    // Sanitize the final HTML
    return sanitizeHTML(result);
  };

  return (
    <div
      className="caption"
      dangerouslySetInnerHTML={{ __html: renderCaption() }}
    />
  );
};

// Escape special HTML characters
const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
};

// Escape special regex characters
const escapeRegex = (text: string): string => {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};
```

### 14.4 Content Security Policy

```typescript
// CSP configuration for Instagram-like app
const cspConfig = {
  directives: {
    'default-src': ["'self'"],
    'script-src': [
      "'self'",
      "'nonce-{NONCE}'", // Dynamic nonce for inline scripts
      'https://www.google-analytics.com',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Required for styled-components/emotion
    ],
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https://cdn.instagram.com',
      'https://*.cloudfront.net',
    ],
    'media-src': [
      "'self'",
      'blob:',
      'https://cdn.instagram.com',
      'https://*.cloudfront.net',
    ],
    'connect-src': [
      "'self'",
      'https://api.instagram.com',
      'wss://realtime.instagram.com',
      'https://www.google-analytics.com',
    ],
    'font-src': ["'self'", 'https://fonts.gstatic.com'],
    'frame-src': ["'none'"],
    'frame-ancestors': ["'none'"],
    'object-src': ["'none'"],
    'base-uri': ["'self'"],
    'form-action': ["'self'"],
    'upgrade-insecure-requests': [],
  },
};

// Generate CSP header string
const generateCSPHeader = (nonce: string): string => {
  return Object.entries(cspConfig.directives)
    .map(([key, values]) => {
      const processedValues = values.map((v) =>
        v.replace('{NONCE}', nonce)
      );
      return `${key} ${processedValues.join(' ')}`;
    })
    .join('; ');
};

// React helmet for CSP meta tag
const SecurityHeaders: React.FC<{ nonce: string }> = ({ nonce }) => (
  <Helmet>
    <meta
      httpEquiv="Content-Security-Policy"
      content={generateCSPHeader(nonce)}
    />
    <meta name="referrer" content="strict-origin-when-cross-origin" />
    <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
    <meta httpEquiv="X-Frame-Options" content="DENY" />
  </Helmet>
);
```

### 14.5 Input Validation with Zod

```typescript
import { z } from 'zod';

// Post creation schema
const createPostSchema = z.object({
  caption: z
    .string()
    .max(2200, 'Caption must be 2200 characters or less')
    .refine(
      (val) => !containsMaliciousPatterns(val),
      'Caption contains invalid content'
    ),
  media: z
    .array(
      z.object({
        type: z.enum(['image', 'video']),
        url: z.string().url(),
        altText: z.string().max(500).optional(),
      })
    )
    .min(1, 'At least one media item required')
    .max(10, 'Maximum 10 media items allowed'),
  location: z
    .object({
      id: z.string().uuid(),
      name: z.string().max(100),
    })
    .optional(),
  mentions: z
    .array(z.string().regex(/^[a-zA-Z0-9._]+$/))
    .max(20)
    .optional(),
  hashtags: z
    .array(z.string().regex(/^[a-zA-Z0-9]+$/))
    .max(30)
    .optional(),
});

// Comment schema
const createCommentSchema = z.object({
  postId: z.string().uuid(),
  text: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment must be 1000 characters or less')
    .refine(
      (val) => !containsMaliciousPatterns(val),
      'Comment contains invalid content'
    ),
  parentId: z.string().uuid().optional(),
});

// Profile update schema
const updateProfileSchema = z.object({
  fullName: z.string().max(100).optional(),
  bio: z.string().max(150).optional(),
  website: z
    .string()
    .url()
    .refine(
      (url) => {
        const parsed = new URL(url);
        return ['http:', 'https:'].includes(parsed.protocol);
      },
      'Invalid URL protocol'
    )
    .optional(),
  email: z.string().email().optional(),
});

// Check for malicious patterns
const containsMaliciousPatterns = (text: string): boolean => {
  const maliciousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+=/i, // onclick=, onerror=, etc.
    /data:text\/html/i,
    /vbscript:/i,
  ];

  return maliciousPatterns.some((pattern) => pattern.test(text));
};

// Validation hook
const useValidation = <T extends z.ZodSchema>(schema: T) => {
  const validate = useCallback(
    (data: unknown): z.infer<T> => {
      const result = schema.safeParse(data);

      if (!result.success) {
        const errors = result.error.errors.map((e) => ({
          path: e.path.join('.'),
          message: e.message,
        }));
        throw new ValidationError(errors);
      }

      return result.data;
    },
    [schema]
  );

  return { validate };
};
```

### 14.6 File Upload Security

```typescript
// Secure file upload validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm'];
const MAX_IMAGE_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_VIDEO_SIZE = 250 * 1024 * 1024; // 250MB

interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFile?: File;
}

const validateMediaFile = async (file: File): Promise<FileValidationResult> => {
  // 1. Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'mp4', 'mov', 'webm'];

  if (!extension || !allowedExtensions.includes(extension)) {
    return { isValid: false, error: 'Invalid file type' };
  }

  // 2. Verify MIME type matches extension
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    return { isValid: false, error: 'Invalid file format' };
  }

  // 3. Check file size
  const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
  if (file.size > maxSize) {
    const maxMB = maxSize / (1024 * 1024);
    return { isValid: false, error: `File size exceeds ${maxMB}MB limit` };
  }

  // 4. Verify file magic bytes (file signature)
  const isValidSignature = await verifyFileSignature(file);
  if (!isValidSignature) {
    return { isValid: false, error: 'File content does not match type' };
  }

  // 5. For images, check for embedded scripts
  if (isImage) {
    const hasEmbeddedScript = await checkForEmbeddedScripts(file);
    if (hasEmbeddedScript) {
      return { isValid: false, error: 'File contains invalid data' };
    }
  }

  return { isValid: true, sanitizedFile: file };
};

// Verify file signature (magic bytes)
const verifyFileSignature = async (file: File): Promise<boolean> => {
  const signatures: Record<string, number[][]> = {
    'image/jpeg': [[0xFF, 0xD8, 0xFF]],
    'image/png': [[0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]],
    'image/webp': [[0x52, 0x49, 0x46, 0x46]], // RIFF
    'video/mp4': [[0x00, 0x00, 0x00], [0x66, 0x74, 0x79, 0x70]], // ftyp
  };

  const buffer = await file.slice(0, 12).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  const expectedSignatures = signatures[file.type];
  if (!expectedSignatures) return true; // No signature check available

  return expectedSignatures.some((sig) =>
    sig.every((byte, index) => bytes[index] === byte)
  );
};

// Check for embedded scripts in images
const checkForEmbeddedScripts = async (file: File): Promise<boolean> => {
  const text = await file.text();
  const suspiciousPatterns = [
    /<script/i,
    /javascript:/i,
    /<?php/i,
    /<\?=/i,
  ];

  return suspiciousPatterns.some((pattern) => pattern.test(text));
};
```

### 14.7 CSRF Protection

```typescript
// CSRF token management
class CSRFProtection {
  private token: string | null = null;

  async getToken(): Promise<string> {
    if (this.token) return this.token;

    // Fetch CSRF token from server
    const response = await fetch('/api/csrf-token', {
      credentials: 'include',
    });
    const { token } = await response.json();
    this.token = token;
    return token;
  }

  // Add CSRF token to requests
  async addToRequest(config: AxiosRequestConfig): Promise<AxiosRequestConfig> {
    const safeMethods = ['GET', 'HEAD', 'OPTIONS'];
    const method = config.method?.toUpperCase();

    if (method && !safeMethods.includes(method)) {
      const token = await this.getToken();
      config.headers = {
        ...config.headers,
        'X-CSRF-Token': token,
      };
    }

    return config;
  }

  // Invalidate token on 403
  invalidate(): void {
    this.token = null;
  }
}

// Setup CSRF interceptor
const csrf = new CSRFProtection();

api.interceptors.request.use(
  (config) => csrf.addToRequest(config),
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      csrf.invalidate();
    }
    return Promise.reject(error);
  }
);
```

### 14.8 Security Checklist

```
□ Authentication & Sessions
  ├── □ JWT tokens with short expiry (15 min)
  ├── □ Refresh tokens in HttpOnly cookies
  ├── □ Secure and SameSite cookie flags
  ├── □ Token rotation on refresh
  └── □ Logout invalidates all tokens

□ XSS Prevention
  ├── □ DOMPurify for user content
  ├── □ React auto-escaping used
  ├── □ CSP headers configured
  ├── □ No dangerouslySetInnerHTML without sanitization
  └── □ Trusted Types enabled

□ CSRF Protection
  ├── □ CSRF tokens for state-changing requests
  ├── □ SameSite cookie attribute
  ├── □ Origin/Referer validation
  └── □ Double-submit cookie pattern

□ Input Validation
  ├── □ Zod schemas for all inputs
  ├── □ File type verification (magic bytes)
  ├── □ Size limits enforced
  └── □ Malicious pattern detection

□ Secure Communication
  ├── □ HTTPS only (HSTS)
  ├── □ Certificate pinning (mobile)
  ├── □ WebSocket over TLS (wss://)
  └── □ API request signing

□ Content Security
  ├── □ Media served from separate domain
  ├── □ User uploads scanned for malware
  ├── □ Image EXIF data stripped
  └── □ No executable file uploads
```

---

## 15. Mobile & Touch Interactions

### 15.1 Touch Interaction Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Mobile Touch Layer                                │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐ │
│  │  Tap/Click  │  │   Swipe     │  │  Long Press │  │   Pinch     │ │
│  │  Detection  │  │  Gestures   │  │   Handler   │  │   Zoom      │ │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘ │
│         │                │                │                │        │
│         ▼                ▼                ▼                ▼        │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Gesture Recognizer                        │   │
│  │  • Velocity tracking    • Direction detection               │   │
│  │  • Multi-touch support  • Conflict resolution               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Haptic Feedback                            │   │
│  │  • Like confirmation    • Pull-to-refresh trigger            │   │
│  │  • Long press activated • Error feedback                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 15.2 Double-Tap to Like

```typescript
interface DoubleTapConfig {
  delay?: number;
  onSingleTap?: () => void;
  onDoubleTap: () => void;
}

function useDoubleTap({
  delay = 300,
  onSingleTap,
  onDoubleTap,
}: DoubleTapConfig) {
  const lastTapRef = useRef<number>(0);
  const singleTapTimeoutRef = useRef<NodeJS.Timeout>();
  const tapPositionRef = useRef<{ x: number; y: number } | null>(null);

  const handleTap = useCallback(
    (event: React.TouchEvent | React.MouseEvent) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapRef.current;

      // Get tap position
      const position = 'touches' in event
        ? { x: event.touches[0].clientX, y: event.touches[0].clientY }
        : { x: event.clientX, y: event.clientY };

      // Check if tap is in same area (within 50px)
      const isSameArea = tapPositionRef.current
        ? Math.abs(position.x - tapPositionRef.current.x) < 50 &&
          Math.abs(position.y - tapPositionRef.current.y) < 50
        : true;

      if (timeSinceLastTap < delay && timeSinceLastTap > 0 && isSameArea) {
        // Double tap detected
        clearTimeout(singleTapTimeoutRef.current);
        lastTapRef.current = 0;
        tapPositionRef.current = null;
        onDoubleTap();

        // Trigger haptic feedback
        triggerHaptic('medium');
      } else {
        // Potential single tap
        lastTapRef.current = now;
        tapPositionRef.current = position;

        if (onSingleTap) {
          singleTapTimeoutRef.current = setTimeout(() => {
            onSingleTap();
            lastTapRef.current = 0;
          }, delay);
        }
      }
    },
    [delay, onSingleTap, onDoubleTap]
  );

  useEffect(() => {
    return () => clearTimeout(singleTapTimeoutRef.current);
  }, []);

  return {
    onTouchEnd: handleTap,
    onClick: handleTap,
  };
}

// Heart animation on double-tap
const PostMedia: React.FC<{ post: Post; onLike: () => void }> = ({
  post,
  onLike,
}) => {
  const [showHeart, setShowHeart] = useState(false);
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 });

  const doubleTapHandlers = useDoubleTap({
    onDoubleTap: () => {
      if (!post.isLikedByMe) {
        onLike();
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1000);
      }
    },
  });

  return (
    <div className="post-media-container" {...doubleTapHandlers}>
      <img src={post.mediaUrl} alt={post.altText} />

      {showHeart && (
        <div
          className="like-heart-animation"
          style={{ left: heartPosition.x, top: heartPosition.y }}
        >
          <HeartIcon />
        </div>
      )}
    </div>
  );
};
```

### 15.3 Pull-to-Refresh

```typescript
interface PullToRefreshConfig {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
}

function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: PullToRefreshConfig) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startYRef = useRef(0);
  const isPullingRef = useRef(false);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const container = containerRef.current;
    if (!container || container.scrollTop > 0) return;

    startYRef.current = e.touches[0].clientY;
    isPullingRef.current = true;
  }, []);

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPullingRef.current || isRefreshing) return;

      const container = containerRef.current;
      if (!container || container.scrollTop > 0) return;

      const currentY = e.touches[0].clientY;
      const diff = currentY - startYRef.current;

      if (diff > 0) {
        e.preventDefault();
        // Apply resistance - pull gets harder as you go
        const dampedPull = Math.min(diff * 0.5, maxPull);
        setPullDistance(dampedPull);

        // Haptic at threshold
        if (dampedPull >= threshold && pullDistance < threshold) {
          triggerHaptic('light');
        }
      }
    },
    [isRefreshing, maxPull, threshold, pullDistance]
  );

  const handleTouchEnd = useCallback(async () => {
    if (!isPullingRef.current) return;
    isPullingRef.current = false;

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      triggerHaptic('medium');

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, threshold, isRefreshing, onRefresh]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  const progress = Math.min(pullDistance / threshold, 1);

  return {
    containerRef,
    pullDistance,
    isRefreshing,
    progress,
    PullIndicator: (
      <div
        className="pull-indicator"
        style={{
          transform: `translateY(${pullDistance}px)`,
          opacity: progress,
        }}
      >
        {isRefreshing ? (
          <Spinner />
        ) : (
          <RefreshIcon
            style={{
              transform: `rotate(${progress * 180}deg)`,
            }}
          />
        )}
      </div>
    ),
  };
}
```

### 15.4 Swipe Gestures for Stories

```typescript
interface SwipeGestureConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  velocityThreshold?: number;
}

function useSwipeGesture({
  onSwipeLeft,
  onSwipeRight,
  onSwipeUp,
  onSwipeDown,
  threshold = 50,
  velocityThreshold = 0.3,
}: SwipeGestureConfig) {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
      time: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!touchStartRef.current) return;

      const touchEnd = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
        time: Date.now(),
      };

      const deltaX = touchEnd.x - touchStartRef.current.x;
      const deltaY = touchEnd.y - touchStartRef.current.y;
      const deltaTime = touchEnd.time - touchStartRef.current.time;

      const velocityX = Math.abs(deltaX) / deltaTime;
      const velocityY = Math.abs(deltaY) / deltaTime;

      const isHorizontal = Math.abs(deltaX) > Math.abs(deltaY);

      if (isHorizontal) {
        if (Math.abs(deltaX) > threshold || velocityX > velocityThreshold) {
          if (deltaX > 0 && onSwipeRight) {
            triggerHaptic('light');
            onSwipeRight();
          } else if (deltaX < 0 && onSwipeLeft) {
            triggerHaptic('light');
            onSwipeLeft();
          }
        }
      } else {
        if (Math.abs(deltaY) > threshold || velocityY > velocityThreshold) {
          if (deltaY > 0 && onSwipeDown) {
            triggerHaptic('light');
            onSwipeDown();
          } else if (deltaY < 0 && onSwipeUp) {
            triggerHaptic('light');
            onSwipeUp();
          }
        }
      }

      touchStartRef.current = null;
    },
    [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, threshold, velocityThreshold]
  );

  return {
    onTouchStart: handleTouchStart,
    onTouchEnd: handleTouchEnd,
  };
}

// Story navigation with swipe
const StoryViewer: React.FC<StoryViewerProps> = ({
  stories,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const swipeHandlers = useSwipeGesture({
    onSwipeLeft: () => {
      if (currentIndex < stories.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        onClose();
      }
    },
    onSwipeRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      }
    },
    onSwipeDown: () => {
      onClose();
    },
  });

  return (
    <div className="story-viewer" {...swipeHandlers}>
      <StoryContent story={stories[currentIndex]} />
    </div>
  );
};
```

### 15.5 Long Press for Options

```typescript
interface LongPressConfig {
  onLongPress: () => void;
  duration?: number;
  onPressStart?: () => void;
  onPressEnd?: () => void;
}

function useLongPress({
  onLongPress,
  duration = 500,
  onPressStart,
  onPressEnd,
}: LongPressConfig) {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const isLongPressRef = useRef(false);

  const start = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      e.preventDefault();
      isLongPressRef.current = false;
      onPressStart?.();

      timeoutRef.current = setTimeout(() => {
        isLongPressRef.current = true;
        triggerHaptic('heavy');
        onLongPress();
      }, duration);
    },
    [duration, onLongPress, onPressStart]
  );

  const end = useCallback(() => {
    clearTimeout(timeoutRef.current);
    onPressEnd?.();
  }, [onPressEnd]);

  const cancel = useCallback(() => {
    clearTimeout(timeoutRef.current);
    onPressEnd?.();
  }, [onPressEnd]);

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  return {
    onTouchStart: start,
    onTouchEnd: end,
    onTouchMove: cancel,
    onMouseDown: start,
    onMouseUp: end,
    onMouseLeave: cancel,
  };
}

// Post card with long press options
const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const [showOptions, setShowOptions] = useState(false);

  const longPressHandlers = useLongPress({
    onLongPress: () => setShowOptions(true),
    onPressStart: () => {
      // Optional: slight scale down to indicate press
    },
  });

  return (
    <>
      <article className="post-card" {...longPressHandlers}>
        <PostContent post={post} />
      </article>

      {showOptions && (
        <BottomSheet onClose={() => setShowOptions(false)}>
          <PostOptionsMenu post={post} />
        </BottomSheet>
      )}
    </>
  );
};
```

### 15.6 Haptic Feedback

```typescript
type HapticIntensity = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error';

function triggerHaptic(intensity: HapticIntensity): void {
  // Check if Vibration API is available
  if (!navigator.vibrate) return;

  const patterns: Record<HapticIntensity, number | number[]> = {
    light: 10,
    medium: 20,
    heavy: 30,
    success: [10, 50, 10],
    warning: [20, 50, 20],
    error: [30, 50, 30, 50, 30],
  };

  navigator.vibrate(patterns[intensity]);
}

// iOS-specific haptic (requires native bridge or Capacitor)
async function triggerIOSHaptic(
  type: 'impact' | 'notification' | 'selection',
  style?: 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error'
): Promise<void> {
  if (typeof window !== 'undefined' && 'Capacitor' in window) {
    const { Haptics, ImpactStyle, NotificationType } = await import(
      '@capacitor/haptics'
    );

    switch (type) {
      case 'impact':
        await Haptics.impact({
          style: style === 'light'
            ? ImpactStyle.Light
            : style === 'heavy'
            ? ImpactStyle.Heavy
            : ImpactStyle.Medium,
        });
        break;
      case 'notification':
        await Haptics.notification({
          type: style === 'success'
            ? NotificationType.Success
            : style === 'error'
            ? NotificationType.Error
            : NotificationType.Warning,
        });
        break;
      case 'selection':
        await Haptics.selectionStart();
        break;
    }
  }
}
```

### 15.7 Safe Area & Mobile Layout

```typescript
// Safe area insets hook
function useSafeAreaInsets() {
  const [insets, setInsets] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    const updateInsets = () => {
      const computedStyle = getComputedStyle(document.documentElement);
      setInsets({
        top: parseInt(computedStyle.getPropertyValue('--sat') || '0'),
        right: parseInt(computedStyle.getPropertyValue('--sar') || '0'),
        bottom: parseInt(computedStyle.getPropertyValue('--sab') || '0'),
        left: parseInt(computedStyle.getPropertyValue('--sal') || '0'),
      });
    };

    updateInsets();
    window.addEventListener('resize', updateInsets);
    return () => window.removeEventListener('resize', updateInsets);
  }, []);

  return insets;
}

// CSS for safe areas
const safeAreaStyles = `
  :root {
    --sat: env(safe-area-inset-top);
    --sar: env(safe-area-inset-right);
    --sab: env(safe-area-inset-bottom);
    --sal: env(safe-area-inset-left);
  }

  .app-container {
    padding-top: var(--sat);
    padding-bottom: calc(var(--sab) + 56px); /* Bottom nav height */
    padding-left: var(--sal);
    padding-right: var(--sar);
  }

  .bottom-nav {
    padding-bottom: var(--sab);
  }

  .story-viewer {
    padding-top: var(--sat);
  }
`;

// Mobile bottom navigation
const BottomNavigation: React.FC = () => {
  const insets = useSafeAreaInsets();

  return (
    <nav
      className="bottom-nav"
      style={{ paddingBottom: insets.bottom }}
    >
      <NavButton icon={<HomeIcon />} to="/" label="Home" />
      <NavButton icon={<SearchIcon />} to="/explore" label="Explore" />
      <NavButton icon={<ReelsIcon />} to="/reels" label="Reels" />
      <NavButton icon={<ShopIcon />} to="/shop" label="Shop" />
      <NavButton icon={<ProfileIcon />} to="/profile" label="Profile" />
    </nav>
  );
};
```

### 15.8 Mobile Checklist

```
□ Touch Interactions
  ├── □ Double-tap to like with animation
  ├── □ Pull-to-refresh with resistance
  ├── □ Swipe gestures for navigation
  ├── □ Long press for context menu
  └── □ Pinch-to-zoom on images

□ Haptic Feedback
  ├── □ Like confirmation vibration
  ├── □ Pull-to-refresh threshold trigger
  ├── □ Long press activation
  └── □ Error feedback

□ Layout & Safe Areas
  ├── □ Safe area insets respected
  ├── □ Bottom navigation above home indicator
  ├── □ Status bar area accounted for
  └── □ Notch/Dynamic Island support

□ Performance
  ├── □ 60fps scroll performance
  ├── □ Touch response < 100ms
  ├── □ Smooth gesture animations
  └── □ No jank during interactions
```

---

## 16. Testing Strategy

### 16.1 Testing Pyramid

```
                    ┌─────────────┐
                    │     E2E     │  10%
                    │  (Playwright)│  ~50 tests
                    └──────┬──────┘
                           │
                ┌──────────┴──────────┐
                │    Integration      │  20%
                │  (React Testing Lib) │  ~200 tests
                └──────────┬──────────┘
                           │
        ┌──────────────────┴──────────────────┐
        │              Unit Tests              │  70%
        │         (Vitest / Jest)              │  ~1000 tests
        └──────────────────────────────────────┘
```

### 16.2 Unit Testing

```typescript
// Testing custom hooks
import { renderHook, act } from '@testing-library/react';
import { useDoubleTap } from './useDoubleTap';

describe('useDoubleTap', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should call onDoubleTap when tapped twice within delay', () => {
    const onDoubleTap = vi.fn();
    const { result } = renderHook(() =>
      useDoubleTap({ onDoubleTap, delay: 300 })
    );

    const mockEvent = { touches: [{ clientX: 100, clientY: 100 }] };

    act(() => {
      result.current.onTouchEnd(mockEvent as any);
    });

    act(() => {
      vi.advanceTimersByTime(100);
      result.current.onTouchEnd(mockEvent as any);
    });

    expect(onDoubleTap).toHaveBeenCalledTimes(1);
  });

  it('should not call onDoubleTap for single tap', () => {
    const onDoubleTap = vi.fn();
    const { result } = renderHook(() =>
      useDoubleTap({ onDoubleTap, delay: 300 })
    );

    act(() => {
      result.current.onTouchEnd({ touches: [{ clientX: 100, clientY: 100 }] } as any);
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onDoubleTap).not.toHaveBeenCalled();
  });
});

// Testing utility functions
describe('formatRelativeTime', () => {
  it('should return "now" for times less than a minute ago', () => {
    const result = formatRelativeTime(new Date(Date.now() - 30000));
    expect(result).toBe('now');
  });

  it('should return minutes for times less than an hour ago', () => {
    const result = formatRelativeTime(new Date(Date.now() - 5 * 60 * 1000));
    expect(result).toBe('5m');
  });

  it('should return hours for times less than a day ago', () => {
    const result = formatRelativeTime(new Date(Date.now() - 3 * 60 * 60 * 1000));
    expect(result).toBe('3h');
  });
});
```

### 16.3 Component Testing

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PostCard } from './PostCard';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const mockPost = {
  id: '123',
  user: {
    username: 'testuser',
    avatarUrl: '/avatar.jpg',
    isVerified: true,
  },
  mediaUrl: '/post.jpg',
  caption: 'Test caption #test',
  likeCount: 100,
  commentCount: 10,
  isLikedByMe: false,
  createdAt: new Date().toISOString(),
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('PostCard', () => {
  it('should render post content correctly', () => {
    render(<PostCard post={mockPost} />, { wrapper: createWrapper() });

    expect(screen.getByText('testuser')).toBeInTheDocument();
    expect(screen.getByText(/Test caption/)).toBeInTheDocument();
    expect(screen.getByText('100 likes')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /post/i })).toBeInTheDocument();
  });

  it('should show verified badge for verified users', () => {
    render(<PostCard post={mockPost} />, { wrapper: createWrapper() });

    expect(screen.getByLabelText('Verified account')).toBeInTheDocument();
  });

  it('should toggle like state on like button click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />, { wrapper: createWrapper() });

    const likeButton = screen.getByRole('button', { name: /like post/i });
    await user.click(likeButton);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /unlike post/i })).toBeInTheDocument();
      expect(screen.getByText('101 likes')).toBeInTheDocument();
    });
  });

  it('should navigate to profile on username click', async () => {
    const user = userEvent.setup();
    render(<PostCard post={mockPost} />, { wrapper: createWrapper() });

    const usernameLink = screen.getByRole('link', { name: /view testuser's profile/i });
    expect(usernameLink).toHaveAttribute('href', '/profile/testuser');
  });

  it('should be accessible', async () => {
    const { container } = render(<PostCard post={mockPost} />, {
      wrapper: createWrapper(),
    });

    // Check for proper ARIA attributes
    expect(screen.getByRole('article')).toBeInTheDocument();
    expect(screen.getByRole('toolbar', { name: /post actions/i })).toBeInTheDocument();

    // Run axe accessibility check
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

### 16.4 Integration Testing

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { Feed } from './Feed';
import { TestProviders } from '../test-utils';

const mockPosts = [
  { id: '1', user: { username: 'user1' }, caption: 'Post 1' },
  { id: '2', user: { username: 'user2' }, caption: 'Post 2' },
];

const server = setupServer(
  rest.get('/api/feed', (req, res, ctx) => {
    const cursor = req.url.searchParams.get('cursor');
    return res(
      ctx.json({
        posts: cursor ? [] : mockPosts,
        cursor: cursor ? null : 'next-cursor',
        hasMore: !cursor,
      })
    );
  }),

  rest.post('/api/posts/:postId/likes', (req, res, ctx) => {
    return res(ctx.json({ success: true }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Feed Integration', () => {
  it('should load and display posts', async () => {
    render(<Feed />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
      expect(screen.getByText('Post 2')).toBeInTheDocument();
    });
  });

  it('should handle like with optimistic update', async () => {
    const user = userEvent.setup();
    render(<Feed />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    const likeButton = screen.getAllByRole('button', { name: /like/i })[0];
    await user.click(likeButton);

    // Optimistic update should happen immediately
    expect(screen.getByRole('button', { name: /unlike/i })).toBeInTheDocument();
  });

  it('should rollback on API error', async () => {
    server.use(
      rest.post('/api/posts/:postId/likes', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    const user = userEvent.setup();
    render(<Feed />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    const likeButton = screen.getAllByRole('button', { name: /like/i })[0];
    await user.click(likeButton);

    // Should rollback after error
    await waitFor(() => {
      expect(screen.getAllByRole('button', { name: /like/i })[0]).toBeInTheDocument();
    });
  });

  it('should load more posts on scroll', async () => {
    render(<Feed />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getByText('Post 1')).toBeInTheDocument();
    });

    // Simulate scroll to bottom
    fireEvent.scroll(window, { target: { scrollY: 1000 } });

    // Verify fetch next page was called
    await waitFor(() => {
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });
});
```

### 16.5 E2E Testing with Playwright

```typescript
import { test, expect } from '@playwright/test';

test.describe('Instagram Feed', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');
    await page.fill('[name="username"]', 'testuser');
    await page.fill('[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('/');
  });

  test('should display feed with posts', async ({ page }) => {
    await expect(page.locator('article').first()).toBeVisible();
    await expect(page.getByRole('img').first()).toBeVisible();
  });

  test('should like post on double tap', async ({ page }) => {
    const post = page.locator('article').first();
    const media = post.locator('.post-media');

    // Double click to simulate double tap
    await media.dblclick();

    // Heart animation should appear
    await expect(post.locator('.like-heart-animation')).toBeVisible();

    // Like button should be active
    await expect(post.getByRole('button', { name: /unlike/i })).toBeVisible();
  });

  test('should navigate through stories', async ({ page }) => {
    // Click on first story
    await page.locator('.story-avatar').first().click();

    // Story viewer should open
    await expect(page.locator('.story-viewer')).toBeVisible();

    // Navigate to next story
    await page.click('.story-nav-next');

    // Progress bar should update
    await expect(page.locator('.progress-segment.active')).toHaveCount(1);

    // Close story viewer
    await page.keyboard.press('Escape');
    await expect(page.locator('.story-viewer')).not.toBeVisible();
  });

  test('should handle pull to refresh on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });

    // Simulate pull to refresh
    await page.locator('.feed-container').evaluate((el) => {
      el.scrollTop = 0;
    });

    await page.mouse.move(187, 100);
    await page.mouse.down();
    await page.mouse.move(187, 250, { steps: 10 });
    await page.mouse.up();

    // Refresh indicator should appear
    await expect(page.locator('.pull-indicator')).toBeVisible();
  });

  test('should be accessible', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });
});

test.describe('Story Creation', () => {
  test('should create a new story', async ({ page }) => {
    await page.goto('/');

    // Click add story button
    await page.click('[aria-label="Add story"]');

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-assets/test-image.jpg');

    // Add text overlay
    await page.click('[aria-label="Add text"]');
    await page.fill('.text-input', 'My Story');

    // Share story
    await page.click('button:has-text("Share")');

    // Should redirect back to feed
    await page.waitForURL('/');

    // New story should be visible
    await expect(page.locator('.story-avatar.has-story').first()).toBeVisible();
  });
});
```

### 16.6 Visual Regression Testing

```typescript
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('feed page screenshot', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Hide dynamic content
    await page.evaluate(() => {
      document.querySelectorAll('[data-testid="timestamp"]').forEach((el) => {
        (el as HTMLElement).style.visibility = 'hidden';
      });
    });

    await expect(page).toHaveScreenshot('feed-page.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.01,
    });
  });

  test('post card variants', async ({ page }) => {
    await page.goto('/');

    // Regular post
    const regularPost = page.locator('article').first();
    await expect(regularPost).toHaveScreenshot('post-regular.png');

    // Liked post
    await regularPost.locator('[aria-label="Like post"]').click();
    await expect(regularPost).toHaveScreenshot('post-liked.png');
  });

  test('dark mode', async ({ page }) => {
    await page.goto('/');
    await page.emulateMedia({ colorScheme: 'dark' });

    await expect(page).toHaveScreenshot('feed-dark-mode.png');
  });

  test('mobile layout', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    await expect(page).toHaveScreenshot('feed-mobile.png');
  });
});
```

### 16.7 Testing Checklist

```
□ Unit Tests
  ├── □ Custom hooks tested
  ├── □ Utility functions tested
  ├── □ State management tested
  └── □ Edge cases covered

□ Component Tests
  ├── □ Render correctly
  ├── □ User interactions work
  ├── □ Accessibility verified
  └── □ Error states handled

□ Integration Tests
  ├── □ API integration tested
  ├── □ Optimistic updates work
  ├── □ Error rollback works
  └── □ Infinite scroll works

□ E2E Tests
  ├── □ Critical user journeys
  ├── □ Cross-browser testing
  ├── □ Mobile interactions
  └── □ Accessibility audit

□ Visual Regression
  ├── □ Key pages captured
  ├── □ Component variants
  ├── □ Dark mode
  └── □ Responsive layouts
```

---

## 17. Offline/PWA Capabilities

### 17.1 Service Worker Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Service Worker Caching Strategy                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐                                                │
│  │  App Shell      │  Cache First                                   │
│  │  (HTML, JS, CSS)│  → Instant load                                │
│  └────────┬────────┘                                                │
│           │                                                          │
│  ┌────────▼────────┐                                                │
│  │  Feed API       │  Network First (5s timeout)                    │
│  │  (/api/feed)    │  → Fresh data, fallback to cache              │
│  └────────┬────────┘                                                │
│           │                                                          │
│  ┌────────▼────────┐                                                │
│  │  Media          │  Cache First                                   │
│  │  (images/videos)│  → CDN cached, local fallback                 │
│  └────────┬────────┘                                                │
│           │                                                          │
│  ┌────────▼────────┐                                                │
│  │  User Actions   │  Background Sync                               │
│  │  (likes, posts) │  → Queue offline, sync when online            │
│  └─────────────────┘                                                │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 17.2 Workbox Service Worker

```typescript
// sw.ts - Service Worker with Workbox
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

declare const self: ServiceWorkerGlobalScope;

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// App shell - Cache First
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: 'pages',
      networkTimeoutSeconds: 3,
    })
  )
);

// Feed API - Network First with timeout
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/feed'),
  new NetworkFirst({
    cacheName: 'feed-api',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 hour
      }),
    ],
  })
);

// User profile - Stale While Revalidate
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/users'),
  new StaleWhileRevalidate({
    cacheName: 'user-api',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 24 hours
      }),
    ],
  })
);

// Images - Cache First
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  })
);

// Background sync for likes
const bgSyncPlugin = new BackgroundSyncPlugin('likes-queue', {
  maxRetentionTime: 24 * 60, // 24 hours
});

registerRoute(
  ({ url }) => url.pathname.includes('/likes'),
  new NetworkFirst({
    plugins: [bgSyncPlugin],
  }),
  'POST'
);

// Background sync for comments
registerRoute(
  ({ url }) => url.pathname.includes('/comments'),
  new NetworkFirst({
    plugins: [
      new BackgroundSyncPlugin('comments-queue', {
        maxRetentionTime: 24 * 60,
      }),
    ],
  }),
  'POST'
);
```

### 17.3 IndexedDB for Offline Data

```typescript
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface InstagramDB extends DBSchema {
  posts: {
    key: string;
    value: Post;
    indexes: {
      'by-user': string;
      'by-date': string;
    };
  };
  feed: {
    key: string;
    value: {
      userId: string;
      postIds: string[];
      cursor: string | null;
      updatedAt: number;
    };
  };
  pendingActions: {
    key: string;
    value: {
      id: string;
      type: 'like' | 'unlike' | 'comment' | 'save';
      postId: string;
      data?: any;
      createdAt: number;
    };
  };
  media: {
    key: string;
    value: {
      url: string;
      blob: Blob;
      cachedAt: number;
    };
  };
}

class OfflineStorage {
  private db: IDBPDatabase<InstagramDB> | null = null;

  async init(): Promise<void> {
    this.db = await openDB<InstagramDB>('instagram-offline', 1, {
      upgrade(db) {
        // Posts store
        const postsStore = db.createObjectStore('posts', { keyPath: 'id' });
        postsStore.createIndex('by-user', 'userId');
        postsStore.createIndex('by-date', 'createdAt');

        // Feed store
        db.createObjectStore('feed', { keyPath: 'userId' });

        // Pending actions store
        db.createObjectStore('pendingActions', { keyPath: 'id' });

        // Media store
        db.createObjectStore('media', { keyPath: 'url' });
      },
    });
  }

  async saveFeed(userId: string, posts: Post[], cursor: string | null): Promise<void> {
    if (!this.db) await this.init();

    const tx = this.db!.transaction(['posts', 'feed'], 'readwrite');

    // Save individual posts
    for (const post of posts) {
      await tx.objectStore('posts').put(post);
    }

    // Save feed reference
    await tx.objectStore('feed').put({
      userId,
      postIds: posts.map(p => p.id),
      cursor,
      updatedAt: Date.now(),
    });

    await tx.done;
  }

  async getFeed(userId: string): Promise<{ posts: Post[]; cursor: string | null } | null> {
    if (!this.db) await this.init();

    const feed = await this.db!.get('feed', userId);
    if (!feed) return null;

    const posts = await Promise.all(
      feed.postIds.map(id => this.db!.get('posts', id))
    );

    return {
      posts: posts.filter(Boolean) as Post[],
      cursor: feed.cursor,
    };
  }

  async queueAction(action: Omit<InstagramDB['pendingActions']['value'], 'id' | 'createdAt'>): Promise<void> {
    if (!this.db) await this.init();

    await this.db!.put('pendingActions', {
      ...action,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    });
  }

  async getPendingActions(): Promise<InstagramDB['pendingActions']['value'][]> {
    if (!this.db) await this.init();
    return this.db!.getAll('pendingActions');
  }

  async removePendingAction(id: string): Promise<void> {
    if (!this.db) await this.init();
    await this.db!.delete('pendingActions', id);
  }

  async cacheMedia(url: string, blob: Blob): Promise<void> {
    if (!this.db) await this.init();

    await this.db!.put('media', {
      url,
      blob,
      cachedAt: Date.now(),
    });
  }

  async getMedia(url: string): Promise<Blob | null> {
    if (!this.db) await this.init();
    const cached = await this.db!.get('media', url);
    return cached?.blob ?? null;
  }
}

export const offlineStorage = new OfflineStorage();
```

### 17.4 Offline-First Feed Hook

```typescript
function useOfflineFeed() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const queryClient = useQueryClient();

  // Listen for online/offline events
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

  // Sync pending actions when coming online
  useEffect(() => {
    if (isOnline) {
      syncPendingActions();
    }
  }, [isOnline]);

  const syncPendingActions = async () => {
    const pending = await offlineStorage.getPendingActions();

    for (const action of pending) {
      try {
        switch (action.type) {
          case 'like':
            await api.post(`/posts/${action.postId}/likes`);
            break;
          case 'comment':
            await api.post(`/posts/${action.postId}/comments`, action.data);
            break;
        }
        await offlineStorage.removePendingAction(action.id);
      } catch (error) {
        console.error('Failed to sync action:', action.id);
      }
    }

    // Refresh feed after syncing
    queryClient.invalidateQueries(['feed']);
  };

  const feedQuery = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam }) => {
      try {
        const response = await api.get('/feed', {
          params: { cursor: pageParam },
        });

        // Cache for offline
        await offlineStorage.saveFeed(
          'current-user',
          response.data.posts,
          response.data.cursor
        );

        return response.data;
      } catch (error) {
        if (!isOnline) {
          // Return cached data when offline
          const cached = await offlineStorage.getFeed('current-user');
          if (cached) return cached;
        }
        throw error;
      }
    },
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const likePost = useMutation({
    mutationFn: async (postId: string) => {
      if (!isOnline) {
        // Queue for later
        await offlineStorage.queueAction({
          type: 'like',
          postId,
        });
        return { queued: true };
      }
      return api.post(`/posts/${postId}/likes`);
    },
    onMutate: async (postId) => {
      // Optimistic update works same for online/offline
      await queryClient.cancelQueries(['feed']);
      const previous = queryClient.getQueryData(['feed']);

      queryClient.setQueryData(['feed'], (old: any) => ({
        ...old,
        pages: old.pages.map((page: any) => ({
          ...page,
          posts: page.posts.map((post: Post) =>
            post.id === postId
              ? { ...post, isLikedByMe: true, likeCount: post.likeCount + 1 }
              : post
          ),
        })),
      }));

      return { previous };
    },
  });

  return {
    ...feedQuery,
    isOnline,
    likePost,
    pendingActionsCount: 0, // Could track this
  };
}
```

### 17.5 PWA Install Prompt

```typescript
function useInstallPrompt() {
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

    window.addEventListener('beforeinstallprompt', handleBeforeInstall as any);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall as any);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async (): Promise<boolean> => {
    if (!installPrompt) return false;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setInstallPrompt(null);
      return true;
    }
    return false;
  };

  return {
    canInstall: !!installPrompt && !isInstalled,
    isInstalled,
    promptInstall,
  };
}

// Install banner component
const InstallBanner: React.FC = () => {
  const { canInstall, promptInstall } = useInstallPrompt();
  const [dismissed, setDismissed] = useState(false);

  if (!canInstall || dismissed) return null;

  return (
    <div className="install-banner">
      <div className="install-content">
        <AppIcon />
        <div>
          <h3>Install Instagram</h3>
          <p>Add to home screen for the best experience</p>
        </div>
      </div>
      <div className="install-actions">
        <button onClick={() => setDismissed(true)}>Not now</button>
        <button onClick={promptInstall} className="primary">
          Install
        </button>
      </div>
    </div>
  );
};
```

### 17.6 Offline Indicator

```typescript
const OfflineIndicator: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Show "back online" briefly
      setShowBanner(true);
      setTimeout(() => setShowBanner(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showBanner) return null;

  return (
    <div
      className={`offline-banner ${isOnline ? 'online' : 'offline'}`}
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
          <WifiOffIcon />
          <span>You're offline. Some features may be limited.</span>
        </>
      )}
    </div>
  );
};
```

### 17.7 PWA Checklist

```
□ Service Worker
  ├── □ App shell cached
  ├── □ API responses cached
  ├── □ Images cached
  └── □ Background sync enabled

□ Offline Support
  ├── □ Feed viewable offline
  ├── □ Actions queued offline
  ├── □ Sync when back online
  └── □ Offline indicator shown

□ PWA Features
  ├── □ Web App Manifest
  ├── □ Install prompt
  ├── □ Splash screen
  └── □ Standalone mode

□ Performance
  ├── □ Cache-first for static assets
  ├── □ Network-first for API
  ├── □ IndexedDB for structured data
  └── □ Cache expiration configured
```

---

## 18. Internationalization (i18n)

### 18.1 i18n Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Internationalization Stack                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    i18next + React-i18next                    │   │
│  │  • Translation management  • Namespace loading               │   │
│  │  • Interpolation          • Pluralization                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Intl API (Native)                          │   │
│  │  • Number formatting      • Date/Time formatting             │   │
│  │  • Currency formatting    • Relative time                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    RTL Support                                │   │
│  │  • CSS logical properties • dir="rtl" attribute              │   │
│  │  • Mirrored layouts       • Bidirectional text               │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 18.2 i18next Configuration

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'ja', 'ko', 'zh', 'ar', 'hi', 'pt'],

    ns: ['common', 'feed', 'profile', 'settings', 'errors'],
    defaultNS: 'common',

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    interpolation: {
      escapeValue: false, // React already escapes
    },

    react: {
      useSuspense: true,
      bindI18n: 'languageChanged loaded',
    },
  });

export default i18n;

// RTL languages
export const RTL_LANGUAGES = ['ar', 'he', 'fa', 'ur'];

export const isRTL = (lang: string): boolean => {
  return RTL_LANGUAGES.includes(lang);
};
```

### 18.3 Translation Files Structure

```json
// locales/en/feed.json
{
  "post": {
    "like": "Like",
    "unlike": "Unlike",
    "comment": "Comment",
    "share": "Share",
    "save": "Save",
    "likes_count": "{{count}} like",
    "likes_count_plural": "{{count}} likes",
    "comments_count": "View all {{count}} comments",
    "posted_by": "Posted by {{username}}"
  },
  "story": {
    "your_story": "Your story",
    "add_story": "Add to story",
    "reply": "Reply to {{username}}...",
    "seen_by": "Seen by {{count}} person",
    "seen_by_plural": "Seen by {{count}} people"
  },
  "actions": {
    "follow": "Follow",
    "following": "Following",
    "unfollow": "Unfollow",
    "message": "Message",
    "edit_profile": "Edit Profile"
  },
  "empty": {
    "no_posts": "No posts yet",
    "no_stories": "No stories available",
    "follow_suggestion": "Follow accounts to see their posts"
  }
}

// locales/ar/feed.json (Arabic - RTL)
{
  "post": {
    "like": "إعجاب",
    "unlike": "إلغاء الإعجاب",
    "comment": "تعليق",
    "share": "مشاركة",
    "save": "حفظ",
    "likes_count": "إعجاب واحد",
    "likes_count_plural": "{{count}} إعجابات",
    "comments_count": "عرض جميع التعليقات ({{count}})",
    "posted_by": "نشر بواسطة {{username}}"
  }
}
```

### 18.4 Pluralization & Interpolation

```typescript
import { useTranslation, Trans } from 'react-i18next';

const PostStats: React.FC<{ post: Post }> = ({ post }) => {
  const { t } = useTranslation('feed');

  return (
    <div className="post-stats">
      {/* Pluralization */}
      <span className="likes">
        {t('post.likes_count', { count: post.likeCount })}
      </span>

      {/* Complex interpolation */}
      <button>
        {t('post.comments_count', { count: post.commentCount })}
      </button>

      {/* With components */}
      <Trans
        i18nKey="post.liked_by"
        values={{ username: post.topLiker }}
        components={{
          bold: <strong />,
          link: <a href={`/profile/${post.topLiker}`} />,
        }}
      >
        Liked by <link><bold>{{username}}</bold></link> and others
      </Trans>
    </div>
  );
};

// Custom pluralization rules for Arabic
i18n.services.pluralResolver.addRule('ar', {
  numbers: [0, 1, 2, 'few', 'many', 'other'],
  plurals: (n: number) => {
    if (n === 0) return 0;
    if (n === 1) return 1;
    if (n === 2) return 2;
    if (n % 100 >= 3 && n % 100 <= 10) return 3; // few
    if (n % 100 >= 11) return 4; // many
    return 5; // other
  },
});
```

### 18.5 Date & Number Formatting

```typescript
// Formatters using Intl API
const formatters = {
  number: (locale: string) => new Intl.NumberFormat(locale, {
    notation: 'compact',
    compactDisplay: 'short',
  }),

  currency: (locale: string, currency: string) => new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }),

  date: (locale: string) => new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }),

  relativeTime: (locale: string) => new Intl.RelativeTimeFormat(locale, {
    numeric: 'auto',
    style: 'narrow',
  }),
};

// Relative time hook
function useRelativeTime(date: Date | string): string {
  const { i18n } = useTranslation();
  const [relative, setRelative] = useState('');

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      const then = new Date(date).getTime();
      const diff = now - then;

      const rtf = formatters.relativeTime(i18n.language);

      if (diff < 60000) {
        setRelative(rtf.format(0, 'second')); // "now"
      } else if (diff < 3600000) {
        setRelative(rtf.format(-Math.floor(diff / 60000), 'minute'));
      } else if (diff < 86400000) {
        setRelative(rtf.format(-Math.floor(diff / 3600000), 'hour'));
      } else if (diff < 604800000) {
        setRelative(rtf.format(-Math.floor(diff / 86400000), 'day'));
      } else {
        // Use absolute date for older posts
        setRelative(formatters.date(i18n.language).format(new Date(date)));
      }
    };

    update();
    const interval = setInterval(update, 60000);
    return () => clearInterval(interval);
  }, [date, i18n.language]);

  return relative;
}

// Compact number formatting
function useCompactNumber(value: number): string {
  const { i18n } = useTranslation();
  return useMemo(() => {
    return formatters.number(i18n.language).format(value);
  }, [value, i18n.language]);
}
```

### 18.6 RTL Support

```typescript
// RTL provider
const RTLProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const isRtl = isRTL(i18n.language);

  useEffect(() => {
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [isRtl, i18n.language]);

  return (
    <div className={isRtl ? 'rtl' : 'ltr'}>
      {children}
    </div>
  );
};

// CSS with logical properties
const rtlStyles = `
  /* Use logical properties instead of physical */
  .post-card {
    padding-inline-start: 16px;
    padding-inline-end: 16px;
    margin-block-end: 24px;
  }

  .post-header {
    display: flex;
    flex-direction: row;
    gap: 12px;
  }

  .avatar {
    margin-inline-end: 8px;
  }

  .post-actions {
    display: flex;
    gap: 16px;
  }

  /* Icon mirroring for RTL */
  [dir="rtl"] .icon-back,
  [dir="rtl"] .icon-forward,
  [dir="rtl"] .icon-share {
    transform: scaleX(-1);
  }

  /* Text alignment */
  .caption {
    text-align: start;
  }

  /* Flexbox auto-reversal */
  [dir="rtl"] .story-bar {
    flex-direction: row-reverse;
  }

  /* Scroll direction */
  [dir="rtl"] .horizontal-scroll {
    direction: rtl;
  }
`;

// Bidirectional text handling
const BidiText: React.FC<{ children: string }> = ({ children }) => {
  // Detect if text contains RTL characters
  const hasRTL = /[\u0591-\u07FF\uFB1D-\uFDFD\uFE70-\uFEFC]/.test(children);
  const hasLTR = /[A-Za-z]/.test(children);

  if (hasRTL && hasLTR) {
    // Mixed content - use unicode isolate
    return <span dir="auto">{children}</span>;
  }

  return <span>{children}</span>;
};
```

### 18.7 Language Switcher

```typescript
const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation('settings');
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語' },
    { code: 'ko', name: 'Korean', nativeName: '한국어' },
    { code: 'zh', name: 'Chinese', nativeName: '中文' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  ];

  const currentLanguage = languages.find(l => l.code === i18n.language);

  const changeLanguage = async (code: string) => {
    await i18n.changeLanguage(code);
    setIsOpen(false);

    // Persist preference
    localStorage.setItem('language', code);
  };

  return (
    <div className="language-switcher">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <GlobeIcon />
        <span>{currentLanguage?.nativeName}</span>
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <ul role="listbox" aria-label={t('language_selection')}>
          {languages.map(lang => (
            <li
              key={lang.code}
              role="option"
              aria-selected={lang.code === i18n.language}
              onClick={() => changeLanguage(lang.code)}
            >
              <span className="native-name">{lang.nativeName}</span>
              <span className="english-name">{lang.name}</span>
              {lang.code === i18n.language && <CheckIcon />}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### 18.8 i18n Checklist

```
□ Translation Setup
  ├── □ i18next configured
  ├── □ Namespaces organized
  ├── □ Fallback language set
  └── □ Language detection working

□ Content Translation
  ├── □ UI strings translated
  ├── □ Error messages translated
  ├── □ Dates/numbers localized
  └── □ Pluralization rules defined

□ RTL Support
  ├── □ CSS logical properties used
  ├── □ Icons mirrored where needed
  ├── □ Scroll direction handled
  └── □ Bidirectional text supported

□ UX Considerations
  ├── □ Language switcher accessible
  ├── □ Preference persisted
  ├── □ Dynamic language switching
  └── □ SEO meta tags localized
```

---

## 19. Analytics & Monitoring

### 19.1 Analytics Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Analytics & Monitoring Stack                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Event Tracking                             │   │
│  │  • User interactions    • Page views    • Feature usage      │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Performance Monitoring                     │   │
│  │  • Core Web Vitals    • API latency    • Error rates         │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Error Tracking                             │   │
│  │  • JavaScript errors    • Network errors   • User reports    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    A/B Testing                                │   │
│  │  • Feature flags    • Experiment tracking    • Conversion    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 19.2 Event Tracking System

```typescript
// Analytics event types
type AnalyticsEvent =
  | { type: 'page_view'; page: string; referrer?: string }
  | { type: 'post_view'; postId: string; authorId: string; source: 'feed' | 'profile' | 'explore' }
  | { type: 'post_like'; postId: string; isLike: boolean }
  | { type: 'post_comment'; postId: string; commentLength: number }
  | { type: 'post_share'; postId: string; shareType: 'dm' | 'story' | 'external' }
  | { type: 'post_save'; postId: string; isSave: boolean }
  | { type: 'story_view'; storyId: string; userId: string; duration: number }
  | { type: 'story_reply'; storyId: string }
  | { type: 'search'; query: string; resultCount: number }
  | { type: 'follow'; targetUserId: string; source: string }
  | { type: 'profile_view'; userId: string; source: string }
  | { type: 'feed_refresh'; method: 'pull' | 'button' }
  | { type: 'scroll_depth'; page: string; depth: number };

// Analytics service
class AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timer | null = null;
  private sessionId: string;
  private userId: string | null = null;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.startBatching();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  setUserId(userId: string | null): void {
    this.userId = userId;
  }

  track(event: AnalyticsEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: Date.now(),
      sessionId: this.sessionId,
      userId: this.userId,
      deviceInfo: this.getDeviceInfo(),
    };

    this.queue.push(enrichedEvent);

    // Flush immediately for important events
    if (['post_like', 'follow', 'post_share'].includes(event.type)) {
      this.flush();
    }
  }

  private getDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      connection: (navigator as any).connection?.effectiveType,
      language: navigator.language,
    };
  }

  private startBatching(): void {
    this.flushInterval = setInterval(() => this.flush(), 5000);

    // Flush on page unload
    window.addEventListener('beforeunload', () => this.flush());
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.flush();
      }
    });
  }

  private async flush(): Promise<void> {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    try {
      // Use sendBeacon for reliability
      if (navigator.sendBeacon) {
        navigator.sendBeacon(
          '/api/analytics/events',
          JSON.stringify(events)
        );
      } else {
        await fetch('/api/analytics/events', {
          method: 'POST',
          body: JSON.stringify(events),
          keepalive: true,
        });
      }
    } catch (error) {
      // Re-queue failed events
      this.queue.unshift(...events);
    }
  }
}

export const analytics = new AnalyticsService();
```

### 19.3 Core Web Vitals Monitoring

```typescript
import { onCLS, onFCP, onFID, onLCP, onTTFB, onINP } from 'web-vitals';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
  id: string;
}

class PerformanceMonitor {
  private metrics: Map<string, WebVitalMetric> = new Map();

  init(): void {
    // Largest Contentful Paint
    onLCP((metric) => {
      this.reportMetric({
        name: 'LCP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });

    // First Input Delay
    onFID((metric) => {
      this.reportMetric({
        name: 'FID',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });

    // Cumulative Layout Shift
    onCLS((metric) => {
      this.reportMetric({
        name: 'CLS',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });

    // Interaction to Next Paint (replacing FID)
    onINP((metric) => {
      this.reportMetric({
        name: 'INP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });

    // Time to First Byte
    onTTFB((metric) => {
      this.reportMetric({
        name: 'TTFB',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });

    // First Contentful Paint
    onFCP((metric) => {
      this.reportMetric({
        name: 'FCP',
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
      });
    });
  }

  private reportMetric(metric: WebVitalMetric): void {
    this.metrics.set(metric.name, metric);

    // Send to analytics
    analytics.track({
      type: 'web_vital' as any,
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
    });

    // Alert on poor metrics
    if (metric.rating === 'poor') {
      console.warn(`Poor ${metric.name}: ${metric.value}`);
    }
  }

  getMetrics(): Record<string, WebVitalMetric> {
    return Object.fromEntries(this.metrics);
  }
}

export const performanceMonitor = new PerformanceMonitor();
```

### 19.4 Error Tracking

```typescript
interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

class ErrorTracker {
  private errorQueue: ErrorReport[] = [];

  init(): void {
    // Global error handler
    window.addEventListener('error', (event) => {
      this.captureError(event.error, {
        source: 'window.onerror',
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError(event.reason, {
        source: 'unhandledrejection',
      });
    });
  }

  captureError(error: Error | string, metadata?: Record<string, any>): void {
    const report: ErrorReport = {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      url: window.location.href,
      timestamp: Date.now(),
      sessionId: analytics.sessionId,
      metadata,
    };

    this.errorQueue.push(report);
    this.sendErrors();
  }

  captureReactError(error: Error, errorInfo: React.ErrorInfo): void {
    this.captureError(error, {
      source: 'react-error-boundary',
      componentStack: errorInfo.componentStack,
    });
  }

  private async sendErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return;

    const errors = [...this.errorQueue];
    this.errorQueue = [];

    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(errors),
      });
    } catch {
      // Re-queue on failure
      this.errorQueue.unshift(...errors);
    }
  }
}

export const errorTracker = new ErrorTracker();

// React Error Boundary
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    errorTracker.captureReactError(error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || <ErrorFallback />;
    }
    return this.props.children;
  }
}
```

### 19.5 Feature Flags & A/B Testing

```typescript
interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights: number[];
  active: boolean;
}

interface FeatureFlags {
  newFeedAlgorithm: boolean;
  reelsAutoplay: boolean;
  darkModeDefault: boolean;
  storiesReactions: boolean;
}

class ExperimentManager {
  private experiments: Map<string, Experiment> = new Map();
  private assignments: Map<string, string> = new Map();
  private flags: FeatureFlags | null = null;

  async init(userId: string): Promise<void> {
    // Fetch experiments and flags from server
    const response = await fetch(`/api/experiments?userId=${userId}`);
    const { experiments, flags, assignments } = await response.json();

    this.flags = flags;

    experiments.forEach((exp: Experiment) => {
      this.experiments.set(exp.id, exp);
    });

    // Restore or assign variants
    Object.entries(assignments).forEach(([expId, variant]) => {
      this.assignments.set(expId, variant as string);
    });
  }

  getVariant(experimentId: string): string | null {
    // Check if already assigned
    if (this.assignments.has(experimentId)) {
      return this.assignments.get(experimentId)!;
    }

    const experiment = this.experiments.get(experimentId);
    if (!experiment || !experiment.active) {
      return null;
    }

    // Deterministic assignment based on user ID
    const variant = this.assignVariant(experiment);
    this.assignments.set(experimentId, variant);

    // Track assignment
    analytics.track({
      type: 'experiment_assignment' as any,
      experimentId,
      variant,
    });

    return variant;
  }

  private assignVariant(experiment: Experiment): string {
    const random = Math.random();
    let cumulative = 0;

    for (let i = 0; i < experiment.weights.length; i++) {
      cumulative += experiment.weights[i];
      if (random < cumulative) {
        return experiment.variants[i];
      }
    }

    return experiment.variants[0];
  }

  isEnabled(flag: keyof FeatureFlags): boolean {
    return this.flags?.[flag] ?? false;
  }

  trackConversion(experimentId: string, metric: string): void {
    const variant = this.assignments.get(experimentId);
    if (!variant) return;

    analytics.track({
      type: 'experiment_conversion' as any,
      experimentId,
      variant,
      metric,
    });
  }
}

export const experiments = new ExperimentManager();

// React hook
function useExperiment(experimentId: string): string | null {
  const [variant, setVariant] = useState<string | null>(null);

  useEffect(() => {
    setVariant(experiments.getVariant(experimentId));
  }, [experimentId]);

  return variant;
}

function useFeatureFlag(flag: keyof FeatureFlags): boolean {
  return experiments.isEnabled(flag);
}
```

### 19.6 Analytics Checklist

```
□ Event Tracking
  ├── □ Page views tracked
  ├── □ User interactions tracked
  ├── □ Engagement metrics captured
  └── □ Events batched and sent reliably

□ Performance Monitoring
  ├── □ Core Web Vitals measured
  ├── □ API latency tracked
  ├── □ Resource loading monitored
  └── □ Alerts on poor metrics

□ Error Tracking
  ├── □ JavaScript errors captured
  ├── □ Network errors tracked
  ├── □ React errors caught
  └── □ Stack traces included

□ A/B Testing
  ├── □ Experiment framework setup
  ├── □ Variant assignment working
  ├── □ Conversion tracking enabled
  └── □ Feature flags integrated
```

---

## 20. Reels/Short Video Deep Dive

### 20.1 Reels Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Reels Video Player Architecture                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Video Preloading                           │   │
│  │  • Next 2 videos buffered    • Adaptive bitrate (ABR)        │   │
│  │  • Background download       • Memory management              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Playback Control                           │   │
│  │  • Auto-play on focus    • Pause on scroll away              │   │
│  │  • Loop playback         • Volume/mute state                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Gesture Handling                           │   │
│  │  • Vertical swipe nav    • Long press pause                  │   │
│  │  • Double-tap like       • Tap to pause/play                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 20.2 Reels Player Component

```typescript
interface Reel {
  id: string;
  videoUrl: string;
  thumbnailUrl: string;
  duration: number;
  user: User;
  caption: string;
  audio: {
    id: string;
    name: string;
    artistName: string;
  };
  likeCount: number;
  commentCount: number;
  shareCount: number;
  isLikedByMe: boolean;
}

const ReelPlayer: React.FC<{
  reel: Reel;
  isActive: boolean;
  isMuted: boolean;
  onMuteToggle: () => void;
}> = ({ reel, isActive, isMuted, onMuteToggle }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isBuffering, setIsBuffering] = useState(true);

  // Play/pause based on visibility
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.play().catch(() => {
        // Autoplay blocked - show play button
        setIsPlaying(false);
      });
      setIsPlaying(true);
    } else {
      video.pause();
      video.currentTime = 0;
      setIsPlaying(false);
    }
  }, [isActive]);

  // Update progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateProgress = () => {
      setProgress((video.currentTime / video.duration) * 100);
    };

    video.addEventListener('timeupdate', updateProgress);
    return () => video.removeEventListener('timeupdate', updateProgress);
  }, []);

  // Handle tap to pause/play
  const handleTap = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  // Double tap to like
  const doubleTapHandlers = useDoubleTap({
    onDoubleTap: () => {
      if (!reel.isLikedByMe) {
        likeReel(reel.id);
        showHeartAnimation();
      }
    },
    onSingleTap: handleTap,
  });

  // Long press to pause
  const longPressHandlers = useLongPress({
    onLongPress: () => {
      videoRef.current?.pause();
      setIsPlaying(false);
    },
    onPressEnd: () => {
      if (isActive) {
        videoRef.current?.play();
        setIsPlaying(true);
      }
    },
  });

  return (
    <div className="reel-player" {...doubleTapHandlers} {...longPressHandlers}>
      {/* Video element */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        poster={reel.thumbnailUrl}
        loop
        playsInline
        muted={isMuted}
        preload="auto"
        onWaiting={() => setIsBuffering(true)}
        onCanPlay={() => setIsBuffering(false)}
      />

      {/* Buffering indicator */}
      {isBuffering && <Spinner className="buffering-spinner" />}

      {/* Play/pause indicator */}
      {!isPlaying && !isBuffering && (
        <div className="play-indicator">
          <PlayIcon />
        </div>
      )}

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Reel info overlay */}
      <div className="reel-info">
        <UserInfo user={reel.user} />
        <Caption text={reel.caption} />
        <AudioInfo audio={reel.audio} />
      </div>

      {/* Action buttons (right side) */}
      <div className="reel-actions">
        <LikeButton
          isLiked={reel.isLikedByMe}
          count={reel.likeCount}
          onLike={() => likeReel(reel.id)}
        />
        <CommentButton count={reel.commentCount} />
        <ShareButton onShare={() => shareReel(reel.id)} />
        <AudioButton audio={reel.audio} />
      </div>

      {/* Mute button */}
      <button
        className="mute-button"
        onClick={(e) => {
          e.stopPropagation();
          onMuteToggle();
        }}
      >
        {isMuted ? <MuteIcon /> : <VolumeIcon />}
      </button>
    </div>
  );
};
```

### 20.3 Vertical Scroll Navigation

```typescript
const ReelsFeed: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: ['reels'],
    queryFn: fetchReels,
    getNextPageParam: (lastPage) => lastPage.cursor,
  });

  const reels = useMemo(() =>
    data?.pages.flatMap(p => p.reels) ?? [],
    [data]
  );

  // Snap scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const index = Math.round(container.scrollTop / window.innerHeight);
      setCurrentIndex(index);

      // Prefetch more when near end
      if (index >= reels.length - 3 && hasNextPage) {
        fetchNextPage();
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [reels.length, hasNextPage, fetchNextPage]);

  // Preload adjacent videos
  useEffect(() => {
    const preloadRange = [currentIndex - 1, currentIndex + 1, currentIndex + 2];

    preloadRange.forEach(index => {
      if (reels[index]) {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'video';
        link.href = reels[index].videoUrl;
        document.head.appendChild(link);
      }
    });
  }, [currentIndex, reels]);

  return (
    <div
      ref={containerRef}
      className="reels-container"
      style={{ scrollSnapType: 'y mandatory' }}
    >
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          className="reel-wrapper"
          style={{ scrollSnapAlign: 'start' }}
        >
          <ReelPlayer
            reel={reel}
            isActive={index === currentIndex}
            isMuted={isMuted}
            onMuteToggle={() => setIsMuted(!isMuted)}
          />
        </div>
      ))}
    </div>
  );
};
```

### 20.4 Video Preloading Strategy

```typescript
class VideoPreloader {
  private cache = new Map<string, HTMLVideoElement>();
  private maxCacheSize = 5;

  preload(url: string): Promise<void> {
    if (this.cache.has(url)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      video.preload = 'auto';
      video.src = url;

      video.oncanplaythrough = () => {
        this.addToCache(url, video);
        resolve();
      };

      video.onerror = () => {
        reject(new Error(`Failed to preload: ${url}`));
      };
    });
  }

  private addToCache(url: string, video: HTMLVideoElement) {
    // Evict oldest if at capacity
    if (this.cache.size >= this.maxCacheSize) {
      const oldest = this.cache.keys().next().value;
      this.cache.delete(oldest);
    }

    this.cache.set(url, video);
  }

  get(url: string): HTMLVideoElement | undefined {
    return this.cache.get(url);
  }

  clear() {
    this.cache.forEach(video => {
      video.src = '';
      video.load();
    });
    this.cache.clear();
  }
}

const videoPreloader = new VideoPreloader();

// Hook for preloading
function useVideoPreload(urls: string[]) {
  useEffect(() => {
    urls.forEach(url => {
      videoPreloader.preload(url).catch(console.error);
    });

    return () => {
      // Cleanup on unmount
      // videoPreloader.clear(); // Optional
    };
  }, [urls]);
}
```

### 20.5 Reels Checklist

```
□ Video Player
  ├── □ Autoplay on focus
  ├── □ Loop playback
  ├── □ Progress indicator
  └── □ Buffering states handled

□ Preloading
  ├── □ Next videos preloaded
  ├── □ Adaptive bitrate
  ├── □ Memory management
  └── □ Cache eviction

□ Gestures
  ├── □ Vertical snap scroll
  ├── □ Double-tap to like
  ├── □ Long press to pause
  └── □ Tap to play/pause

□ Performance
  ├── □ 60fps scroll
  ├── □ Minimal battery drain
  ├── □ Efficient memory usage
  └── □ Quick video start
```

---

## 21. Direct Messaging Deep Dive

### 21.1 DM Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Direct Messaging Architecture                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    WebSocket Connection                       │   │
│  │  • Real-time messages    • Typing indicators                 │   │
│  │  • Online presence       • Read receipts                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Message Queue                              │   │
│  │  • Offline queue        • Retry logic                        │   │
│  │  • Optimistic send      • Delivery confirmation              │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Media Handling                             │   │
│  │  • Image/video upload   • Voice messages                     │   │
│  │  • Disappearing media   • Reactions                          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 21.2 WebSocket Message Handler

```typescript
interface WSMessage {
  type: 'message' | 'typing' | 'read' | 'presence' | 'reaction';
  payload: any;
}

interface DMMessage {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'voice' | 'gif';
  replyTo?: string;
  reactions: { emoji: string; userId: string }[];
  readBy: string[];
  createdAt: string;
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
}

class DMWebSocket {
  private ws: WebSocket | null = null;
  private messageHandlers = new Set<(msg: WSMessage) => void>();
  private reconnectAttempts = 0;

  connect(token: string): void {
    this.ws = new WebSocket(`wss://dm.instagram.com?token=${token}`);

    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      // Send presence
      this.send({ type: 'presence', payload: { status: 'online' } });
    };

    this.ws.onmessage = (event) => {
      const message: WSMessage = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    this.ws.onclose = () => {
      this.attemptReconnect(token);
    };
  }

  send(message: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  subscribe(handler: (msg: WSMessage) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  sendTyping(threadId: string): void {
    this.send({
      type: 'typing',
      payload: { threadId },
    });
  }

  markAsRead(threadId: string, messageId: string): void {
    this.send({
      type: 'read',
      payload: { threadId, messageId },
    });
  }

  private attemptReconnect(token: string): void {
    if (this.reconnectAttempts < 5) {
      this.reconnectAttempts++;
      const delay = Math.pow(2, this.reconnectAttempts) * 1000;
      setTimeout(() => this.connect(token), delay);
    }
  }
}

export const dmSocket = new DMWebSocket();
```

### 21.3 Chat Thread Component

```typescript
const ChatThread: React.FC<{ threadId: string }> = ({ threadId }) => {
  const [messages, setMessages] = useState<DMMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const messageEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Load messages
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['messages', threadId],
    queryFn: ({ pageParam }) => fetchMessages(threadId, pageParam),
    getNextPageParam: (lastPage) => lastPage.cursor,
    select: (data) => ({
      pages: [...data.pages].reverse(),
      pageParams: [...data.pageParams].reverse(),
    }),
  });

  // Subscribe to real-time updates
  useEffect(() => {
    return dmSocket.subscribe((msg) => {
      switch (msg.type) {
        case 'message':
          if (msg.payload.threadId === threadId) {
            setMessages(prev => [...prev, msg.payload]);
            // Mark as read
            dmSocket.markAsRead(threadId, msg.payload.id);
          }
          break;

        case 'typing':
          if (msg.payload.threadId === threadId) {
            setTypingUsers(prev =>
              prev.includes(msg.payload.userId)
                ? prev
                : [...prev, msg.payload.userId]
            );
            // Clear after 3 seconds
            setTimeout(() => {
              setTypingUsers(prev =>
                prev.filter(id => id !== msg.payload.userId)
              );
            }, 3000);
          }
          break;

        case 'read':
          // Update read receipts
          setMessages(prev =>
            prev.map(m =>
              m.id === msg.payload.messageId
                ? { ...m, readBy: [...m.readBy, msg.payload.userId] }
                : m
            )
          );
          break;
      }
    });
  }, [threadId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async (content: string) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: DMMessage = {
      id: tempId,
      threadId,
      senderId: currentUserId,
      content,
      reactions: [],
      readBy: [],
      createdAt: new Date().toISOString(),
      status: 'sending',
    };

    // Optimistic update
    setMessages(prev => [...prev, optimisticMessage]);

    try {
      const response = await api.post(`/direct/${threadId}/messages`, { content });

      // Replace temp message with real one
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...response.data, status: 'sent' } : m)
      );
    } catch {
      // Mark as failed
      setMessages(prev =>
        prev.map(m => m.id === tempId ? { ...m, status: 'failed' } : m)
      );
    }
  };

  // Typing indicator
  const handleInputChange = () => {
    if (!isTyping) {
      setIsTyping(true);
      dmSocket.sendTyping(threadId);

      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  return (
    <div className="chat-thread">
      {/* Message list */}
      <div className="message-list" onScroll={handleScroll}>
        {hasNextPage && (
          <button onClick={() => fetchNextPage()}>Load more</button>
        )}

        {messages.map((message, index) => (
          <MessageBubble
            key={message.id}
            message={message}
            isOwn={message.senderId === currentUserId}
            showAvatar={shouldShowAvatar(messages, index)}
          />
        ))}

        {typingUsers.length > 0 && (
          <TypingIndicator users={typingUsers} />
        )}

        <div ref={messageEndRef} />
      </div>

      {/* Input */}
      <MessageInput
        ref={inputRef}
        onSend={sendMessage}
        onChange={handleInputChange}
        onMediaSelect={handleMediaSelect}
      />
    </div>
  );
};
```

### 21.4 Message Bubble Component

```typescript
const MessageBubble: React.FC<{
  message: DMMessage;
  isOwn: boolean;
  showAvatar: boolean;
}> = ({ message, isOwn, showAvatar }) => {
  const [showReactions, setShowReactions] = useState(false);

  const longPressHandlers = useLongPress({
    onLongPress: () => setShowReactions(true),
  });

  return (
    <div
      className={`message-bubble ${isOwn ? 'own' : 'other'}`}
      {...longPressHandlers}
    >
      {!isOwn && showAvatar && (
        <Avatar user={message.sender} size="small" />
      )}

      <div className="bubble-content">
        {message.replyTo && (
          <ReplyPreview messageId={message.replyTo} />
        )}

        {message.mediaUrl ? (
          <MediaMessage
            url={message.mediaUrl}
            type={message.mediaType!}
          />
        ) : (
          <p>{message.content}</p>
        )}

        {/* Reactions */}
        {message.reactions.length > 0 && (
          <div className="reactions">
            {groupReactions(message.reactions).map(({ emoji, count }) => (
              <span key={emoji} className="reaction">
                {emoji} {count > 1 && count}
              </span>
            ))}
          </div>
        )}

        {/* Status indicator for own messages */}
        {isOwn && (
          <div className="message-status">
            {message.status === 'sending' && <ClockIcon />}
            {message.status === 'sent' && <CheckIcon />}
            {message.status === 'delivered' && <DoubleCheckIcon />}
            {message.status === 'read' && (
              <DoubleCheckIcon className="read" />
            )}
            {message.status === 'failed' && (
              <ErrorIcon onClick={() => retryMessage(message)} />
            )}
          </div>
        )}
      </div>

      {/* Reaction picker */}
      {showReactions && (
        <ReactionPicker
          onSelect={(emoji) => {
            addReaction(message.id, emoji);
            setShowReactions(false);
          }}
          onClose={() => setShowReactions(false)}
        />
      )}
    </div>
  );
};
```

### 21.5 DM Checklist

```
□ Real-time Messaging
  ├── □ WebSocket connection
  ├── □ Message delivery
  ├── □ Typing indicators
  └── □ Read receipts

□ Message Features
  ├── □ Text messages
  ├── □ Media sharing
  ├── □ Reactions
  └── □ Reply threads

□ Offline Support
  ├── □ Message queue
  ├── □ Retry failed sends
  ├── □ Optimistic updates
  └── □ Sync on reconnect

□ UX
  ├── □ Smooth scrolling
  ├── □ Auto-scroll to new
  ├── □ Load more on scroll
  └── □ Message status icons
```

---

## 22. Design System & Theming

### 22.1 Design Token Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Design Token Hierarchy                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Primitive Tokens                           │   │
│  │  colors.blue.500, spacing.4, fontSize.md                     │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Semantic Tokens                            │   │
│  │  color.primary, color.background, text.body                  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                              │                                       │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    Component Tokens                           │   │
│  │  button.primary.bg, card.border, input.focus.ring            │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 22.2 Design Tokens Definition

```typescript
// tokens.ts
export const primitiveTokens = {
  colors: {
    // Grayscale
    gray: {
      50: '#fafafa',
      100: '#f5f5f5',
      200: '#e5e5e5',
      300: '#d4d4d4',
      400: '#a3a3a3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
      950: '#0a0a0a',
    },
    // Brand colors
    blue: {
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
    },
    red: {
      500: '#ef4444',
      600: '#dc2626',
    },
    // Instagram gradient
    instagram: {
      purple: '#833ab4',
      pink: '#fd1d1d',
      orange: '#fcb045',
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
  },
  fontSize: {
    xs: '0.75rem',
    sm: '0.875rem',
    md: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
  },
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
};

// Semantic tokens (theme-aware)
export const semanticTokens = {
  light: {
    color: {
      background: primitiveTokens.colors.gray[50],
      surface: '#ffffff',
      surfaceHover: primitiveTokens.colors.gray[100],
      border: primitiveTokens.colors.gray[200],
      borderStrong: primitiveTokens.colors.gray[300],
      text: {
        primary: primitiveTokens.colors.gray[900],
        secondary: primitiveTokens.colors.gray[600],
        tertiary: primitiveTokens.colors.gray[400],
        inverse: '#ffffff',
      },
      primary: primitiveTokens.colors.blue[500],
      primaryHover: primitiveTokens.colors.blue[600],
      error: primitiveTokens.colors.red[500],
      like: primitiveTokens.colors.red[500],
    },
  },
  dark: {
    color: {
      background: primitiveTokens.colors.gray[950],
      surface: primitiveTokens.colors.gray[900],
      surfaceHover: primitiveTokens.colors.gray[800],
      border: primitiveTokens.colors.gray[800],
      borderStrong: primitiveTokens.colors.gray[700],
      text: {
        primary: primitiveTokens.colors.gray[50],
        secondary: primitiveTokens.colors.gray[400],
        tertiary: primitiveTokens.colors.gray[500],
        inverse: primitiveTokens.colors.gray[900],
      },
      primary: primitiveTokens.colors.blue[400],
      primaryHover: primitiveTokens.colors.blue[500],
      error: primitiveTokens.colors.red[500],
      like: primitiveTokens.colors.red[500],
    },
  },
};
```

### 22.3 Theme Provider

```typescript
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  tokens: typeof semanticTokens.light;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = localStorage.getItem('theme') as Theme;
    return stored || 'system';
  });

  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Handle system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateResolvedTheme = () => {
      if (theme === 'system') {
        setResolvedTheme(mediaQuery.matches ? 'dark' : 'light');
      } else {
        setResolvedTheme(theme);
      }
    };

    updateResolvedTheme();
    mediaQuery.addEventListener('change', updateResolvedTheme);

    return () => mediaQuery.removeEventListener('change', updateResolvedTheme);
  }, [theme]);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === 'dark');

    // Apply CSS custom properties
    const tokens = semanticTokens[resolvedTheme];
    Object.entries(flattenTokens(tokens)).forEach(([key, value]) => {
      document.documentElement.style.setProperty(`--${key}`, value as string);
    });
  }, [resolvedTheme]);

  // Persist preference
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme,
    tokens: semanticTokens[resolvedTheme],
  }), [theme, resolvedTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

// Flatten nested tokens for CSS custom properties
function flattenTokens(obj: any, prefix = ''): Record<string, string> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(acc, flattenTokens(value, newKey));
    } else {
      acc[newKey] = value as string;
    }
    return acc;
  }, {} as Record<string, string>);
}
```

### 22.4 CSS Custom Properties

```css
/* globals.css */
:root {
  /* Primitives (always available) */
  --spacing-1: 0.25rem;
  --spacing-2: 0.5rem;
  --spacing-3: 0.75rem;
  --spacing-4: 1rem;
  --spacing-6: 1.5rem;
  --spacing-8: 2rem;

  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  --radius-full: 9999px;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-md: 1rem;
  --font-size-lg: 1.125rem;

  /* Semantic tokens (theme-dependent) */
  --color-background: #fafafa;
  --color-surface: #ffffff;
  --color-border: #e5e5e5;
  --color-text-primary: #171717;
  --color-text-secondary: #525252;
  --color-primary: #3b82f6;
  --color-like: #ef4444;
}

[data-theme="dark"] {
  --color-background: #0a0a0a;
  --color-surface: #171717;
  --color-border: #262626;
  --color-text-primary: #fafafa;
  --color-text-secondary: #a3a3a3;
  --color-primary: #60a5fa;
  --color-like: #ef4444;
}

/* Component styles using tokens */
.post-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--spacing-4);
}

.button-primary {
  background: var(--color-primary);
  color: white;
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
}

.like-button.active {
  color: var(--color-like);
}
```

### 22.5 Theme Switcher Component

```typescript
const ThemeSwitcher: React.FC = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const options = [
    { value: 'light', label: 'Light', icon: SunIcon },
    { value: 'dark', label: 'Dark', icon: MoonIcon },
    { value: 'system', label: 'System', icon: MonitorIcon },
  ];

  return (
    <div className="theme-switcher" role="radiogroup" aria-label="Theme selection">
      {options.map(({ value, label, icon: Icon }) => (
        <button
          key={value}
          role="radio"
          aria-checked={theme === value}
          onClick={() => setTheme(value as Theme)}
          className={theme === value ? 'active' : ''}
        >
          <Icon />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
};
```

### 22.6 Design System Checklist

```
□ Design Tokens
  ├── □ Primitive tokens defined
  ├── □ Semantic tokens for themes
  ├── □ Component-level tokens
  └── □ CSS custom properties

□ Theming
  ├── □ Light mode
  ├── □ Dark mode
  ├── □ System preference detection
  └── □ Smooth transitions

□ Components
  ├── □ Consistent spacing
  ├── □ Consistent colors
  ├── □ Consistent typography
  └── □ Consistent interactions

□ Accessibility
  ├── □ Color contrast (4.5:1)
  ├── □ Focus indicators
  ├── □ Reduced motion support
  └── □ Theme persistence
```

---

**End of Document**

This HLD covers designing an Instagram-like social photo feed system, with comprehensive frontend implementation details including Reels, Direct Messaging, and Design System.
