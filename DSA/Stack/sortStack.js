function sortStack(inputStack) {
  let tmpStack = [];

  while (inputStack.length > 0) {
    // Step 1: Pop the top element
    let tmp = inputStack.pop();

    // Step 2: While temporary stack has elements greater than tmp
    while (tmpStack.length > 0 && tmpStack[tmpStack.length - 1] > tmp) {
      // Push them back to the original stack to "make room"
      inputStack.push(tmpStack.pop());
    }

    // Step 3: Push tmp into the correct sorted position in tmpStack
    tmpStack.push(tmp);
  }

  return tmpStack;
}
