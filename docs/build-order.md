# Orden de construcción recomendado

> Extraído de `CLAUDE.md` (antigua sección 12, más el resumen de arquitectura que la precedía).

Esquema de arquitectura para el nuevo concepto: una plataforma propia (estilo Wix interno) para crear y gestionar webs de clientes con reservas, ventas, pagos y notificaciones, multi-sector.

## 12. Orden de construcción recomendado

1. Base del backend: `core` + `auth` + `tenant` (con campos de analítica y `requiere_login_cliente` ya incluidos)
2. Modelo de datos flexible: `Reserva` + `PlantillaSector` + JSONB (ver [data-model.md](./data-model.md))
3. Módulo `reservas` (sin dinero de por medio, valida que la arquitectura funciona) — validar primero con el sector piloto de construcción/reformas (ver [sector-construccion.md](./sector-construccion.md)), por ser el flujo de "lead a presupuestar" sin fecha/hora fija ni importe cerrado, el caso más exigente para el modelo flexible
4. Módulo `pagos` + `tickets` + webhook de Stripe (con todo el cuidado legal de [legal-payments.md](./legal-payments.md))
5. Módulo `notificaciones`
6. Módulo `estadisticas`
7. Módulo `monitorizacion` (panel de sesiones activas, actividad y resolución de incidencias — ver [admin-panel-spec.md](./admin-panel-spec.md) sección 9bis)
8. Módulo `paginas-legales` (ver [admin-panel-spec.md](./admin-panel-spec.md) sección 9ter) + soporte de `tipo_sitio` landing/completo (sección 9quater) en el `Tenant`
9. `admin-panel` (el configurador paso a paso, tipo wizard), incluyendo la vista de gestión de clientes, la edición de páginas legales, y el wizard con vista previa en tiempo real (sección 9septies)
10. `web-frontend` por tenant (lo que ve cada cliente final), con rutas condicionadas por `tipo_sitio` y `modulos_activos` — los componentes de bloque (hero, galería, contacto...) se construyen aquí como piezas reutilizables e importables también desde `admin-panel` para la vista previa
