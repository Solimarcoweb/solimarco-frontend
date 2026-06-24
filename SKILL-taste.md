# SKILL-taste — Anti-slop para plantillas públicas (adaptado de taste-skill)

Reglas adaptadas de [`leonxlnx/taste-skill`](https://github.com/leonxlnx/taste-skill) (MIT, © 2026 Leonxlnx).

**Adaptación a Solimarco:** traducidas a **CSS Modules** (sin Tailwind), **sin GSAP, sin Framer Motion, sin shadcn/ui**. Se han conservado solo las reglas aplicables a **plantillas públicas de negocios locales de Tenerife** (construcción/reformas, restaurante, boutique, estética, mascotas...). Se han descartado las partes de dashboards, design systems corporativos (Fluent/Carbon/Material) y todo lo que asuma utilities o librerías de animación.

Complementa al `SKILL.md` raíz, no lo sustituye. Ante conflicto, manda `SKILL.md`.

---

## 1. Lee el sector antes de diseñar ("Design Read")

Antes de escribir un bloque, declara en una línea qué estás construyendo:

> "Lo leo como: \<tipo de negocio> para \<público local>, con lenguaje \<vibe>, apoyado en \<familia estética>."

Ejemplos para nuestros sectores:
- *"Constructora/reformas en Tenerife para particulares y comunidades, lenguaje serio y de confianza, fotografía de obra real."*
- *"Restaurante de barrio para clientela local + turismo, lenguaje cálido y apetitoso, foto de producto grande."*
- *"Boutique/estética para público que valora el detalle, lenguaje editorial sobrio."*

El **público local elige la estética, no tu gusto**. Un negocio de reformas necesita transmitir solvencia y confianza, no "wow de agencia".

## 2. Anti-default discipline (clichés de IA prohibidos)

No recurras por defecto a:
- Gradientes morados / "AI purple".
- Hero centrado sobre mesh oscuro genérico.
- **Tres cards iguales en fila** (ya prohibido en `SKILL.md §3`; usar zig-zag o composición asimétrica).
- Glassmorphism por todas partes.
- Micro-animaciones en bucle infinito en cada sección.
- Inter + slate-900 como combo automático.

Estos son los defaults del modelo. Aléjate de ellos a propósito según el Design Read.

## 3. Trust-first para negocios locales (clave en construcción/reformas y salud)

Para sectores de **confianza** (reformas, clínicas, estética, cualquier servicio con pago o compromiso alto), baja la "varianza" visual y la intensidad de motion:
- Composición más ordenada y predecible (menos grid-breaking experimental).
- Movimiento mínimo y funcional (ver `SKILL-emilkowalski.md`).
- Datos creíbles y verificables sobre alarde visual: años de experiencia reales, proyectos reales, reseñas reales — coherente con `SKILL.md §4` (sin números perfectos falsos).

Reserva la estética "agency/experimental" (varianza alta) solo si un cliente concreto lo pide explícitamente para su marca.

## 4. Honestidad de materiales (en clave CSS Modules)

Cuando una estética no tiene "paquete oficial", se construye con **CSS nativo en módulos**, y se comenta en el código qué es inspiración prestada:
- **Bento / mosaico** (p. ej. galería de proyectos): `display: grid` con celdas de distinto tamaño. No hace falta librería.
- **Editorial / magazine** (boutique, estética): tipografía serif, grid asimétrico, whitespace generoso.
- **Frosted glass** puntual: `backdrop-filter` + bordes con capas. Siempre con fallback sólido para `prefers-reduced-transparency`.

No imites "Apple Liquid Glass" como si fuera un estándar: es aproximación con `backdrop-filter`, etiquétalo como tal en un comentario.

## 5. Una pregunta, no un interrogatorio

Si el brief de un cliente es ambiguo, haz **exactamente una** pregunta de aclaración (no un volcado de preguntas), y solo cuando el Design Read diverja de verdad. Si puedes inferirlo del sector, no preguntes: declara el Design Read y procede.

---

**Descartado de taste-skill por no aplicar aquí:** la tabla de design systems corporativos (Fluent/Carbon/Material/Polaris/Atlaskit), presets de dashboards, recomendaciones de Tailwind v4 / shadcn / GSAP, y todo lo orientado a SaaS B2B de alta densidad. Para esos casos (que en Solimar viven en el `admin-panel`, no aquí) se usa su propio criterio.
