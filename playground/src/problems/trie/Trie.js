/**
 * Trie (prefix tree). Every node is one character; a path from the root spells
 * a prefix. `count` (words passing through) is what makes delete O(m) without
 * a second traversal to check whether a branch is still needed.
 */
class TrieNode {
  constructor() {
    this.children = new Map()
    this.isEnd = false
    this.count = 0
  }
}

export class Trie {
  constructor() { this.root = new TrieNode() }

  /** O(m) where m = word length -- independent of how many words are stored. */
  insert(word) {
    let node = this.root
    for (const char of word) {
      if (!node.children.has(char)) node.children.set(char, new TrieNode())
      node = node.children.get(char)
      node.count++
    }
    node.isEnd = true
  }

  #traverse(prefix) {
    let node = this.root
    for (const char of prefix) {
      node = node.children.get(char)
      if (!node) return null
    }
    return node
  }

  /** Exact word -- isEnd distinguishes a stored word from a mere prefix. */
  search(word) { return this.#traverse(word)?.isEnd ?? false }

  startsWith(prefix) { return this.#traverse(prefix) !== null }

  /** All words sharing a prefix -- the autocomplete operation. */
  autocomplete(prefix, limit = 10) {
    const node = this.#traverse(prefix)
    if (!node) return []
    const out = []
    const walk = (n, acc) => {
      if (out.length >= limit) return
      if (n.isEnd) out.push(acc)
      for (const [char, child] of n.children) walk(child, acc + char)
    }
    walk(node, prefix)
    return out
  }

  delete(word) {
    if (!this.search(word)) return false
    let node = this.root
    for (const char of word) {
      const child = node.children.get(char)
      child.count--
      // No other word passes through here -- prune the whole branch.
      if (child.count === 0) { node.children.delete(char); return true }
      node = child
    }
    node.isEnd = false
    return true
  }
}
