import './flatten.js'
import { flattenObject } from './flatten.js'

const nested = [1, [2, [3, [4, [5]]]]]
const obj = { a: 1, b: { c: 2, d: { e: 3 } }, f: [1, 2], g: null }

const rows = [
  ['[1,[2,[3,[4,[5]]]]].myFlat()', JSON.stringify(nested.myFlat())],
  ['…myFlat(2)', JSON.stringify(nested.myFlat(2))],
  ['…myFlat(Infinity)', JSON.stringify(nested.myFlat(Infinity))],
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
