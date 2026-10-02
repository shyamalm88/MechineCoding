import { useEffect, useState } from 'react'
import { myPromiseAll } from './combinators.js'

const allSettled = Promise.myPromiseAllSettled
const race = Promise.myRace
const any = Promise.any

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
      show('myPromiseAll([1, ok(2,50)])', myPromiseAll([1, ok(2, 50)])),
      show('myPromiseAll([ok(1,50), fail("boom",10)])', myPromiseAll([ok(1, 50), fail('boom', 10)])),
      show('myPromiseAllSettled([ok(1,10), fail("x",20)])', allSettled([ok(1, 10), fail('x', 20)])),
      show('myRace([ok("slow",80), ok("fast",10)])', race([ok('slow', 80), ok('fast', 10)])),
      show('Promise.any([fail("a",10), ok("b",40)])', any([fail('a', 10), ok('b', 40)])),
      show('Promise.any([fail("a",10), fail("b",20)])', any([fail('a', 10), fail('b', 20)])),
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
