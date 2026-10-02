import { diff, cloneTree, applyPatch } from './diff.js'

const oldTree = {
  type: 'div',
  children: [
    { type: 'p', children: ['Hello'] },
    { type: 'span', children: ['World'] },
  ],
}

const newTree = {
  type: 'div',
  children: [
    { type: 'p', children: ['Hello!'] }, // text changed
    { type: 'h1', children: ['World'] }, // type changed
  ],
}

const patch = diff(oldTree, newTree)
const mounted = cloneTree(oldTree) // stand-in for "the real DOM tree"
const patched = applyPatch(mounted, patch)
const matches = JSON.stringify(patched) === JSON.stringify(newTree)

const pre = { fontFamily: 'monospace', fontSize: 12.5, background: '#f6f7f9', padding: 12, borderRadius: 6, overflow: 'auto' }

export default function Demo() {
  return (
    <div>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>diff(oldTree, newTree)</p>
      <pre style={pre}>{JSON.stringify(patch, null, 2)}</pre>
      <p style={{ fontWeight: 700, marginBottom: 4 }}>applyPatch(clone(oldTree), patch)</p>
      <pre style={pre}>{JSON.stringify(patched, null, 2)}</pre>
      <p style={{ fontFamily: 'monospace', fontSize: 13 }}>
        patched matches newTree: <b>{String(matches)}</b>
      </p>
    </div>
  )
}
