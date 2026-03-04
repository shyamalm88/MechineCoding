/**
 * ============================================================================
 * PROBLEM: Flatten Object with Dot Notation
 * ============================================================================
 * Given a nested object, flatten it into a single level object where keys
 * represent the path to the value using dot notation.
 *
 * Example:
 * Input: { a: { b: 1 }, c: 2 }
 * Output: { "a.b": 1, "c": 2 }
 *
 * ============================================================================
 * INTUITION
 * ============================================================================
 * - This is a tree traversal problem. The object structure is a tree.
 * - We need to visit every leaf node (primitive value) and record the path
 *   taken to reach it.
 * - Depth-First Search (DFS) is ideal here because we build the path as we
 *   go deeper.
 * - We pass the `currentPath` down to recursive calls.
 */
function flattenObject(obj) {
  const result = {};

  function dfs(current, path) {
    for (const key of Object.keys(current)) {
      const value = current[key];

      // Construct the new path.
      // If path is empty (root), just use key. Otherwise append .key
      const newKey = path ? `${path}.${key}` : key;

      // Recurse if value is an object (and not null)
      if (value !== null && typeof value === "object") {
        dfs(value, newKey);
      } else {
        // Base case: It's a primitive. Add to result.
        result[newKey] = value;
      }
    }
  }

  dfs(obj, "");

  return result;
}
