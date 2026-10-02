import { useState } from 'react'
import { runWithRollback } from './saga.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [events, setEvents] = useState([])
  const [failAt, setFailAt] = useState('charge card')

  const run = async () => {
    const log = []
    const step = (name) => ({
      do: async () => {
        log.push({ phase: 'run', name })
        await sleep(90)
        if (name === failAt) throw new Error(`${name} failed`)
      },
      undo: async () => {
        log.push({ phase: 'compensate', name })
        await sleep(60)
      },
    })

    try {
      await runWithRollback([step('reserve stock'), step('charge card'), step('create shipment')])
    } catch (error) {
      log.push({ phase: 'failed', name: failAt, error: error.message })
    }
    setEvents(log)
  }

  const colour = { run: '#1f2430', failed: '#b91c1c', compensate: '#b45309' }

  return (
    <div>
      <label style={{ fontSize: 13 }}>
        Fail at:{' '}
        <select value={failAt} onChange={(e) => setFailAt(e.target.value)}>
          <option>reserve stock</option><option>charge card</option>
          <option>create shipment</option><option>none</option>
        </select>
      </label>{' '}
      <button type="button" onClick={run}>Run saga</button>
      <ol style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.8 }}>
        {events.map((e, i) => (
          <li key={i} style={{ color: colour[e.phase] ?? '#1f2430' }}>
            <b>{e.phase}</b> · {e.name}{e.error ? ` — ${e.error}` : ''}
          </li>
        ))}
      </ol>
      <p style={{ color: '#666', fontSize: 13 }}>
        Completed steps are compensated in reverse order.
      </p>
    </div>
  )
}
