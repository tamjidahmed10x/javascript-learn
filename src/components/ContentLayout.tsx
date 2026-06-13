import { Link, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { useState, type ReactNode } from 'react'
import './ContentLayout.css'

export interface NavItem {
  label: string
  path: string
}

export interface ContentLayoutProps {
  title: string
  subtitle?: string
  navItems: NavItem[]
  children: ReactNode
}

function SidebarToggle({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      className={`sidebar-toggle ${open ? 'is-open' : ''}`}
      onClick={onClick}
      aria-label={open ? 'Close navigation' : 'Open navigation'}
      aria-expanded={open}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {open ? (
          <>
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </>
        ) : (
          <>
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </>
        )}
      </svg>
    </button>
  )
}

export default function ContentLayout({ title, subtitle, navItems, children }: ContentLayoutProps) {
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="content-layout">
      {/* Mobile header */}
      <div className="content-mobile-header">
        <SidebarToggle open={sidebarOpen} onClick={() => setSidebarOpen(!sidebarOpen)} />
        <Link to="/" className="nav-logo" aria-label="Home">
          <span className="logo-bracket">{'{'}</span>
          <span className="logo-text">js.learn</span>
          <span className="logo-bracket">{'}'}</span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`content-sidebar ${sidebarOpen ? 'is-open' : ''}`}>
        <div className="sidebar-top">
          <Link to="/" className="nav-logo" aria-label="Home">
            <span className="logo-bracket">{'{'}</span>
            <span className="logo-text">js.learn</span>
            <span className="logo-bracket">{'}'}</span>
          </Link>
        </div>
        <nav className="sidebar-nav" aria-label="Section navigation">
          <div className="sidebar-section-label">{title}</div>
          {subtitle && <p className="sidebar-section-subtitle">{subtitle}</p>}
          <ul className="sidebar-links">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`sidebar-link ${isActive ? 'is-active' : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className="sidebar-link-text">{item.label}</span>
                    {isActive && (
                      <span className="sidebar-link-indicator" aria-hidden="true" />
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        <div className="sidebar-bottom">
          <ThemeToggle />
        </div>
      </aside>

      {/* Main content */}
      <main className="content-main">{children}</main>
    </div>
  )
}
