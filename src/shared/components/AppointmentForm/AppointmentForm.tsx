import { useId, useState, type FormEvent, type ReactNode } from 'react'
import styles from './AppointmentForm.module.css'
import type { AppointmentData, SubmissionState } from '../../../modules/reservations/models/reservation'
import { submitAppointment } from '../../../modules/reservations/services/reservationService'
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
  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        {label}
        {optional && <span className={styles.optional}> (opcional)</span>}
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
  const baseId = useId()
  const [data, setData] = useState<AppointmentData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [state, setState] = useState<SubmissionState>('idle')

  const fieldId = (name: keyof AppointmentData) => `${baseId}-${name}`

  function updateField<K extends keyof AppointmentData>(field: K, value: AppointmentData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function validate(values: AppointmentData): FieldErrors {
    const next: FieldErrors = {}
    if (!values.name.trim()) next.name = 'Indica tu nombre.'
    if (!values.phone.trim()) next.phone = 'Indica un teléfono de contacto.'
    if (!values.email.trim()) next.email = 'Indica tu email.'
    else if (!EMAIL_PATTERN.test(values.email)) next.email = 'El email no tiene un formato válido.'
    if (!values.serviceId) next.serviceId = 'Selecciona un servicio.'
    if (!values.preferredDate) next.preferredDate = 'Elige una fecha preferida.'
    else if (values.preferredDate < todayIso()) next.preferredDate = 'La fecha no puede ser pasada.'
    if (!values.preferredTime) next.preferredTime = 'Elige una hora preferida.'
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
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <section className={styles.form} role="status" aria-live="polite">
        <h3 className={styles.successTitle}>¡Cita solicitada!</h3>
        <p className={styles.successText}>
          Hemos recibido tu solicitud. Te confirmaremos la cita por teléfono o email lo antes posible.
        </p>
      </section>
    )
  }

  const isSubmitting = state === 'submitting'

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Formulario de cita previa"
      noValidate
    >
      <Field id={fieldId('name')} label="Nombre" error={errors.name}>
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

      <Field id={fieldId('phone')} label="Teléfono" error={errors.phone}>
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

      <Field id={fieldId('email')} label="Email" error={errors.email}>
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

      <Field id={fieldId('serviceId')} label="Servicio" error={errors.serviceId}>
        <select
          id={fieldId('serviceId')}
          className={styles.control}
          value={data.serviceId}
          onChange={(e) => updateField('serviceId', e.target.value)}
          {...describedBy(fieldId('serviceId'), errors.serviceId)}
        >
          <option value="">— Selecciona un servicio —</option>
          {services.map((svc) => (
            <option key={svc.id} value={svc.id}>
              {svc.name}
            </option>
          ))}
        </select>
      </Field>

      <div className={styles.row}>
        <Field id={fieldId('preferredDate')} label="Fecha preferida" error={errors.preferredDate}>
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

        <Field id={fieldId('preferredTime')} label="Hora preferida" error={errors.preferredTime}>
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
        <Field id={fieldId('vehicleBrand')} label="Marca del vehículo" optional>
          <input
            id={fieldId('vehicleBrand')}
            className={styles.control}
            type="text"
            autoComplete="off"
            placeholder="p. ej. Toyota"
            value={data.vehicleBrand ?? ''}
            onChange={(e) => updateField('vehicleBrand', e.target.value)}
          />
        </Field>

        <Field id={fieldId('vehicleModel')} label="Modelo" optional>
          <input
            id={fieldId('vehicleModel')}
            className={styles.control}
            type="text"
            autoComplete="off"
            placeholder="p. ej. Yaris"
            value={data.vehicleModel ?? ''}
            onChange={(e) => updateField('vehicleModel', e.target.value)}
          />
        </Field>
      </div>

      <Field id={fieldId('notes')} label="Notas adicionales" optional>
        <textarea
          id={fieldId('notes')}
          className={styles.control}
          rows={3}
          placeholder="Describe brevemente la avería o lo que necesitas."
          value={data.notes ?? ''}
          onChange={(e) => updateField('notes', e.target.value)}
        />
      </Field>

      {state === 'error' && (
        <p className={styles.errorBanner} role="alert">
          No hemos podido enviar tu solicitud. Inténtalo de nuevo en unos minutos.
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Solicitar cita'}
      </button>
    </form>
  )
}
