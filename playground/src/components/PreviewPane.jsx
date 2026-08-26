import { Component, useEffect } from 'react'

/**
 * Problem components render in-process, in the same React tree as the app
 * shell -- so an uncaught throw would blank the whole page. This boundary
 * contains the damage to the preview pane. React only supports error
 * boundaries as class components; there is no hook equivalent.
 */
class PreviewErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="preview-error">
          <strong>This problem threw while rendering.</strong>
          <pre>{String(this.state.error)}</pre>
        </div>
      )
    }
    return this.props.children
  }
}

/**
 * Problems using createPortal render into document.body, OUTSIDE the preview
 * pane -- so the scoped stylesheet's descendant selectors never match them and
 * the content renders completely unstyled (a modal that appears not to open).
 *
 * Tag each element portalled into <body> with the scope attribute while this
 * problem is mounted. scopeCss emits a matching "self" form for every rule, so
 * the portal root and everything inside it pick up the problem's styles without
 * the stylesheet leaking to the app shell.
 */
function usePortalScope(problemId) {
  useEffect(() => {
    const tagged = new Set()
    const tag = (node) => {
      if (node.nodeType !== 1 || node.dataset.problem) return
      node.dataset.problem = problemId
      tagged.add(node)
    }

    // Anything already there (a portal rendered during this commit).
    for (const child of document.body.children) {
      if (child.id !== 'root') tag(child)
    }

    const observer = new MutationObserver((records) => {
      for (const record of records) record.addedNodes.forEach(tag)
    })
    observer.observe(document.body, { childList: true })

    return () => {
      observer.disconnect()
      for (const node of tagged) delete node.dataset.problem
    }
  }, [problemId])
}

export default function PreviewPane({ problemId, Component: Problem, css }) {
  usePortalScope(problemId)

  return (
    // data-problem is the anchor every scoped rule is prefixed with, so the
    // stylesheet below only applies inside this subtree.
    <div className="preview-pane" data-problem={problemId}>
      {css ? <style>{css}</style> : null}
      {/* Keyed by problem id so switching problems resets a previously
          caught error instead of showing it forever. */}
      <PreviewErrorBoundary key={problemId}>
        <Problem />
      </PreviewErrorBoundary>
    </div>
  )
}
