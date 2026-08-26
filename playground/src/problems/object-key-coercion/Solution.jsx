const a = {}
const b = { key: 'b' }
const c = { key: 'c' }
a[b] = 123
a[c] = 456   // same stringified key "[object Object]" -- overwrites

const arr = []
arr[0] = 'zero'
arr['0'] = 'overwritten'   // same key

const sym = Symbol('s')
const withSym = { [sym]: 'symbol value', 1: 'one', b: 'bee', 0: 'zero' }

const rows = [
  ['a[b] then a[c]; a[b] →', a[b]],
  ['Object.keys(a)', JSON.stringify(Object.keys(a))],
  ['String({key:"b"})', String(b)],
  ['arr[0] after arr["0"]="overwritten"', arr[0]],
  ['arr.length', arr.length],
  ['Object.keys of {sym, 1, b, 0}', JSON.stringify(Object.keys(withSym))],
  ['Object.keys omits symbol?', String(!Object.keys(withSym).includes(String(sym)))],
  ['Map preserves object identity', (() => {
    const m = new Map(); m.set(b, 'B'); m.set(c, 'C'); return `${m.get(b)} / ${m.get(c)} (size ${m.size})`
  })()],
]

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a2, b2]) => (
          <tr key={a2}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a2}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{String(b2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
