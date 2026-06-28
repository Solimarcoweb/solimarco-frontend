import styles from './restaurantePages.module.css'
import { TableReservationForm } from '../../../shared/components/TableReservationForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { useTenantConfig } from '../../../core/tenant/TenantContext'
import { RESTAURANTE_BASE_PATH } from '../restaurante-landing/restauranteShared'

/** Table reservation page of the multi-page restaurant site. */
export default function RestauranteReservasPage() {
  const config = useTenantConfig()
  usePageTracking(config.tenantId)

  const phone = config.phone ?? ''

  return (
    <>
      <SharedSeo
        title={`Reservar mesa | ${config.businessName}`}
        description={`Reserva tu mesa en ${config.businessName}. Indica fecha, hora y número de comensales y te confirmamos por email.`}
        canonicalUrl={`${window.location.origin}${RESTAURANTE_BASE_PATH}/reservas`}
      />

      <section className={styles.page} aria-labelledby="reservas-title">
        <h1 id="reservas-title" className={styles.title}>
          Reserva tu mesa
        </h1>

        {config.modules?.hasReservations === false ? (
          <p className={styles.status} role="status">
            Las reservas online no están disponibles. Llámanos
            {phone && (
              <>
                {' '}
                al <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
              </>
            )}
            .
          </p>
        ) : (
          <>
            <p className={styles.intro}>
              Reserva online en menos de un minuto. Para grupos grandes o eventos
              {phone && (
                <>
                  , llámanos al <a href={`tel:${phone.replace(/[^\d+]/g, '')}`}>{phone}</a>
                </>
              )}
              .
            </p>
            <TableReservationForm tenantId={config.tenantId} />
          </>
        )}
      </section>
    </>
  )
}
