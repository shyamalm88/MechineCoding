const containsDuplicate = (nums) => {
  const seen = new Set();
  for (const n of nums) {
    if (seen.has(n)) return true; // early exit
    seen.add(n);
  }
  return false;
};

console.log(containsDuplicate([1, 2, 3, 1])); // true
console.log(containsDuplicate([1, 2, 3, 4])); // false
console.log(containsDuplicate([])); // false
