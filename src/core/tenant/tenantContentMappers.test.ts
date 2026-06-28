import { describe, expect, it } from 'vitest'
import { toBusinessHours, toMenu, toProjects, toServices } from './tenantContentMappers'
import type {
  TenantHours,
  TenantMenuCategory,
  TenantProject,
  TenantService,
} from './tenantResources'

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

describe('toMenu', () => {
  const categories: TenantMenuCategory[] = [
    {
      id: 'postres',
      name: 'Postres',
      displayOrder: 2,
      items: [
        {
          id: 'quesillo',
          name: 'Quesillo',
          description: 'Flan.',
          price: 5,
          imageUrl: 'q.jpg',
          allergens: ['lactosa'],
          available: true,
          displayOrder: 1,
        },
      ],
    },
    {
      id: 'entrantes',
      name: 'Entrantes',
      displayOrder: 1,
      items: [
        {
          id: 'agotado',
          name: 'Plato agotado',
          description: 'No disponible.',
          price: 9,
          imageUrl: 'a.jpg',
          allergens: [],
          available: false,
          displayOrder: 1,
        },
        {
          id: 'croquetas',
          name: 'Croquetas',
          description: 'Cremosas.',
          price: 9.5,
          imageUrl: 'c.jpg',
          allergens: ['gluten'],
          available: true,
          displayOrder: 2,
        },
      ],
    },
  ]

  it('sorts categories and items by displayOrder and drops unavailable items', () => {
    const menu = toMenu(categories)

    expect(menu.map((c) => c.name)).toEqual(['Entrantes', 'Postres'])
    // The unavailable item is filtered out; only the available dish remains.
    expect(menu[0].items).toEqual([
      {
        id: 'croquetas',
        name: 'Croquetas',
        description: 'Cremosas.',
        price: 9.5,
        imageUrl: 'c.jpg',
        allergens: ['gluten'],
      },
    ])
  })
})
