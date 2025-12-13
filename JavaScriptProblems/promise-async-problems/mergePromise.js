const mergePromise = (p1, p2) => {
  let unresolved = 2;
  let p1result, p2result;
  return new Promise((resolve, reject) => {
    const then = () => {
      unresolved--;
      if (unresolved === 0) {
        resolve(mergeResults(p1result, p2result));
      }
    };

    p1.then((data) => {
      p1result = data;
      then();
    }).catch((err) => reject(err));

    p2.then((data) => {
      p2result = data;
      then();
    }).catch((err) => reject(err));
  });
};

function mergeResults(p1, p2) {
  if (
    (typeof p1 === "number" && typeof p2 === "number") ||
    (typeof p1 === "string" && typeof p2 === "string")
  ) {
    return p1 + p2;
  }
  if (Array.isArray(p) && Array.isArray(p2)) {
    return [...p, ...p2];
  }

  if (typeof p1 == "object" && typeof p2 === "object") {
    return { ...p1, ...p2 };
  }

  throw "error: not possible to merge";
}
