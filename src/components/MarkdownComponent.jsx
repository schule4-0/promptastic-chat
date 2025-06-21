import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

// Customize component own styling

/**
 * @returns LLMOutputComponent
 */
const MarkdownComponent = ({ blockMatch }) => {
  const markdown = blockMatch.output
  return <ReactMarkdown remarkPlugins={[remarkGfm]}>{markdown}</ReactMarkdown>
}

export default MarkdownComponent
