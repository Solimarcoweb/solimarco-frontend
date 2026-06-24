# Plan de migración y pendientes — al firmar el primer cliente

> Extraído de `CLAUDE.md` (antiguas secciones "Plan de migración" y "Pendiente de decidir antes de empezar a programar").

Checklist de cambios de infraestructura a ejecutar en cuanto se firme el primer cliente real (pagando). Avisar explícitamente cuando llegue ese momento para activar este bloque.

## 1. Hosting frontend — Vercel
- [ ] Pasar de Hobby a **Pro** ($20/mes) — obligatorio por términos de uso comercial, no opcional
- [ ] Activar Spend Management con alerta de gasto, para evitar sorpresas de facturación por overages

## 2. Hosting backend — Render
- [ ] Pasar el servicio web de Free a **Starter** (~$7/mes) — elimina el spin-down
- [ ] Pasar la base de datos PostgreSQL de Free a **Basic** (~$6/mes) — elimina el borrado automático a 30 días, persistencia real
- [ ] Migrar los datos de la BBDD free (si los hay) a la nueva BBDD de pago antes de que caduque la gratuita
- [ ] No hace falta la cuota de workspace ($19/usuario/mes) mientras se trabaje sola

(Ver detalle completo en [hosting.md](./hosting.md).)

## 3. Pagos — Stripe
- [ ] Activar cuenta Stripe Connect verificada (KYC del negocio propio)
- [ ] Dar de alta al negocio cliente como cuenta conectada (Stripe pedirá su documentación: identificación, dirección, web asociada)
- [ ] Configurar y probar el webhook en entorno de producción (no solo en pruebas/sandbox)
- [ ] Confirmar con gestor/abogado fiscal el tratamiento de facturación de las comisiones (Modelo 303 + 349, ver [legal-payments.md](./legal-payments.md))

## 4. Dominio propio del cliente (si lo pide)
- [ ] El cliente compra su dominio (titular: el cliente, no tú)
- [ ] Configurar DNS apuntando a Vercel (ver guía paso a paso ya cubierta en esta conversación)
- [ ] Verificar HTTPS activo automáticamente

## 5. Legal
- [ ] Aviso legal, política de privacidad y términos de venta publicados en la web del cliente (LSSI-CE + RGPD)
- [ ] Contrato de servicios firmado con el cliente (ya existe plantilla: `contrato-solimarco.docx`)
- [ ] Alta de autónoma si aún no se ha hecho (ver trámites ya cubiertos en sesiones anteriores)

## 6. Jenkins / CI-CD (si ya está montado)
- [ ] Añadir pipeline de despliegue a producción, separado del de pruebas
- [ ] Confirmar que los tests bloquean el despliegue si fallan, antes de tocar producción con datos reales

## 7. Confluence
- [ ] Documentar la configuración específica de este primer cliente (tenant, sector, módulos activos) en su página correspondiente

## Pendiente de decidir antes de empezar a programar

- [ ] Confirmar con gestor/abogado los detalles de facturación entre las partes al usar Stripe Connect (tú facturas tu comisión, el negocio factura su venta) — la figura legal general ya está bastante clara, ver [legal-payments.md](./legal-payments.md)
- [x] Proveedor de hosting backend: **Render, plan Hobby (gratis)** para empezar — ver [hosting.md](./hosting.md). Al firmar el primer cliente, pasar a pago: ~$7/mes (servicio) + ~$6/mes (base de datos) ≈ $13/mes, sin necesidad de la cuota de workspace de $19/usuario mientras se trabaje sola.
- [x] Sector piloto definido: **Construcción y reformas**, tomando como referencia de mercado a BM Construcción S.L. (bmconstruccionsl.com). Ver [sector-construccion.md](./sector-construccion.md) para el análisis y el enfoque propio.
