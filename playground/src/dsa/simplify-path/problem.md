# Simplify Path (LeetCode #71)

Given an absolute path for a Unix-style file system, convert it to its
simplified canonical path.

Rules:
- The path starts with a single '/'.
- Any consecutive multiple slashes are treated as a single slash '/'.
- Any single period '.' is treated as the current directory — skip it.
- A double period '..' moves the directory up one level (pop).
- Any extra '..' at the root level is ignored (can't go above root).
- The canonical path must have no trailing slash (unless it's just "/")
```text
  and no '.' or '..'.
```

Example 1:
Input: path = "/home/"
Output: "/home"

Example 2:
Input: path = "/home//foo/"
Output: "/home/foo"

Example 3:
Input: path = "/a/./b/../../c/"
Output: "/c"

Example 4:
Input: path = "/../"
Output: "/"

Constraints:
- 1 <= path.length <= 3000
- path consists of English letters, digits, '.', '/', '_'
- path is a valid absolute Unix path

## Approach

Stack of directory names, split by '/'

## Story / intuition

Split the path on '/'. This naturally turns repeated slashes into empty
strings, which we just ignore. Walk the remaining tokens with a stack:

- "" or "."  → noop (empty piece from "//" or current-dir marker)
- ".."       → pop one directory (go up), but only if there's something
```text
                to pop — at root, ".." is a no-op
```

- anything else → push it (it's a real directory/file name)

At the end, join the stack back together with '/' and prefix a leading
'/'. An empty stack means we're at root, so the result is just "/".

## Dry run

path = "/a/./b/../../c/"
split("/") → ["", "a", ".", "b", "..", "..", "c", ""]

"":   skip
"a":  push        → [a]
".":  skip
"b":  push        → [a, b]
"..": pop "b"     → [a]
"..": pop "a"     → []
"c":  push        → [c]
"":   skip

Result: "/" + stack.join("/") = "/c" ✓

Time:  O(N) — single pass over the split tokens
Space: O(N) — stack holds at most N directory names
