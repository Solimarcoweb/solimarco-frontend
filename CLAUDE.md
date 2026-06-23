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
- Lógica de negocio fuera del componente visual cuando sea posible (hooks personalizados en `modules/x/shared/`, ver estructura interna de módulo en la sección 10), componente se queda solo con presentación.

**General:**
- Comentarios explican el "por qué", no el "qué" (el código ya dice qué hace; el comentario aporta contexto, decisión de diseño o advertencia).
- Nunca código grande "de una pieza" — siempre dividido en piezas pequeñas, testeables y con nombre claro.
- Seguir siempre la estructura de carpetas y capas ya definida en este documento (secciones 3 y 10), sin mezclar responsabilidades entre capas.

## Documentación en Confluence — obligatoria para cada pieza nueva

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

---

Esquema de arquitectura para el nuevo concepto: una plataforma propia (estilo Wix interno) para crear y gestionar webs de clientes con reservas, ventas, pagos y notificaciones, multi-sector.

---

## 1. Legalidad y seguridad en pagos (no negociable)

Antes de procesar pagos reales:

- Cuenta **Stripe** verificada con los datos fiscales del negocio (proceso KYC de Stripe).
- Nunca guardar datos de tarjeta directamente — eso lo gestiona Stripe (evita tener que cumplir PCI-DSS tú misma).
- HTTPS en todo el flujo, sin excepciones.
- Verificar siempre la **firma del webhook** de Stripe — si no se valida, cualquiera podría simular un pago falso.
- Aviso legal, política de privacidad y términos de venta publicados (LSSI-CE + RGPD).
- Confirmar con gestor/abogado si hace falta registro adicional por cobrar en nombre de terceros, o si **Stripe Connect** cubre esa figura legal. Lo que dice la documentación oficial de Stripe sobre esto: con Connect, Stripe formaliza un contrato con la plataforma (tú) y, además, una relación legal directa con cada negocio cliente (la "cuenta conectada"). Esto es clave porque los fondos que deben los clientes finales al negocio nunca están en poder ni bajo el control de la plataforma — se cobran en cuentas protegidas de Stripe hasta que se hacen dos transferencias separadas: el pago del cliente final a la cuenta bancaria del negocio, y la comisión de la plataforma a tu cuenta. En ningún momento el dinero pasa por tus manos ni por una cuenta tuya, lo cual reduce mucho tu exposición regulatoria respecto a manejar fondos de terceros directamente.

  Importante: Stripe deja explícito en el contrato de la plataforma Connect que no se responsabiliza por tus actos u omisiones hacia los comerciantes de la plataforma, ni por el cumplimiento de las leyes y obligaciones aplicables a tu oferta de servicios, ni por la atención al cliente o gestión de reembolsos y reclamaciones — es decir, Stripe Connect resuelve la parte de **manejo seguro del dinero**, pero no te exime de tus propias obligaciones legales como plataforma (facturación, atención al cliente, RGPD, etc.), esas siguen siendo responsabilidad tuya.

  Para activar Connect con cada negocio cliente, Stripe pide un proceso de verificación: documentación de identificación con foto y verificación de la dirección como parte de los requisitos más frecuentes, y debes tener el sitio web del negocio ya asociado a Stripe.

  **Conclusión práctica:** Stripe Connect sí es el camino correcto y está pensado exactamente para tu caso de uso (plataforma que cobra en nombre de terceros), y reduce significativamente el riesgo de que se te considere una entidad de pago no autorizada, porque el dinero nunca pasa por ti. Aun así, sigue siendo recomendable confirmar con un gestor/abogado fiscal en España los detalles concretos de facturación entre las partes (tú facturas tu comisión, el negocio factura su venta) antes de lanzarlo con dinero real.

  **Sobre la facturación de las comisiones de Stripe (investigado):** Stripe Payments Europe Limited tiene sede fiscal en Irlanda (intracomunitaria), por lo que sus facturas de comisión **no incluyen IVA**. Como autónoma en España, debes hacer la compensación del IVA tú misma mediante el **Modelo 303** (declaración trimestral) y el **Modelo 349** (operaciones intracomunitarias), declarando esa comisión como **Adquisición Intracomunitaria de servicios al 21%**. Es decir: Stripe te cobra su comisión sin IVA, pero tú debes autoliquidarlo (se conoce como inversión del sujeto pasivo) — no es un coste adicional real porque el IVA soportado se puede recuperar, pero sí es una gestión contable extra a tener en cuenta. Las comisiones de Stripe son gasto deducible de tu actividad. Existen herramientas como Quipu que automatizan esta integración contable si quieres ahorrarte el registro manual cada mes.

---

## 2. Estructura del repositorio — repos separados (no monorepo)

Decisión: repos independientes por proyecto, para facilitar control de acceso granular si en el futuro se incorpora más gente (alguien solo a backend, alguien solo a frontend), y versionado independiente real de cada pieza.

```
solimarco-backend/      → Spring Boot, deploy en servidor propio / Railway / Render + Jenkins
solimarco-frontend/    → web pública que ve el cliente final (React + Vite), deploy Vercel
solimarco-panel/        → panel interno, el "creador de webs" paso a paso (React + Vite), deploy Vercel
```

**Nota de nomenclatura:** en el resto de este documento, "`web-frontend`" se refiere al repo `solimarco-frontend`, y "`admin-panel`" se refiere al repo `solimarco-panel` — son los nombres conceptuales usados al describir la arquitectura; los nombres reales de los repos en GitHub y en disco son los indicados arriba.

**Sobre tipos compartidos entre frontend y backend:** no hay paquete compartido automático — Java y TypeScript son lenguajes distintos y un paquete de tipos solo conectaría los dos frontends entre sí, no con el backend (que es donde el riesgo real de desincronización existe). En vez de esa pieza extra de gestión, se sigue la **regla de cambio sincronizado** de la siguiente sección.

**`CLAUDE.md`:** se copia igual en la raíz de **cada uno de los tres repos** — mismo contenido, para que Claude Code tenga el contexto completo del proyecto sin importar en qué repo concreto se esté trabajando esa sesión.

## 2bis. Regla de cambio sincronizado backend ↔ frontend (obligatoria, sin excepción)

Cualquier cambio en el backend que afecte al **contrato de la API** (un endpoint nuevo, un campo añadido/renombrado/eliminado en un DTO, un cambio en el formato de una respuesta, un nuevo código de error) **se acompaña siempre, en la misma sesión de trabajo, del cambio correspondiente en el frontend que lo consume** (`web-frontend` y/o `admin-panel`, según corresponda). No se considera una tarea de backend "terminada" si el frontend se queda desincronizado esperando la forma antigua de los datos.

En la práctica, esto significa:
- Al pedir a Claude Code un cambio de endpoint o DTO, se pide explícitamente también la actualización del cliente HTTP / tipos TypeScript / componente del frontend afectado, no solo el lado backend.
- La documentación en Confluence de ese endpoint (sección de documentación de este mismo documento) se actualiza a la vez, no después.
- Si un cambio de backend rompe el contrato para varios consumidores frontend a la vez (`web-frontend` y `admin-panel` comparten un mismo endpoint), se revisan y actualizan ambos antes de dar el cambio por cerrado.

## 2bis. Hosting del backend — opciones gratuitas y coste real al escalar (investigado)

No hay un "gratis ilimitado y permanente" real para un backend siempre activo, pero sí hay opciones razonables para empezar sin coste mientras no haya clientes pagando:

- **Render (recomendado para empezar):** mantiene un nivel gratuito (plan Hobby) sin cuota mensual, con 750 horas/mes para servicios web — alcanza justo para tener **un servicio corriendo 24/7 todo el mes** (24h × 31 días ≈ 744h). El backend completo (monolito modular, con todos sus módulos incluido `notificaciones`) sigue siendo un único servicio/instancia, tal como está diseñado en la sección 3 — esto no cambia ni en el plan free ni en el de pago. El matiz real del plan gratuito: si el servicio queda inactivo un rato, la primera petición tras la inactividad tarda cerca de un minuto en "despertar" (spin-down), y además **la base de datos PostgreSQL gratuita se borra automáticamente a los 30 días**, sin periodo de gracia — esto último es importante, no es solo una molestia de rendimiento, hay riesgo real de perder datos si se olvida migrar a tiempo.

- **Railway:** ya **no** ofrece un nivel gratuito permanente real — da un trial único de $5 en créditos y después cae a un plan "Free" de solo $1/mes en créditos, insuficiente para mantener una app corriendo de forma seria. Útil solo para probar la plataforma unos días, no como solución gratuita a medio plazo.

### Coste real al pasar a pago en Render (no es un único "plan Pro" con precio cerrado)

A diferencia de Vercel, el precio de Render se compone de **varias capas independientes**, conviene tenerlo claro para presupuestar bien:

| Capa | Coste aproximado | Para qué |
|---|---|---|
| Servicio backend (compute) | desde $7/mes por servicio | Elimina el spin-down — necesario en cuanto haya cliente real |
| Base de datos PostgreSQL | desde $6/mes | Persistencia real, sin el borrado automático a los 30 días |
| Cuota de workspace (si se necesita) | $19/usuario/mes (plan Professional) | Solo hace falta si se añaden colaboradores al equipo; mientras trabajes sola, no es necesaria |

**Para tu caso concreto** (backend único + base de datos, trabajando sola, sin equipo añadido al workspace): el coste real de pasar a producción sería aproximadamente **$7 + $6 ≈ $13/mes**, no un plan único con nombre "Pro" de precio fijo como en Vercel. No hace falta la cuota de workspace de $19/usuario mientras no añadas colaboradores.

- **Conclusión:** usar **Render free** (Hobby, sin cuota) para desarrollo y pruebas del backend ahora mismo, vigilando el límite de 30 días de la base de datos gratuita durante esta fase, y presupuestar esos ~$13/mes (servicio + base de datos) en cuanto se firme el primer cliente — mismo criterio que ya se aplicó con Vercel Pro para el frontend. El salto a pago es por **eliminar el spin-down y tener la base de datos persistente con más recursos**, no porque haga falta separar ningún módulo en otra instancia: el monolito (con `notificaciones` incluido) sigue siendo una sola instancia, igual en free que en pago.

---

## 3. Backend — monolito modular (no microservicios)

Con equipo de una persona, microservicios añaden complejidad operativa sin beneficio real a esta escala. Monolito modular bien separado da el mismo orden con mucho menos mantenimiento. Si algún módulo necesita escalar aparte en el futuro, ya queda preparado para extraerlo sin desenredar dependencias.

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

  reservas/                         → unifica citas y pedidos (ver sección 5)
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

---

## 4. Multi-tenant

Una sola base de datos, columna `tenant_id` en las tablas que lo necesiten, filtro automático por tenant vía Spring Security. Más simple que BBDD separada por cliente, suficiente para el volumen actual.

---

## 5. Modelo de datos flexible por sector (Plan B elegido)

Problema: restaurantes, clínicas, estética, tiendas de ropa, tiendas de mascotas, mecánicos... cada uno necesita campos distintos. Crear una tabla rígida por sector no escala si se van añadiendo sectores nuevos.

**Solución: tabla común + detalle flexible en JSONB**

```
Reserva (tabla común a TODOS los sectores y tipos de negocio)
  id
  tenant_id
  tipo_negocio          → "restaurante" | "clinica" | "estetica" | "tienda" | ...
  usuario_id            → NULLABLE (ver sección 6, checkout/reserva sin login)
  nombre_contacto
  email_contacto
  telefono_contacto
  estado                → pendiente | confirmada | pagada | cancelada...
  fecha
  total                 → si aplica pago
  ticket_id             → referencia al ticket generado (sección 7)
  detalles              → JSONB, campos específicos del sector
  creado_en
```

Ejemplos de `detalles` según sector:
- Restaurante: `{ "num_personas": 4, "mesa_preferida": "terraza" }`
- Clínica dental: `{ "profesional": "Dra. García", "tratamiento": "limpieza" }`
- Tienda de mascotas: `{ "mascota": "Toby", "especie": "perro", "servicio": "baño" }`

**Configuración de qué campos pide cada sector:**

```
PlantillaSector
  tipo_negocio: "restaurante"
  campos: [
    { nombre: "num_personas", tipo: "number", requerido: true },
    { nombre: "mesa_preferida", tipo: "text", requerido: false }
  ]
```

Cuando se da de alta un negocio nuevo en el panel admin, se elige su `tipo_negocio` y el sistema ya sabe qué formulario generar — añadir un sector nuevo es **configurar**, no programar una entidad ni un módulo nuevo.

**Nota importante (confirmada con el sector piloto de la sección 13):** un mismo negocio puede necesitar **más de un módulo de negocio a la vez** — por ejemplo, una constructora que recibe solicitudes de presupuesto (`reservas`) y además vende materiales online (`ventas`). Por eso `PlantillaSector` no asocia un único flujo por sector, sino una lista de `modulos_activos` configurable. Esto no cambia el modelo de datos de la sección 5: cada módulo sigue usando su propia tabla común (`Reserva` o `Pedido`), simplemente un mismo `tenant_id` puede tener filas en varias a la vez.

**Trade-off asumido:** se pierde validación estricta a nivel de base de datos en los campos del JSONB (no hay "esto debe ser número" forzado por la BBDD). La validación se hace en el `service`, usando `PlantillaSector` como referencia antes de guardar. Razonable a cambio de flexibilidad real entre sectores tan distintos.

---

## 6. Login del cliente final: opcional, configurable por tenant

Importante no confundir dos tipos de sesión:
1. **Login tuyo / del negocio** (panel admin) → siempre obligatorio, no cambia.
2. **Login del cliente final** (quien reserva mesa o compra) → opcional según el negocio.

```
Tenant
  ...
  requiere_login_cliente   → boolean, false por defecto
```

- **Restaurante con reserva de mesa:** formulario simple (nombre, teléfono, email, fecha, hora, personas) → `POST /api/reservas` sin necesidad de cuenta. Notificación automática por email.
- **Tienda con checkout de invitado:** la cesta vive en el frontend (estado local / sessionStorage) sin tocar backend hasta pagar. Al pagar, se mandan los datos de contacto como invitado.
- El campo `usuario_id` en `Reserva` queda **nullable desde el inicio** — si en el futuro algún negocio (ej. clínica con historial de paciente) quiere cuentas de cliente, se activa sin rediseñar el modelo.

**Regla clave confirmada:** haya login o no, **la reserva/pedido siempre se guarda en base de datos**. Lo único opcional es la asociación a una cuenta de usuario, nunca el registro del propio pedido o pago.

---

## 7. Tickets — siempre se generan, dos copias

```
Ticket
  id, tenant_id, reserva_id,
  tipo (venta / cita), total, moneda,
  stripe_payment_id, estado,
  datos_cliente_json, datos_negocio_json,
  creado_en
```

- Se genera **siempre desde el webhook de Stripe ya confirmado**, nunca desde el frontend (el frontend no es fuente fiable para confirmar un pago).
- Doble registro: una copia visible para el cliente final (email + descarga), y otra para el negocio/tuya, para tener constancia aunque el email falle.

---

## 8. Control de errores — nada bloquea la aplicación

- `@ControllerAdvice` global en Spring: captura toda excepción, responde JSON limpio, nunca expone stacktrace al cliente.
- Envío de email tratado como **secundario y reintentable**: si falla, el ticket ya está guardado, no se pierde nada crítico.
- El webhook de Stripe responde rápido (200) y procesa en segundo plano — si tarda, Stripe reintenta y se podrían duplicar tickets.
- Frontend con error boundary global en React, para que nunca quede una pantalla en blanco ante un fallo inesperado.

---

## 9. Estadísticas de visitas

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

---

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

- **Actividad y estadísticas** → del módulo `estadisticas` (sección 9), agregado por tenant.
- **Reservas/leads y ventas recientes** → de los módulos `reservas` y `ventas` ya existentes.
- **Estado de pagos/tickets** → del módulo `pagos` (sección 7) — detecta automáticamente si hubo fallos en webhooks o pagos rechazados.
- **Sesión activa del cliente** → del módulo `auth` (sección 3) — si el negocio tiene login a su propio panel (cuando se active esa opción a futuro), aquí se ve si está conectado.
- **Errores recientes** → del manejo global de excepciones (sección 8) — cualquier error capturado por `@ControllerAdvice` queda asociado al `tenant_id` correspondiente y aparece aquí, no solo en un log perdido.

### Resolución de incidencias en un clic, desde el propio panel

La idea clave es no tener que salir del resumen para solucionar lo más habitual. Acciones rápidas directamente desde la tarjeta de cada cliente:

- **Reintentar notificación fallida** → si un email no se envió, botón para reintentarlo sin tocar base de datos a mano.
- **Reintentar webhook de pago** → si Stripe marcó un fallo de procesamiento, reprocesar sin entrar al dashboard de Stripe.
- **Ver y resolver el último error** → clic abre el detalle del error capturado (sin exponer datos sensibles) con sugerencia de causa, en vez de ir a buscar en logs.
- **Reactivar/pausar negocio** → un toggle directo para activar o pausar un tenant (por ejemplo, si hay impago o el cliente lo pide temporalmente), sin tener que tocar la base de datos manualmente.
- **Acceso directo a su configuración** → un clic lleva directo al `PlantillaSector`/configuración de ese cliente concreto en el `admin-panel`, sin tener que buscarlo en una lista.

### Por qué este módulo no añade complejidad nueva real

No introduce ninguna entidad de negocio nueva — es, sobre todo, una capa de **agregación y visualización** sobre datos que los módulos `estadisticas`, `reservas`, `ventas`, `pagos` y `core/exception` ya van a generar de todas formas. La parte nueva real es pequeña: el registro de `sesion_activa` (si/cuándo se conectó el negocio) y el cálculo de `estado_actual`/`alertas_pendientes`, que son básicamente consultas agregadas sobre lo que ya existe, no un sistema aparte.

---

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

### Endpoints (documentar cada uno en Confluence según la plantilla ya definida en la sección de documentación)

```
GET  /api/legal/{tenant}/{tipo}        → devuelve el contenido publicado vigente de ese tipo
GET  /api/legal/{tenant}                → lista todas las páginas legales activas del tenant
POST /api/legal/{tenant}/{tipo}        → crea/actualiza una página legal (uso desde admin-panel)
GET  /api/legal/{tenant}/{tipo}/historial → versiones anteriores, por trazabilidad legal
```

### Cómo se rellenan en la práctica

El `admin-panel` ofrece **plantillas base genéricas** (aviso legal LSSI-CE, política de privacidad RGPD, política de cookies, términos de venta si el tenant tiene módulo `ventas` activo) con los campos del negocio (nombre, NIF, dirección, email de contacto) ya completados automáticamente desde los datos del `Tenant` — reduce el trabajo manual de redactar desde cero por cada cliente nuevo, aunque siempre conviene revisión por un profesional antes de publicar contenido legal real con un cliente de pago.

### Aviso de cookies en el frontend

No es solo contenido estático — si el tenant usa Analytics de terceros (sección 9, `analytics_provider`) o tracking propio con identificador de sesión, el frontend debe mostrar el banner de consentimiento correspondiente antes de activar esos scripts. El propio `trackPageView()` (sección 9) debe comprobar el consentimiento guardado antes de disparar nada que no sea estrictamente necesario.

---

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

No es un cambio de arquitectura — el `web-frontend` (sección 10) sigue usando el mismo router y la misma estructura de `modules/`; lo que cambia es **qué rutas se registran** según `tipo_sitio` y `modulos_activos` combinados. Una landing es, en la práctica, un subconjunto de rutas de lo que ya existe para "completo", no un sistema aparte que haya que mantener por separado.

---

## 9quinquies. Tipo de constructor del admin-panel — decisión definitiva: plantillas, no drag & drop

Aclaración importante de alcance, decidida explícitamente para evitar ambigüedad al construir el `admin-panel`:

**Se descarta** un constructor visual tipo Wix real (drag & drop libre de bloques, reordenable, con estructura de página en JSON genérico interpretado por un renderizador). Esa opción (B) implicaría mucho más desarrollo: editor visual, sistema de renderizado de bloques arbitrario, mayor complejidad tanto en backend como en frontend — desproporcionado para el alcance y el equipo actual (una persona).

**Se adopta:** plantillas profesionales predefinidas por sector (Opción A). El frontend (`web-frontend`) define visualmente cómo se ve cada tipo de bloque (hero, listado de servicios, galería, formulario de contacto/reserva...) — eso es código fijo, escrito y cuidado por el desarrollador. El `admin-panel` permite **rellenar el contenido** de esos bloques (textos, fotos, precios, datos de contacto) según lo que defina `PlantillaSector` para ese sector y `modulos_activos` para ese tenant, pero no reordenar ni rediseñar la estructura visual libremente.

**Por qué esto no es una limitación real para el negocio:** el valor que vendes no es "que el cliente diseñe su web desde cero", es "una web profesional y bien diseñada, lista en minutos, sin que el cliente tenga que saber de diseño". Las demos ya construidas (restaurante, boutique, estética) son justamente eso — plantillas con buen diseño que se rellenan con los datos de cada negocio, no estructuras libres.

**Esto confirma, sin cambios, todo lo ya diseñado:** `PlantillaSector` (sección 5), el modelo `Reserva` con `detalles JSONB` (sección 5), `tipo_sitio` (sección 9quater) y `modulos_activos` (sección 5/13) ya estaban pensados desde el principio para esta opción A — no hace falta tocar el modelo de datos ni la arquitectura del backend por esta decisión, solo queda confirmado el alcance del trabajo de frontend y admin-panel cuando se construyan.

---

## 9sexies. Catálogo de configuración por negocio (wizard del admin-panel)

Desarrollo detallado de lo que ya apuntaba `modulos_activos`: el conjunto completo de opciones que se eligen al configurar cada `Tenant` nuevo, organizadas como pasos de un wizard. No introduce módulos de backend nuevos respecto a lo ya diseñado — es el catálogo concreto de **qué activar y con qué datos**, todo apoyado en piezas que ya existen en este documento.

### Paso 1 — Tipo de sitio (ya definido en sección 9quater)
`tipo_sitio: "landing" | "completo"`

### Paso 2 — Sector del negocio (`PlantillaSector`, sección 5)
Catálogo amplio de sectores soportados desde el inicio, cada uno con su propia plantilla de campos:
- Restaurante / bar
- Boutique / tienda de ropa
- Peluquería / barbería
- Centro de estética / spa
- Tienda de mascotas
- Construcción y reformas (sector piloto, sección 13)
- (el catálogo queda abierto a añadir más sectores como configuración nueva, sin tocar código — ver sección 5)

### Paso 3 — Módulos de negocio activos (`modulos_activos`, ampliación de la sección 5/13)

No exclusivos entre sí — un negocio puede combinar varios, igual que ya validamos con el sector de construcción/reformas:

- **`reservations`** — citas o reservas de mesa (restaurante, peluquería, estética, mecánico...)
- **`sales`** — tienda online con catálogo, carrito y checkout (módulo `ventas`/`pagos` ya diseñado)
- **`inventory`** — gestión de almacén/stock (relevante si `sales` está activo; controla unidades disponibles por producto)
- **`leads`** — captación de presupuesto sin pago directo (igual que la parte de obra/reforma del sector construcción, sección 13)

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

Activación de Stripe Connect para ese negocio en concreto (sección 1 y plan de migración del primer cliente) — esto es configuración de negocio, no algo que se decida por sector, ya que dos negocios del mismo sector pueden o no vender online.

### Paso 6 — Inicio de sesión del cliente final (sección 6, ya diseñado)

`requiere_login_cliente: boolean` — confirma lo ya definido: por defecto sin login (checkout/reserva de invitado), activable si el negocio concreto lo pide (ej. una clínica que quiera historial de paciente).

### Resumen del modelo de configuración del Tenant (consolidado)

```
Tenant
  tipo_sitio              → landing | completo            (sección 9quater)
  sector                  → referencia a PlantillaSector   (sección 5)
  modulos_activos         → [reservations, sales, inventory, leads]  (este paso)
  contactChannels         → whatsapp / email / phone / contactForm  (este paso)
  paymentsEnabled         → boolean, solo relevante si "sales" activo
  requiere_login_cliente  → boolean                        (sección 6)
  analytics_provider / analytics_tracking_id               (sección 9)
```

Todo este catálogo se construye sobre piezas que ya existen en el documento — no añade módulos de backend nuevos, es la consolidación de cómo el `admin-panel` (cuando se construya, ver orden en la sección de construcción) presenta estas opciones ya diseñadas como un wizard claro, paso a paso, para cualquier sector del catálogo anterior.

---

## 9septies. Vista previa en tiempo real — el wizard como herramienta de venta

Confirmado: todo el catálogo de la sección anterior se configura **visualmente**, paso a paso, y el resultado se visualiza **antes** de publicar nada — no es solo configuración técnica de back-office, es una herramienta pensada para usarse delante del cliente potencial durante la venta ("mira, así quedaría tu web mientras lo configuramos juntos").

### Cómo encaja en la arquitectura (sin romper nada de lo ya diseñado)

El `admin-panel`, al ir avanzando por el wizard de la sección 9sexies, mantiene en memoria (frontend, sin guardar aún en backend) el objeto de configuración del `Tenant` que se está construyendo. Una zona de la pantalla — split view, panel lateral o pestaña — renderiza **en vivo** una vista previa usando los mismos componentes de plantilla que usará `web-frontend` en producción (los bloques de la sección 9quinquies: hero, servicios, galería...), pero alimentados con los datos que se van rellenando en el wizard, sin necesidad de guardar nada todavía.

```
admin-panel (wizard)
  ├─ Panel de configuración (pasos 1-6, sección 9sexies)
  └─ Panel de vista previa (en vivo)
        → reutiliza los mismos componentes de bloque de web-frontend
        → recibe el Tenant "en construcción" como props/estado local
        → no hace falta llamada al backend para refrescar la preview
```

**Por qué reutilizar los componentes de `web-frontend` y no duplicar el diseño en el `admin-panel`:** si se duplicara, cualquier cambio visual de una plantilla habría que hacerlo dos veces (en el sitio real y en la preview) y correrían el riesgo de desincronizarse — mismo principio que la regla de cambio sincronizado backend↔frontend (sección 2bis), aplicado aquí entre los dos frontends. Los componentes de bloque (hero, galería, formulario de contacto...) se construyen como piezas reutilizables, importables tanto desde `web-frontend` como desde `admin-panel`.

### Flujo completo de venta, de principio a fin

1. Te sientas con el cliente (en persona, videollamada, o simplemente tú sola montándolo antes de la reunión)
2. Recorres el wizard: sector, módulos, canales de contacto, colores/contenido básico
3. El cliente ve la vista previa cambiando en tiempo real con cada decisión
4. Cuando está conforme, se pulsa "Guardar" — **aquí sí** se persiste el `Tenant` en backend (`POST` al endpoint correspondiente del módulo `tenant`, sección 3)
5. A partir de ahí, `web-frontend` sirve esa configuración ya guardada como la web real y pública del negocio

### Nota técnica para cuando se construya

No es necesario backend adicional para la vista previa en sí — es estado local de React mientras se recorre el wizard. Solo hay llamada real al backend en el paso final de guardado, y en los puntos donde se necesite cargar datos ya existentes (ej. editar un tenant ya creado en una sesión posterior, ahí sí se parte de los datos guardados en vez de un formulario vacío).

---

## 10. Frontend React — buenas prácticas (equivalente a tu enfoque en Angular)

Confirmado: shared + modules por dominio + core también es buena práctica en React. Diferencia clave: no existe el sistema de módulos del framework (no hay `NgModule` ni inyección de dependencias propia del framework) — es pura convención de carpetas. Mismo concepto que Angular standalone (14+, por defecto desde la 17), donde los `NgModule` tampoco son ya necesarios y la organización también pasa a ser por carpetas + componentes standalone + lazy loading por rutas.

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

**Estructura interna de cada módulo en `modules/`** (misma forma para todos, para que cualquier desarrollador encuentre las piezas en el mismo sitio sin importar el dominio):

```
modules/<nombre-del-modulo>/
  components/   → componentes de presentación propios de ese módulo (no reutilizables fuera de él)
  models/       → tipos/interfaces TypeScript del dominio del módulo
  services/     → llamadas HTTP y lógica de negocio del módulo (usa el cliente de core/)
  shared/       → piezas reutilizables solo dentro del propio módulo (no confundir con el shared/ global de la raíz)
```

### Decisión de estilos y base de componentes (confirmada)

Decisión tomada al evaluar shadcn/ui sobre el stack actual. Aplica distinto según el repo:

- **`solimarco-frontend` (este repo, web pública): CSS Modules en exclusiva. Sin shadcn/ui, sin Tailwind.** Los bloques de plantilla (hero, servicios, galería, contacto...) se escriben con CSS Modules siguiendo `SKILL.md`. Motivo: este repo son plantillas de marketing diseñadas a medida, no UI densa de back-office; meter Tailwind solo para shadcn crearía dos sistemas de estilo en paralelo sin aportar valor real aquí.
  - Cuando un bloque necesite un **primitivo complejo con accesibilidad** (modal, dropdown, tabs, popover, tooltip), se añade el primitivo **headless de Radix puntual** (`@radix-ui/react-*`) y se estila con CSS Modules — nunca se reescribe a mano la lógica de foco/teclado/a11y. Es "shadcn sin la capa Tailwind": se aprovecha la ingeniería de accesibilidad sin acoplarse a utilities.

- **`solimarco-panel` (admin-panel, futuro): shadcn/ui + Tailwind.** Es el lugar correcto para esa combinación, porque el panel es UI densa de dashboard (tablas de clientes, wizard multi-paso, gestión de catálogo) — justo el caso de uso donde shadcn aporta. Esta decisión se materializa al arrancar ese repo, no en el frontend público.

No se considera necesario micro-frontend: mismo argumento que con microservicios, añade complejidad de integración (module federation, versionado independiente) sin beneficio al volumen actual.

---

## 11. CI/CD con Jenkins

Como ya hay experiencia previa con Jenkins, se mantiene:
- Pipeline para `backend`: compilar, testear, desplegar al servidor elegido (Railway/Render/VPS).
- Pipeline para `web-frontend`: build + deploy, a decidir si lo dispara Jenkins o se deja la integración directa de Vercel con GitHub.

---

## 12. Orden de construcción recomendado

1. Base del backend: `core` + `auth` + `tenant` (con campos de analítica y `requiere_login_cliente` ya incluidos)
2. Modelo de datos flexible: `Reserva` + `PlantillaSector` + JSONB
3. Módulo `reservas` (sin dinero de por medio, valida que la arquitectura funciona) — validar primero con el sector piloto de construcción/reformas (sección 13), por ser el flujo de "lead a presupuestar" sin fecha/hora fija ni importe cerrado, el caso más exigente para el modelo flexible
4. Módulo `pagos` + `tickets` + webhook de Stripe (con todo el cuidado legal de la sección 1)
5. Módulo `notificaciones`
6. Módulo `estadisticas`
7. Módulo `monitorizacion` (panel de sesiones activas, actividad y resolución de incidencias — sección 9bis)
8. Módulo `paginas-legales` (sección 9ter) + soporte de `tipo_sitio` landing/completo (sección 9quater) en el `Tenant`
9. `admin-panel` (el configurador paso a paso, tipo wizard), incluyendo la vista de gestión de clientes, la edición de páginas legales, y el wizard con vista previa en tiempo real (sección 9septies)
10. `web-frontend` por tenant (lo que ve cada cliente final), con rutas condicionadas por `tipo_sitio` y `modulos_activos` — los componentes de bloque (hero, galería, contacto...) se construyen aquí como piezas reutilizables e importables también desde `admin-panel` para la vista previa

---

## 13. Sector piloto: Construcción y reformas

Se cambia el sector piloto inicial de "restaurante" a **construcción y reformas**, tomando como referencia real de mercado a [BM Construcción S.L.](https://www.bmconstruccionsl.com/) (Tenerife).

### Qué hace ese tipo de negocio (análisis de la web de referencia)

Es un negocio **híbrido**, con dos flujos de negocio distintos en la misma web — esto es importante, lo había pasado por alto en la primera revisión:

**A) Servicios de construcción/reforma → flujo de leads (sin pago online)**
- Obra nueva, reformas integrales, reformas parciales, demoliciones
- Showroom físico de materiales y marcas asociadas (Versace Ceramic, Ceramitaly)
- Proyectos realizados (portfolio) y testimonios
- CTA "Solicitar presupuesto" → abre un `mailto:`, sin formulario estructurado ni pago

**B) Tienda online de materiales → flujo de venta real, con carrito y checkout (`/tienda`, `/cart`)**
- Catálogo por categorías: **Cerámicas, Versace (gama alta), PVC, SPC, Resina Epoxi**, e incluso producto decorativo (relojes en resina, palilleros)
- Precios cerrados y visibles por producto (desde 26€ una cerámica hasta 2.405€ una pieza Versace)
- Botón "Añadir al carrito" en cada producto, carrito (`/cart`) y lista de deseos (`/wishlist`) — patrón estándar de e-commerce
- Paginación de catálogo, varias categorías con decenas de referencias

### Diferencia clave respecto a los sectores ya cubiertos (restaurante, boutique, estética)

Este sector **combina los dos flujos que ya tenemos diseñados**, en el mismo negocio:
- El módulo `reservas` (sección 5, `tipo_negocio` propio) cubre la parte de **solicitud de presupuesto** de obra/reforma — sin pago, sin fecha/hora fija, como "lead a presupuestar".
- El módulo `ventas` + `pagos` (ya diseñado para tiendas de ropa) cubre la parte de **tienda de materiales** — carrito, checkout (con o sin login, sección 6), pago real con Stripe, ticket generado.

No hace falta diseñar nada nuevo de cero: confirma que el `tipo_negocio` no determina un único flujo, sino que un mismo negocio puede activar **varios módulos a la vez** según lo que necesite. Esto es un matiz importante para el `admin-panel`: al configurar un cliente, debe poder marcarse "este negocio usa: ✅ leads/presupuestos" y/o "✅ tienda online" de forma independiente, no como una opción excluyente por sector.

```
PlantillaSector
  tipo_negocio: "construccion_reformas"
  modulos_activos: ["reservas", "ventas"]   ← NUEVO: el sector activa ambos módulos
  campos_reservas: [
    { nombre: "tipo_proyecto", tipo: "select", opciones: ["Obra nueva","Reforma integral","Reforma parcial","Demolición"], requerido: true },
    { nombre: "descripcion_proyecto", tipo: "textarea", requerido: true },
    { nombre: "direccion_inmueble", tipo: "text", requerido: false },
    { nombre: "presupuesto_estimado", tipo: "select", opciones: ["<10.000€","10.000-30.000€","30.000-60.000€",">60.000€"], requerido: false },
    { nombre: "fotos_adjuntas", tipo: "file", requerido: false }
  ]
  campos_ventas: [
    { nombre: "categoria", tipo: "select", opciones: ["Cerámicas","PVC","SPC","Resina Epoxi","Decoración"], requerido: true },
    { nombre: "precio", tipo: "number", requerido: true },
    { nombre: "stock", tipo: "number", requerido: false }
  ]
```

La parte de **leads de obra/reforma** usa la `Reserva` igual que antes: mismo modelo de datos común (sección 5), `estado` con valores propios del sector (`pendiente` → `contactado` → `presupuestado` → `aceptado`/`rechazado`), sin pasar por `pagos`.

La parte de **tienda de materiales** usa el módulo `ventas` + `pagos` ya diseñado para tiendas de ropa (sección 6, checkout con o sin login) — productos con precio cerrado, carrito, ticket generado en el webhook de Stripe, igual que para una boutique. No hay diferencia de arquitectura entre vender ropa o vender cerámicas, es el mismo flujo de e-commerce.

### Nuestro enfoque diferencial (lo que añadiríamos nosotros sobre lo que ya hace el mercado)

- Formulario de solicitud de presupuesto **estructurado** (como el de arriba) en vez de un simple `mailto:` — mejor para el negocio porque ya recibe la información clasificada y puede priorizar leads, y queda registrada en base de datos en vez de perderse en una bandeja de email.
- Gestión de catálogo de tienda (productos, precios, stock) desde el `admin-panel`, sin depender de una plataforma externa de e-commerce — todo dentro del mismo sistema que ya gestiona el resto del negocio.
- Notificación automática (módulo `notificaciones`) tanto al negocio como confirmación al cliente final, igual que en los demás sectores, válida tanto para leads como para pedidos de tienda.
- Galería de proyectos realizados gestionable desde el `admin-panel`, sin que el negocio dependa de ti para subir cada foto nueva.
- Estadísticas de visitas (módulo `estadisticas`) para que el negocio vea qué servicios y qué productos generan más interés.

### Validación del modelo `PlantillaSector` y de la arquitectura general

Este sector es la mejor prueba de estrés posible para lo ya diseñado, por dos motivos:

1. Confirma que el campo `detalles JSONB` y el `estado` configurable por sector cubren también flujos de tipo "lead a presupuestar" (sin fecha/hora ni importe cerrado), no solo "reserva con hora" o "venta" en sentido estricto.
2. Confirma que un mismo `tenant` puede tener **más de un módulo activo a la vez** (`reservas` + `ventas`), validando que la arquitectura modular del backend (sección 3) y el diseño de `PlantillaSector` están pensados correctamente como piezas combinables, no como un único flujo fijo por sector.

---

## Plan de migración — al firmar el primer cliente

Checklist de cambios de infraestructura a ejecutar en cuanto se firme el primer cliente real (pagando). Avisar explícitamente cuando llegue ese momento para activar este bloque.

### 1. Hosting frontend — Vercel
- [ ] Pasar de Hobby a **Pro** ($20/mes) — obligatorio por términos de uso comercial, no opcional
- [ ] Activar Spend Management con alerta de gasto, para evitar sorpresas de facturación por overages

### 2. Hosting backend — Render
- [ ] Pasar el servicio web de Free a **Starter** (~$7/mes) — elimina el spin-down
- [ ] Pasar la base de datos PostgreSQL de Free a **Basic** (~$6/mes) — elimina el borrado automático a 30 días, persistencia real
- [ ] Migrar los datos de la BBDD free (si los hay) a la nueva BBDD de pago antes de que caduque la gratuita
- [ ] No hace falta la cuota de workspace ($19/usuario/mes) mientras se trabaje sola

### 3. Pagos — Stripe
- [ ] Activar cuenta Stripe Connect verificada (KYC del negocio propio)
- [ ] Dar de alta al negocio cliente como cuenta conectada (Stripe pedirá su documentación: identificación, dirección, web asociada)
- [ ] Configurar y probar el webhook en entorno de producción (no solo en pruebas/sandbox)
- [ ] Confirmar con gestor/abogado fiscal el tratamiento de facturación de las comisiones (Modelo 303 + 349, ver sección 1)

### 4. Dominio propio del cliente (si lo pide)
- [ ] El cliente compra su dominio (titular: el cliente, no tú)
- [ ] Configurar DNS apuntando a Vercel (ver guía paso a paso ya cubierta en esta conversación)
- [ ] Verificar HTTPS activo automáticamente

### 5. Legal
- [ ] Aviso legal, política de privacidad y términos de venta publicados en la web del cliente (LSSI-CE + RGPD)
- [ ] Contrato de servicios firmado con el cliente (ya existe plantilla: `contrato-solimarco.docx`)
- [ ] Alta de autónoma si aún no se ha hecho (ver trámites ya cubiertos en sesiones anteriores)

### 6. Jenkins / CI-CD (si ya está montado)
- [ ] Añadir pipeline de despliegue a producción, separado del de pruebas
- [ ] Confirmar que los tests bloquean el despliegue si fallan, antes de tocar producción con datos reales

### 7. Confluence
- [ ] Documentar la configuración específica de este primer cliente (tenant, sector, módulos activos) en su página correspondiente

---

## Pendiente de decidir antes de empezar a programar

- [ ] Confirmar con gestor/abogado los detalles de facturación entre las partes al usar Stripe Connect (tú facturas tu comisión, el negocio factura su venta) — la figura legal general ya está bastante clara, ver sección 1
- [x] Proveedor de hosting backend: **Render, plan Hobby (gratis)** para empezar — ver sección 2bis. Al firmar el primer cliente, pasar a pago: ~$7/mes (servicio) + ~$6/mes (base de datos) ≈ $13/mes, sin necesidad de la cuota de workspace de $19/usuario mientras se trabaje sola.
- [x] Sector piloto definido: **Construcción y reformas**, tomando como referencia de mercado a BM Construcción S.L. (bmconstruccionsl.com). Ver sección 13 para el análisis y el enfoque propio.
