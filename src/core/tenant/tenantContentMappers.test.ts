import { describe, expect, it } from 'vitest'
import { toBusinessHours, toProjects, toServices } from './tenantContentMappers'
import type { TenantHours, TenantProject, TenantService } from './tenantResources'

describe('toServices', () => {
  it('sorts by displayOrder and drops backend-only fields', () => {
    const services: TenantService[] = [
      { id: 'b', name: 'B', description: 'b', imageUrl: 'b.jpg', displayOrder: 2 },
      { id: 'a', name: 'A', description: 'a', imageUrl: 'a.jpg', displayOrder: 1 },
    ]

    expect(toServices(services)).toEqual([
      { id: 'a', name: 'A', description: 'a', imageUrl: 'a.jpg' },
      { id: 'b', name: 'B', description: 'b', imageUrl: 'b.jpg' },
    ])
  })
})

describe('toProjects', () => {
  it('maps name to title and sorts by displayOrder', () => {
    const projects: TenantProject[] = [
      { id: 'b', name: 'Cocina', description: 'c', imageUrl: 'c.jpg', category: 'Cocina', displayOrder: 2 },
      { id: 'a', name: 'Baño', description: 'b', imageUrl: 'b.jpg', category: 'Baño', displayOrder: 1 },
    ]

    expect(toProjects(projects)).toEqual([
      { id: 'a', title: 'Baño', description: 'b', imageUrl: 'b.jpg', category: 'Baño' },
      { id: 'b', title: 'Cocina', description: 'c', imageUrl: 'c.jpg', category: 'Cocina' },
    ])
  })
})

describe('toBusinessHours', () => {
  const hours: TenantHours = {
    weekly: [
      {
        dayOfWeek: 'MONDAY',
        closed: false,
        morningOpen: '08:00',
        morningClose: '13:00',
        afternoonOpen: '16:00',
        afternoonClose: '19:00',
      },
      {
        dayOfWeek: 'SUNDAY',
        closed: true,
        morningOpen: null,
        morningClose: null,
        afternoonOpen: null,
        afternoonClose: null,
      },
    ],
    upcomingExceptions: [],
  }

  it('collapses a split day to first-open → last-close and keeps the weekday enum', () => {
    expect(toBusinessHours(hours)[0]).toEqual({
      day: 'MONDAY',
      open: '08:00',
      close: '19:00',
      closed: false,
    })
  })

  it('marks closed days', () => {
    expect(toBusinessHours(hours)[1]).toEqual({
      day: 'SUNDAY',
      open: '',
      close: '',
      closed: true,
    })
  })
})
