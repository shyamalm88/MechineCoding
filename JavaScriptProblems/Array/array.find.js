Array.prototype.myFind = function (callback, thisArg) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const length = this.length;

  for (let i = 0; i < length; i++) {
    // Note: 'find' visits empty slots as 'undefined' in standard spec,
    // unlike map/filter which skip them.
    const value = this[i];
    if (callback.call(thisArg, value, i, this)) {
      return value;
    }
  }

  return undefined;
};
