const minRemoveToMakeValid = (s) => {
  const stack = [];
  const remove = new Set();

  // Pass 1: Identify invalid parentheses
  for (let i = 0; i < s.length; i++) {
    if (s[i] === "(") {
      // Store index of open parenthesis
      stack.push(i);
    } else if (s[i] === ")") {
      if (stack.length) {
        // Found a match for an open parenthesis
        stack.pop();
      } else {
        // Unmatched closing parenthesis, mark for removal
        remove.add(i);
      }
    }
  }

  // Any remaining open parentheses in stack are unmatched
  while (stack.length) {
    remove.add(stack.pop());
  }

  // Pass 2: Build the valid string
  let result = "";
  for (let i = 0; i < s.length; i++) {
    if (!remove.has(i)) {
      result += s[i];
    }
  }
  return result;
};
