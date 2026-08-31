# Gas Station (LeetCode #134)

There are n gas stations along a circular route, where the amount of gas at
the ith station is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to
travel from the ith station to its next (i + 1)th station. You begin the
journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's
index if you can travel around the circuit once in the clockwise direction,
otherwise return -1. If there exists a solution, it is guaranteed to be
unique.

Example 1:
Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]
Output: 3
Explanation: Start at station 3 (index 3) and fill up with 4 unit of gas.
Your tank = 0 + 4 = 4
Travel to station 4. Your tank = 4 - 1 + 5 = 8
...

Constraints:
- n == gas.length == cost.length
- 1 <= n <= 10^5

## Approach

Greedy (One Pass)

## Intuition

1. Global Check: If total gas < total cost, it's impossible to complete the
```text
   circuit. We can check this by summing differences.
```

2. Local Check: If we start at A and run out of gas before reaching B, then
```text
   no station between A and B can be a starting point. Why? Because A gave
   us some positive gas to start with. If we failed starting with that boost,
   starting at an intermediate station with 0 gas will fail even faster.
   So, we greedily jump our start point to B (current index + 1).
```

## Dry run

Input: gas = [1, 2, 3, 4, 5], cost = [3, 4, 5, 1, 2]

1. Initialize: totalGas = 0, currentGas = 0, start = 0

2. i=0: net = 1 - 3 = -2.
```text
   - totalGas = -2. currentGas = -2.
   - currentGas < 0? Yes.
   - Reset: start = 1, currentGas = 0.
```

3. i=1: net = 2 - 4 = -2.
```text
   - totalGas = -4. currentGas = -2.
   - currentGas < 0? Yes.
   - Reset: start = 2, currentGas = 0.
```

4. i=2: net = 3 - 5 = -2.
```text
   - totalGas = -6. currentGas = -2.
   - currentGas < 0? Yes.
   - Reset: start = 3, currentGas = 0.
```

5. i=3: net = 4 - 1 = 3.
```text
   - totalGas = -3. currentGas = 3.
   - currentGas < 0? No.
```

6. i=4: net = 5 - 2 = 3.
```text
   - totalGas = 0. currentGas = 6.
   - currentGas < 0? No.
```

7. End Loop. totalGas (0) >= 0? Yes. Return start (3).

Time Complexity: O(N) - Single pass through the arrays.
Space Complexity: O(1) - Constant extra space.

@param {number[]} gas
@param {number[]} cost
@return {number}
