/**
 * CodeBlock component
 *
 * Displays source code in a pre/code block.
 * No syntax highlighting (keeping it simple).
 * Preserves whitespace and uses monospace font.
 */
function CodeBlock({ code, language = 'javascript' }) {
  return (
    <pre className="code-block">
      <code className={`language-${language}`}>
        {code || '// No code available'}
      </code>
    </pre>
  )
}

export default CodeBlock
