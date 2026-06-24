/** A single page-view event sent to the backend tracking endpoint. */
export interface TrackingEvent {
  /** Tenant the visit belongs to. */
  tenantId: string
  /** Path of the visited page, e.g. "/tienda". */
  path: string
  /** Optional referrer URL the visit came from, when available. */
  referrer?: string
}
