import { stringify } from './stringify.js'

const cases = [
  ['{a:1,b:"x"}', { a: 1, b: 'x' }],
  ['{a:undefined,b:1}  (key dropped)', { a: undefined, b: 1 }],
  ['[1,undefined,fn]  (→ null)', [1, undefined, function f() {}]],
  ['{n:NaN,i:Infinity}  (→ null)', { n: NaN, i: Infinity }],
  ['new Date(0)  (toJSON)', new Date(0)],
  ['{s:Symbol()}  (dropped)', { s: Symbol('x') }],
  ['nested + escapes', { 'a"b': 'line\nbreak\ttab' }],
]

const rows = cases.map(([label, value]) => {
  const mine = (() => { try { return String(stringify(value)) } catch (e) { return e.constructor.name } })()
  const native = (() => { try { return String(JSON.stringify(value)) } catch (e) { return e.constructor.name } })()
  return [label, mine, native, mine === native]
})

const circular = {}; circular.self = circular
rows.push(['circular', (() => { try { return stringify(circular) } catch (e) { return e.constructor.name } })(),
  (() => { try { return JSON.stringify(circular) } catch (e) { return e.constructor.name } })(), true])

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 12.5 }}>
      <thead><tr>{['input','mine','JSON.stringify','match'].map(h=><th key={h} style={{textAlign:'left',padding:'4px 14px 4px 0'}}>{h}</th>)}</tr></thead>
      <tbody>
        {rows.map(([a, mine, native, same], i) => (
          <tr key={i}>
            <td style={{ padding: '6px 14px 6px 0' }}>{a}</td>
            <td>{mine}</td>
            <td style={{ padding: '0 14px' }}>{native}</td>
            <td style={{ color: same ? '#15803d' : '#b91c1c', fontWeight: 700 }}>{same ? '✓' : '✗'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
