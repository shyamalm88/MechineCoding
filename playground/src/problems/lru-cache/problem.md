# Implement LRU Cache

`get(key)` and `put(key, value)` must both be **O(1)**, evicting the least
recently used entry when capacity is exceeded.

## The textbook answer

A **hash map + doubly linked list**. The map gives O(1) lookup; the list keeps
recency order with O(1) move-to-front and O(1) removal of the tail. A singly
linked list is not enough — removing a node needs its predecessor.

## The JavaScript answer

`Map` iterates in **insertion order**, which collapses the whole problem:

```js
get(key) {
  const value = this.map.get(key)
  this.map.delete(key)     // remove
  this.map.set(key, value) // re-insert at the recent end
  return value
}
```

`map.keys().next().value` is then the least recently used key. This is O(1) and
about ten lines. Worth saying out loud that you *know* the linked-list version —
interviewers often want to hear it before accepting the shortcut.

## The subtlety most people miss

**`put` on an existing key must also refresh recency.** Without the `delete`
before `set`, `Map` keeps the original insertion position, so a frequently
updated key is still evicted as if it were old.

## Traps

- Checking `get(key) !== undefined` to test presence fails when `undefined` is a
  stored value — use `map.has(key)`.
- Evicting before inserting can evict the key you are about to add.
- LRU vs LFU: LRU evicts by *recency*, LFU by *frequency*. A one-off scan of
  many keys pollutes an LRU and evicts genuinely hot entries.
