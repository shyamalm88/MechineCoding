import { useState } from 'react'
import { observableProxy, observableMethods } from './observableArray.js'

export default function Demo() {
  const [log, setLog] = useState([])

  const run = () => {
    const out = []
    const proxied = observableProxy([], (e) => out.push(`proxy: ${JSON.stringify(e)}`))
    proxied.push('a')
    proxied[1] = 'b'          // a plain index write -- proxy catches this
    delete proxied[0]

    const patched = observableMethods([], (e) => out.push(`method: ${e.type} → len ${e.length}`))
    patched.push('x')
    patched.unshift('y')
    patched[5] = 'z'          // NOT caught by method patching
    out.push('method: (arr[5] = "z" produced no event)')

    setLog(out)
  }

  return (
    <div>
      <button type="button" onClick={run}>Run</button>
      <ul style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.8 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
    </div>
  )
}
