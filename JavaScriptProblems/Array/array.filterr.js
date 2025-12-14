Array.prototype.myFilter = function (callback, context) {
  if (typeof callback !== "function") {
    throw new TypeError(callback + " is not a function");
  }

  const length = this.length;
  const res = [];

  for (let i = 0; i < length; i++) {
    if (callback.call(context, this[i], i, this)) {
      res.push(this[i]);
    }
  }

  return res;
};
