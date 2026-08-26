import { useEffect, useState } from 'react'
import { mapWithLimit, series } from './pool.js'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

export default function Demo() {
  const [state, setState] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      let inFlight = 0
      let peak = 0
      const items = [50, 20, 40, 10, 30, 25, 15]

      const results = await mapWithLimit(items, 3, async (ms, i) => {
        inFlight++; peak = Math.max(peak, inFlight)
        await sleep(ms)
        inFlight--
        return `#${i}(${ms}ms)`
      })

      const seq = await series([
        async () => 'a',
        async () => { throw new Error('b failed') },
        async () => 'c',
      ])

      if (alive) setState({ results, peak, seq })
    })()
    return () => { alive = false }
  }, [])

  if (!state) return <p>running…</p>
  return (
    <div style={{ fontFamily: 'monospace', fontSize: 13 }}>
      <p><b>Peak concurrent tasks:</b> {state.peak} (limit was 3)</p>
      <p><b>Results in input order:</b><br />{JSON.stringify(state.results)}</p>
      <p><b>series() records every outcome:</b><br />{JSON.stringify(state.seq)}</p>
    </div>
  )
}
