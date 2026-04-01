const arr = [5, 2, 8, 3, 9, 4, 1, 6];

arr.sort((a, b) => {
  const aIsEven = a % 2 === 0;
  const bIsEven = b % 2 === 0;

  // Case 1: Both are Odd -> Descending
  if (!aIsEven && !bIsEven) {
    return b - a;
  }

  // Case 2: Both are Even -> Ascending
  if (aIsEven && bIsEven) {
    return a - b;
  }

  // Case 3: One Odd, One Even -> Put Odd first
  return aIsEven ? 1 : -1;
});

console.log(arr);
// Output: [9, 5, 3, 1, 2, 4, 6, 8]
