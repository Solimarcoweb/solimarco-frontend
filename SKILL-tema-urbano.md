# SKILL-tema-urbano

Tema CSS: [`src/themes/theme-urbano.css`](src/themes/theme-urbano.css) (oscuro por identidad, sin variante clara). Base de diseño: **[SKILL-taste.md](SKILL-taste.md)** (contraste alto, anti-default) + piso de legibilidad de [SKILL-impeccable.md](SKILL-impeccable.md).

Identidad: superficie oscura, energía nocturna, accent neón. Sectores: gimnasios, tatuajes, barbería, música, streetwear, hostelería nocturna.

## Tipografía
- Sans grotesca con carácter (`--font-heading` Archivo/Helvetica). Titulares contundentes, pueden ir en **mayúsculas** con `letter-spacing` ligeramente positivo. Cuerpo sans neutro.

## Color
- Texto claro (#f4f4f5) sobre `--color-bg` (#0e0e11). `--color-accent` (#d4f23a, lima neón) es la firma: úsalo **puntual y con fuerza** (CTA, dato clave, subrayado), nunca en grandes superficies (satura y cansa).
- `--color-bg-alt` (#18181d) para elevar bloques sobre el fondo (la jerarquía es por capas oscuras, no por sombra clara).

## Layout
- Densidad **media** (clamp 3.5–7rem). Composición rotunda, bloques de borde definido (`--radius-sm` 2px en lo más duro). Contraste como herramienta principal.

## Componentes
- **Hero**: imagen oscura/duotono con overlay, titular claro grande + accent neón en una palabra clave. CTA neón sobre oscuro.
- **Cards**: fondo `--color-bg-alt`, borde sutil, `--radius-md` (6px), `--shadow-md` profunda. Hover: borde o glow del accent.
- **Botones**: relleno neón con texto oscuro (alto contraste), o outline neón. `:active` con `scale`.

## Prohibido
- Fondos claros (rompe la identidad). Accent neón como relleno masivo. Pasteles. Serif. Sombras "suaves de tema claro". Texto gris medio sobre negro (usa #f4f4f5 / `--color-text-muted` validado).
