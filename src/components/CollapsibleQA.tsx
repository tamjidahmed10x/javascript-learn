import { useState, type ReactNode } from 'react'

interface CollapsibleQAProps {
  question: ReactNode
  answer: ReactNode
  difficulty?: 'easy' | 'medium' | 'hard' | 'boss'
  defaultOpen?: boolean
}

export default function CollapsibleQA({ question, answer, difficulty, defaultOpen = false }: CollapsibleQAProps) {
  const [open, setOpen] = useState(defaultOpen)

  const handleToggle = () => setOpen(!open)

  return (
    <div className={`collapsible-qa ${open ? 'is-open' : ''} ${difficulty ? `diff-${difficulty}` : ''}`}>
      <button
        className="collapsible-toggle"
        onClick={handleToggle}
        aria-expanded={open}
      >
        <span className="collapsible-label">Question</span>
        <span className="collapsible-arrow">{open ? '↓' : '→'}</span>
      </button>
      {open && (
        <div className="collapsible-question">{question}</div>
      )}
      {open && (
        <div className="collapsible-answer">
          <button
            className="collapsible-toggle collapsible-answer-toggle"
            onClick={handleToggle}
            aria-expanded={open}
          >
            <span className="collapsible-label">Answer + Explanation</span>
            <span className="collapsible-arrow">↓</span>
          </button>
          {open && <div className="collapsible-answer-content">{answer}</div>}
        </div>
      )}
    </div>
  )
}
