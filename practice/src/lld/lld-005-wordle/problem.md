# Wordle - Word Guessing Game

## What Are We Building?

A clone of the viral word game **Wordle** by Josh Wardle (acquired by The New York Times). Players have **6 attempts** to guess a **5-letter word**, with colored feedback after each guess showing which letters are correct, present in the word, or absent.

Think of it like a combination of Mastermind and Hangman, where you use deductive reasoning and letter frequency knowledge to narrow down possibilities with each guess!

---

## The Problem Statement

Build a web-based Wordle game with the following requirements:

### Core Rules
1. A random 5-letter word is chosen at the start
2. Player has 6 attempts to guess the word
3. After each guess, tiles change color:
   - 🟩 **Green**: Letter is correct and in the right position
   - 🟨 **Yellow**: Letter is in the word but wrong position
   - ⬛ **Gray**: Letter is not in the word at all
4. Game ends when player guesses correctly (win) or uses all 6 attempts (lose)

### Interface Requirements
- 6×5 grid of letter tiles
- Virtual on-screen keyboard with color feedback
- Physical keyboard support
- "Play Again" button after game ends

### Simplified Constraints
- No need to validate if guess is a real English word
- New random word selected each game (not daily word)
- Show target word in dev mode for testing

---

## Visual Example

### Game Flow

**Initial State:**
```
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
[ ] [ ] [ ] [ ] [ ]
```

**After Guess 1: "SLATE"** (Target: "REACT")
```
[S] [L] [A] [T] [E]  ← S=gray, L=gray, A=yellow, T=yellow, E=green
[ ] [ ] [ ] [ ] [ ]
...
```

**After Guess 2: "GREAT"** (Target: "REACT")
```
[S] [L] [A] [T] [E]
[G] [R] [E] [A] [T]  ← G=gray, R=green, E=green, A=green, T=green
...
```

**After Guess 3: "REACT"** (Target: "REACT")
```
[S] [L] [A] [T] [E]
[G] [R] [E] [A] [T]
[R] [E] [A] [C] [T]  ← All green! You win! 🎉
...
```

---

## Color Scheme (Official Wordle Colors)

| State | Color | Hex Code | Meaning |
|-------|-------|----------|---------|
| **Default** | Light Gray | `#d3d6da` | Empty or not yet evaluated |
| **Correct** | Green | `#6aaa64` | Letter in correct position |
| **Present** | Yellow | `#c9b458` | Letter in word, wrong position |
| **Absent** | Dark Gray | `#787c7e` | Letter not in word |

---

## The Challenge: Duplicate Letter Logic

### Challenge 1: Handling Duplicate Letters Correctly

**Wrong Approach:**
```javascript
// ❌ Naive: Check each letter independently
guess.split('').map(letter =>
  target.includes(letter) ? 'present' : 'absent'
)
```

**Problem:** This doesn't account for:
1. **Exact position matches** (should be GREEN, not YELLOW)
2. **Letter frequency** (if target has one 'O' but guess has two 'O's)

**Example Bug:**
- Target: `ROBOT`
- Guess: `FLOOR`
- Naive result: F=gray, L=gray, **O=yellow**, **O=yellow**, R=yellow
- ❌ **Wrong!** Second 'O' should be gray (target only has 2 O's, and first O already matched)

**Correct Approach: Two-Pass Algorithm**

```javascript
function evaluateGuess(guess, target) {
  const result = Array(5).fill(null)
  const targetFreq = {}

  // PASS 1: Mark exact matches (GREEN)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) {
      result[i] = 'correct'
    } else {
      // Build frequency map of remaining target letters
      targetFreq[target[i]] = (targetFreq[target[i]] || 0) + 1
    }
  }

  // PASS 2: Check for present (YELLOW) or absent (GRAY)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue // Skip already marked

    const letter = guess[i]
    if (targetFreq[letter] > 0) {
      result[i] = 'present'
      targetFreq[letter]-- // Consume one instance
    } else {
      result[i] = 'absent'
    }
  }

  return result
}
```

**Correct Result:**
- Target: `ROBOT`
- Guess: `FLOOR`
- Result: F=gray, L=gray, **O=green** (position match), **O=gray** (no more O's left), R=yellow

---

## Key Concepts Explained

### 1. Game State Management

We need to track multiple pieces of state:

```javascript
const [targetWord] = useState(() => getRandomWord()) // Selected once on mount
const [guesses, setGuesses] = useState([])           // ["SLATE", "GREAT", ...]
const [currentGuess, setCurrentGuess] = useState('') // "REA" (being typed)
const [gameStatus, setGameStatus] = useState('playing') // 'playing' | 'won' | 'lost'
const [letterStates, setLetterStates] = useState({}) // { 'A': 'correct', 'B': 'absent', ... }
```

**Why separate `guesses` and `currentGuess`?**
- `guesses`: Submitted and evaluated guesses (immutable history)
- `currentGuess`: Temporary input (can be modified with backspace)

---

### 2. Keyboard Letter States (Priority System)

The virtual keyboard changes color based on letter usage across all guesses:

**Priority Rules:**
- 🟩 **Green (correct)** beats everything
- 🟨 **Yellow (present)** beats gray
- ⬛ **Gray (absent)** is lowest priority

**Example:**
- Guess 1: "SLATE" → A is yellow (present)
- Guess 2: "GREAT" → A is green (correct)
- Keyboard should show A as **green**, not yellow

**Implementation:**
```javascript
function updateLetterStates(guess, evaluation) {
  const newStates = { ...letterStates }

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const state = evaluation[i]

    // Don't downgrade: correct > present > absent
    if (newStates[letter] === 'correct') continue
    if (newStates[letter] === 'present' && state === 'absent') continue

    newStates[letter] = state
  }

  setLetterStates(newStates)
}
```

---

### 3. Keyboard Input Handling

Support both physical and virtual keyboards:

**Physical Keyboard:**
```javascript
useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') submitGuess()
    else if (e.key === 'Backspace') setCurrentGuess(prev => prev.slice(0, -1))
    else if (/^[a-z]$/i.test(e.key)) {
      setCurrentGuess(prev =>
        prev.length < 5 ? prev + e.key.toUpperCase() : prev
      )
    }
  }

  window.addEventListener('keydown', handleKeyDown)
  return () => window.removeEventListener('keydown', handleKeyDown)
}, [currentGuess, gameStatus])
```

**Virtual Keyboard:**
```javascript
<button onClick={() => handleKeyPress('A')}>A</button>
<button onClick={() => handleKeyPress('ENTER')}>ENTER</button>
<button onClick={() => handleKeyPress('BACKSPACE')}>⌫</button>
```

---

### 4. Win/Lose Conditions

**Win Condition:**
```javascript
if (currentGuess === targetWord) {
  setGameStatus('won')
}
```

**Lose Condition:**
```javascript
if (guesses.length >= 6 && currentGuess !== targetWord) {
  setGameStatus('lost')
}
```

**Blocking Input:**
```javascript
const handleKeyPress = (key) => {
  if (gameStatus !== 'playing') return // ✅ Ignore input after game ends
  // ... rest of logic
}
```

---

## The Algorithm (Step-by-Step)

### Step 1: Initialize Game

```javascript
// Select random word on mount (useState with initializer function)
const [targetWord] = useState(() =>
  WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
)

// Initialize empty state
const [guesses, setGuesses] = useState([])
const [currentGuess, setCurrentGuess] = useState('')
const [gameStatus, setGameStatus] = useState('playing')
const [letterStates, setLetterStates] = useState({})
```

---

### Step 2: Handle Letter Input

```javascript
const handleKeyPress = (key) => {
  if (gameStatus !== 'playing') return

  if (key === 'ENTER') {
    // Submit guess
    if (currentGuess.length === 5) {
      submitGuess()
    }
  } else if (key === 'BACKSPACE') {
    // Remove last letter
    setCurrentGuess(prev => prev.slice(0, -1))
  } else if (/^[A-Z]$/.test(key)) {
    // Add letter (max 5)
    if (currentGuess.length < 5) {
      setCurrentGuess(prev => prev + key)
    }
  }
}
```

---

### Step 3: Evaluate Guess (Two-Pass Algorithm)

```javascript
const evaluateGuess = (guess) => {
  const result = Array(5).fill(null)
  const targetFreq = {}

  // Pass 1: Mark exact matches (correct = green)
  for (let i = 0; i < 5; i++) {
    if (guess[i] === targetWord[i]) {
      result[i] = 'correct'
    } else {
      targetFreq[targetWord[i]] = (targetFreq[targetWord[i]] || 0) + 1
    }
  }

  // Pass 2: Check present (yellow) or absent (gray)
  for (let i = 0; i < 5; i++) {
    if (result[i] === 'correct') continue

    const letter = guess[i]
    if (targetFreq[letter] > 0) {
      result[i] = 'present'
      targetFreq[letter]--
    } else {
      result[i] = 'absent'
    }
  }

  return result
}
```

---

### Step 4: Update Keyboard States

```javascript
const updateLetterStates = (guess, evaluation) => {
  const newStates = { ...letterStates }

  for (let i = 0; i < guess.length; i++) {
    const letter = guess[i]
    const state = evaluation[i]

    // Priority: correct > present > absent
    if (newStates[letter] === 'correct') continue
    if (newStates[letter] === 'present' && state === 'absent') continue

    newStates[letter] = state
  }

  setLetterStates(newStates)
}
```

---

### Step 5: Check Win/Lose

```javascript
const submitGuess = () => {
  if (currentGuess.length !== 5) {
    alert('Word must be 5 letters!')
    return
  }

  const evaluation = evaluateGuess(currentGuess)
  updateLetterStates(currentGuess, evaluation)

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

## Edge Cases to Handle

### Edge Case 1: Duplicate Letters

**Problem:** Target has 1 'O', guess has 2 'O's

**Solution:** Use frequency map, consume letters as you match them

**Test Case:**
```javascript
// Target: ROBOT, Guess: FLOOR
// Expected: F=gray, L=gray, O=green, O=gray, R=yellow
```

---

### Edge Case 2: Keyboard Priority

**Problem:** Letter appears in multiple guesses with different states

**Solution:** Priority system: correct > present > absent

**Test Case:**
```javascript
// Guess 1: "SLATE" → T=gray
// Guess 2: "GREAT" → T=yellow
// Keyboard should show T as YELLOW (don't downgrade from yellow to gray)
```

---

### Edge Case 3: Input After Game Ends

**Problem:** User keeps typing after winning/losing

**Solution:** Guard clause at start of `handleKeyPress`

```javascript
if (gameStatus !== 'playing') return
```

---

### Edge Case 4: Incomplete Word Submission

**Problem:** User presses ENTER with less than 5 letters

**Solution:** Validate length before submitting

```javascript
if (currentGuess.length !== 5) {
  alert('Word must be 5 letters!')
  return
}
```

---

## Common Mistakes (Learn from These!)

### ❌ Mistake 1: Single-Pass Evaluation

```javascript
// ❌ WRONG: Check all letters in one pass
guess.split('').map((letter, i) => {
  if (letter === target[i]) return 'correct'
  if (target.includes(letter)) return 'present'
  return 'absent'
})
```

**Why it fails:** Duplicate letters aren't handled correctly.

**Fix:** Use two-pass algorithm with frequency map.

---

### ❌ Mistake 2: Not Tracking Letter Frequency

```javascript
// ❌ WRONG: Mark all matching letters as yellow
for (let i = 0; i < 5; i++) {
  if (target.includes(guess[i])) {
    result[i] = 'present'
  }
}
```

**Problem:** If target is "ROBOT" and guess is "OOOOO", all 5 O's become yellow (wrong!)

**Fix:** Decrement frequency as you use letters.

---

### ❌ Mistake 3: Downgrading Keyboard Letter States

```javascript
// ❌ WRONG: Always overwrite with latest state
letterStates[letter] = evaluation[i]
```

**Problem:** If A was green in guess 1, but gray in guess 2, keyboard shows gray (wrong!)

**Fix:** Implement priority system (correct > present > absent).

---

### ❌ Mistake 4: Not Preventing Default on Physical Keyboard

```javascript
// ❌ WRONG: Missing preventDefault
window.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') submitGuess() // Browser might submit a form!
})
```

**Fix:** Always call `e.preventDefault()` for handled keys.

---

## Complexity Analysis

### Time Complexity

| Operation | Complexity | Notes |
|-----------|------------|-------|
| **Evaluate guess** | O(n) | n = 5 (word length), effectively **O(1)** |
| **Update keyboard** | O(n) | n = 5 letters per guess, **O(1)** |
| **Render grid** | O(m × n) | m = 6 rows, n = 5 letters, effectively **O(1)** |
| **Submit guess** | O(n) | n = 5, **O(1)** |

**Overall:** O(1) - constant time (word length is fixed)

---

### Space Complexity

| Structure | Space | Notes |
|-----------|-------|-------|
| **guesses** | O(m × n) | Max 6 guesses × 5 letters = 30 cells, **O(1)** |
| **letterStates** | O(k) | k = 26 letters, **O(1)** |
| **targetFreq** | O(k) | Max 26 unique letters, **O(1)** |

**Overall:** O(1) - constant space

---

## Interview Tips

### What to Explain

1. **Two-pass algorithm**: Why it's necessary for duplicate letters
2. **Keyboard priority system**: Why correct > present > absent
3. **State separation**: Why `guesses` vs `currentGuess` matters
4. **Edge cases**: Duplicate letters, incomplete words, post-game input

### What Interviewers Look For

✅ **Correct duplicate letter handling** (most critical!)
✅ **Clean state management** (no unnecessary re-renders)
✅ **Keyboard accessibility** (both virtual and physical)
✅ **Win/lose logic** (proper game flow)
✅ **Visual feedback** (colors, animations, button states)

---

## Follow-Up Questions You Might Get

### Q: How would you validate if a guess is a real word?

**A:** Maintain a `VALID_WORDS` Set for O(1) lookup:

```javascript
const VALID_WORDS = new Set(['REACT', 'SLATE', 'GREAT', ...])

const submitGuess = () => {
  if (!VALID_WORDS.has(currentGuess)) {
    alert('Not in word list!')
    return
  }
  // ... rest of logic
}
```

---

### Q: How would you add tile flip animations?

**A:** Use CSS animations with staggered delays:

```javascript
const renderTile = (letter, state, index) => {
  const delay = state ? index * 0.2 : 0 // Flip tiles sequentially

  return (
    <div
      style={{
        animation: state ? `flip 0.5s ease ${delay}s` : 'none',
        // ... other styles
      }}
    >
      {letter}
    </div>
  )
}

// CSS:
// @keyframes flip {
//   0% { transform: rotateX(0); }
//   50% { transform: rotateX(90deg); }
//   100% { transform: rotateX(0); }
// }
```

---

### Q: How would you persist game state across refreshes?

**A:** Use `localStorage`:

```javascript
// Save on every state change
useEffect(() => {
  localStorage.setItem('wordle-state', JSON.stringify({
    targetWord,
    guesses,
    currentGuess,
    gameStatus,
    letterStates,
  }))
}, [guesses, currentGuess, gameStatus])

// Load on mount
const [state, setState] = useState(() => {
  const saved = localStorage.getItem('wordle-state')
  return saved ? JSON.parse(saved) : initialState
})
```

---

### Q: How would you add a "Share Results" feature?

**A:** Generate emoji grid and copy to clipboard:

```javascript
const shareResults = () => {
  const emojiGrid = guesses.map(guess => {
    const evaluation = evaluateGuess(guess)
    return evaluation.map(state => {
      if (state === 'correct') return '🟩'
      if (state === 'present') return '🟨'
      return '⬛'
    }).join('')
  }).join('\n')

  const text = `Wordle ${guesses.length}/6\n\n${emojiGrid}`

  navigator.clipboard.writeText(text)
  alert('Copied to clipboard!')
}

// Output:
// Wordle 3/6
//
// ⬛⬛🟨🟨🟩
// ⬛🟩🟩🟩🟩
// 🟩🟩🟩🟩🟩
```

---

### Q: How would you implement "Hard Mode" (must use revealed hints)?

**A:** Validate guess contains all green/yellow letters:

```javascript
const validateHardMode = (guess) => {
  // Check all green letters are in correct positions
  for (let i = 0; i < guesses.length; i++) {
    const prevGuess = guesses[i]
    const prevEval = evaluateGuess(prevGuess)

    for (let j = 0; j < 5; j++) {
      if (prevEval[j] === 'correct' && guess[j] !== prevGuess[j]) {
        alert(`Must use ${prevGuess[j]} in position ${j + 1}`)
        return false
      }
    }
  }

  // Check all yellow letters are present somewhere
  const yellowLetters = new Set()
  guesses.forEach(g => {
    const eval = evaluateGuess(g)
    g.split('').forEach((letter, i) => {
      if (eval[i] === 'present') yellowLetters.add(letter)
    })
  })

  for (const letter of yellowLetters) {
    if (!guess.includes(letter)) {
      alert(`Must include ${letter}`)
      return false
    }
  }

  return true
}
```

---

## Testing Strategy

### Manual Test Cases

1. **Duplicate letters**: Target = "ROBOT", Guess = "FLOOR"
   - ✅ First O should be green, second O should be gray

2. **All correct**: Guess matches target
   - ✅ All tiles green, game status = "won"

3. **No matches**: Guess = "ABCDE", Target = "FGHIJ"
   - ✅ All tiles gray

4. **Six wrong guesses**: Use all attempts without winning
   - ✅ Game status = "lost", show target word

5. **Keyboard priority**: A is yellow in guess 1, green in guess 2
   - ✅ Keyboard A should be green (not downgraded)

6. **Incomplete word**: Press ENTER with 3 letters
   - ✅ Show alert, don't submit

7. **Physical keyboard**: Type with keyboard, press Enter/Backspace
   - ✅ Should work identically to virtual keyboard

---

### Automated Tests (Jest + RTL)

```javascript
import { render, screen, fireEvent } from '@testing-library/react'
import Wordle from './Solution'

test('handles duplicate letters correctly', () => {
  // Mock random to return specific word
  jest.spyOn(Math, 'random').mockReturnValue(0) // First word in array

  render(<Wordle />)

  // Type and submit "FLOOR" (if target is "ROBOT")
  fireEvent.click(screen.getByText('F'))
  // ... continue typing
  fireEvent.click(screen.getByText('ENTER'))

  // Check first O is green, second O is gray
  const tiles = screen.getAllByTestId('tile')
  expect(tiles[2]).toHaveStyle({ backgroundColor: '#6aaa64' }) // Green
  expect(tiles[3]).toHaveStyle({ backgroundColor: '#787c7e' }) // Gray
})
```

---

## Key Takeaways

✅ **Two-pass evaluation** handles duplicate letters correctly
✅ **Frequency map** tracks remaining target letters
✅ **Priority system** prevents keyboard state downgrades
✅ **State separation** (guesses vs currentGuess) simplifies logic
✅ **Guard clauses** prevent input after game ends
✅ **Keyboard support** (both virtual and physical) improves UX

---

**Now play the interactive Wordle game above and practice your word-guessing skills!** 🎯

Try testing edge cases like duplicate letters (FLOOR vs ROBOT) or using the physical keyboard!
