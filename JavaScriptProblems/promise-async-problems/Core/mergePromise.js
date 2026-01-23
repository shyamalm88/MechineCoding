function mergePromises(promises) {
  if (!Array.isArray(promises)) {
    return Promise.reject(new Error("Expected an array"));
  }

  // Define behavior for empty input
  if (promises.length === 0) {
    return Promise.resolve(undefined);
  }

  let unresolved = promises.length;
  const results = new Array(promises.length);
  let settled = false;

  return new Promise((resolve, reject) => {
    promises.forEach((p, index) => {
      Promise.resolve(p)
        .then((data) => {
          results[index] = data;
          unresolved--;

          if (unresolved === 0) {
            resolve(mergeResultsInternal(results));
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}

function mergeResultsInternal(values) {
  if (values.length === 0) return undefined;

  return values.reduce((acc, current) => mergeTwo(acc, current));
}

function mergeTwo(a, b) {
  if (typeof a === "number" && typeof b === "number") {
    return a + b;
  }

  if (typeof a === "string" && typeof b === "string") {
    return a + b;
  }

  if (Array.isArray(a) && Array.isArray(b)) {
    return [...a, ...b];
  }

  if (isPlainObject(a) && isPlainObject(b)) {
    return { ...a, ...b };
  }

  throw new Error(`Cannot merge ${typeof a} with ${typeof b}`);
}

function isPlainObject(v) {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}
