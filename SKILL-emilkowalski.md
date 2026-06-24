# SKILL-emilkowalski — Animación y craft en CSS (adaptado de emilkowalski/skills)

Reglas adaptadas de [`emilkowalski/skills`](https://github.com/emilkowalski/skills) (MIT, © 2026), que codifican la filosofía de design engineering de Emil Kowalski (autor de Sonner y Vaul).

**Adaptación a Solimarco:** el repo original es 100% texto (sin código ejecutable). Sus estándares de animación son casi todos **CSS puro y directamente usables**. Se han traducido los pocos ejemplos en Framer Motion a **CSS / Web Animations API**, y se han mantenido solo las reglas útiles para **plantillas públicas de negocios locales**. **Sin Framer Motion, sin GSAP** — solo CSS y, si hace falta algo imperativo, `element.animate()` nativo.

Complementa al `SKILL.md` raíz. Ante conflicto, manda `SKILL.md`.

---

## 1. Filosofía: los detalles invisibles se suman

El objetivo no es "que funcione", es que **se sienta bien sin que el usuario sepa por qué**. En webs de negocio local esto es diferenciación real: una reforma o un restaurante compiten también por percepción de calidad. Cada transición correcta, cada `:active` con feedback, suma confianza.

El buen gusto **se entrena**: estudia por qué las mejores interfaces se sienten así, no copies el efecto por copiarlo.

## 2. ¿Debe animarse? (regla de frecuencia)

Cuanto más **frecuente** es una acción, más **sutil y rápida** debe ser su animación (o ninguna). Una animación vistosa que el usuario ve 50 veces se vuelve molesta. Anima lo que aporta información o feedback; no animes por poder hacerlo.

## 3. Easing

- **Nunca `ease-in` en UI.** Empieza lento y retrasa justo el momento que el usuario está mirando. `ease-out` a 200ms se *siente* más rápido que `ease-in` a 200ms.
- Entrar / salir → **`ease-out`**.
- Moverse / transformarse en pantalla → **`ease-in-out`**.
- Hover / cambio de color → **`ease`**.
- Por defecto → **`ease-out`**.

Curvas concretas reutilizables (definir como tokens en `src/index.css`):

```css
:root {
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);     /* ease-out fuerte para UI */
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1); /* movimiento en pantalla */
  --ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);  /* curva tipo drawer iOS */
}
```

## 4. Duración

- **Regla de oro: las animaciones de UI por debajo de 300ms.** Un dropdown de 180ms se siente más responsive que uno de 400ms.

| Elemento | Duración |
|---|---|
| Feedback de pulsación (botón) | 100–160ms |
| Tooltips, popovers pequeños | 125–200ms |
| Dropdowns, selects | 150–250ms |
| Modales, drawers | 200–500ms |

## 5. Feedback físico

- **Pulsación**: `transform: scale(0.97)` en `:active` con `transition: transform 160ms var(--ease-out)`. Sutil (0.95–0.98). Aplica a cualquier elemento pulsable (botones de "Añadir al carrito", CTA del hero, enlaces del footer).

```css
.button {
  transition: transform 160ms var(--ease-out);
}
.button:active {
  transform: scale(0.97);
}
```

## 6. Stagger (entradas escalonadas)

Escalona la entrada de los ítems de una lista (catálogo, galería de proyectos): **30–80ms entre ítems**. Más lento se siente pesado. El stagger es **decorativo**: nunca bloquees la interacción mientras corre.

```css
.item {
  opacity: 0;
  transform: translateY(8px);
  animation: fadeIn 300ms var(--ease-out) forwards;
}
.item:nth-child(2) { animation-delay: 50ms; }
.item:nth-child(3) { animation-delay: 100ms; }

@keyframes fadeIn {
  to { opacity: 1; transform: none; }
}
```

⚠️ El revelado debe partir de contenido **visible por defecto** (ver `SKILL-impeccable.md §4`): si gateas la visibilidad a la animación y esta no dispara, la sección se queda en blanco.

## 7. Rendimiento

- **No conduzcas transforms de los hijos vía una variable CSS en el padre**: recalcula estilos de todos los hijos. Pon el `transform` directamente en cada elemento.
- Anima solo `transform` y `opacity` (no propiedades de layout).
- Para crossfades imperfectos (dos estados que se solapan pese a ajustar easing/duración): añade un `filter: blur(2px)` sutil durante la transición para fundirlos. Mantén el blur **< 20px** (mucho blur es caro, sobre todo en Safari).

## 8. Timing asimétrico

Abrir y cerrar no tienen por qué durar igual. Patrón habitual: **apertura algo más lenta y deliberada, cierre rápido** (el usuario ya decidió). Ej.: overlay que entra en 240ms y sale en 160ms.

## 9. Accesibilidad (innegociable)

Toda animación necesita su alternativa en `@media (prefers-reduced-motion: reduce)` — típicamente crossfade o transición instantánea:

```css
@media (prefers-reduced-motion: reduce) {
  .item { animation: none; opacity: 1; transform: none; }
  .button { transition: none; }
}
```

---

**Descartado de emilkowalski por no aplicar aquí:** los ejemplos en Framer Motion (`{ type: "spring", bounce: 0.2 }`) y springs basados en física para gestos con momentum / drag interrumpible — son para UI de app (drawers arrastrables, "Dynamic Island"), no para plantillas de marketing. Si algún día un componente necesita un spring real, se valora `element.animate()` nativo antes que añadir una librería. La invitación comercial al curso de animations.dev del README original también se omite.
