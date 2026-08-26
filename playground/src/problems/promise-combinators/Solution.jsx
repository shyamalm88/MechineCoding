import { useEffect, useState } from 'react'
import { all, allSettled, race, any } from './combinators.js'

const ok = (v, ms) => new Promise((r) => setTimeout(() => r(v), ms))
const fail = (v, ms) => new Promise((_, r) => setTimeout(() => r(new Error(v)), ms))

export default function Demo() {
  const [rows, setRows] = useState([])

  useEffect(() => {
    let cancelled = false
    const show = (label, p) =>
      p.then(
        (v) => ({ label, out: JSON.stringify(v, (k, x) => (x instanceof Error ? x.message : x)) }),
        (e) => ({ label, out: `rejected: ${e.errors ? e.errors.map((x) => x.message).join(', ') : e.message}` }),
      )

    Promise.all([
      show('all([1, ok(2,50)])', all([1, ok(2, 50)])),
      show('all([ok(1,50), fail("boom",10)])', all([ok(1, 50), fail('boom', 10)])),
      show('allSettled([ok(1,10), fail("x",20)])', allSettled([ok(1, 10), fail('x', 20)])),
      show('race([ok("slow",80), ok("fast",10)])', race([ok('slow', 80), ok('fast', 10)])),
      show('any([fail("a",10), ok("b",40)])', any([fail('a', 10), ok('b', 40)])),
      show('any([fail("a",10), fail("b",20)])', any([fail('a', 10), fail('b', 20)])),
    ]).then((r) => !cancelled && setRows(r))
    return () => { cancelled = true }
  }, [])

  if (!rows.length) return <p>running…</p>
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <tbody>
        {rows.map((r) => (
          <tr key={r.label}>
            <td style={{ padding: '6px 18px 6px 0' }}>{r.label}</td>
            <td style={{ padding: '6px 0', fontWeight: 700 }}>{r.out}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
