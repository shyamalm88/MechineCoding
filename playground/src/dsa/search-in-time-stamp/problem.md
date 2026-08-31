# Time Based Key-Value Store (LeetCode #981)

Design a time-based key-value data structure that can store multiple values
for the same key at different time stamps and retrieve the key's value at a
certain timestamp.

Implement the TimeMap class:
- TimeMap() Initializes the object of the data structure.
- void set(String key, String value, int timestamp) Stores the key key with
```text
  the value value at the given time timestamp.
```

- String get(String key, int timestamp) Returns a value such that set was
```text
  called previously, with timestamp_prev <= timestamp. If there are multiple
  such values, it returns the value associated with the largest timestamp_prev.
  If there are no values, it returns "".
```

Example 1:
Input
["TimeMap", "set", "get", "get", "set", "get", "get"]
[[], ["foo", "bar", 1], ["foo", 1], ["foo", 3], ["foo", "bar2", 4], ["foo", 4], ["foo", 5]]
Output
[null, null, "bar", "bar", null, "bar2", "bar2"]

Constraints:
- 1 <= key.length, value.length <= 100
- 1 <= timestamp <= 10^7
- All the timestamps timestamp of set are strictly increasing.

## Approach

HashMap + Binary Search

## Intuition

We need to store values associated with a key and a timestamp.
A HashMap is natural for Key -> Data lookup.
Since `set` is called with strictly increasing timestamps, the list of
[timestamp, value] pairs for any key will be naturally sorted by time.

For `get(key, timestamp)`, we need the value with the largest time <= timestamp.
Since the list is sorted, we can use Binary Search to find this position efficiently.

Time Complexity: Set O(1), Get O(log N)
Space Complexity: O(N) total entries stored.
