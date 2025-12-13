# Wordle Algorithm - Step-by-Step Visual Guide

## The Problem

Given a **target word** and a **guess**, assign each letter in the guess one of three colors:
- 🟩 **Green (correct)**: Letter matches the exact position in target
- 🟨 **Yellow (present)**: Letter exists in target but wrong position
- ⬛ **Gray (absent)**: Letter doesn't exist in target (or all instances are used up)

---

## Example Walkthrough

### Target: `ROBOT`
### Guess: `FLOOR`

Let's trace through the algorithm step by step.

---

## Step 1: Initialize

```javascript
const target = "ROBOT"
const guess = "FLOOR"

// Result array to store colors for each position
const result = [null, null, null, null, null]

// Frequency map to track available letters in target
const targetFreq = {}
```

---

## Step 2: PASS 1 - Mark Exact Matches (GREEN)

**Goal:** Find letters that match the exact position.

**Process each position:**

```
Position 0: guess[0]='F', target[0]='R'
  ❌ Not a match
  ✅ Add 'R' to frequency map: targetFreq = { 'R': 1 }

Position 1: guess[1]='L', target[1]='O'
  ❌ Not a match
  ✅ Add 'O' to frequency map: targetFreq = { 'R': 1, 'O': 1 }

Position 2: guess[2]='O', target[2]='B'
  ❌ Not a match
  ✅ Add 'B' to frequency map: targetFreq = { 'R': 1, 'O': 1, 'B': 1 }

Position 3: guess[3]='O', target[3]='O'
  ✅ EXACT MATCH! Mark as GREEN
  result[3] = 'correct'
  ⚠️ Don't add this 'O' to frequency map (it's already used)

Position 4: guess[4]='R', target[4]='T'
  ❌ Not a match
  ✅ Add 'T' to frequency map: targetFreq = { 'R': 1, 'O': 1, 'B': 1, 'T': 1 }
```

**After Pass 1:**
```
result = [null, null, null, 'correct', null]
           F     L     O       O         R

targetFreq = {
  'R': 1,  // Available for yellow matching
  'O': 1,  // Available for yellow matching (one O already used by green)
  'B': 1,  // Available for yellow matching
  'T': 1   // Available for yellow matching
}
```

---

## Step 3: PASS 2 - Check Present or Absent (YELLOW/GRAY)

**Goal:** For non-green letters, check if they exist in the remaining pool.

**Process each position:**

```
Position 0: guess[0]='F'
  Already green? ❌ No (result[0] is null)
  Is 'F' in targetFreq? ❌ No
  ✅ Mark as ABSENT (gray)
  result[0] = 'absent'

Position 1: guess[1]='L'
  Already green? ❌ No (result[1] is null)
  Is 'L' in targetFreq? ❌ No
  ✅ Mark as ABSENT (gray)
  result[1] = 'absent'

Position 2: guess[2]='O'
  Already green? ❌ No (result[2] is null)
  Is 'O' in targetFreq? ✅ Yes! targetFreq['O'] = 1
  ✅ Mark as PRESENT (yellow)
  result[2] = 'present'
  ⚠️ Consume one 'O': targetFreq['O'] = 0

Position 3: guess[3]='O'
  Already green? ✅ YES (result[3] is 'correct')
  ⏭️ Skip (already processed in Pass 1)

Position 4: guess[4]='R'
  Already green? ❌ No (result[4] is null)
  Is 'R' in targetFreq? ✅ Yes! targetFreq['R'] = 1
  ✅ Mark as PRESENT (yellow)
  result[4] = 'present'
  ⚠️ Consume one 'R': targetFreq['R'] = 0
```

**After Pass 2:**
```
result = ['absent', 'absent', 'present', 'correct', 'present']
           F         L         O          O          R
           ⬛        ⬛        🟨         🟩         🟨
```

---

## Final Result

```
F → ⬛ Gray (not in ROBOT)
L → ⬛ Gray (not in ROBOT)
O → 🟨 Yellow (in ROBOT but wrong position - matches position 1)
O → 🟩 Green (exact match at position 3)
R → 🟨 Yellow (in ROBOT but wrong position - matches position 0)
```

Perfect! ✅

---

## Code Implementation

```javascript
function evaluateGuess(guess, target) {
  const result = Array(5).fill(null)
  const targetFreq = {}

  // ========== PASS 1: Mark Exact Matches ==========
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      // Exact match! Mark as green
      result[i] = 'correct'
    } else {
      // Not a match, add target letter to frequency map
      // This letter is still available for yellow matching
      targetFreq[target[i]] = (targetFreq[target[i]] || 0) + 1
    }
  }

  // ========== PASS 2: Check Present or Absent ==========
  for (let i = 0; i < 5; i++) {
    // Skip if already marked as correct
    if (result[i] === 'correct') continue

    const letter = guess[i]

    // Check if this letter is available in the frequency map
    if (targetFreq[letter] && targetFreq[letter] > 0) {
      // Letter exists! Mark as yellow
      result[i] = 'present'
      // Consume one instance of this letter
      targetFreq[letter]--
    } else {
      // Letter doesn't exist (or all instances used up)
      result[i] = 'absent'
    }
  }

  return result
}
```

---

## Why Two Passes?

### ❌ Single Pass Approach (WRONG)

```javascript
// This DOESN'T work for duplicates!
for (let i = 0; i < 5; i++) {
  if (guess[i] === target[i]) {
    result[i] = 'correct'
  } else if (target.includes(guess[i])) {
    result[i] = 'present'  // ❌ Wrong! Doesn't track frequency
  } else {
    result[i] = 'absent'
  }
}
```

**Problem:** If target is `ROBOT` and guess is `OOOOO`:
- All 5 O's would be marked yellow (wrong!)
- Reality: Only 2 O's should be colored (target only has 2 O's)

---

### ✅ Two Pass Approach (CORRECT)

**Pass 1:** Reserve exact matches first (highest priority)
**Pass 2:** Use remaining letters for yellow matches

This ensures:
1. Green matches take priority
2. Frequency is respected (can't use more letters than exist in target)
3. Duplicate letters are handled correctly

---

## Another Tricky Example

### Target: `SPEED`
### Guess: `ERASE`

**Pass 1: Mark Greens**
```
E R A S E
│ │ │ │ │
│ │ │ │ └─ E matches position 4 → GREEN
│ │ │ └─── S not at position 3
│ │ └───── A not at position 2
│ └─────── R not at position 1
└───────── E not at position 0

result = [null, null, null, null, 'correct']
targetFreq = { 'S': 1, 'P': 1, 'E': 2 }
                                    ↑ Only 2 E's available (one already used for green)
```

**Pass 2: Check Yellow/Gray**
```
Position 0: E
  Is 'E' available? ✅ Yes! targetFreq['E'] = 2
  Mark YELLOW, consume: targetFreq['E'] = 1

Position 1: R
  Is 'R' available? ❌ No
  Mark GRAY

Position 2: A
  Is 'A' available? ❌ No
  Mark GRAY

Position 3: S
  Is 'S' available? ✅ Yes! targetFreq['S'] = 1
  Mark YELLOW, consume: targetFreq['S'] = 0

Position 4: E (already green, skip)
```

**Final Result:**
```
E → 🟨 Yellow (E exists in SPEED, wrong position)
R → ⬛ Gray (R not in SPEED)
A → ⬛ Gray (A not in SPEED)
S → 🟨 Yellow (S exists in SPEED, wrong position)
E → 🟩 Green (E at correct position)
```

Perfect! ✅

---

## Key Takeaways

1. **Always use two passes** for correct duplicate letter handling
2. **Pass 1** marks exact matches (green) and builds frequency map
3. **Pass 2** checks remaining letters against frequency map
4. **Consume letters** as you use them (decrement frequency)
5. **Green takes priority** - process greens before yellows

---

## Common Mistakes

### ❌ Mistake 1: Checking `includes()` without frequency

```javascript
if (target.includes(guess[i])) {
  result[i] = 'present'  // Wrong! Doesn't track how many instances
}
```

### ❌ Mistake 2: Not building frequency map in Pass 1

```javascript
// Wrong! Building frequency before removing greens
const targetFreq = {}
for (let char of target) {
  targetFreq[char] = (targetFreq[char] || 0) + 1
}
// Now greens will consume from this pool incorrectly
```

### ❌ Mistake 3: Single pass with frequency check

```javascript
// Wrong! Green and yellow processed together
for (let i = 0; i < 5; i++) {
  if (guess[i] === target[i]) {
    result[i] = 'correct'
    targetFreq[guess[i]]--  // ❌ Green shouldn't consume from yellow pool
  }
}
```

---

## Practice Problems

Try these on paper:

1. Target: `ABBEY`, Guess: `BABES`
2. Target: `ROBOT`, Guess: `FLOOR`
3. Target: `SPEED`, Guess: `EEEEE`
4. Target: `TALES`, Guess: `LEAST`

<details>
<summary>Click for answers</summary>

1. `ABBEY` vs `BABES`:
   - B: yellow (B in ABBEY, wrong position)
   - A: yellow (A in ABBEY, wrong position)
   - B: green (B matches position 2)
   - E: yellow (E in ABBEY, wrong position)
   - S: gray (S not in ABBEY)

2. `ROBOT` vs `FLOOR`:
   - F: gray, L: gray, O: yellow, O: green, R: yellow

3. `SPEED` vs `EEEEE`:
   - E: yellow, E: yellow, E: green, E: yellow, E: gray
   (Only 3 E's in SPEED, so last E is gray)

4. `TALES` vs `LEAST`:
   - L: yellow, E: yellow, A: yellow, S: yellow, T: yellow
</details>

---

Now you understand the core algorithm! 🎉
