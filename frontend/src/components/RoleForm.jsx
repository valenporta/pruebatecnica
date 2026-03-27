import { useState, useEffect } from 'react'

function RoleForm({ onSubmit, initialValue, onCancel }) {
  const [descripcion, setDescripcion] = useState(initialValue || '')

  useEffect(() => {
    setDescripcion(initialValue || '')
  }, [initialValue])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!descripcion.trim()) return
    onSubmit(descripcion)
    setDescripcion('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="descripcion">Descripcion del rol</label>
        <input
          id="descripcion"
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Ej: MODERADOR"
          required
        />
      </div>
      <div className="form-buttons">
        <button type="submit">{initialValue ? 'Guardar' : 'Crear rol'}</button>
        {onCancel && (
          <button type="button" className="btn-logout" onClick={onCancel}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}

export default RoleForm
