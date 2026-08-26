# Wordle Visual Learning Guide 🎯

## 🎨 The Big Picture

```
┌─────────────────────────────────────────────────────────┐
│                    WORDLE GAME FLOW                      │
└─────────────────────────────────────────────────────────┘

1. Random Word Selection
   ↓
2. User Types Letters (currentGuess)
   ↓
3. User Presses ENTER (submitGuess)
   ↓
4. Evaluate Guess (THE CORE ALGORITHM)
   ↓
5. Display Colors (Green/Yellow/Gray)
   ↓
6. Check Win/Lose
   ↓
7. Repeat or Game Over
```

---

## 📊 State Breakdown

Think of React state as a scoreboard that updates as you play:

```javascript
┌────────────────────────────────────────────────┐
│              GAME STATE                         │
├────────────────────────────────────────────────┤
│                                                 │
│  targetWord: "ROBOT"  ← Chosen once, never     │
│                          changes                │
│                                                 │
│  guesses: [           ← History of submitted   │
│    "SLATE",              guesses (immutable)    │
│    "GREAT"                                      │
│  ]                                              │
│                                                 │
│  currentGuess: "FLO"  ← What you're typing     │
│                          right now              │
│                          (mutable, changes as   │
│                           you type)             │
│                                                 │
│  gameStatus: "playing" ← playing | won | lost  │
│                                                 │
└────────────────────────────────────────────────┘
```

---

## 🔍 The Two-Pass Algorithm (Animated)

### Example: Target = `ROBOT`, Guess = `FLOOR`

#### BEFORE ALGORITHM RUNS

```
Target:  R O B O T
         0 1 2 3 4

Guess:   F L O O R
         0 1 2 3 4

Result:  ? ? ? ? ?  ← We need to fill this!
```

---

### PASS 1: Find Exact Matches (Green) 🟩

**Goal:** Mark letters that are in the **exact same position**.

```
Step 1.1: Compare position 0
┌─────────────────────────────────┐
│ Target[0] = 'R'                 │
│ Guess[0]  = 'F'                 │
│ Match? NO ❌                     │
│                                 │
│ Action: Add 'R' to targetFreq   │
│ targetFreq = { 'R': 1 }         │
└─────────────────────────────────┘

Step 1.2: Compare position 1
┌─────────────────────────────────┐
│ Target[1] = 'O'                 │
│ Guess[1]  = 'L'                 │
│ Match? NO ❌                     │
│                                 │
│ Action: Add 'O' to targetFreq   │
│ targetFreq = { 'R': 1, 'O': 1 } │
└─────────────────────────────────┘

Step 1.3: Compare position 2
┌─────────────────────────────────┐
│ Target[2] = 'B'                 │
│ Guess[2]  = 'O'                 │
│ Match? NO ❌                     │
│                                 │
│ Action: Add 'B' to targetFreq   │
│ targetFreq = {                  │
│   'R': 1,                       │
│   'O': 1,                       │
│   'B': 1                        │
│ }                               │
└─────────────────────────────────┘

Step 1.4: Compare position 3 ⭐ MATCH!
┌─────────────────────────────────┐
│ Target[3] = 'O'                 │
│ Guess[3]  = 'O'                 │
│ Match? YES! ✅                   │
│                                 │
│ Action: Mark as GREEN           │
│ result[3] = 'correct'           │
│                                 │
│ ⚠️ DO NOT add this 'O' to       │
│   targetFreq (already used!)    │
└─────────────────────────────────┘

Step 1.5: Compare position 4
┌─────────────────────────────────┐
│ Target[4] = 'T'                 │
│ Guess[4]  = 'R'                 │
│ Match? NO ❌                     │
│                                 │
│ Action: Add 'T' to targetFreq   │
│ targetFreq = {                  │
│   'R': 1,                       │
│   'O': 1,  ← Still only 1!      │
│   'B': 1,     (didn't add the   │
│   'T': 1      O from position 3)│
│ }                               │
└─────────────────────────────────┘
```

**After Pass 1:**

```
Result:  ? ? ? ✅ ?
         F L O O R
              ↑
              Green! Exact match
```

---

### PASS 2: Find Yellow/Gray 🟨⬛

**Goal:** For remaining letters, check if they exist in `targetFreq`.

```
Available letters in pool:
┌──────────────────────┐
│ targetFreq = {       │
│   'R': 1,            │
│   'O': 1,            │
│   'B': 1,            │
│   'T': 1             │
│ }                    │
└──────────────────────┘
```

---

```
Step 2.1: Check position 0 (F)
┌─────────────────────────────────┐
│ Already green? NO               │
│ Is 'F' in targetFreq? NO ❌     │
│                                 │
│ Action: Mark as GRAY            │
│ result[0] = 'absent'            │
└─────────────────────────────────┘

Result:  ⬛ ? ? ✅ ?
         F  L O O  R


Step 2.2: Check position 1 (L)
┌─────────────────────────────────┐
│ Already green? NO               │
│ Is 'L' in targetFreq? NO ❌     │
│                                 │
│ Action: Mark as GRAY            │
│ result[1] = 'absent'            │
└─────────────────────────────────┘

Result:  ⬛ ⬛ ? ✅ ?
         F  L  O O  R


Step 2.3: Check position 2 (O)
┌─────────────────────────────────┐
│ Already green? NO               │
│ Is 'O' in targetFreq? YES! ✅   │
│ targetFreq['O'] = 1             │
│                                 │
│ Action: Mark as YELLOW          │
│ result[2] = 'present'           │
│                                 │
│ Consume one 'O':                │
│ targetFreq['O'] = 0             │
└─────────────────────────────────┘

Result:  ⬛ ⬛ 🟨 ✅ ?
         F  L  O  O  R

Pool after consuming:
┌──────────────────────┐
│ targetFreq = {       │
│   'R': 1,            │
│   'O': 0,  ← Used up!│
│   'B': 1,            │
│   'T': 1             │
│ }                    │
└──────────────────────┘


Step 2.4: Check position 3 (O)
┌─────────────────────────────────┐
│ Already green? YES ✅            │
│                                 │
│ Action: SKIP (already processed)│
└─────────────────────────────────┘

Result:  ⬛ ⬛ 🟨 🟩 ?
         F  L  O  O  R


Step 2.5: Check position 4 (R)
┌─────────────────────────────────┐
│ Already green? NO               │
│ Is 'R' in targetFreq? YES! ✅   │
│ targetFreq['R'] = 1             │
│                                 │
│ Action: Mark as YELLOW          │
│ result[4] = 'present'           │
│                                 │
│ Consume one 'R':                │
│ targetFreq['R'] = 0             │
└─────────────────────────────────┘

Result:  ⬛ ⬛ 🟨 🟩 🟨
         F  L  O  O  R
```

---

### FINAL RESULT ✅

```
Target:  R  O  B  O  T
Guess:   F  L  O  O  R
Result:  ⬛ ⬛ 🟨 🟩 🟨
         ↑  ↑  ↑  ↑  ↑
         │  │  │  │  └─ Yellow: R exists at position 0
         │  │  │  └──── Green: O matches position 3
         │  │  └─────── Yellow: O exists at position 1
         │  └────────── Gray: L not in ROBOT
         └───────────── Gray: F not in ROBOT
```

Perfect! 🎉

---

## 🧩 Why Two Passes?

### The Problem with Single Pass

```javascript
// ❌ WRONG: Single pass approach

for (let i = 0; i < 5; i++) {
  if (guess[i] === target[i]) {
    result[i] = 'correct'
  } else if (target.includes(guess[i])) {
    result[i] = 'present'  // ❌ BUG!
  } else {
    result[i] = 'absent'
  }
}
```

**What goes wrong?**

Example: Target = `ROBOT`, Guess = `OOOOO`

```
Position 0: O
  Is O === R? NO
  Does ROBOT include O? YES ✅
  Mark as YELLOW ❌ Wrong!

Position 1: O
  Is O === O? YES
  Mark as GREEN ✅ Correct!

Position 2: O
  Is O === B? NO
  Does ROBOT include O? YES ✅
  Mark as YELLOW ❌ Wrong!

Position 3: O
  Is O === O? YES
  Mark as GREEN ✅ Correct!

Position 4: O
  Is O === T? NO
  Does ROBOT include O? YES ✅
  Mark as YELLOW ❌ Wrong! (No more O's available!)

Result: 🟨 🟩 🟨 🟩 🟨
         ↑       ↑       ↑
         Wrong!  Wrong!  Wrong!

Correct result should be: ⬛ 🟩 ⬛ 🟩 ⬛
(ROBOT only has 2 O's, so only 2 can be colored)
```

---

### The Solution: Two-Pass with Frequency Map

```
PASS 1: Reserve greens first
  → Removes exact matches from the pool

PASS 2: Use remaining pool for yellows
  → Respects letter frequency
  → Can't use more than what's available
```

---

## 🎮 Game Flow Diagram

```
┌─────────────────────────────────────────┐
│  START: Choose random target word       │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  User types letters                     │
│  currentGuess: "" → "F" → "FL" → ...    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  User presses ENTER                     │
│  Check: Is currentGuess 5 letters?      │
└───────────────┬─────────────────────────┘
                │
        ┌───────┴────────┐
        │                 │
       NO                YES
        │                 │
        ▼                 ▼
  Show alert      ┌───────────────────┐
  "Must be 5      │  evaluateGuess()  │
   letters!"      │  Run 2-pass algo  │
                  └─────────┬─────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Update display  │
                  │  Show colors     │
                  └─────────┬────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Add to guesses  │
                  │  Clear current   │
                  └─────────┬────────┘
                            │
                            ▼
                  ┌──────────────────┐
                  │  Check win/lose  │
                  └─────────┬────────┘
                            │
                    ┌───────┴────────┐
                    │                │
                   WIN              LOSE
                    │                │
                    ▼                ▼
              Show "You Win!"  Show "Game Over"
              with # tries     with target word
                    │                │
                    └────────┬───────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │  Play Again?    │
                    │  Reload page    │
                    └─────────────────┘
```

---

## 🎯 Key Concepts Summary

### 1. State Management

```javascript
┌──────────────┐
│   useState   │  ← React hook for state
└──────┬───────┘
       │
       ├─ targetWord (constant)
       ├─ guesses (array, grows over time)
       ├─ currentGuess (string, changes with each keystroke)
       └─ gameStatus (string, changes when win/lose)
```

### 2. Two-Pass Algorithm

```
Input:  guess="FLOOR", target="ROBOT"
        ↓
Pass 1: Find greens, build frequency map
        result = [null, null, null, 'correct', null]
        targetFreq = { 'R': 1, 'O': 1, 'B': 1, 'T': 1 }
        ↓
Pass 2: Check remaining letters against frequency
        result = ['absent', 'absent', 'present', 'correct', 'present']
        ↓
Output: [⬛, ⬛, 🟨, 🟩, 🟨]
```

### 3. Event Handling

```
User Action         →  Handler            →  State Update
─────────────────────────────────────────────────────────
Click "A" button    →  handleKeyPress()  →  currentGuess += 'A'
Press physical "A"  →  handleKeyPress()  →  currentGuess += 'A'
Click ENTER         →  submitGuess()     →  guesses.push(currentGuess)
Press BACKSPACE     →  handleKeyPress()  →  currentGuess = currentGuess.slice(0,-1)
```

---

## 📚 Practice Exercises

### Exercise 1: Trace by Hand

Target: `TALES`, Guess: `LEAST`

1. What is the result after Pass 1?
2. What is targetFreq after Pass 1?
3. What is the final result after Pass 2?

<details>
<summary>Click for answer</summary>

**Pass 1:**
- L ≠ T → targetFreq['T'] = 1
- E ≠ A → targetFreq['A'] = 1
- A ≠ L → targetFreq['L'] = 1
- S ≠ E → targetFreq['E'] = 1
- T ≠ S → targetFreq['S'] = 1

result = [null, null, null, null, null]
targetFreq = { 'T': 1, 'A': 1, 'L': 1, 'E': 1, 'S': 1 }

**Pass 2:**
- L: in targetFreq ✅ → yellow, consume
- E: in targetFreq ✅ → yellow, consume
- A: in targetFreq ✅ → yellow, consume
- S: in targetFreq ✅ → yellow, consume
- T: in targetFreq ✅ → yellow, consume

**Final:** [🟨, 🟨, 🟨, 🟨, 🟨]

All letters exist in TALES but all in wrong positions!
</details>

---

### Exercise 2: Debug This Code

```javascript
// What's wrong with this?
function evaluateGuess(guess, target) {
  const result = []

  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
    } else if (target.includes(guess[i])) {
      result[i] = 'present'
    } else {
      result[i] = 'absent'
    }
  }

  return result
}
```

<details>
<summary>Click for answer</summary>

**Problems:**
1. ❌ Single pass (doesn't handle duplicates)
2. ❌ No frequency tracking
3. ❌ `includes()` doesn't respect letter count

**Test that fails:**
- Target: `ROBOT`
- Guess: `OOOOO`
- Wrong result: All 5 O's become yellow/green
- Correct result: Only 2 O's should be colored
</details>

---

## 🎓 Learning Path

1. ✅ Read [EXPLANATION.md](./EXPLANATION.md) - Understand the algorithm
2. ✅ Run [SimplifiedWordle.jsx](./SimplifiedWordle.jsx) - See console logs
3. ✅ Read this file - Visualize the flow
4. ✅ Study [Solution.jsx](./Solution.jsx) - See production code
5. ✅ Try practice exercises above
6. ✅ Build your own version from scratch!

---

**You're ready to ace the Wordle interview question! 🚀**
