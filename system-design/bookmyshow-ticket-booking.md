# High-Level Design: Ticket Booking System (BookMyShow)

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
14. [Security Deep Dive](#14-security-deep-dive)
15. [Comprehensive Testing Strategy](#15-comprehensive-testing-strategy)
16. [Offline Support & PWA](#16-offline-support--pwa)
17. [Real-time Implementation](#17-real-time-implementation)
18. [Virtual Waiting Room](#18-virtual-waiting-room)
19. [Analytics & Business Metrics](#19-analytics--business-metrics)
20. [Internationalization (i18n)](#20-internationalization-i18n)
21. [Disaster Recovery](#21-disaster-recovery)

---

## 1. Problem Statement & Requirements

### Problem Statement

Design a scalable ticket booking system similar to BookMyShow that allows users to browse movies/events, select seats, and complete bookings with proper seat locking mechanisms to prevent double booking in high-concurrency scenarios.

### Functional Requirements

- **Browse & Search**: Users can browse movies, events, theaters, and showtimes
- **Seat Selection**: Interactive seat map showing available/booked/locked seats
- **Seat Locking**: Temporary hold on seats during selection (5-10 minutes)
- **Booking**: Create booking with selected seats
- **Payment**: Process payment with multiple payment methods
- **Confirmation**: Generate booking confirmation and e-tickets
- **Cancellation**: Cancel bookings and process refunds
- **User Management**: Authentication, booking history, profiles

### Non-Functional Requirements

- **High Availability**: 99.9% uptime
- **Low Latency**: Seat selection < 200ms, booking < 1s
- **Consistency**: No double booking (strong consistency for seat allocation)
- **Scalability**: Handle 10K concurrent users per show
- **Fault Tolerance**: Graceful degradation during failures
- **Security**: Secure payment processing, PCI DSS compliance

### Constraints & Assumptions

- Peak load during new movie releases (100K+ concurrent users)
- Average seats per show: 200-500
- Seat lock timeout: 10 minutes
- Payment timeout: 5 minutes after seat lock
- Support 1000+ theaters, 10K+ shows daily

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT TIER                                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                     │
│  │   Web App   │  │  Mobile App │  │   Admin     │                     │
│  │  (React)    │  │ (iOS/And.)  │  │   Portal    │                     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                     │
└─────────┼─────────────────┼─────────────────┼───────────────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │
          ┌─────────────────▼─────────────────┐
          │      API Gateway (Kong/NGINX)      │
          │  - Rate Limiting                   │
          │  - Load Balancing                  │
          │  - Authentication                  │
          └─────────────────┬─────────────────┘
                            │
    ┌───────────────────────┼───────────────────────┐
    │                       │                       │
┌───▼────────┐  ┌──────────▼────────┐  ┌──────────▼────────┐
│  Catalog   │  │   Booking Service  │  │ Payment Service   │
│  Service   │  │   (CRITICAL)       │  │                   │
│            │  │  - Seat Locking    │  │  - Payment Gateway│
│  - Movies  │  │  - Reservation     │  │  - Webhook Handler│
│  - Theaters│  │  - Booking Mgmt    │  │  - Refunds        │
│  - Shows   │  └──────────┬────────┘  └──────────┬────────┘
└─────┬──────┘             │                      │
      │                    │                      │
      │    ┌───────────────▼──────────┐  ┌────────▼────────┐
      │    │  Notification Service    │  │  User Service   │
      │    │  - Email                 │  │  - Auth         │
      │    │  - SMS                   │  │  - Profile      │
      │    │  - Push Notifications    │  │  - History      │
      │    └──────────────────────────┘  └─────────────────┘
      │
┌─────┴──────────────────────────────────────────────────────────────┐
│                      DATA & CACHE LAYER                             │
│                                                                      │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────────┐ │
│  │ PostgreSQL │  │   Redis    │  │ Elasticsearch│ │  S3/CDN     │ │
│  │  (Primary) │  │ Distributed│  │   (Search)   │  │  (Assets)   │ │
│  │            │  │   Cache +  │  │              │  │             │ │
│  │  - Users   │  │Seat Locking│  │  - Movies    │  │  - Images   │ │
│  │  - Bookings│  │            │  │  - Theaters  │  │  - Tickets  │ │
│  │  - Seats   │  └────────────┘  └──────────────┘  └─────────────┘ │
│  │  - Payments│                                                     │
│  └────────────┘                                                     │
│                                                                      │
│  ┌────────────┐  ┌────────────┐                                    │
│  │  Message   │  │   Event    │                                    │
│  │   Queue    │  │   Store    │                                    │
│  │  (Kafka)   │  │  (Events)  │                                    │
│  └────────────┘  └────────────┘                                    │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    MONITORING & OBSERVABILITY                         │
│  - Prometheus/Grafana  - ELK Stack  - Distributed Tracing (Jaeger) │
└──────────────────────────────────────────────────────────────────────┘
```

## System Invariants

These are the non-negotiable rules the system must always satisfy.  
Every service, cache, and database operation must preserve these invariants.

### Seat Ownership Invariants

- A seat can be in exactly one of the following states at any time:
  `AVAILABLE → LOCKED → BOOKED`
- A seat can never be BOOKED unless it was previously LOCKED.
- A seat lock can belong to exactly one user session.
- A seat lock must expire automatically if not converted to a booking.

### Payment & Booking Invariants

- A booking can never exist without a corresponding successful payment.
- A payment can be applied to exactly one booking (idempotency enforced).
- A booking confirmation must be atomic: either both seat and payment succeed, or neither does.

### Concurrency Invariants

- Two users can never hold a lock for the same seat at the same time.
- Two bookings can never exist for the same seat.
- At most one active booking is allowed per seat.

### Failure Safety Invariants

- No seat is permanently blocked due to client or server failure.
- A failed or abandoned checkout always results in seat lock expiry.
- Payment success must never result in seat loss or double booking.

These invariants ensure **no revenue loss, no ghost bookings, and no oversold seats**, even under extreme concurrency.

## Consistency Model

Different parts of the system use different consistency guarantees based on business risk and performance trade-offs.

| Domain                    | Consistency   | Rationale                                |
| ------------------------- | ------------- | ---------------------------------------- |
| Seat locking              | Strong        | Prevents two users holding the same seat |
| Seat booking              | Strong (ACID) | No overselling allowed                   |
| Payments                  | Strong        | Financial correctness                    |
| Seat availability display | Eventual      | Small staleness acceptable               |
| Show listings             | Eventual      | Cached for performance                   |
| Search results            | Eventual      | Inaccurate counts acceptable             |
| User sessions             | Eventual      | Redis TTL based                          |
| Notifications             | Eventual      | Non-blocking                             |

### Implementation Strategy

#### Seat Locking

- Redis `SETNX` ensures only one user can lock a seat.
- TTL ensures automatic release if user drops.
- Database enforces final uniqueness using a `(show_id, seat_id)` unique constraint.

#### Booking Finalization

- Payment + seat booking happens inside a database transaction.
- If payment succeeds but seat commit fails → refund triggered.
- If seat commit succeeds but payment fails → booking rolled back.

#### Availability Display

- Seat availability is served from cache and may be slightly stale.
- Locking and booking always hit authoritative Redis + DB.

This hybrid model guarantees:

- **Strong correctness where money and seats are involved**
- **High scalability where only discovery and UI are involved**

---

## 3. Component Architecture

### 3.1 Frontend Components

#### Seat Selection Component

```
┌─────────────────────────────────────────────────────┐
│          Seat Selection Interface                   │
│                                                      │
│  ┌────────────────────────────────────────────┐    │
│  │            SCREEN THIS WAY                  │    │
│  └────────────────────────────────────────────┘    │
│                                                      │
│  Legend: 🟩 Available  🟨 Selected  🟥 Booked      │
│          ⏰ Locked (by others)                      │
│                                                      │
│  Row A:  [🟩][🟩][🟥][🟥][🟩][🟩][🟩][🟩]        │
│  Row B:  [🟩][🟨][🟨][🟩][⏰][⏰][🟩][🟩]        │
│  Row C:  [🟥][🟥][🟥][🟥][🟩][🟩][🟩][🟩]        │
│                                                      │
│  Selected: B2, B3 (2 seats)                         │
│  Price: $30.00                                      │
│  Time Remaining: 09:45                              │
│                                                      │
│  [Cancel]              [Proceed to Payment]         │
└─────────────────────────────────────────────────────┘

State Management:
- Local State: selectedSeats[], seatMap{}
- WebSocket: Real-time seat availability updates (optional)
- Polling: Refresh seat status every 5-10s
- Optimistic Updates: Immediate UI feedback
```

#### Payment Component

```
┌─────────────────────────────────────────────────────┐
│          Payment Gateway                             │
│                                                      │
│  Booking Summary:                                   │
│  Movie: Avengers Endgame                            │
│  Theater: PVR Cinemas, Mall Road                    │
│  Seats: B2, B3                                      │
│  Amount: $30.00                                     │
│                                                      │
│  Payment Method:                                    │
│  ( ) Credit/Debit Card                              │
│  ( ) UPI                                            │
│  ( ) Net Banking                                    │
│  (•) Wallet                                         │
│                                                      │
│  Time Remaining: 04:45                              │
│                                                      │
│  [Pay Now]                                          │
└─────────────────────────────────────────────────────┘

Flow:
1. Seats locked → Payment UI shown
2. Payment initiated → Backend validation
3. Payment processing → External gateway
4. Success → Confirm booking, release lock
5. Failure → Release seat lock, retry option
```

### 3.2 Backend Services Architecture

#### Booking Service (Core Component)

```
┌───────────────────────────────────────────────────────┐
│              BOOKING SERVICE                          │
│                                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │        Seat Lock Manager (CRITICAL)           │   │
│  │                                                │   │
│  │  acquireLock(showId, seatIds[], userId)      │   │
│  │  - Check availability                         │   │
│  │  - Set Redis lock (10 min TTL)               │   │
│  │  - Store in seat_locks table                 │   │
│  │                                                │   │
│  │  releaseLock(lockId)                          │   │
│  │  - Remove Redis lock                          │   │
│  │  - Update seat_locks status                   │   │
│  │                                                │   │
│  │  extendLock(lockId)                           │   │
│  │  - Refresh Redis TTL                          │   │
│  └──────────────────────────────────────────────┘   │
│                                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │        Booking Manager                        │   │
│  │                                                │   │
│  │  createBooking(lockId, paymentDetails)       │   │
│  │  - Validate lock ownership                    │   │
│  │  - Create booking record                      │   │
│  │  - Update seat status (BOOKED)               │   │
│  │  - Trigger payment                            │   │
│  │                                                │   │
│  │  confirmBooking(bookingId, paymentId)        │   │
│  │  - Mark booking CONFIRMED                     │   │
│  │  - Release lock                               │   │
│  │  - Generate e-ticket                          │   │
│  │  - Send notification                          │   │
│  └──────────────────────────────────────────────┘   │
│                                                        │
│  ┌──────────────────────────────────────────────┐   │
│  │        Cancellation Manager                   │   │
│  │                                                │   │
│  │  cancelBooking(bookingId)                     │   │
│  │  - Validate cancellation policy               │   │
│  │  - Update seat status (AVAILABLE)            │   │
│  │  - Initiate refund                            │   │
│  │  - Update booking status                      │   │
│  └──────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

### 4.1 Browse & Search Flow

```
User → API Gateway → Catalog Service → Cache/DB → Response
                           │
                           ├─→ Check Redis Cache (theaters, movies)
                           │      └─→ Cache Hit → Return
                           │
                           └─→ Cache Miss → PostgreSQL
                                  └─→ Update Cache → Return
```

### 4.2 Seat Selection & Locking Flow (CRITICAL)

```
┌──────┐                                                    ┌─────────┐
│ User │                                                    │ Backend │
└───┬──┘                                                    └────┬────┘
    │                                                            │
    │ 1. GET /shows/{showId}/seats                              │
    │────────────────────────────────────────────────────────>  │
    │                                                            │
    │ 2. Return seat map (Available/Booked/Locked)             │
    │ <────────────────────────────────────────────────────────│
    │   (Query Redis + DB for current status)                  │
    │                                                            │
    │ 3. User clicks seats B2, B3                               │
    │                                                            │
    │ 4. POST /bookings/lock                                    │
    │    { showId, seatIds: [B2, B3], userId }                 │
    │────────────────────────────────────────────────────────>  │
    │                                                            │
    │              5. DISTRIBUTED LOCK ACQUISITION              │
    │                                                            │
    │              ┌─────────────────────────────┐             │
    │              │ Redis Distributed Lock      │             │
    │              │                              │             │
    │              │ SETNX show:123:seat:B2      │             │
    │              │ userId:456 EX 600           │             │
    │              │                              │             │
    │              │ If success → Lock acquired  │             │
    │              │ If fail → Seat locked       │             │
    │              └─────────────────────────────┘             │
    │                                                            │
    │              6. Update seat_locks table                   │
    │              INSERT INTO seat_locks                       │
    │              (show_id, seat_id, user_id,                 │
    │               locked_at, expires_at)                      │
    │                                                            │
    │ 7. Response: { lockId, expiresAt, seats[] }              │
    │ <────────────────────────────────────────────────────────│
    │                                                            │
    │ 8. Timer starts: 10:00 countdown                          │
    │                                                            │
    │ 9. Periodic lock extension (every 2 mins)                │
    │    PUT /bookings/lock/{lockId}/extend                     │
    │────────────────────────────────────────────────────────>  │
    │ <────────────────────────────────────────────────────────│
    │                                                            │
```

### 4.3 Booking & Payment Flow

```
┌──────┐      ┌─────────┐      ┌─────────┐      ┌──────────┐
│ User │      │ Booking │      │ Payment │      │ Gateway  │
└───┬──┘      └────┬────┘      └────┬────┘      └────┬─────┘
    │              │                 │                │
    │ 1. Pay Now   │                 │                │
    │─────────────>│                 │                │
    │              │                 │                │
    │              │ 2. Validate Lock│                │
    │              │    ownership    │                │
    │              │                 │                │
    │              │ 3. Create Booking (PENDING)      │
    │              │    └─> DB Transaction           │
    │              │                 │                │
    │              │ 4. Initiate Payment              │
    │              │────────────────>│                │
    │              │                 │                │
    │              │                 │ 5. Process     │
    │              │                 │───────────────>│
    │              │                 │                │
    │              │                 │ 6. Response    │
    │              │                 │<───────────────│
    │              │                 │                │
    │              │ 7. Payment Success               │
    │              │<────────────────│                │
    │              │                 │                │
    │              │ 8. Confirm Booking               │
    │              │    BEGIN TRANSACTION             │
    │              │    - Update booking: CONFIRMED   │
    │              │    - Update seats: BOOKED        │
    │              │    - Release Redis lock          │
    │              │    - Delete seat_locks record    │
    │              │    COMMIT                        │
    │              │                 │                │
    │              │ 9. Generate E-ticket             │
    │              │    Publish event → Notification  │
    │              │                 │                │
    │ 10. Confirmation                                │
    │<─────────────│                 │                │
    │              │                 │                │
    │              │                 │                │
    ▼              ▼                 ▼                ▼

FAILURE SCENARIO:
    │              │                 │                │
    │              │ Payment Failed  │                │
    │              │<────────────────│                │
    │              │                 │                │
    │              │ Update booking: FAILED           │
    │              │ Release seat locks               │
    │              │ Seats → AVAILABLE               │
    │              │                 │                │
    │ Retry/Cancel │                 │                │
    │<─────────────│                 │                │
```

### 4.4 Lock Expiration & Cleanup

```
┌─────────────────────────────────────────────────────────┐
│          Background Job: Lock Cleanup                   │
│                                                          │
│  Runs every 1 minute                                    │
│                                                          │
│  1. Query seat_locks WHERE expires_at < NOW()          │
│                                                          │
│  2. For each expired lock:                              │
│     - Remove Redis lock                                 │
│     - Update seat status → AVAILABLE                    │
│     - Mark seat_lock → EXPIRED                          │
│     - Publish event (seat available)                    │
│                                                          │
│  3. Clean up orphaned locks (Redis exists, DB missing) │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 5. API Design & Communication Protocols

### 5.1 Core APIs

#### Catalog APIs

```
GET    /api/v1/movies
       ?city=Mumbai&date=2025-12-25
       Response: { movies: [{id, title, poster, rating, languages}] }

GET    /api/v1/movies/{movieId}/shows
       ?city=Mumbai&date=2025-12-25
       Response: { theaters: [{id, name, shows: [{id, time, price}]}] }

GET    /api/v1/shows/{showId}/seats
       Response: {
         layout: { rows: 10, cols: 20 },
         seats: [
           {id: "A1", status: "AVAILABLE|BOOKED|LOCKED", price: 200},
           ...
         ]
       }
```

#### Booking APIs (CRITICAL)

```
POST   /api/v1/bookings/lock
       Body: { showId, seatIds: ["A1", "A2"], userId }
       Response: {
         lockId: "uuid",
         expiresAt: "2025-12-22T10:15:00Z",
         seats: [{id, price}],
         totalAmount: 400
       }
       Status: 200 OK | 409 Conflict (seats already locked)

PUT    /api/v1/bookings/lock/{lockId}/extend
       Response: { expiresAt: "2025-12-22T10:20:00Z" }
       Status: 200 OK | 404 Not Found | 410 Gone (expired)

DELETE /api/v1/bookings/lock/{lockId}
       (User cancels seat selection)
       Response: { success: true }

POST   /api/v1/bookings
       Body: {
         lockId: "uuid",
         paymentMethod: "CARD",
         ...
       }
       Response: {
         bookingId: "uuid",
         status: "PENDING",
         paymentUrl: "https://..."
       }
       Status: 201 Created | 400 Bad Request | 409 Lock Invalid

GET    /api/v1/bookings/{bookingId}
       Response: {
         id, status, seats, amount,
         showDetails, paymentStatus, ticket
       }

POST   /api/v1/bookings/{bookingId}/confirm
       (Called by payment webhook)
       Body: { paymentId, status: "SUCCESS" }
       Response: { bookingStatus: "CONFIRMED", ticketUrl }

DELETE /api/v1/bookings/{bookingId}
       (Cancellation)
       Response: { refundId, refundAmount, status }
```

#### Payment APIs

```
POST   /api/v1/payments
       Body: { bookingId, amount, method, ... }
       Response: {
         paymentId,
         gatewayUrl: "https://razorpay.com/...",
         status: "INITIATED"
       }

POST   /api/v1/payments/webhook
       (Callback from payment gateway)
       Body: { paymentId, status, ... }
       Response: { received: true }

POST   /api/v1/payments/{paymentId}/refund
       Body: { amount, reason }
       Response: { refundId, status, estimatedDate }
```

### 5.2 Communication Protocols

#### REST APIs

- Primary protocol for client-server communication
- Stateless, cacheable responses
- Standard HTTP methods (GET, POST, PUT, DELETE)

#### WebSockets (Optional Enhancement)

```
WS /api/v1/ws/shows/{showId}

Server → Client events:
{
  type: "SEAT_LOCKED",
  seatIds: ["A1", "A2"],
  lockedBy: "userId"
}

{
  type: "SEAT_RELEASED",
  seatIds: ["A1", "A2"]
}

{
  type: "SEAT_BOOKED",
  seatIds: ["A1", "A2"]
}

Use case: Real-time seat availability updates
Alternative: Short polling (every 5-10s)
```

#### Message Queue (Kafka)

```
Topics:
- booking.created
- booking.confirmed
- booking.cancelled
- payment.success
- payment.failed
- notification.email
- notification.sms

Consumers:
- Notification Service (email, SMS)
- Analytics Service
- Audit Log Service
```

---

## 6. Database Design

### 6.1 Schema Design

#### Users Table

```sql
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_email (email),
    INDEX idx_phone (phone)
);
```

#### Movies Table

```sql
CREATE TABLE movies (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    duration_minutes INT,
    language VARCHAR(50),
    genre VARCHAR(100),
    rating DECIMAL(2,1),
    release_date DATE,
    poster_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_release_date (release_date)
);
```

#### Theaters Table

```sql
CREATE TABLE theaters (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(100),
    address TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_screens INT,
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_city (city)
);
```

#### Screens Table

```sql
CREATE TABLE screens (
    id UUID PRIMARY KEY,
    theater_id UUID REFERENCES theaters(id),
    name VARCHAR(100),
    total_seats INT,
    seat_layout JSON, -- {rows: 10, cols: 20, types: {...}}
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_theater (theater_id)
);
```

#### Shows Table

```sql
CREATE TABLE shows (
    id UUID PRIMARY KEY,
    movie_id UUID REFERENCES movies(id),
    screen_id UUID REFERENCES screens(id),
    show_time TIMESTAMP NOT NULL,
    base_price DECIMAL(10, 2),
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, CANCELLED
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_movie_time (movie_id, show_time),
    INDEX idx_screen_time (screen_id, show_time),
    INDEX idx_show_time (show_time)
);
```

#### Seats Table (CRITICAL)

```sql
CREATE TABLE seats (
    id UUID PRIMARY KEY,
    screen_id UUID REFERENCES screens(id),
    seat_number VARCHAR(10) NOT NULL, -- "A1", "B2"
    row_name VARCHAR(10),
    seat_type VARCHAR(20), -- REGULAR, PREMIUM, VIP
    price_multiplier DECIMAL(3, 2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (screen_id, seat_number),
    INDEX idx_screen_seat (screen_id, seat_number)
);
```

#### Show Seats Table (CRITICAL - Tracks seat status per show)

```sql
CREATE TABLE show_seats (
    id UUID PRIMARY KEY,
    show_id UUID REFERENCES shows(id),
    seat_id UUID REFERENCES seats(id),
    status VARCHAR(20) DEFAULT 'AVAILABLE',
    -- AVAILABLE, LOCKED, BOOKED, BLOCKED
    booking_id UUID REFERENCES bookings(id),
    locked_by UUID REFERENCES users(id),
    locked_at TIMESTAMP,
    version INT DEFAULT 0, -- Optimistic locking
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (show_id, seat_id),
    INDEX idx_show_status (show_id, status),
    INDEX idx_booking (booking_id)
);
```

#### Seat Locks Table (CRITICAL - Temporary locks)

```sql
CREATE TABLE seat_locks (
    id UUID PRIMARY KEY,
    show_id UUID REFERENCES shows(id),
    seat_id UUID REFERENCES seats(id),
    user_id UUID REFERENCES users(id),
    locked_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, RELEASED
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_expiry (expires_at, status),
    INDEX idx_user_show (user_id, show_id),
    UNIQUE (show_id, seat_id, status)
    -- Prevent multiple active locks on same seat
);
```

#### Bookings Table (CRITICAL)

```sql
CREATE TABLE bookings (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    show_id UUID REFERENCES shows(id),
    booking_reference VARCHAR(20) UNIQUE,
    total_amount DECIMAL(10, 2),
    booking_status VARCHAR(20) DEFAULT 'PENDING',
    -- PENDING, CONFIRMED, CANCELLED, FAILED
    payment_status VARCHAR(20) DEFAULT 'PENDING',
    -- PENDING, SUCCESS, FAILED, REFUNDED
    payment_id UUID,
    booked_at TIMESTAMP DEFAULT NOW(),
    confirmed_at TIMESTAMP,
    cancelled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user (user_id),
    INDEX idx_show (show_id),
    INDEX idx_reference (booking_reference),
    INDEX idx_status (booking_status)
);
```

#### Booking Seats Table

```sql
CREATE TABLE booking_seats (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    seat_id UUID REFERENCES seats(id),
    price DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_booking (booking_id)
);
```

#### Payments Table

```sql
CREATE TABLE payments (
    id UUID PRIMARY KEY,
    booking_id UUID REFERENCES bookings(id),
    amount DECIMAL(10, 2),
    payment_method VARCHAR(50), -- CARD, UPI, WALLET, NETBANKING
    gateway VARCHAR(50), -- RAZORPAY, STRIPE, PAYTM
    gateway_transaction_id VARCHAR(255),
    status VARCHAR(20), -- INITIATED, SUCCESS, FAILED, REFUNDED
    initiated_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    refund_id UUID,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_booking (booking_id),
    INDEX idx_gateway_txn (gateway_transaction_id)
);
```

### 6.2 Seat Locking Mechanism (CRITICAL)

Seat locking is the **most critical correctness problem** in a ticketing system.  
The system must enforce one non-negotiable invariant:

> **A seat can be sold to at most one user — even during crashes, retries, or peak traffic.**

This is a **financially sensitive distributed system**, not a UI feature.

---

## **6.2.1 First Principles**

Seat locking must satisfy three fundamental constraints:

- **Atomicity** – Two users must never hold the same seat at the same time
- **Durability** – Locks must survive crashes and restarts
- **Expiry** – Abandoned locks must be automatically released

Only a transactional database can guarantee all three.

Therefore:

> **The database is the single source of truth for seat ownership.**  
> Redis is used only for performance and contention control.

---

## **6.2.2 Single Source of Truth**

Each seat has exactly one authoritative state stored in the database:

- `AVAILABLE`
- `LOCKED`
- `BOOKED`

A seat always follows this lifecycle:

```
"AVAILABLE" ==> "LOCKED" ==> "BOOKED"

```

A `LOCKED` seat stores:

- which user owns it
- when the lock expires

This guarantees:

- no double booking
- crash safety
- automatic recovery

---

## **6.2.3 How Seat Locking Works**

When a user selects a seat:

1. The system attempts to lock the seat in the database
2. The database checks:
   - Is the seat `AVAILABLE`?
   - Or was it `LOCKED` but already expired?
3. If yes, the seat becomes `LOCKED` for this user with a 10-minute expiry
4. If no, the seat is already taken and the user is rejected

This operation is **atomic**, so even if thousands of users click the same seat at the same time, only one will succeed.

---

## **6.2.4 Why Redis Is Still Used**

During peak demand, many users may click the same popular seats simultaneously.  
To avoid overwhelming the database, Redis acts as a **high-speed contention filter**:

- Temporarily marks hot seats as busy
- Rejects duplicate clicks early
- Prevents thundering-herd traffic

Redis never decides who owns a seat.  
It only protects the database from overload.

---

## **6.2.5 Crash and Failure Safety**

If the application crashes:

- The database still knows who owns every seat
- Expired locks are automatically reclaimed

If Redis crashes:

- The database still enforces correctness

This design prevents:

- ghost locks
- double bookings
- inconsistent state

---

## **6.2.6 Final Booking**

After payment succeeds:

- Only the user holding the seat lock can complete the booking
- The seat transitions from `LOCKED` to `BOOKED`
- All other users are rejected

This ensures **money and inventory never diverge**.

---

## **Why This Design Works**

This model is used by:

- Airlines
- Concert ticketing platforms
- Railways
- Movie booking systems

Because:

> **Redis improves performance.**  
> **The database guarantees correctness.**

## 7. Caching Strategy

### 7.1 Cache Layers

#### L1: Browser Cache

```text
- Static assets (images, CSS, JS): 1 week
- Movie posters: 1 day
- Theater info: 1 day
```

#### L2: CDN Cache (CloudFront/Cloudflare)

```
- Movie images, posters: 7 days
- Theater images: 7 days
- Static pages: 1 hour
```

#### L3: Redis Cache (Application Layer)

```
Key Patterns:

1. Movie Catalog
   Key: movie:{movieId}
   TTL: 1 hour
   Value: {id, title, description, poster, rating, ...}

2. Theater Info
   Key: theater:{theaterId}
   TTL: 1 hour
   Value: {id, name, city, screens, ...}

3. Show Listings
   Key: shows:city:{city}:date:{date}:movie:{movieId}
   TTL: 5 minutes
   Value: [{showId, theater, time, price, ...}]

4. Seat Availability (HOT DATA)
   Key: seats:show:{showId}
   TTL: 30 seconds (short due to frequent updates)
   Value: {
     available: ["A1", "A2", ...],
     booked: ["B1", "B2", ...],
     locked: ["C1", "C2", ...]
   }

5. Seat Locks (CRITICAL)
   Key: lock:show:{showId}:seat:{seatId}
   TTL: 10 minutes
   Value: {userId}:{lockId}

6. User Sessions
   Key: session:{sessionId}
   TTL: 24 hours
   Value: {userId, email, ...}

7. Booking Details
   Key: booking:{bookingId}
   TTL: 1 hour
   Value: {id, status, seats, amount, ...}
```

### 7.2 Cache Invalidation Strategy

```
Write-Through Pattern (for critical data):
- Update DB first
- Then update cache
- Ensures consistency

Write-Behind Pattern (for analytics):
- Update cache first
- Async update DB
- Better performance

Cache-Aside Pattern (for reads):
- Check cache first
- On miss, fetch from DB
- Update cache
- Return to client

Invalidation Events:
1. Seat booked → Invalidate seats:show:{showId}
2. Show cancelled → Invalidate all show-related keys
3. Theater updated → Invalidate theater:{id}
4. Movie updated → Invalidate movie:{id}

Invalidation Flow:
┌──────────┐      ┌──────────┐      ┌─────────┐
│  Service │─────>│ Database │─────>│  Cache  │
│          │      │  UPDATE  │      │ INVALID │
└──────────┘      └──────────┘      └─────────┘
     │                                     │
     └─────> Publish Event ────────────────┘
             (Kafka: cache.invalidate)
```

### 7.3 Cache Warming

```
Pre-populate cache before peak hours:

1. Popular movies → Cache at midnight
2. Weekend shows → Cache on Friday evening
3. New releases → Cache 1 day before
4. Trending theaters → Cache every hour

Background Job:
- Runs every hour
- Identifies popular content
- Warms cache proactively
```

---

## 8. State Management

### 8.1 Frontend State (React Example)

```javascript
// Global State (Redux/Context)
{
  auth: {
    user: { id, email, name },
    token: "jwt-token",
    isAuthenticated: true
  },

  booking: {
    selectedMovie: { id, title, poster },
    selectedShow: { id, time, theater, price },
    selectedSeats: ["A1", "A2"],
    lockId: "uuid",
    lockExpiresAt: "2025-12-22T10:15:00Z",
    totalAmount: 400,
    bookingStatus: "SEAT_LOCKED" | "PAYMENT_PENDING" | "CONFIRMED"
  },

  seatMap: {
    showId: "123",
    layout: { rows: 10, cols: 20 },
    seats: {
      "A1": { id: "A1", status: "AVAILABLE", price: 200 },
      "A2": { id: "A2", status: "LOCKED", price: 200 },
      "B1": { id: "B1", status: "BOOKED", price: 200 },
      ...
    },
    lastUpdated: "2025-12-22T10:05:00Z"
  },

  ui: {
    loading: false,
    error: null,
    modal: { isOpen: false, type: null }
  }
}

// State Machine for Booking Flow
IDLE → SELECTING_SEATS → SEATS_LOCKED → PAYMENT_PENDING
  → CONFIRMED | FAILED → IDLE

Transitions:
- IDLE → SELECTING_SEATS: User clicks seat
- SELECTING_SEATS → SEATS_LOCKED: Lock API success
- SEATS_LOCKED → PAYMENT_PENDING: User clicks Pay
- PAYMENT_PENDING → CONFIRMED: Payment success
- PAYMENT_PENDING → FAILED: Payment failed
- Any state → IDLE: Lock expires or user cancels
```

### 8.2 Backend State Management

```
Stateless Services:
- All booking state stored in DB + Redis
- No in-memory state (enables horizontal scaling)
- Session stored in Redis

Lock State:
- Redis: Distributed lock (source of truth)
- PostgreSQL: Audit trail and backup
- Eventual consistency acceptable for lock cleanup

Booking State:
- PostgreSQL: Source of truth
- Redis: Cache for fast reads
- Strong consistency required

Payment State:
- PostgreSQL: Transactional records
- Idempotency keys: Prevent duplicate payments
- State machine: INITIATED → PROCESSING → SUCCESS/FAILED
```

---

## 9. Performance Optimization

### 9.1 Database Optimizations

#### Indexing Strategy

```sql
-- High-priority indexes for frequent queries

-- Seat availability query (HOT PATH)
CREATE INDEX idx_show_seats_status
ON show_seats(show_id, status)
INCLUDE (seat_id);

-- Lock expiry cleanup
CREATE INDEX idx_seat_locks_expiry
ON seat_locks(expires_at, status)
WHERE status = 'ACTIVE';

-- User booking history
CREATE INDEX idx_bookings_user_date
ON bookings(user_id, booked_at DESC);

-- Show listings by city and date
CREATE INDEX idx_shows_city_date
ON shows(city, show_time)
WHERE status = 'ACTIVE';

-- Composite index for common join
CREATE INDEX idx_show_seats_composite
ON show_seats(show_id, seat_id, status, booking_id);
```

#### Query Optimization

```sql
-- Before: N+1 query problem
SELECT * FROM bookings WHERE user_id = ?;
-- Then for each booking:
SELECT * FROM booking_seats WHERE booking_id = ?;

-- After: Single query with JOIN
SELECT
    b.*,
    json_agg(bs.*) as seats
FROM bookings b
LEFT JOIN booking_seats bs ON b.id = bs.booking_id
WHERE b.user_id = ?
GROUP BY b.id;
```

#### Database Partitioning

```sql
-- Partition bookings by month (for historical data)
CREATE TABLE bookings_2025_12
PARTITION OF bookings
FOR VALUES FROM ('2025-12-01') TO ('2026-01-01');

-- Partition show_seats by show_id range
-- (for high-volume shows)
```

#### Connection Pooling

```
PgBouncer/HikariCP:
- Pool size: 50-100 connections per service
- Max connections: 500 (total)
- Idle timeout: 10 minutes
- Connection reuse
```

### 9.2 Application-Level Optimizations

#### Seat Availability Query Optimization

```javascript
// Instead of querying all seats individually:
// BAD: 200 queries for 200 seats
for (let seat of seats) {
  const status = await getSeatStatus(showId, seat.id);
}

// GOOD: Single query for all seats
const seatStatuses = await getSeatStatusBatch(showId, seatIds);

// BEST: Cache in Redis with Lua script
const seatMap = await redis.hgetall(`seats:show:${showId}`);
```

#### Optimistic Locking

```javascript
// Prevent lost updates during concurrent modifications
async function updateShowSeat(showId, seatId, newStatus, currentVersion) {
  const result = await db.query(
    `
    UPDATE show_seats
    SET status = $1, version = version + 1
    WHERE show_id = $2
      AND seat_id = $3
      AND version = $4
    RETURNING *
  `,
    [newStatus, showId, seatId, currentVersion]
  );

  if (result.rowCount === 0) {
    throw new OptimisticLockError("Seat was modified by another transaction");
  }

  return result.rows[0];
}
```

#### Batch Processing

```javascript
// Lock multiple seats in a single transaction
async function acquireMultipleSeats(showId, seatIds, userId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // 1. Acquire Redis locks (pipeline)
    const pipeline = redis.pipeline();
    seatIds.forEach((seatId) => {
      pipeline.set(
        `lock:show:${showId}:seat:${seatId}`,
        `${userId}:${lockId}`,
        "NX",
        "EX",
        600
      );
    });
    const results = await pipeline.exec();

    // 2. Update DB in single query
    const query = `
      UPDATE show_seats
      SET status = 'LOCKED', locked_by = $1, version = version + 1
      WHERE show_id = $2 AND seat_id = ANY($3) AND status = 'AVAILABLE'
      RETURNING *
    `;
    const dbResult = await client.query(query, [userId, showId, seatIds]);

    await client.query("COMMIT");
    return dbResult.rows;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
```

### 9.3 Scaling Strategies

#### Horizontal Scaling

```
Load Balancer
    │
    ├─── Booking Service (Instance 1)
    ├─── Booking Service (Instance 2)
    ├─── Booking Service (Instance 3)
    └─── Booking Service (Instance 4)

All instances are stateless
Shared Redis for locks
Shared PostgreSQL (with read replicas)
```

#### Database Scaling

```
Write Operations → Primary DB
Read Operations → Read Replicas (3x)

Replication Lag Handling:
- Critical reads (seat status) → Primary
- Non-critical reads (movie catalog) → Replicas
- Read-after-write consistency for user's own bookings
```

#### Redis Scaling

```
Redis Cluster (for high availability):
- 3 master nodes (sharded by show_id)
- 3 replica nodes
- Sentinel for failover

Sharding Strategy:
- Lock keys: Shard by show_id
- Cache keys: Shard by entity type
- Session keys: Shard by user_id
```

### 9.4 Rate Limiting

```
API Gateway Level:
- 100 requests/minute per user (general)
- 10 lock requests/minute per user (prevent abuse)
- 5 payment requests/minute per user

Service Level (Token Bucket):
- Seat selection: 20/sec per show
- Booking creation: 10/sec per show
- Lock extension: 5/sec per user

Distributed Rate Limiting (Redis):
Key: ratelimit:user:{userId}:{endpoint}
Value: Request count
TTL: 60 seconds
```

---

## 10. Error Handling & Edge Cases

### 10.1 Error Scenarios

#### Seat Lock Failures

```
Error: Seat Already Locked
Cause: Another user locked the seat
Response: 409 Conflict
{
  "error": "SEAT_UNAVAILABLE",
  "message": "Selected seats are no longer available",
  "unavailableSeats": ["A1", "A2"],
  "alternativeSeats": ["A3", "A4"]
}

Action:
- Show user which seats are taken
- Suggest nearby available seats
- Allow reselection
```

```
Error: Lock Acquisition Timeout
Cause: Redis unavailable or high contention
Response: 503 Service Unavailable
{
  "error": "SERVICE_TEMPORARILY_UNAVAILABLE",
  "message": "Unable to lock seats. Please try again.",
  "retryAfter": 5
}

Action:
- Automatic retry with exponential backoff
- Circuit breaker to prevent cascading failures
- Fallback to database-only locking (slower but works)
```

```
Error: Lock Expired During Payment
Cause: User took too long to complete payment
Response: 410 Gone
{
  "error": "LOCK_EXPIRED",
  "message": "Your seat selection has expired. Please select seats again.",
  "lockExpiresAt": "2025-12-22T10:15:00Z"
}

Action:
- Release lock
- Clear user's selection
- Redirect to seat selection
- Optionally: Auto-reselect same seats if available
```

#### Payment Failures

```
Error: Payment Gateway Timeout
Cause: External gateway is slow/down
Response: 504 Gateway Timeout

Action:
1. Keep seat lock active
2. Mark payment as PENDING
3. Poll gateway status (webhook backup)
4. Extend lock if needed
5. If confirmed late: Complete booking
6. If failed: Release lock and retry payment
```

```
Error: Duplicate Payment
Cause: User clicks Pay button multiple times
Prevention: Idempotency key

Implementation:
POST /payments
Headers: {
  "Idempotency-Key": "uuid-from-client"
}

Server checks:
- If key exists → Return existing payment response
- If key new → Process payment
```

```
Error: Payment Success but Booking Failed
Cause: DB transaction fails after payment
Response: 500 Internal Server Error

Recovery:
1. Log to critical alert system
2. Mark payment as SUCCESS
3. Retry booking creation (up to 3 times)
4. If still fails:
   - Manual intervention queue
   - Auto-refund after 1 hour
   - Notify customer support
```

#### Concurrency Issues

```
Error: Double Booking (CRITICAL BUG)
Root Cause: Race condition in lock acquisition

Scenario:
T1: User A checks seat availability → AVAILABLE
T2: User B checks seat availability → AVAILABLE
T3: User A acquires lock → SUCCESS
T4: User B acquires lock → Should FAIL but succeeds (BUG!)

Prevention:
1. Atomic Redis SETNX operation
2. Database row-level locking (FOR UPDATE)
3. Optimistic locking with version field
4. Distributed transaction coordinator

Code:
-- PostgreSQL row lock
BEGIN;
SELECT * FROM show_seats
WHERE show_id = ? AND seat_id = ?
FOR UPDATE NOWAIT; -- Fails immediately if locked

UPDATE show_seats
SET status = 'LOCKED', version = version + 1
WHERE show_id = ? AND seat_id = ? AND version = ?;
COMMIT;
```

### 10.2 Edge Cases

#### Case 1: Lock Leakage

```
Problem: User closes browser/app during seat selection
Impact: Seats remain locked for full timeout (10 mins)

Solutions:
1. Heartbeat mechanism:
   - Client sends heartbeat every 30s
   - Server extends lock on heartbeat
   - No heartbeat → Release lock after 2 mins

2. beforeunload event:
   window.addEventListener('beforeunload', () => {
     navigator.sendBeacon('/api/bookings/lock/release', { lockId });
   });

3. Background job: Clean up locks with no heartbeat
```

#### Case 2: Payment Webhook Delay

```
Problem: Payment succeeds but webhook delayed/lost
Impact: Booking stuck in PENDING, seats locked

Solutions:
1. Polling fallback:
   - After payment redirect, poll gateway every 5s
   - Max 12 attempts (1 minute)

2. Reconciliation job:
   - Runs every 5 minutes
   - Finds PENDING payments > 10 mins old
   - Queries gateway API directly
   - Updates booking status

3. Webhook retry:
   - Configure gateway to retry 3 times
   - Exponential backoff: 30s, 2m, 10m
```

#### Case 3: Seat Lock Extension Race

```
Problem: Lock expires during payment processing
Impact: Another user can book the same seat

Solution:
1. Extend lock before payment initiation:
   - Old expiry: 10:15:00
   - New expiry: 10:20:00 (add 5 mins)

2. Payment timeout < Lock timeout:
   - Lock timeout: 10 mins
   - Payment timeout: 5 mins
   - Buffer: 5 mins for processing

3. Lock ownership validation:
   - Before confirming booking, check lock still valid
   - If expired: Fail booking, initiate refund
```

#### Case 4: High Traffic Show (Avengers, IPL)

```
Problem: 10,000 users trying to book 200 seats
Impact: System overload, poor user experience

Solutions:
1. Virtual Waiting Room:
   - Queue users before show page
   - Token-based access
   - Fair ordering (FIFO/random)

2. Rate limiting per show:
   - Max 50 concurrent seat selections per show
   - Queue others
   - Show position in queue

3. Seat pooling:
   - Release seats in batches (50 seats every 2 mins)
   - Prevents instant sell-out
   - More users get a chance

4. CDN for seat map:
   - Cache seat availability
   - Update every 2-3 seconds
   - Eventual consistency acceptable
```

#### Case 5: Refund After Seat Rebooked

```
Problem: User cancels, seat released, another user books, first user claims refund failed
Impact: Potential dispute

Solution:
1. Idempotent refund:
   - Check booking status before refund
   - If already refunded → Return existing refund ID

2. Audit trail:
   - Log all state changes with timestamps
   - Who released seat, who booked it
   - Proof of transaction order

3. Refund window:
   - Allow cancellation up to 2 hours before show
   - After that: No refund (policy-based)
```

#### Case 6: System Clock Skew

```
Problem: Different servers have different times
Impact: Lock expiry inconsistencies

Solutions:
1. NTP synchronization across all servers
2. Use database timestamp (single source of truth)
3. Redis TTL (independent of system clock)
4. Timestamp validation in critical operations
```

#### Case 7: Partial Seat Lock Failure

```
Problem: User selects 5 seats, only 3 get locked
Impact: Inconsistent state

Solution:
1. All-or-nothing locking:
   BEGIN TRANSACTION;
   -- Lock all seats or rollback
   FOR each seat:
     IF NOT lockable: ROLLBACK;
   COMMIT;

2. Compensating transaction:
   IF partial_success:
     Release all acquired locks
     Return error to user

3. Validation before UI update:
   Only show success if ALL seats locked
```

### 10.3 Monitoring & Alerting

```
Critical Metrics:
1. Lock Acquisition Success Rate
   - Target: > 95%
   - Alert: < 90%

2. Booking Confirmation Time
   - Target: < 2s
   - Alert: > 5s

3. Payment Success Rate
   - Target: > 98%
   - Alert: < 95%

4. Lock Leakage Rate
   - Target: < 2%
   - Alert: > 5%

5. Double Booking Incidents
   - Target: 0
   - Alert: > 0 (CRITICAL)

6. API Latency (P99)
   - Seat API: < 200ms
   - Lock API: < 500ms
   - Booking API: < 1s

Dashboard:
- Real-time seat availability per show
- Active locks count
- Payment processing queue
- Error rate by endpoint
- User drop-off funnel

Alerts:
- PagerDuty for critical errors
- Slack for warnings
- Email for daily reports
```

---

## 11. Interview Cross-Questions

### Architecture & Design

**Q1: Why use Redis for seat locking instead of just database locks?**

```
Answer:
1. Performance: Redis is in-memory, < 1ms latency vs DB 10-50ms
2. TTL Support: Automatic expiration of locks without cleanup jobs
3. Atomic Operations: SETNX guarantees atomicity without transactions
4. Scalability: Redis can handle 100K+ ops/sec, DB struggles with locks
5. Reduced DB Load: Frees DB for actual bookings, not temporary locks

Trade-off:
- Redis failure → Fallback to DB-only locking (slower but functional)
- Use Redis Cluster with replication for high availability
```

**Q2: How do you handle the scenario where Redis crashes during peak load?**

```
Answer:
Multi-layer approach:

1. High Availability:
   - Redis Sentinel/Cluster with 3 replicas
   - Auto-failover in < 30 seconds

2. Circuit Breaker Pattern:
   - Detect Redis failures quickly
   - Fallback to database-only locking
   - Gradual recovery when Redis back

3. Graceful Degradation:
   - Slow down seat selection (still works)
   - Increase lock timeout to compensate
   - Show notice: "High traffic, please wait"

4. Hybrid Approach:
   - Write to both Redis and DB
   - Read from Redis (fast path)
   - If Redis miss → Read from DB (slow path)

Code:
async function acquireLock(showId, seatId, userId) {
  try {
    // Try Redis first (fast)
    const locked = await redisClient.set(
      `lock:${showId}:${seatId}`, userId, 'NX', 'EX', 600
    );
    if (locked) {
      await db.insertLock(showId, seatId, userId); // Backup
      return true;
    }
  } catch (err) {
    // Redis failed, fall back to DB
    logger.warn('Redis unavailable, using DB locking');
    return await db.acquireLockWithTransaction(showId, seatId, userId);
  }
  return false;
}
```

**Q3: How would you handle 100,000 concurrent users trying to book 200 seats for Avengers premiere?**

```
Answer:
1. Virtual Waiting Room (Pre-booking Phase):
   - Users join queue before booking opens
   - Token-based access (JWT with queue position)
   - Rate: Allow 500 users/minute to seat selection
   - Fair queuing: FIFO or lottery system

2. Load Distribution:
   - Multiple booking servers (auto-scaling)
   - CDN for static content (posters, theater info)
   - Read replicas for catalog queries
   - Separate Redis cluster for locks

3. Progressive Seat Release:
   - Release 50 seats every 5 minutes
   - Prevents instant sell-out
   - Reduces contention
   - Better UX (users have hope)

4. Optimistic UI:
   - Show approximate availability
   - Update every 5-10 seconds (not real-time)
   - Reduce websocket load

5. Rate Limiting:
   - Per user: 10 lock attempts/min
   - Per show: 100 concurrent locks max
   - API gateway throttling

6. Caching Strategy:
   - Cache seat map for 5 seconds
   - Eventual consistency acceptable
   - Reduce DB queries by 95%

Architecture:
┌──────────────┐
│ Queue System │ → Token → Seat Selection (500/min)
│ (100K users) │                ↓
└──────────────┘        ┌──────────────┐
                        │ Load Balancer│
                        └──────┬───────┘
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
                [Server1]  [Server2]  [Server3]
                    │          │          │
                    └──────────┼──────────┘
                               ▼
                        [Redis Cluster]
                        [DB + Replicas]
```

**Q4: What if payment succeeds but the booking confirmation fails due to database error?**

```
Answer: This is a critical scenario requiring careful handling.

Immediate Actions:
1. Do NOT release seat lock
2. Mark payment as SUCCESS in payments table
3. Log error to critical alert queue
4. Return 500 error to user with message:
   "Payment received. Confirmation pending. Check email in 5 mins."

Recovery Mechanisms:
1. Automatic Retry (Idempotent):
   - Retry booking creation 3 times with exponential backoff
   - Use transaction ID to prevent duplicates
   - If success → Send confirmation email

2. Dead Letter Queue:
   - If retries fail → Move to DLQ
   - Manual intervention by ops team
   - Priority: High (customer paid)

3. Reconciliation Job:
   - Runs every 5 minutes
   - Finds payments with SUCCESS but no booking
   - Attempts to create booking
   - If seat no longer available:
     → Offer alternative seats
     → Auto-refund if user doesn't respond in 24h

4. Customer Communication:
   - Immediate: "Processing your booking..."
   - After 5 mins: Email with status
   - After 1 hour: Call customer support
   - Worst case: Full refund + apology voucher

Code Pattern:
async function handlePaymentSuccess(paymentId, bookingId) {
  const maxRetries = 3;

  for (let i = 0; i < maxRetries; i++) {
    try {
      await db.transaction(async (trx) => {
        // Update booking status
        await trx('bookings')
          .where({ id: bookingId })
          .update({
            status: 'CONFIRMED',
            payment_id: paymentId,
            confirmed_at: new Date()
          });

        // Update seat status
        await trx('show_seats')
          .where({ booking_id: bookingId })
          .update({ status: 'BOOKED' });

        // Release locks
        await releaseLocks(bookingId);
      });

      // Success!
      await sendConfirmationEmail(bookingId);
      return { success: true };

    } catch (err) {
      logger.error(`Booking confirmation failed (attempt ${i+1})`, err);
      if (i === maxRetries - 1) {
        // Failed all retries
        await publishToDeadLetterQueue({
          paymentId,
          bookingId,
          error: err.message
        });
      }
      await sleep(2 ** i * 1000); // Exponential backoff
    }
  }
}
```

**Q5: How do you prevent a user from locking too many seats across multiple shows?**

```
Answer:
1. Rate Limiting:
   - Max 10 seats locked at any time per user
   - Max 3 active locks (different shows) per user
   - Enforced at API gateway + application level

2. Validation Check:
   - Before acquiring new lock:
     SELECT COUNT(*) FROM seat_locks
     WHERE user_id = ? AND status = 'ACTIVE'
   - If count >= 10 → Reject with 429 Too Many Requests

3. Lock Quota System:
   Redis Key: lock_quota:user:{userId}
   Value: { total_seats: 6, shows: ['show1', 'show2'] }

   - Increment on lock acquire
   - Decrement on lock release
   - Atomic INCR/DECR operations

4. Business Rules:
   - Max 10 seats per booking
   - Max 3 concurrent bookings
   - Release old locks before new ones

5. Fraud Detection:
   - Flag users with abnormal patterns
   - Block automated bots
   - CAPTCHA for suspicious activity
```

### Scalability

**Q6: How would you scale this system to handle 1 million concurrent users globally?**

```
Answer:
1. Geographic Distribution:
   - Multi-region deployment (US, EU, APAC)
   - Region-based routing (latency-based)
   - Data residency compliance

2. Database Scaling:
   - Sharding by theater_id or city
   - Separate clusters per region
   - Cross-region replication for read
   - Write to local region only

3. Caching:
   - Global CDN (CloudFront/Cloudflare)
   - Regional Redis clusters
   - Edge caching for static content

4. Service Architecture:
   - Microservices with independent scaling
   - Catalog Service: 100 instances (read-heavy)
   - Booking Service: 50 instances (write-heavy)
   - Payment Service: 30 instances

5. Load Balancing:
   - DNS-based (Route53) for regions
   - Application LB within region
   - Consistent hashing for Redis

6. Asynchronous Processing:
   - Event-driven architecture (Kafka)
   - Notification service scales independently
   - Analytics processed async

7. Auto-scaling:
   - Kubernetes HPA (Horizontal Pod Autoscaling)
   - Scale on CPU, memory, request rate
   - Predictive scaling (ML-based)

8. Database Optimization:
   - Read replicas: 5 per region
   - Connection pooling
   - Query optimization
   - Materialized views for reports

Architecture:
┌─────────────────────────────────────────────────┐
│                Global CDN                        │
│          (Static content, images)               │
└────────────────┬────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │                     │
┌─────▼──────┐       ┌──────▼─────┐
│  US Region │       │ APAC Region│
│            │       │            │
│ App: 50    │       │ App: 50    │
│ Redis: 3   │       │ Redis: 3   │
│ DB: Primary│       │ DB: Replica│
└────────────┘       └────────────┘
```

### Data Consistency

**Q7: How do you ensure no double booking ever happens?**

```
Answer: Multi-layer defense strategy

Layer 1: Atomic Redis Lock
- SETNX operation (atomic SET if Not eXists)
- Only one client can acquire lock
- Foundation of consistency

Layer 2: Database Row Lock
- PostgreSQL: SELECT ... FOR UPDATE NOWAIT
- Pessimistic locking during critical section
- Prevents phantom reads

Layer 3: Optimistic Locking
- Version field in show_seats table
- Update only if version matches
- Detects concurrent modifications

Layer 4: Unique Constraints
- UNIQUE constraint on (show_id, seat_id, status)
  WHERE status = 'LOCKED'
- Database enforces business rule
- Last line of defense

Layer 5: Idempotency
- Lock ID unique per request
- Duplicate requests return same result
- No side effects

Complete Flow:
async function acquireSeatLock(showId, seatId, userId) {
  const lockId = generateUUID();
  const lockKey = `lock:show:${showId}:seat:${seatId}`;

  // Layer 1: Redis atomic lock
  const redisLock = await redis.set(
    lockKey, `${userId}:${lockId}`, 'NX', 'EX', 600
  );
  if (!redisLock) {
    throw new Error('Seat already locked');
  }

  try {
    // Layer 2 & 3: DB with row lock and version check
    const client = await pool.connect();
    await client.query('BEGIN');

    const result = await client.query(`
      SELECT status, version
      FROM show_seats
      WHERE show_id = $1 AND seat_id = $2
      FOR UPDATE NOWAIT
    `, [showId, seatId]);

    if (result.rows[0].status !== 'AVAILABLE') {
      throw new Error('Seat not available');
    }

    // Layer 3: Optimistic lock check
    const updateResult = await client.query(`
      UPDATE show_seats
      SET
        status = 'LOCKED',
        locked_by = $1,
        locked_at = NOW(),
        version = version + 1
      WHERE
        show_id = $2
        AND seat_id = $3
        AND status = 'AVAILABLE'
        AND version = $4
      RETURNING *
    `, [userId, showId, seatId, result.rows[0].version]);

    if (updateResult.rowCount === 0) {
      throw new Error('Concurrent modification detected');
    }

    // Layer 4: Unique constraint enforced by DB
    await client.query(`
      INSERT INTO seat_locks (id, show_id, seat_id, user_id, expires_at)
      VALUES ($1, $2, $3, $4, NOW() + INTERVAL '10 minutes')
    `, [lockId, showId, seatId, userId]);

    await client.query('COMMIT');
    client.release();

    return { lockId, expiresAt: new Date(Date.now() + 600000) };

  } catch (err) {
    // Rollback and release Redis lock
    await redis.del(lockKey);
    throw err;
  }
}

Testing:
- Chaos engineering: Simulate concurrent requests
- Load test: 1000 users on 10 seats
- Expected: Exactly 10 locks acquired, 990 rejected
- Monitor: Zero double bookings in production
```

**Q8: What consistency model do you use and why?**

```
Answer:
Different consistency models for different data:

1. Seat Locks (Strong Consistency):
   - Model: Linearizability
   - Why: Critical to prevent double booking
   - Implementation:
     - Redis: Single master for locks
     - DB: Synchronous replication
     - No stale reads allowed

2. Seat Availability Display (Eventual Consistency):
   - Model: Eventual consistency
   - Why: Performance > Real-time accuracy
   - Implementation:
     - Cache TTL: 5 seconds
     - Users see slightly stale data (acceptable)
     - Actual lock attempt uses strong consistency

3. Booking History (Causal Consistency):
   - Model: Read-your-writes
   - Why: User must see their own bookings immediately
   - Implementation:
     - After booking → Read from primary
     - Other users → Can read from replica

4. Movie Catalog (Eventual Consistency):
   - Model: Eventual consistency
   - Why: Static data, rarely changes
   - Implementation:
     - CDN cache: 1 hour
     - Redis cache: 30 minutes
     - Async invalidation

5. Payment Records (Strong Consistency):
   - Model: Serializable
   - Why: Financial accuracy critical
   - Implementation:
     - ACID transactions
     - Two-phase commit with gateway
     - Reconciliation jobs

CAP Theorem Trade-off:
- Seat locking: CP (Consistency + Partition tolerance)
  - During partition: Reject requests (fail-safe)
  - No availability compromise on correctness

- Catalog browsing: AP (Availability + Partition tolerance)
  - During partition: Serve stale data
  - Better UX than downtime
```

### Performance

**Q9: How do you optimize the seat selection API for sub-200ms response time?**

```
Answer:
1. Caching Strategy:
   - L1: Browser cache (seat layout, static)
   - L2: CDN cache (theater info, images)
   - L3: Redis cache (seat availability)
   - L4: Application memory (hot data)

2. Data Denormalization:
   - Instead of joining 5 tables:
     CREATE MATERIALIZED VIEW show_seat_availability AS
     SELECT
       show_id,
       json_agg(json_build_object(
         'seatId', seat_id,
         'status', status,
         'price', price
       )) as seats
     FROM show_seats
     GROUP BY show_id;

   - Refresh on seat status change
   - Single query instead of joins

3. Redis Optimization:
   - Pipelining: Batch multiple seat checks
   - Hash structure: HGETALL for entire seat map

   Key: seats:show:{showId}
   Value: {
     "A1": "AVAILABLE:200",
     "A2": "LOCKED:200",
     ...
   }

   Single Redis call for all seats

4. Database Optimization:
   - Covering index: Includes all needed columns
     CREATE INDEX idx_covering ON show_seats(show_id)
     INCLUDE (seat_id, status, price);

   - Index-only scan: No table access needed
   - Parallel queries: For large seat maps

5. Network Optimization:
   - HTTP/2: Multiplexing
   - Compression: Gzip response (JSON → 70% smaller)
   - Connection pooling: Reuse connections

6. API Design:
   - Paginated response for large halls (500+ seats)
   - Incremental updates: Only changed seats
   - WebSocket: Push updates (no polling)

7. Code Optimization:
   // Before: N queries
   for (let seat of seats) {
     const status = await getStatus(seat.id); // 200 DB calls
   }

   // After: 1 query
   const statuses = await db.query(`
     SELECT seat_id, status, price
     FROM show_seats
     WHERE show_id = $1
   `, [showId]); // 1 DB call

8. Monitoring:
   - APM: Trace each component (Redis, DB, API)
   - Identify bottlenecks
   - Optimize slowest component first

Typical Breakdown (target < 200ms):
- API Gateway: 10ms
- Redis lookup: 5ms (cache hit)
- DB query: 30ms (cache miss)
- Serialization: 10ms
- Network: 50ms
- Total: 105ms ✓
```

**Q10: How would you design the cancellation and refund flow?**

```
Answer:
Cancellation Flow:

1. User Initiates Cancellation:
   POST /api/v1/bookings/{bookingId}/cancel
   Body: { reason: "User requested" }

2. Validation:
   - Check booking exists and belongs to user
   - Check cancellation policy (e.g., 2 hours before show)
   - Check if already cancelled
   - Calculate refund amount (policy-based)

3. State Transition:
   BEGIN TRANSACTION;

   -- Update booking status
   UPDATE bookings
   SET status = 'CANCELLED', cancelled_at = NOW()
   WHERE id = ? AND status = 'CONFIRMED';

   -- Release seats (make available)
   UPDATE show_seats
   SET status = 'AVAILABLE', booking_id = NULL
   WHERE booking_id = ?;

   -- Create refund record
   INSERT INTO refunds (booking_id, amount, status, reason)
   VALUES (?, ?, 'PENDING', ?);

   COMMIT;

4. Process Refund:
   - Call payment gateway refund API
   - Update refund status: PROCESSING
   - Wait for gateway confirmation (webhook)
   - Update refund status: SUCCESS/FAILED

5. Notification:
   - Email: Cancellation confirmed
   - SMS: Refund initiated
   - Push: Refund processed

Edge Cases:
1. Partial Refund (Late Cancellation):
   - Within 24 hours: 50% refund
   - Within 2 hours: No refund
   - Policy engine for rules

2. Concurrent Cancellation and Rebooking:
   - Seat released → Another user books immediately
   - Original user refund still processed
   - Seat availability updated atomically

3. Refund Failure:
   - Gateway timeout or error
   - Retry 3 times with backoff
   - Manual reconciliation queue
   - Customer support notified

4. Double Cancellation:
   - Idempotency: Check status before cancellation
   - If already cancelled: Return existing refund details
   - No duplicate refunds

Code:
async function cancelBooking(bookingId, userId, reason) {
  // 1. Validate
  const booking = await db.query(`
    SELECT * FROM bookings
    WHERE id = $1 AND user_id = $2 AND status = 'CONFIRMED'
  `, [bookingId, userId]);

  if (!booking.rows.length) {
    throw new Error('Booking not found or already cancelled');
  }

  // 2. Check cancellation policy
  const showTime = booking.rows[0].show_time;
  const hoursUntilShow = (showTime - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilShow < 2) {
    throw new Error('Cancellation not allowed within 2 hours of show');
  }

  const refundPercentage = hoursUntilShow >= 24 ? 100 : 50;
  const refundAmount = booking.rows[0].amount * (refundPercentage / 100);

  // 3. Database transaction
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Update booking
    await client.query(`
      UPDATE bookings
      SET status = 'CANCELLED', cancelled_at = NOW()
      WHERE id = $1
    `, [bookingId]);

    // Release seats atomically
    await client.query(`
      UPDATE show_seats
      SET status = 'AVAILABLE', booking_id = NULL
      WHERE booking_id = $1
    `, [bookingId]);

    // Create refund record
    const refundResult = await client.query(`
      INSERT INTO refunds (id, booking_id, amount, status, reason)
      VALUES ($1, $2, $3, 'PENDING', $4)
      RETURNING *
    `, [generateUUID(), bookingId, refundAmount, reason]);

    await client.query('COMMIT');

    // 4. Async refund processing
    await publishEvent('refund.initiated', {
      refundId: refundResult.rows[0].id,
      paymentId: booking.rows[0].payment_id,
      amount: refundAmount
    });

    // 5. Clear cache
    await redis.del(`booking:${bookingId}`);
    await redis.del(`seats:show:${booking.rows[0].show_id}`);

    return {
      refundId: refundResult.rows[0].id,
      refundAmount,
      estimatedDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    };

  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

// Refund processor (async worker)
async function processRefund(refundId) {
  const refund = await db.getRefund(refundId);

  try {
    // Call payment gateway
    const gatewayResponse = await paymentGateway.initiateRefund({
      paymentId: refund.payment_id,
      amount: refund.amount,
      reason: refund.reason
    });

    // Update status
    await db.updateRefund(refundId, {
      status: 'PROCESSING',
      gateway_refund_id: gatewayResponse.refundId
    });

    // Wait for webhook confirmation
    // (or poll gateway status)

  } catch (err) {
    logger.error('Refund failed', { refundId, error: err });

    // Retry logic
    const retries = refund.retry_count || 0;
    if (retries < 3) {
      await scheduleRetry(refundId, retries + 1);
    } else {
      // Manual intervention needed
      await alertCustomerSupport(refundId);
    }
  }
}
```

---

## 12. Accessibility (A11y)

### 12.1 Seat Map Accessibility

**Challenge**: Seat maps are inherently visual and grid-based, making them difficult for screen reader users.

```
┌─────────────────────────────────────────────────────────────┐
│            Accessible Seat Selection Interface               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Navigation Modes:                                           │
│  1. Grid Navigation (Arrow keys)                            │
│  2. Row Navigation (Jump between rows)                      │
│  3. Search by Seat (Type "A5" to jump)                      │
│  4. Filter by Type (Show only available/premium)            │
│                                                              │
│  Screen Reader Announcements:                               │
│  "Row A, Seat 1, Available, Regular, $200"                  │
│  "Row A, Seat 2, Selected, Premium, $300"                   │
│  "Row A, Seat 3, Booked, Not available"                     │
│  "Row A, Seat 4, Locked by another user"                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Accessible Seat Grid Implementation:**

```jsx
function AccessibleSeatMap({ seats, rows, cols, onSelect }) {
  const [focusedSeat, setFocusedSeat] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const gridRef = useRef(null);

  return (
    <div
      role="application"
      aria-label="Seat selection grid"
      aria-describedby="seat-instructions"
    >
      {/* Instructions for screen readers */}
      <div id="seat-instructions" className="sr-only">
        Use arrow keys to navigate between seats. Press Enter or Space to select
        a seat. Press Escape to clear selection. Selected seats will be
        announced.
      </div>

      {/* Live region for announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {selectedSeats.length > 0 &&
          `${selectedSeats.length} seats selected. Total: $${calculateTotal()}`}
      </div>

      {/* Screen indicator */}
      <div role="img" aria-label="Screen location at top">
        SCREEN THIS WAY
      </div>

      {/* Seat grid */}
      <div
        ref={gridRef}
        role="grid"
        aria-label={`Seat grid with ${rows} rows and ${cols} columns`}
        aria-rowcount={rows}
        aria-colcount={cols}
        onKeyDown={handleKeyDown}
      >
        {seatRows.map((row, rowIndex) => (
          <div
            key={row.name}
            role="row"
            aria-rowindex={rowIndex + 1}
            aria-label={`Row ${row.name}`}
          >
            {/* Row label */}
            <span role="rowheader" aria-label={`Row ${row.name}`}>
              {row.name}
            </span>

            {row.seats.map((seat, colIndex) => (
              <button
                key={seat.id}
                role="gridcell"
                aria-colindex={colIndex + 1}
                aria-selected={selectedSeats.includes(seat.id)}
                aria-disabled={seat.status !== "AVAILABLE"}
                aria-label={getSeatAriaLabel(seat)}
                tabIndex={focusedSeat === seat.id ? 0 : -1}
                className={getSeatClassName(seat)}
                onClick={() => handleSeatClick(seat)}
                onFocus={() => setFocusedSeat(seat.id)}
              >
                <span aria-hidden="true">{seat.number}</span>
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Selection summary */}
      <div role="region" aria-label="Selection summary" aria-live="polite">
        <h3>Selected Seats</h3>
        <ul>
          {selectedSeats.map((seatId) => (
            <li key={seatId}>
              Seat {seatId} - ${getSeatPrice(seatId)}
              <button
                aria-label={`Remove seat ${seatId} from selection`}
                onClick={() => removeSeat(seatId)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
        <p>Total: ${calculateTotal()}</p>
      </div>

      {/* Timer with aria-live */}
      <div
        role="timer"
        aria-live="assertive"
        aria-label={`Time remaining: ${formatTime(timeRemaining)}`}
      >
        {formatTime(timeRemaining)}
      </div>
    </div>
  );
}

function getSeatAriaLabel(seat) {
  const status = {
    AVAILABLE: "Available",
    BOOKED: "Booked, not available",
    LOCKED: "Temporarily held by another user",
    SELECTED: "Selected by you",
  };

  return (
    `Row ${seat.row}, Seat ${seat.number}, ${status[seat.status]}, ` +
    `${seat.type} seat, ${seat.price} dollars`
  );
}
```

### 12.2 Keyboard Navigation

```javascript
function useGridKeyboardNavigation({
  rows,
  cols,
  focusedSeat,
  setFocusedSeat,
  onSelect,
}) {
  const handleKeyDown = useCallback(
    (event) => {
      const { row, col } = getSeatPosition(focusedSeat);

      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          if (col < cols - 1) {
            setFocusedSeat(getSeatId(row, col + 1));
          }
          break;

        case "ArrowLeft":
          event.preventDefault();
          if (col > 0) {
            setFocusedSeat(getSeatId(row, col - 1));
          }
          break;

        case "ArrowDown":
          event.preventDefault();
          if (row < rows - 1) {
            setFocusedSeat(getSeatId(row + 1, col));
          }
          break;

        case "ArrowUp":
          event.preventDefault();
          if (row > 0) {
            setFocusedSeat(getSeatId(row - 1, col));
          }
          break;

        case "Enter":
        case " ":
          event.preventDefault();
          onSelect(focusedSeat);
          break;

        case "Home":
          event.preventDefault();
          if (event.ctrlKey) {
            // First seat in grid
            setFocusedSeat(getSeatId(0, 0));
          } else {
            // First seat in row
            setFocusedSeat(getSeatId(row, 0));
          }
          break;

        case "End":
          event.preventDefault();
          if (event.ctrlKey) {
            // Last seat in grid
            setFocusedSeat(getSeatId(rows - 1, cols - 1));
          } else {
            // Last seat in row
            setFocusedSeat(getSeatId(row, cols - 1));
          }
          break;

        case "PageDown":
          event.preventDefault();
          // Jump 5 rows down
          setFocusedSeat(getSeatId(Math.min(row + 5, rows - 1), col));
          break;

        case "PageUp":
          event.preventDefault();
          // Jump 5 rows up
          setFocusedSeat(getSeatId(Math.max(row - 5, 0), col));
          break;
      }
    },
    [rows, cols, focusedSeat, setFocusedSeat, onSelect]
  );

  return { handleKeyDown };
}
```

### 12.3 Color-Blind Friendly Design

```css
/* Don't rely only on colors - use patterns and icons */
.seat {
  position: relative;
  min-width: 32px;
  min-height: 32px;
}

/* Available - Green with checkmark pattern */
.seat--available {
  background-color: #22c55e;
  background-image: url("data:image/svg+xml,..."); /* Subtle pattern */
}

/* Selected - Blue with filled circle */
.seat--selected {
  background-color: #3b82f6;
  border: 3px solid #1d4ed8;
}
.seat--selected::after {
  content: "✓";
  position: absolute;
  font-size: 14px;
}

/* Booked - Gray with X pattern */
.seat--booked {
  background-color: #9ca3af;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 3px,
    rgba(0, 0, 0, 0.1) 3px,
    rgba(0, 0, 0, 0.1) 6px
  );
}
.seat--booked::after {
  content: "×";
  position: absolute;
}

/* Locked - Yellow with clock icon */
.seat--locked {
  background-color: #fbbf24;
  border: 2px dashed #92400e;
}
.seat--locked::before {
  content: "⏰";
  font-size: 10px;
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .seat--available {
    background: white;
    border: 2px solid green;
  }
  .seat--selected {
    background: blue;
    color: white;
  }
  .seat--booked {
    background: black;
    color: white;
  }
  .seat--locked {
    background: yellow;
    border: 2px dashed black;
  }
}

/* Visible focus indicator */
.seat:focus-visible {
  outline: 3px solid #000;
  outline-offset: 2px;
  box-shadow: 0 0 0 6px rgba(59, 130, 246, 0.5);
}
```

### 12.4 Timer Accessibility

```jsx
function AccessibleTimer({ expiresAt, onExpire }) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(expiresAt));
  const [announced, setAnnounced] = useState(new Set());

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = calculateTimeLeft(expiresAt);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        onExpire();
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [expiresAt, onExpire]);

  // Announce at key intervals
  const announcements = [300, 120, 60, 30, 10]; // 5min, 2min, 1min, 30s, 10s

  useEffect(() => {
    for (const threshold of announcements) {
      if (timeLeft <= threshold && !announced.has(threshold)) {
        setAnnounced((prev) => new Set([...prev, threshold]));
        break; // Only announce once per threshold
      }
    }
  }, [timeLeft, announced]);

  const urgency = timeLeft <= 60 ? "assertive" : "polite";
  const isUrgent = timeLeft <= 60;

  return (
    <>
      {/* Visual timer */}
      <div
        className={`timer ${isUrgent ? "timer--urgent" : ""}`}
        aria-hidden="true"
      >
        {formatTime(timeLeft)}
      </div>

      {/* Screen reader announcements */}
      <div
        role="timer"
        aria-live={urgency}
        aria-atomic="true"
        className="sr-only"
      >
        {getTimeAnnouncement(timeLeft)}
      </div>
    </>
  );
}

function getTimeAnnouncement(seconds) {
  if (seconds <= 10) return `Warning: Only ${seconds} seconds remaining!`;
  if (seconds <= 30) return `30 seconds remaining to complete your booking`;
  if (seconds <= 60) return `1 minute remaining`;
  if (seconds <= 120) return `2 minutes remaining`;
  if (seconds <= 300) return `5 minutes remaining`;
  return `${Math.floor(seconds / 60)} minutes remaining`;
}
```

### 12.5 Accessibility Testing Checklist

```
Seat Selection Testing:
□ Navigate entire grid using only keyboard
□ Screen reader announces seat details correctly
□ Focus indicator visible on all seats
□ Selected seats announced immediately
□ Timer countdown announced at key intervals
□ Error messages read by screen reader
□ Works with 200% zoom
□ Passes color contrast requirements (4.5:1)

Payment Flow Testing:
□ Form fields have proper labels
□ Error messages associated with fields
□ Focus moves to first error on validation
□ Success confirmation announced
□ Loading states communicated

Mobile Accessibility:
□ Touch targets minimum 44x44px
□ VoiceOver/TalkBack compatibility
□ Zoom gestures don't break layout
□ Reduced motion preference respected
```

---

## 13. Mobile & Touch Considerations

### 13.1 Responsive Seat Map

```
┌─────────────────────────────────────────────────────────────┐
│              Mobile Seat Map Strategies                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Strategy 1: Horizontal Scroll                               │
│  ┌─────────────────────────────────────────┐                │
│  │ ←  [A1][A2][A3][A4][A5][A6][A7][A8]  → │                │
│  │     [B1][B2][B3][B4][B5][B6][B7][B8]    │                │
│  └─────────────────────────────────────────┘                │
│  Pros: Natural scrolling, no zoom needed                    │
│  Cons: Hard to see full layout                              │
│                                                              │
│  Strategy 2: Pinch-to-Zoom                                  │
│  ┌─────────────────────────────────────────┐                │
│  │        [Minimap in corner]              │                │
│  │    ┌──────────────────────┐            │                │
│  │    │ [A1][A2][A3][A4]     │            │                │
│  │    │ [B1][B2][B3][B4]  👆  │            │                │
│  │    └──────────────────────┘            │                │
│  └─────────────────────────────────────────┘                │
│  Pros: See detail and overview                              │
│  Cons: More complex interaction                              │
│                                                              │
│  Strategy 3: Row-by-Row Selection (Recommended for mobile)  │
│  ┌─────────────────────────────────────────┐                │
│  │  Select Row:  [A] [B] [C] [D] [E] ...   │                │
│  │                                          │                │
│  │  Row B Seats:                           │                │
│  │  [1✓] [2✓] [3] [4] [5×] [6] [7] [8]   │                │
│  │                                          │                │
│  │  Selected: B1, B2  |  $400             │                │
│  └─────────────────────────────────────────┘                │
│  Pros: Large touch targets, clear flow                      │
│  Cons: Less visual context                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 13.2 Pinch-to-Zoom Implementation

```jsx
function ZoomableSeatMap({ children }) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [lastDistance, setLastDistance] = useState(0);
  const containerRef = useRef(null);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const distance = getDistance(e.touches[0], e.touches[1]);
      setLastDistance(distance);
    }
  }, []);

  const handleTouchMove = useCallback(
    (e) => {
      if (e.touches.length === 2) {
        e.preventDefault();

        const distance = getDistance(e.touches[0], e.touches[1]);
        const delta = distance - lastDistance;

        setScale((prev) => {
          const newScale = prev + delta * 0.01;
          return Math.min(Math.max(newScale, 0.5), 3); // Min 0.5x, Max 3x
        });

        setLastDistance(distance);
      } else if (e.touches.length === 1 && scale > 1) {
        // Pan when zoomed in
        const touch = e.touches[0];
        setPosition((prev) => ({
          x: prev.x + touch.movementX,
          y: prev.y + touch.movementY,
        }));
      }
    },
    [lastDistance, scale]
  );

  const handleDoubleTap = useCallback(
    (e) => {
      if (scale === 1) {
        // Zoom to 2x centered on tap point
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setScale(2);
        setPosition({
          x: -(x - rect.width / 2),
          y: -(y - rect.height / 2),
        });
      } else {
        // Reset zoom
        setScale(1);
        setPosition({ x: 0, y: 0 });
      }
    },
    [scale]
  );

  return (
    <div
      ref={containerRef}
      className="seat-map-container"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      style={{ overflow: "hidden", touchAction: "none" }}
    >
      <div
        className="seat-map-content"
        style={{
          transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
          transformOrigin: "center center",
        }}
      >
        {children}
      </div>

      {/* Minimap */}
      {scale > 1 && (
        <Minimap scale={scale} position={position} onNavigate={setPosition} />
      )}

      {/* Zoom controls */}
      <div className="zoom-controls">
        <button onClick={() => setScale((s) => Math.min(s + 0.5, 3))}>+</button>
        <button onClick={() => setScale((s) => Math.max(s - 0.5, 0.5))}>
          −
        </button>
        <button
          onClick={() => {
            setScale(1);
            setPosition({ x: 0, y: 0 });
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

function getDistance(touch1, touch2) {
  return Math.hypot(
    touch2.clientX - touch1.clientX,
    touch2.clientY - touch1.clientY
  );
}
```

### 13.3 Touch-Optimized Seat Selection

```css
/* Mobile-first seat styles */
.seat {
  /* Minimum touch target */
  min-width: 44px;
  min-height: 44px;

  /* Visual feedback */
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;

  /* Prevent accidental selection */
  user-select: none;
  -webkit-user-select: none;
}

/* Active state feedback */
.seat:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* Haptic feedback trigger class */
.seat--selected {
  animation: selectPulse 0.2s ease;
}

@keyframes selectPulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

/* Larger seats on mobile */
@media (max-width: 768px) {
  .seat {
    min-width: 36px;
    min-height: 36px;
    font-size: 12px;
  }

  .seat-row-label {
    min-width: 24px;
    font-size: 14px;
    font-weight: bold;
  }
}

/* Extra large for accessibility mode */
.seat-map--large-mode .seat {
  min-width: 56px;
  min-height: 56px;
  font-size: 16px;
}
```

### 13.4 Mobile Payment Integrations

```javascript
// Apple Pay / Google Pay Integration
async function initializeMobilePayment(bookingDetails) {
  // Check availability
  const applePayAvailable = window.ApplePaySession?.canMakePayments();
  const googlePayAvailable = await checkGooglePayAvailability();

  return {
    applePay: applePayAvailable,
    googlePay: googlePayAvailable,
    upi: isIndianDevice(), // UPI for Indian users
    paytm: isPaytmInstalled(),
  };
}

// Apple Pay Implementation
async function processApplePay(booking) {
  const paymentRequest = {
    countryCode: "US",
    currencyCode: "USD",
    merchantCapabilities: ["supports3DS"],
    supportedNetworks: ["visa", "masterCard", "amex"],
    total: {
      label: `Movie Tickets - ${booking.movieName}`,
      amount: booking.totalAmount.toString(),
    },
    lineItems: booking.seats.map((seat) => ({
      label: `Seat ${seat.id}`,
      amount: seat.price.toString(),
    })),
  };

  const session = new ApplePaySession(3, paymentRequest);

  session.onvalidatemerchant = async (event) => {
    const merchantSession = await fetch("/api/apple-pay/validate", {
      method: "POST",
      body: JSON.stringify({ validationURL: event.validationURL }),
    }).then((r) => r.json());

    session.completeMerchantValidation(merchantSession);
  };

  session.onpaymentauthorized = async (event) => {
    const result = await processPayment({
      bookingId: booking.id,
      paymentMethod: "APPLE_PAY",
      token: event.payment.token,
    });

    session.completePayment(
      result.success
        ? ApplePaySession.STATUS_SUCCESS
        : ApplePaySession.STATUS_FAILURE
    );
  };

  session.begin();
}

// Google Pay Implementation
async function processGooglePay(booking) {
  const paymentsClient = new google.payments.api.PaymentsClient({
    environment: "PRODUCTION",
  });

  const paymentDataRequest = {
    apiVersion: 2,
    apiVersionMinor: 0,
    merchantInfo: {
      merchantId: "MERCHANT_ID",
      merchantName: "BookMyShow",
    },
    transactionInfo: {
      totalPriceStatus: "FINAL",
      totalPrice: booking.totalAmount.toString(),
      currencyCode: "USD",
      countryCode: "US",
    },
  };

  const paymentData = await paymentsClient.loadPaymentData(paymentDataRequest);

  return processPayment({
    bookingId: booking.id,
    paymentMethod: "GOOGLE_PAY",
    token: paymentData.paymentMethodData.tokenizationData.token,
  });
}
```

### 13.5 Offline Ticket Display

```jsx
// Save ticket for offline access
function TicketWallet({ booking }) {
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    saveTicketOffline(booking).then(() => setIsOfflineReady(true));
  }, [booking]);

  return (
    <div className="ticket-wallet">
      <div className="ticket-card">
        {/* QR Code - works offline */}
        <QRCode
          value={booking.qrCode}
          size={200}
          level="H" // High error correction
        />

        <div className="ticket-details">
          <h2>{booking.movieName}</h2>
          <p>{booking.theaterName}</p>
          <p>{formatDate(booking.showTime)}</p>
          <p>Seats: {booking.seats.join(", ")}</p>
          <p>Booking ID: {booking.reference}</p>
        </div>

        {isOfflineReady && (
          <div className="offline-badge">✓ Available offline</div>
        )}
      </div>

      <button onClick={() => addToWallet(booking)}>
        Add to Apple Wallet / Google Pay
      </button>
    </div>
  );
}

async function saveTicketOffline(booking) {
  // Save to IndexedDB
  const db = await openDatabase("tickets");
  await db.put("bookings", {
    id: booking.id,
    data: booking,
    qrCodeBlob: await generateQRBlob(booking.qrCode),
    savedAt: Date.now(),
  });

  // Register for background sync
  if ("serviceWorker" in navigator && "sync" in registration) {
    await registration.sync.register("sync-tickets");
  }
}
```

---

## 14. Security Deep Dive

### 14.1 PCI DSS Compliance

```
┌─────────────────────────────────────────────────────────────┐
│              PCI DSS Compliance Architecture                 │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Frontend (Out of Scope):                                   │
│  ┌─────────────────────────────────────────┐               │
│  │  Payment Form with iframe               │               │
│  │  (Hosted by Payment Gateway)            │               │
│  │                                          │               │
│  │  ┌───────────────────────────────┐     │               │
│  │  │  Card Number: ****           │     │               │
│  │  │  Expiry: **/**               │     │               │
│  │  │  CVV: ***                    │     │               │
│  │  └───────────────────────────────┘     │               │
│  │       ↓ Token only (no card data)       │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
│  Backend (PCI SAQ-A):                                       │
│  ┌─────────────────────────────────────────┐               │
│  │  - Never touches card data              │               │
│  │  - Only receives payment tokens         │               │
│  │  - Tokens stored encrypted (AES-256)    │               │
│  │  - Audit logs for all payment actions   │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
│  Payment Gateway (PCI Level 1):                             │
│  ┌─────────────────────────────────────────┐               │
│  │  Razorpay / Stripe / PayU               │               │
│  │  - Handles actual card processing       │               │
│  │  - Stores encrypted card data           │               │
│  │  - Returns token/reference              │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘

Key Requirements:
□ No card data in our systems (tokenization)
□ HTTPS everywhere (TLS 1.2+)
□ Payment page served from gateway iframe
□ Webhook signature verification
□ Encryption at rest for payment tokens
□ Access controls for payment APIs
□ Audit logging for compliance
```

### 14.2 Bot Detection & Prevention

```javascript
// Multi-layer bot detection
class BotDetector {
  constructor() {
    this.signals = {};
  }

  async analyze(request, context) {
    const scores = await Promise.all([
      this.checkBehavior(context),
      this.checkDeviceFingerprint(context),
      this.checkRateLimits(request),
      this.checkIP(request),
      this.checkCaptcha(context),
    ]);

    const totalScore = scores.reduce((sum, s) => sum + s, 0);
    return {
      isBot: totalScore > 70,
      score: totalScore,
      signals: this.signals,
    };
  }

  async checkBehavior(context) {
    const { mouseMovements, keystrokes, touchEvents, timing } = context;

    // Bots often have:
    // - No mouse movements
    // - Perfectly timed actions
    // - No scroll events
    // - Instant form fills

    let score = 0;

    if (!mouseMovements || mouseMovements.length < 5) {
      score += 20;
      this.signals.noMouseMovement = true;
    }

    if (timing.formFillTime < 1000) {
      // < 1 second to fill form
      score += 30;
      this.signals.instantFormFill = true;
    }

    if (!touchEvents && isMobileUserAgent(context.userAgent)) {
      score += 25;
      this.signals.mobileWithoutTouch = true;
    }

    return score;
  }

  async checkDeviceFingerprint(context) {
    const fingerprint = await generateFingerprint(context);

    // Check against known bot fingerprints
    const isKnownBot = await redis.sismember("bot_fingerprints", fingerprint);

    if (isKnownBot) {
      this.signals.knownBotFingerprint = true;
      return 50;
    }

    // Check fingerprint anomalies
    const anomalies = detectAnomalies(fingerprint);
    return anomalies.length * 10;
  }

  async checkRateLimits(request) {
    const { userId, ip, deviceId } = request;

    // Multiple rate limit checks
    const checks = [
      { key: `rate:ip:${ip}`, limit: 100, window: 60 },
      { key: `rate:user:${userId}`, limit: 50, window: 60 },
      { key: `rate:device:${deviceId}`, limit: 30, window: 60 },
      { key: `rate:lock:${userId}`, limit: 10, window: 60 }, // Seat lock attempts
    ];

    let score = 0;
    for (const check of checks) {
      const count = await redis.incr(check.key);
      if (count === 1) {
        await redis.expire(check.key, check.window);
      }

      if (count > check.limit) {
        score += 20;
        this.signals[`exceeded_${check.key}`] = true;
      }
    }

    return score;
  }
}

// CAPTCHA Integration (invisible reCAPTCHA v3)
async function verifyCaptcha(token, action, minScore = 0.5) {
  const response = await fetch(
    `https://www.google.com/recaptcha/api/siteverify`,
    {
      method: "POST",
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET,
        response: token,
      }),
    }
  );

  const result = await response.json();

  return {
    valid: result.success && result.score >= minScore,
    score: result.score,
    action: result.action,
  };
}

// Implement in seat lock endpoint
app.post("/api/bookings/lock", async (req, res) => {
  // 1. Verify CAPTCHA
  const captcha = await verifyCaptcha(req.body.captchaToken, "seat_lock");
  if (!captcha.valid) {
    return res.status(403).json({ error: "CAPTCHA_FAILED" });
  }

  // 2. Bot detection
  const botAnalysis = await botDetector.analyze(req, req.body.context);
  if (botAnalysis.isBot) {
    logger.warn("Bot detected", { signals: botAnalysis.signals });
    return res.status(403).json({ error: "SUSPICIOUS_ACTIVITY" });
  }

  // 3. Proceed with lock
  // ...
});
```

### 14.3 Fraud Detection

```javascript
// Fraud detection for ticket booking
class FraudDetector {
  async analyzeBooking(booking, user) {
    const riskFactors = [];
    let riskScore = 0;

    // 1. Multiple bookings same show
    const recentBookings = await db.query(
      `
      SELECT COUNT(*) as count
      FROM bookings
      WHERE user_id = $1 AND show_id = $2 AND created_at > NOW() - INTERVAL '1 hour'
    `,
      [user.id, booking.showId]
    );

    if (recentBookings.count > 2) {
      riskScore += 30;
      riskFactors.push("MULTIPLE_BOOKINGS_SAME_SHOW");
    }

    // 2. New account bulk booking
    const accountAge = Date.now() - new Date(user.createdAt);
    const accountAgeDays = accountAge / (1000 * 60 * 60 * 24);

    if (accountAgeDays < 1 && booking.seatCount > 4) {
      riskScore += 40;
      riskFactors.push("NEW_ACCOUNT_BULK_BOOKING");
    }

    // 3. Different cards for same user
    const uniqueCards = await db.query(
      `
      SELECT COUNT(DISTINCT card_fingerprint) as count
      FROM payments
      WHERE user_id = $1 AND created_at > NOW() - INTERVAL '24 hours'
    `,
      [user.id]
    );

    if (uniqueCards.count > 3) {
      riskScore += 35;
      riskFactors.push("MULTIPLE_PAYMENT_METHODS");
    }

    // 4. High-value transaction from new device
    const isNewDevice = !(await isKnownDevice(user.id, booking.deviceId));
    if (isNewDevice && booking.amount > 1000) {
      riskScore += 25;
      riskFactors.push("NEW_DEVICE_HIGH_VALUE");
    }

    // 5. Geographic anomaly
    const userLocation = await getIPLocation(booking.ipAddress);
    const theaterLocation = await getTheaterLocation(booking.theaterId);
    const distance = calculateDistance(userLocation, theaterLocation);

    if (distance > 500) {
      // > 500 km from theater
      riskScore += 20;
      riskFactors.push("GEOGRAPHIC_ANOMALY");
    }

    // 6. Velocity check (too many attempts)
    const recentAttempts = await redis.get(`attempts:${user.id}`);
    if (recentAttempts > 10) {
      riskScore += 25;
      riskFactors.push("HIGH_ATTEMPT_VELOCITY");
    }

    return {
      riskScore,
      riskFactors,
      decision: getRiskDecision(riskScore),
    };
  }
}

function getRiskDecision(score) {
  if (score >= 70) return "BLOCK";
  if (score >= 50) return "MANUAL_REVIEW";
  if (score >= 30) return "STEP_UP_AUTH"; // Additional verification
  return "ALLOW";
}

// Apply fraud check in booking flow
app.post("/api/bookings", async (req, res) => {
  const fraudResult = await fraudDetector.analyzeBooking(req.body, req.user);

  switch (fraudResult.decision) {
    case "BLOCK":
      logger.warn("Booking blocked - fraud", {
        factors: fraudResult.riskFactors,
      });
      return res.status(403).json({
        error: "BOOKING_BLOCKED",
        message: "Unable to process booking. Contact support.",
      });

    case "MANUAL_REVIEW":
      // Create booking but hold for review
      const booking = await createBooking(req.body, {
        status: "PENDING_REVIEW",
      });
      await notifyFraudTeam(booking, fraudResult);
      return res.json({ ...booking, requiresReview: true });

    case "STEP_UP_AUTH":
      // Request additional verification
      return res.status(428).json({
        error: "VERIFICATION_REQUIRED",
        verificationType: "OTP",
      });

    default:
      // Proceed normally
      const booking = await createBooking(req.body);
      return res.json(booking);
  }
});
```

### 14.4 Scalper Prevention

```javascript
// Anti-scalping measures
const SCALPER_RULES = {
  maxSeatsPerShow: 10,
  maxBookingsPerDay: 5,
  maxBookingsPerWeek: 20,
  cooldownBetweenBookings: 60, // seconds
  blacklistedPatterns: [/ticket.*(resale|sell)/i, /bulk.*purchase/i],
};

async function checkScalperActivity(userId, booking) {
  const violations = [];

  // 1. Seats per show limit
  const seatsThisShow = await db.query(
    `
    SELECT SUM(seat_count) as total
    FROM bookings
    WHERE user_id = $1 AND show_id = $2 AND status = 'CONFIRMED'
  `,
    [userId, booking.showId]
  );

  if (seatsThisShow.total + booking.seatCount > SCALPER_RULES.maxSeatsPerShow) {
    violations.push("MAX_SEATS_PER_SHOW");
  }

  // 2. Daily booking limit
  const bookingsToday = await db.query(
    `
    SELECT COUNT(*) as count
    FROM bookings
    WHERE user_id = $1 AND DATE(created_at) = CURRENT_DATE AND status = 'CONFIRMED'
  `,
    [userId]
  );

  if (bookingsToday.count >= SCALPER_RULES.maxBookingsPerDay) {
    violations.push("MAX_BOOKINGS_PER_DAY");
  }

  // 3. Cooldown between bookings
  const lastBooking = await redis.get(`last_booking:${userId}`);
  if (lastBooking) {
    const elapsed = Date.now() - parseInt(lastBooking);
    if (elapsed < SCALPER_RULES.cooldownBetweenBookings * 1000) {
      violations.push("COOLDOWN_VIOLATION");
    }
  }

  // 4. IP-based detection (same IP, multiple accounts)
  const accountsFromIP = await redis.smembers(`ip_accounts:${booking.ip}`);
  if (accountsFromIP.length > 3) {
    violations.push("MULTIPLE_ACCOUNTS_SAME_IP");
  }

  // 5. Phone number sharing
  const accountsWithPhone = await db.query(
    `
    SELECT COUNT(DISTINCT id) as count
    FROM users
    WHERE phone = $1
  `,
    [booking.user.phone]
  );

  if (accountsWithPhone.count > 1) {
    violations.push("SHARED_PHONE_NUMBER");
  }

  return {
    isScalper: violations.length >= 2,
    violations,
    action: violations.length >= 2 ? "BLOCK" : "ALLOW",
  };
}
```

---

## 15. Comprehensive Testing Strategy

### 15.1 Unit Tests

```javascript
// Seat Lock Unit Tests
describe("SeatLockManager", () => {
  let lockManager;
  let redisMock;
  let dbMock;

  beforeEach(() => {
    redisMock = createRedisMock();
    dbMock = createDbMock();
    lockManager = new SeatLockManager(redisMock, dbMock);
  });

  describe("acquireLock", () => {
    it("should acquire lock for available seat", async () => {
      redisMock.set.mockResolvedValue("OK");
      dbMock.query.mockResolvedValue({ rows: [{ status: "AVAILABLE" }] });

      const result = await lockManager.acquireLock("show1", "A1", "user1");

      expect(result.success).toBe(true);
      expect(result.lockId).toBeDefined();
      expect(redisMock.set).toHaveBeenCalledWith(
        "lock:show:show1:seat:A1",
        expect.any(String),
        "NX",
        "EX",
        600
      );
    });

    it("should fail when seat already locked", async () => {
      redisMock.set.mockResolvedValue(null); // SETNX returns null if key exists

      const result = await lockManager.acquireLock("show1", "A1", "user1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("SEAT_LOCKED");
    });

    it("should fail when seat already booked", async () => {
      redisMock.set.mockResolvedValue("OK");
      dbMock.query.mockResolvedValue({ rows: [{ status: "BOOKED" }] });

      const result = await lockManager.acquireLock("show1", "A1", "user1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("SEAT_UNAVAILABLE");
      // Should cleanup Redis lock
      expect(redisMock.del).toHaveBeenCalled();
    });

    it("should handle multiple seats atomically", async () => {
      const seatIds = ["A1", "A2", "A3"];
      redisMock.multi.mockReturnThis();
      redisMock.set.mockReturnThis();
      redisMock.exec.mockResolvedValue([["OK"], ["OK"], ["OK"]]);

      const result = await lockManager.acquireMultiple(
        "show1",
        seatIds,
        "user1"
      );

      expect(result.success).toBe(true);
      expect(result.lockedSeats).toHaveLength(3);
    });

    it("should rollback on partial failure", async () => {
      const seatIds = ["A1", "A2", "A3"];
      redisMock.multi.mockReturnThis();
      redisMock.exec.mockResolvedValue([["OK"], [null], ["OK"]]); // A2 fails

      const result = await lockManager.acquireMultiple(
        "show1",
        seatIds,
        "user1"
      );

      expect(result.success).toBe(false);
      expect(result.error).toBe("PARTIAL_LOCK_FAILURE");
      // Should release A1 and A3
      expect(redisMock.del).toHaveBeenCalledTimes(2);
    });
  });

  describe("releaseLock", () => {
    it("should release lock owned by user", async () => {
      redisMock.get.mockResolvedValue("user1:lock123");
      redisMock.del.mockResolvedValue(1);

      const result = await lockManager.releaseLock("lock123", "user1");

      expect(result.success).toBe(true);
    });

    it("should not release lock owned by another user", async () => {
      redisMock.get.mockResolvedValue("user2:lock123"); // Different user

      const result = await lockManager.releaseLock("lock123", "user1");

      expect(result.success).toBe(false);
      expect(result.error).toBe("NOT_LOCK_OWNER");
    });
  });
});

// Payment Service Unit Tests
describe("PaymentService", () => {
  describe("processPayment", () => {
    it("should handle idempotent requests", async () => {
      const idempotencyKey = "key123";

      // First request
      const result1 = await paymentService.processPayment({
        bookingId: "b1",
        amount: 100,
        idempotencyKey,
      });

      // Second request with same key
      const result2 = await paymentService.processPayment({
        bookingId: "b1",
        amount: 100,
        idempotencyKey,
      });

      expect(result1.paymentId).toBe(result2.paymentId);
      expect(gatewayMock.charge).toHaveBeenCalledTimes(1); // Only once
    });

    it("should extend lock before payment", async () => {
      await paymentService.processPayment({
        bookingId: "b1",
        lockId: "lock1",
        amount: 100,
      });

      expect(lockManager.extendLock).toHaveBeenCalledWith("lock1", 300); // 5 mins
    });
  });
});
```

### 15.2 Integration Tests

```javascript
// Integration test with real Redis and DB
describe("Booking Flow Integration", () => {
  let app;
  let redis;
  let db;

  beforeAll(async () => {
    app = await createTestApp();
    redis = await createTestRedis();
    db = await createTestDatabase();
  });

  afterAll(async () => {
    await redis.quit();
    await db.end();
  });

  beforeEach(async () => {
    await redis.flushall();
    await db.query("TRUNCATE bookings, seat_locks, show_seats CASCADE");
    await seedTestData(db);
  });

  describe("Complete Booking Flow", () => {
    it("should complete booking successfully", async () => {
      const user = await createTestUser();

      // 1. Get seat availability
      const seatsResponse = await request(app)
        .get("/api/v1/shows/show1/seats")
        .set("Authorization", `Bearer ${user.token}`);

      expect(seatsResponse.status).toBe(200);
      const availableSeats = seatsResponse.body.seats
        .filter((s) => s.status === "AVAILABLE")
        .slice(0, 2);

      // 2. Lock seats
      const lockResponse = await request(app)
        .post("/api/v1/bookings/lock")
        .set("Authorization", `Bearer ${user.token}`)
        .send({
          showId: "show1",
          seatIds: availableSeats.map((s) => s.id),
        });

      expect(lockResponse.status).toBe(200);
      expect(lockResponse.body.lockId).toBeDefined();

      // Verify seats are locked in Redis
      for (const seat of availableSeats) {
        const lock = await redis.get(`lock:show:show1:seat:${seat.id}`);
        expect(lock).toContain(user.id);
      }

      // 3. Create booking
      const bookingResponse = await request(app)
        .post("/api/v1/bookings")
        .set("Authorization", `Bearer ${user.token}`)
        .send({
          lockId: lockResponse.body.lockId,
          paymentMethod: "CARD",
        });

      expect(bookingResponse.status).toBe(201);
      expect(bookingResponse.body.status).toBe("PENDING");

      // 4. Simulate payment webhook
      const webhookResponse = await request(app)
        .post("/api/v1/payments/webhook")
        .set("X-Razorpay-Signature", generateSignature(paymentData))
        .send({
          paymentId: bookingResponse.body.paymentId,
          status: "SUCCESS",
        });

      expect(webhookResponse.status).toBe(200);

      // 5. Verify final state
      const finalBooking = await db.query(
        "SELECT * FROM bookings WHERE id = $1",
        [bookingResponse.body.bookingId]
      );

      expect(finalBooking.rows[0].status).toBe("CONFIRMED");

      // Verify seats are booked
      const seats = await db.query(
        "SELECT * FROM show_seats WHERE booking_id = $1",
        [bookingResponse.body.bookingId]
      );

      expect(seats.rows).toHaveLength(2);
      seats.rows.forEach((seat) => {
        expect(seat.status).toBe("BOOKED");
      });

      // Verify locks released
      for (const seat of availableSeats) {
        const lock = await redis.get(`lock:show:show1:seat:${seat.id}`);
        expect(lock).toBeNull();
      }
    });

    it("should handle concurrent lock attempts", async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const seatId = "A1";

      // Concurrent lock attempts
      const [result1, result2] = await Promise.all([
        request(app)
          .post("/api/v1/bookings/lock")
          .set("Authorization", `Bearer ${user1.token}`)
          .send({ showId: "show1", seatIds: [seatId] }),
        request(app)
          .post("/api/v1/bookings/lock")
          .set("Authorization", `Bearer ${user2.token}`)
          .send({ showId: "show1", seatIds: [seatId] }),
      ]);

      // Exactly one should succeed
      const successes = [result1, result2].filter((r) => r.status === 200);
      const failures = [result1, result2].filter((r) => r.status === 409);

      expect(successes).toHaveLength(1);
      expect(failures).toHaveLength(1);
    });
  });
});
```

### 15.3 Load Testing

```javascript
// k6 load test script
import http from "k6/http";
import { check, sleep, group } from "k6";
import { Rate, Trend } from "k6/metrics";

const errorRate = new Rate("errors");
const lockLatency = new Trend("lock_latency");
const bookingLatency = new Trend("booking_latency");

export const options = {
  scenarios: {
    // Simulate normal load
    normal_load: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "2m", target: 100 },
        { duration: "5m", target: 100 },
        { duration: "2m", target: 0 },
      ],
    },

    // Simulate peak load (movie premiere)
    peak_load: {
      executor: "ramping-arrival-rate",
      startRate: 0,
      timeUnit: "1s",
      preAllocatedVUs: 500,
      stages: [
        { duration: "1m", target: 100 },
        { duration: "3m", target: 500 },
        { duration: "1m", target: 0 },
      ],
    },

    // Simulate seat contention
    seat_contention: {
      executor: "per-vu-iterations",
      vus: 50,
      iterations: 10,
      maxDuration: "5m",
    },
  },

  thresholds: {
    http_req_duration: ["p(95)<500", "p(99)<1000"],
    errors: ["rate<0.01"],
    lock_latency: ["p(95)<200"],
    booking_latency: ["p(95)<1000"],
  },
};

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";
const SHOW_ID = __ENV.SHOW_ID || "test-show-1";

export default function () {
  const userToken = login();

  group("Seat Selection Flow", () => {
    // 1. Get available seats
    const seatsRes = http.get(`${BASE_URL}/api/v1/shows/${SHOW_ID}/seats`, {
      headers: { Authorization: `Bearer ${userToken}` },
    });

    check(seatsRes, {
      "seats retrieved": (r) => r.status === 200,
    });

    const seats = JSON.parse(seatsRes.body).seats;
    const available = seats.filter((s) => s.status === "AVAILABLE");

    if (available.length === 0) {
      console.log("No seats available");
      return;
    }

    // 2. Lock random available seat
    const seatToLock = available[Math.floor(Math.random() * available.length)];

    const lockStart = Date.now();
    const lockRes = http.post(
      `${BASE_URL}/api/v1/bookings/lock`,
      JSON.stringify({
        showId: SHOW_ID,
        seatIds: [seatToLock.id],
      }),
      {
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    lockLatency.add(Date.now() - lockStart);

    const lockSuccess = check(lockRes, {
      "lock acquired": (r) => r.status === 200,
      "lock conflict": (r) => r.status === 409,
    });

    if (lockRes.status !== 200) {
      errorRate.add(lockRes.status !== 409); // 409 is expected contention
      return;
    }

    const lockData = JSON.parse(lockRes.body);

    // 3. Simulate payment decision time
    sleep(Math.random() * 3 + 1); // 1-4 seconds

    // 4. Create booking (70% complete, 30% abandon)
    if (Math.random() < 0.7) {
      const bookingStart = Date.now();
      const bookingRes = http.post(
        `${BASE_URL}/api/v1/bookings`,
        JSON.stringify({
          lockId: lockData.lockId,
          paymentMethod: "CARD",
        }),
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
      bookingLatency.add(Date.now() - bookingStart);

      check(bookingRes, {
        "booking created": (r) => r.status === 201,
      });

      errorRate.add(bookingRes.status >= 400);
    } else {
      // Abandon - release lock
      http.del(`${BASE_URL}/api/v1/bookings/lock/${lockData.lockId}`, null, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
    }
  });

  sleep(1);
}

function login() {
  // Use test user pool
  const userId = Math.floor(Math.random() * 1000);
  const res = http.post(`${BASE_URL}/api/v1/auth/test-login`, {
    userId: `test-user-${userId}`,
  });
  return JSON.parse(res.body).token;
}
```

### 15.4 Chaos Engineering

```javascript
// Chaos tests using Gremlin/Chaos Monkey patterns
describe("Chaos Engineering Tests", () => {
  describe("Redis Failure", () => {
    it("should fallback to DB when Redis is down", async () => {
      // 1. Make a successful lock with Redis
      const lock1 = await lockManager.acquireLock("show1", "A1", "user1");
      expect(lock1.success).toBe(true);

      // 2. Kill Redis connection
      await redis.disconnect();

      // 3. Attempt another lock (should fallback to DB)
      const lock2 = await lockManager.acquireLock("show1", "A2", "user1");
      expect(lock2.success).toBe(true);
      expect(lock2.fallback).toBe("database");

      // 4. Verify DB has the lock
      const dbLock = await db.query(
        "SELECT * FROM seat_locks WHERE seat_id = $1 AND status = $2",
        ["A2", "ACTIVE"]
      );
      expect(dbLock.rows).toHaveLength(1);
    });

    it("should release locks from DB when Redis recovers", async () => {
      await redis.disconnect();

      // Lock with DB fallback
      await lockManager.acquireLock("show1", "A1", "user1");

      // Reconnect Redis
      await redis.connect();

      // Trigger reconciliation
      await lockManager.reconcile();

      // Verify lock is in Redis
      const redisLock = await redis.get("lock:show:show1:seat:A1");
      expect(redisLock).toBeDefined();
    });
  });

  describe("Database Failure", () => {
    it("should handle DB connection failures gracefully", async () => {
      // Lock succeeds in Redis
      const lock = await lockManager.acquireLock("show1", "A1", "user1");
      expect(lock.success).toBe(true);

      // Kill DB
      await db.end();

      // Attempt booking (should fail gracefully)
      const booking = await bookingService.createBooking({
        lockId: lock.lockId,
        userId: "user1",
      });

      expect(booking.success).toBe(false);
      expect(booking.error).toBe("SERVICE_TEMPORARILY_UNAVAILABLE");

      // Lock should still be valid in Redis
      const redisLock = await redis.get(`lock:show:show1:seat:A1`);
      expect(redisLock).toBeDefined();
    });
  });

  describe("Network Partition", () => {
    it("should handle payment gateway timeout", async () => {
      // Mock gateway timeout
      gatewayMock.charge.mockImplementation(
        () =>
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 5000)
          )
      );

      const result = await paymentService.processPayment({
        bookingId: "b1",
        amount: 100,
        timeout: 3000,
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe("GATEWAY_TIMEOUT");

      // Lock should still be active
      const lock = await lockManager.getLock("b1");
      expect(lock.status).toBe("ACTIVE");

      // Should schedule retry
      const retryJob = await queue.getJob("retry-payment-b1");
      expect(retryJob).toBeDefined();
    });
  });
});
```

---

## 16. Offline Support & PWA

### 16.1 Service Worker for Tickets

```javascript
// sw.js - Service Worker
const CACHE_NAME = "bookmyshow-v1";
const TICKET_CACHE = "tickets-v1";

// Assets to cache
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/static/js/main.js",
  "/static/css/main.css",
  "/offline.html",
];

// Install event
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Fetch event
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Ticket API - Network first, cache fallback
  if (
    url.pathname.startsWith("/api/v1/bookings/") &&
    url.pathname.includes("/ticket")
  ) {
    event.respondWith(handleTicketRequest(event.request));
    return;
  }

  // Static assets - Cache first
  if (STATIC_ASSETS.includes(url.pathname)) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        return cached || fetch(event.request);
      })
    );
    return;
  }

  // Other API calls - Network only
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Default - Network first, offline fallback
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.match("/offline.html");
    })
  );
});

async function handleTicketRequest(request) {
  const cache = await caches.open(TICKET_CACHE);

  try {
    const response = await fetch(request);

    if (response.ok) {
      // Cache successful response
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Network failed, try cache
    const cached = await cache.match(request);

    if (cached) {
      return cached;
    }

    // Return offline ticket template
    return new Response(
      JSON.stringify({
        offline: true,
        message: "Ticket available offline. Show QR code at venue.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

// Background sync for booking status
self.addEventListener("sync", (event) => {
  if (event.tag === "sync-booking-status") {
    event.waitUntil(syncBookingStatus());
  }
});

async function syncBookingStatus() {
  const db = await openDatabase("pending-syncs");
  const pendingBookings = await db.getAll("booking-checks");

  for (const booking of pendingBookings) {
    try {
      const response = await fetch(`/api/v1/bookings/${booking.id}`);
      const data = await response.json();

      // Update local storage
      await updateLocalBooking(booking.id, data);

      // Remove from pending
      await db.delete("booking-checks", booking.id);
    } catch (error) {
      // Will retry on next sync
    }
  }
}
```

### 16.2 IndexedDB for Ticket Storage

```javascript
// ticket-storage.js
class TicketStorage {
  constructor() {
    this.dbName = "BookMyShowTickets";
    this.version = 1;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Tickets store
        if (!db.objectStoreNames.contains("tickets")) {
          const store = db.createObjectStore("tickets", {
            keyPath: "bookingId",
          });
          store.createIndex("showTime", "showTime");
          store.createIndex("status", "status");
        }

        // QR codes store (blobs)
        if (!db.objectStoreNames.contains("qrcodes")) {
          db.createObjectStore("qrcodes", { keyPath: "bookingId" });
        }
      };
    });
  }

  async saveTicket(booking) {
    const transaction = this.db.transaction(
      ["tickets", "qrcodes"],
      "readwrite"
    );

    // Save booking details
    await transaction.objectStore("tickets").put({
      bookingId: booking.id,
      movieName: booking.movieName,
      theaterName: booking.theaterName,
      showTime: booking.showTime,
      seats: booking.seats,
      status: booking.status,
      reference: booking.reference,
      qrCodeData: booking.qrCode,
      savedAt: Date.now(),
    });

    // Save QR code as blob
    const qrBlob = await this.generateQRBlob(booking.qrCode);
    await transaction.objectStore("qrcodes").put({
      bookingId: booking.id,
      blob: qrBlob,
    });
  }

  async getTicket(bookingId) {
    const transaction = this.db.transaction(["tickets", "qrcodes"], "readonly");

    const ticket = await new Promise((resolve) => {
      const request = transaction.objectStore("tickets").get(bookingId);
      request.onsuccess = () => resolve(request.result);
    });

    if (!ticket) return null;

    const qrCode = await new Promise((resolve) => {
      const request = transaction.objectStore("qrcodes").get(bookingId);
      request.onsuccess = () => resolve(request.result?.blob);
    });

    return { ...ticket, qrCodeBlob: qrCode };
  }

  async getUpcomingTickets() {
    const now = Date.now();
    const transaction = this.db.transaction("tickets", "readonly");
    const index = transaction.objectStore("tickets").index("showTime");

    return new Promise((resolve) => {
      const tickets = [];
      const range = IDBKeyRange.lowerBound(now);

      index.openCursor(range).onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor) {
          tickets.push(cursor.value);
          cursor.continue();
        } else {
          resolve(tickets);
        }
      };
    });
  }

  async generateQRBlob(qrData) {
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, qrData, {
      width: 300,
      errorCorrectionLevel: "H",
    });
    return new Promise((resolve) => {
      canvas.toBlob(resolve, "image/png");
    });
  }

  async cleanupOldTickets() {
    const oneWeekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const transaction = this.db.transaction(
      ["tickets", "qrcodes"],
      "readwrite"
    );
    const index = transaction.objectStore("tickets").index("showTime");

    const range = IDBKeyRange.upperBound(oneWeekAgo);

    index.openCursor(range).onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        const bookingId = cursor.value.bookingId;
        transaction.objectStore("tickets").delete(bookingId);
        transaction.objectStore("qrcodes").delete(bookingId);
        cursor.continue();
      }
    };
  }
}

// Usage in React component
function useOfflineTickets() {
  const [tickets, setTickets] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const storageRef = useRef(new TicketStorage());

  useEffect(() => {
    storageRef.current.init().then(() => {
      loadTickets();
    });

    window.addEventListener("online", () => setIsOffline(false));
    window.addEventListener("offline", () => setIsOffline(true));
  }, []);

  const loadTickets = async () => {
    const upcoming = await storageRef.current.getUpcomingTickets();
    setTickets(upcoming);
  };

  const saveTicket = async (booking) => {
    await storageRef.current.saveTicket(booking);
    await loadTickets();
  };

  return { tickets, isOffline, saveTicket };
}
```

---

## 17. Real-time Implementation

### 17.1 WebSocket Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              WebSocket Architecture                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Client                   Server                   Redis     │
│    │                        │                        │       │
│    │ Connect WS             │                        │       │
│    │───────────────────────>│                        │       │
│    │                        │                        │       │
│    │ Subscribe: show:123    │                        │       │
│    │───────────────────────>│  SUBSCRIBE show:123   │       │
│    │                        │───────────────────────>│       │
│    │                        │                        │       │
│    │                        │  PUBLISH show:123     │       │
│    │                        │<───────────────────────│       │
│    │ Message: seat_locked   │                        │       │
│    │<───────────────────────│                        │       │
│    │                        │                        │       │
│    │ Heartbeat (30s)        │                        │       │
│    │<──────────────────────>│                        │       │
│    │                        │                        │       │
│    │ Disconnect             │  UNSUBSCRIBE         │       │
│    │───────────────────────>│───────────────────────>│       │
│    │                        │                        │       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 17.2 WebSocket Server Implementation

```javascript
// websocket-server.js
const WebSocket = require("ws");
const Redis = require("ioredis");

class SeatUpdateServer {
  constructor(server) {
    this.wss = new WebSocket.Server({ server });
    this.redis = new Redis();
    this.subscriber = new Redis();
    this.clients = new Map(); // showId -> Set<WebSocket>

    this.setupRedisSubscriber();
    this.setupWebSocket();
  }

  setupRedisSubscriber() {
    this.subscriber.on("message", (channel, message) => {
      const showId = channel.replace("show:", "");
      this.broadcastToShow(showId, JSON.parse(message));
    });
  }

  setupWebSocket() {
    this.wss.on("connection", (ws, req) => {
      const userId = this.authenticate(req);
      if (!userId) {
        ws.close(4001, "Unauthorized");
        return;
      }

      ws.userId = userId;
      ws.isAlive = true;
      ws.subscribedShows = new Set();

      ws.on("pong", () => {
        ws.isAlive = true;
      });

      ws.on("message", (data) => {
        try {
          const message = JSON.parse(data);
          this.handleMessage(ws, message);
        } catch (err) {
          ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
      });

      ws.on("close", () => {
        this.handleDisconnect(ws);
      });
    });

    // Heartbeat interval
    setInterval(() => {
      this.wss.clients.forEach((ws) => {
        if (!ws.isAlive) {
          this.handleDisconnect(ws);
          return ws.terminate();
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);
  }

  handleMessage(ws, message) {
    switch (message.type) {
      case "SUBSCRIBE":
        this.subscribeToShow(ws, message.showId);
        break;

      case "UNSUBSCRIBE":
        this.unsubscribeFromShow(ws, message.showId);
        break;

      case "PING":
        ws.send(JSON.stringify({ type: "PONG", timestamp: Date.now() }));
        break;
    }
  }

  async subscribeToShow(ws, showId) {
    // Rate limit: max 5 shows per connection
    if (ws.subscribedShows.size >= 5) {
      ws.send(
        JSON.stringify({
          type: "ERROR",
          message: "Maximum subscriptions reached",
        })
      );
      return;
    }

    // Add to client set
    if (!this.clients.has(showId)) {
      this.clients.set(showId, new Set());
      // Subscribe to Redis channel
      await this.subscriber.subscribe(`show:${showId}`);
    }

    this.clients.get(showId).add(ws);
    ws.subscribedShows.add(showId);

    // Send current state
    const currentState = await this.getShowState(showId);
    ws.send(
      JSON.stringify({
        type: "SHOW_STATE",
        showId,
        seats: currentState,
      })
    );
  }

  unsubscribeFromShow(ws, showId) {
    const clients = this.clients.get(showId);
    if (clients) {
      clients.delete(ws);

      // Cleanup empty sets
      if (clients.size === 0) {
        this.clients.delete(showId);
        this.subscriber.unsubscribe(`show:${showId}`);
      }
    }

    ws.subscribedShows.delete(showId);
  }

  handleDisconnect(ws) {
    for (const showId of ws.subscribedShows) {
      this.unsubscribeFromShow(ws, showId);
    }
  }

  broadcastToShow(showId, message) {
    const clients = this.clients.get(showId);
    if (!clients) return;

    const payload = JSON.stringify(message);

    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }

  async getShowState(showId) {
    // Get current seat states from Redis
    const seatMap = await this.redis.hgetall(`seats:show:${showId}`);
    return Object.entries(seatMap).map(([seatId, data]) => {
      const [status, price] = data.split(":");
      return { seatId, status, price: parseInt(price) };
    });
  }

  authenticate(req) {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) return null;

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.userId;
    } catch {
      return null;
    }
  }
}

// Publishing seat updates (from booking service)
async function publishSeatUpdate(showId, seatId, status, userId = null) {
  const redis = new Redis();

  // Update Redis hash
  await redis.hset(
    `seats:show:${showId}`,
    seatId,
    `${status}:${getSeatPrice(seatId)}`
  );

  // Publish event
  await redis.publish(
    `show:${showId}`,
    JSON.stringify({
      type:
        status === "LOCKED"
          ? "SEAT_LOCKED"
          : status === "BOOKED"
          ? "SEAT_BOOKED"
          : "SEAT_RELEASED",
      seatId,
      status,
      userId: userId ? hashUserId(userId) : null, // Privacy
      timestamp: Date.now(),
    })
  );
}
```

### 17.3 Client-side WebSocket Hook

```jsx
function useSeatUpdates(showId) {
  const [seats, setSeats] = useState({});
  const [connected, setConnected] = useState(false);
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [showId]);

  const connect = () => {
    const token = getAuthToken();
    const ws = new WebSocket(`${WS_URL}?token=${token}`);

    ws.onopen = () => {
      setConnected(true);
      ws.send(
        JSON.stringify({
          type: "SUBSCRIBE",
          showId,
        })
      );
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      handleMessage(message);
    };

    ws.onclose = () => {
      setConnected(false);
      // Reconnect with backoff
      scheduleReconnect();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current = ws;
  };

  const disconnect = () => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (wsRef.current) {
      wsRef.current.close();
    }
  };

  const scheduleReconnect = () => {
    const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
    reconnectTimeoutRef.current = setTimeout(connect, delay);
  };

  const handleMessage = (message) => {
    switch (message.type) {
      case "SHOW_STATE":
        // Initial state
        const seatMap = {};
        message.seats.forEach((seat) => {
          seatMap[seat.seatId] = seat;
        });
        setSeats(seatMap);
        break;

      case "SEAT_LOCKED":
        setSeats((prev) => ({
          ...prev,
          [message.seatId]: { ...prev[message.seatId], status: "LOCKED" },
        }));
        break;

      case "SEAT_BOOKED":
        setSeats((prev) => ({
          ...prev,
          [message.seatId]: { ...prev[message.seatId], status: "BOOKED" },
        }));
        break;

      case "SEAT_RELEASED":
        setSeats((prev) => ({
          ...prev,
          [message.seatId]: { ...prev[message.seatId], status: "AVAILABLE" },
        }));
        break;
    }
  };

  return { seats, connected };
}

// Fallback to polling when WebSocket unavailable
function useSeatUpdatesWithFallback(showId) {
  const ws = useSeatUpdates(showId);
  const [pollingData, setPollingData] = useState(null);

  useEffect(() => {
    if (ws.connected) return;

    // Fallback to polling
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`/api/v1/shows/${showId}/seats`);
        const data = await response.json();
        setPollingData(data.seats);
      } catch (error) {
        console.error("Polling failed:", error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [showId, ws.connected]);

  return {
    seats: ws.connected ? ws.seats : pollingData,
    connected: ws.connected,
    isPolling: !ws.connected,
  };
}
```

---

## 18. Virtual Waiting Room

### 18.1 Queue System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Virtual Waiting Room Architecture               │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  High Traffic Event (100K users, 200 seats)                 │
│                                                              │
│  ┌─────────────────────────────────────────┐               │
│  │           Queue Landing Page             │               │
│  │                                          │               │
│  │  "You are in the queue"                 │               │
│  │  Position: 45,234                        │               │
│  │  Estimated wait: ~15 minutes            │               │
│  │                                          │               │
│  │  [=========>          ] 45%             │               │
│  │                                          │               │
│  │  Don't close this page!                 │               │
│  └─────────────────────────────────────────┘               │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────────┐               │
│  │         Queue Management Service         │               │
│  │                                          │               │
│  │  - Redis Sorted Set (position)          │               │
│  │  - Token generation                      │               │
│  │  - Rate: 500 users/minute               │               │
│  │  - Fair queuing (FIFO)                  │               │
│  └─────────────────────────────────────────┘               │
│                     │                                        │
│                     ▼                                        │
│  ┌─────────────────────────────────────────┐               │
│  │          Seat Selection (Allowed)        │               │
│  │                                          │               │
│  │  Token validated → Access granted       │               │
│  │  5 minute session limit                 │               │
│  └─────────────────────────────────────────┘               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 18.2 Queue Implementation

```javascript
// queue-service.js
class VirtualQueue {
  constructor(redis) {
    this.redis = redis;
  }

  async joinQueue(showId, userId) {
    const queueKey = `queue:${showId}`;
    const timestamp = Date.now();

    // Add to sorted set (timestamp as score for FIFO)
    await this.redis.zadd(queueKey, timestamp, userId);

    // Get position
    const position = await this.redis.zrank(queueKey, userId);

    // Calculate estimated wait
    const rate = await this.getProcessingRate(showId);
    const estimatedWait = Math.ceil((position + 1) / rate);

    // Generate queue token (for verification)
    const token = jwt.sign(
      { showId, userId, joinedAt: timestamp },
      process.env.QUEUE_SECRET,
      { expiresIn: "2h" }
    );

    return {
      position: position + 1,
      estimatedWaitMinutes: estimatedWait,
      token,
      totalInQueue: await this.redis.zcard(queueKey),
    };
  }

  async getPosition(showId, userId) {
    const position = await this.redis.zrank(`queue:${showId}`, userId);
    if (position === null) return null;

    return {
      position: position + 1,
      estimatedWaitMinutes: await this.calculateWait(showId, position),
    };
  }

  async processQueue(showId, batchSize = 50) {
    const queueKey = `queue:${showId}`;
    const accessKey = `access:${showId}`;

    // Get next batch of users
    const users = await this.redis.zrange(queueKey, 0, batchSize - 1);

    if (users.length === 0) return [];

    const pipeline = this.redis.pipeline();

    for (const userId of users) {
      // Generate access token
      const accessToken = jwt.sign(
        { showId, userId, grantedAt: Date.now() },
        process.env.ACCESS_SECRET,
        { expiresIn: "5m" } // 5 minute session
      );

      // Store access grant
      pipeline.hset(accessKey, userId, accessToken);
      pipeline.expire(accessKey, 600); // 10 min TTL

      // Remove from queue
      pipeline.zrem(queueKey, userId);
    }

    await pipeline.exec();

    // Notify users (via WebSocket or push)
    await this.notifyAccessGranted(showId, users);

    return users;
  }

  async verifyAccess(showId, userId, token) {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_SECRET);

      if (decoded.showId !== showId || decoded.userId !== userId) {
        return { valid: false, error: "TOKEN_MISMATCH" };
      }

      // Check if still in access list
      const accessToken = await this.redis.hget(`access:${showId}`, userId);

      if (!accessToken || accessToken !== token) {
        return { valid: false, error: "ACCESS_EXPIRED" };
      }

      return { valid: true, expiresIn: decoded.exp - Date.now() / 1000 };
    } catch (error) {
      return { valid: false, error: "INVALID_TOKEN" };
    }
  }

  async calculateWait(showId, position) {
    const rate = await this.getProcessingRate(showId);
    return Math.ceil((position + 1) / rate);
  }

  async getProcessingRate(showId) {
    // Get historical processing rate or use default
    const rate = await this.redis.get(`rate:${showId}`);
    return parseInt(rate) || 500; // 500 users/minute default
  }
}

// Queue processor (runs every minute)
async function processQueues() {
  const activeShows = await redis.smembers("active_queues");

  for (const showId of activeShows) {
    const queue = new VirtualQueue(redis);
    const processed = await queue.processQueue(showId, 500);

    logger.info(`Processed ${processed.length} users for show ${showId}`);

    // Broadcast queue position updates
    await broadcastQueueUpdate(showId);
  }
}

// Schedule: Run every minute
setInterval(processQueues, 60000);
```

### 18.3 Queue UI Component

```jsx
function WaitingRoom({ showId }) {
  const [queueStatus, setQueueStatus] = useState(null);
  const [accessGranted, setAccessGranted] = useState(false);

  useEffect(() => {
    joinQueue();

    const interval = setInterval(checkStatus, 5000);
    return () => clearInterval(interval);
  }, [showId]);

  const joinQueue = async () => {
    const response = await fetch(`/api/v1/queue/${showId}/join`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    setQueueStatus(data);
    localStorage.setItem(`queue_token_${showId}`, data.token);
  };

  const checkStatus = async () => {
    const queueToken = localStorage.getItem(`queue_token_${showId}`);

    const response = await fetch(`/api/v1/queue/${showId}/status`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "X-Queue-Token": queueToken,
      },
    });

    const data = await response.json();

    if (data.accessGranted) {
      setAccessGranted(true);
      localStorage.setItem(`access_token_${showId}`, data.accessToken);
      // Redirect to seat selection
      window.location.href = `/shows/${showId}/seats?access=${data.accessToken}`;
    } else {
      setQueueStatus(data);
    }
  };

  if (accessGranted) {
    return <Redirect to={`/shows/${showId}/seats`} />;
  }

  return (
    <div className="waiting-room">
      <div className="queue-card">
        <h1>You're in the Queue!</h1>

        <div className="queue-position">
          <span className="position-number">
            {queueStatus?.position?.toLocaleString()}
          </span>
          <span className="position-label">Your position</span>
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{
              width: `${calculateProgress(queueStatus)}%`,
            }}
          />
        </div>

        <div className="estimated-wait">
          <ClockIcon />
          <span>
            Estimated wait: ~{queueStatus?.estimatedWaitMinutes} minutes
          </span>
        </div>

        <div className="queue-info">
          <p>
            <strong>{queueStatus?.totalInQueue?.toLocaleString()}</strong>{" "}
            people in queue
          </p>
          <p>
            Processing <strong>500</strong> users per minute
          </p>
        </div>

        <div className="warning">
          <AlertIcon />
          <p>
            Don't close or refresh this page! You'll lose your position in the
            queue.
          </p>
        </div>
      </div>
    </div>
  );
}

function calculateProgress(status) {
  if (!status || !status.totalInQueue) return 0;
  const behind = status.totalInQueue - status.position;
  return Math.max(0, Math.min(100, (behind / status.totalInQueue) * 100));
}
```

---

## 19. Analytics & Business Metrics

### 19.1 Event Tracking

```javascript
// analytics-service.js
class BookingAnalytics {
  constructor(analyticsProvider) {
    this.provider = analyticsProvider;
  }

  // Funnel events
  trackShowViewed(showId, userId, source) {
    this.provider.track("show_viewed", {
      showId,
      userId,
      source, // 'search', 'browse', 'direct'
      timestamp: Date.now(),
    });
  }

  trackSeatSelectionStarted(showId, userId) {
    this.provider.track("seat_selection_started", {
      showId,
      userId,
      timestamp: Date.now(),
    });
  }

  trackSeatsSelected(showId, userId, seatCount, seatTypes) {
    this.provider.track("seats_selected", {
      showId,
      userId,
      seatCount,
      seatTypes, // ['REGULAR', 'PREMIUM']
      timestamp: Date.now(),
    });
  }

  trackLockAcquired(showId, userId, seatCount, lockId) {
    this.provider.track("lock_acquired", {
      showId,
      userId,
      seatCount,
      lockId,
      timestamp: Date.now(),
    });
  }

  trackLockFailed(showId, userId, reason, attemptedSeats) {
    this.provider.track("lock_failed", {
      showId,
      userId,
      reason, // 'SEAT_UNAVAILABLE', 'TIMEOUT', 'ERROR'
      attemptedSeats,
      timestamp: Date.now(),
    });
  }

  trackPaymentInitiated(bookingId, amount, method) {
    this.provider.track("payment_initiated", {
      bookingId,
      amount,
      method,
      timestamp: Date.now(),
    });
  }

  trackPaymentCompleted(bookingId, amount, method, duration) {
    this.provider.track("payment_completed", {
      bookingId,
      amount,
      method,
      paymentDuration: duration,
      timestamp: Date.now(),
    });
  }

  trackBookingConfirmed(bookingId, showId, seatCount, amount) {
    this.provider.track("booking_confirmed", {
      bookingId,
      showId,
      seatCount,
      amount,
      timestamp: Date.now(),
    });
  }

  trackBookingAbandoned(showId, userId, stage, timeSpent) {
    this.provider.track("booking_abandoned", {
      showId,
      userId,
      stage, // 'seat_selection', 'lock_acquired', 'payment'
      timeSpent,
      timestamp: Date.now(),
    });
  }

  trackLockExpired(lockId, showId, userId, seatCount) {
    this.provider.track("lock_expired", {
      lockId,
      showId,
      userId,
      seatCount,
      timestamp: Date.now(),
    });
  }
}
```

### 19.2 Metrics Dashboard

```
┌─────────────────────────────────────────────────────────────────────┐
│                   Booking Analytics Dashboard                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Real-time Metrics (Last 1 Hour)                                    │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐   │
│  │ Bookings    │ │ Revenue     │ │ Conversion  │ │ Avg. Time   │   │
│  │    1,234    │ │  $45,678    │ │   12.5%     │ │   4m 32s    │   │
│  │  ↑ 15%      │ │  ↑ 22%      │ │  ↓ 2.1%     │ │  ↓ 0:45     │   │
│  └─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘   │
│                                                                      │
│  Booking Funnel (Today)                                             │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │ Show Views      ████████████████████████████████ 50,000     │   │
│  │ Seat Selection  ████████████████████ 25,000 (50%)           │   │
│  │ Lock Acquired   ████████████ 12,500 (50%)                   │   │
│  │ Payment Started █████████ 10,000 (80%)                       │   │
│  │ Confirmed       ███████ 6,250 (62.5%)                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Abandonment Analysis                                               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                                                              │   │
│  │  Seat Selection: 50%  ████████████████████                  │   │
│  │    - No seats available: 30%                                │   │
│  │    - Left page: 15%                                         │   │
│  │    - Error: 5%                                              │   │
│  │                                                              │   │
│  │  Lock Stage: 20%  ████████                                   │   │
│  │    - Lock expired: 60%                                      │   │
│  │    - User cancelled: 35%                                    │   │
│  │    - Error: 5%                                              │   │
│  │                                                              │   │
│  │  Payment: 37.5%  ███████████████                             │   │
│  │    - Payment failed: 45%                                    │   │
│  │    - User cancelled: 40%                                    │   │
│  │    - Timeout: 15%                                           │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Seat Popularity Heatmap                                            │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │     1   2   3   4   5   6   7   8   9  10                   │   │
│  │ A  [░][░][▒][▓][█][█][▓][▒][░][░]  SCREEN                   │   │
│  │ B  [░][▒][▓][█][█][█][█][▓][▒][░]                           │   │
│  │ C  [░][▒][▓][█][█][█][█][▓][▒][░]                           │   │
│  │ D  [░][░][▒][▓][▓][▓][▓][▒][░][░]                           │   │
│  │ E  [░][░][░][▒][▒][▒][▒][░][░][░]                           │   │
│  │                                                              │   │
│  │  ░ Low  ▒ Medium  ▓ High  █ Very High                       │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                      │
│  Top Performing Shows (Today)                                       │
│  ┌────────────────────────────────────┬───────┬─────────┬───────┐ │
│  │ Movie                               │ Seats │ Revenue │ Conv% │ │
│  ├────────────────────────────────────┼───────┼─────────┼───────┤ │
│  │ Avengers: Secret Wars              │ 5,234 │ $78,510 │ 18.5% │ │
│  │ Avatar 4                           │ 3,456 │ $51,840 │ 15.2% │ │
│  │ The Matrix 5                       │ 2,345 │ $35,175 │ 12.8% │ │
│  └────────────────────────────────────┴───────┴─────────┴───────┘ │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 19.3 SQL Queries for Analytics

```sql
-- Conversion funnel query
WITH funnel AS (
  SELECT
    DATE(created_at) as date,
    COUNT(DISTINCT CASE WHEN event = 'show_viewed' THEN user_id END) as views,
    COUNT(DISTINCT CASE WHEN event = 'seat_selection_started' THEN user_id END) as selections,
    COUNT(DISTINCT CASE WHEN event = 'lock_acquired' THEN user_id END) as locks,
    COUNT(DISTINCT CASE WHEN event = 'payment_initiated' THEN user_id END) as payments,
    COUNT(DISTINCT CASE WHEN event = 'booking_confirmed' THEN user_id END) as confirmed
  FROM analytics_events
  WHERE created_at >= NOW() - INTERVAL '7 days'
  GROUP BY DATE(created_at)
)
SELECT
  date,
  views,
  selections,
  ROUND(100.0 * selections / NULLIF(views, 0), 1) as view_to_selection,
  locks,
  ROUND(100.0 * locks / NULLIF(selections, 0), 1) as selection_to_lock,
  payments,
  ROUND(100.0 * payments / NULLIF(locks, 0), 1) as lock_to_payment,
  confirmed,
  ROUND(100.0 * confirmed / NULLIF(payments, 0), 1) as payment_to_confirm,
  ROUND(100.0 * confirmed / NULLIF(views, 0), 1) as overall_conversion
FROM funnel
ORDER BY date DESC;

-- Seat popularity by position
SELECT
  s.row_name,
  s.seat_number,
  COUNT(bs.id) as bookings,
  SUM(bs.price) as revenue,
  ROUND(100.0 * COUNT(bs.id) / total.count, 2) as percentage
FROM seats s
LEFT JOIN booking_seats bs ON s.id = bs.seat_id
CROSS JOIN (SELECT COUNT(*) as count FROM booking_seats) total
WHERE bs.created_at >= NOW() - INTERVAL '30 days'
GROUP BY s.row_name, s.seat_number, total.count
ORDER BY bookings DESC;

-- Abandonment analysis
SELECT
  stage,
  reason,
  COUNT(*) as count,
  ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (PARTITION BY stage), 2) as percentage
FROM (
  SELECT
    CASE
      WHEN event = 'lock_failed' THEN 'seat_selection'
      WHEN event = 'lock_expired' THEN 'lock_stage'
      WHEN event = 'payment_failed' THEN 'payment'
      WHEN event = 'booking_abandoned' THEN properties->>'stage'
    END as stage,
    COALESCE(properties->>'reason', 'unknown') as reason
  FROM analytics_events
  WHERE event IN ('lock_failed', 'lock_expired', 'payment_failed', 'booking_abandoned')
    AND created_at >= NOW() - INTERVAL '7 days'
) abandonment
GROUP BY stage, reason
ORDER BY stage, count DESC;
```

---

## 20. Internationalization (i18n)

### 20.1 Multi-Currency Support

```javascript
// currency-service.js
const CURRENCIES = {
  USD: { symbol: "$", position: "before", decimals: 2 },
  EUR: { symbol: "€", position: "before", decimals: 2 },
  GBP: { symbol: "£", position: "before", decimals: 2 },
  INR: { symbol: "₹", position: "before", decimals: 0 },
  JPY: { symbol: "¥", position: "before", decimals: 0 },
};

class CurrencyService {
  constructor(baseCurrency = "USD") {
    this.baseCurrency = baseCurrency;
    this.rates = {};
  }

  async loadRates() {
    const response = await fetch("/api/v1/exchange-rates");
    this.rates = await response.json();
  }

  convert(amount, from, to) {
    if (from === to) return amount;

    const baseAmount = amount / this.rates[from];
    return baseAmount * this.rates[to];
  }

  format(amount, currency) {
    const config = CURRENCIES[currency];
    const formatted = amount.toLocaleString(undefined, {
      minimumFractionDigits: config.decimals,
      maximumFractionDigits: config.decimals,
    });

    return config.position === "before"
      ? `${config.symbol}${formatted}`
      : `${formatted}${config.symbol}`;
  }
}

// React hook
function useCurrency() {
  const [currency, setCurrency] = useState(getUserCurrency());
  const service = useRef(new CurrencyService());

  useEffect(() => {
    service.current.loadRates();
  }, []);

  const formatPrice = useCallback(
    (amount, baseCurrency = "USD") => {
      const converted = service.current.convert(amount, baseCurrency, currency);
      return service.current.format(converted, currency);
    },
    [currency]
  );

  return { currency, setCurrency, formatPrice };
}
```

### 20.2 Date/Time Localization

```javascript
// datetime-service.js
function formatShowTime(dateString, locale, timezone) {
  const date = new Date(dateString);

  return new Intl.DateTimeFormat(locale, {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: timezone,
    hour12: shouldUse12Hour(locale),
  }).format(date);
}

function shouldUse12Hour(locale) {
  const hour12Locales = ["en-US", "en-AU", "en-IN"];
  return hour12Locales.some((l) => locale.startsWith(l.split("-")[0]));
}

// Relative time (e.g., "in 2 hours")
function formatRelativeTime(dateString, locale) {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date - now;
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "auto" });

  if (Math.abs(diffHours) < 24) {
    return rtf.format(diffHours, "hour");
  }

  const diffDays = Math.round(diffHours / 24);
  return rtf.format(diffDays, "day");
}

// React component
function ShowTime({ showTime }) {
  const { locale, timezone } = useLocale();

  return (
    <time dateTime={showTime}>
      {formatShowTime(showTime, locale, timezone)}
      <span className="relative-time">
        ({formatRelativeTime(showTime, locale)})
      </span>
    </time>
  );
}
```

### 20.3 Seat Label Localization

```javascript
// Different markets use different seat labeling conventions
const SEAT_LABELS = {
  "en-US": {
    rows: "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),
    columns: (n) => n.toString(),
  },
  "ja-JP": {
    rows: "あいうえおかきくけこ".split(""),
    columns: (n) => n.toString(),
  },
  "zh-CN": {
    rows: Array.from({ length: 26 }, (_, i) => `${i + 1}排`),
    columns: (n) => `${n}座`,
  },
  "ar-SA": {
    rows: "أبتثجحخدذرزسشصضطظعغفقكلمنهوي".split(""),
    columns: (n) => n.toLocaleString("ar-SA"),
  },
};

function getSeatLabel(row, col, locale) {
  const labels = SEAT_LABELS[locale] || SEAT_LABELS["en-US"];

  const rowLabel = labels.rows[row] || labels.rows[row % labels.rows.length];
  const colLabel = labels.columns(col + 1);

  // RTL languages might need different formatting
  if (isRTL(locale)) {
    return `${colLabel}${rowLabel}`;
  }

  return `${rowLabel}${colLabel}`;
}

function isRTL(locale) {
  return ["ar", "he", "fa", "ur"].some((l) => locale.startsWith(l));
}
```

---

## 21. Disaster Recovery

### 21.1 Multi-Region Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              Multi-Region Disaster Recovery                  │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────┐    ┌─────────────────────┐        │
│  │   Primary Region    │    │   Secondary Region   │        │
│  │   (US-East-1)       │    │   (US-West-2)        │        │
│  │                     │    │                      │        │
│  │  ┌───────────────┐  │    │  ┌───────────────┐  │        │
│  │  │ App Servers   │  │    │  │ App Servers   │  │        │
│  │  │ (Active)      │──┼────┼─>│ (Standby)     │  │        │
│  │  └───────────────┘  │    │  └───────────────┘  │        │
│  │         │           │    │         │           │        │
│  │  ┌───────────────┐  │    │  ┌───────────────┐  │        │
│  │  │ PostgreSQL    │  │    │  │ PostgreSQL    │  │        │
│  │  │ (Primary)     │──┼────┼─>│ (Replica)     │  │        │
│  │  └───────────────┘  │    │  └───────────────┘  │        │
│  │         │           │    │         │           │        │
│  │  ┌───────────────┐  │    │  ┌───────────────┐  │        │
│  │  │ Redis Cluster │  │    │  │ Redis Cluster │  │        │
│  │  │ (Primary)     │──┼────┼─>│ (Replica)     │  │        │
│  │  └───────────────┘  │    │  └───────────────┘  │        │
│  │                     │    │                      │        │
│  └─────────────────────┘    └─────────────────────┘        │
│                                                              │
│  RTO (Recovery Time Objective): < 5 minutes                 │
│  RPO (Recovery Point Objective): < 1 minute                 │
│                                                              │
│  Replication:                                               │
│  - PostgreSQL: Streaming replication (sync)                 │
│  - Redis: Active-Active geo-replication                     │
│  - Files/Tickets: S3 cross-region replication               │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 21.2 Failover Procedures

```javascript
// health-check-service.js
class HealthChecker {
  constructor() {
    this.services = ["database", "redis", "payment-gateway", "notification"];
    this.thresholds = {
      database: { maxLatency: 100, maxErrors: 5 },
      redis: { maxLatency: 10, maxErrors: 3 },
      "payment-gateway": { maxLatency: 5000, maxErrors: 2 },
    };
  }

  async checkAll() {
    const results = await Promise.all(
      this.services.map((service) => this.checkService(service))
    );

    const unhealthy = results.filter((r) => !r.healthy);

    if (unhealthy.length > 0) {
      await this.handleUnhealthy(unhealthy);
    }

    return results;
  }

  async checkService(service) {
    const start = Date.now();

    try {
      switch (service) {
        case "database":
          await db.query("SELECT 1");
          break;
        case "redis":
          await redis.ping();
          break;
        case "payment-gateway":
          await fetch(`${GATEWAY_URL}/health`);
          break;
      }

      const latency = Date.now() - start;
      const threshold = this.thresholds[service];

      return {
        service,
        healthy: latency <= threshold.maxLatency,
        latency,
        timestamp: Date.now(),
      };
    } catch (error) {
      return {
        service,
        healthy: false,
        error: error.message,
        timestamp: Date.now(),
      };
    }
  }

  async handleUnhealthy(services) {
    for (const { service, error } of services) {
      logger.error(`Service unhealthy: ${service}`, { error });

      // Increment error counter
      const errorCount = await redis.incr(`errors:${service}`);
      await redis.expire(`errors:${service}`, 300); // 5 min window

      const threshold = this.thresholds[service]?.maxErrors || 5;

      if (errorCount >= threshold) {
        await this.triggerFailover(service);
      }
    }
  }

  async triggerFailover(service) {
    logger.critical(`Triggering failover for ${service}`);

    switch (service) {
      case "database":
        await this.failoverDatabase();
        break;
      case "redis":
        await this.failoverRedis();
        break;
    }

    // Alert on-call
    await this.alertOncall(service);
  }

  async failoverDatabase() {
    // Promote replica to primary
    await fetch(`${FAILOVER_API}/database/promote`, { method: "POST" });

    // Update connection strings
    await updateDatabaseConfig("secondary");

    // Clear connection pools
    await db.end();
  }
}

// Run health checks every 10 seconds
setInterval(() => healthChecker.checkAll(), 10000);
```

### 21.3 Backup and Recovery

```javascript
// backup-service.js
class BackupService {
  async createBackup(type = "incremental") {
    const timestamp = Date.now();
    const backupId = `backup-${timestamp}`;

    logger.info(`Starting ${type} backup: ${backupId}`);

    try {
      // 1. Database backup
      if (type === "full") {
        await this.fullDatabaseBackup(backupId);
      } else {
        await this.incrementalDatabaseBackup(backupId);
      }

      // 2. Redis snapshot
      await this.redisBackup(backupId);

      // 3. Upload to S3 (with encryption)
      await this.uploadToS3(backupId);

      // 4. Verify backup integrity
      await this.verifyBackup(backupId);

      // 5. Update backup metadata
      await this.updateMetadata(backupId, { type, status: "completed" });

      logger.info(`Backup completed: ${backupId}`);

      return { backupId, status: "success" };
    } catch (error) {
      logger.error(`Backup failed: ${backupId}`, error);
      await this.updateMetadata(backupId, {
        type,
        status: "failed",
        error: error.message,
      });
      throw error;
    }
  }

  async restore(backupId, options = {}) {
    const { targetDatabase, dryRun = false } = options;

    logger.info(`Starting restore from: ${backupId}`);

    // 1. Download from S3
    const backupPath = await this.downloadFromS3(backupId);

    // 2. Verify checksum
    const isValid = await this.verifyChecksum(backupPath);
    if (!isValid) {
      throw new Error("Backup checksum verification failed");
    }

    if (dryRun) {
      logger.info("Dry run complete - backup is valid");
      return { status: "dry-run-success" };
    }

    // 3. Stop incoming traffic
    await this.enableMaintenanceMode();

    try {
      // 4. Restore database
      await this.restoreDatabase(backupPath, targetDatabase);

      // 5. Restore Redis
      await this.restoreRedis(backupPath);

      // 6. Verify restoration
      await this.verifyRestoration();

      // 7. Resume traffic
      await this.disableMaintenanceMode();

      logger.info(`Restore completed from: ${backupId}`);
      return { status: "success" };
    } catch (error) {
      logger.error("Restore failed", error);
      await this.rollback();
      throw error;
    }
  }
}

// Backup schedule
// Full backup: Daily at 2 AM
// Incremental: Every hour
// Retention: 30 days
```

---

## Summary

This High-Level Design covers a comprehensive ticket booking system with emphasis on:

1. **Consistency**: Distributed locking with Redis + DB to prevent double booking
2. **Scalability**: Microservices, caching, horizontal scaling
3. **Performance**: Sub-second response times through caching and optimization
4. **Reliability**: Multi-layer error handling, retry mechanisms, reconciliation
5. **User Experience**: Real-time seat updates, clear error messages, smooth flow
6. **Accessibility**: Full keyboard navigation, screen reader support, color-blind friendly
7. **Mobile**: Touch-optimized UI, offline ticket access, mobile payments
8. **Security**: PCI compliance, fraud detection, bot prevention
9. **Observability**: Comprehensive analytics, funnel tracking, monitoring
10. **Resilience**: Multi-region DR, automated failover, backup/restore

**Key Technical Decisions**:

- Redis for distributed locks (performance + TTL)
- PostgreSQL for transactional data (ACID guarantees)
- Optimistic + Pessimistic locking (defense in depth)
- Event-driven architecture (scalability)
- Strong consistency for bookings, eventual for catalog
- WebSocket for real-time updates with polling fallback
- Virtual waiting room for high-traffic events

**Critical Path**: Seat Selection → Lock Acquisition → Payment → Booking Confirmation

- Each step has fallback and retry mechanisms
- Idempotency ensures safe retries
- Atomic operations prevent race conditions

**Comprehensive Checklist**:

```
Pre-Interview Preparation:

Architecture:
□ Explain distributed locking strategy
□ Describe multi-layer consistency approach
□ Discuss scaling for high-traffic events

Frontend:
□ Accessible seat map implementation
□ Real-time updates (WebSocket/polling)
□ Mobile and touch optimizations
□ Offline ticket support

Backend:
□ Seat lock acquisition flow
□ Payment processing with idempotency
□ Error handling and recovery
□ Rate limiting and fraud prevention

Testing:
□ Unit tests for lock manager
□ Integration tests for booking flow
□ Load tests for concurrency
□ Chaos engineering scenarios

Production:
□ Multi-region deployment
□ Monitoring and alerting
□ Backup and disaster recovery
□ Incident response procedures
```

---

**Document Version**: 2.0
**Last Updated**: December 22, 2025
**Author**: System Design Interview Prep

---

1. **Consistency**: Distributed locking with Redis + DB to prevent double booking
2. **Scalability**: Microservices, caching, horizontal scaling
3. **Performance**: Sub-second response times through caching and optimization
4. **Reliability**: Multi-layer error handling, retry mechanisms, reconciliation
5. **User Experience**: Real-time seat updates, clear error messages, smooth flow

**Key Technical Decisions**:

- Redis for distributed locks (performance + TTL)
- PostgreSQL for transactional data (ACID guarantees)
- Optimistic + Pessimistic locking (defense in depth)
- Event-driven architecture (scalability)
- Strong consistency for bookings, eventual for catalog

**Critical Path**: Seat Selection → Lock Acquisition → Payment → Booking Confirmation

- Each step has fallback and retry mechanisms
- Idempotency ensures safe retries
- Atomic operations prevent race conditions

This design can handle millions of users, thousands of concurrent bookings, and zero double bookings with proper implementation and testing.
