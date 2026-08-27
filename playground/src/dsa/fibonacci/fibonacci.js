const fibNaive = (n) => (n < 2 ? n : fibNaive(n - 1) + fibNaive(n - 2));

const fibMemo = (n, memo = new Map()) => {
  if (n < 2) return n;
  if (memo.has(n)) return memo.get(n);
  const value = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
  memo.set(n, value);
  return value;
};

const fib = (n) => {
  if (n < 2) return n;
  let prev = 0, curr = 1;
  for (let i = 2; i <= n; i++) [prev, curr] = [curr, prev + curr];
  return curr;
};

console.log(fib(10), fibMemo(10), fibNaive(10)); // 55 55 55
console.log(fib(50)); // 12586269025 -- naive would take years
