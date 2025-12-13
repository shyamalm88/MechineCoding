Array.prototype.myFilter = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const length = this.length;
  const res = [];

  for (let i = 0; i < length; i++) {
    if (i in this) {
      // If callback returns true/truthy, push to results
      if (callback.call(thisArg, this[i], i, this)) {
        res.push(this[i]);
      }
    }
  }

  return res;
};
