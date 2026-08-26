import { useState } from 'react'
import { EventEmitter } from './EventEmitter.js'

export default function Demo() {
  const [log, setLog] = useState([])

  const run = () => {
    const out = []
    const bus = new EventEmitter()

    const unsub = bus.on('msg', (t) => out.push(`A received: ${t}`))
    bus.on('msg', (t) => out.push(`B received: ${t}`))
    bus.once('msg', (t) => out.push(`C (once) received: ${t}`))

    bus.emit('msg', 'first')
    unsub()
    bus.emit('msg', 'second')
    out.push(`emit to unknown event returned: ${bus.emit('nope')}`)
    setLog(out)
  }

  return (
    <div>
      <button type="button" onClick={run}>Run</button>
      <ul style={{ fontFamily: 'monospace', fontSize: 13, lineHeight: 1.8 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      {log.length > 0 && (
        <p style={{ color: '#666', fontSize: 13 }}>
          After unsub, A is gone. C fired only once.
        </p>
      )}
    </div>
  )
}
