
// Mini Contable - todo queda guardado en tu dispositivo (localStorage)
// No necesitas internet para usarlo. Si lo publicas con HTTPS (GitHub Pages), podrás instalarlo como app.

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

const STORAGE_KEY = "mini-contable:v1";
let data = { movimientos: [] };

const fmt = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });
const fmtDate = (d) => new Date(d).toLocaleDateString('es-CO', { year: 'numeric', month:'2-digit', day:'2-digit' });

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) data = JSON.parse(raw);
  } catch(e){ console.warn("No se pudo cargar storage", e); }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function addMovimiento({ tipo, concepto, monto }) {
  const mov = {
    id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()),
    fecha: Date.now(),
    entradaConcepto: tipo === 'entrada' ? concepto : "",
    entradaMonto:  tipo === 'entrada' ? Number(monto) : 0,
    salidaConcepto: tipo === 'salida' ? concepto : "",
    salidaMonto:  tipo === 'salida' ? Number(monto) : 0
  };
  data.movimientos.push(mov);
  save();
  render();
}

function removeMovimiento(id){
  data.movimientos = data.movimientos.filter(m => m.id !== id);
  save();
  render();
}

function totals() {
  let tin = 0, tout = 0;
  for (const m of data.movimientos) {
    tin += Number(m.entradaMonto || 0);
    tout += Number(m.salidaMonto || 0);
  }
  return { tin, tout, saldo: tin - tout };
}

function render() {
  const tbody = $("#tbody");
  tbody.innerHTML = "";
  for (const m of data.movimientos) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${fmtDate(m.fecha)}</td>
      <td>${m.entradaConcepto || ""}</td>
      <td class="money">${m.entradaMonto ? fmt.format(m.entradaMonto) : ""}</td>
      <td>${m.salidaConcepto || ""}</td>
      <td class="money">
        ${m.salidaMonto ? fmt.format(m.salidaMonto) : ""}
        <button title="Eliminar" aria-label="Eliminar" style="float:right" onclick="removeMovimiento('${m.id}')">🗑️</button>
      </td>
    `;
    tbody.appendChild(tr);
  }
  const t = totals();
  $("#total-entradas").textContent = fmt.format(t.tin);
  $("#total-salidas").textContent = fmt.format(t.tout);
  $("#saldo").textContent = fmt.format(t.saldo);
}

function bindUI() {
  $("#add-entrada").addEventListener("click", () => {
    const concepto = $("#entrada-concepto").value.trim();
    const monto = $("#entrada-monto").value;
    if (!concepto || !monto) return alert("Completa concepto y monto de la entrada.");
    addMovimiento({ tipo: 'entrada', concepto, monto });
    $("#entrada-concepto").value = "";
    $("#entrada-monto").value = "";
  });

  $("#add-salida").addEventListener("click", () => {
    const concepto = $("#salida-concepto").value.trim();
    const monto = $("#salida-monto").value;
    if (!concepto || !monto) return alert("Completa concepto y monto de la salida.");
    addMovimiento({ tipo: 'salida', concepto, monto });
    $("#salida-concepto").value = "";
    $("#salida-monto").value = "";
  });

  $("#btn-reset").addEventListener("click", () => {
    if (!confirm("¿Borrar todos los movimientos?")) return;
    data = { movimientos: [] };
    save();
    render();
  });

  $("#btn-export").addEventListener("click", exportToPDFLike);

  // PWA install prompt
  let deferredPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const btn = $("#btn-install");
    btn.hidden = false;
    btn.addEventListener('click', async () => {
      btn.hidden = true;
      if (deferredPrompt) {
        deferredPrompt.prompt();
        await deferredPrompt.userChoice;
        deferredPrompt = null;
      }
    });
  });

  // Register service worker when served over HTTPS
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./service-worker.js').catch(()=>{});
  }
}

// Simple "PDF" via print: abre una vista imprimible que el usuario puede "Guardar como PDF"
function exportToPDFLike(){
  const t = totals();
  const rows = data.movimientos.map(m => `
    <tr>
      <td>${fmtDate(m.fecha)}</td>
      <td>${escapeHTML(m.entradaConcepto || "")}</td>
      <td style="text-align:right">${m.entradaMonto ? fmt.format(m.entradaMonto) : ""}</td>
      <td>${escapeHTML(m.salidaConcepto || "")}</td>
      <td style="text-align:right">${m.salidaMonto ? fmt.format(m.salidaMonto) : ""}</td>
    </tr>
  `).join("");

  const win = window.open("", "_blank");
  win.document.write(`
    <html lang="es">
    <head>
      <meta charset="utf-8"/>
      <title>Reporte - Mini Contable</title>
      <style>
        body { font-family: Arial, system-ui; padding: 24px; }
        h1 { margin-top: 0; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; }
        th { background: #f0f3f8; text-align: left; }
        tfoot td { font-weight: bold; }
        .right { text-align: right; }
      </style>
    </head>
    <body>
      <h1>Reporte - Mini Contable</h1>
      <p>Fecha: ${new Date().toLocaleString('es-CO')}</p>
      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto entrada</th>
            <th>Entrada ($)</th>
            <th>Concepto salida</th>
            <th>Salida ($)</th>
          </tr>
        </thead>
        <tbody>
          ${rows || '<tr><td colspan="5">Sin movimientos</td></tr>'}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td class="right">Total entradas</td>
            <td class="right">${fmt.format(t.tin)}</td>
            <td class="right">Total salidas</td>
            <td class="right">${fmt.format(t.tout)}</td>
          </tr>
          <tr>
            <td></td>
            <td class="right" colspan="3">Saldo</td>
            <td class="right">${fmt.format(t.saldo)}</td>
          </tr>
        </tfoot>
      </table>
      <script>window.onload = () => setTimeout(()=>window.print(), 200);</script>
    </body>
    </html>
  `);
  win.document.close();
}

function escapeHTML(s){ return s.replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

// Init
load();
bindUI();
render();
