# Notas de arquitectura y proceso

> Extraído de `CLAUDE.md`. Contenido residual que no encajaba en los demás `docs/` ni en la versión recortada de `CLAUDE.md`, pero que no se ha eliminado.

## Frontend React — paralelismo con Angular (por qué esta organización de carpetas)

Confirmado: shared + modules por dominio + core también es buena práctica en React. Diferencia clave: no existe el sistema de módulos del framework (no hay `NgModule` ni inyección de dependencias propia del framework) — es pura convención de carpetas. Mismo concepto que Angular standalone (14+, por defecto desde la 17), donde los `NgModule` tampoco son ya necesarios y la organización también pasa a ser por carpetas + componentes standalone + lazy loading por rutas.

## Por qué monolito modular (no microservicios)

Con equipo de una persona, microservicios añaden complejidad operativa sin beneficio real a esta escala. Monolito modular bien separado da el mismo orden con mucho menos mantenimiento. Si algún módulo necesita escalar aparte en el futuro, ya queda preparado para extraerlo sin desenredar dependencias.

## Tipos compartidos entre frontend y backend

No hay paquete compartido automático — Java y TypeScript son lenguajes distintos y un paquete de tipos solo conectaría los dos frontends entre sí, no con el backend (que es donde el riesgo real de desincronización existe). En vez de esa pieza extra de gestión, se sigue la **regla de cambio sincronizado** (ver `CLAUDE.md`).

## `CLAUDE.md` se replica en los tres repos

`CLAUDE.md` se copia igual en la raíz de **cada uno de los tres repos** — mismo contenido, para que Claude Code tenga el contexto completo del proyecto sin importar en qué repo concreto se esté trabajando esa sesión.

## Detalle práctico de la regla de cambio sincronizado backend ↔ frontend

En la práctica, el principio (ver `CLAUDE.md`) significa:
- Al pedir a Claude Code un cambio de endpoint o DTO, se pide explícitamente también la actualización del cliente HTTP / tipos TypeScript / componente del frontend afectado, no solo el lado backend.
- La documentación en Confluence de ese endpoint (ver [confluence-structure.md](./confluence-structure.md)) se actualiza a la vez, no después.
- Si un cambio de backend rompe el contrato para varios consumidores frontend a la vez (`web-frontend` y `admin-panel` comparten un mismo endpoint), se revisan y actualizan ambos antes de dar el cambio por cerrado.

## Detalle completo de la decisión de estilos por repo

Decisión tomada al evaluar shadcn/ui sobre el stack actual. El resumen corto vive en `CLAUDE.md`; el detalle completo:

- **`solimarco-frontend` (web pública): CSS Modules en exclusiva. Sin shadcn/ui, sin Tailwind.** Los bloques de plantilla (hero, servicios, galería, contacto...) se escriben con CSS Modules siguiendo `SKILL.md`. Motivo: este repo son plantillas de marketing diseñadas a medida, no UI densa de back-office; meter Tailwind solo para shadcn crearía dos sistemas de estilo en paralelo sin aportar valor real aquí.
  - Cuando un bloque necesite un **primitivo complejo con accesibilidad** (modal, dropdown, tabs, popover, tooltip), se añade el primitivo **headless de Radix puntual** (`@radix-ui/react-*`) y se estila con CSS Modules — nunca se reescribe a mano la lógica de foco/teclado/a11y. Es "shadcn sin la capa Tailwind": se aprovecha la ingeniería de accesibilidad sin acoplarse a utilities.

- **`solimarco-panel` (admin-panel, futuro): shadcn/ui + Tailwind.** Es el lugar correcto para esa combinación, porque el panel es UI densa de dashboard (tablas de clientes, wizard multi-paso, gestión de catálogo) — justo el caso de uso donde shadcn aporta. Esta decisión se materializa al arrancar ese repo, no en el frontend público.

No se considera necesario micro-frontend: mismo argumento que con microservicios, añade complejidad de integración (module federation, versionado independiente) sin beneficio al volumen actual.
