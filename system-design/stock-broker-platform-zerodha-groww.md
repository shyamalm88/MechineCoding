# Stock Broker Platform — Zerodha / Groww

> **Backend / Frontend Split: 85% Backend · 15% Frontend**
> The interesting engineering is in the backend: WebSocket-based real-time price streaming from the exchange, Kafka-buffered high-frequency order pipeline, order validation before hitting the expensive exchange API, two-phase order tracking (Order DB vs Trade DB), InfluxDB time-series for historical prices, and Redis pub/sub for fanout to millions of subscribers. Frontend is a standard WebSocket consumer — worth mentioning but not a deep focus.

> **Critical distinction:** A **stock broker** (Zerodha, Groww) is NOT a stock exchange (NSE, BSE). The broker is the client-facing platform; the exchange is a black box with paid APIs. All actual stock allocation happens at the exchange. The broker's job is: show prices, validate orders, forward to exchange, track status, show P&L.

---

## 1. Problem + Scope

Design a stock broker platform like Zerodha or Groww. Users register with KYC verification, view near-real-time stock prices and historical data, place buy/sell orders (market and limit), manage a watchlist, and view their portfolio P&L.

**In scope:** User registration + KYC, real-time + historical stock price feed, order placement (market + limit), order validation, order tracking (pending → confirmed/rejected), portfolio P&L, watchlist, wallet/fund management.

**Out of scope:** Stock exchange internals (NSE/BSE matching engine), high-frequency trading algorithms, margin lending, options/futures derivatives (can be mentioned as extensions), cross-border trading.

---

## 2. Assumptions & Scale

| Metric | Value |
|---|---|
| Total users | 50M registered, 5M DAU |
| Total stocks tracked | 8,000–10,000 (NSE + BSE) |
| Peak orders per second | 100K orders/sec during market open |
| Stock price updates/sec | 10,000 stocks × 1 update/sec = 10,000 price events/sec |
| Market hours | 9:15 AM – 3:30 PM IST (6.25 hours/day) |
| WebSocket connections to exchange | 10,000 stocks ÷ 500 stocks/connection = 20 persistent connections |
| Concurrent WebSocket connections (client-facing) | 5M users × 20% active = 1M concurrent WS connections |
| Historical price storage | 10,000 stocks × 1 update/sec × 6.25 hrs × 250 days = ~56B rows/year |
| Geography | Single-region (India) — all infra in India datacenters |

**Scale rationale:**

Single-region constraint is a key advantage — latency targets (< 50ms price updates, < 100ms order placement) are achievable only because all clients and servers are in the same geographic region. A global exchange system would require different architectural choices.

*These numbers drive: WebSocket over SSE (bidirectional subscription changes), InfluxDB for time-series price storage, Kafka as buffer between 100K order/sec and exchange API calls, Redis pub/sub for 1M concurrent price subscribers.*

---

## 3. Functional Requirements

- User registration with KYC verification (Aadhaar/PAN via third-party KYC service)
- View real-time stock prices (< 50ms latency from exchange update to client screen)
- View historical stock price charts (intraday + multi-day)
- Place buy/sell orders — market orders (execute at current price) and limit orders (execute at target price)
- Cancel pending orders
- View all orders and their current status (pending / executed / rejected / cancelled)
- Portfolio dashboard: holdings, positions, P&L calculated against current price
- Watchlist: save and monitor a custom list of stocks
- Wallet: deposit funds, withdraw funds, view transaction history

---

## 4. Non-Functional Requirements

| Requirement | Target |
|---|---|
| Stock price update latency | < 50ms from exchange event to client display |
| Order placement latency | < 100ms from user submit to exchange acknowledgement |
| Availability | 99.9% during market hours (9:15 AM – 3:30 PM IST) |
| Consistency | **High consistency over availability** — money and stocks must never be in inconsistent state |
| Order durability | Zero order loss — Kafka ensures at-least-once delivery |
| Historical data retention | 5+ years |

**Consistency Model — CAP applied per domain:**

| Domain | Model | Justification |
|---|---|---|
| Order placement | Strong (CP) | Payment deducted ↔ stock allocated must be atomic. Inconsistency = financial loss. |
| User registration / KYC | Strong (CP) | Regulatory requirement — KYC status must be accurate before any trade |
| Portfolio P&L | Eventual | P&L recalculated on price changes — 1–2 second staleness acceptable |
| Price display | Eventual | Stock price is a market observable — slight delay acceptable, never misleading |
| Watchlist | Eventual | Low stakes — eventual consistency fine |

> [!IMPORTANT]
> This system prioritizes **consistency over availability** — the opposite of most consumer apps. Reason: if our system shows a trade succeeded but the exchange rejected it, the user has lost money from their wallet with no stock to show for it. Financial systems always choose CP over AP.

---

## 🧠 Mental Model

A stock broker has **three independent but interconnected flows**:

1. **Price Feed Flow** — Exchange pushes stock prices → WebSocket gateway → Kafka → Price Injector → InfluxDB (historical) + Redis pub/sub → Price Tracker Service → client WebSocket connections
2. **Order Flow** — User places order → Kafka raw order topic → Validator Service (KYC + funds check) → verified/rejected topics → Order Service → Exchange API → acknowledgement → Order Tracker → Order DB + Trade DB + Notification
3. **Portfolio Flow** — Portfolio Service reads Trade DB (confirmed trades only) + current price from Price Tracker → calculates P&L per holding

```
 EXCHANGE (NSE / BSE)
       │  WebSocket (20 persistent connections, 500 stocks each)
       ▼
 Exchange Gateway
       │
       ▼
    Kafka  ──────────────────────────────────────
   (stock-prices topic)                         │
       │                                        │
       ▼                                        ▼
 Price Injector                         Order Status topic
  │          │                                  │
  ▼          ▼                           Order Tracker
InfluxDB  Redis Pub/Sub                  │           │
(history) (realtime)               Order DB      Trade DB
              │                                     │
              ▼                              Portfolio Service
      Price Tracker Service                         │
              │                                     ▼
       WebSocket Gateway                        P&L Display
              │
         5M Clients

USER → API Gateway → Order Service → Validator → Kafka (raw-orders)
                                                      │
                                              Validator Service
                                              │               │
                                       verified-orders   rejected-orders
                                              │
                                        Order Service → Exchange
```

**⚡ Core Design Principles**

| Path | Optimized For | Mechanism |
|---|---|---|
| Fast Path | Price latency < 50ms | Exchange WebSocket → Kafka → Redis pub/sub → client WS — no DB in the hot path |
| Reliable Path | Zero order loss | Every order persisted in Kafka before processing; Order DB written before exchange call |

---

## 5. API Design

**User & KYC**

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/users/register` | Register user. Triggers KYC flow with third-party service. |
| POST | `/api/v1/users/kyc` | Submit KYC documents. Calls external KYC provider (e.g., Aadhaar/PAN verification). Returns `kyc_verified` flag. |
| POST | `/api/v1/users/login` | Authenticate. Returns JWT. |

**Market Data**

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/stocks?page=&limit=` | Paginated list of all stocks with last known price. |
| WS | `/ws/prices?symbols=RELIANCE,INFY` | WebSocket connection. Client subscribes/unsubscribes to symbols over the same connection. Bidirectional — this is why WS over SSE. |
| GET | `/api/v1/stocks/:symbol/history?from=&to=&interval=` | Historical OHLCV data from InfluxDB. |

**Orders**

| Method | Path | Description |
|---|---|---|
| POST | `/api/v1/orders` | Place order. Body: `{ symbol, type: MARKET/LIMIT, side: BUY/SELL, quantity, price? }`. Returns `orderId` with status `PENDING`. |
| GET | `/api/v1/orders?status=&page=` | List user's orders. `userId` from JWT header — never in URL. |
| GET | `/api/v1/orders/:orderId` | Order detail with current status. |
| DELETE | `/api/v1/orders/:orderId` | Cancel a pending limit order. |

**Portfolio & Funds**

| Method | Path | Description |
|---|---|---|
| GET | `/api/v1/portfolio/holdings` | Current holdings with avg buy price + current price + unrealised P&L. |
| GET | `/api/v1/portfolio/positions` | Intraday positions. |
| POST | `/api/v1/funds/deposit` | Add funds to wallet. Calls payment gateway. |
| POST | `/api/v1/funds/withdraw` | Withdraw funds. Validates available balance. |

> [!TIP]
> **Interview tip on WebSocket vs SSE for price feed:** "SSE is server-to-client only. With SSE, every time a user wants to add a new stock to their view, the client must close and reopen a new SSE connection with the updated symbol list. With WebSocket, the user sends a subscribe/unsubscribe message over the existing connection — no reconnection needed. At 1M concurrent connections, avoiding reconnect storms is critical."

---

## 6. End-to-End Flow

> [!IMPORTANT]
> **This is a queue-first, strongly-consistent system — two requirements that pull in opposite directions.**
>
> | Pipeline | Kafka Topic | Why async |
> |---|---|---|
> | Price feed | `stock-prices` | 10K price events/sec — no DB in the hot path, Redis pub/sub fanout |
> | Order pipeline | `raw-orders` → `verified-orders` → `order-status` | Durability before exchange call; validator decoupled from ingestion rate |
> | Notifications + audit | `notifications`, `audit-log` | Never block the order path for non-critical side effects |
>
> **But strong consistency is non-negotiable for money:**
> - Wallet debit and stock allocation must be atomic — two-phase with idempotency key
> - Duplicate order prevention via `order_id` idempotency check at exchange
> - Reconciliation job runs nightly to catch any drift between Order DB and exchange settlement

---

### 6.1 — Complete Order Lifecycle (say this out loud in the interview)

**This is the most important flow. Every step must be explicit.**

```
1. User taps "Buy RELIANCE — Market — 10 shares"
   → POST /orders {symbol, side: BUY, qty: 10, type: MARKET}
   → API Gateway validates JWT, rate-limits (5 orders/sec per user)

2. Order Service generates order_id (UUID, client-deduplication key)
   → Writes order to Kafka raw-orders topic (durable before any processing)
   → Returns {orderId, status: PENDING} immediately
   → I chose async here because at 100K orders/sec at market open,
     synchronous validation + DB writes would bottleneck immediately

3. Validator Service consumes raw-orders
   → KYC check: is user verified? (User DB)
   → Market hours check: is it between 9:15 AM – 3:30 PM IST?
   → Funds check: wallet_balance >= order_value + brokerage fee?
   → CRITICAL: funds check uses SELECT FOR UPDATE (pessimistic lock)
     to prevent double-spend when two orders hit simultaneously
   → Pass → publish to verified-orders
   → Fail → publish to rejected-orders → notify user, no funds touched

4. Order Service consumes verified-orders
   → Writes order to Order DB: status=PENDING, trade_id=NULL
   → Deducts funds from Payment DB atomically (same DB transaction)
   → I deduct funds here — before exchange call — because the
     exchange does not guarantee an immediate rejection response.
     Holding the funds prevents overselling while order is live.

5. Order Service calls Exchange API via Exchange Gateway
   → Exchange Gateway is the single proxy — all exchange calls go here
   → Exchange allocates stock from its matching engine
   → Returns acknowledgement on exchange WebSocket: order-status event

6. Order Tracker consumes order-status from Kafka
   → Exchange EXECUTED → update Order DB status=EXECUTED, set trade_id
                       → insert into Trade DB (confirmed trade only)
                       → release any remaining held funds (for partial fills)
                       → push notification: "10 shares of RELIANCE bought at ₹2845"
   → Exchange REJECTED → update Order DB status=REJECTED
                       → refund full held amount back to wallet
                       → push notification with rejection reason

7. Portfolio Service reflects the new holding
   → reads Trade DB (never Order DB)
   → recalculates P&L: (current_price - avg_buy_price) × quantity
   → P&L cached in Redis TTL=5s; invalidated on each new trade

On exchange timeout: retry with same order_id (idempotency key prevents duplicate)
On partial fill: Trade DB updated incrementally; Order stays PARTIALLY_FILLED
On validator crash: Kafka offset replay; idempotent order_id check prevents re-processing
```

---

### 6.2 Real-Time Price Feed (spoken flow)

```
1. Market opens 9:15 AM IST
   → Exchange Gateway opens 20 persistent WebSocket connections to NSE/BSE
   → Each connection subscribed to ~500 stocks — all 10K stocks covered
   → I chose WebSocket over SSE because subscription changes are bidirectional:
     broker needs to add/remove stock subscriptions without reconnecting

2. Exchange pushes: {symbol: "RELIANCE", ltp: 2845.50, timestamp: ...}
   → Exchange Gateway publishes to Kafka stock-prices topic
   → Partitioned by symbol — all RELIANCE events go to same partition, ordering guaranteed

3. Price Injector consumes from Kafka, writes to two stores in parallel:
   → InfluxDB: time-series record (symbol, ts, open, high, low, close, volume)
   → Redis pub/sub: publish to channel price:RELIANCE
   → I separate historical (InfluxDB) and real-time (Redis) because
     querying InfluxDB for live prices adds 5–10ms disk I/O per tick.
     Redis = sub-millisecond in-memory fanout.

4. Price Tracker subscribes to Redis channels for all stocks users are watching
   → When Redis publishes price:RELIANCE → Price Tracker pushes to all
     WebSocket connections subscribed to RELIANCE
   → 1M concurrent WebSocket connections handled by dedicated WS Gateway cluster

5. User opens a new stock chart
   → Price Tracker fetches last 60 minutes of OHLCV from InfluxDB (one-time)
   → Then streams real-time ticks via open WebSocket for live candlestick updates
```

---

### 6.3 Place Order — Sequence Diagram

```mermaid
sequenceDiagram

1. On market open (9:15 AM), Exchange Gateway opens **20 persistent WebSocket connections** to NSE/BSE exchange — each connection subscribed to ~500 stocks. All 10,000 stocks covered.
2. Exchange pushes price update: `{ symbol: "RELIANCE", ltp: 2845.50, timestamp: ... }` in real time.
3. Exchange Gateway receives update → publishes to **Kafka** `stock-prices` topic. Kafka partitioned by symbol — all RELIANCE updates go to same partition, ordering guaranteed.
4. **Price Injector Service** consumes from Kafka. Writes to two stores simultaneously:
   - **InfluxDB**: append time-series record `(symbol, timestamp, open, high, low, close, volume)` — historical data
   - **Redis pub/sub**: publish to channel `price:RELIANCE` — real-time fanout
5. **Price Tracker Service** subscribes to Redis pub/sub channels for all symbols. When a client subscribes to RELIANCE via WebSocket, Price Tracker subscribes to `price:RELIANCE` in Redis.
6. When Redis publishes `price:RELIANCE`, Price Tracker receives it and pushes to all WebSocket connections subscribed to RELIANCE.
7. On new user connection: Price Tracker fetches last N minutes of history from InfluxDB to populate the price chart, then streams real-time via the open WebSocket.

```mermaid
sequenceDiagram
    participant Exchange
    participant ExchangeGW as Exchange Gateway
    participant Kafka
    participant PriceInjector as Price Injector
    participant InfluxDB
    participant Redis as Redis Pub/Sub
    participant PriceTracker as Price Tracker
    participant Client

    Exchange->>ExchangeGW: WS push - RELIANCE ltp=2845.50
    ExchangeGW->>Kafka: Publish to stock-prices topic
    Kafka->>PriceInjector: Consume price event
    PriceInjector->>InfluxDB: Write time-series record
    PriceInjector->>Redis: Publish to price:RELIANCE channel
    Redis->>PriceTracker: Push to all subscribers
    PriceTracker->>Client: WS push - RELIANCE updated price
    Note over Client,PriceTracker: End-to-end < 50ms
```

### 6.4 Price Feed — Sequence Diagram

```mermaid
sequenceDiagram
    participant Exchange
    participant ExchangeGW as Exchange Gateway
    participant Kafka
    participant PriceInjector as Price Injector
    participant InfluxDB
    participant Redis as Redis Pub/Sub
    participant PriceTracker as Price Tracker
    participant Client

    Exchange->>ExchangeGW: WS push - RELIANCE ltp=2845.50
    ExchangeGW->>Kafka: Publish to stock-prices topic
    Kafka->>PriceInjector: Consume price event
    PriceInjector->>InfluxDB: Write time-series record
    PriceInjector->>Redis: Publish to price:RELIANCE channel
    Redis->>PriceTracker: Push to all subscribers
    PriceTracker->>Client: WS push - RELIANCE updated price
    Note over Client,PriceTracker: End-to-end less than 50ms
```

---

### 6.5 Place Order — Full Sequence Diagram

1. User taps **Buy RELIANCE — Market — 10 shares**. Client calls `POST /api/v1/orders`.
2. Order Service writes order to **Kafka** `raw-orders` topic. Returns `orderId` with `status=PENDING` immediately to client — order is durably queued.
3. **Validator Service** consumes from `raw-orders`. Runs checks:
   - Is user KYC verified? (User DB lookup)
   - Is market open? (Time check)
   - Does user have sufficient wallet balance? (Payment DB lookup)
   - Does order type/quantity pass exchange rules?
4. If all checks pass → publishes to `verified-orders` topic. If any fail → publishes to `rejected-orders` topic.
5. **Order Service** consumes from `verified-orders`. Calls Exchange API to place the order. Writes order to **Order DB** with `status=PENDING`, `trade_id=null`.
6. Exchange allocates stock → sends acknowledgement on the exchange WebSocket connection (`order-status` event).
7. **Order Tracker Service** consumes `order-status` from Kafka. For a successful allocation:
   - Updates **Order DB**: `status=EXECUTED`, `trade_id=EXCHANGE_TXN_ID`
   - Inserts into **Trade DB**: confirmed trade record
   - Sends push notification to user: "Order executed — 10 shares of RELIANCE bought at ₹2845.50"
8. For rejected orders (from Validator): Order DB updated `status=REJECTED`, funds not deducted, notification sent.

```mermaid
sequenceDiagram
    participant User
    participant OrderSvc as Order Service
    participant Kafka
    participant Validator as Validator Service
    participant PaymentDB
    participant UserDB
    participant Exchange
    participant OrderTracker as Order Tracker
    participant OrderDB
    participant TradeDB
    participant NotifSvc as Notification Service

    User->>OrderSvc: POST /orders - BUY RELIANCE 10 shares
    OrderSvc->>Kafka: Publish to raw-orders
    OrderSvc-->>User: orderId - status=PENDING
    Kafka->>Validator: Consume order
    Validator->>UserDB: Check KYC status
    Validator->>PaymentDB: Check wallet balance
    Validator->>Kafka: Publish to verified-orders
    Kafka->>OrderSvc: Consume verified order
    OrderSvc->>Exchange: Place order via Exchange API
    OrderSvc->>OrderDB: Write order - status=PENDING
    Exchange-->>Kafka: Push order-status - EXECUTED
    Kafka->>OrderTracker: Consume order status
    OrderTracker->>OrderDB: Update status=EXECUTED - trade_id set
    OrderTracker->>TradeDB: Insert confirmed trade record
    OrderTracker->>NotifSvc: Trigger push notification
    NotifSvc-->>User: Order executed notification
```

---

## 7. High-Level Architecture

### Simple Design

```mermaid
graph TD
    Client["Web / Mobile Client"]
    APIGW["API Gateway"]
    WSGW["WebSocket Gateway"]
    UserSvc["User Service"]
    PriceSvc["Price Tracker Service"]
    OrderSvc["Order Service"]
    PortfolioSvc["Portfolio Service"]
    Exchange["Exchange NSE / BSE"]
    UserDB[("User DB - PostgreSQL")]
    OrderDB[("Order DB - PostgreSQL")]
    InfluxDB[("InfluxDB - Price History")]

    Client --> APIGW
    Client -->|WS| WSGW
    APIGW --> UserSvc
    APIGW --> OrderSvc
    APIGW --> PortfolioSvc
    WSGW --> PriceSvc
    UserSvc --> UserDB
    OrderSvc --> OrderDB
    PriceSvc --> InfluxDB
    PriceSvc -->|WS| Exchange
    OrderSvc --> Exchange
```

### Evolved Design (Full Pipeline)

```mermaid
graph TD
    Client["Web / Mobile Client"]
    APIGW["API Gateway"]
    WSGW["WebSocket Gateway - Dedicated"]
    UserSvc["User Service"]
    KYCSvc["Third-Party KYC Service"]
    PaySvc["Payment Service"]
    PayGW["Payment Gateway"]
    PayDB[("Payment DB - PostgreSQL")]
    UserDB[("User DB - PostgreSQL")]
    ExchangeGW["Exchange Gateway"]
    Exchange["Exchange NSE / BSE"]
    Kafka1[["Kafka - stock-prices topic"]]
    PriceInjector["Price Injector Service"]
    InfluxDB[("InfluxDB - Price History")]
    Redis[("Redis Pub/Sub - Live Prices")]
    PriceSvc["Price Tracker Service - WS Server"]
    WatchDB[("Watch DB - PostgreSQL")]
    WatchSvc["Watchlist Service"]
    Kafka2[["Kafka - raw-orders / verified-orders / rejected-orders / order-status"]]
    ValidatorSvc["Validator Service"]
    OrderSvc["Order Service"]
    OrderTracker["Order Tracker Service"]
    OrderDB[("Order DB - PostgreSQL")]
    TradeDB[("Trade DB - PostgreSQL")]
    PortfolioSvc["Portfolio Service"]
    NotifSvc["Notification Service"]

    Client --> APIGW
    Client -->|WS| WSGW
    APIGW --> UserSvc
    APIGW --> PaySvc
    APIGW --> OrderSvc
    APIGW --> PortfolioSvc
    APIGW --> WatchSvc
    WSGW --> PriceSvc
    UserSvc --> UserDB
    UserSvc --> KYCSvc
    PaySvc --> PayGW
    PaySvc --> PayDB
    ExchangeGW -->|WS 20 connections| Exchange
    ExchangeGW --> Kafka1
    Kafka1 --> PriceInjector
    PriceInjector --> InfluxDB
    PriceInjector --> Redis
    Redis --> PriceSvc
    PriceSvc --> InfluxDB
    WatchSvc --> WatchDB
    WatchSvc --> PriceSvc
    OrderSvc --> Kafka2
    Kafka2 --> ValidatorSvc
    ValidatorSvc --> UserDB
    ValidatorSvc --> PayDB
    ValidatorSvc --> Kafka2
    Kafka2 --> OrderSvc
    OrderSvc --> Exchange
    OrderSvc --> OrderDB
    Exchange --> Kafka2
    Kafka2 --> OrderTracker
    OrderTracker --> OrderDB
    OrderTracker --> TradeDB
    OrderTracker --> NotifSvc
    PortfolioSvc --> TradeDB
    PortfolioSvc --> PriceSvc
    NotifSvc --> Client
```

---

## 8. Data Model

| Entity | Storage | Key Columns | Why this store |
|---|---|---|---|
| User | PostgreSQL | `user_id`, `email`, `phone`, `name`, `is_kyc_verified`, `created_at` | ACID — KYC status must be consistent. Sensitive data (PAN/Aadhaar) stored encrypted by third-party KYC provider, not here. |
| Payment/Wallet | PostgreSQL | `transaction_id`, `user_id`, `amount`, `type` (DEPOSIT/WITHDRAW), `status`, `timestamp` | ACID — financial transactions require strong consistency. |
| Order | PostgreSQL | `order_id`, `user_id`, `symbol`, `order_type` (MARKET/LIMIT), `side` (BUY/SELL), `price`, `quantity`, `status` (PENDING/EXECUTED/REJECTED/CANCELLED), `trade_id`, `created_at` | ACID — every state change (pending → executed) must be durable. `trade_id` null until exchange confirms. |
| Trade | PostgreSQL | `trade_id`, `order_id`, `user_id`, `symbol`, `quantity`, `executed_price`, `exchange_trade_id`, `status`, `timestamp` | Separate from Order DB — only confirmed exchange trades. Used for P&L calculation and end-of-day reconciliation with exchange. |
| Stock Price (time-series) | InfluxDB | `symbol` (tag), `timestamp`, `open`, `high`, `low`, `close`, `ltp`, `volume` | 56B rows/year — time-series DB handles append-only time-indexed data with automatic downsampling. PostgreSQL would collapse under this write rate. |
| Live Price | Redis pub/sub | Channel: `price:{symbol}` → `{ ltp, timestamp }` | Ephemeral — no persistence needed. Sub-millisecond fanout to all subscribers. TTL implicit (channel has no history). |
| Watchlist | PostgreSQL | `watchlist_id`, `user_id`, `name` + `watchlist_items: watchlist_id, symbol` | Relational — user → many watchlists → many symbols. Low write volume, simple joins. |

> [!NOTE]
> **Key Insight:** Order DB and Trade DB are separate by design. Order DB contains ALL orders — including rejected ones. Trade DB contains only exchange-confirmed trades. Portfolio P&L reads Trade DB, never Order DB. End-of-day reconciliation with exchange compares Trade DB — a clean audit trail.

---

## 9. Deep Dives

### 9.1 Real-Time Price Feed — WebSocket vs SSE and Why

**Here's the problem we're solving:** 10,000 stocks update every second during market hours. We need to stream these updates to 1M concurrent user connections with < 50ms end-to-end latency. Users dynamically change which stocks they're watching. Which connection protocol — WebSocket or Server-Sent Events (SSE)?

**Naive solution — Polling:** Client calls `GET /stocks/RELIANCE/price` every second. At 1M users × 1 stock each = 1M HTTP requests/sec for just one stock. For 10 stocks each = 10M req/sec of empty or stale responses. Immediately ruled out.

**SSE analysis:** SSE is server-to-client only (unidirectional). When a user wants to add a stock to their view, the client must close the existing SSE connection and open a new one with the updated symbol list. At 1M concurrent connections, reconnection storms on every subscription change = catastrophic.

**Chosen solution — WebSocket (bidirectional):**
- One persistent WS connection per user, open for the entire trading session
- Client sends subscription messages: `{ action: "subscribe", symbols: ["RELIANCE", "INFY"] }` — no reconnect needed
- Server pushes price updates only for subscribed symbols
- Same connection handles subscribe/unsubscribe dynamically

**Why WebSocket over Exchange too:**
- Exchange-to-broker: one WS connection handles 500 stock subscriptions. If broker wants to add stock 501, it sends a subscribe message on the existing connection — no new TCP handshake. With SSE, a new connection would be needed each time the subscription set changes.
- At market open, broker subscribes to all 10,000 stocks across 20 WS connections (500/connection). Stays connected all day.

**Trade-off accepted:** WebSocket connections are stateful — WebSocket Gateway must maintain session state. Requires sticky sessions or a session map (Redis) so reconnects land on the correct server. More operational complexity than SSE.

> [!NOTE]
> **Key Insight:** WebSocket vs SSE is a subscription management problem. SSE only allows the server to push — changing what you're subscribed to requires a new connection. WebSocket lets the client say "also give me TATA Steel" over the same connection. At 1M live connections, avoiding reconnects is not a nicety — it's a correctness requirement.

---

### 9.2 Strong Consistency + Concurrency — Preventing Double Spend

**Here's the problem we're solving:** A user has ₹10,000 in their wallet and places two buy orders simultaneously — ₹7,000 for RELIANCE and ₹6,000 for INFY. Total = ₹13,000. Both orders pass the funds check independently because each reads ₹10,000 balance before either deducts. The user overspends by ₹3,000. In a trading platform this is not a UX bug — it's a financial loss.

**Why this is harder than most systems:**
Unlike Facebook (eventual consistency is fine) or email (slight delay is acceptable), a stock broker has zero tolerance for financial inconsistency:
- Wallet balance + stock allocation must always be correct
- A trade must never be duplicated (duplicate exchange call = double buy)
- If exchange confirms a trade, the Trade DB must reflect it — no exceptions

**Concurrency problem illustrated:**
```
Time │ Order 1 (₹7,000)          │ Order 2 (₹6,000)
─────│────────────────────────────│──────────────────────
t1   │ READ balance = ₹10,000     │
t2   │                            │ READ balance = ₹10,000
t3   │ CHECK: 10,000 >= 7,000 ✓  │
t4   │                            │ CHECK: 10,000 >= 6,000 ✓
t5   │ DEDUCT ₹7,000 → balance=3K │
t6   │                            │ DEDUCT ₹6,000 → balance=4K ← WRONG
t7   │ Net balance = -3,000 💸    │ (last write wins, real balance is negative)
```

**Chosen solution — pessimistic locking with SELECT FOR UPDATE:**

```sql
-- Validator Service, inside a single DB transaction:
BEGIN;
  SELECT balance FROM wallets WHERE user_id = ? FOR UPDATE;  -- acquires row lock
  -- second concurrent order blocks here until this transaction commits
  IF balance >= order_value THEN
    UPDATE wallets SET balance = balance - order_value WHERE user_id = ?;
    INSERT INTO held_funds (order_id, user_id, amount) VALUES (?, ?, ?);
  END IF;
COMMIT;  -- lock released here
```

- `FOR UPDATE` acquires a row-level exclusive lock on the wallet row
- Second concurrent order blocks at the `SELECT FOR UPDATE` — it cannot read until the first transaction commits
- After first order commits (balance = ₹3,000), second order reads ₹3,000 → fails the `>= ₹6,000` check → rejected
- Lock held for < 5ms (single row update) — negligible contention at normal order rates

**Funds hold pattern (not immediate deduct):**
Rather than immediately deducting from the wallet, the validator:
1. Moves `order_value` from `wallet_balance` to `held_funds` (same transaction)
2. Held funds are inaccessible for new orders but not yet gone
3. On exchange EXECUTED → move held funds to "spent" (final deduction)
4. On exchange REJECTED → release held funds back to wallet_balance
5. This prevents the user from losing money if the exchange rejects the order

**Duplicate exchange call prevention (idempotency key):**
```
Order Service → Exchange API call with header: Idempotency-Key: {order_id}
Exchange sees same order_id twice → ignores the second call, returns same result
```
If Order Service crashes after sending to exchange but before receiving the ack:
- On restart, it retries with same `order_id`
- Exchange deduplicates — no double buy

**Trade-off accepted:** `SELECT FOR UPDATE` serialises concurrent orders for the same user — two simultaneous orders cannot both proceed through funds validation in parallel. For typical users placing 1–2 orders per second, this is imperceptible. For algo traders placing hundreds per second, this is a known limitation handled by pre-allocated margin accounts.

> [!NOTE]
> **Key Insight:** Strong consistency in a trading platform is not a preference — it's a regulatory and financial requirement. The `SELECT FOR UPDATE` row lock is a correctness guarantee, not a performance pessimisation. The cost is < 5ms serialisation per user. The alternative is users losing money.

---

### 9.3 Order Pipeline — High Frequency with Validation

**Here's the problem we're solving:** 100K orders/sec at market open. Each order must be validated (KYC, funds, market hours) before hitting the exchange — because every exchange API call costs money. Validation requires DB lookups (User DB, Payment DB) which take time. How do we handle 100K orders/sec without blocking?

**Naive solution:** Synchronous pipeline — receive order → validate (DB lookups) → call exchange → return response. At 100K orders/sec, each DB lookup adds 5–10ms → pipeline latency = 20–50ms. Under load, DB becomes the bottleneck. Service goes down = orders lost.

**Chosen solution — Kafka-buffered async pipeline:**

```
User → Order Service → Kafka (raw-orders) → Validator Service
                                                    ↓
                                        Kafka (verified-orders OR rejected-orders)
                                                    ↓
                                           Order Service → Exchange
                                                    ↓
                                        Kafka (order-status from Exchange WS)
                                                    ↓
                                            Order Tracker → Order DB + Trade DB
```

1. Order Service immediately persists order to Kafka — durable queue. Returns `orderId` + `PENDING` status to user. UI is responsive.
2. Validator Service consumes asynchronously. DB lookups happen at the consumer's pace — decoupled from user-facing latency.
3. Exchange calls happen only for verified orders. Rejected orders never touch the expensive exchange API.
4. Order Tracker reconciles exchange acknowledgements (including partial fills for limit orders) back to Order DB and Trade DB.

**Handling Limit Orders (partial fills):**

A limit order for 100 shares might execute in batches: 30 shares now, 70 shares 15 minutes later. Order Tracker handles each partial fill acknowledgement from the exchange, updating Trade DB incrementally. Order status stays `PARTIALLY_FILLED` until all 100 shares are confirmed or order expires.

**Trade-off accepted:** Async pipeline = eventual consistency between order placement and confirmation. User sees `PENDING` for up to seconds. This is acceptable and standard in real-world brokers. Strong consistency between funds deducted and stock allocated is maintained by the exchange — broker just tracks the outcome.

> [!NOTE]
> **Key Insight:** The Kafka queue before validation means every order is durably stored before any processing. If the Validator Service crashes, it resumes from its Kafka offset — zero order loss. Without Kafka, a validator crash loses all in-flight orders.

---

### 9.4 Exchange Gateway — Why a Dedicated Proxy

**Here's the problem we're solving:** Multiple internal services need to interact with the exchange — Price Tracker subscribes to price feeds, Order Service places orders, Order Tracker receives confirmations. If each service opens its own connection to the exchange, we have uncontrolled connection sprawl and the exchange charges per connection/request.

**Chosen solution — Exchange Gateway as single proxy:**
- One service owns all exchange communication
- Manages the 20 WebSocket connections for price feeds
- Routes order placement requests from Order Service
- Receives order status callbacks from exchange WebSocket
- Other services never talk to the exchange directly — they talk to Exchange Gateway or consume from Kafka topics that Gateway publishes to

**Why this matters for cost:**
- Exchange API access in India (NSE/BSE) is charged per connection and per request — costs crores per month for large brokers
- Exchange Gateway applies rate limiting internally, deduplicates unnecessary calls, and batches where possible
- Centralised monitoring: all exchange connectivity visible in one place

> [!NOTE]
> **Key Insight:** The Exchange Gateway is the same pattern as an API Gateway — it abstracts an expensive external dependency behind a single controlled interface. Exchange API calls cost real money; the gateway ensures no internal service can accidentally spam the exchange.

---

### 9.5 Trade DB vs Order DB — Why Two Tables

**Here's the problem we're solving:** Orders can be rejected (by Validator before even reaching exchange), cancelled, partially filled, or fully executed. Portfolio P&L needs only confirmed executed trades. End-of-day reconciliation with the exchange needs a clean list of what actually transacted.

**Order DB** — full audit trail:
- Every order ever placed: pending, rejected, cancelled, executed
- Rejected-by-validator orders live here (never reached exchange)
- Status: PENDING → EXECUTED / REJECTED / CANCELLED
- `trade_id` = null until exchange confirms

**Trade DB** — exchange-confirmed only:
- Only orders that the exchange acknowledged as executed
- Contains `exchange_trade_id` for reconciliation
- Portfolio Service reads ONLY from Trade DB — never sees rejected/cancelled orders
- End-of-day reconciliation: compare Trade DB with exchange's settlement report

**Why not one table?**

Portfolio P&L calculation = `(current_price - avg_buy_price) × quantity`. Avg buy price is computed from Trade DB. Including rejected/cancelled orders would corrupt the avg price calculation. Two tables keep concerns cleanly separated.

> [!NOTE]
> **Key Insight:** Order DB is for the broker's internal audit. Trade DB is for financial truth — what actually happened at the exchange. Portfolio P&L, reconciliation, and regulatory reporting all use Trade DB exclusively.

---

## 10. Bottlenecks & Scaling

**Scale we're designing for (anchor every decision to these numbers):**
- **50M registered users, 5M DAU**
- **100K orders/sec at 9:15 AM market open** — this is the spike that breaks naive systems. Market opens once a day; everyone submits pre-placed orders simultaneously. Traffic is 50× higher at 9:15 than at 2:00 PM.
- **10,000 stocks × 1 price update/sec = 10K price events/sec** during market hours (zero outside market hours)
- **1M concurrent WebSocket connections** — every active user has one open connection for price streaming
- **56 billion InfluxDB rows/year** — price history append-only, never updated
- **0 downtime tolerance** during market hours — a 30-second outage at 9:15 AM costs brokers crores in lost commissions and user trust

"The hardest engineering problem is the 9:15 AM spike. All pre-placed orders flush into the system simultaneously. Kafka is the only reason this doesn't crash the Validator Service — it absorbs the burst and lets validation happen at the consumer's pace."

**What breaks first at 10× scale:**

1. **Price Injector at 100K stocks/sec:**
   - Kafka partitioned by symbol — scale consumers horizontally
   - Redis pub/sub scales vertically (single Redis node handles ~1M pub/sub messages/sec). At extreme scale: Redis Cluster with consistent hashing on channel name
   - InfluxDB: add nodes, shard by symbol prefix

2. **Order Service at 1M orders/sec:**
   - Kafka handles ingestion — add partitions to `raw-orders` topic
   - Validator Service scales horizontally as Kafka consumer group
   - Order DB (PostgreSQL): shard by `user_id`. Order queries are always per-user
   - Exchange remains the real bottleneck — exchange API has its own rate limits. Broker must implement order throttling to avoid breaching exchange limits

3. **WebSocket Gateway at 10M concurrent connections:**
   - Dedicated WS Gateway cluster. Each node handles ~100K connections
   - Redis pub/sub for cross-node fanout: when price updates arrive on node A, subscribers on node B receive via Redis
   - Sticky session routing: user reconnects must land on same node (or use shared session map in Redis)

4. **Portfolio P&L at high read load:**
   - Cache P&L snapshots in Redis: `portfolio:{userId} → P&L JSON`, TTL = 5 seconds
   - Invalidate on new trade confirmed (Order Tracker triggers cache bust)
   - InfluxDB downsampling for old historical data (minute-level candles beyond 1 month, daily candles beyond 1 year)

---

## 11. Failure Scenarios

| Failure | Impact | Recovery |
|---|---|---|
| Exchange WebSocket drops | Price feed pauses; orders still accepted but unconfirmed | Exchange Gateway reconnects immediately. Last known prices served from InfluxDB. Client shows "Delayed data" indicator. |
| Kafka broker fails | Order processing pauses; no data loss | Kafka cluster (3+ brokers, replication factor 3). No message loss. Orders resume when broker recovers. |
| Validator Service crashes | Orders queue in raw-orders topic | Consumer group resumes from last committed offset. At-least-once: duplicate validation handled by idempotent order_id check. |
| Order Service crashes before Exchange call | Order in Kafka but not yet sent to exchange | Validator has already published to verified-orders. Order Service re-consumes on restart, re-sends to exchange. Idempotency key (order_id) prevents duplicate at exchange. |
| Order DB primary fails | Cannot write new order status | PostgreSQL read replicas available. Auto-failover (RDS Multi-AZ). Brief write pause during promotion. |
| InfluxDB outage | Historical price charts unavailable | Real-time prices (Redis pub/sub) unaffected. Charts show "Historical data unavailable" until restored. |
| Exchange rejects order | User placed order but exchange says invalid | Order Tracker marks order REJECTED in Order DB. Funds not deducted. Notification sent to user with rejection reason. |
| **Exchange timeout** (no ack received) | Order in limbo — sent to exchange but no confirmation | Order Service retries with same `order_id` (idempotency key). Exchange deduplicates. After 3 retries → mark order STUCK, alert ops team. Reconciliation job compares Order DB vs exchange settlement report at end of day. |
| **Partial execution** (limit order 100 shares, only 30 filled) | Order partially complete; user expects full fill | Order Tracker handles each partial fill ack from exchange. Trade DB updated incrementally. Order status = `PARTIALLY_FILLED`. Remaining 70 shares stay in `raw-orders` state. Full fill or order expiry closes the order. |
| **Order stuck in PENDING** (validator crash, Kafka lag) | User sees PENDING indefinitely | Consumer group resumes from Kafka offset on restart. Idempotent order_id check prevents re-processing. Reconciliation job flags any order PENDING > 30 seconds for manual review. |
| **Funds deducted but exchange call failed** | User's money held but no stock received | Held funds remain in `held_funds` table. Order status = `EXCHANGE_ERROR`. Reconciliation job detects mismatch and auto-releases held funds back to wallet. Audit log records every state transition for dispute resolution. |
| **9:15 AM order spike** (100K orders/sec) | Validator Service overwhelmed | Kafka absorbs burst — Order Service accepts all orders and returns PENDING. Validator Consumer Group auto-scales (Kubernetes HPA on Kafka consumer lag metric). Backpressure handled by Kafka; users see delayed confirmation, not errors. |

---

## 12. Trade-offs

### WebSocket vs SSE for Price Feed

| Dimension | WebSocket | SSE |
|---|---|---|
| Direction | Bidirectional | Server → Client only |
| Subscription changes | Send message on same connection | Must close + reopen connection |
| Connection overhead | Higher (persistent TCP) | Lower (standard HTTP) |
| Browser support | Universal | Universal |
| Reconnect cost | Low (client sends subscribe list) | High (new connection per change) |

**Chosen:** WebSocket — dynamic subscription changes (user opens different stock charts) require bidirectional communication. SSE reconnect storms at 1M connections = unacceptable.

> [!NOTE]
> **Key Insight:** SSE is "server pushes to client." WebSocket is "client and server talk." The moment the client needs to change what it's subscribed to — which happens constantly in a trading app — you need WebSocket.

---

### InfluxDB vs PostgreSQL for Stock Prices

| Dimension | InfluxDB | PostgreSQL |
|---|---|---|
| Write throughput | 1M+ points/sec per node | ~50K rows/sec ceiling |
| Query type | Time-range aggregations (OHLCV) | General SQL |
| Storage efficiency | Automatic compression for time-series | Row-based, less efficient for time data |
| Downsampling | Built-in continuous queries | Manual jobs |
| Operational complexity | Higher | Lower |

**Chosen:** InfluxDB — 56B rows/year of price data. PostgreSQL would require extreme sharding and still struggle with time-range aggregation queries. InfluxDB is purpose-built for this exact access pattern.

> [!NOTE]
> **Key Insight:** Time-series data has two properties that general databases handle poorly: extremely high append-only write rate and range-based aggregation queries. InfluxDB is built for exactly this — OHLCV queries over billions of rows are sub-second.

---

### Strong Consistency vs Latency (the core fintech trade-off)

| Dimension | Strong Consistency (CP) | Eventual Consistency (AP) |
|---|---|---|
| Wallet balance | Always correct, never negative | May allow double-spend window |
| Order deduplication | Guaranteed via idempotency key + DB constraint | Possible duplicate at exchange |
| Read latency | Higher (lock acquisition, quorum reads) | Lower (any replica responds) |
| Write throughput | Lower (serialised per-user wallet) | Higher (no coordination) |
| Failure mode | Order rejected (safe) | Order accepted incorrectly (dangerous) |

**Chosen:** Strong consistency for all financial state (wallet, orders, trades). Eventual consistency only for non-financial display (P&L calculations, portfolio UI, price charts).

> [!NOTE]
> **Key Insight:** This is the opposite of Facebook. Facebook chooses AP because a stale feed for 2 seconds is fine. A trading platform chooses CP because ₹10,000 deducted twice is a legal liability. The CAP choice must follow the failure mode consequence, not a general preference.

---

### Sync vs Async Order Processing

| Dimension | Synchronous | Async (Kafka) |
|---|---|---|
| User-facing latency | Lower (direct response) | Higher (PENDING → eventual confirmation) |
| Order durability | Lost on crash | Kafka = at-least-once, no loss |
| Exchange API calls | Every order hits exchange | Only validated orders hit exchange (saves cost) |
| Scalability | Bottlenecked by validation DB | Each stage scales independently |

**Chosen:** Async — exchange API calls cost real money. Async pipeline ensures only valid orders reach the exchange, and every order is durably queued before processing.

> [!NOTE]
> **Key Insight:** In a stock broker, async order processing is not just a performance choice — it's a cost control mechanism. Every unnecessary exchange API call is a financial expense. The Kafka buffer + validator layer is the gatekeeper.

---

## Frontend Design (15% of this system — your differentiator)

> A trading frontend is the most latency-sensitive UI in consumer software. Every millisecond of price update delay is visible to users. The frontend engineering is about streaming, rendering performance, and state management under continuous mutation.

### WebSocket Price Streaming

**Problem:** 10,000 stocks updating every second. Client is viewing 5–10 stocks at a time. Don't stream all 10K — subscribe to only what's visible.

```
On component mount (stock chart opens):
  ws.send({ action: "subscribe", symbols: ["RELIANCE", "INFY"] })

On component unmount (user navigates away):
  ws.send({ action: "unsubscribe", symbols: ["RELIANCE"] })

On WS message:
  dispatch({ type: "PRICE_UPDATE", symbol: "RELIANCE", ltp: 2845.50 })
```

- One WebSocket connection for the entire app session — not per chart, not per page
- Subscribe/unsubscribe messages sent over the same connection (why WS over SSE)
- Redux slice `priceSlice` holds `{ [symbol]: { ltp, change, changePercent } }` — all charts read from this single source
- On WS disconnect: reconnect with exponential backoff + re-send full subscription list

### Candlestick Chart Rendering

**Problem:** A 60-day intraday chart has ~58,000 candles (1 per minute × 6.25 hrs × 60 days). Rendering 58K SVG/canvas elements = 15fps on any device.

**Solution — time-windowed rendering + downsampling:**
```
User selects "1D" view → fetch 1-min OHLCV candles (375 candles) from InfluxDB
User selects "1W" view → fetch 5-min candles (375 candles, downsampled server-side)
User selects "3M" view → fetch 1-hour candles (375 candles, downsampled server-side)
```
- Always render ~375 candles regardless of time window — server-side downsampling in InfluxDB continuous queries
- Live candle: the last candle on the chart is updated in-place by WebSocket ticks (update `close`, `high`, `low` without re-fetching history)
- Render with `<canvas>` not SVG — canvas handles 375 draw operations at 60fps; SVG at this density causes layout thrash

### Optimistic UI for Order Placement

**Problem:** Order goes through Kafka async pipeline — PENDING confirmation can take 1–3 seconds. User taps Buy and sees nothing for 3 seconds = feels broken.

**Solution:**
```
User taps BUY
  → Immediately show order in "Pending" state in Orders list (optimistic insert)
  → Immediately grey out wallet balance by order amount (optimistic deduction UI)
  → POST /orders fires in background

On WebSocket order-status event:
  → status=EXECUTED: update order row to "Executed", show green tick, play sound
  → status=REJECTED: remove optimistic entry, restore wallet display, show error toast
```
- Optimistic state lives in a separate Redux slice (`pendingOrders`) — not mixed with confirmed orders
- On app refresh / WS reconnect: `GET /orders?status=PENDING` reconciles optimistic state with server truth

### Order Status Tracking (Real-Time)

**Problem:** User wants to know when a limit order fills — could be minutes or hours after placement.

**Solution:**
- Order detail page maintains a WebSocket subscription to `order-status:{orderId}` channel
- Server pushes updates: PENDING → PARTIALLY_FILLED → EXECUTED
- Each status change animates a step indicator (progress bar through lifecycle states)
- On EXECUTED: confetti animation + sound — reinforces the action completed

### Caching Recent Stock Data

**Problem:** User switches between stocks frequently. Re-fetching OHLCV history from InfluxDB on every chart open = 150–300ms latency per switch.

**Solution — client-side LRU cache:**
```javascript
// In-memory LRU cache, max 20 stocks
const chartCache = new LRUCache({ max: 20, ttl: 5 * 60 * 1000 }) // 5 min TTL

async function fetchChart(symbol, interval) {
  const cached = chartCache.get(`${symbol}:${interval}`)
  if (cached) return cached          // instant
  const data = await api.getHistory(symbol, interval)
  chartCache.set(`${symbol}:${interval}`, data)
  return data
}
```
- TTL = 5 minutes — acceptable staleness for historical candles
- Live candle always updated via WebSocket regardless of cache
- Watchlist pre-warms: when user opens watchlist, prefetch charts for top 5 stocks in background

### CDN for Static Assets + Market Data

| Asset | Strategy |
|---|---|
| Company logos, icons | CDN with immutable cache headers (content-hash filenames) |
| Stock metadata (name, sector, ISIN) | CDN with 24h TTL — changes rarely |
| Historical OHLCV data (> 1 month old) | CDN-cached via InfluxDB read replica — never changes |
| Live prices | Never CDN — WebSocket direct from Price Tracker |
| Order status | Never CDN — WebSocket direct from Order Tracker |

---

## Interview Summary

### Key Decisions

| Decision | Problem it solves | Trade-off accepted |
|---|---|---|
| WebSocket over SSE | Dynamic stock subscription changes without reconnects | Stateful connections — need sticky sessions or Redis session map |
| Exchange Gateway (single proxy) | Centralised, controlled, cost-managed exchange access | Single point of failure — mitigated with multi-instance deployment |
| Kafka buffer before order processing | Durability at 100K orders/sec; decouple validation from ingestion | Async = user sees PENDING before EXECUTED; eventual confirmation |
| InfluxDB for price history | 56B rows/year time-series — PostgreSQL can't handle this write rate | Higher operational complexity; separate query language |
| Redis pub/sub for live prices | Sub-millisecond fanout to 1M subscribers | Ephemeral — no message persistence; replay not possible |
| Trade DB separate from Order DB | Clean separation: all orders vs exchange-confirmed trades | Extra DB to maintain; sync logic in Order Tracker |

### Fast Path vs Reliable Path

```
PRICE FAST PATH (optimised for < 50ms latency)
  Exchange WS push
      │
  Exchange Gateway → Kafka (no DB write in hot path)
      │
  Price Injector → Redis pub/sub (in-memory, sub-ms)
      │
  Price Tracker → WebSocket → Client
  (InfluxDB write is async, does not block the hot path)


ORDER RELIABLE PATH (optimised for zero loss + consistency)
  User places order
      │
  Order Service → Kafka raw-orders (durable before any processing)
      │
  Validator (KYC + funds) → Kafka verified-orders
      │
  Order Service → Exchange API (only validated orders touch exchange)
      │
  Exchange acknowledgement → Kafka order-status
      │
  Order Tracker → Order DB + Trade DB + Notification
  (every state change is persisted before notifying user)
```

### Key Insights Checklist

- "Broker ≠ Exchange. The exchange is a black box with paid APIs. The broker's job is validate, forward, track, display. Every unnecessary exchange call costs money — the Kafka buffer + Validator layer is a cost control mechanism, not just a scaling choice."
- "The order lifecycle is: Place → Validate (KYC + funds with SELECT FOR UPDATE) → Hold funds → Exchange call → Ack → Execute + deduct → Notify. Every step has a Kafka topic and a DB write. Nothing is fire-and-forget."
- "Strong consistency for money, eventual for display. Wallet balance uses pessimistic locking — SELECT FOR UPDATE serialises concurrent orders per user. P&L calculations use eventual consistency — 2-second staleness is fine. The CAP choice follows the failure mode consequence."
- "Double-spend prevention is SELECT FOR UPDATE on the wallet row. Two simultaneous orders: second one blocks at the lock, reads the reduced balance after first commits, fails the funds check. This is a correctness guarantee, not a pessimisation."
- "Exchange timeout → retry with same order_id (idempotency key). Exchange deduplicates. Nightly reconciliation job compares Trade DB against exchange settlement report — any drift triggers automatic correction."
- "The 9:15 AM market open is the hardest engineering problem. 100K orders/sec simultaneously. Kafka is the only reason this doesn't crash the system — it absorbs the burst and validators consume at their own pace."
- "WebSocket over SSE because subscription changes are bidirectional. SSE = new connection on every subscribe change. At 1M connections, reconnect storms are catastrophic. WebSocket = subscribe message on same connection, no reconnect."
- "Candlestick charts render ~375 candles regardless of time window — server-side downsampling in InfluxDB. Always 375 candles at 60fps. Rendering 58K candles for a 60-day view = 15fps. The downsampling is the performance feature."
