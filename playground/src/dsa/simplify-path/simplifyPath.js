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
