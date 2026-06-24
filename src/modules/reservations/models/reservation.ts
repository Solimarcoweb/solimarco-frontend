/** Service categories offered for the construction/reform sector budget form. */
export type ServiceType = 'obra-nueva' | 'reforma-integral' | 'reforma-parcial' | 'otro'

/** Shape of the data collected by the budget request form. */
export interface BudgetFormData {
  name: string
  phone: string
  email: string
  serviceType: ServiceType
  /** Free-text description of the project. */
  description: string
  /** Optional preferred date (ISO `yyyy-mm-dd`), when the client has one in mind. */
  preferredDate?: string
}

/** Generic lifecycle of an async form submission. */
export type SubmissionState = 'idle' | 'submitting' | 'success' | 'error'

/** Lifecycle of the budget form submission. */
export type BudgetFormState = SubmissionState

/** Shape of the data collected by the table reservation form. */
export interface TableReservationData {
  name: string
  email: string
  phone: string
  /** Reservation date, ISO `yyyy-mm-dd`. */
  date: string
  /** Reservation time, 24h `HH:MM`. */
  time: string
  /** Number of guests (1–20). */
  guests: number
  /** Optional free-text notes (allergies, occasion...). */
  notes?: string
}
