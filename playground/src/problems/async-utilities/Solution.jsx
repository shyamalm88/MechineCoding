import { useEffect, useState } from 'react'
import { retry, withTimeout, sleep, cancellable } from './asyncUtils.js'

export default function Demo() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    let alive = true
    const out = []

    ;(async () => {
      let tries = 0
      const flaky = async () => {
        tries++
        if (tries < 3) throw new Error('flaky')
        return 'succeeded on attempt ' + tries
      }
      out.push(['retry(flaky, 3 attempts)', await retry(flaky, { baseDelay: 20 })])

      try {
        await withTimeout(sleep(500), 60)
      } catch (e) {
        out.push(['withTimeout(sleep(500), 60ms)', e.message])
      }

      out.push(['withTimeout(sleep(10), 200ms)', await withTimeout(sleep(10).then(() => 'ok'), 200)])

      const { promise, cancel } = cancellable(sleep(30).then(() => 'should not appear'))
      cancel()
      let settled = 'never settled (cancelled)'
      promise.then(() => { settled = 'settled!' })
      await sleep(80)
      out.push(['cancellable(...) then cancel()', settled])

      if (alive) setRows(out)
    })()
    return () => { alive = false }
  }, [])

  if (!rows.length) return <p>running…</p>
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{String(b)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
