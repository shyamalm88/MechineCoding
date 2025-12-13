/**
 * Wordle - Word Guessing Game
 *
 * Problem: Clone of NYT Wordle where players have 6 attempts to guess a 5-letter word.
 * After each guess, tiles change color to show how close the guess was.
 *
 * Key Concepts:
 * - Game state management (guesses, current guess, game status)
 * - Letter frequency counting for correct color assignment
 * - Keyboard event handling
 * - Win/lose conditions
 * - Reset functionality
 *
 * Colors:
 * - Default (Light Gray): #d3d6da
 * - Correct (Green): #6aaa64 - Letter in correct position
 * - Present (Yellow): #c9b458 - Letter in word but wrong position
 * - Absent (Dark Gray): #787c7e - Letter not in word
 *
 * Time Complexity: O(1) per guess (constant word length)
 * Space Complexity: O(1) - max 6 guesses of 5 letters
 */

import { useState, useEffect, useRef } from 'react'

// ==================== CONSTANTS ====================
const WORD_LENGTH = 5
const MAX_GUESSES = 6

// Word bank for random selection
const WORD_BANK = [
  'REACT', 'STATE', 'PROPS', 'HOOKS', 'ASYNC', 'AWAIT',
  'ARRAY', 'OBJECT', 'CLASS', 'SUPER', 'CONST', 'TIMER',
  'FETCH', 'PROXY', 'CACHE', 'QUERY', 'MODAL', 'INPUT',
  'VALID', 'ERROR', 'FRAME', 'SCOPE', 'BUILD', 'STACK',
  'QUEUE', 'GRAPH', 'TREES', 'NODES', 'LINKS', 'ROUTE'
]

// Wordle color scheme
const COLORS = {
  DEFAULT: '#d3d6da',
  CORRECT: '#6aaa64',
  PRESENT: '#c9b458',
  ABSENT: '#787c7e',
  TILE_BG: '#ffffff',
  BORDER: '#d3d6da',
}

// Keyboard layout (standard QWERTY)
const KEYBOARD_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE'],
]

// ==================== MAIN COMPONENT ====================
function Wordle() {
  // Select random target word on mount (new word per game session)
  const [targetWord] = useState(() =>
    WORD_BANK[Math.floor(Math.random() * WORD_BANK.length)]
  )

  // All submitted guesses (array of strings)
  const [guesses, setGuesses] = useState([])

  // Current guess being typed (not submitted yet)
  const [currentGuess, setCurrentGuess] = useState('')

  // Game status: 'playing', 'won', 'lost'
  const [gameStatus, setGameStatus] = useState('playing')

  // Track letter states for keyboard coloring
  // { 'A': 'correct', 'B': 'present', 'C': 'absent', ... }
  const [letterStates, setLetterStates] = useState({})

  // Ref for game container to focus on mount
  const gameRef = useRef(null)

  // ==================== GAME LOGIC ====================

  /**
   * Evaluate a guess and return color for each letter
   *
   * Algorithm:
   * 1. First pass: Mark all correct (exact position matches) as GREEN
   * 2. Build frequency map of remaining letters in target
   * 3. Second pass: For non-green letters, check if present (YELLOW) or absent (GRAY)
   *
   * This ensures correct behavior for duplicate letters.
   * Example: Target = ROBOT, Guess = FLOOR
   * - F: absent (gray)
   * - L: absent (gray)
   * - O: correct (green) - first O matches position 3
   * - O: absent (gray) - second O doesn't match, and target only has 2 O's, one already used
   * - R: present (yellow) - R exists but wrong position
   */
  const evaluateGuess = (guess) => {
    const result = Array(WORD_LENGTH).fill(null)
    const targetLetters = targetWord.split('')
    const guessLetters = guess.split('')

    // Frequency map of target letters (for tracking used letters)
    const targetFreq = {}

    // First pass: Mark correct positions (GREEN)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        result[i] = 'correct'
      } else {
        // Build frequency map for remaining letters
        targetFreq[targetLetters[i]] = (targetFreq[targetLetters[i]] || 0) + 1
      }
    }

    // Second pass: Mark present (YELLOW) or absent (GRAY)
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (result[i] === 'correct') continue // Already marked as correct

      const letter = guessLetters[i]

      if (targetFreq[letter] && targetFreq[letter] > 0) {
        result[i] = 'present'
        targetFreq[letter]-- // Consume one instance
      } else {
        result[i] = 'absent'
      }
    }

    return result
  }

  /**
   * Update keyboard letter states based on guess evaluation
   * Priority: correct > present > absent
   * (Don't downgrade a correct letter to present or absent)
   */
  const updateLetterStates = (guess, evaluation) => {
    const newStates = { ...letterStates }

    for (let i = 0; i < guess.length; i++) {
      const letter = guess[i]
      const state = evaluation[i]

      // Priority system: correct > present > absent
      if (newStates[letter] === 'correct') continue // Don't downgrade
      if (newStates[letter] === 'present' && state === 'absent') continue // Don't downgrade

      newStates[letter] = state
    }

    setLetterStates(newStates)
  }

  /**
   * Handle guess submission
   */
  const submitGuess = () => {
    // Validation: Must be exactly 5 letters
    if (currentGuess.length !== WORD_LENGTH) {
      alert(`Word must be ${WORD_LENGTH} letters long!`)
      return
    }

    // Evaluate the guess
    const evaluation = evaluateGuess(currentGuess)

    // Update letter states for keyboard
    updateLetterStates(currentGuess, evaluation)

    // Add to guesses array
    const newGuesses = [...guesses, currentGuess]
    setGuesses(newGuesses)

    // Clear current guess
    setCurrentGuess('')

    // Check win condition
    if (currentGuess === targetWord) {
      setGameStatus('won')
      return
    }

    // Check lose condition (used all attempts)
    if (newGuesses.length >= MAX_GUESSES) {
      setGameStatus('lost')
      return
    }
  }

  /**
   * Handle keyboard input (both virtual and physical)
   */
  const handleKeyPress = (key) => {
    // Ignore input if game is over
    if (gameStatus !== 'playing') return

    if (key === 'ENTER') {
      submitGuess()
    } else if (key === 'BACKSPACE') {
      setCurrentGuess(prev => prev.slice(0, -1))
    } else if (key.length === 1 && /^[A-Z]$/.test(key)) {
      // Only allow letters, max 5
      if (currentGuess.length < WORD_LENGTH) {
        setCurrentGuess(prev => prev + key)
      }
    }
  }

  /**
   * Reset game with new random word
   */
  const resetGame = () => {
    // Force component remount to get new random word
    window.location.reload()
  }

  // ==================== KEYBOARD LISTENERS ====================

  useEffect(() => {
    const handlePhysicalKeyboard = (e) => {
      if (gameStatus !== 'playing') return

      if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyPress('ENTER')
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleKeyPress('BACKSPACE')
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        e.preventDefault()
        handleKeyPress(e.key.toUpperCase())
      }
    }

    window.addEventListener('keydown', handlePhysicalKeyboard)
    return () => window.removeEventListener('keydown', handlePhysicalKeyboard)
  }, [currentGuess, gameStatus, guesses])

  // Focus game container on mount for keyboard events
  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus()
    }
  }, [])

  // ==================== RENDER HELPERS ====================

  /**
   * Render a single tile (letter cell)
   */
  const renderTile = (letter, state, index) => {
    // Determine background color based on state
    let bgColor = COLORS.TILE_BG
    let borderColor = COLORS.BORDER
    let textColor = '#000'

    if (state === 'correct') {
      bgColor = COLORS.CORRECT
      textColor = '#fff'
      borderColor = COLORS.CORRECT
    } else if (state === 'present') {
      bgColor = COLORS.PRESENT
      textColor = '#fff'
      borderColor = COLORS.PRESENT
    } else if (state === 'absent') {
      bgColor = COLORS.ABSENT
      textColor = '#fff'
      borderColor = COLORS.ABSENT
    } else if (letter) {
      // Has letter but not evaluated yet
      borderColor = '#888'
    }

    return (
      <div
        key={index}
        style={{
          width: '62px',
          height: '62px',
          border: `2px solid ${borderColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '32px',
          fontWeight: 'bold',
          backgroundColor: bgColor,
          color: textColor,
          textTransform: 'uppercase',
          transition: 'all 0.3s ease',
          userSelect: 'none',
        }}
      >
        {letter}
      </div>
    )
  }

  /**
   * Render a complete guess row (submitted or current)
   */
  const renderGuessRow = (guess, rowIndex) => {
    const letters = guess.split('')
    const evaluation = rowIndex < guesses.length ? evaluateGuess(guess) : []

    return (
      <div
        key={rowIndex}
        style={{
          display: 'flex',
          gap: '5px',
          marginBottom: '5px',
        }}
      >
        {Array.from({ length: WORD_LENGTH }).map((_, i) =>
          renderTile(letters[i] || '', evaluation[i], i)
        )}
      </div>
    )
  }

  /**
   * Render keyboard key
   */
  const renderKey = (key) => {
    const isSpecial = key === 'ENTER' || key === 'BACKSPACE'
    const state = letterStates[key]

    let bgColor = COLORS.DEFAULT
    let textColor = '#000'

    if (state === 'correct') {
      bgColor = COLORS.CORRECT
      textColor = '#fff'
    } else if (state === 'present') {
      bgColor = COLORS.PRESENT
      textColor = '#fff'
    } else if (state === 'absent') {
      bgColor = COLORS.ABSENT
      textColor = '#fff'
    }

    return (
      <button
        key={key}
        onClick={() => handleKeyPress(key)}
        disabled={gameStatus !== 'playing'}
        style={{
          padding: isSpecial ? '12px 16px' : '12px 10px',
          fontSize: isSpecial ? '12px' : '14px',
          fontWeight: '600',
          border: 'none',
          borderRadius: '4px',
          backgroundColor: gameStatus !== 'playing' ? '#d3d6da' : bgColor,
          color: textColor,
          cursor: gameStatus !== 'playing' ? 'not-allowed' : 'pointer',
          minWidth: isSpecial ? '65px' : '32px',
          transition: 'all 0.1s',
          textTransform: 'uppercase',
          opacity: gameStatus !== 'playing' ? 0.6 : 1,
        }}
        onMouseDown={(e) => {
          if (gameStatus === 'playing') {
            e.currentTarget.style.transform = 'scale(0.95)'
          }
        }}
        onMouseUp={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        {key === 'BACKSPACE' ? '⌫' : key}
      </button>
    )
  }

  // ==================== RENDER ====================
  return (
    <div
      ref={gameRef}
      tabIndex={0}
      style={{
        maxWidth: '500px',
        margin: '0 auto',
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        outline: 'none',
      }}
    >
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '20px',
        borderBottom: '1px solid #d3d6da',
        paddingBottom: '16px',
      }}>
        <h1 style={{
          fontSize: '36px',
          fontWeight: 'bold',
          margin: '0 0 8px 0',
          letterSpacing: '0.05em',
        }}>WORDLE</h1>
        <p style={{
          fontSize: '14px',
          color: '#666',
          margin: 0,
        }}>
          Guess the 5-letter word in 6 tries
        </p>
      </div>

      {/* Game Board */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '30px',
      }}>
        {/* Submitted guesses */}
        {guesses.map((guess, i) => renderGuessRow(guess, i))}

        {/* Current guess row (if game is still playing) */}
        {gameStatus === 'playing' && guesses.length < MAX_GUESSES &&
          renderGuessRow(currentGuess, guesses.length)
        }

        {/* Empty rows */}
        {Array.from({
          length: MAX_GUESSES - guesses.length - (gameStatus === 'playing' ? 1 : 0)
        }).map((_, i) => renderGuessRow('', guesses.length + i + 1))}
      </div>

      {/* Game Status */}
      {gameStatus !== 'playing' && (
        <div style={{
          textAlign: 'center',
          marginBottom: '20px',
          padding: '20px',
          backgroundColor: gameStatus === 'won' ? '#6aaa64' : '#787c7e',
          color: '#fff',
          borderRadius: '8px',
          fontWeight: 'bold',
        }}>
          {gameStatus === 'won' ? (
            <>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎉 You Win!</div>
              <div style={{ fontSize: '16px' }}>
                You guessed the word in {guesses.length} {guesses.length === 1 ? 'try' : 'tries'}!
              </div>
            </>
          ) : (
            <>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>Game Over</div>
              <div style={{ fontSize: '16px' }}>
                The word was: <strong>{targetWord}</strong>
              </div>
            </>
          )}
        </div>
      )}

      {/* Reset Button */}
      {gameStatus !== 'playing' && (
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <button
            onClick={resetGame}
            style={{
              padding: '12px 40px',
              fontSize: '16px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '6px',
              backgroundColor: '#1976d2',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1565c0'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#1976d2'
            }}
          >
            Play Again
          </button>
        </div>
      )}

      {/* Virtual Keyboard */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
      }}>
        {KEYBOARD_ROWS.map((row, rowIndex) => (
          <div
            key={rowIndex}
            style={{
              display: 'flex',
              gap: '6px',
            }}
          >
            {row.map(key => renderKey(key))}
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        fontSize: '14px',
        lineHeight: '1.6',
        color: '#555',
      }}>
        <strong>How to Play:</strong>
        <ul style={{ marginLeft: '20px', marginTop: '8px', marginBottom: 0 }}>
          <li>Type or click letters to make a 5-letter word</li>
          <li>Press ENTER to submit your guess</li>
          <li>Green = correct letter in correct position</li>
          <li>Yellow = correct letter in wrong position</li>
          <li>Gray = letter not in word</li>
          <li>You have 6 attempts to guess the word!</li>
        </ul>
      </div>

      {/* Debug Info (only visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div style={{
          marginTop: '20px',
          padding: '10px',
          backgroundColor: '#fff3cd',
          border: '1px solid #ffc107',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#856404',
        }}>
          <strong>DEV MODE:</strong> Target word is <code>{targetWord}</code>
        </div>
      )}
    </div>
  )
}

// ==================== EXPORT ====================
export default Wordle

/**
 * KEY LEARNING POINTS:
 *
 * 1. Letter Frequency Algorithm
 *    - Two-pass approach prevents duplicate letter bugs
 *    - First pass: Mark exact matches (GREEN)
 *    - Second pass: Check remaining letters for presence (YELLOW/GRAY)
 *    - Example: ROBOT vs FLOOR correctly shows only one O as green
 *
 * 2. State Management
 *    - Separate guesses (submitted) from currentGuess (typing)
 *    - letterStates tracks keyboard coloring with priority system
 *    - gameStatus controls UI and interactions
 *
 * 3. Keyboard Handling
 *    - Both virtual (onClick) and physical (onKeyDown) keyboards
 *    - Event prevention to avoid form submission
 *    - Disabled when game is over
 *
 * 4. Visual Feedback
 *    - Smooth transitions with CSS
 *    - Button press effects (scale on click)
 *    - Color coding matches official Wordle
 *
 * 5. Edge Cases Handled
 *    - Duplicate letters (frequency tracking)
 *    - Incomplete words (validation)
 *    - Game over state (disable input)
 *    - Keyboard priority (correct > present > absent)
 *
 * COMPLEXITY:
 * - Time: O(1) per guess (constant 5 letters)
 * - Space: O(1) - max 6 guesses × 5 letters = 30 cells
 *
 * INTERVIEW FOLLOW-UPS:
 *
 * Q: How to handle word validation (check if word exists in dictionary)?
 * A: Add WORD_LIST array/Set, check `if (!WORD_LIST.has(guess)) alert('Not in word list')`
 *
 * Q: How to add animations for tile flips?
 * A: Use CSS keyframes + delay based on index:
 *    animation: flip 0.5s ease ${i * 0.1}s;
 *
 * Q: How to persist game state across page refreshes?
 * A: Use localStorage to save/load guesses, currentGuess, targetWord
 *
 * Q: How to add a "Share Results" feature (emoji grid)?
 * A: Map evaluation to emojis: correct=🟩, present=🟨, absent=⬛
 *    Copy to clipboard with navigator.clipboard.writeText()
 *
 * Q: How to add hard mode (must use revealed hints)?
 * A: Validate that guess contains all green letters in correct positions
 *    and all yellow letters somewhere in the word
 */
