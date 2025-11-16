import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../api'

export default function CourseDetails() {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    API.get(`/courses/${id}`).then(({ data }) => setCourse(data)).catch(()=>{ alert('Not found'); navigate('/dashboard') })
  }, [id])

  if (!course) return <p style={{ padding:20 }}>Loading...</p>

  return (
    <div style={{ padding:20, maxWidth:900, margin:'20px auto' }}>
      <button className="btn ghost" onClick={()=>navigate('/dashboard')}>← Back to Dashboard</button>
      <h1>{course.title}</h1>
      <p><b>Platform:</b> {course.platform}</p>
      <p><b>Category:</b> {course.category}</p>
      <p><b>Status:</b> {course.status}</p>
      <p><b>Progress:</b> {course.progress}%</p>
      {course.link && <p><a href={course.link} target="_blank" rel="noreferrer">Open course</a></p>}
      {course.notes && <div style={{ marginTop:12, whiteSpace:'pre-wrap' }}><b>Notes:</b><br/>{course.notes}</div>}
    </div>
  )
}
