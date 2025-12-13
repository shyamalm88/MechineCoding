const smallestSubstrContainsAllCharOfT = (s, t) => {
  // quick guards
  if (!s || !t || t.length > s.length) return "";

  // build need map (counts of chars required)
  const need = new Map();
  for (const ch of t) need.set(ch, (need.get(ch) || 0) + 1);

  // total characters (including duplicates) still needed
  let needCount = t.length; // <- FIX: use t.length and mutable let

  // sliding window state
  const window = new Map();
  let l = 0;
  let minLen = Infinity;
  let minStart = 0;

  for (let r = 0; r < s.length; r++) {
    const ch = s[r];
    window.set(ch, (window.get(ch) || 0) + 1);

    // If this char is required and we still needed it, consume one needed
    if (need.has(ch) && need.get(ch) > 0) {
      needCount--;
    }
    // Decrease needed count for this character (can go negative — means we have extras)
    if (need.has(ch)) need.set(ch, need.get(ch) - 1);

    // When needCount === 0, current window [l..r] contains all chars of t
    while (needCount === 0) {
      // update best window
      if (r - l + 1 < minLen) {
        minLen = r - l + 1;
        minStart = l; // <- FIX: store start index, not minLen
      }

      // try to remove leftmost char and shrink window
      const leftChar = s[l];

      if (need.has(leftChar)) {
        // give the char back to need
        need.set(leftChar, need.get(leftChar) + 1);

        // if after giving back, we need it (>0), window becomes invalid
        if (need.get(leftChar) > 0) needCount++;
      }

      // update window counts (bookkeeping)
      window.set(leftChar, (window.get(leftChar) || 0) - 1);
      l++;
    }
  }

  // return the substring (or empty if none)
  return minLen === Infinity ? "" : s.slice(minStart, minStart + minLen);
};

// test
console.log(smallestSubstrContainsAllCharOfT("ADOBECODEBANC", "ABC")); // should print "BANC"
