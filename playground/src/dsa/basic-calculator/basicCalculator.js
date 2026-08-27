const calculate = (s) => {
  const stack = [];
  let result = 0;
  let num = 0;
  let sign = 1;

  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      num = num * 10 + Number(ch); // multi-digit
    } else if (ch === '+' || ch === '-') {
      result += sign * num;
      num = 0;
      sign = ch === '+' ? 1 : -1;
    } else if (ch === '(') {
      stack.push(result, sign); // remember the outer context
      result = 0;
      sign = 1;
    } else if (ch === ')') {
      result += sign * num;
      num = 0;
      const outerSign = stack.pop();
      const outerResult = stack.pop();
      result = result * outerSign + outerResult;
    }
    // spaces ignored
  }
  return result + sign * num; // flush the trailing number
};

console.log(calculate('1 + 1')); // 2
console.log(calculate(' 2-1 + 2 ')); // 3
console.log(calculate('(1+(4+5+2)-3)+(6+8)')); // 23
console.log(calculate('-(3+4)')); // -7 -- leading unary minus
