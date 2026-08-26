import { useEffect, useLayoutEffect, useRef, useState } from 'react'

let id = 3
const SEED = [
  { id: 1, from: 'them', text: 'Hey! Did you finish the take-home?', at: '09:14' },
  { id: 2, from: 'me', text: 'Almost — writing the chat UI now.', at: '09:15' },
]

export default function ChatUI() {
  const [messages, setMessages] = useState(SEED)
  const [draft, setDraft] = useState('')
  const [typing, setTyping] = useState(false)
  const listRef = useRef(null)
  const pinnedRef = useRef(true)

  // Only auto-scroll if the user was already at the bottom. Yanking them down
  // while they are reading history is the classic chat-UI bug.
  const onScroll = () => {
    const el = listRef.current
    pinnedRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40
  }

  // Layout effect so the scroll happens before paint -- no visible jump.
  useLayoutEffect(() => {
    if (pinnedRef.current) listRef.current?.scrollTo({ top: listRef.current.scrollHeight })
  }, [messages, typing])

  const send = (e) => {
    e.preventDefault()
    const text = draft.trim()
    if (!text) return
    const now = new Date()
    const at = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setMessages((m) => [...m, { id: ++id, from: 'me', text, at }])
    setDraft('')
    pinnedRef.current = true

    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      setMessages((m) => [...m, { id: ++id, from: 'them', text: 'Got it 👍', at }])
    }, 1200)
  }

  useEffect(() => () => setTyping(false), [])

  return (
    <div className="ch">
      <div className="ch-head">Alex · <span className="ch-status">online</span></div>
      <div className="ch-list" ref={listRef} onScroll={onScroll}>
        {messages.map((m) => (
          <div key={m.id} className={`ch-row ch-${m.from}`}>
            <div className="ch-bubble">
              {m.text}
              <span className="ch-time">{m.at}</span>
            </div>
          </div>
        ))}
        {typing && (
          <div className="ch-row ch-them">
            <div className="ch-bubble ch-typing"><span/><span/><span/></div>
          </div>
        )}
      </div>
      <form className="ch-compose" onSubmit={send}>
        <input value={draft} onChange={(e) => setDraft(e.target.value)}
               placeholder="Type a message" aria-label="Message" />
        <button type="submit" disabled={!draft.trim()}>Send</button>
      </form>
    </div>
  )
}
