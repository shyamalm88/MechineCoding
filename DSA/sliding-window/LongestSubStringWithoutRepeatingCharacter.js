function lengthOfLongestSubstring(s) {
  let left = 0;
  let maxLength = 0;
  let seen = new Map();

  for (right = 0; right < s.length; right++) {
    while (seen.has(s[right])) {
      // important if the item in string is already there then from very end delete.
      // this is why we kept left at 0 position we will delete the left and increase it
      seen.delete(s[left]);
      left++;
    }
    seen.set(s[right]);
    maxLength = Math.max(maxLength, right - left + 1);
  }
  return maxLength;
}
