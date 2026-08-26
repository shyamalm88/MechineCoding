# Wordle - Quick Reference Card 🎯

## TL;DR - The Core Algorithm in 10 Lines

```javascript
function evaluateGuess(guess, target) {
  const result = Array(5).fill(null)
  const freq = {}

  // Pass 1: Mark greens, build frequency map
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) result[i] = 'correct'
    else freq[target[i]] = (freq[target[i]] || 0) + 1
  }

  // Pass 2: Mark yellows/grays
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue
    if (freq[guess[i]] > 0) {
      result[i] = 'present'
      freq[guess[i]]--
    } else {
      result[i] = 'absent'
    }
  }

  return result
}
```

---

## 🎨 Color Codes

```javascript
const COLORS = {
  CORRECT: '#6aaa64',  // 🟩 Green
  PRESENT: '#c9b458',  // 🟨 Yellow
  ABSENT:  '#787c7e',  // ⬛ Gray
  DEFAULT: '#d3d6da',  // ⬜ Empty
}
```

---

## 📊 State Cheat Sheet

```javascript
// Pick once on mount, never changes
const [targetWord] = useState(() => getRandomWord())

// Array of submitted guesses
const [guesses, setGuesses] = useState([])

// Current input (not submitted yet)
const [currentGuess, setCurrentGuess] = useState('')

// 'playing' | 'won' | 'lost'
const [gameStatus, setGameStatus] = useState('playing')
```

---

## ⌨️ Input Handling

```javascript
function handleKeyPress(key) {
  if (gameStatus !== 'playing') return

  if (key === 'ENTER') {
    if (currentGuess.length === 5) submitGuess()
  }
  else if (key === 'BACKSPACE') {
    setCurrentGuess(prev => prev.slice(0, -1))
  }
  else if (/^[A-Z]$/.test(key) && currentGuess.length < 5) {
    setCurrentGuess(prev => prev + key)
  }
}
```

---

## ✅ Win/Lose Logic

```javascript
function submitGuess() {
  // Validate
  if (currentGuess.length !== 5) return

  // Evaluate
  const evaluation = evaluateGuess(currentGuess)

  // Update guesses
  const newGuesses = [...guesses, currentGuess]
  setGuesses(newGuesses)
  setCurrentGuess('')

  // Check win
  if (currentGuess === targetWord) {
    setGameStatus('won')
    return
  }

  // Check lose
  if (newGuesses.length >= 6) {
    setGameStatus('lost')
  }
}
```

---

## 🔍 Common Test Cases

### Test 1: No duplicates
```
Target: REACT
Guess:  SLATE
Result: ⬛ ⬛ 🟨 🟨 🟨
```

### Test 2: Duplicate letters (classic case)
```
Target: ROBOT
Guess:  FLOOR
Result: ⬛ ⬛ 🟨 🟩 🟨
         F  L  O  O  R
              ↑  ↑  ↑
              │  │  └─ Yellow (R exists)
              │  └──── Green (exact match)
              └─────── Yellow (O exists)
```

### Test 3: All same letter
```
Target: SPEED
Guess:  EEEEE
Result: 🟨 🟨 🟩 🟨 ⬛
(SPEED has 3 E's → first 3 colored, last 2 gray)
```

### Test 4: All correct
```
Target: REACT
Guess:  REACT
Result: 🟩 🟩 🟩 🟩 🟩
(Game won!)
```

### Test 5: All wrong
```
Target: REACT
Guess:  BOWLS
Result: ⬛ ⬛ ⬛ ⬛ ⬛
```

---

## 🐛 Common Bugs & Fixes

### Bug 1: Single-pass algorithm
```javascript
// ❌ WRONG
if (target.includes(letter)) result[i] = 'present'

// ✅ CORRECT
if (freq[letter] > 0) {
  result[i] = 'present'
  freq[letter]--
}
```

### Bug 2: Not building frequency map
```javascript
// ❌ WRONG - Building full frequency map before checking greens
const freq = {}
for (let char of target) freq[char] = (freq[char] || 0) + 1

// ✅ CORRECT - Build only for non-green letters
for (let i = 0; i < 5; i++) {
  if (guess[i] !== target[i]) {
    freq[target[i]] = (freq[target[i]] || 0) + 1
  }
}
```

### Bug 3: Checking includes() after marking green
```javascript
// ❌ WRONG - Green letters still in pool
for (let i = 0; i < 5; i++) {
  if (guess[i] === target[i]) result[i] = 'correct'
}
for (let i = 0; i < 5; i++) {
  if (target.includes(guess[i])) result[i] = 'present' // BUG!
}

// ✅ CORRECT - Skip greens in Pass 2
for (let i = 0; i < 5; i++) {
  if (result[i] === 'correct') continue
  if (freq[guess[i]] > 0) result[i] = 'present'
}
```

---

## 🎯 Interview Questions & Answers

### Q: Why two passes?
**A:** Green letters must be removed from the pool before checking yellows. Otherwise duplicate letters break.

### Q: Why decrement frequency?
**A:** To respect letter count. If target has 1 'O' and guess has 3 'O's, only 1 should be colored.

### Q: What if I process left-to-right in one pass?
**A:** Fails for cases like `ROBOT` vs `FLOOR` - you'd mark both O's as yellow before seeing the green match.

### Q: Can I use a Set instead of frequency map?
**A:** No! Sets don't track **count**. You need to know **how many** of each letter exist.

### Q: Why separate `guesses` and `currentGuess`?
**A:**
- `guesses` = immutable history (submitted)
- `currentGuess` = mutable input (can be edited with backspace)

---

## 🚀 Performance

| Operation | Time | Space |
|-----------|------|-------|
| Evaluate guess | O(5) = O(1) | O(5) = O(1) |
| Submit guess | O(5) = O(1) | O(1) |
| Render grid | O(30) = O(1) | O(1) |
| **Overall** | **O(1)** | **O(1)** |

All operations are constant time because word length is fixed at 5!

---

## 📝 Interview Checklist

Before your interview, make sure you can:

- ✅ Explain the two-pass algorithm
- ✅ Code the `evaluateGuess()` function from scratch
- ✅ Handle the `ROBOT`/`FLOOR` test case correctly
- ✅ Explain why frequency map is needed
- ✅ Implement basic input handling (type, enter, backspace)
- ✅ Check win/lose conditions
- ✅ Render the grid with correct colors

---

## 🎓 Learning Resources

1. **[EXPLANATION.md](./EXPLANATION.md)** - Detailed walkthrough with examples
2. **[VISUAL_GUIDE.md](./VISUAL_GUIDE.md)** - Animated diagrams
3. **[SimplifiedWordle.jsx](./SimplifiedWordle.jsx)** - Code with console logs
4. **[Solution.jsx](./Solution.jsx)** - Production-ready version

---

## 💡 One-Liner Summary

> Wordle uses a **two-pass algorithm**: first mark exact matches (green), then check remaining letters against a frequency map for present (yellow) or absent (gray).

---

**Good luck with your interview! 🍀**
