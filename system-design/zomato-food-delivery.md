# High-Level Design: Food Delivery App (Zomato/Swiggy)

## 1. Problem Statement & Requirements

### Problem Statement
Design a scalable food delivery platform that connects customers with restaurants and delivery partners, enabling seamless browsing, ordering, real-time tracking, and delivery of food items.

### Functional Requirements

#### Core Features
- **User Management**: Registration, login, profile management for customers, restaurants, and delivery partners
- **Restaurant Discovery**: Browse restaurants by cuisine, location, ratings, delivery time
- **Menu Browsing**: View restaurant menus with items, prices, descriptions, images
- **Search & Filters**: Search by dish name, restaurant, cuisine; filter by veg/non-veg, rating, delivery time, cost
- **Cart Management**: Add/remove items, customize dishes, apply offers
- **Order Placement**: Checkout, address selection, payment processing
- **Real-time Order Tracking**: Live updates on order preparation, pickup, and delivery
- **Delivery Partner Tracking**: Real-time location of delivery partner on map
- **Payment Integration**: Multiple payment methods (UPI, cards, wallets, COD)
- **Ratings & Reviews**: Rate restaurants, dishes, and delivery experience
- **Offers & Discounts**: Promo codes, restaurant offers, cashback, loyalty rewards
- **Order History**: View past orders, reorder functionality
- **Notifications**: Order status updates, offers, delivery updates

#### User Roles
1. **Customer**: Browse, order, track, review
2. **Restaurant Owner**: Manage menu, prices, availability, view orders
3. **Delivery Partner**: Accept orders, navigate, update delivery status
4. **Admin**: Platform management, dispute resolution, analytics

### Non-Functional Requirements

- **Scalability**: Handle millions of users, thousands of concurrent orders
- **Performance**:
  - Restaurant listing: < 500ms
  - Search results: < 300ms
  - Order placement: < 2s
  - Real-time tracking updates: < 1s latency
- **Availability**: 99.9% uptime
- **Consistency**: Strong consistency for orders, eventual consistency for restaurant listings
- **Real-time**: Live order tracking with WebSocket connections
- **Reliability**: No order loss, accurate billing
- **Security**: Secure payments, data encryption, PCI-DSS compliance
- **Geo-distribution**: Location-based services with low latency

### Scale Estimates
- **Users**: 50M active users
- **Daily Orders**: 5M orders/day (~60 orders/second average, 300 peak)
- **Restaurants**: 500K restaurants
- **Delivery Partners**: 1M active delivery partners
- **Concurrent Users**: 1M during peak hours
- **Data Storage**:
  - Orders: ~1KB per order = 5GB/day
  - Images: ~500KB per restaurant = 250GB
  - Total: ~10TB/year

---

## 2. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           CLIENT LAYER                                  │
├─────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐│
│  │   Customer   │  │  Restaurant  │  │   Delivery   │  │    Admin    ││
│  │   Web/App    │  │    Portal    │  │  Partner App │  │   Portal    ││
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘│
└─────────┼──────────────────┼──────────────────┼──────────────────┼──────┘
          │                  │                  │                  │
          └──────────────────┴──────────────────┴──────────────────┘
                                     │
                          ┌──────────▼──────────┐
                          │   CDN / Edge Cache  │
                          │  (Static Assets)    │
                          └──────────┬──────────┘
                                     │
          ┌──────────────────────────┴──────────────────────────┐
          │                API Gateway / Load Balancer          │
          │         (Rate Limiting, Authentication)             │
          └──────────┬──────────────────────────────┬───────────┘
                     │                              │
    ┌────────────────┴────────────┐    ┌───────────▼────────────┐
    │   REST API Services         │    │  WebSocket Server      │
    │                             │    │  (Real-time Tracking)  │
    └────────────┬────────────────┘    └───────────┬────────────┘
                 │                                  │
┌────────────────┴──────────────────────────────────┴─────────────────┐
│                     MICROSERVICES LAYER                              │
├──────────────────────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────┐ │
│ │   User      │ │ Restaurant  │ │   Search    │ │    Cart        │ │
│ │  Service    │ │  Service    │ │  Service    │ │   Service      │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └────────────────┘ │
│                                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────┐ │
│ │   Order     │ │  Payment    │ │  Tracking   │ │   Delivery     │ │
│ │  Service    │ │  Service    │ │  Service    │ │   Service      │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └────────────────┘ │
│                                                                      │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌────────────────┐ │
│ │Notification │ │   Rating    │ │   Offers    │ │   Analytics    │ │
│ │  Service    │ │  Service    │ │  Service    │ │   Service      │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ └────────────────┘ │
└──────────────────────────────┬───────────────────────────────────────┘
                               │
            ┌──────────────────┴───────────────────┐
            │       Message Queue (Kafka)          │
            │   (Order Events, Tracking Updates)   │
            └──────────────────┬───────────────────┘
                               │
┌──────────────────────────────┴───────────────────────────────────────┐
│                        DATA LAYER                                    │
├──────────────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │
│ │ PostgreSQL │ │  MongoDB   │ │   Redis    │ │   Elasticsearch  │  │
│ │  (Orders,  │ │(Restaurant │ │  (Cache,   │ │  (Restaurant &   │  │
│ │  Payments) │ │  Menus)    │ │  Sessions) │ │   Dish Search)   │  │
│ └────────────┘ └────────────┘ └────────────┘ └──────────────────┘  │
│                                                                      │
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────────────┐  │
│ │  Cassandra │ │    S3      │ │   Redis    │ │   TimeSeries DB  │  │
│ │ (Tracking  │ │ (Images,   │ │  Streams   │ │  (Analytics,     │  │
│ │  Location) │ │  Receipts) │ │ (Real-time)│ │   Metrics)       │  │
│ └────────────┘ └────────────┘ └────────────┘ └──────────────────┘  │
└──────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
├──────────────────────────────────────────────────────────────────────┤
│  Payment Gateways  │  Maps API  │  SMS/Email  │  Push Notifications │
│  (Razorpay, Stripe)│  (Google)  │   (Twilio)  │   (FCM, APNS)      │
└──────────────────────────────────────────────────────────────────────┘
```

### Architecture Principles
- **Microservices**: Independent, scalable services
- **Event-Driven**: Kafka for asynchronous communication
- **API Gateway**: Single entry point, handles auth, rate limiting
- **Caching**: Multi-layer caching (CDN, Redis)
- **Database Per Service**: Polyglot persistence
- **Real-time Communication**: WebSocket for live tracking

---

## 3. Component Architecture

### 3.1 Frontend Components

```
┌─────────────────────────────────────────────────────────────┐
│                    CUSTOMER APP                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           Restaurant Discovery Module               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │ Restaurant   │  │   Filters    │  │  Search   │ │   │
│  │  │ List View    │  │  Component   │  │    Bar    │ │   │
│  │  │              │  │              │  │           │ │   │
│  │  │ - Cards      │  │ - Cuisine    │  │ - Autocmp │ │   │
│  │  │ - Ratings    │  │ - Veg/NonVeg │  │ - History │ │   │
│  │  │ - Distance   │  │ - Cost       │  │           │ │   │
│  │  │ - Delivery   │  │ - Rating     │  │           │ │   │
│  │  │   Time       │  │ - Offers     │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Menu Browsing Module                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │  Menu List   │  │Item Details  │  │ Category  │ │   │
│  │  │              │  │   Modal      │  │   Tabs    │ │   │
│  │  │ - Categories │  │              │  │           │ │   │
│  │  │ - Item Cards │  │ - Image      │  │ - Starters│ │   │
│  │  │ - Bestseller │  │ - Customize  │  │ - Mains   │ │   │
│  │  │ - Veg Badge  │  │ - Add-ons    │  │ - Desserts│ │   │
│  │  │ - Add Button │  │ - Quantity   │  │ - Drinks  │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              Cart Management Module                 │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │  Cart View   │  │   Offers     │  │  Bill     │ │   │
│  │  │              │  │  Component   │  │ Summary   │ │   │
│  │  │ - Item List  │  │              │  │           │ │   │
│  │  │ - Quantity   │  │ - Promo Code │  │ - Subtotal│ │   │
│  │  │   Controls   │  │ - Restaurant │  │ - Taxes   │ │   │
│  │  │ - Remove     │  │   Offers     │  │ - Delivery│ │   │
│  │  │ - Repeat     │  │ - Cashback   │  │ - Discount│ │   │
│  │  │   Last Order │  │              │  │ - Total   │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Checkout & Payment Module                │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │   Address    │  │   Payment    │  │  Order    │ │   │
│  │  │  Selection   │  │   Methods    │  │Confirmation│ │  │
│  │  │              │  │              │  │           │ │   │
│  │  │ - Saved      │  │ - UPI        │  │ - Summary │ │   │
│  │  │ - Current    │  │ - Cards      │  │ - ETA     │ │   │
│  │  │ - Add New    │  │ - Wallets    │  │ - Track   │ │   │
│  │  │ - Delivery   │  │ - COD        │  │   Button  │ │   │
│  │  │   Instructions│ │              │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │          Real-time Tracking Module                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │  Order       │  │   Map View   │  │  Status   │ │   │
│  │  │  Timeline    │  │              │  │  Updates  │ │   │
│  │  │              │  │ - Restaurant │  │           │ │   │
│  │  │ - Placed     │  │   Location   │  │ - WebSocket│   │
│  │  │ - Confirmed  │  │ - Delivery   │  │   Updates │ │   │
│  │  │ - Preparing  │  │   Partner    │  │ - Push    │ │   │
│  │  │ - Picked Up  │  │ - Route      │  │   Notif   │ │   │
│  │  │ - Out for    │  │ - Live       │  │ - ETA     │ │   │
│  │  │   Delivery   │  │   Tracking   │  │   Updates │ │   │
│  │  │ - Delivered  │  │              │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │            Rating & Review Module                   │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐ │   │
│  │  │   Rating     │  │   Review     │  │  Photos   │ │   │
│  │  │  Component   │  │   Form       │  │  Upload   │ │   │
│  │  │              │  │              │  │           │ │   │
│  │  │ - Food (5★)  │  │ - Text Input │  │ - Camera  │ │   │
│  │  │ - Delivery   │  │ - Dish Tags  │  │ - Gallery │ │   │
│  │  │   (5★)       │  │ - Submit     │  │           │ │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘ │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Restaurant Partner Dashboard

```
┌─────────────────────────────────────────────────────────┐
│              RESTAURANT DASHBOARD                       │
├─────────────────────────────────────────────────────────┤
│  - Menu Management (Add/Edit items, pricing)           │
│  - Order Management (Accept/Reject, prepare time)       │
│  - Inventory Management (Mark items unavailable)        │
│  - Analytics (Orders, revenue, ratings)                 │
│  - Offers Management (Create discounts, combos)         │
└─────────────────────────────────────────────────────────┘
```

### 3.3 Delivery Partner App

```
┌─────────────────────────────────────────────────────────┐
│            DELIVERY PARTNER APP                         │
├─────────────────────────────────────────────────────────┤
│  - Order Notifications (New order alerts)               │
│  - Navigation (Route to restaurant & customer)          │
│  - Status Updates (Picked up, delivered)                │
│  - Earnings Tracker (Daily earnings, incentives)        │
│  - Location Sharing (Real-time GPS updates)             │
└─────────────────────────────────────────────────────────┘
```

---

## 4. Data Flow

### 4.1 Restaurant Discovery Flow

```
┌─────────┐                                          ┌──────────────┐
│Customer │                                          │ Search       │
│  App    │                                          │ Service      │
└────┬────┘                                          └──────┬───────┘
     │                                                      │
     │ 1. GET /restaurants?lat=X&lng=Y&cuisine=Italian     │
     │────────────────────────────────────────────────────>│
     │                                                      │
     │                                              2. Check Redis Cache
     │                                                      │ (Key: location:cuisine)
     │                                                      │
     │                                              3. Cache Miss?
     │                                                      │
     │                                              ┌───────▼────────┐
     │                                              │ Elasticsearch  │
     │                                              │                │
     │                                              │ - Geo Query    │
     │                                              │ - Filters      │
     │                                              │ - Ranking      │
     │                                              └───────┬────────┘
     │                                                      │
     │                                              4. Store in Redis
     │                                                 (TTL: 5 min)
     │                                                      │
     │ 5. Response: [Restaurant List with metadata]        │
     │<────────────────────────────────────────────────────│
     │    - id, name, rating, cuisines                     │
     │    - delivery_time, cost_for_two                    │
     │    - offers, distance                               │
     │                                                      │
```

### 4.2 Menu Browsing Flow

```
┌─────────┐                                          ┌──────────────┐
│Customer │                                          │ Restaurant   │
│  App    │                                          │ Service      │
└────┬────┘                                          └──────┬───────┘
     │                                                      │
     │ 1. GET /restaurants/{id}/menu                        │
     │────────────────────────────────────────────────────>│
     │                                                      │
     │                                              2. Check Redis
     │                                                 (menu:rest_id)
     │                                                      │
     │                                              3. Cache Hit?
     │                                                      │
     │                                              ┌───────▼────────┐
     │                                              │   MongoDB      │
     │                                              │                │
     │                                              │ - Restaurant   │
     │                                              │   Collection   │
     │                                              │ - Menu Items   │
     │                                              │ - Categories   │
     │                                              └───────┬────────┘
     │                                                      │
     │ 4. Response: Menu with categories                    │
     │<────────────────────────────────────────────────────│
     │    - categories: [{name, items[]}]                  │
     │    - items: {id, name, price, image, veg}           │
     │                                                      │
```

### 4.3 Order Placement Flow (Critical Path)

```
┌──────┐    ┌────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌──────────┐
│Client│    │  Cart  │    │  Order  │    │ Payment │    │   Kafka  │    │Restaurant│
│      │    │Service │    │ Service │    │ Service │    │          │    │  Service │
└──┬───┘    └───┬────┘    └────┬────┘    └────┬────┘    └────┬─────┘    └────┬─────┘
   │            │              │              │              │               │
   │ 1. POST /checkout         │              │              │               │
   │   {cart_id, address_id,   │              │              │               │
   │    payment_method}         │              │              │               │
   │───────────>│              │              │              │               │
   │            │              │              │              │               │
   │            │ 2. Validate Cart             │              │               │
   │            │   (items, pricing,           │              │               │
   │            │    availability)             │              │               │
   │            │──────────────>│              │              │               │
   │            │              │              │              │               │
   │            │              │ 3. Create Order             │               │
   │            │              │   (Status: PENDING)         │               │
   │            │              │              │              │               │
   │            │              │ 4. Initiate Payment         │               │
   │            │              │──────────────>│              │               │
   │            │              │              │              │               │
   │            │              │              │ 5. Process Payment            │
   │            │              │              │   (Razorpay/Stripe)           │
   │            │              │              │              │               │
   │            │              │ 6. Payment Success          │               │
   │            │              │<──────────────│              │               │
   │            │              │              │              │               │
   │            │              │ 7. Update Order Status      │               │
   │            │              │   (CONFIRMED)               │               │
   │            │              │              │              │               │
   │            │              │ 8. Publish Event            │               │
   │            │              │──────────────────────────────>              │
   │            │              │   Topic: order.placed       │               │
   │            │              │   {order_id, restaurant_id, │               │
   │            │              │    items, customer_address} │               │
   │            │              │              │              │               │
   │            │              │              │              │ 9. Consume Event
   │            │              │              │              │──────────────>│
   │            │              │              │              │               │
   │            │              │              │              │ 10. Notify Restaurant
   │            │              │              │              │    (WebSocket/Push)
   │            │              │              │              │               │
   │ 11. Response: Order Created               │              │               │
   │<───────────│              │              │              │               │
   │   {order_id, status,      │              │              │               │
   │    estimated_time}        │              │              │               │
   │            │              │              │              │               │
   │            │ 12. Clear Cart               │              │               │
   │            │<──────────────│              │              │               │
   │            │              │              │              │               │
```

### 4.4 Real-time Order Tracking Flow (Key Differentiator)

```
┌──────┐    ┌──────────┐    ┌─────────┐    ┌─────────┐    ┌──────────┐    ┌────────┐
│Client│    │WebSocket │    │ Tracking│    │ Delivery│    │   Kafka  │    │ Redis  │
│      │    │  Server  │    │ Service │    │ Service │    │          │    │ Streams│
└──┬───┘    └────┬─────┘    └────┬────┘    └────┬────┘    └────┬─────┘    └───┬────┘
   │             │               │              │              │              │
   │ 1. Connect WebSocket        │              │              │              │
   │   /ws/track?order_id=123    │              │              │              │
   │────────────>│               │              │              │              │
   │             │               │              │              │              │
   │             │ 2. Subscribe to order updates│              │              │
   │             │──────────────>│              │              │              │
   │             │               │              │              │              │
   │             │               │ 3. Listen Redis Streams    │              │
   │             │               │──────────────────────────────────────────>│
   │             │               │   Stream: tracking:order:123              │
   │             │               │              │              │              │
   │             │               │              │ 4. Delivery Partner Location Update
   │             │               │              │   POST /location           │
   │             │               │              │   {lat, lng, order_id}     │
   │             │               │              │              │              │
   │             │               │              │ 5. Publish Location        │
   │             │               │<─────────────────────────────────────────│
   │             │               │              │              │   XADD tracking:123
   │             │               │              │              │   {lat, lng, ts}
   │             │               │              │              │              │
   │             │ 6. Push Update│              │              │              │
   │             │   (via WebSocket)            │              │              │
   │<────────────│               │              │              │              │
   │   {type: "location",        │              │              │              │
   │    lat, lng, eta}           │              │              │              │
   │             │               │              │              │              │
   │             │               │              │ 7. Status Change           │
   │             │               │              │   (PICKED_UP -> OUT_FOR_DELIVERY)
   │             │               │              │              │              │
   │             │               │              │ 8. Publish Event           │
   │             │               │              │──────────────>              │
   │             │               │              │   order.status.changed     │
   │             │               │              │              │              │
   │             │               │ 9. Consume Event            │              │
   │             │               │<──────────────              │              │
   │             │               │              │              │              │
   │             │ 10. Push Status Update       │              │              │
   │<────────────│               │              │              │              │
   │   {type: "status",          │              │              │              │
   │    status: "OUT_FOR_DELIVERY",             │              │              │
   │    eta: "15 min"}           │              │              │              │
   │             │               │              │              │              │
```

### 4.5 Complete Order Lifecycle

```
┌──────────────────────────────────────────────────────────────────────┐
│                      ORDER LIFECYCLE STATES                          │
└──────────────────────────────────────────────────────────────────────┘

     PENDING ──────> CONFIRMED ──────> PREPARING ──────> READY
        │                                                   │
        │                                                   ▼
        │                                              PICKED_UP
        │                                                   │
        │                                                   ▼
        │                                           OUT_FOR_DELIVERY
        │                                                   │
        │                                                   ▼
        └────────> CANCELLED                          DELIVERED
                                                           │
                                                           ▼
                                                      COMPLETED
                                                      (After Rating)

State Transitions:
──────────────────────────────────────────────────────────────────────
PENDING         → Order created, payment initiated
CONFIRMED       → Payment successful, restaurant notified
PREPARING       → Restaurant accepted, cooking started
READY           → Food ready for pickup
PICKED_UP       → Delivery partner collected order
OUT_FOR_DELIVERY→ En route to customer
DELIVERED       → Handed over to customer
COMPLETED       → Customer rated (final state)
CANCELLED       → Order cancelled (before PICKED_UP)
```

---

## 5. API Design & Communication Protocols

### 5.1 REST API Endpoints

#### User Service
```
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/users/profile
PUT    /api/v1/users/profile
POST   /api/v1/users/addresses
GET    /api/v1/users/addresses
PUT    /api/v1/users/addresses/{id}
DELETE /api/v1/users/addresses/{id}
```

#### Restaurant Service
```
GET    /api/v1/restaurants
       ?lat=12.34&lng=56.78
       &cuisine=italian
       &veg_only=true
       &sort=rating|delivery_time|cost
       &page=1&limit=20

GET    /api/v1/restaurants/{id}
GET    /api/v1/restaurants/{id}/menu
GET    /api/v1/restaurants/{id}/reviews?page=1&limit=10
POST   /api/v1/restaurants (Admin/Restaurant Owner)
PUT    /api/v1/restaurants/{id}
```

#### Search Service
```
GET    /api/v1/search
       ?q=biryani
       &lat=12.34&lng=56.78
       &type=restaurant|dish

GET    /api/v1/search/suggestions?q=bir
```

#### Cart Service
```
POST   /api/v1/cart/items
       Body: {restaurant_id, item_id, quantity, customizations}

GET    /api/v1/cart
PUT    /api/v1/cart/items/{item_id}
DELETE /api/v1/cart/items/{item_id}
POST   /api/v1/cart/apply-offer
       Body: {promo_code}
DELETE /api/v1/cart/clear
```

#### Order Service
```
POST   /api/v1/orders
       Body: {
         cart_id,
         address_id,
         payment_method,
         delivery_instructions
       }
       Response: {
         order_id,
         status,
         estimated_delivery_time,
         total_amount
       }

GET    /api/v1/orders/{id}
GET    /api/v1/orders?status=active|completed&page=1
PUT    /api/v1/orders/{id}/cancel
GET    /api/v1/orders/{id}/track
POST   /api/v1/orders/{id}/reorder
```

#### Payment Service
```
POST   /api/v1/payments/initiate
       Body: {order_id, amount, method}
       Response: {payment_id, gateway_url}

POST   /api/v1/payments/callback (Webhook from payment gateway)
GET    /api/v1/payments/{id}/status
POST   /api/v1/payments/{id}/refund
```

#### Tracking Service
```
GET    /api/v1/tracking/{order_id}
       Response: {
         order_status,
         delivery_partner: {name, phone, location},
         eta,
         timeline: [...]
       }
```

#### Rating Service
```
POST   /api/v1/ratings
       Body: {
         order_id,
         restaurant_rating,
         delivery_rating,
         food_quality,
         review_text,
         photos[]
       }

GET    /api/v1/ratings/restaurant/{id}?page=1
```

#### Offers Service
```
GET    /api/v1/offers
       ?lat=12.34&lng=56.78
       &user_id=123
       Response: [
         {code, description, discount, min_order, max_discount, valid_until}
       ]

POST   /api/v1/offers/validate
       Body: {code, cart_value, restaurant_id}
```

#### Delivery Service (For Delivery Partners)
```
POST   /api/v1/delivery/available
       Body: {lat, lng, available: true}

GET    /api/v1/delivery/orders/available
POST   /api/v1/delivery/orders/{id}/accept
PUT    /api/v1/delivery/orders/{id}/status
       Body: {status: "PICKED_UP" | "DELIVERED"}

POST   /api/v1/delivery/location
       Body: {order_id, lat, lng}
```

### 5.2 WebSocket Protocol (Real-time Tracking)

```javascript
// Client Connection
ws://tracking.zomato.com/ws/track?order_id=12345&token=<auth_token>

// Message Types from Server to Client

// 1. Order Status Update
{
  "type": "status_update",
  "order_id": "12345",
  "status": "PREPARING",
  "timestamp": "2025-12-22T10:30:00Z",
  "message": "Your order is being prepared",
  "eta_minutes": 25
}

// 2. Delivery Partner Assigned
{
  "type": "partner_assigned",
  "order_id": "12345",
  "partner": {
    "name": "Rahul Kumar",
    "phone": "+91XXXXXXXXXX",
    "vehicle_number": "KA01AB1234",
    "rating": 4.8
  }
}

// 3. Location Update
{
  "type": "location_update",
  "order_id": "12345",
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "eta_minutes": 12,
  "distance_km": 2.3,
  "timestamp": "2025-12-22T10:35:00Z"
}

// 4. Delivery Complete
{
  "type": "delivered",
  "order_id": "12345",
  "delivered_at": "2025-12-22T10:45:00Z",
  "otp_verified": true
}

// Message from Client to Server (Keep-alive)
{
  "type": "ping"
}

// Server Response
{
  "type": "pong"
}
```

### 5.3 Message Queue Topics (Kafka)

```
Topics:
──────────────────────────────────────────────────────────
order.placed          → New order created
  Consumers: Restaurant Service, Notification Service,
             Delivery Service, Analytics Service

order.confirmed       → Restaurant accepted order
  Consumers: Tracking Service, Notification Service

order.status.changed  → Any status change
  Consumers: Tracking Service, Notification Service,
             WebSocket Server

delivery.location     → Real-time location updates
  Consumers: Tracking Service, WebSocket Server

payment.completed     → Payment successful
  Consumers: Order Service, Notification Service

payment.failed        → Payment failed
  Consumers: Order Service, Notification Service

rating.submitted      → Customer rated order
  Consumers: Restaurant Service, Analytics Service

offer.applied         → Promo code used
  Consumers: Offers Service, Analytics Service
```

---

## 6. Database Design

### 6.1 PostgreSQL (Transactional Data)

```sql
-- Users Table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(15) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255),
    password_hash VARCHAR(255),
    role VARCHAR(20) CHECK (role IN ('CUSTOMER', 'RESTAURANT', 'DELIVERY', 'ADMIN')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);

-- User Addresses
CREATE TABLE addresses (
    address_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    address_type VARCHAR(20) CHECK (address_type IN ('HOME', 'WORK', 'OTHER')),
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    landmark VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- Orders Table
CREATE TABLE orders (
    order_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    restaurant_id UUID NOT NULL,
    delivery_address_id UUID REFERENCES addresses(address_id),
    order_status VARCHAR(30) CHECK (order_status IN (
        'PENDING', 'CONFIRMED', 'PREPARING', 'READY',
        'PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED',
        'CANCELLED', 'COMPLETED'
    )),
    payment_method VARCHAR(20),
    payment_status VARCHAR(20) CHECK (payment_status IN ('PENDING', 'SUCCESS', 'FAILED', 'REFUNDED')),
    subtotal DECIMAL(10, 2),
    delivery_fee DECIMAL(10, 2),
    taxes DECIMAL(10, 2),
    discount DECIMAL(10, 2),
    total_amount DECIMAL(10, 2),
    promo_code VARCHAR(50),
    delivery_instructions TEXT,
    delivery_partner_id UUID,
    estimated_delivery_time TIMESTAMP,
    actual_delivery_time TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_restaurant ON orders(restaurant_id);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);

-- Order Items
CREATE TABLE order_items (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id) ON DELETE CASCADE,
    dish_id UUID NOT NULL,
    dish_name VARCHAR(255),
    quantity INT NOT NULL,
    price DECIMAL(10, 2),
    customizations JSONB,
    total DECIMAL(10, 2)
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- Payments Table
CREATE TABLE payments (
    payment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(order_id),
    amount DECIMAL(10, 2),
    payment_method VARCHAR(20),
    payment_status VARCHAR(20),
    gateway_transaction_id VARCHAR(255),
    gateway_response JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order ON payments(order_id);
CREATE INDEX idx_payments_status ON payments(payment_status);

-- Offers Table
CREATE TABLE offers (
    offer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('PERCENTAGE', 'FLAT')),
    discount_value DECIMAL(10, 2),
    min_order_value DECIMAL(10, 2),
    max_discount DECIMAL(10, 2),
    valid_from TIMESTAMP,
    valid_until TIMESTAMP,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    applicable_to VARCHAR(20) CHECK (applicable_to IN ('ALL', 'FIRST_ORDER', 'RESTAURANT')),
    restaurant_ids UUID[],
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_offers_code ON offers(code);
CREATE INDEX idx_offers_valid ON offers(valid_from, valid_until);
```

### 6.2 MongoDB (Restaurant & Menu Data)

```javascript
// Restaurants Collection
{
  "_id": ObjectId("..."),
  "restaurant_id": "uuid",
  "name": "Pizza Palace",
  "description": "Best pizzas in town",
  "owner_id": "uuid",
  "cuisines": ["Italian", "Fast Food"],
  "location": {
    "type": "Point",
    "coordinates": [77.5946, 12.9716] // [longitude, latitude]
  },
  "address": {
    "line1": "123 Main Street",
    "city": "Bangalore",
    "state": "Karnataka",
    "pincode": "560001"
  },
  "contact": {
    "phone": "+919876543210",
    "email": "contact@pizzapalace.com"
  },
  "operating_hours": {
    "monday": {"open": "10:00", "close": "23:00"},
    "tuesday": {"open": "10:00", "close": "23:00"},
    // ... other days
    "is_open_now": true
  },
  "ratings": {
    "average": 4.5,
    "count": 1234,
    "food": 4.6,
    "delivery": 4.4
  },
  "cost_for_two": 500,
  "delivery_time": 30, // minutes
  "min_order_value": 100,
  "is_veg": false,
  "is_active": true,
  "tags": ["pizza", "pasta", "italian"],
  "images": {
    "logo": "s3://bucket/logo.jpg",
    "cover": "s3://bucket/cover.jpg",
    "gallery": ["s3://bucket/1.jpg", "s3://bucket/2.jpg"]
  },
  "menu": [
    {
      "category_id": "cat_1",
      "category_name": "Pizzas",
      "items": [
        {
          "item_id": "item_uuid_1",
          "name": "Margherita Pizza",
          "description": "Classic cheese pizza with tomato sauce",
          "price": 299,
          "is_veg": true,
          "is_available": true,
          "is_bestseller": true,
          "image": "s3://bucket/margherita.jpg",
          "customizations": [
            {
              "name": "Size",
              "options": [
                {"label": "Small", "price": 0},
                {"label": "Medium", "price": 50},
                {"label": "Large", "price": 100}
              ],
              "required": true
            },
            {
              "name": "Add-ons",
              "options": [
                {"label": "Extra Cheese", "price": 30},
                {"label": "Olives", "price": 20}
              ],
              "required": false,
              "max_selections": 3
            }
          ],
          "nutritional_info": {
            "calories": 250,
            "protein": 12,
            "carbs": 30,
            "fat": 10
          }
        }
      ]
    }
  ],
  "created_at": ISODate("2025-01-15T10:00:00Z"),
  "updated_at": ISODate("2025-12-22T08:30:00Z")
}

// Indexes
db.restaurants.createIndex({ "location": "2dsphere" }) // Geospatial
db.restaurants.createIndex({ "cuisines": 1 })
db.restaurants.createIndex({ "ratings.average": -1 })
db.restaurants.createIndex({ "name": "text", "tags": "text" })

// Reviews Collection
{
  "_id": ObjectId("..."),
  "review_id": "uuid",
  "order_id": "uuid",
  "user_id": "uuid",
  "restaurant_id": "uuid",
  "ratings": {
    "food": 5,
    "delivery": 4,
    "overall": 4.5
  },
  "review_text": "Amazing pizza!",
  "dish_ratings": [
    {
      "dish_id": "item_uuid_1",
      "dish_name": "Margherita Pizza",
      "rating": 5
    }
  ],
  "photos": ["s3://bucket/review1.jpg"],
  "helpful_count": 12,
  "created_at": ISODate("2025-12-22T11:00:00Z")
}

db.reviews.createIndex({ "restaurant_id": 1, "created_at": -1 })
db.reviews.createIndex({ "user_id": 1 })
```

### 6.3 Elasticsearch (Search & Discovery)

```javascript
// Restaurant Index
{
  "settings": {
    "number_of_shards": 5,
    "number_of_replicas": 2,
    "analysis": {
      "analyzer": {
        "restaurant_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "asciifolding"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "restaurant_id": {"type": "keyword"},
      "name": {
        "type": "text",
        "analyzer": "restaurant_analyzer",
        "fields": {
          "keyword": {"type": "keyword"}
        }
      },
      "cuisines": {"type": "keyword"},
      "location": {"type": "geo_point"},
      "rating": {"type": "float"},
      "cost_for_two": {"type": "integer"},
      "delivery_time": {"type": "integer"},
      "is_veg": {"type": "boolean"},
      "is_active": {"type": "boolean"},
      "tags": {"type": "keyword"},
      "dishes": {
        "type": "nested",
        "properties": {
          "name": {"type": "text"},
          "is_veg": {"type": "boolean"},
          "price": {"type": "float"}
        }
      }
    }
  }
}

// Sample Document
{
  "restaurant_id": "rest_123",
  "name": "Pizza Palace",
  "cuisines": ["Italian", "Fast Food"],
  "location": {
    "lat": 12.9716,
    "lon": 77.5946
  },
  "rating": 4.5,
  "cost_for_two": 500,
  "delivery_time": 30,
  "is_veg": false,
  "is_active": true,
  "tags": ["pizza", "pasta"],
  "dishes": [
    {
      "name": "Margherita Pizza",
      "is_veg": true,
      "price": 299
    }
  ]
}

// Search Query Example
GET /restaurants/_search
{
  "query": {
    "bool": {
      "must": [
        {
          "multi_match": {
            "query": "pizza",
            "fields": ["name^3", "cuisines^2", "tags", "dishes.name"]
          }
        },
        {
          "geo_distance": {
            "distance": "5km",
            "location": {
              "lat": 12.9716,
              "lon": 77.5946
            }
          }
        }
      ],
      "filter": [
        {"term": {"is_active": true}},
        {"term": {"is_veg": true}}
      ]
    }
  },
  "sort": [
    {"_geo_distance": {
      "location": {"lat": 12.9716, "lon": 77.5946},
      "order": "asc"
    }},
    {"rating": {"order": "desc"}}
  ]
}
```

### 6.4 Redis (Caching & Sessions)

```
Key Patterns:
──────────────────────────────────────────────────────────
# Session Management
session:{user_id}                 → User session data (TTL: 24h)
  {auth_token, user_id, role, created_at}

# Restaurant Cache
restaurant:list:{lat}:{lng}:{filters_hash}  → Restaurant list (TTL: 5min)
restaurant:details:{id}                     → Restaurant info (TTL: 10min)
restaurant:menu:{id}                        → Menu data (TTL: 15min)

# Cart Data (Critical for user experience)
cart:{user_id}                    → Cart items (TTL: 24h)
  {
    restaurant_id,
    items: [{item_id, quantity, price, customizations}],
    subtotal,
    updated_at
  }

# Offer Validation
offer:{code}                      → Offer details (TTL: 1h)
offer:usage:{code}:{user_id}      → User-specific usage (TTL: until expiry)

# Rate Limiting
ratelimit:api:{user_id}:{endpoint}  → API rate limit (TTL: 1min)
ratelimit:orders:{user_id}          → Order creation limit (TTL: 1h)

# Delivery Partner Availability
delivery:available:{geo_hash}       → Available partners in area (TTL: 30s)
  SET of delivery_partner_ids

delivery:location:{partner_id}      → Current location (TTL: 5min)
  {lat, lng, updated_at}

# Active Orders (Quick lookup)
active_orders:{user_id}             → User's active order IDs (TTL: 6h)
active_orders:{restaurant_id}       → Restaurant's active orders (TTL: 6h)

# Leaderboards
leaderboard:restaurants:rating      → ZSET sorted by rating
leaderboard:restaurants:popular     → ZSET sorted by order count

# Real-time Tracking
tracking:{order_id}                 → Order tracking state (TTL: 6h)
  {
    status,
    delivery_partner_id,
    current_location: {lat, lng},
    eta_minutes,
    last_updated
  }
```

### 6.5 Cassandra (Location & Tracking Data)

```sql
-- Delivery Partner Location History
CREATE TABLE delivery_partner_locations (
    partner_id UUID,
    timestamp TIMESTAMP,
    latitude DECIMAL,
    longitude DECIMAL,
    accuracy FLOAT,
    speed FLOAT,
    PRIMARY KEY (partner_id, timestamp)
) WITH CLUSTERING ORDER BY (timestamp DESC);

-- Order Tracking Events
CREATE TABLE order_tracking_events (
    order_id UUID,
    event_time TIMESTAMP,
    event_type TEXT, -- 'STATUS_CHANGE', 'LOCATION_UPDATE', 'ETA_UPDATE'
    status TEXT,
    location_lat DECIMAL,
    location_lng DECIMAL,
    eta_minutes INT,
    metadata MAP<TEXT, TEXT>,
    PRIMARY KEY (order_id, event_time)
) WITH CLUSTERING ORDER BY (event_time DESC);

-- Analytics: Order Events (Time-series)
CREATE TABLE order_analytics (
    bucket_date DATE,
    event_time TIMESTAMP,
    order_id UUID,
    restaurant_id UUID,
    user_id UUID,
    event_type TEXT,
    amount DECIMAL,
    PRIMARY KEY (bucket_date, event_time)
) WITH CLUSTERING ORDER BY (event_time DESC);
```

---

## 7. Caching Strategy

### 7.1 Multi-Layer Caching

```
┌─────────────────────────────────────────────────────────┐
│              CACHING LAYERS                             │
└─────────────────────────────────────────────────────────┘

Layer 1: CDN (CloudFront/Akamai)
──────────────────────────────────────────────────────────
Content: Static assets, restaurant images, menu images
TTL: 7 days
Cache-Control: public, max-age=604800, immutable
Invalidation: On restaurant update

Layer 2: Redis (Application Cache)
──────────────────────────────────────────────────────────
Content:
  - Restaurant listings (TTL: 5 min)
  - Restaurant details (TTL: 10 min)
  - Menu data (TTL: 15 min)
  - Search results (TTL: 3 min)
  - User cart (TTL: 24 hours)
  - Active offers (TTL: 1 hour)

Strategy: Cache-Aside (Lazy Loading)
Eviction: LRU (Least Recently Used)

Layer 3: Browser Cache
──────────────────────────────────────────────────────────
Content: API responses with Cache-Control headers
TTL: 1-5 minutes for dynamic content
Service Worker: Cache restaurant images, menu

Layer 4: Database Query Cache
──────────────────────────────────────────────────────────
PostgreSQL: Query result cache (shared_buffers)
MongoDB: WiredTiger cache
Elasticsearch: Node query cache, field data cache
```

### 7.2 Cache Invalidation Strategies

```javascript
// Pattern 1: Write-Through Cache (for critical data)
async function updateRestaurantMenu(restaurantId, menuData) {
  // 1. Update database
  await db.restaurants.updateOne(
    { restaurant_id: restaurantId },
    { $set: { menu: menuData, updated_at: new Date() } }
  );

  // 2. Update cache
  await redis.setex(
    `restaurant:menu:${restaurantId}`,
    900, // 15 minutes
    JSON.stringify(menuData)
  );

  // 3. Invalidate dependent caches
  await redis.del(`restaurant:details:${restaurantId}`);

  // 4. Publish invalidation event
  await kafka.publish('cache.invalidate', {
    type: 'restaurant_menu',
    restaurant_id: restaurantId
  });
}

// Pattern 2: Cache-Aside (for read-heavy data)
async function getRestaurantList(lat, lng, filters) {
  const cacheKey = `restaurant:list:${lat}:${lng}:${hashFilters(filters)}`;

  // Try cache first
  let restaurants = await redis.get(cacheKey);

  if (restaurants) {
    return JSON.parse(restaurants);
  }

  // Cache miss - fetch from Elasticsearch
  restaurants = await elasticsearch.search({
    index: 'restaurants',
    body: buildSearchQuery(lat, lng, filters)
  });

  // Store in cache
  await redis.setex(cacheKey, 300, JSON.stringify(restaurants)); // 5 min

  return restaurants;
}

// Pattern 3: Time-based Invalidation (for cart)
async function addToCart(userId, item) {
  const cart = await redis.get(`cart:${userId}`) || { items: [] };
  cart.items.push(item);

  // Reset TTL on every update
  await redis.setex(`cart:${userId}`, 86400, JSON.stringify(cart)); // 24h
}

// Pattern 4: Event-based Invalidation
kafka.subscribe('order.placed', async (event) => {
  const { restaurant_id } = event;

  // Invalidate restaurant's active order cache
  await redis.del(`active_orders:${restaurant_id}`);

  // Increment restaurant popularity (for ranking)
  await redis.zincrby('leaderboard:restaurants:popular', 1, restaurant_id);
});
```

### 7.3 Cache Warming

```javascript
// Warm cache for popular restaurants during low traffic
async function warmPopularRestaurants() {
  const popularRestaurants = await redis.zrange(
    'leaderboard:restaurants:popular',
    0,
    99, // Top 100
    'REV'
  );

  for (const restaurantId of popularRestaurants) {
    // Pre-load restaurant details
    const details = await db.restaurants.findOne({ restaurant_id: restaurantId });
    await redis.setex(
      `restaurant:details:${restaurantId}`,
      600,
      JSON.stringify(details)
    );

    // Pre-load menu
    await redis.setex(
      `restaurant:menu:${restaurantId}`,
      900,
      JSON.stringify(details.menu)
    );
  }
}

// Schedule every 5 minutes during peak hours
cron.schedule('*/5 17-22 * * *', warmPopularRestaurants);
```

---

## 8. State Management

### 8.1 Frontend State Architecture (React)

```javascript
// Global State Structure (Redux/Zustand)
{
  auth: {
    user: {
      userId: 'uuid',
      name: 'John Doe',
      phone: '+919876543210',
      email: 'john@example.com',
      token: 'jwt_token'
    },
    isAuthenticated: true,
    addresses: [
      {
        id: 'addr_1',
        type: 'HOME',
        address: '123 Main St',
        lat: 12.9716,
        lng: 77.5946,
        isDefault: true
      }
    ]
  },

  restaurant: {
    list: [],
    filters: {
      cuisine: ['Italian'],
      vegOnly: false,
      sortBy: 'rating',
      priceRange: [0, 1000]
    },
    selectedRestaurant: {
      id: 'rest_123',
      name: 'Pizza Palace',
      menu: [...],
      isLoading: false,
      error: null
    }
  },

  cart: {
    restaurantId: 'rest_123',
    items: [
      {
        itemId: 'item_1',
        name: 'Margherita Pizza',
        quantity: 2,
        price: 299,
        customizations: {
          size: 'Medium',
          addons: ['Extra Cheese']
        },
        total: 658 // (299 + 30) * 2
      }
    ],
    subtotal: 658,
    appliedOffer: {
      code: 'FIRST50',
      discount: 100
    },
    deliveryFee: 40,
    taxes: 60,
    total: 658,
    itemCount: 2
  },

  order: {
    activeOrder: {
      orderId: 'order_123',
      status: 'OUT_FOR_DELIVERY',
      estimatedTime: '2025-12-22T11:30:00Z',
      items: [...],
      total: 658,
      deliveryPartner: {
        name: 'Rahul Kumar',
        phone: '+919876543210',
        rating: 4.8,
        currentLocation: {
          lat: 12.9716,
          lng: 77.5946
        }
      },
      timeline: [
        {status: 'PLACED', time: '10:00'},
        {status: 'CONFIRMED', time: '10:02'},
        {status: 'PREPARING', time: '10:05'},
        {status: 'PICKED_UP', time: '10:25'},
        {status: 'OUT_FOR_DELIVERY', time: '10:30'}
      ]
    },
    orderHistory: []
  },

  tracking: {
    isConnected: true, // WebSocket connection status
    lastUpdate: '2025-12-22T10:35:00Z',
    eta: 15 // minutes
  },

  ui: {
    isCartOpen: false,
    isFilterModalOpen: false,
    activeTab: 'home',
    toasts: []
  }
}
```

### 8.2 State Management Patterns

```javascript
// Cart State Management (with persistence)
const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      restaurantId: null,

      // Add item to cart
      addItem: (restaurant, item) => {
        const { restaurantId, items } = get();

        // Clear cart if different restaurant
        if (restaurantId && restaurantId !== restaurant.id) {
          const confirmSwitch = window.confirm(
            'Your cart contains items from another restaurant. Clear it?'
          );
          if (!confirmSwitch) return;

          set({ items: [], restaurantId: restaurant.id });
        }

        // Check if item already exists
        const existingIndex = items.findIndex(i =>
          i.itemId === item.id &&
          JSON.stringify(i.customizations) === JSON.stringify(item.customizations)
        );

        if (existingIndex >= 0) {
          // Update quantity
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          // Add new item
          set({
            items: [...items, {
              itemId: item.id,
              name: item.name,
              quantity: 1,
              price: item.price,
              customizations: item.customizations,
              total: calculateItemTotal(item)
            }],
            restaurantId: restaurant.id
          });
        }

        // Sync to backend
        syncCartToBackend(get());
      },

      // Remove item
      removeItem: (itemId, customizations) => {
        const items = get().items.filter(item =>
          !(item.itemId === itemId &&
            JSON.stringify(item.customizations) === JSON.stringify(customizations))
        );
        set({ items });
        syncCartToBackend(get());
      },

      // Update quantity
      updateQuantity: (itemId, customizations, quantity) => {
        const items = get().items.map(item =>
          item.itemId === itemId &&
          JSON.stringify(item.customizations) === JSON.stringify(customizations)
            ? { ...item, quantity, total: item.price * quantity }
            : item
        );
        set({ items });
        syncCartToBackend(get());
      },

      // Clear cart
      clearCart: () => set({ items: [], restaurantId: null }),

      // Computed values
      getSubtotal: () => get().items.reduce((sum, item) => sum + item.total, 0),
      getItemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0)
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage)
    }
  )
);

// Order Tracking State (with WebSocket)
const useTrackingStore = create((set, get) => ({
  connection: null,
  isConnected: false,
  orderStatus: null,
  deliveryPartner: null,
  eta: null,

  connect: (orderId) => {
    const ws = new WebSocket(
      `${WS_URL}/track?order_id=${orderId}&token=${getAuthToken()}`
    );

    ws.onopen = () => {
      set({ isConnected: true, connection: ws });
      console.log('Tracking connected');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'status_update':
          set({
            orderStatus: data.status,
            eta: data.eta_minutes
          });
          break;

        case 'location_update':
          set({
            deliveryPartner: {
              ...get().deliveryPartner,
              currentLocation: data.location
            },
            eta: data.eta_minutes
          });
          break;

        case 'partner_assigned':
          set({ deliveryPartner: data.partner });
          break;

        case 'delivered':
          set({ orderStatus: 'DELIVERED' });
          ws.close();
          break;
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      set({ isConnected: false });
    };

    ws.onclose = () => {
      set({ isConnected: false, connection: null });
      console.log('Tracking disconnected');
    };

    set({ connection: ws });
  },

  disconnect: () => {
    const { connection } = get();
    if (connection) {
      connection.close();
      set({ connection: null, isConnected: false });
    }
  }
}));
```

### 8.3 Backend State Management

```javascript
// Order State Machine
const ORDER_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['PICKED_UP'],
  PICKED_UP: ['OUT_FOR_DELIVERY'],
  OUT_FOR_DELIVERY: ['DELIVERED'],
  DELIVERED: ['COMPLETED'],
  CANCELLED: [],
  COMPLETED: []
};

class OrderStateMachine {
  constructor(orderId) {
    this.orderId = orderId;
  }

  async transition(newStatus) {
    const order = await db.orders.findOne({ order_id: this.orderId });
    const currentStatus = order.order_status;

    // Validate transition
    if (!ORDER_TRANSITIONS[currentStatus].includes(newStatus)) {
      throw new Error(
        `Invalid transition from ${currentStatus} to ${newStatus}`
      );
    }

    // Begin transaction
    const session = await db.startSession();
    session.startTransaction();

    try {
      // Update order status
      await db.orders.updateOne(
        { order_id: this.orderId },
        {
          $set: {
            order_status: newStatus,
            updated_at: new Date()
          }
        },
        { session }
      );

      // Execute side effects based on new status
      await this.executeSideEffects(currentStatus, newStatus, session);

      await session.commitTransaction();

      // Publish event
      await kafka.publish('order.status.changed', {
        order_id: this.orderId,
        old_status: currentStatus,
        new_status: newStatus,
        timestamp: new Date()
      });

      return { success: true, status: newStatus };

    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async executeSideEffects(oldStatus, newStatus, session) {
    switch (newStatus) {
      case 'CONFIRMED':
        await this.assignDeliveryPartner(session);
        await this.notifyRestaurant();
        break;

      case 'PICKED_UP':
        await this.startTracking();
        await this.notifyCustomer('Order picked up');
        break;

      case 'DELIVERED':
        await this.stopTracking();
        await this.requestRating();
        break;

      case 'CANCELLED':
        await this.initiateRefund(session);
        await this.notifyAllParties();
        break;
    }
  }
}
```

---

## 9. Performance Optimization

### 9.1 Frontend Optimizations

```javascript
// 1. Code Splitting
// Lazy load components
const RestaurantDetails = lazy(() => import('./RestaurantDetails'));
const OrderTracking = lazy(() => import('./OrderTracking'));
const Checkout = lazy(() => import('./Checkout'));

// 2. Image Optimization
// Use responsive images with lazy loading
<img
  src={restaurant.thumbnail}
  srcSet={`
    ${restaurant.thumbnail_small} 480w,
    ${restaurant.thumbnail_medium} 800w,
    ${restaurant.thumbnail_large} 1200w
  `}
  sizes="(max-width: 600px) 480px, (max-width: 900px) 800px, 1200px"
  alt={restaurant.name}
  loading="lazy"
/>

// 3. Virtual Scrolling for Long Lists
import { FixedSizeList } from 'react-window';

function RestaurantList({ restaurants }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      <RestaurantCard restaurant={restaurants[index]} />
    </div>
  );

  return (
    <FixedSizeList
      height={600}
      itemCount={restaurants.length}
      itemSize={150}
      width="100%"
    >
      {Row}
    </FixedSizeList>
  );
}

// 4. Debounced Search
import { useDebouncedCallback } from 'use-debounce';

const SearchBar = () => {
  const [query, setQuery] = useState('');

  const debouncedSearch = useDebouncedCallback(
    async (value) => {
      const results = await api.search(value);
      setResults(results);
    },
    300 // 300ms delay
  );

  const handleChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    debouncedSearch(value);
  };

  return <input value={query} onChange={handleChange} />;
};

// 5. Memoization for Expensive Calculations
const CartSummary = ({ items }) => {
  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.total, 0),
    [items]
  );

  const taxes = useMemo(
    () => subtotal * 0.05,
    [subtotal]
  );

  return (
    <div>
      <p>Subtotal: {subtotal}</p>
      <p>Taxes: {taxes}</p>
    </div>
  );
};

// 6. Service Worker for Offline Support
// sw.js
const CACHE_NAME = 'zomato-v1';
const urlsToCache = [
  '/',
  '/static/css/main.css',
  '/static/js/bundle.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### 9.2 Backend Optimizations

```javascript
// 1. Database Query Optimization
// Before: N+1 query problem
async function getOrdersWithDetails(userId) {
  const orders = await db.orders.find({ user_id: userId });

  for (const order of orders) {
    // This creates N additional queries!
    order.items = await db.order_items.find({ order_id: order.order_id });
    order.restaurant = await db.restaurants.findOne({ id: order.restaurant_id });
  }

  return orders;
}

// After: Using JOIN / aggregation
async function getOrdersWithDetails(userId) {
  return await db.query(`
    SELECT
      o.*,
      json_agg(oi.*) as items,
      row_to_json(r.*) as restaurant
    FROM orders o
    LEFT JOIN order_items oi ON o.order_id = oi.order_id
    LEFT JOIN restaurants r ON o.restaurant_id = r.restaurant_id
    WHERE o.user_id = $1
    GROUP BY o.order_id, r.restaurant_id
  `, [userId]);
}

// 2. Connection Pooling
const pool = new Pool({
  host: 'localhost',
  database: 'zomato',
  max: 20, // Maximum pool size
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000
});

// 3. Batch Processing for Notifications
class NotificationBatcher {
  constructor() {
    this.queue = [];
    this.batchSize = 100;
    this.flushInterval = 5000; // 5 seconds

    setInterval(() => this.flush(), this.flushInterval);
  }

  async add(notification) {
    this.queue.push(notification);

    if (this.queue.length >= this.batchSize) {
      await this.flush();
    }
  }

  async flush() {
    if (this.queue.length === 0) return;

    const batch = this.queue.splice(0, this.batchSize);

    // Send batch to notification service
    await fcm.sendMulticast({
      tokens: batch.map(n => n.token),
      notification: {
        title: 'Order Update',
        body: 'Your order status has changed'
      }
    });
  }
}

// 4. Database Indexing Strategy
/*
PostgreSQL Indexes:
------------------
CREATE INDEX idx_orders_user_status ON orders(user_id, order_status);
CREATE INDEX idx_orders_restaurant_status ON orders(restaurant_id, order_status);
CREATE INDEX idx_orders_created_at_desc ON orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

MongoDB Indexes:
---------------
db.restaurants.createIndex({ "location": "2dsphere" });
db.restaurants.createIndex({ "cuisines": 1, "ratings.average": -1 });
db.restaurants.createIndex({ "is_active": 1, "delivery_time": 1 });
*/

// 5. API Response Compression
const compression = require('compression');
app.use(compression({
  level: 6, // Compression level (0-9)
  threshold: 1024, // Only compress responses > 1KB
  filter: (req, res) => {
    if (req.headers['x-no-compression']) {
      return false;
    }
    return compression.filter(req, res);
  }
}));

// 6. Rate Limiting
const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP'
});

const orderLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit order creation to 10 per hour
  message: 'Too many orders created'
});

app.use('/api/', apiLimiter);
app.use('/api/orders', orderLimiter);
```

### 9.3 Scalability Patterns

```
┌─────────────────────────────────────────────────────────┐
│           HORIZONTAL SCALING STRATEGY                   │
└─────────────────────────────────────────────────────────┘

Service Layer:
─────────────
- Stateless microservices
- Auto-scaling based on CPU/Memory (50-70% threshold)
- Minimum 3 instances per service for HA
- Container orchestration: Kubernetes

Load Distribution:
─────────────────
- Geographic load balancing (DNS-based)
- Application load balancer (ALB) with health checks
- Sticky sessions for WebSocket connections

Database Scaling:
────────────────
PostgreSQL:
  - Read replicas (3-5 per region)
  - Connection pooling (PgBouncer)
  - Vertical scaling for master (up to 64 cores)

MongoDB:
  - Sharding by restaurant_id
  - 3-node replica sets per shard
  - Config servers: 3 nodes

Elasticsearch:
  - 5 primary shards
  - 2 replicas per shard
  - Dedicated master nodes: 3

Redis:
  - Redis Cluster (6 nodes: 3 master + 3 replica)
  - Separate clusters for cache vs. sessions
  - Sentinel for automatic failover

Kafka:
  - 5 brokers minimum
  - Replication factor: 3
  - Partitions: 10 per topic (for parallelism)
```

---

## 10. Error Handling & Edge Cases

### 10.1 Error Categories & Handling

```javascript
// Custom Error Classes
class AppError extends Error {
  constructor(message, statusCode, errorCode) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

class NotFoundError extends AppError {
  constructor(resource) {
    super(`${resource} not found`, 404, 'NOT_FOUND');
  }
}

class PaymentError extends AppError {
  constructor(message) {
    super(message, 402, 'PAYMENT_FAILED');
  }
}

class RateLimitError extends AppError {
  constructor() {
    super('Too many requests', 429, 'RATE_LIMIT_EXCEEDED');
  }
}

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log error
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
    errorCode: err.errorCode,
    path: req.path,
    method: req.method,
    user: req.user?.id
  });

  // Send to error monitoring (Sentry)
  if (!err.isOperational) {
    Sentry.captureException(err);
  }

  // Send response
  res.status(err.statusCode).json({
    status: err.status,
    error_code: err.errorCode,
    message: err.message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});
```

### 10.2 Critical Edge Cases

```javascript
// 1. Restaurant Closed During Order
async function validateRestaurantAvailability(restaurantId) {
  const restaurant = await getRestaurant(restaurantId);

  if (!restaurant.is_active) {
    throw new AppError('Restaurant is currently closed', 400, 'RESTAURANT_CLOSED');
  }

  // Check operating hours
  const now = new Date();
  const currentDay = now.toLocaleLowerCase().slice(0, 3); // 'mon', 'tue', etc.
  const currentTime = now.toTimeString().slice(0, 5); // 'HH:MM'

  const hours = restaurant.operating_hours[currentDay];
  if (currentTime < hours.open || currentTime > hours.close) {
    throw new AppError(
      `Restaurant opens at ${hours.open}`,
      400,
      'RESTAURANT_CLOSED'
    );
  }
}

// 2. Item Unavailable After Adding to Cart
async function validateCartItems(cart) {
  const restaurant = await getRestaurant(cart.restaurantId);
  const unavailableItems = [];

  for (const cartItem of cart.items) {
    const menuItem = restaurant.menu
      .flatMap(cat => cat.items)
      .find(item => item.item_id === cartItem.itemId);

    if (!menuItem || !menuItem.is_available) {
      unavailableItems.push(cartItem.name);
    }
  }

  if (unavailableItems.length > 0) {
    throw new ValidationError(
      `These items are no longer available: ${unavailableItems.join(', ')}`
    );
  }
}

// 3. Price Change Before Checkout
async function validateCartPricing(cart) {
  const restaurant = await getRestaurant(cart.restaurantId);
  let hasChanges = false;
  const updates = [];

  for (const cartItem of cart.items) {
    const menuItem = restaurant.menu
      .flatMap(cat => cat.items)
      .find(item => item.item_id === cartItem.itemId);

    if (menuItem.price !== cartItem.price) {
      hasChanges = true;
      updates.push({
        item: cartItem.name,
        oldPrice: cartItem.price,
        newPrice: menuItem.price
      });
    }
  }

  if (hasChanges) {
    // Return updated cart with warning
    return {
      hasChanges: true,
      updates,
      message: 'Some prices have changed. Please review your cart.'
    };
  }

  return { hasChanges: false };
}

// 4. Concurrent Order Placement (Race Condition)
async function createOrder(userId, cartData) {
  const lockKey = `order:lock:${userId}`;
  const lockValue = generateUUID();

  // Acquire distributed lock (Redis)
  const acquired = await redis.set(
    lockKey,
    lockValue,
    'PX', 10000, // 10 second expiry
    'NX' // Only set if doesn't exist
  );

  if (!acquired) {
    throw new AppError(
      'An order is already being processed. Please wait.',
      409,
      'ORDER_IN_PROGRESS'
    );
  }

  try {
    // Create order
    const order = await db.orders.create({...});
    return order;
  } finally {
    // Release lock (only if we still own it)
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `;
    await redis.eval(script, 1, lockKey, lockValue);
  }
}

// 5. Payment Gateway Webhook Idempotency
const processedWebhooks = new Set();

async function handlePaymentWebhook(webhookData) {
  const webhookId = webhookData.id;

  // Check if already processed (using Redis)
  const alreadyProcessed = await redis.get(`webhook:${webhookId}`);
  if (alreadyProcessed) {
    logger.warn(`Duplicate webhook received: ${webhookId}`);
    return { status: 'already_processed' };
  }

  // Mark as processing (with expiry to prevent memory leak)
  await redis.setex(`webhook:${webhookId}`, 86400, 'processing'); // 24h

  // Process payment
  const order = await db.orders.findOne({
    payment_id: webhookData.payment_id
  });

  if (!order) {
    throw new NotFoundError('Order');
  }

  if (webhookData.status === 'success') {
    await updateOrderStatus(order.order_id, 'CONFIRMED');
  } else {
    await updateOrderStatus(order.order_id, 'CANCELLED');
    await initiateRefund(order.order_id);
  }

  return { status: 'processed' };
}

// 6. No Delivery Partners Available
async function assignDeliveryPartner(orderId) {
  const order = await db.orders.findOne({ order_id: orderId });
  const restaurant = await getRestaurant(order.restaurant_id);

  // Find available partners within 5km
  const availablePartners = await redis.georadius(
    'delivery:partners',
    restaurant.location.lng,
    restaurant.location.lat,
    5, // 5 km radius
    'km',
    'WITHDIST',
    'ASC' // Closest first
  );

  if (availablePartners.length === 0) {
    // No partners available
    await updateOrderStatus(orderId, 'PENDING_DELIVERY_PARTNER');

    // Notify customer
    await sendNotification(order.user_id, {
      title: 'Searching for delivery partner',
      body: 'We are finding a delivery partner for you. Please wait.'
    });

    // Retry every 30 seconds for 5 minutes
    await scheduleRetry(orderId, 30000, 10);

    return null;
  }

  // Assign closest available partner
  const partnerId = availablePartners[0][0];
  await db.orders.updateOne(
    { order_id: orderId },
    { $set: { delivery_partner_id: partnerId } }
  );

  // Notify partner
  await sendPushNotification(partnerId, {
    title: 'New Order',
    body: 'You have a new delivery request',
    data: { order_id: orderId }
  });

  return partnerId;
}

// 7. Order Cancellation with Refund
async function cancelOrder(orderId, userId) {
  const order = await db.orders.findOne({ order_id: orderId });

  // Validate ownership
  if (order.user_id !== userId) {
    throw new AppError('Unauthorized', 403, 'FORBIDDEN');
  }

  // Check if cancellation is allowed
  const nonCancellableStatuses = ['PICKED_UP', 'OUT_FOR_DELIVERY', 'DELIVERED'];
  if (nonCancellableStatuses.includes(order.order_status)) {
    throw new AppError(
      'Order cannot be cancelled at this stage',
      400,
      'CANCELLATION_NOT_ALLOWED'
    );
  }

  // Calculate refund amount
  let refundAmount = order.total_amount;

  if (order.order_status === 'PREPARING') {
    // Charge 20% cancellation fee
    refundAmount = order.total_amount * 0.8;
  }

  // Process refund
  await processRefund(order.payment_id, refundAmount);

  // Update order status
  await updateOrderStatus(orderId, 'CANCELLED');

  // Notify all parties
  await Promise.all([
    sendNotification(order.user_id, {
      title: 'Order Cancelled',
      body: `Refund of ₹${refundAmount} initiated`
    }),
    sendNotification(order.restaurant_id, {
      title: 'Order Cancelled',
      body: `Order #${orderId.slice(0, 8)} cancelled`
    })
  ]);

  return { refundAmount };
}

// 8. WebSocket Connection Loss
// Client-side reconnection logic
class TrackingClient {
  constructor(orderId) {
    this.orderId = orderId;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second
    this.connect();
  }

  connect() {
    this.ws = new WebSocket(`${WS_URL}/track?order_id=${this.orderId}`);

    this.ws.onopen = () => {
      console.log('Connected to tracking');
      this.reconnectAttempts = 0;
      this.reconnectDelay = 1000;
    };

    this.ws.onclose = () => {
      console.log('Disconnected from tracking');
      this.reconnect();
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.ws.close();
    };
  }

  reconnect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      // Fall back to polling
      this.startPolling();
      return;
    }

    this.reconnectAttempts++;
    const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

    setTimeout(() => {
      console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
      this.connect();
    }, delay);
  }

  startPolling() {
    // Fallback to HTTP polling every 10 seconds
    this.pollingInterval = setInterval(async () => {
      const status = await fetch(`/api/tracking/${this.orderId}`);
      this.updateUI(status);
    }, 10000);
  }
}
```

### 10.3 Circuit Breaker Pattern

```javascript
// Protect against cascading failures
class CircuitBreaker {
  constructor(service, options = {}) {
    this.service = service;
    this.failureThreshold = options.failureThreshold || 5;
    this.resetTimeout = options.resetTimeout || 60000; // 1 minute
    this.state = 'CLOSED'; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async execute(fn, ...args) {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new AppError(
          `${this.service} service unavailable`,
          503,
          'SERVICE_UNAVAILABLE'
        );
      }
      this.state = 'HALF_OPEN';
    }

    try {
      const result = await fn(...args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failureCount = 0;
    this.state = 'CLOSED';
  }

  onFailure() {
    this.failureCount++;

    if (this.failureCount >= this.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.resetTimeout;

      logger.error({
        message: `Circuit breaker opened for ${this.service}`,
        failureCount: this.failureCount
      });
    }
  }
}

// Usage
const paymentBreaker = new CircuitBreaker('Payment Gateway', {
  failureThreshold: 3,
  resetTimeout: 30000
});

async function processPayment(paymentData) {
  return await paymentBreaker.execute(
    async () => await razorpay.processPayment(paymentData)
  );
}
```

---

## 11. Interview Cross-Questions

### 11.1 System Design Questions

**Q1: How do you ensure strong consistency for order placement?**

Answer:
- Use database transactions (ACID properties)
- Implement distributed locks (Redis) to prevent duplicate orders
- Idempotency keys for payment gateway webhooks
- Event sourcing for order state changes with Kafka
- Two-phase commit for cross-service transactions (order + payment)

**Q2: How would you handle millions of concurrent users during peak hours (dinner time)?**

Answer:
- Auto-scaling: Kubernetes HPA based on CPU/memory metrics
- Database: Read replicas (3-5 per region), connection pooling
- Caching: Multi-layer (CDN, Redis, browser) to reduce DB load
- Load balancing: Geographic distribution, weighted routing
- Queue-based processing: Kafka for asynchronous operations
- Rate limiting: Protect APIs from abuse
- Database sharding: Partition by geography or restaurant_id

**Q3: Real-time tracking: WebSocket vs Server-Sent Events vs Polling?**

Answer:
```
WebSocket (Chosen):
  Pros: Bi-directional, low latency, efficient
  Cons: Connection overhead, stateful (needs sticky sessions)
  Use case: Real-time order tracking, chat support

Server-Sent Events:
  Pros: Simple, auto-reconnect, HTTP-based
  Cons: Uni-directional (server → client only)
  Use case: One-way notifications

HTTP Polling:
  Pros: Simple, stateless, works everywhere
  Cons: Inefficient, high latency, server load
  Use case: Fallback when WebSocket fails
```

Strategy: Use WebSocket with fallback to long polling

**Q4: How do you handle search with filters (cuisine, veg/non-veg, rating, price)?**

Answer:
- Primary: Elasticsearch with geo-queries
- Indexing strategy:
  - Geo-point field for location-based search
  - Keyword fields for cuisines, tags
  - Nested objects for menu items
- Query optimization:
  - Bool query with must/filter/should clauses
  - Geo-distance filter for nearby restaurants
  - Range queries for price, rating
- Caching: Redis cache for popular searches (5 min TTL)
- Autocomplete: Edge n-gram tokenizer

**Q5: Database choice: Why PostgreSQL for orders and MongoDB for restaurants?**

Answer:
```
PostgreSQL (Orders, Payments):
  - ACID transactions critical for financial data
  - Strong consistency required
  - Relational data (orders ↔ items ↔ payments)
  - Complex queries with JOINs

MongoDB (Restaurants, Menus):
  - Flexible schema for dynamic menus
  - Nested documents (menu categories → items)
  - Horizontal scaling with sharding
  - Geo-queries support
  - Read-heavy workload (99% reads)

Cassandra (Tracking, Location):
  - Time-series data (location history)
  - High write throughput
  - Partition by order_id or partner_id
```

**Q6: How to prevent overselling (two users ordering the last item)?**

Answer:
- Pessimistic locking during checkout
- Optimistic locking with version numbers
- Redis atomic operations (DECR for inventory)
- Database constraints (CHECK quantity >= 0)
- Compensating transactions if oversold
- Real-time inventory sync between restaurant dashboard and menu

**Q7: Payment failure handling?**

Answer:
1. During payment initiation:
   - Create order with status PENDING
   - Generate payment link (Razorpay/Stripe)
   - Set timeout (15 minutes)

2. Payment success:
   - Webhook confirms payment
   - Update order to CONFIRMED
   - Publish order.placed event

3. Payment failure:
   - Update order to CANCELLED
   - Send notification to user
   - Retry option with different payment method

4. Webhook failure:
   - Idempotency: Store webhook IDs in Redis
   - Polling: Check payment status every 30s for 5 minutes
   - Manual reconciliation job (daily)

**Q8: How to calculate accurate ETA for delivery?**

Answer:
```javascript
function calculateETA(order, restaurant, deliveryPartner) {
  const preparationTime = restaurant.avg_preparation_time || 20; // minutes

  // Distance-based calculation
  const distanceToRestaurant = calculateDistance(
    deliveryPartner.location,
    restaurant.location
  );

  const distanceToCustomer = calculateDistance(
    restaurant.location,
    order.delivery_address
  );

  const travelTime = (distanceToRestaurant + distanceToCustomer) * 3; // 3 min/km

  // Traffic factor (from Maps API)
  const trafficMultiplier = await getTrafficMultiplier(route);

  // Historical data
  const historicalAvg = await getHistoricalDeliveryTime(restaurant.id);

  // Weighted average
  const eta = (
    preparationTime * 0.4 +
    travelTime * trafficMultiplier * 0.4 +
    historicalAvg * 0.2
  );

  // Add buffer (10%)
  return Math.ceil(eta * 1.1);
}
```

**Q9: Offer/Promo code validation at scale?**

Answer:
- Cache active offers in Redis (Hash: offer_code → details)
- Rate limiting per user (prevent brute force)
- Idempotency: Mark offer as used immediately
- Distributed counter for usage limits (Redis INCR)
- Handle race conditions with Lua scripts:
```lua
-- Atomic offer validation
local usage = redis.call('GET', KEYS[1])
if not usage or tonumber(usage) < tonumber(ARGV[1]) then
  redis.call('INCR', KEYS[1])
  return 1  -- Success
else
  return 0  -- Limit exceeded
end
```

**Q10: How to handle restaurant onboarding at scale?**

Answer:
- Self-service portal for restaurant owners
- Workflow:
  1. Registration (basic details, documents)
  2. Document verification (manual/automated)
  3. Menu setup (bulk upload CSV/API)
  4. Bank account verification (penny drop)
  5. Trial period (soft launch)
  6. Go live
- Background jobs for menu processing
- Image optimization (resize, compress, CDN upload)
- Menu validation (pricing, categories)
- Elasticsearch indexing for discoverability

### 11.2 Performance & Scalability

**Q11: How many database connections do you need?**

Answer:
```
Calculation:
- Application servers: 50 instances
- Connections per server: 20
- Total: 50 * 20 = 1000 connections

PostgreSQL:
- max_connections = 1500 (with headroom)
- Use PgBouncer (connection pooling)
  - Pool mode: transaction
  - Pool size: 100 per database

MongoDB:
- Default: 64000 connections
- Limit per server: 100

Connection pooling is critical to prevent exhaustion.
```

**Q12: Redis memory estimation?**

Answer:
```
User sessions: 1M concurrent users * 1KB = 1GB
Cart data: 500K active carts * 2KB = 1GB
Restaurant cache: 500K restaurants * 5KB = 2.5GB
Search cache: 10K queries * 50KB = 500MB
Offer cache: 1000 offers * 1KB = 1MB
Delivery partner locations: 100K * 500B = 50MB
Active order tracking: 50K orders * 2KB = 100MB

Total: ~5.2GB (use 16GB instance with headroom)
Eviction policy: allkeys-lru
```

**Q13: How to handle Black Friday / Big Billion Day traffic (100x spike)?**

Answer:
- Pre-scale infrastructure (1 week before)
- Database: Increase read replicas
- Cache warmup: Pre-load popular restaurants
- CDN: Increase bandwidth allocation
- Queue-based processing: Handle surge asynchronously
- Feature flags: Disable non-critical features (reviews, analytics)
- Static pages: Convert to static for popular restaurants
- Lottery system: Queue users if capacity exceeded
- Monitoring: Real-time alerts, auto-scaling triggers

**Q14: CAP theorem: Where do you sacrifice?**

Answer:
```
High Consistency (CP):
- Orders, Payments (PostgreSQL)
- Strong consistency > availability

High Availability (AP):
- Restaurant listings (MongoDB + Elasticsearch)
- Eventual consistency acceptable
- Stale data tolerable for 30-60 seconds

Partition Tolerance (Always required):
- Network failures handled via:
  - Retries with exponential backoff
  - Circuit breakers
  - Fallback to cached data
```

### 11.3 Advanced Topics

**Q15: How would you implement a "Repeat Last Order" feature efficiently?**

Answer:
- Store order history in user profile (denormalized)
- Cache last 5 orders in Redis (user:orders:{user_id})
- Validate:
  - Restaurant still active?
  - Items still available?
  - Prices changed? (show warning)
- Pre-fill cart with items
- Allow modifications before checkout

**Q16: Multi-restaurant orders in single checkout?**

Answer:
Currently not supported (complexity: multiple deliveries, payments)

If required:
- Split into separate orders internally
- Single payment, multiple settlements
- Coordinate deliveries (estimate arrival)
- Higher complexity in tracking (multiple WebSocket connections)

**Q17: Fraud detection?**

Answer:
- Pattern detection:
  - Multiple failed payment attempts
  - High-value orders from new users
  - Unusual delivery addresses
  - Promo code abuse
- ML model: Score each order (0-100 risk score)
- Rules engine:
  - Block users with > 3 failed payments
  - Limit COD to trusted users
  - Verify phone/email before first order
- Manual review for high-risk orders (> 80 score)

**Q18: How to handle disputes (customer vs restaurant)?**

Answer:
- Evidence collection:
  - Order photos (delivery partner)
  - GPS location proof
  - Timestamps at each stage
  - Chat logs (support)
- Resolution workflow:
  1. Customer raises complaint
  2. Restaurant responds (24h)
  3. Auto-resolve if clear evidence
  4. Manual review by support team
  5. Refund/penalty based on decision
- Blockchain for immutable audit trail (future)

**Q19: Dark kitchens / Cloud kitchens support?**

Answer:
- Single physical location, multiple virtual restaurants
- Database: Add `is_cloud_kitchen` flag
- Shared:
  - Location, operating hours
  - Delivery partners
  - Preparation queue
- Separate:
  - Brand name, menu, ratings
  - Pricing, offers
- Optimization: Batching orders from same location

**Q20: Internationalization (i18n)?**

Answer:
- Database: Store text in multiple languages
```javascript
{
  "name": {
    "en": "Margherita Pizza",
    "hi": "मार्गेरिटा पिज्जा",
    "ta": "மார்கரிட்டா பீட்சா"
  }
}
```
- Currency: Convert based on country (INR, USD, EUR)
- Date/Time: Timezone handling (moment-timezone)
- RTL support: Arabic, Hebrew
- Payment gateways: Local payment methods (Paytm, UPI in India)
- Compliance: GDPR (Europe), data localization laws

---

## Summary

This Food Delivery App HLD covers:

1. **Core Flows**: Restaurant discovery, menu browsing, cart management, order placement, real-time tracking
2. **Architecture**: Microservices, event-driven, polyglot persistence
3. **Real-time**: WebSocket for live tracking, Redis Streams for location updates
4. **Scalability**: Horizontal scaling, caching, database sharding, load balancing
5. **Reliability**: Circuit breakers, retries, fallbacks, error handling
6. **Performance**: Multi-layer caching, query optimization, CDN, compression
7. **Edge Cases**: Payment failures, no delivery partners, item unavailability, price changes

### Key Differentiators from Restaurant Listing Apps:
- **Order Flow**: Complete checkout, payment, and confirmation
- **Real-time Tracking**: Live delivery partner location updates
- **State Management**: Complex order lifecycle with multiple actors
- **Delivery Partner Integration**: Assignment, navigation, status updates
- **Payment Processing**: Multiple gateways, refunds, settlements

This design can handle millions of daily orders with high availability and low latency.
