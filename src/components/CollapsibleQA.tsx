import { useState, type ReactNode } from 'react'

interface CollapsibleQAProps {
  question: ReactNode
  answer: ReactNode
  difficulty?: 'easy' | 'medium' | 'hard' | 'boss'
  defaultOpen?: boolean
  label?: string
}

export default function CollapsibleQA({ question, answer, difficulty, defaultOpen = false, label }: CollapsibleQAProps) {
  const [questionOpen, setQuestionOpen] = useState(defaultOpen)
  const [answerOpen, setAnswerOpen] = useState(false)

  return (
    <div className={`collapsible-qa ${difficulty ? `diff-${difficulty}` : ''}`}>
      <button
        className="collapsible-toggle"
        onClick={() => setQuestionOpen(!questionOpen)}
        aria-expanded={questionOpen}
      >
        <span className="collapsible-label">{label ?? 'Question'}</span>
        <span className="collapsible-arrow">{questionOpen ? '↓' : '→'}</span>
      </button>
      {questionOpen && (
        <div className="collapsible-question">{question}</div>
      )}
      {questionOpen && (
        <div className="collapsible-answer">
          <button
            className="collapsible-toggle collapsible-answer-toggle"
            onClick={() => setAnswerOpen(!answerOpen)}
            aria-expanded={answerOpen}
          >
            <span className="collapsible-label">{label ? `Answer ${label.replace(/^Question\s*/, '')}` : 'Answer + Explanation'}</span>
            <span className="collapsible-arrow">{answerOpen ? '↓' : '→'}</span>
          </button>
          {answerOpen && <div className="collapsible-answer-content">{answer}</div>}
        </div>
      )}
    </div>
  )
}
