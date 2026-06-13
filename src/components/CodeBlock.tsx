import type { ReactNode } from 'react'

function highlightJS(code: string): ReactNode[] {
  const lines = code.split('\n')
  return lines.map((line, lineIdx) => {
    const parts: ReactNode[] = []
    let remaining = line
    let key = 0

    while (remaining.length > 0) {
      const commentMatch = remaining.match(/^(\/\/.*)/)
      if (commentMatch) {
        parts.push(
          <span key={key++} className="syn-comment">
            {commentMatch[1]}
          </span>
        )
        remaining = remaining.slice(commentMatch[1].length)
        continue
      }

      const stringMatch = remaining.match(/^(['"])(.*?)(\1)/)
      if (stringMatch) {
        parts.push(
          <span key={key++} className="syn-string">
            {stringMatch[0]}
          </span>
        )
        remaining = remaining.slice(stringMatch[0].length)
        continue
      }

      const numMatch = remaining.match(/^(\d+)/)
      if (numMatch) {
        parts.push(
          <span key={key++} className="syn-number">
            {numMatch[1]}
          </span>
        )
        remaining = remaining.slice(numMatch[1].length)
        continue
      }

      const kwMatch = remaining.match(
        /^(function|return|let|const|var|if|else|for|while|new|class|extends|import|export|from|async|await|yield|typeof|instanceof|in|of|switch|case|break|continue|default|try|catch|throw|finally|this|true|false|null|undefined|void|delete)\b/
      )
      if (kwMatch) {
        parts.push(
          <span key={key++} className="syn-keyword">
            {kwMatch[1]}
          </span>
        )
        remaining = remaining.slice(kwMatch[1].length)
        continue
      }

      const fnMatch = remaining.match(/^([a-zA-Z_$][\w$]*)\s*(?=\()/)
      if (fnMatch) {
        parts.push(
          <span key={key++} className="syn-function">
            {fnMatch[1]}
          </span>
        )
        remaining = remaining.slice(fnMatch[1].length)
        continue
      }

      parts.push(remaining[0])
      remaining = remaining.slice(1)
    }

    return (
      <span key={lineIdx}>
        {parts}
        {lineIdx < lines.length - 1 ? '\n' : ''}
      </span>
    )
  })
}

interface CodeBlockProps {
  code: string
  filename?: string
  label?: string
}

export default function CodeBlock({ code, filename, label }: CodeBlockProps) {
  return (
    <div className="lesson-code">
      {(filename || label) && (
        <div className="lesson-code-header">
          <div className="lesson-code-dots">
            <span className="lesson-code-dot" />
            <span className="lesson-code-dot" />
            <span className="lesson-code-dot" />
          </div>
          {filename ? (
            <span className="lesson-code-filename">{filename}</span>
          ) : label ? (
            <span className="lesson-code-label">{label}</span>
          ) : null}
        </div>
      )}
      <pre className="lesson-code-pre">
        <code>{highlightJS(code)}</code>
      </pre>
    </div>
  )
}

export { highlightJS }
