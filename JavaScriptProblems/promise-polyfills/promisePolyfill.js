function PromisePolyFill(executor) {
  let onResolve, onReject;
  let isFulfilled = false,
    isRejected = false;
  let value, error;

  function resolve(v) {
    isFulfilled = true;
    value = v;
    if (typeof onResolve === "function") {
      onResolve(value);
    }
  }

  function reject(err) {
    isRejected = true;
    error = err;
    if (typeof onReject === "function") {
      onReject(error);
    }
  }

  this.then = function (callback) {
    return new PromisePolyFill((nextResolve, nextReject) => {
      // Helper to handle the callback logic
      const handleCallback = (val) => {
        try {
          const result = callback(val); // 1. Run the user's callback
          nextResolve(result); // 2. Pass result to the NEXT promise
        } catch (err) {
          nextReject(err);
        }
      };

      if (isFulfilled) {
        handleCallback(value); // Sync execution
      } else {
        // Async: Store the handler to run later
        onResolve = function (val) {
          handleCallback(val);
        };
      }
    });
  };

  this.catch = function (callback) {
    // Mirror logic for reject...
    return this.then(undefined, callback);
  };

  try {
    executor(resolve, reject);
  } catch (err) {
    reject(err);
  }
}
