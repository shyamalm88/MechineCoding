import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'

export default function MarkdownView({ markdown }) {
  if (!markdown) return null

  return (
    <div className="markdown-view">
      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{markdown}</ReactMarkdown>
    </div>
  )
}
