import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import BackgroundScene from '../components/BackgroundScene'
import Mascot from '../components/Mascot'
import '../App.css' // ensure styles import (or put CSS in App.css / Auth.css)

export default function Dashboard({ user, onLogout }) {
  const [courses, setCourses] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ search:'', status:'', category:'' })
  const navigate = useNavigate()

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const { data } = await API.get('/courses')
      const normalized = (data || []).map(c => ({
        ...c,
        progress: (typeof c.progress === 'number' ? c.progress : 100)
      }))
      setCourses(normalized)
      setFiltered(normalized)
    } catch (err) { console.error(err); alert('Failed to load courses') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchCourses() }, [])

  const applyFilters = () => {
    let out = [...courses]
    if (filters.search) out = out.filter(c=>c.title.toLowerCase().includes(filters.search.toLowerCase()))
    if (filters.status) out = out.filter(c=>c.status===filters.status)
    if (filters.category) out = out.filter(c=>c.category.toLowerCase().includes(filters.category.toLowerCase()))
    setFiltered(out)
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this course?')) return
    try {
      await API.delete(`/courses/${id}`)
      setCourses(prev => prev.filter(c=>c._id!==id))
      setFiltered(prev => prev.filter(c=>c._id!==id))
    } catch (err) { console.error(err); alert('Delete failed') }
  }

  // on hover choose one of 8 directions and set CSS vars --tx, --ty on the element
  const handleCardEnter = (e) => {
    const el = e.currentTarget
    // directions in pixels (8 directions)
    const dirs = [
      { x: 0, y: -8 },   // N
      { x: 8, y: -8 },   // NE
      { x: 10, y: 0 },   // E
      { x: 8, y: 8 },    // SE
      { x: 0, y: 10 },   // S
      { x: -8, y: 8 },   // SW
      { x: -10, y: 0 },  // W
      { x: -8, y: -8 }   // NW
    ]
    const idx = Math.floor(Math.random() * dirs.length)
    const d = dirs[idx]
    // set CSS custom properties that our stylesheet reads
    el.style.setProperty('--tx', `${d.x}px`)
    el.style.setProperty('--ty', `${d.y}px`)
    // slight rotation and scale to feel dynamic
    el.style.setProperty('--rot', `${(d.x + d.y) * 0.6}deg`)
    el.classList.add('is-hovered')
  }

  const handleCardLeave = (e) => {
    const el = e.currentTarget
    el.style.setProperty('--tx', `0px`)
    el.style.setProperty('--ty', `0px`)
    el.style.setProperty('--rot', `0deg`)
    el.classList.remove('is-hovered')
  }

  // Mascot action handler unchanged
  const handleMascotAction = (action) => {
    if (action === 'add') {
      navigate('/add')
    } else if (action === 'edit') {
      if (filtered.length > 0) navigate(`/edit/${filtered[0]._id}`)
      else alert('No courses to edit — add one first.')
    } else if (action === 'delete') {
      if (filtered.length > 0) {
        const selector = `[data-course-id="${filtered[0]._id}"]`
        const el = document.querySelector(selector)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.style.transition = 'box-shadow 0.3s ease'
          el.style.boxShadow = '0 0 0 4px rgba(239,68,68,0.12)'
          setTimeout(()=> el.style.boxShadow = '0 3px 12px rgba(0,0,0,0.06)', 900)
        }
      } else {
        alert('No courses to delete — add one first.')
      }
    }
  }

  const clamp = v => Math.max(0, Math.min(100, Number(v || 0)))

  return (
    <>
      <BackgroundScene heavy={true} />
      <Mascot stage="dashboard" onRequestAction={handleMascotAction} />

      <div style={{
        padding: '20px',
        maxWidth: 1100,
        margin: '0 auto',
        position: 'relative',
        zIndex: 60,
        paddingRight: 220,
        color: '#fff'
      }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
          <div style={{ display:'flex', gap:12, alignItems:'center' }}>
            <div style={{ fontSize:22, fontWeight:700, color: '#ffffff' }}>🎓 CourseVault</div>
            <div style={{ color:'#cbd5e1' }}>Dashboard</div>
          </div>

          <div style={{ display:'flex', gap:10, alignItems:'center' }}>
            <div style={{ fontWeight:600, color:'#fff' }}>{user?.name}</div>
            <button className="btn ghost" onClick={()=>navigate('/add')} style={{ background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.08)' }}>Add Course</button>
            <button className="btn" onClick={onLogout} style={{ background:'rgba(255,255,255,0.12)', color:'#fff', border:'none' }}>Logout</button>
          </div>
        </header>

        <div style={{ display:'flex', gap:8, marginBottom:16 }}>
          <input placeholder="Search title..." value={filters.search} onChange={e=>setFilters(f=>({...f,search:e.target.value}))} style={{flex:1,padding:8,borderRadius:6, background:'rgba(255,255,255,0.04)', color:'#fff', border:'1px solid rgba(255,255,255,0.08)'}} />
          <select value={filters.status} onChange={e=>setFilters(f=>({...f,status:e.target.value}))} style={{padding:8,borderRadius:6, background:'rgba(255,255,255,0.04)', color:'#fff', border:'1px solid rgba(255,255,255,0.08)'}}>
            <option value="">All status</option>
            <option>Not Started</option><option>In Progress</option><option>Completed</option>
          </select>
          <input placeholder="Category (optional)" value={filters.category} onChange={e=>setFilters(f=>({...f,category:e.target.value}))} style={{padding:8,borderRadius:6, background:'rgba(255,255,255,0.04)', color:'#fff', border:'1px solid rgba(255,255,255,0.08)'}} />
          <button className="btn primary" onClick={applyFilters} style={{ background:'linear-gradient(90deg,#60a5fa,#2563eb)', color:'#fff' }}>Apply</button>
          <button className="btn ghost" onClick={()=>{ setFilters({search:'',status:'',category:''}); setFiltered(courses) }} style={{ background:'rgba(255,255,255,0.06)', color:'#fff', border:'1px solid rgba(255,255,255,0.08)' }}>Clear</button>
        </div>

        {loading ? <p style={{ color:'#fff' }}>Loading...</p> : (
          filtered.length===0 ? <p style={{ color:'#fff' }}>No courses yet. Add one!</p> :
          <div style={{
            display:'grid',
            gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',
            gap:20,
            alignItems: 'start'
          }}>
            {filtered.map(c => {
              const progress = clamp(c.progress)
              return (
                <div
                  key={c._id}
                  data-course-id={c._id}
                  className="course-card"
                  onMouseEnter={handleCardEnter}
                  onMouseLeave={handleCardLeave}
                  style={{
                    background:'#fff',
                    padding:16,
                    borderRadius:10,
                    boxShadow:'0 6px 30px rgba(2,6,23,0.35)',
                    // initial css vars
                    transform: 'translate(var(--tx, 0px), var(--ty, 0px)) rotate(var(--rot, 0deg))',
                    transition: 'transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms'
                  }}
                >
                  <h3 style={{ marginTop:0, color:'#0f172a' }}>{c.title}</h3>
                  <p style={{ color:'#0f172a' }}><b>Platform:</b> {c.platform}</p>
                  <p style={{ color:'#0f172a' }}><b>Category:</b> {c.category}</p>
                  <p style={{ color:'#0f172a' }}><b>Status:</b> {c.status}</p>

                  <div style={{ background:'#eef2f7', height:8, borderRadius:8, overflow:'hidden', margin:'8px 0' }}>
                    <div style={{ width: `${progress}%`, height:'100%', background: 'linear-gradient(90deg,#16a34a,#4ade80)' }} />
                  </div>
                  <p style={{ margin:'6px 0', color:'#0f172a' }}><b>Progress:</b> {progress}%</p>
                  {c.notes && <p style={{ color:'#0f172a' }}><b>Notes:</b> {c.notes}</p>}

                  <div style={{ display:'flex', gap:8 }}>
                    <button className="btn edit-btn" onClick={()=>navigate(`/edit/${c._id}`)}>Edit</button>
                    <button className="btn del-btn" onClick={()=>handleDelete(c._id)}>Delete</button>
                    {progress===100 && c.link && <button className="btn view" onClick={()=>window.open(c.link, '_blank')}>View</button>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
