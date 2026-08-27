const sumSubarrayMins = (arr) => {
  const MOD = 1_000_000_007n;
  const n = arr.length;
  const left = new Array(n);  // # of subarrays extending left where arr[i] is min
  const right = new Array(n);
  const stack = [];

  // previous STRICTLY smaller
  for (let i = 0; i < n; i++) {
    while (stack.length && arr[stack[stack.length - 1]] >= arr[i]) stack.pop();
    left[i] = stack.length ? i - stack[stack.length - 1] : i + 1;
    stack.push(i);
  }

  stack.length = 0;
  // next smaller OR EQUAL -- the asymmetry prevents double counting duplicates
  for (let i = n - 1; i >= 0; i--) {
    while (stack.length && arr[stack[stack.length - 1]] > arr[i]) stack.pop();
    right[i] = stack.length ? stack[stack.length - 1] - i : n - i;
    stack.push(i);
  }

  let total = 0n;
  for (let i = 0; i < n; i++) {
    total = (total + BigInt(arr[i]) * BigInt(left[i]) * BigInt(right[i])) % MOD;
  }
  return Number(total);
};

console.log(sumSubarrayMins([3, 1, 2, 4]));            // 17
console.log(sumSubarrayMins([11, 81, 94, 43, 3]));     // 444
console.log(sumSubarrayMins([2, 2, 2]));               // 12 -- duplicates handled
