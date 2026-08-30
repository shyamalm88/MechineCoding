import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import CopyableCode from './CopyableCode.jsx'

const RENDERERS = {
  // Fenced blocks in a description get the same copy button and scoped
  // select-all as the Code tab.
  pre: ({ children }) => <CopyableCode>{children}</CopyableCode>,

  // problem.md files are authored as standalone documents, so each opens with
  // its own `# Title`. Rendered as-is that would emit a second <h1> duplicating
  // the one already in the workspace header -- two top-level headings on one
  // page, which screen readers announce as two competing document titles.
  // Demoting every heading one level nests the document under the page title
  // without hiding any content.
  h1: ({ children }) => <h2>{children}</h2>,
  h2: ({ children }) => <h3>{children}</h3>,
  h3: ({ children }) => <h4>{children}</h4>,
  h4: ({ children }) => <h5>{children}</h5>,
  h5: ({ children }) => <h6>{children}</h6>,
}

export default function MarkdownView({ markdown }) {
  if (!markdown) return null

  return (
    <div className="markdown-view">
      {/* remark-gfm adds tables, strikethrough and task lists -- several
          problem descriptions lean on comparison tables, which plain
          CommonMark renders as literal pipe characters. */}
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={RENDERERS}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  )
}
