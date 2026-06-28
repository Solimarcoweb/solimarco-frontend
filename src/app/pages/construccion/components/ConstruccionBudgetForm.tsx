import { useId, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './ConstruccionBudgetForm.module.css'
import type {
  BudgetFormData,
  BudgetFormState,
  ServiceType,
} from '../../../../modules/reservations/models/reservation'
import { submitBudgetRequest } from '../../../../modules/reservations/services/reservationService'
import { RateLimitError } from '../../../../core/http/apiClient'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Service option value paired with its i18n key (shared budget translations). */
const SERVICE_OPTION_KEYS: { value: ServiceType; key: string }[] = [
  { value: 'obra-nueva', key: 'forms.budget.serviceOptions.obraNueva' },
  { value: 'reforma-integral', key: 'forms.budget.serviceOptions.reformaIntegral' },
  { value: 'reforma-parcial', key: 'forms.budget.serviceOptions.reformaParcial' },
  { value: 'otro', key: 'forms.budget.serviceOptions.otro' },
]

const INITIAL_DATA: BudgetFormData = {
  name: '',
  phone: '',
  email: '',
  serviceType: 'obra-nueva',
  description: '',
  preferredDate: '',
}

type FieldErrors = Partial<Record<keyof BudgetFormData, string>>

export interface ConstruccionBudgetFormProps {
  /** Tenant slug the lead belongs to; forwarded to the reservation service. */
  tenantId: string
  /**
   * Submit handler. Defaults to POSTing to `/api/reservations` via the shared
   * reservation service (same endpoint/logic as the shared BudgetForm);
   * injectable so tests/stories can drive the lifecycle without the network.
   */
  onSubmit?: (data: BudgetFormData) => Promise<unknown>
}

/** ARIA wiring for a control given its id and current error. */
function describedBy(id: string, error: string | undefined) {
  return error ? ({ 'aria-invalid': true, 'aria-describedby': `${id}-error` } as const) : {}
}

/**
 * Sector-local budget request form for the construccion landing. Reuses the
 * exact submit logic, validation and i18n of the shared BudgetForm
 * (`submitBudgetRequest` → `/api/reservations`) but renders the redesign's
 * underline-only fields in a two-column layout. Independent from the shared
 * component, which stays untouched.
 *
 * @param props.tenantId - Tenant slug the lead belongs to.
 * @param props.onSubmit - Submit handler; defaults to the reservation service.
 * @returns The form, or a confirmation panel once submitted successfully.
 */
export default function ConstruccionBudgetForm({ tenantId, onSubmit }: ConstruccionBudgetFormProps) {
  const submit = onSubmit ?? ((data: BudgetFormData) => submitBudgetRequest(tenantId, data))
  const { t } = useTranslation()
  const baseId = useId()
  const [data, setData] = useState<BudgetFormData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [state, setState] = useState<BudgetFormState>('idle')
  // Seconds to wait after a 429; null means the last error was not a rate limit.
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  const fieldId = (name: keyof BudgetFormData) => `${baseId}-${name}`

  function updateField<K extends keyof BudgetFormData>(field: K, value: BudgetFormData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function validate(values: BudgetFormData): FieldErrors {
    const next: FieldErrors = {}
    if (!values.name.trim()) next.name = t('forms.budget.errors.nameRequired')
    if (!values.phone.trim()) next.phone = t('forms.budget.errors.phoneRequired')
    if (!values.email.trim()) next.email = t('forms.budget.errors.emailRequired')
    else if (!EMAIL_PATTERN.test(values.email)) next.email = t('forms.budget.errors.emailInvalid')
    if (!values.description.trim()) next.description = t('forms.budget.errors.descriptionRequired')
    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setState('submitting')
    const payload: BudgetFormData = {
      ...data,
      preferredDate: data.preferredDate?.trim() ? data.preferredDate : undefined,
    }
    try {
      await submit(payload)
      setState('success')
    } catch (error) {
      setRetryAfter(error instanceof RateLimitError ? error.retryAfter : null)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className={styles.ok} role="status" aria-live="polite">
        <h3 className={styles.okTitle}>{t('forms.budget.success.title')}</h3>
        <p className={styles.okText}>{t('forms.budget.success.text')}</p>
      </div>
    )
  }

  const isSubmitting = state === 'submitting'

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label={t('forms.budget.ariaLabel')}
      noValidate
    >
      <div className={styles.field}>
        <label className={styles.label} htmlFor={fieldId('name')}>
          {t('forms.budget.fields.name')}
        </label>
        <input
          id={fieldId('name')}
          className={styles.control}
          type="text"
          autoComplete="name"
          value={data.name}
          onChange={(e) => updateField('name', e.target.value)}
          {...describedBy(fieldId('name'), errors.name)}
        />
        {errors.name && (
          <p id={`${fieldId('name')}-error`} className={styles.error} role="alert">
            {errors.name}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={fieldId('email')}>
          {t('forms.budget.fields.email')}
        </label>
        <input
          id={fieldId('email')}
          className={styles.control}
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          {...describedBy(fieldId('email'), errors.email)}
        />
        {errors.email && (
          <p id={`${fieldId('email')}-error`} className={styles.error} role="alert">
            {errors.email}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={fieldId('phone')}>
          {t('forms.budget.fields.phone')}
        </label>
        <input
          id={fieldId('phone')}
          className={styles.control}
          type="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          {...describedBy(fieldId('phone'), errors.phone)}
        />
        {errors.phone && (
          <p id={`${fieldId('phone')}-error`} className={styles.error} role="alert">
            {errors.phone}
          </p>
        )}
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor={fieldId('serviceType')}>
          {t('construccion.formProjectType')}
        </label>
        <select
          id={fieldId('serviceType')}
          className={styles.control}
          value={data.serviceType}
          // Options are constrained to ServiceType values, so the cast is safe.
          onChange={(e) => updateField('serviceType', e.target.value as ServiceType)}
        >
          {SERVICE_OPTION_KEYS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.key)}
            </option>
          ))}
        </select>
      </div>

      <div className={`${styles.field} ${styles.full}`}>
        <label className={styles.label} htmlFor={fieldId('description')}>
          {t('construccion.formMessage')}
        </label>
        <textarea
          id={fieldId('description')}
          className={styles.control}
          rows={3}
          value={data.description}
          onChange={(e) => updateField('description', e.target.value)}
          {...describedBy(fieldId('description'), errors.description)}
        />
        {errors.description && (
          <p id={`${fieldId('description')}-error`} className={styles.error} role="alert">
            {errors.description}
          </p>
        )}
      </div>

      {state === 'error' && (
        <p className={`${styles.full} ${styles.banner}`} role="alert">
          {retryAfter !== null
            ? t('forms.common.rateLimited', { seconds: retryAfter })
            : t('forms.budget.errors.sendFailed')}
        </p>
      )}

      <button type="submit" className={`${styles.full} ${styles.submit}`} disabled={isSubmitting}>
        {isSubmitting ? t('forms.common.submitting') : t('construccion.formSubmit')} →
      </button>
    </form>
  )
}
