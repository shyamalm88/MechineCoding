/**
 * MarkdownView component
 *
 * Tiny built-in markdown renderer (no external libs).
 * Supports:
 * - # Headings (h1–h6)
 * - **bold**, *italic*
 * - `code`
 * - Lists (-, *)
 * - Paragraphs
 *
 * Not production-grade, but good enough for interview practice.
 */
function MarkdownView({ markdown }) {
  // Simple line-by-line parser
  const renderMarkdown = (md) => {
    if (!md) return null

    const lines = md.split('\n')
    const elements = []
    let key = 0

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Headings: # H1, ## H2, etc.
      const headingMatch = line.match(/^(#{1,6})\s+(.+)/)
      if (headingMatch) {
        const level = headingMatch[1].length
        const text = headingMatch[2]
        const Tag = `h${level}`
        elements.push(<Tag key={key++}>{parseInline(text)}</Tag>)
        continue
      }

      // List items: - or *
      if (line.match(/^[\-\*]\s+/)) {
        const text = line.replace(/^[\-\*]\s+/, '')
        elements.push(<li key={key++}>{parseInline(text)}</li>)
        continue
      }

      // Empty line
      if (line.trim() === '') {
        elements.push(<br key={key++} />)
        continue
      }

      // Default: paragraph
      elements.push(<p key={key++}>{parseInline(line)}</p>)
    }

    return elements
  }

  // Parse inline formatting: **bold**, *italic*, `code`
  const parseInline = (text) => {
    const parts = []
    let key = 0

    // Simple regex-based replacements (not perfect, but works for basics)
    const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/)

    tokens.forEach((token, idx) => {
      // Bold: **text**
      if (token.startsWith('**') && token.endsWith('**')) {
        const inner = token.slice(2, -2)
        parts.push(<strong key={key++}>{inner}</strong>)
      }
      // Italic: *text*
      else if (token.startsWith('*') && token.endsWith('*')) {
        const inner = token.slice(1, -1)
        parts.push(<em key={key++}>{inner}</em>)
      }
      // Code: `text`
      else if (token.startsWith('`') && token.endsWith('`')) {
        const inner = token.slice(1, -1)
        parts.push(<code key={key++}>{inner}</code>)
      }
      // Plain text
      else {
        parts.push(token)
      }
    })

    return parts
  }

  return <div className="markdown-view">{renderMarkdown(markdown)}</div>
}

export default MarkdownView
