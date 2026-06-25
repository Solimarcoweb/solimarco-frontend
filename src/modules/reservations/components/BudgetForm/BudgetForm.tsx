import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './BudgetForm.module.css'
import type { BudgetFormData, BudgetFormState, ServiceType } from '../../models/reservation'
import { submitBudgetRequest } from '../../services/reservationService'
import { RateLimitError } from '../../../../core/http/apiClient'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Translation key paired with its ServiceType value. */
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

export interface BudgetFormProps {
  /** Tenant slug the lead belongs to; forwarded to the reservation service. */
  tenantId: string
  /**
   * Submit handler. Defaults to POSTing to `/api/reservations` via the
   * reservation service; injectable so tests/stories can drive the lifecycle
   * without hitting the network.
   */
  onSubmit?: (data: BudgetFormData) => Promise<unknown>
}

/** Returns the ARIA wiring for a control given its id and current error. */
function describedBy(id: string, error: string | undefined) {
  return error ? ({ 'aria-invalid': true, 'aria-describedby': `${id}-error` } as const) : {}
}

interface FieldProps {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}

/** Label + control + error wrapper, keeping the a11y markup consistent per field. */
function Field({ id, label, error, optional, children }: FieldProps) {
  const { t } = useTranslation()
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> {t('forms.common.optional')}</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className={styles.error} role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Structured budget request form for the construction/reform sector.
 * Manages its own field/validation state and submission lifecycle
 * (idle → submitting → success | error) with no form library.
 *
 * @param props.tenantId - Tenant slug the lead belongs to.
 * @param props.onSubmit - Submit handler; defaults to the reservation service.
 * @returns The form, or a confirmation panel once submitted successfully.
 */
export function BudgetForm({ tenantId, onSubmit }: BudgetFormProps) {
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
    if (Object.keys(nextErrors).length > 0) {
      return
    }

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
      <section className={styles.form} role="status" aria-live="polite">
        <h3 className={styles.successTitle}>{t('forms.budget.success.title')}</h3>
        <p className={styles.successText}>{t('forms.budget.success.text')}</p>
      </section>
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
      <Field id={fieldId('name')} label={t('forms.budget.fields.name')} error={errors.name}>
        <input
          id={fieldId('name')}
          className={styles.control}
          type="text"
          autoComplete="name"
          value={data.name}
          onChange={(event) => updateField('name', event.target.value)}
          {...describedBy(fieldId('name'), errors.name)}
        />
      </Field>

      <Field id={fieldId('phone')} label={t('forms.budget.fields.phone')} error={errors.phone}>
        <input
          id={fieldId('phone')}
          className={styles.control}
          type="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(event) => updateField('phone', event.target.value)}
          {...describedBy(fieldId('phone'), errors.phone)}
        />
      </Field>

      <Field id={fieldId('email')} label={t('forms.budget.fields.email')} error={errors.email}>
        <input
          id={fieldId('email')}
          className={styles.control}
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(event) => updateField('email', event.target.value)}
          {...describedBy(fieldId('email'), errors.email)}
        />
      </Field>

      <Field id={fieldId('serviceType')} label={t('forms.budget.fields.serviceType')}>
        <select
          id={fieldId('serviceType')}
          className={styles.control}
          value={data.serviceType}
          // Options are constrained to ServiceType values, so the cast is safe.
          onChange={(event) => updateField('serviceType', event.target.value as ServiceType)}
        >
          {SERVICE_OPTION_KEYS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {t(opt.key)}
            </option>
          ))}
        </select>
      </Field>

      <Field
        id={fieldId('description')}
        label={t('forms.budget.fields.description')}
        error={errors.description}
      >
        <textarea
          id={fieldId('description')}
          className={styles.control}
          rows={4}
          value={data.description}
          onChange={(event) => updateField('description', event.target.value)}
          {...describedBy(fieldId('description'), errors.description)}
        />
      </Field>

      <Field id={fieldId('preferredDate')} label={t('forms.budget.fields.preferredDate')} optional>
        <input
          id={fieldId('preferredDate')}
          className={styles.control}
          type="date"
          value={data.preferredDate ?? ''}
          onChange={(event) => updateField('preferredDate', event.target.value)}
        />
      </Field>

      {state === 'error' && (
        <p className={styles.errorBanner} role="alert">
          {retryAfter !== null
            ? t('forms.common.rateLimited', { seconds: retryAfter })
            : t('forms.budget.errors.sendFailed')}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? t('forms.common.submitting') : t('forms.budget.submit')}
      </button>
    </form>
  )
}
