import { flatten, flattenIterative, flattenObject } from './flatten.js'

const nested = [1, [2, [3, [4, [5]]]]]
const obj = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2], g: null }

const rows = [
  ['flatten([1,[2,[3,[4,[5]]]]])', JSON.stringify(flatten(nested))],
  ['flatten(…, 2)', JSON.stringify(flatten(nested, 2))],
  ['flatten(…, Infinity)', JSON.stringify(flatten(nested, Infinity))],
  ['flattenIterative(…)', JSON.stringify(flattenIterative(nested))],
  ['flattenObject({a:1,b:{c:2,d:{e:3}},f:[1,2],g:null})', JSON.stringify(flattenObject(obj))],
]

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map(([a, b]) => (
          <tr key={a}>
            <td style={{ padding: '6px 18px 6px 0', verticalAlign: 'top' }}>{a}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{b}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
