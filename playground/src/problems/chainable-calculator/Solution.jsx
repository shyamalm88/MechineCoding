import { Calculator, calc } from './Calculator.js'

const rows = [
  ['new Calculator(10).add(5).multiply(2).subtract(4).result()',
    new Calculator(10).add(5).multiply(2).subtract(4).result()],
  ['calc(10).add(5).divide(3).result()', +calc(10).add(5).divide(3).result().toFixed(2)],
  ['divide by zero', (() => { try { return calc(1).divide(0).result() } catch (e) { return e.message } })()],
  ['chain is reusable (same instance mutates)', (() => {
    const c = new Calculator(0); c.add(1); c.add(1); return c.result()
  })()],
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
