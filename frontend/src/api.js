const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

async function req(path, method = 'GET', body) {
  let r
  try {
    r = await fetch(BASE + path, { method, headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined })
  } catch {
    throw new Error('No hay conexión con el backend. Verifica que esté corriendo en el puerto 8080.')
  }
  const content = await r.text()
  let data
  try { data = content ? JSON.parse(content) : null } catch { data = null }
  if (!r.ok) {
    const detail = data?.mensaje || data?.message || (typeof data === 'string' ? data : null) || content
    const fallback = r.status >= 500
      ? 'El backend tuvo un problema al procesar la solicitud. Inténtalo de nuevo.'
      : 'No se pudo completar la operación. Revisa los datos e inténtalo de nuevo.'
    throw new Error(detail || fallback)
  }
  if (!content) return null
  if (data === undefined || data === null) {
    throw new Error('El backend respondió con un formato inesperado. Inténtalo de nuevo.')
  }
  return data
}

export const api = {
  registrar: (d) => req('/cuentas', 'POST', d),
  login: (d) => req('/auth/login', 'POST', d),
  cuenta: (id) => req(`/cuentas/${id}`),
  datos: (id, d) => req(`/cuentas/${id}/datos`, 'PUT', d),
  credenciales: (id, d) => req(`/cuentas/${id}/credenciales`, 'PUT', d),
  depositar: (id, monto) => req(`/cuentas/${id}/depositos`, 'POST', { monto }),
  retirar: (id, monto, pin) => req(`/cuentas/${id}/retiros`, 'POST', { monto, pin }),
  movimientos: (id) => req(`/cuentas/${id}/transacciones`),
}
