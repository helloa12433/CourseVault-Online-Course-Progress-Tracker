import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import BackgroundScene from '../components/BackgroundScene'
import Mascot from '../components/Mascot'
import '../Auth.css' // form styling lives here (or App.css)

export default function AddCourse() {
  const [form, setForm] = useState({
    title: '',
    platform: '',
    link: '',
    category: 'General',
    status: 'Not Started',
    progress: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const onChange = e => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const validate = () => {
    if (!form.title.trim()) { alert('Please enter a course title'); return false }
    if (form.progress < 0 || form.progress > 100) { alert('Progress must be between 0 and 100'); return false }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      await API.post('/courses', {
        title: form.title.trim(),
        platform: form.platform.trim(),
        link: form.link.trim(),
        category: form.category.trim() || 'General',
        status: form.status,
        progress: Number(form.progress || 0),
        notes: form.notes.trim()
      })
      alert('Course added ✅')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Failed to add course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* subtle background (solar system) behind UI */}
      <BackgroundScene heavy={false} />

      {/* mascot optional — keeps guiding UI */}
      <Mascot stage="dashboard" onRequestAction={(a)=>{ if (a==='add') window.scrollTo({top:0, behavior:'smooth'}) }} />

      <div className="page-wrap">
        <div className="card-form">
          <h2 className="form-title">Add Course</h2>

          <form onSubmit={handleSubmit} className="form-grid">
            <input name="title" value={form.title} onChange={onChange} placeholder="Title" className="field-input" />

            <input name="platform" value={form.platform} onChange={onChange} placeholder="Platform (Udemy, YouTube...)" className="field-input" />

            <input name="link" value={form.link} onChange={onChange} placeholder="Course link (optional)" className="field-input" />

            <input name="category" value={form.category} onChange={onChange} placeholder="Category" className="field-input" />

            <select name="status" value={form.status} onChange={onChange} className="field-input">
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>

            <input name="progress" type="number" min="0" max="100" value={form.progress} onChange={onChange} className="field-input" />

            <textarea name="notes" placeholder="Notes" value={form.notes} onChange={onChange} className="field-textarea" rows={4} />

            <div className="form-actions">
              <button className="btn primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save'}
              </button>
              <button type="button" className="btn ghost" onClick={()=>navigate('/dashboard')} disabled={loading}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
