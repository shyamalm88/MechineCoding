import { memoize } from './memoize.js'

let calls = 0
const slowAdd = memoize((a, b) => { calls++; return a + b })

const results = []
results.push(['slowAdd(1,2)', slowAdd(1, 2), calls])
results.push(['slowAdd(1,2) again (cached)', slowAdd(1, 2), calls])
results.push(['slowAdd(2,1) different args', slowAdd(2, 1), calls])

let strCalls = 0
const idf = memoize((x) => { strCalls++; return typeof x })
idf(1); idf('1')
results.push(['memoize distinguishes 1 vs "1"', `${strCalls} calls`, strCalls])

let objCalls = 0
const byObject = memoize((o) => { objCalls++; return o.n * 2 })
const shared = { n: 21 }
byObject(shared); byObject(shared)
results.push(['object arg cached by identity', byObject(shared), objCalls])

export default function Demo() {
  return (
    <table style={{ borderCollapse: 'collapse', fontFamily: 'monospace', fontSize: 13 }}>
      <thead><tr><th style={{textAlign:'left',padding:'4px 18px 4px 0'}}>call</th><th style={{textAlign:'left'}}>result</th><th style={{textAlign:'left',paddingLeft:18}}>fn invocations</th></tr></thead>
      <tbody>
        {results.map(([a, b, c], i) => (
          <tr key={i}>
            <td style={{ padding: '6px 18px 6px 0' }}>{a}</td>
            <td style={{ fontWeight: 700 }}>{String(b)}</td>
            <td style={{ paddingLeft: 18 }}>{c}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
