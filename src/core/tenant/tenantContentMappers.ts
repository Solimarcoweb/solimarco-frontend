import type { Service } from '../../shared/components/ServicesList'
import type { ProjectItem } from '../../shared/components/ProjectGallery'
import type { BusinessHours } from '../../shared/components/BusinessInfo'
import type { MenuCategory } from '../../shared/components/Menu'
import type { Treatment } from '../../shared/components/TreatmentsList'
import type {
  TenantHours,
  TenantMenuCategory,
  TenantProject,
  TenantService,
  TreatmentCategory,
} from './tenantResources'

/**
 * Maps backend services to the `ServicesList` `Service[]` props, sorted by
 * `displayOrder`. Price/duration are not part of the backend contract.
 *
 * @param services - Raw backend services.
 * @returns Services ready for `ServicesList`.
 */
export function toServices(services: TenantService[]): Service[] {
  return [...services]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(({ id, name, description, imageUrl }) => ({ id, name, description, imageUrl }))
}

/**
 * Maps backend projects to the `ProjectGallery` `ProjectItem[]` props, sorted by
 * `displayOrder`. The backend `name` field becomes the item `title`.
 *
 * @param projects - Raw backend projects.
 * @returns Projects ready for `ProjectGallery`.
 */
export function toProjects(projects: TenantProject[]): ProjectItem[] {
  return [...projects]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map(({ id, name, description, imageUrl, category }) => ({
      id,
      title: name,
      description,
      imageUrl,
      category,
    }))
}

/**
 * Maps the backend weekly schedule to the `BusinessInfo` `BusinessHours[]` props.
 * The `day` field carries the backend weekday enum (e.g. `"MONDAY"`);
 * `BusinessInfo` localizes it via i18n (`weekdays.*`) at render time.
 *
 * NOTE: `BusinessInfo` shows a single open–close range per day, so a midday
 * break (morning + afternoon) is collapsed to first-open → last-close. The
 * `upcomingExceptions` are not surfaced by `BusinessInfo` yet.
 *
 * @param hours - Raw backend hours.
 * @returns Weekly hours ready for `BusinessInfo`.
 */
export function toBusinessHours(hours: TenantHours): BusinessHours[] {
  return hours.weekly.map((day) => ({
    day: day.dayOfWeek,
    open: day.morningOpen ?? day.afternoonOpen ?? '',
    close: day.afternoonClose ?? day.morningClose ?? '',
    closed: day.closed,
  }))
}

/**
 * Maps backend menu categories to the `Menu` `MenuCategory[]` props. Categories
 * and dishes are sorted by `displayOrder`; unavailable dishes are dropped.
 *
 * @param categories - Raw backend menu categories.
 * @returns Menu categories ready for the `Menu` component.
 */
export function toMenu(categories: TenantMenuCategory[]): MenuCategory[] {
  return [...categories]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((category) => ({
      id: category.id,
      name: category.name,
      items: [...category.items]
        .filter((item) => item.available)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map(({ id, name, description, price, imageUrl, allergens }) => ({
          id,
          name,
          description,
          price,
          imageUrl,
          allergens,
        })),
    }))
}

/**
 * Maps backend treatment categories to the flat `TreatmentsList` `Treatment[]`
 * props (the component groups them again by `category`). Categories and items
 * are sorted by `displayOrder`, unavailable items dropped, and the numeric
 * `price`/`durationMinutes` formatted into the display strings the component
 * expects (e.g. `"55 €"`, `"60 min"`).
 *
 * @param categories - Raw backend treatment categories.
 * @returns Flat treatments ready for `TreatmentsList`.
 */
export function toTreatments(categories: TreatmentCategory[]): Treatment[] {
  return [...categories]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .flatMap((category) =>
      [...category.items]
        .filter((item) => item.available)
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((item) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: `${item.price} €`,
          duration: `${item.durationMinutes} min`,
          category: category.name,
          imageUrl: item.imageUrl,
        })),
    )
}

/**
 * Derives the `AppointmentForm` service options from treatments, mirroring the
 * previous hardcoded mapping (`name — duration`).
 *
 * @param treatments - Treatments (already mapped via {@link toTreatments}).
 * @returns Services ready for `AppointmentForm`.
 */
export function toAppointmentServices(treatments: Treatment[]): Service[] {
  return treatments.map((treatment) => ({
    id: treatment.id,
    name: `${treatment.name} — ${treatment.duration}`,
    description: treatment.description,
    price: treatment.price,
    duration: treatment.duration,
    imageUrl: treatment.imageUrl,
  }))
}
