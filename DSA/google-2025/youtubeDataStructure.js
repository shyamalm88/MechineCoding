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

const yt = new TrendingVideos();

yt.view("a");
yt.view("a");
yt.like("a");

yt.view("b");
yt.like("b");
yt.like("b");

yt.view("c");

console.log(yt.getTopK(2)); // ["b", "a"]
