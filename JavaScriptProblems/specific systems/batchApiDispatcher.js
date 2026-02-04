export function batchDispatcher({ batchSize, batchDelay, dispatchFn }) {
  let q = [];
  let timer = null;

  const flush = function () {
    let cur = q;
    q = [];

    if (timer) {
      clearInterval(timer);
      timer = null;
    }

    dispatchFn(cur);
  };

  return function enqueue(item) {
    q.push(item);

    if (q.length >= batchSize) {
      flush();
      return;
    }

    timer = setTimeout(() => {
      flush();
    }, batchDelay);
  };
}
