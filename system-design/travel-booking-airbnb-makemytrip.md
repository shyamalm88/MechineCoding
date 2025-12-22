# Travel Booking Platform - Frontend System Design
## Airbnb / MakeMyTrip / Booking.com Style Application

---

## Table of Contents
1. [Problem Statement](#1-problem-statement)
2. [High-Level Architecture](#2-high-level-architecture)
3. [Component Architecture](#3-component-architecture)
4. [Data Flow & State Management](#4-data-flow--state-management)
5. [API Design](#5-api-design)
6. [Search & Filtering System](#6-search--filtering-system)
7. [Booking Flow & Checkout](#7-booking-flow--checkout)
8. [Map Integration](#8-map-integration)
9. [Calendar & Date Picker](#9-calendar--date-picker)
10. [Performance Optimization](#10-performance-optimization)
11. [Error Handling & Edge Cases](#11-error-handling--edge-cases)
12. [Interview Questions & Answers](#12-interview-questions--answers)
13. [Summary](#13-summary)

---

## 1. Problem Statement

### What Are We Building?

A **travel booking platform** that allows users to search, discover, compare, and book accommodations (hotels, vacation rentals, homestays) and travel packages. Think Airbnb for vacation rentals, MakeMyTrip for comprehensive travel booking, or Booking.com for hotel reservations.

### Core User Journeys

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         TRAVEL BOOKING USER JOURNEYS                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  1. DISCOVERY JOURNEY                                                       │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Landing │───▶│  Search  │───▶│  Browse  │───▶│  Filter  │              │
│  │   Page   │    │  Query   │    │ Listings │    │  Refine  │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                             │
│  2. BOOKING JOURNEY                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │ Property │───▶│  Select  │───▶│  Guest   │───▶│ Payment  │              │
│  │  Detail  │    │  Dates   │    │  Details │    │ Checkout │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                             │
│  3. HOST JOURNEY (Airbnb-style)                                             │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  Create  │───▶│  Upload  │───▶│   Set    │───▶│ Publish  │              │
│  │ Listing  │    │  Photos  │    │ Pricing  │    │ & Manage │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                             │
│  4. TRIP MANAGEMENT                                                         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐              │
│  │  View    │───▶│  Check   │───▶│  Host    │───▶│  Leave   │              │
│  │ Bookings │    │   In     │    │  Chat    │    │  Review  │              │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Platform Comparison

| Feature | Airbnb | MakeMyTrip | Booking.com |
|---------|--------|------------|-------------|
| **Primary Focus** | Vacation rentals, experiences | Flights, hotels, packages | Hotels, accommodations |
| **Listing Type** | User-generated (hosts) | Aggregated from partners | Partner hotels |
| **Unique Features** | Experiences, long stays | Flight+Hotel combos, buses | Free cancellation, deals |
| **Booking Model** | Request or Instant | Instant | Instant |
| **Calendar** | Availability calendar | Date range picker | Flexible dates |
| **Map View** | Central to experience | Secondary | Important |
| **Reviews** | Dual (guest & host) | Single direction | Verified guests only |
| **Messaging** | In-app host-guest chat | Customer support | Property messaging |
| **Payment** | Hold until check-in | Immediate | Pay at property option |

### Key Frontend Challenges

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND ENGINEERING CHALLENGES                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  1. COMPLEX SEARCH & FILTERING                                       │   │
│  │  ─────────────────────────────────                                   │   │
│  │  • Location autocomplete with Google Places API                      │   │
│  │  • Date range selection with availability checking                   │   │
│  │  • Dynamic filters (price, amenities, property type, etc.)           │   │
│  │  • Real-time search results with map synchronization                 │   │
│  │  • URL state management for shareable search results                 │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  2. MAP-LIST SYNCHRONIZATION                                         │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Bi-directional sync between map markers and list items            │   │
│  │  • Clustering for dense areas                                        │   │
│  │  • Viewport-based loading (load listings in visible map area)        │   │
│  │  • Price labels on map markers                                       │   │
│  │  • Hover state coordination                                          │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  3. CALENDAR & AVAILABILITY                                          │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Dual-month calendar with date range selection                     │   │
│  │  • Blocked dates visualization                                       │   │
│  │  • Dynamic pricing display (different rates per night)               │   │
│  │  • Minimum stay requirements                                         │   │
│  │  • Check-in/check-out time restrictions                              │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  4. BOOKING & PAYMENT FLOW                                           │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Multi-step checkout with state persistence                        │   │
│  │  • Price breakdown with taxes, fees, discounts                       │   │
│  │  • Payment gateway integration (Stripe, PayPal, local methods)       │   │
│  │  • Guest count validation                                            │   │
│  │  • Cancellation policy display                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │  5. IMAGE-HEAVY EXPERIENCE                                           │   │
│  │  ─────────────────────────────                                       │   │
│  │  • Photo galleries with lightbox                                     │   │
│  │  • Virtual tours / 360° views                                        │   │
│  │  • Lazy loading with blur placeholders                               │   │
│  │  • Responsive images for different devices                           │   │
│  │  • Image zoom and pan                                                │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Functional Requirements

#### Must Have (P0)
1. **Search & Discovery**
   - Location-based search with autocomplete
   - Date range selection
   - Guest count selector
   - Listing results with pagination/infinite scroll

2. **Listing Display**
   - Property cards with photos, price, ratings
   - Map view with markers
   - Detailed property page with all amenities
   - Photo gallery with full-screen mode

3. **Booking Flow**
   - Date selection with availability check
   - Guest details form
   - Price breakdown
   - Payment processing
   - Booking confirmation

4. **User Account**
   - Authentication (email, social login)
   - Saved/wishlist properties
   - Booking history
   - Profile management

#### Should Have (P1)
5. **Advanced Filtering**
   - Price range slider
   - Property type filters
   - Amenity filters
   - Rating filters
   - Instant book toggle

6. **Reviews & Ratings**
   - Display reviews with photos
   - Rating breakdown
   - Review submission
   - Host/guest responses

7. **Host Dashboard** (for Airbnb-style)
   - Listing management
   - Calendar/availability management
   - Booking requests
   - Earnings dashboard

#### Nice to Have (P2)
8. **Experiences** (Airbnb-style)
9. **Price comparison** across dates
10. **Flexible dates** search
11. **Virtual tours**
12. **Multi-city trips**

### Non-Functional Requirements

| Requirement | Target | Rationale |
|-------------|--------|-----------|
| **Initial Load** | < 2.5s | Users expect fast search results |
| **Search Response** | < 500ms | Real-time filtering experience |
| **Map Interaction** | 60 FPS | Smooth pan/zoom required |
| **Image Load** | < 1s per image | Gallery experience critical |
| **Booking Flow** | < 3 clicks | Minimize abandonment |
| **Availability** | 99.9% | Bookings are time-sensitive |
| **Mobile Performance** | 90+ Lighthouse | Majority book on mobile |

### Scale Considerations

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           SCALE PARAMETERS                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Users & Traffic                                                            │
│  ├── Daily Active Users: 10M+                                               │
│  ├── Peak Concurrent Users: 500K                                            │
│  ├── Searches per Second: 50K                                               │
│  └── Bookings per Day: 1M+                                                  │
│                                                                             │
│  Content                                                                    │
│  ├── Active Listings: 7M+ (Airbnb scale)                                    │
│  ├── Photos per Listing: 15-30                                              │
│  ├── Reviews: 500M+                                                         │
│  └── Locations: 220+ countries                                              │
│                                                                             │
│  Frontend Considerations                                                    │
│  ├── Search Results per Page: 20-50 listings                                │
│  ├── Map Markers Visible: 50-200 at a time                                  │
│  ├── Filters Applied: 5-10 simultaneously                                   │
│  └── Calendar Range: 12-24 months                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Success Metrics (Frontend Focused)

| Metric | Description | Target |
|--------|-------------|--------|
| **Search-to-Detail Rate** | % of searches resulting in listing clicks | > 40% |
| **Booking Conversion** | % of detail views that book | > 5% |
| **Checkout Abandonment** | % abandoning at checkout | < 30% |
| **Time to First Interaction** | Time until search is usable | < 2s |
| **Map Engagement** | % users interacting with map | > 60% |
| **Filter Usage** | % searches using filters | > 50% |
| **Mobile Booking Rate** | % bookings from mobile | > 60% |
| **Return User Rate** | % users returning within 30 days | > 40% |

---

## 2. High-Level Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      TRAVEL BOOKING FRONTEND ARCHITECTURE                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT LAYER                                 │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐  │   │
│  │  │   React     │  │   Next.js   │  │   React    │  │   PWA      │  │   │
│  │  │   Native    │  │     Web     │  │   Native   │  │   Shell    │  │   │
│  │  │   (iOS)     │  │     App     │  │ (Android)  │  │            │  │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SHARED SERVICES LAYER                           │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐  │   │
│  │  │  Search  │  │   Map    │  │ Calendar │  │ Booking  │  │ Auth  │  │   │
│  │  │  Engine  │  │ Service  │  │ Service  │  │  Flow    │  │       │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └───────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        STATE LAYER                                   │   │
│  │  ┌────────────────┐  ┌─────────────────┐  ┌──────────────────────┐  │   │
│  │  │  React Query   │  │     Zustand     │  │   URL State (nuqs)   │  │   │
│  │  │  Server State  │  │  Global UI State │  │  Search Params      │  │   │
│  │  └────────────────┘  └─────────────────┘  └──────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        API LAYER                                     │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │                    API Gateway / BFF                            │ │   │
│  │  └────────────────────────────────────────────────────────────────┘ │   │
│  │         │              │              │              │               │   │
│  │  ┌──────┴───┐   ┌──────┴───┐   ┌──────┴───┐   ┌──────┴───┐         │   │
│  │  │ Search   │   │ Listings │   │ Bookings │   │ Payments │         │   │
│  │  │ Service  │   │ Service  │   │ Service  │   │ Service  │         │   │
│  │  └──────────┘   └──────────┘   └──────────┘   └──────────┘         │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    EXTERNAL SERVICES                                 │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────┐  │   │
│  │  │  Google  │  │  Stripe  │  │ Twilio   │  │ Firebase │  │ CDN   │  │   │
│  │  │  Maps    │  │ Payments │  │   SMS    │  │   Auth   │  │Images │  │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘  └───────┘  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Page Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PAGE STRUCTURE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  /                          Landing/Home Page                               │
│  ├── Hero with Search Bar                                                   │
│  ├── Trending Destinations                                                  │
│  ├── Categories (Beach, Mountain, City, etc.)                               │
│  └── Personalized Recommendations                                           │
│                                                                             │
│  /search                    Search Results Page                             │
│  ├── Search Bar (sticky)                                                    │
│  ├── Filter Panel (collapsible)                                             │
│  ├── Results List/Grid                                                      │
│  └── Map View (split or overlay)                                            │
│                                                                             │
│  /listing/:id               Property Detail Page                            │
│  ├── Photo Gallery                                                          │
│  ├── Property Info & Amenities                                              │
│  ├── Booking Widget (sticky)                                                │
│  ├── Reviews Section                                                        │
│  ├── Location & Map                                                         │
│  └── Similar Listings                                                       │
│                                                                             │
│  /book/:listingId           Booking Flow                                    │
│  ├── /book/:id/details      Guest Details                                   │
│  ├── /book/:id/payment      Payment                                         │
│  └── /book/:id/confirm      Confirmation                                    │
│                                                                             │
│  /trips                     My Trips                                        │
│  ├── Upcoming                                                               │
│  ├── Past                                                                   │
│  └── Cancelled                                                              │
│                                                                             │
│  /hosting                   Host Dashboard (Airbnb-style)                   │
│  ├── /hosting/listings      My Listings                                     │
│  ├── /hosting/calendar      Availability Calendar                           │
│  ├── /hosting/reservations  Booking Requests                                │
│  └── /hosting/earnings      Earnings & Payouts                              │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Technology Stack

```typescript
// Core Framework
const framework = {
  web: 'Next.js 14+ (App Router)',
  mobile: 'React Native / Expo',
  rendering: 'Hybrid SSR + CSR',
  language: 'TypeScript',
};

// State Management Strategy
const stateManagement = {
  serverState: 'TanStack Query (React Query)',
  globalUIState: 'Zustand',
  urlState: 'nuqs (URL search params)',
  formState: 'React Hook Form + Zod',
  localState: 'useState, useReducer',
};

// Key Libraries
const libraries = {
  maps: '@vis.gl/react-google-maps or react-map-gl (Mapbox)',
  calendar: 'react-day-picker or custom implementation',
  forms: 'react-hook-form + @hookform/resolvers',
  validation: 'zod',
  dates: 'date-fns or dayjs',
  animations: 'framer-motion',
  virtualization: '@tanstack/react-virtual',
  carousel: 'embla-carousel-react',
  payments: '@stripe/stripe-js + @stripe/react-stripe-js',
};

// Styling
const styling = {
  solution: 'Tailwind CSS + CSS Modules for complex components',
  designSystem: 'Custom design tokens',
  icons: 'Lucide React or custom SVG sprites',
};
```

### Module Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         MODULE DEPENDENCY GRAPH                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                              ┌──────────────┐                               │
│                              │     App      │                               │
│                              │    Shell     │                               │
│                              └──────┬───────┘                               │
│                                     │                                       │
│           ┌─────────────┬───────────┼───────────┬─────────────┐             │
│           ▼             ▼           ▼           ▼             ▼             │
│    ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│    │   Search   │ │ Listings │ │ Booking  │ │   User   │ │   Host   │      │
│    │   Module   │ │  Module  │ │  Module  │ │  Module  │ │  Module  │      │
│    └─────┬──────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘      │
│          │             │            │            │            │             │
│          └─────────────┴────────────┴────────────┴────────────┘             │
│                                     │                                       │
│                              ┌──────┴───────┐                               │
│                              │    Shared    │                               │
│                              │  Components  │                               │
│                              └──────┬───────┘                               │
│                                     │                                       │
│           ┌─────────────┬───────────┼───────────┬─────────────┐             │
│           ▼             ▼           ▼           ▼             ▼             │
│    ┌────────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│    │    Map     │ │ Calendar │ │  Forms   │ │  Media   │ │    UI    │      │
│    │ Components │ │Components│ │   Kit    │ │ Gallery  │ │Primitives│      │
│    └────────────┘ └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main layout group
│   │   ├── page.tsx              # Home page
│   │   ├── search/
│   │   │   └── page.tsx          # Search results
│   │   ├── listing/
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Property detail
│   │   └── trips/
│   │       └── page.tsx          # My trips
│   ├── (booking)/                # Booking layout group
│   │   └── book/
│   │       └── [listingId]/
│   │           ├── page.tsx      # Booking start
│   │           ├── details/
│   │           ├── payment/
│   │           └── confirm/
│   ├── (hosting)/                # Host dashboard group
│   │   └── hosting/
│   │       ├── page.tsx
│   │       ├── listings/
│   │       ├── calendar/
│   │       └── reservations/
│   ├── api/                      # API routes (BFF)
│   └── layout.tsx
│
├── modules/                      # Feature modules
│   ├── search/
│   │   ├── components/
│   │   │   ├── SearchBar/
│   │   │   ├── FilterPanel/
│   │   │   ├── SearchResults/
│   │   │   └── MapView/
│   │   ├── hooks/
│   │   │   ├── useSearch.ts
│   │   │   ├── useFilters.ts
│   │   │   └── useMapListSync.ts
│   │   ├── services/
│   │   ├── types/
│   │   └── index.ts
│   │
│   ├── listings/
│   │   ├── components/
│   │   │   ├── ListingCard/
│   │   │   ├── ListingDetail/
│   │   │   ├── PhotoGallery/
│   │   │   └── AmenitiesList/
│   │   ├── hooks/
│   │   └── services/
│   │
│   ├── booking/
│   │   ├── components/
│   │   │   ├── BookingWidget/
│   │   │   ├── DateRangePicker/
│   │   │   ├── GuestSelector/
│   │   │   ├── PriceBreakdown/
│   │   │   └── CheckoutForm/
│   │   ├── hooks/
│   │   │   ├── useBooking.ts
│   │   │   ├── useAvailability.ts
│   │   │   └── usePricing.ts
│   │   └── services/
│   │
│   ├── calendar/
│   │   ├── components/
│   │   │   ├── Calendar/
│   │   │   ├── DateRangePicker/
│   │   │   └── AvailabilityCalendar/
│   │   └── hooks/
│   │
│   └── map/
│       ├── components/
│       │   ├── MapContainer/
│       │   ├── ListingMarker/
│       │   ├── MarkerCluster/
│       │   └── MapControls/
│       └── hooks/
│
├── shared/
│   ├── components/
│   │   ├── ui/                   # Primitives (Button, Input, Modal)
│   │   ├── layout/               # Header, Footer, Navigation
│   │   └── feedback/             # Toast, Loading, Error
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
│
├── lib/
│   ├── api/                      # API client
│   ├── maps/                     # Map utilities
│   └── payments/                 # Payment integration
│
└── styles/
    ├── globals.css
    └── tokens/
```

### Rendering Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         RENDERING STRATEGY BY PAGE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Page                    Strategy         Reason                            │
│  ─────────────────────────────────────────────────────────                  │
│  Home                    SSG + ISR        Static content, trending updates  │
│  Search Results          SSR + CSR        SEO + dynamic filtering           │
│  Property Detail         SSR + CSR        SEO critical, availability CSR    │
│  Booking Flow            CSR              Private, no SEO needed            │
│  My Trips                CSR              Private, authenticated            │
│  Host Dashboard          CSR              Private, real-time data           │
│                                                                             │
│  Component-Level Strategies:                                                │
│  ─────────────────────────────────────────────────────────                  │
│  • Static content (descriptions, amenities) → Server Components            │
│  • Interactive elements (calendar, map) → Client Components                 │
│  • Real-time data (availability, price) → Client with React Query          │
│  • Forms → Client Components with React Hook Form                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      SEARCH FLOW DATA ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │    User     │                                                            │
│  │   Action    │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         URL STATE (nuqs)                             │   │
│  │  ?location=paris&checkin=2024-06-01&checkout=2024-06-05&guests=2    │   │
│  │  &minPrice=50&maxPrice=200&type=apartment&amenities=wifi,kitchen    │   │
│  └──────┬──────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    REACT QUERY (Server State)                        │   │
│  │  useQuery(['search', searchParams], fetchListings)                   │   │
│  │  ├── Automatic caching                                               │   │
│  │  ├── Background refetching                                           │   │
│  │  └── Pagination support                                              │   │
│  └──────┬──────────────────────────────────────────────────────────────┘   │
│         │                                                                   │
│         ▼                                                                   │
│  ┌────────────────────────┬────────────────────────────────────────────┐   │
│  │     LISTING LIST       │              MAP VIEW                       │   │
│  │  ┌─────────────────┐   │   ┌────────────────────────────────────┐   │   │
│  │  │  ListingCard    │   │   │  ┌──┐  ┌──┐        ┌──┐            │   │   │
│  │  │  ListingCard    │◄──┼───│  │$85│  │$120│      │$95│           │   │   │
│  │  │  ListingCard    │   │   │  └──┘  └──┘        └──┘            │   │   │
│  │  │  ListingCard    │───┼──▶│         ┌──┐                       │   │   │
│  │  └─────────────────┘   │   │         │$150│                      │   │   │
│  │                        │   │         └──┘                       │   │   │
│  └────────────────────────┴────────────────────────────────────────────┘   │
│                                                                             │
│  Synchronization:                                                           │
│  • Hover on card → Highlight marker                                         │
│  • Click marker → Scroll to card                                            │
│  • Pan map → Update visible listings                                        │
│  • Zoom → Cluster/uncluster markers                                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Component Architecture

### Component Hierarchy Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SEARCH RESULTS PAGE COMPONENT TREE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  SearchPage                                                                 │
│  ├── Header                                                                 │
│  │   └── SearchBar (compact mode)                                           │
│  │       ├── LocationInput                                                  │
│  │       ├── DateRangePicker                                                │
│  │       └── GuestSelector                                                  │
│  │                                                                          │
│  ├── FilterBar                                                              │
│  │   ├── FilterChips (quick filters)                                        │
│  │   └── FilterButton → FilterModal                                         │
│  │       ├── PriceRangeFilter                                               │
│  │       ├── PropertyTypeFilter                                             │
│  │       ├── RoomsFilter                                                    │
│  │       ├── AmenitiesFilter                                                │
│  │       └── MoreFilters                                                    │
│  │                                                                          │
│  └── SearchContent                                                          │
│      ├── ResultsPanel                                                       │
│      │   ├── ResultsHeader (count, sort)                                    │
│      │   ├── ListingGrid / ListingList                                      │
│      │   │   └── ListingCard (multiple)                                     │
│      │   │       ├── ImageCarousel                                          │
│      │   │       ├── ListingInfo                                            │
│      │   │       ├── PriceDisplay                                           │
│      │   │       └── WishlistButton                                         │
│      │   └── Pagination / InfiniteScroll                                    │
│      │                                                                      │
│      └── MapPanel                                                           │
│          ├── MapContainer                                                   │
│          │   ├── ListingMarkers                                             │
│          │   └── MarkerClusters                                             │
│          ├── MapControls                                                    │
│          └── MapListingPopup                                                │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Component Implementations

#### SearchBar Component

```typescript
// types/search.ts
interface SearchParams {
  location: string;
  placeId?: string;
  coordinates?: { lat: number; lng: number };
  checkIn: Date | null;
  checkOut: Date | null;
  guests: GuestCount;
}

interface GuestCount {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

// components/SearchBar/SearchBar.tsx
'use client';

import { useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { parseAsString, parseAsInteger, useQueryStates } from 'nuqs';
import { LocationInput } from './LocationInput';
import { DateRangePicker } from './DateRangePicker';
import { GuestSelector } from './GuestSelector';

interface SearchBarProps {
  variant: 'expanded' | 'compact';
  onSearch?: (params: SearchParams) => void;
}

export function SearchBar({ variant, onSearch }: SearchBarProps) {
  const router = useRouter();

  // URL state management with nuqs
  const [searchParams, setSearchParams] = useQueryStates({
    location: parseAsString.withDefault(''),
    placeId: parseAsString,
    checkIn: parseAsString,
    checkOut: parseAsString,
    adults: parseAsInteger.withDefault(1),
    children: parseAsInteger.withDefault(0),
    infants: parseAsInteger.withDefault(0),
  });

  const [activeSection, setActiveSection] = useState<
    'location' | 'dates' | 'guests' | null
  >(null);

  const handleLocationSelect = useCallback(
    (place: google.maps.places.PlaceResult) => {
      setSearchParams({
        location: place.formatted_address || '',
        placeId: place.place_id,
      });
    },
    [setSearchParams]
  );

  const handleDateChange = useCallback(
    (range: { from: Date | null; to: Date | null }) => {
      setSearchParams({
        checkIn: range.from?.toISOString().split('T')[0] ?? null,
        checkOut: range.to?.toISOString().split('T')[0] ?? null,
      });
    },
    [setSearchParams]
  );

  const handleGuestChange = useCallback(
    (guests: GuestCount) => {
      setSearchParams({
        adults: guests.adults,
        children: guests.children,
        infants: guests.infants,
      });
    },
    [setSearchParams]
  );

  const handleSearch = useCallback(() => {
    const queryString = new URLSearchParams(
      Object.entries(searchParams).filter(([_, v]) => v != null) as [string, string][]
    ).toString();
    router.push(`/search?${queryString}`);
  }, [router, searchParams]);

  if (variant === 'compact') {
    return (
      <button
        onClick={() => setActiveSection('location')}
        className="flex items-center gap-4 px-6 py-3 bg-white rounded-full shadow-md border hover:shadow-lg transition-shadow"
      >
        <span className="font-medium">{searchParams.location || 'Anywhere'}</span>
        <span className="border-l pl-4">
          {searchParams.checkIn ? formatDateRange(searchParams.checkIn, searchParams.checkOut) : 'Any week'}
        </span>
        <span className="border-l pl-4">
          {formatGuestCount(searchParams.adults, searchParams.children)}
        </span>
        <SearchIcon className="w-8 h-8 p-2 bg-primary text-white rounded-full" />
      </button>
    );
  }

  return (
    <div className="relative">
      <div className="flex items-center bg-white rounded-full shadow-lg border">
        {/* Location Section */}
        <div
          className={`flex-1 p-4 rounded-full cursor-pointer transition-colors ${
            activeSection === 'location' ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveSection('location')}
        >
          <label className="text-xs font-semibold">Where</label>
          <LocationInput
            value={searchParams.location}
            onSelect={handleLocationSelect}
            placeholder="Search destinations"
          />
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Check-in Section */}
        <div
          className={`p-4 rounded-full cursor-pointer transition-colors ${
            activeSection === 'dates' ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveSection('dates')}
        >
          <label className="text-xs font-semibold">Check in</label>
          <p className="text-sm text-gray-600">
            {searchParams.checkIn ? formatDate(searchParams.checkIn) : 'Add dates'}
          </p>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Check-out Section */}
        <div
          className={`p-4 rounded-full cursor-pointer transition-colors ${
            activeSection === 'dates' ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveSection('dates')}
        >
          <label className="text-xs font-semibold">Check out</label>
          <p className="text-sm text-gray-600">
            {searchParams.checkOut ? formatDate(searchParams.checkOut) : 'Add dates'}
          </p>
        </div>

        <div className="w-px h-8 bg-gray-300" />

        {/* Guests Section */}
        <div
          className={`flex-1 p-4 rounded-full cursor-pointer transition-colors ${
            activeSection === 'guests' ? 'bg-gray-100' : 'hover:bg-gray-50'
          }`}
          onClick={() => setActiveSection('guests')}
        >
          <label className="text-xs font-semibold">Who</label>
          <p className="text-sm text-gray-600">
            {searchParams.adults > 0
              ? formatGuestCount(searchParams.adults, searchParams.children)
              : 'Add guests'}
          </p>
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="m-2 p-4 bg-primary text-white rounded-full hover:bg-primary-dark transition-colors"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Expandable Panels */}
      {activeSection === 'location' && (
        <LocationPanel
          onSelect={handleLocationSelect}
          onClose={() => setActiveSection('dates')}
        />
      )}

      {activeSection === 'dates' && (
        <DatePanel
          checkIn={searchParams.checkIn ? new Date(searchParams.checkIn) : null}
          checkOut={searchParams.checkOut ? new Date(searchParams.checkOut) : null}
          onChange={handleDateChange}
          onClose={() => setActiveSection('guests')}
        />
      )}

      {activeSection === 'guests' && (
        <GuestPanel
          adults={searchParams.adults}
          children={searchParams.children}
          infants={searchParams.infants}
          onChange={handleGuestChange}
          onClose={() => setActiveSection(null)}
        />
      )}
    </div>
  );
}
```

#### ListingCard Component

```typescript
// components/ListingCard/ListingCard.tsx
'use client';

import { memo, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { Heart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Listing {
  id: string;
  title: string;
  location: {
    city: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  images: string[];
  price: {
    amount: number;
    currency: string;
    period: 'night' | 'total';
  };
  rating: number;
  reviewCount: number;
  propertyType: string;
  amenities: string[];
  isSuperhost: boolean;
  instantBook: boolean;
}

interface ListingCardProps {
  listing: Listing;
  isHovered?: boolean;
  onHover?: (id: string | null) => void;
  onWishlistToggle?: (id: string) => void;
  isWishlisted?: boolean;
}

export const ListingCard = memo(function ListingCard({
  listing,
  isHovered,
  onHover,
  onWishlistToggle,
  isWishlisted = false,
}: ListingCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '200px',
  });

  const handlePrevImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  }, [listing.images.length]);

  const handleNextImage = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  }, [listing.images.length]);

  const handleWishlistClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle?.(listing.id);
  }, [listing.id, onWishlistToggle]);

  return (
    <Link
      href={`/listing/${listing.id}`}
      ref={ref}
      className={cn(
        'group block rounded-xl overflow-hidden transition-shadow',
        isHovered && 'ring-2 ring-primary shadow-lg'
      )}
      onMouseEnter={() => onHover?.(listing.id)}
      onMouseLeave={() => onHover?.(null)}
    >
      {/* Image Carousel */}
      <div className="relative aspect-square overflow-hidden rounded-xl">
        {inView ? (
          <>
            <Image
              src={listing.images[currentImageIndex]}
              alt={listing.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority={currentImageIndex === 0}
            />

            {/* Image Navigation */}
            {listing.images.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Pagination Dots */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {listing.images.slice(0, 5).map((_, index) => (
                    <span
                      key={index}
                      className={cn(
                        'w-1.5 h-1.5 rounded-full transition-colors',
                        index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                      )}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full bg-gray-200 animate-pulse" />
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistClick}
          className="absolute top-3 right-3 p-2 rounded-full hover:scale-110 transition-transform"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={cn(
              'w-6 h-6',
              isWishlisted
                ? 'fill-red-500 stroke-red-500'
                : 'stroke-white fill-black/30'
            )}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {listing.isSuperhost && (
            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium">
              Superhost
            </span>
          )}
          {listing.instantBook && (
            <span className="px-2 py-1 bg-white rounded-full text-xs font-medium">
              ⚡ Instant
            </span>
          )}
        </div>
      </div>

      {/* Listing Info */}
      <div className="p-3">
        <div className="flex justify-between items-start gap-2">
          <h3 className="font-medium text-sm truncate">
            {listing.location.city}, {listing.location.country}
          </h3>
          {listing.rating > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-4 h-4 fill-current" />
              <span className="text-sm">{listing.rating.toFixed(2)}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-gray-500 truncate mt-1">
          {listing.propertyType} · {listing.title}
        </p>

        <p className="mt-2">
          <span className="font-semibold">
            {formatCurrency(listing.price.amount, listing.price.currency)}
          </span>
          <span className="text-gray-500"> / {listing.price.period}</span>
        </p>
      </div>
    </Link>
  );
});

// Performance optimization: Only re-render when specific props change
ListingCard.displayName = 'ListingCard';
```

#### FilterPanel Component

```typescript
// components/FilterPanel/FilterPanel.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { parseAsArrayOf, parseAsString, parseAsInteger, useQueryStates } from 'nuqs';
import { X, SlidersHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PriceRangeSlider } from './PriceRangeSlider';
import { CheckboxGroup } from './CheckboxGroup';
import { ToggleGroup } from './ToggleGroup';

interface FilterPanelProps {
  onFiltersChange?: (filters: FilterState) => void;
}

interface FilterState {
  minPrice: number | null;
  maxPrice: number | null;
  propertyTypes: string[];
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  amenities: string[];
  instantBook: boolean;
  superhost: boolean;
}

const PROPERTY_TYPES = [
  { value: 'house', label: 'House' },
  { value: 'apartment', label: 'Apartment' },
  { value: 'guesthouse', label: 'Guesthouse' },
  { value: 'hotel', label: 'Hotel' },
  { value: 'villa', label: 'Villa' },
  { value: 'cabin', label: 'Cabin' },
];

const AMENITIES = [
  { value: 'wifi', label: 'Wifi' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'washer', label: 'Washer' },
  { value: 'dryer', label: 'Dryer' },
  { value: 'ac', label: 'Air conditioning' },
  { value: 'heating', label: 'Heating' },
  { value: 'pool', label: 'Pool' },
  { value: 'parking', label: 'Free parking' },
  { value: 'gym', label: 'Gym' },
  { value: 'tv', label: 'TV' },
];

export function FilterPanel({ onFiltersChange }: FilterPanelProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // URL-synced filter state
  const [filters, setFilters] = useQueryStates({
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    propertyTypes: parseAsArrayOf(parseAsString).withDefault([]),
    bedrooms: parseAsInteger,
    beds: parseAsInteger,
    bathrooms: parseAsInteger,
    amenities: parseAsArrayOf(parseAsString).withDefault([]),
    instantBook: parseAsString,
    superhost: parseAsString,
  });

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.minPrice || filters.maxPrice) count++;
    if (filters.propertyTypes.length > 0) count += filters.propertyTypes.length;
    if (filters.bedrooms) count++;
    if (filters.beds) count++;
    if (filters.bathrooms) count++;
    if (filters.amenities.length > 0) count += filters.amenities.length;
    if (filters.instantBook === 'true') count++;
    if (filters.superhost === 'true') count++;
    return count;
  }, [filters]);

  const handlePriceChange = useCallback(
    (range: { min: number | null; max: number | null }) => {
      setFilters({ minPrice: range.min, maxPrice: range.max });
    },
    [setFilters]
  );

  const handlePropertyTypeChange = useCallback(
    (types: string[]) => {
      setFilters({ propertyTypes: types });
    },
    [setFilters]
  );

  const handleAmenitiesChange = useCallback(
    (amenities: string[]) => {
      setFilters({ amenities });
    },
    [setFilters]
  );

  const handleClearFilters = useCallback(() => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      propertyTypes: [],
      bedrooms: null,
      beds: null,
      bathrooms: null,
      amenities: [],
      instantBook: null,
      superhost: null,
    });
  }, [setFilters]);

  return (
    <>
      {/* Quick Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 px-4 border-b">
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-full hover:border-black transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-5 h-5 bg-black text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        {/* Quick Filter Buttons */}
        <FilterChip
          label="Price"
          active={!!(filters.minPrice || filters.maxPrice)}
          onClick={() => setIsModalOpen(true)}
        />
        <FilterChip
          label="Type of place"
          active={filters.propertyTypes.length > 0}
          onClick={() => setIsModalOpen(true)}
        />
        <FilterChip
          label="Instant Book"
          active={filters.instantBook === 'true'}
          onClick={() =>
            setFilters({
              instantBook: filters.instantBook === 'true' ? null : 'true',
            })
          }
        />
        <FilterChip
          label="Superhost"
          active={filters.superhost === 'true'}
          onClick={() =>
            setFilters({
              superhost: filters.superhost === 'true' ? null : 'true',
            })
          }
        />
      </div>

      {/* Filter Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-5 h-5" />
                </button>
                <h2 className="font-semibold">Filters</h2>
                <div className="w-5" /> {/* Spacer */}
              </div>

              {/* Modal Content */}
              <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                {/* Price Range */}
                <section className="pb-6 border-b">
                  <h3 className="text-lg font-medium mb-4">Price range</h3>
                  <PriceRangeSlider
                    min={0}
                    max={1000}
                    value={{ min: filters.minPrice, max: filters.maxPrice }}
                    onChange={handlePriceChange}
                  />
                </section>

                {/* Property Type */}
                <section className="py-6 border-b">
                  <h3 className="text-lg font-medium mb-4">Type of place</h3>
                  <CheckboxGroup
                    options={PROPERTY_TYPES}
                    value={filters.propertyTypes}
                    onChange={handlePropertyTypeChange}
                  />
                </section>

                {/* Rooms and Beds */}
                <section className="py-6 border-b">
                  <h3 className="text-lg font-medium mb-4">Rooms and beds</h3>
                  <div className="space-y-4">
                    <CounterFilter
                      label="Bedrooms"
                      value={filters.bedrooms}
                      onChange={(v) => setFilters({ bedrooms: v })}
                    />
                    <CounterFilter
                      label="Beds"
                      value={filters.beds}
                      onChange={(v) => setFilters({ beds: v })}
                    />
                    <CounterFilter
                      label="Bathrooms"
                      value={filters.bathrooms}
                      onChange={(v) => setFilters({ bathrooms: v })}
                    />
                  </div>
                </section>

                {/* Amenities */}
                <section className="py-6">
                  <h3 className="text-lg font-medium mb-4">Amenities</h3>
                  <CheckboxGroup
                    options={AMENITIES}
                    value={filters.amenities}
                    onChange={handleAmenitiesChange}
                  />
                </section>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 border-t">
                <button
                  onClick={handleClearFilters}
                  className="text-sm underline"
                >
                  Clear all
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 bg-black text-white rounded-lg font-medium"
                >
                  Show results
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Sub-components
function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 border rounded-full whitespace-nowrap transition-colors',
        active ? 'border-black bg-gray-100' : 'hover:border-black'
      )}
    >
      {label}
    </button>
  );
}

function CounterFilter({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number | null;
  onChange: (value: number | null) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span>
      <div className="flex items-center gap-3">
        <button
          onClick={() => onChange(value ? Math.max(0, value - 1) : null)}
          disabled={!value}
          className="w-8 h-8 border rounded-full flex items-center justify-center disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center">{value || 'Any'}</span>
        <button
          onClick={() => onChange((value || 0) + 1)}
          className="w-8 h-8 border rounded-full flex items-center justify-center"
        >
          +
        </button>
      </div>
    </div>
  );
}
```

#### BookingWidget Component

```typescript
// components/BookingWidget/BookingWidget.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { ChevronDown, Star } from 'lucide-react';
import { DateRangePicker } from '../DateRangePicker';
import { GuestSelector } from '../GuestSelector';
import { fetchAvailability, fetchPricing } from '@/lib/api/listings';

interface BookingWidgetProps {
  listing: {
    id: string;
    price: { amount: number; currency: string };
    rating: number;
    reviewCount: number;
    maxGuests: number;
    minNights: number;
    maxNights: number;
  };
  className?: string;
}

export function BookingWidget({ listing, className }: BookingWidgetProps) {
  const router = useRouter();
  const [dateRange, setDateRange] = useState<{
    from: Date | null;
    to: Date | null;
  }>({ from: null, to: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGuestSelector, setShowGuestSelector] = useState(false);

  // Fetch availability for the listing
  const { data: availability } = useQuery({
    queryKey: ['availability', listing.id],
    queryFn: () => fetchAvailability(listing.id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch pricing when dates are selected
  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ['pricing', listing.id, dateRange.from, dateRange.to, guests],
    queryFn: () =>
      fetchPricing(listing.id, {
        checkIn: dateRange.from!,
        checkOut: dateRange.to!,
        guests,
      }),
    enabled: !!(dateRange.from && dateRange.to),
    staleTime: 60 * 1000, // 1 minute
  });

  const nights = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return 0;
    return differenceInDays(dateRange.to, dateRange.from);
  }, [dateRange]);

  const totalGuests = guests.adults + guests.children;

  const handleReserve = useCallback(() => {
    if (!dateRange.from || !dateRange.to) {
      setShowDatePicker(true);
      return;
    }

    const params = new URLSearchParams({
      checkIn: format(dateRange.from, 'yyyy-MM-dd'),
      checkOut: format(dateRange.to, 'yyyy-MM-dd'),
      adults: guests.adults.toString(),
      children: guests.children.toString(),
      infants: guests.infants.toString(),
    });

    router.push(`/book/${listing.id}?${params}`);
  }, [dateRange, guests, listing.id, router]);

  return (
    <div
      className={cn(
        'p-6 border rounded-xl shadow-lg bg-white sticky top-24',
        className
      )}
    >
      {/* Price Header */}
      <div className="flex items-baseline justify-between mb-4">
        <div>
          <span className="text-xl font-semibold">
            {formatCurrency(listing.price.amount, listing.price.currency)}
          </span>
          <span className="text-gray-500"> / night</span>
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{listing.rating.toFixed(2)}</span>
          <span className="text-gray-500">({listing.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Date & Guest Selection */}
      <div className="border rounded-lg mb-4">
        {/* Date Selection */}
        <div className="relative">
          <button
            onClick={() => setShowDatePicker(!showDatePicker)}
            className="w-full p-3 text-left grid grid-cols-2 gap-4 border-b"
          >
            <div>
              <label className="text-[10px] font-semibold uppercase">
                Check-in
              </label>
              <p className="text-sm">
                {dateRange.from
                  ? format(dateRange.from, 'MM/dd/yyyy')
                  : 'Add date'}
              </p>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase">
                Checkout
              </label>
              <p className="text-sm">
                {dateRange.to
                  ? format(dateRange.to, 'MM/dd/yyyy')
                  : 'Add date'}
              </p>
            </div>
          </button>

          {showDatePicker && (
            <div className="absolute top-full left-0 right-0 mt-2 z-10">
              <DateRangePicker
                value={dateRange}
                onChange={(range) => {
                  setDateRange(range);
                  if (range.from && range.to) {
                    setShowDatePicker(false);
                  }
                }}
                blockedDates={availability?.blockedDates}
                minNights={listing.minNights}
                maxNights={listing.maxNights}
                pricingByDate={availability?.pricingByDate}
              />
            </div>
          )}
        </div>

        {/* Guest Selection */}
        <div className="relative">
          <button
            onClick={() => setShowGuestSelector(!showGuestSelector)}
            className="w-full p-3 text-left flex justify-between items-center"
          >
            <div>
              <label className="text-[10px] font-semibold uppercase">
                Guests
              </label>
              <p className="text-sm">
                {totalGuests} guest{totalGuests !== 1 ? 's' : ''}
                {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
              </p>
            </div>
            <ChevronDown className="w-4 h-4" />
          </button>

          {showGuestSelector && (
            <div className="absolute top-full left-0 right-0 mt-2 z-10">
              <GuestSelector
                value={guests}
                onChange={setGuests}
                maxGuests={listing.maxGuests}
                onClose={() => setShowGuestSelector(false)}
              />
            </div>
          )}
        </div>
      </div>

      {/* Reserve Button */}
      <button
        onClick={handleReserve}
        disabled={pricingLoading}
        className="w-full py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold hover:from-pink-600 hover:to-rose-600 transition-colors disabled:opacity-50"
      >
        {dateRange.from && dateRange.to ? 'Reserve' : 'Check availability'}
      </button>

      {/* Price Breakdown */}
      {pricing && nights > 0 && (
        <div className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="underline">
              {formatCurrency(listing.price.amount, listing.price.currency)} x{' '}
              {nights} nights
            </span>
            <span>{formatCurrency(pricing.subtotal, listing.price.currency)}</span>
          </div>

          {pricing.cleaningFee > 0 && (
            <div className="flex justify-between">
              <span className="underline">Cleaning fee</span>
              <span>
                {formatCurrency(pricing.cleaningFee, listing.price.currency)}
              </span>
            </div>
          )}

          {pricing.serviceFee > 0 && (
            <div className="flex justify-between">
              <span className="underline">Service fee</span>
              <span>
                {formatCurrency(pricing.serviceFee, listing.price.currency)}
              </span>
            </div>
          )}

          {pricing.taxes > 0 && (
            <div className="flex justify-between">
              <span className="underline">Taxes</span>
              <span>
                {formatCurrency(pricing.taxes, listing.price.currency)}
              </span>
            </div>
          )}

          <div className="flex justify-between font-semibold pt-2 border-t">
            <span>Total</span>
            <span>
              {formatCurrency(pricing.total, listing.price.currency)}
            </span>
          </div>
        </div>
      )}

      {/* Minimum Stay Warning */}
      {nights > 0 && nights < listing.minNights && (
        <p className="mt-3 text-sm text-red-500">
          Minimum stay is {listing.minNights} nights
        </p>
      )}
    </div>
  );
}
```

### Component State Management Pattern

```typescript
// Pattern: Component state + URL state + Server state coordination
// hooks/useSearchState.ts

import { useQueryStates, parseAsString, parseAsInteger, parseAsArrayOf } from 'nuqs';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export function useSearchState() {
  // URL State - shareable, bookmarkable
  const [urlState, setUrlState] = useQueryStates({
    location: parseAsString.withDefault(''),
    placeId: parseAsString,
    checkIn: parseAsString,
    checkOut: parseAsString,
    adults: parseAsInteger.withDefault(1),
    children: parseAsInteger.withDefault(0),
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    propertyTypes: parseAsArrayOf(parseAsString).withDefault([]),
    amenities: parseAsArrayOf(parseAsString).withDefault([]),
    page: parseAsInteger.withDefault(1),
    sort: parseAsString.withDefault('relevance'),
  });

  // Derived search params for API
  const searchParams = useMemo(() => ({
    location: urlState.location,
    placeId: urlState.placeId,
    checkIn: urlState.checkIn,
    checkOut: urlState.checkOut,
    guests: urlState.adults + urlState.children,
    minPrice: urlState.minPrice,
    maxPrice: urlState.maxPrice,
    propertyTypes: urlState.propertyTypes,
    amenities: urlState.amenities,
    page: urlState.page,
    sort: urlState.sort,
  }), [urlState]);

  // Server State - listings data
  const {
    data: searchResults,
    isLoading,
    error,
    isFetching,
  } = useQuery({
    queryKey: ['search', searchParams],
    queryFn: () => searchListings(searchParams),
    enabled: !!urlState.location || !!urlState.placeId,
    keepPreviousData: true,
    staleTime: 30 * 1000, // 30 seconds
  });

  // Actions
  const updateFilters = useCallback(
    (updates: Partial<typeof urlState>) => {
      setUrlState({ ...updates, page: 1 }); // Reset page on filter change
    },
    [setUrlState]
  );

  const goToPage = useCallback(
    (page: number) => {
      setUrlState({ page });
    },
    [setUrlState]
  );

  const updateSort = useCallback(
    (sort: string) => {
      setUrlState({ sort, page: 1 });
    },
    [setUrlState]
  );

  return {
    // State
    filters: urlState,
    searchResults,
    isLoading,
    isFetching,
    error,
    // Actions
    updateFilters,
    goToPage,
    updateSort,
    setFilters: setUrlState,
  };
}
```

---

## 4. Data Flow & State Management

### State Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         STATE MANAGEMENT LAYERS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        URL STATE (nuqs)                              │   │
│  │  ─────────────────────────────────────────                           │   │
│  │  Purpose: Shareable, bookmarkable, SEO-friendly                      │   │
│  │  Examples: Search filters, pagination, selected dates                 │   │
│  │  Persistence: Browser URL, survives refresh                          │   │
│  │                                                                       │   │
│  │  ?location=paris&checkIn=2024-06-01&checkout=2024-06-05              │   │
│  │  &guests=2&minPrice=50&maxPrice=200&propertyTypes=apartment,house    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                   SERVER STATE (TanStack Query)                      │   │
│  │  ─────────────────────────────────────────                           │   │
│  │  Purpose: Cached API data with automatic refetching                  │   │
│  │  Examples: Listings, availability, reviews, user data                │   │
│  │  Features: Caching, deduplication, background updates                │   │
│  │                                                                       │   │
│  │  useQuery(['listings', searchParams]) → { data, isLoading, error }   │   │
│  │  useQuery(['availability', listingId]) → availability calendar       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    GLOBAL UI STATE (Zustand)                         │   │
│  │  ─────────────────────────────────────────                           │   │
│  │  Purpose: Cross-component UI state                                   │   │
│  │  Examples: Map/list sync, modals, wishlist, auth state               │   │
│  │  Features: Simple API, minimal boilerplate, devtools                 │   │
│  │                                                                       │   │
│  │  useUIStore() → { hoveredListingId, isMapExpanded, currency }        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                       LOCAL STATE (React)                            │   │
│  │  ─────────────────────────────────────────                           │   │
│  │  Purpose: Component-specific ephemeral state                         │   │
│  │  Examples: Form inputs, dropdown open/close, carousel index          │   │
│  │  APIs: useState, useReducer                                          │   │
│  │                                                                       │   │
│  │  const [isOpen, setIsOpen] = useState(false);                        │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### URL State Management with nuqs

```typescript
// lib/search-params.ts
import {
  createSearchParamsCache,
  parseAsString,
  parseAsInteger,
  parseAsArrayOf,
  parseAsIsoDateTime,
  parseAsStringLiteral,
} from 'nuqs/server';

// Define all search parameters with types and defaults
export const searchParamsParsers = {
  // Location
  location: parseAsString.withDefault(''),
  placeId: parseAsString,
  lat: parseAsString,
  lng: parseAsString,

  // Dates
  checkIn: parseAsString,
  checkOut: parseAsString,
  flexibleDates: parseAsStringLiteral(['exact', 'flexible', 'month'] as const),

  // Guests
  adults: parseAsInteger.withDefault(1),
  children: parseAsInteger.withDefault(0),
  infants: parseAsInteger.withDefault(0),
  pets: parseAsInteger.withDefault(0),

  // Filters
  minPrice: parseAsInteger,
  maxPrice: parseAsInteger,
  propertyTypes: parseAsArrayOf(parseAsString).withDefault([]),
  bedrooms: parseAsInteger,
  beds: parseAsInteger,
  bathrooms: parseAsInteger,
  amenities: parseAsArrayOf(parseAsString).withDefault([]),
  instantBook: parseAsString,
  superhost: parseAsString,

  // View options
  page: parseAsInteger.withDefault(1),
  sort: parseAsStringLiteral(['relevance', 'price_low', 'price_high', 'rating'] as const).withDefault('relevance'),
  view: parseAsStringLiteral(['list', 'grid', 'map'] as const).withDefault('list'),

  // Map bounds (for viewport-based loading)
  ne_lat: parseAsString,
  ne_lng: parseAsString,
  sw_lat: parseAsString,
  sw_lng: parseAsString,
  zoom: parseAsInteger,
};

// Server-side cache for Next.js App Router
export const searchParamsCache = createSearchParamsCache(searchParamsParsers);

// Type for all search params
export type SearchParams = ReturnType<typeof searchParamsCache.parse>;
```

```typescript
// hooks/useSearchParams.ts
'use client';

import { useQueryStates } from 'nuqs';
import { searchParamsParsers } from '@/lib/search-params';
import { useCallback, useMemo } from 'react';

export function useSearchParams() {
  const [params, setParams] = useQueryStates(searchParamsParsers, {
    // Shallow routing for better performance
    shallow: true,
    // Scroll to top on filter change
    scroll: false,
    // Throttle URL updates
    throttleMs: 100,
  });

  // Derived values
  const totalGuests = useMemo(
    () => params.adults + params.children,
    [params.adults, params.children]
  );

  const hasFilters = useMemo(() => {
    return (
      params.minPrice !== null ||
      params.maxPrice !== null ||
      params.propertyTypes.length > 0 ||
      params.bedrooms !== null ||
      params.amenities.length > 0 ||
      params.instantBook === 'true' ||
      params.superhost === 'true'
    );
  }, [params]);

  // Actions
  const clearFilters = useCallback(() => {
    setParams({
      minPrice: null,
      maxPrice: null,
      propertyTypes: [],
      bedrooms: null,
      beds: null,
      bathrooms: null,
      amenities: [],
      instantBook: null,
      superhost: null,
      page: 1,
    });
  }, [setParams]);

  const setDates = useCallback(
    (checkIn: string | null, checkOut: string | null) => {
      setParams({ checkIn, checkOut, page: 1 });
    },
    [setParams]
  );

  const setGuests = useCallback(
    (guests: { adults: number; children: number; infants: number; pets: number }) => {
      setParams({ ...guests, page: 1 });
    },
    [setParams]
  );

  const setMapBounds = useCallback(
    (bounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number }; zoom: number }) => {
      setParams({
        ne_lat: bounds.ne.lat.toString(),
        ne_lng: bounds.ne.lng.toString(),
        sw_lat: bounds.sw.lat.toString(),
        sw_lng: bounds.sw.lng.toString(),
        zoom: bounds.zoom,
      });
    },
    [setParams]
  );

  return {
    params,
    setParams,
    totalGuests,
    hasFilters,
    clearFilters,
    setDates,
    setGuests,
    setMapBounds,
  };
}
```

### Server State with TanStack Query

```typescript
// lib/api/queries.ts
import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import type { SearchParams } from '@/lib/search-params';

// Query Key Factory for consistent keys
export const queryKeys = {
  listings: {
    all: ['listings'] as const,
    search: (params: SearchParams) => ['listings', 'search', params] as const,
    detail: (id: string) => ['listings', 'detail', id] as const,
    availability: (id: string) => ['listings', 'availability', id] as const,
    pricing: (id: string, dates: { checkIn: string; checkOut: string }) =>
      ['listings', 'pricing', id, dates] as const,
    reviews: (id: string) => ['listings', 'reviews', id] as const,
  },
  user: {
    current: ['user', 'current'] as const,
    wishlists: ['user', 'wishlists'] as const,
    bookings: ['user', 'bookings'] as const,
  },
};

// Search Listings Query
export function useSearchListings(params: SearchParams) {
  return useQuery({
    queryKey: queryKeys.listings.search(params),
    queryFn: () => searchListings(params),
    staleTime: 30 * 1000, // 30 seconds
    keepPreviousData: true, // Keep showing old data while fetching new
    enabled: !!(params.location || params.placeId || params.ne_lat), // Only fetch when location is set
  });
}

// Infinite scroll variant
export function useSearchListingsInfinite(params: SearchParams) {
  return useInfiniteQuery({
    queryKey: [...queryKeys.listings.search(params), 'infinite'],
    queryFn: ({ pageParam = 1 }) => searchListings({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 30 * 1000,
    enabled: !!(params.location || params.placeId),
  });
}

// Listing Detail Query
export function useListingDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.listings.detail(id),
    queryFn: () => getListingDetail(id),
    staleTime: 5 * 60 * 1000, // 5 minutes - listings don't change often
  });
}

// Availability Query (more frequent updates needed)
export function useAvailability(listingId: string) {
  return useQuery({
    queryKey: queryKeys.listings.availability(listingId),
    queryFn: () => getAvailability(listingId),
    staleTime: 60 * 1000, // 1 minute - availability changes more often
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
}

// Dynamic Pricing Query
export function usePricing(
  listingId: string,
  dates: { checkIn: string; checkOut: string } | null,
  guests: { adults: number; children: number }
) {
  return useQuery({
    queryKey: queryKeys.listings.pricing(listingId, dates!),
    queryFn: () => getPricing(listingId, { ...dates!, guests }),
    enabled: !!(dates?.checkIn && dates?.checkOut),
    staleTime: 30 * 1000,
  });
}

// Reviews with pagination
export function useReviews(listingId: string) {
  return useInfiniteQuery({
    queryKey: queryKeys.listings.reviews(listingId),
    queryFn: ({ pageParam = 1 }) => getReviews(listingId, { page: pageParam }),
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    staleTime: 10 * 60 * 1000, // 10 minutes - reviews don't change often
  });
}
```

### Optimistic Updates for Wishlist

```typescript
// hooks/useWishlist.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWishlistStore } from '@/stores/wishlist';

export function useWishlistMutation() {
  const queryClient = useQueryClient();
  const { addToWishlist, removeFromWishlist } = useWishlistStore();

  return useMutation({
    mutationFn: async ({ listingId, action }: { listingId: string; action: 'add' | 'remove' }) => {
      if (action === 'add') {
        return await addToWishlistAPI(listingId);
      } else {
        return await removeFromWishlistAPI(listingId);
      }
    },

    // Optimistic update
    onMutate: async ({ listingId, action }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.user.wishlists });

      // Snapshot previous value
      const previousWishlists = queryClient.getQueryData(queryKeys.user.wishlists);

      // Optimistically update
      if (action === 'add') {
        addToWishlist(listingId);
      } else {
        removeFromWishlist(listingId);
      }

      return { previousWishlists };
    },

    // Rollback on error
    onError: (err, { listingId, action }, context) => {
      if (context?.previousWishlists) {
        queryClient.setQueryData(queryKeys.user.wishlists, context.previousWishlists);
      }
      // Rollback local state too
      if (action === 'add') {
        removeFromWishlist(listingId);
      } else {
        addToWishlist(listingId);
      }
    },

    // Refetch after success
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.wishlists });
    },
  });
}
```

### Global UI State with Zustand

```typescript
// stores/ui.ts
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface UIState {
  // Map-List synchronization
  hoveredListingId: string | null;
  selectedListingId: string | null;
  isMapExpanded: boolean;
  mapCenter: { lat: number; lng: number } | null;
  mapZoom: number;

  // View preferences
  viewMode: 'list' | 'grid' | 'map';
  currency: string;
  language: string;

  // Modals
  activeModal: 'login' | 'signup' | 'search' | 'filters' | null;

  // Actions
  setHoveredListing: (id: string | null) => void;
  setSelectedListing: (id: string | null) => void;
  setMapExpanded: (expanded: boolean) => void;
  setMapView: (center: { lat: number; lng: number }, zoom: number) => void;
  setViewMode: (mode: 'list' | 'grid' | 'map') => void;
  setCurrency: (currency: string) => void;
  openModal: (modal: UIState['activeModal']) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        hoveredListingId: null,
        selectedListingId: null,
        isMapExpanded: false,
        mapCenter: null,
        mapZoom: 12,
        viewMode: 'list',
        currency: 'USD',
        language: 'en',
        activeModal: null,

        // Actions
        setHoveredListing: (id) => set({ hoveredListingId: id }),
        setSelectedListing: (id) => set({ selectedListingId: id }),
        setMapExpanded: (expanded) => set({ isMapExpanded: expanded }),
        setMapView: (center, zoom) => set({ mapCenter: center, mapZoom: zoom }),
        setViewMode: (mode) => set({ viewMode: mode }),
        setCurrency: (currency) => set({ currency }),
        openModal: (modal) => set({ activeModal: modal }),
        closeModal: () => set({ activeModal: null }),
      }),
      {
        name: 'travel-ui-storage',
        partialize: (state) => ({
          currency: state.currency,
          language: state.language,
          viewMode: state.viewMode,
        }),
      }
    ),
    { name: 'UIStore' }
  )
);
```

### Booking Flow State Machine

```typescript
// stores/booking.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

type BookingStep = 'dates' | 'guests' | 'details' | 'payment' | 'confirmation';

interface BookingState {
  // Current step
  step: BookingStep;

  // Listing being booked
  listingId: string | null;
  listing: Listing | null;

  // Booking details
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
  };

  // Guest information
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
  } | null;

  // Pricing
  pricing: {
    subtotal: number;
    cleaningFee: number;
    serviceFee: number;
    taxes: number;
    total: number;
  } | null;

  // Payment
  paymentMethod: 'card' | 'paypal' | null;
  paymentIntentId: string | null;

  // Status
  isSubmitting: boolean;
  error: string | null;
  bookingId: string | null;

  // Actions
  initBooking: (listingId: string, listing: Listing) => void;
  setDates: (checkIn: Date, checkOut: Date) => void;
  setGuests: (guests: BookingState['guests']) => void;
  setGuestInfo: (info: BookingState['guestInfo']) => void;
  setPricing: (pricing: BookingState['pricing']) => void;
  setPaymentMethod: (method: BookingState['paymentMethod']) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: BookingStep) => void;
  submitBooking: () => Promise<void>;
  reset: () => void;
}

const STEP_ORDER: BookingStep[] = ['dates', 'guests', 'details', 'payment', 'confirmation'];

export const useBookingStore = create<BookingState>()(
  devtools(
    (set, get) => ({
      // Initial state
      step: 'dates',
      listingId: null,
      listing: null,
      checkIn: null,
      checkOut: null,
      guests: { adults: 1, children: 0, infants: 0 },
      guestInfo: null,
      pricing: null,
      paymentMethod: null,
      paymentIntentId: null,
      isSubmitting: false,
      error: null,
      bookingId: null,

      // Actions
      initBooking: (listingId, listing) => set({
        listingId,
        listing,
        step: 'dates',
        error: null,
      }),

      setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),

      setGuests: (guests) => set({ guests }),

      setGuestInfo: (guestInfo) => set({ guestInfo }),

      setPricing: (pricing) => set({ pricing }),

      setPaymentMethod: (paymentMethod) => set({ paymentMethod }),

      nextStep: () => {
        const { step } = get();
        const currentIndex = STEP_ORDER.indexOf(step);
        if (currentIndex < STEP_ORDER.length - 1) {
          set({ step: STEP_ORDER[currentIndex + 1] });
        }
      },

      prevStep: () => {
        const { step } = get();
        const currentIndex = STEP_ORDER.indexOf(step);
        if (currentIndex > 0) {
          set({ step: STEP_ORDER[currentIndex - 1] });
        }
      },

      goToStep: (step) => set({ step }),

      submitBooking: async () => {
        const state = get();
        set({ isSubmitting: true, error: null });

        try {
          const response = await createBooking({
            listingId: state.listingId!,
            checkIn: state.checkIn!,
            checkOut: state.checkOut!,
            guests: state.guests,
            guestInfo: state.guestInfo!,
            paymentIntentId: state.paymentIntentId!,
          });

          set({
            bookingId: response.bookingId,
            step: 'confirmation',
            isSubmitting: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Booking failed',
            isSubmitting: false,
          });
        }
      },

      reset: () => set({
        step: 'dates',
        listingId: null,
        listing: null,
        checkIn: null,
        checkOut: null,
        guests: { adults: 1, children: 0, infants: 0 },
        guestInfo: null,
        pricing: null,
        paymentMethod: null,
        paymentIntentId: null,
        isSubmitting: false,
        error: null,
        bookingId: null,
      }),
    }),
    { name: 'BookingStore' }
  )
);
```

### Form State with React Hook Form

```typescript
// components/GuestInfoForm.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const guestInfoSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number required'),
  message: z.string().max(500).optional(),
  agreeToRules: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the house rules',
  }),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
});

type GuestInfoFormData = z.infer<typeof guestInfoSchema>;

export function GuestInfoForm({ onSubmit }: { onSubmit: (data: GuestInfoFormData) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestInfoFormData>({
    resolver: zodResolver(guestInfoSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
      agreeToRules: false,
      agreeToTerms: false,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">First name</label>
          <input
            {...register('firstName')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Last name</label>
          <input
            {...register('lastName')}
            className="w-full px-3 py-2 border rounded-lg"
          />
          {errors.lastName && (
            <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          {...register('email')}
          type="email"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone</label>
        <input
          {...register('phone')}
          type="tel"
          className="w-full px-3 py-2 border rounded-lg"
        />
        {errors.phone && (
          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Message to host (optional)
        </label>
        <textarea
          {...register('message')}
          rows={3}
          className="w-full px-3 py-2 border rounded-lg"
          placeholder="Tell the host about your trip..."
        />
      </div>

      <div className="space-y-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('agreeToRules')} />
          <span className="text-sm">I agree to the house rules</span>
        </label>
        {errors.agreeToRules && (
          <p className="text-red-500 text-sm">{errors.agreeToRules.message}</p>
        )}

        <label className="flex items-center gap-2">
          <input type="checkbox" {...register('agreeToTerms')} />
          <span className="text-sm">
            I agree to the terms of service and privacy policy
          </span>
        </label>
        {errors.agreeToTerms && (
          <p className="text-red-500 text-sm">{errors.agreeToTerms.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
      >
        {isSubmitting ? 'Saving...' : 'Continue'}
      </button>
    </form>
  );
}
```

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    SEARCH RESULTS PAGE DATA FLOW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User Actions                                                               │
│  ────────────                                                               │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────┐                                                        │
│  │   URL Update    │ ◄──────────────────────────────────────────────────┐  │
│  │   (nuqs)        │                                                     │  │
│  └────────┬────────┘                                                     │  │
│           │                                                              │  │
│           │ triggers                                                     │  │
│           ▼                                                              │  │
│  ┌─────────────────┐      ┌─────────────────┐                           │  │
│  │  React Query    │─────▶│   API Call      │                           │  │
│  │  useQuery       │      │   /api/search   │                           │  │
│  └────────┬────────┘      └────────┬────────┘                           │  │
│           │                        │                                     │  │
│           │ caches                 │ returns                             │  │
│           ▼                        ▼                                     │  │
│  ┌─────────────────┐      ┌─────────────────┐                           │  │
│  │  Query Cache    │◄─────│   Listings      │                           │  │
│  │                 │      │   Data          │                           │  │
│  └────────┬────────┘      └─────────────────┘                           │  │
│           │                                                              │  │
│           │ renders                                                      │  │
│           ▼                                                              │  │
│  ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │                       COMPONENTS                                 │    │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  │    │  │
│  │  │   FilterPanel   │  │   ListingGrid   │  │    MapView      │  │    │  │
│  │  │                 │  │                 │  │                 │  │    │  │
│  │  │  • Reads URL    │  │  • Reads Query  │  │  • Reads Query  │  │    │  │
│  │  │  • Updates URL  │──│  • Zustand sync │──│  • Zustand sync │  │    │  │
│  │  │                 │  │                 │  │  • Updates URL  │──┼────┘  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘  │       │
│  │                              ▲                    ▲              │       │
│  │                              │                    │              │       │
│  │                              └────────────────────┘              │       │
│  │                            Zustand (hover sync)                  │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. API Design

### API Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FRONTEND API ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      NEXT.JS FRONTEND                                │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │                    API CLIENT LAYER                          │    │   │
│  │  │  • Type-safe API calls                                       │    │   │
│  │  │  • Request/Response interceptors                             │    │   │
│  │  │  • Error transformation                                      │    │   │
│  │  │  • Auth token management                                     │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     BFF (Backend for Frontend)                       │   │
│  │  ┌─────────────────────────────────────────────────────────────┐    │   │
│  │  │                   Next.js API Routes                         │    │   │
│  │  │  /api/search      → Aggregate search + map data              │    │   │
│  │  │  /api/listings/*  → Listing details, availability            │    │   │
│  │  │  /api/bookings/*  → Booking flow, payments                   │    │   │
│  │  │  /api/user/*      → Auth, wishlists, trips                   │    │   │
│  │  └─────────────────────────────────────────────────────────────┘    │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      BACKEND MICROSERVICES                           │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐   │   │
│  │  │ Search  │  │Listings │  │Bookings │  │ Users   │  │Payments │   │   │
│  │  │ Service │  │ Service │  │ Service │  │ Service │  │ Service │   │   │
│  │  └─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘   │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Type-Safe API Client

```typescript
// lib/api/client.ts
import { z } from 'zod';

// Base configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

// Generic fetch wrapper with type safety
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  schema?: z.ZodType<T>
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add auth token if available
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new APIError(response.status, error.message || 'Request failed', error);
  }

  const data = await response.json();

  // Validate response with Zod schema if provided
  if (schema) {
    const result = schema.safeParse(data);
    if (!result.success) {
      console.error('API Response validation failed:', result.error);
      throw new APIError(500, 'Invalid response format');
    }
    return result.data;
  }

  return data as T;
}

// Custom API Error class
export class APIError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// HTTP methods
export const api = {
  get: <T>(endpoint: string, schema?: z.ZodType<T>) =>
    apiRequest<T>(endpoint, { method: 'GET' }, schema),

  post: <T>(endpoint: string, body: unknown, schema?: z.ZodType<T>) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }, schema),

  put: <T>(endpoint: string, body: unknown, schema?: z.ZodType<T>) =>
    apiRequest<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }, schema),

  patch: <T>(endpoint: string, body: unknown, schema?: z.ZodType<T>) =>
    apiRequest<T>(endpoint, { method: 'PATCH', body: JSON.stringify(body) }, schema),

  delete: <T>(endpoint: string, schema?: z.ZodType<T>) =>
    apiRequest<T>(endpoint, { method: 'DELETE' }, schema),
};
```

### API Endpoints & Response Types

```typescript
// lib/api/types.ts
import { z } from 'zod';

// ==========================================
// COMMON SCHEMAS
// ==========================================

const PaginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  hasMore: z.boolean(),
});

const CoordinatesSchema = z.object({
  lat: z.number(),
  lng: z.number(),
});

const PriceSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

// ==========================================
// SEARCH API
// ==========================================

export const SearchRequestSchema = z.object({
  // Location
  location: z.string().optional(),
  placeId: z.string().optional(),
  bounds: z.object({
    ne: CoordinatesSchema,
    sw: CoordinatesSchema,
  }).optional(),

  // Dates
  checkIn: z.string().optional(), // YYYY-MM-DD
  checkOut: z.string().optional(),

  // Guests
  adults: z.number().default(1),
  children: z.number().default(0),
  infants: z.number().default(0),
  pets: z.number().default(0),

  // Filters
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  propertyTypes: z.array(z.string()).optional(),
  bedrooms: z.number().optional(),
  beds: z.number().optional(),
  bathrooms: z.number().optional(),
  amenities: z.array(z.string()).optional(),
  instantBook: z.boolean().optional(),
  superhost: z.boolean().optional(),

  // Pagination & Sort
  page: z.number().default(1),
  limit: z.number().default(20),
  sort: z.enum(['relevance', 'price_low', 'price_high', 'rating']).default('relevance'),
});

export type SearchRequest = z.infer<typeof SearchRequestSchema>;

export const ListingSummarySchema = z.object({
  id: z.string(),
  title: z.string(),
  propertyType: z.string(),
  location: z.object({
    city: z.string(),
    country: z.string(),
    coordinates: CoordinatesSchema,
  }),
  images: z.array(z.string()),
  price: PriceSchema.extend({
    originalPrice: z.number().optional(), // For discounts
  }),
  rating: z.number(),
  reviewCount: z.number(),
  isSuperhost: z.boolean(),
  instantBook: z.boolean(),
  amenities: z.array(z.string()),
});

export type ListingSummary = z.infer<typeof ListingSummarySchema>;

export const SearchResponseSchema = z.object({
  listings: z.array(ListingSummarySchema),
  pagination: PaginationSchema,
  mapData: z.object({
    center: CoordinatesSchema,
    zoom: z.number(),
    bounds: z.object({
      ne: CoordinatesSchema,
      sw: CoordinatesSchema,
    }),
  }),
  filters: z.object({
    priceRange: z.object({
      min: z.number(),
      max: z.number(),
      average: z.number(),
    }),
    propertyTypeCounts: z.record(z.number()),
    amenityCounts: z.record(z.number()),
  }),
});

export type SearchResponse = z.infer<typeof SearchResponseSchema>;

// ==========================================
// LISTING DETAIL API
// ==========================================

export const ListingDetailSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  propertyType: z.string(),

  host: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    isSuperhost: z.boolean(),
    responseRate: z.number(),
    responseTime: z.string(),
    memberSince: z.string(),
    reviewCount: z.number(),
  }),

  location: z.object({
    address: z.string(),
    city: z.string(),
    country: z.string(),
    coordinates: CoordinatesSchema,
    neighborhood: z.string().optional(),
  }),

  images: z.array(z.object({
    url: z.string(),
    caption: z.string().optional(),
    type: z.enum(['main', 'room', 'amenity', 'view']).optional(),
  })),

  details: z.object({
    guests: z.number(),
    bedrooms: z.number(),
    beds: z.number(),
    bathrooms: z.number(),
  }),

  amenities: z.array(z.object({
    id: z.string(),
    name: z.string(),
    icon: z.string(),
    category: z.string(),
  })),

  pricing: z.object({
    basePrice: z.number(),
    currency: z.string(),
    cleaningFee: z.number(),
    serviceFee: z.number(),
    weeklyDiscount: z.number().optional(),
    monthlyDiscount: z.number().optional(),
  }),

  rules: z.object({
    checkInTime: z.string(),
    checkOutTime: z.string(),
    minNights: z.number(),
    maxNights: z.number(),
    maxGuests: z.number(),
    petsAllowed: z.boolean(),
    smokingAllowed: z.boolean(),
    eventsAllowed: z.boolean(),
    quietHours: z.string().optional(),
  }),

  cancellation: z.object({
    policy: z.enum(['flexible', 'moderate', 'strict', 'super_strict']),
    description: z.string(),
    refundDeadline: z.number(), // Days before check-in
  }),

  rating: z.number(),
  reviewCount: z.number(),
  instantBook: z.boolean(),

  createdAt: z.string(),
  updatedAt: z.string(),
});

export type ListingDetail = z.infer<typeof ListingDetailSchema>;

// ==========================================
// AVAILABILITY API
// ==========================================

export const AvailabilityResponseSchema = z.object({
  listingId: z.string(),
  calendar: z.array(z.object({
    date: z.string(), // YYYY-MM-DD
    available: z.boolean(),
    price: z.number().optional(),
    minNights: z.number().optional(),
  })),
  blockedDates: z.array(z.string()),
  minDate: z.string(),
  maxDate: z.string(),
});

export type AvailabilityResponse = z.infer<typeof AvailabilityResponseSchema>;

// ==========================================
// PRICING API
// ==========================================

export const PricingRequestSchema = z.object({
  listingId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.object({
    adults: z.number(),
    children: z.number(),
    infants: z.number(),
  }),
  couponCode: z.string().optional(),
});

export const PricingResponseSchema = z.object({
  nights: z.number(),
  pricePerNight: z.number(),
  subtotal: z.number(),
  cleaningFee: z.number(),
  serviceFee: z.number(),
  taxes: z.number(),
  discount: z.object({
    type: z.enum(['weekly', 'monthly', 'coupon', 'special']),
    amount: z.number(),
    description: z.string(),
  }).optional(),
  total: z.number(),
  currency: z.string(),
  breakdown: z.array(z.object({
    date: z.string(),
    price: z.number(),
  })),
});

export type PricingResponse = z.infer<typeof PricingResponseSchema>;

// ==========================================
// BOOKING API
// ==========================================

export const CreateBookingRequestSchema = z.object({
  listingId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.object({
    adults: z.number(),
    children: z.number(),
    infants: z.number(),
  }),
  guestInfo: z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    phone: z.string(),
    message: z.string().optional(),
  }),
  paymentIntentId: z.string(),
  specialRequests: z.string().optional(),
});

export const BookingResponseSchema = z.object({
  id: z.string(),
  confirmationCode: z.string(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
  listing: ListingSummarySchema,
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.object({
    adults: z.number(),
    children: z.number(),
    infants: z.number(),
  }),
  pricing: PricingResponseSchema,
  host: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    phone: z.string().optional(),
  }),
  createdAt: z.string(),
  cancelledAt: z.string().optional(),
});

export type BookingResponse = z.infer<typeof BookingResponseSchema>;

// ==========================================
// REVIEWS API
// ==========================================

export const ReviewSchema = z.object({
  id: z.string(),
  author: z.object({
    id: z.string(),
    name: z.string(),
    avatar: z.string(),
    location: z.string().optional(),
  }),
  rating: z.number(),
  ratings: z.object({
    cleanliness: z.number(),
    accuracy: z.number(),
    communication: z.number(),
    location: z.number(),
    checkIn: z.number(),
    value: z.number(),
  }),
  comment: z.string(),
  response: z.object({
    text: z.string(),
    date: z.string(),
  }).optional(),
  date: z.string(),
  stayDate: z.string(),
  photos: z.array(z.string()).optional(),
});

export const ReviewsResponseSchema = z.object({
  reviews: z.array(ReviewSchema),
  pagination: PaginationSchema,
  summary: z.object({
    averageRating: z.number(),
    totalCount: z.number(),
    ratings: z.object({
      cleanliness: z.number(),
      accuracy: z.number(),
      communication: z.number(),
      location: z.number(),
      checkIn: z.number(),
      value: z.number(),
    }),
    distribution: z.object({
      5: z.number(),
      4: z.number(),
      3: z.number(),
      2: z.number(),
      1: z.number(),
    }),
  }),
});

export type ReviewsResponse = z.infer<typeof ReviewsResponseSchema>;
```

### API Service Functions

```typescript
// lib/api/services/listings.ts
import { api } from '../client';
import {
  SearchRequest,
  SearchResponse,
  SearchResponseSchema,
  ListingDetail,
  ListingDetailSchema,
  AvailabilityResponse,
  AvailabilityResponseSchema,
  PricingResponse,
  PricingResponseSchema,
  ReviewsResponse,
  ReviewsResponseSchema,
} from '../types';

export async function searchListings(params: SearchRequest): Promise<SearchResponse> {
  const queryString = new URLSearchParams(
    Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== null)
      .map(([k, v]) => [k, Array.isArray(v) ? v.join(',') : String(v)])
  ).toString();

  return api.get<SearchResponse>(`/search?${queryString}`, SearchResponseSchema);
}

export async function getListingDetail(id: string): Promise<ListingDetail> {
  return api.get<ListingDetail>(`/listings/${id}`, ListingDetailSchema);
}

export async function getAvailability(listingId: string): Promise<AvailabilityResponse> {
  return api.get<AvailabilityResponse>(
    `/listings/${listingId}/availability`,
    AvailabilityResponseSchema
  );
}

export async function getPricing(
  listingId: string,
  params: {
    checkIn: string;
    checkOut: string;
    guests: { adults: number; children: number };
    couponCode?: string;
  }
): Promise<PricingResponse> {
  const queryString = new URLSearchParams({
    checkIn: params.checkIn,
    checkOut: params.checkOut,
    adults: params.guests.adults.toString(),
    children: params.guests.children.toString(),
    ...(params.couponCode && { couponCode: params.couponCode }),
  }).toString();

  return api.get<PricingResponse>(
    `/listings/${listingId}/pricing?${queryString}`,
    PricingResponseSchema
  );
}

export async function getReviews(
  listingId: string,
  params: { page?: number; limit?: number; sort?: 'recent' | 'rating' }
): Promise<ReviewsResponse> {
  const queryString = new URLSearchParams({
    page: (params.page || 1).toString(),
    limit: (params.limit || 10).toString(),
    sort: params.sort || 'recent',
  }).toString();

  return api.get<ReviewsResponse>(
    `/listings/${listingId}/reviews?${queryString}`,
    ReviewsResponseSchema
  );
}
```

```typescript
// lib/api/services/bookings.ts
import { api } from '../client';
import { BookingResponse, BookingResponseSchema } from '../types';

export async function createBooking(data: {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number; infants: number };
  guestInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message?: string;
  };
  paymentIntentId: string;
}): Promise<BookingResponse> {
  return api.post<BookingResponse>('/bookings', data, BookingResponseSchema);
}

export async function getBooking(id: string): Promise<BookingResponse> {
  return api.get<BookingResponse>(`/bookings/${id}`, BookingResponseSchema);
}

export async function getUserBookings(params: {
  status?: 'upcoming' | 'past' | 'cancelled';
  page?: number;
}): Promise<{ bookings: BookingResponse[]; pagination: any }> {
  const queryString = new URLSearchParams({
    ...(params.status && { status: params.status }),
    page: (params.page || 1).toString(),
  }).toString();

  return api.get(`/user/bookings?${queryString}`);
}

export async function cancelBooking(
  id: string,
  reason?: string
): Promise<{ success: boolean; refundAmount: number }> {
  return api.post(`/bookings/${id}/cancel`, { reason });
}
```

### BFF API Routes (Next.js)

```typescript
// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { searchParamsCache } from '@/lib/search-params';
import { SearchResponseSchema } from '@/lib/api/types';

export async function GET(request: NextRequest) {
  try {
    // Parse and validate search params
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const params = searchParamsCache.parse(searchParams);

    // Aggregate data from multiple backend services
    const [listings, mapData, filterStats] = await Promise.all([
      fetchListingsFromBackend(params),
      fetchMapDataFromBackend(params),
      fetchFilterStatsFromBackend(params),
    ]);

    // Transform for frontend consumption
    const response = {
      listings: listings.items.map(transformListing),
      pagination: {
        page: params.page,
        limit: 20,
        total: listings.total,
        hasMore: listings.hasMore,
      },
      mapData: {
        center: mapData.center,
        zoom: mapData.zoom,
        bounds: mapData.bounds,
      },
      filters: {
        priceRange: filterStats.priceRange,
        propertyTypeCounts: filterStats.propertyTypes,
        amenityCounts: filterStats.amenities,
      },
    };

    // Validate response before sending
    const validated = SearchResponseSchema.parse(response);

    return NextResponse.json(validated, {
      headers: {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    );
  }
}

function transformListing(backendListing: any) {
  return {
    id: backendListing.id,
    title: backendListing.name,
    propertyType: backendListing.property_type,
    location: {
      city: backendListing.city,
      country: backendListing.country,
      coordinates: {
        lat: backendListing.latitude,
        lng: backendListing.longitude,
      },
    },
    images: backendListing.photos.map((p: any) => p.url),
    price: {
      amount: backendListing.price_per_night,
      currency: backendListing.currency,
      originalPrice: backendListing.original_price,
    },
    rating: backendListing.average_rating,
    reviewCount: backendListing.review_count,
    isSuperhost: backendListing.host.is_superhost,
    instantBook: backendListing.instant_book_enabled,
    amenities: backendListing.amenities.map((a: any) => a.name),
  };
}
```

```typescript
// app/api/listings/[id]/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { addMonths, format, eachDayOfInterval } from 'date-fns';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const listingId = params.id;

    // Fetch from backend
    const [calendar, bookings] = await Promise.all([
      fetchCalendarFromBackend(listingId),
      fetchBookingsFromBackend(listingId),
    ]);

    // Generate 12-month calendar
    const today = new Date();
    const endDate = addMonths(today, 12);

    const calendarData = eachDayOfInterval({ start: today, end: endDate }).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const calendarEntry = calendar.find((c: any) => c.date === dateStr);
      const isBooked = bookings.some((b: any) =>
        dateStr >= b.check_in && dateStr < b.check_out
      );

      return {
        date: dateStr,
        available: !isBooked && (calendarEntry?.available ?? true),
        price: calendarEntry?.custom_price || calendarEntry?.base_price,
        minNights: calendarEntry?.min_nights,
      };
    });

    const blockedDates = calendarData
      .filter(d => !d.available)
      .map(d => d.date);

    return NextResponse.json({
      listingId,
      calendar: calendarData,
      blockedDates,
      minDate: format(today, 'yyyy-MM-dd'),
      maxDate: format(endDate, 'yyyy-MM-dd'),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('Availability API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
```

### Real-time Availability WebSocket

```typescript
// lib/api/realtime.ts
import { useEffect, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

class AvailabilityWebSocket {
  private ws: WebSocket | null = null;
  private listeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectTimeout: NodeJS.Timeout | null = null;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) return;

    this.ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!);

    this.ws.onopen = () => {
      console.log('Availability WebSocket connected');
      // Resubscribe to all listings
      this.listeners.forEach((_, listingId) => {
        this.subscribe(listingId);
      });
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'availability_update') {
        const listeners = this.listeners.get(data.listingId);
        listeners?.forEach(listener => listener(data));
      }
    };

    this.ws.onclose = () => {
      console.log('Availability WebSocket disconnected');
      // Attempt reconnection
      this.reconnectTimeout = setTimeout(() => this.connect(), 3000);
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }

  subscribe(listingId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        listingId,
      }));
    }
  }

  unsubscribe(listingId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'unsubscribe',
        listingId,
      }));
    }
    this.listeners.delete(listingId);
  }

  addListener(listingId: string, callback: (data: any) => void) {
    if (!this.listeners.has(listingId)) {
      this.listeners.set(listingId, new Set());
      this.subscribe(listingId);
    }
    this.listeners.get(listingId)!.add(callback);
  }

  removeListener(listingId: string, callback: (data: any) => void) {
    this.listeners.get(listingId)?.delete(callback);
    if (this.listeners.get(listingId)?.size === 0) {
      this.unsubscribe(listingId);
    }
  }

  disconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
    this.ws = null;
  }
}

export const availabilityWS = new AvailabilityWebSocket();

// Hook for real-time availability updates
export function useRealtimeAvailability(listingId: string) {
  const queryClient = useQueryClient();

  const handleUpdate = useCallback((data: any) => {
    // Invalidate and refetch availability
    queryClient.invalidateQueries({
      queryKey: ['listings', 'availability', listingId],
    });

    // Optimistically update if dates are blocked
    if (data.blockedDates) {
      queryClient.setQueryData(
        ['listings', 'availability', listingId],
        (old: any) => ({
          ...old,
          blockedDates: [...new Set([...old.blockedDates, ...data.blockedDates])],
        })
      );
    }
  }, [listingId, queryClient]);

  useEffect(() => {
    availabilityWS.connect();
    availabilityWS.addListener(listingId, handleUpdate);

    return () => {
      availabilityWS.removeListener(listingId, handleUpdate);
    };
  }, [listingId, handleUpdate]);
}
```

---

## 6. Search & Filtering System

### Search Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SEARCH SYSTEM ARCHITECTURE                           │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  User Input                                                                 │
│  ──────────                                                                 │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      LOCATION AUTOCOMPLETE                           │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │   │
│  │  │  Google Places  │  │  Mapbox Search  │  │  Custom Index   │      │   │
│  │  │    API          │  │    API          │  │  (Popular dest) │      │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     URL STATE SYNC (nuqs)                            │   │
│  │  ?location=paris&placeId=xxx&checkIn=2024-06-01&guests=2            │   │
│  │  &minPrice=50&maxPrice=200&amenities=wifi,pool                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    DEBOUNCED API REQUEST                             │   │
│  │  • Debounce 300ms for filter changes                                 │   │
│  │  • Immediate for explicit search actions                             │   │
│  │  • Request deduplication via React Query                             │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌────────────────────────┬────────────────────────────────────────────┐   │
│  │   RESULTS RENDERING    │           MAP SYNCHRONIZATION               │   │
│  │  ┌──────────────────┐  │  ┌────────────────────────────────────┐    │   │
│  │  │ Virtualized List │◄─┼──│ Marker Clustering + Price Labels   │    │   │
│  │  │ + Infinite Scroll│  │  │ Viewport-based loading             │    │   │
│  │  └──────────────────┘  │  └────────────────────────────────────┘    │   │
│  └────────────────────────┴────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Location Autocomplete with Google Places

```typescript
// components/LocationInput/LocationInput.tsx
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { MapPin, Clock, Compass } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationInputProps {
  value: string;
  onSelect: (place: google.maps.places.PlaceResult) => void;
  placeholder?: string;
  className?: string;
}

interface Suggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
}

// Popular destinations for empty state
const POPULAR_DESTINATIONS = [
  { name: 'Paris, France', placeId: 'ChIJD7fiBh9u5kcRYJSMaLOY-0M', icon: '🗼' },
  { name: 'London, UK', placeId: 'ChIJdd4hrwug2EcRmSrV3Vo6llI', icon: '🎡' },
  { name: 'New York, USA', placeId: 'ChIJOwg_06VPwokRYv534QaPC8g', icon: '🗽' },
  { name: 'Tokyo, Japan', placeId: 'ChIJ51cu8IcbXWARiRtXIothAS4', icon: '🗾' },
  { name: 'Dubai, UAE', placeId: 'ChIJRcbZaklDXz4RYlEphFBu5r0', icon: '🏙️' },
];

export function LocationInput({
  value,
  onSelect,
  placeholder = 'Search destinations',
  className,
}: LocationInputProps) {
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Suggestion[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Initialize Google Places services
  useEffect(() => {
    if (typeof google !== 'undefined') {
      autocompleteService.current = new google.maps.places.AutocompleteService();
      const mapDiv = document.createElement('div');
      placesService.current = new google.maps.places.PlacesService(mapDiv);
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    }

    // Load recent searches from localStorage
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5));
    }
  }, []);

  // Debounce search query
  const debouncedQuery = useDebounce(inputValue, 300);

  // Fetch suggestions
  useEffect(() => {
    if (!debouncedQuery || debouncedQuery.length < 2 || !autocompleteService.current) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    autocompleteService.current.getPlacePredictions(
      {
        input: debouncedQuery,
        types: ['(cities)', '(regions)'], // Cities and regions only
        sessionToken: sessionToken.current!,
      },
      (predictions, status) => {
        setIsLoading(false);

        if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(
            predictions.map((p) => ({
              placeId: p.place_id,
              description: p.description,
              mainText: p.structured_formatting.main_text,
              secondaryText: p.structured_formatting.secondary_text,
              types: p.types,
            }))
          );
        } else {
          setSuggestions([]);
        }
      }
    );
  }, [debouncedQuery]);

  // Handle selection
  const handleSelect = useCallback(
    (suggestion: Suggestion) => {
      if (!placesService.current) return;

      // Get place details
      placesService.current.getDetails(
        {
          placeId: suggestion.placeId,
          fields: ['place_id', 'formatted_address', 'geometry', 'name', 'types'],
          sessionToken: sessionToken.current!,
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            onSelect(place);
            setInputValue(place.formatted_address || suggestion.description);
            setIsOpen(false);

            // Save to recent searches
            const updated = [
              suggestion,
              ...recentSearches.filter((s) => s.placeId !== suggestion.placeId),
            ].slice(0, 5);
            setRecentSearches(updated);
            localStorage.setItem('recentSearches', JSON.stringify(updated));

            // Reset session token for next search
            sessionToken.current = new google.maps.places.AutocompleteSessionToken();
          }
        }
      );
    },
    [onSelect, recentSearches]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const items = suggestions.length > 0 ? suggestions : recentSearches;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => Math.min(prev + 1, items.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => Math.max(prev - 1, -1));
          break;
        case 'Enter':
          e.preventDefault();
          if (selectedIndex >= 0 && items[selectedIndex]) {
            handleSelect(items[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          break;
      }
    },
    [suggestions, recentSearches, selectedIndex, handleSelect]
  );

  // Use current location
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode(
          {
            location: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
          (results, status) => {
            if (status === 'OK' && results?.[0]) {
              onSelect(results[0] as any);
              setInputValue(results[0].formatted_address || 'Current location');
              setIsOpen(false);
            }
          }
        );
      },
      (error) => {
        console.error('Geolocation error:', error);
      }
    );
  }, [onSelect]);

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
          setIsOpen(true);
          setSelectedIndex(-1);
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full bg-transparent border-none outline-none text-sm"
        role="combobox"
        aria-expanded={isOpen}
        aria-autocomplete="list"
        aria-controls="location-suggestions"
      />

      {isOpen && (
        <div
          id="location-suggestions"
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border max-h-96 overflow-y-auto z-50"
          role="listbox"
        >
          {/* Current Location Option */}
          <button
            onClick={handleUseCurrentLocation}
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
          >
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-medium">Use current location</span>
          </button>

          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
          )}

          {/* Suggestions */}
          {suggestions.length > 0 && (
            <div className="border-t">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion.placeId}
                  onClick={() => handleSelect(suggestion)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left',
                    selectedIndex === index && 'bg-gray-50'
                  )}
                  role="option"
                  aria-selected={selectedIndex === index}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{suggestion.mainText}</div>
                    <div className="text-sm text-gray-500">{suggestion.secondaryText}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches (when no query) */}
          {!inputValue && recentSearches.length > 0 && (
            <div className="border-t">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Recent searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={search.placeId}
                  onClick={() => handleSelect(search)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left',
                    selectedIndex === index && 'bg-gray-50'
                  )}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-medium">{search.mainText}</div>
                    <div className="text-sm text-gray-500">{search.secondaryText}</div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Popular Destinations (when no query and no recent) */}
          {!inputValue && recentSearches.length === 0 && (
            <div className="border-t">
              <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">
                Popular destinations
              </div>
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.placeId}
                  onClick={() =>
                    handleSelect({
                      placeId: dest.placeId,
                      description: dest.name,
                      mainText: dest.name.split(',')[0],
                      secondaryText: dest.name.split(',')[1]?.trim() || '',
                      types: ['locality'],
                    })
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-left"
                >
                  <span className="text-2xl">{dest.icon}</span>
                  <span className="font-medium">{dest.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
```

### Filter System Implementation

```typescript
// hooks/useFilters.ts
import { useCallback, useMemo } from 'react';
import { useQueryStates, parseAsArrayOf, parseAsString, parseAsInteger } from 'nuqs';

interface FilterConfig {
  minPrice: number | null;
  maxPrice: number | null;
  propertyTypes: string[];
  bedrooms: number | null;
  beds: number | null;
  bathrooms: number | null;
  amenities: string[];
  instantBook: boolean;
  superhost: boolean;
}

export function useFilters() {
  const [filters, setFilters] = useQueryStates({
    minPrice: parseAsInteger,
    maxPrice: parseAsInteger,
    propertyTypes: parseAsArrayOf(parseAsString).withDefault([]),
    bedrooms: parseAsInteger,
    beds: parseAsInteger,
    bathrooms: parseAsInteger,
    amenities: parseAsArrayOf(parseAsString).withDefault([]),
    instantBook: parseAsString,
    superhost: parseAsString,
  });

  // Computed properties
  const activeFilters = useMemo(() => {
    const active: string[] = [];

    if (filters.minPrice || filters.maxPrice) {
      if (filters.minPrice && filters.maxPrice) {
        active.push(`$${filters.minPrice} - $${filters.maxPrice}`);
      } else if (filters.minPrice) {
        active.push(`$${filters.minPrice}+`);
      } else {
        active.push(`Up to $${filters.maxPrice}`);
      }
    }

    filters.propertyTypes.forEach((type) => active.push(type));
    filters.amenities.forEach((amenity) => active.push(amenity));

    if (filters.bedrooms) active.push(`${filters.bedrooms}+ bedrooms`);
    if (filters.beds) active.push(`${filters.beds}+ beds`);
    if (filters.bathrooms) active.push(`${filters.bathrooms}+ baths`);
    if (filters.instantBook === 'true') active.push('Instant Book');
    if (filters.superhost === 'true') active.push('Superhost');

    return active;
  }, [filters]);

  const hasFilters = activeFilters.length > 0;

  // Filter actions
  const setPriceRange = useCallback(
    (min: number | null, max: number | null) => {
      setFilters({ minPrice: min, maxPrice: max });
    },
    [setFilters]
  );

  const togglePropertyType = useCallback(
    (type: string) => {
      setFilters((prev) => ({
        propertyTypes: prev.propertyTypes.includes(type)
          ? prev.propertyTypes.filter((t) => t !== type)
          : [...prev.propertyTypes, type],
      }));
    },
    [setFilters]
  );

  const toggleAmenity = useCallback(
    (amenity: string) => {
      setFilters((prev) => ({
        amenities: prev.amenities.includes(amenity)
          ? prev.amenities.filter((a) => a !== amenity)
          : [...prev.amenities, amenity],
      }));
    },
    [setFilters]
  );

  const setRoomCount = useCallback(
    (type: 'bedrooms' | 'beds' | 'bathrooms', value: number | null) => {
      setFilters({ [type]: value });
    },
    [setFilters]
  );

  const toggleInstantBook = useCallback(() => {
    setFilters((prev) => ({
      instantBook: prev.instantBook === 'true' ? null : 'true',
    }));
  }, [setFilters]);

  const toggleSuperhost = useCallback(() => {
    setFilters((prev) => ({
      superhost: prev.superhost === 'true' ? null : 'true',
    }));
  }, [setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({
      minPrice: null,
      maxPrice: null,
      propertyTypes: [],
      bedrooms: null,
      beds: null,
      bathrooms: null,
      amenities: [],
      instantBook: null,
      superhost: null,
    });
  }, [setFilters]);

  const removeFilter = useCallback(
    (filter: string) => {
      // Handle price range
      if (filter.includes('$')) {
        setFilters({ minPrice: null, maxPrice: null });
        return;
      }

      // Handle property types
      if (filters.propertyTypes.includes(filter)) {
        togglePropertyType(filter);
        return;
      }

      // Handle amenities
      if (filters.amenities.includes(filter)) {
        toggleAmenity(filter);
        return;
      }

      // Handle room counts
      if (filter.includes('bedrooms')) setFilters({ bedrooms: null });
      if (filter.includes('beds')) setFilters({ beds: null });
      if (filter.includes('baths')) setFilters({ bathrooms: null });

      // Handle toggles
      if (filter === 'Instant Book') setFilters({ instantBook: null });
      if (filter === 'Superhost') setFilters({ superhost: null });
    },
    [filters, setFilters, togglePropertyType, toggleAmenity]
  );

  return {
    filters,
    activeFilters,
    hasFilters,
    setPriceRange,
    togglePropertyType,
    toggleAmenity,
    setRoomCount,
    toggleInstantBook,
    toggleSuperhost,
    clearFilters,
    removeFilter,
  };
}
```

### Price Range Slider Component

```typescript
// components/PriceRangeSlider/PriceRangeSlider.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import * as Slider from '@radix-ui/react-slider';
import { useDebounce } from '@/hooks/useDebounce';

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: { min: number | null; max: number | null };
  onChange: (value: { min: number | null; max: number | null }) => void;
  histogram?: number[]; // Price distribution for visualization
  currency?: string;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  histogram = [],
  currency = 'USD',
}: PriceRangeSliderProps) {
  const [localValue, setLocalValue] = useState([
    value.min ?? min,
    value.max ?? max,
  ]);

  const debouncedValue = useDebounce(localValue, 300);

  // Sync debounced value to parent
  useEffect(() => {
    onChange({
      min: debouncedValue[0] === min ? null : debouncedValue[0],
      max: debouncedValue[1] === max ? null : debouncedValue[1],
    });
  }, [debouncedValue, min, max, onChange]);

  // Format currency
  const formatPrice = useCallback(
    (price: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        maximumFractionDigits: 0,
      }).format(price);
    },
    [currency]
  );

  // Calculate histogram bar heights
  const maxCount = Math.max(...histogram, 1);
  const histogramBars = useMemo(() => {
    if (histogram.length === 0) return [];

    const step = (max - min) / histogram.length;
    return histogram.map((count, index) => {
      const barMin = min + step * index;
      const barMax = min + step * (index + 1);
      const isInRange = barMax >= localValue[0] && barMin <= localValue[1];

      return {
        height: (count / maxCount) * 100,
        isInRange,
      };
    });
  }, [histogram, min, max, localValue, maxCount]);

  return (
    <div className="space-y-4">
      {/* Price inputs */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-gray-500">Minimum</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={localValue[0]}
              onChange={(e) =>
                setLocalValue([Number(e.target.value), localValue[1]])
              }
              className="w-full pl-8 pr-3 py-2 border rounded-lg"
              min={min}
              max={localValue[1]}
            />
          </div>
        </div>
        <span className="text-gray-400 mt-6">—</span>
        <div className="flex-1">
          <label className="text-xs text-gray-500">Maximum</label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              $
            </span>
            <input
              type="number"
              value={localValue[1]}
              onChange={(e) =>
                setLocalValue([localValue[0], Number(e.target.value)])
              }
              className="w-full pl-8 pr-3 py-2 border rounded-lg"
              min={localValue[0]}
              max={max}
            />
            {localValue[1] >= max && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                +
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Histogram */}
      {histogramBars.length > 0 && (
        <div className="h-16 flex items-end gap-px">
          {histogramBars.map((bar, index) => (
            <div
              key={index}
              className={cn(
                'flex-1 rounded-t-sm transition-colors',
                bar.isInRange ? 'bg-gray-800' : 'bg-gray-200'
              )}
              style={{ height: `${Math.max(bar.height, 2)}%` }}
            />
          ))}
        </div>
      )}

      {/* Slider */}
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={localValue}
        onValueChange={setLocalValue}
        min={min}
        max={max}
        step={10}
        minStepsBetweenThumbs={1}
      >
        <Slider.Track className="bg-gray-200 relative grow rounded-full h-1">
          <Slider.Range className="absolute bg-gray-800 rounded-full h-full" />
        </Slider.Track>
        <Slider.Thumb
          className="block w-6 h-6 bg-white border-2 border-gray-800 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Minimum price"
        />
        <Slider.Thumb
          className="block w-6 h-6 bg-white border-2 border-gray-800 rounded-full hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
          aria-label="Maximum price"
        />
      </Slider.Root>

      {/* Range labels */}
      <div className="flex justify-between text-sm text-gray-500">
        <span>{formatPrice(localValue[0])}</span>
        <span>
          {formatPrice(localValue[1])}
          {localValue[1] >= max && '+'}
        </span>
      </div>
    </div>
  );
}
```

### Search Results with Infinite Scroll

```typescript
// components/SearchResults/SearchResults.tsx
'use client';

import { useRef, useCallback, useEffect } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useSearchListingsInfinite } from '@/lib/api/queries';
import { useSearchParams } from '@/hooks/useSearchParams';
import { useUIStore } from '@/stores/ui';
import { ListingCard } from '../ListingCard';
import { ListingCardSkeleton } from '../ListingCard/Skeleton';

export function SearchResults() {
  const { params } = useSearchParams();
  const { setHoveredListing, hoveredListingId } = useUIStore();
  const parentRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useSearchListingsInfinite(params);

  // Flatten paginated data
  const listings = data?.pages.flatMap((page) => page.listings) ?? [];

  // Virtual list for performance
  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? listings.length + 1 : listings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 380, // Estimated card height
    overscan: 5,
  });

  // Infinite scroll trigger
  useEffect(() => {
    const [lastItem] = [...rowVirtualizer.getVirtualItems()].reverse();

    if (!lastItem) return;

    if (
      lastItem.index >= listings.length - 1 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  }, [
    hasNextPage,
    fetchNextPage,
    listings.length,
    isFetchingNextPage,
    rowVirtualizer.getVirtualItems(),
  ]);

  // Scroll to listing when map marker is clicked
  const scrollToListing = useCallback((listingId: string) => {
    const index = listings.findIndex((l) => l.id === listingId);
    if (index !== -1) {
      rowVirtualizer.scrollToIndex(index, { align: 'start' });
    }
  }, [listings, rowVirtualizer]);

  // Expose scroll function to map
  useEffect(() => {
    window.scrollToListing = scrollToListing;
    return () => {
      delete window.scrollToListing;
    };
  }, [scrollToListing]);

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load listings</p>
          <button
            onClick={() => window.location.reload()}
            className="text-primary underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <ListingCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No listings found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-[calc(100vh-200px)] overflow-auto">
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const listing = listings[virtualRow.index];
          const isLoaderRow = virtualRow.index > listings.length - 1;

          if (isLoaderRow) {
            return (
              <div
                key="loader"
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
                className="flex items-center justify-center"
              >
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              </div>
            );
          }

          return (
            <div
              key={listing.id}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
              className="p-2"
            >
              <ListingCard
                listing={listing}
                isHovered={hoveredListingId === listing.id}
                onHover={setHoveredListing}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Active Filter Chips

```typescript
// components/ActiveFilters/ActiveFilters.tsx
'use client';

import { X } from 'lucide-react';
import { useFilters } from '@/hooks/useFilters';
import { motion, AnimatePresence } from 'framer-motion';

export function ActiveFilters() {
  const { activeFilters, removeFilter, clearFilters, hasFilters } = useFilters();

  if (!hasFilters) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap py-2">
      <AnimatePresence mode="popLayout">
        {activeFilters.map((filter) => (
          <motion.button
            key={filter}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => removeFilter(filter)}
            className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm hover:bg-gray-200 transition-colors"
          >
            <span>{filter}</span>
            <X className="w-3 h-3" />
          </motion.button>
        ))}
      </AnimatePresence>

      {activeFilters.length > 1 && (
        <button
          onClick={clearFilters}
          className="px-3 py-1 text-sm text-primary underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
```

---

## 7. Booking Flow & Checkout

### Booking Flow Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         BOOKING FLOW ARCHITECTURE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐ │
│  │  Select  │──▶│  Guest   │──▶│  Guest   │──▶│ Payment  │──▶│ Confirm  │ │
│  │  Dates   │   │  Count   │   │  Details │   │          │   │ -ation   │ │
│  └──────────┘   └──────────┘   └──────────┘   └──────────┘   └──────────┘ │
│       │              │              │              │              │         │
│       ▼              ▼              ▼              ▼              ▼         │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        STATE PERSISTENCE                             │   │
│  │  • Zustand store for booking state                                   │   │
│  │  • Session storage for recovery                                      │   │
│  │  • URL params for deep linking                                       │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        REAL-TIME VALIDATION                          │   │
│  │  • Availability check on mount                                       │   │
│  │  • Price recalculation on date change                                │   │
│  │  • Coupon validation                                                 │   │
│  │  • Guest count validation                                            │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                        PAYMENT PROCESSING                            │   │
│  │  • Stripe Payment Intent creation                                    │   │
│  │  • 3D Secure authentication                                          │   │
│  │  • Payment confirmation                                              │   │
│  │  • Booking creation                                                  │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Multi-Step Checkout Component

```typescript
// app/(booking)/book/[listingId]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useBookingStore } from '@/stores/booking';
import { getListingDetail } from '@/lib/api/services/listings';
import { StepIndicator } from './components/StepIndicator';
import { DateStep } from './components/DateStep';
import { GuestsStep } from './components/GuestsStep';
import { DetailsStep } from './components/DetailsStep';
import { PaymentStep } from './components/PaymentStep';
import { ConfirmationStep } from './components/ConfirmationStep';
import { BookingSidebar } from './components/BookingSidebar';

export default function BookingPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const listingId = params.listingId as string;

  const { step, initBooking, setDates, setGuests } = useBookingStore();

  // Fetch listing details
  const { data: listing, isLoading } = useQuery({
    queryKey: ['listing', listingId],
    queryFn: () => getListingDetail(listingId),
  });

  // Initialize booking with URL params
  useEffect(() => {
    if (listing) {
      initBooking(listingId, listing);

      // Restore from URL params
      const checkIn = searchParams.get('checkIn');
      const checkOut = searchParams.get('checkOut');
      if (checkIn && checkOut) {
        setDates(new Date(checkIn), new Date(checkOut));
      }

      const adults = parseInt(searchParams.get('adults') || '1');
      const children = parseInt(searchParams.get('children') || '0');
      const infants = parseInt(searchParams.get('infants') || '0');
      setGuests({ adults, children, infants });
    }
  }, [listing, listingId, searchParams, initBooking, setDates, setGuests]);

  if (isLoading || !listing) {
    return <BookingPageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold">
            {step === 'confirmation' ? 'Booking Confirmed!' : 'Complete your booking'}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step Indicator */}
            {step !== 'confirmation' && (
              <StepIndicator currentStep={step} />
            )}

            {/* Step Content */}
            <div className="bg-white rounded-xl shadow-sm p-6 mt-6">
              {step === 'dates' && <DateStep listing={listing} />}
              {step === 'guests' && <GuestsStep listing={listing} />}
              {step === 'details' && <DetailsStep />}
              {step === 'payment' && <PaymentStep listing={listing} />}
              {step === 'confirmation' && <ConfirmationStep />}
            </div>
          </div>

          {/* Sidebar - Price Summary */}
          {step !== 'confirmation' && (
            <div className="lg:col-span-1">
              <BookingSidebar listing={listing} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Step Indicator Component

```typescript
// components/StepIndicator.tsx
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const STEPS = [
  { id: 'dates', label: 'Dates' },
  { id: 'guests', label: 'Guests' },
  { id: 'details', label: 'Details' },
  { id: 'payment', label: 'Payment' },
] as const;

type StepId = typeof STEPS[number]['id'];

interface StepIndicatorProps {
  currentStep: StepId;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Booking progress">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;

          return (
            <li
              key={step.id}
              className={cn(
                'flex items-center',
                index < STEPS.length - 1 && 'flex-1'
              )}
            >
              <div className="flex items-center">
                <span
                  className={cn(
                    'w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium',
                    isCompleted && 'bg-primary text-white',
                    isCurrent && 'bg-primary text-white',
                    !isCompleted && !isCurrent && 'bg-gray-200 text-gray-500'
                  )}
                >
                  {isCompleted ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    'ml-2 text-sm font-medium',
                    (isCompleted || isCurrent) ? 'text-gray-900' : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    isCompleted ? 'bg-primary' : 'bg-gray-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
```

### Payment Step with Stripe

```typescript
// components/PaymentStep.tsx
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useMutation } from '@tanstack/react-query';
import { useBookingStore } from '@/stores/booking';
import { createPaymentIntent, confirmBooking } from '@/lib/api/services/bookings';
import { AlertCircle, Lock } from 'lucide-react';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!);

interface PaymentStepProps {
  listing: Listing;
}

export function PaymentStep({ listing }: PaymentStepProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const { pricing, checkIn, checkOut, guests, guestInfo } = useBookingStore();

  // Create Payment Intent
  const createPaymentMutation = useMutation({
    mutationFn: () =>
      createPaymentIntent({
        listingId: listing.id,
        checkIn: checkIn!.toISOString(),
        checkOut: checkOut!.toISOString(),
        guests,
        amount: pricing!.total,
        currency: pricing!.currency,
      }),
    onSuccess: (data) => {
      setClientSecret(data.clientSecret);
    },
  });

  useEffect(() => {
    if (pricing && !clientSecret) {
      createPaymentMutation.mutate();
    }
  }, [pricing]);

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#FF385C',
            borderRadius: '8px',
          },
        },
      }}
    >
      <PaymentForm listing={listing} />
    </Elements>
  );
}

function PaymentForm({ listing }: { listing: Listing }) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const {
    checkIn,
    checkOut,
    guests,
    guestInfo,
    pricing,
    submitBooking,
    setPaymentIntentId,
    nextStep,
  } = useBookingStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsProcessing(true);
    setError(null);

    try {
      // Confirm payment
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/book/${listing.id}/confirm`,
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        setError(paymentError.message || 'Payment failed');
        setIsProcessing(false);
        return;
      }

      if (paymentIntent?.status === 'succeeded') {
        setPaymentIntentId(paymentIntent.id);
        await submitBooking();
        nextStep();
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold mb-4">Payment method</h2>
        <PaymentElement
          options={{
            layout: 'tabs',
            wallets: {
              applePay: 'auto',
              googlePay: 'auto',
            },
          }}
        />
      </div>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Cancellation Policy */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium mb-2">Cancellation policy</h3>
        <p className="text-sm text-gray-600">
          {listing.cancellation.description}
        </p>
      </div>

      {/* House Rules Agreement */}
      <div className="p-4 border rounded-lg">
        <p className="text-sm">
          By selecting the button below, I agree to the{' '}
          <a href="#" className="text-primary underline">
            House Rules
          </a>
          , {' '}
          <a href="#" className="text-primary underline">
            Cancellation Policy
          </a>
          , and the{' '}
          <a href="#" className="text-primary underline">
            Guest Refund Policy
          </a>
          .
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className="w-full py-4 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            Processing...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Confirm and pay
          </>
        )}
      </button>

      {/* Security Badge */}
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Lock className="w-4 h-4" />
        <span>Your payment is secured with SSL encryption</span>
      </div>
    </form>
  );
}
```

### Booking Sidebar with Price Breakdown

```typescript
// components/BookingSidebar.tsx
'use client';

import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { format, differenceInDays } from 'date-fns';
import { Star, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { useBookingStore } from '@/stores/booking';
import { getPricing } from '@/lib/api/services/listings';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface BookingSidebarProps {
  listing: Listing;
}

export function BookingSidebar({ listing }: BookingSidebarProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const { checkIn, checkOut, guests, setPricing } = useBookingStore();

  // Fetch pricing
  const { data: pricing, isLoading: pricingLoading } = useQuery({
    queryKey: ['pricing', listing.id, checkIn, checkOut, guests],
    queryFn: () =>
      getPricing(listing.id, {
        checkIn: format(checkIn!, 'yyyy-MM-dd'),
        checkOut: format(checkOut!, 'yyyy-MM-dd'),
        guests: { adults: guests.adults, children: guests.children },
      }),
    enabled: !!(checkIn && checkOut),
    onSuccess: (data) => {
      setPricing(data);
    },
  });

  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-24">
      {/* Listing Summary */}
      <div className="flex gap-4 pb-6 border-b">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden shrink-0">
          <Image
            src={listing.images[0].url}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 uppercase">
            {listing.propertyType}
          </p>
          <h3 className="font-medium truncate">{listing.title}</h3>
          <div className="flex items-center gap-1 mt-1">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">{listing.rating.toFixed(2)}</span>
            <span className="text-sm text-gray-500">
              ({listing.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      {/* Trip Details */}
      {checkIn && checkOut && (
        <div className="py-6 border-b">
          <h4 className="font-semibold mb-4">Your trip</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Dates</span>
              <span>
                {format(checkIn, 'MMM d')} - {format(checkOut, 'MMM d, yyyy')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span>
                {guests.adults + guests.children} guest
                {guests.adults + guests.children !== 1 ? 's' : ''}
                {guests.infants > 0 && `, ${guests.infants} infant${guests.infants !== 1 ? 's' : ''}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Price Breakdown */}
      {pricingLoading ? (
        <div className="py-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ) : pricing ? (
        <div className="py-6">
          <h4 className="font-semibold mb-4">Price details</h4>
          <div className="space-y-3">
            {/* Base Price */}
            <div className="flex justify-between">
              <button
                onClick={() => setShowBreakdown(!showBreakdown)}
                className="flex items-center gap-1 underline text-gray-600"
              >
                {formatCurrency(pricing.pricePerNight, pricing.currency)} × {nights} nights
                {showBreakdown ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              <span>{formatCurrency(pricing.subtotal, pricing.currency)}</span>
            </div>

            {/* Nightly Breakdown */}
            {showBreakdown && (
              <div className="pl-4 space-y-1 text-sm text-gray-500">
                {pricing.breakdown.map((night) => (
                  <div key={night.date} className="flex justify-between">
                    <span>{format(new Date(night.date), 'EEE, MMM d')}</span>
                    <span>{formatCurrency(night.price, pricing.currency)}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Cleaning Fee */}
            {pricing.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Cleaning fee</span>
                <span>{formatCurrency(pricing.cleaningFee, pricing.currency)}</span>
              </div>
            )}

            {/* Service Fee */}
            {pricing.serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Service fee</span>
                <span>{formatCurrency(pricing.serviceFee, pricing.currency)}</span>
              </div>
            )}

            {/* Taxes */}
            {pricing.taxes > 0 && (
              <div className="flex justify-between">
                <span className="text-gray-600">Taxes</span>
                <span>{formatCurrency(pricing.taxes, pricing.currency)}</span>
              </div>
            )}

            {/* Discount */}
            {pricing.discount && (
              <div className="flex justify-between text-green-600">
                <span>{pricing.discount.description}</span>
                <span>-{formatCurrency(pricing.discount.amount, pricing.currency)}</span>
              </div>
            )}
          </div>

          {/* Total */}
          <div className="flex justify-between font-semibold text-lg pt-4 mt-4 border-t">
            <span>Total ({pricing.currency})</span>
            <span>{formatCurrency(pricing.total, pricing.currency)}</span>
          </div>
        </div>
      ) : null}

      {/* Low Availability Warning */}
      <div className="flex items-center gap-2 p-3 bg-rose-50 text-rose-700 rounded-lg text-sm">
        <AlertTriangle className="w-4 h-4 shrink-0" />
        <span>This is a rare find. {listing.title} is usually booked.</span>
      </div>
    </div>
  );
}
```

### Confirmation Step

```typescript
// components/ConfirmationStep.tsx
'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { CheckCircle, Calendar, MapPin, User, MessageCircle, Download } from 'lucide-react';
import { useBookingStore } from '@/stores/booking';
import confetti from 'canvas-confetti';

export function ConfirmationStep() {
  const { bookingId, listing, checkIn, checkOut, guests, pricing, reset } = useBookingStore();

  // Celebration effect
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // Clean up booking state after viewing confirmation
    return () => {
      reset();
    };
  }, [reset]);

  if (!listing || !bookingId) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-semibold mb-2">Your booking is confirmed!</h2>
        <p className="text-gray-600">
          Confirmation #{bookingId}
        </p>
      </div>

      {/* Booking Summary Card */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-6">
        <div className="relative h-48">
          <Image
            src={listing.images[0].url}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-1">{listing.title}</h3>
          <p className="text-gray-600 mb-4">
            Hosted by {listing.host.name}
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Check-in</p>
                <p className="text-gray-600">
                  {format(checkIn!, 'EEE, MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.rules.checkInTime}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Checkout</p>
                <p className="text-gray-600">
                  {format(checkOut!, 'EEE, MMM d, yyyy')}
                </p>
                <p className="text-sm text-gray-500">
                  {listing.rules.checkOutTime}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-gray-600">
                  {listing.location.address}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="font-medium">Guests</p>
                <p className="text-gray-600">
                  {guests.adults + guests.children} guest
                  {guests.adults + guests.children !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link
          href={`/messages/${listing.host.id}`}
          className="flex items-center justify-center gap-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Message host</span>
        </Link>
        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Download className="w-5 h-5" />
          <span>Download receipt</span>
        </button>
      </div>

      {/* Payment Summary */}
      {pricing && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h4 className="font-semibold mb-4">Payment summary</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(pricing.subtotal, pricing.currency)}</span>
            </div>
            {pricing.cleaningFee > 0 && (
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>{formatCurrency(pricing.cleaningFee, pricing.currency)}</span>
              </div>
            )}
            {pricing.serviceFee > 0 && (
              <div className="flex justify-between">
                <span>Service fee</span>
                <span>{formatCurrency(pricing.serviceFee, pricing.currency)}</span>
              </div>
            )}
            {pricing.taxes > 0 && (
              <div className="flex justify-between">
                <span>Taxes</span>
                <span>{formatCurrency(pricing.taxes, pricing.currency)}</span>
              </div>
            )}
            <div className="flex justify-between font-semibold pt-2 border-t">
              <span>Total paid</span>
              <span>{formatCurrency(pricing.total, pricing.currency)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Next Steps */}
      <div className="bg-blue-50 rounded-lg p-6">
        <h4 className="font-semibold mb-3">What's next?</h4>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              You'll receive a confirmation email with your booking details
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              Your host will send you check-in instructions before your trip
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-600">•</span>
            <span>
              You can manage your booking from{' '}
              <Link href="/trips" className="text-primary underline">
                My Trips
              </Link>
            </span>
          </li>
        </ul>
      </div>

      {/* View Trip Button */}
      <div className="mt-8 text-center">
        <Link
          href={`/trips/${bookingId}`}
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
        >
          View your trip
        </Link>
      </div>
    </div>
  );
}
```

### Booking Abandonment Recovery

```typescript
// hooks/useBookingRecovery.ts
import { useEffect } from 'react';
import { useBookingStore } from '@/stores/booking';

const STORAGE_KEY = 'booking_draft';

export function useBookingRecovery() {
  const store = useBookingStore();

  // Save booking draft to session storage
  useEffect(() => {
    const unsubscribe = useBookingStore.subscribe((state) => {
      if (state.listingId && state.step !== 'confirmation') {
        const draft = {
          listingId: state.listingId,
          checkIn: state.checkIn?.toISOString(),
          checkOut: state.checkOut?.toISOString(),
          guests: state.guests,
          guestInfo: state.guestInfo,
          step: state.step,
          savedAt: new Date().toISOString(),
        };
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      }
    });

    return () => unsubscribe();
  }, []);

  // Recover booking draft on mount
  useEffect(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved);
        const savedAt = new Date(draft.savedAt);
        const hoursSinceLastSave =
          (Date.now() - savedAt.getTime()) / (1000 * 60 * 60);

        // Only recover if less than 24 hours old
        if (hoursSinceLastSave < 24) {
          return draft;
        } else {
          sessionStorage.removeItem(STORAGE_KEY);
        }
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
      }
    }
    return null;
  }, []);

  const clearDraft = () => {
    sessionStorage.removeItem(STORAGE_KEY);
  };

  return { clearDraft };
}

// Recovery Modal Component
export function BookingRecoveryModal({
  draft,
  onRecover,
  onDiscard,
}: {
  draft: BookingDraft;
  onRecover: () => void;
  onDiscard: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-4">
        <h2 className="text-lg font-semibold mb-2">
          Continue your booking?
        </h2>
        <p className="text-gray-600 mb-4">
          You have an unfinished booking. Would you like to continue where you
          left off?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onDiscard}
            className="flex-1 py-2 border rounded-lg hover:bg-gray-50"
          >
            Start over
          </button>
          <button
            onClick={onRecover}
            className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
```

---

## 8. Map Integration

### Map Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          MAP INTEGRATION ARCHITECTURE                        │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                     MAP PROVIDER OPTIONS                             │   │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐      │   │
│  │  │  Google Maps    │  │    Mapbox GL    │  │    Leaflet +    │      │   │
│  │  │  (Airbnb-style) │  │  (Performance)  │  │   OpenStreetMap │      │   │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                      │                                      │
│                                      ▼                                      │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      MAP FEATURES                                    │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   Price      │  │   Marker     │  │  Viewport    │               │   │
│  │  │   Markers    │  │  Clustering  │  │   Loading    │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐               │   │
│  │  │   List/Map   │  │   Popup      │  │   Search     │               │   │
│  │  │    Sync      │  │   Cards      │  │   this Area  │               │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Map Container with Google Maps

```typescript
// components/MapView/MapView.tsx
'use client';

import { useCallback, useRef, useState, useEffect, memo } from 'react';
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useUIStore } from '@/stores/ui';
import { useSearchParams } from '@/hooks/useSearchParams';
import { ListingMarkers } from './ListingMarkers';
import { MapControls } from './MapControls';
import { SearchThisAreaButton } from './SearchThisAreaButton';
import type { ListingSummary } from '@/lib/api/types';

interface MapViewProps {
  listings: ListingSummary[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

export const MapView = memo(function MapView({
  listings,
  initialCenter = { lat: 48.8566, lng: 2.3522 }, // Paris default
  initialZoom = 12,
}: MapViewProps) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!}>
      <div className="relative w-full h-full">
        <Map
          defaultCenter={initialCenter}
          defaultZoom={initialZoom}
          mapId={process.env.NEXT_PUBLIC_GOOGLE_MAP_ID}
          gestureHandling="greedy"
          disableDefaultUI={true}
          clickableIcons={false}
          styles={mapStyles}
        >
          <MapContent listings={listings} />
        </Map>
      </div>
    </APIProvider>
  );
});

function MapContent({ listings }: { listings: ListingSummary[] }) {
  const map = useMap();
  const { setMapBounds } = useSearchParams();
  const { mapCenter, mapZoom, setMapView } = useUIStore();
  const [showSearchButton, setShowSearchButton] = useState(false);
  const initialBoundsRef = useRef<google.maps.LatLngBounds | null>(null);

  // Handle map movement
  const handleBoundsChanged = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();
    const center = map.getCenter();
    const zoom = map.getZoom();

    if (center && zoom) {
      setMapView({ lat: center.lat(), lng: center.lng() }, zoom);
    }

    // Show "Search this area" if map has moved significantly
    if (initialBoundsRef.current) {
      const initialCenter = initialBoundsRef.current.getCenter();
      const currentCenter = bounds.getCenter();
      const distance = google.maps.geometry.spherical.computeDistanceBetween(
        initialCenter,
        currentCenter
      );
      setShowSearchButton(distance > 1000); // 1km threshold
    } else {
      initialBoundsRef.current = bounds;
    }
  }, [map, setMapView]);

  // Search this area
  const handleSearchThisArea = useCallback(() => {
    if (!map) return;

    const bounds = map.getBounds();
    if (!bounds) return;

    const ne = bounds.getNorthEast();
    const sw = bounds.getSouthWest();

    setMapBounds({
      ne: { lat: ne.lat(), lng: ne.lng() },
      sw: { lat: sw.lat(), lng: sw.lng() },
      zoom: map.getZoom() || 12,
    });

    setShowSearchButton(false);
    initialBoundsRef.current = bounds;
  }, [map, setMapBounds]);

  // Set up event listeners
  useEffect(() => {
    if (!map) return;

    const idleListener = map.addListener('idle', handleBoundsChanged);

    return () => {
      google.maps.event.removeListener(idleListener);
    };
  }, [map, handleBoundsChanged]);

  return (
    <>
      <ListingMarkers listings={listings} />
      <MapControls />
      {showSearchButton && (
        <SearchThisAreaButton onClick={handleSearchThisArea} />
      )}
    </>
  );
}

// Custom map styles for a cleaner look
const mapStyles = [
  {
    featureType: 'poi',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'labels',
    stylers: [{ visibility: 'off' }],
  },
];
```

### Price Marker Component

```typescript
// components/MapView/PriceMarker.tsx
'use client';

import { memo, useCallback } from 'react';
import { AdvancedMarker } from '@vis.gl/react-google-maps';
import { useUIStore } from '@/stores/ui';
import { cn } from '@/lib/utils';
import type { ListingSummary } from '@/lib/api/types';

interface PriceMarkerProps {
  listing: ListingSummary;
  onClick: (listing: ListingSummary) => void;
}

export const PriceMarker = memo(function PriceMarker({
  listing,
  onClick,
}: PriceMarkerProps) {
  const { hoveredListingId, setHoveredListing, selectedListingId, setSelectedListing } = useUIStore();

  const isHovered = hoveredListingId === listing.id;
  const isSelected = selectedListingId === listing.id;

  const handleClick = useCallback(() => {
    onClick(listing);
    setSelectedListing(listing.id);
    // Scroll to listing in list view
    window.scrollToListing?.(listing.id);
  }, [listing, onClick, setSelectedListing]);

  const handleMouseEnter = useCallback(() => {
    setHoveredListing(listing.id);
  }, [listing.id, setHoveredListing]);

  const handleMouseLeave = useCallback(() => {
    setHoveredListing(null);
  }, [setHoveredListing]);

  return (
    <AdvancedMarker
      position={{
        lat: listing.location.coordinates.lat,
        lng: listing.location.coordinates.lng,
      }}
      onClick={handleClick}
      zIndex={isHovered || isSelected ? 1000 : 1}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'px-2 py-1 rounded-full text-sm font-semibold cursor-pointer transition-all',
          'shadow-md hover:shadow-lg',
          isSelected
            ? 'bg-gray-900 text-white scale-110'
            : isHovered
            ? 'bg-gray-900 text-white scale-105'
            : 'bg-white text-gray-900 hover:scale-105'
        )}
      >
        {formatCurrency(listing.price.amount, listing.price.currency)}
      </div>
    </AdvancedMarker>
  );
});

// Format currency for marker display
function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

### Marker Clustering

```typescript
// components/MapView/ListingMarkers.tsx
'use client';

import { useMemo, useState, useCallback } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { PriceMarker } from './PriceMarker';
import { ListingPopup } from './ListingPopup';
import Supercluster from 'supercluster';
import type { ListingSummary } from '@/lib/api/types';

interface ListingMarkersProps {
  listings: ListingSummary[];
}

interface ClusterProperties {
  cluster: boolean;
  listingId?: string;
  point_count?: number;
}

export function ListingMarkers({ listings }: ListingMarkersProps) {
  const map = useMap();
  const [selectedListing, setSelectedListing] = useState<ListingSummary | null>(null);
  const [bounds, setBounds] = useState<[number, number, number, number] | null>(null);
  const [zoom, setZoom] = useState(12);

  // Create Supercluster index
  const supercluster = useMemo(() => {
    const cluster = new Supercluster<ClusterProperties>({
      radius: 60,
      maxZoom: 16,
      minPoints: 2,
    });

    const points = listings.map((listing) => ({
      type: 'Feature' as const,
      properties: {
        cluster: false,
        listingId: listing.id,
      },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          listing.location.coordinates.lng,
          listing.location.coordinates.lat,
        ],
      },
    }));

    cluster.load(points);
    return cluster;
  }, [listings]);

  // Get clusters for current viewport
  const clusters = useMemo(() => {
    if (!bounds) return [];
    return supercluster.getClusters(bounds, zoom);
  }, [supercluster, bounds, zoom]);

  // Update bounds and zoom when map changes
  useEffect(() => {
    if (!map) return;

    const updateView = () => {
      const mapBounds = map.getBounds();
      const mapZoom = map.getZoom();

      if (mapBounds && mapZoom) {
        const ne = mapBounds.getNorthEast();
        const sw = mapBounds.getSouthWest();
        setBounds([sw.lng(), sw.lat(), ne.lng(), ne.lat()]);
        setZoom(mapZoom);
      }
    };

    updateView();
    const listener = map.addListener('idle', updateView);

    return () => {
      google.maps.event.removeListener(listener);
    };
  }, [map]);

  // Handle cluster click - zoom in
  const handleClusterClick = useCallback(
    (clusterId: number, coordinates: [number, number]) => {
      const expansionZoom = Math.min(
        supercluster.getClusterExpansionZoom(clusterId),
        20
      );

      map?.panTo({ lat: coordinates[1], lng: coordinates[0] });
      map?.setZoom(expansionZoom);
    },
    [map, supercluster]
  );

  // Handle listing click - show popup
  const handleListingClick = useCallback((listing: ListingSummary) => {
    setSelectedListing(listing);
  }, []);

  const listingsMap = useMemo(
    () => new Map(listings.map((l) => [l.id, l])),
    [listings]
  );

  return (
    <>
      {clusters.map((cluster) => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count, listingId } = cluster.properties;

        if (isCluster) {
          return (
            <ClusterMarker
              key={`cluster-${cluster.id}`}
              position={{ lat, lng }}
              count={point_count!}
              onClick={() => handleClusterClick(cluster.id as number, [lng, lat])}
            />
          );
        }

        const listing = listingsMap.get(listingId!);
        if (!listing) return null;

        return (
          <PriceMarker
            key={listing.id}
            listing={listing}
            onClick={handleListingClick}
          />
        );
      })}

      {selectedListing && (
        <ListingPopup
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
        />
      )}
    </>
  );
}

// Cluster Marker Component
function ClusterMarker({
  position,
  count,
  onClick,
}: {
  position: { lat: number; lng: number };
  count: number;
  onClick: () => void;
}) {
  const size = Math.min(50, 30 + Math.sqrt(count) * 5);

  return (
    <AdvancedMarker position={position} onClick={onClick}>
      <div
        className="flex items-center justify-center rounded-full bg-primary text-white font-semibold cursor-pointer hover:scale-110 transition-transform"
        style={{ width: size, height: size }}
      >
        {count}
      </div>
    </AdvancedMarker>
  );
}
```

### Listing Popup Card

```typescript
// components/MapView/ListingPopup.tsx
'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { InfoWindow } from '@vis.gl/react-google-maps';
import { Star, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import type { ListingSummary } from '@/lib/api/types';

interface ListingPopupProps {
  listing: ListingSummary;
  onClose: () => void;
}

export function ListingPopup({ listing, onClose }: ListingPopupProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);

    return () => document.removeEventListener('click', handleClickOutside);
  }, [onClose]);

  return (
    <InfoWindow
      position={{
        lat: listing.location.coordinates.lat,
        lng: listing.location.coordinates.lng,
      }}
      onCloseClick={onClose}
      pixelOffset={[0, -10]}
    >
      <div ref={popupRef} className="w-72 -m-2">
        {/* Image Carousel */}
        <div className="relative aspect-[4/3] rounded-t-lg overflow-hidden">
          <Image
            src={listing.images[currentImageIndex]}
            alt={listing.title}
            fill
            className="object-cover"
          />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 bg-white/90 rounded-full hover:bg-white"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Image Navigation */}
          {listing.images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === 0 ? listing.images.length - 1 : prev - 1
                  );
                }}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1 bg-white/90 rounded-full hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentImageIndex((prev) =>
                    prev === listing.images.length - 1 ? 0 : prev + 1
                  );
                }}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 bg-white/90 rounded-full hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {listing.images.slice(0, 5).map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full ${
                      idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          {listing.isSuperhost && (
            <span className="absolute top-2 left-2 px-2 py-0.5 bg-white rounded text-xs font-medium">
              Superhost
            </span>
          )}
        </div>

        {/* Content */}
        <Link
          href={`/listing/${listing.id}`}
          className="block p-3 hover:bg-gray-50 transition-colors"
        >
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-sm truncate flex-1">
              {listing.location.city}, {listing.location.country}
            </h3>
            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-3 h-3 fill-current" />
              <span className="text-sm">{listing.rating.toFixed(2)}</span>
            </div>
          </div>

          <p className="text-xs text-gray-500 truncate mt-0.5">
            {listing.propertyType}
          </p>

          <p className="mt-2">
            <span className="font-semibold">
              {formatCurrency(listing.price.amount, listing.price.currency)}
            </span>
            <span className="text-gray-500 text-sm"> / night</span>
          </p>
        </Link>
      </div>
    </InfoWindow>
  );
}
```

### Map-List Synchronization Hook

```typescript
// hooks/useMapListSync.ts
import { useEffect, useCallback } from 'react';
import { useUIStore } from '@/stores/ui';

export function useMapListSync() {
  const {
    hoveredListingId,
    setHoveredListing,
    selectedListingId,
    setSelectedListing,
  } = useUIStore();

  // Sync hover state from list to map
  const handleListItemHover = useCallback(
    (listingId: string | null) => {
      setHoveredListing(listingId);
    },
    [setHoveredListing]
  );

  // Sync selection from list to map
  const handleListItemClick = useCallback(
    (listingId: string) => {
      setSelectedListing(listingId);
    },
    [setSelectedListing]
  );

  // Scroll list to show selected listing when marker is clicked
  const scrollToListing = useCallback((listingId: string) => {
    const element = document.getElementById(`listing-${listingId}`);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, []);

  // Pan map to listing when list item is clicked
  const panToListing = useCallback(
    (lat: number, lng: number) => {
      // This would be called from the parent component with map reference
      window.panMapTo?.({ lat, lng });
    },
    []
  );

  return {
    hoveredListingId,
    selectedListingId,
    handleListItemHover,
    handleListItemClick,
    scrollToListing,
    panToListing,
  };
}
```

### Search This Area Button

```typescript
// components/MapView/SearchThisAreaButton.tsx
'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';

interface SearchThisAreaButtonProps {
  onClick: () => void;
}

export function SearchThisAreaButton({ onClick }: SearchThisAreaButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      onClick={onClick}
      className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
    >
      <Search className="w-4 h-4" />
      <span className="font-medium text-sm">Search this area</span>
    </motion.button>
  );
}
```

### Split View Layout

```typescript
// components/SearchLayout/SplitView.tsx
'use client';

import { useState, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { MapView } from '../MapView';
import { SearchResults } from '../SearchResults';
import { MapIcon, ListIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ListingSummary } from '@/lib/api/types';

interface SplitViewProps {
  listings: ListingSummary[];
  mapCenter?: { lat: number; lng: number };
}

export function SplitView({ listings, mapCenter }: SplitViewProps) {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [isMapCollapsed, setIsMapCollapsed] = useState(false);

  if (isMobile) {
    return (
      <div className="relative h-[calc(100vh-200px)]">
        {/* Mobile Toggle */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20">
          <div className="flex bg-white rounded-full shadow-lg overflow-hidden">
            <button
              onClick={() => setMobileView('list')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-medium text-sm',
                mobileView === 'list'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700'
              )}
            >
              <ListIcon className="w-4 h-4" />
              List
            </button>
            <button
              onClick={() => setMobileView('map')}
              className={cn(
                'flex items-center gap-2 px-4 py-2 font-medium text-sm',
                mobileView === 'map'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-700'
              )}
            >
              <MapIcon className="w-4 h-4" />
              Map
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-full">
          {mobileView === 'list' ? (
            <SearchResults />
          ) : (
            <MapView listings={listings} initialCenter={mapCenter} />
          )}
        </div>
      </div>
    );
  }

  // Desktop Split View
  return (
    <div className="flex h-[calc(100vh-200px)]">
      {/* List Panel */}
      <div
        className={cn(
          'transition-all duration-300 overflow-hidden',
          isMapCollapsed ? 'w-full' : 'w-1/2 lg:w-3/5'
        )}
      >
        <SearchResults />
      </div>

      {/* Map Panel */}
      <div
        className={cn(
          'relative transition-all duration-300',
          isMapCollapsed ? 'w-0' : 'w-1/2 lg:w-2/5'
        )}
      >
        {/* Collapse Toggle */}
        <button
          onClick={() => setIsMapCollapsed(!isMapCollapsed)}
          className="absolute top-4 left-0 z-10 p-2 bg-white rounded-r-lg shadow-md hover:bg-gray-50"
        >
          {isMapCollapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {!isMapCollapsed && (
          <MapView listings={listings} initialCenter={mapCenter} />
        )}
      </div>
    </div>
  );
}
```

---

## 9. Calendar & Date Picker

### Calendar Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Date Picker Architecture                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                        DateRangePicker                                │  │
│  │  ┌─────────────────────┐  ┌─────────────────────┐                     │  │
│  │  │   Check-in Input    │  │   Check-out Input   │                     │  │
│  │  │   [Jul 15, 2024]    │  │   [Jul 20, 2024]    │                     │  │
│  │  └─────────────────────┘  └─────────────────────┘                     │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Calendar Dropdown                                │  │
│  │  ┌────────────────────────────────────────────────────────────────┐   │  │
│  │  │                    MonthNavigation                             │   │  │
│  │  │         ←  July 2024  |  August 2024  →                        │   │  │
│  │  └────────────────────────────────────────────────────────────────┘   │  │
│  │                                                                       │  │
│  │  ┌────────────────────────┐  ┌────────────────────────┐               │  │
│  │  │      CalendarMonth     │  │      CalendarMonth     │               │  │
│  │  │  Su Mo Tu We Th Fr Sa  │  │  Su Mo Tu We Th Fr Sa  │               │  │
│  │  │      1  2  3  4  5  6  │  │               1  2  3  │               │  │
│  │  │   7  8  9 10 11 12 13  │  │   4  5  6  7  8  9 10  │               │  │
│  │  │  14 ██ ██ ██ ██ 19 20  │  │  11 12 13 14 15 16 17  │               │  │
│  │  │  21 22 23 24 25 26 27  │  │  18 19 20 21 22 23 24  │               │  │
│  │  │  28 29 30 31           │  │  25 26 27 28 29 30 31  │               │  │
│  │  └────────────────────────┘  └────────────────────────┘               │  │
│  │                                                                       │  │
│  │  Legend: ██ Selected  ░░ Unavailable  $$ Price Overlay               │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                    ↓                                        │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │                      Data Sources                                     │  │
│  │  • Availability API (blocked dates, minimum stays)                    │  │
│  │  • Pricing API (dynamic pricing per night)                            │  │
│  │  • Booking rules (check-in/out days, gaps)                            │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Date Range Picker Component

```typescript
// components/booking/DateRangePicker.tsx
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { format, addMonths, isSameDay, isWithinInterval, isBefore, startOfDay } from 'date-fns';
import { Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/lib/utils';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  minDate?: Date;
  maxDate?: Date;
  blockedDates?: Date[];
  pricing?: Record<string, number>; // ISO date string -> price
  minStay?: number;
  maxStay?: number;
  checkInDays?: number[]; // 0-6, Sunday = 0
  checkOutDays?: number[];
  className?: string;
}

type SelectionMode = 'start' | 'end';

export function DateRangePicker({
  value,
  onChange,
  minDate = new Date(),
  maxDate,
  blockedDates = [],
  pricing = {},
  minStay = 1,
  maxStay = 365,
  checkInDays,
  checkOutDays,
  className
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(
    value.startDate || new Date()
  );
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('start');
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => setIsOpen(false));

  // Reset selection mode when dates change
  useEffect(() => {
    if (value.startDate && value.endDate) {
      setSelectionMode('start');
    } else if (value.startDate) {
      setSelectionMode('end');
    }
  }, [value.startDate, value.endDate]);

  const handleDateClick = useCallback((date: Date) => {
    if (selectionMode === 'start') {
      onChange({ startDate: date, endDate: null });
      setSelectionMode('end');
    } else {
      // Ensure end date is after start date
      if (value.startDate && isBefore(date, value.startDate)) {
        onChange({ startDate: date, endDate: null });
        setSelectionMode('end');
      } else {
        onChange({ ...value, endDate: date });
        setIsOpen(false);
      }
    }
  }, [selectionMode, value, onChange]);

  const isDateBlocked = useCallback((date: Date): boolean => {
    return blockedDates.some(blocked => isSameDay(date, blocked));
  }, [blockedDates]);

  const isDateDisabled = useCallback((date: Date): boolean => {
    const today = startOfDay(new Date());

    // Past dates
    if (isBefore(date, today)) return true;

    // Before min date
    if (minDate && isBefore(date, startOfDay(minDate))) return true;

    // After max date
    if (maxDate && isBefore(startOfDay(maxDate), date)) return true;

    // Blocked dates
    if (isDateBlocked(date)) return true;

    // Check-in day restrictions
    if (selectionMode === 'start' && checkInDays) {
      if (!checkInDays.includes(date.getDay())) return true;
    }

    // Check-out day restrictions
    if (selectionMode === 'end' && checkOutDays) {
      if (!checkOutDays.includes(date.getDay())) return true;
    }

    // Min stay validation when selecting end date
    if (selectionMode === 'end' && value.startDate) {
      const daysDiff = Math.ceil(
        (date.getTime() - value.startDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (daysDiff < minStay || daysDiff > maxStay) return true;
    }

    return false;
  }, [minDate, maxDate, isDateBlocked, selectionMode, checkInDays, checkOutDays, value.startDate, minStay, maxStay]);

  const isDateInRange = useCallback((date: Date): boolean => {
    if (!value.startDate) return false;

    const endDate = value.endDate || hoveredDate;
    if (!endDate) return false;

    return isWithinInterval(date, {
      start: value.startDate,
      end: endDate
    });
  }, [value.startDate, value.endDate, hoveredDate]);

  const isStartDate = useCallback((date: Date): boolean => {
    return value.startDate ? isSameDay(date, value.startDate) : false;
  }, [value.startDate]);

  const isEndDate = useCallback((date: Date): boolean => {
    return value.endDate ? isSameDay(date, value.endDate) : false;
  }, [value.endDate]);

  const getDayPrice = useCallback((date: Date): number | null => {
    const key = format(date, 'yyyy-MM-dd');
    return pricing[key] ?? null;
  }, [pricing]);

  const formatDateDisplay = (date: Date | null): string => {
    if (!date) return 'Add date';
    return format(date, 'MMM d, yyyy');
  };

  const clearDates = () => {
    onChange({ startDate: null, endDate: null });
    setSelectionMode('start');
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Input Fields */}
      <div className="flex border rounded-xl overflow-hidden bg-white shadow-sm">
        <button
          onClick={() => {
            setIsOpen(true);
            setSelectionMode('start');
          }}
          className={cn(
            'flex-1 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
            selectionMode === 'start' && isOpen && 'ring-2 ring-inset ring-black'
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Check-in
          </div>
          <div className="text-sm mt-0.5">
            {formatDateDisplay(value.startDate)}
          </div>
        </button>

        <div className="w-px bg-gray-200" />

        <button
          onClick={() => {
            setIsOpen(true);
            setSelectionMode('end');
          }}
          className={cn(
            'flex-1 px-4 py-3 text-left hover:bg-gray-50 transition-colors',
            selectionMode === 'end' && isOpen && 'ring-2 ring-inset ring-black'
          )}
        >
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Check-out
          </div>
          <div className="text-sm mt-0.5">
            {formatDateDisplay(value.endDate)}
          </div>
        </button>

        {(value.startDate || value.endDate) && (
          <button
            onClick={clearDates}
            className="px-3 hover:bg-gray-50 transition-colors"
            aria-label="Clear dates"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Calendar Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 bg-white rounded-2xl shadow-2xl border p-6 min-w-[600px]">
          {/* Selection Hint */}
          <div className="text-center mb-4 text-sm text-gray-600">
            {selectionMode === 'start'
              ? 'Select check-in date'
              : 'Select check-out date'
            }
            {minStay > 1 && selectionMode === 'end' && (
              <span className="ml-2 text-gray-400">
                (minimum {minStay} nights)
              </span>
            )}
          </div>

          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-16 font-semibold">
              <span>{format(currentMonth, 'MMMM yyyy')}</span>
              <span>{format(addMonths(currentMonth, 1), 'MMMM yyyy')}</span>
            </div>

            <button
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Next month"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          {/* Two-Month Calendar */}
          <div className="flex gap-8">
            <CalendarMonth
              month={currentMonth}
              onDateClick={handleDateClick}
              onDateHover={setHoveredDate}
              isDateDisabled={isDateDisabled}
              isDateBlocked={isDateBlocked}
              isDateInRange={isDateInRange}
              isStartDate={isStartDate}
              isEndDate={isEndDate}
              getDayPrice={getDayPrice}
              showPrices={true}
            />
            <CalendarMonth
              month={addMonths(currentMonth, 1)}
              onDateClick={handleDateClick}
              onDateHover={setHoveredDate}
              isDateDisabled={isDateDisabled}
              isDateBlocked={isDateBlocked}
              isDateInRange={isDateInRange}
              isStartDate={isStartDate}
              isEndDate={isEndDate}
              getDayPrice={getDayPrice}
              showPrices={true}
            />
          </div>

          {/* Quick Select Options */}
          <div className="flex gap-2 mt-4 pt-4 border-t">
            <QuickSelectButton
              label="Exact dates"
              isActive={true}
              onClick={() => {}}
            />
            <QuickSelectButton
              label="±1 day"
              isActive={false}
              onClick={() => {}}
            />
            <QuickSelectButton
              label="±3 days"
              isActive={false}
              onClick={() => {}}
            />
            <QuickSelectButton
              label="±7 days"
              isActive={false}
              onClick={() => {}}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function QuickSelectButton({
  label,
  isActive,
  onClick
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-full text-sm font-medium transition-colors',
        isActive
          ? 'bg-gray-900 text-white'
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      )}
    >
      {label}
    </button>
  );
}
```

### Calendar Month Component

```typescript
// components/booking/CalendarMonth.tsx
'use client';

import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth
} from 'date-fns';
import { cn } from '@/lib/utils';

interface CalendarMonthProps {
  month: Date;
  onDateClick: (date: Date) => void;
  onDateHover: (date: Date | null) => void;
  isDateDisabled: (date: Date) => boolean;
  isDateBlocked: (date: Date) => boolean;
  isDateInRange: (date: Date) => boolean;
  isStartDate: (date: Date) => boolean;
  isEndDate: (date: Date) => boolean;
  getDayPrice: (date: Date) => number | null;
  showPrices?: boolean;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CalendarMonth({
  month,
  onDateClick,
  onDateHover,
  isDateDisabled,
  isDateBlocked,
  isDateInRange,
  isStartDate,
  isEndDate,
  getDayPrice,
  showPrices = false
}: CalendarMonthProps) {
  const days = useMemo(() => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  }, [month]);

  const formatPrice = (price: number): string => {
    if (price >= 1000) {
      return `$${(price / 1000).toFixed(1)}k`;
    }
    return `$${price}`;
  };

  return (
    <div className="w-[280px]">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-500 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const isCurrentMonth = isSameMonth(day, month);
          const disabled = isDateDisabled(day);
          const blocked = isDateBlocked(day);
          const inRange = isDateInRange(day);
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);
          const price = getDayPrice(day);

          return (
            <div
              key={index}
              className={cn(
                'relative',
                // Range background
                inRange && !isStart && !isEnd && 'bg-gray-100'
              )}
            >
              {/* Range connectors */}
              {isStart && inRange && (
                <div className="absolute inset-y-0 right-0 w-1/2 bg-gray-100" />
              )}
              {isEnd && inRange && (
                <div className="absolute inset-y-0 left-0 w-1/2 bg-gray-100" />
              )}

              <button
                onClick={() => !disabled && onDateClick(day)}
                onMouseEnter={() => !disabled && onDateHover(day)}
                onMouseLeave={() => onDateHover(null)}
                disabled={disabled}
                className={cn(
                  'relative w-full aspect-square flex flex-col items-center justify-center',
                  'text-sm transition-colors rounded-full',
                  !isCurrentMonth && 'invisible',
                  isCurrentMonth && !disabled && 'hover:border-2 hover:border-gray-900',
                  disabled && 'text-gray-300 cursor-not-allowed',
                  blocked && 'line-through text-gray-300',
                  (isStart || isEnd) && 'bg-gray-900 text-white hover:bg-gray-800',
                  inRange && !isStart && !isEnd && 'bg-transparent'
                )}
                aria-label={format(day, 'MMMM d, yyyy')}
                aria-disabled={disabled}
              >
                <span className={cn(
                  'font-medium',
                  showPrices && price && 'text-xs'
                )}>
                  {format(day, 'd')}
                </span>

                {/* Price Display */}
                {showPrices && price && isCurrentMonth && !disabled && (
                  <span className={cn(
                    'text-[10px] leading-none',
                    (isStart || isEnd) ? 'text-gray-300' : 'text-gray-500'
                  )}>
                    {formatPrice(price)}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Availability Calendar Hook

```typescript
// hooks/useAvailabilityCalendar.ts
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  addDays,
  eachDayOfInterval,
  format,
  parseISO,
  isBefore,
  isAfter,
  differenceInDays
} from 'date-fns';
import { api } from '@/lib/api';

interface AvailabilityData {
  blockedDates: Date[];
  pricing: Record<string, number>;
  minimumStay: number;
  maximumStay: number;
  checkInDays: number[];
  checkOutDays: number[];
  instantBook: boolean;
  advanceNotice: number; // days
  preparationTime: number; // days between bookings
}

interface BlockedPeriod {
  startDate: string;
  endDate: string;
  reason: 'booked' | 'blocked' | 'maintenance';
}

interface PricingPeriod {
  startDate: string;
  endDate: string;
  nightlyPrice: number;
}

interface AvailabilityResponse {
  listingId: string;
  blockedPeriods: BlockedPeriod[];
  pricingPeriods: PricingPeriod[];
  defaultPrice: number;
  rules: {
    minimumStay: number;
    maximumStay: number;
    checkInDays: number[];
    checkOutDays: number[];
    instantBook: boolean;
    advanceNotice: number;
    preparationTime: number;
  };
}

export function useAvailabilityCalendar(
  listingId: string,
  startMonth: Date,
  monthsToFetch: number = 6
) {
  const endDate = addDays(startMonth, monthsToFetch * 31);

  const { data, isLoading, error } = useQuery({
    queryKey: ['availability', listingId, format(startMonth, 'yyyy-MM')],
    queryFn: () => api.get<AvailabilityResponse>(
      `/listings/${listingId}/availability`,
      {
        params: {
          startDate: format(startMonth, 'yyyy-MM-dd'),
          endDate: format(endDate, 'yyyy-MM-dd')
        }
      }
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000 // 30 minutes
  });

  const availability = useMemo<AvailabilityData | null>(() => {
    if (!data) return null;

    // Expand blocked periods into individual dates
    const blockedDates: Date[] = [];
    data.blockedPeriods.forEach(period => {
      const days = eachDayOfInterval({
        start: parseISO(period.startDate),
        end: parseISO(period.endDate)
      });
      blockedDates.push(...days);
    });

    // Create pricing lookup map
    const pricing: Record<string, number> = {};
    const today = new Date();
    const fetchEnd = endDate;

    // Initialize with default prices
    eachDayOfInterval({ start: today, end: fetchEnd }).forEach(day => {
      pricing[format(day, 'yyyy-MM-dd')] = data.defaultPrice;
    });

    // Override with period-specific pricing
    data.pricingPeriods.forEach(period => {
      const days = eachDayOfInterval({
        start: parseISO(period.startDate),
        end: parseISO(period.endDate)
      });
      days.forEach(day => {
        pricing[format(day, 'yyyy-MM-dd')] = period.nightlyPrice;
      });
    });

    return {
      blockedDates,
      pricing,
      minimumStay: data.rules.minimumStay,
      maximumStay: data.rules.maximumStay,
      checkInDays: data.rules.checkInDays,
      checkOutDays: data.rules.checkOutDays,
      instantBook: data.rules.instantBook,
      advanceNotice: data.rules.advanceNotice,
      preparationTime: data.rules.preparationTime
    };
  }, [data, endDate]);

  return {
    availability,
    isLoading,
    error
  };
}

// Calculate total price for a date range
export function calculateTotalPrice(
  startDate: Date,
  endDate: Date,
  pricing: Record<string, number>,
  defaultPrice: number
): { nights: number; total: number; average: number; breakdown: Array<{ date: string; price: number }> } {
  const nights = differenceInDays(endDate, startDate);
  const breakdown: Array<{ date: string; price: number }> = [];

  let total = 0;
  let current = startDate;

  while (isBefore(current, endDate)) {
    const key = format(current, 'yyyy-MM-dd');
    const price = pricing[key] ?? defaultPrice;
    breakdown.push({ date: key, price });
    total += price;
    current = addDays(current, 1);
  }

  return {
    nights,
    total,
    average: Math.round(total / nights),
    breakdown
  };
}

// Validate date range against booking rules
export function validateDateRange(
  startDate: Date,
  endDate: Date,
  blockedDates: Date[],
  rules: {
    minimumStay: number;
    maximumStay: number;
    checkInDays?: number[];
    checkOutDays?: number[];
    advanceNotice?: number;
  }
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const nights = differenceInDays(endDate, startDate);
  const today = new Date();

  // Check minimum stay
  if (nights < rules.minimumStay) {
    errors.push(`Minimum stay is ${rules.minimumStay} nights`);
  }

  // Check maximum stay
  if (nights > rules.maximumStay) {
    errors.push(`Maximum stay is ${rules.maximumStay} nights`);
  }

  // Check advance notice
  if (rules.advanceNotice) {
    const daysUntilCheckIn = differenceInDays(startDate, today);
    if (daysUntilCheckIn < rules.advanceNotice) {
      errors.push(`Requires ${rules.advanceNotice} days advance notice`);
    }
  }

  // Check check-in day
  if (rules.checkInDays && !rules.checkInDays.includes(startDate.getDay())) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allowedDays = rules.checkInDays.map(d => dayNames[d]).join(', ');
    errors.push(`Check-in only allowed on: ${allowedDays}`);
  }

  // Check check-out day
  if (rules.checkOutDays && !rules.checkOutDays.includes(endDate.getDay())) {
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const allowedDays = rules.checkOutDays.map(d => dayNames[d]).join(', ');
    errors.push(`Check-out only allowed on: ${allowedDays}`);
  }

  // Check for blocked dates in range
  const hasBlockedDates = blockedDates.some(blocked =>
    !isBefore(blocked, startDate) && isBefore(blocked, endDate)
  );
  if (hasBlockedDates) {
    errors.push('Selected dates include unavailable dates');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Dynamic Pricing Display

```typescript
// components/booking/PricingCalendarView.tsx
'use client';

import { useState, useMemo } from 'react';
import { format, addMonths, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PricingCalendarProps {
  pricing: Record<string, number>;
  blockedDates: Date[];
  basePrice: number;
  onDateClick?: (date: Date) => void;
}

export function PricingCalendarView({
  pricing,
  blockedDates,
  basePrice,
  onDateClick
}: PricingCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { days, priceStats } = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Calculate price statistics for the month
    const monthPrices = days
      .map(d => pricing[format(d, 'yyyy-MM-dd')])
      .filter((p): p is number => p !== undefined);

    const min = Math.min(...monthPrices);
    const max = Math.max(...monthPrices);
    const avg = monthPrices.reduce((a, b) => a + b, 0) / monthPrices.length;

    return {
      days,
      priceStats: { min, max, avg }
    };
  }, [currentMonth, pricing]);

  const getPriceCategory = (price: number): 'low' | 'medium' | 'high' => {
    const threshold = basePrice * 0.15; // 15% variance
    if (price <= basePrice - threshold) return 'low';
    if (price >= basePrice + threshold) return 'high';
    return 'medium';
  };

  const isBlocked = (date: Date): boolean => {
    return blockedDates.some(blocked =>
      format(blocked, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
    );
  };

  return (
    <div className="bg-white rounded-xl border p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Pricing Calendar</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium min-w-[120px] text-center">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Price Legend */}
      <div className="flex gap-4 mb-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
          <span>Lower price</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" />
          <span>Average</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-red-100 border border-red-300" />
          <span>Higher price</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded bg-gray-200" />
          <span>Unavailable</span>
        </div>
      </div>

      {/* Month Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-xs text-gray-500">Lowest</div>
          <div className="font-semibold text-green-600">
            ${Math.round(priceStats.min)}
          </div>
        </div>
        <div className="text-center border-x">
          <div className="text-xs text-gray-500">Average</div>
          <div className="font-semibold">
            ${Math.round(priceStats.avg)}
          </div>
        </div>
        <div className="text-center">
          <div className="text-xs text-gray-500">Highest</div>
          <div className="font-semibold text-red-600">
            ${Math.round(priceStats.max)}
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {/* Weekday Headers */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
          <div key={i} className="text-center text-xs text-gray-500 py-1">
            {day}
          </div>
        ))}

        {/* Day Cells */}
        {days.map((day, index) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const price = pricing[dateKey] ?? basePrice;
          const blocked = isBlocked(day);
          const category = getPriceCategory(price);

          return (
            <button
              key={index}
              onClick={() => !blocked && onDateClick?.(day)}
              disabled={blocked}
              className={cn(
                'aspect-square rounded-lg flex flex-col items-center justify-center text-xs',
                'transition-all hover:scale-105',
                blocked && 'bg-gray-200 text-gray-400 cursor-not-allowed',
                !blocked && category === 'low' && 'bg-green-50 border border-green-200 hover:bg-green-100',
                !blocked && category === 'medium' && 'bg-gray-50 border border-gray-200 hover:bg-gray-100',
                !blocked && category === 'high' && 'bg-red-50 border border-red-200 hover:bg-red-100'
              )}
            >
              <span className="font-medium">{format(day, 'd')}</span>
              {!blocked && (
                <span className={cn(
                  'text-[10px]',
                  category === 'low' && 'text-green-600',
                  category === 'medium' && 'text-gray-500',
                  category === 'high' && 'text-red-600'
                )}>
                  ${price}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Price Trend Indicator */}
      <div className="mt-4 pt-4 border-t">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">Base price:</span>
          <span className="font-semibold">${basePrice}/night</span>
        </div>
        <PriceTrendIndicator
          currentAvg={priceStats.avg}
          basePrice={basePrice}
        />
      </div>
    </div>
  );
}

function PriceTrendIndicator({
  currentAvg,
  basePrice
}: {
  currentAvg: number;
  basePrice: number;
}) {
  const percentChange = ((currentAvg - basePrice) / basePrice) * 100;

  if (Math.abs(percentChange) < 5) {
    return (
      <div className="flex items-center gap-1 text-sm text-gray-500 mt-1">
        <Minus className="w-4 h-4" />
        <span>Prices are average for this month</span>
      </div>
    );
  }

  if (percentChange > 0) {
    return (
      <div className="flex items-center gap-1 text-sm text-red-600 mt-1">
        <TrendingUp className="w-4 h-4" />
        <span>Prices are {Math.round(percentChange)}% higher this month</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 text-sm text-green-600 mt-1">
      <TrendingDown className="w-4 h-4" />
      <span>Prices are {Math.round(Math.abs(percentChange))}% lower this month</span>
    </div>
  );
}
```

### Calendar with Minimum Stay Visualization

```typescript
// components/booking/MinimumStayCalendar.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  format,
  addDays,
  isSameDay,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isBefore,
  isWithinInterval
} from 'date-fns';
import { cn } from '@/lib/utils';

interface MinimumStayRule {
  startDate: Date;
  endDate: Date;
  minimumNights: number;
}

interface MinimumStayCalendarProps {
  selectedStart: Date | null;
  minimumStayRules: MinimumStayRule[];
  blockedDates: Date[];
  onDateSelect: (date: Date) => void;
}

export function MinimumStayCalendar({
  selectedStart,
  minimumStayRules,
  blockedDates,
  onDateSelect
}: MinimumStayCalendarProps) {
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null);

  const getMinimumStay = useCallback((date: Date): number => {
    const rule = minimumStayRules.find(r =>
      isWithinInterval(date, { start: r.startDate, end: r.endDate })
    );
    return rule?.minimumNights ?? 1;
  }, [minimumStayRules]);

  const getPreviewRange = useMemo(() => {
    if (!selectedStart) return null;

    const minStay = getMinimumStay(selectedStart);
    const previewEnd = addDays(selectedStart, minStay);

    return {
      start: selectedStart,
      end: previewEnd,
      nights: minStay
    };
  }, [selectedStart, getMinimumStay]);

  const isInMinStayPreview = useCallback((date: Date): boolean => {
    if (!getPreviewRange) return false;

    return isWithinInterval(date, {
      start: getPreviewRange.start,
      end: addDays(getPreviewRange.end, -1) // Exclusive end
    });
  }, [getPreviewRange]);

  const isBlocked = useCallback((date: Date): boolean => {
    return blockedDates.some(blocked => isSameDay(blocked, date));
  }, [blockedDates]);

  const isCheckoutDisabled = useCallback((date: Date): boolean => {
    if (!selectedStart) return false;

    const minStay = getMinimumStay(selectedStart);
    const minCheckout = addDays(selectedStart, minStay);

    return isBefore(date, minCheckout);
  }, [selectedStart, getMinimumStay]);

  return (
    <div className="space-y-4">
      {/* Minimum Stay Legend */}
      {selectedStart && getPreviewRange && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-blue-200" />
            <span className="text-sm text-blue-800">
              Minimum {getPreviewRange.nights} night{getPreviewRange.nights > 1 ? 's' : ''} required
              {' '}(Check-out: {format(getPreviewRange.end, 'MMM d')})
            </span>
          </div>
        </div>
      )}

      {/* Calendar Component */}
      {/* ... calendar rendering with isInMinStayPreview highlighting ... */}
    </div>
  );
}
```

### Integration with Booking Widget

```typescript
// components/booking/BookingWidget.tsx (updated)
'use client';

import { useState } from 'react';
import { DateRangePicker } from './DateRangePicker';
import { GuestSelector } from './GuestSelector';
import { PriceBreakdown } from './PriceBreakdown';
import { useAvailabilityCalendar, calculateTotalPrice, validateDateRange } from '@/hooks/useAvailabilityCalendar';
import { Listing } from '@/types';

interface BookingWidgetProps {
  listing: Listing;
}

export function BookingWidget({ listing }: BookingWidgetProps) {
  const [dateRange, setDateRange] = useState<{
    startDate: Date | null;
    endDate: Date | null;
  }>({ startDate: null, endDate: null });
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });

  const { availability, isLoading } = useAvailabilityCalendar(
    listing.id,
    new Date(),
    12 // Fetch 12 months
  );

  const priceCalculation = dateRange.startDate && dateRange.endDate && availability
    ? calculateTotalPrice(
        dateRange.startDate,
        dateRange.endDate,
        availability.pricing,
        listing.basePrice
      )
    : null;

  const validation = dateRange.startDate && dateRange.endDate && availability
    ? validateDateRange(
        dateRange.startDate,
        dateRange.endDate,
        availability.blockedDates,
        {
          minimumStay: availability.minimumStay,
          maximumStay: availability.maximumStay,
          checkInDays: availability.checkInDays,
          checkOutDays: availability.checkOutDays,
          advanceNotice: availability.advanceNotice
        }
      )
    : null;

  return (
    <div className="bg-white rounded-xl border shadow-lg p-6 sticky top-24">
      {/* Price Header */}
      <div className="mb-4">
        <span className="text-2xl font-semibold">${listing.basePrice}</span>
        <span className="text-gray-500"> / night</span>
      </div>

      {/* Date Picker */}
      <DateRangePicker
        value={dateRange}
        onChange={setDateRange}
        blockedDates={availability?.blockedDates ?? []}
        pricing={availability?.pricing ?? {}}
        minStay={availability?.minimumStay ?? 1}
        maxStay={availability?.maximumStay ?? 365}
        checkInDays={availability?.checkInDays}
        checkOutDays={availability?.checkOutDays}
        className="mb-4"
      />

      {/* Guest Selector */}
      <GuestSelector
        value={guests}
        onChange={setGuests}
        maxGuests={listing.maxGuests}
        className="mb-4"
      />

      {/* Validation Errors */}
      {validation && !validation.valid && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          {validation.errors.map((error, i) => (
            <p key={i} className="text-sm text-red-600">{error}</p>
          ))}
        </div>
      )}

      {/* Price Breakdown */}
      {priceCalculation && (
        <PriceBreakdown
          nights={priceCalculation.nights}
          nightlyRate={priceCalculation.average}
          subtotal={priceCalculation.total}
          cleaningFee={listing.cleaningFee}
          serviceFee={Math.round(priceCalculation.total * 0.14)}
          className="mb-4"
        />
      )}

      {/* Reserve Button */}
      <button
        disabled={!validation?.valid}
        className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white font-semibold rounded-lg hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
      >
        {availability?.instantBook ? 'Reserve' : 'Request to book'}
      </button>

      {/* Won't be charged notice */}
      <p className="text-center text-sm text-gray-500 mt-3">
        You won't be charged yet
      </p>
    </div>
  );
}
```

---

## 10. Reviews & Ratings System

### Reviews Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Reviews & Ratings System                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Rating Summary                                   │    │
│  │  ┌─────────────────┐  ┌──────────────────────────────────────────┐  │    │
│  │  │      4.92       │  │  Cleanliness    ████████████████░░  4.9  │  │    │
│  │  │     ★★★★★       │  │  Communication  ██████████████████  5.0  │  │    │
│  │  │   127 reviews   │  │  Check-in       █████████████████░  4.8  │  │    │
│  │  └─────────────────┘  │  Accuracy       ████████████████░░  4.9  │  │    │
│  │                       │  Location       ████████████████░░  4.9  │  │    │
│  │                       │  Value          ███████████████░░░  4.7  │  │    │
│  │                       └──────────────────────────────────────────┘  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Filter & Sort Controls                           │    │
│  │  [Most Recent ▼]  [All Ratings ▼]  🔍 Search reviews              │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Review Cards                                   │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  👤 Sarah M.        ★★★★★    December 2024                  │    │    │
│  │  │  "Amazing stay! The view was breathtaking and..."          │    │    │
│  │  │  [Show more]                                                │    │    │
│  │  │  ❤ 12  👍 Helpful                                           │    │    │
│  │  │  ↳ Host Response: "Thank you so much, Sarah!..."           │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │                            ...                                      │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                   Write Review (Post-Checkout)                      │    │
│  │  Rate your stay: ☆☆☆☆☆                                            │    │
│  │  Category ratings + Written feedback + Photo upload                 │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Reviews Types & API

```typescript
// types/reviews.ts
export interface Review {
  id: string;
  listingId: string;
  bookingId: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
    location?: string;
    reviewCount: number;
  };
  ratings: CategoryRatings;
  overallRating: number;
  content: string;
  photos: ReviewPhoto[];
  stayDate: string; // ISO date
  createdAt: string;
  updatedAt: string;
  helpful: number;
  hostResponse?: {
    content: string;
    respondedAt: string;
  };
  verified: boolean;
  tripType?: 'solo' | 'couple' | 'family' | 'business' | 'group';
}

export interface CategoryRatings {
  cleanliness: number;
  communication: number;
  checkIn: number;
  accuracy: number;
  location: number;
  value: number;
}

export interface ReviewPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  caption?: string;
}

export interface ReviewsSummary {
  overallRating: number;
  totalReviews: number;
  categoryAverages: CategoryRatings;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  highlightedKeywords: Array<{
    keyword: string;
    count: number;
    sentiment: 'positive' | 'neutral' | 'negative';
  }>;
}

export type ReviewSortOption =
  | 'most_recent'
  | 'highest_rated'
  | 'lowest_rated'
  | 'most_helpful';

export interface ReviewFilters {
  rating?: number;
  tripType?: string;
  hasPhotos?: boolean;
  searchQuery?: string;
}
```

### Rating Summary Component

```typescript
// components/reviews/RatingSummary.tsx
'use client';

import { Star } from 'lucide-react';
import { ReviewsSummary, CategoryRatings } from '@/types/reviews';
import { cn } from '@/lib/utils';

interface RatingSummaryProps {
  summary: ReviewsSummary;
  compact?: boolean;
}

export function RatingSummary({ summary, compact = false }: RatingSummaryProps) {
  const { overallRating, totalReviews, categoryAverages, ratingDistribution } = summary;

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <Star className="w-4 h-4 fill-current" />
        <span className="font-semibold">{overallRating.toFixed(2)}</span>
        <span className="text-gray-500">· {totalReviews} reviews</span>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Overall Rating */}
      <div className="flex items-center gap-4">
        <div className="text-center">
          <div className="text-5xl font-bold">{overallRating.toFixed(2)}</div>
          <div className="flex justify-center mt-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-4 h-4',
                  star <= Math.round(overallRating)
                    ? 'fill-current text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalReviews} reviews
          </div>
        </div>

        {/* Rating Distribution */}
        <div className="flex-1 space-y-1">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = ratingDistribution[rating as keyof typeof ratingDistribution];
            const percentage = (count / totalReviews) * 100;

            return (
              <button
                key={rating}
                className="flex items-center gap-2 w-full group hover:bg-gray-50 rounded p-1 -m-1"
              >
                <span className="text-xs text-gray-500 w-3">{rating}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gray-900 rounded-full transition-all group-hover:bg-gray-700"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500 w-6">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Ratings */}
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(categoryAverages).map(([category, rating]) => (
          <CategoryRatingBar
            key={category}
            category={formatCategoryName(category)}
            rating={rating}
          />
        ))}
      </div>
    </div>
  );
}

function CategoryRatingBar({
  category,
  rating
}: {
  category: string;
  rating: number;
}) {
  const percentage = (rating / 5) * 100;

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">{category}</span>
        <span className="font-medium">{rating.toFixed(1)}</span>
      </div>
      <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gray-900 rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function formatCategoryName(key: string): string {
  const names: Record<string, string> = {
    cleanliness: 'Cleanliness',
    communication: 'Communication',
    checkIn: 'Check-in',
    accuracy: 'Accuracy',
    location: 'Location',
    value: 'Value'
  };
  return names[key] ?? key;
}
```

### Reviews List with Infinite Scroll

```typescript
// components/reviews/ReviewsList.tsx
'use client';

import { useState, useCallback } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Search, Star, ThumbsUp, ChevronDown, MessageCircle, Camera } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { Review, ReviewFilters, ReviewSortOption } from '@/types/reviews';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import { formatDistanceToNow, format } from 'date-fns';

interface ReviewsListProps {
  listingId: string;
  initialReviews?: Review[];
}

export function ReviewsList({ listingId, initialReviews }: ReviewsListProps) {
  const [sortBy, setSortBy] = useState<ReviewSortOption>('most_recent');
  const [filters, setFilters] = useState<ReviewFilters>({});
  const [searchQuery, setSearchQuery] = useState('');

  const { ref: loadMoreRef, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading
  } = useInfiniteQuery({
    queryKey: ['reviews', listingId, sortBy, filters],
    queryFn: ({ pageParam = 1 }) =>
      api.get<{ reviews: Review[]; hasMore: boolean; total: number }>(
        `/listings/${listingId}/reviews`,
        {
          params: {
            page: pageParam,
            limit: 10,
            sort: sortBy,
            ...filters
          }
        }
      ),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialData: initialReviews
      ? {
          pages: [{ reviews: initialReviews, hasMore: true, total: initialReviews.length }],
          pageParams: [1]
        }
      : undefined
  });

  // Auto-load more when scrolling to bottom
  useCallback(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const reviews = data?.pages.flatMap(page => page.reviews) ?? [];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center">
        {/* Sort Dropdown */}
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as ReviewSortOption)}
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="most_recent">Most Recent</option>
            <option value="highest_rated">Highest Rated</option>
            <option value="lowest_rated">Lowest Rated</option>
            <option value="most_helpful">Most Helpful</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>

        {/* Rating Filter */}
        <div className="relative">
          <select
            value={filters.rating ?? ''}
            onChange={(e) =>
              setFilters(prev => ({
                ...prev,
                rating: e.target.value ? parseInt(e.target.value) : undefined
              }))
            }
            className="appearance-none bg-white border rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:ring-2 focus:ring-black focus:border-transparent"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
        </div>

        {/* Photos Filter */}
        <button
          onClick={() =>
            setFilters(prev => ({
              ...prev,
              hasPhotos: !prev.hasPhotos
            }))
          }
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors',
            filters.hasPhotos
              ? 'bg-gray-900 text-white border-gray-900'
              : 'bg-white text-gray-700 hover:bg-gray-50'
          )}
        >
          <Camera className="w-4 h-4" />
          With Photos
        </button>

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setFilters(prev => ({ ...prev, searchQuery: e.target.value }));
            }}
            placeholder="Search reviews"
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>
      </div>

      {/* Reviews List */}
      <div className="divide-y">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {/* Load More Trigger */}
      <div ref={loadMoreRef} className="h-10 flex items-center justify-center">
        {isFetchingNextPage && (
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900" />
        )}
      </div>

      {/* Show All Button */}
      {hasNextPage && !isFetchingNextPage && (
        <button
          onClick={() => fetchNextPage()}
          className="w-full py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
        >
          Show all {data?.pages[0]?.total ?? 0} reviews
        </button>
      )}
    </div>
  );
}
```

### Review Card Component

```typescript
// components/reviews/ReviewCard.tsx
'use client';

import { useState } from 'react';
import { Star, ThumbsUp, Flag, MessageCircle } from 'lucide-react';
import { Review } from '@/types/reviews';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ReviewCardProps {
  review: Review;
  showListingLink?: boolean;
}

const TRUNCATE_LENGTH = 300;

export function ReviewCard({ review, showListingLink = false }: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHelpful, setIsHelpful] = useState(false);
  const [helpfulCount, setHelpfulCount] = useState(review.helpful);

  const shouldTruncate = review.content.length > TRUNCATE_LENGTH;
  const displayContent = shouldTruncate && !isExpanded
    ? review.content.slice(0, TRUNCATE_LENGTH) + '...'
    : review.content;

  const handleHelpful = async () => {
    setIsHelpful(!isHelpful);
    setHelpfulCount(prev => isHelpful ? prev - 1 : prev + 1);
    // API call would go here
  };

  return (
    <div className="py-6 first:pt-0">
      {/* Author Header */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
          {review.author.avatar ? (
            <Image
              src={review.author.avatar}
              alt={review.author.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold text-lg">
              {review.author.name.charAt(0)}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold">{review.author.name}</h4>
            {review.verified && (
              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                Verified
              </span>
            )}
          </div>
          {review.author.location && (
            <p className="text-sm text-gray-500">{review.author.location}</p>
          )}
          <p className="text-xs text-gray-400">
            {review.author.reviewCount} reviews
          </p>
        </div>

        {/* Rating & Date */}
        <div className="text-right flex-shrink-0">
          <div className="flex gap-0.5 justify-end">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={cn(
                  'w-3 h-3',
                  star <= review.overallRating
                    ? 'fill-current text-yellow-400'
                    : 'text-gray-300'
                )}
              />
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {format(new Date(review.stayDate), 'MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Trip Type Badge */}
      {review.tripType && (
        <div className="mb-3">
          <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
            {formatTripType(review.tripType)}
          </span>
        </div>
      )}

      {/* Review Content */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-line">
          {displayContent}
        </p>
        {shouldTruncate && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 font-semibold underline hover:no-underline"
          >
            {isExpanded ? 'Show less' : 'Show more'}
          </button>
        )}
      </div>

      {/* Review Photos */}
      {review.photos.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.photos.map((photo) => (
            <button
              key={photo.id}
              className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden hover:opacity-90 transition-opacity"
            >
              <Image
                src={photo.thumbnailUrl}
                alt={photo.caption ?? 'Review photo'}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 text-sm">
        <button
          onClick={handleHelpful}
          className={cn(
            'flex items-center gap-1.5 transition-colors',
            isHelpful ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
          )}
        >
          <ThumbsUp className={cn('w-4 h-4', isHelpful && 'fill-current')} />
          <span>Helpful {helpfulCount > 0 && `(${helpfulCount})`}</span>
        </button>

        <button className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors">
          <Flag className="w-4 h-4" />
          <span>Report</span>
        </button>
      </div>

      {/* Host Response */}
      {review.hostResponse && (
        <div className="mt-4 ml-8 p-4 bg-gray-50 rounded-lg border-l-4 border-gray-300">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-gray-500" />
            <span className="font-semibold text-sm">Host Response</span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(review.hostResponse.respondedAt), {
                addSuffix: true
              })}
            </span>
          </div>
          <p className="text-sm text-gray-600">{review.hostResponse.content}</p>
        </div>
      )}
    </div>
  );
}

function formatTripType(tripType: string): string {
  const labels: Record<string, string> = {
    solo: 'Solo trip',
    couple: 'Couple trip',
    family: 'Family trip',
    business: 'Business trip',
    group: 'Group trip'
  };
  return labels[tripType] ?? tripType;
}
```

### Write Review Form

```typescript
// components/reviews/WriteReviewForm.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Star, Upload, X, Loader2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const CATEGORIES = [
  { key: 'cleanliness', label: 'Cleanliness', description: 'How clean was the space?' },
  { key: 'communication', label: 'Communication', description: 'How was the host communication?' },
  { key: 'checkIn', label: 'Check-in', description: 'How smooth was the check-in?' },
  { key: 'accuracy', label: 'Accuracy', description: 'How accurate was the listing?' },
  { key: 'location', label: 'Location', description: 'How was the location?' },
  { key: 'value', label: 'Value', description: 'Was it worth the price?' }
] as const;

const reviewSchema = z.object({
  overallRating: z.number().min(1, 'Please provide an overall rating').max(5),
  ratings: z.object({
    cleanliness: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
    checkIn: z.number().min(1).max(5),
    accuracy: z.number().min(1).max(5),
    location: z.number().min(1).max(5),
    value: z.number().min(1).max(5)
  }),
  content: z.string().min(50, 'Please write at least 50 characters').max(1000),
  tripType: z.enum(['solo', 'couple', 'family', 'business', 'group']).optional(),
  photos: z.array(z.string()).max(6, 'Maximum 6 photos allowed')
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface WriteReviewFormProps {
  bookingId: string;
  listingId: string;
  listingTitle: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function WriteReviewForm({
  bookingId,
  listingId,
  listingTitle,
  onSuccess,
  onCancel
}: WriteReviewFormProps) {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isValid }
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      overallRating: 0,
      ratings: {
        cleanliness: 0,
        communication: 0,
        checkIn: 0,
        accuracy: 0,
        location: 0,
        value: 0
      },
      content: '',
      photos: []
    },
    mode: 'onChange'
  });

  const submitMutation = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      // Upload photos first
      let uploadedUrls: string[] = [];
      if (photos.length > 0) {
        setUploadingPhotos(true);
        const formData = new FormData();
        photos.forEach(photo => formData.append('photos', photo));
        const uploadResult = await api.post<{ urls: string[] }>(
          '/uploads/review-photos',
          formData
        );
        uploadedUrls = uploadResult.urls;
        setUploadingPhotos(false);
      }

      // Submit review
      return api.post(`/bookings/${bookingId}/review`, {
        ...data,
        photos: uploadedUrls
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', listingId] });
      queryClient.invalidateQueries({ queryKey: ['listing', listingId] });
      onSuccess?.();
    }
  });

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) return false;
      if (file.size > 5 * 1024 * 1024) return false; // 5MB limit
      return true;
    });

    const newPhotos = [...photos, ...validFiles].slice(0, 6);
    setPhotos(newPhotos);

    // Create preview URLs
    const urls = newPhotos.map(file => URL.createObjectURL(file));
    setPhotoUrls(urls);
  };

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    setPhotos(newPhotos);

    URL.revokeObjectURL(photoUrls[index]);
    const newUrls = photoUrls.filter((_, i) => i !== index);
    setPhotoUrls(newUrls);
  };

  const overallRating = watch('overallRating');
  const content = watch('content');

  return (
    <form onSubmit={handleSubmit((data) => submitMutation.mutate(data))} className="space-y-8">
      {/* Listing Context */}
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-sm text-gray-500">Writing review for</p>
        <p className="font-semibold">{listingTitle}</p>
      </div>

      {/* Overall Rating */}
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-4">How was your overall experience?</h3>
        <Controller
          name="overallRating"
          control={control}
          render={({ field }) => (
            <StarRating
              value={field.value}
              onChange={field.onChange}
              size="lg"
            />
          )}
        />
        {errors.overallRating && (
          <p className="text-sm text-red-500 mt-2">{errors.overallRating.message}</p>
        )}
      </div>

      {/* Category Ratings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Rate each category</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {CATEGORIES.map(({ key, label, description }) => (
            <div key={key} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{label}</p>
                <p className="text-xs text-gray-500">{description}</p>
              </div>
              <Controller
                name={`ratings.${key}` as keyof ReviewFormData['ratings']}
                control={control}
                render={({ field }) => (
                  <StarRating
                    value={field.value as number}
                    onChange={field.onChange}
                    size="sm"
                  />
                )}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Written Review */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Share your experience</h3>
        <Controller
          name="content"
          control={control}
          render={({ field }) => (
            <div className="space-y-2">
              <textarea
                {...field}
                rows={5}
                placeholder="What was it like staying here? Would you recommend it to others?"
                className="w-full p-4 border rounded-lg resize-none focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <div className="flex justify-between text-sm">
                <p className={cn(
                  'text-gray-500',
                  errors.content && 'text-red-500'
                )}>
                  {errors.content?.message ?? 'Minimum 50 characters'}
                </p>
                <p className="text-gray-400">{content.length}/1000</p>
              </div>
            </div>
          )}
        />
      </div>

      {/* Trip Type */}
      <div>
        <h3 className="text-lg font-semibold mb-2">What type of trip was this?</h3>
        <Controller
          name="tripType"
          control={control}
          render={({ field }) => (
            <div className="flex flex-wrap gap-2">
              {['solo', 'couple', 'family', 'business', 'group'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => field.onChange(type)}
                  className={cn(
                    'px-4 py-2 rounded-full border text-sm font-medium transition-colors',
                    field.value === type
                      ? 'bg-gray-900 text-white border-gray-900'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  )}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          )}
        />
      </div>

      {/* Photo Upload */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Add photos (optional)</h3>
        <p className="text-sm text-gray-500 mb-4">Share up to 6 photos of your stay</p>

        <div className="flex flex-wrap gap-4">
          {photoUrls.map((url, index) => (
            <div key={index} className="relative w-24 h-24">
              <img
                src={url}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-700"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}

          {photos.length < 6 && (
            <label className="w-24 h-24 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
              <Upload className="w-6 h-6 text-gray-400" />
              <span className="text-xs text-gray-400 mt-1">Add</span>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>
          )}
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-3 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={!isValid || submitMutation.isPending || uploadingPhotos}
          className="flex-1 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {(submitMutation.isPending || uploadingPhotos) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {uploadingPhotos ? 'Uploading photos...' : 'Submit Review'}
        </button>
      </div>
    </form>
  );
}

function StarRating({
  value,
  onChange,
  size = 'md'
}: {
  value: number;
  onChange: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
}) {
  const [hovered, setHovered] = useState<number | null>(null);

  const sizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const isFilled = star <= (hovered ?? value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(null)}
            className="focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400 rounded"
          >
            <Star
              className={cn(
                sizeClasses[size],
                'transition-colors',
                isFilled
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300 hover:text-yellow-200'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
```

### Reviews Analytics Hook

```typescript
// hooks/useReviewsAnalytics.ts
import { useMemo } from 'react';
import { Review, ReviewsSummary, CategoryRatings } from '@/types/reviews';

export function useReviewsAnalytics(reviews: Review[]): ReviewsSummary | null {
  return useMemo(() => {
    if (reviews.length === 0) return null;

    // Calculate overall rating
    const overallRating =
      reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;

    // Calculate category averages
    const categoryKeys = ['cleanliness', 'communication', 'checkIn', 'accuracy', 'location', 'value'] as const;
    const categoryAverages = categoryKeys.reduce((acc, key) => {
      acc[key] = reviews.reduce((sum, r) => sum + r.ratings[key], 0) / reviews.length;
      return acc;
    }, {} as CategoryRatings);

    // Calculate rating distribution
    const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
      const rounded = Math.round(r.overallRating);
      if (rounded >= 1 && rounded <= 5) {
        ratingDistribution[rounded as keyof typeof ratingDistribution]++;
      }
    });

    // Extract keywords (simplified)
    const wordCounts = new Map<string, { count: number; ratings: number[] }>();
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'is', 'was', 'were', 'been']);

    reviews.forEach(r => {
      const words = r.content.toLowerCase().match(/\b\w{4,}\b/g) ?? [];
      const uniqueWords = new Set(words);
      uniqueWords.forEach(word => {
        if (stopWords.has(word)) return;
        const existing = wordCounts.get(word) ?? { count: 0, ratings: [] };
        existing.count++;
        existing.ratings.push(r.overallRating);
        wordCounts.set(word, existing);
      });
    });

    const highlightedKeywords = Array.from(wordCounts.entries())
      .filter(([_, data]) => data.count >= 3)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 10)
      .map(([keyword, data]) => {
        const avgRating = data.ratings.reduce((a, b) => a + b, 0) / data.ratings.length;
        return {
          keyword,
          count: data.count,
          sentiment: avgRating >= 4 ? 'positive' as const : avgRating >= 3 ? 'neutral' as const : 'negative' as const
        };
      });

    return {
      overallRating: Math.round(overallRating * 100) / 100,
      totalReviews: reviews.length,
      categoryAverages,
      ratingDistribution,
      highlightedKeywords
    };
  }, [reviews]);
}
```

---

## 11. Image Gallery & Lightbox

### Gallery Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Image Gallery System                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Hero Gallery (Bento Grid)                        │    │
│  │  ┌─────────────────────────────────┬───────────┬───────────┐        │    │
│  │  │                                 │           │           │        │    │
│  │  │         Main Image              │  Image 2  │  Image 3  │        │    │
│  │  │         (Large)                 │           │           │        │    │
│  │  │                                 ├───────────┼───────────┤        │    │
│  │  │                                 │           │   +12     │        │    │
│  │  │                                 │  Image 4  │ Show All  │        │    │
│  │  └─────────────────────────────────┴───────────┴───────────┘        │    │
│  │                        [Show all photos]                            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Full Gallery Modal                             │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  Categories: [All] [Living] [Bedroom] [Kitchen] [Outdoor]   │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │                    Masonry Grid                             │    │    │
│  │  │    ┌──────┐  ┌──────────┐  ┌──────┐  ┌──────┐              │    │    │
│  │  │    │      │  │          │  │      │  │      │              │    │    │
│  │  │    │ Img  │  │   Img    │  │ Img  │  │ Img  │              │    │    │
│  │  │    │      │  │          │  │      │  │      │              │    │    │
│  │  │    └──────┘  │          │  └──────┘  └──────┘              │    │    │
│  │  │              └──────────┘                                   │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                      Lightbox Viewer                                │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │   ←  │           Full Image                        │  →     │    │    │
│  │  │      │     Zoom / Pan / Pinch                      │        │    │    │
│  │  │      │                                             │        │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │          Thumbnail Strip (Scroll)                           │    │    │
│  │  │  [1] [2] [3] [4] [5] [6] [7] [8] [9] [10] ...              │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │                    Caption • 3/15 • Bedroom                         │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Image Types & Data

```typescript
// types/gallery.ts
export interface GalleryImage {
  id: string;
  url: string;
  thumbnailUrl: string;
  blurDataUrl?: string; // Base64 blur placeholder
  width: number;
  height: number;
  alt: string;
  caption?: string;
  category?: ImageCategory;
  order: number;
}

export type ImageCategory =
  | 'living_room'
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'dining'
  | 'outdoor'
  | 'amenities'
  | 'neighborhood'
  | 'floorplan';

export interface GalleryState {
  isOpen: boolean;
  currentIndex: number;
  selectedCategory: ImageCategory | null;
}
```

### Hero Gallery Component

```typescript
// components/gallery/HeroGallery.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Grid, Images } from 'lucide-react';
import { GalleryImage } from '@/types/gallery';
import { GalleryModal } from './GalleryModal';
import { cn } from '@/lib/utils';

interface HeroGalleryProps {
  images: GalleryImage[];
  listingTitle: string;
}

export function HeroGallery({ images, listingTitle }: HeroGalleryProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [initialIndex, setInitialIndex] = useState(0);

  const displayImages = images.slice(0, 5);
  const remainingCount = Math.max(0, images.length - 5);

  const handleImageClick = (index: number) => {
    setInitialIndex(index);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="relative rounded-xl overflow-hidden">
        {/* Desktop: Bento Grid Layout */}
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 h-[400px]">
          {/* Main Image */}
          <button
            onClick={() => handleImageClick(0)}
            className="col-span-2 row-span-2 relative group cursor-pointer"
          >
            <Image
              src={displayImages[0].url}
              alt={displayImages[0].alt}
              fill
              priority
              placeholder={displayImages[0].blurDataUrl ? 'blur' : 'empty'}
              blurDataURL={displayImages[0].blurDataUrl}
              className="object-cover group-hover:brightness-90 transition-all"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </button>

          {/* Secondary Images */}
          {displayImages.slice(1, 5).map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageClick(index + 1)}
              className="relative group cursor-pointer"
            >
              <Image
                src={image.url}
                alt={image.alt}
                fill
                placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                blurDataURL={image.blurDataUrl}
                className="object-cover group-hover:brightness-90 transition-all"
                sizes="(max-width: 768px) 50vw, 25vw"
              />

              {/* Remaining count overlay on last image */}
              {index === 3 && remainingCount > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white text-xl font-semibold">
                    +{remainingCount}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Mobile: Single Image with Carousel */}
        <div className="md:hidden">
          <MobileGalleryCarousel
            images={images}
            onShowAll={() => setIsModalOpen(true)}
          />
        </div>

        {/* Show All Photos Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors font-medium text-sm"
        >
          <Grid className="w-4 h-4" />
          Show all photos
        </button>
      </div>

      {/* Gallery Modal */}
      <GalleryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        images={images}
        initialIndex={initialIndex}
        listingTitle={listingTitle}
      />
    </>
  );
}

function MobileGalleryCarousel({
  images,
  onShowAll
}: {
  images: GalleryImage[];
  onShowAll: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);
    setCurrentIndex(newIndex);
  };

  return (
    <div className="relative">
      <div
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        onScroll={handleScroll}
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="flex-shrink-0 w-full h-[300px] snap-center relative"
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority={index === 0}
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* Pagination Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
        {images.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-all',
              index === currentIndex ? 'bg-white w-4' : 'bg-white/60'
            )}
          />
        ))}
        {images.length > 5 && (
          <span className="text-white text-xs ml-1">
            +{images.length - 5}
          </span>
        )}
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
        {currentIndex + 1} / {images.length}
      </div>
    </div>
  );
}
```

### Gallery Modal with Categories

```typescript
// components/gallery/GalleryModal.tsx
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { X, ZoomIn } from 'lucide-react';
import Image from 'next/image';
import { GalleryImage, ImageCategory } from '@/types/gallery';
import { Lightbox } from './Lightbox';
import { cn } from '@/lib/utils';

interface GalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: GalleryImage[];
  initialIndex?: number;
  listingTitle: string;
}

const CATEGORY_LABELS: Record<ImageCategory, string> = {
  living_room: 'Living Room',
  bedroom: 'Bedroom',
  bathroom: 'Bathroom',
  kitchen: 'Kitchen',
  dining: 'Dining',
  outdoor: 'Outdoor',
  amenities: 'Amenities',
  neighborhood: 'Neighborhood',
  floorplan: 'Floor Plan'
};

export function GalleryModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  listingTitle
}: GalleryModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<ImageCategory | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Get unique categories from images
  const categories = useMemo(() => {
    const cats = new Set<ImageCategory>();
    images.forEach(img => {
      if (img.category) cats.add(img.category);
    });
    return Array.from(cats);
  }, [images]);

  // Filter images by category
  const filteredImages = useMemo(() => {
    if (!selectedCategory) return images;
    return images.filter(img => img.category === selectedCategory);
  }, [images, selectedCategory]);

  // Open lightbox at initial index when modal opens
  useEffect(() => {
    if (isOpen && initialIndex > 0) {
      setLightboxIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
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
      <div className="fixed inset-0 z-50 bg-white">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close gallery"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-semibold text-lg">{listingTitle}</h2>

            <div className="w-9" /> {/* Spacer for centering */}
          </div>

          {/* Category Tabs */}
          {categories.length > 1 && (
            <div className="max-w-7xl mx-auto px-4 pb-4">
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                    !selectedCategory
                      ? 'bg-gray-900 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  )}
                >
                  All ({images.length})
                </button>
                {categories.map(category => {
                  const count = images.filter(img => img.category === category).length;
                  return (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={cn(
                        'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors',
                        selectedCategory === category
                          ? 'bg-gray-900 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {CATEGORY_LABELS[category]} ({count})
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Masonry Grid */}
        <div className="max-w-7xl mx-auto px-4 py-6 overflow-y-auto h-[calc(100vh-120px)]">
          <MasonryGrid
            images={filteredImages}
            onImageClick={(index) => setLightboxIndex(index)}
          />
        </div>
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}

function MasonryGrid({
  images,
  onImageClick
}: {
  images: GalleryImage[];
  onImageClick: (index: number) => void;
}) {
  // Calculate columns based on viewport
  const columns = 3; // Could be dynamic based on screen size

  // Distribute images into columns
  const columnImages = useMemo(() => {
    const cols: GalleryImage[][] = Array.from({ length: columns }, () => []);
    const colHeights = Array(columns).fill(0);

    images.forEach(image => {
      // Find shortest column
      const shortestCol = colHeights.indexOf(Math.min(...colHeights));
      cols[shortestCol].push(image);
      // Add image height (aspect ratio based)
      colHeights[shortestCol] += image.height / image.width;
    });

    return cols;
  }, [images, columns]);

  return (
    <div className="flex gap-4">
      {columnImages.map((column, colIndex) => (
        <div key={colIndex} className="flex-1 flex flex-col gap-4">
          {column.map((image) => {
            const globalIndex = images.findIndex(img => img.id === image.id);
            return (
              <button
                key={image.id}
                onClick={() => onImageClick(globalIndex)}
                className="relative group rounded-lg overflow-hidden"
                style={{
                  aspectRatio: `${image.width}/${image.height}`
                }}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  placeholder={image.blurDataUrl ? 'blur' : 'empty'}
                  blurDataURL={image.blurDataUrl}
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                {/* Caption */}
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
```

### Lightbox Component

```typescript
// components/gallery/Lightbox.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { GalleryImage } from '@/types/gallery';
import { cn } from '@/lib/utils';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({
  images,
  currentIndex,
  onClose,
  onNavigate
}: LightboxProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentImage = images[currentIndex];

  // Reset zoom/pan when changing images
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (currentIndex > 0) onNavigate(currentIndex - 1);
          break;
        case 'ArrowRight':
          if (currentIndex < images.length - 1) onNavigate(currentIndex + 1);
          break;
        case '+':
        case '=':
          setZoom(prev => Math.min(prev + 0.5, 4));
          break;
        case '-':
          setZoom(prev => Math.max(prev - 0.5, 1));
          break;
        case '0':
          setZoom(1);
          setPan({ x: 0, y: 0 });
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, images.length, onClose, onNavigate]);

  // Mouse drag for panning
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch gestures for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      dragStart.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      };
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    setPan({
      x: e.touches[0].clientX - dragStart.current.x,
      y: e.touches[0].clientY - dragStart.current.y
    });
  }, [isDragging]);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom(prev => Math.max(1, Math.min(4, prev + delta)));
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) onNavigate(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < images.length - 1) onNavigate(currentIndex + 1);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      {/* Header Controls */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent">
        <button
          onClick={onClose}
          className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setZoom(prev => Math.max(prev - 0.5, 1))}
            disabled={zoom <= 1}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
            aria-label="Zoom out"
          >
            <ZoomOut className="w-5 h-5" />
          </button>
          <span className="text-white text-sm min-w-[3rem] text-center">
            {Math.round(zoom * 100)}%
          </span>
          <button
            onClick={() => setZoom(prev => Math.min(prev + 0.5, 4))}
            disabled={zoom >= 4}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors disabled:opacity-50"
            aria-label="Zoom in"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              setZoom(1);
              setPan({ x: 0, y: 0 });
            }}
            className="p-2 text-white hover:bg-white/20 rounded-full transition-colors"
            aria-label="Reset zoom"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        <div className="text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Main Image Area */}
      <div
        ref={containerRef}
        className={cn(
          'absolute inset-0 flex items-center justify-center',
          zoom > 1 ? 'cursor-grab' : 'cursor-default',
          isDragging && 'cursor-grabbing'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleMouseUp}
        onWheel={handleWheel}
      >
        <div
          className="relative transition-transform duration-100"
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            maxWidth: '90vw',
            maxHeight: '80vh'
          }}
        >
          <Image
            src={currentImage.url}
            alt={currentImage.alt}
            width={currentImage.width}
            height={currentImage.height}
            priority
            className="object-contain max-h-[80vh] w-auto"
            draggable={false}
          />
        </div>
      </div>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={handlePrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      {/* Thumbnail Strip */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
        {/* Caption */}
        {currentImage.caption && (
          <p className="text-white text-center mb-4">{currentImage.caption}</p>
        )}

        <ThumbnailStrip
          images={images}
          currentIndex={currentIndex}
          onSelect={onNavigate}
        />
      </div>
    </div>
  );
}

function ThumbnailStrip({
  images,
  currentIndex,
  onSelect
}: {
  images: GalleryImage[];
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Scroll current thumbnail into view
  useEffect(() => {
    const container = containerRef.current;
    const thumbnail = container?.children[currentIndex] as HTMLElement;
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto scrollbar-hide py-2 justify-center"
    >
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onSelect(index)}
          className={cn(
            'relative flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden transition-all',
            index === currentIndex
              ? 'ring-2 ring-white'
              : 'opacity-50 hover:opacity-100'
          )}
        >
          <Image
            src={image.thumbnailUrl}
            alt={image.alt}
            fill
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}
```

### Lazy Loading Image Component

```typescript
// components/gallery/LazyImage.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  blurDataUrl?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  onLoad?: () => void;
}

export function LazyImage({
  src,
  alt,
  width,
  height,
  fill,
  blurDataUrl,
  className,
  priority = false,
  sizes,
  onLoad
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '200px', // Start loading 200px before viewport
        threshold: 0
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden', className)}
      style={!fill ? { width, height } : undefined}
    >
      {/* Blur Placeholder */}
      {blurDataUrl && !isLoaded && (
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl scale-110"
          style={{ backgroundImage: `url(${blurDataUrl})` }}
        />
      )}

      {/* Skeleton Placeholder */}
      {!blurDataUrl && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Actual Image */}
      {isInView && (
        <Image
          src={src}
          alt={alt}
          width={!fill ? width : undefined}
          height={!fill ? height : undefined}
          fill={fill}
          sizes={sizes}
          priority={priority}
          onLoad={handleLoad}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
        />
      )}
    </div>
  );
}
```

### Virtual Tour Integration

```typescript
// components/gallery/VirtualTour.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Expand, Volume2, VolumeX } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VirtualTourProps {
  tourUrl: string; // Matterport, 360 video, etc.
  thumbnailUrl: string;
  type: 'matterport' | '360video' | 'iframe';
}

export function VirtualTour({ tourUrl, thumbnailUrl, type }: VirtualTourProps) {
  const [isActive, setIsActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-900"
    >
      {!isActive ? (
        // Thumbnail with Play Button
        <button
          onClick={() => setIsActive(true)}
          className="absolute inset-0 group"
        >
          <img
            src={thumbnailUrl}
            alt="Virtual tour preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Play className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" />
            </div>
            <span className="mt-4 text-white font-semibold text-lg">
              Take a Virtual Tour
            </span>
          </div>
        </button>
      ) : (
        // Active Tour
        <>
          {type === 'matterport' && (
            <iframe
              src={`${tourUrl}&play=1`}
              className="w-full h-full"
              allowFullScreen
              allow="xr-spatial-tracking"
            />
          )}

          {type === '360video' && (
            <Video360Player src={tourUrl} />
          )}

          {type === 'iframe' && (
            <iframe
              src={tourUrl}
              className="w-full h-full"
              allowFullScreen
            />
          )}

          {/* Controls */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={handleFullscreen}
              className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
              aria-label="Toggle fullscreen"
            >
              <Expand className="w-5 h-5" />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Video360Player({ src }: { src: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative w-full h-full">
      <video
        ref={videoRef}
        src={src}
        autoPlay
        muted
        loop
        playsInline
        className="w-full h-full object-cover"
      />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          onClick={togglePlay}
          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
        </button>
        <button
          onClick={toggleMute}
          className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
```

---

## 12. Wishlists & Favorites

### Wishlist Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        Wishlists & Favorites System                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Save Button (On Listing Card)                    │    │
│  │                       ♡ → ❤ (Toggle Animation)                      │    │
│  │                    Click → Show Collection Picker                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Collection Picker Modal                          │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  + Create new wishlist                                      │    │    │
│  │  ├─────────────────────────────────────────────────────────────┤    │    │
│  │  │  ┌─────┐  Summer 2024                        [✓] Selected   │    │    │
│  │  │  │ 📷  │  12 stays saved                                    │    │    │
│  │  │  └─────┘                                                    │    │    │
│  │  │  ┌─────┐  Beach Getaways                     [ ]            │    │    │
│  │  │  │ 📷  │  8 stays saved                                     │    │    │
│  │  │  └─────┘                                                    │    │    │
│  │  │  ┌─────┐  Mountain Retreats                  [ ]            │    │    │
│  │  │  │ 📷  │  5 stays saved                                     │    │    │
│  │  │  └─────┘                                                    │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Wishlists Page                                   │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                  │    │
│  │  │             │  │             │  │             │                  │    │
│  │  │ Collection  │  │ Collection  │  │  + Create   │                  │    │
│  │  │   Card      │  │   Card      │  │    New      │                  │    │
│  │  │             │  │             │  │             │                  │    │
│  │  │ 12 stays    │  │ 8 stays     │  │             │                  │    │
│  │  └─────────────┘  └─────────────┘  └─────────────┘                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Collection Detail View                           │    │
│  │  • Edit name/settings  • Share collection  • Map view              │    │
│  │  • Drag to reorder    • Remove items       • Collaborate           │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Wishlist Types & Store

```typescript
// types/wishlist.ts
export interface Wishlist {
  id: string;
  name: string;
  privacy: 'private' | 'shared' | 'public';
  coverImage?: string;
  items: WishlistItem[];
  collaborators: Collaborator[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  listingId: string;
  listing: ListingSummary;
  addedAt: string;
  note?: string;
  order: number;
}

export interface ListingSummary {
  id: string;
  title: string;
  location: string;
  imageUrl: string;
  pricePerNight: number;
  rating: number;
  reviewCount: number;
}

export interface Collaborator {
  id: string;
  userId: string;
  name: string;
  avatar?: string;
  role: 'owner' | 'editor' | 'viewer';
}

// stores/wishlistStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Wishlist, WishlistItem } from '@/types/wishlist';

interface WishlistState {
  wishlists: Wishlist[];
  savedListingIds: Set<string>;
  isLoading: boolean;

  // Actions
  fetchWishlists: () => Promise<void>;
  createWishlist: (name: string) => Promise<Wishlist>;
  deleteWishlist: (wishlistId: string) => Promise<void>;
  renameWishlist: (wishlistId: string, name: string) => Promise<void>;

  toggleSave: (listingId: string, wishlistId?: string) => Promise<void>;
  addToWishlist: (listingId: string, wishlistId: string) => Promise<void>;
  removeFromWishlist: (listingId: string, wishlistId: string) => Promise<void>;
  moveItem: (listingId: string, fromId: string, toId: string) => Promise<void>;

  isListingSaved: (listingId: string) => boolean;
  getWishlistsForListing: (listingId: string) => string[];
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      wishlists: [],
      savedListingIds: new Set(),
      isLoading: false,

      fetchWishlists: async () => {
        set({ isLoading: true });
        try {
          const response = await fetch('/api/wishlists');
          const data = await response.json();

          const savedIds = new Set<string>();
          data.wishlists.forEach((wl: Wishlist) => {
            wl.items.forEach(item => savedIds.add(item.listingId));
          });

          set({
            wishlists: data.wishlists,
            savedListingIds: savedIds,
            isLoading: false
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      createWishlist: async (name) => {
        const response = await fetch('/api/wishlists', {
          method: 'POST',
          body: JSON.stringify({ name })
        });
        const wishlist = await response.json();

        set(state => ({
          wishlists: [...state.wishlists, wishlist]
        }));

        return wishlist;
      },

      deleteWishlist: async (wishlistId) => {
        await fetch(`/api/wishlists/${wishlistId}`, { method: 'DELETE' });

        set(state => {
          const updatedWishlists = state.wishlists.filter(wl => wl.id !== wishlistId);
          const savedIds = new Set<string>();
          updatedWishlists.forEach(wl => {
            wl.items.forEach(item => savedIds.add(item.listingId));
          });
          return {
            wishlists: updatedWishlists,
            savedListingIds: savedIds
          };
        });
      },

      renameWishlist: async (wishlistId, name) => {
        await fetch(`/api/wishlists/${wishlistId}`, {
          method: 'PATCH',
          body: JSON.stringify({ name })
        });

        set(state => ({
          wishlists: state.wishlists.map(wl =>
            wl.id === wishlistId ? { ...wl, name } : wl
          )
        }));
      },

      toggleSave: async (listingId, wishlistId) => {
        const { wishlists, savedListingIds } = get();

        if (savedListingIds.has(listingId)) {
          // Remove from all wishlists
          const wishlistsWithItem = wishlists.filter(wl =>
            wl.items.some(item => item.listingId === listingId)
          );
          for (const wl of wishlistsWithItem) {
            await get().removeFromWishlist(listingId, wl.id);
          }
        } else if (wishlistId) {
          await get().addToWishlist(listingId, wishlistId);
        }
      },

      addToWishlist: async (listingId, wishlistId) => {
        const response = await fetch(`/api/wishlists/${wishlistId}/items`, {
          method: 'POST',
          body: JSON.stringify({ listingId })
        });
        const item = await response.json();

        set(state => ({
          wishlists: state.wishlists.map(wl =>
            wl.id === wishlistId
              ? { ...wl, items: [...wl.items, item] }
              : wl
          ),
          savedListingIds: new Set([...state.savedListingIds, listingId])
        }));
      },

      removeFromWishlist: async (listingId, wishlistId) => {
        await fetch(`/api/wishlists/${wishlistId}/items/${listingId}`, {
          method: 'DELETE'
        });

        set(state => {
          const updatedWishlists = state.wishlists.map(wl =>
            wl.id === wishlistId
              ? { ...wl, items: wl.items.filter(i => i.listingId !== listingId) }
              : wl
          );

          const stillSaved = updatedWishlists.some(wl =>
            wl.items.some(item => item.listingId === listingId)
          );

          const newSavedIds = new Set(state.savedListingIds);
          if (!stillSaved) {
            newSavedIds.delete(listingId);
          }

          return {
            wishlists: updatedWishlists,
            savedListingIds: newSavedIds
          };
        });
      },

      moveItem: async (listingId, fromId, toId) => {
        await get().removeFromWishlist(listingId, fromId);
        await get().addToWishlist(listingId, toId);
      },

      isListingSaved: (listingId) => {
        return get().savedListingIds.has(listingId);
      },

      getWishlistsForListing: (listingId) => {
        return get().wishlists
          .filter(wl => wl.items.some(item => item.listingId === listingId))
          .map(wl => wl.id);
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({
        savedListingIds: Array.from(state.savedListingIds)
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.savedListingIds = new Set(state.savedListingIds as any);
        }
      }
    }
  )
);
```

### Save Button Component

```typescript
// components/wishlist/SaveButton.tsx
'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useWishlistStore } from '@/stores/wishlistStore';
import { CollectionPicker } from './CollectionPicker';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

interface SaveButtonProps {
  listingId: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function SaveButton({
  listingId,
  className,
  size = 'md',
  showLabel = false
}: SaveButtonProps) {
  const { isAuthenticated, openAuthModal } = useAuth();
  const { isListingSaved, toggleSave, wishlists } = useWishlistStore();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const isSaved = isListingSaved(listingId);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (isSaved) {
      // Unsave from all wishlists
      setIsAnimating(true);
      await toggleSave(listingId);
      setTimeout(() => setIsAnimating(false), 300);
    } else {
      // Show collection picker
      setIsPickerOpen(true);
    }
  };

  const handleSaveToCollection = async (wishlistId: string) => {
    setIsAnimating(true);
    await toggleSave(listingId, wishlistId);
    setTimeout(() => setIsAnimating(false), 300);
    setIsPickerOpen(false);
  };

  const sizeClasses = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center rounded-full transition-all',
          'hover:scale-110 active:scale-95',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500',
          sizeClasses[size],
          className
        )}
        aria-label={isSaved ? 'Remove from wishlist' : 'Save to wishlist'}
      >
        <Heart
          className={cn(
            iconSizes[size],
            'transition-all duration-300',
            isSaved && 'fill-rose-500 text-rose-500',
            !isSaved && 'text-white drop-shadow-md hover:text-rose-500',
            isAnimating && 'scale-125'
          )}
          strokeWidth={2}
        />
        {showLabel && (
          <span className="ml-2 text-sm font-medium">
            {isSaved ? 'Saved' : 'Save'}
          </span>
        )}
      </button>

      <CollectionPicker
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleSaveToCollection}
        wishlists={wishlists}
        listingId={listingId}
      />
    </>
  );
}
```

### Collection Picker Modal

```typescript
// components/wishlist/CollectionPicker.tsx
'use client';

import { useState } from 'react';
import { X, Plus, Check, Lock, Users, Globe } from 'lucide-react';
import Image from 'next/image';
import { Wishlist } from '@/types/wishlist';
import { useWishlistStore } from '@/stores/wishlistStore';
import { cn } from '@/lib/utils';

interface CollectionPickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (wishlistId: string) => void;
  wishlists: Wishlist[];
  listingId: string;
}

export function CollectionPicker({
  isOpen,
  onClose,
  onSelect,
  wishlists,
  listingId
}: CollectionPickerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [newName, setNewName] = useState('');
  const { createWishlist, getWishlistsForListing } = useWishlistStore();

  const selectedWishlists = getWishlistsForListing(listingId);

  const handleCreate = async () => {
    if (!newName.trim()) return;

    const wishlist = await createWishlist(newName.trim());
    onSelect(wishlist.id);
    setNewName('');
    setIsCreating(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[80vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Save to wishlist</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {/* Create New */}
          {isCreating ? (
            <div className="p-4 border-b">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Name your wishlist"
                className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate();
                  if (e.key === 'Escape') setIsCreating(false);
                }}
              />
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => setIsCreating(false)}
                  className="flex-1 py-2 border rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!newName.trim()}
                  className="flex-1 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsCreating(true)}
              className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors border-b"
            >
              <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-400" />
              </div>
              <span className="font-medium">Create new wishlist</span>
            </button>
          )}

          {/* Existing Wishlists */}
          {wishlists.map((wishlist) => {
            const isSelected = selectedWishlists.includes(wishlist.id);
            const coverImage = wishlist.coverImage || wishlist.items[0]?.listing.imageUrl;

            return (
              <button
                key={wishlist.id}
                onClick={() => onSelect(wishlist.id)}
                className={cn(
                  'w-full p-4 flex items-center gap-4 transition-colors',
                  isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
                )}
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                  {coverImage ? (
                    <Image
                      src={coverImage}
                      alt={wishlist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <Heart className="w-6 h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{wishlist.name}</h3>
                    <PrivacyIcon privacy={wishlist.privacy} />
                  </div>
                  <p className="text-sm text-gray-500">
                    {wishlist.items.length} {wishlist.items.length === 1 ? 'stay' : 'stays'} saved
                  </p>
                </div>

                {isSelected && (
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
              </button>
            );
          })}

          {wishlists.length === 0 && !isCreating && (
            <div className="p-8 text-center text-gray-500">
              <Heart className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No wishlists yet</p>
              <p className="text-sm">Create one to start saving places</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PrivacyIcon({ privacy }: { privacy: Wishlist['privacy'] }) {
  switch (privacy) {
    case 'private':
      return <Lock className="w-3 h-3 text-gray-400" />;
    case 'shared':
      return <Users className="w-3 h-3 text-gray-400" />;
    case 'public':
      return <Globe className="w-3 h-3 text-gray-400" />;
    default:
      return null;
  }
}
```

### Wishlists Page

```typescript
// app/wishlists/page.tsx
import { Suspense } from 'react';
import { WishlistsGrid } from '@/components/wishlist/WishlistsGrid';
import { WishlistsGridSkeleton } from '@/components/wishlist/WishlistsGridSkeleton';

export default function WishlistsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Wishlists</h1>

      <Suspense fallback={<WishlistsGridSkeleton />}>
        <WishlistsGrid />
      </Suspense>
    </div>
  );
}

// components/wishlist/WishlistsGrid.tsx
'use client';

import { useEffect } from 'react';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Wishlist } from '@/types/wishlist';
import { cn } from '@/lib/utils';

export function WishlistsGrid() {
  const { wishlists, fetchWishlists, isLoading } = useWishlistStore();

  useEffect(() => {
    fetchWishlists();
  }, [fetchWishlists]);

  if (isLoading) {
    return <WishlistsGridSkeleton />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {wishlists.map((wishlist) => (
        <WishlistCard key={wishlist.id} wishlist={wishlist} />
      ))}

      <CreateWishlistCard />
    </div>
  );
}

function WishlistCard({ wishlist }: { wishlist: Wishlist }) {
  const previewImages = wishlist.items.slice(0, 4).map(item => item.listing.imageUrl);

  return (
    <Link
      href={`/wishlists/${wishlist.id}`}
      className="group block"
    >
      {/* Cover Image Grid */}
      <div className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 mb-3">
        {previewImages.length === 0 ? (
          <div className="w-full h-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-gray-300" />
          </div>
        ) : previewImages.length === 1 ? (
          <Image
            src={previewImages[0]}
            alt={wishlist.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="grid grid-cols-2 grid-rows-2 gap-0.5 h-full">
            {previewImages.slice(0, 4).map((url, i) => (
              <div key={i} className="relative">
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* Remaining Count */}
        {wishlist.items.length > 4 && (
          <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full">
            +{wishlist.items.length - 4}
          </div>
        )}
      </div>

      {/* Info */}
      <h3 className="font-semibold group-hover:underline">{wishlist.name}</h3>
      <p className="text-sm text-gray-500">
        {wishlist.items.length} {wishlist.items.length === 1 ? 'stay' : 'stays'} saved
      </p>
    </Link>
  );
}

function CreateWishlistCard() {
  const { createWishlist } = useWishlistStore();
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState('');

  const handleCreate = async () => {
    if (!name.trim()) return;
    await createWishlist(name.trim());
    setName('');
    setIsCreating(false);
  };

  if (isCreating) {
    return (
      <div className="aspect-square rounded-xl border-2 border-dashed border-gray-300 p-4 flex flex-col items-center justify-center">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Wishlist name"
          className="w-full px-3 py-2 border rounded-lg text-center focus:ring-2 focus:ring-black focus:border-transparent"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreate();
            if (e.key === 'Escape') setIsCreating(false);
          }}
        />
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setIsCreating(false)}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleCreate}
            disabled={!name.trim()}
            className="px-4 py-2 text-sm bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
          >
            Create
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsCreating(true)}
      className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-colors"
    >
      <Plus className="w-8 h-8 text-gray-400 mb-2" />
      <span className="text-gray-600 font-medium">Create wishlist</span>
    </button>
  );
}

export function WishlistsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i}>
          <div className="aspect-square rounded-xl bg-gray-200 animate-pulse mb-3" />
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse mb-2" />
          <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
```

### Wishlist Detail Page

```typescript
// app/wishlists/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  MoreHorizontal, Share, Pencil, Trash2, Map, Grid, List,
  Link as LinkIcon, Copy, Check
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { useWishlistStore } from '@/stores/wishlistStore';
import { ListingCard } from '@/components/listings/ListingCard';
import { MapView } from '@/components/map/MapView';
import { cn } from '@/lib/utils';

export default function WishlistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { wishlists, renameWishlist, deleteWishlist, removeFromWishlist } = useWishlistStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [shareLink, setShareLink] = useState<string | null>(null);

  const wishlist = wishlists.find(wl => wl.id === id);

  useEffect(() => {
    if (wishlist) {
      setEditedName(wishlist.name);
    }
  }, [wishlist]);

  if (!wishlist) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Wishlist not found</h1>
        <button
          onClick={() => router.push('/wishlists')}
          className="text-rose-600 hover:underline"
        >
          Back to wishlists
        </button>
      </div>
    );
  }

  const handleRename = async () => {
    if (editedName.trim() && editedName !== wishlist.name) {
      await renameWishlist(wishlist.id, editedName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this wishlist?')) {
      await deleteWishlist(wishlist.id);
      router.push('/wishlists');
    }
  };

  const handleShare = async () => {
    const link = `${window.location.origin}/wishlists/shared/${wishlist.id}`;
    setShareLink(link);
    await navigator.clipboard.writeText(link);
    setTimeout(() => setShareLink(null), 2000);
  };

  const handleDragEnd = async (result: DropResult) => {
    if (!result.destination) return;

    // Reorder logic would go here
    console.log('Reorder:', result.source.index, '->', result.destination.index);
  };

  const listings = wishlist.items.map(item => ({
    ...item.listing,
    coordinates: { lat: 0, lng: 0 } // Would come from API
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          {isEditing ? (
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRename();
                if (e.key === 'Escape') setIsEditing(false);
              }}
              className="text-3xl font-bold border-b-2 border-black outline-none"
              autoFocus
            />
          ) : (
            <h1 className="text-3xl font-bold">{wishlist.name}</h1>
          )}
          <p className="text-gray-500 mt-1">
            {wishlist.items.length} {wishlist.items.length === 1 ? 'stay' : 'stays'} saved
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'grid' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
              )}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'list' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
              )}
            >
              <List className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={cn(
                'p-2 transition-colors',
                viewMode === 'map' ? 'bg-gray-900 text-white' : 'hover:bg-gray-100'
              )}
            >
              <Map className="w-5 h-5" />
            </button>
          </div>

          {/* Share Button */}
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            {shareLink ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Share className="w-4 h-4" />
                <span>Share</span>
              </>
            )}
          </button>

          {/* More Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-1">
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Pencil className="w-4 h-4" />
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete wishlist
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      {wishlist.items.length === 0 ? (
        <div className="text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No saved stays yet</h2>
          <p className="text-gray-500 mb-6">
            Start exploring and save places you love
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-rose-600 text-white rounded-lg font-semibold hover:bg-rose-700 transition-colors"
          >
            Start exploring
          </button>
        </div>
      ) : viewMode === 'map' ? (
        <div className="h-[600px] rounded-xl overflow-hidden">
          <MapView listings={listings} />
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="wishlist">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={cn(
                  viewMode === 'grid' && 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
                  viewMode === 'list' && 'space-y-4'
                )}
              >
                {wishlist.items.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className={cn(
                          snapshot.isDragging && 'shadow-2xl'
                        )}
                      >
                        <ListingCard
                          listing={item.listing}
                          layout={viewMode === 'list' ? 'horizontal' : 'vertical'}
                          onRemove={() => removeFromWishlist(item.listingId, wishlist.id)}
                          showRemoveButton
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
}
```

---

## 13. Performance Optimization

### Performance Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      Performance Optimization Strategy                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Core Web Vitals Targets                          │    │
│  │  ┌─────────────────┬─────────────────┬─────────────────┐            │    │
│  │  │      LCP        │      FID        │      CLS        │            │    │
│  │  │   < 2.5s        │   < 100ms       │   < 0.1         │            │    │
│  │  │  (Largest       │  (First Input   │  (Cumulative    │            │    │
│  │  │   Contentful    │   Delay)        │   Layout        │            │    │
│  │  │   Paint)        │                 │   Shift)        │            │    │
│  │  └─────────────────┴─────────────────┴─────────────────┘            │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Optimization Layers                              │    │
│  │                                                                     │    │
│  │  1. Build Time                                                      │    │
│  │     • Code splitting    • Tree shaking    • Bundle analysis         │    │
│  │     • Image optimization • Font subsetting                          │    │
│  │                                                                     │    │
│  │  2. Server                                                          │    │
│  │     • SSR/SSG strategy  • Edge caching   • Streaming                │    │
│  │     • API response caching               • Compression              │    │
│  │                                                                     │    │
│  │  3. Client                                                          │    │
│  │     • Lazy loading      • Prefetching    • Service Worker           │    │
│  │     • Virtual scrolling • Debouncing     • Memory management        │    │
│  │                                                                     │    │
│  │  4. Assets                                                          │    │
│  │     • Image CDN         • Responsive images • WebP/AVIF            │    │
│  │     • Critical CSS      • Font loading    • Resource hints          │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Code Splitting Strategy

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: [
      'lucide-react',
      'date-fns',
      '@tanstack/react-query',
      'lodash-es'
    ]
  },

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.travelbook.com',
        pathname: '/listings/**'
      }
    ]
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      {
        source: '/:all*(js|css)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      }
    ];
  },

  // Bundle analyzer
  webpack: (config, { isServer }) => {
    if (process.env.ANALYZE === 'true') {
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static',
          reportFilename: isServer
            ? '../analyze/server.html'
            : './analyze/client.html'
        })
      );
    }
    return config;
  }
};

module.exports = nextConfig;
```

### Dynamic Imports & Lazy Loading

```typescript
// components/LazyComponents.tsx
import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Heavy components loaded on demand
export const MapView = dynamic(
  () => import('./map/MapView').then(mod => mod.MapView),
  {
    loading: () => <MapSkeleton />,
    ssr: false // Maps don't need SSR
  }
);

export const DateRangePicker = dynamic(
  () => import('./booking/DateRangePicker').then(mod => mod.DateRangePicker),
  {
    loading: () => <DatePickerSkeleton />
  }
);

export const ReviewsList = dynamic(
  () => import('./reviews/ReviewsList').then(mod => mod.ReviewsList),
  {
    loading: () => <ReviewsSkeleton />
  }
);

export const GalleryModal = dynamic(
  () => import('./gallery/GalleryModal').then(mod => mod.GalleryModal),
  {
    ssr: false
  }
);

export const StripePayment = dynamic(
  () => import('./checkout/StripePayment').then(mod => mod.StripePayment),
  {
    ssr: false,
    loading: () => <PaymentSkeleton />
  }
);

// Intersection Observer based lazy loading
export function LazyComponent<T extends object>({
  component: Component,
  fallback,
  ...props
}: {
  component: ComponentType<T>;
  fallback: React.ReactNode;
} & T) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {isVisible ? <Component {...(props as T)} /> : fallback}
    </div>
  );
}
```

### Image Optimization

```typescript
// components/OptimizedImage.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import Image, { ImageProps } from 'next/image';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends Omit<ImageProps, 'onLoad'> {
  lowQualitySrc?: string;
  aspectRatio?: number;
  eager?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  lowQualitySrc,
  aspectRatio,
  eager = false,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(eager);
  const imgRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (eager) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [eager]);

  return (
    <div
      ref={imgRef}
      className={cn('relative overflow-hidden', className)}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {/* Low quality placeholder */}
      {lowQualitySrc && !isLoaded && (
        <Image
          src={lowQualitySrc}
          alt=""
          fill
          className="object-cover blur-lg scale-110"
          priority
        />
      )}

      {/* Skeleton placeholder */}
      {!lowQualitySrc && !isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Actual image */}
      {isInView && (
        <Image
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          className={cn(
            'transition-opacity duration-500',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
}

// Image srcset generator for responsive images
export function generateImageSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1920]
): string {
  return widths
    .map(w => `${baseUrl}?w=${w}&q=80 ${w}w`)
    .join(', ');
}

// Blur hash placeholder generator (server-side)
export async function generateBlurPlaceholder(imageUrl: string): Promise<string> {
  const { getPlaiceholder } = await import('plaiceholder');
  const { base64 } = await getPlaiceholder(imageUrl);
  return base64;
}
```

### Query Caching Strategy

```typescript
// lib/queryClient.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: how long data is considered fresh
      staleTime: 5 * 60 * 1000, // 5 minutes

      // GC time: how long to keep unused data in cache
      gcTime: 30 * 60 * 1000, // 30 minutes

      // Retry configuration
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false;
        if (error?.status === 401) return false;
        return failureCount < 3;
      },

      // Refetch configuration
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,

      // Network mode
      networkMode: 'offlineFirst'
    },
    mutations: {
      retry: 1,
      networkMode: 'online'
    }
  }
});

// Prefetch utilities
export async function prefetchListings(
  queryClient: QueryClient,
  filters: Record<string, any>
) {
  await queryClient.prefetchInfiniteQuery({
    queryKey: ['listings', filters],
    queryFn: ({ pageParam = 1 }) => fetchListings({ ...filters, page: pageParam }),
    initialPageParam: 1,
    staleTime: 10 * 60 * 1000
  });
}

export async function prefetchListing(
  queryClient: QueryClient,
  listingId: string
) {
  await queryClient.prefetchQuery({
    queryKey: ['listing', listingId],
    queryFn: () => fetchListing(listingId),
    staleTime: 5 * 60 * 1000
  });
}

// Optimistic updates helper
export function useOptimisticMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options: {
    queryKey: unknown[];
    optimisticUpdate: (old: TData | undefined, variables: TVariables) => TData;
  }
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: options.queryKey });

      const previousData = queryClient.getQueryData<TData>(options.queryKey);

      queryClient.setQueryData<TData>(
        options.queryKey,
        (old) => options.optimisticUpdate(old, variables)
      );

      return { previousData };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(options.queryKey, context?.previousData);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: options.queryKey });
    }
  });
}
```

### Virtual Scrolling for Large Lists

```typescript
// components/VirtualizedListingGrid.tsx
'use client';

import { useRef, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { ListingCard } from './ListingCard';
import { Listing } from '@/types';

interface VirtualizedListingGridProps {
  listings: Listing[];
  columns?: number;
  gap?: number;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
}

export function VirtualizedListingGrid({
  listings,
  columns = 4,
  gap = 24,
  hasNextPage,
  onLoadMore
}: VirtualizedListingGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Calculate rows
  const rows = useMemo(() => {
    const result: Listing[][] = [];
    for (let i = 0; i < listings.length; i += columns) {
      result.push(listings.slice(i, i + columns));
    }
    return result;
  }, [listings, columns]);

  const rowVirtualizer = useVirtualizer({
    count: hasNextPage ? rows.length + 1 : rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 320, // Estimated row height
    overscan: 3,
    onChange: (instance) => {
      const lastItem = instance.getVirtualItems().at(-1);
      if (
        lastItem &&
        lastItem.index >= rows.length - 1 &&
        hasNextPage &&
        onLoadMore
      ) {
        onLoadMore();
      }
    }
  });

  return (
    <div
      ref={parentRef}
      className="h-screen overflow-auto"
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative'
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const isLoaderRow = virtualRow.index >= rows.length;
          const row = rows[virtualRow.index];

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
              {isLoaderRow ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
                </div>
              ) : (
                <div
                  className="grid"
                  style={{
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap: `${gap}px`
                  }}
                >
                  {row.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Service Worker & Caching

```typescript
// public/sw.js
const CACHE_NAME = 'travelbook-v1';
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json'
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
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - network first, fallback to cache
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // API requests - network only with cache fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful GET responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Images - cache first
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
          return response;
        });
      })
    );
    return;
  }

  // Pages - network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          return cached || caches.match('/offline');
        });
      })
  );
});
```

### Performance Monitoring

```typescript
// lib/performance.ts
import { onCLS, onFID, onLCP, onFCP, onTTFB, Metric } from 'web-vitals';

// Report to analytics
function sendToAnalytics(metric: Metric) {
  const body = JSON.stringify({
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
    delta: metric.delta,
    id: metric.id,
    navigationType: metric.navigationType,
    url: window.location.href,
    timestamp: Date.now()
  });

  // Use sendBeacon for reliability
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/vitals', body);
  } else {
    fetch('/api/analytics/vitals', {
      method: 'POST',
      body,
      keepalive: true
    });
  }
}

// Initialize monitoring
export function initPerformanceMonitoring() {
  onCLS(sendToAnalytics);
  onFID(sendToAnalytics);
  onLCP(sendToAnalytics);
  onFCP(sendToAnalytics);
  onTTFB(sendToAnalytics);
}

// Custom performance marks
export function measureComponent(name: string) {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;
  const measureName = `${name}-render`;

  return {
    start: () => performance.mark(startMark),
    end: () => {
      performance.mark(endMark);
      try {
        performance.measure(measureName, startMark, endMark);
        const measure = performance.getEntriesByName(measureName)[0];
        if (measure && measure.duration > 100) {
          console.warn(`Slow component: ${name} took ${measure.duration}ms`);
        }
      } catch (e) {
        // Marks may have been cleared
      }
    }
  };
}

// React hook for component performance
export function usePerformanceMeasure(componentName: string) {
  useEffect(() => {
    const measure = measureComponent(componentName);
    measure.start();
    return () => measure.end();
  }, [componentName]);
}
```

### Resource Hints & Prefetching

```typescript
// components/ResourceHints.tsx
'use client';

import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ResourceHintsProps {
  preconnect?: string[];
  prefetchDns?: string[];
  preloadImages?: string[];
}

export function ResourceHints({
  preconnect = [],
  prefetchDns = [],
  preloadImages = []
}: ResourceHintsProps) {
  return (
    <Head>
      {/* Preconnect to critical origins */}
      {preconnect.map((url) => (
        <link key={url} rel="preconnect" href={url} />
      ))}

      {/* DNS prefetch for third-party origins */}
      {prefetchDns.map((url) => (
        <link key={url} rel="dns-prefetch" href={url} />
      ))}

      {/* Preload critical images */}
      {preloadImages.map((url) => (
        <link key={url} rel="preload" as="image" href={url} />
      ))}
    </Head>
  );
}

// Route prefetching hook
export function usePrefetchRoutes(routes: string[]) {
  const router = useRouter();

  useEffect(() => {
    // Prefetch routes after initial paint
    const timer = setTimeout(() => {
      routes.forEach((route) => router.prefetch(route));
    }, 2000);

    return () => clearTimeout(timer);
  }, [routes, router]);
}

// Hover-based prefetching
export function PrefetchLink({
  href,
  children,
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const router = useRouter();
  const prefetchTimeout = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    prefetchTimeout.current = setTimeout(() => {
      router.prefetch(href);
    }, 100);
  };

  const handleMouseLeave = () => {
    if (prefetchTimeout.current) {
      clearTimeout(prefetchTimeout.current);
    }
  };

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  );
}
```

### Memory Management

```typescript
// hooks/useMemoryManagement.ts
import { useEffect, useRef, useCallback } from 'react';

// Cleanup subscriptions and event listeners
export function useCleanup(cleanup: () => void) {
  const cleanupRef = useRef(cleanup);
  cleanupRef.current = cleanup;

  useEffect(() => {
    return () => cleanupRef.current();
  }, []);
}

// Debounced value with cleanup
export function useDebouncedValue<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// Object URL management
export function useObjectUrl(file: File | Blob | null): string | null {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  return url;
}

// Image preloading with cleanup
export function usePreloadImages(urls: string[]) {
  useEffect(() => {
    const images: HTMLImageElement[] = [];

    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
      images.push(img);
    });

    return () => {
      images.forEach((img) => {
        img.src = '';
      });
    };
  }, [urls]);
}

// AbortController for fetch requests
export function useAbortableFetch() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchWithAbort = useCallback(async (
    url: string,
    options?: RequestInit
  ) => {
    // Abort previous request
    abortControllerRef.current?.abort();

    // Create new controller
    abortControllerRef.current = new AbortController();

    return fetch(url, {
      ...options,
      signal: abortControllerRef.current.signal
    });
  }, []);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return fetchWithAbort;
}
```

### Critical CSS & Font Loading

```typescript
// app/layout.tsx
import { Inter, Playfair_Display } from 'next/font/google';

// Optimized font loading
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  preload: true
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600', '700'],
  preload: false // Secondary font, load on demand
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { font-family: var(--font-inter), system-ui, sans-serif; }
            .skeleton { background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
            @keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }
          `
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 14. Guest Selector Component

### Guest Selector Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         Guest Selector Component                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Collapsed State                                  │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  👥 Guests                                                  │    │    │
│  │  │  2 guests, 1 infant, 1 pet                                 ▼│    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    ↓                                        │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                    Expanded Dropdown                                │    │
│  │  ┌─────────────────────────────────────────────────────────────┐    │    │
│  │  │  Adults                                        [-] 2 [+]    │    │    │
│  │  │  Age 13 or above                                            │    │    │
│  │  ├─────────────────────────────────────────────────────────────┤    │    │
│  │  │  Children                                      [-] 0 [+]    │    │    │
│  │  │  Ages 2-12                                                  │    │    │
│  │  ├─────────────────────────────────────────────────────────────┤    │    │
│  │  │  Infants                                       [-] 1 [+]    │    │    │
│  │  │  Under 2                                                    │    │    │
│  │  ├─────────────────────────────────────────────────────────────┤    │    │
│  │  │  Pets                                          [-] 1 [+]    │    │    │
│  │  │  Bringing a service animal?                                 │    │    │
│  │  └─────────────────────────────────────────────────────────────┘    │    │
│  │  This place has a maximum of 6 guests (not including infants)       │    │
│  │                                              [Close]                │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Guest Selector Implementation

```typescript
// components/booking/GuestSelector.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { Users, Minus, Plus, ChevronDown, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/lib/utils';

export interface GuestCounts {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

interface GuestSelectorProps {
  value: GuestCounts;
  onChange: (counts: GuestCounts) => void;
  maxGuests?: number;
  maxInfants?: number;
  maxPets?: number;
  allowPets?: boolean;
  className?: string;
}

const GUEST_CATEGORIES = [
  {
    key: 'adults' as const,
    label: 'Adults',
    description: 'Age 13 or above',
    minValue: 1 // At least 1 adult required
  },
  {
    key: 'children' as const,
    label: 'Children',
    description: 'Ages 2-12',
    minValue: 0
  },
  {
    key: 'infants' as const,
    label: 'Infants',
    description: 'Under 2',
    minValue: 0,
    excludeFromTotal: true
  },
  {
    key: 'pets' as const,
    label: 'Pets',
    description: 'Bringing a service animal?',
    descriptionLink: true,
    minValue: 0,
    excludeFromTotal: true
  }
] as const;

export function GuestSelector({
  value,
  onChange,
  maxGuests = 16,
  maxInfants = 5,
  maxPets = 2,
  allowPets = true,
  className
}: GuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setIsOpen(false));

  // Calculate total guests (excluding infants and pets)
  const totalGuests = value.adults + value.children;

  // Format display string
  const formatGuestString = (): string => {
    const parts: string[] = [];

    const guestCount = value.adults + value.children;
    parts.push(`${guestCount} ${guestCount === 1 ? 'guest' : 'guests'}`);

    if (value.infants > 0) {
      parts.push(`${value.infants} ${value.infants === 1 ? 'infant' : 'infants'}`);
    }

    if (value.pets > 0) {
      parts.push(`${value.pets} ${value.pets === 1 ? 'pet' : 'pets'}`);
    }

    return parts.join(', ');
  };

  const handleIncrement = (key: keyof GuestCounts) => {
    const newValue = { ...value };
    const category = GUEST_CATEGORIES.find(c => c.key === key);

    // Check limits
    if (key === 'infants' && value.infants >= maxInfants) return;
    if (key === 'pets' && value.pets >= maxPets) return;
    if (!category?.excludeFromTotal && totalGuests >= maxGuests) return;

    newValue[key] = value[key] + 1;
    onChange(newValue);
  };

  const handleDecrement = (key: keyof GuestCounts) => {
    const category = GUEST_CATEGORIES.find(c => c.key === key);
    if (value[key] <= (category?.minValue ?? 0)) return;

    onChange({ ...value, [key]: value[key] - 1 });
  };

  const canIncrement = (key: keyof GuestCounts): boolean => {
    if (key === 'infants') return value.infants < maxInfants;
    if (key === 'pets') return value.pets < maxPets;
    return totalGuests < maxGuests;
  };

  const canDecrement = (key: keyof GuestCounts): boolean => {
    const category = GUEST_CATEGORIES.find(c => c.key === key);
    return value[key] > (category?.minValue ?? 0);
  };

  const visibleCategories = GUEST_CATEGORIES.filter(
    cat => cat.key !== 'pets' || allowPets
  );

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3 border rounded-xl text-left flex items-center justify-between',
          'hover:border-gray-400 transition-colors bg-white',
          isOpen && 'border-gray-900 ring-1 ring-gray-900'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Guests
          </div>
          <div className="text-sm mt-0.5 flex items-center gap-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span>{formatGuestString()}</span>
          </div>
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 text-gray-400 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border z-50 p-6">
          <div className="space-y-4">
            {visibleCategories.map((category, index) => (
              <div key={category.key}>
                {index > 0 && <div className="border-t my-4" />}

                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{category.label}</div>
                    {category.descriptionLink ? (
                      <button className="text-sm text-gray-500 underline hover:text-gray-700">
                        {category.description}
                      </button>
                    ) : (
                      <div className="text-sm text-gray-500">
                        {category.description}
                      </div>
                    )}
                  </div>

                  {/* Counter Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecrement(category.key)}
                      disabled={!canDecrement(category.key)}
                      className={cn(
                        'w-8 h-8 rounded-full border flex items-center justify-center transition-colors',
                        canDecrement(category.key)
                          ? 'border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      )}
                      aria-label={`Decrease ${category.label.toLowerCase()}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>

                    <span className="w-6 text-center font-medium tabular-nums">
                      {value[category.key]}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleIncrement(category.key)}
                      disabled={!canIncrement(category.key)}
                      className={cn(
                        'w-8 h-8 rounded-full border flex items-center justify-center transition-colors',
                        canIncrement(category.key)
                          ? 'border-gray-400 text-gray-600 hover:border-gray-900 hover:text-gray-900'
                          : 'border-gray-200 text-gray-300 cursor-not-allowed'
                      )}
                      aria-label={`Increase ${category.label.toLowerCase()}`}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Max guests notice */}
          <p className="text-xs text-gray-500 mt-6">
            This place has a maximum of {maxGuests} guests (not including infants)
          </p>

          {/* Close button */}
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="font-semibold underline hover:no-underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Compact Guest Selector Variant

```typescript
// components/booking/GuestSelectorCompact.tsx
'use client';

import { useState, useRef } from 'react';
import { Users, Minus, Plus } from 'lucide-react';
import { GuestCounts } from './GuestSelector';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/lib/utils';

interface GuestSelectorCompactProps {
  value: GuestCounts;
  onChange: (counts: GuestCounts) => void;
  maxGuests?: number;
}

export function GuestSelectorCompact({
  value,
  onChange,
  maxGuests = 16
}: GuestSelectorCompactProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const totalGuests = value.adults + value.children;

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full border',
          'hover:shadow-md transition-shadow',
          isOpen && 'shadow-md border-gray-900'
        )}
      >
        <Users className="w-4 h-4" />
        <span className="font-medium">
          {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
        </span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 bg-white rounded-xl shadow-xl border p-4 z-50 min-w-[200px]">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Guests</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChange({
                  ...value,
                  adults: Math.max(1, value.adults - 1)
                })}
                disabled={totalGuests <= 1}
                className="w-6 h-6 rounded-full border flex items-center justify-center disabled:opacity-50"
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-4 text-center">{totalGuests}</span>
              <button
                onClick={() => onChange({
                  ...value,
                  adults: value.adults + 1
                })}
                disabled={totalGuests >= maxGuests}
                className="w-6 h-6 rounded-full border flex items-center justify-center disabled:opacity-50"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Guest Selector with Rooms (Hotel Style)

```typescript
// components/booking/RoomGuestSelector.tsx
'use client';

import { useState, useRef } from 'react';
import { Users, Minus, Plus, Bed, X } from 'lucide-react';
import { useClickOutside } from '@/hooks/useClickOutside';
import { cn } from '@/lib/utils';

interface Room {
  id: string;
  adults: number;
  children: number;
  childAges: number[];
}

interface RoomGuestSelectorProps {
  rooms: Room[];
  onChange: (rooms: Room[]) => void;
  maxRooms?: number;
  maxGuestsPerRoom?: number;
  maxChildren?: number;
  maxChildAge?: number;
}

export function RoomGuestSelector({
  rooms,
  onChange,
  maxRooms = 8,
  maxGuestsPerRoom = 4,
  maxChildren = 4,
  maxChildAge = 17
}: RoomGuestSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, () => setIsOpen(false));

  const totalGuests = rooms.reduce((sum, r) => sum + r.adults + r.children, 0);

  const addRoom = () => {
    if (rooms.length >= maxRooms) return;
    onChange([
      ...rooms,
      { id: crypto.randomUUID(), adults: 2, children: 0, childAges: [] }
    ]);
  };

  const removeRoom = (id: string) => {
    if (rooms.length <= 1) return;
    onChange(rooms.filter(r => r.id !== id));
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    onChange(rooms.map(r => r.id === id ? { ...r, ...updates } : r));
  };

  const updateChildAge = (roomId: string, index: number, age: number) => {
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;

    const newAges = [...room.childAges];
    newAges[index] = age;
    updateRoom(roomId, { childAges: newAges });
  };

  const formatSummary = () => {
    const roomCount = rooms.length;
    return `${roomCount} ${roomCount === 1 ? 'room' : 'rooms'}, ${totalGuests} ${totalGuests === 1 ? 'guest' : 'guests'}`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full px-4 py-3 border rounded-xl text-left flex items-center justify-between',
          'hover:border-gray-400 transition-colors bg-white',
          isOpen && 'border-gray-900'
        )}
      >
        <div className="flex items-center gap-3">
          <Bed className="w-5 h-5 text-gray-400" />
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase">
              Rooms & Guests
            </div>
            <div className="text-sm">{formatSummary()}</div>
          </div>
        </div>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border z-50 max-h-[70vh] overflow-y-auto">
          <div className="p-6">
            {rooms.map((room, roomIndex) => (
              <div key={room.id} className="mb-6 last:mb-0">
                {/* Room Header */}
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Room {roomIndex + 1}</h4>
                  {rooms.length > 1 && (
                    <button
                      onClick={() => removeRoom(room.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Adults */}
                <div className="flex items-center justify-between py-3 border-t">
                  <div>
                    <div className="font-medium">Adults</div>
                    <div className="text-sm text-gray-500">Age 18+</div>
                  </div>
                  <Counter
                    value={room.adults}
                    min={1}
                    max={maxGuestsPerRoom - room.children}
                    onChange={(v) => updateRoom(room.id, { adults: v })}
                  />
                </div>

                {/* Children */}
                <div className="py-3 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Children</div>
                      <div className="text-sm text-gray-500">Age 0-17</div>
                    </div>
                    <Counter
                      value={room.children}
                      min={0}
                      max={Math.min(maxChildren, maxGuestsPerRoom - room.adults)}
                      onChange={(v) => {
                        const newAges = room.childAges.slice(0, v);
                        while (newAges.length < v) newAges.push(10);
                        updateRoom(room.id, { children: v, childAges: newAges });
                      }}
                    />
                  </div>

                  {/* Child Age Selectors */}
                  {room.children > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {room.childAges.map((age, idx) => (
                        <div key={idx}>
                          <label className="text-xs text-gray-500">
                            Child {idx + 1} age
                          </label>
                          <select
                            value={age}
                            onChange={(e) => updateChildAge(room.id, idx, parseInt(e.target.value))}
                            className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                          >
                            {Array.from({ length: maxChildAge + 1 }, (_, i) => (
                              <option key={i} value={i}>
                                {i === 0 ? 'Under 1' : i}
                              </option>
                            ))}
                          </select>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Add Room Button */}
            {rooms.length < maxRooms && (
              <button
                onClick={addRoom}
                className="w-full py-3 border-2 border-dashed rounded-xl text-gray-600 font-medium hover:border-gray-400 hover:text-gray-900 transition-colors"
              >
                + Add another room
              </button>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end">
            <button
              onClick={() => setIsOpen(false)}
              className="px-6 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Counter({
  value,
  min,
  max,
  onChange
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className={cn(
          'w-8 h-8 rounded-full border flex items-center justify-center',
          value <= min
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-400 text-gray-600 hover:border-gray-900'
        )}
      >
        <Minus className="w-4 h-4" />
      </button>
      <span className="w-4 text-center font-medium">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className={cn(
          'w-8 h-8 rounded-full border flex items-center justify-center',
          value >= max
            ? 'border-gray-200 text-gray-300 cursor-not-allowed'
            : 'border-gray-400 text-gray-600 hover:border-gray-900'
        )}
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
```

---

---

## 15. Amenities Display & Filtering

### Amenities Data Architecture

```typescript
// types/amenities.ts
export interface Amenity {
  id: string;
  name: string;
  icon: string;
  category: AmenityCategory;
  description?: string;
  isHighlighted?: boolean;
  searchTerms: string[]; // For search functionality
}

export type AmenityCategory =
  | 'essentials'
  | 'features'
  | 'safety'
  | 'location'
  | 'kitchen'
  | 'bathroom'
  | 'bedroom'
  | 'outdoor'
  | 'entertainment'
  | 'parking'
  | 'accessibility'
  | 'family'
  | 'work';

export interface AmenityGroup {
  category: AmenityCategory;
  label: string;
  icon: string;
  amenities: Amenity[];
}

export interface ListingAmenities {
  available: string[]; // Amenity IDs that are available
  highlighted: string[]; // IDs to show prominently
  unavailable?: string[]; // Explicitly not available (e.g., no smoking)
}
```

### Amenities Constants & Configuration

```typescript
// constants/amenities.ts
import {
  Wifi,
  Car,
  Utensils,
  Tv,
  Snowflake,
  Flame,
  WashingMachine,
  Waves,
  Trees,
  Shield,
  Baby,
  Briefcase,
  Accessibility,
  Coffee,
  Bath,
  Bed,
  MapPin,
  Dumbbell,
  type LucideIcon,
} from 'lucide-react';

export const AMENITY_CATEGORIES: Record<
  AmenityCategory,
  { label: string; icon: LucideIcon; priority: number }
> = {
  essentials: { label: 'Essentials', icon: Wifi, priority: 1 },
  features: { label: 'Standout amenities', icon: Flame, priority: 2 },
  safety: { label: 'Safety & security', icon: Shield, priority: 3 },
  kitchen: { label: 'Kitchen & dining', icon: Utensils, priority: 4 },
  bathroom: { label: 'Bathroom', icon: Bath, priority: 5 },
  bedroom: { label: 'Bedroom & laundry', icon: Bed, priority: 6 },
  entertainment: { label: 'Entertainment', icon: Tv, priority: 7 },
  outdoor: { label: 'Outdoor', icon: Trees, priority: 8 },
  parking: { label: 'Parking & facilities', icon: Car, priority: 9 },
  location: { label: 'Location features', icon: MapPin, priority: 10 },
  accessibility: { label: 'Accessibility', icon: Accessibility, priority: 11 },
  family: { label: 'Family friendly', icon: Baby, priority: 12 },
  work: { label: 'Work space', icon: Briefcase, priority: 13 },
};

export const AMENITIES: Amenity[] = [
  // Essentials
  {
    id: 'wifi',
    name: 'WiFi',
    icon: 'wifi',
    category: 'essentials',
    description: 'High-speed wireless internet',
    searchTerms: ['internet', 'wireless', 'broadband'],
  },
  {
    id: 'kitchen',
    name: 'Kitchen',
    icon: 'utensils',
    category: 'essentials',
    description: 'Full kitchen with cooking basics',
    searchTerms: ['cooking', 'stove', 'refrigerator'],
  },
  {
    id: 'washer',
    name: 'Washer',
    icon: 'washing-machine',
    category: 'essentials',
    searchTerms: ['laundry', 'washing machine'],
  },
  {
    id: 'dryer',
    name: 'Dryer',
    icon: 'wind',
    category: 'essentials',
    searchTerms: ['laundry', 'tumble dryer'],
  },
  {
    id: 'ac',
    name: 'Air conditioning',
    icon: 'snowflake',
    category: 'essentials',
    searchTerms: ['cooling', 'climate control', 'AC'],
  },
  {
    id: 'heating',
    name: 'Heating',
    icon: 'flame',
    category: 'essentials',
    searchTerms: ['warmth', 'radiator'],
  },

  // Standout Features
  {
    id: 'pool',
    name: 'Pool',
    icon: 'waves',
    category: 'features',
    description: 'Private or shared pool',
    isHighlighted: true,
    searchTerms: ['swimming', 'swim'],
  },
  {
    id: 'hot-tub',
    name: 'Hot tub',
    icon: 'bath',
    category: 'features',
    isHighlighted: true,
    searchTerms: ['jacuzzi', 'spa', 'whirlpool'],
  },
  {
    id: 'gym',
    name: 'Gym',
    icon: 'dumbbell',
    category: 'features',
    description: 'Workout equipment available',
    searchTerms: ['fitness', 'exercise', 'workout'],
  },
  {
    id: 'ev-charger',
    name: 'EV charger',
    icon: 'zap',
    category: 'features',
    isHighlighted: true,
    searchTerms: ['electric vehicle', 'charging', 'tesla'],
  },
  {
    id: 'fireplace',
    name: 'Fireplace',
    icon: 'flame',
    category: 'features',
    searchTerms: ['fire', 'cozy'],
  },
  {
    id: 'bbq',
    name: 'BBQ grill',
    icon: 'beef',
    category: 'features',
    searchTerms: ['barbecue', 'grill', 'outdoor cooking'],
  },

  // Safety
  {
    id: 'smoke-alarm',
    name: 'Smoke alarm',
    icon: 'bell',
    category: 'safety',
    searchTerms: ['smoke detector', 'fire alarm'],
  },
  {
    id: 'co-alarm',
    name: 'Carbon monoxide alarm',
    icon: 'alert-circle',
    category: 'safety',
    searchTerms: ['CO detector'],
  },
  {
    id: 'fire-extinguisher',
    name: 'Fire extinguisher',
    icon: 'flame-kindling',
    category: 'safety',
    searchTerms: ['fire safety'],
  },
  {
    id: 'first-aid',
    name: 'First aid kit',
    icon: 'plus-square',
    category: 'safety',
    searchTerms: ['medical', 'emergency'],
  },
  {
    id: 'security-cameras',
    name: 'Security cameras',
    icon: 'video',
    category: 'safety',
    description: 'Exterior cameras for security',
    searchTerms: ['CCTV', 'surveillance'],
  },

  // Parking
  {
    id: 'free-parking',
    name: 'Free parking',
    icon: 'car',
    category: 'parking',
    isHighlighted: true,
    searchTerms: ['parking lot', 'driveway'],
  },
  {
    id: 'garage',
    name: 'Garage',
    icon: 'warehouse',
    category: 'parking',
    searchTerms: ['covered parking'],
  },

  // Accessibility
  {
    id: 'step-free',
    name: 'Step-free access',
    icon: 'accessibility',
    category: 'accessibility',
    searchTerms: ['wheelchair', 'no stairs', 'ramp'],
  },
  {
    id: 'wide-doorways',
    name: 'Wide doorways',
    icon: 'door-open',
    category: 'accessibility',
    description: 'Doorways at least 32 inches wide',
    searchTerms: ['wheelchair accessible'],
  },
  {
    id: 'accessible-bathroom',
    name: 'Accessible bathroom',
    icon: 'bath',
    category: 'accessibility',
    description: 'Roll-in shower with grab bars',
    searchTerms: ['wheelchair', 'handicap'],
  },

  // Family
  {
    id: 'crib',
    name: 'Crib',
    icon: 'baby',
    category: 'family',
    searchTerms: ['baby bed', 'infant'],
  },
  {
    id: 'high-chair',
    name: 'High chair',
    icon: 'armchair',
    category: 'family',
    searchTerms: ['baby chair', 'infant seat'],
  },
  {
    id: 'toys',
    name: 'Children\'s toys',
    icon: 'puzzle',
    category: 'family',
    searchTerms: ['kids', 'games'],
  },

  // Work
  {
    id: 'workspace',
    name: 'Dedicated workspace',
    icon: 'briefcase',
    category: 'work',
    isHighlighted: true,
    description: 'Desk and chair in a quiet space',
    searchTerms: ['office', 'desk', 'work from home'],
  },

  // ... More amenities
];

// Create lookup map
export const AMENITY_MAP = new Map(AMENITIES.map((a) => [a.id, a]));
```

### Amenities Display Components

```tsx
// components/listing/AmenitiesSection.tsx
'use client';

import { useState, useMemo } from 'react';
import { Check, X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AmenitiesModal } from './AmenitiesModal';
import { AMENITY_MAP, AMENITY_CATEGORIES } from '@/constants/amenities';
import type { ListingAmenities } from '@/types/amenities';
import { cn } from '@/lib/utils';

interface AmenitiesSectionProps {
  amenities: ListingAmenities;
  maxVisible?: number;
}

export function AmenitiesSection({
  amenities,
  maxVisible = 10,
}: AmenitiesSectionProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get highlighted amenities first, then fill with others
  const visibleAmenities = useMemo(() => {
    const highlighted = amenities.highlighted
      .map((id) => AMENITY_MAP.get(id))
      .filter(Boolean);

    const others = amenities.available
      .filter((id) => !amenities.highlighted.includes(id))
      .map((id) => AMENITY_MAP.get(id))
      .filter(Boolean);

    return [...highlighted, ...others].slice(0, maxVisible);
  }, [amenities, maxVisible]);

  const totalCount = amenities.available.length;
  const remainingCount = totalCount - visibleAmenities.length;

  return (
    <section className="py-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">What this place offers</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visibleAmenities.map((amenity) => (
          <AmenityItem
            key={amenity.id}
            amenity={amenity}
            isAvailable={true}
          />
        ))}
      </div>

      {remainingCount > 0 && (
        <Button
          variant="outline"
          className="mt-6 px-6"
          onClick={() => setIsModalOpen(true)}
        >
          Show all {totalCount} amenities
        </Button>
      )}

      <AmenitiesModal
        amenities={amenities}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </section>
  );
}

interface AmenityItemProps {
  amenity: Amenity;
  isAvailable: boolean;
  showDescription?: boolean;
}

function AmenityItem({
  amenity,
  isAvailable,
  showDescription = false,
}: AmenityItemProps) {
  const Icon = getAmenityIcon(amenity.icon);

  return (
    <div
      className={cn(
        'flex items-start gap-4 py-3',
        !isAvailable && 'opacity-50'
      )}
    >
      <div className="flex-shrink-0 w-6 h-6">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-base',
            !isAvailable && 'line-through text-gray-500'
          )}
        >
          {amenity.name}
        </span>
        {showDescription && amenity.description && (
          <p className="text-sm text-gray-500 mt-0.5">
            {amenity.description}
          </p>
        )}
      </div>
      {!isAvailable && (
        <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
      )}
    </div>
  );
}
```

### Amenities Modal with Search & Categorization

```tsx
// components/listing/AmenitiesModal.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, X, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AMENITIES,
  AMENITY_MAP,
  AMENITY_CATEGORIES,
} from '@/constants/amenities';
import type { ListingAmenities, AmenityCategory } from '@/types/amenities';
import { cn } from '@/lib/utils';

interface AmenitiesModalProps {
  amenities: ListingAmenities;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AmenitiesModal({
  amenities,
  open,
  onOpenChange,
}: AmenitiesModalProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Group amenities by category
  const groupedAmenities = useMemo(() => {
    const groups = new Map<AmenityCategory, typeof AMENITIES>();

    // Initialize groups
    Object.keys(AMENITY_CATEGORIES).forEach((category) => {
      groups.set(category as AmenityCategory, []);
    });

    // Group available amenities
    amenities.available.forEach((id) => {
      const amenity = AMENITY_MAP.get(id);
      if (amenity) {
        const group = groups.get(amenity.category) || [];
        group.push({ ...amenity, isAvailable: true });
        groups.set(amenity.category, group);
      }
    });

    // Add unavailable amenities (marked explicitly)
    amenities.unavailable?.forEach((id) => {
      const amenity = AMENITY_MAP.get(id);
      if (amenity) {
        const group = groups.get(amenity.category) || [];
        group.push({ ...amenity, isAvailable: false });
        groups.set(amenity.category, group);
      }
    });

    // Sort by category priority and filter empty groups
    return Array.from(groups.entries())
      .filter(([_, items]) => items.length > 0)
      .sort(
        ([catA], [catB]) =>
          AMENITY_CATEGORIES[catA].priority - AMENITY_CATEGORIES[catB].priority
      )
      .map(([category, items]) => ({
        category,
        label: AMENITY_CATEGORIES[category].label,
        icon: AMENITY_CATEGORIES[category].icon,
        items,
      }));
  }, [amenities]);

  // Filter by search query
  const filteredGroups = useMemo(() => {
    if (!searchQuery.trim()) return groupedAmenities;

    const query = searchQuery.toLowerCase();

    return groupedAmenities
      .map((group) => ({
        ...group,
        items: group.items.filter(
          (amenity) =>
            amenity.name.toLowerCase().includes(query) ||
            amenity.searchTerms?.some((term) =>
              term.toLowerCase().includes(query)
            ) ||
            amenity.description?.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.items.length > 0);
  }, [groupedAmenities, searchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const clearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold">
            What this place offers
          </DialogTitle>
        </DialogHeader>

        {/* Search Input */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
              aria-label="Search amenities"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Amenities List */}
        <ScrollArea className="flex-1 px-6 pb-6" style={{ maxHeight: '60vh' }}>
          {filteredGroups.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <p>No amenities found matching "{searchQuery}"</p>
            </div>
          ) : (
            <div className="space-y-8">
              {filteredGroups.map(({ category, label, icon: Icon, items }) => (
                <section key={category}>
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-6 h-6" />
                    <h3 className="text-lg font-semibold">{label}</h3>
                  </div>

                  <div className="space-y-1">
                    {items.map((amenity) => (
                      <div
                        key={amenity.id}
                        className={cn(
                          'flex items-start gap-4 py-4 border-b border-gray-100 last:border-0',
                          !amenity.isAvailable && 'opacity-50'
                        )}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn(
                                'font-medium',
                                !amenity.isAvailable &&
                                  'line-through text-gray-500'
                              )}
                            >
                              {amenity.name}
                            </span>
                            {amenity.isHighlighted && amenity.isAvailable && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                Popular
                              </span>
                            )}
                          </div>
                          {amenity.description && (
                            <p className="text-sm text-gray-500 mt-1">
                              {amenity.description}
                            </p>
                          )}
                        </div>
                        {amenity.isAvailable ? (
                          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                        ) : (
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```

### Amenities Filter for Search

```tsx
// components/filters/AmenitiesFilter.tsx
'use client';

import { useState, useMemo, useCallback } from 'react';
import { Search, Check } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { AMENITIES, AMENITY_CATEGORIES } from '@/constants/amenities';
import type { AmenityCategory } from '@/types/amenities';
import { cn } from '@/lib/utils';

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  onChange: (amenities: string[]) => void;
}

// Most popular/commonly filtered amenities
const POPULAR_AMENITIES = [
  'wifi',
  'kitchen',
  'washer',
  'dryer',
  'ac',
  'heating',
  'workspace',
  'free-parking',
  'pool',
  'hot-tub',
];

export function AmenitiesFilter({
  selectedAmenities,
  onChange,
}: AmenitiesFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);

  // Group and filter amenities
  const filteredAmenities = useMemo(() => {
    const query = searchQuery.toLowerCase();

    // If searching, show flat list
    if (query) {
      return AMENITIES.filter(
        (amenity) =>
          amenity.name.toLowerCase().includes(query) ||
          amenity.searchTerms?.some((term) => term.toLowerCase().includes(query))
      );
    }

    // Otherwise show popular first
    const popular = POPULAR_AMENITIES.map((id) =>
      AMENITIES.find((a) => a.id === id)
    ).filter(Boolean);

    if (!showAllCategories) {
      return popular;
    }

    // Group by category
    const groups = new Map<AmenityCategory, typeof AMENITIES>();
    AMENITIES.forEach((amenity) => {
      const group = groups.get(amenity.category) || [];
      group.push(amenity);
      groups.set(amenity.category, group);
    });

    return { popular, groups };
  }, [searchQuery, showAllCategories]);

  const toggleAmenity = useCallback(
    (amenityId: string) => {
      const newSelection = selectedAmenities.includes(amenityId)
        ? selectedAmenities.filter((id) => id !== amenityId)
        : [...selectedAmenities, amenityId];
      onChange(newSelection);
    },
    [selectedAmenities, onChange]
  );

  const clearAll = useCallback(() => {
    onChange([]);
  }, [onChange]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'gap-2',
            selectedAmenities.length > 0 && 'border-black bg-gray-50'
          )}
        >
          Amenities
          {selectedAmenities.length > 0 && (
            <span className="bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {selectedAmenities.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0"
        align="start"
        sideOffset={8}
      >
        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search amenities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>

        {/* Amenities List */}
        <div className="max-h-80 overflow-y-auto p-4">
          {Array.isArray(filteredAmenities) ? (
            // Flat list (search results or popular only)
            <div className="space-y-1">
              {!searchQuery && (
                <p className="text-sm font-medium text-gray-500 mb-3">
                  Popular amenities
                </p>
              )}
              {filteredAmenities.map((amenity) => (
                <AmenityCheckboxItem
                  key={amenity.id}
                  amenity={amenity}
                  isSelected={selectedAmenities.includes(amenity.id)}
                  onToggle={() => toggleAmenity(amenity.id)}
                />
              ))}
            </div>
          ) : (
            // Grouped by category
            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-3">
                  Popular amenities
                </p>
                <div className="space-y-1">
                  {filteredAmenities.popular.map((amenity) => (
                    <AmenityCheckboxItem
                      key={amenity.id}
                      amenity={amenity}
                      isSelected={selectedAmenities.includes(amenity.id)}
                      onToggle={() => toggleAmenity(amenity.id)}
                    />
                  ))}
                </div>
              </div>

              {Array.from(filteredAmenities.groups.entries())
                .sort(
                  ([catA], [catB]) =>
                    AMENITY_CATEGORIES[catA].priority -
                    AMENITY_CATEGORIES[catB].priority
                )
                .map(([category, items]) => (
                  <div key={category}>
                    <p className="text-sm font-medium text-gray-500 mb-3">
                      {AMENITY_CATEGORIES[category].label}
                    </p>
                    <div className="space-y-1">
                      {items.map((amenity) => (
                        <AmenityCheckboxItem
                          key={amenity.id}
                          amenity={amenity}
                          isSelected={selectedAmenities.includes(amenity.id)}
                          onToggle={() => toggleAmenity(amenity.id)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* Show more toggle */}
          {!searchQuery && !showAllCategories && (
            <Button
              variant="link"
              className="mt-4 px-0"
              onClick={() => setShowAllCategories(true)}
            >
              Show all amenities
            </Button>
          )}
        </div>

        {/* Footer */}
        {selectedAmenities.length > 0 && (
          <div className="p-4 border-t bg-gray-50 flex justify-between items-center">
            <Button variant="link" className="px-0" onClick={clearAll}>
              Clear all
            </Button>
            <Button onClick={() => setIsOpen(false)}>
              Show results
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface AmenityCheckboxItemProps {
  amenity: Amenity;
  isSelected: boolean;
  onToggle: () => void;
}

function AmenityCheckboxItem({
  amenity,
  isSelected,
  onToggle,
}: AmenityCheckboxItemProps) {
  return (
    <label
      className={cn(
        'flex items-center gap-3 p-2 rounded-lg cursor-pointer',
        'hover:bg-gray-50 transition-colors',
        isSelected && 'bg-gray-50'
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={onToggle}
        id={`amenity-${amenity.id}`}
      />
      <span className="flex-1">{amenity.name}</span>
      {amenity.isHighlighted && (
        <span className="text-xs text-gray-400">Popular</span>
      )}
    </label>
  );
}
```

### Amenity Icon Resolver

```typescript
// lib/amenity-icons.ts
import {
  Wifi,
  Car,
  Utensils,
  Tv,
  Snowflake,
  Flame,
  Wind,
  Waves,
  Trees,
  Shield,
  Baby,
  Briefcase,
  Bath,
  Bed,
  MapPin,
  Dumbbell,
  Bell,
  AlertCircle,
  PlusSquare,
  Video,
  Warehouse,
  Accessibility,
  DoorOpen,
  Armchair,
  Puzzle,
  Zap,
  Beef,
  type LucideIcon,
} from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  wifi: Wifi,
  car: Car,
  utensils: Utensils,
  tv: Tv,
  snowflake: Snowflake,
  flame: Flame,
  wind: Wind,
  waves: Waves,
  trees: Trees,
  shield: Shield,
  baby: Baby,
  briefcase: Briefcase,
  bath: Bath,
  bed: Bed,
  'map-pin': MapPin,
  dumbbell: Dumbbell,
  bell: Bell,
  'alert-circle': AlertCircle,
  'plus-square': PlusSquare,
  video: Video,
  warehouse: Warehouse,
  accessibility: Accessibility,
  'door-open': DoorOpen,
  armchair: Armchair,
  puzzle: Puzzle,
  zap: Zap,
  beef: Beef,
  'washing-machine': WashingMachine,
};

// Fallback icon
import { Circle } from 'lucide-react';

export function getAmenityIcon(iconName: string): LucideIcon {
  return ICON_MAP[iconName] || Circle;
}

// For use with dynamic imports (if icons are heavy)
export async function getAmenityIconAsync(
  iconName: string
): Promise<LucideIcon> {
  try {
    const icons = await import('lucide-react');
    const pascalCase = iconName
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
    return (icons as any)[pascalCase] || icons.Circle;
  } catch {
    const { Circle } = await import('lucide-react');
    return Circle;
  }
}
```

### Highlighted Amenities Card (for listing cards)

```tsx
// components/listing/HighlightedAmenities.tsx
import { AMENITY_MAP } from '@/constants/amenities';
import { getAmenityIcon } from '@/lib/amenity-icons';
import { cn } from '@/lib/utils';

interface HighlightedAmenitiesProps {
  amenityIds: string[];
  maxShow?: number;
  size?: 'sm' | 'md';
  variant?: 'chips' | 'icons' | 'list';
}

export function HighlightedAmenities({
  amenityIds,
  maxShow = 4,
  size = 'sm',
  variant = 'chips',
}: HighlightedAmenitiesProps) {
  const amenities = amenityIds
    .slice(0, maxShow)
    .map((id) => AMENITY_MAP.get(id))
    .filter(Boolean);

  const remaining = amenityIds.length - maxShow;

  if (variant === 'icons') {
    return (
      <div className="flex items-center gap-2">
        {amenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity.icon);
          return (
            <div
              key={amenity.id}
              className="text-gray-600"
              title={amenity.name}
            >
              <Icon className={cn(size === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />
            </div>
          );
        })}
        {remaining > 0 && (
          <span className="text-xs text-gray-500">+{remaining}</span>
        )}
      </div>
    );
  }

  if (variant === 'list') {
    return (
      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {amenities.map((amenity) => {
          const Icon = getAmenityIcon(amenity.icon);
          return (
            <div key={amenity.id} className="flex items-center gap-1.5 text-gray-600">
              <Icon className="w-4 h-4" />
              <span className={cn('text-sm', size === 'sm' && 'text-xs')}>
                {amenity.name}
              </span>
            </div>
          );
        })}
        {remaining > 0 && (
          <span className="text-sm text-gray-500">+{remaining} more</span>
        )}
      </div>
    );
  }

  // Chips variant (default)
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((amenity) => (
        <span
          key={amenity.id}
          className={cn(
            'inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 rounded-full',
            size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm'
          )}
        >
          {amenity.name}
        </span>
      ))}
      {remaining > 0 && (
        <span
          className={cn(
            'text-gray-500',
            size === 'sm' ? 'text-xs' : 'text-sm'
          )}
        >
          +{remaining} more
        </span>
      )}
    </div>
  );
}
```

### Accessibility Considerations

```typescript
// Accessibility patterns for amenities
const accessibilityPatterns = {
  // Screen reader announcements
  announcements: {
    amenitySelected: (name: string) => `${name} filter selected`,
    amenityDeselected: (name: string) => `${name} filter removed`,
    filterCount: (count: number) =>
      `${count} amenity ${count === 1 ? 'filter' : 'filters'} applied`,
    searchResults: (count: number) =>
      `Found ${count} ${count === 1 ? 'amenity' : 'amenities'}`,
  },

  // ARIA labels
  ariaLabels: {
    amenityCheckbox: (name: string, isSelected: boolean) =>
      `${name}, ${isSelected ? 'selected' : 'not selected'}`,
    amenityGroup: (category: string) => `${category} amenities`,
    searchInput: 'Search amenities',
    clearSearch: 'Clear search',
    showAllButton: (total: number) => `Show all ${total} amenities`,
  },

  // Keyboard navigation
  keyboardNav: {
    // Arrow keys move between amenities
    // Space/Enter toggle selection
    // Escape closes modal
    // Tab moves to next interactive element
  },
};

// Hook for managing focus within amenities modal
function useAmenitiesModalFocus(isOpen: boolean) {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const firstAmenityRef = useRef<HTMLLabelElement>(null);

  useEffect(() => {
    if (isOpen) {
      // Focus search input when modal opens
      searchInputRef.current?.focus();
    }
  }, [isOpen]);

  return { searchInputRef, firstAmenityRef };
}
```

---

## 16. Pricing Breakdown Display

### Pricing Data Types

```typescript
// types/pricing.ts
export interface PricingBreakdown {
  // Base pricing
  nightlyRate: number;
  originalNightlyRate?: number; // For discounts
  nights: number;
  subtotal: number;

  // Discounts
  discounts: PricingDiscount[];
  totalDiscount: number;

  // Fees
  fees: PricingFee[];
  totalFees: number;

  // Taxes
  taxes: PricingTax[];
  totalTaxes: number;

  // Final totals
  total: number;
  currency: string;
  currencySymbol: string;

  // Per-night breakdown (for variable pricing)
  nightlyBreakdown?: NightlyPrice[];

  // Payment schedule (for long stays)
  paymentSchedule?: PaymentSchedule;
}

export interface PricingDiscount {
  type: 'weekly' | 'monthly' | 'early_bird' | 'last_minute' | 'special' | 'coupon';
  label: string;
  amount: number;
  percentage?: number;
}

export interface PricingFee {
  type: 'cleaning' | 'service' | 'extra_guest' | 'pet' | 'resort' | 'other';
  label: string;
  amount: number;
  description?: string;
  isIncluded?: boolean; // Already in nightly rate
}

export interface PricingTax {
  type: 'occupancy' | 'vat' | 'tourism' | 'local' | 'other';
  label: string;
  amount: number;
  rate?: number; // Percentage
}

export interface NightlyPrice {
  date: string;
  price: number;
  originalPrice?: number;
  isWeekend?: boolean;
  isPeakSeason?: boolean;
}

export interface PaymentSchedule {
  type: 'full' | 'split' | 'monthly';
  payments: ScheduledPayment[];
}

export interface ScheduledPayment {
  dueDate: string;
  amount: number;
  label: string;
  isPaid?: boolean;
}
```

### Pricing Breakdown Component

```tsx
// components/booking/PricingBreakdown.tsx
'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, Info, Tag, Calendar } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { formatCurrency } from '@/lib/currency';
import type { PricingBreakdown as PricingBreakdownType } from '@/types/pricing';
import { cn } from '@/lib/utils';

interface PricingBreakdownProps {
  pricing: PricingBreakdownType;
  checkIn: string;
  checkOut: string;
  variant?: 'default' | 'compact' | 'detailed';
  showNightlyBreakdown?: boolean;
}

export function PricingBreakdown({
  pricing,
  checkIn,
  checkOut,
  variant = 'default',
  showNightlyBreakdown = false,
}: PricingBreakdownProps) {
  const [isNightlyExpanded, setIsNightlyExpanded] = useState(false);
  const [isFeesExpanded, setIsFeesExpanded] = useState(false);

  const hasVariablePricing = useMemo(() => {
    if (!pricing.nightlyBreakdown) return false;
    const prices = pricing.nightlyBreakdown.map((n) => n.price);
    return new Set(prices).size > 1;
  }, [pricing.nightlyBreakdown]);

  const hasDiscounts = pricing.discounts.length > 0;

  if (variant === 'compact') {
    return (
      <CompactPricingDisplay pricing={pricing} nights={pricing.nights} />
    );
  }

  return (
    <div className="space-y-4">
      {/* Nightly Rate */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {pricing.originalNightlyRate ? (
            <>
              <span className="line-through text-gray-500">
                {formatCurrency(pricing.originalNightlyRate, pricing.currency)}
              </span>
              <span className="font-medium">
                {formatCurrency(pricing.nightlyRate, pricing.currency)}
              </span>
            </>
          ) : (
            <span>
              {formatCurrency(pricing.nightlyRate, pricing.currency)}
            </span>
          )}
          <span className="text-gray-600">x {pricing.nights} nights</span>

          {/* Variable pricing indicator */}
          {hasVariablePricing && showNightlyBreakdown && (
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-4 h-4 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Prices vary by night</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span>{formatCurrency(pricing.subtotal, pricing.currency)}</span>
      </div>

      {/* Nightly Breakdown (expandable) */}
      {hasVariablePricing && showNightlyBreakdown && pricing.nightlyBreakdown && (
        <Collapsible open={isNightlyExpanded} onOpenChange={setIsNightlyExpanded}>
          <CollapsibleTrigger className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
            <Calendar className="w-4 h-4" />
            <span>View price breakdown by night</span>
            {isNightlyExpanded ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent>
            <NightlyBreakdownList
              nights={pricing.nightlyBreakdown}
              currency={pricing.currency}
            />
          </CollapsibleContent>
        </Collapsible>
      )}

      {/* Discounts */}
      {hasDiscounts && (
        <div className="space-y-2 pt-2 border-t border-dashed">
          {pricing.discounts.map((discount, index) => (
            <div
              key={index}
              className="flex justify-between items-center text-green-600"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4" />
                <span>{discount.label}</span>
                {discount.percentage && (
                  <span className="text-xs bg-green-100 px-1.5 py-0.5 rounded">
                    -{discount.percentage}%
                  </span>
                )}
              </div>
              <span>-{formatCurrency(discount.amount, pricing.currency)}</span>
            </div>
          ))}
        </div>
      )}

      {/* Fees */}
      <div className="space-y-2 pt-4 border-t">
        {pricing.fees.map((fee, index) => (
          <div key={index} className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-gray-700">{fee.label}</span>
              {fee.description && (
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-4 h-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">{fee.description}</p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <span>
              {fee.isIncluded
                ? 'Included'
                : formatCurrency(fee.amount, pricing.currency)}
            </span>
          </div>
        ))}
      </div>

      {/* Taxes (collapsible if multiple) */}
      {pricing.taxes.length > 0 && (
        <div className="pt-2">
          {pricing.taxes.length === 1 ? (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">{pricing.taxes[0].label}</span>
              <span>
                {formatCurrency(pricing.taxes[0].amount, pricing.currency)}
              </span>
            </div>
          ) : (
            <Collapsible open={isFeesExpanded} onOpenChange={setIsFeesExpanded}>
              <CollapsibleTrigger className="flex justify-between items-center w-full">
                <span className="text-gray-700">Taxes</span>
                <div className="flex items-center gap-2">
                  <span>
                    {formatCurrency(pricing.totalTaxes, pricing.currency)}
                  </span>
                  {isFeesExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="pl-4 pt-2 space-y-2">
                  {pricing.taxes.map((tax, index) => (
                    <div
                      key={index}
                      className="flex justify-between text-sm text-gray-600"
                    >
                      <span>{tax.label}</span>
                      <span>
                        {formatCurrency(tax.amount, pricing.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}
        </div>
      )}

      {/* Total */}
      <div className="flex justify-between items-center pt-4 border-t-2 border-gray-900">
        <span className="text-lg font-semibold">Total</span>
        <div className="text-right">
          <span className="text-lg font-semibold">
            {formatCurrency(pricing.total, pricing.currency)}
          </span>
          {pricing.currency !== 'USD' && (
            <p className="text-xs text-gray-500">
              Approximately {formatCurrency(pricing.total, 'USD')} USD
            </p>
          )}
        </div>
      </div>

      {/* Payment Schedule (for long stays) */}
      {pricing.paymentSchedule && (
        <PaymentScheduleDisplay schedule={pricing.paymentSchedule} currency={pricing.currency} />
      )}
    </div>
  );
}

// Nightly breakdown list
function NightlyBreakdownList({
  nights,
  currency,
}: {
  nights: NightlyPrice[];
  currency: string;
}) {
  return (
    <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
      <div className="space-y-2">
        {nights.map((night, index) => {
          const date = new Date(night.date);
          const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
          const dateStr = date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={index}
              className={cn(
                'flex justify-between items-center text-sm',
                night.isWeekend && 'font-medium'
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-gray-500 w-10">{dayName}</span>
                <span>{dateStr}</span>
                {night.isPeakSeason && (
                  <span className="text-xs bg-orange-100 text-orange-700 px-1.5 rounded">
                    Peak
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                {night.originalPrice && night.originalPrice !== night.price && (
                  <span className="line-through text-gray-400 text-xs">
                    {formatCurrency(night.originalPrice, currency)}
                  </span>
                )}
                <span>{formatCurrency(night.price, currency)}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Compact pricing display (for cards)
function CompactPricingDisplay({
  pricing,
  nights,
}: {
  pricing: PricingBreakdownType;
  nights: number;
}) {
  const hasDiscount = pricing.originalNightlyRate && pricing.originalNightlyRate > pricing.nightlyRate;

  return (
    <div>
      <div className="flex items-baseline gap-1">
        {hasDiscount && (
          <span className="line-through text-gray-500 text-sm">
            {formatCurrency(pricing.originalNightlyRate!, pricing.currency)}
          </span>
        )}
        <span className="text-lg font-semibold">
          {formatCurrency(pricing.nightlyRate, pricing.currency)}
        </span>
        <span className="text-gray-600">night</span>
      </div>
      {nights > 0 && (
        <p className="text-sm text-gray-500 mt-1">
          {formatCurrency(pricing.total, pricing.currency)} total
        </p>
      )}
    </div>
  );
}

// Payment schedule display
function PaymentScheduleDisplay({
  schedule,
  currency,
}: {
  schedule: PaymentSchedule;
  currency: string;
}) {
  return (
    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
      <h4 className="font-medium text-blue-900 mb-3">Payment Schedule</h4>
      <div className="space-y-3">
        {schedule.payments.map((payment, index) => {
          const date = new Date(payment.dueDate);
          return (
            <div key={index} className="flex justify-between items-center">
              <div>
                <p className="font-medium text-blue-900">{payment.label}</p>
                <p className="text-sm text-blue-700">
                  {payment.isPaid
                    ? 'Paid'
                    : `Due ${date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}`}
                </p>
              </div>
              <span className={cn('font-semibold', payment.isPaid && 'text-green-600')}>
                {formatCurrency(payment.amount, currency)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

### Price Calculator Hook

```typescript
// hooks/usePriceCalculator.ts
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { differenceInDays, eachDayOfInterval, format, isWeekend } from 'date-fns';
import type { PricingBreakdown, NightlyPrice } from '@/types/pricing';

interface UsePriceCalculatorOptions {
  listingId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: {
    adults: number;
    children: number;
    infants: number;
    pets: number;
  };
  couponCode?: string;
}

export function usePriceCalculator({
  listingId,
  checkIn,
  checkOut,
  guests,
  couponCode,
}: UsePriceCalculatorOptions) {
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    return differenceInDays(checkOut, checkIn);
  }, [checkIn, checkOut]);

  const dateRange = useMemo(() => {
    if (!checkIn || !checkOut) return null;
    return { start: format(checkIn, 'yyyy-MM-dd'), end: format(checkOut, 'yyyy-MM-dd') };
  }, [checkIn, checkOut]);

  // Fetch pricing from server
  const {
    data: pricing,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pricing', listingId, dateRange, guests, couponCode],
    queryFn: () =>
      fetchPricing({
        listingId,
        checkIn: dateRange!.start,
        checkOut: dateRange!.end,
        guests,
        couponCode,
      }),
    enabled: !!dateRange && nights > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    pricing,
    nights,
    isLoading,
    error,
    isValid: !!dateRange && nights > 0,
  };
}

// API function
async function fetchPricing(params: {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number; infants: number; pets: number };
  couponCode?: string;
}): Promise<PricingBreakdown> {
  const response = await fetch('/api/listings/pricing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to calculate pricing');
  }

  return response.json();
}
```

### Currency Formatting Utilities

```typescript
// lib/currency.ts
const CURRENCY_FORMATS: Record<
  string,
  { locale: string; symbol: string; position: 'before' | 'after' }
> = {
  USD: { locale: 'en-US', symbol: '$', position: 'before' },
  EUR: { locale: 'de-DE', symbol: '€', position: 'after' },
  GBP: { locale: 'en-GB', symbol: '£', position: 'before' },
  INR: { locale: 'en-IN', symbol: '₹', position: 'before' },
  JPY: { locale: 'ja-JP', symbol: '¥', position: 'before' },
  AUD: { locale: 'en-AU', symbol: 'A$', position: 'before' },
  CAD: { locale: 'en-CA', symbol: 'C$', position: 'before' },
};

export function formatCurrency(
  amount: number,
  currency: string,
  options: {
    compact?: boolean;
    showSymbol?: boolean;
    decimals?: number;
  } = {}
): string {
  const { compact = false, showSymbol = true, decimals = 2 } = options;
  const format = CURRENCY_FORMATS[currency] || CURRENCY_FORMATS.USD;

  // Use compact notation for large numbers
  if (compact && amount >= 1000) {
    const formatter = new Intl.NumberFormat(format.locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: showSymbol ? currency : undefined,
      notation: 'compact',
      maximumFractionDigits: 1,
    });
    return formatter.format(amount);
  }

  const formatter = new Intl.NumberFormat(format.locale, {
    style: showSymbol ? 'currency' : 'decimal',
    currency: showSymbol ? currency : undefined,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return formatter.format(amount);
}

// Format price range
export function formatPriceRange(
  min: number,
  max: number,
  currency: string
): string {
  if (min === max) {
    return formatCurrency(min, currency);
  }
  return `${formatCurrency(min, currency)} - ${formatCurrency(max, currency)}`;
}

// Get currency symbol
export function getCurrencySymbol(currency: string): string {
  return CURRENCY_FORMATS[currency]?.symbol || currency;
}

// Convert between currencies (simplified - use real API in production)
export async function convertCurrency(
  amount: number,
  from: string,
  to: string
): Promise<number> {
  if (from === to) return amount;

  const response = await fetch(
    `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
  );
  const data = await response.json();
  return data.result;
}
```

### Price Display Variants

```tsx
// components/listing/PriceDisplay.tsx
import { formatCurrency, formatPriceRange } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface PriceDisplayProps {
  price: number;
  originalPrice?: number;
  currency: string;
  period?: 'night' | 'total' | 'month';
  size?: 'sm' | 'md' | 'lg';
  showTotal?: { amount: number; nights: number };
  className?: string;
}

export function PriceDisplay({
  price,
  originalPrice,
  currency,
  period = 'night',
  size = 'md',
  showTotal,
  className,
}: PriceDisplayProps) {
  const hasDiscount = originalPrice && originalPrice > price;
  const discountPercent = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  const periodLabels = {
    night: 'night',
    total: 'total',
    month: 'month',
  };

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-baseline gap-1.5">
        {hasDiscount && (
          <>
            <span
              className={cn(
                'line-through text-gray-500',
                size === 'sm' ? 'text-xs' : 'text-sm'
              )}
            >
              {formatCurrency(originalPrice, currency)}
            </span>
            <span className="text-xs bg-red-100 text-red-700 px-1.5 py-0.5 rounded">
              -{discountPercent}%
            </span>
          </>
        )}
        <span className={cn('font-semibold', sizeClasses[size])}>
          {formatCurrency(price, currency)}
        </span>
        <span className={cn('text-gray-600', size === 'sm' ? 'text-xs' : 'text-sm')}>
          {periodLabels[period]}
        </span>
      </div>

      {showTotal && (
        <p className="text-sm text-gray-500 mt-0.5">
          {formatCurrency(showTotal.amount, currency)} total ·{' '}
          {showTotal.nights} {showTotal.nights === 1 ? 'night' : 'nights'}
        </p>
      )}
    </div>
  );
}

// Range price display (for flexible dates)
interface PriceRangeDisplayProps {
  minPrice: number;
  maxPrice: number;
  currency: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PriceRangeDisplay({
  minPrice,
  maxPrice,
  currency,
  size = 'md',
}: PriceRangeDisplayProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl',
  };

  if (minPrice === maxPrice) {
    return (
      <div className="flex items-baseline gap-1">
        <span className={cn('font-semibold', sizeClasses[size])}>
          {formatCurrency(minPrice, currency)}
        </span>
        <span className="text-gray-600 text-sm">night</span>
      </div>
    );
  }

  return (
    <div className="flex items-baseline gap-1">
      <span className={cn('font-semibold', sizeClasses[size])}>
        {formatCurrency(minPrice, currency)}
      </span>
      <span className="text-gray-500">–</span>
      <span className={cn('font-semibold', sizeClasses[size])}>
        {formatCurrency(maxPrice, currency)}
      </span>
      <span className="text-gray-600 text-sm">/ night</span>
    </div>
  );
}
```

### Sticky Price Card

```tsx
// components/booking/StickyPriceCard.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PriceDisplay } from '@/components/listing/PriceDisplay';
import { DateRangePicker } from '@/components/booking/DateRangePicker';
import { GuestSelector } from '@/components/booking/GuestSelector';
import { PricingBreakdown } from './PricingBreakdown';
import { usePriceCalculator } from '@/hooks/usePriceCalculator';
import { cn } from '@/lib/utils';
import type { Listing } from '@/types/listing';

interface StickyPriceCardProps {
  listing: Listing;
  className?: string;
}

export function StickyPriceCard({ listing, className }: StickyPriceCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isSticky, setIsSticky] = useState(false);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState({
    adults: 1,
    children: 0,
    infants: 0,
    pets: 0,
  });

  // Calculate pricing
  const { pricing, isLoading, isValid } = usePriceCalculator({
    listingId: listing.id,
    checkIn,
    checkOut,
    guests,
  });

  // Handle sticky behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      setIsSticky(rect.top <= 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      ref={cardRef}
      className={cn(
        'bg-white rounded-xl border shadow-lg p-6 transition-shadow',
        isSticky && 'shadow-xl',
        className
      )}
    >
      {/* Header with price and rating */}
      <div className="flex justify-between items-start mb-6">
        <PriceDisplay
          price={listing.price}
          originalPrice={listing.originalPrice}
          currency={listing.currency}
          period="night"
          size="lg"
        />
        <div className="flex items-center gap-1 text-sm">
          <Star className="w-4 h-4 fill-current" />
          <span className="font-medium">{listing.rating}</span>
          <span className="text-gray-500">({listing.reviewCount} reviews)</span>
        </div>
      </div>

      {/* Date selection */}
      <div className="mb-4">
        <DateRangePicker
          startDate={checkIn}
          endDate={checkOut}
          onDateChange={(start, end) => {
            setCheckIn(start);
            setCheckOut(end);
          }}
          blockedDates={listing.blockedDates}
          minStay={listing.minStay}
        />
      </div>

      {/* Guest selection */}
      <div className="mb-6">
        <GuestSelector
          guests={guests}
          onChange={setGuests}
          maxGuests={listing.maxGuests}
          allowPets={listing.allowPets}
        />
      </div>

      {/* Reserve button */}
      <Button
        className="w-full mb-4"
        size="lg"
        disabled={!isValid || isLoading}
      >
        {isValid ? 'Reserve' : 'Check availability'}
      </Button>

      {/* Pricing breakdown */}
      {isValid && pricing && (
        <>
          <p className="text-center text-sm text-gray-500 mb-4">
            You won't be charged yet
          </p>
          <PricingBreakdown
            pricing={pricing}
            checkIn={checkIn!.toISOString()}
            checkOut={checkOut!.toISOString()}
            showNightlyBreakdown
          />
        </>
      )}

      {/* Loading state */}
      {isValid && isLoading && (
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
          <div className="h-6 bg-gray-200 rounded w-full mt-4" />
        </div>
      )}
    </div>
  );
}
```

### Mobile Price Bar

```tsx
// components/booking/MobilePriceBar.tsx
'use client';

import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { PriceDisplay } from '@/components/listing/PriceDisplay';
import { PricingBreakdown } from './PricingBreakdown';
import { formatCurrency } from '@/lib/currency';
import type { PricingBreakdown as PricingBreakdownType } from '@/types/pricing';
import type { Listing } from '@/types/listing';

interface MobilePriceBarProps {
  listing: Listing;
  pricing?: PricingBreakdownType;
  onReserve: () => void;
}

export function MobilePriceBar({
  listing,
  pricing,
  onReserve,
}: MobilePriceBarProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <>
      {/* Fixed bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t px-4 py-3 flex justify-between items-center z-50 md:hidden">
        <div>
          {pricing ? (
            <button
              onClick={() => setShowBreakdown(true)}
              className="text-left"
            >
              <p className="font-semibold underline">
                {formatCurrency(pricing.total, pricing.currency)} total
              </p>
              <p className="text-sm text-gray-500">
                {pricing.nights} nights
              </p>
            </button>
          ) : (
            <PriceDisplay
              price={listing.price}
              originalPrice={listing.originalPrice}
              currency={listing.currency}
              period="night"
              size="md"
            />
          )}
        </div>

        <Button onClick={onReserve} className="px-6">
          Reserve
        </Button>
      </div>

      {/* Price breakdown sheet */}
      <Sheet open={showBreakdown} onOpenChange={setShowBreakdown}>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Price breakdown</SheetTitle>
          </SheetHeader>
          {pricing && (
            <div className="mt-6">
              <PricingBreakdown
                pricing={pricing}
                checkIn=""
                checkOut=""
                variant="detailed"
                showNightlyBreakdown
              />
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
```

---

## 17. Host Profile Card & Verification Badges

### Host Data Types

```typescript
// types/host.ts
export interface Host {
  id: string;
  firstName: string;
  lastName?: string;
  profilePhoto: string;
  thumbnailPhoto: string;
  about?: string;

  // Verification & Trust
  isSuperhost: boolean;
  isIdentityVerified: boolean;
  verifications: HostVerification[];

  // Stats
  joinedDate: string;
  reviewsCount: number;
  rating: number;
  responseRate: number;
  responseTime: ResponseTime;
  listingsCount: number;

  // Languages & location
  languages: string[];
  location?: string;
  work?: string;

  // Communication
  canInstantBook: boolean;
  acceptsNewGuests: boolean;
}

export interface HostVerification {
  type: VerificationType;
  verifiedAt: string;
  label: string;
  icon: string;
}

export type VerificationType =
  | 'identity'
  | 'email'
  | 'phone'
  | 'government_id'
  | 'facebook'
  | 'google'
  | 'linkedin'
  | 'work_email';

export type ResponseTime =
  | 'within_hour'
  | 'within_few_hours'
  | 'within_day'
  | 'few_days';

export interface HostHighlight {
  icon: string;
  title: string;
  description: string;
}
```

### Host Profile Card Component

```tsx
// components/host/HostProfileCard.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Shield,
  Award,
  MessageCircle,
  ChevronRight,
  Check,
  Clock,
  Globe,
  Briefcase,
  MapPin,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { Host } from '@/types/host';
import { formatRelativeDate, formatResponseTime } from '@/lib/format';

interface HostProfileCardProps {
  host: Host;
  variant?: 'full' | 'compact' | 'inline';
  showContactButton?: boolean;
  onContact?: () => void;
}

export function HostProfileCard({
  host,
  variant = 'full',
  showContactButton = true,
  onContact,
}: HostProfileCardProps) {
  const [showProfile, setShowProfile] = useState(false);

  if (variant === 'inline') {
    return (
      <InlineHostCard host={host} onClick={() => setShowProfile(true)} />
    );
  }

  if (variant === 'compact') {
    return (
      <CompactHostCard
        host={host}
        onContact={onContact}
        onClick={() => setShowProfile(true)}
      />
    );
  }

  return (
    <>
      <section className="py-8 border-b border-gray-200">
        {/* Host header */}
        <div className="flex items-start gap-4 mb-6">
          <button
            onClick={() => setShowProfile(true)}
            className="relative flex-shrink-0"
          >
            <div className="relative w-16 h-16">
              <Image
                src={host.profilePhoto}
                alt={host.firstName}
                fill
                className="rounded-full object-cover"
              />
              {host.isSuperhost && (
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow">
                  <Award className="w-4 h-4 text-rose-500" />
                </div>
              )}
            </div>
          </button>

          <div className="flex-1">
            <h2 className="text-xl font-semibold">
              Hosted by {host.firstName}
            </h2>
            <p className="text-gray-500">
              Joined {formatRelativeDate(host.joinedDate)}
            </p>
          </div>
        </div>

        {/* Host stats */}
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            <span className="font-medium">{host.reviewsCount} Reviews</span>
          </div>

          {host.isIdentityVerified && (
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              <span className="font-medium">Identity verified</span>
            </div>
          )}

          {host.isSuperhost && (
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-rose-500" />
              <span className="font-medium">Superhost</span>
            </div>
          )}
        </div>

        {/* Superhost badge explanation */}
        {host.isSuperhost && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Award className="w-6 h-6 text-rose-500 flex-shrink-0" />
              <div>
                <p className="font-medium">{host.firstName} is a Superhost</p>
                <p className="text-sm text-gray-600 mt-1">
                  Superhosts are experienced, highly rated hosts who are
                  committed to providing great stays for guests.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Host highlights */}
        <HostHighlights host={host} />

        {/* About section */}
        {host.about && (
          <div className="mt-6">
            <h3 className="font-medium mb-2">About {host.firstName}</h3>
            <p className="text-gray-700 whitespace-pre-line line-clamp-4">
              {host.about}
            </p>
            {host.about.length > 200 && (
              <button
                onClick={() => setShowProfile(true)}
                className="mt-2 font-medium underline"
              >
                Show more
              </button>
            )}
          </div>
        )}

        {/* Contact button */}
        {showContactButton && (
          <Button
            variant="outline"
            className="mt-6"
            onClick={onContact}
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Host
          </Button>
        )}

        {/* Co-hosts section */}
        <CoHostsSection hostId={host.id} />
      </section>

      {/* Full profile modal */}
      <HostProfileModal
        host={host}
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </>
  );
}

// Host highlights section
function HostHighlights({ host }: { host: Host }) {
  const highlights: HostHighlight[] = [];

  if (host.responseRate >= 90) {
    highlights.push({
      icon: 'clock',
      title: `${host.responseRate}% response rate`,
      description: formatResponseTime(host.responseTime),
    });
  }

  if (host.languages.length > 1) {
    highlights.push({
      icon: 'globe',
      title: 'Languages',
      description: host.languages.join(', '),
    });
  }

  if (host.location) {
    highlights.push({
      icon: 'map-pin',
      title: 'Lives in',
      description: host.location,
    });
  }

  if (host.work) {
    highlights.push({
      icon: 'briefcase',
      title: 'Work',
      description: host.work,
    });
  }

  if (highlights.length === 0) return null;

  const iconMap: Record<string, typeof Clock> = {
    clock: Clock,
    globe: Globe,
    'map-pin': MapPin,
    briefcase: Briefcase,
  };

  return (
    <div className="space-y-4">
      {highlights.map((highlight, index) => {
        const Icon = iconMap[highlight.icon] || Clock;
        return (
          <div key={index} className="flex items-start gap-4">
            <Icon className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-medium">{highlight.title}</p>
              <p className="text-sm text-gray-600">{highlight.description}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Inline host card (for listing headers)
function InlineHostCard({
  host,
  onClick,
}: {
  host: Host;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 hover:opacity-80 transition-opacity"
    >
      <div className="relative w-10 h-10">
        <Image
          src={host.thumbnailPhoto}
          alt={host.firstName}
          fill
          className="rounded-full object-cover"
        />
        {host.isSuperhost && (
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
            <Award className="w-3 h-3 text-rose-500" />
          </div>
        )}
      </div>
      <div className="text-left">
        <p className="font-medium text-sm">Hosted by {host.firstName}</p>
        {host.isSuperhost && (
          <p className="text-xs text-gray-500">Superhost</p>
        )}
      </div>
    </button>
  );
}

// Compact host card
function CompactHostCard({
  host,
  onContact,
  onClick,
}: {
  host: Host;
  onContact?: () => void;
  onClick: () => void;
}) {
  return (
    <div className="p-4 border rounded-xl">
      <div className="flex items-center gap-3 mb-4">
        <button onClick={onClick} className="relative">
          <div className="relative w-14 h-14">
            <Image
              src={host.profilePhoto}
              alt={host.firstName}
              fill
              className="rounded-full object-cover"
            />
          </div>
          {host.isSuperhost && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center shadow">
              <Award className="w-3 h-3 text-rose-500" />
            </div>
          )}
        </button>

        <div className="flex-1">
          <p className="font-semibold">{host.firstName}</p>
          {host.isSuperhost && (
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Award className="w-3 h-3 text-rose-500" />
              <span>Superhost</span>
            </div>
          )}
        </div>

        <button
          onClick={onClick}
          className="p-2 hover:bg-gray-100 rounded-full"
          aria-label="View host profile"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4" />
          <span>{host.rating}</span>
        </div>
        <span>·</span>
        <span>{host.reviewsCount} reviews</span>
      </div>

      {onContact && (
        <Button variant="outline" size="sm" className="w-full" onClick={onContact}>
          <MessageCircle className="w-4 h-4 mr-2" />
          Message Host
        </Button>
      )}
    </div>
  );
}
```

### Host Profile Modal

```tsx
// components/host/HostProfileModal.tsx
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Star,
  Shield,
  Award,
  Check,
  Clock,
  Globe,
  MapPin,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { Host, HostVerification } from '@/types/host';
import { formatRelativeDate, formatResponseTime } from '@/lib/format';
import { cn } from '@/lib/utils';

interface HostProfileModalProps {
  host: Host;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostProfileModal({
  host,
  open,
  onOpenChange,
}: HostProfileModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] p-0 overflow-hidden">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            {/* Header with photo and name */}
            <div className="text-center mb-6">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <Image
                  src={host.profilePhoto}
                  alt={host.firstName}
                  fill
                  className="rounded-full object-cover"
                />
                {host.isSuperhost && (
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
                    <Award className="w-5 h-5 text-rose-500" />
                  </div>
                )}
              </div>
              <h2 className="text-2xl font-bold">{host.firstName}</h2>
              {host.isSuperhost && (
                <p className="text-gray-500 flex items-center justify-center gap-1">
                  <Award className="w-4 h-4 text-rose-500" />
                  Superhost
                </p>
              )}
            </div>

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">{host.reviewsCount}</p>
                <p className="text-sm text-gray-600">Reviews</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold flex items-center justify-center gap-1">
                  {host.rating}
                  <Star className="w-4 h-4 fill-current" />
                </p>
                <p className="text-sm text-gray-600">Rating</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">
                  {new Date().getFullYear() -
                    new Date(host.joinedDate).getFullYear()}
                </p>
                <p className="text-sm text-gray-600">Years hosting</p>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Verifications */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">
                {host.firstName}'s confirmed information
              </h3>
              <div className="space-y-3">
                {host.verifications.map((verification) => (
                  <VerificationItem
                    key={verification.type}
                    verification={verification}
                  />
                ))}
              </div>
              <Link
                href="/help/verification"
                className="text-sm text-gray-600 underline mt-3 inline-block"
              >
                Learn about identity verification
              </Link>
            </div>

            <Separator className="my-6" />

            {/* About section */}
            {host.about && (
              <>
                <div className="mb-6">
                  <h3 className="font-semibold mb-3">About {host.firstName}</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {host.about}
                  </p>
                </div>
                <Separator className="my-6" />
              </>
            )}

            {/* Details */}
            <div className="space-y-4 mb-6">
              {host.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <span>Lives in {host.location}</span>
                </div>
              )}
              {host.languages.length > 0 && (
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-gray-400" />
                  <span>Speaks {host.languages.join(', ')}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <span>
                  Response rate: {host.responseRate}% ·{' '}
                  {formatResponseTime(host.responseTime)}
                </span>
              </div>
            </div>

            {/* Superhost explanation */}
            {host.isSuperhost && (
              <div className="p-4 bg-rose-50 rounded-lg mb-6">
                <div className="flex items-start gap-3">
                  <Award className="w-6 h-6 text-rose-500 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-rose-900">
                      {host.firstName} is a Superhost
                    </p>
                    <p className="text-sm text-rose-700 mt-1">
                      Superhosts are experienced, highly rated hosts who are
                      committed to providing great stays for guests.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* View listings button */}
            <Button variant="outline" className="w-full" asChild>
              <Link href={`/users/${host.id}/listings`}>
                View {host.firstName}'s {host.listingsCount} listing
                {host.listingsCount !== 1 ? 's' : ''}
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function VerificationItem({
  verification,
}: {
  verification: HostVerification;
}) {
  return (
    <div className="flex items-center gap-3">
      <Check className="w-5 h-5 text-green-600" />
      <span>{verification.label}</span>
    </div>
  );
}
```

### Verification Badges

```tsx
// components/host/VerificationBadges.tsx
import {
  Shield,
  Mail,
  Phone,
  CreditCard,
  Facebook,
  Chrome,
  Linkedin,
  Building,
  type LucideIcon,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import type { VerificationType, HostVerification } from '@/types/host';
import { cn } from '@/lib/utils';

const VERIFICATION_CONFIG: Record<
  VerificationType,
  { icon: LucideIcon; label: string; color: string }
> = {
  identity: {
    icon: Shield,
    label: 'Identity verified',
    color: 'text-blue-600 bg-blue-50',
  },
  email: {
    icon: Mail,
    label: 'Email verified',
    color: 'text-green-600 bg-green-50',
  },
  phone: {
    icon: Phone,
    label: 'Phone verified',
    color: 'text-green-600 bg-green-50',
  },
  government_id: {
    icon: CreditCard,
    label: 'Government ID verified',
    color: 'text-purple-600 bg-purple-50',
  },
  facebook: {
    icon: Facebook,
    label: 'Facebook connected',
    color: 'text-blue-600 bg-blue-50',
  },
  google: {
    icon: Chrome,
    label: 'Google connected',
    color: 'text-red-600 bg-red-50',
  },
  linkedin: {
    icon: Linkedin,
    label: 'LinkedIn connected',
    color: 'text-blue-700 bg-blue-50',
  },
  work_email: {
    icon: Building,
    label: 'Work email verified',
    color: 'text-gray-600 bg-gray-100',
  },
};

interface VerificationBadgesProps {
  verifications: HostVerification[];
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
  maxVisible?: number;
}

export function VerificationBadges({
  verifications,
  size = 'md',
  showLabels = false,
  maxVisible = 5,
}: VerificationBadgesProps) {
  const visibleVerifications = verifications.slice(0, maxVisible);
  const remaining = verifications.length - maxVisible;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const badgeSizeClasses = {
    sm: 'p-1',
    md: 'p-1.5',
    lg: 'p-2',
  };

  if (showLabels) {
    return (
      <div className="space-y-2">
        {visibleVerifications.map((verification) => {
          const config = VERIFICATION_CONFIG[verification.type];
          const Icon = config.icon;

          return (
            <div
              key={verification.type}
              className="flex items-center gap-2"
            >
              <div className={cn('rounded-full', badgeSizeClasses[size], config.color)}>
                <Icon className={sizeClasses[size]} />
              </div>
              <span className="text-sm">{verification.label}</span>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      {visibleVerifications.map((verification) => {
        const config = VERIFICATION_CONFIG[verification.type];
        const Icon = config.icon;

        return (
          <Tooltip key={verification.type}>
            <TooltipTrigger asChild>
              <div
                className={cn(
                  'rounded-full cursor-help',
                  badgeSizeClasses[size],
                  config.color
                )}
              >
                <Icon className={sizeClasses[size]} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{verification.label}</p>
            </TooltipContent>
          </Tooltip>
        );
      })}
      {remaining > 0 && (
        <span className="text-xs text-gray-500 ml-1">+{remaining}</span>
      )}
    </div>
  );
}

// Superhost badge component
interface SuperhostBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'outline' | 'pill';
}

export function SuperhostBadge({
  size = 'md',
  showLabel = true,
  variant = 'default',
}: SuperhostBadgeProps) {
  const sizeClasses = {
    sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-1.5 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2 py-1' },
    lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' },
  };

  const variantClasses = {
    default: 'bg-rose-50 text-rose-700',
    outline: 'border border-rose-300 text-rose-700',
    pill: 'bg-rose-500 text-white',
  };

  const classes = sizeClasses[size];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded-full font-medium',
        classes.padding,
        classes.text,
        variantClasses[variant]
      )}
    >
      <Award className={classes.icon} />
      {showLabel && <span>Superhost</span>}
    </div>
  );
}
```

### Co-Hosts Section

```tsx
// components/host/CoHostsSection.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import type { Host } from '@/types/host';

interface CoHostsSectionProps {
  hostId: string;
}

export function CoHostsSection({ hostId }: CoHostsSectionProps) {
  const { data: coHosts, isLoading } = useQuery({
    queryKey: ['coHosts', hostId],
    queryFn: () => fetchCoHosts(hostId),
  });

  if (isLoading) {
    return (
      <div className="mt-6 pt-6 border-t">
        <Skeleton className="h-4 w-24 mb-3" />
        <div className="flex gap-3">
          <Skeleton className="w-12 h-12 rounded-full" />
          <Skeleton className="w-12 h-12 rounded-full" />
        </div>
      </div>
    );
  }

  if (!coHosts || coHosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 pt-6 border-t">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5" />
        <h3 className="font-medium">Co-hosts</h3>
      </div>

      <div className="flex flex-wrap gap-4">
        {coHosts.map((coHost) => (
          <div key={coHost.id} className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src={coHost.thumbnailPhoto}
                alt={coHost.firstName}
                fill
                className="rounded-full object-cover"
              />
            </div>
            <div>
              <p className="font-medium">{coHost.firstName}</p>
              <p className="text-sm text-gray-500">Co-host</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

async function fetchCoHosts(hostId: string): Promise<Host[]> {
  const response = await fetch(`/api/hosts/${hostId}/co-hosts`);
  if (!response.ok) throw new Error('Failed to fetch co-hosts');
  return response.json();
}
```

### Response Time Utilities

```typescript
// lib/format.ts
import { formatDistanceToNow, formatDistance, format } from 'date-fns';
import type { ResponseTime } from '@/types/host';

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMonths =
    (now.getFullYear() - date.getFullYear()) * 12 +
    (now.getMonth() - date.getMonth());

  if (diffInMonths < 1) {
    return 'this month';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  } else {
    const years = Math.floor(diffInMonths / 12);
    return format(date, 'MMMM yyyy');
  }
}

export function formatResponseTime(responseTime: ResponseTime): string {
  const labels: Record<ResponseTime, string> = {
    within_hour: 'Responds within an hour',
    within_few_hours: 'Responds within a few hours',
    within_day: 'Responds within a day',
    few_days: 'Responds within a few days',
  };

  return labels[responseTime];
}

export function getResponseTimeBadgeColor(
  responseTime: ResponseTime
): string {
  const colors: Record<ResponseTime, string> = {
    within_hour: 'bg-green-100 text-green-800',
    within_few_hours: 'bg-green-50 text-green-700',
    within_day: 'bg-yellow-50 text-yellow-700',
    few_days: 'bg-gray-100 text-gray-600',
  };

  return colors[responseTime];
}
```

### Host Stats Display

```tsx
// components/host/HostStats.tsx
import { Star, MessageCircle, Home, Calendar } from 'lucide-react';
import type { Host } from '@/types/host';
import { cn } from '@/lib/utils';

interface HostStatsProps {
  host: Host;
  layout?: 'horizontal' | 'vertical' | 'grid';
  showAll?: boolean;
}

export function HostStats({
  host,
  layout = 'horizontal',
  showAll = false,
}: HostStatsProps) {
  const stats = [
    {
      icon: Star,
      value: host.rating.toFixed(2),
      label: 'Rating',
      show: true,
    },
    {
      icon: MessageCircle,
      value: host.reviewsCount.toLocaleString(),
      label: 'Reviews',
      show: true,
    },
    {
      icon: Home,
      value: host.listingsCount,
      label: host.listingsCount === 1 ? 'Listing' : 'Listings',
      show: showAll,
    },
    {
      icon: Calendar,
      value: `${new Date().getFullYear() - new Date(host.joinedDate).getFullYear()}`,
      label: 'Years hosting',
      show: showAll,
    },
  ].filter((stat) => stat.show);

  const layoutClasses = {
    horizontal: 'flex items-center gap-6',
    vertical: 'flex flex-col gap-3',
    grid: 'grid grid-cols-2 gap-4',
  };

  return (
    <div className={layoutClasses[layout]}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={cn(
              'flex items-center gap-2',
              layout === 'grid' && 'flex-col text-center'
            )}
          >
            <Icon
              className={cn(
                'text-gray-600',
                layout === 'grid' ? 'w-6 h-6' : 'w-4 h-4'
              )}
            />
            <div className={cn(layout === 'grid' && 'text-center')}>
              <span className="font-semibold">{stat.value}</span>
              {layout !== 'horizontal' && (
                <span className="text-sm text-gray-500 ml-1">
                  {stat.label}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

---

## 18. House Rules Display

### House Rules Data Types

```typescript
// types/house-rules.ts
export interface HouseRules {
  checkIn: CheckInOutRules;
  checkOut: CheckInOutRules;

  // Core rules
  maxGuests: number;
  allowChildren: boolean;
  allowInfants: boolean;
  allowPets: PetRules;
  allowSmoking: SmokingRules;
  allowEvents: EventRules;

  // Specific rules
  quietHours?: QuietHours;
  additionalRules: AdditionalRule[];

  // Safety
  safetyRules: SafetyRule[];

  // Property access
  selfCheckIn: boolean;
  selfCheckInMethod?: 'keypad' | 'lockbox' | 'smart_lock' | 'doorman';
  selfCheckInInstructions?: string;
}

export interface CheckInOutRules {
  time: string; // "15:00" format
  flexibleTime?: boolean;
  earliestTime?: string;
  latestTime?: string;
  notes?: string;
}

export interface PetRules {
  allowed: boolean;
  types?: ('dogs' | 'cats' | 'small_pets' | 'service_animals')[];
  maxPets?: number;
  restrictions?: string;
  fee?: number;
}

export interface SmokingRules {
  allowed: boolean;
  outdoorOnly?: boolean;
  designatedArea?: string;
}

export interface EventRules {
  allowed: boolean;
  partyAllowed: boolean;
  maxEventGuests?: number;
  restrictions?: string;
}

export interface QuietHours {
  start: string; // "22:00"
  end: string;   // "08:00"
  description?: string;
}

export interface AdditionalRule {
  id: string;
  icon: string;
  title: string;
  description?: string;
  importance: 'required' | 'preferred' | 'info';
}

export interface SafetyRule {
  type: SafetyRuleType;
  present: boolean;
  details?: string;
}

export type SafetyRuleType =
  | 'smoke_alarm'
  | 'carbon_monoxide_alarm'
  | 'fire_extinguisher'
  | 'first_aid_kit'
  | 'security_camera'
  | 'weapon'
  | 'dangerous_animal'
  | 'pool_or_hot_tub'
  | 'lake_or_river'
  | 'heights';
```

### House Rules Section Component

```tsx
// components/listing/HouseRulesSection.tsx
'use client';

import { useState } from 'react';
import {
  Clock,
  Users,
  Baby,
  Dog,
  Cigarette,
  PartyPopper,
  Volume2,
  Key,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { HouseRules } from '@/types/house-rules';
import { cn } from '@/lib/utils';
import { formatTime12Hour } from '@/lib/format';

interface HouseRulesSectionProps {
  rules: HouseRules;
  maxVisibleRules?: number;
}

export function HouseRulesSection({
  rules,
  maxVisibleRules = 5,
}: HouseRulesSectionProps) {
  const [showAllRules, setShowAllRules] = useState(false);

  // Build visible rules list
  const visibleRules = buildVisibleRules(rules).slice(0, maxVisibleRules);
  const allRules = buildVisibleRules(rules);
  const hasMore = allRules.length > maxVisibleRules;

  return (
    <section className="py-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold mb-6">House rules</h2>

      <div className="space-y-4">
        {visibleRules.map((rule, index) => (
          <RuleItem key={index} rule={rule} />
        ))}
      </div>

      {hasMore && (
        <Button
          variant="link"
          className="mt-4 px-0 font-semibold"
          onClick={() => setShowAllRules(true)}
        >
          Show all {allRules.length} rules
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      )}

      <HouseRulesModal
        rules={rules}
        open={showAllRules}
        onOpenChange={setShowAllRules}
      />
    </section>
  );
}

interface DisplayRule {
  icon: React.ElementType;
  title: string;
  description?: string;
  status?: 'allowed' | 'not_allowed' | 'conditional' | 'info';
}

function buildVisibleRules(rules: HouseRules): DisplayRule[] {
  const displayRules: DisplayRule[] = [];

  // Check-in/out times
  displayRules.push({
    icon: Clock,
    title: `Check-in: ${formatTime12Hour(rules.checkIn.time)}`,
    description: rules.checkIn.flexibleTime
      ? `Flexible between ${formatTime12Hour(rules.checkIn.earliestTime!)} - ${formatTime12Hour(rules.checkIn.latestTime!)}`
      : undefined,
    status: 'info',
  });

  displayRules.push({
    icon: Clock,
    title: `Checkout: ${formatTime12Hour(rules.checkOut.time)}`,
    status: 'info',
  });

  // Self check-in
  if (rules.selfCheckIn) {
    const methodLabels: Record<string, string> = {
      keypad: 'Self check-in with keypad',
      lockbox: 'Self check-in with lockbox',
      smart_lock: 'Self check-in with smart lock',
      doorman: 'Doorman will let you in',
    };

    displayRules.push({
      icon: Key,
      title: rules.selfCheckInMethod
        ? methodLabels[rules.selfCheckInMethod]
        : 'Self check-in',
      status: 'info',
    });
  }

  // Max guests
  displayRules.push({
    icon: Users,
    title: `${rules.maxGuests} guests maximum`,
    status: 'info',
  });

  // Children/Infants
  if (!rules.allowChildren || !rules.allowInfants) {
    displayRules.push({
      icon: Baby,
      title: rules.allowChildren
        ? 'Not suitable for infants (under 2 years)'
        : 'Not suitable for children',
      status: 'not_allowed',
    });
  }

  // Pets
  displayRules.push({
    icon: Dog,
    title: rules.allowPets.allowed
      ? rules.allowPets.fee
        ? `Pets allowed (${formatCurrency(rules.allowPets.fee)} fee)`
        : 'Pets allowed'
      : 'No pets',
    description: rules.allowPets.restrictions,
    status: rules.allowPets.allowed ? 'allowed' : 'not_allowed',
  });

  // Smoking
  displayRules.push({
    icon: Cigarette,
    title: rules.allowSmoking.allowed
      ? rules.allowSmoking.outdoorOnly
        ? 'Smoking allowed outdoors only'
        : 'Smoking allowed'
      : 'No smoking',
    status: rules.allowSmoking.allowed ? 'conditional' : 'not_allowed',
  });

  // Events/Parties
  displayRules.push({
    icon: PartyPopper,
    title: rules.allowEvents.partyAllowed
      ? 'Parties/events allowed'
      : 'No parties or events',
    status: rules.allowEvents.partyAllowed ? 'allowed' : 'not_allowed',
  });

  // Quiet hours
  if (rules.quietHours) {
    displayRules.push({
      icon: Volume2,
      title: `Quiet hours: ${formatTime12Hour(rules.quietHours.start)} - ${formatTime12Hour(rules.quietHours.end)}`,
      description: rules.quietHours.description,
      status: 'info',
    });
  }

  // Additional rules
  rules.additionalRules.forEach((rule) => {
    displayRules.push({
      icon: Info,
      title: rule.title,
      description: rule.description,
      status: 'info',
    });
  });

  return displayRules;
}

function RuleItem({ rule }: { rule: DisplayRule }) {
  const Icon = rule.icon;

  const statusStyles = {
    allowed: 'text-green-600',
    not_allowed: 'text-gray-500',
    conditional: 'text-amber-600',
    info: 'text-gray-900',
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 w-6 h-6">
        <Icon className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <p
          className={cn(
            'font-medium',
            rule.status && statusStyles[rule.status]
          )}
        >
          {rule.title}
        </p>
        {rule.description && (
          <p className="text-sm text-gray-500 mt-0.5">{rule.description}</p>
        )}
      </div>
      {rule.status === 'not_allowed' && (
        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
      )}
      {rule.status === 'allowed' && (
        <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
      )}
    </div>
  );
}
```

### House Rules Modal

```tsx
// components/listing/HouseRulesModal.tsx
'use client';

import {
  Clock,
  Users,
  Baby,
  Dog,
  Cigarette,
  PartyPopper,
  Volume2,
  Key,
  Shield,
  Camera,
  AlertTriangle,
  Check,
  X,
  Info,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { HouseRules, SafetyRuleType } from '@/types/house-rules';
import { formatTime12Hour } from '@/lib/format';
import { cn } from '@/lib/utils';

interface HouseRulesModalProps {
  rules: HouseRules;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HouseRulesModal({
  rules,
  open,
  onOpenChange,
}: HouseRulesModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold">
            House rules
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6" style={{ maxHeight: '70vh' }}>
          <p className="text-gray-600 mb-6">
            You'll be asked to agree to these rules before booking.
          </p>

          {/* Check-in/out Section */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Checking in and out</h3>
            <div className="space-y-4">
              <RuleRow
                icon={Clock}
                title="Check-in"
                value={`After ${formatTime12Hour(rules.checkIn.time)}`}
                note={
                  rules.checkIn.flexibleTime
                    ? `Flexible: ${formatTime12Hour(rules.checkIn.earliestTime!)} - ${formatTime12Hour(rules.checkIn.latestTime!)}`
                    : undefined
                }
              />

              <RuleRow
                icon={Clock}
                title="Checkout"
                value={`Before ${formatTime12Hour(rules.checkOut.time)}`}
              />

              {rules.selfCheckIn && (
                <RuleRow
                  icon={Key}
                  title="Self check-in"
                  value={getSelfCheckInLabel(rules.selfCheckInMethod)}
                  note={rules.selfCheckInInstructions}
                />
              )}
            </div>
          </section>

          <Separator className="my-6" />

          {/* During your stay */}
          <section className="mb-8">
            <h3 className="text-lg font-semibold mb-4">During your stay</h3>
            <div className="space-y-4">
              <RuleRow
                icon={Users}
                title="Maximum guests"
                value={`${rules.maxGuests} guests`}
              />

              <RuleRow
                icon={Baby}
                title="Children"
                value={rules.allowChildren ? 'Suitable for children (2-12)' : 'Not suitable for children'}
                allowed={rules.allowChildren}
              />

              <RuleRow
                icon={Baby}
                title="Infants"
                value={rules.allowInfants ? 'Suitable for infants (under 2)' : 'Not suitable for infants'}
                allowed={rules.allowInfants}
              />

              <RuleRow
                icon={Dog}
                title="Pets"
                value={
                  rules.allowPets.allowed
                    ? rules.allowPets.fee
                      ? `Allowed (${formatCurrency(rules.allowPets.fee)} fee)`
                      : 'Allowed'
                    : 'Not allowed'
                }
                allowed={rules.allowPets.allowed}
                note={rules.allowPets.restrictions}
              />

              <RuleRow
                icon={Cigarette}
                title="Smoking"
                value={
                  rules.allowSmoking.allowed
                    ? rules.allowSmoking.outdoorOnly
                      ? 'Outdoors only'
                      : 'Allowed'
                    : 'Not allowed'
                }
                allowed={rules.allowSmoking.allowed}
                conditional={rules.allowSmoking.outdoorOnly}
              />

              <RuleRow
                icon={PartyPopper}
                title="Events"
                value={rules.allowEvents.partyAllowed ? 'Allowed' : 'Not allowed'}
                allowed={rules.allowEvents.partyAllowed}
                note={rules.allowEvents.restrictions}
              />

              {rules.quietHours && (
                <RuleRow
                  icon={Volume2}
                  title="Quiet hours"
                  value={`${formatTime12Hour(rules.quietHours.start)} - ${formatTime12Hour(rules.quietHours.end)}`}
                  note={rules.quietHours.description}
                />
              )}
            </div>
          </section>

          {/* Additional rules */}
          {rules.additionalRules.length > 0 && (
            <>
              <Separator className="my-6" />
              <section className="mb-8">
                <h3 className="text-lg font-semibold mb-4">Additional rules</h3>
                <div className="space-y-4">
                  {rules.additionalRules.map((rule) => (
                    <div key={rule.id} className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">{rule.title}</p>
                        {rule.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {rule.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </>
          )}

          {/* Safety & Property */}
          <Separator className="my-6" />
          <section>
            <h3 className="text-lg font-semibold mb-4">Safety & property</h3>
            <SafetyRulesList rules={rules.safetyRules} />
          </section>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

interface RuleRowProps {
  icon: React.ElementType;
  title: string;
  value: string;
  note?: string;
  allowed?: boolean;
  conditional?: boolean;
}

function RuleRow({
  icon: Icon,
  title,
  value,
  note,
  allowed,
  conditional,
}: RuleRowProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <Icon className="w-6 h-6 text-gray-600 flex-shrink-0" />
        <div>
          <p className="text-gray-600">{title}</p>
          {note && <p className="text-sm text-gray-500 mt-0.5">{note}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            'font-medium',
            allowed === false && 'text-gray-500',
            allowed === true && 'text-green-600',
            conditional && 'text-amber-600'
          )}
        >
          {value}
        </span>
        {allowed === false && <X className="w-4 h-4 text-gray-400" />}
        {allowed === true && !conditional && <Check className="w-4 h-4 text-green-600" />}
      </div>
    </div>
  );
}

function getSelfCheckInLabel(method?: string): string {
  const labels: Record<string, string> = {
    keypad: 'Keypad entry',
    lockbox: 'Lockbox',
    smart_lock: 'Smart lock',
    doorman: 'Doorman',
  };
  return method ? labels[method] : 'Available';
}
```

### Safety Rules Display

```tsx
// components/listing/SafetyRulesList.tsx
import {
  AlertTriangle,
  Camera,
  Skull,
  PawPrint,
  Waves,
  Mountain,
  Flame,
  Heart,
  Bell,
  Check,
  X,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { SafetyRule, SafetyRuleType } from '@/types/house-rules';
import { cn } from '@/lib/utils';

const SAFETY_RULE_CONFIG: Record<
  SafetyRuleType,
  {
    icon: React.ElementType;
    presentLabel: string;
    absentLabel: string;
    warning?: boolean;
  }
> = {
  smoke_alarm: {
    icon: Bell,
    presentLabel: 'Smoke alarm installed',
    absentLabel: 'No smoke alarm',
    warning: true,
  },
  carbon_monoxide_alarm: {
    icon: Bell,
    presentLabel: 'Carbon monoxide alarm installed',
    absentLabel: 'No carbon monoxide alarm',
    warning: true,
  },
  fire_extinguisher: {
    icon: Flame,
    presentLabel: 'Fire extinguisher available',
    absentLabel: 'No fire extinguisher',
  },
  first_aid_kit: {
    icon: Heart,
    presentLabel: 'First aid kit available',
    absentLabel: 'No first aid kit',
  },
  security_camera: {
    icon: Camera,
    presentLabel: 'Security camera on property',
    absentLabel: 'No security cameras',
    warning: false,
  },
  weapon: {
    icon: AlertTriangle,
    presentLabel: 'Weapon on property',
    absentLabel: 'No weapons on property',
    warning: true,
  },
  dangerous_animal: {
    icon: PawPrint,
    presentLabel: 'Potentially dangerous animal',
    absentLabel: 'No dangerous animals',
    warning: true,
  },
  pool_or_hot_tub: {
    icon: Waves,
    presentLabel: 'Pool/hot tub without gate or lock',
    absentLabel: 'Pool/hot tub is secured',
    warning: true,
  },
  lake_or_river: {
    icon: Waves,
    presentLabel: 'Nearby lake, river, or body of water',
    absentLabel: 'No nearby water hazards',
    warning: false,
  },
  heights: {
    icon: Mountain,
    presentLabel: 'Heights without rails or protection',
    absentLabel: 'No height hazards',
    warning: true,
  },
};

interface SafetyRulesListProps {
  rules: SafetyRule[];
}

export function SafetyRulesList({ rules }: SafetyRulesListProps) {
  // Separate into safety equipment and hazards
  const safetyEquipment = rules.filter((r) =>
    ['smoke_alarm', 'carbon_monoxide_alarm', 'fire_extinguisher', 'first_aid_kit'].includes(r.type)
  );

  const hazards = rules.filter(
    (r) => r.present && !['smoke_alarm', 'carbon_monoxide_alarm', 'fire_extinguisher', 'first_aid_kit'].includes(r.type)
  );

  const missingEquipment = safetyEquipment.filter((r) => !r.present);

  return (
    <div className="space-y-6">
      {/* Missing safety equipment warning */}
      {missingEquipment.length > 0 && (
        <Alert variant="destructive" className="bg-red-50 border-red-200">
          <AlertTriangle className="w-4 h-4" />
          <AlertTitle>Safety notice</AlertTitle>
          <AlertDescription>
            This property does not have:{' '}
            {missingEquipment.map((r) => SAFETY_RULE_CONFIG[r.type].absentLabel.replace('No ', '')).join(', ')}
          </AlertDescription>
        </Alert>
      )}

      {/* Safety equipment present */}
      <div className="space-y-3">
        <p className="font-medium text-sm text-gray-500 uppercase tracking-wide">
          Safety devices
        </p>
        {safetyEquipment.map((rule) => {
          const config = SAFETY_RULE_CONFIG[rule.type];
          const Icon = config.icon;

          return (
            <div key={rule.type} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-gray-600" />
                <span>{rule.present ? config.presentLabel : config.absentLabel}</span>
              </div>
              {rule.present ? (
                <Check className="w-5 h-5 text-green-600" />
              ) : (
                <X className="w-5 h-5 text-red-500" />
              )}
            </div>
          );
        })}
      </div>

      {/* Property hazards */}
      {hazards.length > 0 && (
        <div className="space-y-3">
          <p className="font-medium text-sm text-gray-500 uppercase tracking-wide">
            Things to be aware of
          </p>
          {hazards.map((rule) => {
            const config = SAFETY_RULE_CONFIG[rule.type];
            const Icon = config.icon;

            return (
              <div key={rule.type} className="flex items-start gap-3">
                <Icon
                  className={cn(
                    'w-5 h-5 flex-shrink-0',
                    config.warning ? 'text-amber-500' : 'text-gray-600'
                  )}
                />
                <div>
                  <span>{config.presentLabel}</span>
                  {rule.details && (
                    <p className="text-sm text-gray-500 mt-0.5">{rule.details}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
```

### Compact House Rules (for cards)

```tsx
// components/listing/CompactHouseRules.tsx
import { Dog, Cigarette, PartyPopper, Check, X } from 'lucide-react';
import type { HouseRules } from '@/types/house-rules';
import { cn } from '@/lib/utils';

interface CompactHouseRulesProps {
  rules: HouseRules;
  className?: string;
}

export function CompactHouseRules({ rules, className }: CompactHouseRulesProps) {
  const highlights = [
    {
      icon: Dog,
      label: 'Pets',
      allowed: rules.allowPets.allowed,
    },
    {
      icon: Cigarette,
      label: 'Smoking',
      allowed: rules.allowSmoking.allowed,
    },
    {
      icon: PartyPopper,
      label: 'Events',
      allowed: rules.allowEvents.partyAllowed,
    },
  ];

  return (
    <div className={cn('flex items-center gap-4', className)}>
      {highlights.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.label}
            className="flex items-center gap-1.5 text-sm"
            title={`${item.label}: ${item.allowed ? 'Allowed' : 'Not allowed'}`}
          >
            <Icon
              className={cn(
                'w-4 h-4',
                item.allowed ? 'text-green-600' : 'text-gray-400'
              )}
            />
            <span
              className={cn(
                item.allowed ? 'text-gray-700' : 'text-gray-400 line-through'
              )}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
```

### Time Formatting Utilities

```typescript
// lib/format.ts (additions)
export function formatTime12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hours12 = hours % 12 || 12;

  if (minutes === 0) {
    return `${hours12} ${period}`;
  }
  return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

export function formatTimeRange(start: string, end: string): string {
  return `${formatTime12Hour(start)} - ${formatTime12Hour(end)}`;
}

// Format currency (simple version)
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
```

### House Rules Agreement Component

```tsx
// components/booking/HouseRulesAgreement.tsx
'use client';

import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { HouseRules } from '@/types/house-rules';
import { cn } from '@/lib/utils';

interface HouseRulesAgreementProps {
  rules: HouseRules;
  onAgreed: (agreed: boolean) => void;
  agreed: boolean;
}

export function HouseRulesAgreement({
  rules,
  onAgreed,
  agreed,
}: HouseRulesAgreementProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const keyRules = [
    `Check-in after ${formatTime12Hour(rules.checkIn.time)}, checkout before ${formatTime12Hour(rules.checkOut.time)}`,
    `Maximum ${rules.maxGuests} guests`,
    rules.allowPets.allowed ? 'Pets allowed' : 'No pets allowed',
    rules.allowSmoking.allowed ? 'Smoking allowed' : 'No smoking',
    rules.allowEvents.partyAllowed ? 'Events allowed' : 'No parties or events',
  ];

  const hasHazards = rules.safetyRules.some(
    (r) =>
      r.present &&
      ['weapon', 'dangerous_animal', 'pool_or_hot_tub', 'heights'].includes(r.type)
  );

  return (
    <div className="border rounded-lg p-4">
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <CollapsibleTrigger className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center',
                agreed
                  ? 'bg-green-600 text-white'
                  : 'border-2 border-gray-300'
              )}
            >
              {agreed && <Check className="w-4 h-4" />}
            </div>
            <span className="font-medium">House rules</span>
          </div>
          {isExpanded ? (
            <ChevronUp className="w-5 h-5" />
          ) : (
            <ChevronDown className="w-5 h-5" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="mt-4 ml-9 space-y-4">
            {/* Key rules summary */}
            <ul className="space-y-2">
              {keyRules.map((rule, index) => (
                <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                  {rule}
                </li>
              ))}
            </ul>

            {/* Hazards warning */}
            {hasHazards && (
              <Alert variant="warning" className="bg-amber-50 border-amber-200">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <AlertDescription className="text-amber-800">
                  This property has potential hazards. Review the safety information carefully.
                </AlertDescription>
              </Alert>
            )}

            {/* Additional rules */}
            {rules.additionalRules.length > 0 && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-2">Additional rules:</p>
                <ul className="space-y-1">
                  {rules.additionalRules.map((rule) => (
                    <li key={rule.id} className="text-sm text-gray-600">
                      • {rule.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Agreement checkbox */}
            <label className="flex items-start gap-3 pt-4 border-t cursor-pointer">
              <Checkbox
                checked={agreed}
                onCheckedChange={(checked) => onAgreed(checked as boolean)}
                id="house-rules-agreement"
              />
              <span className="text-sm">
                I agree to the host's house rules, including their cancellation policy.
              </span>
            </label>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
```

---

## 19. Cancellation Policy Display

### Cancellation Policy Types

```typescript
// types/cancellation.ts
export type CancellationPolicyType =
  | 'flexible'
  | 'moderate'
  | 'firm'
  | 'strict'
  | 'super_strict'
  | 'non_refundable'
  | 'custom';

export interface CancellationPolicy {
  type: CancellationPolicyType;
  name: string;
  description: string;
  milestones: CancellationMilestone[];
  gracePeriod?: GracePeriod;
  exceptions?: string[];
  nonRefundableFees?: NonRefundableFee[];
}

export interface CancellationMilestone {
  id: string;
  cutoffType: 'days_before_checkin' | 'hours_before_checkin' | 'after_booking';
  cutoffValue: number;
  refundPercentage: number;
  description: string;
  isCurrentPeriod?: boolean;
}

export interface GracePeriod {
  hours: number;
  description: string;
  conditions?: string[];
}

export interface NonRefundableFee {
  type: 'service_fee' | 'cleaning_fee' | 'processing_fee';
  label: string;
  amount?: number;
}

export interface RefundCalculation {
  policyType: CancellationPolicyType;
  checkIn: Date;
  checkOut: Date;
  totalPaid: number;
  refundAmount: number;
  refundPercentage: number;
  nonRefundableAmount: number;
  breakdown: RefundBreakdownItem[];
  currentMilestone: CancellationMilestone;
  nextMilestone?: CancellationMilestone;
  daysUntilNextMilestone?: number;
}

export interface RefundBreakdownItem {
  label: string;
  amount: number;
  isRefundable: boolean;
}
```

### Cancellation Policy Constants

```typescript
// constants/cancellation-policies.ts
import type { CancellationPolicy, CancellationPolicyType } from '@/types/cancellation';

export const CANCELLATION_POLICIES: Record<CancellationPolicyType, CancellationPolicy> = {
  flexible: {
    type: 'flexible',
    name: 'Flexible',
    description: 'Full refund up to 24 hours before check-in',
    milestones: [
      {
        id: 'full-refund',
        cutoffType: 'hours_before_checkin',
        cutoffValue: 24,
        refundPercentage: 100,
        description: 'Full refund',
      },
      {
        id: 'no-refund',
        cutoffType: 'hours_before_checkin',
        cutoffValue: 0,
        refundPercentage: 0,
        description: 'No refund',
      },
    ],
    gracePeriod: {
      hours: 48,
      description: 'Full refund within 48 hours of booking',
      conditions: ['Must be at least 14 days before check-in'],
    },
  },

  moderate: {
    type: 'moderate',
    name: 'Moderate',
    description: 'Full refund up to 5 days before check-in',
    milestones: [
      {
        id: 'full-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 5,
        refundPercentage: 100,
        description: 'Full refund',
      },
      {
        id: 'partial-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 0,
        refundPercentage: 50,
        description: '50% refund of nightly rate',
      },
    ],
    gracePeriod: {
      hours: 48,
      description: 'Full refund within 48 hours of booking',
      conditions: ['Must be at least 14 days before check-in'],
    },
  },

  firm: {
    type: 'firm',
    name: 'Firm',
    description: 'Full refund up to 30 days before check-in',
    milestones: [
      {
        id: 'full-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 30,
        refundPercentage: 100,
        description: 'Full refund',
      },
      {
        id: 'partial-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 7,
        refundPercentage: 50,
        description: '50% refund',
      },
      {
        id: 'no-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 0,
        refundPercentage: 0,
        description: 'No refund',
      },
    ],
  },

  strict: {
    type: 'strict',
    name: 'Strict',
    description: 'Full refund only within 48 hours of booking and 14+ days before',
    milestones: [
      {
        id: 'grace-period',
        cutoffType: 'after_booking',
        cutoffValue: 48,
        refundPercentage: 100,
        description: 'Full refund within 48h of booking (14+ days before)',
      },
      {
        id: 'partial-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 7,
        refundPercentage: 50,
        description: '50% refund up to 7 days before',
      },
      {
        id: 'no-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 0,
        refundPercentage: 0,
        description: 'No refund',
      },
    ],
  },

  super_strict: {
    type: 'super_strict',
    name: 'Super Strict',
    description: '50% refund up to 60 days before check-in',
    milestones: [
      {
        id: 'partial-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 60,
        refundPercentage: 50,
        description: '50% refund',
      },
      {
        id: 'no-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 0,
        refundPercentage: 0,
        description: 'No refund',
      },
    ],
  },

  non_refundable: {
    type: 'non_refundable',
    name: 'Non-refundable',
    description: 'No refund regardless of cancellation date',
    milestones: [
      {
        id: 'no-refund',
        cutoffType: 'days_before_checkin',
        cutoffValue: 0,
        refundPercentage: 0,
        description: 'No refund',
      },
    ],
    exceptions: ['Full refund in case of documented emergency or host cancellation'],
  },

  custom: {
    type: 'custom',
    name: 'Custom',
    description: 'Custom cancellation policy set by host',
    milestones: [],
  },
};
```

### Cancellation Policy Section

```tsx
// components/listing/CancellationPolicySection.tsx
'use client';

import { useState, useMemo } from 'react';
import { Calendar, Clock, AlertCircle, ChevronRight, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { CANCELLATION_POLICIES } from '@/constants/cancellation-policies';
import type { CancellationPolicyType, RefundCalculation } from '@/types/cancellation';
import { formatDate, differenceInDays } from 'date-fns';
import { cn } from '@/lib/utils';

interface CancellationPolicySectionProps {
  policyType: CancellationPolicyType;
  checkIn?: Date;
  checkOut?: Date;
  totalPaid?: number;
}

export function CancellationPolicySection({
  policyType,
  checkIn,
  checkOut,
  totalPaid,
}: CancellationPolicySectionProps) {
  const [showDetails, setShowDetails] = useState(false);

  const policy = CANCELLATION_POLICIES[policyType];

  // Calculate current refund if dates are provided
  const refundInfo = useMemo(() => {
    if (!checkIn || !totalPaid) return null;
    return calculateRefund(policyType, checkIn, checkOut!, totalPaid);
  }, [policyType, checkIn, checkOut, totalPaid]);

  return (
    <section className="py-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold mb-4">Cancellation policy</h2>

      {/* Policy summary */}
      <div className="flex items-start gap-4 mb-4">
        <div className="flex-1">
          <p className="font-medium text-lg">{policy.name}</p>
          <p className="text-gray-600">{policy.description}</p>
        </div>
        <PolicyBadge type={policyType} />
      </div>

      {/* Timeline visualization */}
      {checkIn && (
        <CancellationTimeline
          policy={policy}
          checkIn={checkIn}
          currentRefundPercentage={refundInfo?.refundPercentage}
        />
      )}

      {/* Grace period info */}
      {policy.gracePeriod && (
        <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg mt-4">
          <Clock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-green-800">
              {policy.gracePeriod.description}
            </p>
            {policy.gracePeriod.conditions && (
              <ul className="mt-1 text-sm text-green-700">
                {policy.gracePeriod.conditions.map((condition, i) => (
                  <li key={i}>• {condition}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {/* Current refund estimate */}
      {refundInfo && (
        <RefundEstimate refund={refundInfo} className="mt-4" />
      )}

      {/* Learn more button */}
      <Button
        variant="link"
        className="mt-4 px-0 font-semibold"
        onClick={() => setShowDetails(true)}
      >
        Learn more about this policy
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>

      <CancellationPolicyModal
        policy={policy}
        checkIn={checkIn}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </section>
  );
}

// Policy type badge
function PolicyBadge({ type }: { type: CancellationPolicyType }) {
  const colors: Record<CancellationPolicyType, string> = {
    flexible: 'bg-green-100 text-green-800',
    moderate: 'bg-blue-100 text-blue-800',
    firm: 'bg-yellow-100 text-yellow-800',
    strict: 'bg-orange-100 text-orange-800',
    super_strict: 'bg-red-100 text-red-800',
    non_refundable: 'bg-red-200 text-red-900',
    custom: 'bg-gray-100 text-gray-800',
  };

  const labels: Record<CancellationPolicyType, string> = {
    flexible: 'Flexible',
    moderate: 'Moderate',
    firm: 'Firm',
    strict: 'Strict',
    super_strict: 'Super Strict',
    non_refundable: 'Non-refundable',
    custom: 'Custom',
  };

  return (
    <span
      className={cn(
        'px-3 py-1 rounded-full text-sm font-medium',
        colors[type]
      )}
    >
      {labels[type]}
    </span>
  );
}
```

### Cancellation Timeline Visualization

```tsx
// components/listing/CancellationTimeline.tsx
import { useMemo } from 'react';
import { format, differenceInDays, subDays, addHours } from 'date-fns';
import type { CancellationPolicy, CancellationMilestone } from '@/types/cancellation';
import { cn } from '@/lib/utils';

interface CancellationTimelineProps {
  policy: CancellationPolicy;
  checkIn: Date;
  currentRefundPercentage?: number;
}

export function CancellationTimeline({
  policy,
  checkIn,
  currentRefundPercentage,
}: CancellationTimelineProps) {
  const today = new Date();
  const daysUntilCheckIn = differenceInDays(checkIn, today);

  // Build timeline points
  const timelinePoints = useMemo(() => {
    return policy.milestones
      .filter((m) => m.cutoffType !== 'after_booking')
      .map((milestone) => {
        let date: Date;
        if (milestone.cutoffType === 'days_before_checkin') {
          date = subDays(checkIn, milestone.cutoffValue);
        } else {
          date = addHours(checkIn, -milestone.cutoffValue);
        }

        const isPast = date < today;
        const isCurrent =
          currentRefundPercentage !== undefined &&
          milestone.refundPercentage === currentRefundPercentage;

        return {
          ...milestone,
          date,
          isPast,
          isCurrent,
          label: milestone.cutoffValue === 0
            ? 'Check-in'
            : milestone.cutoffType === 'days_before_checkin'
            ? `${milestone.cutoffValue} days before`
            : `${milestone.cutoffValue}h before`,
        };
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }, [policy.milestones, checkIn, today, currentRefundPercentage]);

  return (
    <div className="relative mt-6 mb-4">
      {/* Timeline bar */}
      <div className="absolute top-3 left-4 right-4 h-1 bg-gray-200 rounded-full">
        {/* Progress indicator */}
        <div
          className="absolute top-0 left-0 h-full bg-gray-400 rounded-full"
          style={{
            width: `${Math.max(0, Math.min(100, (1 - daysUntilCheckIn / 60) * 100))}%`,
          }}
        />
      </div>

      {/* Timeline points */}
      <div className="relative flex justify-between">
        {/* Today marker */}
        <TimelinePoint
          label="Today"
          date={format(today, 'MMM d')}
          refundPercentage={currentRefundPercentage}
          isCurrent={true}
          isPast={false}
        />

        {timelinePoints.map((point, index) => (
          <TimelinePoint
            key={point.id}
            label={point.label}
            date={format(point.date, 'MMM d')}
            refundPercentage={point.refundPercentage}
            isCurrent={point.isCurrent}
            isPast={point.isPast}
          />
        ))}
      </div>
    </div>
  );
}

interface TimelinePointProps {
  label: string;
  date: string;
  refundPercentage?: number;
  isCurrent?: boolean;
  isPast?: boolean;
}

function TimelinePoint({
  label,
  date,
  refundPercentage,
  isCurrent,
  isPast,
}: TimelinePointProps) {
  return (
    <div className="flex flex-col items-center">
      {/* Dot */}
      <div
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center z-10',
          isCurrent
            ? 'bg-black border-black'
            : isPast
            ? 'bg-gray-400 border-gray-400'
            : 'bg-white border-gray-300'
        )}
      >
        {isCurrent && <div className="w-2 h-2 bg-white rounded-full" />}
      </div>

      {/* Label */}
      <div className="mt-2 text-center">
        <p className={cn('text-xs font-medium', isPast && 'text-gray-400')}>
          {label}
        </p>
        <p className={cn('text-xs text-gray-500', isPast && 'text-gray-400')}>
          {date}
        </p>
        {refundPercentage !== undefined && (
          <p
            className={cn(
              'text-xs font-semibold mt-1',
              refundPercentage === 100
                ? 'text-green-600'
                : refundPercentage > 0
                ? 'text-yellow-600'
                : 'text-red-600'
            )}
          >
            {refundPercentage}% refund
          </p>
        )}
      </div>
    </div>
  );
}
```

### Refund Estimate Display

```tsx
// components/booking/RefundEstimate.tsx
import { AlertCircle, Check, X, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import type { RefundCalculation } from '@/types/cancellation';
import { formatCurrency } from '@/lib/currency';
import { cn } from '@/lib/utils';

interface RefundEstimateProps {
  refund: RefundCalculation;
  className?: string;
}

export function RefundEstimate({ refund, className }: RefundEstimateProps) {
  const isFullRefund = refund.refundPercentage === 100;
  const isNoRefund = refund.refundPercentage === 0;

  return (
    <div
      className={cn(
        'p-4 rounded-lg border',
        isFullRefund && 'bg-green-50 border-green-200',
        isNoRefund && 'bg-red-50 border-red-200',
        !isFullRefund && !isNoRefund && 'bg-yellow-50 border-yellow-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        {isFullRefund ? (
          <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
        ) : isNoRefund ? (
          <X className="w-5 h-5 text-red-600 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
        )}

        <div className="flex-1">
          <p className="font-semibold">
            {isFullRefund
              ? 'Free cancellation'
              : isNoRefund
              ? 'Non-refundable'
              : `${refund.refundPercentage}% refund if you cancel now`}
          </p>

          <p className="text-sm text-gray-600 mt-1">
            {isFullRefund ? (
              <>
                Cancel before{' '}
                {refund.nextMilestone &&
                  formatDate(
                    new Date(), // Would calculate actual date
                    'MMM d'
                  )}{' '}
                for a full refund
              </>
            ) : (
              <>
                You'll get{' '}
                <span className="font-semibold">
                  {formatCurrency(refund.refundAmount, 'USD')}
                </span>{' '}
                back
              </>
            )}
          </p>

          {/* Breakdown */}
          {!isFullRefund && (
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
              {refund.breakdown.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm"
                >
                  <span className={cn(!item.isRefundable && 'text-gray-500')}>
                    {item.label}
                    {!item.isRefundable && ' (non-refundable)'}
                  </span>
                  <span
                    className={cn(
                      'font-medium',
                      item.isRefundable ? 'text-green-600' : 'text-gray-500'
                    )}
                  >
                    {item.isRefundable ? '+' : ''}
                    {formatCurrency(item.amount, 'USD')}
                  </span>
                </div>
              ))}

              <div className="flex justify-between font-semibold pt-2 border-t">
                <span>Total refund</span>
                <span className="text-green-600">
                  {formatCurrency(refund.refundAmount, 'USD')}
                </span>
              </div>
            </div>
          )}

          {/* Next milestone warning */}
          {refund.nextMilestone && refund.daysUntilNextMilestone && (
            <div className="flex items-center gap-2 mt-3 text-sm text-amber-700">
              <ArrowRight className="w-4 h-4" />
              <span>
                Refund drops to {refund.nextMilestone.refundPercentage}% in{' '}
                {refund.daysUntilNextMilestone} days
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

### Cancellation Policy Modal

```tsx
// components/listing/CancellationPolicyModal.tsx
'use client';

import { format, subDays } from 'date-fns';
import { Calendar, Clock, Info, Shield } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { CancellationPolicy } from '@/types/cancellation';
import { cn } from '@/lib/utils';

interface CancellationPolicyModalProps {
  policy: CancellationPolicy;
  checkIn?: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CancellationPolicyModal({
  policy,
  checkIn,
  open,
  onOpenChange,
}: CancellationPolicyModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-semibold">
            Cancellation policy
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6" style={{ maxHeight: '70vh' }}>
          {/* Policy name and description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold">{policy.name}</h3>
            <p className="text-gray-600 mt-1">{policy.description}</p>
          </div>

          <Separator className="my-6" />

          {/* Refund schedule */}
          <h4 className="font-semibold mb-4">Refund schedule</h4>
          <div className="space-y-4">
            {policy.milestones.map((milestone, index) => {
              const isLast = index === policy.milestones.length - 1;
              const deadlineDate = checkIn
                ? milestone.cutoffType === 'days_before_checkin'
                  ? subDays(checkIn, milestone.cutoffValue)
                  : null
                : null;

              return (
                <div
                  key={milestone.id}
                  className="flex items-start gap-4"
                >
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        'w-3 h-3 rounded-full',
                        milestone.refundPercentage === 100
                          ? 'bg-green-500'
                          : milestone.refundPercentage > 0
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      )}
                    />
                    {!isLast && (
                      <div className="w-0.5 h-12 bg-gray-200 mt-1" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pb-4">
                    <div className="flex items-baseline justify-between">
                      <p className="font-medium">
                        {milestone.cutoffValue === 0
                          ? 'On check-in day'
                          : milestone.cutoffType === 'days_before_checkin'
                          ? `${milestone.cutoffValue}+ days before check-in`
                          : milestone.cutoffType === 'hours_before_checkin'
                          ? `${milestone.cutoffValue}+ hours before check-in`
                          : `Within ${milestone.cutoffValue}h of booking`}
                      </p>
                      <span
                        className={cn(
                          'font-semibold',
                          milestone.refundPercentage === 100
                            ? 'text-green-600'
                            : milestone.refundPercentage > 0
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        )}
                      >
                        {milestone.refundPercentage}%
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                      {milestone.description}
                    </p>

                    {deadlineDate && (
                      <p className="text-sm text-gray-500 mt-1">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        Before {format(deadlineDate, 'MMMM d, yyyy')}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Grace period */}
          {policy.gracePeriod && (
            <>
              <Separator className="my-6" />
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Grace period</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {policy.gracePeriod.description}
                  </p>
                  {policy.gracePeriod.conditions && (
                    <ul className="mt-2 text-sm text-gray-500">
                      {policy.gracePeriod.conditions.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Non-refundable fees */}
          {policy.nonRefundableFees && policy.nonRefundableFees.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Non-refundable fees</h4>
                  <p className="text-sm text-gray-600 mt-1">
                    The following fees are never refunded:
                  </p>
                  <ul className="mt-2 text-sm text-gray-600">
                    {policy.nonRefundableFees.map((fee, i) => (
                      <li key={i}>• {fee.label}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Exceptions */}
          {policy.exceptions && policy.exceptions.length > 0 && (
            <>
              <Separator className="my-6" />
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Exceptions</h4>
                  <ul className="mt-2 text-sm text-gray-600">
                    {policy.exceptions.map((exception, i) => (
                      <li key={i}>• {exception}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          )}

          {/* Platform guarantee */}
          <Separator className="my-6" />
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-blue-900">
                  Extenuating circumstances
                </h4>
                <p className="text-sm text-blue-800 mt-1">
                  If you need to cancel due to an emergency or documented
                  extenuating circumstance, you may be eligible for a full
                  refund regardless of this policy.
                </p>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
```

### Refund Calculator Utility

```typescript
// lib/refund-calculator.ts
import { differenceInDays, differenceInHours, isAfter } from 'date-fns';
import { CANCELLATION_POLICIES } from '@/constants/cancellation-policies';
import type {
  CancellationPolicyType,
  RefundCalculation,
  CancellationMilestone,
} from '@/types/cancellation';

export function calculateRefund(
  policyType: CancellationPolicyType,
  checkIn: Date,
  checkOut: Date,
  totalPaid: number,
  serviceFee: number = 0,
  cleaningFee: number = 0
): RefundCalculation {
  const policy = CANCELLATION_POLICIES[policyType];
  const now = new Date();

  // Find current milestone
  const currentMilestone = findCurrentMilestone(policy.milestones, checkIn, now);
  const nextMilestone = findNextMilestone(policy.milestones, checkIn, now);

  // Calculate refund
  const refundableAmount = totalPaid - serviceFee; // Service fee typically non-refundable
  const refundPercentage = currentMilestone?.refundPercentage ?? 0;
  const refundAmount = Math.round((refundableAmount * refundPercentage) / 100);

  // Build breakdown
  const breakdown = [
    {
      label: 'Accommodation',
      amount: Math.round((totalPaid - serviceFee - cleaningFee) * (refundPercentage / 100)),
      isRefundable: true,
    },
    {
      label: 'Cleaning fee',
      amount: cleaningFee,
      isRefundable: refundPercentage === 100,
    },
    {
      label: 'Service fee',
      amount: serviceFee,
      isRefundable: false,
    },
  ];

  // Calculate days until next milestone
  let daysUntilNextMilestone: number | undefined;
  if (nextMilestone && nextMilestone.cutoffType === 'days_before_checkin') {
    const nextDate = new Date(checkIn);
    nextDate.setDate(nextDate.getDate() - nextMilestone.cutoffValue);
    daysUntilNextMilestone = differenceInDays(nextDate, now);
  }

  return {
    policyType,
    checkIn,
    checkOut,
    totalPaid,
    refundAmount,
    refundPercentage,
    nonRefundableAmount: totalPaid - refundAmount,
    breakdown,
    currentMilestone: currentMilestone!,
    nextMilestone,
    daysUntilNextMilestone,
  };
}

function findCurrentMilestone(
  milestones: CancellationMilestone[],
  checkIn: Date,
  now: Date
): CancellationMilestone | undefined {
  const daysUntilCheckIn = differenceInDays(checkIn, now);
  const hoursUntilCheckIn = differenceInHours(checkIn, now);

  // Sort milestones by cutoff value (descending)
  const sorted = [...milestones]
    .filter((m) => m.cutoffType !== 'after_booking')
    .sort((a, b) => b.cutoffValue - a.cutoffValue);

  for (const milestone of sorted) {
    if (milestone.cutoffType === 'days_before_checkin') {
      if (daysUntilCheckIn >= milestone.cutoffValue) {
        return milestone;
      }
    } else if (milestone.cutoffType === 'hours_before_checkin') {
      if (hoursUntilCheckIn >= milestone.cutoffValue) {
        return milestone;
      }
    }
  }

  // Return last milestone (usually 0% refund)
  return sorted[sorted.length - 1];
}

function findNextMilestone(
  milestones: CancellationMilestone[],
  checkIn: Date,
  now: Date
): CancellationMilestone | undefined {
  const current = findCurrentMilestone(milestones, checkIn, now);
  if (!current) return undefined;

  const sorted = [...milestones]
    .filter((m) => m.cutoffType !== 'after_booking')
    .sort((a, b) => b.cutoffValue - a.cutoffValue);

  const currentIndex = sorted.findIndex((m) => m.id === current.id);
  return sorted[currentIndex + 1];
}
```

---

## 20. Booking Confirmation Flow

### Booking Flow Types

```typescript
// types/booking-flow.ts
export type BookingStep =
  | 'review'
  | 'guest_info'
  | 'payment'
  | 'confirmation';

export interface BookingState {
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  listing: ListingSummary;
  dates: {
    checkIn: string;
    checkOut: string;
    nights: number;
  };
  guests: GuestCount;
  pricing: PricingBreakdown;
  guestInfo?: GuestInfo;
  paymentMethod?: PaymentMethod;
  specialRequests?: string;
  agreedToRules: boolean;
  agreedToPolicy: boolean;
  bookingId?: string;
  confirmationCode?: string;
}

export interface GuestInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  purposeOfTrip?: 'leisure' | 'business' | 'other';
  specialRequests?: string;
  arrivalTime?: string;
}

export interface PaymentMethod {
  type: 'card' | 'paypal' | 'bank_transfer' | 'apple_pay' | 'google_pay';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  paymentIntentId?: string;
}

export interface ListingSummary {
  id: string;
  title: string;
  image: string;
  propertyType: string;
  location: string;
  host: {
    name: string;
    photo: string;
    isSuperhost: boolean;
  };
  rating: number;
  reviewCount: number;
}

export interface BookingConfirmation {
  bookingId: string;
  confirmationCode: string;
  status: 'confirmed' | 'pending' | 'requires_action';
  listing: ListingSummary;
  dates: { checkIn: string; checkOut: string };
  guests: GuestCount;
  totalPaid: number;
  paymentMethod: PaymentMethod;
  checkInInstructions?: string;
  hostContact?: { name: string; responseTime: string };
}
```

### Booking Flow Context

```typescript
// context/BookingContext.tsx
'use client';

import {
  createContext,
  useContext,
  useReducer,
  useCallback,
  type ReactNode,
} from 'react';
import type { BookingState, BookingStep, GuestInfo, PaymentMethod } from '@/types/booking-flow';

interface BookingContextValue {
  state: BookingState;
  goToStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateGuestInfo: (info: Partial<GuestInfo>) => void;
  updatePaymentMethod: (method: PaymentMethod) => void;
  setAgreedToRules: (agreed: boolean) => void;
  setAgreedToPolicy: (agreed: boolean) => void;
  setSpecialRequests: (requests: string) => void;
  completeBooking: () => Promise<void>;
  canProceed: boolean;
}

const BookingContext = createContext<BookingContextValue | null>(null);

const STEPS_ORDER: BookingStep[] = ['review', 'guest_info', 'payment', 'confirmation'];

type BookingAction =
  | { type: 'GO_TO_STEP'; step: BookingStep }
  | { type: 'COMPLETE_STEP'; step: BookingStep }
  | { type: 'UPDATE_GUEST_INFO'; info: Partial<GuestInfo> }
  | { type: 'UPDATE_PAYMENT'; method: PaymentMethod }
  | { type: 'SET_AGREED_RULES'; agreed: boolean }
  | { type: 'SET_AGREED_POLICY'; agreed: boolean }
  | { type: 'SET_SPECIAL_REQUESTS'; requests: string }
  | { type: 'SET_CONFIRMATION'; bookingId: string; confirmationCode: string };

function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'GO_TO_STEP':
      return { ...state, currentStep: action.step };

    case 'COMPLETE_STEP':
      return {
        ...state,
        completedSteps: [...new Set([...state.completedSteps, action.step])],
      };

    case 'UPDATE_GUEST_INFO':
      return {
        ...state,
        guestInfo: { ...state.guestInfo, ...action.info } as GuestInfo,
      };

    case 'UPDATE_PAYMENT':
      return { ...state, paymentMethod: action.method };

    case 'SET_AGREED_RULES':
      return { ...state, agreedToRules: action.agreed };

    case 'SET_AGREED_POLICY':
      return { ...state, agreedToPolicy: action.agreed };

    case 'SET_SPECIAL_REQUESTS':
      return { ...state, specialRequests: action.requests };

    case 'SET_CONFIRMATION':
      return {
        ...state,
        bookingId: action.bookingId,
        confirmationCode: action.confirmationCode,
        currentStep: 'confirmation',
      };

    default:
      return state;
  }
}

export function BookingProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState: BookingState;
}) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  const goToStep = useCallback((step: BookingStep) => {
    dispatch({ type: 'GO_TO_STEP', step });
  }, []);

  const nextStep = useCallback(() => {
    const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
    if (currentIndex < STEPS_ORDER.length - 1) {
      dispatch({ type: 'COMPLETE_STEP', step: state.currentStep });
      dispatch({ type: 'GO_TO_STEP', step: STEPS_ORDER[currentIndex + 1] });
    }
  }, [state.currentStep]);

  const prevStep = useCallback(() => {
    const currentIndex = STEPS_ORDER.indexOf(state.currentStep);
    if (currentIndex > 0) {
      dispatch({ type: 'GO_TO_STEP', step: STEPS_ORDER[currentIndex - 1] });
    }
  }, [state.currentStep]);

  const updateGuestInfo = useCallback((info: Partial<GuestInfo>) => {
    dispatch({ type: 'UPDATE_GUEST_INFO', info });
  }, []);

  const updatePaymentMethod = useCallback((method: PaymentMethod) => {
    dispatch({ type: 'UPDATE_PAYMENT', method });
  }, []);

  const setAgreedToRules = useCallback((agreed: boolean) => {
    dispatch({ type: 'SET_AGREED_RULES', agreed });
  }, []);

  const setAgreedToPolicy = useCallback((agreed: boolean) => {
    dispatch({ type: 'SET_AGREED_POLICY', agreed });
  }, []);

  const setSpecialRequests = useCallback((requests: string) => {
    dispatch({ type: 'SET_SPECIAL_REQUESTS', requests });
  }, []);

  const completeBooking = useCallback(async () => {
    // API call to complete booking
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        listingId: state.listing.id,
        checkIn: state.dates.checkIn,
        checkOut: state.dates.checkOut,
        guests: state.guests,
        guestInfo: state.guestInfo,
        paymentMethod: state.paymentMethod,
        specialRequests: state.specialRequests,
      }),
    });

    const result = await response.json();
    dispatch({
      type: 'SET_CONFIRMATION',
      bookingId: result.bookingId,
      confirmationCode: result.confirmationCode,
    });
  }, [state]);

  const canProceed = validateCurrentStep(state);

  return (
    <BookingContext.Provider
      value={{
        state,
        goToStep,
        nextStep,
        prevStep,
        updateGuestInfo,
        updatePaymentMethod,
        setAgreedToRules,
        setAgreedToPolicy,
        setSpecialRequests,
        completeBooking,
        canProceed,
      }}
    >
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within BookingProvider');
  }
  return context;
}

function validateCurrentStep(state: BookingState): boolean {
  switch (state.currentStep) {
    case 'review':
      return state.agreedToRules && state.agreedToPolicy;
    case 'guest_info':
      return !!(
        state.guestInfo?.firstName &&
        state.guestInfo?.lastName &&
        state.guestInfo?.email &&
        state.guestInfo?.phone
      );
    case 'payment':
      return !!state.paymentMethod;
    default:
      return true;
  }
}
```

### Step Indicator Component

```tsx
// components/booking/BookingStepIndicator.tsx
'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BookingStep } from '@/types/booking-flow';

interface BookingStepIndicatorProps {
  currentStep: BookingStep;
  completedSteps: BookingStep[];
  onStepClick?: (step: BookingStep) => void;
}

const STEPS: { id: BookingStep; label: string; shortLabel: string }[] = [
  { id: 'review', label: 'Review your trip', shortLabel: 'Review' },
  { id: 'guest_info', label: 'Guest information', shortLabel: 'Details' },
  { id: 'payment', label: 'Payment', shortLabel: 'Payment' },
  { id: 'confirmation', label: 'Confirmation', shortLabel: 'Done' },
];

export function BookingStepIndicator({
  currentStep,
  completedSteps,
  onStepClick,
}: BookingStepIndicatorProps) {
  const currentIndex = STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Booking progress" className="mb-8">
      {/* Desktop stepper */}
      <ol className="hidden md:flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = completedSteps.includes(step.id);
          const isCurrent = step.id === currentStep;
          const isClickable = isCompleted || index <= currentIndex;

          return (
            <li
              key={step.id}
              className={cn('flex items-center', index < STEPS.length - 1 && 'flex-1')}
            >
              <button
                onClick={() => isClickable && onStepClick?.(step.id)}
                disabled={!isClickable}
                className={cn(
                  'flex items-center gap-2 group',
                  isClickable && 'cursor-pointer'
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {/* Step number/check */}
                <span
                  className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors',
                    isCompleted
                      ? 'bg-green-600 text-white'
                      : isCurrent
                      ? 'bg-black text-white'
                      : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </span>

                {/* Step label */}
                <span
                  className={cn(
                    'text-sm font-medium transition-colors',
                    isCurrent
                      ? 'text-black'
                      : isCompleted
                      ? 'text-green-600'
                      : 'text-gray-500'
                  )}
                >
                  {step.label}
                </span>
              </button>

              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    'flex-1 h-0.5 mx-4',
                    index < currentIndex ? 'bg-green-600' : 'bg-gray-200'
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Mobile stepper */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-500">
            Step {currentIndex + 1} of {STEPS.length}
          </span>
          <span className="text-sm font-medium">
            {STEPS[currentIndex].label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>

        {/* Step dots */}
        <div className="flex justify-between mt-2">
          {STEPS.map((step, index) => (
            <button
              key={step.id}
              onClick={() => {
                const isClickable = completedSteps.includes(step.id) || index <= currentIndex;
                if (isClickable) onStepClick?.(step.id);
              }}
              className={cn(
                'w-2 h-2 rounded-full transition-colors',
                index <= currentIndex ? 'bg-black' : 'bg-gray-300'
              )}
              aria-label={step.shortLabel}
            />
          ))}
        </div>
      </div>
    </nav>
  );
}
```

### Booking Flow Container

```tsx
// components/booking/BookingFlowContainer.tsx
'use client';

import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookingStepIndicator } from './BookingStepIndicator';
import { BookingReviewStep } from './steps/BookingReviewStep';
import { GuestInfoStep } from './steps/GuestInfoStep';
import { PaymentStep } from './steps/PaymentStep';
import { ConfirmationStep } from './steps/ConfirmationStep';
import { BookingSummaryCard } from './BookingSummaryCard';
import { useBooking } from '@/context/BookingContext';
import { cn } from '@/lib/utils';

export function BookingFlowContainer() {
  const { state, goToStep, nextStep, prevStep, canProceed, completeBooking } = useBooking();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleContinue = async () => {
    if (state.currentStep === 'payment') {
      setIsSubmitting(true);
      try {
        await completeBooking();
      } finally {
        setIsSubmitting(false);
      }
    } else {
      nextStep();
    }
  };

  const renderStep = () => {
    switch (state.currentStep) {
      case 'review':
        return <BookingReviewStep />;
      case 'guest_info':
        return <GuestInfoStep />;
      case 'payment':
        return <PaymentStep />;
      case 'confirmation':
        return <ConfirmationStep />;
    }
  };

  const isConfirmation = state.currentStep === 'confirmation';

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      {!isConfirmation && (
        <header className="sticky top-0 z-50 bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={prevStep}
              disabled={state.currentStep === 'review'}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-semibold">
              {state.currentStep === 'review' && 'Review your trip'}
              {state.currentStep === 'guest_info' && 'Your details'}
              {state.currentStep === 'payment' && 'Payment'}
            </h1>
          </div>
        </header>
      )}

      <main className={cn('max-w-6xl mx-auto px-4 py-8', isConfirmation && 'pt-16')}>
        {/* Step indicator */}
        {!isConfirmation && (
          <BookingStepIndicator
            currentStep={state.currentStep}
            completedSteps={state.completedSteps}
            onStepClick={goToStep}
          />
        )}

        {/* Main content */}
        <div className={cn('grid gap-8', !isConfirmation && 'lg:grid-cols-[1fr,400px]')}>
          {/* Step content */}
          <div className={cn(isConfirmation && 'max-w-2xl mx-auto')}>
            {renderStep()}

            {/* Navigation buttons */}
            {!isConfirmation && (
              <div className="mt-8 flex justify-between items-center pt-6 border-t">
                {state.currentStep !== 'review' && (
                  <Button variant="ghost" onClick={prevStep}>
                    Back
                  </Button>
                )}
                <Button
                  className="ml-auto"
                  size="lg"
                  disabled={!canProceed || isSubmitting}
                  onClick={handleContinue}
                >
                  {isSubmitting
                    ? 'Processing...'
                    : state.currentStep === 'payment'
                    ? 'Confirm and pay'
                    : 'Continue'}
                </Button>
              </div>
            )}
          </div>

          {/* Booking summary sidebar */}
          {!isConfirmation && (
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <BookingSummaryCard
                  listing={state.listing}
                  dates={state.dates}
                  guests={state.guests}
                  pricing={state.pricing}
                />
              </div>
            </aside>
          )}
        </div>
      </main>
    </div>
  );
}
```

### Booking Summary Card

```tsx
// components/booking/BookingSummaryCard.tsx
import Image from 'next/image';
import { Star, Calendar, Users } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/currency';
import { format } from 'date-fns';
import type { ListingSummary, PricingBreakdown } from '@/types/booking-flow';

interface BookingSummaryCardProps {
  listing: ListingSummary;
  dates: { checkIn: string; checkOut: string; nights: number };
  guests: { adults: number; children: number; infants: number };
  pricing: PricingBreakdown;
}

export function BookingSummaryCard({
  listing,
  dates,
  guests,
  pricing,
}: BookingSummaryCardProps) {
  const totalGuests = guests.adults + guests.children;

  return (
    <div className="border rounded-xl p-6 shadow-lg">
      {/* Listing preview */}
      <div className="flex gap-4 mb-6">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
          <Image
            src={listing.image}
            alt={listing.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-gray-500">{listing.propertyType}</p>
          <h3 className="font-medium truncate">{listing.title}</h3>
          <div className="flex items-center gap-1 mt-1 text-sm">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-medium">{listing.rating}</span>
            <span className="text-gray-500">
              ({listing.reviewCount} reviews)
            </span>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Trip details */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold">Your trip</h4>

        <div className="flex items-start gap-3">
          <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Dates</p>
            <p className="text-sm text-gray-600">
              {format(new Date(dates.checkIn), 'MMM d')} -{' '}
              {format(new Date(dates.checkOut), 'MMM d, yyyy')}
            </p>
            <p className="text-sm text-gray-500">{dates.nights} nights</p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <Users className="w-5 h-5 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium">Guests</p>
            <p className="text-sm text-gray-600">
              {totalGuests} {totalGuests === 1 ? 'guest' : 'guests'}
              {guests.infants > 0 && `, ${guests.infants} infant${guests.infants > 1 ? 's' : ''}`}
            </p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Price details */}
      <div className="space-y-3">
        <h4 className="font-semibold">Price details</h4>

        <div className="flex justify-between text-sm">
          <span>
            {formatCurrency(pricing.nightlyRate, pricing.currency)} x {dates.nights} nights
          </span>
          <span>{formatCurrency(pricing.subtotal, pricing.currency)}</span>
        </div>

        {pricing.fees.map((fee, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{fee.label}</span>
            <span>{formatCurrency(fee.amount, pricing.currency)}</span>
          </div>
        ))}

        {pricing.taxes.map((tax, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>{tax.label}</span>
            <span>{formatCurrency(tax.amount, pricing.currency)}</span>
          </div>
        ))}

        <Separator />

        <div className="flex justify-between font-semibold">
          <span>Total ({pricing.currency})</span>
          <span>{formatCurrency(pricing.total, pricing.currency)}</span>
        </div>
      </div>
    </div>
  );
}
```

### Confirmation Step

```tsx
// components/booking/steps/ConfirmationStep.tsx
'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Check, Calendar, MapPin, MessageCircle, Download, Share } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useBooking } from '@/context/BookingContext';
import { format } from 'date-fns';
import confetti from 'canvas-confetti';
import { useEffect } from 'react';

export function ConfirmationStep() {
  const { state } = useBooking();

  // Celebration animation on mount
  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="text-center">
      {/* Success icon */}
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="w-10 h-10 text-green-600" />
      </div>

      {/* Confirmation message */}
      <h1 className="text-3xl font-bold mb-2">Booking confirmed!</h1>
      <p className="text-gray-600 mb-2">
        Your reservation has been confirmed. We've sent a confirmation email to{' '}
        <span className="font-medium">{state.guestInfo?.email}</span>
      </p>

      <p className="text-lg font-medium text-gray-900 mb-8">
        Confirmation code:{' '}
        <span className="font-mono bg-gray-100 px-3 py-1 rounded">
          {state.confirmationCode}
        </span>
      </p>

      {/* Listing card */}
      <div className="bg-white border rounded-xl p-6 text-left mb-8">
        <div className="flex gap-4 mb-4">
          <div className="relative w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <Image
              src={state.listing.image}
              alt={state.listing.title}
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h3 className="font-semibold">{state.listing.title}</h3>
            <p className="text-sm text-gray-500">{state.listing.location}</p>
            <p className="text-sm text-gray-500">
              Hosted by {state.listing.host.name}
            </p>
          </div>
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Check-in</p>
              <p className="font-medium">
                {format(new Date(state.dates.checkIn), 'EEE, MMM d, yyyy')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Checkout</p>
              <p className="font-medium">
                {format(new Date(state.dates.checkOut), 'EEE, MMM d, yyyy')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <Button variant="outline" className="gap-2">
          <Download className="w-4 h-4" />
          Download receipt
        </Button>
        <Button variant="outline" className="gap-2">
          <Share className="w-4 h-4" />
          Share itinerary
        </Button>
        <Button className="gap-2" asChild>
          <Link href={`/trips/${state.bookingId}`}>
            View trip details
          </Link>
        </Button>
      </div>

      {/* Next steps */}
      <div className="bg-gray-50 rounded-xl p-6 text-left">
        <h3 className="font-semibold mb-4">What's next?</h3>
        <ul className="space-y-4">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
              1
            </div>
            <div>
              <p className="font-medium">Message your host</p>
              <p className="text-sm text-gray-600">
                Introduce yourself and let them know about your arrival time.
              </p>
              <Button variant="link" className="px-0 h-auto text-sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                Send a message
              </Button>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
              2
            </div>
            <div>
              <p className="font-medium">Get directions</p>
              <p className="text-sm text-gray-600">
                Check-in instructions will be available 24 hours before arrival.
              </p>
              <Button variant="link" className="px-0 h-auto text-sm">
                <MapPin className="w-4 h-4 mr-1" />
                View on map
              </Button>
            </div>
          </li>

          <li className="flex items-start gap-3">
            <div className="w-6 h-6 bg-black text-white rounded-full flex items-center justify-center text-sm flex-shrink-0">
              3
            </div>
            <div>
              <p className="font-medium">Pack your bags</p>
              <p className="text-sm text-gray-600">
                You're all set for your trip. Have a great stay!
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}
```

### Mobile Booking Bar

```tsx
// components/booking/MobileBookingBar.tsx
'use client';

import { ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { BookingSummaryCard } from './BookingSummaryCard';
import { useBooking } from '@/context/BookingContext';
import { formatCurrency } from '@/lib/currency';

export function MobileBookingBar() {
  const { state, canProceed } = useBooking();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 lg:hidden z-50">
      <div className="flex items-center justify-between">
        <Sheet>
          <SheetTrigger asChild>
            <button className="text-left">
              <p className="font-semibold">
                {formatCurrency(state.pricing.total, state.pricing.currency)}
              </p>
              <p className="text-sm text-gray-500 underline flex items-center gap-1">
                View details
                <ChevronUp className="w-4 h-4" />
              </p>
            </button>
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh]">
            <SheetHeader>
              <SheetTitle>Price details</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              <BookingSummaryCard
                listing={state.listing}
                dates={state.dates}
                guests={state.guests}
                pricing={state.pricing}
              />
            </div>
          </SheetContent>
        </Sheet>

        <Button disabled={!canProceed}>
          {state.currentStep === 'payment' ? 'Confirm and pay' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}
```

---

## 21. Location Map Section

### Location Data Types

```typescript
// types/location.ts
export interface ListingLocation {
  coordinates: {
    lat: number;
    lng: number;
  };
  address: {
    street?: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
  };
  neighborhood?: string;
  description?: string;
  isExactLocation: boolean; // False = approximate circle shown
  transitInfo?: TransitInfo[];
  nearbyPlaces?: NearbyPlace[];
  walkScore?: number;
  transitScore?: number;
  bikeScore?: number;
}

export interface NearbyPlace {
  id: string;
  name: string;
  category: PlaceCategory;
  distance: number; // meters
  walkingTime: number; // minutes
  rating?: number;
  icon: string;
  coordinates: { lat: number; lng: number };
}

export type PlaceCategory =
  | 'restaurant'
  | 'cafe'
  | 'grocery'
  | 'transit'
  | 'attraction'
  | 'park'
  | 'shopping'
  | 'nightlife'
  | 'beach'
  | 'airport';

export interface TransitInfo {
  type: 'subway' | 'bus' | 'train' | 'tram' | 'ferry';
  name: string;
  distance: number;
  walkingTime: number;
  lines?: string[];
}
```

### Location Map Section Component

```tsx
// components/listing/LocationSection.tsx
'use client';

import { useState } from 'react';
import { MapPin, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { InteractiveMap } from './InteractiveMap';
import { NearbyPlacesList } from './NearbyPlacesList';
import { LocationModal } from './LocationModal';
import type { ListingLocation, TransitInfo } from '@/types/location';
import { cn } from '@/lib/utils';

interface LocationSectionProps {
  location: ListingLocation;
  listingTitle: string;
}

export function LocationSection({ location, listingTitle }: LocationSectionProps) {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const displayAddress = location.isExactLocation
    ? `${location.address.city}, ${location.address.state}, ${location.address.country}`
    : `${location.neighborhood || location.address.city}, ${location.address.country}`;

  return (
    <section className="py-8 border-b border-gray-200">
      <h2 className="text-2xl font-semibold mb-2">Where you'll be</h2>
      <p className="text-gray-600 mb-6">{displayAddress}</p>

      {/* Map preview */}
      <div className="relative rounded-xl overflow-hidden mb-6">
        <InteractiveMap
          center={location.coordinates}
          isExactLocation={location.isExactLocation}
          nearbyPlaces={location.nearbyPlaces}
          selectedCategory={selectedCategory}
          height={400}
          interactive={false}
          onClick={() => setShowModal(true)}
        />
      </div>

      {/* Scores */}
      {(location.walkScore || location.transitScore || location.bikeScore) && (
        <div className="flex flex-wrap gap-4 mb-6">
          {location.walkScore && (
            <ScoreBadge label="Walk Score" score={location.walkScore} icon="🚶" />
          )}
          {location.transitScore && (
            <ScoreBadge label="Transit Score" score={location.transitScore} icon="🚇" />
          )}
          {location.bikeScore && (
            <ScoreBadge label="Bike Score" score={location.bikeScore} icon="🚲" />
          )}
        </div>
      )}

      {/* Neighborhood description */}
      {location.description && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">
            {location.neighborhood || 'About the area'}
          </h3>
          <p className="text-gray-700">{location.description}</p>
        </div>
      )}

      {/* Transit info */}
      {location.transitInfo && location.transitInfo.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-3">Getting around</h3>
          <div className="space-y-2">
            {location.transitInfo.slice(0, 3).map((transit, index) => (
              <TransitItem key={index} transit={transit} />
            ))}
          </div>
        </div>
      )}

      {/* Nearby places preview */}
      {location.nearbyPlaces && location.nearbyPlaces.length > 0 && (
        <NearbyPlacesList
          places={location.nearbyPlaces}
          maxVisible={6}
          onCategorySelect={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      )}

      {/* Show more button */}
      <Button
        variant="link"
        className="px-0 font-semibold mt-4"
        onClick={() => setShowModal(true)}
      >
        Show more about the location
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>

      {/* Full map modal */}
      <LocationModal
        location={location}
        listingTitle={listingTitle}
        open={showModal}
        onOpenChange={setShowModal}
      />
    </section>
  );
}

function ScoreBadge({ label, score, icon }: { label: string; score: number; icon: string }) {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-blue-100 text-blue-800';
    if (score >= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className={cn('px-4 py-2 rounded-lg', getScoreColor(score))}>
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="font-bold text-lg">{score}</span>
            <span className="text-sm">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function TransitItem({ transit }: { transit: TransitInfo }) {
  const icons: Record<string, string> = {
    subway: '🚇', bus: '🚌', train: '🚆', tram: '🚊', ferry: '⛴️',
  };

  return (
    <div className="flex items-center justify-between py-2">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icons[transit.type]}</span>
        <div>
          <p className="font-medium">{transit.name}</p>
          {transit.lines && (
            <div className="flex gap-1 mt-1">
              {transit.lines.slice(0, 3).map((line) => (
                <Badge key={line} variant="secondary" className="text-xs">{line}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="text-right text-sm text-gray-500">
        <p>{transit.walkingTime} min walk</p>
      </div>
    </div>
  );
}
```

### Interactive Map Component

```tsx
// components/listing/InteractiveMap.tsx
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { ZoomIn, ZoomOut, Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NearbyPlace, PlaceCategory } from '@/types/location';

interface InteractiveMapProps {
  center: { lat: number; lng: number };
  isExactLocation: boolean;
  nearbyPlaces?: NearbyPlace[];
  selectedCategory?: string | null;
  height?: number;
  interactive?: boolean;
  onClick?: () => void;
  onMarkerClick?: (place: NearbyPlace) => void;
}

export function InteractiveMap({
  center,
  isExactLocation,
  nearbyPlaces = [],
  selectedCategory,
  height = 400,
  interactive = true,
  onClick,
  onMarkerClick,
}: InteractiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const circleRef = useRef<google.maps.Circle | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
      version: 'weekly',
      libraries: ['places'],
    });

    loader.load().then(() => {
      if (!mapRef.current) return;

      mapInstance.current = new google.maps.Map(mapRef.current, {
        center,
        zoom: 15,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        mapTypeControl: false,
        streetViewControl: interactive,
        fullscreenControl: interactive,
        gestureHandling: interactive ? 'auto' : 'none',
        styles: mapStyles,
      });

      if (isExactLocation) {
        new google.maps.Marker({
          position: center,
          map: mapInstance.current,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 12,
            fillColor: '#FF385C',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });
      } else {
        circleRef.current = new google.maps.Circle({
          center,
          radius: 500,
          map: mapInstance.current,
          fillColor: '#FF385C',
          fillOpacity: 0.1,
          strokeColor: '#FF385C',
          strokeWeight: 2,
        });
      }

      setIsLoaded(true);
    });

    return () => {
      markersRef.current.forEach((marker) => marker.setMap(null));
      circleRef.current?.setMap(null);
    };
  }, [center, isExactLocation, interactive]);

  useEffect(() => {
    if (!mapInstance.current || !isLoaded) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    const placesToShow = selectedCategory
      ? nearbyPlaces.filter((p) => p.category === selectedCategory)
      : nearbyPlaces;

    placesToShow.forEach((place) => {
      const marker = new google.maps.Marker({
        position: place.coordinates,
        map: mapInstance.current!,
        icon: { url: getCategoryIcon(place.category), scaledSize: new google.maps.Size(32, 32) },
        title: place.name,
      });

      if (onMarkerClick) {
        marker.addListener('click', () => onMarkerClick(place));
      }

      markersRef.current.push(marker);
    });
  }, [nearbyPlaces, selectedCategory, isLoaded, onMarkerClick]);

  const handleZoomIn = useCallback(() => {
    if (mapInstance.current) {
      mapInstance.current.setZoom((mapInstance.current.getZoom() || 15) + 1);
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapInstance.current) {
      mapInstance.current.setZoom((mapInstance.current.getZoom() || 15) - 1);
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (mapInstance.current) {
      mapInstance.current.panTo(center);
      mapInstance.current.setZoom(15);
    }
  }, [center]);

  return (
    <div className="relative" style={{ height }}>
      <div ref={mapRef} className="w-full h-full rounded-xl" onClick={onClick} />

      {interactive && isLoaded && (
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button variant="secondary" size="icon" className="bg-white shadow-md" onClick={handleZoomIn}>
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white shadow-md" onClick={handleZoomOut}>
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button variant="secondary" size="icon" className="bg-white shadow-md" onClick={handleLocate}>
            <Locate className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!isExactLocation && (
        <div className="absolute bottom-4 left-4 bg-white px-3 py-2 rounded-lg shadow-md text-sm">
          <p className="text-gray-600">Exact location provided after booking</p>
        </div>
      )}
    </div>
  );
}

const mapStyles: google.maps.MapTypeStyle[] = [
  { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
  { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'simplified' }] },
];

function getCategoryIcon(category: PlaceCategory): string {
  const icons: Record<PlaceCategory, string> = {
    restaurant: '/icons/map/restaurant.png',
    cafe: '/icons/map/cafe.png',
    grocery: '/icons/map/grocery.png',
    transit: '/icons/map/transit.png',
    attraction: '/icons/map/attraction.png',
    park: '/icons/map/park.png',
    shopping: '/icons/map/shopping.png',
    nightlife: '/icons/map/nightlife.png',
    beach: '/icons/map/beach.png',
    airport: '/icons/map/airport.png',
  };
  return icons[category] || '/icons/map/default.png';
}
```

### Nearby Places List

```tsx
// components/listing/NearbyPlacesList.tsx
'use client';

import { useState } from 'react';
import {
  UtensilsCrossed, Coffee, ShoppingBag, Bus, Landmark,
  Trees, Store, Music, Palmtree, Plane,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import type { NearbyPlace, PlaceCategory } from '@/types/location';
import { cn } from '@/lib/utils';

interface NearbyPlacesListProps {
  places: NearbyPlace[];
  maxVisible?: number;
  selectedCategory: string | null;
  onCategorySelect: (category: string | null) => void;
}

const CATEGORY_CONFIG: Record<PlaceCategory, { label: string; icon: typeof Coffee }> = {
  restaurant: { label: 'Restaurants', icon: UtensilsCrossed },
  cafe: { label: 'Cafes', icon: Coffee },
  grocery: { label: 'Grocery', icon: Store },
  transit: { label: 'Transit', icon: Bus },
  attraction: { label: 'Attractions', icon: Landmark },
  park: { label: 'Parks', icon: Trees },
  shopping: { label: 'Shopping', icon: ShoppingBag },
  nightlife: { label: 'Nightlife', icon: Music },
  beach: { label: 'Beach', icon: Palmtree },
  airport: { label: 'Airport', icon: Plane },
};

export function NearbyPlacesList({
  places,
  maxVisible = 6,
  selectedCategory,
  onCategorySelect,
}: NearbyPlacesListProps) {
  const [showAll, setShowAll] = useState(false);
  const categories = [...new Set(places.map((p) => p.category))];

  const filteredPlaces = selectedCategory
    ? places.filter((p) => p.category === selectedCategory)
    : places;

  const visiblePlaces = showAll ? filteredPlaces : filteredPlaces.slice(0, maxVisible);

  return (
    <div>
      <h3 className="font-semibold mb-3">What's nearby</h3>

      <ScrollArea className="w-full whitespace-nowrap mb-4">
        <div className="flex gap-2 pb-2">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => onCategorySelect(null)}
          >
            All
          </Button>
          {categories.map((category) => {
            const config = CATEGORY_CONFIG[category];
            const Icon = config.icon;
            return (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                size="sm"
                className="gap-1.5"
                onClick={() => onCategorySelect(category)}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </Button>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {visiblePlaces.map((place) => (
          <PlaceCard key={place.id} place={place} />
        ))}
      </div>

      {filteredPlaces.length > maxVisible && !showAll && (
        <Button variant="link" className="px-0 mt-4" onClick={() => setShowAll(true)}>
          Show all {filteredPlaces.length} places
        </Button>
      )}
    </div>
  );
}

function PlaceCard({ place }: { place: NearbyPlace }) {
  const config = CATEGORY_CONFIG[place.category];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{place.name}</p>
        <p className="text-sm text-gray-500">
          {place.walkingTime} min walk · {place.distance < 1000 ? `${place.distance}m` : `${(place.distance / 1000).toFixed(1)}km`}
        </p>
        {place.rating && (
          <div className="flex items-center gap-1 text-sm text-gray-600 mt-0.5">
            <span>⭐</span>
            <span>{place.rating.toFixed(1)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### Location Modal

```tsx
// components/listing/LocationModal.tsx
'use client';

import { useState } from 'react';
import { X, Navigation, Copy, Check } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InteractiveMap } from './InteractiveMap';
import { NearbyPlacesList } from './NearbyPlacesList';
import type { ListingLocation, NearbyPlace } from '@/types/location';
import { cn } from '@/lib/utils';

interface LocationModalProps {
  location: ListingLocation;
  listingTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LocationModal({ location, listingTitle, open, onOpenChange }: LocationModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleGetDirections = () => {
    const { lat, lng } = location.coordinates;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  const handleCopyAddress = async () => {
    const address = `${location.address.city}, ${location.address.state}, ${location.address.country}`;
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full">
          <div className="flex-1 relative min-h-[300px] lg:min-h-[600px]">
            <InteractiveMap
              center={location.coordinates}
              isExactLocation={location.isExactLocation}
              nearbyPlaces={location.nearbyPlaces}
              selectedCategory={selectedCategory}
              height={600}
              interactive={true}
            />
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-4 left-4 bg-white shadow-md z-10"
              onClick={() => onOpenChange(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="w-full lg:w-96 bg-white flex flex-col max-h-[50vh] lg:max-h-full overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-1">
                {location.neighborhood || location.address.city}
              </h2>
              <p className="text-gray-600 text-sm">
                {location.address.city}, {location.address.state}, {location.address.country}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1" onClick={handleGetDirections}>
                  <Navigation className="w-4 h-4 mr-1" />
                  Directions
                </Button>
                <Button variant="outline" size="sm" onClick={handleCopyAddress}>
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            <Tabs defaultValue="nearby" className="flex-1 overflow-hidden">
              <TabsList className="w-full justify-start px-6 pt-4">
                <TabsTrigger value="nearby">Nearby</TabsTrigger>
                <TabsTrigger value="transit">Transit</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto px-6 pb-6">
                <TabsContent value="nearby" className="mt-4">
                  {location.nearbyPlaces && (
                    <NearbyPlacesList
                      places={location.nearbyPlaces}
                      maxVisible={20}
                      selectedCategory={selectedCategory}
                      onCategorySelect={setSelectedCategory}
                    />
                  )}
                </TabsContent>

                <TabsContent value="transit" className="mt-4">
                  {location.transitInfo?.length ? (
                    <div className="space-y-4">
                      {location.transitInfo.map((transit, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium">{transit.name}</p>
                            <span className="text-sm text-gray-500">{transit.walkingTime} min</span>
                          </div>
                          {transit.lines && (
                            <div className="flex flex-wrap gap-1">
                              {transit.lines.map((line) => (
                                <span key={line} className="px-2 py-0.5 bg-gray-200 rounded text-xs">{line}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No transit information available</p>
                  )}
                </TabsContent>

                <TabsContent value="about" className="mt-4">
                  {location.description && <p className="text-gray-700 mb-4">{location.description}</p>}
                  <div className="space-y-3">
                    {location.walkScore && <ScoreRow label="Walk Score" score={location.walkScore} icon="🚶" />}
                    {location.transitScore && <ScoreRow label="Transit Score" score={location.transitScore} icon="🚇" />}
                    {location.bikeScore && <ScoreRow label="Bike Score" score={location.bikeScore} icon="🚲" />}
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ScoreRow({ label, score, icon }: { label: string; score: number; icon: string }) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full',
              score >= 70 ? 'bg-green-500' : score >= 50 ? 'bg-yellow-500' : 'bg-red-500'
            )}
            style={{ width: `${score}%` }}
          />
        </div>
        <span className="font-bold w-8 text-right">{score}</span>
      </div>
    </div>
  );
}
```

---

## 22. Instant Book Toggle & Availability Check

### Availability Types

```typescript
// types/availability.ts
export interface AvailabilityStatus {
  isAvailable: boolean;
  checkIn: string;
  checkOut: string;
  nights: number;
  instantBook: boolean;
  requiresApproval: boolean;
  minStay: number;
  maxStay: number;
  blockedReasons?: BlockedReason[];
  nextAvailableDate?: string;
  alternativeDates?: AlternativeDateRange[];
}

export interface BlockedReason {
  type: 'booked' | 'blocked_by_host' | 'min_stay' | 'max_stay' | 'check_in_day' | 'advance_notice';
  message: string;
  dates?: string[];
}

export interface AlternativeDateRange {
  checkIn: string;
  checkOut: string;
  nights: number;
  priceDifference?: number;
}

export interface InstantBookSettings {
  enabled: boolean;
  requireVerifiedId: boolean;
  requirePositiveReviews: boolean;
  minReviewCount?: number;
  requireProfilePhoto: boolean;
  allowFirstTimeGuests: boolean;
  messageRequired: boolean;
  autoAcceptRequirements: string[];
}

export interface BookingRequest {
  type: 'instant' | 'request';
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: GuestCount;
  message?: string;
  guestInfo: GuestInfo;
}
```

### Instant Book Badge Component

```tsx
// components/listing/InstantBookBadge.tsx
import { Zap, Clock, CheckCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface InstantBookBadgeProps {
  enabled: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  variant?: 'default' | 'outline' | 'subtle';
}

export function InstantBookBadge({
  enabled,
  size = 'md',
  showLabel = true,
  variant = 'default',
}: InstantBookBadgeProps) {
  if (!enabled) return null;

  const sizeClasses = {
    sm: { icon: 'w-3 h-3', text: 'text-xs', padding: 'px-1.5 py-0.5' },
    md: { icon: 'w-4 h-4', text: 'text-sm', padding: 'px-2 py-1' },
    lg: { icon: 'w-5 h-5', text: 'text-base', padding: 'px-3 py-1.5' },
  };

  const variantClasses = {
    default: 'bg-yellow-100 text-yellow-800',
    outline: 'border border-yellow-400 text-yellow-700 bg-transparent',
    subtle: 'bg-yellow-50 text-yellow-700',
  };

  const classes = sizeClasses[size];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full font-medium',
            classes.padding,
            classes.text,
            variantClasses[variant]
          )}
        >
          <Zap className={cn(classes.icon, 'fill-current')} />
          {showLabel && <span>Instant Book</span>}
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Book instantly without waiting for host approval</p>
      </TooltipContent>
    </Tooltip>
  );
}
```

### Availability Checker Hook

```typescript
// hooks/useAvailabilityCheck.ts
import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { differenceInDays } from 'date-fns';
import type { AvailabilityStatus, BookingRequest } from '@/types/availability';

interface UseAvailabilityCheckOptions {
  listingId: string;
  checkIn: Date | null;
  checkOut: Date | null;
  guests: { adults: number; children: number; infants: number; pets: number };
}

export function useAvailabilityCheck({
  listingId,
  checkIn,
  checkOut,
  guests,
}: UseAvailabilityCheckOptions) {
  const nights = checkIn && checkOut ? differenceInDays(checkOut, checkIn) : 0;

  const {
    data: availability,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['availability', listingId, checkIn?.toISOString(), checkOut?.toISOString(), guests],
    queryFn: () =>
      fetchAvailability({
        listingId,
        checkIn: checkIn!.toISOString(),
        checkOut: checkOut!.toISOString(),
        guests,
      }),
    enabled: !!checkIn && !!checkOut && nights > 0,
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  const bookingMutation = useMutation({
    mutationFn: submitBooking,
    onSuccess: (data) => {
      // Handle success
    },
  });

  const checkAvailability = useCallback(() => {
    if (checkIn && checkOut) {
      refetch();
    }
  }, [checkIn, checkOut, refetch]);

  return {
    availability,
    isLoading,
    error,
    isAvailable: availability?.isAvailable ?? false,
    canInstantBook: availability?.instantBook ?? false,
    requiresApproval: availability?.requiresApproval ?? true,
    checkAvailability,
    submitBooking: bookingMutation.mutate,
    isSubmitting: bookingMutation.isPending,
  };
}

async function fetchAvailability(params: {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guests: { adults: number; children: number; infants: number; pets: number };
}): Promise<AvailabilityStatus> {
  const response = await fetch('/api/listings/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error('Failed to check availability');
  }

  return response.json();
}

async function submitBooking(request: BookingRequest): Promise<{ bookingId: string }> {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Booking failed');
  }

  return response.json();
}
```

### Availability Status Display

```tsx
// components/booking/AvailabilityStatus.tsx
'use client';

import { Check, X, AlertCircle, Calendar, Clock, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import type { AvailabilityStatus as AvailabilityStatusType, AlternativeDateRange } from '@/types/availability';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface AvailabilityStatusProps {
  status: AvailabilityStatusType | undefined;
  isLoading: boolean;
  onSelectAlternative?: (dates: AlternativeDateRange) => void;
}

export function AvailabilityStatus({
  status,
  isLoading,
  onSelectAlternative,
}: AvailabilityStatusProps) {
  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-gray-500 py-2">
        <Loader2 className="w-4 h-4 animate-spin" />
        <span>Checking availability...</span>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  if (status.isAvailable) {
    return (
      <div className="flex items-center gap-2 text-green-600 py-2">
        <Check className="w-5 h-5" />
        <span className="font-medium">
          {status.instantBook
            ? 'Available for instant booking'
            : 'Available - request to book'}
        </span>
      </div>
    );
  }

  // Not available
  return (
    <div className="space-y-4">
      <Alert variant="destructive" className="bg-red-50 border-red-200">
        <X className="w-4 h-4" />
        <AlertTitle>Not available for these dates</AlertTitle>
        <AlertDescription>
          {status.blockedReasons?.map((reason, index) => (
            <p key={index} className="mt-1">{reason.message}</p>
          ))}
        </AlertDescription>
      </Alert>

      {/* Next available date */}
      {status.nextAvailableDate && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>
            Next available:{' '}
            {format(new Date(status.nextAvailableDate), 'MMM d, yyyy')}
          </span>
        </div>
      )}

      {/* Alternative dates */}
      {status.alternativeDates && status.alternativeDates.length > 0 && (
        <div className="pt-4 border-t">
          <p className="font-medium mb-3">Try these dates instead:</p>
          <div className="space-y-2">
            {status.alternativeDates.slice(0, 3).map((alt, index) => (
              <AlternativeDateOption
                key={index}
                dates={alt}
                onSelect={() => onSelectAlternative?.(alt)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function AlternativeDateOption({
  dates,
  onSelect,
}: {
  dates: AlternativeDateRange;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors text-left"
    >
      <div>
        <p className="font-medium">
          {format(new Date(dates.checkIn), 'MMM d')} -{' '}
          {format(new Date(dates.checkOut), 'MMM d')}
        </p>
        <p className="text-sm text-gray-500">{dates.nights} nights</p>
      </div>
      {dates.priceDifference !== undefined && dates.priceDifference !== 0 && (
        <span
          className={cn(
            'text-sm font-medium',
            dates.priceDifference < 0 ? 'text-green-600' : 'text-gray-600'
          )}
        >
          {dates.priceDifference < 0 ? '-' : '+'}
          ${Math.abs(dates.priceDifference)}
        </span>
      )}
    </button>
  );
}
```

### Reserve Button with Booking Type

```tsx
// components/booking/ReserveButton.tsx
'use client';

import { useState } from 'react';
import { Zap, Send, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ReserveButtonProps {
  isAvailable: boolean;
  canInstantBook: boolean;
  requiresApproval: boolean;
  isLoading: boolean;
  onReserve: (type: 'instant' | 'request', message?: string) => void;
  disabled?: boolean;
}

export function ReserveButton({
  isAvailable,
  canInstantBook,
  requiresApproval,
  isLoading,
  onReserve,
  disabled,
}: ReserveButtonProps) {
  const [showMessageDialog, setShowMessageDialog] = useState(false);
  const [message, setMessage] = useState('');

  const handleClick = () => {
    if (canInstantBook && !requiresApproval) {
      onReserve('instant');
    } else {
      setShowMessageDialog(true);
    }
  };

  const handleSubmitRequest = () => {
    onReserve('request', message);
    setShowMessageDialog(false);
    setMessage('');
  };

  if (!isAvailable) {
    return (
      <Button className="w-full" size="lg" disabled>
        Check availability
      </Button>
    );
  }

  return (
    <>
      <Button
        className={cn(
          'w-full',
          canInstantBook && 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600'
        )}
        size="lg"
        onClick={handleClick}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : canInstantBook ? (
          <>
            <Zap className="w-4 h-4 mr-2 fill-current" />
            Reserve
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Request to book
          </>
        )}
      </Button>

      {canInstantBook && (
        <p className="text-center text-sm text-gray-500 mt-2">
          You won't be charged yet
        </p>
      )}

      {/* Message dialog for request bookings */}
      <Dialog open={showMessageDialog} onOpenChange={setShowMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send a message to the host</DialogTitle>
            <DialogDescription>
              Introduce yourself and let the host know why you're visiting.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="message">Your message</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Hi! I'm excited about staying at your place..."
                rows={4}
                className="mt-1"
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600">
                <strong>Note:</strong> The host will review your request and
                respond within 24 hours. You won't be charged unless they accept.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowMessageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitRequest} disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              Send request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### Booking Type Indicator

```tsx
// components/booking/BookingTypeIndicator.tsx
import { Zap, Clock, MessageCircle, Shield } from 'lucide-react';
import type { InstantBookSettings } from '@/types/availability';
import { cn } from '@/lib/utils';

interface BookingTypeIndicatorProps {
  instantBook: boolean;
  settings?: InstantBookSettings;
  userMeetsRequirements?: boolean;
}

export function BookingTypeIndicator({
  instantBook,
  settings,
  userMeetsRequirements = true,
}: BookingTypeIndicatorProps) {
  if (instantBook && userMeetsRequirements) {
    return (
      <div className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg">
        <Zap className="w-6 h-6 text-yellow-600 fill-yellow-600 flex-shrink-0" />
        <div>
          <p className="font-semibold text-yellow-800">Instant Book</p>
          <p className="text-sm text-yellow-700">
            Book immediately without waiting for host approval
          </p>
        </div>
      </div>
    );
  }

  if (instantBook && !userMeetsRequirements) {
    return (
      <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
        <Shield className="w-6 h-6 text-gray-500 flex-shrink-0" />
        <div>
          <p className="font-semibold">Request required</p>
          <p className="text-sm text-gray-600">
            This host has Instant Book but requires verification.
          </p>
          {settings && (
            <ul className="mt-2 text-sm text-gray-600 space-y-1">
              {settings.requireVerifiedId && (
                <li className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  Verified ID required
                </li>
              )}
              {settings.requirePositiveReviews && (
                <li className="flex items-center gap-1">
                  <span className="w-1 h-1 bg-gray-400 rounded-full" />
                  Positive reviews required
                </li>
              )}
            </ul>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
      <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0" />
      <div>
        <p className="font-semibold text-blue-800">Request to book</p>
        <p className="text-sm text-blue-700">
          Send a booking request and hear back within 24 hours
        </p>
      </div>
    </div>
  );
}
```

### Real-time Availability Indicator

```tsx
// components/listing/RealTimeAvailability.tsx
'use client';

import { useEffect, useState } from 'react';
import { Users, Eye, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RealTimeAvailabilityProps {
  listingId: string;
  className?: string;
}

export function RealTimeAvailability({
  listingId,
  className,
}: RealTimeAvailabilityProps) {
  const [stats, setStats] = useState<{
    viewersNow: number;
    bookingsToday: number;
    lastBooked?: string;
  } | null>(null);

  useEffect(() => {
    // Connect to real-time updates (WebSocket or polling)
    const fetchStats = async () => {
      try {
        const response = await fetch(`/api/listings/${listingId}/stats`);
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 30000); // Poll every 30s

    return () => clearInterval(interval);
  }, [listingId]);

  if (!stats) return null;

  return (
    <div className={cn('space-y-2', className)}>
      {/* Viewers now */}
      {stats.viewersNow > 1 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
          </span>
          <Eye className="w-4 h-4 text-gray-500" />
          <span className="text-gray-700">
            <strong>{stats.viewersNow}</strong> people viewing right now
          </span>
        </div>
      )}

      {/* Recent bookings */}
      {stats.bookingsToday > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4" />
          <span>
            Booked <strong>{stats.bookingsToday}</strong> times today
          </span>
        </div>
      )}

      {/* Last booked */}
      {stats.lastBooked && (
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Clock className="w-4 h-4" />
          <span>Last booked {stats.lastBooked}</span>
        </div>
      )}
    </div>
  );
}
```

### Minimum Stay Warning

```tsx
// components/booking/MinStayWarning.tsx
import { AlertCircle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MinStayWarningProps {
  selectedNights: number;
  minStay: number;
  maxStay?: number;
}

export function MinStayWarning({
  selectedNights,
  minStay,
  maxStay,
}: MinStayWarningProps) {
  if (selectedNights >= minStay && (!maxStay || selectedNights <= maxStay)) {
    return null;
  }

  const isTooShort = selectedNights < minStay;
  const isTooLong = maxStay && selectedNights > maxStay;

  return (
    <Alert variant="warning" className="bg-amber-50 border-amber-200">
      <AlertCircle className="w-4 h-4 text-amber-600" />
      <AlertDescription className="text-amber-800">
        {isTooShort && (
          <>
            This listing requires a minimum stay of{' '}
            <strong>{minStay} nights</strong>. You've selected {selectedNights}{' '}
            {selectedNights === 1 ? 'night' : 'nights'}.
          </>
        )}
        {isTooLong && (
          <>
            This listing has a maximum stay of <strong>{maxStay} nights</strong>.
            You've selected {selectedNights} nights.
          </>
        )}
      </AlertDescription>
    </Alert>
  );
}
```

## 23. Responsive Image Grid with Lazy Loading

### Image Types and Interfaces

```typescript
// types/images.ts
interface ListingImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  blurHash?: string; // For blur placeholder
  placeholderUrl?: string; // Low quality placeholder
  width: number;
  height: number;
  aspectRatio: number;
  alt: string;
  caption?: string;
  tags?: ImageTag[];
  room?: string;
  isPrimary: boolean;
  sortOrder: number;
}

type ImageTag =
  | 'exterior'
  | 'interior'
  | 'bedroom'
  | 'bathroom'
  | 'kitchen'
  | 'living_room'
  | 'dining'
  | 'pool'
  | 'view'
  | 'amenity';

interface ResponsiveImageSource {
  url: string;
  width: number;
  descriptor: string; // e.g., "1x", "2x", "300w"
}

interface ImageSrcSet {
  srcSet: string;
  sizes: string;
  src: string; // Fallback
}

interface ImageGridLayout {
  type: 'classic' | 'masonry' | 'bento' | 'hero';
  columns: number;
  gap: number;
  aspectRatios?: number[];
}

interface GalleryState {
  isOpen: boolean;
  currentIndex: number;
  category: ImageTag | 'all';
  isFullscreen: boolean;
  isZoomed: boolean;
}

// Image loading states
type ImageLoadState = 'idle' | 'loading' | 'loaded' | 'error';

interface LazyImageState {
  loadState: ImageLoadState;
  isInView: boolean;
  hasLoaded: boolean;
}
```

### Responsive Image Component with srcSet

```tsx
// components/images/ResponsiveImage.tsx
import { useState, useRef, useEffect, memo } from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  srcSet?: string;
  sizes?: string;
  blurHash?: string;
  placeholderUrl?: string;
  className?: string;
  priority?: boolean;
  quality?: number;
  onLoad?: () => void;
  onError?: () => void;
}

// Generate srcSet for different widths
function generateSrcSet(
  baseUrl: string,
  widths: number[] = [320, 640, 768, 1024, 1280, 1536, 1920]
): string {
  return widths
    .map(w => {
      const url = transformImageUrl(baseUrl, { width: w });
      return `${url} ${w}w`;
    })
    .join(', ');
}

// Transform image URL with parameters (CDN-specific)
function transformImageUrl(
  url: string,
  params: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'avif' | 'jpg' | 'png';
  }
): string {
  const urlObj = new URL(url);

  if (params.width) urlObj.searchParams.set('w', String(params.width));
  if (params.height) urlObj.searchParams.set('h', String(params.height));
  if (params.quality) urlObj.searchParams.set('q', String(params.quality));
  if (params.format) urlObj.searchParams.set('fm', params.format);

  // Auto format based on browser support
  urlObj.searchParams.set('auto', 'format');

  return urlObj.toString();
}

// Default sizes attribute for responsive images
const DEFAULT_SIZES = `
  (max-width: 640px) 100vw,
  (max-width: 768px) 50vw,
  (max-width: 1024px) 33vw,
  25vw
`.trim();

export const ResponsiveImage = memo(function ResponsiveImage({
  src,
  alt,
  width,
  height,
  srcSet,
  sizes = DEFAULT_SIZES,
  blurHash,
  placeholderUrl,
  className,
  priority = false,
  quality = 80,
  onLoad,
  onError,
}: ResponsiveImageProps) {
  const [loadState, setLoadState] = useState<ImageLoadState>(
    priority ? 'loading' : 'idle'
  );
  const [showPlaceholder, setShowPlaceholder] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);

  const aspectRatio = width / height;
  const generatedSrcSet = srcSet || generateSrcSet(src);
  const optimizedSrc = transformImageUrl(src, { quality });

  // Handle image load
  const handleLoad = () => {
    setLoadState('loaded');
    // Fade out placeholder
    setTimeout(() => setShowPlaceholder(false), 300);
    onLoad?.();
  };

  const handleError = () => {
    setLoadState('error');
    onError?.();
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-gray-100',
        className
      )}
      style={{ aspectRatio }}
    >
      {/* Blur placeholder */}
      {showPlaceholder && (blurHash || placeholderUrl) && (
        <div
          className={cn(
            'absolute inset-0 transition-opacity duration-300',
            loadState === 'loaded' ? 'opacity-0' : 'opacity-100'
          )}
        >
          {blurHash ? (
            <BlurHashCanvas blurHash={blurHash} width={32} height={32} />
          ) : (
            <img
              src={placeholderUrl}
              alt=""
              className="w-full h-full object-cover blur-lg scale-110"
              aria-hidden="true"
            />
          )}
        </div>
      )}

      {/* Skeleton placeholder */}
      {showPlaceholder && !blurHash && !placeholderUrl && (
        <div
          className={cn(
            'absolute inset-0 bg-gray-200 animate-pulse transition-opacity duration-300',
            loadState === 'loaded' ? 'opacity-0' : 'opacity-100'
          )}
        />
      )}

      {/* Main image */}
      <img
        ref={imgRef}
        src={optimizedSrc}
        srcSet={generatedSrcSet}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          'w-full h-full object-cover transition-opacity duration-300',
          loadState === 'loaded' ? 'opacity-100' : 'opacity-0'
        )}
      />

      {/* Error state */}
      {loadState === 'error' && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center text-gray-400">
            <ImageOff className="w-8 h-8 mx-auto mb-2" />
            <span className="text-sm">Failed to load</span>
          </div>
        </div>
      )}
    </div>
  );
});
```

### BlurHash Canvas Decoder

```tsx
// components/images/BlurHashCanvas.tsx
import { useRef, useEffect, memo } from 'react';
import { decode } from 'blurhash';

interface BlurHashCanvasProps {
  blurHash: string;
  width: number;
  height: number;
  punch?: number; // Contrast adjustment
  className?: string;
}

export const BlurHashCanvas = memo(function BlurHashCanvas({
  blurHash,
  width,
  height,
  punch = 1,
  className,
}: BlurHashCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      // Decode blurhash to pixel array
      const pixels = decode(blurHash, width, height, punch);

      // Create image data
      const imageData = ctx.createImageData(width, height);
      imageData.data.set(pixels);

      // Draw to canvas
      ctx.putImageData(imageData, 0, 0);
    } catch (error) {
      console.error('Failed to decode blurhash:', error);
    }
  }, [blurHash, width, height, punch]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className={cn('w-full h-full object-cover', className)}
    />
  );
});

// Generate blurhash on server/build time
export async function generateBlurHash(
  imageUrl: string,
  componentX: number = 4,
  componentY: number = 3
): Promise<string> {
  // This would typically run on the server
  const response = await fetch(imageUrl);
  const buffer = await response.arrayBuffer();

  // Use sharp or similar library
  const { data, info } = await sharp(Buffer.from(buffer))
    .resize(32, 32, { fit: 'inside' })
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true });

  return encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    componentX,
    componentY
  );
}
```

### Lazy Loading with Intersection Observer

```tsx
// hooks/useLazyImage.ts
import { useState, useRef, useEffect, useCallback } from 'react';

interface UseLazyImageOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

interface UseLazyImageReturn {
  ref: React.RefObject<HTMLElement>;
  isInView: boolean;
  hasLoaded: boolean;
  loadState: ImageLoadState;
  load: () => void;
}

export function useLazyImage(
  options: UseLazyImageOptions = {}
): UseLazyImageReturn {
  const {
    threshold = 0.1,
    rootMargin = '200px 0px', // Load images 200px before they enter viewport
    triggerOnce = true,
  } = options;

  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [loadState, setLoadState] = useState<ImageLoadState>('idle');

  // Manual load trigger
  const load = useCallback(() => {
    if (loadState === 'idle') {
      setLoadState('loading');
    }
  }, [loadState]);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);

            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  // Auto-load when in view
  useEffect(() => {
    if (isInView && loadState === 'idle') {
      setLoadState('loading');
    }
  }, [isInView, loadState]);

  return {
    ref: ref as React.RefObject<HTMLElement>,
    isInView,
    hasLoaded,
    loadState,
    load,
  };
}

// LazyImage component using the hook
export function LazyImage({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  ...props
}: LazyImageProps) {
  const { ref, isInView, loadState } = useLazyImage();
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: width / height }}
    >
      {/* Placeholder */}
      {!imgLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}

      {/* Only render img when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          onLoad={() => setImgLoaded(true)}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            imgLoaded ? 'opacity-100' : 'opacity-0'
          )}
          {...props}
        />
      )}
    </div>
  );
}
```

### Progressive Image Loading

```tsx
// components/images/ProgressiveImage.tsx
import { useState, useEffect, memo } from 'react';

interface ProgressiveImageProps {
  lowQualitySrc: string;
  highQualitySrc: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
}

export const ProgressiveImage = memo(function ProgressiveImage({
  lowQualitySrc,
  highQualitySrc,
  alt,
  width,
  height,
  className,
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc);
  const [isHighQualityLoaded, setIsHighQualityLoaded] = useState(false);

  useEffect(() => {
    // Preload high quality image
    const img = new Image();
    img.src = highQualitySrc;

    img.onload = () => {
      setCurrentSrc(highQualitySrc);
      setIsHighQualityLoaded(true);
    };

    return () => {
      img.onload = null;
    };
  }, [highQualitySrc]);

  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{ aspectRatio: width / height }}
    >
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
        className={cn(
          'w-full h-full object-cover transition-all duration-500',
          !isHighQualityLoaded && 'blur-sm scale-105'
        )}
      />
    </div>
  );
});

// Hook for progressive image loading
export function useProgressiveImage(
  lowQualitySrc: string,
  highQualitySrc: string
) {
  const [src, setSrc] = useState(lowQualitySrc);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = highQualitySrc;

    img.onload = () => {
      setSrc(highQualitySrc);
      setIsLoading(false);
    };

    img.onerror = () => {
      setIsLoading(false);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [highQualitySrc]);

  return { src, isLoading, isBlurred: src === lowQualitySrc };
}
```

### Image Grid Layouts

```tsx
// components/images/ImageGrid.tsx
import { useState, useMemo, memo } from 'react';
import { cn } from '@/lib/utils';

interface ImageGridProps {
  images: ListingImage[];
  layout?: ImageGridLayout['type'];
  onImageClick?: (index: number) => void;
  maxImages?: number;
  className?: string;
}

export const ImageGrid = memo(function ImageGrid({
  images,
  layout = 'hero',
  onImageClick,
  maxImages = 5,
  className,
}: ImageGridProps) {
  const displayImages = images.slice(0, maxImages);
  const remainingCount = images.length - maxImages;

  const gridClassName = useMemo(() => {
    switch (layout) {
      case 'hero':
        return 'grid-cols-4 grid-rows-2';
      case 'classic':
        return 'grid-cols-3';
      case 'masonry':
        return 'columns-2 md:columns-3 lg:columns-4';
      case 'bento':
        return 'grid-cols-3 grid-rows-3';
      default:
        return 'grid-cols-4 grid-rows-2';
    }
  }, [layout]);

  if (layout === 'masonry') {
    return (
      <MasonryGrid
        images={images}
        onImageClick={onImageClick}
        className={className}
      />
    );
  }

  return (
    <div
      className={cn(
        'grid gap-2 rounded-xl overflow-hidden',
        gridClassName,
        className
      )}
    >
      {displayImages.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick?.(index)}
          className={cn(
            'relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary',
            getGridItemClass(layout, index, displayImages.length)
          )}
        >
          <ResponsiveImage
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            blurHash={image.blurHash}
            priority={index === 0}
            className="w-full h-full"
          />

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />

          {/* Show remaining count on last image */}
          {index === displayImages.length - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white text-xl font-semibold">
                +{remainingCount} more
              </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
});

// Get grid item class based on position
function getGridItemClass(
  layout: ImageGridLayout['type'],
  index: number,
  total: number
): string {
  if (layout === 'hero') {
    // Hero image takes left half
    if (index === 0) return 'col-span-2 row-span-2';
    // Other images fill right side
    return 'col-span-1 row-span-1';
  }

  if (layout === 'bento') {
    // Bento layout with varying sizes
    const bentoClasses = [
      'col-span-2 row-span-2', // Main image
      'col-span-1 row-span-1',
      'col-span-1 row-span-2',
      'col-span-1 row-span-1',
      'col-span-1 row-span-1',
    ];
    return bentoClasses[index] || 'col-span-1 row-span-1';
  }

  return '';
}

// Masonry Grid Layout
function MasonryGrid({
  images,
  onImageClick,
  className,
}: {
  images: ListingImage[];
  onImageClick?: (index: number) => void;
  className?: string;
}) {
  return (
    <div className={cn('columns-2 md:columns-3 lg:columns-4 gap-2', className)}>
      {images.map((image, index) => (
        <button
          key={image.id}
          onClick={() => onImageClick?.(index)}
          className="relative w-full mb-2 break-inside-avoid overflow-hidden rounded-lg"
        >
          <ResponsiveImage
            src={image.url}
            alt={image.alt}
            width={image.width}
            height={image.height}
            blurHash={image.blurHash}
            priority={index < 4}
          />
        </button>
      ))}
    </div>
  );
}
```

### Airbnb-Style Hero Image Grid

```tsx
// components/images/ListingHeroGrid.tsx
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { Grid3X3, Images } from 'lucide-react';

interface ListingHeroGridProps {
  images: ListingImage[];
  onShowAllPhotos: () => void;
  className?: string;
}

export const ListingHeroGrid = memo(function ListingHeroGrid({
  images,
  onShowAllPhotos,
  className,
}: ListingHeroGridProps) {
  const displayImages = images.slice(0, 5);

  return (
    <div className={cn('relative', className)}>
      {/* Desktop Grid */}
      <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-2 rounded-xl overflow-hidden h-[400px]">
        {displayImages.map((image, index) => (
          <button
            key={image.id}
            onClick={onShowAllPhotos}
            className={cn(
              'relative overflow-hidden focus:outline-none group',
              index === 0 && 'col-span-2 row-span-2'
            )}
          >
            <ResponsiveImage
              src={image.url}
              alt={image.alt}
              width={image.width}
              height={image.height}
              blurHash={image.blurHash}
              priority={index === 0}
              sizes={index === 0 ? '50vw' : '25vw'}
              className="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="md:hidden">
        <MobileImageCarousel
          images={images}
          onShowAll={onShowAllPhotos}
        />
      </div>

      {/* Show all photos button */}
      <Button
        variant="outline"
        size="sm"
        onClick={onShowAllPhotos}
        className="absolute bottom-4 right-4 bg-white hover:bg-white shadow-md"
      >
        <Grid3X3 className="w-4 h-4 mr-2" />
        Show all photos
      </Button>
    </div>
  );
});

// Mobile Image Carousel
function MobileImageCarousel({
  images,
  onShowAll,
}: {
  images: ListingImage[];
  onShowAll: () => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle scroll to update current index
  const handleScroll = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const itemWidth = container.offsetWidth;
    const newIndex = Math.round(scrollLeft / itemWidth);

    setCurrentIndex(newIndex);
  }, []);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
      >
        {images.map((image, index) => (
          <div
            key={image.id}
            className="flex-none w-full snap-center"
          >
            <ResponsiveImage
              src={image.url}
              alt={image.alt}
              width={image.width}
              height={image.height}
              blurHash={image.blurHash}
              priority={index < 2}
              sizes="100vw"
              className="w-full aspect-[4/3]"
            />
          </div>
        ))}
      </div>

      {/* Pagination dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1">
        {images.slice(0, 5).map((_, index) => (
          <div
            key={index}
            className={cn(
              'w-1.5 h-1.5 rounded-full transition-colors',
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            )}
          />
        ))}
        {images.length > 5 && (
          <div className="text-white text-xs ml-1">
            +{images.length - 5}
          </div>
        )}
      </div>

      {/* Counter badge */}
      <button
        onClick={onShowAll}
        className="absolute bottom-4 right-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full"
      >
        {currentIndex + 1} / {images.length}
      </button>
    </div>
  );
}
```

### Image Gallery Modal (Lightbox)

```tsx
// components/images/ImageGalleryModal.tsx
import { useState, useEffect, useCallback, memo } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Grid3X3,
  Maximize2,
  Minimize2,
  Share,
  Heart,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

interface ImageGalleryModalProps {
  images: ListingImage[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const ImageGalleryModal = memo(function ImageGalleryModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
}: ImageGalleryModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [view, setView] = useState<'slideshow' | 'grid'>('slideshow');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);

  const currentImage = images[currentIndex];

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          if (isFullscreen) {
            exitFullscreen();
          } else {
            onClose();
          }
          break;
        case 'g':
          setView(v => v === 'grid' ? 'slideshow' : 'grid');
          break;
        case 'f':
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isFullscreen, currentIndex]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setView('slideshow');
      setIsZoomed(false);
    }
  }, [isOpen, initialIndex]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex(i => (i > 0 ? i - 1 : images.length - 1));
    setIsZoomed(false);
  }, [images.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex(i => (i < images.length - 1 ? i + 1 : 0));
    setIsZoomed(false);
  }, [images.length]);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const exitFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  // Group images by category
  const imagesByCategory = useMemo(() => {
    const grouped: Record<string, ListingImage[]> = { all: images };

    images.forEach(image => {
      image.tags?.forEach(tag => {
        if (!grouped[tag]) grouped[tag] = [];
        grouped[tag].push(image);
      });
    });

    return grouped;
  }, [images]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          'max-w-full h-full p-0 bg-white',
          isFullscreen && 'fixed inset-0'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {currentIndex + 1} / {images.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setView(v => v === 'grid' ? 'slideshow' : 'grid')}
            >
              <Grid3X3 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" />
              ) : (
                <Maximize2 className="w-5 h-5" />
              )}
            </Button>
            <Button variant="ghost" size="icon">
              <Share className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Heart className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        {view === 'slideshow' ? (
          <SlideshowView
            image={currentImage}
            isZoomed={isZoomed}
            onZoomToggle={() => setIsZoomed(!isZoomed)}
            onPrevious={goToPrevious}
            onNext={goToNext}
            hasPrevious={currentIndex > 0}
            hasNext={currentIndex < images.length - 1}
          />
        ) : (
          <GridView
            images={images}
            imagesByCategory={imagesByCategory}
            currentIndex={currentIndex}
            onSelectImage={(index) => {
              setCurrentIndex(index);
              setView('slideshow');
            }}
          />
        )}

        {/* Thumbnail strip (slideshow view) */}
        {view === 'slideshow' && (
          <ThumbnailStrip
            images={images}
            currentIndex={currentIndex}
            onSelectImage={setCurrentIndex}
          />
        )}
      </DialogContent>
    </Dialog>
  );
});

// Slideshow View Component
function SlideshowView({
  image,
  isZoomed,
  onZoomToggle,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
}: {
  image: ListingImage;
  isZoomed: boolean;
  onZoomToggle: () => void;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
}) {
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isZoomed) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPosition({ x, y });
  }, [isZoomed]);

  return (
    <div className="flex-1 flex items-center justify-center relative bg-gray-100">
      {/* Previous button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onPrevious}
        disabled={!hasPrevious}
        className="absolute left-4 z-10 rounded-full bg-white/90 hover:bg-white"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      {/* Image container */}
      <div
        className={cn(
          'relative max-w-4xl max-h-[70vh] cursor-zoom-in overflow-hidden',
          isZoomed && 'cursor-zoom-out'
        )}
        onClick={onZoomToggle}
        onMouseMove={handleMouseMove}
      >
        <img
          src={image.url}
          alt={image.alt}
          className={cn(
            'max-w-full max-h-[70vh] object-contain transition-transform duration-200',
            isZoomed && 'scale-200'
          )}
          style={isZoomed ? {
            transformOrigin: `${position.x}% ${position.y}%`,
          } : undefined}
        />
      </div>

      {/* Next button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onNext}
        disabled={!hasNext}
        className="absolute right-4 z-10 rounded-full bg-white/90 hover:bg-white"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Zoom indicator */}
      <Button
        variant="outline"
        size="icon"
        onClick={onZoomToggle}
        className="absolute bottom-4 right-4 z-10 rounded-full bg-white/90"
      >
        {isZoomed ? (
          <ZoomOut className="w-4 h-4" />
        ) : (
          <ZoomIn className="w-4 h-4" />
        )}
      </Button>

      {/* Caption */}
      {image.caption && (
        <div className="absolute bottom-4 left-4 right-20 bg-black/70 text-white text-sm px-3 py-2 rounded">
          {image.caption}
        </div>
      )}
    </div>
  );
}

// Grid View Component
function GridView({
  images,
  imagesByCategory,
  currentIndex,
  onSelectImage,
}: {
  images: ListingImage[];
  imagesByCategory: Record<string, ListingImage[]>;
  currentIndex: number;
  onSelectImage: (index: number) => void;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const categories = Object.keys(imagesByCategory);
  const displayImages = imagesByCategory[selectedCategory] || images;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Category tabs */}
      {categories.length > 1 && (
        <div className="flex gap-2 p-4 border-b overflow-x-auto">
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="capitalize whitespace-nowrap"
            >
              {category.replace('_', ' ')} ({imagesByCategory[category].length})
            </Button>
          ))}
        </div>
      )}

      {/* Image grid */}
      <ScrollArea className="flex-1 p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {displayImages.map((image) => {
            const originalIndex = images.findIndex(i => i.id === image.id);
            return (
              <button
                key={image.id}
                onClick={() => onSelectImage(originalIndex)}
                className={cn(
                  'relative aspect-square overflow-hidden rounded-lg',
                  'focus:outline-none focus:ring-2 focus:ring-primary',
                  originalIndex === currentIndex && 'ring-2 ring-primary'
                )}
              >
                <ResponsiveImage
                  src={image.thumbnailUrl || image.url}
                  alt={image.alt}
                  width={300}
                  height={300}
                  blurHash={image.blurHash}
                  className="w-full h-full"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
              </button>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

// Thumbnail Strip Component
function ThumbnailStrip({
  images,
  currentIndex,
  onSelectImage,
}: {
  images: ListingImage[];
  currentIndex: number;
  onSelectImage: (index: number) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to current thumbnail
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const thumbnail = container.children[currentIndex] as HTMLElement;
    if (thumbnail) {
      thumbnail.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }, [currentIndex]);

  return (
    <div className="border-t p-2">
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto scrollbar-hide"
      >
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => onSelectImage(index)}
            className={cn(
              'flex-none w-16 h-16 rounded overflow-hidden',
              'focus:outline-none focus:ring-2 focus:ring-primary',
              index === currentIndex
                ? 'ring-2 ring-primary'
                : 'opacity-60 hover:opacity-100'
            )}
          >
            <img
              src={image.thumbnailUrl || image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
```

### Image Optimization Utilities

```typescript
// utils/imageOptimization.ts

// Supported image formats with quality
const IMAGE_FORMATS = {
  avif: { quality: 80, support: 'image/avif' },
  webp: { quality: 85, support: 'image/webp' },
  jpg: { quality: 85, support: 'image/jpeg' },
  png: { quality: 100, support: 'image/png' },
} as const;

// Check browser format support
export function getSupportedFormats(): string[] {
  const formats: string[] = [];

  // Check AVIF support
  const avifCanvas = document.createElement('canvas');
  if (avifCanvas.toDataURL('image/avif').startsWith('data:image/avif')) {
    formats.push('avif');
  }

  // Check WebP support
  const webpCanvas = document.createElement('canvas');
  if (webpCanvas.toDataURL('image/webp').startsWith('data:image/webp')) {
    formats.push('webp');
  }

  // JPEG and PNG are always supported
  formats.push('jpg', 'png');

  return formats;
}

// Generate optimized image URL
export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: keyof typeof IMAGE_FORMATS;
    fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    dpr?: number;
  } = {}
): string {
  const {
    width,
    height,
    quality = 80,
    format = 'webp',
    fit = 'cover',
    dpr = 1,
  } = options;

  // Build CDN URL (example with Cloudinary-style params)
  const params = new URLSearchParams();

  if (width) params.set('w', String(Math.round(width * dpr)));
  if (height) params.set('h', String(Math.round(height * dpr)));
  params.set('q', String(quality));
  params.set('fm', format);
  params.set('fit', fit);
  params.set('auto', 'format');

  const urlObj = new URL(url);
  urlObj.search = params.toString();

  return urlObj.toString();
}

// Generate responsive srcset
export function generateResponsiveSrcSet(
  url: string,
  options: {
    widths?: number[];
    format?: string;
    quality?: number;
  } = {}
): string {
  const {
    widths = [320, 480, 640, 768, 1024, 1280, 1536, 1920],
    format = 'webp',
    quality = 80,
  } = options;

  return widths
    .map(w => {
      const optimizedUrl = getOptimizedImageUrl(url, {
        width: w,
        format: format as keyof typeof IMAGE_FORMATS,
        quality,
      });
      return `${optimizedUrl} ${w}w`;
    })
    .join(', ');
}

// Generate sizes attribute based on breakpoints
export function generateSizes(
  config: Array<{
    breakpoint?: number;
    width: string;
  }>
): string {
  return config
    .map(({ breakpoint, width }) => {
      if (breakpoint) {
        return `(max-width: ${breakpoint}px) ${width}`;
      }
      return width;
    })
    .join(', ');
}

// Preload critical images
export function preloadImage(
  url: string,
  options: {
    as?: 'image';
    fetchPriority?: 'high' | 'low' | 'auto';
    srcSet?: string;
    sizes?: string;
  } = {}
): void {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = options.as || 'image';
  link.href = url;

  if (options.fetchPriority) {
    link.setAttribute('fetchpriority', options.fetchPriority);
  }

  if (options.srcSet) {
    link.setAttribute('imagesrcset', options.srcSet);
  }

  if (options.sizes) {
    link.setAttribute('imagesizes', options.sizes);
  }

  document.head.appendChild(link);
}

// Calculate optimal image dimensions
export function calculateImageDimensions(
  originalWidth: number,
  originalHeight: number,
  constraints: {
    maxWidth?: number;
    maxHeight?: number;
    targetAspectRatio?: number;
  }
): { width: number; height: number } {
  let { maxWidth, maxHeight, targetAspectRatio } = constraints;

  const originalAspectRatio = originalWidth / originalHeight;
  const aspectRatio = targetAspectRatio || originalAspectRatio;

  let width = originalWidth;
  let height = originalHeight;

  if (maxWidth && width > maxWidth) {
    width = maxWidth;
    height = width / aspectRatio;
  }

  if (maxHeight && height > maxHeight) {
    height = maxHeight;
    width = height * aspectRatio;
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

// Image loading priority queue
class ImageLoadQueue {
  private queue: Array<{
    url: string;
    priority: number;
    resolve: (img: HTMLImageElement) => void;
    reject: (error: Error) => void;
  }> = [];

  private loading = 0;
  private maxConcurrent = 4;

  enqueue(
    url: string,
    priority: number = 0
  ): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      this.queue.push({ url, priority, resolve, reject });
      this.queue.sort((a, b) => b.priority - a.priority);
      this.processQueue();
    });
  }

  private processQueue() {
    while (this.loading < this.maxConcurrent && this.queue.length > 0) {
      const item = this.queue.shift();
      if (!item) break;

      this.loading++;

      const img = new Image();
      img.src = item.url;

      img.onload = () => {
        this.loading--;
        item.resolve(img);
        this.processQueue();
      };

      img.onerror = () => {
        this.loading--;
        item.reject(new Error(`Failed to load: ${item.url}`));
        this.processQueue();
      };
    }
  }
}

export const imageLoadQueue = new ImageLoadQueue();
```

### Virtual Image Grid (for large galleries)

```tsx
// components/images/VirtualImageGrid.tsx
import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef, useMemo, memo } from 'react';

interface VirtualImageGridProps {
  images: ListingImage[];
  columns?: number;
  gap?: number;
  itemHeight?: number;
  onImageClick?: (index: number) => void;
  className?: string;
}

export const VirtualImageGrid = memo(function VirtualImageGrid({
  images,
  columns = 4,
  gap = 8,
  itemHeight = 200,
  onImageClick,
  className,
}: VirtualImageGridProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Group images into rows
  const rows = useMemo(() => {
    const result: ListingImage[][] = [];
    for (let i = 0; i < images.length; i += columns) {
      result.push(images.slice(i, i + columns));
    }
    return result;
  }, [images, columns]);

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => itemHeight + gap,
    overscan: 3, // Render 3 extra rows above/below viewport
  });

  const virtualRows = virtualizer.getVirtualItems();

  return (
    <div
      ref={parentRef}
      className={cn('overflow-auto', className)}
      style={{ height: '100%' }}
    >
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualRows.map((virtualRow) => {
          const rowImages = rows[virtualRow.index];
          const startIndex = virtualRow.index * columns;

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div
                className="grid"
                style={{
                  gridTemplateColumns: `repeat(${columns}, 1fr)`,
                  gap: `${gap}px`,
                  height: itemHeight,
                }}
              >
                {rowImages.map((image, colIndex) => {
                  const imageIndex = startIndex + colIndex;
                  return (
                    <button
                      key={image.id}
                      onClick={() => onImageClick?.(imageIndex)}
                      className="relative overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <LazyImage
                        src={image.thumbnailUrl || image.url}
                        alt={image.alt}
                        width={image.width}
                        height={image.height}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
```

### useImageGallery Hook

```tsx
// hooks/useImageGallery.ts
import { useState, useCallback, useMemo } from 'react';

interface UseImageGalleryOptions {
  images: ListingImage[];
  initialIndex?: number;
}

interface UseImageGalleryReturn {
  currentIndex: number;
  currentImage: ListingImage | undefined;
  isOpen: boolean;
  open: (index?: number) => void;
  close: () => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToIndex: (index: number) => void;
  hasNext: boolean;
  hasPrevious: boolean;
  filteredImages: ListingImage[];
  filterByTag: (tag: ImageTag | null) => void;
  activeFilter: ImageTag | null;
}

export function useImageGallery({
  images,
  initialIndex = 0,
}: UseImageGalleryOptions): UseImageGalleryReturn {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [activeFilter, setActiveFilter] = useState<ImageTag | null>(null);

  // Filter images by tag
  const filteredImages = useMemo(() => {
    if (!activeFilter) return images;
    return images.filter(img => img.tags?.includes(activeFilter));
  }, [images, activeFilter]);

  const currentImage = filteredImages[currentIndex];
  const hasNext = currentIndex < filteredImages.length - 1;
  const hasPrevious = currentIndex > 0;

  const open = useCallback((index: number = 0) => {
    setCurrentIndex(index);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const goToNext = useCallback(() => {
    if (hasNext) {
      setCurrentIndex(i => i + 1);
    }
  }, [hasNext]);

  const goToPrevious = useCallback(() => {
    if (hasPrevious) {
      setCurrentIndex(i => i - 1);
    }
  }, [hasPrevious]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < filteredImages.length) {
      setCurrentIndex(index);
    }
  }, [filteredImages.length]);

  const filterByTag = useCallback((tag: ImageTag | null) => {
    setActiveFilter(tag);
    setCurrentIndex(0); // Reset to first image when filtering
  }, []);

  return {
    currentIndex,
    currentImage,
    isOpen,
    open,
    close,
    goToNext,
    goToPrevious,
    goToIndex,
    hasNext,
    hasPrevious,
    filteredImages,
    filterByTag,
    activeFilter,
  };
}
```

### Complete Listing Images Integration

```tsx
// components/listing/ListingImages.tsx
import { memo } from 'react';
import { useImageGallery } from '@/hooks/useImageGallery';
import { ListingHeroGrid } from '@/components/images/ListingHeroGrid';
import { ImageGalleryModal } from '@/components/images/ImageGalleryModal';

interface ListingImagesProps {
  images: ListingImage[];
  listingTitle: string;
}

export const ListingImages = memo(function ListingImages({
  images,
  listingTitle,
}: ListingImagesProps) {
  const gallery = useImageGallery({ images });

  return (
    <>
      <ListingHeroGrid
        images={images}
        onShowAllPhotos={() => gallery.open(0)}
      />

      <ImageGalleryModal
        images={images}
        initialIndex={gallery.currentIndex}
        isOpen={gallery.isOpen}
        onClose={gallery.close}
      />
    </>
  );
});

// Usage in listing page
function ListingPage({ listing }: { listing: Listing }) {
  return (
    <div>
      <ListingImages
        images={listing.images}
        listingTitle={listing.title}
      />

      {/* Rest of listing content */}
    </div>
  );
}
```

---

This completes the **Travel Booking (Airbnb/MakeMyTrip)** frontend system design document with all 23 sections covering the critical frontend architecture patterns, components, and implementation strategies for building a production-grade travel booking platform.
