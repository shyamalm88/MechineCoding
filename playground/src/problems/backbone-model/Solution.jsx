import { useRef, useState } from 'react'
import { Model } from './Model.js'

export default function Demo() {
  const [log, setLog] = useState([])
  const modelRef = useRef(null)
  if (!modelRef.current) modelRef.current = new Model({ name: 'Ada', age: 36 })
  const model = modelRef.current

  const run = () => {
    const out = []
    const offName = model.on('change:name', (m, now, before) =>
      out.push(`change:name  "${before}" → "${now}"`))
    model.on('change', (m, changed) => out.push(`change  [${changed.join(', ')}]`))

    model.set('name', 'Grace')
    model.set('name', 'Grace')            // identical -- silent
    model.set({ age: 37, city: 'London' }) // batch
    offName()
    model.set('name', 'Katherine')         // name listener removed
    out.push(`toJSON → ${JSON.stringify(model.toJSON())}`)
    out.push(`previous("age") → ${model.previous('age')}`)
    setLog(out)
  }

  return (
    <div>
      <button type="button" onClick={run}>Run</button>
      <ul style={{ fontFamily: 'monospace', fontSize: 12.5, lineHeight: 1.9 }}>
        {log.map((l, i) => <li key={i}>{l}</li>)}
      </ul>
      {log.length > 0 && (
        <p style={{ color: '#666', fontSize: 13 }}>
          Setting the same value emits nothing; a batch set emits one aggregate change.
        </p>
      )}
    </div>
  )
}
