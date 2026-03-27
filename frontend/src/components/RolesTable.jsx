function RolesTable({ roles, showActions, onEdit, onDelete }) {
  if (roles.length === 0) {
    return <p className="empty">No hay roles registrados</p>
  }

  return (
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Descripcion</th>
          {showActions && <th>Acciones</th>}
        </tr>
      </thead>
      <tbody>
        {roles.map((rol) => (
          <tr key={rol.id}>
            <td>{rol.id}</td>
            <td>{rol.descripcion}</td>
            {showActions && (
              <td className="actions">
                <button className="btn-action btn-edit" onClick={() => onEdit(rol)}>
                  Editar
                </button>
                <button className="btn-action btn-delete" onClick={() => onDelete(rol.id)}>
                  Eliminar
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default RolesTable
