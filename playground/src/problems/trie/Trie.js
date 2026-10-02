/**
 * ============================================================================
 * PROBLEM: Trie (Prefix Tree)
 * ============================================================================
 * Implement a Trie data structure that supports:
 *  - insert(word)         — add a word
 *  - search(word)         — exact word exists?
 *  - startsWith(prefix)   — any word with this prefix?
 *  - autocomplete(prefix) — return all words with this prefix
 *  - delete(word)         — remove a word
 *
 * WHY: Autocomplete, spell check, IP routing, search suggestion systems.
 *      Asked when LRU cache feels too easy.
 * ============================================================================
 */

class TrieNode {
  constructor() {
    this.children = {};   // char → TrieNode
    this.isEnd = false;   // marks a complete word
    this.count = 0;       // how many words pass through this node (for delete)
  }
}

class Trie {
  constructor() {
    this.root = new TrieNode();
  }

  // O(m) — m = word length
  insert(word) {
    let node = this.root;
    for (const char of word) {
      if (!node.children[char]) {
        node.children[char] = new TrieNode();
      }
      node = node.children[char];
      node.count++;
    }
    node.isEnd = true;
  }

  // O(m) — exact match only
  search(word) {
    const node = this._traverse(word);
    return node !== null && node.isEnd;
  }

  // O(m) — any word starting with prefix
  startsWith(prefix) {
    return this._traverse(prefix) !== null;
  }

  // O(m + k) — m = prefix length, k = total chars in matching words
  autocomplete(prefix) {
    const node = this._traverse(prefix);
    if (!node) return [];

    const results = [];
    this._dfs(node, prefix, results);
    return results;
  }

  // O(m) — removes word, cleans up unused nodes
  delete(word) {
    this._delete(this.root, word, 0);
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  _traverse(str) {
    let node = this.root;
    for (const char of str) {
      if (!node.children[char]) return null;
      node = node.children[char];
    }
    return node;
  }

  _dfs(node, current, results) {
    if (node.isEnd) results.push(current);
    for (const [char, child] of Object.entries(node.children)) {
      this._dfs(child, current + char, results);
    }
  }

  _delete(node, word, index) {
    if (index === word.length) {
      if (!node.isEnd) return false; // word doesn't exist
      node.isEnd = false;
      return Object.keys(node.children).length === 0; // true = safe to delete node
    }

    const char = word[index];
    const child = node.children[char];
    if (!child) return false;

    const shouldDelete = this._delete(child, word, index + 1);
    if (shouldDelete) {
      delete node.children[char];
      return !node.isEnd && Object.keys(node.children).length === 0;
    }
    return false;
  }
}

class SearchSuggestionEngine {
  constructor(wordList) {
    this.trie = new Trie();
    wordList.forEach(w => this.trie.insert(w.toLowerCase()));
  }

  suggest(prefix, limit = 5) {
    const results = this.trie.autocomplete(prefix.toLowerCase());
    return results.slice(0, limit);
  }
}

export { Trie, SearchSuggestionEngine }
