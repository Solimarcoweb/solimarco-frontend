# Estructura de documentación en Confluence (árbol completo)

> Extraído de `CLAUDE.md`. El resumen breve queda en `CLAUDE.md`; este archivo conserva el árbol completo de páginas y la plantilla de endpoint.

Cada endpoint nuevo, cada módulo nuevo y cada decisión de arquitectura se documenta en Confluence, no solo en el código. Estructura de páginas por niveles:

```
Solimar Platform (página raíz/espacio)
  ├─ Arquitectura general
  │   ├─ Visión general del sistema
  │   ├─ Decisiones técnicas (ADRs — por qué se eligió X sobre Y)
  │   └─ Infraestructura (hosting, BBDD, CI/CD)
  ├─ Backend
  │   ├─ Módulo: Core
  │   ├─ Módulo: Auth
  │   ├─ Módulo: Tenant
  │   ├─ Módulo: Reservas
  │   │   ├─ Modelo de datos
  │   │   └─ Endpoints (uno por operación, con método, ruta, request/response de ejemplo, códigos de error)
  │   ├─ Módulo: Pagos
  │   ├─ Módulo: Notificaciones
  │   ├─ Módulo: Estadísticas
  │   └─ Módulo: Monitorización
  ├─ Frontend
  │   ├─ Web-frontend (estructura, features)
  │   └─ Admin-panel (estructura, features)
  └─ Sectores y plantillas
      ├─ Restaurante
      ├─ Boutique / Estética
      └─ Construcción y reformas
```

Cada página de endpoint sigue siempre esta plantilla mínima: título claro, método HTTP + ruta, descripción de qué hace, parámetros/body de entrada con ejemplo JSON, respuesta de éxito con ejemplo JSON, posibles errores y sus códigos, y módulo/clase de Java donde vive. Cada página de módulo enlaza a sus endpoints como subpáginas, no todo amontonado en una sola página larga.

Esto se hace **a la vez** que se construye cada pieza, no al final del proyecto — cada sesión de Claude Code que genere un endpoint o módulo nuevo, genera también su documentación correspondiente en Confluence ese mismo día.
