import { useRef, useState } from 'react'
import { findMirror, getPath } from './findMirror.js'

const Tree = ({ label }) => (
  <div className="mt-tree">
    <div className="mt-node" data-label={`${label}-root`}>
      root
      <div className="mt-row">
        <div className="mt-node" data-label={`${label}-a`}>A
          <div className="mt-row">
            <div className="mt-node" data-label={`${label}-a1`}>A1</div>
            <div className="mt-node" data-label={`${label}-a2`}>A2</div>
          </div>
        </div>
        <div className="mt-node" data-label={`${label}-b`}>B
          <div className="mt-row">
            <div className="mt-node" data-label={`${label}-b1`}>B1</div>
          </div>
        </div>
      </div>
    </div>
  </div>
)

export default function Demo() {
  const aRef = useRef(null)
  const bRef = useRef(null)
  const [info, setInfo] = useState(null)

  const onClick = (e) => {
    const node = e.target.closest('.mt-node')
    if (!node || !aRef.current.contains(node)) return
    e.stopPropagation()

    aRef.current.querySelectorAll('.mt-hit').forEach((n) => n.classList.remove('mt-hit'))
    bRef.current.querySelectorAll('.mt-hit').forEach((n) => n.classList.remove('mt-hit'))

    const path = getPath(aRef.current, node)
    const mirror = findMirror(aRef.current, bRef.current, node)
    node.classList.add('mt-hit')
    mirror?.classList.add('mt-hit')
    setInfo({ label: node.dataset.label, path: JSON.stringify(path), mirror: mirror?.dataset.label })
  }

  return (
    <div className="mt">
      <p className="mt-hint">Click any node in the left tree.</p>
      <div className="mt-pair">
        <div ref={aRef} onClick={onClick}><Tree label="A" /></div>
        <div ref={bRef}><Tree label="B" /></div>
      </div>
      {info && (
        <p className="mt-out">
          clicked <b>{info.label}</b> · path <b>{info.path}</b> · mirror <b>{info.mirror}</b>
        </p>
      )}
    </div>
  )
}
