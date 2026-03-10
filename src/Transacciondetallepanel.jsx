import { useState, useEffect } from "react";

const BASE_URL = "http://localhost:8080/api";

// ─── Estilos ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #f4f1eb; --surface: #fffefb; --border: #e2ddd4; --border2: #c8c0b0;
    --text: #1a1714; --muted: #8a8278;
    --accent: #1a3a2a; --accent2: #2d6a4f; --accent-lt: #e8f0eb;
    --warn: #8b3a1a; --warn-lt: #f5ece8;
    --gold: #b8952a; --gold-lt: #faf4e1;
    --red: #c0392b; --red-lt: #fdf0ef;
    --blue: #1e40af; --blue-lt: #eff6ff;
    --green: #16a34a; --green-lt: #f0fdf4;
    --shadow: 0 2px 8px rgba(26,23,20,0.08);
    --shadow-lg: 0 8px 32px rgba(26,23,20,0.12);
  }
  body { background: var(--bg); font-family: 'DM Sans', sans-serif; color: var(--text); }

  .root { min-height: 100vh; padding: 40px 24px 80px; display: flex; flex-direction: column; align-items: center; }

  /* Header */
  .page-header { width: 100%; max-width: 960px; margin-bottom: 24px; }
  .eyebrow { font-family: 'DM Mono', monospace; font-size: 0.62rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent2); margin-bottom: 6px; }
  .page-title { font-family: 'DM Serif Display', serif; font-size: 1.8rem; font-weight: 400; margin-bottom: 4px; }
  .page-sub { color: var(--muted); font-size: 0.82rem; }

  /* Layout */
  .layout { width: 100%; max-width: 960px; display: grid; grid-template-columns: 1fr 300px; gap: 20px; align-items: start; }

  /* Card */
  .card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden; margin-bottom: 16px; }
  .card-head { padding: 16px 20px; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-family: 'DM Serif Display', serif; font-size: 1rem; font-weight: 400; display: flex; align-items: center; gap: 8px; }
  .card-body { padding: 20px; }

  /* Saldo banner */
  .saldo-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; margin-bottom: 16px; }
  .saldo-item { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 12px 14px; }
  .saldo-lbl { font-family: 'DM Mono',monospace; font-size: 0.57rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--muted); margin-bottom: 4px; }
  .saldo-val { font-family: 'DM Mono',monospace; font-size: 0.88rem; font-weight: 600; }
  .val-ok   { color: var(--green); }
  .val-warn { color: var(--warn); }
  .val-gold { color: var(--gold); }
  .val-red  { color: var(--red); }

  /* Barra progreso */
  .prog-label { display: flex; justify-content: space-between; font-size: 0.72rem; color: var(--muted); margin-bottom: 6px; }
  .prog-bg { height: 10px; background: var(--border); border-radius: 999px; overflow: hidden; }
  .prog-fill { height: 100%; border-radius: 999px; background: linear-gradient(90deg, var(--accent2), var(--accent)); transition: width 0.5s ease; }
  .prog-fill.full { background: linear-gradient(90deg, var(--green), #15803d); }

  /* Timeline */
  .timeline { position: relative; padding-left: 30px; }
  .timeline::before { content:''; position:absolute; left:10px; top:10px; bottom:10px; width:2px; background: var(--border); border-radius:2px; }
  .tl-item { position: relative; margin-bottom: 18px; animation: fadeUp 0.3s ease; }
  @keyframes fadeUp { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }
  .tl-dot {
    position: absolute; left: -30px; top: 4px;
    width: 20px; height: 20px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.65rem; border: 2px solid var(--bg); flex-shrink: 0;
  }
  .dot-CREACION         { background: var(--accent); color:#fff; }
  .dot-PAGO_PARCIAL     { background: var(--blue); color:#fff; }
  .dot-PAGO_TOTAL       { background: var(--green); color:#fff; }
  .dot-AJUSTE_APLICADO  { background: var(--gold); color:#fff; }
  .dot-AJUSTE_APROBADO  { background: var(--accent2); color:#fff; }
  .dot-AJUSTE_RECHAZADO { background: var(--red); color:#fff; }
  .dot-CIERRE           { background: var(--accent); color:#fff; }
  .dot-VENCIMIENTO      { background: var(--warn); color:#fff; }
  .tl-box { background: var(--bg); border: 1px solid var(--border); border-radius: 10px; padding: 10px 14px; }
  .tl-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 3px; }
  .tl-tipo { font-size: 0.68rem; font-family: 'DM Mono',monospace; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 600; color: var(--accent); }
  .tl-fecha { font-size: 0.64rem; color: var(--muted); font-family: 'DM Mono',monospace; }
  .tl-desc { font-size: 0.78rem; color: var(--text); line-height: 1.4; }
  .tl-monto { font-family: 'DM Mono',monospace; font-size: 0.72rem; color: var(--accent2); margin-top: 3px; font-weight: 600; }

  /* Ajuste rows */
  .ajuste-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; border-radius: 10px; border: 1px solid var(--border); background: var(--bg); margin-bottom: 8px; gap: 10px; }
  .ajuste-info { flex: 1; }
  .ajuste-tipo { font-size: 0.8rem; font-weight: 600; text-transform: capitalize; }
  .ajuste-motivo { font-size: 0.72rem; color: var(--muted); margin-top: 2px; }
  .ajuste-monto { font-family: 'DM Mono',monospace; font-size: 0.78rem; font-weight: 600; color: var(--gold); }
  .badge { font-size: 0.6rem; padding: 3px 8px; border-radius: 999px; font-family: 'DM Mono',monospace; text-transform: uppercase; font-weight: 600; white-space: nowrap; }
  .badge-pendiente  { background: var(--gold-lt);   color: var(--gold);   border: 1px solid rgba(184,149,42,0.3); }
  .badge-aprobado   { background: var(--green-lt);  color: var(--green);  border: 1px solid rgba(22,163,74,0.3); }
  .badge-rechazado  { background: var(--red-lt);    color: var(--red);    border: 1px solid rgba(192,57,43,0.3); }
  .ajuste-btns { display: flex; gap: 6px; }

  /* Form sidebar */
  .field { display: flex; flex-direction: column; gap: 5px; margin-bottom: 14px; }
  .field label { font-size: 0.65rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); font-family: 'DM Mono',monospace; }
  .field input, .field select, .field textarea {
    padding: 9px 12px; border: 1.5px solid var(--border); border-radius: 8px;
    background: var(--bg); font-family: 'DM Sans',sans-serif; font-size: 0.87rem;
    color: var(--text); outline: none; transition: border-color 0.2s;
  }
  .field input:focus, .field select:focus, .field textarea:focus { border-color: var(--accent); }
  .field textarea { resize: vertical; min-height: 68px; }
  .field-hint { font-size: 0.68rem; color: var(--accent2); margin-top: 2px; }

  /* Buttons */
  .btn { padding: 9px 16px; border-radius: 9px; font-family: 'DM Sans',sans-serif; font-size: 0.82rem; font-weight: 600; cursor: pointer; border: none; transition: all 0.18s; display: inline-flex; align-items: center; gap: 6px; }
  .btn-primary { background: var(--accent); color: #fff; width: 100%; justify-content: center; }
  .btn-primary:hover:not(:disabled) { background: var(--accent2); }
  .btn-primary:disabled { opacity: 0.45; cursor: not-allowed; }
  .btn-ghost { background: transparent; color: var(--muted); border: 1.5px solid var(--border); }
  .btn-ghost:hover { background: var(--bg); color: var(--text); }
  .btn-sm-green { background: var(--green-lt); color: var(--green); border: 1.5px solid rgba(22,163,74,0.3); padding: 5px 10px; font-size: 0.72rem; border-radius: 7px; cursor: pointer; font-weight: 600; transition: filter 0.15s; }
  .btn-sm-red   { background: var(--red-lt);   color: var(--red);   border: 1.5px solid rgba(192,57,43,0.3);  padding: 5px 10px; font-size: 0.72rem; border-radius: 7px; cursor: pointer; font-weight: 600; transition: filter 0.15s; }
  .btn-sm-green:hover, .btn-sm-red:hover { filter: brightness(0.94); }
  .btn-historial { background: var(--accent-lt); color: var(--accent); border: 1.5px solid rgba(26,58,42,0.2); width: 100%; justify-content: center; margin-top: 8px; }
  .btn-historial:hover { background: var(--accent); color: #fff; }

  .spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; display: inline-block; }
  @keyframes spin { to { transform: rotate(360deg); } }

  .alert { padding: 10px 14px; border-radius: 8px; font-size: 0.78rem; margin-bottom: 14px; }
  .alert-err { background: var(--warn-lt); border: 1px solid rgba(139,58,26,0.2); color: var(--warn); }
  .alert-ok  { background: var(--green-lt); border: 1px solid rgba(22,163,74,0.2); color: var(--green); }
  .empty { text-align: center; padding: 24px 16px; color: var(--muted); font-size: 0.82rem; }

  /* Score card sidebar */
  .score-card { padding: 16px 18px; background: linear-gradient(135deg, var(--accent), var(--accent2)); border-radius: 14px; box-shadow: var(--shadow); margin-bottom: 16px; }
  .score-lbl { font-family: 'DM Mono',monospace; font-size: 0.6rem; text-transform: uppercase; letter-spacing: 0.12em; color: rgba(255,255,255,0.6); margin-bottom: 10px; }
  .score-row { display: flex; align-items: center; gap: 14px; }
  .score-circle { width: 54px; height: 54px; border-radius: 50%; background: rgba(255,255,255,0.15); display: flex; flex-direction: column; align-items: center; justify-content: center; flex-shrink: 0; }
  .score-val  { font-family: 'DM Serif Display',serif; font-size: 1.2rem; color: #fff; line-height: 1; }
  .score-pts  { font-size: 0.42rem; color: rgba(255,255,255,0.6); text-transform: uppercase; font-family: 'DM Mono',monospace; }
  .score-clasi { font-family: 'DM Serif Display',serif; font-size: 1rem; color: #fff; }
  .score-sub  { font-size: 0.7rem; color: rgba(255,255,255,0.6); margin-top: 2px; }

  /* PDF buttons */
  .pdf-card { background: var(--surface); border: 1px solid var(--border); border-radius: 16px; box-shadow: var(--shadow-lg); overflow: hidden; margin-bottom: 16px; }
  .pdf-card-head { padding: 14px 18px; border-bottom: 1px solid var(--border); }
  .pdf-card-title { font-family: 'DM Serif Display',serif; font-size: 0.95rem; font-weight: 400; display: flex; align-items: center; gap: 7px; }
  .pdf-card-body { padding: 14px 18px; display: flex; flex-direction: column; gap: 8px; }

  .btn-pdf {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 14px; border-radius: 10px;
    border: 1.5px solid var(--border); background: var(--bg);
    cursor: pointer; transition: all 0.18s; text-align: left; width: 100%;
    font-family: 'DM Sans',sans-serif;
  }
  .btn-pdf:hover:not(.btn-pdf-disabled) {
    border-color: var(--accent); background: var(--accent-lt);
  }
  .btn-pdf-disabled {
    opacity: 0.45; cursor: not-allowed;
  }
  .btn-pdf-icon {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 1rem;
  }
  .icon-orden   { background: var(--blue-lt); }
  .icon-cierre  { background: var(--green-lt); }
  .btn-pdf-info { flex: 1; }
  .btn-pdf-label { font-size: 0.8rem; font-weight: 600; color: var(--text); }
  .btn-pdf-sub   { font-size: 0.65rem; color: var(--muted); margin-top: 1px; font-family: 'DM Mono',monospace; }
  .btn-pdf-arrow { font-size: 0.75rem; color: var(--muted); flex-shrink: 0; }

  .pdf-coming { font-size: 0.64rem; text-align: center; color: var(--muted);
    font-family: 'DM Mono',monospace; padding: 6px 0 2px;
    border-top: 1px dashed var(--border); margin-top: 2px; }

  @media (max-width: 720px) {
    .layout { grid-template-columns: 1fr; }
    .saldo-grid { grid-template-columns: 1fr 1fr; }
    .sidebar { position: static; }
  }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
  Number(n || 0).toLocaleString("es-PE", { style: "currency", currency: "PEN" });

const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString("es-PE", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  }) : "—";

const TIPO_META = {
  CREACION:         { label: "Creación",          icon: "📋" },
  PAGO_PARCIAL:     { label: "Pago parcial",       icon: "💳" },
  PAGO_TOTAL:       { label: "Pago total",         icon: "✅" },
  AJUSTE_APLICADO:  { label: "Ajuste solicitado",  icon: "🔧" },
  AJUSTE_APROBADO:  { label: "Ajuste aprobado",    icon: "✔" },
  AJUSTE_RECHAZADO: { label: "Ajuste rechazado",   icon: "✖" },
  CIERRE:           { label: "Cierre",             icon: "🔒" },
  VENCIMIENTO:      { label: "Vencimiento",        icon: "⚠" },
};

// ─── Componente ──────────────────────────────────────────────────────────────
export default function TransaccionDetallePanel({
  transaccion: trxProp,
  empresa,
  onVolver,
  onIrAHistorial,
}) {
  const trx = trxProp;

  const [timeline,  setTimeline]  = useState([]);
  const [ajustes,   setAjustes]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [saving,    setSaving]    = useState(false);
  const [msg,       setMsg]       = useState(null); // { type, text }

  const [form, setForm] = useState({
    tipo:   "descuento_porcentaje",
    valor:  "",
    motivo: "",
  });

  // ── Cargar timeline y ajustes ─────────────────────────────────────────────
  useEffect(() => { cargar(); }, [trx?.id]);

  const cargar = async () => {
    if (!trx?.id) return;
    setLoading(true);
    try {
      const [tlRes, ajRes] = await Promise.all([
        fetch(`${BASE_URL}/ajustes/timeline/${trx.id}`),
        fetch(`${BASE_URL}/ajustes/transaccion/${trx.id}`),
      ]);
      const [tlData, ajData] = await Promise.all([tlRes.json(), ajRes.json()]);
      setTimeline(Array.isArray(tlData) ? tlData : []);
      setAjustes(Array.isArray(ajData) ? ajData : []);
    } catch {
      setTimeline([]);
      setAjustes([]);
    } finally {
      setLoading(false);
    }
  };

  // ── Cálculos financieros ──────────────────────────────────────────────────
  const montoOriginal  = Number(trx?.monto_total || trx?.montoTotal || 0);
  const totalPagado    = Number(trx?.monto_pagado || 0);
  const totalAjustes   = ajustes
    .filter(a => a.estado === "aprobado")
    .reduce((s, a) => s + Number(a.montoCalculado || 0), 0);
  const saldoPendiente = Math.max(0, montoOriginal - totalPagado - totalAjustes);
  const pct = montoOriginal > 0
    ? Math.min(100, ((totalPagado + totalAjustes) / montoOriginal) * 100)
    : 0;

  // ── Solicitar ajuste ──────────────────────────────────────────────────────
  const handleSolicitar = async () => {
    if (!form.valor || parseFloat(form.valor) <= 0) {
      setMsg({ type: "err", text: "Ingresa un valor válido para el ajuste." });
      return;
    }
    setSaving(true); setMsg(null);
    try {
      const res = await fetch(`${BASE_URL}/ajustes/solicitar`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transaccionId: trx.id,
          tipo:   form.tipo,
          valor:  parseFloat(form.valor),
          motivo: form.motivo,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg({ type: "ok", text: "Ajuste solicitado. Pendiente de aprobación." });
      setForm({ tipo: "descuento_porcentaje", valor: "", motivo: "" });
      cargar();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  // ── Aprobar ajuste ────────────────────────────────────────────────────────
  const handleAprobar = async (ajusteId) => {
    try {
      const res = await fetch(`${BASE_URL}/ajustes/${ajusteId}/aprobar`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ usuarioId: null }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg({ type: "ok", text: "Ajuste aprobado correctamente." });
      cargar();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    }
  };

  // ── Rechazar ajuste ───────────────────────────────────────────────────────
  const handleRechazar = async (ajusteId) => {
    const motivo = prompt("Motivo del rechazo:");
    if (!motivo) return;
    try {
      const res = await fetch(`${BASE_URL}/ajustes/${ajusteId}/rechazar`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ motivo }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setMsg({ type: "ok", text: "Ajuste rechazado." });
      cargar();
    } catch (err) {
      setMsg({ type: "err", text: err.message });
    }
  };

  const setField = (k, v) => setForm(f => ({ ...f, [k]: v }));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <>
      <style>{css}</style>
      <div className="root">

        {/* Header */}
        <div className="page-header">
          <div className="eyebrow">Score Crediticio — Detalle</div>
          <div className="page-title">Detalle de Transacción</div>
          <div className="page-sub">
            {trx?.codigo_transaccion || trx?.codigoTransaccion} · {empresa?.razon_social}
          </div>
        </div>

        <div className="layout">

          {/* ── Columna principal ── */}
          <div>

            {/* Resumen financiero */}
            <div className="card">
              <div className="card-head">
                <div className="card-title">💰 Resumen financiero</div>
              </div>
              <div className="card-body">
                <div className="saldo-grid">
                  <div className="saldo-item">
                    <div className="saldo-lbl">Monto original</div>
                    <div className="saldo-val">{fmt(montoOriginal)}</div>
                  </div>
                  <div className="saldo-item">
                    <div className="saldo-lbl">Total pagado</div>
                    <div className="saldo-val val-ok">{fmt(totalPagado)}</div>
                  </div>
                  <div className="saldo-item">
                    <div className="saldo-lbl">Ajustes aprobados</div>
                    <div className="saldo-val val-gold">{fmt(totalAjustes)}</div>
                  </div>
                  <div className="saldo-item">
                    <div className="saldo-lbl">Saldo pendiente</div>
                    <div className={`saldo-val ${saldoPendiente > 0 ? "val-warn" : "val-ok"}`}>
                      {fmt(saldoPendiente)}
                    </div>
                  </div>
                </div>

                <div className="prog-label">
                  <span>Progreso de pago</span>
                  <span style={{fontFamily:"DM Mono,monospace",fontWeight:600}}>
                    {pct.toFixed(1)}%
                  </span>
                </div>
                <div className="prog-bg">
                  <div
                    className={`prog-fill ${pct >= 100 ? "full" : ""}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="card">
              <div className="card-head">
                <div className="card-title">📅 Timeline de eventos</div>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="empty">Cargando timeline…</div>
                ) : timeline.length === 0 ? (
                  <div className="empty">Sin eventos registrados aún.</div>
                ) : (
                  <div className="timeline">
                    {timeline.map(ev => {
                      const meta = TIPO_META[ev.tipoEvento] || { label: ev.tipoEvento, icon: "•" };
                      return (
                        <div key={ev.id} className="tl-item">
                          <div className={`tl-dot dot-${ev.tipoEvento}`}>{meta.icon}</div>
                          <div className="tl-box">
                            <div className="tl-top">
                              <span className="tl-tipo">{meta.label}</span>
                              <span className="tl-fecha">{fmtDate(ev.fechaEvento)}</span>
                            </div>
                            <div className="tl-desc">{ev.descripcion}</div>
                            {ev.montoReferencia && (
                              <div className="tl-monto">{fmt(ev.montoReferencia)}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Ajustes registrados */}
            <div className="card">
              <div className="card-head">
                <div className="card-title">🔧 Ajustes / Descuentos</div>
              </div>
              <div className="card-body">
                {ajustes.length === 0 ? (
                  <div className="empty">Sin ajustes registrados.</div>
                ) : ajustes.map(a => (
                  <div key={a.id} className="ajuste-row">
                    <div className="ajuste-info">
                      <div className="ajuste-tipo">
                        {a.tipo?.replace(/_/g, " ")}
                      </div>
                      {a.motivo && (
                        <div className="ajuste-motivo">{a.motivo}</div>
                      )}
                      <div className="ajuste-monto">{fmt(a.montoCalculado)}</div>
                    </div>
                    <span className={`badge badge-${a.estado}`}>{a.estado}</span>
                    {a.estado === "pendiente" && (
                      <div className="ajuste-btns">
                        <button className="btn-sm-green" onClick={() => handleAprobar(a.id)}>
                          ✓ Aprobar
                        </button>
                        <button className="btn-sm-red" onClick={() => handleRechazar(a.id)}>
                          ✗ Rechazar
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── Sidebar ── */}
          <div style={{ position: "sticky", top: 76 }}>

            {/* Score empresa */}
            {(empresa?.score || empresa?.clasificacion) && (
              <div className="score-card">
                <div className="score-lbl">Score crediticio actual</div>
                <div className="score-row">
                  <div className="score-circle">
                    <span className="score-val">{empresa.score ?? "—"}</span>
                    <span className="score-pts">pts</span>
                  </div>
                  <div>
                    <div className="score-clasi">{empresa.clasificacion ?? "—"}</div>
                    <div className="score-sub">Se recalcula con pagos</div>
                  </div>
                </div>
              </div>
            )}

            {/* Documentos PDF */}
            <div className="pdf-card">
              <div className="pdf-card-head">
                <div className="pdf-card-title">📄 Documentos</div>
              </div>
              <div className="pdf-card-body">

                {/* Orden de pago — siempre disponible */}
                <button
                  className="btn-pdf"
                  onClick={() => alert("🔧 Próximamente: generación de PDF en servidor.\nEndpoint: GET /api/documentos/generar?transaccionId=" + trx?.id + "&tipo=orden_pago")}
                >
                  <div className="btn-pdf-icon icon-orden">📋</div>
                  <div className="btn-pdf-info">
                    <div className="btn-pdf-label">Orden de pago</div>
                    <div className="btn-pdf-sub">Detalle + saldo pendiente</div>
                  </div>
                  <span className="btn-pdf-arrow">↓</span>
                </button>

                {/* Comprobante de cierre — solo si pagado */}
                <button
                  className={`btn-pdf ${saldoPendiente > 0 ? "btn-pdf-disabled" : ""}`}
                  onClick={() => {
                    if (saldoPendiente > 0) return;
                    alert("🔧 Próximamente: generación de PDF en servidor.\nEndpoint: GET /api/documentos/generar?transaccionId=" + trx?.id + "&tipo=comprobante_cierre");
                  }}
                >
                  <div className="btn-pdf-icon icon-cierre">🧾</div>
                  <div className="btn-pdf-info">
                    <div className="btn-pdf-label">Comprobante de cierre</div>
                    <div className="btn-pdf-sub">
                      {saldoPendiente > 0 ? "Disponible al liquidar" : "Transacción liquidada"}
                    </div>
                  </div>
                  <span className="btn-pdf-arrow">
                    {saldoPendiente > 0 ? "🔒" : "↓"}
                  </span>
                </button>

                <div className="pdf-coming">
                  Generación de PDFs — próxima reunión
                </div>
              </div>
            </div>

            {/* Solicitar ajuste */}
            <div className="card">
              <div className="card-head">
                <div className="card-title">➕ Solicitar ajuste</div>
              </div>
              <div className="card-body">
                {msg && (
                  <div className={`alert alert-${msg.type}`}>{msg.text}</div>
                )}

                <div className="field">
                  <label>Tipo de ajuste</label>
                  <select value={form.tipo} onChange={e => setField("tipo", e.target.value)}>
                    <option value="descuento_porcentaje">Descuento %</option>
                    <option value="descuento_monto">Descuento monto fijo</option>
                    <option value="ajuste_manual">Ajuste manual</option>
                    <option value="mora">Mora</option>
                  </select>
                </div>

                <div className="field">
                  <label>
                    {form.tipo === "descuento_porcentaje" ? "Porcentaje (%)" : "Monto (S/)"}
                  </label>
                  <input
                    type="number" min="0" step="0.01"
                    placeholder={form.tipo === "descuento_porcentaje" ? "Ej: 15" : "Ej: 300"}
                    value={form.valor}
                    onChange={e => setField("valor", e.target.value)}
                  />
                  {form.tipo === "descuento_porcentaje" && form.valor && saldoPendiente > 0 && (
                    <span className="field-hint">
                      = {fmt(saldoPendiente * parseFloat(form.valor || 0) / 100)} sobre el saldo pendiente
                    </span>
                  )}
                </div>

                <div className="field">
                  <label>Motivo</label>
                  <textarea
                    placeholder="Describe el motivo del ajuste…"
                    value={form.motivo}
                    onChange={e => setField("motivo", e.target.value)}
                  />
                </div>

                <button
                  className="btn btn-primary"
                  onClick={handleSolicitar}
                  disabled={saving}
                >
                  {saving
                    ? <><span className="spinner" /> Enviando…</>
                    : "Solicitar ajuste →"}
                </button>

                <button
                  className="btn btn-historial"
                  onClick={onIrAHistorial}
                >
                  📈 Ver historial score
                </button>

                <button
                  className="btn btn-ghost"
                  style={{ width: "100%", justifyContent: "center", marginTop: 8 }}
                  onClick={onVolver}
                >
                  ← Volver al pago
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}