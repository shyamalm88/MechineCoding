import { useEffect, useState } from 'react'

/**
 * Records the ACTUAL execution order at runtime, so the ordering claimed in
 * the description is demonstrated rather than asserted.
 */
export default function EventLoopDemo() {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    const log = []
    log.push('1. sync start')

    setTimeout(() => log.push('5. setTimeout (macrotask)'), 0)

    Promise.resolve().then(() => log.push('3. promise.then (microtask)'))
    queueMicrotask(() => log.push('4. queueMicrotask (microtask)'))

    log.push('2. sync end')

    // Runs after the macrotask queue has drained this turn.
    setTimeout(() => setOrder([...log]), 20)
  }, [])

  if (!order) return <p>running…</p>
  return (
    <div>
      <p style={{ marginTop: 0 }}>Actual observed execution order:</p>
      <ol style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.9 }}>
        {order.map((line) => <li key={line}>{line.replace(/^\d+\.\s/, '')}</li>)}
      </ol>
      <p style={{ color: '#666', fontSize: 13 }}>
        Both microtasks run before the macrotask, even though setTimeout was
        scheduled first.
      </p>
    </div>
  )
}
