import { useCallback, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useFocusTrap } from './useFocusTrap.js'

export default function Demo() {
  const [open, setOpen] = useState(false)
  const dialogRef = useRef(null)
  const close = useCallback(() => setOpen(false), [])
  useFocusTrap(dialogRef, open, close)

  return (
    <div className="am">
      <p>
        <button className="am-trigger" onClick={() => setOpen(true)}>Open dialog</button>
      </p>
      <p className="am-hint">
        Tab cycles inside the dialog only. Escape closes it and focus returns to
        the trigger button.
      </p>
      <input className="am-outside" placeholder="outside input (unreachable while open)" />

      {open &&
        createPortal(
          <div className="am-overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
            <div
              ref={dialogRef}
              className="am-dialog"
              role="dialog"
              aria-modal="true"
              aria-labelledby="am-title"
              aria-describedby="am-desc"
            >
              <h2 id="am-title" className="am-title">Confirm action</h2>
              <p id="am-desc" className="am-desc">
                This dialog traps focus and restores it on close.
              </p>
              <input className="am-input" placeholder="first field" />
              <input className="am-input" placeholder="second field" />
              <div className="am-actions">
                <button className="am-btn" onClick={close}>Cancel</button>
                <button className="am-btn am-primary" onClick={close}>Confirm</button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  )
}
