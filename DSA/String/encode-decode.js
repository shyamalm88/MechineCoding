/**
 * ============================================================================
 * PROBLEM: Encode and Decode Strings (LeetCode #271)
 * ============================================================================
 * Design an algorithm to encode a list of strings to a string. The encoded string
 * is then sent over the network and is decoded back to the original list of strings.
 *
 * Example 1:
 * Input: ["Hello","World"]
 * Output: ["Hello","World"]
 *
 * Constraints:
 * - 0 <= strs.length <= 200
 * - strs[i] contains any possible characters out of 256 valid ASCII characters.
 */

// ============================================================================
// APPROACH: Length Prefixing
// ============================================================================
/**
 * INTUITION:
 * We cannot simply use a delimiter like ',' or '#' because the strings themselves
 * might contain that delimiter.
 * Instead, we prefix each string with its length followed by a delimiter (e.g., '#').
 * Format: "length#string"
 * Example: ["ab", "c"] -> "2#ab1#c"
 * When decoding, we read the integer up to '#', then read that many characters.
 *
 * Time Complexity: O(N) where N is total characters.
 * Space Complexity: O(N)
 */
const encode = (arr) => {
  if (arr.length === 0) return "";
  // Map each string to "length#content", then join them all together
  return arr.map((item) => `${item.length}#${item}`).join("");
};

const decode = (s) => {
  const res = [];
  let i = 0;

  while (i < s.length) {
    // 1. Find the delimiter to get the length
    let j = i;
    while (s[j] !== "#") {
      j++;
    }

    // 2. Extract the length (the number before '#')
    let length = parseInt(s.substring(i, j));

    // 3. Move pointer to the start of the actual string
    i = j + 1;

    // 4. Extract exactly 'length' characters
    res.push(s.substring(i, i + length));

    // 5. Move pointer to the start of the next encoded block
    i += length;
  }

  return res;
};

// ============================================================================
// TEST CASES
// ============================================================================
console.log("=== Encode and Decode Tests ===\n");

const input = ["Hello", "World", "Leet#Code", ""];
const encoded = encode(input);
console.log("Encoded:", encoded);

const decoded = decode(encoded);
console.log("Decoded:", decoded);
// Expected: ["Hello", "World", "Leet#Code", ""]
