import { useEffect, useState } from 'react'
import { promisify, callbackify } from './promisify.js'

// Node-style: callback last, (err, value)
function readConfig(name, callback) {
  setTimeout(() => {
    if (name === 'missing') return callback(new Error('ENOENT: missing'))
    callback(null, { name, ok: true })
  }, 80)
}
function multiValue(cb) { setTimeout(() => cb(null, 'a', 'b'), 40) }

export default function Demo() {
  const [rows, setRows] = useState(null)

  useEffect(() => {
    let alive = true
    ;(async () => {
      const out = []
      const readAsync = promisify(readConfig)

      out.push(['promisify success', JSON.stringify(await readAsync('app'))])
      try { await readAsync('missing') } catch (e) { out.push(['promisify error → rejects', e.message]) }
      out.push(['multiple callback values', JSON.stringify(await promisify(multiValue)())])

      const back = callbackify(async () => 'from promise')
      await new Promise((r) => back((err, v) => { out.push(['callbackify', `${err} / ${v}`]); r() }))

      if (alive) setRows(out)
    })()
    return () => { alive = false }
  }, [])

  if (!rows) return <p>running…</p>
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}><td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
          <td style={{ fontWeight: 700 }}>{b}</td></tr>
        ))}
      </tbody>
    </table>
  )
}
