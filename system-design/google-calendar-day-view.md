# Google Calendar - Day View (HLD)

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
12. [Accessibility (A11y)](#12-accessibility-a11y)
13. [Mobile & Touch Considerations](#13-mobile--touch-considerations)
14. [Comprehensive Testing Strategy](#14-comprehensive-testing-strategy)
15. [Offline Support & PWA](#15-offline-support--pwa)
16. [Internationalization (i18n)](#16-internationalization-i18n)
17. [Security Deep Dive](#17-security-deep-dive)
18. [Analytics & Observability](#18-analytics--observability)
19. [Attendee & Scheduling Features](#19-attendee--scheduling-features)
20. [Reminder & Notification System](#20-reminder--notification-system)
21. [Virtual Scrolling & Large Datasets](#21-virtual-scrolling--large-datasets)

---

## 1. Problem Statement & Requirements

### Functional Requirements
- Display events for a single day in a time-based grid (24 hours)
- Create, edit, and delete events via UI
- Drag and drop events to reschedule
- Resize events to change duration
- Handle overlapping events (visual stacking)
- Support recurring events
- Show multiple calendars with color coding
- Real-time collaboration (shared calendars)
- All-day events section
- Time zone support

### Non-Functional Requirements
- **Performance**: Render 50+ events without lag
- **Responsiveness**: Smooth drag/resize at 60fps
- **Real-time**: Updates within 1 second for shared calendars
- **Offline**: View and create events offline, sync when online
- **Accessibility**: Full keyboard navigation, screen reader support

### Capacity Estimation
```
Daily Active Users: 500 million
Events per user: ~10-20 visible in day view
Peak concurrent users: 50 million
API calls per day view: 3-5 (events, calendars, settings)
Event updates per minute (peak): 10 million
```

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Web App       │  │   iOS App       │  │  Android App    │             │
│  │   (React)       │  │   (Swift)       │  │  (Kotlin)       │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
│           │                    │                    │                       │
│           └────────────────────┴────────────────────┘                       │
│                                │                                             │
└────────────────────────────────┼─────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CDN (Edge Layer)                                   │
│  • Static assets (JS, CSS, fonts)                                           │
│  • Service Worker for offline                                                │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         API Gateway / Load Balancer                          │
│  • Authentication (OAuth 2.0)                                                │
│  • Rate limiting                                                             │
│  • Request routing                                                           │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        ▼                        ▼                        ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   Calendar    │      │    Event      │      │  Notification │
│   Service     │      │   Service     │      │   Service     │
│               │      │               │      │               │
│ • CRUD        │      │ • CRUD        │      │ • Push        │
│ • Sharing     │      │ • Recurrence  │      │ • Email       │
│ • Permissions │      │ • Conflicts   │      │ • Reminders   │
└───────┬───────┘      └───────┬───────┘      └───────┬───────┘
        │                      │                      │
        └──────────────────────┴──────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Real-time Layer                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   WebSocket     │  │   Pub/Sub       │  │   Event Queue   │             │
│  │   Gateway       │  │   (Redis)       │  │   (Kafka)       │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└────────────────────────────────┬─────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           Data Layer                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   PostgreSQL    │  │     Redis       │  │    Cassandra    │             │
│  │   (Primary)     │  │    (Cache)      │  │   (Time-series) │             │
│  │                 │  │                 │  │                 │             │
│  │ • Calendars     │  │ • Session       │  │ • Event logs    │             │
│  │ • Events        │  │ • Hot events    │  │ • Analytics     │             │
│  │ • Users         │  │ • Permissions   │  │                 │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### Frontend Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CalendarApp                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                            Header                                      │  │
│  │  ┌───────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │  │
│  │  │ Navigation│  │  DatePicker  │  │  ViewToggle  │  │  UserMenu   │  │  │
│  │  │ (< Today >)│  │  (Mini Cal)  │  │  (D/W/M/Y)   │  │  (Settings) │  │  │
│  │  └───────────┘  └──────────────┘  └──────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────┬───────────────────────────────────────────────────┐  │
│  │                   │                                                    │  │
│  │    Sidebar        │                  DayView                          │  │
│  │  ┌─────────────┐  │  ┌──────────────────────────────────────────────┐ │  │
│  │  │ MiniCalendar│  │  │              AllDaySection                   │ │  │
│  │  │             │  │  │  ┌────────────────────────────────────────┐  │ │  │
│  │  │ ┌─┬─┬─┬─┬─┐ │  │  │  │  AllDayEvent  │  AllDayEvent          │  │ │  │
│  │  │ │M│T│W│T│F│ │  │  │  └────────────────────────────────────────┘  │ │  │
│  │  │ ├─┼─┼─┼─┼─┤ │  │  └──────────────────────────────────────────────┘ │  │
│  │  │ │1│2│3│4│5│ │  │                                                    │  │
│  │  │ └─┴─┴─┴─┴─┘ │  │  ┌──────────────────────────────────────────────┐ │  │
│  │  └─────────────┘  │  │              TimeGrid                         │ │  │
│  │                   │  │  ┌──────┬─────────────────────────────────┐   │ │  │
│  │  ┌─────────────┐  │  │  │      │                                 │   │ │  │
│  │  │ CalendarList│  │  │  │ 9 AM │  ┌─────────────────────────┐   │   │ │  │
│  │  │             │  │  │  │      │  │     EventBlock          │   │   │ │  │
│  │  │ □ Work      │  │  │  ├──────┤  │     (Draggable)         │   │   │ │  │
│  │  │ □ Personal  │  │  │  │      │  │     (Resizable)         │   │   │ │  │
│  │  │ □ Holidays  │  │  │  │10 AM │  └─────────────────────────┘   │   │ │  │
│  │  │             │  │  │  │      │                                 │   │ │  │
│  │  └─────────────┘  │  │  ├──────┤  ┌──────────┐ ┌──────────┐     │   │ │  │
│  │                   │  │  │      │  │ Event 1  │ │ Event 2  │     │   │ │  │
│  │  ┌─────────────┐  │  │  │11 AM │  │(Overlap) │ │(Overlap) │     │   │ │  │
│  │  │ CreateBtn   │  │  │  │      │  └──────────┘ └──────────┘     │   │ │  │
│  │  │ [+ Create]  │  │  │  ├──────┤                                 │   │ │  │
│  │  └─────────────┘  │  │  │      │                                 │   │ │  │
│  │                   │  │  │12 PM │                                 │   │ │  │
│  └───────────────────┤  │  │      │                                 │   │ │  │
│                      │  │  └──────┴─────────────────────────────────┘   │ │  │
│                      │  │                                                │ │  │
│                      │  │  ┌──────────────────────────────────────────┐ │ │  │
│                      │  │  │         CurrentTimeIndicator             │ │ │  │
│                      │  │  │  ────────────● (red line)                │ │ │  │
│                      │  │  └──────────────────────────────────────────┘ │ │  │
│                      │  └──────────────────────────────────────────────┘ │  │
│                      └───────────────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        EventModal (Overlay)                            │  │
│  │  ┌───────────────────────────────────────────────────────────────┐   │  │
│  │  │  Title: _______________                                        │   │  │
│  │  │  Date:  [Dec 22] Time: [10:00] - [11:00]                      │   │  │
│  │  │  Calendar: [Work ▼]                                            │   │  │
│  │  │  Recurrence: [Does not repeat ▼]                              │   │  │
│  │  │  Location: _______________                                     │   │  │
│  │  │  Description: _____________                                    │   │  │
│  │  │  [Save]  [Cancel]                                              │   │  │
│  │  └───────────────────────────────────────────────────────────────┘   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Component Responsibilities

| Component | Responsibility |
|-----------|---------------|
| `TimeGrid` | 24-hour grid, slot click handling, event positioning |
| `EventBlock` | Render single event, drag/resize handlers |
| `AllDaySection` | Events spanning entire day, expandable |
| `CurrentTimeIndicator` | Red line showing current time, auto-updates |
| `EventModal` | Create/edit form, validation, recurrence rules |
| `CalendarList` | Toggle calendar visibility, color assignment |

---

## 4. Data Flow

### Event Creation Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User    │     │  UI      │     │  State   │     │  API     │     │  Server  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. Click on    │                │                │                │
     │    time slot   │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ 2. Open modal  │                │                │
     │                │    with time   │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │ 3. Fill event  │                │                │                │
     │    details     │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │ 4. Submit      │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ 5. Optimistic  │                │                │
     │                │    update      │                │                │
     │                │───────────────>│                │                │
     │                │                │                │                │
     │ 6. See event   │                │                │                │
     │<───────────────│                │                │                │
     │   immediately  │                │                │                │
     │                │                │ 7. POST /events│                │
     │                │                │───────────────>│                │
     │                │                │                │───────────────>│
     │                │                │                │                │
     │                │                │                │  8. Validate & │
     │                │                │                │     Store      │
     │                │                │                │<───────────────│
     │                │                │                │                │
     │                │                │ 9. Confirm     │                │
     │                │                │<───────────────│                │
     │                │                │                │                │
     │                │ 10. Update     │                │                │
     │                │     with ID    │                │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
```

### Drag & Drop Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         DRAG & DROP ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   1. DRAG START                                                             │
│   ─────────────                                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  onDragStart(event) {                                                │  │
│   │    • Store original position                                         │  │
│   │    • Add 'dragging' class (visual feedback)                         │  │
│   │    • Create ghost element                                            │  │
│   │    • Disable text selection                                          │  │
│   │  }                                                                   │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   2. DURING DRAG (throttled to 60fps)                                       │
│   ──────────────────────────────────                                         │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  onDragMove(x, y) {                                                  │  │
│   │    • Calculate new time slot from Y position                        │  │
│   │    • Snap to 15-minute increments                                   │  │
│   │    • Update ghost element position                                   │  │
│   │    • Highlight target slot                                          │  │
│   │  }                                                                   │  │
│   │                                                                      │  │
│   │  Y Position → Time Calculation:                                     │  │
│   │  ┌────────────────────────────────────────────┐                     │  │
│   │  │  time = startOfDay + (y / gridHeight) * 24h│                     │  │
│   │  │  snappedTime = roundTo15Min(time)          │                     │  │
│   │  └────────────────────────────────────────────┘                     │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   3. DRAG END                                                               │
│   ───────────                                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  onDragEnd() {                                                       │  │
│   │    • Calculate final position                                        │  │
│   │    • Optimistically update state                                    │  │
│   │    • PATCH /events/:id { start_time, end_time }                     │  │
│   │    • If fails: revert to original position                          │  │
│   │    • Remove ghost, restore selection                                │  │
│   │  }                                                                   │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   4. RESIZE (similar pattern)                                               │
│   ──────────────────────────                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  • Resize handle at bottom of event                                  │  │
│   │  • Only changes end_time (not start_time)                           │  │
│   │  • Minimum duration: 15 minutes                                     │  │
│   │  • Maximum: end of day (unless multi-day)                           │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Real-time Sync Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         REAL-TIME SYNC (WebSocket)                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User A (Editor)              Server                 User B (Viewer)       │
│   ───────────────              ──────                 ─────────────────     │
│         │                         │                         │               │
│   1. Create event                 │                         │               │
│         │                         │                         │               │
│   ──────┼─── POST /events ───────>│                         │               │
│         │                         │                         │               │
│         │                    2. Store event                 │               │
│         │                    3. Publish to channel          │               │
│         │                         │                         │               │
│         │                         │──── WS: event_created ──│──────────────>│
│         │                         │     { event: {...} }    │               │
│         │                         │                         │               │
│         │                         │                   4. Receive event      │
│         │                         │                   5. Add to state       │
│         │                         │                   6. Re-render          │
│         │                         │                         │               │
│                                                                              │
│   Channel Structure:                                                        │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  channel: "calendar:{calendar_id}"                                   │  │
│   │                                                                      │  │
│   │  Events:                                                             │  │
│   │  • event_created    { event: {...}, user_id: "..." }                │  │
│   │  • event_updated    { event: {...}, user_id: "..." }                │  │
│   │  • event_deleted    { event_id: "...", user_id: "..." }             │  │
│   │  • event_moved      { event_id, old_time, new_time }                │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│   Conflict Resolution:                                                      │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │  • Last-write-wins for most updates                                  │  │
│   │  • Version numbers for conflict detection                            │  │
│   │  • If conflict: show dialog "Event was modified by [User]"          │  │
│   │  • Options: Keep mine / Keep theirs / Merge                         │  │
│   └─────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Design & Communication Protocols

### Protocol Selection

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROTOCOL COMPARISON FOR CALENDAR                          │
├─────────────────┬───────────────┬───────────────┬───────────────────────────┤
│    Protocol     │     Pros      │     Cons      │     Use Case              │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Cacheable   │ • Multiple    │ • Initial data fetch      │
│    REST         │ • Simple      │   round trips │ • CRUD operations         │
│                 │ • Stateless   │ • No real-time│ • ✅ PRIMARY for data     │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Single req  │ • Not cache-  │ • Fetch day/week view     │
│   GraphQL       │   for complex │   able at CDN │   with nested data        │
│                 │   queries     │ • Overkill for│ • Mobile apps (bandwidth) │
│                 │               │   simple CRUD │                           │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Bi-direct   │ • Connection  │ • ✅ REAL-TIME updates    │
│   WebSocket     │ • Real-time   │   overhead    │ • Shared calendar sync    │
│                 │ • Low latency │ • Scaling     │ • Collaborative editing   │
│                 │               │   complexity  │                           │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Server push │ • One-way     │ • Notifications only      │
│    SSE          │ • Simple      │   only        │ • Less ideal than WS      │
│                 │ • Auto-recon  │               │   for calendar            │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Efficient   │ • No browser  │ • Service-to-service      │
│    gRPC         │ • Streaming   │   support     │ • Backend sync            │
│                 │ • Type-safe   │               │ • NOT for frontend        │
└─────────────────┴───────────────┴───────────────┴───────────────────────────┘
```

### Why WebSocket for Calendar (Not Long Polling)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 WEBSOCKET vs LONG POLLING FOR CALENDAR                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Scenario: 10 users viewing same shared calendar                            │
│                                                                              │
│  LONG POLLING:                                                              │
│  ─────────────                                                               │
│  Client A ───────> Request ───────> Server (hold 30s)                       │
│  Client B ───────> Request ───────> Server (hold 30s)                       │
│  Client C ───────> Request ───────> Server (hold 30s)                       │
│  ...                                                                         │
│                                                                              │
│  Problem: 10 open connections, each reconnecting every 30s                  │
│           Event happens → 10 separate responses needed                      │
│           30s max delay for updates                                         │
│                                                                              │
│  WEBSOCKET:                                                                 │
│  ──────────                                                                  │
│  Client A <────────────────────────┐                                        │
│  Client B <────────────────────────┼───── Single broadcast                  │
│  Client C <────────────────────────┘      (via Pub/Sub)                     │
│                                                                              │
│  Benefits:                                                                  │
│  • Single persistent connection per client                                  │
│  • Instant updates (< 100ms latency)                                       │
│  • Efficient broadcast via Redis Pub/Sub                                   │
│  • Bi-directional (client can send too)                                    │
│                                                                              │
│  Recommendation: WebSocket for Calendar                                     │
│  ────────────────────────────────────                                        │
│  • Collaborative nature requires real-time                                  │
│  • Bi-directional needed (create, update, delete)                          │
│  • Users expect instant sync                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### REST API Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REST API DESIGN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  EVENTS                                                                     │
│  ──────                                                                      │
│  GET    /api/v1/events                                                      │
│         ?start_date=2024-12-22&end_date=2024-12-22                         │
│         &calendars[]=work&calendars[]=personal                              │
│         &timezone=America/Los_Angeles                                       │
│                                                                              │
│         Response:                                                           │
│         {                                                                    │
│           "events": [                                                       │
│             {                                                                │
│               "id": "evt_123",                                              │
│               "title": "Team Standup",                                      │
│               "start": "2024-12-22T09:00:00Z",                              │
│               "end": "2024-12-22T09:30:00Z",                                │
│               "calendar_id": "cal_work",                                    │
│               "color": "#4285f4",                                           │
│               "recurrence": null,                                           │
│               "all_day": false,                                             │
│               "location": "Zoom",                                           │
│               "attendees": [...]                                            │
│             }                                                                │
│           ],                                                                 │
│           "recurring_events": [...], // Expanded instances                  │
│           "sync_token": "abc123"      // For incremental sync               │
│         }                                                                    │
│                                                                              │
│  POST   /api/v1/events                                                      │
│         Body: { title, start, end, calendar_id, recurrence?, ... }         │
│                                                                              │
│  PATCH  /api/v1/events/:id                                                  │
│         Body: { start?, end?, title?, ... }                                 │
│         Query: ?update_type=this|following|all (for recurring)             │
│                                                                              │
│  DELETE /api/v1/events/:id                                                  │
│         Query: ?delete_type=this|following|all (for recurring)             │
│                                                                              │
│  CALENDARS                                                                  │
│  ─────────                                                                   │
│  GET    /api/v1/calendars                                                   │
│  POST   /api/v1/calendars                                                   │
│  PATCH  /api/v1/calendars/:id                                               │
│  DELETE /api/v1/calendars/:id                                               │
│                                                                              │
│  SHARING                                                                    │
│  ───────                                                                     │
│  POST   /api/v1/calendars/:id/share                                         │
│         Body: { email, permission: "read" | "write" | "admin" }             │
│                                                                              │
│  GET    /api/v1/calendars/:id/permissions                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### WebSocket Events

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        WEBSOCKET EVENT SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Connection:                                                                │
│  ───────────                                                                 │
│  ws://api.calendar.com/realtime?token=JWT&calendars=cal1,cal2,cal3         │
│                                                                              │
│  Client → Server Messages:                                                  │
│  ─────────────────────────                                                   │
│  {                                                                           │
│    "type": "subscribe",                                                     │
│    "calendars": ["cal_123", "cal_456"]                                      │
│  }                                                                           │
│                                                                              │
│  {                                                                           │
│    "type": "unsubscribe",                                                   │
│    "calendars": ["cal_123"]                                                 │
│  }                                                                           │
│                                                                              │
│  {                                                                           │
│    "type": "ping"   // Keep-alive every 30s                                 │
│  }                                                                           │
│                                                                              │
│  Server → Client Messages:                                                  │
│  ─────────────────────────                                                   │
│  {                                                                           │
│    "type": "event_created",                                                 │
│    "calendar_id": "cal_123",                                                │
│    "event": { ... full event object ... },                                  │
│    "actor": { "id": "user_456", "name": "John" }                            │
│  }                                                                           │
│                                                                              │
│  {                                                                           │
│    "type": "event_updated",                                                 │
│    "calendar_id": "cal_123",                                                │
│    "event_id": "evt_789",                                                   │
│    "changes": {                                                             │
│      "start": { "old": "...", "new": "..." },                              │
│      "title": { "old": "...", "new": "..." }                               │
│    },                                                                        │
│    "version": 5,                                                            │
│    "actor": { ... }                                                         │
│  }                                                                           │
│                                                                              │
│  {                                                                           │
│    "type": "event_deleted",                                                 │
│    "calendar_id": "cal_123",                                                │
│    "event_id": "evt_789",                                                   │
│    "actor": { ... }                                                         │
│  }                                                                           │
│                                                                              │
│  {                                                                           │
│    "type": "pong"                                                           │
│  }                                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Database Design

### SQL vs NoSQL Decision

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATABASE CHOICE RATIONALE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     PostgreSQL (Primary)                             │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Calendars (ACID for ownership, sharing)                          │   │
│  │  • Events (ACID for scheduling, consistency)                        │   │
│  │  • Users (authentication, profiles)                                 │   │
│  │  • Sharing permissions                                               │   │
│  │                                                                      │   │
│  │  WHY SQL:                                                            │   │
│  │  • Strong consistency (can't double-book)                           │   │
│  │  • Complex queries (overlapping events)                             │   │
│  │  • Range queries on timestamps                                      │   │
│  │  • Transactions for recurring event operations                      │   │
│  │  • Foreign key relationships                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Redis (Cache + Pub/Sub)                          │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Event cache by date range                                        │   │
│  │  • Real-time pub/sub for WebSocket                                  │   │
│  │  • Session storage                                                   │   │
│  │  • Rate limiting                                                     │   │
│  │  • Distributed locks (for recurring event updates)                  │   │
│  │                                                                      │   │
│  │  Cache Keys:                                                         │   │
│  │  • events:user:{user_id}:date:{date} → [event_ids]                  │   │
│  │  • event:{event_id} → {event_data}                                  │   │
│  │  • calendar:{calendar_id}:permissions → {user_permissions}          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Cassandra (Optional - Analytics)                 │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Event logs (who viewed, edited)                                  │   │
│  │  • Time-series analytics                                            │   │
│  │  • Audit trail                                                       │   │
│  │                                                                      │   │
│  │  WHY Cassandra:                                                      │   │
│  │  • High write throughput                                            │   │
│  │  • Time-based partitioning                                          │   │
│  │  • Horizontal scaling                                               │   │
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
│  users                                                                       │
│  ├── id (UUID, PK)                                                          │
│  ├── email (VARCHAR, UNIQUE)                                                │
│  ├── name (VARCHAR)                                                         │
│  ├── timezone (VARCHAR) -- e.g., "America/New_York"                        │
│  ├── settings (JSONB)                                                       │
│  ├── created_at (TIMESTAMP)                                                 │
│  └── updated_at (TIMESTAMP)                                                 │
│                                                                              │
│  calendars                                                                   │
│  ├── id (UUID, PK)                                                          │
│  ├── owner_id (UUID, FK → users)                                            │
│  ├── name (VARCHAR)                                                         │
│  ├── color (VARCHAR) -- hex code                                            │
│  ├── visibility (ENUM: private, public)                                    │
│  ├── created_at (TIMESTAMP)                                                 │
│  └── updated_at (TIMESTAMP)                                                 │
│                                                                              │
│  calendar_shares                                                            │
│  ├── id (UUID, PK)                                                          │
│  ├── calendar_id (UUID, FK → calendars)                                     │
│  ├── user_id (UUID, FK → users)                                             │
│  ├── permission (ENUM: read, write, admin)                                  │
│  └── created_at (TIMESTAMP)                                                 │
│                                                                              │
│  events                                                                      │
│  ├── id (UUID, PK)                                                          │
│  ├── calendar_id (UUID, FK → calendars)                                     │
│  ├── title (VARCHAR)                                                        │
│  ├── description (TEXT)                                                     │
│  ├── location (VARCHAR)                                                     │
│  ├── start_time (TIMESTAMPTZ)                                               │
│  ├── end_time (TIMESTAMPTZ)                                                 │
│  ├── all_day (BOOLEAN)                                                      │
│  ├── recurrence_rule (VARCHAR) -- RFC 5545 RRULE                           │
│  ├── recurrence_id (UUID, FK → events) -- parent recurring event           │
│  ├── original_start (TIMESTAMPTZ) -- for exceptions                        │
│  ├── status (ENUM: confirmed, tentative, cancelled)                        │
│  ├── version (INT) -- optimistic locking                                   │
│  ├── created_by (UUID, FK → users)                                          │
│  ├── created_at (TIMESTAMP)                                                 │
│  └── updated_at (TIMESTAMP)                                                 │
│                                                                              │
│  Indexes:                                                                    │
│  • (calendar_id, start_time, end_time) -- range queries                    │
│  • (recurrence_id) -- find all instances                                    │
│  • GiST index on tstzrange(start_time, end_time) -- overlap detection      │
│                                                                              │
│  Overlap Detection Query:                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SELECT * FROM events                                                │   │
│  │  WHERE calendar_id = $1                                              │   │
│  │  AND tstzrange(start_time, end_time) &&                             │   │
│  │      tstzrange($2, $3)  -- overlaps operator                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Recurring Events Handling

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      RECURRING EVENTS STRATEGY                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Two Approaches:                                                            │
│                                                                              │
│  1. STORE ALL INSTANCES (Materialized)                                      │
│  ─────────────────────────────────────                                       │
│  • Create row for each occurrence                                           │
│  • Easy queries, but:                                                       │
│    - Huge storage for "every day forever"                                   │
│    - Expensive to update all instances                                      │
│                                                                              │
│  2. STORE RULE + EXPAND (Virtual) ✅ RECOMMENDED                            │
│  ──────────────────────────────────────────────                              │
│  • Store RRULE: "FREQ=WEEKLY;BYDAY=MO,WE,FR"                               │
│  • Expand on read within date range                                         │
│  • Store exceptions separately                                              │
│                                                                              │
│  Implementation:                                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  events (master recurring event)                                     │   │
│  │  ├── id: "evt_master_123"                                            │   │
│  │  ├── title: "Team Standup"                                           │   │
│  │  ├── start_time: "2024-01-01T09:00:00Z"                              │   │
│  │  ├── end_time: "2024-01-01T09:30:00Z"                                │   │
│  │  ├── recurrence_rule: "FREQ=WEEKLY;BYDAY=MO,TU,WE,TH,FR"            │   │
│  │  └── recurrence_id: NULL (this is the master)                       │   │
│  │                                                                      │   │
│  │  events (exception - modified instance)                              │   │
│  │  ├── id: "evt_exception_456"                                         │   │
│  │  ├── title: "Team Standup - Special Topic"                           │   │
│  │  ├── start_time: "2024-01-15T10:00:00Z" (changed time)               │   │
│  │  ├── recurrence_id: "evt_master_123"                                 │   │
│  │  └── original_start: "2024-01-15T09:00:00Z"                          │   │
│  │                                                                      │   │
│  │  events (exception - deleted instance)                               │   │
│  │  ├── id: "evt_exception_789"                                         │   │
│  │  ├── status: "cancelled"                                             │   │
│  │  ├── recurrence_id: "evt_master_123"                                 │   │
│  │  └── original_start: "2024-01-22T09:00:00Z"                          │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Query Flow:                                                                │
│  ───────────                                                                 │
│  1. Fetch master recurring events in date range                             │
│  2. Expand RRULE to get virtual instances                                   │
│  3. Fetch exceptions for those masters                                      │
│  4. Merge: replace virtual with exceptions, remove cancelled               │
│                                                                              │
│  Library: rrule.js (frontend), dateutil (Python), rrule (Ruby)             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Caching Strategy

### Multi-Layer Cache

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CACHING ARCHITECTURE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER 1: In-Memory (React Query)                                           │
│  ─────────────────────────────────                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Cache Key Structure:                                                │   │
│  │  • ['events', { date: '2024-12-22', calendars: [...] }]             │   │
│  │  • ['event', eventId]                                                │   │
│  │  • ['calendars', userId]                                             │   │
│  │                                                                      │   │
│  │  Configuration:                                                      │   │
│  │  • staleTime: 30 seconds (refetch if older)                         │   │
│  │  • cacheTime: 5 minutes (keep in memory)                            │   │
│  │  • refetchOnMount: false (trust cache)                              │   │
│  │  • refetchOnWindowFocus: true (sync on return)                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LAYER 2: Service Worker (Offline)                                          │
│  ─────────────────────────────────                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Strategy: Stale-While-Revalidate                                    │   │
│  │                                                                      │   │
│  │  1. Return cached response immediately                               │   │
│  │  2. Fetch fresh data in background                                   │   │
│  │  3. Update cache for next request                                    │   │
│  │                                                                      │   │
│  │  Cached:                                                             │   │
│  │  • Static assets (JS, CSS, fonts)                                   │   │
│  │  • API responses (with expiry)                                      │   │
│  │  • Event data for offline viewing                                   │   │
│  │                                                                      │   │
│  │  Sync Queue:                                                         │   │
│  │  • Store mutations when offline                                      │   │
│  │  • Replay when online (IndexedDB)                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LAYER 3: Redis (Backend)                                                   │
│  ─────────────────────────                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Cache Keys:                                                         │   │
│  │  • events:calendar:{cal_id}:date:{date} → [event objects]          │   │
│  │    TTL: 60 seconds                                                   │   │
│  │                                                                      │   │
│  │  • calendar:{cal_id}:meta → {calendar metadata}                     │   │
│  │    TTL: 5 minutes                                                    │   │
│  │                                                                      │   │
│  │  • user:{user_id}:calendars → [calendar list]                       │   │
│  │    TTL: 5 minutes                                                    │   │
│  │                                                                      │   │
│  │  Invalidation Strategy:                                              │   │
│  │  • On event CRUD → Invalidate affected date ranges                  │   │
│  │  • Pub/Sub notification to all connected clients                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cache Invalidation Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CACHE INVALIDATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Event Updated                                                             │
│        │                                                                     │
│        ▼                                                                     │
│   ┌─────────────────┐                                                       │
│   │ Update Database │                                                       │
│   └────────┬────────┘                                                       │
│            │                                                                 │
│            ▼                                                                 │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                    Invalidate Redis Cache                            │  │
│   │  DEL events:calendar:{cal_id}:date:{old_date}                       │  │
│   │  DEL events:calendar:{cal_id}:date:{new_date}                       │  │
│   └────────────────────────────┬────────────────────────────────────────┘  │
│                                │                                            │
│                                ▼                                            │
│   ┌─────────────────────────────────────────────────────────────────────┐  │
│   │                 Publish to Redis Pub/Sub                             │  │
│   │  PUBLISH calendar:{cal_id} { type: "event_updated", ... }           │  │
│   └────────────────────────────┬────────────────────────────────────────┘  │
│                                │                                            │
│            ┌───────────────────┼───────────────────┐                       │
│            ▼                   ▼                   ▼                       │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│   │  WS Client A │    │  WS Client B │    │  WS Client C │                │
│   │  (Editor)    │    │  (Viewer)    │    │  (Viewer)    │                │
│   └──────┬───────┘    └──────┬───────┘    └──────┬───────┘                │
│          │                   │                   │                         │
│          ▼                   ▼                   ▼                         │
│   ┌──────────────┐    ┌──────────────┐    ┌──────────────┐                │
│   │ Already has  │    │ Invalidate   │    │ Invalidate   │                │
│   │ new data     │    │ React Query  │    │ React Query  │                │
│   │ (optimistic) │    │ cache        │    │ cache        │                │
│   └──────────────┘    └──────────────┘    └──────────────┘                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. State Management

### State Categories

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       STATE MANAGEMENT STRATEGY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SERVER STATE (React Query)                                         │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Events for date range                                            │   │
│  │  • Calendar list                                                     │   │
│  │  • User preferences                                                  │   │
│  │  • Sharing permissions                                               │   │
│  │                                                                      │   │
│  │  Why: Auto-caching, background refetch, stale handling              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  URL STATE (React Router)                                           │   │
│  │  ────────────────────────                                            │   │
│  │  • Current date: /calendar/2024-12-22                               │   │
│  │  • View type: ?view=day|week|month                                  │   │
│  │  • Selected calendars: ?calendars=work,personal                     │   │
│  │                                                                      │   │
│  │  Why: Shareable URLs, browser navigation, bookmarkable              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  GLOBAL UI STATE (Context / Zustand)                                │   │
│  │  ───────────────────────────────────                                 │   │
│  │  • User timezone                                                     │   │
│  │  • Theme (light/dark)                                               │   │
│  │  • Sidebar collapsed/expanded                                       │   │
│  │  • Calendar visibility toggles                                       │   │
│  │                                                                      │   │
│  │  Why: Accessed by many components, persisted                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  LOCAL UI STATE (useState)                                          │   │
│  │  ─────────────────────────                                           │   │
│  │  • Modal open/closed                                                 │   │
│  │  • Event being dragged (position, ghost element)                    │   │
│  │  • Hover states                                                      │   │
│  │  • Form values (before submit)                                      │   │
│  │                                                                      │   │
│  │  Why: Component-specific, ephemeral                                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  OPTIMISTIC STATE                                                   │   │
│  │  ────────────────────                                                │   │
│  │  • New event before server confirms                                 │   │
│  │  • Dragged event at new position                                    │   │
│  │  • Deleted event (hidden immediately)                               │   │
│  │                                                                      │   │
│  │  Implementation: React Query mutation with optimisticUpdate        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance Optimization

### Event Rendering Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    EVENT RENDERING OPTIMIZATION                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PROBLEM: 50+ events in day view → performance issues                       │
│                                                                              │
│  SOLUTION 1: Virtualization (if scrollable)                                 │
│  ──────────────────────────────────────────                                  │
│  • Only render visible events                                               │
│  • Use Intersection Observer                                                │
│  • Recycle DOM nodes                                                        │
│                                                                              │
│  SOLUTION 2: Efficient Re-renders                                           │
│  ─────────────────────────────────                                           │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  // Memoize event components                                         │   │
│  │  const EventBlock = React.memo(({ event }) => {                      │   │
│  │    // Only re-render if event data changes                          │   │
│  │  }, (prev, next) => prev.event.version === next.event.version);     │   │
│  │                                                                      │   │
│  │  // Memoize expensive calculations                                   │   │
│  │  const sortedEvents = useMemo(() => {                               │   │
│  │    return calculateOverlaps(events);                                │   │
│  │  }, [events]);                                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SOLUTION 3: CSS Containment                                                │
│  ────────────────────────────                                                │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  .event-block {                                                      │   │
│  │    contain: layout style paint;  /* Limit repaint scope */          │   │
│  │    will-change: transform;       /* GPU layer for drag */           │   │
│  │  }                                                                   │   │
│  │                                                                      │   │
│  │  .time-grid {                                                        │   │
│  │    contain: strict;  /* Full containment for grid */                │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  SOLUTION 4: Overlap Calculation Algorithm                                  │
│  ──────────────────────────────────────────                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Time Complexity: O(n log n)                                         │   │
│  │                                                                      │   │
│  │  1. Sort events by start time                                       │   │
│  │  2. Use interval tree or sweep line algorithm                       │   │
│  │  3. Assign columns to overlapping events                            │   │
│  │  4. Cache result until events change                                │   │
│  │                                                                      │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │  9 AM │  Event A (col 1/2)  │  Event B (col 2/2)  │         │    │   │
│  │  │ 10 AM │  Event A            │  Event B            │         │    │   │
│  │  │ 11 AM │                     │  Event B            │ Event C │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Drag & Drop Performance

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DRAG & DROP AT 60 FPS                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Techniques for Smooth Dragging:                                            │
│                                                                              │
│  1. USE TRANSFORM, NOT TOP/LEFT                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  // Bad - triggers layout                                            │   │
│  │  element.style.top = newY + 'px';                                   │   │
│  │                                                                      │   │
│  │  // Good - GPU accelerated                                          │   │
│  │  element.style.transform = `translateY(${newY}px)`;                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  2. THROTTLE MOUSEMOVE                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  // Use requestAnimationFrame                                        │   │
│  │  let rafId = null;                                                   │   │
│  │  onMouseMove = (e) => {                                              │   │
│  │    if (rafId) return;                                                │   │
│  │    rafId = requestAnimationFrame(() => {                            │   │
│  │      updatePosition(e.clientY);                                     │   │
│  │      rafId = null;                                                   │   │
│  │    });                                                               │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  3. LAYER PROMOTION                                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  .dragging {                                                         │   │
│  │    will-change: transform;                                          │   │
│  │    pointer-events: none;  /* Prevent interference */                │   │
│  │    z-index: 1000;                                                   │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  4. GHOST ELEMENT STRATEGY                                                  │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Clone element on drag start                                       │   │
│  │  • Move clone (original stays in place, dimmed)                     │   │
│  │  • Swap on drop                                                      │   │
│  │  • Avoid moving real DOM during drag                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Error Handling & Edge Cases

### Time Zone Handling

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TIME ZONE HANDLING                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  RULE: Store in UTC, Display in User's Timezone                            │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  Database                                                            │   │
│  │  ────────                                                            │   │
│  │  start_time: 2024-12-22T17:00:00Z (UTC)                             │   │
│  │                                                                      │   │
│  │  User in NYC (EST, UTC-5)                                           │   │
│  │  ─────────────────────────                                           │   │
│  │  Display: Dec 22, 12:00 PM                                          │   │
│  │                                                                      │   │
│  │  User in London (GMT, UTC+0)                                        │   │
│  │  ──────────────────────────                                          │   │
│  │  Display: Dec 22, 5:00 PM                                           │   │
│  │                                                                      │   │
│  │  User in Tokyo (JST, UTC+9)                                         │   │
│  │  ──────────────────────────                                          │   │
│  │  Display: Dec 23, 2:00 AM                                           │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Edge Cases:                                                                │
│  ───────────                                                                 │
│  • DST transitions (event at 2:30 AM when clocks jump)                     │
│  • User travels (viewing calendar in different TZ)                         │
│  • Recurring event across DST boundary                                      │
│  • All-day events (should stay on same date in all TZ)                     │
│                                                                              │
│  Solutions:                                                                 │
│  ──────────                                                                  │
│  • Use date-fns-tz or Luxon for TZ-aware operations                        │
│  • Store user's preferred TZ in profile                                    │
│  • All-day events: store as date only, no time component                   │
│  • Show "event created in [TZ]" for cross-TZ calendars                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Edge Cases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDGE CASES                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Overlapping Events (Conflict Visualization)                             │
│     • Calculate overlap groups                                              │
│     • Split width equally among overlapping events                          │
│     • Offset left position to show all events                              │
│                                                                              │
│  2. Multi-day Events in Day View                                            │
│     • Show as all-day event spanning full day                              │
│     • Indicate "continues from yesterday" / "continues tomorrow"           │
│                                                                              │
│  3. Very Long Events (24+ hours)                                            │
│     • Treat as multi-day, show in all-day section                          │
│                                                                              │
│  4. 0-Duration Events                                                       │
│     • Render as minimum height (15 min visual)                             │
│     • Show special icon indicating instant event                           │
│                                                                              │
│  5. Midnight-Crossing Events                                                │
│     • Split display across two days                                        │
│     • Store as single event, render as two visuals                         │
│                                                                              │
│  6. Concurrent Edits (Conflict Resolution)                                  │
│     • Use version numbers (optimistic locking)                             │
│     • Show "Event was modified" dialog                                     │
│     • Options: Keep mine, Keep theirs, View diff                           │
│                                                                              │
│  7. Recurring Event Exceptions                                              │
│     • "Edit this instance" vs "Edit all instances"                         │
│     • "Delete this instance" vs "Delete following" vs "Delete all"         │
│                                                                              │
│  8. Offline Mode                                                            │
│     • Queue mutations in IndexedDB                                          │
│     • Show pending changes with special indicator                          │
│     • Sync and handle conflicts when back online                           │
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
│  Q: Why WebSocket instead of Long Polling for calendar sync?                │
│  A: • Calendar is inherently collaborative                                  │
│     • Bi-directional needed (client sends updates too)                     │
│     • Lower latency for real-time feel                                     │
│     • More efficient for sustained connections                             │
│     • Long polling would create reconnection overhead                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How would you handle recurring events at scale?                         │
│  A: • Store RRULE, expand on read                                          │
│     • Never materialize infinite series                                     │
│     • Pre-expand commonly accessed ranges (next 90 days)                   │
│     • Store exceptions separately, merge at query time                     │
│     • Use rrule.js library for expansion                                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you make drag & drop smooth at 60fps?                           │
│  A: • Use CSS transforms instead of top/left                               │
│     • throttle with requestAnimationFrame                                  │
│     • will-change for GPU layer promotion                                  │
│     • Ghost element pattern to avoid DOM thrashing                         │
│     • Delay React state update until drop                                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you handle overlapping events?                                   │
│  A: • Sort events by start time: O(n log n)                                │
│     • Sweep line algorithm to find overlaps                                │
│     • Assign columns using greedy coloring                                 │
│     • Calculate width = 100% / numOverlapping                              │
│     • Calculate left offset = column * width                               │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: Why PostgreSQL instead of MongoDB for events?                           │
│  A: • Range queries on timestamps are crucial                              │
│     • Need ACID for preventing double-booking                              │
│     • GiST index for efficient overlap detection                           │
│     • Complex joins (events + calendars + permissions)                     │
│     • MongoDB lacks efficient range scans on dates                         │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How would you implement offline support?                                │
│  A: • Service Worker with Cache API for static assets                      │
│     • IndexedDB for event data and pending mutations                       │
│     • Queue creates/updates/deletes while offline                          │
│     • On reconnect: sync queue with server                                 │
│     • Handle conflicts: last-write-wins or prompt user                     │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you handle timezone edge cases?                                  │
│  A: • Always store in UTC                                                  │
│     • Convert to user's TZ only for display                                │
│     • Use date-fns-tz or Luxon for conversions                             │
│     • All-day events: store as date only, not datetime                     │
│     • Recurring: expand in original TZ, then convert                       │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: What metrics would you track?                                           │
│  A: • Render time for day view (< 100ms target)                            │
│     • Drag/resize frame rate (target 60fps)                                │
│     • Time to interactive                                                   │
│     • API latency (p50, p95, p99)                                          │
│     • WebSocket reconnection rate                                          │
│     • Conflict resolution frequency                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Accessibility (A11y)

### Calendar Grid Accessibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ACCESSIBLE TIME GRID                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ARIA Structure:                                                            │
│  ───────────────                                                             │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  <div role="grid" aria-label="Day view for December 22, 2024">     │   │
│  │                                                                      │   │
│  │    <div role="rowgroup" aria-label="All-day events">               │   │
│  │      <div role="row">                                               │   │
│  │        <div role="gridcell" aria-label="All-day: Team Offsite">   │   │
│  │      </div>                                                         │   │
│  │    </div>                                                           │   │
│  │                                                                      │   │
│  │    <div role="rowgroup" aria-label="Hourly schedule">              │   │
│  │      <div role="row" aria-label="9 AM">                            │   │
│  │        <div role="rowheader">9:00 AM</div>                         │   │
│  │        <div role="gridcell" tabindex="0"                           │   │
│  │             aria-label="9 AM, 1 event: Team Standup">              │   │
│  │          <div role="button" aria-label="Team Standup,              │   │
│  │               9 to 9:30 AM, Work calendar">                        │   │
│  │        </div>                                                       │   │
│  │      </div>                                                         │   │
│  │    </div>                                                           │   │
│  │                                                                      │   │
│  │  </div>                                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Live Announcements:                                                        │
│  ───────────────────                                                         │
│  <div aria-live="polite" aria-atomic="true" class="sr-only">              │
│    <!-- "Event created: Team Meeting at 2 PM" -->                          │
│    <!-- "Event moved to 3 PM" -->                                          │
│    <!-- "Event deleted" -->                                                 │
│  </div>                                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Keyboard Navigation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KEYBOARD NAVIGATION MAP                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Global Shortcuts:                                                          │
│  ─────────────────                                                           │
│  T                  → Go to today                                           │
│  J / ←              → Previous day                                          │
│  K / →              → Next day                                              │
│  D                  → Day view                                              │
│  W                  → Week view                                             │
│  M                  → Month view                                            │
│  C                  → Create new event                                      │
│  /                  → Open search                                           │
│  ?                  → Show keyboard shortcuts                               │
│                                                                              │
│  Time Grid Navigation:                                                      │
│  ─────────────────────                                                       │
│  ↑ / ↓              → Move between time slots (30 min)                     │
│  Home               → Go to start of day (12 AM)                           │
│  End                → Go to end of day (11 PM)                             │
│  Page Up            → Jump 3 hours earlier                                 │
│  Page Down          → Jump 3 hours later                                   │
│  Enter              → Create event at focused time                         │
│  Tab                → Move to next event                                   │
│  Shift+Tab          → Move to previous event                               │
│                                                                              │
│  Event Focus:                                                               │
│  ─────────────                                                               │
│  Enter / Space      → Open event details                                   │
│  E                  → Edit event                                            │
│  Delete / Backspace → Delete event (with confirmation)                     │
│  D                  → Duplicate event                                       │
│  Escape             → Close modal / Cancel action                          │
│                                                                              │
│  Drag Mode (with keyboard):                                                 │
│  ─────────────────────────                                                   │
│  Space (on event)   → Enter drag mode                                       │
│  ↑ / ↓              → Move event by 15 minutes                             │
│  Shift + ↑/↓        → Move event by 1 hour                                 │
│  Enter              → Confirm new position                                 │
│  Escape             → Cancel drag                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Accessible Event Component

```jsx
// components/AccessibleEventBlock.jsx
const AccessibleEventBlock = ({
  event,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onDragStart
}) => {
  const eventRef = useRef(null);
  const [isDragMode, setIsDragMode] = useState(false);
  const { announce } = useAriaLive();

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case ' ':
        if (isDragMode) {
          // Confirm drag
          setIsDragMode(false);
          announce(`Event moved to ${formatTime(event.start)}`);
        } else {
          e.preventDefault();
          onSelect(event);
        }
        break;

      case 'e':
        e.preventDefault();
        onEdit(event);
        break;

      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        if (confirm('Delete this event?')) {
          onDelete(event);
          announce('Event deleted');
        }
        break;

      case 'ArrowUp':
      case 'ArrowDown':
        if (isDragMode) {
          e.preventDefault();
          const delta = e.shiftKey ? 60 : 15; // minutes
          const direction = e.key === 'ArrowUp' ? -1 : 1;
          moveEvent(event, delta * direction);
          announce(`Moved to ${formatTime(event.start)}`);
        }
        break;

      case 'Escape':
        if (isDragMode) {
          setIsDragMode(false);
          announce('Drag cancelled');
        }
        break;
    }
  };

  // Format for screen reader
  const ariaLabel = useMemo(() => {
    const timeRange = `${formatTime(event.start)} to ${formatTime(event.end)}`;
    const calendar = event.calendarName;
    const duration = formatDuration(event.end - event.start);
    return `${event.title}, ${timeRange}, ${duration}, ${calendar} calendar`;
  }, [event]);

  return (
    <div
      ref={eventRef}
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      aria-selected={isSelected}
      aria-describedby={`event-${event.id}-details`}
      className={`event-block ${isDragMode ? 'event-block--dragging' : ''}`}
      style={{
        backgroundColor: event.color,
        top: calculateTop(event.start),
        height: calculateHeight(event.start, event.end)
      }}
      onClick={() => onSelect(event)}
      onKeyDown={handleKeyDown}
      onMouseDown={(e) => {
        if (e.button === 0) onDragStart(event, e);
      }}
    >
      <div className="event-block__title">{event.title}</div>
      <div className="event-block__time">
        {formatTimeRange(event.start, event.end)}
      </div>

      {/* Hidden details for screen readers */}
      <div id={`event-${event.id}-details`} className="sr-only">
        {event.location && `Location: ${event.location}.`}
        {event.description && `Description: ${event.description}.`}
        Press E to edit, Delete to remove.
      </div>
    </div>
  );
};

// ARIA Live region hook
const useAriaLive = () => {
  const announce = useCallback((message) => {
    const liveRegion = document.getElementById('aria-live-region');
    if (liveRegion) {
      liveRegion.textContent = message;
      // Clear after announcement
      setTimeout(() => {
        liveRegion.textContent = '';
      }, 1000);
    }
  }, []);

  return { announce };
};
```

### Color Accessibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLOR ACCESSIBILITY                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Calendar Colors (WCAG AA Compliant):                                       │
│  ─────────────────────────────────────                                       │
│                                                                              │
│  ❌ Problem: Low contrast colored events                                    │
│     • Light blue text on light blue background                              │
│     • Users can't distinguish calendars                                     │
│                                                                              │
│  ✅ Solution: High contrast color palette                                   │
│                                                                              │
│  const CALENDAR_COLORS = [                                                  │
│    { bg: '#E3F2FD', text: '#1565C0', border: '#1976D2' }, // Blue          │
│    { bg: '#FCE4EC', text: '#C2185B', border: '#D81B60' }, // Pink          │
│    { bg: '#E8F5E9', text: '#2E7D32', border: '#388E3C' }, // Green         │
│    { bg: '#FFF3E0', text: '#E65100', border: '#F57C00' }, // Orange        │
│    { bg: '#F3E5F5', text: '#7B1FA2', border: '#8E24AA' }, // Purple        │
│  ];                                                                          │
│                                                                              │
│  Additional Indicators (not color-only):                                    │
│  ─────────────────────────────────────────                                   │
│  • Calendar icon/initial in event block                                     │
│  • Pattern fills for colorblind mode                                        │
│  • Border style varies by calendar                                          │
│                                                                              │
│  .event-block[data-calendar="work"] {                                       │
│    border-left: 4px solid var(--calendar-color);                           │
│  }                                                                          │
│  .event-block[data-calendar="personal"] {                                   │
│    border-left: 4px dashed var(--calendar-color);                          │
│  }                                                                          │
│                                                                              │
│  Reduced Motion:                                                            │
│  ───────────────                                                             │
│  @media (prefers-reduced-motion: reduce) {                                 │
│    .event-block { transition: none; }                                      │
│    .drag-ghost { animation: none; }                                        │
│    .current-time-indicator { animation: none; }                            │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Mobile & Touch Considerations

### Touch Drag & Drop

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TOUCH-BASED EVENT MANIPULATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Touch Gesture Recognition:                                                 │
│  ─────────────────────────                                                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   TAP (< 300ms)           → Open event details                      │   │
│  │   👆                                                                 │   │
│  │                                                                      │   │
│  │   LONG PRESS (500ms)      → Enter drag mode                         │   │
│  │   👆━━━━━                   (haptic feedback)                       │   │
│  │                                                                      │   │
│  │   DRAG (after long press) → Move event                              │   │
│  │   👆 ──────────→                                                     │   │
│  │                                                                      │   │
│  │   TAP ON EMPTY SLOT       → Quick create event                      │   │
│  │   👆 (on time grid)                                                 │   │
│  │                                                                      │   │
│  │   SWIPE LEFT/RIGHT        → Previous/Next day                       │   │
│  │   👆 ════════════→         (on header area)                         │   │
│  │                                                                      │   │
│  │   PINCH                   → Zoom time grid (change scale)           │   │
│  │   👆     👆                 (15min → 30min → 1hr slots)             │   │
│  │    ╲   ╱                                                             │   │
│  │     ╲ ╱                                                              │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Touch Target Sizes:                                                        │
│  ───────────────────                                                         │
│  • Event blocks: Minimum 44x44px touch target                              │
│  • Time slots: 48px height (easy to tap)                                   │
│  • Resize handles: 44px hit area (larger than visual)                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Touch Drag Implementation

```jsx
// hooks/useTouchDrag.js
const useTouchDrag = ({ onDragStart, onDragMove, onDragEnd }) => {
  const [isDragging, setIsDragging] = useState(false);
  const longPressTimer = useRef(null);
  const startPosition = useRef({ x: 0, y: 0 });
  const currentPosition = useRef({ x: 0, y: 0 });

  const LONG_PRESS_DURATION = 500;
  const MOVE_THRESHOLD = 10;

  const handleTouchStart = useCallback((e, event) => {
    const touch = e.touches[0];
    startPosition.current = { x: touch.clientX, y: touch.clientY };

    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }

      setIsDragging(true);
      onDragStart(event, {
        x: touch.clientX,
        y: touch.clientY
      });
    }, LONG_PRESS_DURATION);
  }, [onDragStart]);

  const handleTouchMove = useCallback((e) => {
    const touch = e.touches[0];
    currentPosition.current = { x: touch.clientX, y: touch.clientY };

    // Cancel long press if moved too much
    if (!isDragging && longPressTimer.current) {
      const dx = Math.abs(touch.clientX - startPosition.current.x);
      const dy = Math.abs(touch.clientY - startPosition.current.y);

      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }
    }

    // Handle drag move
    if (isDragging) {
      e.preventDefault(); // Prevent scroll
      onDragMove({
        x: touch.clientX,
        y: touch.clientY,
        deltaY: touch.clientY - startPosition.current.y
      });
    }
  }, [isDragging, onDragMove]);

  const handleTouchEnd = useCallback(() => {
    clearTimeout(longPressTimer.current);
    longPressTimer.current = null;

    if (isDragging) {
      setIsDragging(false);
      onDragEnd(currentPosition.current);
    }
  }, [isDragging, onDragEnd]);

  return {
    isDragging,
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      onTouchCancel: handleTouchEnd
    }
  };
};
```

### Responsive Day View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RESPONSIVE LAYOUT                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Desktop (> 1024px):                                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ┌─────────┐ ┌─────────────────────────────────────────────────┐   │   │
│  │  │ Sidebar │ │              Day View                            │   │   │
│  │  │         │ │                                                   │   │   │
│  │  │ Mini    │ │  All-day events                                  │   │   │
│  │  │ Calendar│ │  ─────────────────────────────────               │   │   │
│  │  │         │ │  Time grid with events                          │   │   │
│  │  │ Calendar│ │                                                   │   │   │
│  │  │ List    │ │                                                   │   │   │
│  │  │         │ │                                                   │   │   │
│  │  └─────────┘ └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Tablet (768px - 1024px):                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  [☰] December 22, 2024            [<] [Today] [>] [Day ▼]   │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  │  ┌──────────────────────────────────────────────────────────────┐  │   │
│  │  │  Day View (sidebar hidden, accessible via hamburger)         │  │   │
│  │  │                                                               │  │   │
│  │  └──────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Mobile (< 768px):                                                          │
│  ┌───────────────────────────┐                                              │
│  │  [☰] Dec 22      [+]     │  ← Compact header                            │
│  ├───────────────────────────┤                                              │
│  │  All-day: Team Offsite   │  ← Swipe for more                            │
│  ├───────────────────────────┤                                              │
│  │  9:00  ┌────────────┐    │                                              │
│  │        │ Standup    │    │  ← Full-width events                         │
│  │  10:00 └────────────┘    │                                              │
│  │        ┌────────────┐    │                                              │
│  │  11:00 │ 1:1 w/ Bob │    │                                              │
│  │        └────────────┘    │                                              │
│  │  12:00                   │                                              │
│  └───────────────────────────┘                                              │
│                                                                              │
│  CSS Breakpoints:                                                           │
│  ────────────────                                                            │
│  --mobile: 320px - 767px                                                    │
│  --tablet: 768px - 1023px                                                   │
│  --desktop: 1024px+                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Time Grid Zoom (Pinch)

```jsx
// hooks/usePinchZoom.js
const usePinchZoom = (initialScale = 1) => {
  const [scale, setScale] = useState(initialScale);
  const [slotHeight, setSlotHeight] = useState(48); // 48px = 30min slot

  const SLOT_HEIGHTS = [24, 48, 96]; // 15min, 30min, 1hr views
  const scaleIndex = useRef(1);

  useEffect(() => {
    let initialDistance = 0;

    const handleTouchStart = (e) => {
      if (e.touches.length === 2) {
        initialDistance = getDistance(e.touches[0], e.touches[1]);
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();
        const currentDistance = getDistance(e.touches[0], e.touches[1]);
        const delta = currentDistance - initialDistance;

        if (Math.abs(delta) > 50) {
          if (delta > 0 && scaleIndex.current < SLOT_HEIGHTS.length - 1) {
            // Zoom in
            scaleIndex.current++;
            setSlotHeight(SLOT_HEIGHTS[scaleIndex.current]);
            initialDistance = currentDistance;
          } else if (delta < 0 && scaleIndex.current > 0) {
            // Zoom out
            scaleIndex.current--;
            setSlotHeight(SLOT_HEIGHTS[scaleIndex.current]);
            initialDistance = currentDistance;
          }
        }
      }
    };

    const element = document.getElementById('time-grid');
    element?.addEventListener('touchstart', handleTouchStart);
    element?.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      element?.removeEventListener('touchstart', handleTouchStart);
      element?.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return { slotHeight };
};

const getDistance = (touch1, touch2) => {
  const dx = touch1.clientX - touch2.clientX;
  const dy = touch1.clientY - touch2.clientY;
  return Math.sqrt(dx * dx + dy * dy);
};
```

---

## 14. Comprehensive Testing Strategy

### Testing Pyramid

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TESTING PYRAMID                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                            ╱╲                                                │
│                           ╱  ╲                                               │
│                          ╱ E2E╲         5-10 tests                          │
│                         ╱──────╲        (Drag/drop, create event)           │
│                        ╱        ╲                                            │
│                       ╱Integration╲     50-100 tests                        │
│                      ╱────────────╲     (API, recurring events)             │
│                     ╱              ╲                                         │
│                    ╱   Unit Tests   ╲   500+ tests                          │
│                   ╱──────────────────╲  (Time calc, overlap)                │
│                  ╱                    ╲                                      │
│                 ╱────────────────────────╲                                  │
│                                                                              │
│  Key Test Areas:                                                            │
│  ───────────────                                                             │
│  • Time/date calculations                                                   │
│  • Recurring event expansion                                                │
│  • Overlap algorithm                                                        │
│  • Timezone conversions                                                     │
│  • Drag & drop interactions                                                 │
│  • Keyboard navigation                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Unit Tests

```jsx
// __tests__/utils/timeCalculations.test.js
describe('Time Calculations', () => {
  describe('calculateEventPosition', () => {
    it('calculates correct top position for 9 AM event', () => {
      const event = {
        start: new Date('2024-12-22T09:00:00'),
        end: new Date('2024-12-22T10:00:00')
      };
      const gridConfig = { startHour: 0, slotHeight: 48 }; // 48px per 30min

      const position = calculateEventPosition(event, gridConfig);

      expect(position.top).toBe(9 * 2 * 48); // 9 hours * 2 slots/hour * 48px
      expect(position.height).toBe(2 * 48); // 1 hour = 2 slots
    });

    it('handles events crossing midnight', () => {
      const event = {
        start: new Date('2024-12-22T23:00:00'),
        end: new Date('2024-12-23T01:00:00')
      };

      const position = calculateEventPosition(event, { forDate: '2024-12-22' });

      // Should only show portion within the day
      expect(position.height).toBe(2 * 48); // 11 PM to midnight
    });
  });

  describe('snapToInterval', () => {
    it('snaps to 15-minute intervals', () => {
      expect(snapToInterval(new Date('2024-12-22T09:07:00'), 15))
        .toEqual(new Date('2024-12-22T09:00:00'));

      expect(snapToInterval(new Date('2024-12-22T09:08:00'), 15))
        .toEqual(new Date('2024-12-22T09:15:00'));
    });
  });
});

// __tests__/utils/overlap.test.js
describe('Overlap Algorithm', () => {
  it('calculates columns for non-overlapping events', () => {
    const events = [
      { id: '1', start: '09:00', end: '10:00' },
      { id: '2', start: '10:00', end: '11:00' },
      { id: '3', start: '11:00', end: '12:00' }
    ];

    const layout = calculateOverlapLayout(events);

    // Each event gets full width
    expect(layout['1']).toEqual({ column: 0, totalColumns: 1 });
    expect(layout['2']).toEqual({ column: 0, totalColumns: 1 });
    expect(layout['3']).toEqual({ column: 0, totalColumns: 1 });
  });

  it('splits width for overlapping events', () => {
    const events = [
      { id: '1', start: '09:00', end: '11:00' },
      { id: '2', start: '10:00', end: '12:00' }
    ];

    const layout = calculateOverlapLayout(events);

    expect(layout['1']).toEqual({ column: 0, totalColumns: 2 });
    expect(layout['2']).toEqual({ column: 1, totalColumns: 2 });
  });

  it('handles three overlapping events', () => {
    const events = [
      { id: '1', start: '09:00', end: '12:00' },
      { id: '2', start: '10:00', end: '11:00' },
      { id: '3', start: '10:30', end: '11:30' }
    ];

    const layout = calculateOverlapLayout(events);

    expect(layout['1'].totalColumns).toBe(3);
    expect(layout['2'].totalColumns).toBe(3);
    expect(layout['3'].totalColumns).toBe(3);
  });
});

// __tests__/utils/recurring.test.js
describe('Recurring Events', () => {
  it('expands daily recurrence within range', () => {
    const event = {
      id: 'master-1',
      title: 'Daily Standup',
      start: '2024-01-01T09:00:00Z',
      end: '2024-01-01T09:30:00Z',
      rrule: 'FREQ=DAILY'
    };

    const instances = expandRecurring(event, {
      start: '2024-01-01',
      end: '2024-01-07'
    });

    expect(instances).toHaveLength(7);
    expect(instances[0].start).toBe('2024-01-01T09:00:00Z');
    expect(instances[6].start).toBe('2024-01-07T09:00:00Z');
  });

  it('skips exceptions', () => {
    const event = {
      id: 'master-1',
      rrule: 'FREQ=DAILY',
      exceptions: [
        { originalStart: '2024-01-03T09:00:00Z', status: 'cancelled' }
      ]
    };

    const instances = expandRecurring(event, {
      start: '2024-01-01',
      end: '2024-01-05'
    });

    expect(instances).toHaveLength(4); // Jan 3 is skipped
  });
});
```

### Integration Tests

```jsx
// __tests__/integration/eventCRUD.test.js
import { renderHook, act, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { useEvents, useCreateEvent } from '../hooks/useEvents';

const server = setupServer(
  rest.get('/api/events', (req, res, ctx) => {
    return res(ctx.json({
      events: [
        {
          id: 'evt-1',
          title: 'Team Meeting',
          start: '2024-12-22T10:00:00Z',
          end: '2024-12-22T11:00:00Z'
        }
      ]
    }));
  }),

  rest.post('/api/events', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.json({
      id: 'evt-new',
      ...body
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Event CRUD Operations', () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } }
  });

  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );

  it('fetches events for a date', async () => {
    const { result } = renderHook(
      () => useEvents({ date: '2024-12-22' }),
      { wrapper }
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data.events).toHaveLength(1);
    expect(result.current.data.events[0].title).toBe('Team Meeting');
  });

  it('creates event with optimistic update', async () => {
    const { result: eventsResult } = renderHook(
      () => useEvents({ date: '2024-12-22' }),
      { wrapper }
    );

    const { result: createResult } = renderHook(
      () => useCreateEvent(),
      { wrapper }
    );

    await waitFor(() => eventsResult.current.isSuccess);

    act(() => {
      createResult.current.mutate({
        title: 'New Event',
        start: '2024-12-22T14:00:00Z',
        end: '2024-12-22T15:00:00Z'
      });
    });

    // Optimistic update should show immediately
    await waitFor(() => {
      expect(eventsResult.current.data.events).toHaveLength(2);
    });
  });
});
```

### E2E Tests

```jsx
// e2e/calendar.spec.ts (Playwright)
import { test, expect } from '@playwright/test';

test.describe('Calendar Day View', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar/2024-12-22');
  });

  test('creates event by clicking on time slot', async ({ page }) => {
    // Click on 10 AM slot
    await page.click('[data-time="10:00"]');

    // Modal should open
    await expect(page.locator('[data-testid="event-modal"]')).toBeVisible();

    // Fill in details
    await page.fill('[name="title"]', 'E2E Test Event');
    await page.click('button[type="submit"]');

    // Event should appear in grid
    await expect(page.locator('.event-block:has-text("E2E Test Event")'))
      .toBeVisible();
  });

  test('drags event to new time', async ({ page }) => {
    // Create an event first
    await page.evaluate(() => {
      window.__TEST_EVENTS__ = [{
        id: 'test-1',
        title: 'Drag Me',
        start: '2024-12-22T09:00:00Z',
        end: '2024-12-22T10:00:00Z'
      }];
    });

    await page.reload();

    // Get event and target positions
    const event = page.locator('.event-block:has-text("Drag Me")');
    const targetSlot = page.locator('[data-time="14:00"]');

    // Drag and drop
    await event.dragTo(targetSlot);

    // Verify new position
    await expect(event).toHaveCSS('top', /^(?!0px)/); // Changed from original

    // Verify API call
    const request = await page.waitForRequest(
      req => req.method() === 'PATCH' && req.url().includes('/events/')
    );
    const body = request.postDataJSON();
    expect(body.start).toContain('14:00');
  });

  test('keyboard navigation works', async ({ page }) => {
    // Focus time grid
    await page.keyboard.press('Tab');

    // Navigate down
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('ArrowDown');

    // Create event with Enter
    await page.keyboard.press('Enter');

    await expect(page.locator('[data-testid="event-modal"]')).toBeVisible();
  });

  test('handles timezone display correctly', async ({ page }) => {
    // Set timezone preference
    await page.evaluate(() => {
      localStorage.setItem('timezone', 'America/New_York');
    });

    await page.reload();

    // Event at 15:00 UTC should show as 10:00 AM EST
    await expect(page.locator('.event-block:has-text("10:00 AM")'))
      .toBeVisible();
  });
});
```

---

## 15. Offline Support & PWA

### Service Worker Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OFFLINE CALENDAR ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Caching Strategies:                                                        │
│  ───────────────────                                                         │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ASSET TYPE          │  STRATEGY              │  CACHE              │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  App Shell           │  Cache First           │  app-shell-v2       │   │
│  │  (HTML, JS, CSS)     │  (pre-cached)          │                     │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Events Data         │  Network First         │  events-cache       │   │
│  │  (API responses)     │  (fallback to cache)   │  TTL: 1 hour        │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Calendar Settings   │  Stale While           │  settings-cache     │   │
│  │  (user prefs)        │  Revalidate            │  TTL: 24 hours      │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Static Images       │  Cache First           │  image-cache        │   │
│  │  (avatars, icons)    │                        │  TTL: 7 days        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Offline Capabilities:                                                      │
│  ─────────────────────                                                       │
│  • View cached events for past 30 days, future 90 days                     │
│  • Create new events (queued for sync)                                     │
│  • Edit existing events (queued for sync)                                  │
│  • Delete events (queued for sync)                                         │
│  • Full UI functionality                                                    │
│                                                                              │
│  Sync Strategy:                                                             │
│  ──────────────                                                              │
│  • Queue mutations in IndexedDB                                            │
│  • Use Background Sync API when available                                  │
│  • Fall back to sync on page load                                          │
│  • Handle conflicts (last-write-wins or prompt)                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### IndexedDB Schema

```javascript
// db/CalendarDatabase.js
import Dexie from 'dexie';

class CalendarDatabase extends Dexie {
  constructor() {
    super('CalendarApp');

    this.version(1).stores({
      // Events table
      events: `
        id,
        calendarId,
        startDate,
        [calendarId+startDate],
        updatedAt,
        syncStatus
      `,

      // Calendars table
      calendars: `
        id,
        ownerId
      `,

      // Pending changes (sync queue)
      pendingChanges: `
        ++id,
        type,
        entityType,
        entityId,
        data,
        createdAt
      `,

      // Sync metadata
      syncState: `
        key
      `
    });
  }

  // Store events for a date range
  async cacheEvents(events, dateRange) {
    await this.transaction('rw', this.events, async () => {
      for (const event of events) {
        await this.events.put({
          ...event,
          syncStatus: 'synced',
          startDate: event.start.split('T')[0]
        });
      }
    });

    // Store sync timestamp
    await this.syncState.put({
      key: `events:${dateRange.start}:${dateRange.end}`,
      timestamp: Date.now()
    });
  }

  // Get events for date
  async getEventsForDate(date, calendarIds) {
    return this.events
      .where('[calendarId+startDate]')
      .anyOf(calendarIds.map(id => [id, date]))
      .toArray();
  }

  // Queue a change for sync
  async queueChange(type, entityType, entityId, data) {
    await this.pendingChanges.add({
      type, // 'create', 'update', 'delete'
      entityType, // 'event', 'calendar'
      entityId,
      data,
      createdAt: Date.now()
    });
  }

  // Get all pending changes
  async getPendingChanges() {
    return this.pendingChanges.orderBy('createdAt').toArray();
  }

  // Clear a pending change after sync
  async clearPendingChange(id) {
    await this.pendingChanges.delete(id);
  }
}

export const db = new CalendarDatabase();
```

### Background Sync

```javascript
// service-worker.js
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { registerRoute } from 'workbox-routing';
import { NetworkOnly, NetworkFirst } from 'workbox-strategies';

// Background sync for event mutations
const eventSyncQueue = new BackgroundSyncPlugin('event-sync-queue', {
  maxRetentionTime: 24 * 60 // 24 hours
});

// POST/PATCH/DELETE events go through background sync
registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/events') &&
    ['POST', 'PATCH', 'DELETE'].includes(request.method),
  new NetworkOnly({
    plugins: [eventSyncQueue]
  }),
  'POST'
);

// Sync pending changes when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-calendar-changes') {
    event.waitUntil(syncPendingChanges());
  }
});

async function syncPendingChanges() {
  const db = await openDatabase();
  const pendingChanges = await db.getAll('pendingChanges');

  for (const change of pendingChanges) {
    try {
      await syncChange(change);
      await db.delete('pendingChanges', change.id);
    } catch (error) {
      if (error.status === 409) {
        // Conflict - notify user
        await notifyConflict(change);
      }
      // Other errors will be retried
      throw error;
    }
  }
}
```

---

## 16. Internationalization (i18n)

### Date/Time Localization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    DATE/TIME INTERNATIONALIZATION                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Week Start Day:                                                            │
│  ───────────────                                                             │
│  • Sunday start: US, Canada, Japan, Brazil                                 │
│  • Monday start: Most of Europe, Australia, China                          │
│  • Saturday start: Some Middle Eastern countries                           │
│                                                                              │
│  Time Format:                                                               │
│  ────────────                                                                │
│  • 12-hour: US, Canada, Australia, Philippines                             │
│  • 24-hour: Most of Europe, Asia, Latin America                            │
│                                                                              │
│  Date Format:                                                               │
│  ────────────                                                                │
│  • MM/DD/YYYY: US                                                           │
│  • DD/MM/YYYY: UK, Europe, Australia                                       │
│  • YYYY-MM-DD: ISO, China, Japan, Korea                                    │
│                                                                              │
│  Implementation:                                                            │
│  ───────────────                                                             │
│  const formatters = {                                                       │
│    time: new Intl.DateTimeFormat(locale, {                                 │
│      hour: 'numeric',                                                       │
│      minute: '2-digit',                                                     │
│      hour12: locale.startsWith('en-US')                                    │
│    }),                                                                       │
│                                                                              │
│    date: new Intl.DateTimeFormat(locale, {                                 │
│      weekday: 'long',                                                       │
│      month: 'long',                                                         │
│      day: 'numeric',                                                        │
│      year: 'numeric'                                                        │
│    }),                                                                       │
│                                                                              │
│    weekday: new Intl.DateTimeFormat(locale, { weekday: 'short' })          │
│  };                                                                          │
│                                                                              │
│  // Get week start day for locale                                          │
│  const getWeekStartDay = (locale) => {                                     │
│    const weekInfo = new Intl.Locale(locale).weekInfo;                      │
│    return weekInfo?.firstDay ?? 0; // 0 = Sunday, 1 = Monday              │
│  };                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### RTL Layout Support

```jsx
// components/DayView.jsx with RTL support
const DayView = () => {
  const { locale, direction } = useLocale();

  return (
    <div
      className="day-view"
      dir={direction} // 'ltr' or 'rtl'
      style={{
        // CSS logical properties handle RTL automatically
        paddingInlineStart: '60px', // Time column width
      }}
    >
      <TimeColumn />
      <EventsGrid />
    </div>
  );
};

// CSS with logical properties
const styles = `
  .day-view {
    display: flex;
  }

  .time-column {
    /* Instead of 'left', use 'inset-inline-start' */
    position: sticky;
    inset-inline-start: 0;

    /* Instead of 'text-align: right', use 'text-align: end' */
    text-align: end;

    /* Instead of 'padding-right', use 'padding-inline-end' */
    padding-inline-end: 8px;
  }

  .event-block {
    /* Instead of 'margin-left', use 'margin-inline-start' */
    margin-inline-start: 4px;

    /* Border on the start side (left in LTR, right in RTL) */
    border-inline-start: 4px solid var(--calendar-color);
  }

  /* Navigation arrows flip in RTL */
  .nav-prev {
    /* Arrow pointing to inline-start */
    transform: scaleX(var(--rtl-flip, 1));
  }

  [dir="rtl"] {
    --rtl-flip: -1;
  }
`;
```

### i18n Setup

```jsx
// i18n/config.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    calendar: {
      today: 'Today',
      day: 'Day',
      week: 'Week',
      month: 'Month',
      createEvent: 'Create event',
      allDay: 'All day',
      noTitle: '(No title)',
      moreEvents: '{{count}} more',
      recurring: {
        daily: 'Daily',
        weekly: 'Weekly on {{day}}',
        monthly: 'Monthly on the {{ordinal}}',
        yearly: 'Annually on {{date}}'
      }
    }
  },
  es: {
    calendar: {
      today: 'Hoy',
      day: 'Día',
      week: 'Semana',
      month: 'Mes',
      createEvent: 'Crear evento',
      allDay: 'Todo el día',
      noTitle: '(Sin título)',
      moreEvents: '{{count}} más'
    }
  },
  ar: {
    calendar: {
      today: 'اليوم',
      day: 'يوم',
      week: 'أسبوع',
      month: 'شهر',
      createEvent: 'إنشاء حدث',
      allDay: 'طوال اليوم',
      noTitle: '(بدون عنوان)',
      moreEvents: '{{count}} المزيد'
    }
  },
  ja: {
    calendar: {
      today: '今日',
      day: '日',
      week: '週',
      month: '月',
      createEvent: '予定を作成',
      allDay: '終日',
      noTitle: '(タイトルなし)',
      moreEvents: '他 {{count}} 件'
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: navigator.language,
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

// Set direction based on language
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = rtlLanguages.includes(lng) ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});
```

---

## 17. Security Deep Dive

### OAuth & Token Management

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    OAUTH FLOW FOR CALENDAR                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User              Calendar App          Auth Server         Calendar API  │
│     │                    │                     │                    │       │
│     │ 1. Click "Sign in  │                     │                    │       │
│     │    with Google"    │                     │                    │       │
│     │───────────────────>│                     │                    │       │
│     │                    │                     │                    │       │
│     │                    │ 2. Redirect to      │                    │       │
│     │                    │    OAuth provider   │                    │       │
│     │<───────────────────│────────────────────>│                    │       │
│     │                    │                     │                    │       │
│     │ 3. Enter           │                     │                    │       │
│     │    credentials     │                     │                    │       │
│     │────────────────────────────────────────>│                    │       │
│     │                    │                     │                    │       │
│     │ 4. Consent to      │                     │                    │       │
│     │    calendar access │                     │                    │       │
│     │────────────────────────────────────────>│                    │       │
│     │                    │                     │                    │       │
│     │                    │ 5. Auth code        │                    │       │
│     │<───────────────────│<────────────────────│                    │       │
│     │                    │                     │                    │       │
│     │                    │ 6. Exchange code    │                    │       │
│     │                    │    for tokens       │                    │       │
│     │                    │───────────────────>│                    │       │
│     │                    │                     │                    │       │
│     │                    │ 7. Access + Refresh │                    │       │
│     │                    │    tokens           │                    │       │
│     │                    │<───────────────────│                    │       │
│     │                    │                     │                    │       │
│     │                    │ 8. API request      │                    │       │
│     │                    │    with access token│                    │       │
│     │                    │────────────────────────────────────────>│       │
│     │                    │                     │                    │       │
│                                                                              │
│  Token Storage:                                                             │
│  ──────────────                                                              │
│  • Access token: In-memory only (never localStorage)                       │
│  • Refresh token: httpOnly cookie (set by backend)                         │
│  • Token expiry: Track and refresh proactively                             │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Calendar Sharing Security

```jsx
// Sharing Permission Model
const PERMISSIONS = {
  NONE: 'none',         // No access
  FREE_BUSY: 'freeBusy', // Only see free/busy, not details
  READ: 'read',          // View event details
  WRITE: 'write',        // Edit events
  ADMIN: 'admin'         // Full control, can share
};

// Permission check middleware (backend)
const checkCalendarPermission = (requiredPermission) => {
  return async (req, res, next) => {
    const { calendarId } = req.params;
    const userId = req.user.id;

    const permission = await getCalendarPermission(calendarId, userId);

    const permissionLevel = {
      [PERMISSIONS.NONE]: 0,
      [PERMISSIONS.FREE_BUSY]: 1,
      [PERMISSIONS.READ]: 2,
      [PERMISSIONS.WRITE]: 3,
      [PERMISSIONS.ADMIN]: 4
    };

    if (permissionLevel[permission] < permissionLevel[requiredPermission]) {
      return res.status(403).json({
        error: 'Insufficient permissions',
        required: requiredPermission,
        current: permission
      });
    }

    req.calendarPermission = permission;
    next();
  };
};

// Free/busy view (hide event details)
const getFreeBusyView = (events) => {
  return events.map(event => ({
    start: event.start,
    end: event.end,
    status: 'busy' // Hide title, location, etc.
  }));
};
```

### XSS Prevention

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    XSS PREVENTION IN CALENDAR                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  User Input Fields:                                                         │
│  ──────────────────                                                          │
│  • Event title                                                              │
│  • Event description (may contain links, formatting)                       │
│  • Location                                                                  │
│  • Attendee names                                                           │
│                                                                              │
│  Defense Strategy:                                                          │
│  ─────────────────                                                           │
│                                                                              │
│  1. React Default Escaping                                                  │
│     // ✅ Safe - React escapes automatically                               │
│     <div className="event-title">{event.title}</div>                       │
│                                                                              │
│     // ❌ NEVER do this                                                     │
│     <div dangerouslySetInnerHTML={{ __html: event.description }} />        │
│                                                                              │
│  2. Sanitize Rich Text (if needed)                                         │
│     import DOMPurify from 'dompurify';                                     │
│                                                                              │
│     const sanitizeDescription = (html) => {                                │
│       return DOMPurify.sanitize(html, {                                    │
│         ALLOWED_TAGS: ['b', 'i', 'a', 'br', 'p'],                         │
│         ALLOWED_ATTR: ['href', 'target'],                                  │
│         ALLOW_DATA_ATTR: false                                             │
│       });                                                                   │
│     };                                                                      │
│                                                                              │
│  3. URL Validation (for location links)                                    │
│     const isValidUrl = (url) => {                                          │
│       try {                                                                 │
│         const parsed = new URL(url);                                       │
│         return ['http:', 'https:'].includes(parsed.protocol);             │
│       } catch {                                                             │
│         return false;                                                       │
│       }                                                                     │
│     };                                                                      │
│                                                                              │
│  4. Content Security Policy                                                │
│     Content-Security-Policy:                                                │
│       default-src 'self';                                                   │
│       script-src 'self';                                                    │
│       style-src 'self' 'unsafe-inline';                                    │
│       img-src 'self' https://lh3.googleusercontent.com;                    │
│       connect-src 'self' wss://calendar.app;                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 18. Analytics & Observability

### Frontend Metrics

```jsx
// analytics/CalendarAnalytics.js
class CalendarAnalytics {
  constructor() {
    this.sessionId = crypto.randomUUID();
  }

  // Track view changes
  trackViewChange(view, date) {
    this.track('view_changed', {
      view, // 'day', 'week', 'month'
      date,
      source: this.getNavigationSource()
    });
  }

  // Track event interactions
  trackEventCreated(event, method) {
    this.track('event_created', {
      method, // 'click', 'drag', 'keyboard', 'quick_add'
      hasRecurrence: !!event.rrule,
      duration: (event.end - event.start) / 60000, // minutes
      calendarType: event.calendarId
    });
  }

  trackEventMoved(event, method) {
    this.track('event_moved', {
      method, // 'drag', 'keyboard', 'modal'
      timeDelta: event.newStart - event.oldStart
    });
  }

  trackEventResized(event) {
    this.track('event_resized', {
      oldDuration: event.oldDuration,
      newDuration: event.newDuration
    });
  }

  // Track performance
  trackRenderTime(view, eventCount, duration) {
    this.track('render_performance', {
      view,
      eventCount,
      duration,
      isSlow: duration > 100
    });
  }

  trackDragPerformance(fps, dropLatency) {
    this.track('drag_performance', {
      averageFps: fps,
      dropLatency,
      isSmooth: fps >= 55
    });
  }

  // Track errors
  trackError(error, context) {
    this.track('error', {
      message: error.message,
      stack: error.stack,
      context
    });
  }

  track(event, properties = {}) {
    const payload = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        userAgent: navigator.userAgent,
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight
        }
      }
    };

    // Use sendBeacon for reliability
    navigator.sendBeacon('/api/analytics', JSON.stringify(payload));
  }
}

export const analytics = new CalendarAnalytics();
```

### Performance Monitoring

```jsx
// hooks/usePerformanceMonitor.js
const usePerformanceMonitor = () => {
  useEffect(() => {
    // Track Largest Contentful Paint
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lcp = entries[entries.length - 1];
      analytics.track('lcp', { value: lcp.startTime });
    });
    lcpObserver.observe({ type: 'largest-contentful-paint', buffered: true });

    // Track First Input Delay
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach(entry => {
        analytics.track('fid', {
          value: entry.processingStart - entry.startTime,
          name: entry.name
        });
      });
    });
    fidObserver.observe({ type: 'first-input', buffered: true });

    // Track Cumulative Layout Shift
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      list.getEntries().forEach(entry => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
    });
    clsObserver.observe({ type: 'layout-shift', buffered: true });

    // Report CLS on page hide
    window.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        analytics.track('cls', { value: clsValue });
      }
    });

    return () => {
      lcpObserver.disconnect();
      fidObserver.disconnect();
      clsObserver.disconnect();
    };
  }, []);
};
```

---

## 19. Attendee & Scheduling Features

### Free/Busy Lookup

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SCHEDULING ASSISTANT                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Find a Time (Free/Busy Grid):                                             │
│  ─────────────────────────────                                               │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Attendees      │ 9AM  10AM  11AM  12PM  1PM  2PM  3PM  4PM  5PM   │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  You            │ ░░░░ ████ ████ ░░░░ ░░░░ ████ ░░░░ ░░░░ ░░░░    │   │
│  │  Alice          │ ░░░░ ░░░░ ████ ████ ░░░░ ░░░░ ████ ░░░░ ░░░░    │   │
│  │  Bob            │ ████ ████ ░░░░ ░░░░ ████ ░░░░ ░░░░ ████ ░░░░    │   │
│  │  Carol          │ ░░░░ ░░░░ ░░░░ ████ ████ ████ ░░░░ ░░░░ ████    │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Best times     │ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░ ░░░░    │   │
│  │  (all free)     │      ▲         ▲              ▲                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Legend:  ░░░░ = Free    ████ = Busy    ▲ = Suggested slot              │   │
│                                                                              │
│  API Design:                                                                │
│  ──────────                                                                  │
│  POST /api/freebusy                                                        │
│  {                                                                          │
│    "attendees": ["alice@company.com", "bob@company.com"],                  │
│    "timeMin": "2024-12-22T00:00:00Z",                                      │
│    "timeMax": "2024-12-28T23:59:59Z"                                       │
│  }                                                                          │
│                                                                              │
│  Response:                                                                  │
│  {                                                                          │
│    "calendars": {                                                          │
│      "alice@company.com": {                                                │
│        "busy": [                                                           │
│          { "start": "2024-12-22T11:00:00Z", "end": "2024-12-22T12:00:00Z" }│
│        ]                                                                    │
│      }                                                                      │
│    }                                                                        │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Meeting Suggestions

```jsx
// hooks/useMeetingSuggestions.js
const useMeetingSuggestions = (attendees, duration, dateRange) => {
  const { data: freeBusy } = useQuery({
    queryKey: ['freebusy', attendees, dateRange],
    queryFn: () => fetchFreeBusy(attendees, dateRange),
    enabled: attendees.length > 0
  });

  const suggestions = useMemo(() => {
    if (!freeBusy) return [];

    // Find slots where everyone is free
    const slots = [];
    const slotDuration = duration || 30; // minutes
    const workingHours = { start: 9, end: 17 }; // 9 AM to 5 PM

    let currentDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    while (currentDate < endDate) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        for (let hour = workingHours.start; hour < workingHours.end; hour++) {
          for (let minute = 0; minute < 60; minute += 15) {
            const slotStart = new Date(currentDate);
            slotStart.setHours(hour, minute, 0, 0);

            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

            if (slotEnd.getHours() > workingHours.end) continue;

            const isAvailable = attendees.every(attendee => {
              const busy = freeBusy.calendars[attendee]?.busy || [];
              return !busy.some(b =>
                new Date(b.start) < slotEnd &&
                new Date(b.end) > slotStart
              );
            });

            if (isAvailable) {
              slots.push({
                start: slotStart.toISOString(),
                end: slotEnd.toISOString(),
                score: calculateSlotScore(slotStart) // Prefer mid-morning
              });
            }
          }
        }
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Sort by score and return top 5
    return slots
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [freeBusy, attendees, duration, dateRange]);

  return suggestions;
};

const calculateSlotScore = (date) => {
  const hour = date.getHours();
  // Prefer 10 AM, 2 PM (avoid lunch, early morning, late afternoon)
  if (hour === 10 || hour === 14) return 100;
  if (hour === 11 || hour === 15) return 80;
  if (hour === 9 || hour === 16) return 60;
  return 40;
};
```

---

## 20. Reminder & Notification System

### Notification Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    REMINDER NOTIFICATION SYSTEM                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Reminder Types:                                                            │
│  ───────────────                                                             │
│  • Browser notification (Web Push)                                         │
│  • Email reminder                                                           │
│  • SMS (optional, premium)                                                  │
│  • In-app notification                                                      │
│                                                                              │
│  Default Reminder Rules:                                                    │
│  ─────────────────────────                                                   │
│  • 30 minutes before (default)                                             │
│  • 10 minutes before (meetings)                                            │
│  • 1 day before (all-day events)                                           │
│  • Custom: 5min, 15min, 1hr, 1day, 1week                                   │
│                                                                              │
│  Architecture:                                                              │
│  ─────────────                                                               │
│                                                                              │
│  ┌────────────────┐    ┌────────────────┐    ┌────────────────┐            │
│  │ Event Service  │───>│ Reminder Queue │───>│ Notification   │            │
│  │                │    │ (Redis/Kafka)  │    │ Workers        │            │
│  │ On create:     │    │                │    │                │            │
│  │ Schedule       │    │ Sorted by      │    │ • Push Worker  │            │
│  │ reminders      │    │ trigger time   │    │ • Email Worker │            │
│  └────────────────┘    └────────────────┘    │ • SMS Worker   │            │
│                                               └───────┬────────┘            │
│                                                       │                     │
│                                                       ▼                     │
│                                   ┌─────────────────────────────────────┐  │
│                                   │          Push Service               │  │
│                                   │  (FCM / APNS / Web Push)           │  │
│                                   └─────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Web Push Implementation

```jsx
// notifications/ReminderNotification.js
class ReminderNotificationManager {
  async requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      await this.subscribeToPush();
    }
    return permission;
  }

  async subscribeToPush() {
    const registration = await navigator.serviceWorker.ready;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
    });

    // Send subscription to server
    await fetch('/api/push/subscribe', {
      method: 'POST',
      body: JSON.stringify(subscription),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Show local notification (when tab is open)
  showLocalNotification(event, minutesBefore) {
    if (Notification.permission !== 'granted') return;

    const notification = new Notification(event.title, {
      body: `Starting in ${minutesBefore} minutes`,
      icon: '/icons/calendar-192.png',
      tag: `reminder-${event.id}`,
      data: { eventId: event.id },
      requireInteraction: true,
      actions: [
        { action: 'join', title: 'Join Meeting' },
        { action: 'snooze', title: 'Snooze 5 min' },
        { action: 'dismiss', title: 'Dismiss' }
      ]
    });

    notification.onclick = () => {
      window.focus();
      navigateToEvent(event.id);
      notification.close();
    };
  }
}

// Service Worker handler
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/calendar-192.png',
      badge: '/icons/calendar-badge.png',
      tag: `event-${data.eventId}`,
      data: data,
      actions: [
        { action: 'join', title: 'Join' },
        { action: 'snooze', title: 'Snooze' }
      ]
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'join' && event.notification.data.meetingUrl) {
    event.waitUntil(
      clients.openWindow(event.notification.data.meetingUrl)
    );
  } else if (event.action === 'snooze') {
    // Reschedule notification for 5 minutes later
    event.waitUntil(
      scheduleSnooze(event.notification.data.eventId, 5)
    );
  } else {
    // Open calendar app
    event.waitUntil(
      clients.openWindow(`/calendar/event/${event.notification.data.eventId}`)
    );
  }
});
```

---

## 21. Virtual Scrolling & Large Datasets

### Week/Month View Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIRTUAL SCROLLING FOR CALENDAR                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Problem: Month view with 1000+ events                                      │
│  ───────────────────────────────────────                                     │
│  • Rendering all events causes jank                                         │
│  • Memory usage spikes                                                      │
│  • Initial load is slow                                                     │
│                                                                              │
│  Solution: Virtual Scrolling + Windowing                                    │
│  ───────────────────────────────────────                                     │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                          Viewport                                    │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │   │
│  │  │  (Buffer zone - pre-rendered for smooth scrolling)           │  │   │
│  │  ├───────────────────────────────────────────────────────────────┤  │   │
│  │  │                                                                │  │   │
│  │  │  ████ VISIBLE EVENTS - Actually rendered ████                │  │   │
│  │  │  ████                                     ████                │  │   │
│  │  │  ████   Week 2: Dec 8-14                  ████                │  │   │
│  │  │  ████   [Events rendered here]            ████                │  │   │
│  │  │  ████                                     ████                │  │   │
│  │  │                                                                │  │   │
│  │  ├───────────────────────────────────────────────────────────────┤  │   │
│  │  │ ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │  │   │
│  │  │  (Buffer zone - pre-rendered)                                 │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  │                                                                      │   │
│  │  ┌───────────────────────────────────────────────────────────────┐  │   │
│  │  │           NOT RENDERED (placeholder height)                   │  │   │
│  │  │                    Week 3, 4, 5...                            │  │   │
│  │  └───────────────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Implementation Strategy:                                                   │
│  ────────────────────────                                                    │
│  1. Calculate visible date range based on scroll position                  │
│  2. Fetch/cache events only for visible range + buffer                     │
│  3. Render placeholders for off-screen weeks                               │
│  4. Use Intersection Observer to trigger data fetching                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Virtual List Implementation

```jsx
// components/VirtualMonthView.jsx
import { useVirtualizer } from '@tanstack/react-virtual';

const VirtualMonthView = ({ events, onLoadMore }) => {
  const parentRef = useRef(null);

  // Generate weeks for the year
  const weeks = useMemo(() => {
    return generateWeeksForYear(2024); // [{start, end}, ...]
  }, []);

  const virtualizer = useVirtualizer({
    count: weeks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120, // Estimated row height
    overscan: 3 // Render 3 extra rows above/below
  });

  const virtualRows = virtualizer.getVirtualItems();

  // Fetch events for visible weeks
  useEffect(() => {
    const visibleWeeks = virtualRows.map(row => weeks[row.index]);
    const dateRange = {
      start: visibleWeeks[0]?.start,
      end: visibleWeeks[visibleWeeks.length - 1]?.end
    };

    if (dateRange.start && dateRange.end) {
      prefetchEvents(dateRange);
    }
  }, [virtualRows, weeks]);

  return (
    <div
      ref={parentRef}
      className="month-view-container"
      style={{ height: '100%', overflow: 'auto' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {virtualRows.map((virtualRow) => {
          const week = weeks[virtualRow.index];
          const weekEvents = events.filter(e =>
            isWithinWeek(e, week)
          );

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`
              }}
            >
              <WeekRow week={week} events={weekEvents} />
            </div>
          );
        })}
      </div>
    </div>
  );
};
```

### Lazy Loading Events

```jsx
// hooks/useLazyEvents.js
const useLazyEvents = (visibleRange) => {
  const queryClient = useQueryClient();
  const [loadedRanges, setLoadedRanges] = useState([]);

  // Check if range is already loaded
  const isRangeLoaded = (range) => {
    return loadedRanges.some(loaded =>
      loaded.start <= range.start && loaded.end >= range.end
    );
  };

  // Fetch events for new range
  const { data, isFetching } = useQuery({
    queryKey: ['events', visibleRange.start, visibleRange.end],
    queryFn: async () => {
      const response = await fetch(
        `/api/events?start=${visibleRange.start}&end=${visibleRange.end}`
      );
      return response.json();
    },
    enabled: !isRangeLoaded(visibleRange),
    onSuccess: () => {
      setLoadedRanges(prev => mergeRanges([...prev, visibleRange]));
    }
  });

  // Prefetch adjacent ranges
  useEffect(() => {
    const nextRange = getNextWeekRange(visibleRange);
    const prevRange = getPrevWeekRange(visibleRange);

    queryClient.prefetchQuery({
      queryKey: ['events', nextRange.start, nextRange.end],
      queryFn: () => fetchEvents(nextRange)
    });

    queryClient.prefetchQuery({
      queryKey: ['events', prevRange.start, prevRange.end],
      queryFn: () => fetchEvents(prevRange)
    });
  }, [visibleRange, queryClient]);

  // Aggregate all cached events
  const allEvents = useMemo(() => {
    const cached = queryClient.getQueriesData(['events']);
    return cached.flatMap(([, data]) => data?.events || []);
  }, [data, queryClient]);

  return { events: allEvents, isLoading: isFetching };
};

// Merge overlapping ranges
const mergeRanges = (ranges) => {
  if (ranges.length === 0) return [];

  const sorted = ranges.sort((a, b) =>
    new Date(a.start) - new Date(b.start)
  );

  const merged = [sorted[0]];

  for (let i = 1; i < sorted.length; i++) {
    const last = merged[merged.length - 1];
    const current = sorted[i];

    if (new Date(current.start) <= new Date(last.end)) {
      last.end = new Date(last.end) > new Date(current.end)
        ? last.end
        : current.end;
    } else {
      merged.push(current);
    }
  }

  return merged;
};
```

---

## Quick Reference Cheat Sheet

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QUICK REFERENCE                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Protocol Choice:                                                           │
│  • Data fetch → REST                                                        │
│  • Real-time sync → WebSocket                                               │
│  • NOT: Long polling (too much overhead for calendar)                       │
│                                                                              │
│  Database Choice:                                                           │
│  • Events, Calendars, Users → PostgreSQL (ACID, range queries)             │
│  • Cache, Pub/Sub → Redis                                                   │
│  • Analytics → Cassandra (optional)                                         │
│                                                                              │
│  Recurring Events:                                                          │
│  • Store RRULE, expand on read                                              │
│  • Never materialize infinite series                                        │
│  • Exceptions stored separately                                             │
│                                                                              │
│  Performance:                                                               │
│  • Memoize event components                                                 │
│  • Use transforms for drag                                                  │
│  • throttle with rAF                                                        │
│  • CSS containment                                                          │
│                                                                              │
│  State Management:                                                          │
│  • Server state → React Query                                               │
│  • URL state → Router (date, view)                                          │
│  • UI state → Zustand/Context                                               │
│  • Drag state → Local useState                                              │
│                                                                              │
│  Time Zones:                                                                │
│  • Store UTC, display local                                                 │
│  • All-day = date only                                                      │
│  • Use date-fns-tz                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
