Array.prototype.myForEach = function (callback, callbackContext) {
  if (typeof callback !== "function") {
    throw new TypeError("Callback must be a function");
  }

  const arr = this;

  for (let i = 0; i < arr.length; i++) {
    // Skip holes (important)
    if (!(i in arr)) continue;

    callback.call(callbackContext, arr[i], i, arr);
  }
};
