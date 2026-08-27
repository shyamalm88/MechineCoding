const deckRevealedIncreasing = (deck) => {
  const sorted = [...deck].sort((a, b) => b - a); // descending
  const result = [];
  for (const card of sorted) {
    if (result.length) result.unshift(result.pop()); // inverse of top→bottom
    result.unshift(card);
  }
  return result;
};

console.log(deckRevealedIncreasing([17, 13, 11, 2, 3, 5, 7])); // [2,13,3,11,5,17,7]
console.log(deckRevealedIncreasing([1, 1000])); // [1,1000]
