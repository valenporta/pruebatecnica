import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import AdminPage from './pages/AdminPage'
import GeneralPage from './pages/GeneralPage'
import './App.css'

function getRole() {
  const token = localStorage.getItem('token')
  if (!token) return null
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    return payload.rol
  } catch {
    return null
  }
}

function ProtectedRoute({ children, adminOnly }) {
  const role = getRole()
  if (!role) return <Navigate to="/" replace />
  if (adminOnly && role !== 1) return <Navigate to="/general" replace />
  return children
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/general"
          element={
            <ProtectedRoute>
              <GeneralPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
