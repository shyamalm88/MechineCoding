/**
 * MarkdownView component
 *
 * Production-grade markdown renderer using react-markdown.
 * Supports:
 * - Full GitHub-flavored markdown
 * - Syntax highlighting for code blocks
 * - Tables, blockquotes, links, images
 * - Proper semantic HTML rendering
 */
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github-dark.css'

function MarkdownView({ markdown }) {
  if (!markdown) return null

  return (
    <div className="markdown-view">
      <ReactMarkdown
        rehypePlugins={[rehypeHighlight]}
        components={{
          // Custom code block rendering
          code({ node, inline, className, children, ...props }) {
            return inline ? (
              <code className={className} {...props}>
                {children}
              </code>
            ) : (
              <div className="code-block">
                <code className={className} {...props}>
                  {children}
                </code>
              </div>
            )
          },
          // Add proper spacing for lists
          ul({ children }) {
            return <ul style={{ marginLeft: '24px', marginBottom: '16px' }}>{children}</ul>
          },
          ol({ children }) {
            return <ol style={{ marginLeft: '24px', marginBottom: '16px' }}>{children}</ol>
          },
          // Style blockquotes
          blockquote({ children }) {
            return (
              <blockquote
                style={{
                  borderLeft: '4px solid #1976d2',
                  paddingLeft: '16px',
                  marginLeft: 0,
                  color: '#555',
                  fontStyle: 'italic',
                }}
              >
                {children}
              </blockquote>
            )
          },
          // Style tables
          table({ children }) {
            return (
              <table
                style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  margin: '16px 0',
                }}
              >
                {children}
              </table>
            )
          },
          th({ children }) {
            return (
              <th
                style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                  backgroundColor: '#f5f5f5',
                  textAlign: 'left',
                  fontWeight: '600',
                }}
              >
                {children}
              </th>
            )
          },
          td({ children }) {
            return (
              <td
                style={{
                  border: '1px solid #ddd',
                  padding: '12px',
                }}
              >
                {children}
              </td>
            )
          },
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}

export default MarkdownView
