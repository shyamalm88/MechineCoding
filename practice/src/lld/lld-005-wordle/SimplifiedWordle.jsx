/**
 * SIMPLIFIED WORDLE - Learning Version
 *
 * This is a stripped-down version with extra comments to help you understand.
 * Focus on understanding these 3 core functions:
 * 1. evaluateGuess() - The heart of Wordle
 * 2. handleKeyPress() - How input works
 * 3. submitGuess() - Putting it all together
 */

import { useState } from 'react'

// Simple word list (just 5 words for now)
const WORDS = ['REACT', 'STATE', 'PROPS', 'HOOKS', 'ASYNC']

function SimplifiedWordle() {
  // Pick a random word once when component mounts
  const [targetWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)])

  // All submitted guesses (array of strings like ["SLATE", "GREAT"])
  const [guesses, setGuesses] = useState([])

  // Current word being typed (not submitted yet)
  const [currentGuess, setCurrentGuess] = useState('')

  // Game state: 'playing', 'won', or 'lost'
  const [gameStatus, setGameStatus] = useState('playing')

  // ==================== CORE ALGORITHM ====================

  /**
   * The most important function in Wordle!
   *
   * Takes a guess and returns an array of colors:
   * - 'correct' = green (exact match)
   * - 'present' = yellow (letter exists, wrong position)
   * - 'absent' = gray (letter not in word)
   *
   * Example:
   *   Target: ROBOT
   *   Guess:  FLOOR
   *   Returns: ['absent', 'absent', 'present', 'correct', 'present']
   *             ↑gray    ↑gray    ↑yellow    ↑green     ↑yellow
   */
  function evaluateGuess(guess) {
    // Step 0: Create empty result array
    const result = [null, null, null, null, null]

    // Step 0: Create frequency map for target letters
    const targetFreq = {}

    // ========== PASS 1: Find GREEN tiles (exact matches) ==========
    console.log(`\n🔍 Evaluating: ${guess} vs ${targetWord}`)
    console.log('PASS 1: Looking for exact matches (GREEN)...')

    for (let i = 0; i < 5; i++) {
      const guessLetter = guess[i]
      const targetLetter = targetWord[i]

      if (guessLetter === targetLetter) {
        // Exact match! This is GREEN
        result[i] = 'correct'
        console.log(`  Position ${i}: ${guessLetter} === ${targetLetter} ✅ GREEN`)
      } else {
        // Not a match, add target letter to frequency map
        // This letter is still available for yellow matching in Pass 2
        targetFreq[targetLetter] = (targetFreq[targetLetter] || 0) + 1
        console.log(`  Position ${i}: ${guessLetter} !== ${targetLetter} ❌ (added ${targetLetter} to pool)`)
      }
    }

    console.log('Frequency map after Pass 1:', targetFreq)
    console.log('Result after Pass 1:', result)

    // ========== PASS 2: Find YELLOW or GRAY tiles ==========
    console.log('\nPASS 2: Checking remaining letters for YELLOW/GRAY...')

    for (let i = 0; i < 5; i++) {
      // Skip if already marked as GREEN in Pass 1
      if (result[i] === 'correct') {
        console.log(`  Position ${i}: Already GREEN, skip`)
        continue
      }

      const letter = guess[i]

      // Check if this letter is available in the remaining pool
      if (targetFreq[letter] && targetFreq[letter] > 0) {
        // Letter exists in target! Mark as YELLOW
        result[i] = 'present'
        targetFreq[letter]-- // Use up one instance
        console.log(`  Position ${i}: ${letter} found in pool! ✅ YELLOW (${targetFreq[letter]} left)`)
      } else {
        // Letter not available (either doesn't exist or all used up)
        result[i] = 'absent'
        console.log(`  Position ${i}: ${letter} not available ❌ GRAY`)
      }
    }

    console.log('Final result:', result)
    return result
  }

  // ==================== USER INPUT ====================

  /**
   * Handle letter, ENTER, or BACKSPACE
   */
  function handleKeyPress(key) {
    // Don't allow input if game is over
    if (gameStatus !== 'playing') {
      console.log('Game over, ignoring input')
      return
    }

    if (key === 'ENTER') {
      // Submit the guess
      submitGuess()
    }
    else if (key === 'BACKSPACE') {
      // Remove last letter
      setCurrentGuess(prev => prev.slice(0, -1))
    }
    else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      // Add letter (max 5)
      if (currentGuess.length < 5) {
        setCurrentGuess(prev => prev + key)
      }
    }
  }

  // ==================== SUBMIT GUESS ====================

  /**
   * Submit current guess and check win/lose
   */
  function submitGuess() {
    // Validation: Must be exactly 5 letters
    if (currentGuess.length !== 5) {
      alert('Must be 5 letters!')
      return
    }

    console.log(`\n📝 Submitting guess: ${currentGuess}`)

    // Evaluate the guess (get colors)
    const evaluation = evaluateGuess(currentGuess)

    // Add to guesses array
    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    // Clear current guess input
    setCurrentGuess('')

    // Check if won (all correct)
    if (currentGuess === targetWord) {
      console.log('🎉 YOU WIN!')
      setGameStatus('won')
      return
    }

    // Check if lost (used all 6 attempts)
    if (newGuesses.length >= 6) {
      console.log('😢 Out of guesses, you lose')
      setGameStatus('lost')
      return
    }

    console.log(`Guesses used: ${newGuesses.length}/6`)
  }

  // ==================== RENDER HELPERS ====================

  /**
   * Render a single tile with correct color
   */
  function renderTile(letter, state) {
    let bgColor = 'white'
    let borderColor = '#d3d6da'

    if (state === 'correct') {
      bgColor = '#6aaa64' // Green
      borderColor = '#6aaa64'
    } else if (state === 'present') {
      bgColor = '#c9b458' // Yellow
      borderColor = '#c9b458'
    } else if (state === 'absent') {
      bgColor = '#787c7e' // Gray
      borderColor = '#787c7e'
    } else if (letter) {
      borderColor = '#888' // Has letter but not evaluated yet
    }

    return (
      <div style={{
        width: '60px',
        height: '60px',
        border: `2px solid ${borderColor}`,
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 'bold',
        color: state ? 'white' : 'black',
      }}>
        {letter}
      </div>
    )
  }

  /**
   * Render a complete row (5 tiles)
   */
  function renderRow(guess, rowIndex) {
    const letters = guess.split('')

    // If this is a submitted guess, evaluate it for colors
    const evaluation = rowIndex < guesses.length ? evaluateGuess(guess) : []

    return (
      <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
        {[0, 1, 2, 3, 4].map(i => renderTile(letters[i] || '', evaluation[i]))}
      </div>
    )
  }

  // ==================== RENDER ====================

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ textAlign: 'center' }}>SIMPLIFIED WORDLE</h1>

      {/* Dev mode: Show target word */}
      <div style={{
        textAlign: 'center',
        padding: '10px',
        backgroundColor: '#fff3cd',
        marginBottom: '20px',
        borderRadius: '4px',
      }}>
        <strong>Target Word:</strong> {targetWord}
      </div>

      {/* Game Board */}
      <div style={{ marginBottom: '20px' }}>
        {/* Submitted guesses */}
        {guesses.map((guess, i) => (
          <div key={i}>
            {renderRow(guess, i)}
          </div>
        ))}

        {/* Current guess row (if still playing) */}
        {gameStatus === 'playing' && guesses.length < 6 && renderRow(currentGuess, guesses.length)}

        {/* Empty rows */}
        {Array.from({ length: 6 - guesses.length - (gameStatus === 'playing' ? 1 : 0) }).map((_, i) => (
          <div key={`empty-${i}`}>
            {renderRow('', guesses.length + i + 1)}
          </div>
        ))}
      </div>

      {/* Game Status */}
      {gameStatus === 'won' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#6aaa64',
          color: 'white',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h2>🎉 You Win!</h2>
          <p>Guessed in {guesses.length} tries</p>
        </div>
      )}

      {gameStatus === 'lost' && (
        <div style={{
          padding: '20px',
          backgroundColor: '#787c7e',
          color: 'white',
          textAlign: 'center',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h2>😢 Game Over</h2>
          <p>The word was: <strong>{targetWord}</strong></p>
        </div>
      )}

      {/* Virtual Keyboard (simplified) */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ marginBottom: '10px' }}>
          {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              style={{
                padding: '10px',
                margin: '2px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {key}
            </button>
          ))}
        </div>

        <div style={{ marginBottom: '10px' }}>
          {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              style={{
                padding: '10px',
                margin: '2px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {key}
            </button>
          ))}
        </div>

        <div>
          <button
            onClick={() => handleKeyPress('ENTER')}
            style={{
              padding: '10px 20px',
              margin: '2px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ENTER
          </button>

          {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              style={{
                padding: '10px',
                margin: '2px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {key}
            </button>
          ))}

          <button
            onClick={() => handleKeyPress('BACKSPACE')}
            style={{
              padding: '10px 20px',
              margin: '2px',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            ⌫
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '14px',
      }}>
        <strong>How to Learn:</strong>
        <ol style={{ marginLeft: '20px', lineHeight: '1.8' }}>
          <li>Open browser console (F12)</li>
          <li>Type a word and press ENTER</li>
          <li>Watch the console logs showing:
            <ul>
              <li>Pass 1: Finding GREEN tiles</li>
              <li>Frequency map building</li>
              <li>Pass 2: Finding YELLOW/GRAY tiles</li>
            </ul>
          </li>
          <li>Try tricky cases like FLOOR (with duplicate O's)</li>
        </ol>
      </div>
    </div>
  )
}

export default SimplifiedWordle

/**
 * LEARNING CHECKLIST:
 *
 * ✅ Understand the two-pass algorithm
 * ✅ Know why we need a frequency map
 * ✅ Understand how state management works
 * ✅ See how input is handled
 * ✅ Follow win/lose logic
 *
 * Once you understand this simplified version,
 * go back to the full Solution.jsx which adds:
 * - Keyboard color tracking
 * - Better styling
 * - Physical keyboard support
 * - More polish
 */
