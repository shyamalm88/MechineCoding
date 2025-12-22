const minWindow = (s, t) => {
  if (t.length > s.length) return "";
  let need = new Map();

  // crete the map where we can see for each character how many frequencies are required
  for (const ch of t) {
    need.set(ch, (need.get(ch) || 0) + 1);
  }

  // to track s string we need map to compare with need map
  let windowMap = new Map();
  let left = 0;
  let right = 0;
  let formed = 0;
  let ans = "";
  let minLength = Infinity;

  let required = need.size;

  // check until right is less than required size
  while (right < s.length) {
    const charRight = s[right];
    windowMap.set(charRight, (windowMap.get(charRight) || 0) + 1);

    // so we are checking if the charRight is present in need and with right amount of freq?
    // we will increase the formed count
    if (
      need.has(charRight) &&
      windowMap.get(charRight) === need.get(charRight)
    ) {
      formed++;
    }

    // here check if formed === required means all the characters are present with right amount
    while (formed === required) {
      //check previous minLength bigger than current calculation of minLength
      if (right - left + 1 < minLength) {
        // update minLength and store the ans
        minLength = right - left + 1;
        ans = s.slice(left, right + 1);
      }

      const charLeft = s[left];
      windowMap.set(charLeft, (windowMap.get(charLeft) || 0) - 1);

      // check now if windowMap become invalid
      if (need.has(charLeft) && windowMap.get(charLeft) < need.get(charLeft)) {
        formed--;
      }
      left++;
    }
    right++;
  }
  return ans;
};
