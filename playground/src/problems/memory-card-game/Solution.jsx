import { useEffect, useState } from 'react'

const EMOJI = ['🍎', '🍌', '🍇', '🍓', '🥝', '🍑', '🍍', '🥥']

const shuffle = (arr) => {
  // Fisher-Yates: unbiased, unlike sort(() => Math.random() - 0.5)
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const newDeck = () =>
  shuffle([...EMOJI, ...EMOJI]).map((emoji, i) => ({ id: i, emoji }))

export default function MemoryGame() {
  const [deck, setDeck] = useState(newDeck)
  const [flipped, setFlipped] = useState([])   // ids currently face-up
  const [matched, setMatched] = useState(() => new Set())
  const [moves, setMoves] = useState(0)
  const [locked, setLocked] = useState(false)  // input lock during the reveal pause

  useEffect(() => {
    if (flipped.length !== 2) return undefined
    setLocked(true)
    const [a, b] = flipped.map((id) => deck.find((c) => c.id === id))
    const isMatch = a.emoji === b.emoji

    const t = setTimeout(() => {
      if (isMatch) setMatched((m) => new Set([...m, a.emoji]))
      setFlipped([])
      setLocked(false)
    }, isMatch ? 350 : 800)
    return () => clearTimeout(t)
  }, [flipped, deck])

  const flip = (card) => {
    if (locked || flipped.includes(card.id) || matched.has(card.emoji)) return
    setFlipped((f) => {
      if (f.length === 0) setMoves((m) => m + 1)
      return [...f, card.id]
    })
  }

  const won = matched.size === EMOJI.length
  const reset = () => { setDeck(newDeck()); setFlipped([]); setMatched(new Set()); setMoves(0); setLocked(false) }

  return (
    <div className="mg">
      <div className="mg-bar">
        <span>Moves: <b>{moves}</b></span>
        <span>Matched: <b>{matched.size}/{EMOJI.length}</b></span>
        <button className="mg-reset" onClick={reset}>New game</button>
      </div>
      {won && <p className="mg-win">Solved in {moves} moves! 🎉</p>}
      <div className="mg-grid">
        {deck.map((card) => {
          const faceUp = flipped.includes(card.id) || matched.has(card.emoji)
          return (
            <button
              key={card.id}
              className={`mg-card${faceUp ? ' mg-up' : ''}${matched.has(card.emoji) ? ' mg-done' : ''}`}
              onClick={() => flip(card)}
              aria-label={faceUp ? card.emoji : 'Hidden card'}
            >
              {faceUp ? card.emoji : '?'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
