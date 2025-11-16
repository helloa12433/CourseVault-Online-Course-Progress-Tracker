import React from 'react'
import CourseCard from './CourseCard.jsx'

export default function CourseList({ courses, onEdit, onDelete, onProgress }) {
  if (!courses.length) return <div className="card">No courses yet. Add one!</div>
  return (
    <div className="course-grid">
      {courses.map(c => (
        <CourseCard key={c._id} course={c} onEdit={onEdit} onDelete={onDelete} onProgress={onProgress} />
      ))}
    </div>
  )
}
