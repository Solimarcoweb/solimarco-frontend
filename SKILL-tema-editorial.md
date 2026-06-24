# SKILL-tema-editorial

Tema CSS: [`src/themes/theme-editorial.css`](src/themes/theme-editorial.css). Base de diseño: **[SKILL-emilkowalski.md](SKILL-emilkowalski.md)** (craft, detalle silencioso) + registro editorial de [SKILL-taste.md](SKILL-taste.md).

Identidad: papel, serif, mucho aire. Sectores: boutique, estética premium, estudios, restaurante de autor.

## Tipografía
- `--font-heading` y `--font-body` son **serif** (Iowan/Palatino/Georgia). Cuerpo también serif: es editorial, no UI.
- Jerarquía por **tamaño + interletraje**, no por peso pesado. Titulares 400–500, nunca 700+. Display con `letter-spacing` ligeramente negativo (−0.01 a −0.02em).
- Texto largo a `max-width: 68ch`, `line-height: 1.6–1.75`.

## Color
- Casi monocromo: `--color-text` sobre `--color-bg` (papel). `--color-accent` (#9a5233, terracota apagada) **solo** en enlaces, hairlines y algún dato destacado — nunca en bloques grandes.
- `--color-bg-alt` para separar secciones con un cambio tonal apenas perceptible, no para "cajas".

## Layout
- Densidad **baja**, `--spacing-section` es el más amplio del set (clamp 4–8rem). No lo reduzcas.
- Composición de revista: una columna de lectura centrada o grid asimétrico con margen ancho. Reglas finas (`1px solid var(--color-border-equivalente)` → usa `--color-secondary` a baja opacidad) como separador.

## Componentes
- **Hero**: titular serif grande + subtítulo, sin botón gigante; CTA discreto tipo enlace subrayado. Sin imagen full-bleed con overlay oscuro (eso es de otros temas).
- **Cards**: evítalas; usa listas con hairline divider. Si hace falta card, `--radius-sm/md` (2–4px) y `--shadow-sm`.
- **Botones**: borde fino o texto subrayado; relleno sólido solo en la acción primaria real.

## Prohibido
- Sans-serif en titulares. Pesos 700+. Acento en grandes superficies. Sombras pronunciadas (`--shadow-md` casi no se usa). Esquinas muy redondeadas. Animaciones llamativas (motion mínimo, ver base emilkowalski).
