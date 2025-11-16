import React, { useEffect, useState, useRef } from 'react'
import './Mascot.css'

/**
 * Props:
 *  - stage: "intro" | "preAuth" | "celebrate" | "dashboard" | "crudTips"
 *  - onRequestAction(action: string) => void
 *
 * Example stages usage:
 *  LoginRegister: stage = user ? "celebrate" : "preAuth"
 *  Dashboard: stage = "dashboard" or "crudTips"
 */
export default function Mascot({ stage = 'intro', onRequestAction = () => {} }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const cycleRef = useRef(null)

  const messages = {
    intro: [
      { text: 'Hey there! Welcome to CourseVault.', cta: 'Let me show you around', action: 'intro' },
    ],
    preAuth: [
      { text: 'Hi! I can help — Login or Create account to get started.', cta: 'Go to Signup', action: 'signup' },
      { text: 'Tip: Use a valid email. I\'ll cheer when you finish!', cta: 'I\'m ready', action: 'ready' },
    ],
    celebrate: [
      { text: 'Hurrah! You\'re in 🥳 — Now try adding a course.', cta: 'Add Course', action: 'add' },
    ],
    dashboard: [
      { text: 'Great! You can add, edit or delete your courses here.', cta: 'Add course', action: 'add' },
      { text: 'Edit a course to update progress — great habit!', cta: 'Edit demo', action: 'edit' },
      { text: 'Delete unused ones — tidy dashboard = happy brain!', cta: 'Delete demo', action: 'delete' },
    ],
    crudTips: [
      { text: 'Add a course, update progress, and celebrate 100%!', cta: 'Add now', action: 'add' },
    ],
  }

  // pick the active messages array from stage
  const active = messages[stage] || messages['intro']

  // cycle messages every 4 seconds
  useEffect(() => {
    setMsgIndex(0)
    if (cycleRef.current) clearInterval(cycleRef.current)
    cycleRef.current = setInterval(() => {
      setMsgIndex(i => (i + 1) % active.length)
    }, 3500)
    return () => {
      if (cycleRef.current) clearInterval(cycleRef.current)
    }
  }, [stage])

  // some classes allow the mascot to position/point differently
  // classes: mascot--point-login, mascot--celebrate, mascot--point-dashboard
  const stageClass = {
    preAuth: 'mascot--point-login',
    celebrate: 'mascot--celebrate',
    dashboard: 'mascot--point-dashboard',
    crudTips: 'mascot--point-dashboard',
    intro: 'mascot--center',
  }[stage] || 'mascot--center'

  const current = active[msgIndex] || active[0]

  return (
    <div className={`mascot-wrap ${stageClass}`} aria-hidden="true">
      {/* mascot SVG / simple character */}
      <div className="mascot-body" >
        <svg width="160" height="160" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg">
          {/* simple friendly character */}
          <defs>
            <linearGradient id="g1" x1="0" x2="1">
              <stop offset="0" stopColor="#ffd27f" />
              <stop offset="1" stopColor="#ffb36b" />
            </linearGradient>
            <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="6" stdDeviation="10" floodOpacity="0.12"/>
            </filter>
          </defs>

          <g filter="url(#shadow)">
            <circle cx="80" cy="52" r="40" fill="url(#g1)" />
            <rect x="36" y="92" rx="18" ry="18" width="88" height="40" fill="#ffe0c6" />
          </g>

          {/* eyes */}
          <circle cx="66" cy="45" r="4.5" fill="#222" />
          <circle cx="94" cy="45" r="4.5" fill="#222" />

          {/* smile */}
          <path d="M62 60 Q80 72 98 60" stroke="#6b3a1e" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* arm pointing (we will rotate it via CSS) */}
          <g className="mascot-arm" transform="translate(30,80)">
            <rect x="0" y="-6" rx="6" ry="6" width="40" height="12" fill="#ffd7b6" />
            <circle cx="44" cy="0" r="8" fill="#ffd7b6" />
          </g>
        </svg>
      </div>

      {/* speech bubble */}
      <div className="mascot-speech">
        <div className="mascot-text">{current.text}</div>
        <div
          className="mascot-cta"
          role="button"
          tabIndex={0}
          onClick={() => onRequestAction(current.action)}
          onKeyDown={(e) => { if (e.key === 'Enter') onRequestAction(current.action) }}
        >
          {current.cta}
        </div>
      </div>

      {/* animated pointing arrow — CSS places it differently per stage */}
      <div className="mascot-arrow" />
    </div>
  )
}
