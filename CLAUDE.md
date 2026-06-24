# Plan general — Plataforma Solimar&Co.

## Preferencia de comunicación

Modo caveman activo para explicaciones técnicas: respuestas comprimidas (sin artículos, sin relleno, sin cortesías), pero manteniendo el código siempre completo y normal, y sin comprimir nunca avisos de seguridad, acciones irreversibles, credenciales/secrets, ni nada relacionado con pagos — eso siempre en prosa completa y explicada, sin excepción.

## Reglas de código — siempre aplicar, sin excepción

**Idioma del código — regla general, aplica a todo lo siguiente:**
Nombres de paquetes/carpetas, clases, métodos, variables, archivos y rutas de la API **siempre en inglés** (ej. `ReservationService`, `solimarco-backend/src/.../reservation/`, `/api/reservations`), igual que los comentarios y JavaDoc/JSDoc. El español queda solo para: contenido de negocio real (textos que ve el usuario final, contenido de `PlantillaSector`, mensajes de notificaciones al cliente) y para la conversación con el desarrollador en este chat/sesiones de Claude Code. Si en algún punto de este documento aparece un nombre de carpeta o módulo en español (por herencia de cómo se fue diseñando la conversación), al programarlo se traduce al inglés siguiendo esta regla — el documento es la idea, el código sigue siempre esta convención.

**Backend (Java/Spring Boot):**
- JavaDoc en toda clase pública y todo método público: qué hace, `@param`, `@return`, `@throws` si aplica. Métodos privados solo si la lógica no es obvia a simple vista.
- **Todos los comentarios y JavaDoc en inglés**, claros y directos — código y documentación técnica en inglés, conversación con el desarrollador (tú) en español.
- Cada clase con responsabilidad única — si una clase empieza a hacer demasiadas cosas distintas, se divide.
- Nombres descriptivos siempre, nunca abreviaturas crípticas (`ReservationService`, no `RsvSrv`).
- Excepciones propias y descriptivas por dominio (`ReservationNotFoundException`), nunca `Exception` genérica.
- Tests unitarios para la lógica de negocio en `service/`, especialmente en `payments/` y `reservations/`.

**Frontend (React/TypeScript):**
- Comentario JSDoc en componentes compartidos (`shared/`) y en hooks personalizados: qué hace, props/parámetros, qué devuelve.
- **Comentarios y JSDoc en inglés**, mismo criterio que en backend.
- Componentes, hooks, archivos y carpetas con nombres en inglés (`ReservationForm.tsx`, `useReservations.ts`).
- Componentes pequeños y enfocados — si un componente supera ~150-200 líneas o mezcla demasiadas responsabilidades, se divide en subcomponentes.
- Tipado estricto en TypeScript, nunca `any` salvo justificación explícita en comentario.
- Lógica de negocio fuera del componente visual cuando sea posible (hooks personalizados en `modules/x/shared/`, ver estructura interna de módulo más abajo), componente se queda solo con presentación.

**General:**
- Comentarios explican el "por qué", no el "qué" (el código ya dice qué hace; el comentario aporta contexto, decisión de diseño o advertencia).
- Nunca código grande "de una pieza" — siempre dividido en piezas pequeñas, testeables y con nombre claro.
- Seguir siempre la estructura de carpetas y capas ya definida en este documento, sin mezclar responsabilidades entre capas.

## Documentación en Confluence — obligatoria para cada pieza nueva

Cada endpoint nuevo, cada módulo nuevo y cada decisión de arquitectura se documenta en Confluence, no solo en el código, a la vez que se construye la pieza (no al final del proyecto). Estructura por niveles: Arquitectura general → Backend (un nodo por módulo, con sus endpoints como subpáginas) → Frontend (web-frontend / admin-panel) → Sectores y plantillas. Cada endpoint sigue una plantilla mínima: método + ruta, descripción, request/response de ejemplo, errores y clase Java donde vive. Árbol completo y plantilla detallada en [docs/confluence-structure.md](docs/confluence-structure.md).

## Estructura del repositorio — repos separados (no monorepo)

Decisión: repos independientes por proyecto, para facilitar control de acceso granular si en el futuro se incorpora más gente, y versionado independiente real de cada pieza.

```
solimarco-backend/      → Spring Boot, deploy en servidor propio / Railway / Render + Jenkins
solimarco-frontend/    → web pública que ve el cliente final (React + Vite), deploy Vercel
solimarco-panel/        → panel interno, el "creador de webs" paso a paso (React + Vite), deploy Vercel
```

**Nota de nomenclatura:** en el resto de este documento, "`web-frontend`" se refiere al repo `solimarco-frontend`, y "`admin-panel`" se refiere al repo `solimarco-panel`.

## Regla de cambio sincronizado backend ↔ frontend (obligatoria, sin excepción)

Cualquier cambio en el backend que afecte al **contrato de la API** (un endpoint nuevo, un campo añadido/renombrado/eliminado en un DTO, un cambio en el formato de una respuesta, un nuevo código de error) **se acompaña siempre, en la misma sesión de trabajo, del cambio correspondiente en el frontend que lo consume** (`web-frontend` y/o `admin-panel`, según corresponda). No se considera una tarea de backend "terminada" si el frontend se queda desincronizado esperando la forma antigua de los datos. Detalle práctico en [docs/architecture-notes.md](docs/architecture-notes.md).

## Backend — monolito modular (no microservicios)

```
src/main/java/com/solimar/
  core/
    config/              → CORS, beans generales, properties
    security/            → SecurityFilterChain, JWT, filtro multi-tenant
    exception/           → GlobalExceptionHandler (@ControllerAdvice), excepciones custom
    util/

  auth/
    controller/ service/ config/   → login admin/negocio, tokens

  tenant/
    controller/ service/ repository/ entity/ dto/   → gestión de cada negocio cliente

  reservas/                         → unifica citas y pedidos
    controller/ service/ repository/ entity/ dto/

  pagos/
    controller/ service/ repository/ entity/ dto/
    webhook/             → StripeWebhookController separado del controller normal

  notificaciones/
    service/ template/   → emails automáticos (Resend o SMTP)

  estadisticas/
    controller/ service/ repository/ entity/ dto/   → tracking propio de visitas

  monitorizacion/
    controller/ service/ repository/ entity/ dto/   → sesiones activas, salud y actividad de cada tenant

  paginas-legales/
    controller/ service/ repository/ entity/ dto/   → aviso legal, política de privacidad, cookies, términos de venta
```

**Reglas dentro de cada módulo:**
- **Controller** → solo recibe y valida (`@Valid`), delega al service. Sin lógica de negocio.
- **Service** → toda la lógica de negocio. Única puerta de entrada pública del módulo.
- **Repository** → solo acceso a datos (`JpaRepository`), sin lógica.
- **Entity** → modelo persistente, con `tenant_id` donde aplique.
- **DTO** → nunca se expone la Entity directamente en el controller.

**Regla de dependencias entre módulos:** un módulo solo llama al **service** de otro módulo, nunca a su repository ni entity directamente. Ejemplo: `pagos` llama a `reservas.service.ReservaService`, nunca inyecta `ReservaRepository`.

## Multi-tenant

Una sola base de datos, columna `tenant_id` en las tablas que lo necesiten, filtro automático por tenant vía Spring Security. Más simple que BBDD separada por cliente, suficiente para el volumen actual.

## Frontend React — estructura de carpetas

```
src/
  app/        → rutas, layout general, proveedores globales (i18n, router, helmet, auth)
  shared/     → componentes reutilizables globales (tablas, botones, modales, SEO...), hooks genéricos
  modules/    → equivalente a tus módulos de Angular, uno por dominio de negocio
    reservations/
    sales/
    tracking/
    legal/
  core/       → cliente HTTP hacia el backend, manejo de auth/JWT, constantes globales
  assets/     → imágenes, fuentes, iconos
  i18n/       → configuración de i18next y archivos de traducción por idioma
```

**Estructura interna de cada módulo en `modules/`** (misma forma para todos):

```
modules/<nombre-del-modulo>/
  components/   → componentes de presentación propios de ese módulo (no reutilizables fuera de él)
  models/       → tipos/interfaces TypeScript del dominio del módulo
  services/     → llamadas HTTP y lógica de negocio del módulo (usa el cliente de core/)
  shared/       → piezas reutilizables solo dentro del propio módulo (no confundir con el shared/ global de la raíz)
```

## Decisión de estilos y base de componentes

**`solimarco-frontend`** (este repo, web pública): **CSS Modules en exclusiva**, sin shadcn/ui ni Tailwind — sigue `SKILL.md`. Primitivos complejos de accesibilidad (modal, dropdown, tabs) usan Radix headless puntual + CSS Modules, nunca utilities. **`solimarco-panel`** (admin-panel, futuro): **shadcn/ui + Tailwind**, porque es UI densa de dashboard donde shadcn sí aporta. Detalle completo en [docs/architecture-notes.md](docs/architecture-notes.md).

## Documentación de referencia

- [docs/legal-payments.md](docs/legal-payments.md) — legalidad y seguridad en pagos, Stripe Connect, facturación de comisiones.
- [docs/hosting.md](docs/hosting.md) — hosting backend (Render/Railway), costes al pasar a pago, CI/CD con Jenkins.
- [docs/data-model.md](docs/data-model.md) — modelo de datos flexible por sector (`Reserva` + `PlantillaSector` + JSONB), login opcional de cliente, tickets.
- [docs/admin-panel-spec.md](docs/admin-panel-spec.md) — panel de gestión de clientes, páginas legales, tipo de sitio, wizard de configuración y vista previa en tiempo real.
- [docs/build-order.md](docs/build-order.md) — orden de construcción recomendado de todo el sistema.
- [docs/sector-construccion.md](docs/sector-construccion.md) — análisis del sector piloto (construcción y reformas, BM Construcción S.L.).
- [docs/migration-checklist.md](docs/migration-checklist.md) — checklist de infraestructura/legal al firmar el primer cliente, y pendientes de decisión.
- [docs/confluence-structure.md](docs/confluence-structure.md) — árbol completo de páginas de Confluence y plantilla de endpoint.
- [docs/architecture-notes.md](docs/architecture-notes.md) — notas de arquitectura y proceso (razón del monolito, tipos compartidos, detalle de la regla de cambio sincronizado y de la decisión de estilos).
