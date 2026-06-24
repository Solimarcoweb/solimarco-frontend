# SKILL-tema-mediterraneo

Tema CSS: [`src/themes/theme-mediterraneo.css`](src/themes/theme-mediterraneo.css) (soporta dark). Base de diseño: **[SKILL-taste.md](SKILL-taste.md)** (Design Read por sector local) + contraste/color de [SKILL-impeccable.md](SKILL-impeccable.md).

Identidad: azules de mar, blancos, luz natural canaria (Tenerife). Sectores: turismo, hostelería costera, inmobiliaria, ocio, servicios isleños.

## Tipografía
- Sans aireada y luminosa (`--font-heading` Avenir Next/system). Titulares limpios de peso medio-alto; cuerpo sans claro. Sensación de luz y amplitud, sin densidad.

## Color
- `--color-primary` (#1c7fb8 azul mar) como color de marca dominante; `--color-secondary` (#4ba3c7) para apoyos; `--color-accent` (#e0922f ocre sol) **puntual y cálido** (CTA, sol, detalle de arena) que contrasta con el azul.
- Ink azul profundo (#0d2b3e) sobre `--color-bg` (#f4fbff cielo). `--color-bg-alt` (#e2f2fb) para bandas tipo "mar suave".

## Layout
- Densidad **baja-media** (clamp 3.5–7rem), mucha luz y espacio. Composición abierta, horizontes amplios, fotos de mar/cielo/luz natural a gran tamaño.

## Componentes
- **Hero**: foto de costa/luz natural full-bleed con titular claro; CTA en azul mar o, para destacar, en ocre sol. Sensación de amplitud.
- **Cards**: `--radius-md/lg` (12–18px), `--shadow-md` con tinte azul (ya definida). Aireadas, nada apretadas.
- **Botones**: relleno azul mar sólido; el ocre sol reservado para la acción más importante. `:active` con `scale`.

## Prohibido
- Paleta oscura o apagada de día. Acento ocre como relleno masivo (es el "sol", no la pared). Densidad alta tipo cockpit. Estética urbana/nocturna. Texto azul medio de bajo contraste (usa el ink profundo).
