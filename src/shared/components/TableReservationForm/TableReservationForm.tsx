import { useId, useState, type FormEvent, type ReactNode } from 'react'
import styles from './TableReservationForm.module.css'
import type { SubmissionState, TableReservationData } from '../../../modules/reservations/models/reservation'
import { submitTableReservation } from '../../../modules/reservations/services/reservationService'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const MIN_GUESTS = 1
const MAX_GUESTS = 20

const INITIAL_DATA: TableReservationData = {
  name: '',
  email: '',
  phone: '',
  date: '',
  time: '',
  guests: 2,
  notes: '',
}

type FieldErrors = Partial<Record<keyof TableReservationData, string>>

export interface TableReservationFormProps {
  /** Tenant the reservation belongs to. */
  tenantId: string
  /**
   * Submit handler. Defaults to POSTing to `/api/reservations` via the
   * reservation service; injectable so tests/stories can drive the lifecycle
   * without hitting the network. Accepts a `void` or `Promise` return so the
   * success/error state can reflect an async result.
   */
  onSubmit?: (data: TableReservationData) => void | Promise<unknown>
}

/** Returns today's date as a `yyyy-mm-dd` string in local time. */
function todayIso(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${now.getFullYear()}-${month}-${day}`
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
 * Table reservation form for restaurant tenants.
 * Manages its own field/validation state and submission lifecycle
 * (idle → submitting → success | error) and posts to the shared reservation
 * service by default. Mobile-first.
 *
 * @param props.tenantId - Tenant the reservation belongs to.
 * @param props.onSubmit - Submit handler; defaults to the reservation service.
 * @returns The form, or a confirmation panel once submitted successfully.
 */
export function TableReservationForm({ tenantId, onSubmit }: TableReservationFormProps) {
  const baseId = useId()
  const [data, setData] = useState<TableReservationData>(INITIAL_DATA)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [state, setState] = useState<SubmissionState>('idle')

  const fieldId = (name: keyof TableReservationData) => `${baseId}-${name}`

  function updateField<K extends keyof TableReservationData>(field: K, value: TableReservationData[K]) {
    setData((prev) => ({ ...prev, [field]: value }))
  }

  function validate(values: TableReservationData): FieldErrors {
    const next: FieldErrors = {}
    if (!values.name.trim()) next.name = 'Indica tu nombre.'
    if (!values.email.trim()) next.email = 'Indica tu email.'
    else if (!EMAIL_PATTERN.test(values.email)) next.email = 'El email no tiene un formato válido.'
    if (!values.phone.trim()) next.phone = 'Indica un teléfono de contacto.'
    if (!values.date) next.date = 'Elige una fecha.'
    else if (values.date < todayIso()) next.date = 'La fecha no puede ser pasada.'
    if (!values.time) next.time = 'Elige una hora.'
    if (!Number.isInteger(values.guests) || values.guests < MIN_GUESTS || values.guests > MAX_GUESTS) {
      next.guests = `Indica entre ${MIN_GUESTS} y ${MAX_GUESTS} comensales.`
    }
    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(data)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    const payload: TableReservationData = {
      ...data,
      notes: data.notes?.trim() ? data.notes.trim() : undefined,
    }

    setState('submitting')
    try {
      if (onSubmit) {
        await onSubmit(payload)
      } else {
        await submitTableReservation(tenantId, payload)
      }
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <section className={styles.form} role="status" aria-live="polite">
        <h3 className={styles.successTitle}>¡Reserva solicitada!</h3>
        <p className={styles.successText}>
          Hemos recibido tu reserva. Te confirmaremos la mesa por email lo antes posible.
        </p>
      </section>
    )
  }

  const isSubmitting = state === 'submitting'

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      aria-label="Formulario de reserva de mesa"
      noValidate
    >
      <Field id={fieldId('name')} label="Nombre" error={errors.name}>
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

      <Field id={fieldId('email')} label="Email" error={errors.email}>
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

      <Field id={fieldId('phone')} label="Teléfono" error={errors.phone}>
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

      <div className={styles.row}>
        <Field id={fieldId('date')} label="Fecha" error={errors.date}>
          <input
            id={fieldId('date')}
            className={styles.control}
            type="date"
            min={todayIso()}
            value={data.date}
            onChange={(event) => updateField('date', event.target.value)}
            {...describedBy(fieldId('date'), errors.date)}
          />
        </Field>

        <Field id={fieldId('time')} label="Hora" error={errors.time}>
          <input
            id={fieldId('time')}
            className={styles.control}
            type="time"
            value={data.time}
            onChange={(event) => updateField('time', event.target.value)}
            {...describedBy(fieldId('time'), errors.time)}
          />
        </Field>

        <Field id={fieldId('guests')} label="Comensales" error={errors.guests}>
          <input
            id={fieldId('guests')}
            className={styles.control}
            type="number"
            min={MIN_GUESTS}
            max={MAX_GUESTS}
            value={Number.isNaN(data.guests) ? '' : data.guests}
            onChange={(event) => updateField('guests', event.target.valueAsNumber)}
            {...describedBy(fieldId('guests'), errors.guests)}
          />
        </Field>
      </div>

      <Field id={fieldId('notes')} label="Notas" optional>
        <textarea
          id={fieldId('notes')}
          className={styles.control}
          rows={3}
          value={data.notes ?? ''}
          onChange={(event) => updateField('notes', event.target.value)}
        />
      </Field>

      {state === 'error' && (
        <p className={styles.errorBanner} role="alert">
          No hemos podido enviar tu reserva. Inténtalo de nuevo en unos minutos.
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        {isSubmitting ? 'Enviando…' : 'Reservar mesa'}
      </button>
    </form>
  )
}
