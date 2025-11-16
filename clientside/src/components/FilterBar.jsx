import React, { useState } from 'react'

export default function FilterBar({ onFilter }) {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')

  const apply = () => onFilter({ search:q, status, category })

  return (
    <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:12}}>
      <input className="input" placeholder="Search title..." value={q} onChange={e=>setQ(e.target.value)} />
      <select className="input" value={status} onChange={e=>setStatus(e.target.value)}>
        <option value="">All status</option>
        <option>Not Started</option>
        <option>In Progress</option>
        <option>Completed</option>
      </select>
      <input className="input" placeholder="Category (optional)" value={category} onChange={e=>setCategory(e.target.value)} />
      <button className="btn primary" onClick={apply}>Apply</button>
    </div>
  )
}
