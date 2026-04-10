Array.prototype.myMap = function (callback, context) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const length = this.length;
  const newArray = new Array(length); // Pre-allocate memory for performance

  for (let i = 0; i < length; i++) {
    // Sparse array check: Only map if the index actually exists
    // const arr = [1, , 3]; // index 1 is empty
    // console.log(arr.length); // 3
    if (i in this) {
      newArray[i] = callback.call(context, this[i], i, this);
    }
  }

  return newArray;
};
