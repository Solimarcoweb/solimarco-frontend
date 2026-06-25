import { useId, useState, type FormEvent, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styles from './AppointmentForm.module.css'
import type { AppointmentData, SubmissionState } from '../../../modules/reservations/models/reservation'
import { submitAppointment } from '../../../modules/reservations/services/reservationService'
import { RateLimitError } from '../../../core/http/apiClient'
import type { Service } from '../ServicesList'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const INITIAL_DATA: AppointmentData = {
  name: '',
  phone: '',
  email: '',
  serviceId: '',
  preferredDate: '',
  preferredTime: '',
  vehicleBrand: '',
  vehicleModel: '',
  notes: '',
}

type FieldErrors = Partial<Record<keyof AppointmentData, string>>

export interface AppointmentFormProps {
  /** Tenant the appointment belongs to. */
  tenantId: string
  /** Available services; used to populate the service selector. */
  services: Service[]
  /**
   * Submit handler. Defaults to POSTing via the reservation service; injectable
   * so tests/stories can drive the lifecycle without hitting the network.
   */
  onSubmit?: (data: AppointmentData) => void | Promise<unknown>
}

/** Returns today's date as a `yyyy-mm-dd` string in local time. */
function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
}

/** Returns ARIA wiring for a field given its id and current error. */
function describedBy(id: string, error: string | undefined) {
  return error ? ({ 'aria-invalid': true as const, 'aria-describedby': `${id}-error` } as const) : {}
}

interface FieldProps {
  id: string
  label: string
  error?: string
  optional?: boolean
  children: ReactNode
}

/** Consistent label + control + inline error wrapper. */
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
 * Appointment request form for mechanic/workshop tenants.
 * Manages field state, client-side validation and the submission lifecycle
 * (idle → submitting → success | error). Posts to the shared reservation
 * service by default. Mobile-first.
 *
 * @param props.tenantId - Tenant the appointment belongs to.
 * @param props.services - Available services to populate the select.
 * @param props.onSubmit - Submit handler; defaults to the reservation service.
 * @returns The form, or a confirmation panel after a successful submission.
 */
export function AppointmentForm({ tenantId, services, onSubmit }: AppointmentFormProps) {
  const { t } = useTranslation()
  const baseId = useId()
  const [data, setData] = useState<AppointmentData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [state, setState] = useState<SubmissionState>('idle')
  // Seconds to wait after a 429; null means the last error was not a rate limit.
  const [retryAfter, setRetryAfter] = useState<number | null>(null)

  const fieldId = (name: keyof AppointmentData) => `${baseId}-${name}`

  function updateField<K extends keyof AppointmentData>(field: K, value: AppointmentData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function validate(values: AppointmentData): FieldErrors {
    const next: FieldErrors = {}
    if (!values.name.trim()) next.name = t('forms.appointment.errors.nameRequired')
    if (!values.phone.trim()) next.phone = t('forms.appointment.errors.phoneRequired')
    if (!values.email.trim()) next.email = t('forms.appointment.errors.emailRequired')
    else if (!EMAIL_PATTERN.test(values.email)) next.email = t('forms.appointment.errors.emailInvalid')
    if (!values.serviceId) next.serviceId = t('forms.appointment.errors.serviceRequired')
    if (!values.preferredDate) next.preferredDate = t('forms.appointment.errors.dateRequired')
    else if (values.preferredDate < todayIso()) next.preferredDate = t('forms.appointment.errors.datePast')
    if (!values.preferredTime) next.preferredTime = t('forms.appointment.errors.timeRequired')
    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    const payload: AppointmentData = {
      ...data,
      vehicleBrand: data.vehicleBrand?.trim() || undefined,
      vehicleModel: data.vehicleModel?.trim() || undefined,
      notes: data.notes?.trim() || undefined,
    }

    setState('submitting')
    try {
      if (onSubmit) {
        await onSubmit(payload)
      } else {
        await submitAppointment(tenantId, payload)
      }
      setState('success')
    } catch (error) {
      setRetryAfter(error instanceof RateLimitError ? error.retryAfter : null)
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <section className={styles.form} role="status" aria-live="polite">
        <h3 className={styles.successTitle}>{t('forms.appointment.success.title')}</h3>
        <p className={styles.successText}>{t('forms.appointment.success.text')}</p>
      </section>
    )
  }

  const isSubmitting = state === 'submitting'

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label={t('forms.appointment.ariaLabel')}
      noValidate
    >
      <Field id={fieldId('name')} label={t('forms.appointment.fields.name')} error={errors.name}>
        <input
          id={fieldId('name')}
          className={styles.control}
          type="text"
          autoComplete="name"
          value={data.name}
          onChange={(e) => updateField('name', e.target.value)}
          {...describedBy(fieldId('name'), errors.name)}
        />
      </Field>

      <Field id={fieldId('phone')} label={t('forms.appointment.fields.phone')} error={errors.phone}>
        <input
          id={fieldId('phone')}
          className={styles.control}
          type="tel"
          autoComplete="tel"
          value={data.phone}
          onChange={(e) => updateField('phone', e.target.value)}
          {...describedBy(fieldId('phone'), errors.phone)}
        />
      </Field>

      <Field id={fieldId('email')} label={t('forms.appointment.fields.email')} error={errors.email}>
        <input
          id={fieldId('email')}
          className={styles.control}
          type="email"
          autoComplete="email"
          value={data.email}
          onChange={(e) => updateField('email', e.target.value)}
          {...describedBy(fieldId('email'), errors.email)}
        />
      </Field>

      <Field id={fieldId('serviceId')} label={t('forms.appointment.fields.service')} error={errors.serviceId}>
        <select
          id={fieldId('serviceId')}
          className={styles.control}
          value={data.serviceId}
          onChange={(e) => updateField('serviceId', e.target.value)}
          {...describedBy(fieldId('serviceId'), errors.serviceId)}
        >
          <option value="">{t('forms.appointment.fields.servicePlaceholder')}</option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>
              {svc.name}
            </option>
          ))}
        </select>
      </Field>

      <div className={styles.row}>
        <Field id={fieldId('preferredDate')} label={t('forms.appointment.fields.preferredDate')} error={errors.preferredDate}>
          <input
            id={fieldId('preferredDate')}
            className={styles.control}
            type="date"
            min={todayIso()}
            value={data.preferredDate}
            onChange={(e) => updateField('preferredDate', e.target.value)}
            {...describedBy(fieldId('preferredDate'), errors.preferredDate)}
          />
        </Field>

        <Field id={fieldId('preferredTime')} label={t('forms.appointment.fields.preferredTime')} error={errors.preferredTime}>
          <input
            id={fieldId('preferredTime')}
            className={styles.control}
            type="time"
            value={data.preferredTime}
            onChange={(e) => updateField('preferredTime', e.target.value)}
            {...describedBy(fieldId('preferredTime'), errors.preferredTime)}
          />
        </Field>
      </div>

      <div className={styles.row}>
        <Field id={fieldId('vehicleBrand')} label={t('forms.appointment.fields.vehicleBrand')} optional>
          <input
            id={fieldId('vehicleBrand')}
            className={styles.control}
            type="text"
            autoComplete="off"
            placeholder={t('forms.appointment.fields.vehicleBrandPlaceholder')}
            value={data.vehicleBrand ?? ''}
            onChange={(e) => updateField('vehicleBrand', e.target.value)}
          />
        </Field>

        <Field id={fieldId('vehicleModel')} label={t('forms.appointment.fields.vehicleModel')} optional>
          <input
            id={fieldId('vehicleModel')}
            className={styles.control}
            type="text"
            autoComplete="off"
            placeholder={t('forms.appointment.fields.vehicleModelPlaceholder')}
            value={data.vehicleModel ?? ''}
            onChange={(e) => updateField('vehicleModel', e.target.value)}
          />
        </Field>
      </div>

      <Field id={fieldId('notes')} label={t('forms.appointment.fields.notes')} optional>
        <textarea
          id={fieldId('notes')}
          className={styles.control}
          rows={3}
          placeholder={t('forms.appointment.fields.notesPlaceholder')}
          value={data.notes ?? ''}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </Field>

      {state === 'error' && (
        <p className={styles.errorBanner} role="alert">
          {retryAfter !== null
            ? t('forms.common.rateLimited', { seconds: retryAfter })
            : t('forms.appointment.errors.sendFailed')}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? t('forms.common.submitting') : t('forms.appointment.submit')}
      </button>
    </form>
  )
}
