import { afterEach, describe, expect, it, vi } from 'vitest'
import type {
  AppointmentData,
  BudgetFormData,
  TableReservationData,
} from '../models/reservation'
import {
  submitAppointment,
  submitBudgetRequest,
  submitTableReservation,
} from './reservationService'

// Mock the HTTP layer so we can assert the exact body sent to the backend
// without performing a real network request.
vi.mock('../../../core/http/apiClient', () => ({
  apiClient: vi.fn().mockResolvedValue({ id: 'lead-1', status: 'pendiente' }),
}))

const { apiClient } = await import('../../../core/http/apiClient')
const apiClientMock = vi.mocked(apiClient)

/** Reads the body passed to the single apiClient call recorded so far. */
function sentBody(): Record<string, unknown> {
  return apiClientMock.mock.calls[0][1]?.body as Record<string, unknown>
}

afterEach(() => {
  vi.clearAllMocks()
})

describe('submitBudgetRequest', () => {
  const formData: BudgetFormData = {
    name: 'María Hernández',
    phone: '600123456',
    email: 'maria@example.com',
    serviceType: 'reforma-integral',
    description: 'Reforma integral de un piso de 90 m².',
    preferredDate: '2026-07-01',
  }

  it('maps the form data to the backend /api/reservations contract', async () => {
    await submitBudgetRequest('bm-construccion', formData)

    expect(apiClientMock).toHaveBeenCalledWith('/api/reservations', {
      method: 'POST',
      body: {
        tenantId: 'bm-construccion',
        contactName: 'María Hernández',
        contactEmail: 'maria@example.com',
        contactPhone: '600123456',
        date: '2026-07-01',
        details: {
          serviceType: 'reforma-integral',
          description: 'Reforma integral de un piso de 90 m².',
        },
      },
    })
  })

  it('sends the tenant slug as tenantId, not a UUID', async () => {
    await submitBudgetRequest('bm-construccion', formData)
    expect(sentBody().tenantId).toBe('bm-construccion')
  })

  it('omits date when no preferred date was provided', async () => {
    await submitBudgetRequest('bm-construccion', { ...formData, preferredDate: undefined })
    expect(sentBody().date).toBeUndefined()
  })
})

describe('submitTableReservation', () => {
  const tableData: TableReservationData = {
    name: 'Lucía Pérez',
    email: 'lucia@example.com',
    phone: '600999888',
    date: '2026-08-12',
    time: '21:30',
    guests: 4,
    notes: 'Mesa junto a la ventana',
  }

  it('maps the form data to the backend /api/reservations contract', async () => {
    await submitTableReservation('rincon-canario', tableData)

    expect(apiClientMock).toHaveBeenCalledWith('/api/reservations', {
      method: 'POST',
      body: {
        tenantId: 'rincon-canario',
        contactName: 'Lucía Pérez',
        contactEmail: 'lucia@example.com',
        contactPhone: '600999888',
        date: '2026-08-12T21:30',
        details: {
          guests: 4,
          notes: 'Mesa junto a la ventana',
        },
      },
    })
  })

  it('omits date when the date is empty', async () => {
    await submitTableReservation('rincon-canario', { ...tableData, date: '' })
    expect(sentBody().date).toBeUndefined()
  })
})

describe('submitAppointment', () => {
  const appointmentData: AppointmentData = {
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    phone: '600111222',
    serviceId: 'cambio-aceite',
    preferredDate: '2026-09-01',
    preferredTime: '10:00',
    vehicleBrand: 'Toyota',
    vehicleModel: 'Yaris',
    notes: 'Ruido al frenar',
  }

  it('maps the form data to the backend /api/reservations contract', async () => {
    await submitAppointment('taller-el-teide', appointmentData)

    expect(apiClientMock).toHaveBeenCalledWith('/api/reservations', {
      method: 'POST',
      body: {
        tenantId: 'taller-el-teide',
        contactName: 'Carlos Ruiz',
        contactEmail: 'carlos@example.com',
        contactPhone: '600111222',
        date: '2026-09-01T10:00',
        details: {
          serviceId: 'cambio-aceite',
          vehicleBrand: 'Toyota',
          vehicleModel: 'Yaris',
          notes: 'Ruido al frenar',
        },
      },
    })
  })

  it('sends the date alone when no time was provided', async () => {
    await submitAppointment('taller-el-teide', { ...appointmentData, preferredTime: '' })
    expect(sentBody().date).toBe('2026-09-01')
  })
})
