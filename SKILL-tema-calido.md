# SKILL-tema-calido

Tema CSS: [`src/themes/theme-calido.css`](src/themes/theme-calido.css). Base de diseño: **[SKILL-taste.md](SKILL-taste.md)** (orgánico, anti-cream) + control de contraste de [SKILL-impeccable.md](SKILL-impeccable.md).

Identidad: tonos tierra, terracota y barro, formas redondeadas, cercanía. Sectores: artesanía, hostelería rural, cuidado personal, productos naturales.

## Tipografía
- `--font-heading` **serif** cálida (Iowan/Georgia); `--font-body` **sans** para legibilidad. Pesos medios. Sensación humana, no corporativa.

## Color
- Calidez por **acento + tipografía + foto**, no por un fondo crema lavado: el `--color-bg` (#faf3ea) ya es cálido y el ink es marrón profundo (#2c211a). No lo aclares más.
- `--color-primary` (#8a4b2f terracota) y `--color-accent` (#c2683a) para CTAs, iconografía y detalles. `--color-bg-alt` (#f0e3d2) para secciones acogedoras tipo "tarjeta de barro".

## Layout
- Densidad **media-cálida** (clamp 3.5–7rem). Composición relajada, alineaciones suaves, nada rígido. Formas redondeadas grandes (`--radius-lg` 22px) en bloques y fotos.

## Componentes
- **Hero**: foto cálida real (obra, producto, manos) con titular serif; CTA terracota sólido bien redondeado.
- **Cards**: `--radius-md/lg` (14–22px), `--shadow-md` suave y cálida. Pueden agruparse pero con tamaños orgánicos, no rejilla fría.
- **Botones**: relleno terracota, esquinas redondeadas, `:active` con `scale`.

## Prohibido
- Fondo casi-blanco neutro frío. Esquinas en pico (rompe la calidez). Acento azul/neón. Estética minimalista fría. Texto gris claro (mantén el marrón profundo para el contraste).
