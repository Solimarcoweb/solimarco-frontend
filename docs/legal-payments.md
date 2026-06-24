# Legalidad y seguridad en pagos

> Extraído de `CLAUDE.md` (antigua sección 1). No negociable.

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
