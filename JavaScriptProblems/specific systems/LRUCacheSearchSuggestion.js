class SearchSuggestionCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  async getResults(searchTerm) {
    // Cache hit
    if (this.cache.has(searchTerm)) {
      const value = this.cache.get(searchTerm);

      // move to most recent
      this.cache.delete(searchTerm);
      this.cache.set(searchTerm, value);

      console.log("Cache hit:", searchTerm);
      return value;
    }

    // Cache miss
    console.log("Fetching from API:", searchTerm);

    const result = await this.fetchFromDatabase(searchTerm);

    // eviction
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }

    this.cache.set(searchTerm, result);

    return result;
  }

  // Mock API
  async fetchFromDatabase(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Results for ${searchTerm}`);
      }, 500);
    });
  }
}

class SearchSuggestionCache {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.cache = new Map();
  }

  async getResults(searchTerm) {
    // Cache hit
    if (this.cache.has(searchTerm)) {
      const value = this.cache.get(searchTerm);

      // move to most recent
      this.cache.delete(searchTerm);
      this.cache.set(searchTerm, value);

      console.log("Cache hit:", searchTerm);
      return value;
    }

    // Cache miss
    console.log("Fetching from API:", searchTerm);

    const result = await this.fetchFromDatabase(searchTerm);

    // eviction
    if (this.cache.size >= this.maxSize) {
      const lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }

    this.cache.set(searchTerm, result);

    return result;
  }

  // Mock API
  async fetchFromDatabase(searchTerm) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`Results for ${searchTerm}`);
      }, 500);
    });
  }
}
