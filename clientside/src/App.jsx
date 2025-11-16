import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginRegister from './pages/LoginRegister.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddCourse from './pages/AddCourse.jsx'
import EditCourse from './pages/EditCourse.jsx'
import CourseDetails from './pages/CourseDetails.jsx'
import { setAuthToken } from './api.js'

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('cv_user')) } catch { return null }
  })

  useEffect(() => {
    const token = localStorage.getItem('cv_token')
    if (token) setAuthToken(token)
  }, [])

  const handleSetUser = (u) => {
    setUser(u)
    localStorage.setItem('cv_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cv_token')
    localStorage.removeItem('cv_user')
    setAuthToken(null)
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Auth Routes */}
        <Route path="/" element={
          user ? <Navigate to="/dashboard" /> : <LoginRegister setUser={handleSetUser} />
        } />

        {/* 🧭 Dashboard */}
        <Route path="/dashboard" element={
          user ? <Dashboard user={user} onLogout={logout} /> : <Navigate to="/" />
        } />

        {/* ➕ Add new course */}
        <Route path="/add" element={
          user ? <AddCourse /> : <Navigate to="/" />
        } />

        {/* ✏️ Edit existing course */}
        <Route path="/edit/:id" element={
          user ? <EditCourse /> : <Navigate to="/" />
        } />

        {/* 🔍 View single course details */}
        <Route path="/course/:id" element={
          user ? <CourseDetails /> : <Navigate to="/" />
        } />

        {/* 🚫 Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}
