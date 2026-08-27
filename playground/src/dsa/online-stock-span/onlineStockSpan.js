class StockSpanner {
  constructor() {
    this.stack = []; // [price, span], strictly decreasing by price
  }

  next(price) {
    let span = 1;
    while (this.stack.length && this.stack[this.stack.length - 1][0] <= price) {
      span += this.stack.pop()[1]; // absorb the popped day's span
    }
    this.stack.push([price, span]);
    return span;
  }
}

const s = new StockSpanner();
console.log([100, 80, 60, 70, 60, 75, 85].map((p) => s.next(p))); // [1,1,1,2,1,4,6]
