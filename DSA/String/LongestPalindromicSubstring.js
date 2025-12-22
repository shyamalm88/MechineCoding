const expandAroundCenter = (string, left, right) => {
  while (left >= 0 && right < string.length && string[left] === string[right]) {
    left--;
    right++;
  }
  return string.slice(left + 1, right);
};

const longestPalindrome = (string) => {
  let longest = "";

  for (let i = 0; i < string.length; i++) {
    const odd = expandAroundCenter(string, i, i);
    const even = expandAroundCenter(string, i, i + 1);

    if (odd.length > longest.length) longest = odd;
    if (even.length > longest.length) longest = even;
  }

  return longest;
};
