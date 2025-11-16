import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API, { setAuthToken } from '../api.js'
import BackgroundScene from '../components/BackgroundScene'
import Mascot from '../components/Mascot'
import '../Auth.css'

export default function LoginRegister({ setUser }) {
  const [mode, setMode] = useState('login')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)   // 👁️ toggle state
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_user')) } catch { return null }
  })

  useEffect(() => {
    const u = (() => { try { return JSON.parse(localStorage.getItem('cv_user')) } catch { return null } })()
    setCurrentUser(u)
  }, [])

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSuccess = (user, token) => {
    localStorage.setItem('cv_token', token)
    localStorage.setItem('cv_user', JSON.stringify(user))
    setAuthToken(token)
    setUser(user)
    setCurrentUser(user)
    navigate('/dashboard')
  }

  const submitLogin = async e => {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const res = await API.post('/auth/login', { email: form.email, password: form.password })
      const data = res.data
      const token = data.token || data?.data?.token
      const user = data.user || data || data?.data || null
      if (!token) throw new Error('No token from server')
      handleSuccess(user, token)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Login failed')
    } finally { setLoading(false) }
  }

  const submitRegister = async e => {
    e.preventDefault()
    if (!form.name || !form.email || !form.password) { setError('Fill all fields'); return }
    setError(''); setLoading(true)
    try {
      const res = await API.post('/auth/register', { name: form.name, email: form.email, password: form.password })
      const data = res.data
      const token = data.token || data?.data?.token
      const user = data.user || data || data?.data || null
      if (!token) throw new Error('No token from server')
      handleSuccess(user, token)
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  const mascotStage = currentUser ? 'celebrate' : 'preAuth'

  const handleMascotAction = (action) => {
    if (action === 'signup' || action === 'ready') {
      setMode('register')
      document.querySelector('.auth-card')?.scrollIntoView({ behaviour: 'smooth', block: 'center' })
    } else if (action === 'intro') {
      setMode('login')
    } else if (action === 'add') {
      navigate('/add')
    } else {
      document.querySelector('.auth-card')?.scrollIntoView({ behaviour: 'smooth', block: 'center' })
    }
  }

  return (
    <>
      <BackgroundScene heavy={false} />
      <Mascot stage={mascotStage} onRequestAction={handleMascotAction} />
      <div className="auth-page">
        <div className="auth-card">
          <div className="brand"><div className="logo">🎓</div><h1>CourseVault</h1></div>

          <div className="tabs">
            <button className={mode==='login'?'tab active':'tab'} onClick={()=>{setMode('login'); setError('')}}>Login</button>
            <button className={mode==='register'?'tab active':'tab'} onClick={()=>{setMode('register'); setError('')}}>Create account</button>
          </div>

          <form className="auth-form" onSubmit={mode==='login' ? submitLogin : submitRegister}>
            {mode==='register' && (
              <label className="field"><span>Name</span>
                <input name="name" value={form.name} onChange={onChange} placeholder="Your full name" />
              </label>
            )}

            <label className="field"><span>Email</span>
              <input name="email" type="email" value={form.email} onChange={onChange} placeholder="you@domain.com" />
            </label>

            {/* 🔒 Password with show/hide */}
            <label className="field password-field">
              <span>Password</span>
              <div className="password-wrapper">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={onChange}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(p => !p)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </label>

            {error && <div className="error">{error}</div>}

            <div className="actions">
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? (mode==='login'?'Logging in...':'Creating...') : (mode==='login'?'Login':'Create account')}
              </button>

              <button type="button" className="btn ghost" onClick={()=>{ setMode(mode==='login'?'register':'login'); setError('') }}>
                {mode==='login' ? 'Create account' : 'Have an account?'}
              </button>
            </div>
          </form>

          <div className="footer-note"><small>This is a demo — no spam.</small></div>
        </div>
      </div>
    </>
  )
}
