# SKILL-impeccable — Reglas CSS de craft (adaptado de impeccable)

Reglas adaptadas de [`pbakaus/impeccable`](https://github.com/pbakaus/impeccable) (Apache-2.0, © Paul Bakaus).

**Adaptación a Solimarco:** se ha extraído **solo el texto de reglas de diseño** de sus `reference/*.md` y `SKILL.src.md`, traducido a **CSS Modules**. **No se adopta nada de su tooling ejecutable** (CLI `impeccable`, scripts `.mjs`, servidor de live-preview, extensión de navegador, hooks de edición): para nuestro caso introduciría dependencias y superficie innecesaria. **Sin Tailwind, sin GSAP/motion libraries.**

Complementa al `SKILL.md` raíz. Ante conflicto, manda `SKILL.md`.

---

## 1. Color y contraste (lo más importante para legibilidad)

- **Verifica contraste siempre.** Texto de cuerpo ≥ **4.5:1** contra su fondo; texto grande (≥18px, o bold ≥14px) ≥ **3:1**. El `placeholder` también necesita 4.5:1.
- El fallo más común de las webs "hechas por IA": **gris claro de cuerpo sobre un casi-blanco tintado**. Si el contraste está cerca del límite, oscurece el texto hacia el extremo "ink". El gris claro "por elegancia" es la razón nº1 de que una web se lea mal.
- **Gris sobre fondo de color se ve lavado.** Usa un tono más oscuro del **propio matiz del fondo**, o una transparencia del color de texto.
- Evita el **beige/crema/arena por defecto** como fondo de página (el "tell" de IA de 2026: tokens tipo `--cream`, `--sand`, `--linen`). Si el negocio pide "cálido", lleva la calidez en el **acento, la tipografía y la fotografía**, no en un fondo casi-blanco tintado. Para un sector como reformas, un off-white neutro real o el color de marca como protagonista funcionan mejor.
- Nunca negro puro (`#000`) ni blanco puro (`#fff`) como texto/fondo grandes: usa neutros ligeramente tintados (en `src/index.css` ya tenemos tokens `--text-h`, `--text`, `--bg`, `--border`).

## 2. Tipografía

- **Longitud de línea 65–75ch** en texto largo (legal, "sobre nosotros", descripciones). En CSS Modules: `max-width: 70ch` (o `42rem`). Ya aplicado en `LegalPageView`.
- **Techo de display ≤ 6rem (~96px)** en titulares. Por encima la página "grita". Preferir `clamp()` controlado (ya en `SKILL.md §1` y en `Hero`).
- **`letter-spacing` floor: ≥ −0.04em** en titulares display. Más apretado y las letras se tocan: parece error, no diseño.
- **No emparejes fuentes parecidas pero distintas** (dos sans geométricas). Empareja por contraste (serif + sans) o usa **una sola familia en varios pesos** (lo que ya hace `src/index.css`).
- `text-wrap: balance` en h1–h3 (líneas equilibradas) y `text-wrap: pretty` en prosa larga (menos huérfanas). Ambas son CSS nativo, sin coste.

## 3. Layout

- **Flexbox para 1D, Grid para 2D.** No uses Grid por defecto si un `flex-wrap` resuelve. (Matiz sobre `SKILL.md §2`, que prioriza Grid: usa Grid cuando hay dos ejes reales; para una fila simple, flex.)
- **Grids responsive sin breakpoints**: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`. Ideal para catálogo de productos y galería de proyectos.
- **Escala de z-index semántica**, nunca valores arbitrarios (`999`, `9999`). Define una rampa: `dropdown → sticky → modal-backdrop → modal → toast → tooltip`. Recomendado como tokens en `src/index.css` si aparece un overlay.
- **Ritmo de espaciado**: agrupa lo relacionado con poco espacio y separa grupos con espacio generoso. Evita el espaciado uniforme (= sin jerarquía). Usa una escala consistente en `rem`.
- **"Las cards son la respuesta perezosa."** Úsalas solo cuando son de verdad la mejor opción. **Cards anidadas siempre están mal.** Encaja con `SKILL.md §3` (no 3 cards iguales).
- **Test de bizco**: desenfoca la vista mentalmente; si no distingues el elemento más importante y los grupos, la jerarquía falla.

## 4. Motion (solo CSS, ver también SKILL-emilkowalski.md)

- **`@media (prefers-reduced-motion: reduce)` no es opcional**: toda animación necesita alternativa (crossfade o transición instantánea).
- **No animes propiedades de layout** (width, height, top/left, margin) salvo necesidad real: provocan reflow. Anima `transform` y `opacity`.
- **Ease-out exponencial** al entrar/salir; sin bounce ni elastic en UI de negocio.
- Las animaciones de revelado deben **mejorar un contenido ya visible por defecto**: nunca ocultes contenido a la espera de una clase/transición (si no se dispara —pestaña en segundo plano, render headless— la sección se queda en blanco). Crítico para SEO y robustez.

> Nota: impeccable recomienda librerías (motion, GSAP) para motion avanzado. **Aquí no**: nuestra decisión es solo CSS. Para necesidades de animación, ver `SKILL-emilkowalski.md`.

## 5. Interacción

- Un dropdown con `position: absolute` dentro de un contenedor con `overflow: hidden`/`auto` **se recorta**. Usa `<dialog>` / Popover API nativo, `position: fixed`, o un portal para escapar del stacking context. (Coherente con `CLAUDE.md`: primitivos complejos de accesibilidad con Radix headless + CSS Modules.)
- Nada clicable sin feedback (`:hover`, `:active`, `:focus-visible`) — ya en `SKILL.md §5`.
- **No animes `<img>` en hover** (escalar/rotar la imagen al pasar por encima de su card). No aporta información y es un "tell". Si una card necesita feedback, anima su **fondo, borde o sombra**, no la imagen.

---

**Descartado de impeccable por no aplicar / contradecir nuestra decisión:** toda la CLI y scripts ejecutables, el flujo de `context.mjs`/`palette.mjs`, los registros "brand vs product" pensados para su tooling, OKLCH obligatorio vía script (podemos usar OKLCH a mano si conviene, pero sin su generador), y las recomendaciones de librerías de animación.
