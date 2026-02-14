/**
 * Shortest Substring of s containing t as a subsequence
 *
 * @param {string} s
 * @param {string} t
 * @return {string}
 */
function minWindowSubsequence(s, t) {
  let minLen = Infinity;
  let start = -1;

  let i = 0; // pointer on s

  while (i < s.length) {
    let j = 0; // pointer on t

    // Step 1: forward scan to match t
    while (i < s.length) {
      if (s[i] === t[j]) {
        j++;
        if (j === t.length) break;
      }
      i++;
    }

    if (j !== t.length) break; // no more matches

    // Step 2: backward shrink
    let end = i;
    j = t.length - 1;

    while (i >= 0) {
      if (s[i] === t[j]) {
        j--;
        if (j < 0) break;
      }
      i--;
    }

    // window is [i+1, end]
    const windowLen = end - i;
    if (windowLen < minLen) {
      minLen = windowLen;
      start = i + 1;
    }

    // Move i forward to search for next window
    i = i + 1;
  }

  return start === -1 ? "" : s.slice(start, start + minLen);
}
