/**
 * Grid Lights - Interactive 3x3 Grid with Reverse Deactivation
 *
 * Problem: 3x3 grid (omit center) where cells turn green on click.
 * When all cells are active, they deactivate in reverse order with 300ms delay.
 *
 * Key Concepts:
 * - State management with activation order array
 * - setTimeout for staggered animations
 * - Blocking interactions during animation
 * - Immutable state updates
 *
 * Time Complexity: O(1) - constant 8 cells
 * Space Complexity: O(1) - max 8 cells in array
 */

import { useState } from 'react'

// ==================== CONSTANTS ====================
const GRID_SIZE = 3
const TOTAL_CELLS = GRID_SIZE * GRID_SIZE
const CENTER_INDEX = Math.floor(TOTAL_CELLS / 2)  // Index 4
const DEACTIVATION_DELAY = 300  // milliseconds
const MAX_ACTIVE_CELLS = TOTAL_CELLS - 1  // 8 cells (excluding center)

// ==================== MAIN COMPONENT ====================
function GridLights() {
  // Track the order in which cells were activated
  const [activationOrder, setActivationOrder] = useState([])

  // Track if deactivation animation is running
  const [isDeactivating, setIsDeactivating] = useState(false)

  // ==================== HANDLERS ====================

  /**
   * Handle cell click
   * - Block clicks during deactivation
   * - Block clicks on already active cells
   * - Add cell to activation order
   * - Start deactivation if all cells are active
   */
  const handleCellClick = (index) => {
    // Guard: Block clicks during deactivation animation
    if (isDeactivating) return

    // Guard: Cell is already activated
    if (activationOrder.includes(index)) return

    // Add cell to activation order
    const newOrder = [...activationOrder, index]
    setActivationOrder(newOrder)

    // Check if all cells are now activated
    if (newOrder.length === MAX_ACTIVE_CELLS) {
      startDeactivation(newOrder)
    }
  }

  /**
   * Start deactivation animation
   * Waits 300ms after last cell is activated, then deactivates in reverse order with 300ms delay between each
   */
  const startDeactivation = (order) => {
    setIsDeactivating(true)

    // Wait 300ms before starting deactivation
    setTimeout(() => {
      // Reverse the activation order
      const reversed = [...order].reverse()

      // Deactivate each cell with staggered timing
      reversed.forEach((cellIndex, i) => {
        setTimeout(() => {
          // Remove this cell from activation order
          setActivationOrder(current =>
            current.filter(idx => idx !== cellIndex)
          )

          // If this is the last cell, re-enable clicks
          if (i === reversed.length - 1) {
            setIsDeactivating(false)
          }
        }, i * DEACTIVATION_DELAY)
      })
    }, DEACTIVATION_DELAY)
  }

  /**
   * Reset the grid
   */
  const handleReset = () => {
    if (isDeactivating) return  // Don't reset during animation
    setActivationOrder([])
  }

  // ==================== RENDER ====================
  return (
    <div style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
    }}>
      <h2 style={{
        textAlign: 'center',
        color: '#333',
        marginBottom: '10px',
      }}>Grid Lights</h2>

      <p style={{
        textAlign: 'center',
        color: '#666',
        fontSize: '14px',
        marginBottom: '20px',
      }}>
        Click the cells to turn them green. When all cells are green,
        they will automatically turn off in reverse order!
      </p>

      {/* Status Display */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginBottom: '20px',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        borderRadius: '6px',
      }}>
        <div style={{
          fontSize: '14px',
          color: '#333',
        }}>
          <strong>Active Cells:</strong> {activationOrder.length} / {MAX_ACTIVE_CELLS}
        </div>
        {isDeactivating && (
          <div style={{
            fontSize: '14px',
            color: '#333',
          }}>
            <strong style={{ color: '#f44336' }}>Deactivating...</strong>
          </div>
        )}
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '10px',
        maxWidth: '400px',
        margin: '0 auto 20px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
      }}>
        {Array.from({ length: TOTAL_CELLS }).map((_, index) => {
          // Check if this is the center cell
          const isCenter = index === CENTER_INDEX

          // Check if this cell is active
          const isActive = activationOrder.includes(index)

          // Get activation order number (for display)
          const orderNumber = activationOrder.indexOf(index) + 1

          if (isCenter) {
            // Render empty center cell
            return (
              <div key={index} style={{
                width: '100px',
                height: '100px',
                border: '2px dashed #ccc',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#f0f0f0',
              }}>
                <span style={{
                  fontSize: '36px',
                  color: '#ccc',
                  fontWeight: 'bold',
                }}>×</span>
              </div>
            )
          }

          // Render clickable cell
          return (
            <div
              key={index}
              style={{
                width: '100px',
                height: '100px',
                border: '2px solid #ddd',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#fff',
                transition: 'all 0.2s ease',
                userSelect: 'none',
                backgroundColor: isActive ? '#4caf50' : '#fff',
                cursor: isDeactivating || isActive ? 'not-allowed' : 'pointer',
                transform: isActive ? 'scale(0.95)' : 'scale(1)',
              }}
              onClick={() => handleCellClick(index)}
            >
              {isActive && (
                <span style={{
                  fontSize: '32px',
                  fontWeight: 'bold',
                  color: '#fff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)',
                }}>{orderNumber}</span>
              )}
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '30px',
      }}>
        <button
          onClick={handleReset}
          disabled={isDeactivating}
          style={{
            padding: '10px 30px',
            fontSize: '16px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: '#1976d2',
            color: 'white',
            transition: 'all 0.2s',
            opacity: isDeactivating ? 0.5 : 1,
            cursor: isDeactivating ? 'not-allowed' : 'pointer',
          }}
        >
          Reset
        </button>
      </div>

      {/* Activation Order Display */}
      {activationOrder.length > 0 && (
        <div style={{
          backgroundColor: '#e3f2fd',
          padding: '20px',
          borderRadius: '8px',
          marginBottom: '20px',
        }}>
          <h3 style={{
            fontSize: '16px',
            fontWeight: '600',
            color: '#333',
            marginBottom: '10px',
            marginTop: 0,
          }}>Activation Order:</h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
            {activationOrder.map((cellIndex, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                backgroundColor: '#fff',
                borderRadius: '4px',
                fontSize: '14px',
                border: '1px solid #2196f3',
              }}>
                <span style={{
                  fontWeight: 'bold',
                  color: '#2196f3',
                }}>{i + 1}.</span>
                <span>Cell {cellIndex}</span>
              </div>
            ))}
          </div>
          {activationOrder.length === MAX_ACTIVE_CELLS && !isDeactivating && (
            <div style={{
              marginTop: '15px',
              padding: '10px',
              backgroundColor: '#4caf50',
              color: '#fff',
              borderRadius: '6px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '14px',
            }}>
              ✨ All cells activated! Watch them deactivate in reverse...
            </div>
          )}
        </div>
      )}

      {/* How It Works */}
      <div style={{
        backgroundColor: '#f5f5f5',
        padding: '20px',
        borderRadius: '8px',
      }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '600',
          color: '#333',
          marginBottom: '10px',
          marginTop: 0,
        }}>How It Works</h3>
        <ul style={{
          margin: 0,
          paddingLeft: '20px',
          fontSize: '14px',
          color: '#555',
          lineHeight: '1.8',
        }}>
          <li>Click any cell (except center) to activate it</li>
          <li>Cells turn green and show their activation order number</li>
          <li>Once all 8 cells are green, deactivation starts automatically</li>
          <li>Cells turn off in <strong>reverse order</strong> with 300ms delay</li>
          <li>You cannot click cells during deactivation</li>
        </ul>
      </div>
    </div>
  )
}

// ==================== EXPORT ====================
export default GridLights

/**
 * KEY LEARNING POINTS:
 *
 * 1. State Management
 *    - Use array to track activation order (not object)
 *    - Array preserves order, allows reverse, easy to check includes
 *
 * 2. Animation with setTimeout
 *    - Use forEach with index for staggered timing
 *    - Each iteration gets its own closure (no 'i' issues)
 *    - Math: i * DELAY = 0ms, 300ms, 600ms, 900ms, ...
 *
 * 3. Blocking Interactions
 *    - Use isDeactivating flag to prevent clicks
 *    - Check both in click handler and cursor style
 *
 * 4. Immutable Updates
 *    - Use spread operator: [...order, newItem]
 *    - Use filter: current.filter(idx => idx !== cellIndex)
 *    - Never mutate state directly
 *
 * 5. Edge Cases Handled
 *    - Clicking same cell twice (check includes)
 *    - Clicking during animation (guard with isDeactivating)
 *    - Center cell (render different element)
 *
 * COMPLEXITY:
 * - Time: O(1) - constant 8 cells
 * - Space: O(1) - max 8 cells in array
 *
 * INTERVIEW FOLLOW-UPS:
 *
 * Q: What if grid is dynamic size (4x4, 5x5)?
 * A: Pass GRID_SIZE as prop, calculate CENTER_INDEX dynamically
 *
 * Q: What if we want to change delay?
 * A: Extract DEACTIVATION_DELAY as prop or constant
 *
 * Q: How to test this component?
 * A: 1. Click all cells → verify green
 *    2. Watch animation → verify reverse order
 *    3. Try clicking during animation → verify blocked
 *    4. Reset → verify state cleared
 *
 * Q: What about cleanup (unmount during animation)?
 * A: Use useEffect cleanup to clear timeouts:
 *    useEffect(() => {
 *      return () => clearAllTimeouts()
 *    }, [])
 */
