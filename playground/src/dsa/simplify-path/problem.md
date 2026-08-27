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
