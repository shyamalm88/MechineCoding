import { useEffect, useState } from 'react'
import { promiseRetry, promiseWithTimeout, cancellableAsyncTask } from './asyncUtils.js'

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

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
      out.push(['promiseRetry(flaky, 3, 20)', await promiseRetry(flaky, 3, 20)])

      try {
        await promiseWithTimeout(sleep(500), 60)
      } catch (e) {
        out.push(['promiseWithTimeout(sleep(500), 60ms)', e.message])
      }

      out.push(['promiseWithTimeout(sleep(10), 200ms)', await promiseWithTimeout(sleep(10).then(() => 'ok'), 200)])

      const ac = new AbortController()
      const task = cancellableAsyncTask(ac.signal).catch((e) => e.name)
      setTimeout(() => ac.abort(), 30)
      out.push(['cancellableAsyncTask(signal), abort after 30ms', await task])

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
