# Especificación del admin-panel

> Extraído de `CLAUDE.md` (antiguas secciones 8, 9, 9bis, 9ter, 9quater, 9quinquies, 9sexies y 9septies). Las secciones 8 y 9 se incluyen aquí como contexto porque 9bis y 9ter las referencian directamente.

## 8. Control de errores — nada bloquea la aplicación

*(Contexto para 9bis: el módulo de gestión de clientes muestra aquí los errores capturados.)*

- `@ControllerAdvice` global en Spring: captura toda excepción, responde JSON limpio, nunca expone stacktrace al cliente.
- Envío de email tratado como **secundario y reintentable**: si falla, el ticket ya está guardado, no se pierde nada crítico.
- El webhook de Stripe responde rápido (200) y procesa en segundo plano — si tarda, Stripe reintenta y se podrían duplicar tickets.
- Frontend con error boundary global en React, para que nunca quede una pantalla en blanco ante un fallo inesperado.

## 9. Estadísticas de visitas

*(Contexto para 9bis y 9ter: `analytics_provider` y `trackPageView()` se referencian desde ambas.)*

Módulo propio (`estadisticas/`), ligero, bajo control directo:

```
VisitaEvento
  tenant_id, pagina, fecha, referrer, dispositivo, sesion_anonima
```

- `POST /api/track` registra cada visita; `GET /api/stats/{tenant}` para consultarlas desde el admin-panel.
- Sin cookies invasivas ni IP completa, para mantenerse en zona legal más permisiva (confirmar con gestor al cerrar la parte legal).

**Puerta abierta a Analytics de terceros (GA4 / Plausible), sin construirlo aún:**

```
Tenant
  ...
  analytics_provider     → null por defecto, luego "ga4" / "plausible" si se activa
  analytics_tracking_id  → null por defecto
```

En el frontend, una única función `trackPageView()`:
1. Siempre manda el evento al backend propio.
2. Si el tenant tiene `analytics_provider` configurado, también dispara ese script.

Coste cero ahora, sin retrabajo cuando se active en el futuro.

## 9bis. Panel de gestión de clientes — sesiones activas, actividad y resolución de incidencias

Pensado para ti, como tu centro de mando: ver de un vistazo el estado de todos tus clientes (tenants) sin tener que entrar uno por uno, y poder actuar sobre un problema con el mínimo número de clics.

### Qué información muestra, por cada cliente

```
Tenant (vista resumen en el panel)
  nombre_negocio, tipo_negocio, sector
  estado_actual         → activo | inactivo | con_incidencia | en_pausa (impago, etc.)
  ultima_actividad       → fecha/hora del último evento real (visita, reserva, venta, login)
  sesion_activa          → si el dueño del negocio está conectado a su panel ahora mismo
  resumen_actividad_30d  → nº de visitas, reservas/leads, ventas y errores recientes
  alertas_pendientes     → ej. "webhook de Stripe falló 3 veces", "sin actividad hace 20 días", "factura pendiente"
```

### De dónde sale cada dato (reutiliza módulos ya diseñados, no duplica nada)

- **Actividad y estadísticas** → del módulo `estadisticas` (sección 9 arriba), agregado por tenant.
- **Reservas/leads y ventas recientes** → de los módulos `reservas` y `ventas` ya existentes.
- **Estado de pagos/tickets** → del módulo `pagos` (ver [data-model.md](./data-model.md) sección 7) — detecta automáticamente si hubo fallos en webhooks o pagos rechazados.
- **Sesión activa del cliente** → del módulo `auth` — si el negocio tiene login a su propio panel (cuando se active esa opción a futuro), aquí se ve si está conectado.
- **Errores recientes** → del manejo global de excepciones (sección 8 arriba) — cualquier error capturado por `@ControllerAdvice` queda asociado al `tenant_id` correspondiente y aparece aquí, no solo en un log perdido.

### Resolución de incidencias en un clic, desde el propio panel

La idea clave es no tener que salir del resumen para solucionar lo más habitual. Acciones rápidas directamente desde la tarjeta de cada cliente:

- **Reintentar notificación fallida** → si un email no se envió, botón para reintentarlo sin tocar base de datos a mano.
- **Reintentar webhook de pago** → si Stripe marcó un fallo de procesamiento, reprocesar sin entrar al dashboard de Stripe.
- **Ver y resolver el último error** → clic abre el detalle del error capturado (sin exponer datos sensibles) con sugerencia de causa, en vez de ir a buscar en logs.
- **Reactivar/pausar negocio** → un toggle directo para activar o pausar un tenant (por ejemplo, si hay impago o el cliente lo pide temporalmente), sin tener que tocar la base de datos manualmente.
- **Acceso directo a su configuración** → un clic lleva directo al `PlantillaSector`/configuración de ese cliente concreto en el `admin-panel`, sin tener que buscarlo en una lista.

### Por qué este módulo no añade complejidad nueva real

No introduce ninguna entidad de negocio nueva — es, sobre todo, una capa de **agregación y visualización** sobre datos que los módulos `estadisticas`, `reservas`, `ventas`, `pagos` y `core/exception` ya van a generar de todas formas. La parte nueva real es pequeña: el registro de `sesion_activa` (si/cuándo se conectó el negocio) y el cálculo de `estado_actual`/`alertas_pendientes`, que son básicamente consultas agregadas sobre lo que ya existe, no un sistema aparte.

## 9ter. Páginas legales — endpoints propios (aviso legal, privacidad, cookies, términos)

Cada web de cliente necesita estas páginas publicadas (sección "Legal" de la checklist), y deben poder generarse y servirse de forma flexible por tenant, igual que el resto del contenido — no como texto fijo copiado a mano en cada proyecto.

### Modelo de datos

```
PaginaLegal
  id, tenant_id
  tipo            → "aviso_legal" | "politica_privacidad" | "cookies" | "terminos_venta"
  contenido        → texto/HTML del documento
  version          → para llevar histórico si se actualiza (relevante a efectos legales)
  fecha_publicacion
  activo
```

### Endpoints (documentar cada uno en Confluence según la plantilla — ver [confluence-structure.md](./confluence-structure.md))

```
GET  /api/legal/{tenant}/{tipo}        → devuelve el contenido publicado vigente de ese tipo
GET  /api/legal/{tenant}                → lista todas las páginas legales activas del tenant
POST /api/legal/{tenant}/{tipo}        → crea/actualiza una página legal (uso desde admin-panel)
GET  /api/legal/{tenant}/{tipo}/historial → versiones anteriores, por trazabilidad legal
```

### Cómo se rellenan en la práctica

El `admin-panel` ofrece **plantillas base genéricas** (aviso legal LSSI-CE, política de privacidad RGPD, política de cookies, términos de venta si el tenant tiene módulo `ventas` activo) con los campos del negocio (nombre, NIF, dirección, email de contacto) ya completados automáticamente desde los datos del `Tenant` — reduce el trabajo manual de redactar desde cero por cada cliente nuevo, aunque siempre conviene revisión por un profesional antes de publicar contenido legal real con un cliente de pago.

### Aviso de cookies en el frontend

No es solo contenido estático — si el tenant usa Analytics de terceros (sección 9 arriba, `analytics_provider`) o tracking propio con identificador de sesión, el frontend debe mostrar el banner de consentimiento correspondiente antes de activar esos scripts. El propio `trackPageView()` (sección 9 arriba) debe comprobar el consentimiento guardado antes de disparar nada que no sea estrictamente necesario.

## 9quater. Tipo de página: Landing page vs página completa

Al configurar un negocio nuevo en el `admin-panel`, debe poder elegirse el tipo de sitio que necesita — no todos los clientes quieren lo mismo, y esto afecta a qué se genera.

```
Tenant
  ...
  tipo_sitio   → "landing" | "completo"
```

**Landing page (`tipo_sitio: "landing"`)**
- Una sola página, scroll vertical, sin navegación entre secciones distintas
- Pensada para negocios que solo necesitan presencia básica + captación: hero, qué ofrecen, algún bloque de confianza, formulario de contacto/reserva, footer con legal
- Más rápida de montar, más barata de ofrecer como tarifa de entrada

**Página completa (`tipo_sitio: "completo"`)**
- Varias páginas/rutas: inicio, servicios, sobre nosotros, contacto, y las que correspondan según `modulos_activos` (ej. `/tienda` si tiene `ventas`, `/proyectos` si aplica)
- Navegación con menú, como las referencias reales ya analizadas (BM Construcción, las demos de restaurante/boutique/estética)

### Cómo encaja con lo ya diseñado

No es un cambio de arquitectura — el `web-frontend` sigue usando el mismo router y la misma estructura de `modules/` (ver `CLAUDE.md`); lo que cambia es **qué rutas se registran** según `tipo_sitio` y `modulos_activos` combinados. Una landing es, en la práctica, un subconjunto de rutas de lo que ya existe para "completo", no un sistema aparte que haya que mantener por separado.

## 9quinquies. Tipo de constructor del admin-panel — decisión definitiva: plantillas, no drag & drop

Aclaración importante de alcance, decidida explícitamente para evitar ambigüedad al construir el `admin-panel`:

**Se descarta** un constructor visual tipo Wix real (drag & drop libre de bloques, reordenable, con estructura de página en JSON genérico interpretado por un renderizador). Esa opción (B) implicaría mucho más desarrollo: editor visual, sistema de renderizado de bloques arbitrario, mayor complejidad tanto en backend como en frontend — desproporcionado para el alcance y el equipo actual (una persona).

**Se adopta:** plantillas profesionales predefinidas por sector (Opción A). El frontend (`web-frontend`) define visualmente cómo se ve cada tipo de bloque (hero, listado de servicios, galería, formulario de contacto/reserva...) — eso es código fijo, escrito y cuidado por el desarrollador. El `admin-panel` permite **rellenar el contenido** de esos bloques (textos, fotos, precios, datos de contacto) según lo que defina `PlantillaSector` para ese sector y `modulos_activos` para ese tenant, pero no reordenar ni rediseñar la estructura visual libremente.

**Por qué esto no es una limitación real para el negocio:** el valor que vendes no es "que el cliente diseñe su web desde cero", es "una web profesional y bien diseñada, lista en minutos, sin que el cliente tenga que saber de diseño". Las demos ya construidas (restaurante, boutique, estética) son justamente eso — plantillas con buen diseño que se rellenan con los datos de cada negocio, no estructuras libres.

**Esto confirma, sin cambios, todo lo ya diseñado:** `PlantillaSector`, el modelo `Reserva` con `detalles JSONB` (ver [data-model.md](./data-model.md)), `tipo_sitio` (9quater arriba) y `modulos_activos` (ver [sector-construccion.md](./sector-construccion.md)) ya estaban pensados desde el principio para esta opción A — no hace falta tocar el modelo de datos ni la arquitectura del backend por esta decisión, solo queda confirmado el alcance del trabajo de frontend y admin-panel cuando se construyan.

## 9sexies. Catálogo de configuración por negocio (wizard del admin-panel)

Desarrollo detallado de lo que ya apuntaba `modulos_activos`: el conjunto completo de opciones que se eligen al configurar cada `Tenant` nuevo, organizadas como pasos de un wizard. No introduce módulos de backend nuevos respecto a lo ya diseñado — es el catálogo concreto de **qué activar y con qué datos**, todo apoyado en piezas que ya existen.

### Paso 1 — Tipo de sitio (ya definido en 9quater)
`tipo_sitio: "landing" | "completo"`

### Paso 2 — Sector del negocio (`PlantillaSector`, ver [data-model.md](./data-model.md))
Catálogo amplio de sectores soportados desde el inicio, cada uno con su propia plantilla de campos:
- Restaurante / bar
- Boutique / tienda de ropa
- Peluquería / barbería
- Centro de estética / spa
- Tienda de mascotas
- Construcción y reformas (sector piloto, ver [sector-construccion.md](./sector-construccion.md))
- (el catálogo queda abierto a añadir más sectores como configuración nueva, sin tocar código)

### Paso 3 — Módulos de negocio activos (`modulos_activos`)

No exclusivos entre sí — un negocio puede combinar varios, igual que ya validamos con el sector de construcción/reformas:

- **`reservations`** — citas o reservas de mesa (restaurante, peluquería, estética, mecánico...)
- **`sales`** — tienda online con catálogo, carrito y checkout (módulo `ventas`/`pagos` ya diseñado)
- **`inventory`** — gestión de almacén/stock (relevante si `sales` está activo; controla unidades disponibles por producto)
- **`leads`** — captación de presupuesto sin pago directo (igual que la parte de obra/reforma del sector construcción)

### Paso 4 — Canales de contacto (independiente del sector, configurable siempre)

Qué vías de contacto se muestran en la web del negocio — cada una activable/desactivable con su dato correspondiente:

```
ContactChannels (parte de la configuración del Tenant)
  whatsappEnabled, whatsappNumber
  emailEnabled, contactEmail
  phoneEnabled, phoneNumber
  contactFormEnabled   → usa el modelo de Reserva/leads ya diseñado, no es un canal aparte de verdad
```

El frontend muestra solo los botones/canales que estén activos para ese tenant (ej. un botón flotante de WhatsApp solo si `whatsappEnabled` es true).

### Paso 5 — Pasarela de pagos (solo si `sales` está activo)

Activación de Stripe Connect para ese negocio en concreto (ver [legal-payments.md](./legal-payments.md) y [migration-checklist.md](./migration-checklist.md)) — esto es configuración de negocio, no algo que se decida por sector, ya que dos negocios del mismo sector pueden o no vender online.

### Paso 6 — Inicio de sesión del cliente final (ya diseñado, ver [data-model.md](./data-model.md))

`requiere_login_cliente: boolean` — confirma lo ya definido: por defecto sin login (checkout/reserva de invitado), activable si el negocio concreto lo pide (ej. una clínica que quiera historial de paciente).

### Resumen del modelo de configuración del Tenant (consolidado)

```
Tenant
  tipo_sitio              → landing | completo            (9quater)
  sector                  → referencia a PlantillaSector   (data-model.md)
  modulos_activos         → [reservations, sales, inventory, leads]  (este paso)
  contactChannels         → whatsapp / email / phone / contactForm  (este paso)
  paymentsEnabled         → boolean, solo relevante si "sales" activo
  requiere_login_cliente  → boolean                        (data-model.md)
  analytics_provider / analytics_tracking_id               (sección 9 arriba)
```

Todo este catálogo se construye sobre piezas que ya existen — no añade módulos de backend nuevos, es la consolidación de cómo el `admin-panel` (cuando se construya, ver [build-order.md](./build-order.md)) presenta estas opciones ya diseñadas como un wizard claro, paso a paso, para cualquier sector del catálogo anterior.

## 9septies. Vista previa en tiempo real — el wizard como herramienta de venta

Confirmado: todo el catálogo de la sección anterior se configura **visualmente**, paso a paso, y el resultado se visualiza **antes** de publicar nada — no es solo configuración técnica de back-office, es una herramienta pensada para usarse delante del cliente potencial durante la venta ("mira, así quedaría tu web mientras lo configuramos juntos").

### Cómo encaja en la arquitectura (sin romper nada de lo ya diseñado)

El `admin-panel`, al ir avanzando por el wizard de la sección 9sexies, mantiene en memoria (frontend, sin guardar aún en backend) el objeto de configuración del `Tenant` que se está construyendo. Una zona de la pantalla — split view, panel lateral o pestaña — renderiza **en vivo** una vista previa usando los mismos componentes de plantilla que usará `web-frontend` en producción (los bloques de 9quinquies: hero, servicios, galería...), pero alimentados con los datos que se van rellenando en el wizard, sin necesidad de guardar nada todavía.

```
admin-panel (wizard)
  ├─ Panel de configuración (pasos 1-6, sección 9sexies)
  └─ Panel de vista previa (en vivo)
        → reutiliza los mismos componentes de bloque de web-frontend
        → recibe el Tenant "en construcción" como props/estado local
        → no hace falta llamada al backend para refrescar la preview
```

**Por qué reutilizar los componentes de `web-frontend` y no duplicar el diseño en el `admin-panel`:** si se duplicara, cualquier cambio visual de una plantilla habría que hacerlo dos veces (en el sitio real y en la preview) y correrían el riesgo de desincronizarse — mismo principio que la regla de cambio sincronizado backend↔frontend (ver `CLAUDE.md`), aplicado aquí entre los dos frontends. Los componentes de bloque (hero, galería, formulario de contacto...) se construyen como piezas reutilizables, importables tanto desde `web-frontend` como desde `admin-panel`.

### Flujo completo de venta, de principio a fin

1. Te sientas con el cliente (en persona, videollamada, o simplemente tú sola montándolo antes de la reunión)
2. Recorres el wizard: sector, módulos, canales de contacto, colores/contenido básico
3. El cliente ve la vista previa cambiando en tiempo real con cada decisión
4. Cuando está conforme, se pulsa "Guardar" — **aquí sí** se persiste el `Tenant` en backend (`POST` al endpoint correspondiente del módulo `tenant`)
5. A partir de ahí, `web-frontend` sirve esa configuración ya guardada como la web real y pública del negocio

### Nota técnica para cuando se construya

No es necesario backend adicional para la vista previa en sí — es estado local de React mientras se recorre el wizard. Solo hay llamada real al backend en el paso final de guardado, y en los puntos donde se necesite cargar datos ya existentes (ej. editar un tenant ya creado en una sesión posterior, ahí sí se parte de los datos guardados en vez de un formulario vacío).
