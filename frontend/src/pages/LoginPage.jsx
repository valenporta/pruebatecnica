import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const API_URL = 'http://localhost:3000/api'

function LoginPage() {
  const [cuil, setCuil] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cuil, password }),
      })
      const data = await res.json()
      if (res.ok) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('refreshToken', data.refreshToken)

        const payload = JSON.parse(atob(data.token.split('.')[1]))
        if (payload.rol === 1) {
          navigate('/admin')
        } else {
          navigate('/general')
        }
      } else {
        setError(data.message || 'Error al iniciar sesion')
      }
    } catch {
      setError('Error al conectar con el servidor')
    }
  }

  return (
    <div className="container">
      <h1>Gestion de Roles</h1>

      {error && <div className="alert error">{error}</div>}

      <section className="card">
        <h2>Iniciar sesion</h2>
        <p className="hint">Inicia sesion para acceder al sistema</p>
        <form onSubmit={handleLogin}>
          <div className="field">
            <label htmlFor="cuil">CUIL</label>
            <input
              id="cuil"
              type="text"
              value={cuil}
              onChange={(e) => setCuil(e.target.value)}
              placeholder="Ej: 20304050607"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit">Iniciar sesion</button>
        </form>
      </section>
    </div>
  )
}

export default LoginPage
