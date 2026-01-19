# Chat Application - WhatsApp/LinkedIn/Facebook Web (HLD)

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
13. [Security Deep Dive](#13-security-deep-dive)
14. [Mobile & Touch Considerations](#14-mobile--touch-considerations)
15. [Comprehensive Testing Strategy](#15-comprehensive-testing-strategy)
16. [Offline Support & PWA](#16-offline-support--pwa)
17. [Media Deep Dive](#17-media-deep-dive)
18. [Internationalization (i18n)](#18-internationalization-i18n)
19. [Analytics & Observability](#19-analytics--observability)
20. [Notification System](#20-notification-system)
21. [Advanced Message Features](#21-advanced-message-features)

---

## 1. Problem Statement & Requirements

### Functional Requirements

- Real-time 1:1 messaging
- Group chats (up to 256 members)
- Message status (sent, delivered, read)
- Typing indicators
- Online/offline presence
- Media sharing (images, videos, documents)
- Message search
- Push notifications
- Message history with infinite scroll
- End-to-end encryption (WhatsApp style)

### Non-Functional Requirements

- **Latency**: Message delivery < 100ms (same region)
- **Reliability**: 99.99% message delivery guarantee
- **Scalability**: Handle 1B+ users, 100B+ messages/day
- **Ordering**: Messages must appear in correct order
- **Consistency**: Eventual consistency acceptable
- **Offline**: Queue messages when recipient offline

### Capacity Estimation

```
Daily Active Users (DAU): 500 million
Messages per user per day: 50
Total messages per day: 25 billion
Peak messages per second: 500,000
Average message size: 100 bytes
Storage per day: 2.5 TB (messages only)
WebSocket connections: 100 million concurrent
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
│                         │ WebSocket │ HTTPS                                 │
└─────────────────────────┼───────────┼────────────────────────────────────────┘
                          │           │
                          ▼           ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            EDGE LAYER                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    Load Balancer (L7)                                │   │
│  │   • SSL Termination  • WebSocket Upgrade  • Sticky Sessions         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   WebSocket     │      │   REST API      │      │   Media         │
│   Gateway       │      │   Server        │      │   Service       │
│                 │      │                 │      │                 │
│ • Connection    │      │ • Auth          │      │ • Upload        │
│   management    │      │ • User CRUD     │      │ • Processing    │
│ • Message       │      │ • Chat CRUD     │      │ • CDN URLs      │
│   routing       │      │ • Search        │      │                 │
└────────┬────────┘      └────────┬────────┘      └────────┬────────┘
         │                        │                        │
         └────────────────────────┴────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MESSAGE LAYER                                       │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Message       │  │   Presence      │  │   Notification  │             │
│  │   Queue         │  │   Service       │  │   Service       │             │
│  │   (Kafka)       │  │   (Redis)       │  │   (FCM/APNS)    │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA LAYER                                         │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Cassandra     │  │     Redis       │  │    S3/Blob      │             │
│  │   (Messages)    │  │   (Cache/PubSub)│  │   (Media)       │             │
│  │                 │  │                 │  │                 │             │
│  │ • Messages      │  │ • Sessions      │  │ • Images        │             │
│  │ • Chats         │  │ • Presence      │  │ • Videos        │             │
│  │ • Users         │  │ • Unread count  │  │ • Documents     │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Connection Architecture (WebSocket)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WEBSOCKET CONNECTION ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User A (NYC)                                              User B (London) │
│   ───────────                                               ──────────────  │
│        │                                                          │         │
│        │  WebSocket                                    WebSocket  │         │
│        │                                                          │         │
│        ▼                                                          ▼         │
│   ┌─────────────┐                                       ┌─────────────┐    │
│   │  WS Gateway │                                       │  WS Gateway │    │
│   │  (NYC)      │                                       │  (London)   │    │
│   └──────┬──────┘                                       └──────┬──────┘    │
│          │                                                     │            │
│          └──────────────────────┬──────────────────────────────┘            │
│                                 │                                            │
│                                 ▼                                            │
│                     ┌─────────────────────┐                                 │
│                     │    Redis Pub/Sub    │                                 │
│                     │    (Message Broker) │                                 │
│                     └─────────────────────┘                                 │
│                                 │                                            │
│         Message Flow:                                                       │
│         ──────────────                                                       │
│         1. User A sends message → WS Gateway NYC                            │
│         2. Gateway publishes to Redis channel: user:{B_id}                 │
│         3. London Gateway subscribed to user:{B_id}                        │
│         4. London Gateway pushes to User B's WebSocket                     │
│                                                                              │
│   Why Redis Pub/Sub (not direct WS)?                                       │
│   • Users connect to different gateway instances                           │
│   • Need cross-gateway message routing                                     │
│   • Redis provides fan-out to all subscribed gateways                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### Frontend Component Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              ChatApp                                         │
│  ┌────────────────────────────┬──────────────────────────────────────────┐  │
│  │                            │                                           │  │
│  │       Sidebar              │              ChatWindow                   │  │
│  │  ┌──────────────────────┐  │  ┌─────────────────────────────────────┐ │  │
│  │  │      Header          │  │  │            ChatHeader               │ │  │
│  │  │  ┌────────────────┐  │  │  │  ┌───────────────────────────────┐  │ │  │
│  │  │  │ Avatar │ Search│  │  │  │  │ Avatar │ Name │ Status │ ··· │  │ │  │
│  │  │  └────────────────┘  │  │  │  └───────────────────────────────┘  │ │  │
│  │  └──────────────────────┘  │  └─────────────────────────────────────┘ │  │
│  │                            │                                           │  │
│  │  ┌──────────────────────┐  │  ┌─────────────────────────────────────┐ │  │
│  │  │    ConversationList  │  │  │         MessageList                 │ │  │
│  │  │   (Virtualized)      │  │  │        (Virtualized)                │ │  │
│  │  │  ┌──────────────────┐│  │  │  ┌─────────────────────────────┐   │ │  │
│  │  │  │ ConversationItem ││  │  │  │  MessageBubble (Received)   │   │ │  │
│  │  │  │ ┌──────┬───────┐ ││  │  │  │  └─ Text │ Media │ Time     │   │ │  │
│  │  │  │ │Avatar│Name   │ ││  │  │  └─────────────────────────────┘   │ │  │
│  │  │  │ │      │Preview│ ││  │  │                                     │ │  │
│  │  │  │ │      │Time   │ ││  │  │  ┌─────────────────────────────┐   │ │  │
│  │  │  │ │      │Badge  │ ││  │  │  │  MessageBubble (Sent)       │   │ │  │
│  │  │  │ └──────┴───────┘ ││  │  │  │  └─ Text │ Status (✓✓) │Time│   │ │  │
│  │  │  └──────────────────┘│  │  │  └─────────────────────────────┘   │ │  │
│  │  │                      │  │  │                                     │ │  │
│  │  │  ┌──────────────────┐│  │  │  ┌─────────────────────────────┐   │ │  │
│  │  │  │ ConversationItem ││  │  │  │  TypingIndicator            │   │ │  │
│  │  │  └──────────────────┘│  │  │  │  └─ "John is typing..."     │   │ │  │
│  │  │         ...          │  │  │  └─────────────────────────────┘   │ │  │
│  │  └──────────────────────┘  │  └─────────────────────────────────────┘ │  │
│  │                            │                                           │  │
│  └────────────────────────────┤  ┌─────────────────────────────────────┐ │  │
│                               │  │         MessageInput                 │ │  │
│                               │  │  ┌─────────────────────────────────┐│ │  │
│                               │  │  │ 📎 │ TextField │ 😊 │ 🎤 │ ➤  ││ │  │
│                               │  │  └─────────────────────────────────┘│ │  │
│                               │  └─────────────────────────────────────┘ │  │
│                               └──────────────────────────────────────────┘  │
│                                                                              │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                     Modals / Overlays                                  │  │
│  │  • MediaPreview  • ContactInfo  • GroupInfo  • NewChat  • Settings   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Component Responsibilities

| Component           | Responsibility                                                      |
| ------------------- | ------------------------------------------------------------------- |
| `ConversationList`  | List of chats, unread badges, last message preview, virtualized     |
| `MessageList`       | Display messages, infinite scroll (older messages), auto-scroll new |
| `MessageBubble`     | Render message content, status indicators, reply preview            |
| `MessageInput`      | Text input, emoji picker, file upload, voice recording              |
| `TypingIndicator`   | Show when other user is typing (debounced)                          |
| `WebSocketProvider` | Manage WS connection, reconnection, message dispatch                |

---

## 4. Data Flow

### Send Message Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  User A  │     │  UI      │     │WebSocket │     │  Server  │     │  User B  │
└────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘     └────┬─────┘
     │                │                │                │                │
     │ 1. Type & Send │                │                │                │
     │───────────────>│                │                │                │
     │                │                │                │                │
     │                │ 2. Optimistic  │                │                │
     │                │    update (✓)  │                │                │
     │                │───────────────>│                │                │
     │                │    Show pending│                │                │
     │                │                │                │                │
     │ 3. See message │                │                │                │
     │    with (✓)    │                │                │                │
     │<───────────────│                │                │                │
     │                │                │                │                │
     │                │                │ 4. Send via WS │                │
     │                │                │───────────────>│                │
     │                │                │                │                │
     │                │                │                │ 5. Store in DB │
     │                │                │                │ 6. Ack back    │
     │                │                │<───────────────│                │
     │                │                │                │                │
     │                │ 7. Update to   │                │                │
     │                │    (✓✓) sent   │                │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
     │ 8. See (✓✓)    │                │                │ 9. If B online:│
     │<───────────────│                │                │    Push via WS │
     │                │                │                │───────────────>│
     │                │                │                │                │
     │                │                │                │ 10. B receives │
     │                │                │                │     message    │
     │                │                │                │                │
     │                │                │                │ 11. Send       │
     │                │                │                │     delivered  │
     │                │                │<───────────────│     ack        │
     │                │                │                │                │
     │                │ 12. Update to  │                │                │
     │                │     (✓✓) blue  │                │                │
     │                │<───────────────│                │                │
     │                │                │                │                │
```

### Message Status States

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MESSAGE STATUS FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Status         Symbol    Meaning                                          │
│   ──────         ──────    ───────                                          │
│   PENDING        🕐        Message sent to server (optimistic)              │
│   SENT           ✓         Server acknowledged, stored                      │
│   DELIVERED      ✓✓        Recipient's device received                      │
│   READ           ✓✓ (blue) Recipient opened chat                            │
│   FAILED         ⚠️        Send failed, retry option                        │
│                                                                              │
│                                                                              │
│   State Machine:                                                            │
│   ──────────────                                                             │
│                                                                              │
│   ┌─────────┐   server ack   ┌──────┐   device ack   ┌───────────┐         │
│   │ PENDING │ ─────────────> │ SENT │ ─────────────> │ DELIVERED │         │
│   └────┬────┘                └──────┘                └─────┬─────┘         │
│        │                                                   │                │
│        │ timeout                                    read ack│                │
│        ▼                                                   ▼                │
│   ┌─────────┐                                         ┌──────┐             │
│   │ FAILED  │                                         │ READ │             │
│   └─────────┘                                         └──────┘             │
│                                                                              │
│                                                                              │
│   Implementation:                                                           │
│   ───────────────                                                            │
│   • Client generates tempId for optimistic update                          │
│   • Server returns serverId on ack                                         │
│   • Client replaces tempId with serverId                                   │
│   • Status updates via WebSocket events                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Typing Indicator Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TYPING INDICATOR FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   User A (typing)                Server                 User B (viewing)    │
│   ───────────────                ──────                 ────────────────    │
│        │                            │                          │            │
│   1. Start typing                   │                          │            │
│        │                            │                          │            │
│   ─────┼──── Debounce (300ms) ──────│                          │            │
│        │                            │                          │            │
│   2. WS: { type: "typing",          │                          │            │
│           chatId: "..." }           │                          │            │
│        │───────────────────────────>│                          │            │
│        │                            │                          │            │
│        │                            │──── WS: typing event ───>│            │
│        │                            │                          │            │
│        │                            │                  3. Show indicator    │
│        │                            │                     "A is typing..."  │
│        │                            │                          │            │
│   ─────┼──── 3 seconds pass ────────┼──────────────────────────│            │
│        │    (no more typing)        │                          │            │
│        │                            │                          │            │
│   4. WS: { type: "stop_typing" }    │                          │            │
│        │───────────────────────────>│                          │            │
│        │                            │                          │            │
│        │                            │── WS: stop_typing ──────>│            │
│        │                            │                          │            │
│        │                            │                  5. Hide indicator    │
│        │                            │                          │            │
│                                                                              │
│   Optimization:                                                             │
│   ─────────────                                                              │
│   • Debounce typing events (don't send on every keystroke)                 │
│   • Auto-timeout after 3-5 seconds of no typing                            │
│   • Don't store in DB (ephemeral, real-time only)                          │
│   • Use Redis Pub/Sub, not persistent storage                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Presence (Online/Offline) Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        PRESENCE SYSTEM                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Presence States:                                                          │
│   • ONLINE:      Currently connected                                        │
│   • AWAY:        Connected but idle (5 min)                                │
│   • OFFLINE:     Disconnected                                               │
│   • LAST_SEEN:   "Last seen today at 3:45 PM"                              │
│                                                                              │
│                                                                              │
│   Architecture:                                                             │
│   ─────────────                                                              │
│                                                                              │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐                  │
│   │   Client    │     │  WS Gateway │     │   Redis     │                  │
│   └──────┬──────┘     └──────┬──────┘     └──────┬──────┘                  │
│          │                   │                   │                          │
│   Connect│                   │                   │                          │
│   ───────┼──────────────────>│                   │                          │
│          │                   │                   │                          │
│          │                   │ SET user:{id}:    │                          │
│          │                   │ presence "online" │                          │
│          │                   │ EX 30             │ (TTL 30s)                │
│          │                   │──────────────────>│                          │
│          │                   │                   │                          │
│          │                   │ PUBLISH presence  │                          │
│          │                   │ {userId, "online"}│                          │
│          │                   │──────────────────>│                          │
│          │                   │                   │                          │
│          │         Every 25s │                   │                          │
│   ───────┼─── Heartbeat ────>│                   │                          │
│          │                   │ EXPIRE user:{id}: │                          │
│          │                   │ presence 30       │                          │
│          │                   │──────────────────>│                          │
│          │                   │                   │                          │
│   Disconnect (or timeout)    │                   │                          │
│   ───────┼──────────────────>│                   │                          │
│          │                   │                   │                          │
│          │                   │ DEL user:{id}:    │                          │
│          │                   │ presence          │                          │
│          │                   │──────────────────>│                          │
│          │                   │                   │                          │
│          │                   │ SET user:{id}:    │                          │
│          │                   │ last_seen {time}  │                          │
│          │                   │──────────────────>│                          │
│                                                                              │
│                                                                              │
│   Subscribing to Presence:                                                  │
│   ─────────────────────────                                                  │
│   • Client subscribes to contacts' presence channels                       │
│   • Receives real-time updates via Pub/Sub                                 │
│   • Caches presence locally, refreshes on focus                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Design & Communication Protocols

### Protocol Comparison

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    PROTOCOL COMPARISON FOR CHAT                              │
├─────────────────┬───────────────┬───────────────┬───────────────────────────┤
│    Protocol     │     Pros      │     Cons      │     Use Case              │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Bi-direct   │ • Connection  │ • ✅ REAL-TIME MESSAGES   │
│   WebSocket     │ • Low latency │   overhead    │ • ✅ Typing indicators    │
│                 │ • Full-duplex │ • Scaling     │ • ✅ Presence updates     │
│                 │ • Push model  │   complexity  │ • ✅ Read receipts        │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Simple      │ • No push     │ • Auth, user CRUD         │
│    REST         │ • Stateless   │ • Higher      │ • Chat history (GET)      │
│                 │ • Cacheable   │   latency     │ • Media upload            │
│                 │               │               │ • Search                   │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Less over-  │ • One-way     │ • ❌ NOT for chat         │
│    SSE          │   head than WS│ • No client→  │ • Could work for          │
│                 │ • Auto-recon  │   server      │   notifications only      │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Held until  │ • Reconnect   │ • ❌ NOT for chat         │
│  Long Polling   │   data ready  │   overhead    │ • Fallback only           │
│                 │ • Simple impl │ • Higher      │   (if WS unavailable)     │
│                 │               │   latency     │                           │
├─────────────────┼───────────────┼───────────────┼───────────────────────────┤
│                 │ • Efficient   │ • No browser  │ • Service-to-service      │
│    gRPC         │ • Streaming   │   support     │ • Backend communication   │
│                 │ • Type-safe   │               │ • NOT for frontend        │
└─────────────────┴───────────────┴───────────────┴───────────────────────────┘
```

### Why WebSocket is Essential for Chat

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                 WHY WEBSOCKET (NOT LONG POLLING) FOR CHAT                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Long Polling for Chat (Problems):                                          │
│  ─────────────────────────────────                                           │
│                                                                              │
│  Client ───────> Request ───────> Server (hold 30s)                         │
│         <─────── Response ─────── (on new message OR timeout)               │
│  Client ───────> Request ───────> Server (immediately reconnect)            │
│         <─────── Response ─────── ...                                       │
│                                                                              │
│  Problems:                                                                  │
│  • Reconnection overhead for every message                                  │
│  • Can't push multiple messages quickly                                     │
│  • Typing indicators would flood with requests                              │
│  • ~30s latency worst case                                                  │
│  • Server holds millions of connections waiting                             │
│                                                                              │
│                                                                              │
│  WebSocket for Chat (Solution):                                             │
│  ───────────────────────────────                                             │
│                                                                              │
│  Client <────────────────────────> Server (persistent connection)           │
│         │                        │                                          │
│         │<─── message ───────────│                                          │
│         │<─── typing ────────────│                                          │
│         │<─── read_receipt ──────│                                          │
│         │<─── presence ──────────│                                          │
│         │                        │                                          │
│         │──── send_message ─────>│                                          │
│         │──── typing ───────────>│                                          │
│         │                        │                                          │
│                                                                              │
│  Benefits:                                                                  │
│  • Instant delivery (< 100ms)                                               │
│  • Bi-directional (client sends AND receives)                              │
│  • Multiple event types on same connection                                  │
│  • Efficient for high-frequency events (typing)                            │
│  • Lower server load (no reconnection)                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### WebSocket Message Protocol

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      WEBSOCKET MESSAGE SCHEMA                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Connection:                                                                │
│  ───────────                                                                 │
│  wss://chat.app.com/ws?token=JWT                                           │
│                                                                              │
│                                                                              │
│  Client → Server Messages:                                                  │
│  ─────────────────────────                                                   │
│                                                                              │
│  // Send message                                                            │
│  {                                                                           │
│    "type": "message",                                                       │
│    "tempId": "temp-uuid-123",  // Client-generated                         │
│    "chatId": "chat_456",                                                    │
│    "content": {                                                              │
│      "type": "text",                                                        │
│      "text": "Hello!"                                                       │
│    },                                                                        │
│    "replyTo": null  // or message_id                                        │
│  }                                                                           │
│                                                                              │
│  // Typing indicator                                                        │
│  {                                                                           │
│    "type": "typing",                                                        │
│    "chatId": "chat_456",                                                    │
│    "isTyping": true                                                         │
│  }                                                                           │
│                                                                              │
│  // Read receipt                                                            │
│  {                                                                           │
│    "type": "read",                                                          │
│    "chatId": "chat_456",                                                    │
│    "messageId": "msg_789"  // Last read message                            │
│  }                                                                           │
│                                                                              │
│  // Ping (keep-alive)                                                       │
│  {                                                                           │
│    "type": "ping"                                                           │
│  }                                                                           │
│                                                                              │
│                                                                              │
│  Server → Client Messages:                                                  │
│  ─────────────────────────                                                   │
│                                                                              │
│  // Message acknowledgment                                                  │
│  {                                                                           │
│    "type": "message_ack",                                                   │
│    "tempId": "temp-uuid-123",                                               │
│    "messageId": "msg_server_id",                                            │
│    "status": "sent",                                                        │
│    "timestamp": "2024-12-22T10:30:00Z"                                      │
│  }                                                                           │
│                                                                              │
│  // New message received                                                    │
│  {                                                                           │
│    "type": "message",                                                       │
│    "messageId": "msg_999",                                                  │
│    "chatId": "chat_456",                                                    │
│    "senderId": "user_123",                                                  │
│    "content": { "type": "text", "text": "Hi there!" },                     │
│    "timestamp": "2024-12-22T10:31:00Z"                                      │
│  }                                                                           │
│                                                                              │
│  // Delivery receipt                                                        │
│  {                                                                           │
│    "type": "delivered",                                                     │
│    "messageId": "msg_789",                                                  │
│    "chatId": "chat_456"                                                     │
│  }                                                                           │
│                                                                              │
│  // Read receipt                                                            │
│  {                                                                           │
│    "type": "read",                                                          │
│    "chatId": "chat_456",                                                    │
│    "userId": "user_789",                                                    │
│    "lastReadMessageId": "msg_999"                                           │
│  }                                                                           │
│                                                                              │
│  // Typing indicator                                                        │
│  {                                                                           │
│    "type": "typing",                                                        │
│    "chatId": "chat_456",                                                    │
│    "userId": "user_123",                                                    │
│    "isTyping": true                                                         │
│  }                                                                           │
│                                                                              │
│  // Presence update                                                         │
│  {                                                                           │
│    "type": "presence",                                                      │
│    "userId": "user_123",                                                    │
│    "status": "online" | "offline",                                          │
│    "lastSeen": "2024-12-22T10:30:00Z"  // if offline                       │
│  }                                                                           │
│                                                                              │
│  // Pong                                                                    │
│  {                                                                           │
│    "type": "pong"                                                           │
│  }                                                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### REST API Endpoints

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           REST API DESIGN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CHATS                                                                      │
│  ─────                                                                       │
│  GET    /api/v1/chats                                                       │
│         → List all chats with last message, unread count                   │
│         Response: { chats: [...], nextCursor }                             │
│                                                                              │
│  POST   /api/v1/chats                                                       │
│         Body: { participantIds: [...] } or { groupName, participantIds }   │
│         → Create new 1:1 or group chat                                     │
│                                                                              │
│  GET    /api/v1/chats/:chatId                                               │
│         → Get chat details (participants, settings)                        │
│                                                                              │
│  MESSAGES                                                                   │
│  ────────                                                                    │
│  GET    /api/v1/chats/:chatId/messages                                      │
│         ?cursor=xxx&limit=50&direction=before                              │
│         → Fetch message history (infinite scroll)                          │
│         Response: { messages: [...], nextCursor, hasMore }                 │
│                                                                              │
│  POST   /api/v1/chats/:chatId/messages                                      │
│         → Fallback if WebSocket unavailable                                │
│                                                                              │
│  DELETE /api/v1/messages/:messageId                                         │
│         → Delete message (for self or everyone)                            │
│                                                                              │
│  MEDIA                                                                      │
│  ─────                                                                       │
│  POST   /api/v1/media/upload                                                │
│         Content-Type: multipart/form-data                                  │
│         → Upload image/video/document                                      │
│         Response: { mediaId, url, thumbnailUrl }                           │
│                                                                              │
│  SEARCH                                                                     │
│  ──────                                                                      │
│  GET    /api/v1/search/messages                                             │
│         ?q=keyword&chatId=xxx                                              │
│         → Full-text search in messages                                     │
│                                                                              │
│  USERS                                                                      │
│  ─────                                                                       │
│  GET    /api/v1/users/:userId                                               │
│  PUT    /api/v1/users/me                                                    │
│  GET    /api/v1/users/me/contacts                                           │
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
│  │                     Cassandra (Primary for Messages)                 │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Messages (write-heavy, time-series)                              │   │
│  │  • Chat metadata                                                     │   │
│  │  • Read receipts                                                     │   │
│  │                                                                      │   │
│  │  WHY Cassandra:                                                      │   │
│  │  • Horizontal scaling for billions of messages                      │   │
│  │  • Write-optimized (high ingestion rate)                            │   │
│  │  • Time-based partitioning (chat_id + bucket)                      │   │
│  │  • Tunable consistency (ONE for speed)                              │   │
│  │  • No single point of failure                                       │   │
│  │                                                                      │   │
│  │  Why NOT PostgreSQL:                                                 │   │
│  │  • Can't scale writes horizontally                                  │   │
│  │  • 25B messages/day would overwhelm single master                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     PostgreSQL (Relational Data)                     │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • User accounts (ACID required)                                    │   │
│  │  • Authentication                                                    │   │
│  │  • Contact relationships                                            │   │
│  │  • Group memberships                                                 │   │
│  │  • Settings/preferences                                              │   │
│  │                                                                      │   │
│  │  WHY SQL:                                                            │   │
│  │  • Strong consistency for auth                                      │   │
│  │  • Complex queries (user lookup)                                    │   │
│  │  • Relatively low write volume                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Redis (Cache + Real-time)                        │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • User sessions                                                     │   │
│  │  • Presence (online/offline)                                        │   │
│  │  • Unread message counts                                             │   │
│  │  • Recent messages cache                                             │   │
│  │  • Pub/Sub for message routing                                      │   │
│  │  • Rate limiting                                                     │   │
│  │  • Typing indicators (ephemeral)                                    │   │
│  │                                                                      │   │
│  │  Data Structures:                                                    │   │
│  │  • String: presence, last_seen                                      │   │
│  │  • Hash: user sessions                                              │   │
│  │  • Sorted Set: recent messages, unread counts                       │   │
│  │  • Pub/Sub: message routing, typing events                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     Elasticsearch (Search)                           │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Full-text message search                                         │   │
│  │  • User search                                                       │   │
│  │                                                                      │   │
│  │  Index messages async via Kafka consumer                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     S3/Blob Storage (Media)                          │   │
│  │                                                                      │   │
│  │  USE FOR:                                                            │   │
│  │  • Images, videos, voice messages                                   │   │
│  │  • Documents                                                         │   │
│  │                                                                      │   │
│  │  Serve via CDN with signed URLs                                     │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cassandra Schema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CASSANDRA SCHEMA                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Table: messages                                                            │
│  ───────────────                                                             │
│  CREATE TABLE messages (                                                    │
│    chat_id       UUID,                                                      │
│    bucket        TEXT,           -- "2024-12-22" (daily bucket)            │
│    message_id    TIMEUUID,       -- Time-based UUID for ordering           │
│    sender_id     UUID,                                                      │
│    content_type  TEXT,           -- "text", "image", "video"               │
│    content       TEXT,           -- Encrypted message or media URL         │
│    reply_to      TIMEUUID,                                                  │
│    created_at    TIMESTAMP,                                                 │
│    PRIMARY KEY ((chat_id, bucket), message_id)                             │
│  ) WITH CLUSTERING ORDER BY (message_id DESC);                             │
│                                                                              │
│  Why this design:                                                           │
│  • Partition by (chat_id, bucket) → limits partition size                  │
│  • Cluster by message_id DESC → newest first (efficient reads)             │
│  • TIMEUUID provides ordering + uniqueness                                 │
│                                                                              │
│                                                                              │
│  Table: chats_by_user                                                       │
│  ─────────────────────                                                       │
│  CREATE TABLE chats_by_user (                                               │
│    user_id           UUID,                                                  │
│    last_activity     TIMESTAMP,                                             │
│    chat_id           UUID,                                                  │
│    chat_type         TEXT,        -- "direct", "group"                     │
│    chat_name         TEXT,        -- null for 1:1, name for group          │
│    last_message      TEXT,                                                  │
│    unread_count      INT,                                                   │
│    PRIMARY KEY (user_id, last_activity, chat_id)                           │
│  ) WITH CLUSTERING ORDER BY (last_activity DESC, chat_id ASC);             │
│                                                                              │
│  Why this design:                                                           │
│  • Partition by user_id → one query for user's chats                       │
│  • Order by last_activity → recent chats first                             │
│                                                                              │
│                                                                              │
│  Table: chat_participants                                                   │
│  ─────────────────────────                                                   │
│  CREATE TABLE chat_participants (                                           │
│    chat_id      UUID,                                                       │
│    user_id      UUID,                                                       │
│    role         TEXT,    -- "member", "admin", "owner"                     │
│    joined_at    TIMESTAMP,                                                  │
│    PRIMARY KEY (chat_id, user_id)                                          │
│  );                                                                          │
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
│  LAYER 1: Client Cache (In-Memory)                                          │
│  ──────────────────────────────────                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Messages per chat (last 100 in memory)                           │   │
│  │  • Chat list with previews                                          │   │
│  │  • Presence status                                                   │   │
│  │  • User profiles (contacts)                                         │   │
│  │                                                                      │   │
│  │  Implementation: React Query / Zustand                              │   │
│  │  TTL: Session-based, invalidated by WebSocket events               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LAYER 2: IndexedDB (Offline Persistence)                                   │
│  ─────────────────────────────────────────                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • All messages (encrypted at rest)                                 │   │
│  │  • Media thumbnails                                                  │   │
│  │  • Draft messages                                                    │   │
│  │  • Offline queue (pending sends)                                    │   │
│  │                                                                      │   │
│  │  Sync Strategy:                                                      │   │
│  │  • On reconnect, fetch messages since lastSyncTimestamp             │   │
│  │  • Merge with local, resolve conflicts                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  LAYER 3: Redis (Server-side)                                               │
│  ─────────────────────────────                                               │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Cache Keys:                                                         │   │
│  │                                                                      │   │
│  │  // Recent messages (last 50 per chat)                              │   │
│  │  messages:recent:{chat_id} → ZSET (message_id, timestamp)           │   │
│  │  message:{message_id} → HASH (content, sender, timestamp)           │   │
│  │  TTL: 24 hours                                                       │   │
│  │                                                                      │   │
│  │  // Chat list per user                                              │   │
│  │  chats:user:{user_id} → ZSET (chat_id, last_activity)              │   │
│  │  chat:{chat_id}:meta → HASH (name, last_message, ...)              │   │
│  │  TTL: 1 hour                                                         │   │
│  │                                                                      │   │
│  │  // Unread counts                                                    │   │
│  │  unread:{user_id}:{chat_id} → INT                                   │   │
│  │  TTL: None (always accurate)                                        │   │
│  │                                                                      │   │
│  │  // Presence                                                         │   │
│  │  presence:{user_id} → STRING ("online" | timestamp)                 │   │
│  │  TTL: 30 seconds (refresh with heartbeat)                           │   │
│  │                                                                      │   │
│  │  // Sessions                                                         │   │
│  │  session:{token} → HASH (user_id, device_id, ...)                   │   │
│  │  TTL: 30 days                                                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Cache Invalidation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CACHE INVALIDATION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Event: New Message                                                        │
│   ──────────────────                                                         │
│   1. Store in Cassandra                                                     │
│   2. Update Redis:                                                          │
│      • ZADD messages:recent:{chat_id}                                      │
│      • SET message:{msg_id}                                                 │
│      • ZADD chats:user:{user_id} (update last_activity)                    │
│      • INCR unread:{recipient_id}:{chat_id}                                │
│   3. PUBLISH message:{chat_id} (notify connected clients)                  │
│   4. Clients receive via WebSocket, update local cache                     │
│                                                                              │
│                                                                              │
│   Event: Message Read                                                       │
│   ───────────────────                                                        │
│   1. DEL unread:{user_id}:{chat_id}                                        │
│   2. PUBLISH read_receipt:{chat_id}                                        │
│   3. Sender's client updates message status                                │
│                                                                              │
│                                                                              │
│   Event: Message Deleted                                                    │
│   ──────────────────────                                                     │
│   1. Mark deleted in Cassandra (soft delete)                               │
│   2. DEL message:{msg_id} from Redis                                       │
│   3. PUBLISH delete:{chat_id} { messageId }                                │
│   4. Clients remove from local cache                                       │
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
│  │  WEBSOCKET STATE (Custom Context/Store)                             │   │
│  │  ──────────────────────────────────────                              │   │
│  │  • Connection status (connected, connecting, disconnected)          │   │
│  │  • Reconnection attempts                                             │   │
│  │  • Message queue (pending sends)                                     │   │
│  │                                                                      │   │
│  │  Why separate: Needs special handling, reconnection logic           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  SERVER STATE (React Query)                                         │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Chat list                                                         │   │
│  │  • Message history (paginated)                                       │   │
│  │  • User profiles                                                     │   │
│  │  • Search results                                                    │   │
│  │                                                                      │   │
│  │  Why React Query: Caching, background refresh, pagination           │   │
│  │                                                                      │   │
│  │  Special: Messages updated via WebSocket invalidate cache           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  REAL-TIME STATE (Zustand/Jotai)                                    │   │
│  │  ───────────────────────────────                                     │   │
│  │  • Typing indicators per chat                                       │   │
│  │  • Presence per user                                                 │   │
│  │  • Unread counts                                                     │   │
│  │  • New messages (optimistic)                                        │   │
│  │                                                                      │   │
│  │  Why separate: High-frequency updates, ephemeral data               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  UI STATE (Local useState)                                          │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Selected chat                                                     │   │
│  │  • Modal open/closed                                                 │   │
│  │  • Input draft text                                                  │   │
│  │  • Emoji picker visible                                              │   │
│  │  • Scroll position                                                   │   │
│  │                                                                      │   │
│  │  Why local: Component-specific, no need to share                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  PERSISTED STATE (IndexedDB)                                        │   │
│  │  ───────────────────────────                                         │   │
│  │  • Message history (offline)                                        │   │
│  │  • Draft messages                                                    │   │
│  │  • Pending sends queue                                               │   │
│  │  • Media cache                                                       │   │
│  │                                                                      │   │
│  │  Why IndexedDB: Offline support, large storage                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### WebSocket Integration with React

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   WEBSOCKET + REACT ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WebSocketProvider                                                          │
│  ──────────────────                                                          │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  • Manages single WebSocket connection                               │   │
│  │  • Handles reconnection with exponential backoff                    │   │
│  │  • Dispatches events to subscribers                                 │   │
│  │  • Provides send() method to children                               │   │
│  │                                                                      │   │
│  │  Connection Lifecycle:                                               │   │
│  │  1. Mount → Connect                                                  │   │
│  │  2. Disconnect → Reconnect (with backoff)                           │   │
│  │  3. Unmount → Close connection                                       │   │
│  │                                                                      │   │
│  │  Event Dispatch:                                                     │   │
│  │  • message → Add to React Query cache                               │   │
│  │  • typing → Update Zustand store                                    │   │
│  │  • presence → Update Zustand store                                  │   │
│  │  • read_receipt → Update message status in cache                    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Reconnection Strategy:                                                     │
│  ──────────────────────                                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Attempt 1: Wait 1 second                                           │   │
│  │  Attempt 2: Wait 2 seconds                                          │   │
│  │  Attempt 3: Wait 4 seconds                                          │   │
│  │  Attempt 4: Wait 8 seconds                                          │   │
│  │  ...                                                                 │   │
│  │  Max: 30 seconds between attempts                                   │   │
│  │  Give up after: 10 attempts → Show "Connection failed" UI          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Performance Optimization

### Message List Virtualization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MESSAGE LIST OPTIMIZATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Problem: 10,000+ messages in a chat → DOM overload                        │
│                                                                              │
│  Solution: Virtualized list (react-window / react-virtuoso)                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────┐     │   │
│  │  │  ▲ Load More (Intersection Observer)                       │     │   │
│  │  └────────────────────────────────────────────────────────────┘     │   │
│  │                                                                      │   │
│  │  ╔════════════════════════════════════════════════════════════╗     │   │
│  │  ║  Spacer (overscan top)                                     ║     │   │
│  │  ╠════════════════════════════════════════════════════════════╣     │   │
│  │  ║                                                            ║     │   │
│  │  ║  Rendered Messages (only visible + buffer)                 ║     │   │
│  │  ║  ┌──────────────────────────────────────────────────────┐  ║     │   │
│  │  ║  │ Message 1 (Dec 22, 10:00 AM)                         │  ║     │   │
│  │  ║  └──────────────────────────────────────────────────────┘  ║     │   │
│  │  ║  ┌──────────────────────────────────────────────────────┐  ║     │   │
│  │  ║  │ Message 2 (Dec 22, 10:01 AM)                         │  ║     │   │
│  │  ║  └──────────────────────────────────────────────────────┘  ║     │   │
│  │  ║  ...                                                       ║     │   │
│  │  ║                                                            ║     │   │
│  │  ╠════════════════════════════════════════════════════════════╣     │   │
│  │  ║  Spacer (overscan bottom)                                  ║     │   │
│  │  ╚════════════════════════════════════════════════════════════╝     │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Special Considerations:                                                    │
│  ─────────────────────────                                                   │
│  • Variable height messages (text vs image vs video)                       │
│  • Auto-scroll to bottom on new message (if already at bottom)            │
│  • Maintain scroll position when loading older messages                    │
│  • Date separators between message groups                                  │
│                                                                              │
│  Library: react-virtuoso (better for chat, handles variable heights)       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Optimistic Updates

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       OPTIMISTIC UPDATES                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Send Message Optimistically:                                               │
│  ────────────────────────────                                                │
│                                                                              │
│  1. User clicks send                                                        │
│  2. Generate tempId (UUID)                                                  │
│  3. Add to local state immediately with status: "pending"                  │
│  4. Show message in UI with clock icon                                     │
│  5. Send via WebSocket                                                      │
│  6. On ack: Replace tempId with serverId, update status: "sent"           │
│  7. On delivery: Update status: "delivered"                                │
│  8. On read: Update status: "read"                                         │
│  9. On error: Update status: "failed", show retry option                   │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  Message Object:                                                     │   │
│  │  {                                                                   │   │
│  │    id: "temp-uuid-123",  // or "server-uuid-456" after ack          │   │
│  │    tempId: "temp-uuid-123",  // kept for matching                   │   │
│  │    content: "Hello!",                                                │   │
│  │    status: "pending" | "sent" | "delivered" | "read" | "failed",   │   │
│  │    timestamp: "2024-12-22T10:30:00Z"                                │   │
│  │  }                                                                   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Retry Failed Messages:                                                     │
│  ──────────────────────                                                      │
│  • Store failed messages in IndexedDB                                       │
│  • Show retry button on failed message                                      │
│  • On app start, check for pending messages                                │
│  • Automatically retry when reconnected                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Media Optimization

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       MEDIA OPTIMIZATION                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Upload Flow:                                                               │
│  ────────────                                                                │
│  1. User selects image                                                      │
│  2. Client generates thumbnail (canvas)                                    │
│  3. Show thumbnail immediately (optimistic)                                │
│  4. Upload original to S3 via presigned URL                               │
│  5. Server processes: resize, compress, generate thumbnails               │
│  6. Update message with final URLs                                         │
│                                                                              │
│  Image Sizes:                                                               │
│  ────────────                                                                │
│  • Thumbnail: 100x100 (chat list preview)                                  │
│  • Preview: 400x400 (in-chat display)                                      │
│  • Full: 1920xAuto (on click/zoom)                                         │
│                                                                              │
│  Lazy Loading:                                                              │
│  ─────────────                                                               │
│  • Only load images in viewport                                            │
│  • Use Intersection Observer                                                │
│  • Show blur-up placeholder while loading                                  │
│                                                                              │
│  Progressive Loading:                                                       │
│  ────────────────────                                                        │
│  • Load thumbnail first (fast)                                             │
│  • Fade in full image when ready                                           │
│                                                                              │
│  Formats:                                                                   │
│  ────────                                                                    │
│  • WebP for modern browsers (30% smaller)                                  │
│  • JPEG fallback                                                            │
│  • AVIF for latest browsers (50% smaller)                                  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Error Handling & Edge Cases

### Connection Failure Handling

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    CONNECTION FAILURE HANDLING                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Scenario 1: WebSocket Disconnects Mid-Chat                                │
│  ──────────────────────────────────────────                                  │
│  • Show "Connecting..." banner                                              │
│  • Queue outgoing messages locally                                          │
│  • Reconnect with exponential backoff                                       │
│  • On reconnect:                                                            │
│    - Fetch messages since last known timestamp                             │
│    - Send queued messages                                                   │
│    - Re-subscribe to presence channels                                     │
│                                                                              │
│  Scenario 2: Send Fails                                                     │
│  ──────────────────────                                                      │
│  • Mark message as "failed"                                                 │
│  • Show retry button                                                        │
│  • Persist to IndexedDB for later retry                                    │
│  • On reconnect, auto-retry pending messages                               │
│                                                                              │
│  Scenario 3: App Backgrounded (Mobile Web)                                 │
│  ─────────────────────────────────────────                                   │
│  • WebSocket may close                                                      │
│  • On foreground:                                                           │
│    - Check connection state                                                 │
│    - Reconnect if needed                                                    │
│    - Sync missed messages                                                   │
│                                                                              │
│  Scenario 4: Offline Mode                                                   │
│  ────────────────────────                                                    │
│  • Show offline banner                                                      │
│  • Allow viewing cached messages                                            │
│  • Queue sends in IndexedDB                                                 │
│  • Sync when back online                                                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Edge Cases

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EDGE CASES                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. Message Ordering                                                        │
│     • Use TIMEUUID for server-side ordering                                │
│     • Display by server timestamp, not client timestamp                    │
│     • Handle late-arriving messages (insert in correct position)           │
│                                                                              │
│  2. Duplicate Messages                                                      │
│     • Idempotency key (tempId) prevents duplicates                         │
│     • Server checks if tempId already processed                            │
│     • Client deduplicates by messageId                                     │
│                                                                              │
│  3. Large Group Messages                                                    │
│     • Batch delivery receipts (every 5 seconds)                            │
│     • Don't show individual read receipts in large groups                  │
│     • Limit typing indicators to "X people typing..."                      │
│                                                                              │
│  4. Multi-Device Sync                                                       │
│     • Each device has separate WebSocket                                   │
│     • Server broadcasts to all user's devices                              │
│     • Sync read status across devices                                      │
│                                                                              │
│  5. Time Sync Issues                                                        │
│     • Client clock may be wrong                                            │
│     • Use server timestamp for ordering                                    │
│     • Display relative time ("2 min ago") to hide discrepancies           │
│                                                                              │
│  6. Media Upload Failures                                                   │
│     • Resumable uploads (tus protocol)                                     │
│     • Retry with exponential backoff                                       │
│     • Show progress and allow cancel                                       │
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
│  Q: Why WebSocket instead of Long Polling?                                  │
│  A: • Chat requires bi-directional real-time (send AND receive)            │
│     • Typing indicators would flood long polling                           │
│     • Single persistent connection more efficient                          │
│     • Sub-100ms latency vs 30s worst case                                  │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: Why Cassandra instead of PostgreSQL for messages?                       │
│  A: • 25 billion messages/day needs horizontal write scaling               │
│     • PostgreSQL can't scale writes (single master)                        │
│     • Cassandra: linear scaling by adding nodes                            │
│     • Time-series access pattern (messages by chat + time)                 │
│     • Tunable consistency (ONE for speed, acceptable for chat)             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you ensure message delivery guarantee?                           │
│  A: • At-least-once: Retry until ack received                              │
│     • Idempotency key (tempId) prevents duplicates                        │
│     • Persistent queue for offline recipients                             │
│     • Message stored in DB before ack sent                                 │
│     • Push notification as backup if WS disconnected                      │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you handle millions of concurrent WebSocket connections?        │
│  A: • Horizontal scaling of WS gateway servers                             │
│     • Redis Pub/Sub for cross-server message routing                      │
│     • Sticky sessions (but handle failover)                               │
│     • Each server handles ~100K connections                               │
│     • 100M users → ~1000 WS gateway instances                             │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you implement end-to-end encryption?                             │
│  A: • Signal Protocol (used by WhatsApp)                                   │
│     • Key exchange: X3DH (Extended Triple Diffie-Hellman)                  │
│     • Message encryption: Double Ratchet Algorithm                        │
│     • Keys stored on device only, not server                              │
│     • Server stores only encrypted blobs                                   │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you handle message ordering across devices?                      │
│  A: • TIMEUUID guarantees ordering (timestamp + random)                    │
│     • Server is source of truth                                            │
│     • Client displays by server timestamp                                  │
│     • Late messages inserted in correct position                          │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: How do you implement typing indicators efficiently?                     │
│  A: • Debounce: Send "typing" only after 300ms of typing                   │
│     • Auto-timeout: 3 seconds of no typing → stop                         │
│     • Redis Pub/Sub (ephemeral, don't persist)                            │
│     • Don't store in DB                                                     │
│     • Throttle on receiver side too                                        │
│                                                                              │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Q: What metrics would you track?                                           │
│  A: • Message latency (send to deliver)                                    │
│     • WebSocket connection success rate                                    │
│     • Reconnection frequency                                               │
│     • Message delivery rate (sent vs delivered)                           │
│     • API response times                                                    │
│     • Error rates by type                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Accessibility (A11y)

### Chat Accessibility Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    ACCESSIBLE CHAT INTERFACE                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Screen Reader Announcements:                                               │
│  ────────────────────────────                                                │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ARIA Live Regions for Real-time Content                           │   │
│  │                                                                      │   │
│  │  <!-- New message announcements -->                                 │   │
│  │  <div aria-live="polite" aria-atomic="false" class="sr-only">      │   │
│  │    <!-- Dynamically inserted: "John: Hello, how are you?" -->      │   │
│  │  </div>                                                              │   │
│  │                                                                      │   │
│  │  <!-- Typing indicator -->                                          │   │
│  │  <div aria-live="polite" aria-atomic="true" class="sr-only">       │   │
│  │    <!-- "John is typing" or empty -->                               │   │
│  │  </div>                                                              │   │
│  │                                                                      │   │
│  │  <!-- Connection status -->                                         │   │
│  │  <div aria-live="assertive" class="sr-only">                        │   │
│  │    <!-- "Connection lost. Reconnecting..." -->                      │   │
│  │  </div>                                                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Why Different aria-live Values:                                            │
│  • polite: New messages (don't interrupt current reading)                  │
│  • assertive: Connection issues (important, announce immediately)          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Accessible Message Component

```jsx
// AccessibleMessage.jsx
const AccessibleMessage = ({ message, isOwn, status }) => {
  const statusLabels = {
    pending: "Sending",
    sent: "Sent",
    delivered: "Delivered",
    read: "Read",
    failed: "Failed to send",
  };

  return (
    <article
      role="article"
      aria-label={`Message from ${message.senderName}`}
      className={`message ${isOwn ? "message--own" : "message--other"}`}
    >
      <div className="message__content">
        {message.type === "text" && <p>{message.text}</p>}

        {message.type === "image" && (
          <img
            src={message.imageUrl}
            alt={message.altText || "Shared image"}
            // Allow zoom for low vision users
            style={{ maxWidth: "100%", cursor: "zoom-in" }}
          />
        )}

        {message.type === "voice" && (
          <VoiceMessage
            src={message.audioUrl}
            duration={message.duration}
            // Transcript for deaf/hard of hearing
            transcript={message.transcript}
          />
        )}
      </div>

      <footer className="message__meta">
        <time
          dateTime={message.timestamp}
          aria-label={formatTimeForScreenReader(message.timestamp)}
        >
          {formatTime(message.timestamp)}
        </time>

        {isOwn && (
          <span className="message__status" aria-label={statusLabels[status]}>
            <StatusIcon status={status} aria-hidden="true" />
          </span>
        )}
      </footer>
    </article>
  );
};

// Voice message with transcript
const VoiceMessage = ({ src, duration, transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  return (
    <div className="voice-message">
      <button
        aria-label={isPlaying ? "Pause voice message" : "Play voice message"}
        aria-pressed={isPlaying}
        onClick={() => {
          if (isPlaying) {
            audioRef.current.pause();
          } else {
            audioRef.current.play();
          }
          setIsPlaying(!isPlaying);
        }}
      >
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <audio ref={audioRef} src={src} onEnded={() => setIsPlaying(false)} />

      <span aria-label={`Duration: ${duration} seconds`}>
        {formatDuration(duration)}
      </span>

      {/* Transcript for accessibility */}
      {transcript && (
        <details className="voice-message__transcript">
          <summary>Show transcript</summary>
          <p>{transcript}</p>
        </details>
      )}
    </div>
  );
};
```

### Keyboard Navigation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      KEYBOARD NAVIGATION MAP                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Global Shortcuts:                                                          │
│  ─────────────────                                                           │
│  Ctrl/Cmd + K        → Search conversations                                 │
│  Ctrl/Cmd + N        → New chat                                             │
│  Ctrl/Cmd + Shift+M  → Mute/unmute notifications                           │
│  Escape              → Close modal/overlay                                  │
│                                                                              │
│  Conversation List:                                                         │
│  ──────────────────                                                          │
│  ↑/↓                 → Navigate conversations                               │
│  Enter               → Open selected conversation                           │
│  Delete/Backspace    → Archive conversation (with confirmation)            │
│  Tab                 → Move to chat window                                  │
│                                                                              │
│  Chat Window:                                                               │
│  ─────────────                                                               │
│  Tab                 → Cycle: Messages → Input → Send button               │
│  Shift+Tab           → Reverse cycle                                        │
│  ↑/↓ (in messages)   → Navigate between messages                           │
│  Enter (on message)  → Open message actions menu                           │
│  R                   → Reply to focused message                             │
│  F                   → Forward focused message                              │
│                                                                              │
│  Message Input:                                                             │
│  ───────────────                                                             │
│  Enter               → Send message                                         │
│  Shift+Enter         → New line                                             │
│  Ctrl/Cmd + E        → Open emoji picker                                   │
│  Ctrl/Cmd + U        → Attach file                                         │
│  Escape              → Clear input / Close picker                          │
│                                                                              │
│  Emoji Picker:                                                              │
│  ─────────────                                                               │
│  ↑/↓/←/→             → Navigate emojis                                      │
│  Enter               → Select emoji                                         │
│  Tab                 → Switch category                                      │
│  Type                → Search emojis                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Focus Management

```jsx
// useFocusManagement.js
const useChatFocus = () => {
  const messageInputRef = useRef(null);
  const messageListRef = useRef(null);
  const lastFocusedMessage = useRef(null);

  // Focus input when chat opens
  useEffect(() => {
    if (messageInputRef.current) {
      messageInputRef.current.focus();
    }
  }, [selectedChatId]);

  // Trap focus in modals
  const trapFocus = useCallback((modalRef) => {
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    modalRef.current.addEventListener("keydown", handleKeyDown);
    firstElement?.focus();

    return () => {
      modalRef.current?.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Restore focus after modal closes
  const restoreFocus = useCallback(() => {
    lastFocusedMessage.current?.focus();
  }, []);

  // Scroll new messages into view without losing focus
  const announceNewMessage = useCallback((message) => {
    // Don't steal focus, just announce
    const announcement = document.getElementById("message-announcer");
    if (announcement) {
      announcement.textContent = `${message.senderName}: ${message.text}`;
    }
  }, []);

  return {
    messageInputRef,
    messageListRef,
    trapFocus,
    restoreFocus,
    announceNewMessage,
  };
};
```

### Color and Visual Accessibility

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    COLOR & VISUAL ACCESSIBILITY                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Message Status (Not Color-Only):                                           │
│  ─────────────────────────────────                                           │
│                                                                              │
│  ❌ Bad: Only color difference                                              │
│     • Sent: gray checkmark                                                  │
│     • Read: blue checkmark                                                  │
│                                                                              │
│  ✅ Good: Color + Shape/Text                                                │
│     • Pending: 🕐 clock icon                                                │
│     • Sent: ✓ single checkmark                                              │
│     • Delivered: ✓✓ double checkmark                                        │
│     • Read: ✓✓ filled/bold checkmarks + "Read" on hover/focus             │
│     • Failed: ⚠️ warning icon + "Retry" text                               │
│                                                                              │
│  Online Status:                                                             │
│  ──────────────                                                              │
│     • Online: Green dot + "Online" text                                     │
│     • Away: Yellow dot + "Away" text                                        │
│     • Offline: No dot + "Last seen..." text                                │
│                                                                              │
│  Unread Messages:                                                           │
│  ────────────────                                                            │
│     • Badge with count (not just color)                                     │
│     • Bold conversation name                                                │
│     • Screen reader: "3 unread messages"                                   │
│                                                                              │
│  High Contrast Mode:                                                        │
│  ───────────────────                                                         │
│  @media (prefers-contrast: high) {                                         │
│    .message--own { border: 2px solid #000; }                               │
│    .message--other { border: 2px solid #333; }                             │
│    .unread-badge { outline: 2px solid #000; }                              │
│  }                                                                          │
│                                                                              │
│  Reduced Motion:                                                            │
│  ───────────────                                                             │
│  @media (prefers-reduced-motion: reduce) {                                 │
│    .typing-indicator { animation: none; }                                  │
│    .message-enter { transition: none; }                                    │
│    .notification { animation: none; }                                      │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 13. Security Deep Dive

### End-to-End Encryption Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    END-TO-END ENCRYPTION (Signal Protocol)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Key Components:                                                            │
│  ───────────────                                                             │
│                                                                              │
│  1. Identity Key Pair (Long-term)                                          │
│     • Generated on first app install                                        │
│     • Never changes (unless reinstall)                                      │
│     • Public key registered with server                                     │
│                                                                              │
│  2. Signed Pre-Key (Medium-term)                                           │
│     • Rotated periodically (e.g., weekly)                                  │
│     • Signed by identity key                                                │
│                                                                              │
│  3. One-Time Pre-Keys (Ephemeral)                                          │
│     • Batch of 100 keys uploaded to server                                 │
│     • Each used once, then discarded                                        │
│     • Provides forward secrecy                                              │
│                                                                              │
│  4. Session Keys (Per conversation)                                        │
│     • Derived using X3DH key exchange                                       │
│     • Ratcheted with each message                                          │
│                                                                              │
│                                                                              │
│  X3DH Key Exchange (Initial Setup):                                        │
│  ───────────────────────────────────                                         │
│                                                                              │
│   Alice                           Server                          Bob       │
│     │                               │                              │        │
│     │  1. Fetch Bob's key bundle    │                              │        │
│     │──────────────────────────────>│                              │        │
│     │                               │                              │        │
│     │  ┌───────────────────────┐    │                              │        │
│     │  │ Bob's Bundle:         │    │                              │        │
│     │  │ • Identity Key (IKb)  │    │                              │        │
│     │  │ • Signed Pre-Key (SPK)│    │                              │        │
│     │  │ • One-Time Key (OPK)  │    │                              │        │
│     │  └───────────────────────┘    │                              │        │
│     │<──────────────────────────────│                              │        │
│     │                               │                              │        │
│     │  2. Compute shared secret:                                   │        │
│     │     DH1 = DH(IKa, SPKb)                                      │        │
│     │     DH2 = DH(EKa, IKb)                                       │        │
│     │     DH3 = DH(EKa, SPKb)                                      │        │
│     │     DH4 = DH(EKa, OPKb)                                      │        │
│     │     SK = KDF(DH1 || DH2 || DH3 || DH4)                       │        │
│     │                               │                              │        │
│     │  3. Send encrypted message    │                              │        │
│     │     + Ephemeral Key (EKa)     │                              │        │
│     │──────────────────────────────>│─────────────────────────────>│        │
│     │                               │                              │        │
│     │                               │  4. Bob derives same SK      │        │
│     │                               │     Decrypts message         │        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Encryption Implementation

```jsx
// encryption/SignalProtocol.js
import {
  KeyHelper,
  SignalProtocolAddress,
  SessionBuilder,
} from "@aspect/signal";

class E2EEncryption {
  constructor(userId) {
    this.userId = userId;
    this.store = new SignalProtocolStore(); // IndexedDB backed
  }

  // Generate keys on first install
  async generateIdentity() {
    const identityKeyPair = await KeyHelper.generateIdentityKeyPair();
    const registrationId = KeyHelper.generateRegistrationId();
    const signedPreKey = await KeyHelper.generateSignedPreKey(
      identityKeyPair,
      1,
    );
    const preKeys = await KeyHelper.generatePreKeys(1, 100);

    // Store locally (encrypted with device key)
    await this.store.storeIdentityKeyPair(identityKeyPair);
    await this.store.storeRegistrationId(registrationId);
    await this.store.storeSignedPreKey(signedPreKey);

    for (const preKey of preKeys) {
      await this.store.storePreKey(preKey.keyId, preKey.keyPair);
    }

    // Upload public keys to server
    return {
      identityKey: identityKeyPair.pubKey,
      registrationId,
      signedPreKey: {
        keyId: signedPreKey.keyId,
        publicKey: signedPreKey.keyPair.pubKey,
        signature: signedPreKey.signature,
      },
      preKeys: preKeys.map((pk) => ({
        keyId: pk.keyId,
        publicKey: pk.keyPair.pubKey,
      })),
    };
  }

  // Encrypt message for recipient
  async encryptMessage(recipientId, plaintext) {
    const address = new SignalProtocolAddress(recipientId, 1);
    const sessionCipher = new SessionCipher(this.store, address);

    const ciphertext = await sessionCipher.encrypt(
      new TextEncoder().encode(plaintext),
    );

    return {
      type: ciphertext.type, // 1 = PreKey, 3 = Normal
      body: arrayBufferToBase64(ciphertext.body),
    };
  }

  // Decrypt received message
  async decryptMessage(senderId, ciphertext) {
    const address = new SignalProtocolAddress(senderId, 1);
    const sessionCipher = new SessionCipher(this.store, address);

    let plaintext;
    if (ciphertext.type === 3) {
      // PreKeyWhisperMessage (first message)
      plaintext = await sessionCipher.decryptPreKeyWhisperMessage(
        base64ToArrayBuffer(ciphertext.body),
      );
    } else {
      // WhisperMessage (subsequent messages)
      plaintext = await sessionCipher.decryptWhisperMessage(
        base64ToArrayBuffer(ciphertext.body),
      );
    }

    return new TextDecoder().decode(plaintext);
  }
}
```

### XSS Prevention in Messages

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    XSS PREVENTION IN CHAT                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  CRITICAL: User messages can contain malicious content!                     │
│                                                                              │
│  Attack Vectors:                                                            │
│  ───────────────                                                             │
│  • <script>alert('xss')</script>                                           │
│  • <img src=x onerror="steal(document.cookie)">                            │
│  • javascript:alert('xss') in links                                        │
│  • <a href="data:text/html,<script>...</script>">                          │
│                                                                              │
│  Defense Layers:                                                            │
│  ───────────────                                                             │
│                                                                              │
│  1. Content Security Policy (CSP)                                          │
│     Content-Security-Policy:                                                │
│       default-src 'self';                                                   │
│       script-src 'self';                                                    │
│       style-src 'self' 'unsafe-inline';                                    │
│       img-src 'self' https://media.chat.app blob: data:;                   │
│       connect-src 'self' wss://chat.app;                                   │
│       frame-ancestors 'none';                                               │
│                                                                              │
│  2. React's Built-in Escaping                                              │
│     // ✅ Safe - React escapes by default                                  │
│     <p>{message.text}</p>                                                   │
│                                                                              │
│     // ❌ DANGEROUS - Never do this                                         │
│     <div dangerouslySetInnerHTML={{ __html: message.text }} />             │
│                                                                              │
│  3. URL Sanitization                                                        │
│     const sanitizeUrl = (url) => {                                         │
│       const parsed = new URL(url);                                         │
│       const allowed = ['http:', 'https:', 'mailto:'];                     │
│       if (!allowed.includes(parsed.protocol)) {                            │
│         return '#blocked';                                                  │
│       }                                                                     │
│       return url;                                                           │
│     };                                                                      │
│                                                                              │
│  4. Link Preview Sanitization                                              │
│     • Generate previews server-side                                        │
│     • Sanitize HTML with DOMPurify                                         │
│     • Validate image URLs                                                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Session Security

```jsx
// security/SessionManager.js
class SecureSessionManager {
  constructor() {
    this.SESSION_TIMEOUT = 30 * 24 * 60 * 60 * 1000; // 30 days
    this.IDLE_TIMEOUT = 30 * 60 * 1000; // 30 minutes
  }

  // Store session securely
  async storeSession(token, userData) {
    // Use httpOnly cookie for token (set by server)
    // Store non-sensitive data in encrypted IndexedDB
    const encryptedData = await this.encrypt(JSON.stringify(userData));
    await this.db.put("session", {
      data: encryptedData,
      expiresAt: Date.now() + this.SESSION_TIMEOUT,
    });
  }

  // Detect session hijacking
  validateSession(session) {
    const fingerprint = this.getDeviceFingerprint();
    if (session.fingerprint !== fingerprint) {
      this.logout();
      throw new Error("Session invalidated: device mismatch");
    }
  }

  // Handle idle timeout
  setupIdleDetection() {
    let idleTimer;

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        this.lockScreen(); // Require re-auth
      }, this.IDLE_TIMEOUT);
    };

    ["mousedown", "keydown", "scroll", "touchstart"].forEach((event) => {
      document.addEventListener(event, resetTimer, { passive: true });
    });

    resetTimer();
  }

  // Secure logout
  async logout() {
    // Clear all sensitive data
    await this.db.clear("session");
    await this.db.clear("messages"); // Clear cached messages
    await this.db.clear("keys"); // Clear encryption keys

    // Revoke token server-side
    await fetch("/api/auth/logout", { method: "POST" });

    // Clear memory
    this.encryptionKeys = null;

    // Redirect
    window.location.href = "/login";
  }
}
```

---

## 14. Mobile & Touch Considerations

### Touch Gestures

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TOUCH GESTURE SYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Message Gestures:                                                          │
│  ─────────────────                                                           │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                                                                      │   │
│  │   Swipe Right → Reply                                               │   │
│  │   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━>            │   │
│  │   ┌────────────────────────────────────────┐                        │   │
│  │   │  ↩️  "Hello, how are you?"             │                        │   │
│  │   └────────────────────────────────────────┘                        │   │
│  │                                                                      │   │
│  │   Long Press → Context Menu                                         │   │
│  │   ┌────────────────────────────────────────┐                        │   │
│  │   │  ⏱️ (500ms)                            │                        │   │
│  │   │  ┌─────────────────────────┐           │                        │   │
│  │   │  │ Reply                   │           │                        │   │
│  │   │  │ Forward                 │           │                        │   │
│  │   │  │ Copy                    │           │                        │   │
│  │   │  │ Delete                  │           │                        │   │
│  │   │  │ Star                    │           │                        │   │
│  │   │  └─────────────────────────┘           │                        │   │
│  │   └────────────────────────────────────────┘                        │   │
│  │                                                                      │   │
│  │   Double Tap → React with ❤️                                        │   │
│  │   ┌────────────────────────────────────────┐                        │   │
│  │   │  👆👆                                   │  → ❤️                 │   │
│  │   └────────────────────────────────────────┘                        │   │
│  │                                                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Conversation List Gestures:                                                │
│  ───────────────────────────                                                 │
│  • Swipe Left → Archive / Delete                                           │
│  • Swipe Right → Pin / Mark as read                                        │
│  • Pull Down → Refresh                                                      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Swipe to Reply Implementation

```jsx
// components/SwipeableMessage.jsx
import { useSpring, animated } from "@react-spring/web";
import { useDrag } from "@use-gesture/react";

const SwipeableMessage = ({ message, onReply }) => {
  const SWIPE_THRESHOLD = 80;
  const MAX_SWIPE = 100;

  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const [showReplyIcon, setShowReplyIcon] = useState(false);

  const bind = useDrag(
    ({ down, movement: [mx], velocity: [vx], direction: [dx], cancel }) => {
      // Only allow right swipe
      if (dx < 0) {
        cancel();
        return;
      }

      if (down) {
        // Clamp movement
        const clampedX = Math.min(mx, MAX_SWIPE);
        api.start({ x: clampedX, immediate: true });
        setShowReplyIcon(clampedX > SWIPE_THRESHOLD * 0.5);
      } else {
        // Release
        if (mx > SWIPE_THRESHOLD || vx > 0.5) {
          // Trigger reply
          onReply(message);
          // Haptic feedback
          if (navigator.vibrate) {
            navigator.vibrate(50);
          }
        }
        // Spring back
        api.start({ x: 0 });
        setShowReplyIcon(false);
      }
    },
    {
      axis: "x",
      bounds: { left: 0, right: MAX_SWIPE },
      rubberband: true,
    },
  );

  return (
    <div className="swipeable-message-container">
      {/* Reply icon that appears during swipe */}
      <animated.div
        className="reply-icon"
        style={{
          opacity: x.to([0, SWIPE_THRESHOLD], [0, 1]),
          transform: x.to((v) => `scale(${Math.min(v / SWIPE_THRESHOLD, 1)})`),
        }}
      >
        <ReplyIcon />
      </animated.div>

      {/* Swipeable message */}
      <animated.div
        {...bind()}
        style={{ x, touchAction: "pan-y" }}
        className="message-bubble"
      >
        <MessageContent message={message} />
      </animated.div>
    </div>
  );
};
```

### Virtual Keyboard Handling

```jsx
// hooks/useVirtualKeyboard.js
const useVirtualKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    // Modern API (Chrome 94+)
    if ("virtualKeyboard" in navigator) {
      navigator.virtualKeyboard.overlaysContent = true;

      navigator.virtualKeyboard.addEventListener("geometrychange", (e) => {
        const { height } = e.target.boundingRect;
        setKeyboardHeight(height);
        setIsKeyboardVisible(height > 0);
      });
      return;
    }

    // Fallback: VisualViewport API
    if (window.visualViewport) {
      const handleResize = () => {
        const heightDiff = window.innerHeight - window.visualViewport.height;
        setKeyboardHeight(Math.max(0, heightDiff));
        setIsKeyboardVisible(heightDiff > 100);
      };

      window.visualViewport.addEventListener("resize", handleResize);
      window.visualViewport.addEventListener("scroll", handleResize);

      return () => {
        window.visualViewport.removeEventListener("resize", handleResize);
        window.visualViewport.removeEventListener("scroll", handleResize);
      };
    }
  }, []);

  return { keyboardHeight, isKeyboardVisible };
};

// Usage in ChatWindow
const ChatWindow = () => {
  const { keyboardHeight, isKeyboardVisible } = useVirtualKeyboard();
  const messageListRef = useRef(null);

  // Scroll to bottom when keyboard opens
  useEffect(() => {
    if (isKeyboardVisible && messageListRef.current) {
      messageListRef.current.scrollToEnd({ animated: true });
    }
  }, [isKeyboardVisible]);

  return (
    <div
      className="chat-window"
      style={{
        paddingBottom: keyboardHeight,
        transition: "padding-bottom 0.2s ease",
      }}
    >
      <MessageList ref={messageListRef} />
      <MessageInput />
    </div>
  );
};
```

### Mobile-Optimized Media

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    MOBILE MEDIA OPTIMIZATION                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Image Capture:                                                             │
│  ──────────────                                                              │
│  <input
│    type="file"
│    accept="image/*"
│    capture="environment"   <!-- Use back camera -->
│  />                                                                          │
│                                                                              │
│  Camera UI (Custom):                                                        │
│  ───────────────────                                                         │
│  • Full-screen camera view                                                  │
│  • Pinch to zoom                                                            │
│  • Tap to focus                                                             │
│  • Flash toggle                                                             │
│  • Front/back camera switch                                                 │
│                                                                              │
│  Image Compression Before Upload:                                           │
│  ─────────────────────────────────                                           │
│  const compressImage = async (file, maxWidth = 1920) => {                  │
│    const img = await createImageBitmap(file);                              │
│    const canvas = new OffscreenCanvas(                                     │
│      Math.min(img.width, maxWidth),                                        │
│      Math.min(img.height, maxWidth * (img.height / img.width))             │
│    );                                                                       │
│    const ctx = canvas.getContext('2d');                                    │
│    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);                 │
│    return canvas.convertToBlob({ type: 'image/webp', quality: 0.8 });     │
│  };                                                                         │
│                                                                              │
│  Voice Message Recording:                                                   │
│  ────────────────────────                                                    │
│  • Hold to record (like WhatsApp)                                          │
│  • Swipe up to lock recording                                              │
│  • Swipe left to cancel                                                    │
│  • Waveform visualization                                                   │
│  • Use Opus codec for small size                                           │
│                                                                              │
│  Video Optimization:                                                        │
│  ───────────────────                                                         │
│  • Compress to 720p max for mobile upload                                  │
│  • Generate thumbnail on client                                            │
│  • Resumable upload (tus protocol)                                         │
│  • Background upload with progress                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 15. Comprehensive Testing Strategy

### Testing Pyramid for Chat App

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TESTING PYRAMID                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                            ╱╲                                                │
│                           ╱  ╲                                               │
│                          ╱ E2E╲         5-10 tests                          │
│                         ╱──────╲        (Critical flows)                    │
│                        ╱        ╲                                            │
│                       ╱Integration╲     50-100 tests                        │
│                      ╱────────────╲     (WebSocket, API)                    │
│                     ╱              ╲                                         │
│                    ╱   Unit Tests   ╲   500+ tests                          │
│                   ╱──────────────────╲  (Components, Utils)                 │
│                  ╱                    ╲                                      │
│                 ╱────────────────────────╲                                  │
│                                                                              │
│  Focus Areas:                                                               │
│  ────────────                                                                │
│  • Unit: Message rendering, encryption, date formatting                    │
│  • Integration: WebSocket connection, state management                     │
│  • E2E: Send/receive messages, login flow, media upload                    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Unit Tests

```jsx
// __tests__/components/MessageBubble.test.jsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MessageBubble } from "../MessageBubble";

describe("MessageBubble", () => {
  const mockMessage = {
    id: "msg-1",
    text: "Hello, world!",
    senderId: "user-1",
    timestamp: "2024-12-22T10:30:00Z",
    status: "sent",
  };

  it("renders text message correctly", () => {
    render(<MessageBubble message={mockMessage} isOwn={true} />);

    expect(screen.getByText("Hello, world!")).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveClass("message--own");
  });

  it("displays correct status icon", () => {
    const { rerender } = render(
      <MessageBubble
        message={{ ...mockMessage, status: "pending" }}
        isOwn={true}
      />,
    );
    expect(screen.getByLabelText("Sending")).toBeInTheDocument();

    rerender(
      <MessageBubble
        message={{ ...mockMessage, status: "delivered" }}
        isOwn={true}
      />,
    );
    expect(screen.getByLabelText("Delivered")).toBeInTheDocument();

    rerender(
      <MessageBubble
        message={{ ...mockMessage, status: "read" }}
        isOwn={true}
      />,
    );
    expect(screen.getByLabelText("Read")).toBeInTheDocument();
  });

  it("shows retry button for failed messages", async () => {
    const onRetry = jest.fn();
    render(
      <MessageBubble
        message={{ ...mockMessage, status: "failed" }}
        isOwn={true}
        onRetry={onRetry}
      />,
    );

    const retryButton = screen.getByRole("button", { name: /retry/i });
    await userEvent.click(retryButton);

    expect(onRetry).toHaveBeenCalledWith("msg-1");
  });

  it("handles long messages with word wrap", () => {
    const longMessage = {
      ...mockMessage,
      text: "A".repeat(1000),
    };

    render(<MessageBubble message={longMessage} isOwn={true} />);

    const messageElement = screen.getByText(/A+/);
    expect(messageElement).toHaveStyle({ wordWrap: "break-word" });
  });

  it("escapes HTML in message text (XSS prevention)", () => {
    const xssMessage = {
      ...mockMessage,
      text: '<script>alert("xss")</script>',
    };

    render(<MessageBubble message={xssMessage} isOwn={false} />);

    // Should display as text, not execute
    expect(
      screen.getByText('<script>alert("xss")</script>'),
    ).toBeInTheDocument();
    expect(document.querySelector("script")).not.toBeInTheDocument();
  });
});

// __tests__/utils/encryption.test.js
describe("E2E Encryption", () => {
  it("encrypts and decrypts message correctly", async () => {
    const alice = new E2EEncryption("alice");
    const bob = new E2EEncryption("bob");

    // Exchange keys
    const aliceKeys = await alice.generateIdentity();
    const bobKeys = await bob.generateIdentity();

    await alice.establishSession("bob", bobKeys);
    await bob.establishSession("alice", aliceKeys);

    // Alice sends to Bob
    const plaintext = "Hello, Bob!";
    const ciphertext = await alice.encryptMessage("bob", plaintext);
    const decrypted = await bob.decryptMessage("alice", ciphertext);

    expect(decrypted).toBe(plaintext);
  });

  it("provides forward secrecy (old keys cannot decrypt new messages)", async () => {
    // After key ratchet, old session keys should not work
    // ... test implementation
  });
});
```

### WebSocket Integration Tests

```jsx
// __tests__/integration/websocket.test.js
import { renderHook, act, waitFor } from "@testing-library/react";
import WS from "jest-websocket-mock";
import { useWebSocket } from "../hooks/useWebSocket";
import { WebSocketProvider } from "../providers/WebSocketProvider";

describe("WebSocket Integration", () => {
  let server;

  beforeEach(() => {
    server = new WS("wss://chat.example.com/ws");
  });

  afterEach(() => {
    WS.clean();
  });

  it("connects and authenticates successfully", async () => {
    const { result } = renderHook(() => useWebSocket(), {
      wrapper: ({ children }) => (
        <WebSocketProvider token="valid-token">{children}</WebSocketProvider>
      ),
    });

    await server.connected;

    expect(result.current.status).toBe("connected");
  });

  it("receives and processes incoming messages", async () => {
    const onMessage = jest.fn();

    renderHook(() => useWebSocket({ onMessage }), {
      wrapper: WebSocketProvider,
    });

    await server.connected;

    act(() => {
      server.send(
        JSON.stringify({
          type: "message",
          messageId: "msg-123",
          chatId: "chat-456",
          senderId: "user-789",
          content: { type: "text", text: "Hello!" },
          timestamp: "2024-12-22T10:30:00Z",
        }),
      );
    });

    await waitFor(() => {
      expect(onMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "message",
          messageId: "msg-123",
        }),
      );
    });
  });

  it("sends message and receives acknowledgment", async () => {
    const { result } = renderHook(() => useWebSocket(), {
      wrapper: WebSocketProvider,
    });

    await server.connected;

    // Send message
    let sendPromise;
    act(() => {
      sendPromise = result.current.sendMessage({
        chatId: "chat-456",
        content: { type: "text", text: "Hello!" },
      });
    });

    // Verify message sent
    await expect(server).toReceiveMessage(
      expect.stringContaining('"type":"message"'),
    );

    // Send ack
    act(() => {
      server.send(
        JSON.stringify({
          type: "message_ack",
          tempId: "temp-123",
          messageId: "server-msg-id",
          status: "sent",
        }),
      );
    });

    await expect(sendPromise).resolves.toEqual({
      messageId: "server-msg-id",
      status: "sent",
    });
  });

  it("reconnects with exponential backoff", async () => {
    const { result } = renderHook(() => useWebSocket(), {
      wrapper: WebSocketProvider,
    });

    await server.connected;

    // Simulate disconnect
    act(() => {
      server.close();
    });

    expect(result.current.status).toBe("reconnecting");

    // Create new server for reconnection
    server = new WS("wss://chat.example.com/ws");

    await waitFor(
      () => {
        expect(result.current.status).toBe("connected");
      },
      { timeout: 5000 },
    );
  });

  it("queues messages during disconnect", async () => {
    const { result } = renderHook(() => useWebSocket(), {
      wrapper: WebSocketProvider,
    });

    await server.connected;
    server.close();

    // Send while disconnected
    act(() => {
      result.current.sendMessage({
        chatId: "chat-456",
        content: { type: "text", text: "Queued message" },
      });
    });

    expect(result.current.queuedMessages).toHaveLength(1);

    // Reconnect
    server = new WS("wss://chat.example.com/ws");
    await server.connected;

    // Should send queued message
    await expect(server).toReceiveMessage(
      expect.stringContaining("Queued message"),
    );
  });
});
```

### E2E Tests

```jsx
// e2e/chat.spec.ts (Playwright)
import { test, expect } from "@playwright/test";

test.describe("Chat Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('[name="phone"]', "+1234567890");
    await page.click('button[type="submit"]');
    await page.fill('[name="otp"]', "123456");
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL("/chats");
  });

  test("sends and receives text message", async ({ page, context }) => {
    // Open second browser for recipient
    const recipientPage = await context.newPage();
    await recipientPage.goto("/login");
    // ... login as recipient

    // Sender: Select chat and send message
    await page.click('[data-testid="chat-item-user-456"]');
    await page.fill('[data-testid="message-input"]', "Hello from E2E test!");
    await page.click('[data-testid="send-button"]');

    // Verify message appears for sender with pending status
    const senderMessage = page.locator('[data-testid="message"]:last-child');
    await expect(senderMessage).toContainText("Hello from E2E test!");
    await expect(
      senderMessage.locator('[data-testid="status-pending"]'),
    ).toBeVisible();

    // Wait for sent status
    await expect(
      senderMessage.locator('[data-testid="status-sent"]'),
    ).toBeVisible();

    // Verify message appears for recipient
    await recipientPage.click('[data-testid="chat-item-user-123"]');
    const recipientMessage = recipientPage.locator(
      '[data-testid="message"]:last-child',
    );
    await expect(recipientMessage).toContainText("Hello from E2E test!");

    // Verify delivered status for sender
    await expect(
      senderMessage.locator('[data-testid="status-delivered"]'),
    ).toBeVisible();
  });

  test("uploads and displays image", async ({ page }) => {
    await page.click('[data-testid="chat-item-user-456"]');

    // Upload image
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles("./fixtures/test-image.jpg");

    // Wait for upload
    const imageMessage = page.locator(
      '[data-testid="message-image"]:last-child',
    );
    await expect(imageMessage).toBeVisible();
    await expect(imageMessage.locator("img")).toHaveAttribute(
      "src",
      /media\.chat\.app/,
    );
  });

  test("shows typing indicator", async ({ page, context }) => {
    const recipientPage = await context.newPage();
    // ... setup recipient

    // Sender starts typing
    await page.click('[data-testid="chat-item-user-456"]');
    await page.type('[data-testid="message-input"]', "Typing...");

    // Recipient should see typing indicator
    await recipientPage.click('[data-testid="chat-item-user-123"]');
    await expect(
      recipientPage.locator('[data-testid="typing-indicator"]'),
    ).toContainText("typing");
  });

  test("works offline and syncs on reconnect", async ({ page, context }) => {
    await page.click('[data-testid="chat-item-user-456"]');

    // Go offline
    await context.setOffline(true);

    // Send message while offline
    await page.fill('[data-testid="message-input"]', "Offline message");
    await page.click('[data-testid="send-button"]');

    // Should show pending status
    const message = page.locator('[data-testid="message"]:last-child');
    await expect(
      message.locator('[data-testid="status-pending"]'),
    ).toBeVisible();

    // Go back online
    await context.setOffline(false);

    // Should sync and show sent status
    await expect(message.locator('[data-testid="status-sent"]')).toBeVisible({
      timeout: 10000,
    });
  });
});
```

---

## 16. Offline Support & PWA

### Service Worker Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SERVICE WORKER ARCHITECTURE                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Caching Strategy:                                                          │
│  ─────────────────                                                           │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  ASSET TYPE        │  STRATEGY          │  CACHE NAME               │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  App Shell         │  Cache First       │  app-shell-v1             │   │
│  │  (HTML, JS, CSS)   │                    │                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  API Responses     │  Network First     │  api-cache-v1             │   │
│  │  (chats, messages) │  (fallback cache)  │                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  Media (images)    │  Cache First       │  media-cache-v1           │   │
│  │                    │  (stale-while-     │                           │   │
│  │                    │   revalidate)      │                           │   │
│  ├─────────────────────────────────────────────────────────────────────┤   │
│  │  User Avatars      │  Stale While       │  avatar-cache-v1          │   │
│  │                    │  Revalidate        │                           │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
│  Offline Message Queue:                                                     │
│  ──────────────────────                                                      │
│  • Pending messages stored in IndexedDB                                    │
│  • Background Sync API for automatic retry                                 │
│  • Periodic sync for status updates                                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Service Worker Implementation

```javascript
// service-worker.js
import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import {
  CacheFirst,
  NetworkFirst,
  StaleWhileRevalidate,
} from "workbox-strategies";
import { ExpirationPlugin } from "workbox-expiration";
import { BackgroundSyncPlugin } from "workbox-background-sync";

// Precache app shell
precacheAndRoute(self.__WB_MANIFEST);

// API calls: Network first, fall back to cache
registerRoute(
  ({ url }) => url.pathname.startsWith("/api/"),
  new NetworkFirst({
    cacheName: "api-cache-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 100,
        maxAgeSeconds: 24 * 60 * 60, // 1 day
      }),
    ],
    networkTimeoutSeconds: 5,
  }),
);

// Media: Cache first with stale-while-revalidate
registerRoute(
  ({ url }) => url.hostname === "media.chat.app",
  new CacheFirst({
    cacheName: "media-cache-v1",
    plugins: [
      new ExpirationPlugin({
        maxEntries: 500,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
      }),
    ],
  }),
);

// Background sync for failed message sends
const messageQueue = new BackgroundSyncPlugin("message-queue", {
  maxRetentionTime: 24 * 60, // 24 hours
});

registerRoute(
  ({ url }) => url.pathname === "/api/messages",
  new NetworkOnly({
    plugins: [messageQueue],
  }),
  "POST",
);

// Handle push notifications
self.addEventListener("push", (event) => {
  const data = event.data?.json() || {};

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/icons/icon-192.png",
      badge: "/icons/badge-72.png",
      tag: data.chatId, // Replace previous notification from same chat
      data: { chatId: data.chatId, messageId: data.messageId },
      actions: [
        { action: "reply", title: "Reply" },
        { action: "mark-read", title: "Mark as Read" },
      ],
    }),
  );
});

// Handle notification click
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const { chatId } = event.notification.data;

  if (event.action === "reply") {
    // Open chat with reply focus
    event.waitUntil(clients.openWindow(`/chat/${chatId}?focus=reply`));
  } else {
    // Open chat
    event.waitUntil(
      clients.matchAll({ type: "window" }).then((windowClients) => {
        // Focus existing window or open new
        for (const client of windowClients) {
          if (client.url.includes("/chat") && "focus" in client) {
            client.postMessage({ type: "NAVIGATE_CHAT", chatId });
            return client.focus();
          }
        }
        return clients.openWindow(`/chat/${chatId}`);
      }),
    );
  }
});
```

### IndexedDB Schema for Offline

```javascript
// db/ChatDatabase.js
import Dexie from "dexie";

class ChatDatabase extends Dexie {
  constructor() {
    super("ChatApp");

    this.version(1).stores({
      // Messages table
      messages: `
        ++id,
        messageId,
        chatId,
        senderId,
        timestamp,
        status,
        [chatId+timestamp]
      `,

      // Pending sends (offline queue)
      pendingMessages: `
        ++id,
        tempId,
        chatId,
        createdAt
      `,

      // Chats/Conversations
      chats: `
        chatId,
        lastActivityAt,
        unreadCount
      `,

      // User profiles (cached)
      users: `
        userId,
        updatedAt
      `,

      // Sync metadata
      syncState: `
        key
      `,
    });
  }

  // Store message (encrypted)
  async storeMessage(message, encryptionKey) {
    const encrypted = await encrypt(JSON.stringify(message), encryptionKey);
    await this.messages.put({
      messageId: message.messageId,
      chatId: message.chatId,
      senderId: message.senderId,
      timestamp: message.timestamp,
      status: message.status,
      encryptedContent: encrypted,
    });
  }

  // Get messages for chat
  async getMessages(chatId, limit = 50, before = null) {
    let query = this.messages
      .where("[chatId+timestamp]")
      .between([chatId, Dexie.minKey], [chatId, before || Dexie.maxKey]);

    const messages = await query.reverse().limit(limit).toArray();

    return messages.reverse();
  }

  // Queue message for sending
  async queueMessage(message) {
    await this.pendingMessages.add({
      tempId: message.tempId,
      chatId: message.chatId,
      content: message.content,
      createdAt: Date.now(),
    });
  }

  // Sync with server
  async sync(lastSyncTimestamp) {
    const response = await fetch(`/api/sync?since=${lastSyncTimestamp}`);
    const { messages, chats, syncTimestamp } = await response.json();

    await this.transaction(
      "rw",
      [this.messages, this.chats, this.syncState],
      async () => {
        for (const message of messages) {
          await this.messages.put(message);
        }
        for (const chat of chats) {
          await this.chats.put(chat);
        }
        await this.syncState.put({ key: "lastSync", value: syncTimestamp });
      },
    );
  }
}

export const db = new ChatDatabase();
```

---

## 17. Media Deep Dive

### Voice Message Recording

```jsx
// components/VoiceRecorder.jsx
import { useState, useRef, useEffect } from "react";

const VoiceRecorder = ({ onRecordComplete, onCancel }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [waveform, setWaveform] = useState([]);

  const mediaRecorder = useRef(null);
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 48000,
        },
      });

      // Setup audio analysis for waveform
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream);
      analyser.current = audioContext.current.createAnalyser();
      analyser.current.fftSize = 256;
      source.connect(analyser.current);

      // Use Opus codec for small file size
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      chunks.current = [];

      mediaRecorder.current.ondataavailable = (e) => {
        chunks.current.push(e.data);
      };

      mediaRecorder.current.onstop = async () => {
        const blob = new Blob(chunks.current, { type: mimeType });
        const arrayBuffer = await blob.arrayBuffer();
        const audioBuffer =
          await audioContext.current.decodeAudioData(arrayBuffer);

        onRecordComplete({
          blob,
          duration: audioBuffer.duration,
          waveform: generateWaveformData(audioBuffer),
        });

        // Cleanup
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.current.start(100); // Collect data every 100ms
      setIsRecording(true);

      // Update waveform visualization
      updateWaveform();
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  const updateWaveform = () => {
    if (!analyser.current || !isRecording) return;

    const dataArray = new Uint8Array(analyser.current.frequencyBinCount);
    analyser.current.getByteFrequencyData(dataArray);

    // Get average amplitude
    const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
    setWaveform((prev) => [...prev.slice(-50), average / 255]);

    requestAnimationFrame(updateWaveform);
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorder.current?.state === "recording") {
      mediaRecorder.current.stop();
      chunks.current = [];
      setIsRecording(false);
      onCancel();
    }
  };

  // Timer
  useEffect(() => {
    let interval;
    if (isRecording) {
      interval = setInterval(() => {
        setDuration((d) => d + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  return (
    <div className="voice-recorder">
      {isRecording ? (
        <>
          <button
            onClick={cancelRecording}
            className="cancel-btn"
            aria-label="Cancel recording"
          >
            <TrashIcon />
          </button>

          <div className="waveform">
            {waveform.map((amplitude, i) => (
              <div
                key={i}
                className="waveform-bar"
                style={{ height: `${amplitude * 100}%` }}
              />
            ))}
          </div>

          <span className="duration">{formatDuration(duration)}</span>

          <button
            onClick={stopRecording}
            className="stop-btn"
            aria-label="Stop recording and send"
          >
            <SendIcon />
          </button>
        </>
      ) : (
        <button
          onMouseDown={startRecording}
          onTouchStart={startRecording}
          className="record-btn"
          aria-label="Hold to record voice message"
        >
          <MicrophoneIcon />
        </button>
      )}
    </div>
  );
};
```

### Video Calling (WebRTC)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    VIDEO CALLING ARCHITECTURE                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  WebRTC Flow:                                                               │
│  ────────────                                                                │
│                                                                              │
│   Caller (Alice)              Signaling Server            Callee (Bob)      │
│        │                            │                          │            │
│        │  1. Create Offer           │                          │            │
│        │  (SDP with codec info)     │                          │            │
│        │                            │                          │            │
│        │───── Send Offer ──────────>│───── Forward Offer ─────>│            │
│        │                            │                          │            │
│        │                            │                    2. Create Answer   │
│        │                            │                                       │
│        │<──── Forward Answer ───────│<──── Send Answer ────────│            │
│        │                            │                          │            │
│        │  3. Exchange ICE Candidates                          │            │
│        │<────────────────────────────────────────────────────>│            │
│        │                            │                          │            │
│        │  4. Peer-to-Peer Connection Established              │            │
│        │<==================================================>│            │
│        │           (Video/Audio streams directly)             │            │
│                                                                              │
│  STUN/TURN Servers:                                                        │
│  ──────────────────                                                          │
│  • STUN: Discover public IP (for NAT traversal)                            │
│  • TURN: Relay when direct P2P fails (10-20% of calls)                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

```jsx
// hooks/useVideoCall.js
const useVideoCall = (userId, onCallEnd) => {
  const [callState, setCallState] = useState("idle"); // idle, ringing, connected
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const peerConnection = useRef(null);
  const { sendSignal, onSignal } = useWebSocket();

  const configuration = {
    iceServers: [
      { urls: "stun:stun.chat.app:3478" },
      {
        urls: "turn:turn.chat.app:3478",
        username: "user",
        credential: "pass",
      },
    ],
  };

  const startCall = async (isVideo = true) => {
    try {
      // Get local media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo
          ? {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user",
            }
          : false,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      setLocalStream(stream);

      // Create peer connection
      peerConnection.current = new RTCPeerConnection(configuration);

      // Add local tracks
      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      // Handle remote tracks
      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      // ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: "ice-candidate",
            candidate: event.candidate,
            to: userId,
          });
        }
      };

      // Create and send offer
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);

      sendSignal({
        type: "call-offer",
        sdp: offer,
        to: userId,
        isVideo,
      });

      setCallState("ringing");
    } catch (error) {
      console.error("Failed to start call:", error);
    }
  };

  const answerCall = async (offer, isVideo) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: isVideo,
        audio: true,
      });

      setLocalStream(stream);

      peerConnection.current = new RTCPeerConnection(configuration);

      stream.getTracks().forEach((track) => {
        peerConnection.current.addTrack(track, stream);
      });

      peerConnection.current.ontrack = (event) => {
        setRemoteStream(event.streams[0]);
      };

      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal({
            type: "ice-candidate",
            candidate: event.candidate,
            to: userId,
          });
        }
      };

      await peerConnection.current.setRemoteDescription(offer);
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);

      sendSignal({
        type: "call-answer",
        sdp: answer,
        to: userId,
      });

      setCallState("connected");
    } catch (error) {
      console.error("Failed to answer call:", error);
    }
  };

  const endCall = () => {
    localStream?.getTracks().forEach((track) => track.stop());
    peerConnection.current?.close();
    setLocalStream(null);
    setRemoteStream(null);
    setCallState("idle");
    onCallEnd();
  };

  const toggleMute = () => {
    const audioTrack = localStream?.getAudioTracks()[0];
    if (audioTrack) {
      audioTrack.enabled = !audioTrack.enabled;
    }
  };

  const toggleVideo = () => {
    const videoTrack = localStream?.getVideoTracks()[0];
    if (videoTrack) {
      videoTrack.enabled = !videoTrack.enabled;
    }
  };

  // Handle incoming signals
  useEffect(() => {
    const handleSignal = async (signal) => {
      switch (signal.type) {
        case "call-answer":
          await peerConnection.current.setRemoteDescription(signal.sdp);
          setCallState("connected");
          break;

        case "ice-candidate":
          await peerConnection.current.addIceCandidate(signal.candidate);
          break;

        case "call-end":
          endCall();
          break;
      }
    };

    return onSignal(handleSignal);
  }, []);

  return {
    callState,
    localStream,
    remoteStream,
    startCall,
    answerCall,
    endCall,
    toggleMute,
    toggleVideo,
  };
};
```

---

## 18. Internationalization (i18n)

### RTL Support

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    RTL (RIGHT-TO-LEFT) SUPPORT                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Languages Requiring RTL:                                                   │
│  ────────────────────────                                                    │
│  • Arabic (ar)                                                              │
│  • Hebrew (he)                                                              │
│  • Persian/Farsi (fa)                                                       │
│  • Urdu (ur)                                                                │
│                                                                              │
│  CSS Logical Properties:                                                    │
│  ───────────────────────                                                     │
│  ❌ Old (doesn't flip):           ✅ New (auto-flips):                     │
│     margin-left: 10px;               margin-inline-start: 10px;             │
│     padding-right: 20px;             padding-inline-end: 20px;              │
│     text-align: left;                text-align: start;                     │
│     left: 0;                         inset-inline-start: 0;                 │
│                                                                              │
│  Message Bubble Layout:                                                     │
│  ──────────────────────                                                      │
│                                                                              │
│  LTR Mode:                         RTL Mode:                               │
│  ┌────────────────────────┐       ┌────────────────────────┐               │
│  │         [Received msg] │       │ [Received msg]         │               │
│  │ [Sent msg]             │       │             [Sent msg] │               │
│  │         [Received msg] │       │ [Received msg]         │               │
│  └────────────────────────┘       └────────────────────────┘               │
│                                                                              │
│  Implementation:                                                            │
│  ───────────────                                                             │
│  .message-bubble {                                                          │
│    /* Auto-flip based on dir attribute */                                  │
│    margin-inline-start: auto;                                              │
│    border-start-start-radius: 16px;                                        │
│    border-start-end-radius: 16px;                                          │
│    border-end-start-radius: 4px;                                           │
│    border-end-end-radius: 16px;                                            │
│  }                                                                          │
│                                                                              │
│  .message-bubble--own {                                                     │
│    margin-inline-start: auto;                                              │
│    margin-inline-end: 0;                                                   │
│  }                                                                          │
│                                                                              │
│  .message-bubble--other {                                                   │
│    margin-inline-start: 0;                                                 │
│    margin-inline-end: auto;                                                │
│  }                                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### i18n Implementation

```jsx
// i18n/setup.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: {
      chat: {
        typing: "{{name}} is typing...",
        typingMultiple: "{{count}} people are typing...",
        online: "Online",
        offline: "Offline",
        lastSeen: "Last seen {{time}}",
        messageStatus: {
          pending: "Sending",
          sent: "Sent",
          delivered: "Delivered",
          read: "Read",
        },
        input: {
          placeholder: "Type a message",
          send: "Send",
        },
      },
      time: {
        justNow: "Just now",
        minutesAgo: "{{count}} minute ago",
        minutesAgo_plural: "{{count}} minutes ago",
        today: "Today",
        yesterday: "Yesterday",
      },
    },
  },
  ar: {
    translation: {
      chat: {
        typing: "{{name}} يكتب...",
        typingMultiple: "{{count}} أشخاص يكتبون...",
        online: "متصل",
        offline: "غير متصل",
        lastSeen: "آخر ظهور {{time}}",
        messageStatus: {
          pending: "جارٍ الإرسال",
          sent: "تم الإرسال",
          delivered: "تم التسليم",
          read: "تمت القراءة",
        },
        input: {
          placeholder: "اكتب رسالة",
          send: "إرسال",
        },
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

// Set document direction based on language
i18n.on("languageChanged", (lng) => {
  const rtlLanguages = ["ar", "he", "fa", "ur"];
  document.documentElement.dir = rtlLanguages.includes(lng) ? "rtl" : "ltr";
  document.documentElement.lang = lng;
});

export default i18n;
```

### Date/Time Localization

```jsx
// utils/dateFormatter.js
const formatMessageTime = (timestamp, locale) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  // Relative time for recent messages
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (diffMins < 1) {
    return i18n.t("time.justNow");
  }
  if (diffMins < 60) {
    return rtf.format(-diffMins, "minute");
  }
  if (diffHours < 24 && date.getDate() === now.getDate()) {
    return new Intl.DateTimeFormat(locale, {
      hour: "numeric",
      minute: "numeric",
    }).format(date);
  }
  if (diffDays === 1) {
    return i18n.t("time.yesterday");
  }
  if (diffDays < 7) {
    return new Intl.DateTimeFormat(locale, {
      weekday: "long",
    }).format(date);
  }

  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  }).format(date);
};

// Date separator in message list
const formatDateSeparator = (timestamp, locale) => {
  const date = new Date(timestamp);
  const now = new Date();

  if (isSameDay(date, now)) {
    return i18n.t("time.today");
  }
  if (isSameDay(date, new Date(now - 86400000))) {
    return i18n.t("time.yesterday");
  }

  return new Intl.DateTimeFormat(locale, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
  }).format(date);
};
```

---

## 19. Analytics & Observability

### Frontend Metrics

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    FRONTEND OBSERVABILITY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Key Metrics to Track:                                                      │
│  ─────────────────────                                                       │
│                                                                              │
│  Performance Metrics:                                                       │
│  • Message send latency (user click → server ack)                          │
│  • Message receive latency (server send → UI render)                       │
│  • WebSocket connection time                                                │
│  • Time to first message displayed                                         │
│  • Image/media load time                                                    │
│  • Scroll performance (FPS during scroll)                                  │
│                                                                              │
│  Reliability Metrics:                                                       │
│  • WebSocket disconnect frequency                                          │
│  • Reconnection success rate                                               │
│  • Message delivery failure rate                                           │
│  • Offline queue size                                                       │
│                                                                              │
│  User Experience Metrics:                                                   │
│  • Time spent typing before send                                           │
│  • Messages per session                                                     │
│  • Chat switch frequency                                                    │
│  • Feature usage (voice, video, media)                                     │
│                                                                              │
│  Error Metrics:                                                             │
│  • JavaScript errors by type                                               │
│  • Encryption failures                                                      │
│  • Media upload failures                                                    │
│  • API error rates                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Analytics Implementation

```jsx
// analytics/ChatAnalytics.js
class ChatAnalytics {
  constructor() {
    this.sessionId = generateUUID();
    this.messageTimings = new Map();
  }

  // Track message send latency
  startMessageSend(tempId) {
    this.messageTimings.set(tempId, {
      startTime: performance.now(),
      status: "pending",
    });
  }

  messageAcked(tempId, serverId) {
    const timing = this.messageTimings.get(tempId);
    if (timing) {
      const latency = performance.now() - timing.startTime;
      this.track("message_sent", {
        latency,
        messageId: serverId,
      });
      this.messageTimings.delete(tempId);
    }
  }

  messageFailed(tempId, error) {
    const timing = this.messageTimings.get(tempId);
    if (timing) {
      this.track("message_failed", {
        latency: performance.now() - timing.startTime,
        error: error.message,
      });
    }
  }

  // Track WebSocket health
  trackWebSocketEvent(event, data = {}) {
    this.track(`ws_${event}`, {
      ...data,
      timestamp: Date.now(),
    });
  }

  // Track user interactions
  trackChatOpened(chatId) {
    this.track("chat_opened", { chatId });
  }

  trackMediaShared(type, size) {
    this.track("media_shared", { type, size });
  }

  trackVoiceMessageRecorded(duration) {
    this.track("voice_message_recorded", { duration });
  }

  // Core tracking method
  track(event, properties = {}) {
    const payload = {
      event,
      properties: {
        ...properties,
        sessionId: this.sessionId,
        timestamp: Date.now(),
        platform: "web",
        userAgent: navigator.userAgent,
      },
    };

    // Send to analytics service
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", JSON.stringify(payload));
    } else {
      fetch("/api/analytics", {
        method: "POST",
        body: JSON.stringify(payload),
        keepalive: true,
      });
    }
  }
}

export const analytics = new ChatAnalytics();
```

### Error Tracking

```jsx
// monitoring/ErrorBoundary.jsx
import * as Sentry from "@sentry/react";

class ChatErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
        chatId: this.props.chatId,
      },
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-fallback">
          <h2>Something went wrong</h2>
          <p>We're having trouble loading this chat.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Global error handler
window.addEventListener("error", (event) => {
  Sentry.captureException(event.error, {
    extra: {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
    },
  });
});

// Unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
  Sentry.captureException(event.reason, {
    tags: { type: "unhandled_promise" },
  });
});
```

---

## 20. Notification System

### Web Push Implementation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    WEB PUSH NOTIFICATION FLOW                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   Browser              App Server           Push Service         Browser    │
│   (Tab open)                                (FCM/VAPID)          (Tab closed)│
│       │                    │                     │                    │     │
│       │ 1. Request         │                     │                    │     │
│       │    permission      │                     │                    │     │
│       │───────────────────>│                     │                    │     │
│       │                    │                     │                    │     │
│       │ 2. Subscribe to    │                     │                    │     │
│       │    push service    │                     │                    │     │
│       │────────────────────────────────────────>│                    │     │
│       │                    │                     │                    │     │
│       │ 3. Get subscription│                     │                    │     │
│       │    (endpoint + key)│                     │                    │     │
│       │<────────────────────────────────────────│                    │     │
│       │                    │                     │                    │     │
│       │ 4. Send subscription                    │                    │     │
│       │    to app server   │                     │                    │     │
│       │───────────────────>│                     │                    │     │
│       │                    │                     │                    │     │
│       │                    │ 5. Store subscription                   │     │
│       │                    │    (user → endpoint)                    │     │
│       │                    │                     │                    │     │
│       │   ─── Later: New message for user ───   │                    │     │
│       │                    │                     │                    │     │
│       │                    │ 6. Push message     │                    │     │
│       │                    │────────────────────>│                    │     │
│       │                    │                     │                    │     │
│       │                    │                     │ 7. Deliver to      │     │
│       │                    │                     │    Service Worker  │     │
│       │                    │                     │───────────────────>│     │
│       │                    │                     │                    │     │
│       │                    │                     │    8. Show         │     │
│       │                    │                     │    notification    │     │
│       │                    │                     │    ┌───────────┐   │     │
│       │                    │                     │    │ New msg   │   │     │
│       │                    │                     │    │ from John │   │     │
│       │                    │                     │    └───────────┘   │     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Push Subscription Management

```jsx
// notifications/PushManager.js
class PushNotificationManager {
  constructor() {
    this.vapidPublicKey = "YOUR_VAPID_PUBLIC_KEY";
  }

  async requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      await this.subscribe();
    }

    return permission;
  }

  async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check existing subscription
      let subscription = await registration.pushManager.getSubscription();

      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true, // Required by Chrome
          applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
        });
      }

      // Send subscription to server
      await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoint: subscription.endpoint,
          keys: {
            p256dh: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("p256dh")),
              ),
            ),
            auth: btoa(
              String.fromCharCode(
                ...new Uint8Array(subscription.getKey("auth")),
              ),
            ),
          },
        }),
      });

      return subscription;
    } catch (error) {
      console.error("Push subscription failed:", error);
      throw error;
    }
  }

  async unsubscribe() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      await fetch("/api/push/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint: subscription.endpoint }),
      });
    }
  }

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }

    return outputArray;
  }
}

export const pushManager = new PushNotificationManager();
```

### Desktop Notification with Actions

```jsx
// notifications/DesktopNotification.js
class DesktopNotificationManager {
  constructor() {
    this.notificationSound = new Audio("/sounds/message.mp3");
    this.enabled = true;
  }

  async showMessageNotification(message) {
    if (!this.enabled || document.hasFocus()) {
      return; // Don't show if app is focused
    }

    // Check permission
    if (Notification.permission !== "granted") {
      return;
    }

    // Play sound (respecting user preference)
    if (this.soundEnabled) {
      this.notificationSound.play().catch(() => {});
    }

    // Create notification
    const notification = new Notification(message.senderName, {
      body: this.getNotificationBody(message),
      icon: message.senderAvatar || "/icons/default-avatar.png",
      badge: "/icons/badge.png",
      tag: message.chatId, // Replace previous from same chat
      timestamp: new Date(message.timestamp).getTime(),
      requireInteraction: false,
      silent: true, // We handle sound ourselves
    });

    notification.onclick = () => {
      window.focus();
      navigateToChat(message.chatId);
      notification.close();
    };

    // Auto-close after 5 seconds
    setTimeout(() => notification.close(), 5000);
  }

  getNotificationBody(message) {
    switch (message.content.type) {
      case "text":
        return message.content.text.substring(0, 100);
      case "image":
        return "📷 Photo";
      case "video":
        return "🎥 Video";
      case "voice":
        return "🎤 Voice message";
      case "document":
        return `📄 ${message.content.fileName}`;
      default:
        return "New message";
    }
  }

  // Do Not Disturb support
  setDoNotDisturb(enabled) {
    this.enabled = !enabled;
    if (enabled) {
      this.soundEnabled = false;
    }
  }

  // Schedule DND
  scheduleDND(startHour, endHour) {
    const checkDND = () => {
      const hour = new Date().getHours();
      const inDNDWindow = startHour <= hour && hour < endHour;
      this.setDoNotDisturb(inDNDWindow);
    };

    checkDND();
    setInterval(checkDND, 60000); // Check every minute
  }
}

export const notificationManager = new DesktopNotificationManager();
```

---

## 21. Advanced Message Features

### Message Reactions

```jsx
// components/MessageReactions.jsx
const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

const MessageReactions = ({ messageId, reactions, onReact }) => {
  const [showPicker, setShowPicker] = useState(false);
  const currentUserId = useCurrentUser().id;

  // Group reactions by emoji
  const groupedReactions = useMemo(() => {
    const groups = {};
    reactions.forEach((reaction) => {
      if (!groups[reaction.emoji]) {
        groups[reaction.emoji] = [];
      }
      groups[reaction.emoji].push(reaction.userId);
    });
    return groups;
  }, [reactions]);

  const handleReact = async (emoji) => {
    const existingReaction = reactions.find(
      (r) => r.userId === currentUserId && r.emoji === emoji,
    );

    if (existingReaction) {
      // Remove reaction
      await onReact(messageId, emoji, "remove");
    } else {
      // Add reaction
      await onReact(messageId, emoji, "add");
    }

    setShowPicker(false);
  };

  return (
    <div className="message-reactions">
      {/* Display existing reactions */}
      <div className="reaction-bubbles">
        {Object.entries(groupedReactions).map(([emoji, userIds]) => (
          <button
            key={emoji}
            className={`reaction-bubble ${
              userIds.includes(currentUserId) ? "reaction-bubble--own" : ""
            }`}
            onClick={() => handleReact(emoji)}
            aria-label={`${emoji} reaction by ${userIds.length} people`}
          >
            <span className="emoji">{emoji}</span>
            <span className="count">{userIds.length}</span>
          </button>
        ))}
      </div>

      {/* Add reaction button */}
      <div className="add-reaction">
        <button
          className="add-reaction-btn"
          onClick={() => setShowPicker(!showPicker)}
          aria-label="Add reaction"
          aria-expanded={showPicker}
        >
          <SmileIcon />
        </button>

        {showPicker && (
          <div
            className="reaction-picker"
            role="menu"
            aria-label="Choose reaction"
          >
            {REACTION_EMOJIS.map((emoji) => (
              <button
                key={emoji}
                className="reaction-option"
                onClick={() => handleReact(emoji)}
                role="menuitem"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

### Reply Threading

```jsx
// components/ReplyPreview.jsx
const ReplyPreview = ({ replyToMessage, onClearReply }) => {
  return (
    <div className="reply-preview" role="status">
      <div className="reply-preview__indicator" />

      <div className="reply-preview__content">
        <span className="reply-preview__sender">
          {replyToMessage.senderName}
        </span>
        <span className="reply-preview__text">
          {getMessagePreview(replyToMessage)}
        </span>
      </div>

      <button
        className="reply-preview__close"
        onClick={onClearReply}
        aria-label="Cancel reply"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

// In MessageBubble - show quoted message
const QuotedMessage = ({ quotedMessage, onClick }) => {
  return (
    <button
      className="quoted-message"
      onClick={() => onClick(quotedMessage.id)}
      aria-label={`Quoted message from ${quotedMessage.senderName}`}
    >
      <div className="quoted-message__indicator" />
      <div className="quoted-message__content">
        <span className="quoted-message__sender">
          {quotedMessage.senderName}
        </span>
        <span className="quoted-message__text">
          {getMessagePreview(quotedMessage)}
        </span>
      </div>
    </button>
  );
};

// Scroll to quoted message
const useScrollToMessage = (messageListRef) => {
  const scrollToMessage = useCallback(
    (messageId) => {
      const messageElement = messageListRef.current?.querySelector(
        `[data-message-id="${messageId}"]`,
      );

      if (messageElement) {
        messageElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        // Highlight briefly
        messageElement.classList.add("message--highlighted");
        setTimeout(() => {
          messageElement.classList.remove("message--highlighted");
        }, 2000);
      }
    },
    [messageListRef],
  );

  return scrollToMessage;
};
```

### Message Starring/Bookmarking

```jsx
// hooks/useStarredMessages.js
const useStarredMessages = () => {
  const queryClient = useQueryClient();

  const { data: starredMessages } = useQuery({
    queryKey: ["starredMessages"],
    queryFn: () => fetch("/api/messages/starred").then((r) => r.json()),
  });

  const starMutation = useMutation({
    mutationFn: ({ messageId, starred }) =>
      fetch(`/api/messages/${messageId}/star`, {
        method: starred ? "POST" : "DELETE",
      }),
    onMutate: async ({ messageId, starred }) => {
      // Optimistic update
      await queryClient.cancelQueries(["starredMessages"]);

      const previous = queryClient.getQueryData(["starredMessages"]);

      queryClient.setQueryData(["starredMessages"], (old) => {
        if (starred) {
          return [...(old || []), { messageId, starredAt: Date.now() }];
        } else {
          return (old || []).filter((m) => m.messageId !== messageId);
        }
      });

      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["starredMessages"], context.previous);
    },
  });

  const isStarred = useCallback(
    (messageId) => {
      return starredMessages?.some((m) => m.messageId === messageId);
    },
    [starredMessages],
  );

  const toggleStar = useCallback(
    (messageId) => {
      starMutation.mutate({
        messageId,
        starred: !isStarred(messageId),
      });
    },
    [isStarred, starMutation],
  );

  return { starredMessages, isStarred, toggleStar };
};
```

### Message Forwarding

```jsx
// components/ForwardModal.jsx
const ForwardModal = ({ message, isOpen, onClose }) => {
  const [selectedChats, setSelectedChats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { sendMessage } = useWebSocket();

  const { data: chats } = useQuery({
    queryKey: ["chats"],
    enabled: isOpen,
  });

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats?.filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [chats, searchQuery]);

  const handleForward = async () => {
    for (const chatId of selectedChats) {
      await sendMessage({
        chatId,
        content: message.content,
        forwardedFrom: {
          messageId: message.id,
          chatId: message.chatId,
          senderName: message.senderName,
        },
      });
    }

    onClose();
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="forward-modal-title"
    >
      <h2 id="forward-modal-title">Forward Message</h2>

      <div className="forward-preview">
        <MessagePreview message={message} />
      </div>

      <input
        type="search"
        placeholder="Search chats..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search chats to forward to"
      />

      <ul
        className="chat-select-list"
        role="listbox"
        aria-multiselectable="true"
      >
        {filteredChats?.map((chat) => (
          <li
            key={chat.id}
            role="option"
            aria-selected={selectedChats.includes(chat.id)}
            onClick={() => {
              setSelectedChats((prev) =>
                prev.includes(chat.id)
                  ? prev.filter((id) => id !== chat.id)
                  : [...prev, chat.id],
              );
            }}
            className={selectedChats.includes(chat.id) ? "selected" : ""}
          >
            <Avatar src={chat.avatar} name={chat.name} />
            <span>{chat.name}</span>
            {selectedChats.includes(chat.id) && <CheckIcon />}
          </li>
        ))}
      </ul>

      <div className="modal-actions">
        <button onClick={onClose}>Cancel</button>
        <button onClick={handleForward} disabled={selectedChats.length === 0}>
          Forward to {selectedChats.length} chat
          {selectedChats.length !== 1 ? "s" : ""}
        </button>
      </div>
    </Modal>
  );
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
│  • Real-time messaging → WebSocket (MUST)                                   │
│  • History fetch → REST                                                     │
│  • Media upload → REST + Presigned URLs                                    │
│  • NOT: Long polling (too inefficient)                                      │
│                                                                              │
│  Database Choice:                                                           │
│  • Messages → Cassandra (write scale)                                       │
│  • Users, Auth → PostgreSQL (ACID)                                         │
│  • Cache, Presence, Pub/Sub → Redis                                        │
│  • Search → Elasticsearch                                                   │
│  • Media → S3 + CDN                                                         │
│                                                                              │
│  Real-time Features:                                                        │
│  • Messages → WebSocket                                                     │
│  • Typing → WebSocket + Debounce                                           │
│  • Presence → Redis + TTL + Pub/Sub                                        │
│  • Delivery/Read receipts → WebSocket                                      │
│                                                                              │
│  Offline Support:                                                           │
│  • IndexedDB for message storage                                           │
│  • Queue sends locally                                                      │
│  • Sync on reconnect                                                        │
│                                                                              │
│  State Management:                                                          │
│  • WebSocket → Custom provider                                              │
│  • Server state → React Query                                               │
│  • Real-time state → Zustand                                                │
│  • Persistence → IndexedDB                                                  │
│                                                                              │
│  Performance:                                                               │
│  • Virtualize message list                                                  │
│  • Optimistic updates                                                       │
│  • Lazy load media                                                          │
│  • Debounce typing                                                          │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```
