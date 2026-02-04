/**
 * ============================================================================
 * PROBLEM: LRU Cache with Time-To-Live (TTL)
 * ============================================================================
 *
 * INTUITION:
 * We need a cache that evicts items based on two criteria:
 * 1. Capacity: If full, remove the Least Recently Used (LRU) item.
 * 2. Expiry: If an item is too old (TTL), it is invalid.
 *
 * ALGORITHM:
 * - Storage: JavaScript `Map` maintains insertion order.
 *   - First item = Oldest (LRU).
 *   - Last item = Newest (MRU).
 * - Get(key):
 *   - If expired: Delete & return null.
 *   - If valid: Delete & Re-insert (moves to end/MRU). Return value.
 * - Put(key, value):
 *   - If exists: Delete (to refresh position).
 *   - If full: Delete first key (LRU eviction).
 *   - Insert new item.
 *
 * ============================================================================
 * DRY RUN
 * ============================================================================
 * Cap=2.
 * 1. put(A, val, 5s). Map: {A}.
 * 2. put(B, val, 5s). Map: {A, B}.
 * 3. get(A). A is valid. Delete A, Set A. Map: {B, A}. (A is now MRU).
 * 4. put(C, val, 5s). Cap full. Evict first (B). Map: {A, C}.
 * ============================================================================
 */
class LRUCacheTTL {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map(); // key -> { value, expiresAt }
  }

  get(key) {
    if (!this.cache.has(key)) return null;

    const entry = this.cache.get(key);

    // TTL check
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    // Refresh LRU (move to end)
    this.cache.delete(key);
    this.cache.set(key, entry);

    return entry.value;
  }

  put(key, value, ttl) {
    const expiresAt = Date.now() + ttl;

    // Remove if already exists (refresh position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    // Evict LRU if capacity exceeded
    if (this.cache.size >= this.capacity) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }

    this.cache.set(key, { value, expiresAt });
  }
}
