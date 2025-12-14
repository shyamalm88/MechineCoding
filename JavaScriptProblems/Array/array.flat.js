Array.prototype.myFlat = function (depth = 1) {
  return this.reduce((acc, item) => {
    if (Array.isArray(item) && depth > 0) {
      acc.push(...item.myFlat(depth - 1));
    } else {
      acc.push(item);
    }
    return acc;
  }, []);
};
