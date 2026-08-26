import { Component } from 'react'

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

export default function PreviewPane({ problemId, Component: Problem }) {
  return (
    <div className="preview-pane">
      {/* Keyed by problem id so switching problems resets a previously
          caught error instead of showing it forever. */}
      <PreviewErrorBoundary key={problemId}>
        <Problem />
      </PreviewErrorBoundary>
    </div>
  )
}
