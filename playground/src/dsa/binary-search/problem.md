# Binary Search (LeetCode #704)

> Binary Search (LeetCode #704)

Return the index of target in a sorted array, or -1.

## Intuition

The template everything else in this category is built on. Three details are
where bugs live:

 1. `mid = low + Math.floor((high - low) / 2)` rather than (low+high)/2 --
```text
    the latter can overflow in fixed-width languages. Harmless in JS, but
    interviewers look for it.
```

 2. `while (low <= high)` with an INCLUSIVE high. Using `<` skips the final
```text
    single-element window.
```

 3. Move past mid (`mid + 1` / `mid - 1`), never to mid, or the range never
```text
    shrinks and it loops forever.
```

## Dry run

[-1,0,3,5,9,12] target 9
```text
  lo0 hi5 mid2 (3<9) → lo3
  lo3 hi5 mid4 (9==9) → return 4
```

## Time

O(log n)   SPACE: O(1)
