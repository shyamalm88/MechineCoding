/**
 * ============================================================================
 * PROBLEM: Simplify Path (LeetCode #71)
 * ============================================================================
 * Given an absolute path for a Unix-style file system, convert it to its
 * simplified canonical path.
 *
 * Rules:
 * - The path starts with a single '/'.
 * - Any consecutive multiple slashes are treated as a single slash '/'.
 * - Any single period '.' is treated as the current directory — skip it.
 * - A double period '..' moves the directory up one level (pop).
 * - Any extra '..' at the root level is ignored (can't go above root).
 * - The canonical path must have no trailing slash (unless it's just "/")
 *   and no '.' or '..'.
 *
 * Example 1:
 * Input: path = "/home/"
 * Output: "/home"
 *
 * Example 2:
 * Input: path = "/home//foo/"
 * Output: "/home/foo"
 *
 * Example 3:
 * Input: path = "/a/./b/../../c/"
 * Output: "/c"
 *
 * Example 4:
 * Input: path = "/../"
 * Output: "/"
 *
 * Constraints:
 * - 1 <= path.length <= 3000
 * - path consists of English letters, digits, '.', '/', '_'
 * - path is a valid absolute Unix path
 */

// ============================================================================
// APPROACH: Stack of directory names, split by '/'
// ============================================================================
/**
 * STORY / INTUITION:
 * Split the path on '/'. This naturally turns repeated slashes into empty
 * strings, which we just ignore. Walk the remaining tokens with a stack:
 *
 * - "" or "."  → noop (empty piece from "//" or current-dir marker)
 * - ".."       → pop one directory (go up), but only if there's something
 *                 to pop — at root, ".." is a no-op
 * - anything else → push it (it's a real directory/file name)
 *
 * At the end, join the stack back together with '/' and prefix a leading
 * '/'. An empty stack means we're at root, so the result is just "/".
 *
 * DRY RUN: path = "/a/./b/../../c/"
 * split("/") → ["", "a", ".", "b", "..", "..", "c", ""]
 *
 * "":   skip
 * "a":  push        → [a]
 * ".":  skip
 * "b":  push        → [a, b]
 * "..": pop "b"     → [a]
 * "..": pop "a"     → []
 * "c":  push        → [c]
 * "":   skip
 *
 * Result: "/" + stack.join("/") = "/c" ✓
 *
 * Time:  O(N) — single pass over the split tokens
 * Space: O(N) — stack holds at most N directory names
 */
const simplifyPath = (path) => {
  const stack = [];

  for (const part of path.split("/")) {
    if (part === "" || part === ".") {
      // Empty piece (from "//" or leading/trailing "/") or current-dir marker
      continue;
    }
    if (part === "..") {
      // Go up a level — but root has no parent, so only pop if non-empty
      stack.pop();
    } else {
      stack.push(part);
    }
  }

  return "/" + stack.join("/");
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Simplify Path Tests ===\n");

console.log("Test 1:", simplifyPath("/home/"));               // Expected: "/home"
console.log("Test 2:", simplifyPath("/home//foo/"));          // Expected: "/home/foo"
console.log("Test 3:", simplifyPath("/a/./b/../../c/"));       // Expected: "/c"
console.log("Test 4:", simplifyPath("/../"));                  // Expected: "/"
console.log("Test 5:", simplifyPath("/a/../../b/../c//.//"));  // Expected: "/c"
console.log("Test 6:", simplifyPath("/a//b////c/d//././/..")); // Expected: "/a/b/c"

module.exports = { simplifyPath };
