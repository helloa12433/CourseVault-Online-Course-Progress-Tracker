import React, { useState } from 'react'
import API, { setAuthToken } from '../api.js'
import { useNavigate } from 'react-router-dom'

export default function AuthForm({ onAuth }) {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name:'', email:'', password:'' })
  const navigate = useNavigate()

  const toggle = () => { setIsLogin(!isLogin); setForm({ name:'', email:'', password:'' }) }

  const submit = async (e) => {
    e.preventDefault()
    try {
      const url = isLogin ? '/auth/login' : '/auth/register'
      const res = await API.post(url, form)
      const { token, user } = res.data
      setAuthToken(token)
      localStorage.setItem('cv_token', token)
      localStorage.setItem('cv_user', JSON.stringify(user))
      onAuth(user)
      navigate('/dashboard')
    } catch (err) {
      alert(err.response?.data?.message || 'Auth error')
    }
  }

  return (
    <div className="container">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <h2>{isLogin ? 'Login' : 'Register'}</h2>
        <button className="btn ghost" onClick={toggle}>{isLogin ? 'Create account' : 'Have an account?'}</button>
      </div>

      <form onSubmit={submit}>
        {!isLogin && (
          <>
            <label>Name</label>
            <input className="input" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
          </>
        )}
        <label>Email</label>
        <input className="input" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required />
        <label>Password</label>
        <input className="input" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required />
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button className="btn primary" type="submit">{isLogin ? 'Login' : 'Register'}</button>
        </div>
      </form>
    </div>
  )
}
