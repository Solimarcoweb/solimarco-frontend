# SKILL-tema-minimalista

Tema CSS: [`src/themes/theme-minimalista.css`](src/themes/theme-minimalista.css) (soporta dark). Base de diseño: **[SKILL-impeccable.md](SKILL-impeccable.md)** (el espacio como material, paleta contenida).

Identidad: casi sin color, máximo espacio, casi plano. Sectores: arquitectura, despachos, marcas que venden sobriedad.

## Tipografía
- Sans system-ui. Una sola familia, jerarquía por **peso (400/600) y espacio**, nunca por color. Tamaños comedidos; el aire hace el trabajo.
- `line-height` generoso, texto a 65–70ch.

## Color
- Near-monocromo: `--color-text` / `--color-bg`. `--color-accent` (#27272a) es casi negro: úsalo como énfasis tipográfico, **no como color**. No hay color de marca vistoso aquí.
- `--color-bg-alt` (#fafafa) apenas distinto: separa secciones por espacio, no por relleno.

## Layout
- Densidad **mínima**, `--spacing-section` el más amplio (clamp 5–9rem). El whitespace es el diseño; no lo rellenes.
- Rejilla simple y alineada. Pocos elementos por sección. Test de bizco: debe quedar evidente qué importa.

## Componentes
- **Hero**: titular + una línea, mucho vacío alrededor, sin imagen de fondo o muy tenue. CTA único, discreto.
- **Cards**: evita encerrar en cajas; usa espacio y un hairline si acaso. `--radius-sm` (2–4px), `--shadow-sm` casi invisible.
- **Botones**: borde fino o relleno sólido neutro. Feedback por cambio sutil de fondo, no por sombra.

## Prohibido
- **Sombras decorativas** (`--shadow-md` prácticamente no se usa). Color de acento llamativo. Gradientes. Esquinas redondeadas marcadas. Más de un acento por pantalla. Iconos de relleno sin función.
