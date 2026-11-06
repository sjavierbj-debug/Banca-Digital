import { useEffect, useState } from 'react'
import { api } from './api'

const cop = (n) => '$' + Number(n).toLocaleString('es-CO')
const store = {
  get: () => { try { return sessionStorage.getItem('cuentaId') } catch { return null } },
  set: (v) => { try { v ? sessionStorage.setItem('cuentaId', v) : sessionStorage.removeItem('cuentaId') } catch { /* ignorar */ } },
}

const paths = {
  grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
  wallet: <><rect x="3" y="5" width="18" height="15" rx="3" /><path d="M3 9h18M16 14h2" /><path d="M6 5V4a2 2 0 0 1 2-2h10" /></>,
  deposit: <><path d="M12 3v12m0 0 4-4m-4 4-4-4" /><path d="M5 17v3h14v-3" /></>,
  withdraw: <><path d="M12 21V9m0 0 4 4m-4-4-4 4" /><path d="M5 7V4h14v3" /></>,
  history: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  person: <><circle cx="12" cy="8" r="3.5" /><path d="M5 20a7 7 0 0 1 14 0" /></>,
  shield: <><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" /><path d="m9 12 2 2 4-4" /></>,
  logout: <><path d="M10 17l5-5-5-5m5 5H3" /><path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" /></>,
  arrow: <><path d="M7 17 17 7M7 7h10v10" /></>,
  arrowDown: <><path d="M12 4v15m0 0 5-5m-5 5-5-5" /></>,
  arrowUp: <><path d="M12 20V5m0 0 5 5m-5-5-5 5" /></>,
  check: <path d="m5 12 4 4L19 6" />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 1 1 8 0v3" /></>,
  refresh: <><path d="M20 7v5h-5" /><path d="M19 12a7 7 0 1 1-2-5l3 5" /></>,
  chevron: <path d="m9 18 6-6-6-6" />,
}

function Icon({ name, size = 20, className = '' }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>
}

function useAct() {
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)
  const run = async (fn, ok) => {
    setBusy(true); setMsg(null)
    try {
      const result = await fn()
      setMsg({ ok: true, t: typeof ok === 'function' ? ok(result) : ok })
      return result
    } catch (error) {
      setMsg({ ok: false, t: error.message })
    } finally { setBusy(false) }
  }
  return { msg, busy, run }
}

function useMovimientos(cuenta) {
  const [movs, setMovs] = useState(null)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  useEffect(() => {
    let activo = true
    setMovs(null)
    setError('')
    api.movimientos(cuenta.id)
      .then((data) => { if (activo) setMovs(data) })
      .catch((err) => { if (activo) setError(err.message) })
    return () => { activo = false }
  }, [cuenta.id, cuenta.saldo, intento])
  return { movs, error, reintentar: () => setIntento((n) => n + 1) }
}

function Field({ label, icon, ...props }) {
  return <label className="field"><span>{label}</span><span className="input-wrap">{icon && <Icon name={icon} size={17} />}<input {...props} /></span></label>
}

function Message({ msg }) {
  if (!msg) return null
  return <div className={`message ${msg.ok ? 'message-success' : 'message-error'}`} role={msg.ok ? 'status' : 'alert'}>
    <Icon name={msg.ok ? 'check' : 'shield'} size={18} /><span>{msg.t}</span>
  </div>
}

function Auth({ onLogin }) {
  const [modo, setModo] = useState('login')
  const [f, setF] = useState({ nombre: '', documento: '', correo: '', telefono: '', direccion: '', clave: '', pin: '' })
  const { msg, busy, run } = useAct()
  const set = (key) => (event) => setF({ ...f, [key]: event.target.value })
  const enviar = async (event) => {
    event.preventDefault()
    const cuenta = await run(() => modo === 'login' ? api.login(f) : api.registrar(f), modo === 'login' ? 'Acceso correcto. Bienvenido a tu banca digital.' : 'Tu cuenta se creó correctamente.')
    if (cuenta) onLogin(cuenta)
  }
  return <main className="auth-shell">
    <section className="auth-story">
      <a className="brand brand-light" href="#inicio" aria-label="Banca Digital, inicio"><span className="brand-mark"><Icon name="grid" size={21} /></span><span>Banca<span className="brand-accent">Digital</span></span></a>
      <div className="story-copy">
        <span className="eyebrow"><i /> Tu banca, a tu ritmo</span>
        <h1>Una forma más clara de cuidar tu dinero.</h1>
        <p>Consulta tu saldo, organiza tus movimientos y opera tu cuenta con confianza.</p>
      </div>
      <div className="story-foot"><span className="story-orbit orbit-one" /><span className="story-orbit orbit-two" /><span className="story-caption">Simple. Segura. Contigo.</span></div>
    </section>
    <section className="auth-panel" id="inicio">
      <div className="auth-form-wrap">
        <div className="auth-mobile-brand brand"><span className="brand-mark"><Icon name="grid" size={20} /></span><span>Banca<span className="brand-accent">Digital</span></span></div>
        <p className="eyebrow auth-eyebrow">{modo === 'login' ? 'BIENVENIDO DE NUEVO' : 'EMPIEZA HOY'}</p>
        <h2>{modo === 'login' ? 'Ingresa a tu cuenta' : 'Crea tu cuenta'}</h2>
        <p className="auth-intro">{modo === 'login' ? 'Accede a tu espacio financiero personal.' : 'Completa tus datos para empezar a operar.'}</p>
        <div className="auth-tabs" role="tablist" aria-label="Acceso o registro">
          <button type="button" role="tab" aria-selected={modo === 'login'} className={modo === 'login' ? 'selected' : ''} onClick={() => setModo('login')}>Ingresar</button>
          <button type="button" role="tab" aria-selected={modo === 'registro'} className={modo === 'registro' ? 'selected' : ''} onClick={() => setModo('registro')}>Crear cuenta</button>
        </div>
        <form onSubmit={enviar} className="auth-form">
          {modo === 'registro' && <Field label="Nombre completo" autoComplete="name" required value={f.nombre} onChange={set('nombre')} />}
          <Field label="Documento" autoComplete="username" required value={f.documento} onChange={set('documento')} />
          {modo === 'registro' && <>
            <Field label="Correo electrónico" type="email" autoComplete="email" required value={f.correo} onChange={set('correo')} />
            <div className="field-row"><Field label="Teléfono" type="tel" autoComplete="tel" value={f.telefono} onChange={set('telefono')} /><Field label="Dirección" autoComplete="street-address" value={f.direccion} onChange={set('direccion')} /></div>
          </>}
          <Field label="Clave de acceso" type="password" autoComplete={modo === 'login' ? 'current-password' : 'new-password'} required value={f.clave} onChange={set('clave')} />
          {modo === 'registro' && <Field label="PIN de retiros · 4 dígitos" type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" autoComplete="off" required value={f.pin} onChange={set('pin')} />}
          <Message msg={msg} />
          <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Procesando…' : modo === 'login' ? 'Ingresar a mi cuenta' : 'Crear cuenta'}<Icon name="chevron" size={18} /></button>
        </form>
        <p className="auth-security"><Icon name="lock" size={15} /> Tu información se utiliza para gestionar tu cuenta.</p>
      </div>
    </section>
  </main>
}

const NAV = [
  ['resumen', 'Resumen', 'grid'], ['depositar', 'Depositar', 'deposit'], ['retirar', 'Retirar', 'withdraw'],
  ['historial', 'Historial', 'history'], ['datos', 'Mis datos', 'person'], ['seguridad', 'Seguridad', 'shield'],
]

function Nav({ page, setPage, salir, cuenta }) {
  return <aside className="sidebar">
    <a className="brand brand-light" href="#inicio" onClick={(e) => { e.preventDefault(); setPage('resumen') }}><span className="brand-mark"><Icon name="grid" size={20} /></span><span>Banca<span className="brand-accent">Digital</span></span></a>
    <div className="sidebar-account"><span className="account-avatar">{cuenta.nombre.trim().charAt(0).toUpperCase()}</span><span className="account-copy"><b>{cuenta.nombre}</b><small>Titular de la cuenta</small></span></div>
    <span className="nav-label">MENÚ PRINCIPAL</span>
    <nav className="main-nav" aria-label="Navegación principal">{NAV.map(([key, label, icon]) => <button key={key} className={`nav-item ${page === key ? 'active' : ''}`} aria-current={page === key ? 'page' : undefined} onClick={() => setPage(key)}><Icon name={icon} size={19} /><span>{label}</span>{page === key && <span className="nav-indicator" />}</button>)}</nav>
    <div className="sidebar-bottom"><div className="sidebar-note"><Icon name="shield" size={17} /><span>Gestiona tu cuenta con tranquilidad.</span></div><button className="logout-button" onClick={salir}><Icon name="logout" size={18} />Cerrar sesión</button><small className="sidebar-version">Banca Digital · Cuenta personal</small></div>
  </aside>
}

function PageHeading({ eyebrow, title, description, action }) {
  return <header className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{description && <p>{description}</p>}</div>{action}</header>
}

function MovementTable({ movs, compact = false }) {
  return <div className="table-scroll"><table className="movement-table"><thead><tr><th>Movimiento</th><th>Fecha</th><th className="align-right">Monto</th><th className="align-right">Saldo</th></tr></thead>
    <tbody>{(compact ? movs.slice(0, 5) : movs).map((m) => <tr key={m.id}>
      <td><span className={`movement-symbol ${m.tipo === 'DEPOSITO' ? 'symbol-in' : 'symbol-out'}`}><Icon name={m.tipo === 'DEPOSITO' ? 'arrowDown' : 'arrowUp'} size={17} /></span><span className="movement-type"><b>{m.tipo === 'DEPOSITO' ? 'Depósito' : 'Retiro'}</b><small>{m.tipo === 'DEPOSITO' ? 'Ingreso a la cuenta' : 'Retiro de efectivo'}</small></span></td>
      <td className="date-cell">{new Date(m.fecha).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}</td>
      <td className={`align-right amount-cell ${m.tipo === 'DEPOSITO' ? 'amount-in' : 'amount-out'}`}>{m.tipo === 'DEPOSITO' ? '+' : '−'}{cop(m.monto)}</td><td className="align-right balance-cell">{cop(m.saldoPosterior)}</td>
    </tr>)}</tbody></table></div>
}

function MovementState({ movs, error, reintentar }) {
  if (error) return <div className="state-card state-error" role="alert"><span className="state-icon"><Icon name="refresh" size={21} /></span><b>No pudimos cargar los movimientos</b><p>{error}</p><button className="button button-outline" onClick={reintentar}>Reintentar</button></div>
  if (movs === null) return <div className="state-card" role="status"><span className="loader" /><b>Cargando movimientos</b><p>Estamos consultando la actividad de tu cuenta.</p></div>
  if (movs.length === 0) return <div className="state-card"><span className="state-icon"><Icon name="history" size={21} /></span><b>Aún no hay movimientos</b><p>Cuando realices un depósito o retiro, aparecerá aquí.</p></div>
  return null
}

function Dashboard({ cuenta, setPage }) {
  const { movs, error, reintentar } = useMovimientos(cuenta)
  return <>
    <PageHeading eyebrow="TU ESPACIO FINANCIERO" title={`Hola, ${cuenta.nombre.trim().split(/\s+/)[0]}`} description="Aquí tienes un resumen de tu cuenta." />
    <section className="dashboard-grid">
      <article className="balance-card">
        <div className="balance-card-top"><span>Saldo disponible</span><span className="balance-currency">COP <Icon name="wallet" size={16} /></span></div>
        <strong>{cop(cuenta.saldo)}</strong>
        <div className="balance-card-bottom"><span>Cuenta personal</span><span>Documento ···{String(cuenta.documento).slice(-4)}</span></div>
        <span className="balance-orb orb-a" /><span className="balance-orb orb-b" />
      </article>
      <article className="account-card"><div className="section-kicker">RESUMEN DE CUENTA</div><div className="account-detail"><span>Titular</span><b>{cuenta.nombre}</b></div><div className="account-detail"><span>Documento</span><b>{cuenta.documento}</b></div><div className="account-detail"><span>Correo electrónico</span><b className="truncate">{cuenta.correo}</b></div><button className="text-link" onClick={() => setPage('datos')}>Ver mis datos <Icon name="arrow" size={15} /></button></article>
    </section>
    <section className="quick-section"><div className="section-title"><div><span className="eyebrow">OPERA EN MINUTOS</span><h2>Accesos rápidos</h2></div></div><div className="quick-grid">
      <button className="quick-card" onClick={() => setPage('depositar')}><span className="quick-icon quick-green"><Icon name="deposit" size={21} /></span><span><b>Depositar</b><small>Abona a tu cuenta</small></span><Icon name="chevron" size={17} className="quick-chevron" /></button>
      <button className="quick-card" onClick={() => setPage('retirar')}><span className="quick-icon quick-gold"><Icon name="withdraw" size={21} /></span><span><b>Retirar</b><small>Retira con tu PIN</small></span><Icon name="chevron" size={17} className="quick-chevron" /></button>
      <button className="quick-card" onClick={() => setPage('historial')}><span className="quick-icon quick-sand"><Icon name="history" size={21} /></span><span><b>Historial</b><small>Revisa tus movimientos</small></span><Icon name="chevron" size={17} className="quick-chevron" /></button>
    </div></section>
    <section className="content-section"><div className="section-title"><div><span className="eyebrow">ACTIVIDAD DE LA CUENTA</span><h2>Últimos movimientos</h2></div><button className="text-link" onClick={() => setPage('historial')}>Ver historial completo <Icon name="arrow" size={15} /></button></div>
      <div className="content-card">{movs === null || error || movs.length === 0 ? <MovementState movs={movs} error={error} reintentar={reintentar} /> : <MovementTable movs={movs} compact />}</div>
    </section>
  </>
}

function Historial({ cuenta }) {
  const { movs, error, reintentar } = useMovimientos(cuenta)
  return <><PageHeading eyebrow="ACTIVIDAD DE LA CUENTA" title="Historial" description="Consulta los depósitos y retiros registrados en tu cuenta." />
    <section className="content-card history-card"><div className="history-header"><div><h2>Todos los movimientos</h2><p>Ordenados del más reciente al más antiguo.</p></div><span className="history-count">{movs ? `${movs.length} ${movs.length === 1 ? 'movimiento' : 'movimientos'}` : 'Actividad'}</span></div>
      {movs === null || error || movs.length === 0 ? <MovementState movs={movs} error={error} reintentar={reintentar} /> : <MovementTable movs={movs} />}
    </section>
  </>
}

function Depositar({ cuenta, setCuenta }) {
  const [monto, setMonto] = useState('')
  const { msg, busy, run } = useAct()
  const enviar = async (event) => {
    event.preventDefault()
    const operacion = await run(() => api.depositar(cuenta.id, Number(monto)), (r) => `Depósito de ${cop(Number(monto))} realizado. Tu nuevo saldo es ${cop(r.saldo)}.`)
    if (operacion) { setCuenta(operacion); setMonto('') }
  }
  return <><PageHeading eyebrow="MOVIMIENTOS" title="Depositar" description="Añade fondos a tu cuenta de forma sencilla." />
    <div className="operation-layout"><form className="form-card" onSubmit={enviar}><div className="form-card-heading"><span className="form-icon quick-green"><Icon name="deposit" size={21} /></span><div><h2>Nuevo depósito</h2><p>Indica el monto que deseas abonar.</p></div></div>
      <Field label="Monto a depositar (COP)" type="number" min="1" step="1" inputMode="numeric" required value={monto} onChange={(e) => setMonto(e.target.value)} />
      <div className="form-note"><Icon name="shield" size={17} /><span>El saldo de tu cuenta se actualizará al confirmar la operación.</span></div><Message msg={msg} />
      <button className="button button-primary button-wide" disabled={busy}>{busy ? 'Procesando depósito…' : 'Confirmar depósito'}<Icon name="chevron" size={18} /></button>
    </form><aside className="side-info"><span className="side-info-icon"><Icon name="wallet" size={20} /></span><h3>Saldo actual</h3><strong>{cop(cuenta.saldo)}</strong><p>El saldo se actualizará automáticamente después de un depósito exitoso.</p></aside></div>
  </>
}

function Retirar({ cuenta, setCuenta }) {
  const [monto, setMonto] = useState('')
  const [pin, setPin] = useState('')
  const [res, setRes] = useState(null)
  const { msg, busy, run } = useAct()
  const enviar = async (event) => {
    event.preventDefault(); setRes(null)
    const operacion = await run(() => api.retirar(cuenta.id, Number(monto), pin), (r) => `Retiro de ${cop(r.montoRetirado)} realizado. Tu nuevo saldo es ${cop(r.saldo)}.`)
    if (operacion) { setRes(operacion); setPin(''); setMonto(''); setCuenta((actual) => ({ ...actual, saldo: operacion.saldo })) }
  }
  return <><PageHeading eyebrow="MOVIMIENTOS" title="Retirar efectivo" description="Solicita un retiro usando tu PIN de seguridad." />
    <div className="operation-layout"><form className="form-card" onSubmit={enviar}><div className="form-card-heading"><span className="form-icon quick-gold"><Icon name="withdraw" size={21} /></span><div><h2>Nuevo retiro</h2><p>Elige un monto y confirma con tu PIN.</p></div></div>
      <Field label="Monto a retirar (COP)" type="number" min="10000" step="10000" inputMode="numeric" required value={monto} onChange={(e) => setMonto(e.target.value)} />
      <div className="quick-amounts" aria-label="Montos frecuentes">{[50000, 100000, 200000, 500000].map((value) => <button type="button" key={value} onClick={() => setMonto(value)}>{cop(value)}</button>)}</div>
      <Field label="PIN de retiros · 4 dígitos" type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" autoComplete="off" required value={pin} onChange={(e) => setPin(e.target.value)} />
      <div className="withdraw-rules"><b>Condiciones del retiro</b><span>Mínimo {cop(10000)} · Tope diario {cop(1000000)}</span><span>Billetes disponibles: {cop(100000)}, {cop(50000)}, {cop(20000)} y {cop(10000)}.</span></div>
      <Message msg={msg} /><button className="button button-primary button-wide" disabled={busy}>{busy ? 'Procesando retiro…' : 'Confirmar retiro'}<Icon name="chevron" size={18} /></button>
    </form><aside className="side-info"><span className="side-info-icon"><Icon name="wallet" size={20} /></span><h3>Saldo disponible</h3><strong>{cop(cuenta.saldo)}</strong><p>Verifica el monto antes de confirmar tu retiro.</p></aside></div>
    {res && <section className="dispense-card"><div className="dispense-head"><span className="form-icon quick-green"><Icon name="check" size={21} /></span><div><span className="eyebrow">RETIRO APROBADO</span><h2>Desglose de billetes</h2></div></div><div className="dispense-bills">{Object.entries(res.billetes).map(([denominacion, cantidad]) => <div className="bill-row" key={denominacion}><span className="bill-count">{cantidad}<small>×</small></span><span>Billete de <b>{cop(denominacion)}</b></span><b className="bill-total">{cop(Number(denominacion) * cantidad)}</b></div>)}</div><div className="dispense-summary"><span>Saldo restante <b>{cop(res.saldo)}</b></span><span>Retirado hoy <b>{cop(res.retiradoHoy)} / {cop(1000000)}</b></span></div></section>}
  </>
}

function Datos({ cuenta, setCuenta }) {
  const [f, setF] = useState({ correo: cuenta.correo || '', telefono: cuenta.telefono || '', direccion: cuenta.direccion || '' })
  const { msg, busy, run } = useAct()
  const set = (key) => (event) => setF({ ...f, [key]: event.target.value })
  const enviar = async (event) => { event.preventDefault(); const actualizado = await run(() => api.datos(cuenta.id, f), 'Tus datos personales se actualizaron correctamente.'); if (actualizado) setCuenta(actualizado) }
  return <><PageHeading eyebrow="PERFIL" title="Mis datos" description="Mantén actualizada la información de tu cuenta." />
    <form className="form-card profile-form" onSubmit={enviar}><div className="form-card-heading"><span className="form-icon quick-sand"><Icon name="person" size={21} /></span><div><h2>Información personal</h2><p>Los cambios se guardarán en tu cuenta.</p></div></div>
      <div className="readonly-details"><div><span>Titular</span><b>{cuenta.nombre}</b></div><div><span>Documento</span><b>{cuenta.documento}</b></div></div>
      <Field label="Correo electrónico" type="email" autoComplete="email" required value={f.correo} onChange={set('correo')} /><Field label="Teléfono" type="tel" autoComplete="tel" value={f.telefono} onChange={set('telefono')} /><Field label="Dirección" autoComplete="street-address" value={f.direccion} onChange={set('direccion')} />
      <Message msg={msg} /><button className="button button-primary" disabled={busy}>{busy ? 'Guardando…' : 'Guardar cambios'}<Icon name="chevron" size={18} /></button>
    </form></>
}

function Seguridad({ cuenta }) {
  const [f, setF] = useState({ claveActual: '', claveNueva: '', pinNuevo: '' })
  const { msg, busy, run } = useAct()
  const set = (key) => (event) => setF({ ...f, [key]: event.target.value })
  const enviar = async (event) => {
    event.preventDefault()
    const actualizado = await run(() => api.credenciales(cuenta.id, f), 'Tus credenciales se actualizaron correctamente.')
    if (actualizado) setF({ claveActual: '', claveNueva: '', pinNuevo: '' })
  }
  return <><PageHeading eyebrow="PROTECCIÓN DE CUENTA" title="Seguridad" description="Actualiza tu clave de acceso o el PIN de retiros." />
    <form className="form-card profile-form" onSubmit={enviar}><div className="form-card-heading"><span className="form-icon quick-green"><Icon name="shield" size={21} /></span><div><h2>Credenciales de acceso</h2><p>Confirma tu clave actual para realizar cambios.</p></div></div>
      <Field label="Clave actual" type="password" autoComplete="current-password" required value={f.claveActual} onChange={set('claveActual')} />
      <div className="form-divider"><span>NUEVAS CREDENCIALES</span></div>
      <Field label="Clave nueva · mínimo 6 caracteres" type="password" autoComplete="new-password" minLength={6} value={f.claveNueva} onChange={set('claveNueva')} />
      <Field label="PIN nuevo · 4 dígitos" type="password" inputMode="numeric" maxLength={4} pattern="\d{4}" autoComplete="off" value={f.pinNuevo} onChange={set('pinNuevo')} />
      <div className="form-note"><Icon name="lock" size={17} /><span>Puedes actualizar la clave, el PIN o ambos. Completa al menos uno.</span></div>
      <Message msg={msg} /><button className="button button-primary" disabled={busy}>{busy ? 'Actualizando…' : 'Actualizar credenciales'}<Icon name="chevron" size={18} /></button>
    </form></>
}

export default function App() {
  const [id, setId] = useState(store.get())
  const [cuenta, setCuenta] = useState(null)
  const [page, setPage] = useState('resumen')
  const salir = () => { store.set(null); setId(null); setCuenta(null); setPage('resumen') }
  const entrar = (c) => { store.set(c.id); setId(c.id); setCuenta(c); setPage('resumen') }
  useEffect(() => { if (id && !cuenta) api.cuenta(id).then(setCuenta).catch(salir) }, [id])

  if (!id) return <Auth onLogin={entrar} />
  if (!cuenta) return <main className="app-loading"><span className="loader" /><p>Preparando tu espacio financiero…</p></main>
  const pages = {
    resumen: <Dashboard cuenta={cuenta} setPage={setPage} />,
    depositar: <Depositar cuenta={cuenta} setCuenta={setCuenta} />,
    retirar: <Retirar cuenta={cuenta} setCuenta={setCuenta} />,
    historial: <Historial cuenta={cuenta} />,
    datos: <Datos cuenta={cuenta} setCuenta={setCuenta} />,
    seguridad: <Seguridad cuenta={cuenta} />,
  }
  return <div className="app-shell"><Nav page={page} setPage={setPage} salir={salir} cuenta={cuenta} /><main className="app-main"><div className="mobile-topbar"><a className="brand" href="#inicio" onClick={(e) => { e.preventDefault(); setPage('resumen') }}><span className="brand-mark"><Icon name="grid" size={19} /></span><span>Banca<span className="brand-accent">Digital</span></span></a><button className="mobile-logout" onClick={salir} aria-label="Cerrar sesión"><Icon name="logout" size={19} /></button></div><div className="mobile-nav">{NAV.map(([key, label, icon]) => <button key={key} className={page === key ? 'active' : ''} onClick={() => setPage(key)}><Icon name={icon} size={17} /><span>{label}</span></button>)}</div><div className="page-content" key={page}>{pages[page]}</div></main></div>
}
