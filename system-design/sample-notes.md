# System Design: URL Shortener (TinyURL)

## 1. Requirements

### Functional
- Shorten a long URL to a unique short URL (e.g., `tinyurl.com/abc123`)
- Redirect short URL to original long URL
- Optional: Custom aliases (user-defined short codes)
- Optional: Analytics (click count, geo-location)

### Non-Functional
- **High availability**: 99.9% uptime (reads > writes)
- **Low latency**: Redirects < 100ms
- **Scalability**: 100M URLs created/month, 10B redirects/month
- **Durability**: URLs never lost

### Assumptions
- Short URLs expire after 5 years (or configurable TTL)
- Read:write ratio = 100:1 (read-heavy)
- Short code length = 7 characters (base62: a-z, A-Z, 0-9)

---

## 2. High-Level Design

```
Client
  ↓
CDN (cache hot URLs)
  ↓
Load Balancer
  ↓
API Servers (stateless)
  ↓
Cache (Redis) ← read-through
  ↓
Database (SQL/NoSQL)
  ↓
Analytics Service (async)
```

---

## 3. API Design

### Create Short URL
```
POST /api/shorten
Request:
{
  "longUrl": "https://example.com/very/long/url",
  "customAlias": "my-link"  // optional
}

Response:
{
  "shortUrl": "tinyurl.com/abc123",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

### Redirect
```
GET /{shortCode}
Response: 302 Redirect to longUrl
```

### Analytics (optional)
```
GET /api/stats/{shortCode}
Response:
{
  "clicks": 12345,
  "createdAt": "2025-01-15T10:00:00Z",
  "topCountries": ["US", "IN", "UK"]
}
```

---

## 4. Data Model

### SQL (Postgres)
```sql
CREATE TABLE urls (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) UNIQUE NOT NULL,
  long_url TEXT NOT NULL,
  user_id BIGINT,  -- if authentication required
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,
  INDEX idx_short_code (short_code)
);

CREATE TABLE analytics (
  id BIGSERIAL PRIMARY KEY,
  short_code VARCHAR(10) NOT NULL,
  clicked_at TIMESTAMP DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  country VARCHAR(2)
);
```

**Why SQL?**
- Structured data, ACID guarantees
- Joins for analytics queries
- Good for moderate scale (<100M rows per shard)

**Alternative: NoSQL (DynamoDB/Cassandra)**
- Partition key = `short_code`
- Higher write throughput
- Trade-off: eventual consistency

---

## 5. Scaling

### Caching (Redis)
- Cache hot short codes (80/20 rule: 20% of URLs get 80% of traffic)
- TTL = 24 hours (auto-expire)
- **Cache hit rate target**: 90%

### Load Balancing
- Round-robin or least-connections
- Health checks on API servers

### Sharding
- **Hash-based sharding**: `shard = hash(short_code) % num_shards`
- **Range-based sharding**: By creation date (easier for archival)

### Async Analytics
- Writes to analytics table via message queue (Kafka/SQS)
- Avoids slowing down redirect path
- Batch inserts every 10 seconds

### CDN (Cloudflare/Akamai)
- Cache redirects at edge (geo-distributed)
- Reduces latency for global users

---

## 6. Short Code Generation

### Approach 1: Base62 Encoding of Auto-Increment ID
```javascript
// 62^7 = 3.5 trillion possible codes
const BASE62 = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

function encodeBase62(num) {
  let encoded = ''
  while (num > 0) {
    encoded = BASE62[num % 62] + encoded
    num = Math.floor(num / 62)
  }
  return encoded.padStart(7, 'a')
}

// Example: ID 12345 → base62 → "aaaa3d9"
```

**Pros**: Simple, predictable
**Cons**: Sequential (can guess next ID)

### Approach 2: Random + Collision Check
```javascript
function generateRandomCode() {
  let code = ''
  for (let i = 0; i < 7; i++) {
    code += BASE62[Math.floor(Math.random() * 62)]
  }
  return code
}

// Check if code exists in DB; if yes, retry (rare collision)
```

**Pros**: Non-sequential, unpredictable
**Cons**: Requires DB lookup (extra latency)

### Approach 3: Distributed ID Generator (Twitter Snowflake)
- 64-bit ID with timestamp + machine ID + counter
- Convert to base62

---

## 7. Consistency & Reliability

### CAP Trade-off
- **Choose AP** (Availability + Partition Tolerance)
- URLs are immutable once created (no conflict resolution needed)
- OK with eventual consistency for analytics

### Replication
- Master-slave for reads (SQL)
- Multi-region for geo-distribution

### Retries & Idempotency
- Client retries on timeout
- Use idempotency key (e.g., hash of `longUrl + userId`) to avoid duplicate short codes

### SLA/SLO
- **Availability**: 99.9% (3 nines)
- **Latency**: p99 < 100ms for redirects

---

## 8. Capacity Planning

### Traffic Estimates
- **Writes**: 100M URLs/month = ~40 writes/sec
- **Reads**: 10B redirects/month = ~4000 reads/sec

### Storage
- Each URL record = ~500 bytes (short_code + long_url + metadata)
- 100M URLs/month × 12 months × 5 years = 6B URLs
- Total storage = 6B × 500 bytes = **3 TB**

### Bandwidth
- Average URL size = 500 bytes
- Reads: 4000 QPS × 500 bytes = **2 MB/s**

### Cache Size (Redis)
- Hot URLs (20%) = 1.2B URLs
- 1.2B × 500 bytes = **600 GB** (fits in Redis cluster)

---

## 9. Security

### URL Validation
- Reject malicious URLs (phishing, malware)
- Use URL reputation APIs (Google Safe Browsing)

### Rate Limiting
- Per IP: 10 requests/min (prevent abuse)
- Per API key: 1000 requests/hour

### HTTPS
- All traffic encrypted (TLS 1.3)

### GDPR
- Analytics data (IP, user-agent) → PII
- Allow users to request deletion
- Anonymize IPs after 30 days

---

## 10. Evolution (MVP → v2)

### MVP (Week 1)
- Basic shorten + redirect
- Single SQL database
- In-memory cache

### v2 (Month 1)
- Redis cache
- Load balancer
- Basic analytics (click count)

### v3 (Month 3)
- Multi-region deployment
- CDN integration
- Geo-based analytics
- Custom domains (vanity URLs)

### Future Optimizations
- ML-based cache eviction (predict hot URLs)
- Bloom filters for negative lookups (non-existent codes)
- GraphQL API for advanced queries

---

## Bottlenecks & Trade-offs

| Component       | Bottleneck                  | Solution                     |
|-----------------|-----------------------------|------------------------------|
| Database        | Write throughput            | Shard by short_code hash     |
| Cache           | Memory limit                | LRU eviction, increase nodes |
| Redirects       | Latency for cold URLs       | Add CDN, warm cache          |
| Analytics       | High write volume           | Async queue, batch inserts   |
| Short codes     | Collision probability       | Use 128-bit hash → base62    |

---

## Diagrams (ASCII)

### Create Short URL Flow
```
Client → API Server → Check DB (code exists?) → Generate code → Insert DB → Return short URL
```

### Redirect Flow
```
Client → CDN (cache hit?) → Yes: Redirect
                         → No: API Server → Redis (cache hit?) → Yes: Redirect
                                                                → No: DB → Update cache → Redirect
```
