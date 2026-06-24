# SKILL — Reglas de diseño validadas (solimarco-frontend)

Reglas de diseño de interfaz validadas (adaptadas de `taste-skill`) para el stack real de este repo: **React 19 + TypeScript + CSS Modules**. Sin Tailwind, sin GSAP, sin Framer Motion, sin Phosphor Icons.

Estas reglas aplican a las **plantillas por sector y componentes públicos** que ve el cliente final (hero, servicios, galería, contacto, catálogo). Son criterio de diseño obligatorio salvo justificación explícita en el PR.

---

## 1. Tipografía

- Jerarquía con **peso y color**, no con tamaño bruto. Un título manda por contraste de peso (`font-weight: 600` / `font-weight: 700`) y color, no por ser enorme.
- **Sin H1 gigante genérico** (evitar el `font-size` desmedido por defecto en cada hero, p. ej. `3.75rem`/`4.5rem`+). Preferir un `clamp()` controlado.
- **Serif solo para editorial / lujo** (boutique, estética premium). Para todo lo demás (dashboards, paneles, UI funcional), sans-serif.

## 2. Layout

- **CSS Grid** sobre flex-math (no calcular anchos a mano con flex cuando Grid lo resuelve declarativo).
- En heroes usar **`min-height: 100dvh`**, nunca `height: 100vh` (evita el salto por la barra de navegador en móvil).
- Ancho de contenedor con **`max-width: 80rem` + `margin-inline: auto`** (más `padding` lateral responsive).
- **Layouts asimétricos siempre con fallback a una sola columna en móvil** (por debajo de `768px`). La asimetría es para desktop; en móvil colapsa a una columna con `grid-template-columns: 1fr`.

## 3. Componentes

- **Prohibido el patrón de 3 cards iguales horizontales.** Usar **zig-zag**, composición asimétrica o scroll alternativo.
- **Sin avatares genéricos SVG** (los círculos grises de placeholder).
- **Sin nombres de placeholder genéricos** (John Doe, Jane Smith, Acme Inc., Lorem Ipsum como contenido final).

## 4. Datos

- **Sin números perfectos falsos** (99.99%, 50%, 100%, 10.000 clientes redondo).
- Usar **datos orgánicos creíbles** (p. ej. "+340 proyectos", "4,8/5 en 212 reseñas") cuando se necesite contenido de ejemplo.

## 5. Interactividad

- **`hover` y `active` en todos los elementos clicables** (botones, links, cards interactivas). Nada clicable sin feedback visual.
- **Sin animaciones avanzadas**: no GSAP, no Framer Motion. Transiciones simples con CSS (`transition`, `transform`, `opacity`) son suficientes.

## 6. Responsive

- **Mobile-first obligatorio**: estilos base para móvil, breakpoints (`@media (min-width: 768px)`, `@media (min-width: 1024px)`) para ampliar.
- **Sin scroll horizontal** en ningún breakpoint.

## 7. Fuera del scope de este skill

Estas reglas están pensadas para **sitios públicos de marketing/contenido por sector**. NO aplican (y necesitan patrones específicos propios) a:

- Dashboards densos
- Tablas de datos complejas
- Formularios multi-paso (wizard)
- Editores de código

Para esos casos, no forzar estas reglas — usar el patrón adecuado a la densidad de información.

---

**Stack de referencia:** React 19, TypeScript, CSS Modules. Iconos: librería ligera a definir (no Phosphor). Animación: solo CSS.
