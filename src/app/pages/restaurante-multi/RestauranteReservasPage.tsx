import styles from './restaurantePages.module.css'
import { TableReservationForm } from '../../../shared/components/TableReservationForm'
import { SharedSeo } from '../../../shared/seo'
import { usePageTracking } from '../../../modules/tracking/hooks/usePageTracking'
import { BUSINESS, RESTAURANT_TENANT_ID, SITE_URL } from './restauranteData'

/** Table reservation page of the multi-page restaurant site. */
export default function RestauranteReservasPage() {
  usePageTracking(RESTAURANT_TENANT_ID)

  return (
    <>
      <SharedSeo
        title="Reservar mesa | Restaurante El Drago"
        description="Reserva tu mesa en Restaurante El Drago, Puerto de la Cruz. Indica fecha, hora y número de comensales y te confirmamos por email."
        canonicalUrl={`${SITE_URL}/reservas`}
      />

      <section className={styles.page} aria-labelledby="reservas-title">
        <h1 id="reservas-title" className={styles.title}>
          Reserva tu mesa
        </h1>
        <p className={styles.intro}>
          Reserva online en menos de un minuto. Para grupos de más de 10 personas o eventos,
          llámanos al <a href={`tel:${BUSINESS.phone.replace(/[^\d+]/g, '')}`}>{BUSINESS.phone}</a> y
          te lo organizamos.
        </p>
        <TableReservationForm tenantId={RESTAURANT_TENANT_ID} />
      </section>
    </>
  )
}
