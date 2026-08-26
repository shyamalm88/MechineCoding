import { useEffect, useState } from 'react'
import { PriorityScheduler } from './scheduler.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [order, setOrder] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const done = []
      const s = new PriorityScheduler(2)
      const job = (name, p) => s.add(async () => { await sleep(70); done.push(name); return name }, p)

      // Saturate both slots FIRST. Priority orders the queue -- it cannot
      // preempt tasks that are already running -- so without this the first
      // two submissions would start regardless of their priority and the
      // ordering property would be invisible.
      const blockers = [job('blocker-1', 0), job('blocker-2', 0)]

      // These all queue behind the blockers and drain strictly by priority.
      const queued = [
        job('low-A (p=9)', 9),
        job('high-1 (p=1)', 1),
        job('mid (p=5)', 5),
        job('high-2 (p=1)', 1),
        job('low-B (p=9)', 9),
      ]

      await Promise.all([...blockers, ...queued])
      if (alive) setOrder(done)
    })()
    return () => { alive = false }
  }, [])

  if (!order) return <p>running…</p>
  return (
    <div>
      <p style={{ marginTop: 0 }}>Completion order (concurrency 2):</p>
      <ol style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.9 }}>
        {order.map((o) => (
          <li key={o} style={{ opacity: o.startsWith('blocker') ? 0.45 : 1 }}>{o}</li>
        ))}
      </ol>
      <p style={{ color: '#666', fontSize: 13, maxWidth: 460 }}>
        The two blockers occupy both slots first. Everything queued behind them
        drains strictly by priority — and equal priorities stay FIFO
        (high-1 before high-2).
      </p>
    </div>
  )
}
