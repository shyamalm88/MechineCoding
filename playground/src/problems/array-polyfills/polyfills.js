// ---- array.map.js ----
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

// ---- array.filterr.js ----
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

// ---- array.reduce.js ----
Array.prototype.myReduce = function (callback, initialValue) {
  // 1. Initialize variables
  let accumulator = initialValue;
  let startIndex = 0;

  // 2. Check if initialValue is MISSING
  // We check arguments.length because 'undefined' counts as a value
  if (arguments.length < 2) {
    if (this.length === 0) {
      throw new Error("Reduce of empty array with no initial value");
    }
    accumulator = this[0]; // Use first item as base
    startIndex = 1; // Start loop from second item
  }

  // 3. Loop through the array
  for (let i = startIndex; i < this.length; i++) {
    accumulator = callback(accumulator, this[i], i, this);
  }

  return accumulator;
};

// ---- array.foreach.js ----
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

// ---- array.find.js ----
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

// ---- array.flat.js ----
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

