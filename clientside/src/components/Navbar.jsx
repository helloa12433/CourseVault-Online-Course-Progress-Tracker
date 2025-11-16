import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const handleLogout = () => {
    localStorage.removeItem('cv_token')
    localStorage.removeItem('cv_user')
    setUser(null)
    navigate('/')
  }

  return (
    <div className="navbar">
      <div style={{display:'flex',gap:12,alignItems:'center'}}>
        <h3 style={{margin:0}}>🎓 CourseVault</h3>
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div>
        {user ? (
          <>
            <span style={{marginRight:12}}>{user.name}</span>
            <button className="btn ghost" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/">Login</Link>
        )}
      </div>
    </div>
  )
}
