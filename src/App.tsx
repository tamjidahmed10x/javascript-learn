import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'

const Landing = lazy(() => import('./pages/Landing'))
const Week1Index = lazy(() => import('./pages/core-concepts/Week1Index'))
const Day1 = lazy(() => import('./pages/core-concepts/Day1'))
const Day2 = lazy(() => import('./pages/core-concepts/Day2'))
const Day3 = lazy(() => import('./pages/core-concepts/Day3'))
const Day4 = lazy(() => import('./pages/core-concepts/Day4'))
const Day5 = lazy(() => import('./pages/core-concepts/Day5'))
const Day6 = lazy(() => import('./pages/core-concepts/Day6'))
const Day7 = lazy(() => import('./pages/core-concepts/Day7'))
const ExecutionContextGuide = lazy(() => import('./pages/core-concepts/ExecutionContextGuide'))

function AppLoading() {
  return (
    <div
      style={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'var(--font-mono, monospace)',
        fontSize: '0.875rem',
        color: 'var(--color-muted, #888)',
      }}
    >
      Loading...
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Suspense fallback={<AppLoading />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/core-concepts/execution-context-scope" element={<Week1Index />} />
          <Route path="/core-concepts/execution-context-guide" element={<ExecutionContextGuide />} />
          <Route path="/core-concepts/execution-context-scope/day-1" element={<Day1 />} />
          <Route path="/core-concepts/execution-context-scope/day-2" element={<Day2 />} />
          <Route path="/core-concepts/execution-context-scope/day-3" element={<Day3 />} />
          <Route path="/core-concepts/execution-context-scope/day-4" element={<Day4 />} />
          <Route path="/core-concepts/execution-context-scope/day-5" element={<Day5 />} />
          <Route path="/core-concepts/execution-context-scope/day-6" element={<Day6 />} />
          <Route path="/core-concepts/execution-context-scope/day-7" element={<Day7 />} />
        </Routes>
      </Suspense>
    </ThemeProvider>
  )
}

export default App
