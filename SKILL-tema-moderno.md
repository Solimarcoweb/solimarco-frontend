# SKILL-tema-moderno

Tema CSS: [`src/themes/theme-moderno.css`](src/themes/theme-moderno.css) (soporta dark). Base de diseño: **[SKILL-taste.md](SKILL-taste.md)** (anti-default, asimetría, contraste alto).

Identidad: contemporáneo, contraste fuerte, grid roto a propósito, accent índigo. Sectores: agencias, tecnología, servicios profesionales jóvenes.

## Tipografía
- `--font-heading`/`--font-body` **sans system-ui**. Titulares con peso alto (700) y `letter-spacing` negativo (−0.02 a −0.03em). Contraste de peso marcado entre titular (700) y cuerpo (400).
- Escala amplia pero con `clamp()` (no display desmedido, ver SKILL.md raíz).

## Color
- `--color-primary` (#0a0a0a) para texto/titulares y superficies de máximo contraste. `--color-accent` (#4f46e5) **deliberado y escaso**: un CTA, un dato, un subrayado — no decoración repartida.
- `--color-bg-alt` para crear bandas alternas y soportar la asimetría (una columna sobre bg, otra sobre bg-alt).

## Layout
- Densidad **media** (clamp 3.5–7rem). Grid **asimétrico**: columnas desiguales (p. ej. 7/5, 8/4), un elemento que rompe la rejilla a propósito.
- Mobile-first: colapsa a una columna (regla raíz). La asimetría es solo desktop.

## Componentes
- **Hero**: contenido alineado a la izquierda, titular 700 enorme-pero-clamp, CTA sólido en `--color-primary` o `--color-accent`. Espacio negativo amplio a un lado.
- **Cards**: `--radius-md` (8px), `--shadow-md` en hover, no en reposo. Tamaños mixtos (una destacada), nunca 3 iguales.
- **Botones**: relleno sólido alto contraste; `:active` con `scale(0.97)` (ver emilkowalski).

## Prohibido
- Simetría perfecta y centrado de todo. Accent como relleno de fondos grandes. Tres cards idénticas. Bordes redondeados tipo "burbuja" (eso es fresco). Gris claro de cuerpo (sube al contraste real).
