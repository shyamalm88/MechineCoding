Array.prototype.myFlat = function (depth = 1) {
  const result = [];

  for (let i = 0; i < this.length; i++) {
    if (!(i in this)) continue; // handle sparse arrays

    const item = this[i];

    if (Array.isArray(item) && depth > 0) {
      const flattened = item.myFlat(depth - 1);
      result.push(...flattened);
    } else {
      result.push(item);
    }
  }

  return result;
};
