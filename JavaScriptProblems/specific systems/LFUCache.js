/**
 * ============================================================================
 * PROBLEM: LFU Cache (Least Frequently Used) — LeetCode #460
 * ============================================================================
 *
 * Design a cache that evicts the LEAST FREQUENTLY USED key when it is full.
 * If there's a tie in frequency, evict the LEAST RECENTLY USED among them.
 *
 * get(key)  -> return value, or -1 if not present. Bumps usage frequency.
 * put(key, value) -> insert/update. Evicts LFU (tie -> LRU) if at capacity.
 *
 * Both operations must run in O(1).
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * LRU only tracks "how recently" a key was used. LFU additionally tracks
 * "how often". A single Map isn't enough — we need to group keys by their
 * frequency count, and within each frequency group preserve insertion order
 * (so the oldest one in that group is the LRU tie-breaker).
 *
 * ALGORITHM (two-map design):
 * - `keyMap`:  key   -> { value, freq }
 * - `freqMap`: freq  -> Map<key, true>   (insertion-ordered set of keys at
 *                                          that frequency; first = LRU)
 * - `minFreq`: tracks the current smallest frequency in use.
 *
 * touch(key):
 *   1. Remove key from freqMap[oldFreq].
 *   2. If freqMap[oldFreq] is now empty and oldFreq === minFreq, bump minFreq.
 *   3. freq++, insert key into freqMap[newFreq] (create the bucket if needed).
 *
 * get(key):
 *   - Miss -> -1.
 *   - Hit  -> touch(key), return value.
 *
 * put(key, value):
 *   - If key exists -> update value, touch(key).
 *   - Else:
 *       - If at capacity -> evict the first key in freqMap[minFreq]
 *         (oldest = LRU among the least-frequent keys).
 *       - Insert key with freq = 1, set minFreq = 1.
 *
 * ============================================================================
 * DRY RUN — capacity = 2
 * ============================================================================
 * put(1, "A")  -> keyMap:{1:(A,f1)}            freqMap:{1:[1]}           min=1
 * put(2, "B")  -> keyMap:{1:(A,f1),2:(B,f1)}   freqMap:{1:[1,2]}         min=1
 * get(1)       -> "A"; 1 moves to freq 2.
 *                 keyMap:{1:(A,f2),2:(B,f1)}   freqMap:{1:[2],2:[1]}     min=1
 * put(3, "C")  -> capacity full. Evict LFU: freqMap[1] = [2] -> evict 2.
 *                 keyMap:{1:(A,f2),3:(C,f1)}   freqMap:{1:[3],2:[1]}     min=1
 * get(2)       -> -1 (evicted)
 * get(3)       -> "C"; 3 moves to freq 2.
 *                 freqMap:{1:[],2:[1,3]}                                  min=2
 *
 * ============================================================================
 * COMPLEXITY
 * ============================================================================
 * Time:  O(1) for get and put (Map insertion order gives O(1) "oldest" access)
 * Space: O(capacity)
 */
class LFUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.keyMap = new Map(); // key -> { value, freq }
    this.freqMap = new Map(); // freq -> Map<key, true> (insertion ordered)
    this.minFreq = 0;
  }

  #touch(key) {
    const node = this.keyMap.get(key);
    const oldFreq = node.freq;

    // remove from old frequency bucket
    const oldBucket = this.freqMap.get(oldFreq);
    oldBucket.delete(key);
    if (oldBucket.size === 0) {
      this.freqMap.delete(oldFreq);
      if (this.minFreq === oldFreq) this.minFreq++;
    }

    // move to new frequency bucket
    node.freq++;
    if (!this.freqMap.has(node.freq)) this.freqMap.set(node.freq, new Map());
    this.freqMap.get(node.freq).set(key, true);
  }

  get(key) {
    if (!this.keyMap.has(key)) return -1;
    const { value } = this.keyMap.get(key);
    this.#touch(key);
    return value;
  }

  put(key, value) {
    if (this.capacity <= 0) return;

    if (this.keyMap.has(key)) {
      this.keyMap.get(key).value = value;
      this.#touch(key);
      return;
    }

    if (this.keyMap.size >= this.capacity) {
      const lfuBucket = this.freqMap.get(this.minFreq);
      const evictKey = lfuBucket.keys().next().value; // oldest = LRU tie-break
      lfuBucket.delete(evictKey);
      if (lfuBucket.size === 0) this.freqMap.delete(this.minFreq);
      this.keyMap.delete(evictKey);
    }

    this.keyMap.set(key, { value, freq: 1 });
    if (!this.freqMap.has(1)) this.freqMap.set(1, new Map());
    this.freqMap.get(1).set(key, true);
    this.minFreq = 1;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== LFU Cache Tests ===\n");

const lfu = new LFUCache(2);
lfu.put(1, "A");
lfu.put(2, "B");
console.log(lfu.get(1)); // "A" -> freq(1) = 2
lfu.put(3, "C"); // evicts key 2 (freq 1, LFU)
console.log(lfu.get(2)); // -1 (evicted)
console.log(lfu.get(3)); // "C"
lfu.put(4, "D"); // freq(1)=2, freq(3)=2 -> evict LRU among freq-1 -> evicts 1
console.log(lfu.get(1)); // -1 (evicted)
console.log(lfu.get(3)); // "C"
console.log(lfu.get(4)); // "D"

module.exports = { LFUCache };
