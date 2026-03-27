import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RolesTable from '../components/RolesTable'

const API_URL = 'http://localhost:3000/api'

function GeneralPage() {
  const [roles, setRoles] = useState([])
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await fetch(`${API_URL}/roles`)
        const data = await res.json()
        setRoles(data)
      } catch {
        setError('Error al obtener los roles')
      }
    }
    fetchRoles()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  return (
    <div className="container">
      <h1>Gestion de Roles</h1>

      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <div className="session-header">
          <h2>Roles existentes</h2>
          <button className="btn-logout" onClick={handleLogout}>
            Cerrar sesion
          </button>
        </div>
        <RolesTable roles={roles} />
      </section>
    </div>
  )
}

export default GeneralPage
