const reverseString = (s) => {
  let left = 0;
  let right = s.length - 1;
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  return s;
};

console.log(reverseString(['h', 'e', 'l', 'l', 'o'])); // [o,l,l,e,h]
console.log(reverseString(['a', 'b'])); // [b,a]
console.log(reverseString(['a'])); // [a]
