# Hosting e infraestructura

> Extraído de `CLAUDE.md` (antiguas secciones "2bis. Hosting del backend" y 11).

## Hosting del backend — opciones gratuitas y coste real al escalar (investigado)

No hay un "gratis ilimitado y permanente" real para un backend siempre activo, pero sí hay opciones razonables para empezar sin coste mientras no haya clientes pagando:

- **Render (recomendado para empezar):** mantiene un nivel gratuito (plan Hobby) sin cuota mensual, con 750 horas/mes para servicios web — alcanza justo para tener **un servicio corriendo 24/7 todo el mes** (24h × 31 días ≈ 744h). El backend completo (monolito modular, con todos sus módulos incluido `notificaciones`) sigue siendo un único servicio/instancia, tal como está diseñado (ver [build-order.md](./build-order.md)) — esto no cambia ni en el plan free ni en el de pago. El matiz real del plan gratuito: si el servicio queda inactivo un rato, la primera petición tras la inactividad tarda cerca de un minuto en "despertar" (spin-down), y además **la base de datos PostgreSQL gratuita se borra automáticamente a los 30 días**, sin periodo de gracia — esto último es importante, no es solo una molestia de rendimiento, hay riesgo real de perder datos si se olvida migrar a tiempo.

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

## CI/CD con Jenkins

Como ya hay experiencia previa con Jenkins, se mantiene:
- Pipeline para `backend`: compilar, testear, desplegar al servidor elegido (Railway/Render/VPS).
- Pipeline para `web-frontend`: build + deploy, a decidir si lo dispara Jenkins o se deja la integración directa de Vercel con GitHub.
