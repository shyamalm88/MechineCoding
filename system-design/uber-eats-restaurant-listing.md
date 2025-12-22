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
12. [Accessibility (A11y) Deep Dive](#12-accessibility-a11y-deep-dive)
13. [Security Implementation](#13-security-implementation)
14. [Mobile & Touch Interactions](#14-mobile--touch-interactions)
15. [Testing Strategy](#15-testing-strategy)
16. [Offline/PWA Capabilities](#16-offlinepwa-capabilities)
17. [Internationalization (i18n)](#17-internationalization-i18n)
18. [Analytics & Monitoring](#18-analytics--monitoring)
19. [Search & Autocomplete Deep Dive](#19-search--autocomplete-deep-dive)
20. [Location Services Deep Dive](#20-location-services-deep-dive)
21. [Design System & Theming](#21-design-system--theming)

---

## 1. Problem Statement & Requirements

### Functional Requirements

- Display list of restaurants based on user's location
- Filter restaurants by cuisine, rating, price range, delivery time
- Sort restaurants (rating, distance, delivery time, popularity)
- Search restaurants by name or cuisine
- Show restaurant details (name, rating, cuisine, ETA, offers)
- Infinite scroll / pagination for restaurant list
- Real-time updates for restaurant availability & ETA

### Non-Functional Requirements

- **Performance**: First Contentful Paint < 1.5s, TTI < 3s
- **Scalability**: Handle millions of concurrent users
- **Availability**: 99.9% uptime
- **Responsiveness**: Support mobile, tablet, desktop
- **Offline Support**: Show cached data when offline

### Capacity Estimation (Interview Context)

```
Daily Active Users (DAU): 50 million
Peak concurrent users: 5 million
Avg restaurants per city: 10,000
Avg page size: 20 restaurants
API calls per user session: ~10
Peak QPS: 500,000 requests/second
```

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   Mobile    │  │   Mobile    │  │     Web     │  │     PWA     │        │
│  │  (iOS App)  │  │(Android App)│  │  (React)    │  │             │        │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘        │
│         │                │                │                │                │
│         └────────────────┴────────────────┴────────────────┘                │
│                                   │                                          │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CDN (CloudFront/Akamai)                         │
│  • Static assets (JS, CSS, Images)                                          │
│  • Edge caching for API responses                                           │
│  • Geographic distribution                                                   │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                     │
│  • Rate Limiting  • Authentication  • Request Routing  • Load Balancing     │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                    ┌───────────────┼───────────────┐
                    ▼               ▼               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           BACKEND SERVICES                                   │
├─────────────────┬─────────────────┬─────────────────┬───────────────────────┤
│  Restaurant     │   Search        │   Location      │   User                │
│  Service        │   Service       │   Service       │   Service             │
│  (CRUD, Menu)   │   (Elasticsearch)│  (Geo queries) │   (Preferences)       │
└────────┬────────┴────────┬────────┴────────┬────────┴───────────┬───────────┘
         │                 │                 │                    │
         ▼                 ▼                 ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            CACHING LAYER                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │  Redis Cluster  │  │  Memcached      │  │  Local Cache    │             │
│  │  (Sessions,     │  │  (API Response) │  │  (Service-level)│             │
│  │   Real-time)    │  │                 │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            DATABASE LAYER                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   PostgreSQL    │  │   MongoDB       │  │  Elasticsearch  │             │
│  │  (Restaurants,  │  │  (Menus,        │  │  (Search Index) │             │
│  │   Users, Orders)│  │   Reviews)      │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### Frontend Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              App                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                         Header                                         │  │
│  │  ┌─────────────┐  ┌─────────────────────┐  ┌─────────────────────┐   │  │
│  │  │   Logo      │  │   LocationPicker    │  │   SearchBar         │   │  │
│  │  └─────────────┘  └─────────────────────┘  └─────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      FilterBar                                         │  │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │  │
│  │  │ Cuisine  │ │  Rating  │ │  Price   │ │   ETA    │ │  Offers  │   │  │
│  │  │ Filter   │ │  Filter  │ │  Filter  │ │  Filter  │ │  Filter  │   │  │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      SortBar                                           │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐        │  │
│  │  │ Relevance  │ │  Rating    │ │  Distance  │ │  Delivery  │        │  │
│  │  └────────────┘ └────────────┘ └────────────┘ └────────────┘        │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                   RestaurantList (Virtualized)                         │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  RestaurantCard                                                  │  │  │
│  │  │  ┌────────┐ ┌──────────────────────────────────────────────┐   │  │  │
│  │  │  │ Image  │ │  Name | Rating | Cuisine | ETA | Offers      │   │  │  │
│  │  │  │(Lazy)  │ │  Distance | Price Range | Promotions         │   │  │  │
│  │  │  └────────┘ └──────────────────────────────────────────────┘   │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  RestaurantCard (repeats...)                                    │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  │                                                                        │  │
│  │  ┌─────────────────────────────────────────────────────────────────┐  │  │
│  │  │  InfiniteScrollTrigger (Intersection Observer)                  │  │  │
│  │  └─────────────────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      LoadingState / ErrorState / EmptyState           │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Component Responsibilities

| Component        | Responsibility                                                   |
| ---------------- | ---------------------------------------------------------------- |
| `LocationPicker` | Geolocation API, address autocomplete, store location in context |
| `SearchBar`      | Debounced search input, search suggestions, recent searches      |
| `FilterBar`      | Multi-select filters, filter state management, URL sync          |
| `SortBar`        | Single-select sorting, active sort indicator                     |
| `RestaurantList` | Virtual scrolling, infinite scroll, skeleton loading             |
| `RestaurantCard` | Display restaurant info, lazy load images, click navigation      |

---

## 4. Data Flow

### Initial Page Load Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │  Browser │     │   CDN    │     │   API    │     │ Backend  │
│          │     │          │     │          │     │  Gateway │     │ Services │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │  1. Navigate   │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │  2. Fetch HTML │                │                │
     │                │   (SSR/Static) │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │                │  3. HTML + Critical CSS         │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
     │  4. FCP        │                │                │                │
     │<───────────────│                │                │                │
     │  (Skeleton UI) │                │                │                │
     │                │                │                │                │
     │                │  5. JS Bundle  │                │                │
     │                │───────────────>│                │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
     │                │  6. Get User Location           │                │
     │                │  (Geolocation API)              │                │
     │                │                │                │                │
     │                │  7. Fetch Restaurants           │                │
     │                │────────────────────────────────>│                │
     │                │                │                │───────────────>│
     │                │                │                │                │
     │                │                │                │  8. Query DB   │
     │                │                │                │  + Cache Check │
     │                │                │                │<───────────────│
     │                │                │                │                │
     │                │  9. Restaurant Data             │                │
     │                │<────────────────────────────────│                │
     │                │                │                │                │
     │  10. Render    │                │                │                │
     │  Restaurant    │                │                │                │
     │  List          │                │                │                │
     │<───────────────│                │                │                │
     │                │                │                │                │
```

### Filter/Sort Flow

```
User Action                State Update              API Call              UI Update
─────────────────────────────────────────────────────────────────────────────────────

┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐    ┌─────────────────┐
│ Click "Italian"│      │ Update filters  │      │ Debounced API   │    │ Show skeleton   │
│ cuisine filter │─────>│ in state        │─────>│ call (300ms)    │───>│ then render     │
└─────────────────┘      │ + URL params    │      │                 │    │ new results     │
                         └─────────────────┘      └─────────────────┘    └─────────────────┘
                                │
                                ▼
                         ┌─────────────────┐
                         │ URL: ?cuisine=  │
                         │ italian&sort=   │
                         │ rating          │
                         └─────────────────┘
```

### Infinite Scroll Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         INFINITE SCROLL MECHANISM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │                    Viewport (visible area)                           │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  Restaurant Card 1                                           │   │   │
│   │   ├─────────────────────────────────────────────────────────────┤   │   │
│   │   │  Restaurant Card 2                                           │   │   │
│   │   ├─────────────────────────────────────────────────────────────┤   │   │
│   │   │  Restaurant Card 3                                           │   │   │
│   │   ├─────────────────────────────────────────────────────────────┤   │   │
│   │   │  Restaurant Card 4                                           │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │                                                                      │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  ▼ Intersection Observer Trigger (sentinel element)         │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   │          │                                                           │   │
│   │          │ When visible → trigger loadMore()                        │   │
│   │          ▼                                                           │   │
│   │   ┌─────────────────────────────────────────────────────────────┐   │   │
│   │   │  Loading Spinner / Skeleton Cards                            │   │   │
│   │   └─────────────────────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│   Pagination Strategy:                                                       │
│   • Cursor-based: ?cursor=eyJsYXN0SWQiOjEyMzR9 (Base64 encoded)            │
│   • NOT offset-based (problems with real-time data)                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Design & Communication Protocols

### REST vs GraphQL vs gRPC - When to Use What?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROTOCOL COMPARISON FOR UBER EATS                         │
├─────────────────┬───────────────┬───────────────┬───────────────────────────┤
│    Protocol     │     Pros      │     Cons      │     Use Case              │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Simple      │ • Over-fetch  │ • Restaurant CRUD         │
│    REST         │ • Cacheable   │ • Under-fetch │ • Simple listings         │
│                 │ • Stateless   │ • Multiple    │ • Filters/Sort            │
│                 │ • Wide support│   round trips │ • ✅ PRIMARY CHOICE       │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Flexible    │ • Complex     │ • Restaurant detail page  │
│   GraphQL       │ • No over-    │   caching     │   (nested menu, reviews)  │
│                 │   fetching    │ • Learning    │ • Aggregated dashboard    │
│                 │ • Single      │   curve       │ • Mobile (bandwidth       │
│                 │   endpoint    │ • N+1 problem │   conscious)              │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Binary      │ • No browser  │ • Service-to-service      │
│    gRPC         │   (fast)      │   support     │ • Real-time location      │
│                 │ • Streaming   │ • Complex     │   tracking                │
│                 │ • Type-safe   │   debugging   │ • Internal microservices  │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Real-time   │ • Stateful    │ • Live order tracking     │
│   WebSocket     │ • Bi-direct   │ • Connection  │ • Driver location         │
│                 │ • Low latency │   management  │ • Chat with restaurant    │
└─────────────────┴───────────────┴───────────────┴───────────────────────────┘
```

### REST API Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REST API DESIGN                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GET /api/v1/restaurants                                                    │
│  ├── Query Params:                                                          │
│  │   • lat, lng (required) - User's location                               │
│  │   • radius (optional, default: 5km)                                      │
│  │   • cuisine[] (optional) - Multi-select filter                          │
│  │   • rating (optional) - Minimum rating                                   │
│  │   • price_range (optional) - 1-4 ($-$$$$)                               │
│  │   • max_eta (optional) - Max delivery time                              │
│  │   • sort_by (optional) - rating|distance|eta|popularity                 │
│  │   • cursor (optional) - Pagination cursor                               │
│  │   • limit (optional, default: 20, max: 50)                              │
│  │                                                                          │
│  └── Response:                                                              │
│      {                                                                       │
│        "restaurants": [...],                                                │
│        "pagination": {                                                      │
│          "next_cursor": "eyJsYXN0...",                                     │
│          "has_more": true,                                                  │
│          "total_count": 1234                                                │
│        },                                                                    │
│        "metadata": {                                                        │
│          "applied_filters": {...},                                          │
│          "cache_ttl": 60                                                    │
│        }                                                                     │
│      }                                                                       │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GET /api/v1/restaurants/:id                                                │
│  └── Response: Full restaurant details with menu                            │
│                                                                              │
│  GET /api/v1/restaurants/search                                             │
│  ├── Query: q (search term)                                                 │
│  └── Uses: Elasticsearch for fuzzy matching                                 │
│                                                                              │
│  GET /api/v1/filters/options                                                │
│  └── Returns: Available cuisines, price ranges for location                 │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Polling Strategies - When to Use What?

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     POLLING STRATEGY COMPARISON                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SHORT POLLING                                                               │
│  ──────────────                                                              │
│  Client ──────> Server (every N seconds)                                    │
│         <────── Response (even if no changes)                               │
│                                                                              │
│  When to use for Uber Eats:                                                 │
│  • ❌ NOT recommended for restaurant listing                                 │
│  • ✅ OK for checking restaurant open/closed status (every 5 min)           │
│                                                                              │
│  Problems:                                                                   │
│  • Wastes bandwidth (mostly empty responses)                                │
│  • Server load increases with users                                          │
│  • Delayed updates (depends on interval)                                    │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LONG POLLING                                                                │
│  ────────────                                                                │
│  Client ──────> Server (request held open)                                  │
│         <────── Response (when data changes OR timeout)                     │
│  Client ──────> Server (immediately reconnect)                              │
│                                                                              │
│  When to use for Uber Eats:                                                 │
│  • ✅ ETA updates (changes occasionally)                                     │
│  • ✅ Restaurant availability changes                                        │
│  • ✅ Promotion/offer updates                                                │
│                                                                              │
│  Implementation:                                                             │
│  • Server holds request for 30-60 seconds                                   │
│  • Returns immediately if data changes                                       │
│  • Client reconnects on response/timeout                                    │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SERVER-SENT EVENTS (SSE)                                                   │
│  ─────────────────────────                                                   │
│  Client ──────> Server (single connection)                                  │
│         <────── Event stream (continuous)                                   │
│         <────── data: {"type": "eta_update", ...}                           │
│         <────── data: {"type": "promo_update", ...}                         │
│                                                                              │
│  When to use for Uber Eats:                                                 │
│  • ✅ Real-time ETA updates for visible restaurants                         │
│  • ✅ Flash sale/promotion notifications                                     │
│  • ✅ Restaurant goes online/offline                                         │
│                                                                              │
│  Advantages over Long Polling:                                              │
│  • Single connection (no reconnection overhead)                             │
│  • Built-in reconnection                                                     │
│  • Event types for categorization                                           │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WEBSOCKET                                                                   │
│  ─────────                                                                   │
│  Client <────> Server (bidirectional)                                       │
│                                                                              │
│  When to use for Uber Eats:                                                 │
│  • ❌ OVERKILL for restaurant listing                                        │
│  • ✅ Order tracking page                                                    │
│  • ✅ Live driver location                                                   │
│  • ✅ Chat with restaurant/driver                                            │
│                                                                              │
│  Why not for listing page:                                                  │
│  • No bidirectional need                                                     │
│  • Connection overhead for passive viewers                                  │
│  • SSE is simpler and sufficient                                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Recommended Strategy for Restaurant Listing

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    HYBRID APPROACH (RECOMMENDED)                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  INITIAL LOAD: REST API                                                     │
│  ─────────────────────────                                                   │
│  GET /api/v1/restaurants?lat=...&lng=...                                    │
│                                                                              │
│                                                                              │
│  REAL-TIME UPDATES: SSE                                                     │
│  ──────────────────────────                                                  │
│  EventSource('/api/v1/restaurants/updates?ids=1,2,3,4,5')                   │
│                                                                              │
│  • Subscribe to updates for visible restaurant IDs only                     │
│  • Update local state on receiving events                                   │
│  • Reconnect with new IDs when user scrolls                                 │
│                                                                              │
│  Event Types:                                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │ { "type": "eta_update", "restaurant_id": 123, "new_eta": 25 }       │   │
│  │ { "type": "availability", "restaurant_id": 123, "open": false }     │   │
│  │ { "type": "promo", "restaurant_id": 123, "offer": "20% off" }       │   │
│  │ { "type": "surge", "restaurant_id": 123, "surge_fee": 15 }          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│                                                                              │
│  BACKGROUND REFRESH: Stale-While-Revalidate                                 │
│  ──────────────────────────────────────────────                              │
│  • Show cached data immediately                                              │
│  • Fetch fresh data in background                                           │
│  • Update UI if data differs                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Database Design

### SQL vs NoSQL Decision Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE CHOICE RATIONALE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     PostgreSQL (SQL)                                 │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Restaurant master data (ACID transactions)                       │   │
│  │  • User accounts & authentication                                   │   │
│  │  • Orders & payments (financial data)                               │   │
│  │  • Geographic queries (PostGIS extension)                           │   │
│  │                                                                      │   │
│  │  WHY SQL:                                                            │   │
│  │  • Strong consistency required                                       │   │
│  │  • Complex joins (restaurant + owner + location)                    │   │
│  │  • ACID for payment transactions                                    │   │
│  │  • Spatial indexing with PostGIS                                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     MongoDB (NoSQL - Document)                       │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Menu items (flexible schema, nested)                             │   │
│  │  • Restaurant reviews & ratings                                     │   │
│  │  • User preferences & history                                       │   │
│  │  • Search filters & tags                                            │   │
│  │                                                                      │   │
│  │  WHY NoSQL:                                                          │   │
│  │  • Flexible schema (menus vary by restaurant)                       │   │
│  │  • Read-heavy workload                                               │   │
│  │  • Nested documents (menu → categories → items)                     │   │
│  │  • Horizontal scaling for reviews                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Elasticsearch                                    │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Full-text search (restaurant names, cuisines)                    │   │
│  │  • Autocomplete suggestions                                          │   │
│  │  • Fuzzy matching ("pizzza" → "pizza")                              │   │
│  │  • Faceted filters (count by cuisine)                               │   │
│  │                                                                      │   │
│  │  WHY Elasticsearch:                                                  │   │
│  │  • Optimized for text search                                         │   │
│  │  • Aggregations for filter counts                                   │   │
│  │  • Geo-distance queries                                              │   │
│  │  • Near real-time indexing                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Redis                                            │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Session storage                                                   │   │
│  │  • Rate limiting counters                                           │   │
│  │  • Real-time ETA cache                                              │   │
│  │  • Leaderboard (popular restaurants)                                │   │
│  │  • Geo-spatial queries (GEOADD, GEORADIUS)                          │   │
│  │                                                                      │   │
│  │  WHY Redis:                                                          │   │
│  │  • Sub-millisecond latency                                          │   │
│  │  • Built-in data structures                                         │   │
│  │  • TTL for cache expiration                                         │   │
│  │  • Pub/Sub for real-time                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Database Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PostgreSQL Schema                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  restaurants                                                                 │
│  ├── id (UUID, PK)                                                          │
│  ├── name (VARCHAR)                                                         │
│  ├── slug (VARCHAR, UNIQUE)                                                 │
│  ├── description (TEXT)                                                     │
│  ├── location (GEOGRAPHY - PostGIS)                                        │
│  ├── address (JSONB)                                                        │
│  ├── rating (DECIMAL)                                                       │
│  ├── rating_count (INT)                                                     │
│  ├── price_range (SMALLINT) -- 1-4                                         │
│  ├── cuisines (VARCHAR[]) -- Array                                          │
│  ├── is_open (BOOLEAN)                                                      │
│  ├── opening_hours (JSONB)                                                  │
│  ├── avg_prep_time (INT) -- minutes                                        │
│  ├── min_order (DECIMAL)                                                    │
│  ├── delivery_fee (DECIMAL)                                                 │
│  ├── image_url (VARCHAR)                                                    │
│  ├── created_at (TIMESTAMP)                                                 │
│  └── updated_at (TIMESTAMP)                                                 │
│                                                                              │
│  Indexes:                                                                    │
│  • GIST index on location (spatial queries)                                 │
│  • B-tree on rating, price_range                                            │
│  • GIN on cuisines (array contains)                                         │
│                                                                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MongoDB Schema (Menu)                                                       │
│  ─────────────────────                                                       │
│  {                                                                           │
│    "_id": ObjectId,                                                         │
│    "restaurant_id": "uuid",                                                 │
│    "categories": [                                                          │
│      {                                                                       │
│        "name": "Starters",                                                  │
│        "items": [                                                           │
│          {                                                                   │
│            "id": "item-123",                                                │
│            "name": "Spring Rolls",                                          │
│            "description": "...",                                            │
│            "price": 8.99,                                                   │
│            "image": "url",                                                  │
│            "dietary": ["vegetarian", "vegan"],                              │
│            "customizations": [...]                                          │
│          }                                                                   │
│        ]                                                                     │
│      }                                                                       │
│    ]                                                                         │
│  }                                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Caching Strategy

### Multi-Layer Caching Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CACHING LAYERS                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER 1: Browser Cache (Client-side)                                       │
│  ─────────────────────────────────────                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • HTTP Cache (Cache-Control headers)                               │   │
│  │    - Static assets: max-age=31536000 (1 year)                       │   │
│  │    - API responses: max-age=60, stale-while-revalidate=300          │   │
│  │                                                                      │   │
│  │  • Service Worker Cache (PWA)                                       │   │
│  │    - Offline-first for static assets                                │   │
│  │    - Network-first for API calls                                    │   │
│  │                                                                      │   │
│  │  • React Query / SWR Cache                                          │   │
│  │    - In-memory cache with TTL                                       │   │
│  │    - Automatic revalidation                                         │   │
│  │    - Deduplication of requests                                      │   │
│  │                                                                      │   │
│  │  • LocalStorage / IndexedDB                                         │   │
│  │    - Recent searches                                                 │   │
│  │    - User preferences                                                │   │
│  │    - Last viewed restaurants                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LAYER 2: CDN Cache (Edge)                                                  │
│  ──────────────────────────                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • CloudFront / Akamai / Fastly                                     │   │
│  │    - Static assets (JS, CSS, images)                                │   │
│  │    - Restaurant images (resized variants)                           │   │
│  │                                                                      │   │
│  │  • API Response Caching (with Vary header)                          │   │
│  │    - Cache by: location (geohash), filters                         │   │
│  │    - TTL: 60 seconds for listings                                   │   │
│  │    - Surrogate keys for targeted invalidation                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LAYER 3: Application Cache (Backend)                                       │
│  ──────────────────────────────────────                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Redis (Primary Cache)                                            │   │
│  │    - Restaurant data by geohash: restaurant:geo:{geohash}          │   │
│  │    - ETA calculations: eta:{restaurant_id}:{user_location_hash}    │   │
│  │    - Search results: search:{query_hash}                            │   │
│  │    - Filter options: filters:{city_id}                              │   │
│  │    - TTL: 60-300 seconds                                            │   │
│  │                                                                      │   │
│  │  • Local Cache (In-process)                                         │   │
│  │    - Hot data (top 100 restaurants per city)                        │   │
│  │    - Configuration data                                              │   │
│  │    - Static reference data (cuisines, categories)                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cache Key Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CACHE KEY PATTERNS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Location-based Cache Keys (using Geohash)                                  │
│  ─────────────────────────────────────────                                   │
│                                                                              │
│  User Location: (37.7749, -122.4194)                                        │
│        │                                                                     │
│        ▼                                                                     │
│  Geohash: 9q8yy (precision 5 = ~5km grid)                                  │
│        │                                                                     │
│        ▼                                                                     │
│  Cache Key: restaurants:geo:9q8yy:filters:{filter_hash}:sort:{sort}        │
│                                                                              │
│                                                                              │
│  Benefits of Geohash:                                                       │
│  • Nearby users share cache (same geohash cell)                            │
│  • Hierarchical (9q8yy contains 9q8yy1, 9q8yy2, etc.)                     │
│  • Efficient spatial indexing                                               │
│                                                                              │
│                                                                              │
│  Cache Invalidation Strategies                                              │
│  ─────────────────────────────                                               │
│  ┌──────────────────┬───────────────────────────────────────────────────┐  │
│  │  Event           │  Invalidation Action                              │  │
│  ├──────────────────┼───────────────────────────────────────────────────┤  │
│  │  Restaurant      │  Invalidate: restaurants:geo:* where             │  │
│  │  updates         │  geohash overlaps with restaurant location        │  │
│  ├──────────────────┼───────────────────────────────────────────────────┤  │
│  │  Menu change     │  Invalidate: menu:{restaurant_id}                 │  │
│  ├──────────────────┼───────────────────────────────────────────────────┤  │
│  │  Rating update   │  Background job to update cached restaurant      │  │
│  ├──────────────────┼───────────────────────────────────────────────────┤  │
│  │  Opens/Closes    │  Pub/Sub to update all affected caches           │  │
│  └──────────────────┴───────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Caching with React Query

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REACT QUERY CACHING STRATEGY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Configuration:                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  const queryClient = new QueryClient({                              │   │
│  │    defaultOptions: {                                                 │   │
│  │      queries: {                                                      │   │
│  │        staleTime: 60 * 1000,        // 1 minute                     │   │
│  │        cacheTime: 5 * 60 * 1000,    // 5 minutes                    │   │
│  │        refetchOnWindowFocus: true,                                  │   │
│  │        refetchOnReconnect: true,                                    │   │
│  │        retry: 3,                                                     │   │
│  │      }                                                               │   │
│  │    }                                                                 │   │
│  │  });                                                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Query Key Structure:                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ['restaurants', { lat, lng, filters, sort, cursor }]               │   │
│  │  ['restaurant', restaurantId]                                       │   │
│  │  ['search', { query, lat, lng }]                                    │   │
│  │  ['filters', { lat, lng }]                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Optimistic Updates:                                                        │
│  • When user favorites a restaurant, update cache immediately              │
│  • Rollback on server error                                                 │
│                                                                              │
│  Prefetching:                                                               │
│  • Prefetch next page on scroll near bottom                                │
│  • Prefetch restaurant detail on card hover                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. State Management

### State Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT STRATEGY                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SERVER STATE (React Query / SWR)                                   │   │
│  │  ─────────────────────────────────                                   │   │
│  │  • Restaurant list data                                              │   │
│  │  • Restaurant details                                                │   │
│  │  • Search results                                                    │   │
│  │  • Filter options                                                    │   │
│  │                                                                      │   │
│  │  Why: Automatic caching, refetching, deduplication                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  URL STATE (React Router / Next.js)                                 │   │
│  │  ──────────────────────────────────                                  │   │
│  │  • Active filters: ?cuisine=italian,chinese                        │   │
│  │  • Sort order: ?sort=rating                                         │   │
│  │  • Search query: ?q=pizza                                           │   │
│  │  • Pagination cursor: ?cursor=abc123                                │   │
│  │                                                                      │   │
│  │  Why: Shareable URLs, browser back/forward, bookmarkable            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  GLOBAL UI STATE (Context / Zustand)                                │   │
│  │  ───────────────────────────────────                                 │   │
│  │  • User location (lat, lng, address)                                │   │
│  │  • Authentication state                                              │   │
│  │  • Cart state                                                        │   │
│  │  • Theme preference                                                  │   │
│  │                                                                      │   │
│  │  Why: Accessed by many components, infrequent updates               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LOCAL UI STATE (useState / useReducer)                             │   │
│  │  ──────────────────────────────────────                              │   │
│  │  • Filter dropdown open/closed                                      │   │
│  │  • Hover states                                                      │   │
│  │  • Form input values                                                 │   │
│  │  • Loading states                                                    │   │
│  │                                                                      │   │
│  │  Why: Component-specific, no need to share                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              STATE FLOW                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User Action          State Update           Side Effects         UI Update │
│   ───────────────────────────────────────────────────────────────────────── │
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐│
│   │ Click       │     │ Update URL  │     │ React Query │     │ Re-render ││
│   │ "Italian"   │────>│ ?cuisine=   │────>│ fetches new │────>│ restaurant││
│   │ filter      │     │ italian     │     │ data        │     │ list      ││
│   └─────────────┘     └─────────────┘     └─────────────┘     └───────────┘│
│                              │                    │                         │
│                              │                    │                         │
│                              ▼                    ▼                         │
│                       ┌─────────────┐     ┌─────────────┐                  │
│                       │ URL becomes │     │ Cache       │                  │
│                       │ shareable   │     │ populated   │                  │
│                       └─────────────┘     └─────────────┘                  │
│                                                                              │
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌───────────┐│
│   │ Change      │     │ Update      │     │ Fetch new   │     │ Re-render ││
│   │ location    │────>│ Context     │────>│ restaurants │────>│ entire    ││
│   │             │     │ (global)    │     │ for new loc │     │ page      ││
│   └─────────────┘     └─────────────┘     └─────────────┘     └───────────┘│
│                              │                                              │
│                              ▼                                              │
│                       ┌─────────────┐                                       │
│                       │ Persist to  │                                       │
│                       │ localStorage│                                       │
│                       └─────────────┘                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance Optimization

### Core Web Vitals Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CORE WEB VITALS TARGETS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Metric              Target        Optimization Strategy                    │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  LCP (Largest        < 2.5s       • SSR/SSG for initial HTML               │
│  Contentful Paint)                 • Preload hero image                     │
│                                    • CDN for static assets                  │
│                                    • Critical CSS inlining                  │
│                                                                              │
│  FID (First Input    < 100ms      • Code splitting                         │
│  Delay)                            • Defer non-critical JS                  │
│                                    • Web Workers for heavy tasks            │
│                                    • Avoid long tasks (>50ms)               │
│                                                                              │
│  CLS (Cumulative     < 0.1        • Reserve space for images               │
│  Layout Shift)                     • Set explicit dimensions                │
│                                    • Avoid injecting content above fold     │
│                                    • Use skeleton screens                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Image Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       IMAGE OPTIMIZATION                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Strategy                        Implementation                             │
│  ────────────────────────────────────────────────────────────────────────── │
│                                                                              │
│  Responsive Images               <img                                       │
│                                    srcset="small.jpg 300w,                  │
│                                            medium.jpg 600w,                 │
│                                            large.jpg 1200w"                 │
│                                    sizes="(max-width: 600px) 100vw, 50vw"  │
│                                  />                                         │
│                                                                              │
│  Modern Formats                  <picture>                                  │
│                                    <source srcset="img.avif" type="avif">  │
│                                    <source srcset="img.webp" type="webp">  │
│                                    <img src="img.jpg">                      │
│                                  </picture>                                 │
│                                                                              │
│  Lazy Loading                    <img loading="lazy" />                     │
│                                  Use Intersection Observer for custom       │
│                                                                              │
│  Blur-up Placeholder             Show blurred low-res while loading        │
│                                  LQIP (Low Quality Image Placeholder)       │
│                                                                              │
│  CDN Image Service               Cloudinary / imgix                         │
│                                  ?w=300&h=200&fit=crop&format=auto          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### List Virtualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     LIST VIRTUALIZATION                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Problem: Rendering 1000+ restaurant cards kills performance                │
│                                                                              │
│  Solution: Only render visible items + buffer                               │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │                                                                        │ │
│  │  ╔═══════════════════════════════════════════════════════════════════╗│ │
│  │  ║  Spacer (height = items above * item height)                      ║│ │
│  │  ╠═══════════════════════════════════════════════════════════════════╣│ │
│  │  ║  Buffer Zone (2-3 items above viewport)                           ║│ │
│  │  ╠═══════════════════════════════════════════════════════════════════╣│ │
│  │  ║                                                                    ║│ │
│  │  ║                   VISIBLE VIEWPORT                                 ║│ │
│  │  ║                   (rendered items)                                 ║│ │
│  │  ║                                                                    ║│ │
│  │  ╠═══════════════════════════════════════════════════════════════════╣│ │
│  │  ║  Buffer Zone (2-3 items below viewport)                           ║│ │
│  │  ╠═══════════════════════════════════════════════════════════════════╣│ │
│  │  ║  Spacer (height = items below * item height)                      ║│ │
│  │  ╚═══════════════════════════════════════════════════════════════════╝│ │
│  │                                                                        │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│  Libraries: react-window, react-virtualized, @tanstack/virtual             │
│                                                                              │
│  DOM nodes: Always ~20 regardless of total items                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Bundle Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      BUNDLE OPTIMIZATION                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Code Splitting Strategy:                                                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  main.js (critical)                                                  │   │
│  │  ├── React core                                                      │   │
│  │  ├── Router                                                          │   │
│  │  ├── Header component                                                │   │
│  │  └── RestaurantList skeleton                                         │   │
│  │                                                                      │   │
│  │  restaurants.chunk.js (lazy)                                         │   │
│  │  ├── RestaurantCard                                                  │   │
│  │  ├── FilterBar                                                       │   │
│  │  └── Virtualization library                                          │   │
│  │                                                                      │   │
│  │  search.chunk.js (lazy)                                              │   │
│  │  └── SearchBar + Autocomplete                                        │   │
│  │                                                                      │   │
│  │  maps.chunk.js (lazy, on-demand)                                     │   │
│  │  └── Google Maps integration                                         │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Route-based splitting:                                                     │
│  • /restaurants → RestaurantListPage.chunk.js                              │
│  • /restaurant/:id → RestaurantDetailPage.chunk.js                         │
│  • /checkout → CheckoutPage.chunk.js                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Error Handling & Edge Cases

### Error Boundary Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ERROR HANDLING                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Error Types & Handling:                                                    │
│                                                                              │
│  ┌─────────────────┬───────────────────────────────────────────────────┐   │
│  │  Error Type     │  Handling Strategy                                │   │
│  ├─────────────────┼───────────────────────────────────────────────────┤   │
│  │  Network Error  │  • Show cached data if available                  │   │
│  │                 │  • Display offline banner                         │   │
│  │                 │  • Retry button with exponential backoff          │   │
│  ├─────────────────┼───────────────────────────────────────────────────┤   │
│  │  API 4xx        │  • 400: Show validation errors                    │   │
│  │                 │  • 401: Redirect to login                         │   │
│  │                 │  • 404: Show "No restaurants found"               │   │
│  │                 │  • 429: Show "Too many requests", auto-retry      │   │
│  ├─────────────────┼───────────────────────────────────────────────────┤   │
│  │  API 5xx        │  • Show error message                             │   │
│  │                 │  • Log to monitoring (Sentry)                     │   │
│  │                 │  • Auto-retry 3 times                             │   │
│  ├─────────────────┼───────────────────────────────────────────────────┤   │
│  │  Location Error │  • Show location permission request               │   │
│  │                 │  • Allow manual address entry                     │   │
│  │                 │  • Use IP-based geolocation fallback              │   │
│  ├─────────────────┼───────────────────────────────────────────────────┤   │
│  │  Render Error   │  • Error boundary catches                         │   │
│  │                 │  • Show fallback UI                               │   │
│  │                 │  • Log stack trace                                │   │
│  └─────────────────┴───────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Edge Cases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EDGE CASES                                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Empty States                                                            │
│     • No restaurants in area → "Expand your search radius"                 │
│     • No results for filters → "Try removing some filters"                 │
│     • No search results → "Try different keywords"                         │
│                                                                              │
│  2. Location Edge Cases                                                     │
│     • User denies location → Show address input                            │
│     • Inaccurate GPS → Show "Confirm your location" prompt                 │
│     • International user → Show "We don't deliver here"                    │
│                                                                              │
│  3. Data Consistency                                                        │
│     • Restaurant closes mid-scroll → Show "Currently closed" badge         │
│     • Price changes → Show "Price may have changed" on stale data          │
│     • Menu unavailable → Disable order button, show message                │
│                                                                              │
│  4. Performance Edge Cases                                                  │
│     • Slow network → Progressive loading, show skeletons                   │
│     • Large dataset → Virtualization kicks in automatically                │
│     • Memory pressure → Evict old cache entries                            │
│                                                                              │
│  5. Concurrent Updates                                                      │
│     • Multiple filter changes → Debounce, use latest only                  │
│     • Rapid scroll → Throttle intersection observer                        │
│     • Multiple tabs → Sync via broadcast channel                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 11. Interview Cross-Questions

### Common Questions & Answers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    INTERVIEW CROSS-QUESTIONS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Q: Why REST instead of GraphQL for restaurant listing?                     │
│  A: • REST is simpler and more cacheable at CDN level                       │
│     • Restaurant listing is a fixed shape (no over-fetching concern)        │
│     • GraphQL adds complexity without significant benefit here              │
│     • Would use GraphQL for restaurant detail page (nested menu, reviews)   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How would you handle 10M concurrent users?                              │
│  A: • CDN caching with geohash-based cache keys                            │
│     • Database read replicas per region                                     │
│     • Redis cluster for hot data                                            │
│     • Horizontal scaling of API servers                                     │
│     • Rate limiting at API gateway                                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: Why cursor pagination instead of offset?                                │
│  A: • Offset breaks when data changes (insertions/deletions)               │
│     • Cursor maintains consistency across pages                             │
│     • Better performance (no OFFSET scan in DB)                            │
│     • Works well with real-time data                                        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you handle real-time ETA updates?                                │
│  A: • SSE for visible restaurants (subscribe to IDs)                       │
│     • Unsubscribe when scrolled out of view                                │
│     • Batch updates (every 30s, not per-second)                            │
│     • Optimistic UI (show last known ETA while fetching)                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: Why PostgreSQL for restaurants, MongoDB for menus?                      │
│  A: • Restaurants: Fixed schema, needs ACID, spatial queries               │
│     • Menus: Variable structure, read-heavy, nested documents              │
│     • Polyglot persistence: Use right tool for each job                    │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How would you implement offline support?                                │
│  A: • Service Worker with Cache API                                        │
│     • Cache restaurant list and images                                      │
│     • IndexedDB for structured data                                        │
│     • Show "offline mode" banner                                           │
│     • Queue actions for sync when online                                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you ensure accessibility?                                        │
│  A: • Semantic HTML (nav, main, article, aside)                            │
│     • ARIA labels for interactive elements                                  │
│     • Keyboard navigation support                                           │
│     • Focus management on infinite scroll                                   │
│     • Screen reader announcements for updates                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: What metrics would you track?                                           │
│  A: • Core Web Vitals (LCP, FID, CLS)                                      │
│     • Time to first restaurant render                                       │
│     • Filter/sort interaction latency                                       │
│     • Search-to-click conversion rate                                       │
│     • Error rate by category                                                │
│     • Cache hit ratio                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Trade-off Discussions

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRADE-OFF DISCUSSIONS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SSR vs CSR vs SSG                                                          │
│  ─────────────────                                                           │
│  For restaurant listing:                                                    │
│  • SSR: Best for SEO, slower TTFB, higher server cost                      │
│  • CSR: Faster subsequent navigations, poorer SEO, slower initial         │
│  • SSG: Fast, but stale data (not suitable for dynamic content)            │
│  • Recommendation: SSR with ISR (Incremental Static Regeneration)          │
│                                                                              │
│                                                                              │
│  Monolith vs Micro-frontends                                                │
│  ───────────────────────────                                                 │
│  For Uber Eats scale:                                                       │
│  • Monolith: Simpler, faster initial development                           │
│  • Micro-frontends: Team scalability, independent deployments              │
│  • Recommendation: Start monolith, split when team grows > 50              │
│                                                                              │
│                                                                              │
│  State Management Library Choice                                            │
│  ───────────────────────────────                                             │
│  • Redux: Overkill for this use case, too much boilerplate                 │
│  • Zustand: Good for global UI state, simple API                           │
│  • React Query: Perfect for server state, built-in caching                 │
│  • Recommendation: React Query + Zustand + URL state                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUICK REFERENCE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Protocol Choice:                                                           │
│  • Listing → REST (cacheable, simple)                                       │
│  • Detail → GraphQL (nested data)                                           │
│  • Real-time → SSE (one-way updates)                                        │
│  • Order tracking → WebSocket (bidirectional)                               │
│                                                                              │
│  Database Choice:                                                           │
│  • Core data (restaurants, users, orders) → PostgreSQL                     │
│  • Flexible data (menus, reviews) → MongoDB                                │
│  • Search → Elasticsearch                                                   │
│  • Cache → Redis                                                            │
│                                                                              │
│  Caching Layers:                                                            │
│  • Browser → Service Worker, React Query                                    │
│  • CDN → Static assets, API responses                                       │
│  • Backend → Redis, in-memory                                               │
│                                                                              │
│  Performance:                                                               │
│  • Virtualization for long lists                                            │
│  • Code splitting for bundles                                               │
│  • Lazy loading for images                                                  │
│  • Debouncing for user input                                                │
│                                                                              │
│  State Management:                                                          │
│  • Server state → React Query                                               │
│  • URL state → Router params                                                │
│  • Global UI → Context/Zustand                                              │
│  • Local UI → useState                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Accessibility (a11y) Deep Dive

### Restaurant Card Accessibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ACCESSIBLE RESTAURANT CARD                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Component Structure:                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  <article                                                           │   │
│  │    role="article"                                                   │   │
│  │    aria-labelledby="restaurant-name-123"                           │   │
│  │    aria-describedby="restaurant-details-123"                       │   │
│  │  >                                                                  │   │
│  │    <a href="/restaurant/123" aria-label="View Burger Palace menu"> │   │
│  │      <img                                                           │   │
│  │        src="restaurant.jpg"                                        │   │
│  │        alt="Burger Palace restaurant exterior"                     │   │
│  │        loading="lazy"                                               │   │
│  │      />                                                             │   │
│  │    </a>                                                             │   │
│  │                                                                     │   │
│  │    <h3 id="restaurant-name-123">Burger Palace</h3>                 │   │
│  │                                                                     │   │
│  │    <div id="restaurant-details-123">                               │   │
│  │      <span aria-label="Rating: 4.5 out of 5 stars">               │   │
│  │        ★★★★☆ 4.5                                                   │   │
│  │      </span>                                                        │   │
│  │      <span aria-label="Delivery time: 25 to 35 minutes">          │   │
│  │        25-35 min                                                    │   │
│  │      </span>                                                        │   │
│  │      <span aria-label="Price range: moderate">$$</span>            │   │
│  │    </div>                                                           │   │
│  │                                                                     │   │
│  │    <button                                                          │   │
│  │      aria-label="Add Burger Palace to favorites"                   │   │
│  │      aria-pressed="false"                                          │   │
│  │    >                                                                │   │
│  │      ♡                                                              │   │
│  │    </button>                                                        │   │
│  │  </article>                                                         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### TypeScript Implementation

```typescript
// components/RestaurantCard/RestaurantCard.tsx
interface RestaurantCardProps {
  restaurant: Restaurant;
  onFavorite: (id: string) => void;
  isFavorite: boolean;
}

const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
  onFavorite,
  isFavorite,
}) => {
  const cardRef = useRef<HTMLElement>(null);
  const { id, name, rating, deliveryTime, priceRange, image, cuisines } = restaurant;

  // Generate accessible price description
  const priceDescription = useMemo(() => {
    const labels = ['budget-friendly', 'moderate', 'upscale', 'fine dining'];
    return labels[priceRange - 1] || 'moderate';
  }, [priceRange]);

  // Generate star rating description
  const ratingDescription = `Rating: ${rating} out of 5 stars`;

  // Generate delivery time description
  const deliveryDescription = `Delivery time: ${deliveryTime.min} to ${deliveryTime.max} minutes`;

  return (
    <article
      ref={cardRef}
      className="restaurant-card"
      aria-labelledby={`restaurant-name-${id}`}
      aria-describedby={`restaurant-details-${id}`}
    >
      <Link
        href={`/restaurant/${id}`}
        aria-label={`View ${name} menu, ${cuisines.join(', ')}`}
        className="restaurant-card__link"
      >
        <div className="restaurant-card__image-container">
          <Image
            src={image}
            alt={`${name} restaurant`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          {restaurant.isPromoted && (
            <span className="badge" role="status" aria-label="Promoted restaurant">
              Promoted
            </span>
          )}
        </div>

        <div className="restaurant-card__content">
          <h3 id={`restaurant-name-${id}`} className="restaurant-card__name">
            {name}
          </h3>

          <div id={`restaurant-details-${id}`} className="restaurant-card__details">
            <span aria-label={ratingDescription} className="restaurant-card__rating">
              <StarIcon aria-hidden="true" />
              <span>{rating}</span>
            </span>

            <span aria-label={deliveryDescription} className="restaurant-card__eta">
              <ClockIcon aria-hidden="true" />
              <span>{deliveryTime.min}-{deliveryTime.max} min</span>
            </span>

            <span aria-label={`Price range: ${priceDescription}`}>
              {'$'.repeat(priceRange)}
            </span>
          </div>

          <p className="restaurant-card__cuisines" aria-label={`Cuisines: ${cuisines.join(', ')}`}>
            {cuisines.join(' • ')}
          </p>
        </div>
      </Link>

      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          onFavorite(id);
        }}
        aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
        aria-pressed={isFavorite}
        className="restaurant-card__favorite"
      >
        {isFavorite ? <HeartFilledIcon aria-hidden="true" /> : <HeartIcon aria-hidden="true" />}
      </button>
    </article>
  );
};
```

### Filter Controls Accessibility

```typescript
// components/FilterBar/FilterBar.tsx
interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  filterOptions: FilterOptions;
}

const FilterBar: React.FC<FilterBarProps> = ({ filters, onFilterChange, filterOptions }) => {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const filterBarRef = useRef<HTMLDivElement>(null);

  // Announce filter changes to screen readers
  const announceFilter = useCallback((message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }, []);

  const handleCuisineToggle = (cuisine: string) => {
    const newCuisines = filters.cuisines.includes(cuisine)
      ? filters.cuisines.filter(c => c !== cuisine)
      : [...filters.cuisines, cuisine];

    onFilterChange({ ...filters, cuisines: newCuisines });

    const action = filters.cuisines.includes(cuisine) ? 'removed' : 'added';
    announceFilter(`${cuisine} filter ${action}. ${newCuisines.length} filters active.`);
  };

  return (
    <div
      ref={filterBarRef}
      role="group"
      aria-label="Restaurant filters"
      className="filter-bar"
    >
      {/* Cuisine Multi-Select Filter */}
      <div className="filter-dropdown">
        <button
          type="button"
          aria-expanded={openDropdown === 'cuisine'}
          aria-haspopup="listbox"
          aria-controls="cuisine-listbox"
          onClick={() => setOpenDropdown(openDropdown === 'cuisine' ? null : 'cuisine')}
          className="filter-dropdown__trigger"
        >
          <span>Cuisine</span>
          {filters.cuisines.length > 0 && (
            <span
              className="filter-dropdown__count"
              aria-label={`${filters.cuisines.length} cuisines selected`}
            >
              {filters.cuisines.length}
            </span>
          )}
          <ChevronDownIcon aria-hidden="true" />
        </button>

        {openDropdown === 'cuisine' && (
          <ul
            id="cuisine-listbox"
            role="listbox"
            aria-multiselectable="true"
            aria-label="Select cuisines"
            className="filter-dropdown__menu"
          >
            {filterOptions.cuisines.map((cuisine) => (
              <li
                key={cuisine.value}
                role="option"
                aria-selected={filters.cuisines.includes(cuisine.value)}
                onClick={() => handleCuisineToggle(cuisine.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCuisineToggle(cuisine.value);
                  }
                }}
                tabIndex={0}
                className="filter-dropdown__option"
              >
                <span className="filter-dropdown__checkbox" aria-hidden="true">
                  {filters.cuisines.includes(cuisine.value) ? '☑' : '☐'}
                </span>
                <span>{cuisine.label}</span>
                <span className="filter-dropdown__count">({cuisine.count})</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Rating Filter */}
      <div className="filter-dropdown">
        <button
          type="button"
          aria-expanded={openDropdown === 'rating'}
          aria-haspopup="listbox"
          aria-controls="rating-listbox"
          onClick={() => setOpenDropdown(openDropdown === 'rating' ? null : 'rating')}
        >
          <span>Rating</span>
          {filters.minRating && (
            <span aria-label={`Minimum ${filters.minRating} stars selected`}>
              {filters.minRating}+
            </span>
          )}
        </button>

        {openDropdown === 'rating' && (
          <ul
            id="rating-listbox"
            role="listbox"
            aria-label="Select minimum rating"
          >
            {[4.5, 4.0, 3.5, 3.0].map((rating) => (
              <li
                key={rating}
                role="option"
                aria-selected={filters.minRating === rating}
                onClick={() => {
                  onFilterChange({ ...filters, minRating: rating });
                  announceFilter(`Showing restaurants with ${rating} stars and above`);
                }}
                tabIndex={0}
              >
                <span aria-label={`${rating} stars and above`}>
                  {'★'.repeat(Math.floor(rating))}
                  {rating % 1 !== 0 && '½'}
                  {' '}{rating}+
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Active Filters Chips */}
      {(filters.cuisines.length > 0 || filters.minRating) && (
        <div role="group" aria-label="Active filters" className="active-filters">
          {filters.cuisines.map((cuisine) => (
            <button
              key={cuisine}
              type="button"
              onClick={() => handleCuisineToggle(cuisine)}
              aria-label={`Remove ${cuisine} filter`}
              className="filter-chip"
            >
              {cuisine}
              <CloseIcon aria-hidden="true" />
            </button>
          ))}

          <button
            type="button"
            onClick={() => {
              onFilterChange({ cuisines: [], minRating: null, priceRange: [], maxEta: null });
              announceFilter('All filters cleared');
            }}
            className="filter-chip filter-chip--clear"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};
```

### Infinite Scroll Accessibility

```typescript
// hooks/useAccessibleInfiniteScroll.ts
interface UseAccessibleInfiniteScrollOptions {
  onLoadMore: () => Promise<void>;
  hasMore: boolean;
  isLoading: boolean;
  itemCount: number;
  pageSize: number;
}

const useAccessibleInfiniteScroll = ({
  onLoadMore,
  hasMore,
  isLoading,
  itemCount,
  pageSize,
}: UseAccessibleInfiniteScrollOptions) => {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreButtonRef = useRef<HTMLButtonElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const announcerRef = useRef<HTMLDivElement>(null);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Announce new content to screen readers
  const announceNewContent = useCallback((newCount: number) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = `Loaded ${newCount} more restaurants. ${itemCount + newCount} total restaurants displayed.`;
    }
  }, [itemCount]);

  // Intersection Observer for auto-load (only if reduced motion not preferred)
  useEffect(() => {
    if (prefersReducedMotion || !hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore().then(() => announceNewContent(pageSize));
        }
      },
      { rootMargin: '200px' }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, prefersReducedMotion, pageSize, announceNewContent]);

  // Manual load button for reduced motion users
  const LoadMoreButton = () => (
    <button
      ref={loadMoreButtonRef}
      type="button"
      onClick={async () => {
        await onLoadMore();
        announceNewContent(pageSize);
        // Return focus to first new item
        setTimeout(() => {
          const newItems = document.querySelectorAll('.restaurant-card');
          const firstNewItem = newItems[itemCount] as HTMLElement;
          firstNewItem?.focus();
        }, 100);
      }}
      disabled={isLoading}
      className="load-more-button"
      aria-label={isLoading ? 'Loading more restaurants' : `Load ${pageSize} more restaurants`}
    >
      {isLoading ? (
        <>
          <Spinner aria-hidden="true" />
          <span>Loading...</span>
        </>
      ) : (
        <span>Load more restaurants</span>
      )}
    </button>
  );

  // Screen reader announcer
  const Announcer = () => (
    <div
      ref={announcerRef}
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
    />
  );

  // Sentinel for auto-loading
  const Sentinel = () => (
    <div
      ref={sentinelRef}
      aria-hidden="true"
      className="infinite-scroll-sentinel"
    />
  );

  return {
    LoadMoreButton,
    Announcer,
    Sentinel,
    prefersReducedMotion,
  };
};
```

### Keyboard Navigation

```typescript
// hooks/useKeyboardNavigation.ts
interface UseKeyboardNavigationOptions {
  containerRef: RefObject<HTMLElement>;
  itemSelector: string;
  orientation?: 'horizontal' | 'vertical' | 'grid';
  columns?: number;
}

const useKeyboardNavigation = ({
  containerRef,
  itemSelector,
  orientation = 'vertical',
  columns = 1,
}: UseKeyboardNavigationOptions) => {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const getItems = (): HTMLElement[] => {
      return Array.from(container.querySelectorAll(itemSelector));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const items = getItems();
      if (items.length === 0) return;

      const currentIndex = items.findIndex((item) => item === document.activeElement);
      let nextIndex = currentIndex;

      switch (e.key) {
        case 'ArrowDown':
          if (orientation === 'grid') {
            nextIndex = Math.min(currentIndex + columns, items.length - 1);
          } else if (orientation === 'vertical') {
            nextIndex = Math.min(currentIndex + 1, items.length - 1);
          }
          break;

        case 'ArrowUp':
          if (orientation === 'grid') {
            nextIndex = Math.max(currentIndex - columns, 0);
          } else if (orientation === 'vertical') {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
          break;

        case 'ArrowRight':
          if (orientation === 'grid' || orientation === 'horizontal') {
            nextIndex = Math.min(currentIndex + 1, items.length - 1);
          }
          break;

        case 'ArrowLeft':
          if (orientation === 'grid' || orientation === 'horizontal') {
            nextIndex = Math.max(currentIndex - 1, 0);
          }
          break;

        case 'Home':
          e.preventDefault();
          nextIndex = 0;
          break;

        case 'End':
          e.preventDefault();
          nextIndex = items.length - 1;
          break;

        default:
          return;
      }

      if (nextIndex !== currentIndex && nextIndex >= 0) {
        e.preventDefault();
        items[nextIndex].focus();
        setFocusedIndex(nextIndex);
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [containerRef, itemSelector, orientation, columns]);

  return { focusedIndex };
};

// Usage in RestaurantList
const RestaurantList: React.FC<RestaurantListProps> = ({ restaurants }) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(3);

  // Update column count on resize
  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 640) setColumns(1);
      else if (width < 1024) setColumns(2);
      else setColumns(3);
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  useKeyboardNavigation({
    containerRef: listRef,
    itemSelector: '.restaurant-card',
    orientation: 'grid',
    columns,
  });

  return (
    <div
      ref={listRef}
      role="feed"
      aria-busy={isLoading}
      aria-label="Restaurant listings"
      className="restaurant-grid"
    >
      {restaurants.map((restaurant, index) => (
        <RestaurantCard
          key={restaurant.id}
          restaurant={restaurant}
          tabIndex={0}
          aria-setsize={totalCount}
          aria-posinset={index + 1}
        />
      ))}
    </div>
  );
};
```

### Skip Links & Focus Management

```typescript
// components/SkipLinks/SkipLinks.tsx
const SkipLinks: React.FC = () => {
  return (
    <nav aria-label="Skip links" className="skip-links">
      <a href="#main-content" className="skip-link">
        Skip to restaurant listings
      </a>
      <a href="#filters" className="skip-link">
        Skip to filters
      </a>
      <a href="#search" className="skip-link">
        Skip to search
      </a>
    </nav>
  );
};

// styles/skip-links.css
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-link {
  position: absolute;
  left: -9999px;
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  font-weight: 600;
}

.skip-link:focus {
  left: 0;
  top: 0;
}

// Focus trap for modals
// hooks/useFocusTrap.ts
const useFocusTrap = (isActive: boolean, containerRef: RefObject<HTMLElement>) => {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    // Focus first element
    firstFocusable?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          e.preventDefault();
          firstFocusable?.focus();
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [isActive, containerRef]);
};
```

### Accessibility Testing Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    A11Y TESTING CHECKLIST                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Automated Testing:                                                          │
│  ☐ axe-core integration in CI/CD                                            │
│  ☐ Lighthouse accessibility audit (score > 90)                              │
│  ☐ ESLint jsx-a11y plugin                                                   │
│  ☐ jest-axe for component tests                                             │
│                                                                              │
│  Manual Testing:                                                             │
│  ☐ Keyboard-only navigation (Tab, Enter, Arrows)                            │
│  ☐ Screen reader testing (VoiceOver, NVDA, JAWS)                            │
│  ☐ High contrast mode                                                        │
│  ☐ 200% zoom level                                                           │
│  ☐ Reduced motion preference                                                 │
│                                                                              │
│  WCAG 2.1 AA Checklist:                                                      │
│  ☐ 1.1.1 - All images have alt text                                         │
│  ☐ 1.3.1 - Proper heading hierarchy (h1 → h2 → h3)                          │
│  ☐ 1.4.3 - Contrast ratio 4.5:1 for text                                    │
│  ☐ 1.4.11 - Contrast ratio 3:1 for UI components                            │
│  ☐ 2.1.1 - All functionality keyboard accessible                            │
│  ☐ 2.4.3 - Logical focus order                                              │
│  ☐ 2.4.7 - Visible focus indicator                                          │
│  ☐ 4.1.2 - ARIA roles and states correct                                    │
│                                                                              │
│  Component-specific:                                                         │
│  ☐ Filters announce selection changes                                       │
│  ☐ Infinite scroll announces new content                                    │
│  ☐ Loading states communicated to AT                                        │
│  ☐ Error messages associated with inputs                                    │
│  ☐ Modal focus trapped and restored                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Security Implementation

### Security Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND SECURITY LAYERS                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      LAYER 1: Transport Security                    │   │
│  │  • HTTPS only (HSTS enabled)                                        │   │
│  │  • Certificate pinning (mobile)                                     │   │
│  │  • TLS 1.3 minimum                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      LAYER 2: Content Security                      │   │
│  │  • Content Security Policy (CSP)                                    │   │
│  │  • X-Content-Type-Options: nosniff                                 │   │
│  │  • X-Frame-Options: DENY                                            │   │
│  │  • Referrer-Policy: strict-origin-when-cross-origin                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      LAYER 3: Authentication                        │   │
│  │  • JWT tokens (access + refresh)                                    │   │
│  │  • HttpOnly cookies for refresh tokens                              │   │
│  │  • Short-lived access tokens (15 min)                               │   │
│  │  • Token rotation on refresh                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      LAYER 4: Input Validation                      │   │
│  │  • XSS prevention (sanitization + escaping)                        │   │
│  │  • SQL injection prevention (parameterized queries)                │   │
│  │  • CSRF tokens for state-changing operations                       │   │
│  │  • Rate limiting per user/IP                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Content Security Policy (CSP)

```typescript
// next.config.js or middleware.ts
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://maps.googleapis.com https://analytics.example.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  img-src 'self' data: blob: https://images.ubereats.com https://maps.gstatic.com;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.ubereats.com wss://realtime.ubereats.com https://analytics.example.com;
  frame-src 'self' https://maps.google.com;
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  upgrade-insecure-requests;
`;

// middleware.ts (Next.js)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('Content-Security-Policy', ContentSecurityPolicy.replace(/\n/g, ''));
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(self), microphone=()');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );

  return response;
}
```

### Authentication & Token Management

```typescript
// lib/auth/tokenManager.ts
interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class TokenManager {
  private accessToken: string | null = null;
  private expiresAt: number = 0;
  private refreshPromise: Promise<TokenPair> | null = null;

  constructor() {
    // Access token in memory only (not localStorage)
    // Refresh token in HttpOnly cookie (set by server)
  }

  async getAccessToken(): Promise<string> {
    // Check if token is about to expire (5 min buffer)
    if (this.accessToken && Date.now() < this.expiresAt - 5 * 60 * 1000) {
      return this.accessToken;
    }

    // Prevent multiple concurrent refresh calls
    if (this.refreshPromise) {
      const tokens = await this.refreshPromise;
      return tokens.accessToken;
    }

    return this.refreshTokens();
  }

  private async refreshTokens(): Promise<string> {
    this.refreshPromise = this.doRefresh();

    try {
      const tokens = await this.refreshPromise;
      this.accessToken = tokens.accessToken;
      this.expiresAt = tokens.expiresAt;
      return tokens.accessToken;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async doRefresh(): Promise<TokenPair> {
    const response = await fetch('/api/auth/refresh', {
      method: 'POST',
      credentials: 'include', // Include HttpOnly cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      // Refresh failed, user needs to re-login
      this.clearTokens();
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      throw new Error('Session expired');
    }

    return response.json();
  }

  clearTokens(): void {
    this.accessToken = null;
    this.expiresAt = 0;
  }
}

export const tokenManager = new TokenManager();

// Secure API client
// lib/api/secureClient.ts
class SecureApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const accessToken = await tokenManager.getAccessToken();

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', // CSRF protection
      },
    });

    // Handle 401 Unauthorized
    if (response.status === 401) {
      tokenManager.clearTokens();
      window.location.href = '/login';
      throw new Error('Unauthorized');
    }

    if (!response.ok) {
      throw new ApiError(response.status, await response.text());
    }

    return response.json();
  }

  // Convenience methods
  get<T>(endpoint: string): Promise<T> {
    return this.fetch<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.fetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new SecureApiClient(process.env.NEXT_PUBLIC_API_URL!);
```

### XSS Prevention

```typescript
// lib/security/sanitize.ts
import DOMPurify from 'dompurify';

// Configure DOMPurify for safe HTML rendering
const purifyConfig: DOMPurify.Config = {
  ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOW_DATA_ATTR: false,
  ADD_ATTR: ['target'], // Add target="_blank" to links
  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form'],
  FORBID_ATTR: ['onerror', 'onclick', 'onload', 'onmouseover'],
};

export function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, purifyConfig);
}

// Safe text rendering (no HTML)
export function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Validate and sanitize user input
export function sanitizeSearchQuery(query: string): string {
  return query
    .trim()
    .slice(0, 100) // Max length
    .replace(/[<>\"\'&]/g, ''); // Remove dangerous chars
}

// Validate URL parameters
export function sanitizeUrlParam(param: string): string {
  try {
    // Decode and re-encode to prevent double encoding attacks
    return encodeURIComponent(decodeURIComponent(param));
  } catch {
    return '';
  }
}

// Safe component for user-generated content
// components/SafeHtml/SafeHtml.tsx
interface SafeHtmlProps {
  html: string;
  className?: string;
}

const SafeHtml: React.FC<SafeHtmlProps> = ({ html, className }) => {
  const sanitizedHtml = useMemo(() => sanitizeHtml(html), [html]);

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
};

// Safe text component (escapes all HTML)
interface SafeTextProps {
  text: string;
  className?: string;
}

const SafeText: React.FC<SafeTextProps> = ({ text, className }) => {
  // React automatically escapes text content
  return <span className={className}>{text}</span>;
};
```

### CSRF Protection

```typescript
// lib/security/csrf.ts
class CsrfManager {
  private token: string | null = null;

  async getToken(): Promise<string> {
    if (this.token) {
      return this.token;
    }

    // Fetch CSRF token from server
    const response = await fetch('/api/csrf-token', {
      credentials: 'include',
    });

    const data = await response.json();
    this.token = data.csrfToken;

    return this.token!;
  }

  clearToken(): void {
    this.token = null;
  }
}

export const csrfManager = new CsrfManager();

// Enhanced API client with CSRF
// lib/api/apiClient.ts
async function fetchWithCsrf<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const method = options.method?.toUpperCase() || 'GET';

  // Add CSRF token for state-changing requests
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
    const csrfToken = await csrfManager.getToken();

    options.headers = {
      ...options.headers,
      'X-CSRF-Token': csrfToken,
    };
  }

  const response = await fetch(url, {
    ...options,
    credentials: 'include',
  });

  // Handle CSRF token expiration
  if (response.status === 403) {
    csrfManager.clearToken();
    // Retry once with fresh token
    const newToken = await csrfManager.getToken();
    options.headers = { ...options.headers, 'X-CSRF-Token': newToken };
    return fetch(url, options).then((r) => r.json());
  }

  return response.json();
}

// React hook for forms with CSRF
// hooks/useCsrfForm.ts
function useCsrfForm<T>(
  submitFn: (data: T, csrfToken: string) => Promise<void>
) {
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    csrfManager.getToken().then(setCsrfToken);
  }, []);

  const handleSubmit = async (data: T) => {
    setIsLoading(true);
    setError(null);

    try {
      await submitFn(data, csrfToken);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  return { handleSubmit, isLoading, error, csrfToken };
}
```

### Input Validation

```typescript
// lib/validation/schemas.ts
import { z } from 'zod';

// Restaurant search validation
export const searchQuerySchema = z.object({
  q: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-zA-Z0-9\s\-'.,]+$/, 'Invalid characters in search'),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Filter validation
export const filtersSchema = z.object({
  cuisines: z.array(z.string().max(50)).max(10).optional(),
  minRating: z.number().min(0).max(5).optional(),
  priceRange: z.array(z.number().min(1).max(4)).max(4).optional(),
  maxEta: z.number().min(0).max(120).optional(),
  sortBy: z.enum(['rating', 'distance', 'eta', 'popularity']).optional(),
});

// Location validation
export const locationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  address: z.string().max(500).optional(),
  placeId: z.string().max(100).optional(),
});

// Validate and sanitize function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors = result.error.errors.map((e) => e.message).join(', ');
    throw new ValidationError(`Invalid input: ${errors}`);
  }

  return result.data;
}

// Hook for validated forms
// hooks/useValidatedForm.ts
function useValidatedForm<T extends z.ZodSchema>(schema: T) {
  type FormData = z.infer<T>;

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (data: unknown): FormData | null => {
    const result = schema.safeParse(data);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach((error) => {
        const path = error.path.join('.');
        fieldErrors[path] = error.message;
      });
      setErrors(fieldErrors);
      return null;
    }

    setErrors({});
    return result.data;
  };

  return { validate, errors, clearErrors: () => setErrors({}) };
}
```

### Rate Limiting (Client-Side)

```typescript
// lib/security/rateLimiter.ts
interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class ClientRateLimiter {
  private requests: Map<string, number[]> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = config;
  }

  canMakeRequest(key: string): boolean {
    const now = Date.now();
    const windowStart = now - this.config.windowMs;

    // Get existing requests for this key
    const timestamps = this.requests.get(key) || [];

    // Filter to only requests within the window
    const recentRequests = timestamps.filter((t) => t > windowStart);

    if (recentRequests.length >= this.config.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(key, recentRequests);

    return true;
  }

  getRemainingRequests(key: string): number {
    const timestamps = this.requests.get(key) || [];
    const windowStart = Date.now() - this.config.windowMs;
    const recentRequests = timestamps.filter((t) => t > windowStart);
    return Math.max(0, this.config.maxRequests - recentRequests.length);
  }

  getResetTime(key: string): number {
    const timestamps = this.requests.get(key) || [];
    if (timestamps.length === 0) return 0;
    return timestamps[0] + this.config.windowMs - Date.now();
  }
}

// Rate limiters for different actions
export const searchRateLimiter = new ClientRateLimiter({
  maxRequests: 30,
  windowMs: 60 * 1000, // 30 requests per minute
});

export const favoriteRateLimiter = new ClientRateLimiter({
  maxRequests: 10,
  windowMs: 60 * 1000, // 10 favorites per minute
});

// Hook with rate limiting
// hooks/useRateLimitedAction.ts
function useRateLimitedAction<T>(
  action: () => Promise<T>,
  rateLimiter: ClientRateLimiter,
  key: string
) {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [resetTime, setResetTime] = useState(0);

  const execute = async (): Promise<T | null> => {
    if (!rateLimiter.canMakeRequest(key)) {
      setIsRateLimited(true);
      setResetTime(rateLimiter.getResetTime(key));

      // Auto-reset after cooldown
      setTimeout(() => {
        setIsRateLimited(false);
        setResetTime(0);
      }, rateLimiter.getResetTime(key));

      return null;
    }

    return action();
  };

  return { execute, isRateLimited, resetTime };
}
```

### Secure Storage

```typescript
// lib/security/secureStorage.ts

// Never store sensitive data in localStorage
// Use these utilities for non-sensitive data only

const STORAGE_PREFIX = 'ubereats_';
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_STORAGE_KEY; // For additional obfuscation

interface StorageItem<T> {
  data: T;
  expiry: number | null;
  version: number;
}

export const secureStorage = {
  // Store non-sensitive data with expiry
  set<T>(key: string, data: T, expiryMinutes?: number): void {
    const item: StorageItem<T> = {
      data,
      expiry: expiryMinutes ? Date.now() + expiryMinutes * 60 * 1000 : null,
      version: 1,
    };

    try {
      const serialized = JSON.stringify(item);
      localStorage.setItem(`${STORAGE_PREFIX}${key}`, serialized);
    } catch (error) {
      console.warn('Storage quota exceeded or unavailable');
    }
  },

  get<T>(key: string): T | null {
    try {
      const serialized = localStorage.getItem(`${STORAGE_PREFIX}${key}`);
      if (!serialized) return null;

      const item: StorageItem<T> = JSON.parse(serialized);

      // Check expiry
      if (item.expiry && Date.now() > item.expiry) {
        this.remove(key);
        return null;
      }

      return item.data;
    } catch {
      return null;
    }
  },

  remove(key: string): void {
    localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },

  // Clear all app storage
  clear(): void {
    Object.keys(localStorage)
      .filter((key) => key.startsWith(STORAGE_PREFIX))
      .forEach((key) => localStorage.removeItem(key));
  },
};

// Session storage for temporary data (cleared on tab close)
export const sessionStorage = {
  set<T>(key: string, data: T): void {
    window.sessionStorage.setItem(
      `${STORAGE_PREFIX}${key}`,
      JSON.stringify(data)
    );
  },

  get<T>(key: string): T | null {
    const item = window.sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return item ? JSON.parse(item) : null;
  },

  remove(key: string): void {
    window.sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  },
};

// What NOT to store (reference)
/*
 * NEVER store in localStorage/sessionStorage:
 * - Access tokens (use memory + HttpOnly cookies)
 * - Refresh tokens (HttpOnly cookies only)
 * - User passwords or PINs
 * - Credit card numbers
 * - Personal identification numbers
 * - API keys or secrets
 */
```

### Security Monitoring

```typescript
// lib/security/securityMonitor.ts
interface SecurityEvent {
  type: 'xss_attempt' | 'csrf_failure' | 'auth_failure' | 'rate_limit' | 'suspicious_activity';
  details: Record<string, unknown>;
  timestamp: number;
  userAgent: string;
  url: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 100;

  logEvent(type: SecurityEvent['type'], details: Record<string, unknown>): void {
    const event: SecurityEvent = {
      type,
      details,
      timestamp: Date.now(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.events.push(event);

    // Keep only recent events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Send to monitoring service
    this.reportToServer(event);
  }

  private async reportToServer(event: SecurityEvent): Promise<void> {
    try {
      await fetch('/api/security/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true, // Ensure request completes even if page unloads
      });
    } catch {
      // Silently fail - don't expose security monitoring
    }
  }

  // Detect potential XSS attempts in URL
  checkUrlForXss(): void {
    const url = window.location.href;
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /data:text\/html/i,
    ];

    for (const pattern of suspiciousPatterns) {
      if (pattern.test(url)) {
        this.logEvent('xss_attempt', { url, pattern: pattern.toString() });
        // Redirect to safe page
        window.location.href = '/';
        break;
      }
    }
  }
}

export const securityMonitor = new SecurityMonitor();

// Initialize on app load
if (typeof window !== 'undefined') {
  securityMonitor.checkUrlForXss();
}
```

### Security Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND SECURITY CHECKLIST                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Transport & Headers:                                                        │
│  ☐ HTTPS enforced (HSTS enabled)                                            │
│  ☐ Content-Security-Policy header configured                                │
│  ☐ X-Frame-Options: DENY                                                    │
│  ☐ X-Content-Type-Options: nosniff                                         │
│  ☐ Referrer-Policy configured                                               │
│                                                                              │
│  Authentication:                                                             │
│  ☐ Access tokens stored in memory only                                      │
│  ☐ Refresh tokens in HttpOnly cookies                                       │
│  ☐ Short token expiry (15 min access, 7 day refresh)                       │
│  ☐ Token refresh before expiry                                              │
│  ☐ Logout clears all tokens                                                 │
│                                                                              │
│  Input Handling:                                                             │
│  ☐ All user input validated (Zod schemas)                                   │
│  ☐ HTML sanitized with DOMPurify                                           │
│  ☐ URL parameters sanitized                                                 │
│  ☐ Search queries length-limited and filtered                              │
│                                                                              │
│  CSRF Protection:                                                            │
│  ☐ CSRF tokens for all POST/PUT/DELETE                                     │
│  ☐ SameSite=Strict on cookies                                               │
│  ☐ Origin header validation                                                 │
│                                                                              │
│  Client-Side:                                                                │
│  ☐ No secrets in client-side code                                          │
│  ☐ No sensitive data in localStorage                                        │
│  ☐ Rate limiting on sensitive actions                                       │
│  ☐ Security event monitoring                                                │
│                                                                              │
│  Dependencies:                                                               │
│  ☐ npm audit on every build                                                 │
│  ☐ Dependabot/Renovate enabled                                              │
│  ☐ Subresource Integrity (SRI) for CDN scripts                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 14. Mobile & Touch Interactions

### Touch Gesture Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE TOUCH INTERACTIONS                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      GESTURE TYPES                                   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │                                                                      │   │
│  │  TAP           DOUBLE TAP      LONG PRESS      SWIPE                │   │
│  │  ┌───┐         ┌───┐ ┌───┐    ┌───────────┐   ┌───┐ ──►            │   │
│  │  │ • │         │ • │ │ • │    │ •••••••   │   │ • │                 │   │
│  │  └───┘         └───┘ └───┘    └───────────┘   └───┘                 │   │
│  │  Select        Favorite       Context menu    Filter swipe          │   │
│  │  restaurant    toggle         Share options   Pull to refresh       │   │
│  │                                                                      │   │
│  │  PINCH         PAN            DRAG            PULL                  │   │
│  │  ╲   ╱         ┌───┐          ┌───┐           ↓↓↓                   │   │
│  │   ╲ ╱          │ • │ ──►      │ ≡ │ ↕         ┌───┐                 │   │
│  │   ╱ ╲          └───┘          └───┘           │ ↻ │                 │   │
│  │  ╱   ╲         Scroll         Reorder         └───┘                 │   │
│  │  N/A for       through        favorites       Refresh               │   │
│  │  listing       list                           restaurants           │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

```typescript
// lib/responsive/breakpoints.ts
export const breakpoints = {
  xs: 0,      // Extra small phones
  sm: 640,    // Small phones
  md: 768,    // Tablets
  lg: 1024,   // Laptops
  xl: 1280,   // Desktops
  '2xl': 1536 // Large desktops
} as const;

// Media query helpers
export const mediaQueries = {
  mobile: `(max-width: ${breakpoints.md - 1}px)`,
  tablet: `(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`,
  desktop: `(min-width: ${breakpoints.lg}px)`,
  touch: '(hover: none) and (pointer: coarse)',
  mouse: '(hover: hover) and (pointer: fine)',
};

// Hook for responsive values
// hooks/useResponsive.ts
function useResponsive() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    const checkTouch = () => {
      setIsTouch(
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.matchMedia('(pointer: coarse)').matches
      );
    };

    handleResize();
    checkTouch();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width: windowSize.width,
    height: windowSize.height,
    isMobile: windowSize.width < breakpoints.md,
    isTablet: windowSize.width >= breakpoints.md && windowSize.width < breakpoints.lg,
    isDesktop: windowSize.width >= breakpoints.lg,
    isTouch,
    breakpoint: Object.entries(breakpoints)
      .reverse()
      .find(([_, value]) => windowSize.width >= value)?.[0] || 'xs',
  };
}
```

### Touch-Friendly Restaurant Card

```typescript
// components/RestaurantCard/MobileRestaurantCard.tsx
interface MobileRestaurantCardProps {
  restaurant: Restaurant;
  onFavorite: (id: string) => void;
  onShare: (restaurant: Restaurant) => void;
  isFavorite: boolean;
}

const MobileRestaurantCard: React.FC<MobileRestaurantCardProps> = ({
  restaurant,
  onFavorite,
  onShare,
  isFavorite,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showActions, setShowActions] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);

  // Touch gesture handling
  const { handlers, state } = useSwipe({
    onSwipeLeft: () => {
      setShowActions(true);
      setSwipeOffset(-80); // Reveal action buttons
    },
    onSwipeRight: () => {
      setShowActions(false);
      setSwipeOffset(0);
    },
    threshold: 50,
  });

  // Long press for context menu
  const longPressHandlers = useLongPress(() => {
    navigator.vibrate?.(50); // Haptic feedback
    setShowActions(true);
  }, { threshold: 500 });

  // Double tap for favorite
  const doubleTapHandler = useDoubleTap(() => {
    onFavorite(restaurant.id);
    navigator.vibrate?.([50, 30, 50]); // Haptic pattern
  });

  return (
    <div
      ref={cardRef}
      className="mobile-restaurant-card"
      style={{ transform: `translateX(${swipeOffset}px)` }}
      {...handlers}
      {...longPressHandlers}
      {...doubleTapHandler}
    >
      {/* Card content */}
      <Link href={`/restaurant/${restaurant.id}`} className="card-content">
        <div className="card-image">
          <Image
            src={restaurant.image}
            alt={restaurant.name}
            fill
            sizes="100vw"
            loading="lazy"
          />
          {restaurant.isPromoted && (
            <span className="promoted-badge">Promoted</span>
          )}
        </div>

        <div className="card-info">
          <h3 className="card-title">{restaurant.name}</h3>
          <div className="card-meta">
            <span className="rating">★ {restaurant.rating}</span>
            <span className="eta">{restaurant.eta} min</span>
            <span className="delivery-fee">
              {restaurant.deliveryFee === 0 ? 'Free delivery' : `$${restaurant.deliveryFee} delivery`}
            </span>
          </div>
          <p className="cuisines">{restaurant.cuisines.join(' • ')}</p>
        </div>
      </Link>

      {/* Swipe-revealed actions */}
      <div
        className={`card-actions ${showActions ? 'visible' : ''}`}
        style={{ right: showActions ? 0 : -80 }}
      >
        <button
          onClick={() => onFavorite(restaurant.id)}
          className="action-btn favorite"
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          {isFavorite ? <HeartFilledIcon /> : <HeartIcon />}
        </button>
        <button
          onClick={() => onShare(restaurant)}
          className="action-btn share"
          aria-label="Share restaurant"
        >
          <ShareIcon />
        </button>
      </div>
    </div>
  );
};

// styles/mobile-restaurant-card.css
.mobile-restaurant-card {
  position: relative;
  transition: transform 0.2s ease-out;
  touch-action: pan-y; /* Allow vertical scroll, handle horizontal */
  user-select: none;
  -webkit-user-select: none;
}

.card-content {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: white;
  min-height: 100px; /* Touch target */
}

.card-image {
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  flex-shrink: 0;
}

.card-actions {
  position: absolute;
  right: -80px;
  top: 0;
  bottom: 0;
  width: 80px;
  display: flex;
  flex-direction: column;
  transition: right 0.2s ease-out;
}

.action-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;  /* WCAG touch target */
  min-height: 44px;
}

.action-btn.favorite {
  background: #ff4757;
  color: white;
}

.action-btn.share {
  background: #2ed573;
  color: white;
}
```

### Pull-to-Refresh Implementation

```typescript
// hooks/usePullToRefresh.ts
interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>;
  threshold?: number;
  maxPull?: number;
}

function usePullToRefresh({
  onRefresh,
  threshold = 80,
  maxPull = 120,
}: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [canRefresh, setCanRefresh] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Only trigger if at top of scroll
    if (containerRef.current?.scrollTop === 0) {
      startY.current = e.touches[0].clientY;
    }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (startY.current === 0 || isRefreshing) return;

    const currentY = e.touches[0].clientY;
    const diff = currentY - startY.current;

    if (diff > 0 && containerRef.current?.scrollTop === 0) {
      e.preventDefault(); // Prevent scroll bounce
      const dampedPull = Math.min(diff * 0.5, maxPull); // Dampen pull
      setPullDistance(dampedPull);
      setCanRefresh(dampedPull >= threshold);
    }
  }, [isRefreshing, threshold, maxPull]);

  const handleTouchEnd = useCallback(async () => {
    if (canRefresh && !isRefreshing) {
      setIsRefreshing(true);
      navigator.vibrate?.(30); // Haptic feedback

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
        setCanRefresh(false);
      }
    } else {
      setPullDistance(0);
      setCanRefresh(false);
    }
    startY.current = 0;
  }, [canRefresh, isRefreshing, onRefresh]);

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

  const PullIndicator = () => (
    <div
      className="pull-indicator"
      style={{
        height: pullDistance,
        opacity: Math.min(pullDistance / threshold, 1),
      }}
    >
      {isRefreshing ? (
        <Spinner className="refresh-spinner" />
      ) : (
        <ArrowDownIcon
          className="pull-arrow"
          style={{
            transform: `rotate(${canRefresh ? 180 : 0}deg)`,
            transition: 'transform 0.2s',
          }}
        />
      )}
      <span className="pull-text">
        {isRefreshing
          ? 'Refreshing...'
          : canRefresh
          ? 'Release to refresh'
          : 'Pull to refresh'}
      </span>
    </div>
  );

  return { containerRef, PullIndicator, isRefreshing, pullDistance };
}

// Usage in RestaurantList
const RestaurantListPage: React.FC = () => {
  const { data, refetch } = useRestaurants();
  const { containerRef, PullIndicator, isRefreshing } = usePullToRefresh({
    onRefresh: refetch,
  });

  return (
    <div ref={containerRef} className="restaurant-list-container">
      <PullIndicator />
      {data?.restaurants.map((restaurant) => (
        <MobileRestaurantCard key={restaurant.id} restaurant={restaurant} />
      ))}
    </div>
  );
};
```

### Bottom Sheet Filter Component

```typescript
// components/BottomSheet/FilterBottomSheet.tsx
interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApply: (filters: FilterState) => void;
  filterOptions: FilterOptions;
}

const FilterBottomSheet: React.FC<FilterBottomSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onApply,
  filterOptions,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [localFilters, setLocalFilters] = useState(filters);
  const [sheetHeight, setSheetHeight] = useState(50); // percentage
  const dragStartY = useRef(0);

  // Draggable sheet logic
  const handleDragStart = (e: React.TouchEvent) => {
    dragStartY.current = e.touches[0].clientY;
  };

  const handleDrag = (e: React.TouchEvent) => {
    const deltaY = dragStartY.current - e.touches[0].clientY;
    const newHeight = Math.min(95, Math.max(30, sheetHeight + (deltaY / window.innerHeight) * 100));
    setSheetHeight(newHeight);
    dragStartY.current = e.touches[0].clientY;
  };

  const handleDragEnd = () => {
    // Snap to positions: 30% (peek), 50% (half), 95% (full)
    if (sheetHeight < 40) {
      onClose();
    } else if (sheetHeight < 70) {
      setSheetHeight(50);
    } else {
      setSheetHeight(95);
    }
  };

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="bottom-sheet-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="bottom-sheet"
        style={{ height: `${sheetHeight}%` }}
        role="dialog"
        aria-modal="true"
        aria-label="Filter restaurants"
      >
        {/* Drag handle */}
        <div
          className="sheet-handle"
          onTouchStart={handleDragStart}
          onTouchMove={handleDrag}
          onTouchEnd={handleDragEnd}
        >
          <div className="handle-bar" />
        </div>

        {/* Header */}
        <div className="sheet-header">
          <h2>Filters</h2>
          <button onClick={onClose} aria-label="Close filters">
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="sheet-content">
          {/* Cuisine chips */}
          <section className="filter-section">
            <h3>Cuisine</h3>
            <div className="chip-group" role="group" aria-label="Cuisine filters">
              {filterOptions.cuisines.map((cuisine) => (
                <button
                  key={cuisine.value}
                  className={`filter-chip ${
                    localFilters.cuisines.includes(cuisine.value) ? 'selected' : ''
                  }`}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      cuisines: prev.cuisines.includes(cuisine.value)
                        ? prev.cuisines.filter((c) => c !== cuisine.value)
                        : [...prev.cuisines, cuisine.value],
                    }));
                  }}
                  aria-pressed={localFilters.cuisines.includes(cuisine.value)}
                >
                  {cuisine.label}
                </button>
              ))}
            </div>
          </section>

          {/* Rating slider */}
          <section className="filter-section">
            <h3>Minimum Rating</h3>
            <div className="rating-options">
              {[3.0, 3.5, 4.0, 4.5].map((rating) => (
                <button
                  key={rating}
                  className={`rating-btn ${localFilters.minRating === rating ? 'selected' : ''}`}
                  onClick={() => setLocalFilters((prev) => ({ ...prev, minRating: rating }))}
                >
                  <StarIcon /> {rating}+
                </button>
              ))}
            </div>
          </section>

          {/* Price range */}
          <section className="filter-section">
            <h3>Price Range</h3>
            <div className="price-options">
              {[1, 2, 3, 4].map((price) => (
                <button
                  key={price}
                  className={`price-btn ${localFilters.priceRange.includes(price) ? 'selected' : ''}`}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      priceRange: prev.priceRange.includes(price)
                        ? prev.priceRange.filter((p) => p !== price)
                        : [...prev.priceRange, price],
                    }));
                  }}
                >
                  {'$'.repeat(price)}
                </button>
              ))}
            </div>
          </section>

          {/* Delivery time */}
          <section className="filter-section">
            <h3>Delivery Time</h3>
            <div className="eta-options">
              {[15, 30, 45, 60].map((eta) => (
                <button
                  key={eta}
                  className={`eta-btn ${localFilters.maxEta === eta ? 'selected' : ''}`}
                  onClick={() => setLocalFilters((prev) => ({ ...prev, maxEta: eta }))}
                >
                  Under {eta} min
                </button>
              ))}
            </div>
          </section>
        </div>

        {/* Footer with actions */}
        <div className="sheet-footer">
          <button
            className="btn-secondary"
            onClick={() => setLocalFilters({ cuisines: [], minRating: null, priceRange: [], maxEta: null })}
          >
            Clear all
          </button>
          <button
            className="btn-primary"
            onClick={() => {
              onApply(localFilters);
              onClose();
            }}
          >
            Show results
          </button>
        </div>
      </div>
    </>
  );
};

// styles/bottom-sheet.css
.bottom-sheet-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}

.bottom-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 16px 16px 0 0;
  z-index: 101;
  display: flex;
  flex-direction: column;
  transition: height 0.3s ease-out;
  max-height: 95vh;
}

.sheet-handle {
  padding: 12px;
  display: flex;
  justify-content: center;
  cursor: grab;
  touch-action: none;
}

.handle-bar {
  width: 40px;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
}

.sheet-content {
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 0 16px;
}

.filter-chip {
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #ddd;
  background: white;
  min-height: 44px; /* Touch target */
  transition: all 0.2s;
}

.filter-chip.selected {
  background: #000;
  color: white;
  border-color: #000;
}

.sheet-footer {
  padding: 16px;
  display: flex;
  gap: 12px;
  border-top: 1px solid #eee;
  padding-bottom: env(safe-area-inset-bottom, 16px);
}
```

### Touch-Optimized Search

```typescript
// components/MobileSearch/MobileSearch.tsx
const MobileSearch: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { recentSearches, addSearch, clearSearches } = useRecentSearches();
  const { data: suggestions } = useSearchSuggestions(query);

  // Auto-focus when expanded
  useEffect(() => {
    if (isExpanded) {
      inputRef.current?.focus();
      // Scroll to top to avoid keyboard covering input
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isExpanded]);

  // Handle keyboard visibility on mobile
  useEffect(() => {
    const handleResize = () => {
      // Detect virtual keyboard
      if (window.visualViewport) {
        const isKeyboardVisible = window.visualViewport.height < window.innerHeight * 0.75;
        if (isKeyboardVisible && isExpanded) {
          // Adjust UI for keyboard
          document.body.classList.add('keyboard-visible');
        } else {
          document.body.classList.remove('keyboard-visible');
        }
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, [isExpanded]);

  if (!isExpanded) {
    return (
      <button
        className="search-trigger"
        onClick={() => setIsExpanded(true)}
        aria-label="Open search"
      >
        <SearchIcon />
        <span>Search restaurants</span>
      </button>
    );
  }

  return (
    <div className="mobile-search-overlay">
      {/* Search header */}
      <div className="search-header">
        <button onClick={() => setIsExpanded(false)} aria-label="Close search">
          <ArrowLeftIcon />
        </button>
        <div className="search-input-container">
          <SearchIcon className="search-icon" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search restaurants, cuisines..."
            autoComplete="off"
            autoCorrect="off"
            spellCheck="false"
            enterKeyHint="search"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <CloseIcon />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="search-results">
        {!query && recentSearches.length > 0 && (
          <section className="recent-searches">
            <div className="section-header">
              <h3>Recent searches</h3>
              <button onClick={clearSearches}>Clear all</button>
            </div>
            {recentSearches.map((search) => (
              <button
                key={search}
                className="search-item"
                onClick={() => setQuery(search)}
              >
                <ClockIcon />
                <span>{search}</span>
              </button>
            ))}
          </section>
        )}

        {query && suggestions && (
          <ul className="suggestions-list" role="listbox">
            {suggestions.map((suggestion) => (
              <li
                key={suggestion.id}
                role="option"
                className="suggestion-item"
                onClick={() => {
                  addSearch(suggestion.name);
                  // Navigate to result
                }}
              >
                {suggestion.type === 'restaurant' ? (
                  <>
                    <Image src={suggestion.image} alt="" width={40} height={40} />
                    <div className="suggestion-info">
                      <span className="name">{suggestion.name}</span>
                      <span className="meta">{suggestion.cuisines.join(', ')}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <SearchIcon />
                    <span>{suggestion.name}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
```

### Mobile-First CSS Patterns

```css
/* styles/mobile.css */

/* Safe area insets for notched devices */
:root {
  --safe-area-top: env(safe-area-inset-top, 0px);
  --safe-area-bottom: env(safe-area-inset-bottom, 0px);
  --safe-area-left: env(safe-area-inset-left, 0px);
  --safe-area-right: env(safe-area-inset-right, 0px);
}

/* Touch-friendly sizing */
.touch-target {
  min-width: 44px;
  min-height: 44px;
  padding: 12px;
}

/* Prevent text selection during gestures */
.no-select {
  user-select: none;
  -webkit-user-select: none;
  -webkit-touch-callout: none;
}

/* Smooth scrolling with momentum */
.scroll-container {
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: contain;
  scroll-behavior: smooth;
}

/* Hide scrollbar on mobile */
.hide-scrollbar {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Tap highlight removal */
.no-tap-highlight {
  -webkit-tap-highlight-color: transparent;
}

/* Active state for touch */
.touch-active:active {
  transform: scale(0.98);
  opacity: 0.9;
}

/* Fixed bottom nav with safe area */
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding-bottom: var(--safe-area-bottom);
  background: white;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
}

/* Sticky header with safe area */
.sticky-header {
  position: sticky;
  top: 0;
  padding-top: var(--safe-area-top);
  z-index: 50;
  background: white;
}

/* Horizontal scroll container */
.horizontal-scroll {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  padding: 0 16px;
  margin: 0 -16px;
}

.horizontal-scroll > * {
  scroll-snap-align: start;
  flex-shrink: 0;
}

/* Grid that adapts to screen */
.restaurant-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .restaurant-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .restaurant-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .restaurant-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Responsive typography */
html {
  font-size: 14px;
}

@media (min-width: 640px) {
  html {
    font-size: 15px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 16px;
  }
}
```

### Mobile Performance Optimizations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE PERFORMANCE CHECKLIST                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Bundle Size:                                                                │
│  ☐ Serve smaller images for mobile (srcset)                                │
│  ☐ Code split by route and viewport                                        │
│  ☐ Lazy load below-fold components                                         │
│  ☐ Use lighter animation libraries                                          │
│                                                                              │
│  Touch Performance:                                                          │
│  ☐ Use passive event listeners for scroll/touch                            │
│  ☐ Debounce touch move handlers                                            │
│  ☐ Use CSS transforms for animations (GPU)                                 │
│  ☐ Avoid layout thrashing during gestures                                  │
│                                                                              │
│  Network:                                                                    │
│  ☐ Detect slow connections (navigator.connection)                          │
│  ☐ Reduce image quality on slow networks                                   │
│  ☐ Prefetch on WiFi only                                                   │
│  ☐ Implement offline fallbacks                                             │
│                                                                              │
│  Battery:                                                                    │
│  ☐ Reduce polling frequency on low battery                                 │
│  ☐ Pause non-essential animations                                          │
│  ☐ Defer analytics on low battery                                          │
│                                                                              │
│  Memory:                                                                     │
│  ☐ Virtualize long lists                                                   │
│  ☐ Unload off-screen images                                                │
│  ☐ Limit cached data size                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Testing Strategy

### Testing Pyramid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TESTING PYRAMID                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                              ┌───────┐                                       │
│                             /   E2E   \                                      │
│                            /  (5-10%)  \                                     │
│                           ├─────────────┤                                    │
│                          /  Integration  \                                   │
│                         /    (15-20%)     \                                  │
│                        ├───────────────────┤                                 │
│                       /       Unit Tests    \                                │
│                      /        (70-80%)       \                               │
│                     └─────────────────────────┘                              │
│                                                                              │
│  Test Distribution for Uber Eats:                                           │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Unit Tests (70%)                                                     │  │
│  │  • Component rendering tests                                          │  │
│  │  • Hook tests (useRestaurants, useFilters, useLocation)             │  │
│  │  • Utility function tests (formatters, validators)                   │  │
│  │  • State management tests                                            │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │  Integration Tests (20%)                                              │  │
│  │  • API integration with mocked backend                               │  │
│  │  • Component + Hook interaction                                       │  │
│  │  • Filter + Sort + List integration                                  │  │
│  │  • Search + Autocomplete flow                                        │  │
│  ├──────────────────────────────────────────────────────────────────────┤  │
│  │  E2E Tests (10%)                                                      │  │
│  │  • Full user flows (search → filter → select → order)               │  │
│  │  • Cross-browser testing                                              │  │
│  │  • Mobile responsive testing                                          │  │
│  │  • Performance benchmarks                                             │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Unit Testing Components

```typescript
// __tests__/components/RestaurantCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RestaurantCard } from '@/components/RestaurantCard';
import { mockRestaurant } from '@/test/mocks/restaurant';

describe('RestaurantCard', () => {
  const defaultProps = {
    restaurant: mockRestaurant,
    onFavorite: jest.fn(),
    isFavorite: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders restaurant information correctly', () => {
    render(<RestaurantCard {...defaultProps} />);

    expect(screen.getByText(mockRestaurant.name)).toBeInTheDocument();
    expect(screen.getByText(`${mockRestaurant.rating}`)).toBeInTheDocument();
    expect(screen.getByText(/25-35 min/)).toBeInTheDocument();
    expect(screen.getByText(mockRestaurant.cuisines.join(' • '))).toBeInTheDocument();
  });

  it('shows promoted badge when restaurant is promoted', () => {
    render(
      <RestaurantCard
        {...defaultProps}
        restaurant={{ ...mockRestaurant, isPromoted: true }}
      />
    );

    expect(screen.getByText('Promoted')).toBeInTheDocument();
  });

  it('calls onFavorite when favorite button is clicked', async () => {
    const user = userEvent.setup();
    render(<RestaurantCard {...defaultProps} />);

    const favoriteButton = screen.getByRole('button', { name: /add.*to favorites/i });
    await user.click(favoriteButton);

    expect(defaultProps.onFavorite).toHaveBeenCalledWith(mockRestaurant.id);
  });

  it('shows filled heart when isFavorite is true', () => {
    render(<RestaurantCard {...defaultProps} isFavorite={true} />);

    expect(screen.getByRole('button', { name: /remove.*from favorites/i }))
      .toBeInTheDocument();
  });

  it('navigates to restaurant detail on click', () => {
    render(<RestaurantCard {...defaultProps} />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', `/restaurant/${mockRestaurant.id}`);
  });

  it('displays price range correctly', () => {
    render(
      <RestaurantCard
        {...defaultProps}
        restaurant={{ ...mockRestaurant, priceRange: 3 }}
      />
    );

    expect(screen.getByText('$$$')).toBeInTheDocument();
  });

  it('shows closed badge when restaurant is closed', () => {
    render(
      <RestaurantCard
        {...defaultProps}
        restaurant={{ ...mockRestaurant, isOpen: false }}
      />
    );

    expect(screen.getByText('Currently closed')).toBeInTheDocument();
  });
});

// __tests__/components/FilterBar.test.tsx
describe('FilterBar', () => {
  const filterOptions = {
    cuisines: [
      { value: 'italian', label: 'Italian', count: 45 },
      { value: 'chinese', label: 'Chinese', count: 32 },
      { value: 'mexican', label: 'Mexican', count: 28 },
    ],
  };

  const defaultProps = {
    filters: { cuisines: [], minRating: null, priceRange: [], maxEta: null },
    onFilterChange: jest.fn(),
    filterOptions,
  };

  it('opens cuisine dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    const cuisineButton = screen.getByRole('button', { name: /cuisine/i });
    await user.click(cuisineButton);

    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('Italian')).toBeInTheDocument();
  });

  it('selects cuisine filter and calls onFilterChange', async () => {
    const user = userEvent.setup();
    render(<FilterBar {...defaultProps} />);

    await user.click(screen.getByRole('button', { name: /cuisine/i }));
    await user.click(screen.getByText('Italian'));

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      ...defaultProps.filters,
      cuisines: ['italian'],
    });
  });

  it('shows filter count badge when filters are active', () => {
    render(
      <FilterBar
        {...defaultProps}
        filters={{ ...defaultProps.filters, cuisines: ['italian', 'chinese'] }}
      />
    );

    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('clears all filters when clear button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <FilterBar
        {...defaultProps}
        filters={{ cuisines: ['italian'], minRating: 4, priceRange: [2], maxEta: 30 }}
      />
    );

    await user.click(screen.getByRole('button', { name: /clear all/i }));

    expect(defaultProps.onFilterChange).toHaveBeenCalledWith({
      cuisines: [],
      minRating: null,
      priceRange: [],
      maxEta: null,
    });
  });
});
```

### Testing Custom Hooks

```typescript
// __tests__/hooks/useRestaurants.test.ts
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useRestaurants } from '@/hooks/useRestaurants';
import { server } from '@/test/mocks/server';
import { rest } from 'msw';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('useRestaurants', () => {
  it('fetches restaurants based on location', async () => {
    const { result } = renderHook(
      () => useRestaurants({ lat: 37.7749, lng: -122.4194 }),
      { wrapper: createWrapper() }
    );

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.restaurants).toHaveLength(20);
    expect(result.current.data?.restaurants[0]).toHaveProperty('id');
    expect(result.current.data?.restaurants[0]).toHaveProperty('name');
  });

  it('applies filters to the request', async () => {
    const { result } = renderHook(
      () => useRestaurants({
        lat: 37.7749,
        lng: -122.4194,
        filters: { cuisines: ['italian'], minRating: 4 },
      }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Verify filtered results
    result.current.data?.restaurants.forEach((restaurant) => {
      expect(restaurant.cuisines).toContain('italian');
      expect(restaurant.rating).toBeGreaterThanOrEqual(4);
    });
  });

  it('handles pagination with cursor', async () => {
    const { result } = renderHook(
      () => useRestaurants({ lat: 37.7749, lng: -122.4194 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data?.pagination.hasMore).toBe(true);
    expect(result.current.data?.pagination.nextCursor).toBeDefined();
  });

  it('handles API errors gracefully', async () => {
    server.use(
      rest.get('/api/restaurants', (req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'Internal server error' }));
      })
    );

    const { result } = renderHook(
      () => useRestaurants({ lat: 37.7749, lng: -122.4194 }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.error).toBeDefined();
  });
});

// __tests__/hooks/useInfiniteScroll.test.ts
describe('useInfiniteScroll', () => {
  beforeEach(() => {
    // Mock IntersectionObserver
    const mockObserver = jest.fn();
    mockObserver.mockReturnValue({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    });
    window.IntersectionObserver = mockObserver;
  });

  it('calls loadMore when sentinel is visible', async () => {
    const onLoadMore = jest.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: false })
    );

    // Simulate intersection
    const [[callback]] = (window.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    await waitFor(() => {
      expect(onLoadMore).toHaveBeenCalled();
    });
  });

  it('does not call loadMore when hasMore is false', async () => {
    const onLoadMore = jest.fn();
    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: false, isLoading: false })
    );

    const [[callback]] = (window.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });

  it('does not call loadMore when already loading', async () => {
    const onLoadMore = jest.fn();
    renderHook(() =>
      useInfiniteScroll({ onLoadMore, hasMore: true, isLoading: true })
    );

    const [[callback]] = (window.IntersectionObserver as jest.Mock).mock.calls;
    callback([{ isIntersecting: true }]);

    expect(onLoadMore).not.toHaveBeenCalled();
  });
});

// __tests__/hooks/useGeolocation.test.ts
describe('useGeolocation', () => {
  const mockPosition = {
    coords: {
      latitude: 37.7749,
      longitude: -122.4194,
      accuracy: 100,
    },
  };

  beforeEach(() => {
    // Mock Geolocation API
    const mockGeolocation = {
      getCurrentPosition: jest.fn(),
      watchPosition: jest.fn(),
      clearWatch: jest.fn(),
    };
    Object.defineProperty(navigator, 'geolocation', {
      value: mockGeolocation,
      writable: true,
    });
  });

  it('returns location when geolocation succeeds', async () => {
    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (success) => success(mockPosition)
    );

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.location).toEqual({
        lat: 37.7749,
        lng: -122.4194,
      });
    });

    expect(result.current.error).toBeNull();
  });

  it('returns error when geolocation fails', async () => {
    const mockError = { code: 1, message: 'User denied geolocation' };
    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (_, error) => error(mockError)
    );

    const { result } = renderHook(() => useGeolocation());

    await waitFor(() => {
      expect(result.current.error).toBe('User denied geolocation');
    });

    expect(result.current.location).toBeNull();
  });

  it('uses fallback location when provided', async () => {
    const mockError = { code: 1, message: 'User denied geolocation' };
    (navigator.geolocation.getCurrentPosition as jest.Mock).mockImplementation(
      (_, error) => error(mockError)
    );

    const fallback = { lat: 40.7128, lng: -74.006 };
    const { result } = renderHook(() => useGeolocation({ fallback }));

    await waitFor(() => {
      expect(result.current.location).toEqual(fallback);
    });
  });
});
```

### Mock Service Worker (MSW) Setup

```typescript
// test/mocks/handlers.ts
import { rest } from 'msw';
import { mockRestaurants, generateRestaurants } from './restaurant';

export const handlers = [
  // Get restaurants
  rest.get('/api/restaurants', (req, res, ctx) => {
    const lat = req.url.searchParams.get('lat');
    const lng = req.url.searchParams.get('lng');
    const cursor = req.url.searchParams.get('cursor');
    const cuisines = req.url.searchParams.getAll('cuisine[]');
    const minRating = req.url.searchParams.get('rating');

    let restaurants = [...mockRestaurants];

    // Apply filters
    if (cuisines.length > 0) {
      restaurants = restaurants.filter((r) =>
        r.cuisines.some((c) => cuisines.includes(c))
      );
    }

    if (minRating) {
      restaurants = restaurants.filter((r) => r.rating >= parseFloat(minRating));
    }

    // Pagination
    const pageSize = 20;
    const startIndex = cursor ? parseInt(Buffer.from(cursor, 'base64').toString()) : 0;
    const paginatedRestaurants = restaurants.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < restaurants.length;

    return res(
      ctx.status(200),
      ctx.json({
        restaurants: paginatedRestaurants,
        pagination: {
          hasMore,
          nextCursor: hasMore
            ? Buffer.from(String(startIndex + pageSize)).toString('base64')
            : null,
          totalCount: restaurants.length,
        },
      })
    );
  }),

  // Search restaurants
  rest.get('/api/restaurants/search', (req, res, ctx) => {
    const query = req.url.searchParams.get('q')?.toLowerCase();

    if (!query) {
      return res(ctx.status(400), ctx.json({ error: 'Query required' }));
    }

    const results = mockRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        r.cuisines.some((c) => c.toLowerCase().includes(query))
    );

    return res(ctx.status(200), ctx.json({ results }));
  }),

  // Get filter options
  rest.get('/api/filters/options', (req, res, ctx) => {
    const cuisineCounts = mockRestaurants.reduce((acc, r) => {
      r.cuisines.forEach((c) => {
        acc[c] = (acc[c] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return res(
      ctx.status(200),
      ctx.json({
        cuisines: Object.entries(cuisineCounts).map(([value, count]) => ({
          value,
          label: value.charAt(0).toUpperCase() + value.slice(1),
          count,
        })),
      })
    );
  }),
];

// test/mocks/server.ts
import { setupServer } from 'msw/node';
import { handlers } from './handlers';

export const server = setupServer(...handlers);

// test/setup.ts
import '@testing-library/jest-dom';
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

### Integration Tests

```typescript
// __tests__/integration/RestaurantListPage.test.tsx
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RestaurantListPage } from '@/pages/restaurants';
import { TestProviders } from '@/test/utils';

describe('RestaurantListPage Integration', () => {
  it('loads and displays restaurants', async () => {
    render(<RestaurantListPage />, { wrapper: TestProviders });

    // Should show loading state
    expect(screen.getByTestId('restaurant-skeleton')).toBeInTheDocument();

    // Should display restaurants after loading
    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card')).toHaveLength(20);
    });
  });

  it('filters restaurants by cuisine', async () => {
    const user = userEvent.setup();
    render(<RestaurantListPage />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card').length).toBeGreaterThan(0);
    });

    // Open cuisine filter
    await user.click(screen.getByRole('button', { name: /cuisine/i }));
    await user.click(screen.getByText('Italian'));

    // Verify URL updated
    expect(window.location.search).toContain('cuisine=italian');

    // Verify filtered results
    await waitFor(() => {
      const cards = screen.getAllByTestId('restaurant-card');
      cards.forEach((card) => {
        expect(within(card).getByText(/italian/i)).toBeInTheDocument();
      });
    });
  });

  it('searches for restaurants', async () => {
    const user = userEvent.setup();
    render(<RestaurantListPage />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card').length).toBeGreaterThan(0);
    });

    // Type in search
    const searchInput = screen.getByRole('searchbox');
    await user.type(searchInput, 'pizza');

    // Wait for debounced search
    await waitFor(
      () => {
        const cards = screen.getAllByTestId('restaurant-card');
        expect(cards.length).toBeGreaterThan(0);
        cards.forEach((card) => {
          expect(within(card).getByText(/pizza/i)).toBeInTheDocument();
        });
      },
      { timeout: 500 }
    );
  });

  it('loads more restaurants on scroll', async () => {
    render(<RestaurantListPage />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card')).toHaveLength(20);
    });

    // Simulate scroll to bottom (trigger intersection observer)
    const sentinel = screen.getByTestId('infinite-scroll-sentinel');
    fireEvent(sentinel, new Event('intersect'));

    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card')).toHaveLength(40);
    });
  });

  it('shows empty state when no results', async () => {
    const user = userEvent.setup();
    render(<RestaurantListPage />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card').length).toBeGreaterThan(0);
    });

    // Apply filters that return no results
    await user.click(screen.getByRole('button', { name: /cuisine/i }));
    await user.click(screen.getByText('NonExistent'));

    await waitFor(() => {
      expect(screen.getByText(/no restaurants found/i)).toBeInTheDocument();
    });
  });

  it('persists filters across page refresh', async () => {
    const user = userEvent.setup();
    const { unmount } = render(<RestaurantListPage />, { wrapper: TestProviders });

    await waitFor(() => {
      expect(screen.getAllByTestId('restaurant-card').length).toBeGreaterThan(0);
    });

    // Apply filter
    await user.click(screen.getByRole('button', { name: /cuisine/i }));
    await user.click(screen.getByText('Italian'));

    // Unmount and remount (simulate refresh)
    unmount();
    render(<RestaurantListPage />, { wrapper: TestProviders });

    // Verify filter is still applied
    await waitFor(() => {
      expect(screen.getByText('Italian')).toHaveClass('selected');
    });
  });
});
```

### E2E Tests with Playwright

```typescript
// e2e/restaurant-listing.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Restaurant Listing', () => {
  test.beforeEach(async ({ page }) => {
    // Mock geolocation
    await page.context().setGeolocation({ latitude: 37.7749, longitude: -122.4194 });
    await page.context().grantPermissions(['geolocation']);
    await page.goto('/restaurants');
  });

  test('displays restaurant list on page load', async ({ page }) => {
    await expect(page.getByTestId('restaurant-card').first()).toBeVisible();
    await expect(page.getByTestId('restaurant-card')).toHaveCount(20);
  });

  test('filters restaurants by cuisine', async ({ page }) => {
    // Open cuisine filter
    await page.getByRole('button', { name: /cuisine/i }).click();
    await page.getByText('Italian').click();

    // Verify URL
    await expect(page).toHaveURL(/cuisine=italian/);

    // Verify filter applied
    await expect(page.getByTestId('restaurant-card')).toHaveCount.lessThan(20);
  });

  test('searches for restaurants', async ({ page }) => {
    await page.getByRole('searchbox').fill('pizza');

    // Wait for search results
    await page.waitForResponse('**/api/restaurants/search*');

    const cards = page.getByTestId('restaurant-card');
    await expect(cards.first()).toContainText(/pizza/i);
  });

  test('infinite scroll loads more restaurants', async ({ page }) => {
    await expect(page.getByTestId('restaurant-card')).toHaveCount(20);

    // Scroll to bottom
    await page.getByTestId('infinite-scroll-sentinel').scrollIntoViewIfNeeded();

    // Wait for more to load
    await expect(page.getByTestId('restaurant-card')).toHaveCount(40);
  });

  test('navigates to restaurant detail page', async ({ page }) => {
    const firstCard = page.getByTestId('restaurant-card').first();
    const restaurantName = await firstCard.getByRole('heading').textContent();

    await firstCard.click();

    await expect(page).toHaveURL(/\/restaurant\/[\w-]+/);
    await expect(page.getByRole('heading', { name: restaurantName! })).toBeVisible();
  });

  test('favorites a restaurant', async ({ page }) => {
    const favoriteButton = page
      .getByTestId('restaurant-card')
      .first()
      .getByRole('button', { name: /add.*to favorites/i });

    await favoriteButton.click();

    await expect(favoriteButton).toHaveAttribute('aria-pressed', 'true');
  });

  test('works on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });

    // Verify mobile layout
    await expect(page.getByTestId('mobile-filter-button')).toBeVisible();
    await expect(page.getByTestId('desktop-filter-bar')).not.toBeVisible();

    // Open mobile filter sheet
    await page.getByTestId('mobile-filter-button').click();
    await expect(page.getByRole('dialog', { name: /filter/i })).toBeVisible();
  });
});

// e2e/performance.spec.ts
test.describe('Performance', () => {
  test('meets Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/restaurants');

    // Wait for page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Get performance metrics
    const metrics = await page.evaluate(() => {
      return new Promise((resolve) => {
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          resolve({
            lcp: entries.find((e) => e.entryType === 'largest-contentful-paint')?.startTime,
            fid: entries.find((e) => e.entryType === 'first-input')?.processingStart,
            cls: entries.reduce((acc, e) => acc + (e as any).value, 0),
          });
        }).observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      });
    });

    expect(metrics.lcp).toBeLessThan(2500);
    expect(metrics.cls).toBeLessThan(0.1);
  });

  test('loads within performance budget', async ({ page }) => {
    const [response] = await Promise.all([
      page.waitForResponse((r) => r.url().includes('/restaurants')),
      page.goto('/restaurants'),
    ]);

    // Check response time
    expect(response.timing().responseEnd - response.timing().requestStart).toBeLessThan(500);

    // Check bundle size
    const jsSize = await page.evaluate(() => {
      return performance
        .getEntriesByType('resource')
        .filter((r) => r.name.endsWith('.js'))
        .reduce((acc, r) => acc + r.transferSize, 0);
    });

    expect(jsSize).toBeLessThan(300 * 1024); // 300KB max JS
  });
});
```

### Visual Regression Testing

```typescript
// e2e/visual.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Visual Regression', () => {
  test('restaurant list matches snapshot', async ({ page }) => {
    await page.goto('/restaurants');
    await page.waitForLoadState('networkidle');

    // Wait for images to load
    await page.waitForFunction(() => {
      const images = document.querySelectorAll('img');
      return Array.from(images).every((img) => img.complete);
    });

    await expect(page).toHaveScreenshot('restaurant-list.png', {
      maxDiffPixels: 100,
    });
  });

  test('filter dropdown matches snapshot', async ({ page }) => {
    await page.goto('/restaurants');
    await page.getByRole('button', { name: /cuisine/i }).click();

    await expect(page.getByRole('listbox')).toHaveScreenshot('cuisine-dropdown.png');
  });

  test('mobile layout matches snapshot', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/restaurants');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('restaurant-list-mobile.png', {
      maxDiffPixels: 100,
    });
  });

  test('dark mode matches snapshot', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto('/restaurants');
    await page.waitForLoadState('networkidle');

    await expect(page).toHaveScreenshot('restaurant-list-dark.png', {
      maxDiffPixels: 100,
    });
  });
});
```

### Testing Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TESTING CHECKLIST                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Unit Tests:                                                                 │
│  ☐ All components have render tests                                        │
│  ☐ All custom hooks have tests                                             │
│  ☐ Utility functions have edge case tests                                  │
│  ☐ Error boundaries tested                                                 │
│  ☐ Loading states tested                                                   │
│                                                                              │
│  Integration Tests:                                                          │
│  ☐ API mocking with MSW                                                    │
│  ☐ Full filter flow tested                                                 │
│  ☐ Search + results tested                                                 │
│  ☐ Pagination/infinite scroll tested                                       │
│  ☐ URL state sync tested                                                   │
│                                                                              │
│  E2E Tests:                                                                  │
│  ☐ Happy path user flows                                                   │
│  ☐ Mobile responsive tests                                                 │
│  ☐ Cross-browser (Chrome, Firefox, Safari)                                │
│  ☐ Performance benchmarks                                                  │
│  ☐ Accessibility audits                                                    │
│                                                                              │
│  Coverage Targets:                                                           │
│  ☐ Statements: > 80%                                                       │
│  ☐ Branches: > 75%                                                         │
│  ☐ Functions: > 80%                                                        │
│  ☐ Lines: > 80%                                                            │
│                                                                              │
│  CI/CD Integration:                                                          │
│  ☐ Tests run on every PR                                                   │
│  ☐ Coverage reported to PR                                                 │
│  ☐ E2E tests run on staging deploy                                        │
│  ☐ Visual regression on main branch                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 16. Offline/PWA Capabilities

### PWA Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PWA ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         SERVICE WORKER                               │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │   │
│  │  │   Cache     │  │  Background │  │    Push     │                 │   │
│  │  │   Storage   │  │    Sync     │  │ Notifications│                │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│         ┌────────────────────┼────────────────────┐                        │
│         │                    │                    │                        │
│         ▼                    ▼                    ▼                        │
│  ┌─────────────┐      ┌─────────────┐      ┌─────────────┐               │
│  │  Static     │      │  API        │      │  Image      │               │
│  │  Assets     │      │  Responses  │      │  Cache      │               │
│  │  (Cache     │      │  (Network   │      │  (Cache     │               │
│  │  First)     │      │  First)     │      │  First)     │               │
│  └─────────────┘      └─────────────┘      └─────────────┘               │
│                                                                              │
│  Caching Strategies:                                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Asset Type      │  Strategy              │  TTL                     │  │
│  ├──────────────────┼────────────────────────┼──────────────────────────┤  │
│  │  HTML (shell)    │  Cache First           │  1 day                   │  │
│  │  JS/CSS          │  Cache First           │  1 year (versioned)     │  │
│  │  Images          │  Cache First           │  30 days                 │  │
│  │  Restaurant API  │  Network First         │  5 minutes               │  │
│  │  Search API      │  Network First         │  1 minute                │  │
│  │  Static data     │  Stale While Revalidate│  1 hour                  │  │
│  └──────────────────┴────────────────────────┴──────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Service Worker Implementation

```typescript
// public/sw.ts
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope;

// Clean old caches
cleanupOutdatedCaches();

// Precache static assets (injected by build)
precacheAndRoute(self.__WB_MANIFEST);

// App shell strategy
const shellStrategy = new CacheFirst({
  cacheName: 'app-shell',
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    new ExpirationPlugin({ maxAgeSeconds: 86400 }), // 1 day
  ],
});

// Navigation requests → App shell
registerRoute(new NavigationRoute(shellStrategy, {
  allowlist: [/^\/restaurants/, /^\/restaurant\//],
}));

// Static assets (JS, CSS)
registerRoute(
  ({ request }) =>
    request.destination === 'script' || request.destination === 'style',
  new CacheFirst({
    cacheName: 'static-assets',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 31536000, // 1 year
        maxEntries: 100,
      }),
    ],
  })
);

// Images
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 2592000, // 30 days
        maxEntries: 200,
      }),
    ],
  })
);

// Restaurant API
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/restaurants'),
  new NetworkFirst({
    cacheName: 'restaurant-api',
    networkTimeoutSeconds: 5,
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({
        maxAgeSeconds: 300, // 5 minutes
        maxEntries: 50,
      }),
    ],
  })
);

// Filter options (rarely change)
registerRoute(
  ({ url }) => url.pathname === '/api/filters/options',
  new StaleWhileRevalidate({
    cacheName: 'filter-options',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxAgeSeconds: 3600 }), // 1 hour
    ],
  })
);

// Handle offline fallback
self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match('/offline.html') || new Response('Offline');
      })
    );
  }
});

// Background sync for favorites
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
});

async function syncFavorites() {
  const db = await openDB();
  const pendingFavorites = await db.getAll('pending-favorites');

  for (const favorite of pendingFavorites) {
    try {
      await fetch('/api/favorites', {
        method: favorite.action === 'add' ? 'POST' : 'DELETE',
        body: JSON.stringify({ restaurantId: favorite.restaurantId }),
      });
      await db.delete('pending-favorites', favorite.id);
    } catch {
      // Will retry on next sync
    }
  }
}
```

### IndexedDB for Offline Data

```typescript
// lib/offline/db.ts
import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface UberEatsDB extends DBSchema {
  restaurants: {
    key: string;
    value: Restaurant;
    indexes: { 'by-location': [number, number] };
  };
  favorites: {
    key: string;
    value: { restaurantId: string; addedAt: number };
  };
  'pending-actions': {
    key: number;
    value: {
      id?: number;
      action: 'add-favorite' | 'remove-favorite';
      restaurantId: string;
      timestamp: number;
    };
  };
  'recent-searches': {
    key: string;
    value: { query: string; timestamp: number };
  };
  'user-location': {
    key: string;
    value: { lat: number; lng: number; address: string; timestamp: number };
  };
}

let dbPromise: Promise<IDBPDatabase<UberEatsDB>> | null = null;

export function getDB(): Promise<IDBPDatabase<UberEatsDB>> {
  if (!dbPromise) {
    dbPromise = openDB<UberEatsDB>('uber-eats', 1, {
      upgrade(db) {
        // Restaurants store
        const restaurantStore = db.createObjectStore('restaurants', {
          keyPath: 'id',
        });
        restaurantStore.createIndex('by-location', ['lat', 'lng']);

        // Favorites store
        db.createObjectStore('favorites', { keyPath: 'restaurantId' });

        // Pending actions store
        db.createObjectStore('pending-actions', {
          keyPath: 'id',
          autoIncrement: true,
        });

        // Recent searches store
        db.createObjectStore('recent-searches', { keyPath: 'query' });

        // User location store
        db.createObjectStore('user-location', { keyPath: 'id' });
      },
    });
  }
  return dbPromise;
}

// Offline storage service
export const offlineStorage = {
  async cacheRestaurants(restaurants: Restaurant[]): Promise<void> {
    const db = await getDB();
    const tx = db.transaction('restaurants', 'readwrite');

    await Promise.all([
      ...restaurants.map((r) => tx.store.put(r)),
      tx.done,
    ]);
  },

  async getCachedRestaurants(
    location: { lat: number; lng: number },
    radius: number = 5
  ): Promise<Restaurant[]> {
    const db = await getDB();
    const allRestaurants = await db.getAll('restaurants');

    // Filter by distance (simple haversine approximation)
    return allRestaurants.filter((r) => {
      const distance = Math.sqrt(
        Math.pow(r.location.lat - location.lat, 2) +
          Math.pow(r.location.lng - location.lng, 2)
      );
      return distance < radius / 111; // Rough km to degrees conversion
    });
  },

  async addFavorite(restaurantId: string): Promise<void> {
    const db = await getDB();

    // Add to local favorites
    await db.put('favorites', {
      restaurantId,
      addedAt: Date.now(),
    });

    // Queue for sync if offline
    if (!navigator.onLine) {
      await db.add('pending-actions', {
        action: 'add-favorite',
        restaurantId,
        timestamp: Date.now(),
      });

      // Request background sync
      if ('serviceWorker' in navigator && 'sync' in ServiceWorkerRegistration.prototype) {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('sync-favorites');
      }
    }
  },

  async removeFavorite(restaurantId: string): Promise<void> {
    const db = await getDB();
    await db.delete('favorites', restaurantId);

    if (!navigator.onLine) {
      await db.add('pending-actions', {
        action: 'remove-favorite',
        restaurantId,
        timestamp: Date.now(),
      });
    }
  },

  async getFavorites(): Promise<string[]> {
    const db = await getDB();
    const favorites = await db.getAll('favorites');
    return favorites.map((f) => f.restaurantId);
  },

  async saveRecentSearch(query: string): Promise<void> {
    const db = await getDB();
    await db.put('recent-searches', {
      query,
      timestamp: Date.now(),
    });

    // Keep only last 10
    const searches = await db.getAll('recent-searches');
    if (searches.length > 10) {
      const oldest = searches
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, searches.length - 10);
      for (const search of oldest) {
        await db.delete('recent-searches', search.query);
      }
    }
  },

  async getRecentSearches(): Promise<string[]> {
    const db = await getDB();
    const searches = await db.getAll('recent-searches');
    return searches
      .sort((a, b) => b.timestamp - a.timestamp)
      .map((s) => s.query);
  },

  async saveLocation(location: {
    lat: number;
    lng: number;
    address: string;
  }): Promise<void> {
    const db = await getDB();
    await db.put('user-location', {
      id: 'current',
      ...location,
      timestamp: Date.now(),
    });
  },

  async getLocation(): Promise<{ lat: number; lng: number; address: string } | null> {
    const db = await getDB();
    const location = await db.get('user-location', 'current');
    return location ? { lat: location.lat, lng: location.lng, address: location.address } : null;
  },
};
```

### Offline-First Hook

```typescript
// hooks/useOfflineFirst.ts
interface UseOfflineFirstOptions<T> {
  queryKey: string[];
  fetchFn: () => Promise<T>;
  cacheKey: string;
  staleTime?: number;
}

function useOfflineFirst<T>({
  queryKey,
  fetchFn,
  cacheKey,
  staleTime = 5 * 60 * 1000,
}: UseOfflineFirstOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isCached, setIsCached] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Fetch with offline fallback
  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      setIsLoading(true);
      setError(null);

      try {
        // Try network first
        if (navigator.onLine) {
          const freshData = await fetchFn();
          if (isMounted) {
            setData(freshData);
            setIsCached(false);
            // Cache for offline
            await offlineStorage.set(cacheKey, freshData, staleTime);
          }
        } else {
          // Fallback to cache
          const cachedData = await offlineStorage.get<T>(cacheKey);
          if (cachedData && isMounted) {
            setData(cachedData);
            setIsCached(true);
          } else if (isMounted) {
            setError(new Error('No cached data available'));
          }
        }
      } catch (err) {
        // Network error, try cache
        const cachedData = await offlineStorage.get<T>(cacheKey);
        if (cachedData && isMounted) {
          setData(cachedData);
          setIsCached(true);
        } else if (isMounted) {
          setError(err as Error);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [queryKey.join(','), isOffline]);

  // Refetch when coming back online
  useEffect(() => {
    if (!isOffline && isCached) {
      // Trigger refetch
      fetchFn()
        .then((freshData) => {
          setData(freshData);
          setIsCached(false);
          offlineStorage.set(cacheKey, freshData, staleTime);
        })
        .catch(() => {
          // Keep cached data
        });
    }
  }, [isOffline]);

  return { data, isLoading, isOffline, isCached, error };
}

// Usage
const RestaurantList: React.FC = () => {
  const location = useLocation();

  const { data, isLoading, isOffline, isCached, error } = useOfflineFirst({
    queryKey: ['restaurants', location.lat, location.lng],
    fetchFn: () => fetchRestaurants(location),
    cacheKey: `restaurants-${location.lat}-${location.lng}`,
  });

  return (
    <div>
      {isOffline && (
        <Banner variant="warning">
          You're offline. Showing cached restaurants.
        </Banner>
      )}

      {isCached && !isOffline && (
        <Banner variant="info">
          Showing cached data. Refreshing...
        </Banner>
      )}

      {/* Render restaurants */}
    </div>
  );
};
```

### PWA Install Prompt

```typescript
// hooks/usePWAInstall.ts
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    // Listen for app installed
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const promptInstall = async () => {
    if (!installPrompt) return false;

    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;

    if (outcome === 'accepted') {
      setIsInstalled(true);
    }

    setInstallPrompt(null);
    return outcome === 'accepted';
  };

  return { isInstallable, isInstalled, promptInstall };
}

// Install prompt component
const InstallPrompt: React.FC = () => {
  const { isInstallable, promptInstall } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);

  if (!isInstallable || dismissed) return null;

  return (
    <div className="install-prompt">
      <div className="install-prompt__content">
        <AppIcon className="install-prompt__icon" />
        <div className="install-prompt__text">
          <h3>Install Uber Eats</h3>
          <p>Add to home screen for faster access</p>
        </div>
      </div>
      <div className="install-prompt__actions">
        <button onClick={() => setDismissed(true)}>Not now</button>
        <button onClick={promptInstall} className="primary">
          Install
        </button>
      </div>
    </div>
  );
};
```

### Web App Manifest

```json
// public/manifest.json
{
  "name": "Uber Eats - Food Delivery",
  "short_name": "Uber Eats",
  "description": "Order food from your favorite restaurants",
  "start_url": "/restaurants?source=pwa",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#06C167",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "screenshots": [
    {
      "src": "/screenshots/home.png",
      "sizes": "1280x720",
      "type": "image/png",
      "form_factor": "wide"
    },
    {
      "src": "/screenshots/mobile.png",
      "sizes": "750x1334",
      "type": "image/png",
      "form_factor": "narrow"
    }
  ],
  "shortcuts": [
    {
      "name": "Search Restaurants",
      "url": "/restaurants?search=true",
      "icons": [{ "src": "/icons/search.png", "sizes": "192x192" }]
    },
    {
      "name": "My Favorites",
      "url": "/favorites",
      "icons": [{ "src": "/icons/heart.png", "sizes": "192x192" }]
    }
  ],
  "share_target": {
    "action": "/share",
    "method": "GET",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  },
  "categories": ["food", "shopping"],
  "iarc_rating_id": "e84b072d-71b3-4d3e-86ae-31a8ce4e53b7"
}
```

### Offline UI Components

```typescript
// components/OfflineIndicator/OfflineIndicator.tsx
const OfflineIndicator: React.FC = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="offline-indicator" role="status" aria-live="polite">
      <WifiOffIcon aria-hidden="true" />
      <span>You're offline</span>
    </div>
  );
};

// components/OfflinePage/OfflinePage.tsx
const OfflinePage: React.FC = () => {
  const { cachedRestaurants, recentSearches } = useOfflineData();

  return (
    <div className="offline-page">
      <div className="offline-page__header">
        <WifiOffIcon className="offline-icon" />
        <h1>You're offline</h1>
        <p>Check your connection and try again</p>
      </div>

      {cachedRestaurants.length > 0 && (
        <section className="offline-section">
          <h2>Recently Viewed Restaurants</h2>
          <div className="restaurant-grid">
            {cachedRestaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                isOffline
              />
            ))}
          </div>
        </section>
      )}

      {recentSearches.length > 0 && (
        <section className="offline-section">
          <h2>Recent Searches</h2>
          <ul className="recent-searches-list">
            {recentSearches.map((search) => (
              <li key={search}>
                <ClockIcon />
                <span>{search}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <button onClick={() => window.location.reload()} className="retry-button">
        <RefreshIcon />
        Try Again
      </button>
    </div>
  );
};
```

### PWA Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PWA CHECKLIST                                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Core Requirements:                                                          │
│  ☐ Valid Web App Manifest                                                   │
│  ☐ Service Worker registered                                               │
│  ☐ HTTPS enabled                                                            │
│  ☐ Responsive design                                                        │
│  ☐ Works offline or with poor network                                      │
│                                                                              │
│  Service Worker:                                                             │
│  ☐ Precaches app shell                                                     │
│  ☐ Caches API responses                                                    │
│  ☐ Handles offline gracefully                                              │
│  ☐ Updates automatically                                                   │
│  ☐ Background sync for actions                                             │
│                                                                              │
│  Offline Experience:                                                         │
│  ☐ Shows cached restaurant data                                            │
│  ☐ Displays offline indicator                                              │
│  ☐ Queues favorites for sync                                               │
│  ☐ Shows recent searches                                                   │
│  ☐ Graceful degradation                                                    │
│                                                                              │
│  Install Experience:                                                         │
│  ☐ Install prompt at right moment                                          │
│  ☐ Custom install UI                                                       │
│  ☐ App shortcuts configured                                                │
│  ☐ Splash screen configured                                                │
│                                                                              │
│  Performance:                                                                │
│  ☐ Lighthouse PWA score > 90                                              │
│  ☐ Fast initial load (< 3s on 3G)                                         │
│  ☐ Smooth interactions (60fps)                                             │
│  ☐ Minimal cache size                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 17. Internationalization (i18n)

### i18n Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         I18N ARCHITECTURE                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Translation Pipeline:                                                       │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Translation Files → i18next Library → React Components            │   │
│  │  /locales/en/*.json    (i18next)        (useTranslation)           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Locale Detection (Priority Order):                                         │
│  URL Path → Cookie → Browser → Default                                      │
│  /es/restaurants   locale=es   Accept-Language   en                        │
│                                                                              │
│  Supported Locales:                                                         │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Code  │  Language        │  Direction  │  Regions                  │  │
│  ├────────┼──────────────────┼─────────────┼───────────────────────────┤  │
│  │  en    │  English         │  LTR        │  US, UK, AU               │  │
│  │  es    │  Spanish         │  LTR        │  ES, MX, AR               │  │
│  │  fr    │  French          │  LTR        │  FR, CA                   │  │
│  │  ar    │  Arabic          │  RTL        │  SA, AE, EG               │  │
│  │  he    │  Hebrew          │  RTL        │  IL                       │  │
│  │  zh    │  Chinese         │  LTR        │  CN, TW                   │  │
│  │  ja    │  Japanese        │  LTR        │  JP                       │  │
│  └────────┴──────────────────┴─────────────┴───────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### i18n Configuration

```typescript
// lib/i18n/config.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

export const supportedLocales = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
  { code: 'he', name: 'עברית', dir: 'rtl' },
  { code: 'zh', name: '中文', dir: 'ltr' },
  { code: 'ja', name: '日本語', dir: 'ltr' },
] as const;

export type SupportedLocale = (typeof supportedLocales)[number]['code'];

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: supportedLocales.map((l) => l.code),
    ns: ['common', 'restaurants', 'filters', 'errors'],
    defaultNS: 'common',

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      order: ['path', 'cookie', 'navigator', 'htmlTag'],
      lookupFromPathIndex: 0,
      lookupCookie: 'locale',
      caches: ['cookie'],
    },

    interpolation: {
      escapeValue: false,
      format: (value, format, lng) => {
        if (format === 'currency') {
          return new Intl.NumberFormat(lng, {
            style: 'currency',
            currency: getCurrencyForLocale(lng!),
          }).format(value);
        }
        return value;
      },
    },

    react: {
      useSuspense: true,
    },
  });

function getCurrencyForLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    en: 'USD', 'en-GB': 'GBP', es: 'EUR', 'es-MX': 'MXN',
    fr: 'EUR', ar: 'SAR', he: 'ILS', zh: 'CNY', ja: 'JPY',
  };
  return currencyMap[locale] || 'USD';
}

export default i18n;
```

### Translation Files

```json
// locales/en/restaurants.json
{
  "title": "Restaurants near you",
  "search": {
    "placeholder": "Search restaurants, cuisines...",
    "noResults": "No restaurants found for \"{{query}}\"",
    "recentSearches": "Recent searches"
  },
  "filters": {
    "title": "Filters",
    "cuisine": "Cuisine",
    "cuisineSelected_one": "{{count}} cuisine selected",
    "cuisineSelected_other": "{{count}} cuisines selected",
    "rating": "Rating",
    "ratingMin": "{{rating}}+ stars",
    "priceRange": "Price range",
    "deliveryTime": "Delivery time",
    "deliveryTimeUnder": "Under {{minutes}} min",
    "clearAll": "Clear all",
    "apply_one": "Show {{count}} restaurant",
    "apply_other": "Show {{count}} restaurants"
  },
  "card": {
    "promoted": "Promoted",
    "closed": "Currently closed",
    "opensAt": "Opens at {{time}}",
    "deliveryFee": "{{fee, currency}} delivery",
    "freeDelivery": "Free delivery",
    "rating_one": "{{rating}} ({{count}} review)",
    "rating_other": "{{rating}} ({{count}} reviews)",
    "eta": "{{min}}-{{max}} min"
  },
  "favorites": {
    "add": "Add {{name}} to favorites",
    "remove": "Remove {{name}} from favorites"
  },
  "empty": {
    "title": "No restaurants found",
    "description": "Try adjusting your filters or search",
    "clearFilters": "Clear filters"
  }
}

// locales/es/restaurants.json
{
  "title": "Restaurantes cerca de ti",
  "search": {
    "placeholder": "Buscar restaurantes, cocinas...",
    "noResults": "No se encontraron restaurantes para \"{{query}}\""
  },
  "filters": {
    "title": "Filtros",
    "cuisine": "Cocina",
    "cuisineSelected_one": "{{count}} cocina seleccionada",
    "cuisineSelected_other": "{{count}} cocinas seleccionadas",
    "clearAll": "Borrar todo",
    "apply_one": "Mostrar {{count}} restaurante",
    "apply_other": "Mostrar {{count}} restaurantes"
  },
  "card": {
    "promoted": "Promocionado",
    "closed": "Actualmente cerrado",
    "freeDelivery": "Envío gratis"
  }
}

// locales/ar/restaurants.json (RTL)
{
  "title": "المطاعم القريبة منك",
  "search": {
    "placeholder": "البحث عن المطاعم والمأكولات..."
  },
  "filters": {
    "title": "الفلاتر",
    "cuisine": "نوع المطبخ",
    "clearAll": "مسح الكل"
  }
}
```

### RTL Support

```typescript
// lib/i18n/rtl.ts
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export const RTL_LOCALES = ['ar', 'he', 'fa', 'ur'];

export function useDirection() {
  const { i18n } = useTranslation();
  const isRTL = RTL_LOCALES.includes(i18n.language);

  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language, isRTL]);

  return { isRTL, direction: isRTL ? 'rtl' : 'ltr' };
}

// CSS for RTL using logical properties
// styles/rtl.css

/* Use logical properties instead of physical */
.card {
  margin-inline-start: 1rem;  /* margin-left in LTR, margin-right in RTL */
  margin-inline-end: 1rem;
  padding-inline: 1rem;
}

/* Flexbox direction auto-reverses */
[dir="rtl"] .flex-row {
  flex-direction: row-reverse;
}

/* Icons that need flipping */
[dir="rtl"] .icon-arrow-right,
[dir="rtl"] .icon-chevron-right {
  transform: scaleX(-1);
}

/* Text alignment */
.text-start { text-align: start; }
.text-end { text-align: end; }

/* Border radius with logical properties */
.rounded-start {
  border-start-start-radius: 8px;
  border-end-start-radius: 8px;
}
```

### Number & Currency Formatting

```typescript
// lib/i18n/formatters.ts
import { useTranslation } from 'react-i18next';
import { useMemo } from 'react';

export function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language;

  return useMemo(() => ({
    number: (value: number, options?: Intl.NumberFormatOptions) => {
      return new Intl.NumberFormat(locale, options).format(value);
    },

    currency: (value: number, currency?: string) => {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency || getCurrencyForLocale(locale),
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    },

    compactNumber: (value: number) => {
      return new Intl.NumberFormat(locale, {
        notation: 'compact',
        compactDisplay: 'short',
      }).format(value);
    },

    distance: (meters: number) => {
      const useImperial = ['en-US', 'en-GB', 'en'].includes(locale);
      if (useImperial) {
        const miles = meters / 1609.34;
        return miles < 0.1 ? `${Math.round(meters * 3.28084)} ft` : `${miles.toFixed(1)} mi`;
      }
      return meters < 1000 ? `${Math.round(meters)} m` : `${(meters / 1000).toFixed(1)} km`;
    },

    time: (date: Date) => {
      return new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(date);
    },

    relativeTime: (date: Date) => {
      const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
      const diffMins = Math.round((date.getTime() - Date.now()) / 60000);
      if (Math.abs(diffMins) < 60) return rtf.format(diffMins, 'minute');
      return rtf.format(Math.round(diffMins / 60), 'hour');
    },

    list: (items: string[]) => {
      return new Intl.ListFormat(locale, { type: 'conjunction' }).format(items);
    },
  }), [locale]);
}

// Usage
const RestaurantCard: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => {
  const { t } = useTranslation('restaurants');
  const fmt = useFormatters();

  return (
    <article>
      <h3>{restaurant.name}</h3>
      <p>{fmt.list(restaurant.cuisines)}</p>
      <span>{t('card.rating', { rating: fmt.number(restaurant.rating), count: restaurant.reviewCount })}</span>
      <span>{fmt.distance(restaurant.distance)}</span>
      <span>
        {restaurant.deliveryFee === 0
          ? t('card.freeDelivery')
          : t('card.deliveryFee', { fee: restaurant.deliveryFee })}
      </span>
    </article>
  );
};
```

### Language Selector

```typescript
// components/LanguageSelector/LanguageSelector.tsx
const LanguageSelector: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLocale = supportedLocales.find((l) => l.code === i18n.language);

  const changeLanguage = async (locale: SupportedLocale) => {
    await i18n.changeLanguage(locale);
    document.cookie = `locale=${locale};path=/;max-age=31536000`;
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <GlobeIcon aria-hidden="true" />
        <span>{currentLocale?.name}</span>
      </button>

      {isOpen && (
        <ul role="listbox" aria-label={t('common:selectLanguage')}>
          {supportedLocales.map((locale) => (
            <li
              key={locale.code}
              role="option"
              aria-selected={i18n.language === locale.code}
              onClick={() => changeLanguage(locale.code)}
              lang={locale.code}
              dir={locale.dir}
            >
              {locale.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

### i18n Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         I18N CHECKLIST                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Setup:                                                                      │
│  ☐ i18next configured with all locales                                     │
│  ☐ Translation files organized by namespace                                │
│  ☐ Locale detection (URL > cookie > browser)                               │
│  ☐ Fallback language configured                                            │
│                                                                              │
│  Translations:                                                               │
│  ☐ All UI text externalized                                                │
│  ☐ Pluralization handled correctly                                         │
│  ☐ No hardcoded strings in components                                      │
│                                                                              │
│  Formatting:                                                                 │
│  ☐ Numbers with Intl.NumberFormat                                         │
│  ☐ Currencies locale-aware                                                 │
│  ☐ Dates/times formatted correctly                                         │
│  ☐ Distances in km/miles based on locale                                   │
│                                                                              │
│  RTL Support:                                                                │
│  ☐ CSS uses logical properties                                             │
│  ☐ Flexbox direction reverses for RTL                                      │
│  ☐ Icons flip where appropriate                                            │
│  ☐ Text alignment uses start/end                                           │
│                                                                              │
│  UX:                                                                         │
│  ☐ Language selector accessible                                            │
│  ☐ Preference persisted                                                    │
│  ☐ No flash on language change                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 18. Analytics & Monitoring

### Analytics Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ANALYTICS ARCHITECTURE                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Event Collection                                  │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │   │
│  │  │  Page    │  │  User    │  │  Error   │  │  Perf    │            │   │
│  │  │  Views   │  │  Actions │  │  Events  │  │  Metrics │            │   │
│  │  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │   │
│  └───────┼─────────────┼─────────────┼─────────────┼────────────────────┘   │
│          │             │             │             │                        │
│          └─────────────┴─────────────┴─────────────┘                        │
│                              │                                               │
│                              ▼                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Analytics Queue (Batched)                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                              │                                               │
│           ┌──────────────────┼──────────────────┐                          │
│           ▼                  ▼                  ▼                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                    │
│  │  Google     │    │  Amplitude  │    │  Internal   │                    │
│  │  Analytics  │    │             │    │  Metrics    │                    │
│  └─────────────┘    └─────────────┘    └─────────────┘                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Analytics Service

```typescript
// lib/analytics/analytics.ts
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

interface PageViewEvent {
  path: string;
  title: string;
  referrer?: string;
}

class AnalyticsService {
  private queue: AnalyticsEvent[] = [];
  private flushInterval: NodeJS.Timer | null = null;
  private readonly BATCH_SIZE = 10;
  private readonly FLUSH_INTERVAL = 5000;

  constructor() {
    if (typeof window !== 'undefined') {
      this.startFlushInterval();
      this.setupBeforeUnload();
    }
  }

  private startFlushInterval() {
    this.flushInterval = setInterval(() => this.flush(), this.FLUSH_INTERVAL);
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.flush(true); // Force sync flush
    });
  }

  track(name: string, properties?: Record<string, unknown>) {
    const event: AnalyticsEvent = {
      name,
      properties: {
        ...properties,
        timestamp: Date.now(),
        sessionId: this.getSessionId(),
        userId: this.getUserId(),
        page: window.location.pathname,
      },
    };

    this.queue.push(event);

    if (this.queue.length >= this.BATCH_SIZE) {
      this.flush();
    }
  }

  pageView(data: PageViewEvent) {
    this.track('page_view', data);

    // Also send to Google Analytics
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: data.path,
        page_title: data.title,
      });
    }
  }

  private async flush(sync = false) {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    const payload = JSON.stringify({ events });

    if (sync && navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics', payload);
    } else {
      try {
        await fetch('/api/analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: payload,
          keepalive: true,
        });
      } catch {
        // Re-queue failed events
        this.queue.unshift(...events);
      }
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session');
    if (!sessionId) {
      sessionId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem('analytics_session', sessionId);
    }
    return sessionId;
  }

  private getUserId(): string | null {
    return localStorage.getItem('user_id');
  }
}

export const analytics = new AnalyticsService();
```

### Restaurant Listing Events

```typescript
// lib/analytics/restaurantEvents.ts
import { analytics } from './analytics';

export const restaurantEvents = {
  // Search events
  searchPerformed: (query: string, resultsCount: number) => {
    analytics.track('restaurant_search', {
      query,
      results_count: resultsCount,
      has_results: resultsCount > 0,
    });
  },

  searchSuggestionClicked: (suggestion: string, position: number) => {
    analytics.track('search_suggestion_click', {
      suggestion,
      position,
    });
  },

  // Filter events
  filterApplied: (filters: FilterState, resultsCount: number) => {
    analytics.track('filter_applied', {
      cuisines: filters.cuisines,
      cuisine_count: filters.cuisines.length,
      min_rating: filters.minRating,
      price_range: filters.priceRange,
      max_eta: filters.maxEta,
      results_count: resultsCount,
    });
  },

  filterCleared: () => {
    analytics.track('filter_cleared');
  },

  // Restaurant interactions
  restaurantViewed: (restaurant: Restaurant, position: number) => {
    analytics.track('restaurant_viewed', {
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      cuisines: restaurant.cuisines,
      rating: restaurant.rating,
      price_range: restaurant.priceRange,
      position,
      is_promoted: restaurant.isPromoted,
    });
  },

  restaurantClicked: (restaurant: Restaurant, position: number) => {
    analytics.track('restaurant_clicked', {
      restaurant_id: restaurant.id,
      restaurant_name: restaurant.name,
      position,
      is_promoted: restaurant.isPromoted,
    });
  },

  restaurantFavorited: (restaurantId: string, action: 'add' | 'remove') => {
    analytics.track('restaurant_favorite', {
      restaurant_id: restaurantId,
      action,
    });
  },

  // Pagination
  loadMoreTriggered: (page: number, method: 'scroll' | 'button') => {
    analytics.track('load_more', {
      page,
      method,
    });
  },

  // Location events
  locationChanged: (method: 'gps' | 'search' | 'saved') => {
    analytics.track('location_changed', {
      method,
    });
  },
};
```

### Core Web Vitals Monitoring

```typescript
// lib/analytics/webVitals.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB, onINP } from 'web-vitals';

interface WebVitalMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  delta: number;
}

const vitalsQueue: WebVitalMetric[] = [];

function sendVitals() {
  if (vitalsQueue.length === 0) return;

  const metrics = [...vitalsQueue];
  vitalsQueue.length = 0;

  navigator.sendBeacon(
    '/api/analytics/vitals',
    JSON.stringify({
      metrics,
      url: window.location.href,
      timestamp: Date.now(),
    })
  );
}

function handleVital(metric: { name: string; value: number; rating: string; delta: number }) {
  vitalsQueue.push({
    name: metric.name,
    value: metric.value,
    rating: metric.rating as 'good' | 'needs-improvement' | 'poor',
    delta: metric.delta,
  });

  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vital] ${metric.name}: ${metric.value} (${metric.rating})`);
  }
}

export function initWebVitals() {
  onCLS(handleVital);
  onFID(handleVital);
  onLCP(handleVital);
  onFCP(handleVital);
  onTTFB(handleVital);
  onINP(handleVital);

  // Send on page unload
  window.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
      sendVitals();
    }
  });
}

// Usage in app
// pages/_app.tsx
useEffect(() => {
  initWebVitals();
}, []);
```

### Error Tracking

```typescript
// lib/analytics/errorTracking.ts
interface ErrorEvent {
  message: string;
  stack?: string;
  type: 'error' | 'unhandled_rejection' | 'api_error' | 'render_error';
  context?: Record<string, unknown>;
}

class ErrorTracker {
  private errors: ErrorEvent[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.setupGlobalHandlers();
    }
  }

  private setupGlobalHandlers() {
    // Unhandled errors
    window.addEventListener('error', (event) => {
      this.captureError({
        message: event.message,
        stack: event.error?.stack,
        type: 'error',
        context: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        },
      });
    });

    // Unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.captureError({
        message: event.reason?.message || 'Unhandled rejection',
        stack: event.reason?.stack,
        type: 'unhandled_rejection',
      });
    });
  }

  captureError(error: ErrorEvent) {
    const enrichedError = {
      ...error,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent,
      sessionId: sessionStorage.getItem('analytics_session'),
    };

    this.errors.push(enrichedError);

    // Send immediately for errors
    this.sendError(enrichedError);
  }

  captureApiError(endpoint: string, status: number, message: string) {
    this.captureError({
      message: `API Error: ${endpoint} - ${status}`,
      type: 'api_error',
      context: { endpoint, status, message },
    });
  }

  private async sendError(error: ErrorEvent) {
    try {
      await fetch('/api/analytics/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(error),
        keepalive: true,
      });
    } catch {
      // Silently fail
    }
  }
}

export const errorTracker = new ErrorTracker();

// React Error Boundary integration
// components/ErrorBoundary/ErrorBoundary.tsx
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    errorTracker.captureError({
      message: error.message,
      stack: error.stack,
      type: 'render_error',
      context: {
        componentStack: errorInfo.componentStack,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}
```

### A/B Testing Infrastructure

```typescript
// lib/analytics/abTesting.ts
interface Experiment {
  id: string;
  name: string;
  variants: string[];
  weights?: number[];
}

interface ExperimentAssignment {
  experimentId: string;
  variant: string;
  assignedAt: number;
}

class ABTestingService {
  private assignments: Map<string, ExperimentAssignment> = new Map();

  constructor() {
    this.loadAssignments();
  }

  private loadAssignments() {
    const stored = localStorage.getItem('ab_assignments');
    if (stored) {
      const parsed = JSON.parse(stored);
      Object.entries(parsed).forEach(([id, assignment]) => {
        this.assignments.set(id, assignment as ExperimentAssignment);
      });
    }
  }

  private saveAssignments() {
    const obj: Record<string, ExperimentAssignment> = {};
    this.assignments.forEach((v, k) => (obj[k] = v));
    localStorage.setItem('ab_assignments', JSON.stringify(obj));
  }

  getVariant(experiment: Experiment): string {
    const existing = this.assignments.get(experiment.id);
    if (existing) {
      return existing.variant;
    }

    // Assign new variant
    const variant = this.assignVariant(experiment);
    const assignment: ExperimentAssignment = {
      experimentId: experiment.id,
      variant,
      assignedAt: Date.now(),
    };

    this.assignments.set(experiment.id, assignment);
    this.saveAssignments();

    // Track assignment
    analytics.track('experiment_assigned', {
      experiment_id: experiment.id,
      experiment_name: experiment.name,
      variant,
    });

    return variant;
  }

  private assignVariant(experiment: Experiment): string {
    const weights = experiment.weights || experiment.variants.map(() => 1);
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < experiment.variants.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return experiment.variants[i];
      }
    }

    return experiment.variants[0];
  }

  trackConversion(experimentId: string, conversionType: string) {
    const assignment = this.assignments.get(experimentId);
    if (assignment) {
      analytics.track('experiment_conversion', {
        experiment_id: experimentId,
        variant: assignment.variant,
        conversion_type: conversionType,
      });
    }
  }
}

export const abTesting = new ABTestingService();

// Usage example
const FILTER_UI_EXPERIMENT: Experiment = {
  id: 'filter_ui_v2',
  name: 'New Filter UI',
  variants: ['control', 'chips', 'bottom_sheet'],
  weights: [50, 25, 25],
};

const FilterComponent: React.FC = () => {
  const variant = abTesting.getVariant(FILTER_UI_EXPERIMENT);

  if (variant === 'chips') return <FilterChips />;
  if (variant === 'bottom_sheet') return <FilterBottomSheet />;
  return <FilterDropdown />; // control
};
```

### Analytics React Hooks

```typescript
// hooks/useAnalytics.ts
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import { analytics } from '@/lib/analytics';
import { restaurantEvents } from '@/lib/analytics/restaurantEvents';

// Track page views
export function usePageView() {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      analytics.pageView({
        path: url,
        title: document.title,
        referrer: document.referrer,
      });
    };

    handleRouteChange(router.asPath);
    router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [router]);
}

// Track element visibility (for impressions)
export function useViewTracking(
  restaurant: Restaurant,
  position: number
) {
  const ref = useRef<HTMLElement>(null);
  const hasTracked = useRef(false);

  useEffect(() => {
    if (!ref.current || hasTracked.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasTracked.current) {
          restaurantEvents.restaurantViewed(restaurant, position);
          hasTracked.current = true;
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);

    return () => observer.disconnect();
  }, [restaurant, position]);

  return ref;
}

// Track click events
export function useClickTracking(
  restaurant: Restaurant,
  position: number
) {
  return () => {
    restaurantEvents.restaurantClicked(restaurant, position);
  };
}
```

### Analytics Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      ANALYTICS CHECKLIST                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Event Tracking:                                                             │
│  ☐ Page views tracked                                                       │
│  ☐ Search events (query, results count)                                    │
│  ☐ Filter events (applied, cleared)                                        │
│  ☐ Restaurant clicks/views with position                                   │
│  ☐ Favorite add/remove                                                     │
│  ☐ Load more/pagination                                                    │
│                                                                              │
│  Performance:                                                                │
│  ☐ Core Web Vitals (LCP, FID, CLS)                                        │
│  ☐ TTFB, FCP monitored                                                     │
│  ☐ API response times                                                      │
│  ☐ Resource load times                                                     │
│                                                                              │
│  Error Tracking:                                                             │
│  ☐ Global error handler                                                    │
│  ☐ Promise rejection handler                                               │
│  ☐ API error tracking                                                      │
│  ☐ React error boundary                                                    │
│                                                                              │
│  A/B Testing:                                                                │
│  ☐ Experiment assignment tracked                                           │
│  ☐ Conversions attributed                                                  │
│  ☐ Consistent assignment across sessions                                   │
│                                                                              │
│  Implementation:                                                             │
│  ☐ Events batched for efficiency                                          │
│  ☐ sendBeacon for reliable delivery                                       │
│  ☐ Session/user ID tracking                                               │
│  ☐ No PII in analytics events                                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 19. Search & Autocomplete Deep Dive

### Search Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SEARCH ARCHITECTURE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input → Debounce → Query Processing → API Request → Result Ranking   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Search Sources                                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │   │
│  │  │   Recent     │  │   Popular    │  │   API        │              │   │
│  │  │   Searches   │  │   Searches   │  │   Results    │              │   │
│  │  │   (Local)    │  │   (Cached)   │  │   (Live)     │              │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Result Types:                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  • Restaurants (name, cuisine match)                                 │  │
│  │  • Cuisines (category match)                                         │  │
│  │  • Dishes (menu item match)                                          │  │
│  │  • Collections (curated lists)                                       │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Debounced Search Hook

```typescript
// hooks/useSearch.ts
interface UseSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
}

function useSearch({ debounceMs = 300, minQueryLength = 2 }: UseSearchOptions = {}) {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Debounce query
  useEffect(() => {
    setIsTyping(true);
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      setIsTyping(false);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs]);

  // Fetch results
  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchRestaurants(debouncedQuery),
    enabled: debouncedQuery.length >= minQueryLength,
    staleTime: 60000, // 1 minute
  });

  // Recent searches from localStorage
  const { recentSearches, addRecentSearch, clearRecentSearches } = useRecentSearches();

  return {
    query,
    setQuery,
    results: data?.results || [],
    suggestions: data?.suggestions || [],
    isLoading: isLoading || isTyping,
    error,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  };
}

// Recent searches hook
function useRecentSearches(maxItems = 5) {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('recent_searches');
    if (stored) {
      setSearches(JSON.parse(stored));
    }
  }, []);

  const addRecentSearch = (query: string) => {
    const updated = [query, ...searches.filter((s) => s !== query)].slice(0, maxItems);
    setSearches(updated);
    localStorage.setItem('recent_searches', JSON.stringify(updated));
  };

  const clearRecentSearches = () => {
    setSearches([]);
    localStorage.removeItem('recent_searches');
  };

  return { recentSearches: searches, addRecentSearch, clearRecentSearches };
}
```

### Autocomplete Component

```typescript
// components/SearchAutocomplete/SearchAutocomplete.tsx
interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  onRestaurantSelect: (restaurant: Restaurant) => void;
}

const SearchAutocomplete: React.FC<SearchAutocompleteProps> = ({
  onSearch,
  onRestaurantSelect,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const {
    query,
    setQuery,
    results,
    suggestions,
    isLoading,
    recentSearches,
    addRecentSearch,
    clearRecentSearches,
  } = useSearch();

  // Combine all options
  const options = useMemo(() => {
    if (!query) {
      return recentSearches.map((s) => ({ type: 'recent', value: s }));
    }
    return [
      ...suggestions.map((s) => ({ type: 'suggestion', value: s })),
      ...results.map((r) => ({ type: 'restaurant', value: r })),
    ];
  }, [query, suggestions, results, recentSearches]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.min(prev + 1, options.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0) {
          handleSelect(options[highlightedIndex]);
        } else if (query) {
          handleSubmit();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (option: typeof options[0]) => {
    if (option.type === 'restaurant') {
      onRestaurantSelect(option.value as Restaurant);
    } else {
      setQuery(option.value as string);
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (query.trim()) {
      addRecentSearch(query.trim());
      onSearch(query.trim());
      setIsOpen(false);
    }
  };

  // Highlight matching text
  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? <mark key={i}>{part}</mark> : part
    );
  };

  return (
    <div className="search-autocomplete" role="combobox" aria-expanded={isOpen}>
      <div className="search-input-wrapper">
        <SearchIcon aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          onKeyDown={handleKeyDown}
          placeholder="Search restaurants, cuisines..."
          aria-autocomplete="list"
          aria-controls="search-listbox"
          aria-activedescendant={highlightedIndex >= 0 ? `option-${highlightedIndex}` : undefined}
        />
        {isLoading && <Spinner className="search-spinner" />}
        {query && (
          <button onClick={() => setQuery('')} aria-label="Clear search">
            <CloseIcon />
          </button>
        )}
      </div>

      {isOpen && options.length > 0 && (
        <ul
          ref={listRef}
          id="search-listbox"
          role="listbox"
          className="search-dropdown"
        >
          {!query && recentSearches.length > 0 && (
            <li className="dropdown-header">
              <span>Recent searches</span>
              <button onClick={clearRecentSearches}>Clear all</button>
            </li>
          )}

          {options.map((option, index) => (
            <li
              key={`${option.type}-${index}`}
              id={`option-${index}`}
              role="option"
              aria-selected={index === highlightedIndex}
              className={`dropdown-item ${index === highlightedIndex ? 'highlighted' : ''}`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => handleSelect(option)}
            >
              {option.type === 'recent' && <ClockIcon />}
              {option.type === 'suggestion' && <SearchIcon />}
              {option.type === 'restaurant' ? (
                <RestaurantSuggestion
                  restaurant={option.value as Restaurant}
                  query={query}
                />
              ) : (
                <span>{highlightMatch(option.value as string, query)}</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Restaurant suggestion item
const RestaurantSuggestion: React.FC<{ restaurant: Restaurant; query: string }> = ({
  restaurant,
  query,
}) => (
  <div className="restaurant-suggestion">
    <Image src={restaurant.image} alt="" width={40} height={40} />
    <div className="suggestion-details">
      <span className="name">{highlightMatch(restaurant.name, query)}</span>
      <span className="meta">
        {restaurant.cuisines.join(', ')} • {restaurant.rating} ★
      </span>
    </div>
  </div>
);
```

### Fuzzy Search Implementation

```typescript
// lib/search/fuzzySearch.ts
interface FuzzySearchOptions {
  threshold?: number;
  keys?: string[];
}

function fuzzySearch<T extends Record<string, unknown>>(
  items: T[],
  query: string,
  options: FuzzySearchOptions = {}
): T[] {
  const { threshold = 0.6, keys = [] } = options;

  if (!query) return items;

  const normalizedQuery = query.toLowerCase().trim();

  return items
    .map((item) => {
      const searchableValues = keys.length
        ? keys.map((key) => String(item[key] || ''))
        : Object.values(item).map(String);

      const scores = searchableValues.map((value) =>
        calculateSimilarity(normalizedQuery, value.toLowerCase())
      );

      const maxScore = Math.max(...scores);

      return { item, score: maxScore };
    })
    .filter(({ score }) => score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map(({ item }) => item);
}

// Levenshtein distance for similarity
function calculateSimilarity(str1: string, str2: string): number {
  // Check for prefix match (higher weight)
  if (str2.startsWith(str1)) return 1;
  if (str2.includes(str1)) return 0.9;

  // Levenshtein distance
  const matrix: number[][] = [];

  for (let i = 0; i <= str1.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= str2.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str1.length; i++) {
    for (let j = 1; j <= str2.length; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[str1.length][str2.length];
  const maxLength = Math.max(str1.length, str2.length);

  return 1 - distance / maxLength;
}

export { fuzzySearch };
```

---

## 20. Location Services Deep Dive

### Location Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      LOCATION SERVICES                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Location Sources (Priority Order):                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  1. URL Parameter (?lat=...&lng=...)                                 │  │
│  │  2. User Selection (manual address)                                   │  │
│  │  3. Saved Location (localStorage)                                     │  │
│  │  4. GPS (Geolocation API)                                            │  │
│  │  5. IP-based Fallback                                                 │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Location Flow                                     │   │
│  │                                                                      │   │
│  │  Get Location → Validate → Reverse Geocode → Store → Fetch Data    │   │
│  │       │              │            │             │                    │   │
│  │       ▼              ▼            ▼             ▼                    │   │
│  │  GPS/Search    In Delivery    Get Address   Save to                 │   │
│  │                   Zone?                     Storage                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Geolocation Hook

```typescript
// hooks/useGeolocation.ts
interface GeolocationState {
  location: { lat: number; lng: number } | null;
  address: string | null;
  error: string | null;
  isLoading: boolean;
  source: 'gps' | 'saved' | 'ip' | 'manual' | null;
}

function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    address: null,
    error: null,
    isLoading: true,
    source: null,
  });

  // Try to get location on mount
  useEffect(() => {
    initLocation();
  }, []);

  const initLocation = async () => {
    // 1. Check saved location
    const saved = localStorage.getItem('user_location');
    if (saved) {
      const parsed = JSON.parse(saved);
      setState({
        location: { lat: parsed.lat, lng: parsed.lng },
        address: parsed.address,
        error: null,
        isLoading: false,
        source: 'saved',
      });
      return;
    }

    // 2. Try GPS
    if ('geolocation' in navigator) {
      try {
        const position = await getCurrentPosition();
        const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
        const address = await reverseGeocode(coords);

        setState({
          location: coords,
          address,
          error: null,
          isLoading: false,
          source: 'gps',
        });

        saveLocation(coords, address);
      } catch (err) {
        // 3. Fallback to IP
        await fallbackToIP();
      }
    } else {
      await fallbackToIP();
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      });
    });
  };

  const reverseGeocode = async (coords: { lat: number; lng: number }): Promise<string> => {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coords.lat},${coords.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY}`
    );
    const data = await response.json();
    return data.results[0]?.formatted_address || 'Unknown location';
  };

  const fallbackToIP = async () => {
    try {
      const response = await fetch('/api/location/ip');
      const data = await response.json();

      setState({
        location: { lat: data.lat, lng: data.lng },
        address: data.city,
        error: null,
        isLoading: false,
        source: 'ip',
      });
    } catch {
      setState((prev) => ({
        ...prev,
        error: 'Could not determine location',
        isLoading: false,
      }));
    }
  };

  const saveLocation = (coords: { lat: number; lng: number }, address: string) => {
    localStorage.setItem('user_location', JSON.stringify({ ...coords, address }));
  };

  const updateLocation = (coords: { lat: number; lng: number }, address: string) => {
    setState({
      location: coords,
      address,
      error: null,
      isLoading: false,
      source: 'manual',
    });
    saveLocation(coords, address);
  };

  const requestGPS = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    try {
      const position = await getCurrentPosition();
      const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
      const address = await reverseGeocode(coords);

      setState({
        location: coords,
        address,
        error: null,
        isLoading: false,
        source: 'gps',
      });
      saveLocation(coords, address);
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: 'Location access denied',
        isLoading: false,
      }));
    }
  };

  return { ...state, updateLocation, requestGPS };
}
```

### Address Autocomplete

```typescript
// components/AddressAutocomplete/AddressAutocomplete.tsx
const AddressAutocomplete: React.FC<{
  onSelect: (location: { lat: number; lng: number; address: string }) => void;
}> = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);

  useEffect(() => {
    if (window.google) {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      placesService.current = new google.maps.places.PlacesService(
        document.createElement('div')
      );
    }
  }, []);

  const handleInputChange = useDebouncedCallback((value: string) => {
    if (value.length < 3 || !autocompleteService.current) {
      setPredictions([]);
      return;
    }

    autocompleteService.current.getPlacePredictions(
      {
        input: value,
        types: ['address'],
        componentRestrictions: { country: 'us' },
      },
      (results) => {
        setPredictions(results || []);
      }
    );
  }, 300);

  const handleSelect = (placeId: string) => {
    if (!placesService.current) return;

    placesService.current.getDetails(
      { placeId, fields: ['geometry', 'formatted_address'] },
      (place) => {
        if (place?.geometry?.location) {
          onSelect({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address || '',
          });
          setPredictions([]);
          setQuery(place.formatted_address || '');
        }
      }
    );
  };

  return (
    <div className="address-autocomplete">
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          handleInputChange(e.target.value);
        }}
        placeholder="Enter delivery address"
      />
      {predictions.length > 0 && (
        <ul className="predictions-list">
          {predictions.map((prediction) => (
            <li
              key={prediction.place_id}
              onClick={() => handleSelect(prediction.place_id)}
            >
              <LocationIcon />
              <span>{prediction.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
```

---

## 21. Design System & Theming

### Design Token Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DESIGN TOKEN SYSTEM                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Token Hierarchy:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Primitive Tokens → Semantic Tokens → Component Tokens              │   │
│  │  (colors, spacing)   (primary, error)   (button-bg, card-border)   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Theme Structure:                                                            │
│  ┌──────────────────┐  ┌──────────────────┐                                │
│  │   Light Theme    │  │   Dark Theme     │                                │
│  ├──────────────────┤  ├──────────────────┤                                │
│  │ --bg: #fff       │  │ --bg: #1a1a1a    │                                │
│  │ --text: #222     │  │ --text: #f5f5f5  │                                │
│  │ --primary: #06C1 │  │ --primary: #06C1 │                                │
│  │ --surface: #f5f5 │  │ --surface: #2a2a │                                │
│  └──────────────────┘  └──────────────────┘                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### CSS Variables & Theme Configuration

```css
/* styles/tokens.css */
:root {
  /* Primitive tokens */
  --color-green-50: #e6f9f0;
  --color-green-500: #06c167;
  --color-green-600: #05a857;
  --color-gray-50: #fafafa;
  --color-gray-100: #f5f5f5;
  --color-gray-200: #e5e5e5;
  --color-gray-500: #737373;
  --color-gray-800: #262626;
  --color-gray-900: #171717;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;

  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Typography */
  --font-sans: 'Inter', -apple-system, sans-serif;
  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* Light theme (default) */
:root, [data-theme="light"] {
  --color-bg: #ffffff;
  --color-bg-secondary: var(--color-gray-50);
  --color-text: var(--color-gray-900);
  --color-text-secondary: var(--color-gray-500);
  --color-primary: var(--color-green-500);
  --color-primary-hover: var(--color-green-600);
  --color-border: var(--color-gray-200);
  --color-surface: #ffffff;
}

/* Dark theme */
[data-theme="dark"] {
  --color-bg: #0a0a0a;
  --color-bg-secondary: #171717;
  --color-text: #fafafa;
  --color-text-secondary: #a3a3a3;
  --color-primary: var(--color-green-500);
  --color-primary-hover: var(--color-green-600);
  --color-border: #404040;
  --color-surface: #262626;
}
```

### Theme Provider

```typescript
// lib/theme/ThemeProvider.tsx
type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme') as Theme | null;
    if (stored) setThemeState(stored);
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const updateTheme = () => {
      const resolved = theme === 'system'
        ? (mediaQuery.matches ? 'dark' : 'light')
        : theme;

      setResolvedTheme(resolved);
      document.documentElement.setAttribute('data-theme', resolved);
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);

    return () => mediaQuery.removeEventListener('change', updateTheme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};

// Theme toggle component
const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
};
```

### Component Library

```typescript
// components/ui/Button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, children, className, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-medium rounded-md transition-colors',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary',
          {
            // Variants
            'bg-primary text-white hover:bg-primary-hover': variant === 'primary',
            'bg-gray-100 text-gray-900 hover:bg-gray-200': variant === 'secondary',
            'bg-transparent hover:bg-gray-100': variant === 'ghost',
            // Sizes
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            // States
            'opacity-50 cursor-not-allowed': props.disabled || isLoading,
          },
          className
        )}
        disabled={props.disabled || isLoading}
        {...props}
      >
        {isLoading && <Spinner className="mr-2 h-4 w-4" />}
        {children}
      </button>
    );
  }
);

// components/ui/Card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, hoverable }) => (
  <div
    className={cn(
      'bg-surface rounded-lg border border-border shadow-sm',
      hoverable && 'hover:shadow-md transition-shadow cursor-pointer',
      className
    )}
  >
    {children}
  </div>
);

// components/ui/Badge.tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => (
  <span
    className={cn(
      'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
      {
        'bg-gray-100 text-gray-800': variant === 'default',
        'bg-green-100 text-green-800': variant === 'success',
        'bg-yellow-100 text-yellow-800': variant === 'warning',
        'bg-red-100 text-red-800': variant === 'error',
      }
    )}
  >
    {children}
  </span>
);
```

### Design System Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DESIGN SYSTEM CHECKLIST                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Tokens:                                                                     │
│  ☐ Color palette defined (primitives + semantic)                           │
│  ☐ Spacing scale (4px base)                                                │
│  ☐ Typography scale                                                        │
│  ☐ Border radius tokens                                                    │
│  ☐ Shadow tokens                                                           │
│                                                                              │
│  Theming:                                                                    │
│  ☐ Light/Dark theme support                                                │
│  ☐ System preference detection                                             │
│  ☐ Theme persistence                                                       │
│  ☐ No flash on load                                                        │
│                                                                              │
│  Components:                                                                 │
│  ☐ Button (variants, sizes, states)                                       │
│  ☐ Card component                                                          │
│  ☐ Badge/Tag component                                                     │
│  ☐ Input components                                                        │
│  ☐ Loading states (skeleton, spinner)                                     │
│                                                                              │
│  Accessibility:                                                              │
│  ☐ Color contrast (4.5:1 min)                                             │
│  ☐ Focus states visible                                                    │
│  ☐ Reduced motion support                                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
