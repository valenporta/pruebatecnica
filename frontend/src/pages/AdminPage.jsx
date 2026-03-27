import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import RolesTable from '../components/RolesTable'
import RoleForm from '../components/RoleForm'

const API_URL = 'http://localhost:3000/api'

function AdminPage() {
  const [roles, setRoles] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [editingRole, setEditingRole] = useState(null)
  const [mensaje, setMensaje] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const fetchRoles = async () => {
    try {
      const res = await fetch(`${API_URL}/roles`)
      const data = await res.json()
      setRoles(data)
    } catch {
      setError('Error al obtener los roles')
    }
  }

  useEffect(() => {
    fetchRoles()
  }, [])

  const handleCreate = async (descripcion) => {
    setError('')
    setMensaje('')
    try {
      const res = await fetch(`${API_URL}/roles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion }),
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('Rol creado exitosamente')
        setShowForm(false)
        fetchRoles()
      } else {
        setError(data.message || 'Error al crear el rol')
      }
    } catch {
      setError('Error al conectar con el servidor')
    }
  }

  const handleEdit = (rol) => {
    setEditingRole(rol)
    setShowForm(true)
    setMensaje('')
    setError('')
  }

  const handleUpdate = async (descripcion) => {
    setError('')
    setMensaje('')
    try {
      const res = await fetch(`${API_URL}/roles/${editingRole.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ descripcion }),
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('Rol actualizado exitosamente')
        setEditingRole(null)
        setShowForm(false)
        fetchRoles()
      } else {
        setError(data.message || 'Error al actualizar el rol')
      }
    } catch {
      setError('Error al conectar con el servidor')
    }
  }

  const handleDelete = async (id) => {
    setError('')
    setMensaje('')
    try {
      const res = await fetch(`${API_URL}/roles/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setMensaje('Rol eliminado exitosamente')
        fetchRoles()
      } else {
        setError(data.message || 'Error al eliminar el rol')
      }
    } catch {
      setError('Error al conectar con el servidor')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('refreshToken')
    navigate('/')
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingRole(null)
  }

  return (
    <div className="container">
      <h1>Gestion de Roles</h1>

      {mensaje && <div className="alert success">{mensaje}</div>}
      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <div className="session-header">
          <h2>Roles existentes</h2>
          <div className="header-buttons">
            {!showForm && (
              <button
                className="btn-action btn-edit"
                onClick={() => { setShowForm(true); setEditingRole(null) }}
              >
                Agregar rol
              </button>
            )}
            <button className="btn-logout" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        </div>
        <RolesTable
          roles={roles}
          showActions
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </section>

      {showForm && (
        <section className="card">
          <h2>{editingRole ? 'Editar rol' : 'Crear nuevo rol'}</h2>
          <RoleForm
            onSubmit={editingRole ? handleUpdate : handleCreate}
            initialValue={editingRole?.descripcion}
            onCancel={handleCancelForm}
          />
        </section>
      )}
    </div>
  )
}

export default AdminPage
