# Sector piloto: Construcción y reformas

> Extraído de `CLAUDE.md` (antigua sección 13).

Se cambia el sector piloto inicial de "restaurante" a **construcción y reformas**, tomando como referencia real de mercado a [BM Construcción S.L.](https://www.bmconstruccionsl.com/) (Tenerife).

## Qué hace ese tipo de negocio (análisis de la web de referencia)

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

## Diferencia clave respecto a los sectores ya cubiertos (restaurante, boutique, estética)

Este sector **combina los dos flujos que ya tenemos diseñados**, en el mismo negocio:
- El módulo `reservas` (ver [data-model.md](./data-model.md), `tipo_negocio` propio) cubre la parte de **solicitud de presupuesto** de obra/reforma — sin pago, sin fecha/hora fija, como "lead a presupuestar".
- El módulo `ventas` + `pagos` (ya diseñado para tiendas de ropa) cubre la parte de **tienda de materiales** — carrito, checkout (con o sin login, ver [data-model.md](./data-model.md)), pago real con Stripe, ticket generado.

No hace falta diseñar nada nuevo de cero: confirma que el `tipo_negocio` no determina un único flujo, sino que un mismo negocio puede activar **varios módulos a la vez** según lo que necesite. Esto es un matiz importante para el `admin-panel`: al configurar un cliente, debe poder marcarse "este negocio usa: ✅ leads/presupuestos" y/o "✅ tienda online" de forma independiente, no como una opción excluyente por sector.

```
PlantillaSector
  tipo_negocio: "construccion_reformas"
  modulos_activos: ["reservas", "ventas"]   ← el sector activa ambos módulos
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

La parte de **leads de obra/reforma** usa la `Reserva` igual que antes: mismo modelo de datos común (ver [data-model.md](./data-model.md)), `estado` con valores propios del sector (`pendiente` → `contactado` → `presupuestado` → `aceptado`/`rechazado`), sin pasar por `pagos`.

La parte de **tienda de materiales** usa el módulo `ventas` + `pagos` ya diseñado para tiendas de ropa (checkout con o sin login) — productos con precio cerrado, carrito, ticket generado en el webhook de Stripe, igual que para una boutique. No hay diferencia de arquitectura entre vender ropa o vender cerámicas, es el mismo flujo de e-commerce.

## Nuestro enfoque diferencial (lo que añadiríamos nosotros sobre lo que ya hace el mercado)

- Formulario de solicitud de presupuesto **estructurado** (como el de arriba) en vez de un simple `mailto:` — mejor para el negocio porque ya recibe la información clasificada y puede priorizar leads, y queda registrada en base de datos en vez de perderse en una bandeja de email.
- Gestión de catálogo de tienda (productos, precios, stock) desde el `admin-panel`, sin depender de una plataforma externa de e-commerce — todo dentro del mismo sistema que ya gestiona el resto del negocio.
- Notificación automática (módulo `notificaciones`) tanto al negocio como confirmación al cliente final, igual que en los demás sectores, válida tanto para leads como para pedidos de tienda.
- Galería de proyectos realizados gestionable desde el `admin-panel`, sin que el negocio dependa de ti para subir cada foto nueva.
- Estadísticas de visitas (módulo `estadisticas`) para que el negocio vea qué servicios y qué productos generan más interés.

## Validación del modelo `PlantillaSector` y de la arquitectura general

Este sector es la mejor prueba de estrés posible para lo ya diseñado, por dos motivos:

1. Confirma que el campo `detalles JSONB` y el `estado` configurable por sector cubren también flujos de tipo "lead a presupuestar" (sin fecha/hora ni importe cerrado), no solo "reserva con hora" o "venta" en sentido estricto.
2. Confirma que un mismo `tenant` puede tener **más de un módulo activo a la vez** (`reservas` + `ventas`), validando que la arquitectura modular del backend y el diseño de `PlantillaSector` están pensados correctamente como piezas combinables, no como un único flujo fijo por sector.
