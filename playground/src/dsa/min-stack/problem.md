# Min Stack (LeetCode #155)

Design a stack that supports push, pop, top, and retrieving the minimum element
in constant time.

Implement the MinStack class:
- MinStack() initializes the stack object.
- void push(int val) pushes the element val onto the stack.
- void pop() removes the element on the top of the stack.
- int top() gets the top element of the stack.
- int getMin() retrieves the minimum element in the stack.

You must write an algorithm with O(1) time complexity for each function.

## Approach

Two Stacks

## Intuition

We maintain two stacks:
1. `stack`: Stores the actual values.
2. `minStack`: Stores the minimum value encountered *so far* at each level.

When pushing `val`, we push `val` to `stack`. For `minStack`, we push
`min(val, currentMin)`. This ensures the top of `minStack` is always the
minimum for the current state of `stack`.
