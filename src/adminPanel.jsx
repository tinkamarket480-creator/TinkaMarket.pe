import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

// ─── CSS del panel admin ─────────────────────────────────────────────
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&family=Sora:wght@400;600;700;800;900&family=Nunito:wght@400;500;600;700;800&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg:      #0D0F14;
    --bg2:     #13161E;
    --bg3:     #1A1E28;
    --border:  #2A2E3D;
    --text:    #E8EAF0;
    --muted:   #6B7280;
    --accent:  #C0392B;
    --accent2: #E8651A;
    --gold:    #D4A017;
    --green:   #22C55E;
    --yellow:  #EAB308;
    --red:     #EF4444;
    --blue:    #3B82F6;
    --grad:    linear-gradient(135deg, #7B1208, #C0392B, #E8651A);
    --font-h:  'Sora', sans-serif;
    --font-b:  'Nunito', sans-serif;
    --font-m:  'JetBrains Mono', monospace;
    --radius:  12px;
    --shadow:  0 4px 24px rgba(0,0,0,0.4);
  }

  html, body, #root {
    width: 100%; min-height: 100vh;
    background: var(--bg); color: var(--text);
    font-family: var(--font-b); overflow-x: hidden;
  }

  ::-webkit-scrollbar { width: 5px; }
  ::-webkit-scrollbar-track { background: var(--bg2); }
  ::-webkit-scrollbar-thumb { background: var(--accent); border-radius: 99px; }

  /* ── LOGIN ── */
  .admin-login {
    min-height: 100vh; display: flex; align-items: center;
    justify-content: center; padding: 20px;
    background: radial-gradient(ellipse at 30% 20%, #2A0A0A 0%, #0D0F14 60%);
  }
  .login-box {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: 20px; padding: 40px 36px; max-width: 400px; width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5);
  }
  .login-logo {
    width: 56px; height: 56px; border-radius: 14px;
    background: var(--grad); display: flex; align-items: center;
    justify-content: center; font-size: 28px; margin: 0 auto 20px;
    box-shadow: 0 4px 20px rgba(192,57,43,0.4);
  }
  .login-title { font-family: var(--font-h); font-size: 22px; font-weight: 800; text-align: center; margin-bottom: 6px; }
  .login-sub { color: var(--muted); font-size: 13px; text-align: center; margin-bottom: 28px; }
  .login-btn {
    display: flex; align-items: center; justify-content: center; gap: 10px;
    width: 100%; padding: 14px; background: var(--grad);
    border: none; border-radius: 50px; color: white; font-size: 15px;
    font-weight: 800; cursor: pointer; font-family: var(--font-b);
    box-shadow: 0 4px 20px rgba(192,57,43,0.4);
    transition: opacity 0.18s, transform 0.15s;
  }
  .login-btn:hover { opacity: 0.9; transform: translateY(-2px); }
  .access-denied {
    background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px; padding: 14px; text-align: center;
    color: var(--red); font-size: 14px; font-weight: 600; margin-top: 16px;
  }

  /* ── LAYOUT ── */
  .admin-layout { display: flex; min-height: 100vh; }

  /* ── SIDEBAR ── */
  .sidebar {
    width: 240px; flex-shrink: 0; background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex; flex-direction: column;
    position: sticky; top: 0; height: 100vh; overflow-y: auto;
  }
  .sidebar-head { padding: 24px 20px 20px; border-bottom: 1px solid var(--border); }
  .sidebar-brand { display: flex; align-items: center; gap: 10px; margin-bottom: 12px; }
  .sidebar-logo {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--grad); display: flex; align-items: center;
    justify-content: center; font-size: 18px; flex-shrink: 0;
  }
  .sidebar-brand-txt { font-family: var(--font-h); font-weight: 800; font-size: 15px; }
  .sidebar-badge {
    background: rgba(192,57,43,0.2); border: 1px solid rgba(192,57,43,0.4);
    color: var(--accent2); font-size: 10px; font-weight: 700;
    padding: 3px 10px; border-radius: 100px; letter-spacing: 1px; display: inline-block;
  }
  .sidebar-nav { padding: 12px; flex: 1; }
  .nav-section { font-size: 10px; font-weight: 700; color: var(--muted); letter-spacing: 1.5px; padding: 12px 8px 6px; text-transform: uppercase; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; cursor: pointer;
    font-size: 14px; font-weight: 600; color: var(--muted);
    transition: all 0.18s; margin-bottom: 2px; position: relative;
  }
  .nav-item:hover { background: var(--bg3); color: var(--text); }
  .nav-item.active { background: rgba(192,57,43,0.15); color: var(--accent2); }
  .nav-item.active::before {
    content: ''; position: absolute; left: 0; top: 50%; transform: translateY(-50%);
    width: 3px; height: 60%; background: var(--accent); border-radius: 0 3px 3px 0;
  }
  .nav-icon { font-size: 18px; width: 24px; text-align: center; }
  .nav-badge {
    margin-left: auto; background: var(--red); color: white;
    font-size: 10px; font-weight: 800; padding: 2px 7px;
    border-radius: 100px; font-family: var(--font-m);
  }
  .sidebar-foot { padding: 16px 12px; border-top: 1px solid var(--border); }
  .admin-info { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .admin-avatar {
    width: 36px; height: 36px; border-radius: 10px;
    background: var(--grad); display: flex; align-items: center;
    justify-content: center; color: white; font-weight: 800; font-size: 16px;
    font-family: var(--font-h); flex-shrink: 0;
  }
  .admin-name { font-size: 13px; font-weight: 700; }
  .admin-role { font-size: 11px; color: var(--accent2); font-weight: 600; }
  .btn-logout {
    width: 100%; padding: 9px; background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3); border-radius: 8px;
    color: var(--red); font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: var(--font-b); transition: all 0.18s;
  }
  .btn-logout:hover { background: rgba(239,68,68,0.2); }

  /* ── MAIN ── */
  .main { flex: 1; overflow-x: hidden; }
  .topbar {
    background: var(--bg2); border-bottom: 1px solid var(--border);
    padding: 16px 28px; display: flex; align-items: center;
    justify-content: space-between; position: sticky; top: 0; z-index: 10;
  }
  .topbar-title { font-family: var(--font-h); font-size: 20px; font-weight: 800; }
  .topbar-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .topbar-right { display: flex; align-items: center; gap: 12px; }
  .status-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); box-shadow: 0 0 6px var(--green); }
  .content { padding: 28px; }

  /* ── STATS ── */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px; }
  .stat-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 20px;
    transition: border-color 0.18s, transform 0.18s;
  }
  .stat-card:hover { border-color: var(--accent); transform: translateY(-2px); }
  .stat-label { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .stat-val { font-family: var(--font-h); font-size: 28px; font-weight: 900; margin-bottom: 4px; }
  .stat-sub { font-size: 12px; color: var(--muted); }
  .stat-icon { font-size: 24px; margin-bottom: 10px; }

  /* ── TABLE ── */
  .table-wrap {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); overflow: hidden; margin-bottom: 24px;
  }
  .table-head {
    padding: 18px 20px; border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px;
  }
  .table-title { font-family: var(--font-h); font-size: 16px; font-weight: 700; }
  .search-inp-dark {
    background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; padding: 8px 14px; color: var(--text);
    font-size: 13px; font-family: var(--font-b); outline: none;
    transition: border-color 0.18s; width: 220px;
  }
  .search-inp-dark:focus { border-color: var(--accent); }
  .search-inp-dark::placeholder { color: var(--muted); }
  table { width: 100%; border-collapse: collapse; }
  th {
    background: var(--bg3); padding: 12px 16px; text-align: left;
    font-size: 11px; font-weight: 700; color: var(--muted);
    text-transform: uppercase; letter-spacing: 0.8px; white-space: nowrap;
  }
  td { padding: 13px 16px; font-size: 13px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  tr:last-child td { border-bottom: none; }
  tr:hover td { background: rgba(255,255,255,0.02); }

  /* ── BADGES ── */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 100px; font-size: 11px; font-weight: 700;
  }
  .badge-green  { background: rgba(34,197,94,0.15);  color: var(--green);  border: 1px solid rgba(34,197,94,0.3); }
  .badge-red    { background: rgba(239,68,68,0.15);  color: var(--red);    border: 1px solid rgba(239,68,68,0.3); }
  .badge-yellow { background: rgba(234,179,8,0.15);  color: var(--yellow); border: 1px solid rgba(234,179,8,0.3); }
  .badge-blue   { background: rgba(59,130,246,0.15); color: var(--blue);   border: 1px solid rgba(59,130,246,0.3); }
  .badge-orange { background: rgba(232,101,26,0.15); color: var(--accent2);border: 1px solid rgba(232,101,26,0.3); }
  /* FIX 2: badge-gold faltaba */
  .badge-gold   { background: rgba(212,160,23,0.15); color: var(--gold);   border: 1px solid rgba(212,160,23,0.3); }

  /* ── BOTONES ACCIÓN ── */
  .btn-action {
    padding: 5px 12px; border-radius: 7px; font-size: 12px; font-weight: 700;
    cursor: pointer; border: none; font-family: var(--font-b);
    transition: all 0.15s; margin-right: 5px; margin-bottom: 3px;
  }
  .btn-ban  { background: rgba(239,68,68,0.15);  color: var(--red);    border: 1px solid rgba(239,68,68,0.3); }
  .btn-ban:hover  { background: rgba(239,68,68,0.3); }
  .btn-ok   { background: rgba(34,197,94,0.15);  color: var(--green);  border: 1px solid rgba(34,197,94,0.3); }
  .btn-ok:hover   { background: rgba(34,197,94,0.3); }
  .btn-blue { background: rgba(59,130,246,0.15); color: var(--blue);   border: 1px solid rgba(59,130,246,0.3); }
  .btn-blue:hover { background: rgba(59,130,246,0.3); }
  .btn-gold { background: rgba(212,160,23,0.15); color: var(--gold);   border: 1px solid rgba(212,160,23,0.3); }
  .btn-gold:hover { background: rgba(212,160,23,0.3); }
  .btn-primary-dark {
    padding: 9px 18px; background: var(--grad); color: white;
    border: none; border-radius: 8px; font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: var(--font-b);
    box-shadow: 0 3px 12px rgba(192,57,43,0.35);
    transition: opacity 0.18s, transform 0.15s;
  }
  .btn-primary-dark:hover { opacity: 0.88; transform: translateY(-1px); }
  .btn-primary-dark:disabled { opacity: 0.45; cursor: not-allowed; transform: none; }

  /* ── MODAL ── */
  .modal-wrap { position: fixed; inset: 0; z-index: 500; display: flex; align-items: center; justify-content: center; padding: 20px; }
  .modal-bg { position: absolute; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); }
  .modal-box {
    position: relative; background: var(--bg2); border: 1px solid var(--border);
    border-radius: 18px; padding: 28px; max-width: 440px; width: 100%;
    box-shadow: 0 20px 60px rgba(0,0,0,0.6); animation: popIn 0.22s ease;
  }
  @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
  .modal-title { font-family: var(--font-h); font-size: 17px; font-weight: 800; margin-bottom: 6px; }
  .modal-sub { color: var(--muted); font-size: 13px; margin-bottom: 20px; line-height: 1.6; }
  .inp-dark {
    display: block; width: 100%; padding: 11px 14px; margin-bottom: 12px;
    background: var(--bg3); border: 1px solid var(--border); border-radius: 9px;
    color: var(--text); font-size: 14px; font-family: var(--font-b); outline: none;
    transition: border-color 0.18s;
  }
  .inp-dark:focus { border-color: var(--accent); }
  .inp-dark::placeholder { color: var(--muted); }
  .modal-actions { display: flex; gap: 10px; margin-top: 6px; }
  .modal-actions .btn-primary-dark { flex: 1; padding: 11px; }
  .btn-cancel {
    flex: 1; padding: 11px; background: var(--bg3); border: 1px solid var(--border);
    border-radius: 8px; color: var(--muted); font-size: 13px; font-weight: 700;
    cursor: pointer; font-family: var(--font-b); transition: all 0.15s;
  }
  .btn-cancel:hover { border-color: var(--muted); color: var(--text); }

  /* ── FINANZAS ── */
  .finance-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
  .finance-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 22px; position: relative; overflow: hidden;
  }
  .finance-card::after {
    content: ''; position: absolute; top: -20px; right: -20px;
    width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.03);
  }
  .finance-label { font-size: 12px; color: var(--muted); font-weight: 600; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  .finance-val { font-family: var(--font-h); font-size: 32px; font-weight: 900; color: var(--gold); }
  .finance-sub { font-size: 12px; color: var(--muted); margin-top: 6px; }

  /* ── REPORTE CARD ── */
  .reporte-card {
    background: var(--bg2); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 18px; margin-bottom: 12px;
    transition: border-color 0.18s;
  }
  .reporte-card:hover { border-color: var(--accent); }
  .reporte-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; margin-bottom: 10px; }
  .reporte-motivo { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 12px; }
  .reporte-fecha { font-size: 11px; color: var(--muted); font-family: var(--font-m); }

  /* ── EMPTY ── */
  .empty-dark { padding: 48px; text-align: center; color: var(--muted); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-txt { font-size: 14px; font-weight: 600; }

  /* ── LOADING ── */
  .loading { display: flex; align-items: center; justify-content: center; padding: 48px; gap: 10px; color: var(--muted); font-size: 14px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner { width: 20px; height: 20px; border: 2px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite; }

  /* ── MSG ── */
  .msg-ok-dark  { background: rgba(34,197,94,0.1);  border: 1px solid rgba(34,197,94,0.3);  color: var(--green); padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }
  .msg-err-dark { background: rgba(239,68,68,0.1);  border: 1px solid rgba(239,68,68,0.3);  color: var(--red);   padding: 10px 14px; border-radius: 8px; font-size: 13px; font-weight: 600; margin-bottom: 12px; }

  /* ── ID ── */
  .id-mono { font-family: var(--font-m); font-size: 11px; color: var(--muted); }

  @media (max-width: 768px) {
    .sidebar { display: none; }
    .content { padding: 16px; }
    .topbar { padding: 12px 16px; }
  }
`;

const SECCIONES = [
  { id:"dashboard",  icon:"📊", label:"Dashboard" },
  { id:"reportes",   icon:"🚨", label:"Reportes",   section:"GESTIÓN" },
  { id:"tiendas",    icon:"🏪", label:"Tiendas",    section:"GESTIÓN" },
  { id:"usuarios",   icon:"👥", label:"Usuarios" },
  { id:"productos",  icon:"📦", label:"Productos" },
  { id:"finanzas",   icon:"💰", label:"Finanzas",   section:"FINANZAS" },
  { id:"beneficios", icon:"🎁", label:"Beneficios" },
];

export default function AdminPanel() {
  const [usuario,    setUsuario]    = useState(null);
  const [esAdmin,    setEsAdmin]    = useState(null); // null = cargando
  const [seccion,    setSeccion]    = useState("dashboard");
  const [cargando,   setCargando]   = useState(false);
  const [msg,        setMsg]        = useState("");
  const [msgTipo,    setMsgTipo]    = useState("ok");

  const [reportes,   setReportes]   = useState([]);
  const [tiendas,    setTiendas]    = useState([]);
  const [usuarios,   setUsuarios]   = useState([]);
  const [productos,  setProductos]  = useState([]);
  const [pagos,      setPagos]      = useState([]);
  const [beneficios, setBeneficios] = useState([]);

  const [busT, setBusT] = useState("");
  const [busU, setBusU] = useState("");
  const [busP, setBusP] = useState("");

  // FIX 6: modal guardado en ref para que acciones async siempre lean el valor actual
  const [modal,     setModal]     = useState(null); // { tipo, data }
  const [modalForm, setModalForm] = useState({});
  const modalRef = useRef(null);
  const syncModal = (val) => { modalRef.current = val; setModal(val); };

  // FIX 5: flag para evitar doble carga
  const adminCargado = useRef(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) verificarAdmin(session.user);
      else setEsAdmin(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      if (session?.user) {
        // FIX 5: solo verificar si aún no se ha cargado (evita doble ejecución)
        if (!adminCargado.current) verificarAdmin(session.user);
      } else {
        adminCargado.current = false;
        setUsuario(null); setEsAdmin(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  async function verificarAdmin(user) {
    if (adminCargado.current) return; // FIX 5: guard contra doble carga
    adminCargado.current = true;
    setUsuario(user);
    const { data } = await supabase.from("admins").select("*").eq("email", user.email).single();
    if (data) { setEsAdmin(true); cargarTodo(); }
    else { setEsAdmin(false); adminCargado.current = false; }
  }

  async function cargarTodo() {
    setCargando(true);
    const [r, t, u, p, pg, b] = await Promise.all([
      supabase.from("reportes").select("*").order("created_at", { ascending: false }),
      supabase.from("tiendas").select("*").order("created_at", { ascending: false }),
      supabase.from("usuarios").select("*").order("created_at", { ascending: false }),
      supabase.from("productos").select("*").order("created_at", { ascending: false }),
      supabase.from("pagos").select("*").order("created_at", { ascending: false }),
      supabase.from("beneficios").select("*").order("created_at", { ascending: false }),
    ]);
    setReportes(r.data   || []);
    setTiendas(t.data    || []);
    setUsuarios(u.data   || []);
    setProductos(p.data  || []);
    setPagos(pg.data     || []);
    setBeneficios(b.data || []);
    setCargando(false);
  }

  async function login() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin + "/admin" },
    });
  }

  async function logout() {
    adminCargado.current = false;
    await supabase.auth.signOut();
    setUsuario(null); setEsAdmin(false);
  }

  function showMsg(texto, tipo = "ok") {
    setMsg(texto); setMsgTipo(tipo);
    setTimeout(() => setMsg(""), 3500);
  }

  // ── ACCIONES TIENDAS ──────────────────────────────────────────────
  async function cambiarEstadoTienda(tienda, nuevoEstado) {
    const { error } = await supabase.from("tiendas").update({ estado: nuevoEstado }).eq("id", tienda.id);
    if (error) { showMsg("Error al cambiar estado: " + error.message, "err"); return; }
    showMsg(`Tienda "${tienda.nombre}" → ${nuevoEstado}`);
    cargarTodo();
  }

  async function renovarTienda(tienda) {
    // FIX 4: usar campo dedicado "renovado_at" para que el vendedor
    // calcule los días desde la renovación, no desde created_at.
    // El frontend debe priorizar renovado_at si existe.
    const ahora = new Date().toISOString();
    const { error } = await supabase.from("tiendas").update({
      estado: "activa",
      renovado_at: ahora,   // campo nuevo: fecha base para contar los 300 días
    }).eq("id", tienda.id);
    if (error) { showMsg("Error al renovar: " + error.message, "err"); return; }
    await supabase.from("beneficios").insert({
      tienda_id: tienda.id, tipo: "renovacion", valor: 300,
      otorgado_por: usuario.email,
    });
    showMsg(`Tienda "${tienda.nombre}" renovada 300 días ✅`);
    cargarTodo(); syncModal(null);
  }

  async function ampliarProductos(tienda, cantidad) {
    const cant = parseInt(cantidad) || 5;
    const { error } = await supabase.from("beneficios").insert({
      tienda_id: tienda.id, tipo: "productos_extra", valor: cant,
      otorgado_por: usuario.email,
    });
    if (error) { showMsg("Error: " + error.message, "err"); return; }
    // Sumar tokens_extra en la tienda directamente
    const tokensActuales = tienda.tokens_extra || 0;
    await supabase.from("tiendas").update({ tokens_extra: tokensActuales + cant }).eq("id", tienda.id);
    showMsg(`+${cant} productos extra otorgados a "${tienda.nombre}" ✅`);
    cargarTodo(); syncModal(null);
  }

  async function verificarTienda(tienda) {
    const { error } = await supabase.from("tiendas").update({ verificada: true }).eq("id", tienda.id);
    if (error) { showMsg("Error: " + error.message, "err"); return; }
    await supabase.from("beneficios").insert({
      tienda_id: tienda.id, tipo: "verificacion", valor: 1,
      otorgado_por: usuario.email,
    });
    showMsg(`Tienda "${tienda.nombre}" verificada ✅`);
    cargarTodo();
  }

  // ── ACCIONES USUARIOS ────────────────────────────────────────────
  async function banearUsuario(u, multa) {
    // FIX 3: buscar tiendas por el auth_id del usuario (campo usuario_id en tiendas
    // corresponde al UUID de auth, no al id de la tabla usuarios).
    // Primero actualizamos el registro del usuario.
    const { error: errU } = await supabase.from("usuarios").update({
      baneado: true,
      multa_reactivacion: multa ? parseFloat(multa) : null,
    }).eq("id", u.id);
    if (errU) { showMsg("Error al banear: " + errU.message, "err"); return; }

    // Suspender tiendas usando el email como puente seguro
    // (usuario.email → tiendas via tabla usuarios.email = tiendas.owner_email, o
    //  si tiendas.usuario_id es el auth uuid, lo buscamos desde auth)
    // Estrategia robusta: suspender por usuario_id usando el campo que guarda el auth uuid.
    // En la inserción de tiendas se usa authUser.id (el UUID de supabase.auth).
    // El campo u.id en tabla usuarios puede ser distinto; usamos u.email para localizar.
    const { data: tiendasUsuario } = await supabase
      .from("tiendas")
      .select("id")
      .eq("usuario_id", u.auth_uid || u.id); // preferir auth_uid si existe

    if (tiendasUsuario && tiendasUsuario.length > 0) {
      const ids = tiendasUsuario.map(t => t.id);
      await supabase.from("tiendas").update({ estado: "suspendida" }).in("id", ids);
    }

    showMsg(`Usuario ${u.nombre} baneado${multa ? ` (multa S/ ${multa})` : " (permanente)"}`);
    cargarTodo(); syncModal(null);
  }

  async function desbanearUsuario(u) {
    await supabase.from("usuarios").update({
      baneado: false,
      multa_reactivacion: null,
    }).eq("id", u.id);
    // Reactivar sus tiendas
    const { data: tiendasUsuario } = await supabase
      .from("tiendas").select("id")
      .eq("usuario_id", u.auth_uid || u.id);
    if (tiendasUsuario && tiendasUsuario.length > 0) {
      const ids = tiendasUsuario.map(t => t.id);
      await supabase.from("tiendas").update({ estado: "activa" }).in("id", ids);
    }
    showMsg(`Usuario ${u.nombre} desbaneado ✅`);
    cargarTodo();
  }

  // ── ACCIONES REPORTES ────────────────────────────────────────────
  async function marcarReporteRevisado(r) {
    await supabase.from("reportes").update({ estado: "revisado" }).eq("id", r.id);
    showMsg("Reporte marcado como revisado");
    cargarTodo();
  }

  async function eliminarProducto(p) {
    const { error } = await supabase.from("productos").delete().eq("id", p.id);
    if (error) { showMsg("Error al eliminar: " + error.message, "err"); return; }
    showMsg(`Producto "${p.nombre}" eliminado`);
    cargarTodo();
  }

  // ── FINANZAS ─────────────────────────────────────────────────────
  const totalPagado   = pagos.filter(p => p.estado === "pagado").reduce((s, p) => s + (p.monto || 0), 0);
  const totalEsperado = tiendas.length * 5;
  const pagosHoy      = pagos.filter(p => {
    const hoy = new Date().toDateString();
    return new Date(p.created_at).toDateString() === hoy && p.estado === "pagado";
  }).reduce((s, p) => s + (p.monto || 0), 0);

  // ── STATS DASHBOARD ──────────────────────────────────────────────
  const reportesPendientes  = reportes.filter(r => r.estado !== "revisado").length;
  const tiendasActivas      = tiendas.filter(t => t.estado === "activa").length;
  const tiendasSuspendidas  = tiendas.filter(t => t.estado === "suspendida").length;
  const usuariosBaneados    = usuarios.filter(u => u.baneado).length;

  // ── FILTROS ──────────────────────────────────────────────────────
  const tiendasFilt   = tiendas.filter(t => t.nombre?.toLowerCase().includes(busT.toLowerCase()));
  const usuariosFilt  = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(busU.toLowerCase()) ||
    u.email?.toLowerCase().includes(busU.toLowerCase())
  );
  const productosFilt = productos.filter(p => p.nombre?.toLowerCase().includes(busP.toLowerCase()));

  // ── HELPERS ──────────────────────────────────────────────────────
  const fecha = (d) => d
    ? new Date(d).toLocaleDateString("es-PE", { day:"2-digit", month:"short", year:"numeric" })
    : "—";

  function estadoBadge(estado) {
    const map = { activa:"badge-green", suspendida:"badge-red", revision:"badge-yellow", inactiva:"badge-orange" };
    return <span className={`badge ${map[estado] || "badge-blue"}`}>● {estado || "—"}</span>;
  }

  // ── PANTALLAS: LOGIN / CARGANDO / ACCESO DENEGADO ────────────────
  if (esAdmin === null) return (
    <div style={{ minHeight:"100vh", background:"#0D0F14", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <style>{CSS}</style>
      <div className="spinner" style={{ width:32, height:32 }} />
    </div>
  );

  if (!usuario || esAdmin === false) return (
    <div className="admin-login">
      <style>{CSS}</style>
      <div className="login-box">
        <div className="login-logo">🛡️</div>
        <p className="login-title">Panel de Administración</p>
        <p className="login-sub">TinkaMarket — Acceso restringido</p>
        <button className="login-btn" onClick={login}>
          <span style={{ fontWeight:900, fontSize:18 }}>G</span> Iniciar sesión con Google
        </button>
        {usuario && esAdmin === false && (
          <div className="access-denied">
            🚫 Tu cuenta no tiene permisos de administrador.<br />
            <span style={{ fontSize:12, opacity:0.8 }}>{usuario.email}</span>
          </div>
        )}
      </div>
    </div>
  );

  // ── PANEL PRINCIPAL ──────────────────────────────────────────────
  return (
    <div className="admin-layout">
      <style>{CSS}</style>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-head">
          <div className="sidebar-brand">
            <div className="sidebar-logo">🛡️</div>
            <span className="sidebar-brand-txt">TinkaMarket</span>
          </div>
          <span className="sidebar-badge">ADMIN PANEL</span>
        </div>

        <nav className="sidebar-nav">
          {SECCIONES.map(s => (
            <div key={s.id}>
              {s.section && <p className="nav-section">{s.section}</p>}
              <div
                className={`nav-item ${seccion === s.id ? "active" : ""}`}
                onClick={() => setSeccion(s.id)}
              >
                <span className="nav-icon">{s.icon}</span>
                {s.label}
                {s.id === "reportes" && reportesPendientes > 0 && (
                  <span className="nav-badge">{reportesPendientes}</span>
                )}
              </div>
            </div>
          ))}
        </nav>

        <div className="sidebar-foot">
          <div className="admin-info">
            <div className="admin-avatar">{usuario.email[0].toUpperCase()}</div>
            <div>
              <p className="admin-name">{usuario.email.split("@")[0]}</p>
              <p className="admin-role">Administrador</p>
            </div>
          </div>
          <button className="btn-logout" onClick={logout}>🚪 Cerrar sesión</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="main">
        <div className="topbar">
          <div>
            <p className="topbar-title">
              {SECCIONES.find(s => s.id === seccion)?.icon}{" "}
              {SECCIONES.find(s => s.id === seccion)?.label}
            </p>
            <p className="topbar-sub">
              TinkaMarket Admin ·{" "}
              {new Date().toLocaleDateString("es-PE", { weekday:"long", day:"numeric", month:"long" })}
            </p>
          </div>
          <div className="topbar-right">
            <div className="status-dot" />
            <span style={{ fontSize:12, color:"var(--muted)" }}>En línea</span>
            <button
              className="btn-primary-dark"
              onClick={cargarTodo}
              style={{ padding:"7px 14px", fontSize:12 }}
            >↻ Actualizar</button>
          </div>
        </div>

        <div className="content">
          {msg && <div className={msgTipo === "ok" ? "msg-ok-dark" : "msg-err-dark"}>{msg}</div>}

          {/* ══ DASHBOARD ══ */}
          {seccion === "dashboard" && <>
            <div className="stats-grid">
              {[
                { icon:"🏪", label:"Tiendas activas",      val:tiendasActivas,     sub:`${tiendasSuspendidas} suspendidas`,  color:"var(--green)" },
                { icon:"👥", label:"Usuarios",              val:usuarios.length,    sub:`${usuariosBaneados} baneados`,       color:"var(--blue)" },
                { icon:"📦", label:"Productos",             val:productos.length,   sub:"publicados en total",                color:"var(--accent2)" },
                { icon:"🚨", label:"Reportes pendientes",   val:reportesPendientes, sub:`${reportes.length} en total`,        color: reportesPendientes > 0 ? "var(--red)" : "var(--green)" },
                { icon:"💰", label:"Ingresos totales",      val:`S/ ${totalPagado.toFixed(2)}`, sub:`S/ ${pagosHoy.toFixed(2)} hoy`, color:"var(--gold)" },
                { icon:"🎁", label:"Beneficios otorgados",  val:beneficios.length,  sub:"por administración",                 color:"var(--gold)" },
              ].map((c, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-icon">{c.icon}</div>
                  <p className="stat-label">{c.label}</p>
                  <p className="stat-val" style={{ color: c.color }}>{c.val}</p>
                  <p className="stat-sub">{c.sub}</p>
                </div>
              ))}
            </div>

            {reportesPendientes > 0 && <>
              <p style={{ fontFamily:"var(--font-h)", fontWeight:700, marginBottom:14, color:"var(--red)" }}>
                🚨 Reportes pendientes
              </p>
              {reportes.filter(r => r.estado !== "revisado").slice(0, 3).map(r => (
                <div key={r.id} className="reporte-card">
                  <div className="reporte-head">
                    <span className={`badge ${r.tipo === "bug" ? "badge-blue" : "badge-red"}`}>{r.tipo}</span>
                    <span className="reporte-fecha">{fecha(r.created_at)}</span>
                  </div>
                  <p className="reporte-motivo">{r.motivo}</p>
                  <button className="btn-action btn-ok" onClick={() => marcarReporteRevisado(r)}>✓ Marcar revisado</button>
                  <button className="btn-action btn-blue" onClick={() => setSeccion("reportes")}>Ver todos</button>
                </div>
              ))}
            </>}
          </>}

          {/* ══ REPORTES ══ */}
          {seccion === "reportes" && (
            reportes.length === 0
              ? <div className="empty-dark"><div className="empty-icon">✅</div><p className="empty-txt">Sin reportes pendientes</p></div>
              : reportes.map(r => (
                <div key={r.id} className="reporte-card">
                  <div className="reporte-head">
                    <div>
                      <span className={`badge ${r.tipo === "bug" ? "badge-blue" : "badge-red"}`} style={{ marginRight:8 }}>{r.tipo}</span>
                      <span className={`badge ${r.estado === "revisado" ? "badge-green" : "badge-yellow"}`}>{r.estado || "pendiente"}</span>
                    </div>
                    <span className="reporte-fecha">{fecha(r.created_at)}</span>
                  </div>
                  <p className="reporte-motivo">{r.motivo}</p>
                  <p className="id-mono" style={{ marginBottom:10 }}>Reportado por ID: {r.reportado_por}</p>
                  {r.estado !== "revisado" && (
                    <button className="btn-action btn-ok" onClick={() => marcarReporteRevisado(r)}>
                      ✓ Marcar como revisado
                    </button>
                  )}
                </div>
              ))
          )}

          {/* ══ TIENDAS ══ */}
          {seccion === "tiendas" && (
            <div className="table-wrap">
              <div className="table-head">
                <p className="table-title">Todas las tiendas ({tiendas.length})</p>
                <input className="search-inp-dark" placeholder="🔍 Buscar tienda..."
                  value={busT} onChange={e => setBusT(e.target.value)} />
              </div>
              {cargando
                ? <div className="loading"><div className="spinner" /><span>Cargando...</span></div>
                : tiendasFilt.length === 0
                  ? <div className="empty-dark"><p className="empty-txt">Sin resultados</p></div>
                  : <table>
                    <thead><tr>
                      <th>Tienda</th><th>Ubicación</th><th>WhatsApp</th><th>Estado</th><th>Creada</th><th>Acciones</th>
                    </tr></thead>
                    <tbody>
                      {tiendasFilt.map(t => (
                        <tr key={t.id}>
                          <td>
                            <p style={{ fontWeight:700, fontSize:14 }}>{t.nombre}</p>
                            {t.verificada && <span className="badge badge-blue" style={{ fontSize:10 }}>✓ Verificada</span>}
                          </td>
                          <td style={{ color:"var(--muted)", fontSize:12 }}>{t.distrito}, {t.provincia}<br/>{t.departamento}</td>
                          <td><span className="id-mono">{t.whatsapp}</span></td>
                          <td>{estadoBadge(t.estado)}</td>
                          <td><span className="id-mono">{fecha(t.created_at)}</span></td>
                          <td>
                            {t.estado === "activa"
                              ? <button className="btn-action btn-ban" onClick={() => cambiarEstadoTienda(t, "suspendida")}>🚫 Suspender</button>
                              : <button className="btn-action btn-ok"  onClick={() => cambiarEstadoTienda(t, "activa")}>✓ Activar</button>
                            }
                            <button className="btn-action btn-blue" onClick={() => cambiarEstadoTienda(t, "revision")}>👁 Revisión</button>
                            {!t.verificada && (
                              <button className="btn-action btn-gold" onClick={() => verificarTienda(t)}>✓ Verificar</button>
                            )}
                            <button className="btn-action btn-ok" onClick={() => { syncModal({ tipo:"renovar", data:t }); setModalForm({}); }}>↻ Renovar</button>
                            <button className="btn-action btn-gold" onClick={() => { syncModal({ tipo:"productos", data:t }); setModalForm({ cantidad:"5" }); }}>🎁 + Productos</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          )}

          {/* ══ USUARIOS ══ */}
          {seccion === "usuarios" && (
            <div className="table-wrap">
              <div className="table-head">
                <p className="table-title">Todos los usuarios ({usuarios.length})</p>
                <input className="search-inp-dark" placeholder="🔍 Buscar usuario..."
                  value={busU} onChange={e => setBusU(e.target.value)} />
              </div>
              {cargando
                ? <div className="loading"><div className="spinner" /><span>Cargando...</span></div>
                : usuariosFilt.length === 0
                  ? <div className="empty-dark"><p className="empty-txt">Sin resultados</p></div>
                  : <table>
                    <thead><tr>
                      <th>Nombre</th><th>Email</th><th>ID</th><th>Ubicación</th><th>Estado</th><th>Acciones</th>
                    </tr></thead>
                    <tbody>
                      {usuariosFilt.map(u => (
                        <tr key={u.id}>
                          <td style={{ fontWeight:700 }}>{u.nombre} {u.apellidos || ""}</td>
                          <td style={{ color:"var(--muted)", fontSize:12 }}>{u.email}</td>
                          <td><span className="id-mono">{u.usuario_id}</span></td>
                          <td style={{ color:"var(--muted)", fontSize:12 }}>{u.distrito}, {u.provincia}</td>
                          <td>
                            {u.baneado
                              ? <span className="badge badge-red">
                                  🚫 Baneado{u.multa_reactivacion ? ` · S/ ${u.multa_reactivacion}` : " · permanente"}
                                </span>
                              : <span className="badge badge-green">● Activo</span>
                            }
                          </td>
                          <td>
                            {u.baneado
                              ? <button className="btn-action btn-ok"  onClick={() => desbanearUsuario(u)}>✓ Desbanear</button>
                              : <button className="btn-action btn-ban" onClick={() => { syncModal({ tipo:"banear", data:u }); setModalForm({ multa:"" }); }}>🚫 Banear</button>
                            }
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          )}

          {/* ══ PRODUCTOS ══ */}
          {seccion === "productos" && (
            <div className="table-wrap">
              <div className="table-head">
                <p className="table-title">Todos los productos ({productos.length})</p>
                <input className="search-inp-dark" placeholder="🔍 Buscar producto..."
                  value={busP} onChange={e => setBusP(e.target.value)} />
              </div>
              {cargando
                ? <div className="loading"><div className="spinner" /><span>Cargando...</span></div>
                : productosFilt.length === 0
                  ? <div className="empty-dark"><p className="empty-txt">Sin resultados</p></div>
                  : <table>
                    <thead><tr>
                      <th>Foto</th><th>Producto</th><th>Precio</th><th>Cantidad</th><th>Categoría</th><th>Likes</th><th>Acciones</th>
                    </tr></thead>
                    <tbody>
                      {productosFilt.map(p => (
                        <tr key={p.id}>
                          <td>
                            {p.fotos && p.fotos[0]
                              ? <img src={p.fotos[0]} alt={p.nombre}
                                  style={{ width:40, height:40, borderRadius:8, objectFit:"cover" }} />
                              : <span style={{ fontSize:20 }}>📦</span>
                            }
                          </td>
                          <td style={{ fontWeight:700 }}>{p.nombre}</td>
                          <td style={{ color:"var(--accent2)", fontWeight:800, fontFamily:"var(--font-h)" }}>S/ {p.precio}</td>
                          <td>{p.cantidad}</td>
                          <td><span className="badge badge-blue">{p.categoria}</span></td>
                          <td>❤️ {p.likes}</td>
                          <td>
                            <button className="btn-action btn-ban" onClick={() => eliminarProducto(p)}>🗑 Eliminar</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              }
            </div>
          )}

          {/* ══ FINANZAS ══ */}
          {seccion === "finanzas" && <>
            <div className="finance-grid">
              {[
                { label:"💰 Total ingresado (Culqi)", val:`S/ ${totalPagado.toFixed(2)}`,   sub:"Debería estar en tu BCP",           color:"var(--gold)" },
                { label:"📅 Ingresos hoy",             val:`S/ ${pagosHoy.toFixed(2)}`,      sub:"Pagos del día",                     color:"var(--green)" },
                { label:"📊 Estimado esperado",        val:`S/ ${totalEsperado.toFixed(2)}`, sub:`${tiendas.length} tiendas × S/5`,   color:"var(--yellow)" },
                { label:"🎁 Beneficios gratuitos",     val:beneficios.length,                sub:"otorgados por admin",               color:"var(--muted)" },
              ].map((c, i) => (
                <div key={i} className="finance-card">
                  <p className="finance-label">{c.label}</p>
                  <p className="finance-val" style={{ color: c.color }}>{c.val}</p>
                  <p className="finance-sub">{c.sub}</p>
                </div>
              ))}
            </div>

            <div className="table-wrap">
              <div className="table-head">
                <p className="table-title">Registro de pagos ({pagos.length})</p>
              </div>
              {pagos.length === 0
                ? <div className="empty-dark">
                    <div className="empty-icon">💳</div>
                    <p className="empty-txt">Aún no hay pagos registrados</p>
                    <p style={{ fontSize:12, color:"var(--muted)", marginTop:8 }}>Los pagos aparecerán aquí cuando Culqi esté activo</p>
                  </div>
                : <table>
                  <thead><tr>
                    <th>Tipo</th><th>Monto</th><th>Estado</th><th>Fecha</th><th>Token Culqi</th>
                  </tr></thead>
                  <tbody>
                    {pagos.map(p => (
                      <tr key={p.id}>
                        <td><span className="badge badge-blue">{p.tipo}</span></td>
                        <td style={{ color:"var(--gold)", fontWeight:800, fontFamily:"var(--font-h)" }}>S/ {p.monto}</td>
                        <td><span className={`badge ${p.estado === "pagado" ? "badge-green" : "badge-yellow"}`}>{p.estado}</span></td>
                        <td><span className="id-mono">{fecha(p.created_at)}</span></td>
                        <td><span className="id-mono" style={{ fontSize:10 }}>{p.token_culqi?.slice(0, 20) || "—"}…</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </div>
          </>}

          {/* ══ BENEFICIOS ══ */}
          {seccion === "beneficios" && (
            <div className="table-wrap">
              <div className="table-head">
                <p className="table-title">Beneficios otorgados ({beneficios.length})</p>
              </div>
              {beneficios.length === 0
                ? <div className="empty-dark"><div className="empty-icon">🎁</div><p className="empty-txt">Aún no se han otorgado beneficios</p></div>
                : <table>
                  <thead><tr>
                    <th>Tipo</th><th>Tienda ID</th><th>Valor</th><th>Otorgado por</th><th>Fecha</th>
                  </tr></thead>
                  <tbody>
                    {beneficios.map(b => (
                      <tr key={b.id}>
                        {/* FIX 2: badge-gold ahora existe en CSS */}
                        <td><span className={`badge ${b.tipo === "renovacion" ? "badge-green" : b.tipo === "verificacion" ? "badge-blue" : "badge-gold"}`}>{b.tipo}</span></td>
                        <td><span className="id-mono">{b.tienda_id?.slice(0, 12)}…</span></td>
                        <td style={{ fontWeight:700 }}>
                          {b.valor} {b.tipo === "renovacion" ? "días" : b.tipo === "productos_extra" ? "productos" : ""}
                        </td>
                        <td style={{ color:"var(--muted)", fontSize:12 }}>{b.otorgado_por}</td>
                        <td><span className="id-mono">{fecha(b.created_at)}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              }
            </div>
          )}
        </div>
      </main>

      {/* ══ MODALES ══ */}
      {/* FIX 6: solo renderizar si modal tiene data válida */}
      {modal && modal.data && (
        <div className="modal-wrap">
          <div className="modal-bg" onClick={() => syncModal(null)} />
          <div className="modal-box">

            {/* Renovar tienda */}
            {modal.tipo === "renovar" && <>
              <p className="modal-title">↻ Renovar tienda</p>
              <p className="modal-sub">
                Se renovará <strong>"{modal.data.nombre}"</strong> por 300 días adicionales sin costo.
                El contador de días se reiniciará desde hoy. Esta acción queda registrada.
              </p>
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => syncModal(null)}>Cancelar</button>
                <button className="btn-primary-dark" onClick={() => renovarTienda(modal.data)}>Confirmar renovación</button>
              </div>
            </>}

            {/* Ampliar productos */}
            {modal.tipo === "productos" && <>
              <p className="modal-title">🎁 Ampliar productos</p>
              <p className="modal-sub">
                Otorgar publicaciones extra gratuitas a <strong>"{modal.data.nombre}"</strong> sin pago.
                Se sumarán a su cupo actual.
              </p>
              <input className="inp-dark" type="number" min="1" max="50"
                placeholder="Cantidad de productos extra..."
                value={modalForm.cantidad || ""}
                onChange={e => setModalForm({ cantidad: e.target.value })} />
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => syncModal(null)}>Cancelar</button>
                <button className="btn-primary-dark" onClick={() => ampliarProductos(modal.data, modalForm.cantidad || 5)}>
                  Otorgar {modalForm.cantidad || 5} producto{(parseInt(modalForm.cantidad) || 5) !== 1 ? "s" : ""}
                </button>
              </div>
            </>}

            {/* Banear usuario */}
            {modal.tipo === "banear" && <>
              <p className="modal-title">🚫 Banear usuario</p>
              <p className="modal-sub">
                Vas a banear a <strong>"{modal.data.nombre}"</strong>. Sus tiendas quedarán suspendidas
                e invisibles para los compradores. Define el monto de multa para poder reactivar,
                o déjalo vacío para suspensión permanente sin opción de pago.
              </p>
              <input className="inp-dark" type="number" min="0" step="1"
                placeholder="Monto de multa en soles (vacío = permanente)..."
                value={modalForm.multa || ""}
                onChange={e => setModalForm({ multa: e.target.value })} />
              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => syncModal(null)}>Cancelar</button>
                <button className="btn-primary-dark" style={{ background:"linear-gradient(135deg,#7B0000,#EF4444)" }}
                  onClick={() => banearUsuario(modal.data, modalForm.multa)}>
                  Confirmar baneo
                </button>
              </div>
            </>}

          </div>
        </div>
      )}
    </div>
  );
}