// Array.prototype.myFlat
Array.prototype.myFlat = function (arr, depth = 1) {
  return arr.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      // Recursively call myFlat with depth - 1
      acc.push(...myFlat(item, depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};

// Usage:
// console.log(myFlat([1, [2, [3]]], 2)); // [1, 2, 3]
