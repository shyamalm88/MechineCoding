import { useRef, useState } from 'react'

export default function Demo() {
  const [info, setInfo] = useState(null)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const onFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setInfo({ name: file.name, type: file.type || '(unknown)', size: `${file.size} bytes` })

    if (file.type.startsWith('image/')) {
      // Object URLs are cheap -- no base64 blow-up. Must be revoked.
      const url = URL.createObjectURL(file)
      setPreview({ kind: 'image', url })
    } else {
      const text = await file.text()
      setPreview({ kind: 'text', body: text.slice(0, 300) })
    }
  }

  const download = () => {
    const blob = new Blob([JSON.stringify({ generated: true, at: Date.now() }, null, 2)],
      { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'data.json'
    link.click()
    URL.revokeObjectURL(url)   // release immediately after the click
  }

  return (
    <div>
      <input ref={inputRef} type="file" onChange={onFile} />
      <p><button type="button" onClick={download}>Download a generated JSON file</button></p>
      {info && (
        <table style={{ fontFamily: 'monospace', fontSize: 13, borderCollapse: 'collapse' }}>
          <tbody>{Object.entries(info).map(([k, v]) => (
            <tr key={k}><td style={{ padding: '4px 16px 4px 0' }}>{k}</td><td><b>{v}</b></td></tr>
          ))}</tbody>
        </table>
      )}
      {preview?.kind === 'image' && <img src={preview.url} alt="" style={{ maxWidth: 260, marginTop: 12 }} />}
      {preview?.kind === 'text' && (
        <pre style={{ fontSize: 12, background: '#f3f4f6', padding: 10, maxWidth: 420, overflow: 'auto' }}>
          {preview.body}
        </pre>
      )}
      <p style={{ color: '#666', fontSize: 13 }}>
        Note: downloads may be blocked inside this sandboxed preview — the code is the point.
      </p>
    </div>
  )
}
