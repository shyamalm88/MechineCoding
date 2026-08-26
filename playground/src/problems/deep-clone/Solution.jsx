import { deepClone } from './deepClone.js'

const original = {
  date: new Date('2020-01-01'),
  regex: /ab+c/gi,
  map: new Map([['k', { n: 1 }]]),
  set: new Set([1, 2]),
  undef: undefined,
  nested: { deep: [1, { x: 2 }] },
}
original.self = original // circular

const copy = deepClone(original)

let jsonResult
try { jsonResult = JSON.stringify(original) } catch (e) { jsonResult = e.constructor.name + ' (circular)' }

const rows = [
  ['copy !== original', String(copy !== original)],
  ['copy.nested.deep[1] !== original…', String(copy.nested.deep[1] !== original.nested.deep[1])],
  ['copy.nested.deep[1].x', copy.nested.deep[1].x],
  ['copy.date instanceof Date', String(copy.date instanceof Date)],
  ['copy.regex.source / flags', `${copy.regex.source} / ${copy.regex.flags}`],
  ['copy.map.get("k").n', copy.map.get('k').n],
  ['copy.set.has(2)', String(copy.set.has(2))],
  ['"undef" in copy (key preserved)', String('undef' in copy)],
  ['copy.self === copy (circular fixed)', String(copy.self === copy)],
  ['JSON.stringify(original)', jsonResult],
]

export default function Demo() {
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
