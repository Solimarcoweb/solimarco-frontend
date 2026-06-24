# Modelo de datos — reservas, login de cliente y tickets

> Extraído de `CLAUDE.md` (antiguas secciones 5, 6 y 7).

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

**Nota importante (confirmada con el sector piloto, ver [sector-construccion.md](./sector-construccion.md)):** un mismo negocio puede necesitar **más de un módulo de negocio a la vez** — por ejemplo, una constructora que recibe solicitudes de presupuesto (`reservas`) y además vende materiales online (`ventas`). Por eso `PlantillaSector` no asocia un único flujo por sector, sino una lista de `modulos_activos` configurable. Esto no cambia el modelo de datos de esta sección: cada módulo sigue usando su propia tabla común (`Reserva` o `Pedido`), simplemente un mismo `tenant_id` puede tener filas en varias a la vez.

**Trade-off asumido:** se pierde validación estricta a nivel de base de datos en los campos del JSONB (no hay "esto debe ser número" forzado por la BBDD). La validación se hace en el `service`, usando `PlantillaSector` como referencia antes de guardar. Razonable a cambio de flexibilidad real entre sectores tan distintos.

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
