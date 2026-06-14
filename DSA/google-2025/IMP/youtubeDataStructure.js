/**
 * ============================================================================
 * PROBLEM: Trending Videos (YouTube-style "Top K Trending" Design)
 * ============================================================================
 * Design a data structure that supports:
 * - view(videoId): record a view for a video (worth 1 point)
 * - like(videoId): record a like for a video (worth 2 points)
 * - getTopK(k): return the k videoIds with the highest score
 *               (score = views + 2 * likes), highest first.
 *
 * Example:
 * view("a"), view("a"), like("a")  -> a: views=2, likes=1, score=4
 * view("b"), like("b"), like("b")  -> b: views=1, likes=2, score=5
 * view("c")                        -> c: views=1, likes=0, score=1
 * getTopK(2) -> ["b", "a"]
 */

// ============================================================================
// APPROACH: Max-Heap + Lazy Deletion via Version Numbers
// ============================================================================
/**
 * STORY / INTUITION:
 * Every view/like changes a video's score, which would normally require
 * re-heapifying or removing-and-reinserting that video — heaps don't support
 * efficient arbitrary key updates.
 *
 * The trick is LAZY DELETION: instead of updating an entry in place, just
 * push a brand new heap entry with the new score and a fresh `version`
 * number. The video's CURRENT version is tracked separately in `this.videos`.
 * Old heap entries for that video are now "stale".
 *
 * When reading the top-K:
 * - Pop the highest-score entry.
 * - If its `version` matches the video's current version, it's the
 *   freshest score for that video -> keep it.
 * - If not, it's a stale leftover from before an update -> discard it.
 * - Push the kept ("fresh") entries back so future queries can still see them.
 *
 * DRY RUN: (see header example)
 *  Heap (by score, max first) after all events:
 *    {b,5,v3} {a,4,v3} {b,3,v2} {a,2,v2} {a,1,v1} {b,1,v1} {c,1,v1}
 *  getTopK(2):
 *    pop {b,5,v3} -> b.version===3 -> fresh -> result=[b]
 *    pop {a,4,v3} -> a.version===3 -> fresh -> result=[b,a], done
 *  Result: ["b", "a"]
 *
 * Time:  O(log N) per view/like (one heap push).
 *        O(K log N) for getTopK (amortized — stale entries are discarded
 *        permanently, so they don't cost anything on future calls).
 * Space: O(N + total events) for the heap (bounded by lazy cleanup).
 */
class MaxHeap {
  constructor() {
    this.data = [];
  }

  push(item) {
    this.data.push(item);
    this.bubbleUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 1) return this.data.pop();
    const top = this.data[0];
    this.data[0] = this.data.pop();
    this.bubbleDown(0);
    return top;
  }

  bubbleUp(i) {
    while (i > 0) {
      const p = Math.floor((i - 1) / 2);
      if (this.data[p].score >= this.data[i].score) break;
      [this.data[p], this.data[i]] = [this.data[i], this.data[p]];
      i = p;
    }
  }

  bubbleDown(i) {
    const n = this.data.length;
    while (true) {
      let largest = i;
      const l = 2 * i + 1;
      const r = 2 * i + 2;

      if (l < n && this.data[l].score > this.data[largest].score) largest = l;
      if (r < n && this.data[r].score > this.data[largest].score) largest = r;

      if (largest === i) break;
      [this.data[i], this.data[largest]] = [this.data[largest], this.data[i]];
      i = largest;
    }
  }

  isEmpty() {
    return this.data.length === 0;
  }
}

class TrendingVideos {
  constructor() {
    this.videos = new Map(); // videoId -> { views, likes, version }
    this.heap = new MaxHeap();
  }

  view(videoId) {
    if (!this.videos.has(videoId)) {
      this.videos.set(videoId, { views: 0, likes: 0, version: 0 });
    }

    const v = this.videos.get(videoId);
    v.views++;
    v.version++;

    this.heap.push({
      videoId,
      score: v.views + 2 * v.likes,
      version: v.version,
    });
  }

  like(videoId) {
    if (!this.videos.has(videoId)) {
      this.videos.set(videoId, { views: 0, likes: 0, version: 0 });
    }

    const v = this.videos.get(videoId);
    v.likes++;
    v.version++;

    this.heap.push({
      videoId,
      score: v.views + 2 * v.likes,
      version: v.version,
    });
  }

  getTopK(k) {
    const result = [];
    const temp = [];

    while (result.length < k && !this.heap.isEmpty()) {
      const top = this.heap.pop();
      const current = this.videos.get(top.videoId);

      // Lazy deletion: ignore stale entries
      if (current.version === top.version) {
        result.push(top.videoId);
        temp.push(top);
      }
    }

    // Push valid entries back
    for (const item of temp) {
      this.heap.push(item);
    }

    return result;
  }
}

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Trending Videos Tests ===\n");

const yt = new TrendingVideos();

yt.view("a");
yt.view("a");
yt.like("a"); // a: views=2, likes=1, score=4

yt.view("b");
yt.like("b");
yt.like("b"); // b: views=1, likes=2, score=5

yt.view("c"); // c: views=1, likes=0, score=1

console.log("Test 1 (top 2 by score):", yt.getTopK(2));
// Expected: ["b", "a"] (scores: b=5, a=4, c=1)

console.log("Test 2 (top 3, includes lowest scorer):", yt.getTopK(3));
// Expected: ["b", "a", "c"]

yt.like("c"); // c: views=1, likes=1, score=3 -> now beats nothing but a/b

console.log("Test 3 (after liking c, still below a and b):", yt.getTopK(3));
// Expected: ["b", "a", "c"]

module.exports = { TrendingVideos };
