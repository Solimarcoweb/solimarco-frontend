# SKILL-tema-fresco

Tema CSS: [`src/themes/theme-fresco.css`](src/themes/theme-fresco.css) (soporta dark). Base de diseño: **[SKILL-taste.md](SKILL-taste.md)** (juvenil, anti-default) + motion de [SKILL-emilkowalski.md](SKILL-emilkowalski.md).

Identidad: vivo, joven, alegre, muy redondeado. Sectores: heladerías, mascotas, fitness, marcas D2C jóvenes, eventos.

## Tipografía
- Sans redondeada amable (`--font-heading` Nunito). Titulares con peso (700) pero forma suave. Cuerpo sans legible. Tono cercano.

## Color
- Paleta de **3 roles vivos**: `--color-primary` (#0f9d6b esmeralda), `--color-secondary` (#f59e0b ámbar), `--color-accent` (#ec4899 rosa). Úsalos con intención (cada uno un rol), no todos a la vez en un mismo bloque.
- Ink verde profundo (#0f2a20) sobre `--color-bg` menta. `--color-bg-alt` para secciones tipo "bloque de color" alegre.

## Layout
- Densidad **media-baja** (clamp 3–6rem), ritmo dinámico. Bloques muy redondeados (`--radius-lg` 28px), burbujas, formas amables.

## Componentes
- **Hero**: color de marca protagonista o ilustración alegre, titular redondeado, CTA grande muy redondeado en `--color-primary` o `--color-accent`.
- **Cards**: `--radius-lg` (18–28px), `--shadow-md` con tinte de color (ya definida con tinte esmeralda). Hover con micro-movimiento (≤200ms, ease-out).
- **Botones**: pill (radius grande), relleno vivo, `:active` con `scale(0.97)`. Motion presente pero sutil (base emilkowalski: <300ms).

## Prohibido
- Paleta apagada o monocroma. Esquinas en pico. Estética seria/corporativa. Usar los 3 colores vivos amontonados en el mismo elemento. Motion exagerado o en bucle (sigue el piso de duración de emilkowalski).
