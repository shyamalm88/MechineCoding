# First Unique Number (LeetCode #1429)

> First Unique Number (LeetCode #1429)

Implement FirstUnique:
- FirstUnique(int[] nums): initializes with the numbers in the queue.
- int showFirstUnique(): returns the value of the first unique integer in
```text
  the queue, or -1 if there is none.
```

- void add(int value): inserts value at the back of the queue.

Example:
Input:
["FirstUnique","showFirstUnique","add","showFirstUnique","add","showFirstUnique","add","showFirstUnique"]
[[[2,3,5]],[],[5],[],[2],[],[3],[]]

Output: [null,2,null,2,null,3,null,-1]

Explanation:
FirstUnique fu = new FirstUnique([2,3,5]);
fu.showFirstUnique(); // 2          queue=[2,3,5], all unique, 2 is first
fu.add(5);            // queue=[2,3,5,5]
fu.showFirstUnique(); // 2          2 still first AND still unique
fu.add(2);            // queue=[2,3,5,5,2]
fu.showFirstUnique(); // 3          2 is no longer unique, 3 is next
fu.add(3);            // queue=[2,3,5,5,2,3]
fu.showFirstUnique(); // -1         no unique numbers remain

Constraints:
- 1 <= nums.length <= 10^5
- 1 <= value <= 10^8
- At most 10^5 calls to add and showFirstUnique
