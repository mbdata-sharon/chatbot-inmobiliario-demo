// ============================================
// CHATBOT INMOBILIARIO · MOTOR DE INFERENCIA
// Lógica proposicional + Conjuntos + Bases num.
// ============================================

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ---------- ESTADO GLOBAL ----------
const state = {
  step: 0,
  presupuesto: null,
  credito: null,        // true / false
  contado: null,        // true / false
  p: null, q: null, r: null,
  viable: null,
  filtros: { ciudad: null, tipo: null, precioMax: null },
  resultados: [],
};

// ---------- HELPERS ----------
function fmtCOP(n) {
  return "$" + n.toLocaleString("es-CO");
}
function pad(n) { return String(n).padStart(2, "0"); }
function nowTime() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function log(tag, msg) {
  const logEl = $("#log");
  const line = document.createElement("div");
  line.className = "log-line";
  line.innerHTML = `<span class="log-time">[${nowTime()}]</span><span class="log-tag-${tag}">[${tag.toUpperCase()}]</span> ${msg}`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

// Log especial · Modus Ponens en verde con tag [INFO]
function logModusPonens() {
  const logEl = $("#log");
  const line = document.createElement("div");
  line.className = "log-line log-modus-ponens";
  line.innerHTML = `<span class="log-time">[${nowTime()}]</span>` +
    `<span class="log-tag-ok">[INFO]</span> ` +
    `<span class="log-mp-text">Ley de inferencia (Modus Ponens) ejecutada: ` +
    `Premisas válidas <span class="log-mp-arrow">→</span> Conclusión: ` +
    `<strong>Cliente Viable</strong></span>`;
  logEl.appendChild(line);
  logEl.scrollTop = logEl.scrollHeight;
}

// ---------- CHAT ----------
function addBubble(text, who = "bot", html = false) {
  const messages = $("#chat-messages");
  const bubble = document.createElement("div");
  bubble.className = `bubble bubble-${who}`;
  if (html) bubble.innerHTML = text;
  else bubble.textContent = text;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

function addSystemBubble(text) {
  const messages = $("#chat-messages");
  const b = document.createElement("div");
  b.className = "bubble bubble-system";
  b.textContent = text;
  messages.appendChild(b);
  messages.scrollTop = messages.scrollHeight;
}

function showTyping() {
  const messages = $("#chat-messages");
  const bubble = document.createElement("div");
  bubble.className = "bubble bubble-bot typing-container";
  bubble.innerHTML = `<div class="typing"><span></span><span></span><span></span></div>`;
  messages.appendChild(bubble);
  messages.scrollTop = messages.scrollHeight;
  return bubble;
}

function botSay(text, delay = 700) {
  return new Promise((resolve) => {
    const typingBubble = showTyping();
    setTimeout(() => {
      typingBubble.remove();
      addBubble(text, "bot");
      resolve();
    }, delay);
  });
}

function clearInputZone() {
  $("#chat-input-zone").innerHTML = "";
}

// ---------- INPUTS DINÁMICOS ----------
function askPresupuesto() {
  clearInputZone();
  const zone = $("#chat-input-zone");
  zone.innerHTML = `
    <input id="inp-presupuesto" class="input-numeric" type="number" placeholder="Ej: 160000000" min="0" step="1000000" />
    <button id="btn-presupuesto" class="btn-primary">Enviar</button>
  `;
  const inp = $("#inp-presupuesto");
  inp.focus();
  const submit = () => {
    const v = parseInt(inp.value, 10);
    if (!v || v < 1000000) {
      inp.style.borderColor = "#ef4444";
      return;
    }
    handlePresupuesto(v);
  };
  $("#btn-presupuesto").addEventListener("click", submit);
  inp.addEventListener("keydown", (e) => { if (e.key === "Enter") submit(); });
}

function askYesNo(question, onAnswer) {
  clearInputZone();
  const zone = $("#chat-input-zone");
  zone.innerHTML = `
    <div class="quick-buttons">
      <button class="btn-quick" data-val="yes">✓ Sí</button>
      <button class="btn-quick" data-val="no">✗ No</button>
    </div>
  `;
  zone.querySelectorAll(".btn-quick").forEach((b) => {
    b.addEventListener("click", () => onAnswer(b.dataset.val === "yes"));
  });
}

function askFiltros() {
  clearInputZone();
  const zone = $("#chat-input-zone");
  const opCiudad = CIUDADES.map((c) => `<option value="${c}">${c}</option>`).join("");
  const opTipo = TIPOS.map((t) => `<option value="${t}">${t}</option>`).join("");
  const opPrecio = RANGOS_PRECIO.map((p, i) => `<option value="${i}">${p.label}</option>`).join("");
  zone.innerHTML = `
    <div class="dropdown-row">
      <select id="sel-ciudad"><option value="">Ciudad…</option>${opCiudad}</select>
      <select id="sel-tipo"><option value="">Tipo…</option>${opTipo}</select>
      <select id="sel-precio"><option value="">Presupuesto máx…</option>${opPrecio}</select>
    </div>
    <button id="btn-filtros" class="btn-primary" disabled>Buscar inmuebles</button>
  `;
  const selects = ["#sel-ciudad", "#sel-tipo", "#sel-precio"].map((s) => $(s));
  const btn = $("#btn-filtros");
  const update = () => {
    const allFilled = selects.every((s) => s.value !== "");
    btn.disabled = !allFilled;
    // Actualizar conjuntos en vivo (vista previa de A, B, C)
    previewSets(
      selects[0].value || null,
      selects[1].value || null,
      selects[2].value !== "" ? parseInt(selects[2].value, 10) : null
    );
  };
  selects.forEach((s) => s.addEventListener("change", update));
  btn.addEventListener("click", () => {
    handleFiltros(
      selects[0].value,
      selects[1].value,
      parseInt(selects[2].value, 10)
    );
  });
}

// ---------- HANDLERS ----------
async function handlePresupuesto(valor) {
  state.presupuesto = valor;
  state.p = valor >= 150000000;
  addBubble(fmtCOP(valor), "user");
  updateProp("p", state.p, `${fmtCOP(valor)} ${state.p ? "≥" : "<"} ${fmtCOP(150000000)}`);
  log(state.p ? "ok" : "warn", `p evaluada → ${state.p ? "V" : "F"} (presupuesto ${state.p ? "≥" : "<"} 150M)`);

  await new Promise((r) => setTimeout(r, 400));
  await botSay("Perfecto. Ahora dime sobre tu financiación:");
  await botSay("¿Cuentas con crédito pre-aprobado?", 500);

  state.step = 1;
  askYesNo("crédito", handleCredito);
}

async function handleCredito(val) {
  state.credito = val;
  state.q = val;
  addBubble(val ? "Sí" : "No", "user");
  updateProp("q", state.q, val ? "Crédito pre-aprobado confirmado" : "Sin crédito pre-aprobado");
  log(val ? "ok" : "info", `q evaluada → ${val ? "V" : "F"}`);

  await new Promise((r) => setTimeout(r, 350));
  await botSay("¿Cuentas con dinero de contado?", 500);

  state.step = 2;
  askYesNo("contado", handleContado);
}

async function handleContado(val) {
  state.contado = val;
  state.r = val;
  addBubble(val ? "Sí" : "No", "user");
  updateProp("r", state.r, val ? "Tiene dinero de contado" : "Sin dinero de contado");
  log(val ? "ok" : "info", `r evaluada → ${val ? "V" : "F"}`);

  await new Promise((r) => setTimeout(r, 400));

  // Evaluar viabilidad: v = p ∧ (q ∨ r)
  state.viable = state.p && (state.q || state.r);
  await evaluateViability();
}

async function evaluateViability() {
  const { p, q, r, viable } = state;
  const pT = boolHtml(p), qT = boolHtml(q), rT = boolHtml(r);
  const qOrR = q || r;
  const qOrRT = boolHtml(qOrR);
  const vT = boolHtml(viable);
  const pAndQ = p && q, pAndR = p && r;

  // Animar formula-eval con sustituciones progresivas (forma original)
  const formula = $("#formula-eval");
  const formulaDist = $("#formula-eval-dist");
  formula.innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    ${pT}
    <span class="fx-op">∧</span>
    <span class="fx-paren">(</span>
    ${qT}
    <span class="fx-op">∨</span>
    ${rT}
    <span class="fx-paren">)</span>
  `;
  // Y la versión distributiva en paralelo
  formulaDist.innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    <span class="fx-paren">(</span>${pT}<span class="fx-op">∧</span>${qT}<span class="fx-paren">)</span>
    <span class="fx-op">∨</span>
    <span class="fx-paren">(</span>${pT}<span class="fx-op">∧</span>${rT}<span class="fx-paren">)</span>
  `;
  log("info", `sustituyendo p, q, r en v = p ∧ (q ∨ r)`);
  log("info", `aplicando Ley Distributiva: v = (p ∧ q) ∨ (p ∧ r)`);

  await new Promise((res) => setTimeout(res, 800));
  formula.innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    ${pT}
    <span class="fx-op">∧</span>
    ${qOrRT}
  `;
  formulaDist.innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    ${boolHtml(pAndQ)}
    <span class="fx-op">∨</span>
    ${boolHtml(pAndR)}
  `;
  log("info", `q ∨ r = ${qOrR ? "V" : "F"} · p∧q = ${pAndQ ? "V" : "F"} · p∧r = ${pAndR ? "V" : "F"}`);

  await new Promise((res) => setTimeout(res, 800));
  formula.innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    ${vT}
  `;
  formulaDist.innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    ${vT}
  `;
  formula.classList.add("flash");
  formulaDist.classList.add("flash");
  setTimeout(() => {
    formula.classList.remove("flash");
    formulaDist.classList.remove("flash");
  }, 1300);
  log(viable ? "ok" : "err", `v evaluada → ${viable ? "V (CLIENTE VIABLE)" : "F (NO VIABLE)"}`);
  log("ok", `equivalencia confirmada: p ∧ (q ∨ r) = (p ∧ q) ∨ (p ∧ r) = ${viable ? "V" : "F"}`);

  // [INFO] Modus Ponens · solo cuando el cliente es viable
  if (viable) {
    logModusPonens();
  }

  // Verdict
  const verdict = $("#verdict");
  const verdictValue = $("#verdict-value");
  if (viable) {
    verdict.classList.add("is-viable");
    verdict.classList.remove("is-not-viable");
    verdictValue.textContent = "✓ CLIENTE VIABLE";
  } else {
    verdict.classList.add("is-not-viable");
    verdict.classList.remove("is-viable");
    verdictValue.textContent = "✗ NO VIABLE";
  }

  await new Promise((res) => setTimeout(res, 1200));

  if (viable) {
    addSystemBubble("→ Fase 1 completada · Cliente VIP");
    await botSay("¡Excelente! Eres un cliente VIP. ¿Qué características buscas?");
    unlockPhase(2);
    state.step = 3;
    askFiltros();
  } else {
    addSystemBubble("→ Fase 1 fallida · No viable");
    await botSay("Lo siento, con la información actual no califica como cliente viable. La regla v = p ∧ (q ∨ r) no se cumple.");
    await botSay("Puedes reiniciar la simulación para probar otros valores. ⟲", 600);
  }
}

function previewSets(ciudad, tipo, precioIdx) {
  // Renderiza la fórmula de los conjuntos con los valores actuales y |A|, |B|, |C|
  const A = ciudad ? INMUEBLES.filter((i) => i.ciudad === ciudad) : [];
  const B = tipo ? INMUEBLES.filter((i) => i.tipo === tipo) : [];
  const precioMax = precioIdx !== null && precioIdx !== undefined ? RANGOS_PRECIO[precioIdx].max : null;
  const C = precioMax !== null ? INMUEBLES.filter((i) => i.precio <= precioMax) : [];

  // Actualizar parámetros en pantalla
  $("#set-A .set-param").textContent = ciudad || "?";
  $("#set-B .set-param").textContent = tipo || "?";
  $("#set-C .set-param").textContent = precioMax !== null
    ? (precioMax === Infinity ? "∞" : fmtCOP(precioMax))
    : "?";

  $("#card-A").innerHTML = ciudad ? `|A| = <strong>${A.length}</strong>` : "|A| = —";
  $("#card-B").innerHTML = tipo ? `|B| = <strong>${B.length}</strong>` : "|B| = —";
  $("#card-C").innerHTML = precioMax !== null ? `|C| = <strong>${C.length}</strong>` : "|C| = —";

  // Venn animado
  $("#venn-A").classList.toggle("active", !!ciudad);
  $("#venn-B").classList.toggle("active", !!tipo);
  $("#venn-C").classList.toggle("active", precioMax !== null);

  // Intersección (sólo si los tres están)
  const vennCount = $("#venn-intersection-count");
  if (ciudad && tipo && precioMax !== null) {
    const inter = INMUEBLES.filter((i) =>
      i.ciudad === ciudad && i.tipo === tipo && i.precio <= precioMax
    );
    vennCount.textContent = inter.length;
    vennCount.classList.add("lit");
    $("#intersection-result").outerHTML = `<span class="${inter.length > 0 ? 'fx-true' : 'fx-false'}" id="intersection-result">${inter.length} inmueble${inter.length === 1 ? '' : 's'}</span>`;
  } else {
    vennCount.textContent = "∅";
    vennCount.classList.remove("lit");
    $("#intersection-result").outerHTML = `<span class="fx-pending" id="intersection-result">∅</span>`;
  }
}

async function handleFiltros(ciudad, tipo, precioIdx) {
  state.filtros = {
    ciudad,
    tipo,
    precioMax: RANGOS_PRECIO[precioIdx].max,
  };
  const precioLabel = RANGOS_PRECIO[precioIdx].label;

  addBubble(`${ciudad} · ${tipo} · ${precioLabel}`, "user");
  log("info", `filtros aplicados: ciudad=${ciudad}, tipo=${tipo}, precio=${precioLabel}`);

  // Calcular intersección final A ∩ B ∩ C
  const A = INMUEBLES.filter((i) => i.ciudad === ciudad);
  const B = INMUEBLES.filter((i) => i.tipo === tipo);
  const C = INMUEBLES.filter((i) => i.precio <= state.filtros.precioMax);
  const R = INMUEBLES.filter((i) =>
    i.ciudad === ciudad && i.tipo === tipo && i.precio <= state.filtros.precioMax
  );
  state.resultados = R;

  log("ok", `|A|=${A.length}, |B|=${B.length}, |C|=${C.length}, |A∩B∩C|=${R.length}`);

  // Actualizar formula intersección y Venn cuenta
  $("#intersection-formula").classList.add("flash");
  setTimeout(() => $("#intersection-formula").classList.remove("flash"), 1300);

  await new Promise((res) => setTimeout(res, 500));

  if (R.length === 0) {
    await botSay("Búsqueda completada. Pero no encontré inmuebles que cumplan los tres criterios. Prueba a relajar el filtro de precio o reinicia.");
    addSystemBubble("→ Fase 2 · |A ∩ B ∩ C| = 0");
    unlockPhase(3);
    fillBasesTable(R);
    return;
  }

  await botSay(`Encontré ${R.length} inmueble${R.length === 1 ? '' : 's'} que cumple${R.length === 1 ? '' : 'n'} con todos tus criterios:`);

  // Renderizar tarjetas en el chat
  clearInputZone();
  const zone = $("#chat-input-zone");
  zone.innerHTML = `<div class="results-carousel" id="results-carousel"></div>`;
  const carousel = $("#results-carousel");
  R.forEach((inm) => {
    const card = document.createElement("div");
    card.className = "result-card";
    card.innerHTML = `
      <img src="${inm.img}" alt="${inm.tipo} en ${inm.ciudad}" onerror="this.style.background='#3b82f6';this.removeAttribute('src');" />
      <div class="result-card-body">
        <div class="result-card-price">${fmtCOP(inm.precio)}</div>
        <div class="result-card-loc">${inm.tipo} · ${inm.ciudad}</div>
        <div class="result-card-loc">${inm.habitaciones} hab · ${inm.area} m²</div>
        <span class="result-card-id">ID #${inm.id}</span>
      </div>
    `;
    carousel.appendChild(card);
  });

  addSystemBubble(`→ Fase 2 completada · |R| = ${R.length}`);

  // Desbloquear Fase 3
  unlockPhase(3);
  await new Promise((res) => setTimeout(res, 600));
  fillBasesTable(R);
}

function fillBasesTable(R) {
  const total = R.length;

  // Totales en DEC / BIN / HEX (con pulso visual)
  const totalDec = total.toString(10);
  const totalBin = total.toString(2);
  const totalHex = "0x" + total.toString(16).toUpperCase();

  $("#total-dec").textContent = totalDec;
  $("#total-bin").textContent = totalBin;
  $("#total-hex").textContent = totalHex;

  // Disparar pulse animation sobre los 3 count-cards
  document.querySelectorAll(".count-card").forEach((c) => {
    c.classList.remove("pulse");
    void c.offsetWidth; // forzar reflow para reiniciar animación
    c.classList.add("pulse");
  });

  // Tabla dinámica · cada fila con animation-delay escalonado
  const tbody = $("#bases-tbody");
  tbody.innerHTML = "";
  R.forEach((inm, idx) => {
    const tr = document.createElement("tr");
    tr.style.animationDelay = `${idx * 0.04}s`;
    tr.innerHTML = `
      <td>${inm.id}</td>
      <td>${inm.id.toString(2).padStart(5, "0")}</td>
      <td>0x${inm.id.toString(16).toUpperCase().padStart(2, "0")}</td>
    `;
    tbody.appendChild(tr);
  });

  log("ok", `tabla bases generada · total=${totalDec} (bin=${totalBin}, hex=${totalHex})`);
  log("info", `conversiones DEC→BIN→HEX completadas para ${R.length} ID${R.length === 1 ? '' : 's'}`);
}

// ---------- UI HELPERS ----------
function boolHtml(b) {
  return b ? `<span class="fx-true">V</span>` : `<span class="fx-false">F</span>`;
}

function updateProp(name, val, desc) {
  const el = $(`#prop-${name}`);
  el.classList.remove("is-true", "is-false");
  el.classList.add(val ? "is-true" : "is-false");
  el.querySelector(".prop-val").textContent = val ? "V" : "F";
  if (desc) el.querySelector(".prop-desc").textContent = desc;
}

function unlockPhase(num) {
  $(`#phase-${num}`).classList.remove("phase-locked");
  log("ok", `fase ${num} desbloqueada`);
}

function lockAllPhases() {
  $("#phase-2").classList.add("phase-locked");
  $("#phase-3").classList.add("phase-locked");
}

function resetUI() {
  // Reset panel matemático
  ["p","q","r"].forEach((v) => {
    const el = $(`#prop-${v}`);
    el.classList.remove("is-true","is-false");
    el.querySelector(".prop-val").textContent = "?";
  });
  $("#prop-p .prop-desc").textContent = "Presupuesto ≥ $150.000.000";
  $("#prop-q .prop-desc").textContent = "Tiene crédito pre-aprobado";
  $("#prop-r .prop-desc").textContent = "Tiene dinero de contado";

  $("#formula-eval").innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    <span class="fx-pending">esperando datos…</span>
  `;
  $("#formula-eval-dist").innerHTML = `
    <span class="fx-var">v</span>
    <span class="fx-op">=</span>
    <span class="fx-pending">esperando datos…</span>
  `;
  const verdict = $("#verdict");
  verdict.classList.remove("is-viable","is-not-viable");
  $("#verdict-value").textContent = "—";

  // Reset conjuntos
  $("#set-A .set-param").textContent = "?";
  $("#set-B .set-param").textContent = "?";
  $("#set-C .set-param").textContent = "?";
  $("#card-A").textContent = "|A| = —";
  $("#card-B").textContent = "|B| = —";
  $("#card-C").textContent = "|C| = —";
  $("#venn-A").classList.remove("active");
  $("#venn-B").classList.remove("active");
  $("#venn-C").classList.remove("active");
  $("#venn-intersection-count").textContent = "∅";
  $("#venn-intersection-count").classList.remove("lit");
  $("#intersection-result").outerHTML = `<span class="fx-pending" id="intersection-result">∅</span>`;

  // Reset bases
  $("#total-dec").textContent = "—";
  $("#total-bin").textContent = "—";
  $("#total-hex").textContent = "—";
  $("#bases-tbody").innerHTML = `<tr><td colspan="3" class="td-empty">— sin datos —</td></tr>`;
  $("#log").innerHTML = "";

  lockAllPhases();

  // Reset chat
  $("#chat-messages").innerHTML = "";
  clearInputZone();

  // Reset state
  Object.assign(state, {
    step: 0, presupuesto: null, credito: null, contado: null,
    p: null, q: null, r: null, viable: null,
    filtros: { ciudad: null, tipo: null, precioMax: null },
    resultados: [],
  });
}

// ---------- BOOT ----------
async function start() {
  resetUI();
  log("info", "iniciando motor de inferencia…");
  log("info", `universo U cargado · |U| = ${INMUEBLES.length}`);

  await new Promise((r) => setTimeout(r, 400));
  await botSay("Bienvenido a InmobiliaryAI. ¿Cuál es su presupuesto en pesos?");
  askPresupuesto();
}

$("#btn-reset").addEventListener("click", () => {
  log("warn", "simulación reiniciada por el usuario");
  start();
});

// ---------- MODAL · Algoritmo (Flujo) ----------
function openFlowModal() {
  const m = $("#flow-modal");
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  log("info", "modal de diagrama de flujo abierto");
}
function closeFlowModal() {
  const m = $("#flow-modal");
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

$("#btn-flowchart").addEventListener("click", openFlowModal);
document.querySelectorAll("[data-close-modal]").forEach((el) => {
  el.addEventListener("click", closeFlowModal);
});

// Click sobre la imagen del diagrama → modo lightbox (pantalla completa)
const flowchartFrame = document.querySelector(".flowchart-frame");
if (flowchartFrame) {
  flowchartFrame.addEventListener("click", () => {
    flowchartFrame.classList.toggle("lightbox");
  });
}

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  // Prioridad: cerrar lightbox antes que cerrar modal
  const fc = document.querySelector(".flowchart-frame");
  if (fc && fc.classList.contains("lightbox")) {
    fc.classList.remove("lightbox");
    return;
  }
  if ($("#flow-modal").classList.contains("open")) {
    closeFlowModal();
  }
});

document.addEventListener("DOMContentLoaded", start);
