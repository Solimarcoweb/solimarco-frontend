import { useId, useState, type FormEvent } from 'react'
import styles from './Cart.module.css'
import type { CartItem, OrderData, OrderState } from '../../models/product'
import { submitOrder } from '../../services/salesService'
import { formatPrice } from '../../shared/formatPrice'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

interface CustomerData {
  customerName: string
  customerEmail: string
  customerPhone: string
}

type CustomerErrors = Partial<Record<keyof CustomerData, string>>

const INITIAL_CUSTOMER: CustomerData = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
}

export interface CartProps {
  /** Items currently in the cart. */
  items: CartItem[]
  /** Tenant the order belongs to. */
  tenantId: string
  /** Updates the quantity of a cart item. */
  onUpdateQuantity: (id: string, quantity: number) => void
  /** Removes a cart item. */
  onRemove: (id: string) => void
  /**
   * Submit handler. Defaults to POSTing to `/api/orders` via the sales service;
   * injectable so tests/stories can drive the lifecycle without hitting the network.
   */
  onSubmit?: (order: OrderData) => Promise<unknown>
}

/** Returns the ARIA wiring for a control given its id and current error. */
function describedBy(id: string, error: string | undefined) {
  return error ? ({ 'aria-invalid': true, 'aria-describedby': `${id}-error` } as const) : {}
}

function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

interface CartRowProps {
  item: CartItem
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemove: (id: string) => void
}

/** Single cart line: product, editable quantity and remove control. */
function CartRow({ item, onUpdateQuantity, onRemove }: CartRowProps) {
  return (
    <li className={styles.row}>
      <div className={styles.rowInfo}>
        <span className={styles.rowName}>{item.name}</span>
        <span className={styles.rowPrice}>
          {formatPrice(item.price)} / {item.unit}
        </span>
      </div>
      <div className={styles.rowActions}>
        <label className={styles.quantityLabel}>
          <span className={styles.visuallyHidden}>Cantidad de {item.name}</span>
          <input
            className={styles.quantity}
            type="number"
            min={1}
            value={item.quantity}
            onChange={(event) => {
              const next = Number.parseInt(event.target.value, 10)
              onUpdateQuantity(item.id, Number.isNaN(next) || next < 1 ? 1 : next)
            }}
          />
        </label>
        <span className={styles.rowSubtotal}>{formatPrice(item.price * item.quantity)}</span>
        <button
          type="button"
          className={styles.remove}
          aria-label={`Eliminar ${item.name} del carrito`}
          onClick={() => onRemove(item.id)}
        >
          Eliminar
        </button>
      </div>
    </li>
  )
}

/**
 * Materials shopping cart with guest checkout.
 * Lists cart items with editable quantities, computes the total, collects the
 * customer's contact data and submits the order (idle → submitting → success | error).
 *
 * @param props.items - Items currently in the cart.
 * @param props.tenantId - Tenant the order belongs to.
 * @param props.onUpdateQuantity - Quantity change handler.
 * @param props.onRemove - Item removal handler.
 * @param props.onSubmit - Order submit handler; defaults to the sales service.
 * @returns The cart panel, or a confirmation once the order is placed.
 */
export function Cart({
  items,
  tenantId,
  onUpdateQuantity,
  onRemove,
  onSubmit,
}: CartProps) {
  const submit = onSubmit ?? ((order: OrderData) => submitOrder(tenantId, order))
  const baseId = useId()
  const [customer, setCustomer] = useState<CustomerData>(INITIAL_CUSTOMER)
  const [errors, setErrors] = useState<CustomerErrors>({})
  const [state, setState] = useState<OrderState>('idle')

  const fieldId = (name: keyof CustomerData) => `${baseId}-${name}`
  const isSubmitting = state === 'submitting'
  const total = cartTotal(items)

  function updateField<K extends keyof CustomerData>(field: K, value: CustomerData[K]) {
    setCustomer((prev) => ({ ...prev, [field]: value }))
  }

  function validate(values: CustomerData): CustomerErrors {
    const next: CustomerErrors = {}
    if (!values.customerName.trim()) next.customerName = 'Indica tu nombre.'
    if (!values.customerEmail.trim()) next.customerEmail = 'Indica tu email.'
    else if (!EMAIL_PATTERN.test(values.customerEmail))
      next.customerEmail = 'El email no tiene un formato válido.'
    if (!values.customerPhone.trim()) next.customerPhone = 'Indica un teléfono de contacto.'
    return next
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validate(customer)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) {
      return
    }

    setState('submitting')
    const order: OrderData = { items, ...customer }
    try {
      await submit(order)
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <section className={styles.cart} role="status" aria-live="polite">
        <h2 className={styles.successTitle}>¡Pedido realizado!</h2>
        <p className={styles.successText}>
          Hemos recibido tu pedido. Te enviaremos la confirmación por email.
        </p>
      </section>
    )
  }

  if (items.length === 0) {
    return (
      <section className={styles.cart}>
        <h2 className={styles.title}>Tu carrito</h2>
        <p className={styles.empty}>El carrito está vacío.</p>
      </section>
    )
  }

  return (
    <section className={styles.cart}>
      <h2 className={styles.title}>Tu carrito</h2>

      <ul className={styles.rows}>
        {items.map((item) => (
          <CartRow
            key={item.id}
            item={item}
            onUpdateQuantity={onUpdateQuantity}
            onRemove={onRemove}
          />
        ))}
      </ul>

      <p className={styles.total}>
        <span>Total</span>
        <span className={styles.totalAmount}>{formatPrice(total)}</span>
      </p>

      <form
        className={styles.form}
        onSubmit={handleSubmit}
        aria-label="Datos de contacto para el pedido"
        noValidate
      >
        <div className={styles.field}>
          <label htmlFor={fieldId('customerName')} className={styles.label}>
            Nombre
          </label>
          <input
            id={fieldId('customerName')}
            className={styles.control}
            type="text"
            autoComplete="name"
            value={customer.customerName}
            onChange={(event) => updateField('customerName', event.target.value)}
            {...describedBy(fieldId('customerName'), errors.customerName)}
          />
          {errors.customerName && (
            <p id={`${fieldId('customerName')}-error`} className={styles.error} role="alert">
              {errors.customerName}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor={fieldId('customerEmail')} className={styles.label}>
            Email
          </label>
          <input
            id={fieldId('customerEmail')}
            className={styles.control}
            type="email"
            autoComplete="email"
            value={customer.customerEmail}
            onChange={(event) => updateField('customerEmail', event.target.value)}
            {...describedBy(fieldId('customerEmail'), errors.customerEmail)}
          />
          {errors.customerEmail && (
            <p id={`${fieldId('customerEmail')}-error`} className={styles.error} role="alert">
              {errors.customerEmail}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor={fieldId('customerPhone')} className={styles.label}>
            Teléfono
          </label>
          <input
            id={fieldId('customerPhone')}
            className={styles.control}
            type="tel"
            autoComplete="tel"
            value={customer.customerPhone}
            onChange={(event) => updateField('customerPhone', event.target.value)}
            {...describedBy(fieldId('customerPhone'), errors.customerPhone)}
          />
          {errors.customerPhone && (
            <p id={`${fieldId('customerPhone')}-error`} className={styles.error} role="alert">
              {errors.customerPhone}
            </p>
          )}
        </div>

        {state === 'error' && (
          <p className={styles.errorBanner} role="alert">
            No hemos podido procesar tu pedido. Inténtalo de nuevo en unos minutos.
          </p>
        )}

        <button type="submit" className={styles.submit} disabled={isSubmitting}>
          {isSubmitting ? 'Procesando…' : 'Finalizar pedido'}
        </button>
      </form>
    </section>
  )
}
