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

/** Lifecycle of the budget form submission. */
export type BudgetFormState = 'idle' | 'submitting' | 'success' | 'error'
