import React from 'react'

export default function CourseCard({ course, onEdit, onDelete, onProgress }) {
  return (
    <div className="card">
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'start'}}>
        <div>
          <h4 style={{margin:0}}>{course.title}</h4>
          <div className="small">{course.platform} • {course.category}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div className="small">{course.status}</div>
          <div style={{marginTop:8}}>
            <button className="btn ghost" onClick={()=>onEdit(course)}>Edit</button>
            <button className="btn" style={{marginLeft:8}} onClick={()=>onDelete(course._id)}>Delete</button>
          </div>
        </div>
      </div>

      <p className="small">{course.notes}</p>

      <div className="progress">
        <div style={{width:`${course.progress}%`}}></div>
      </div>

      <div style={{display:'flex',justifyContent:'space-between',marginTop:8}}>
        <small className="small">{course.progress}%</small>
        <div>
          <button className="btn ghost" onClick={()=>onProgress(course._id, Math.max(0, course.progress - 10))}>-10</button>
          <button className="btn" style={{marginLeft:8}} onClick={()=>onProgress(course._id, Math.min(100, course.progress + 10))}>+10</button>
        </div>
      </div>
    </div>
  )
}
