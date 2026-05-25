# Chatbot Inmobiliario · Motor de Inferencia Lógica

> Proyecto académico que aplica **Lógica Proposicional**, **Teoría de Conjuntos** y **Representación Numérica** (Decimal · Binario · Hexadecimal) en un chatbot inmobiliario interactivo.

## 🎯 Objetivo

Construir una SPA (Single Page Application) que simule la atención de un chatbot inmobiliario (**InmobiliaryAI**), donde cada interacción del usuario activa en vivo el **motor de inferencia matemático** del lado derecho del dashboard. La idea es visualizar de forma didáctica las 3 fases del razonamiento lógico-matemático sobre datos reales (un universo de 30 inmuebles).

## 🧠 Conceptos matemáticos aplicados

### Fase 01 · Lógica Proposicional
- Proposiciones `p`, `q`, `r` con valores `V` / `F`
- Fórmula de viabilidad: **`v = p ∧ (q ∨ r)`**
- **Ley Distributiva** del Álgebra Booleana: `p ∧ (q ∨ r) ≡ (p ∧ q) ∨ (p ∧ r)` (ambas formas se evalúan en paralelo y se demuestra su equivalencia)
- **Modus Ponens**: cuando las premisas son válidas, se imprime en el log la regla de inferencia ejecutada

### Fase 02 · Teoría de Conjuntos
- Universo `U = { i₁, i₂, ..., i₃₀ }` con `|U| = 30`
- Subconjuntos:
  - `A = { i ∈ U : ciudad(i) = ciudad_elegida }`
  - `B = { i ∈ U : tipo(i)   = tipo_elegido   }`
  - `C = { i ∈ U : precio(i) ≤ precio_máximo }`
- Operación **intersección** `R = A ∩ B ∩ C` visualizada con **Diagrama de Venn SVG** animado

### Fase 03 · Representación Numérica
- Conversión de cada ID decimal a **binario** (`.toString(2)`) y **hexadecimal** (`.toString(16).toUpperCase()`)
- Cantidad total mostrada en las 3 bases simultáneamente

## 🏗️ Stack técnico

- HTML5 + CSS3 (Tailwind CDN para utilities) + JavaScript Vanilla
- SVG inline para el Diagrama de Venn (3 círculos translúcidos con `mix-blend-mode: screen` para que las intersecciones brillen)
- Sin build, sin npm, sin servidor backend — abre `index.html` y funciona
- Fuentes: `Inter` para UI · `JetBrains Mono` para el panel matemático

## 🚀 Ejecución

```bash
# Opción 1: doble clic en index.html

# Opción 2: servidor local (recomendado, evita problemas con file://)
python3 -m http.server 8000
# → abrir http://localhost:8000
```

## 📂 Estructura

```
chatbot-inmobiliario-demo/
├── index.html              # Estructura del dashboard (chat 60% · panel 40%)
├── styles.css              # Estilos custom + Tailwind utilities
├── app.js                  # FSM del chat, evaluación lógica, conversiones
├── data.js                 # JSON de los 30 inmuebles (universo U)
├── diagrama-flujo.png      # Diagrama de flujo del algoritmo (modal)
└── README.md
```

## 🧪 Caso de prueba para validar |A ∩ B ∩ C| = 18

1. Presupuesto: **`160000000`** → `p = V`
2. ¿Crédito pre-aprobado?: **Sí** → `q = V`
3. ¿Dinero de contado?: **No** → `r = F`
4. `v = V ∧ (V ∨ F) = V` → **CLIENTE VIABLE**
5. Filtros: **Bogotá** · **Apartamento** · **Hasta 250M**
6. Resultado esperado: **18 inmuebles** (IDs 1–18) en DEC, BIN `10010`, HEX `0x12`

## 📋 Algoritmo (pseudocódigo IF/THEN)

Disponible en el modal del dashboard (botón **📋 Ver Algoritmo (Flujo)** en el topbar) junto con el diagrama de flujo visual.

## 👥 Autores

- Sharon Leon ([@mbdata-sharon](https://github.com/mbdata-sharon))
- Brandow Bruslyx Domínguez ([@BrandowBruslyXD](https://github.com/BrandowBruslyXD))
