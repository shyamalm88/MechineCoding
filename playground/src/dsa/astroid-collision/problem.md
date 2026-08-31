# Asteroid Collision (LeetCode #735)

We are given an array asteroids of integers representing asteroids in a row.
For each asteroid, the absolute value represents its size, and the sign
represents its direction (positive meaning right, negative meaning left).

Each asteroid moves at the same speed. Find out the state of the asteroids
after all collisions. If two asteroids meet, the smaller one will explode.
If both are the same size, both will explode. Two asteroids moving in the
same direction will never meet.

Example 1:
Input: asteroids = [5,10,-5]
Output: [5,10]
Explanation: The 10 and -5 collide resulting in 10. The 5 and 10 never collide.

Example 2:
Input: asteroids = [8,-8]
Output: []
Explanation: The 8 and -8 collide exploding each other.

Example 3:
Input: asteroids = [10,2,-5]
Output: [10]
Explanation: The 2 and -5 collide resulting in -5. The 10 and -5 collide resulting in 10.

## Approach

Stack

## Intuition

Iterate through the asteroids. Use a stack to keep track of stable asteroids.
- If an asteroid is moving Right (> 0), push it (it won't collide with previous ones).
- If an asteroid is moving Left (< 0), it collides with Right-moving asteroids
```text
  at the top of the stack.
  - If Top < |Current|, Top explodes (pop). Check next.
  - If Top == |Current|, Both explode (pop, stop).
  - If Top > |Current|, Current explodes (stop).
```

Time Complexity: O(N)
Space Complexity: O(N)
