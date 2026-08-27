const totalFruit = (fruits, k = 2) => {
  const count = new Map();
  let left = 0;
  let best = 0;

  for (let right = 0; right < fruits.length; right++) {
    count.set(fruits[right], (count.get(fruits[right]) ?? 0) + 1);

    while (count.size > k) {
      const leftFruit = fruits[left];
      count.set(leftFruit, count.get(leftFruit) - 1);
      if (count.get(leftFruit) === 0) count.delete(leftFruit);
      left++;
    }
    best = Math.max(best, right - left + 1);
  }
  return best;
};

console.log(totalFruit([1, 2, 1])); // 3
console.log(totalFruit([0, 1, 2, 2])); // 3
console.log(totalFruit([1, 2, 3, 2, 2])); // 4
