// src/pages/EditCourse.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../api'
import BackgroundScene from '../components/BackgroundScene'
import Mascot from '../components/Mascot'
import '../Auth.css'

export default function EditCourse() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    title: '',
    platform: '',
    link: '',
    category: 'General',
    status: 'Not Started',
    progress: 0,
    notes: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      try {
        // try GET /courses/:id
        const { data } = await API.get(`/courses/${id}`)
        if (!mounted) return
        if (!data) {
          alert('Course not found')
          navigate('/dashboard')
          return
        }
        setForm({
          title: data.title || '',
          platform: data.platform || '',
          link: data.link || '',
          category: data.category || 'General',
          status: data.status || 'Not Started',
          progress: data.progress ?? 0,
          notes: data.notes || ''
        })
      } catch (err) {
        console.error(err)
        alert(err.response?.data?.message || 'Failed to load course')
        navigate('/dashboard')
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [id, navigate])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm(f => ({ ...f, [name]: value }))
  }

  const validate = () => {
    if (!form.title.trim()) { alert('Please enter a course title'); return false }
    if (form.progress < 0 || form.progress > 100) { alert('Progress must be between 0 and 100'); return false }
    return true
  }

  const handleUpdate = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await API.put(`/courses/${id}`, {
        title: form.title.trim(),
        platform: form.platform.trim(),
        link: form.link.trim(),
        category: form.category.trim() || 'General',
        status: form.status,
        progress: Number(form.progress || 0),
        notes: form.notes.trim()
      })
      alert('Course updated ✅')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      alert(err.response?.data?.message || 'Update failed')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <>
      <BackgroundScene heavy={false} />
      <div className="page-wrap">
        <div className="card-form">
          <h2 className="form-title">Edit Course</h2>
          <p>Loading...</p>
        </div>
      </div>
    </>
  )

  return (
    <>
      <BackgroundScene heavy={false} />
      <Mascot stage="dashboard" onRequestAction={(a)=>{ if (a==='edit') window.scrollTo({top:0, behavior:'smooth'}) }} />

      <div className="page-wrap">
        <div className="card-form">
          <h2 className="form-title">Edit Course</h2>

          <form onSubmit={handleUpdate} className="form-grid">
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
              <button className="btn primary" type="submit" disabled={saving}>
                {saving ? 'Updating...' : 'Update'}
              </button>
              <button type="button" className="btn ghost" onClick={()=>navigate('/dashboard')} disabled={saving}>
                Back
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
