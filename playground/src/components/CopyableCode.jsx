import { useRef, useState } from 'react'

/**
 * A <pre> with a copy button, shared by the Code tab and by fenced blocks in
 * problem descriptions.
 *
 * Two behaviours beyond a plain <pre>:
 *
 *  - Copy. The text is read from the DOM at click time rather than passed in
 *    as a prop, so this works identically for CodeView's highlighted markup
 *    (which arrives as an HTML string) and for markdown's React children.
 *
 *  - Scoped select-all. The block is focusable, and Ctrl/Cmd+A while it has
 *    focus selects only this block instead of the whole page. Making it
 *    focusable also gives the scroll container keyboard access, which an
 *    overflowing <pre> otherwise lacks.
 */
export default function CopyableCode({ className = '', children }) {
  const preRef = useRef(null)
  const [status, setStatus] = useState('idle') // idle | copied | failed

  const copy = async () => {
    try {
      // innerText, not textContent: it reflects rendered line breaks, so the
      // copied source keeps its formatting.
      await navigator.clipboard.writeText(preRef.current.innerText)
      setStatus('copied')
    } catch {
      // Clipboard access is unavailable outside secure contexts and can be
      // denied by permission -- say so rather than appearing to succeed.
      setStatus('failed')
    }
    setTimeout(() => setStatus('idle'), 1600)
  }

  const selectOnlyThisBlock = (event) => {
    if (!(event.ctrlKey || event.metaKey) || event.key.toLowerCase() !== 'a') return
    event.preventDefault() // otherwise the browser selects the entire document
    const selection = window.getSelection()
    selection.removeAllRanges()
    selection.selectAllChildren(preRef.current)
  }

  const label = { idle: 'Copy', copied: 'Copied', failed: 'Failed' }[status]

  return (
    <div className="code-shell">
      <button
        type="button"
        className={`copy-button${status !== 'idle' ? ' ' + status : ''}`}
        onClick={copy}
        aria-label={status === 'idle' ? 'Copy code to clipboard' : label}
      >
        {label}
      </button>
      <pre
        ref={preRef}
        className={className}
        tabIndex={0}
        onKeyDown={selectOnlyThisBlock}
      >
        {children}
      </pre>
    </div>
  )
}
