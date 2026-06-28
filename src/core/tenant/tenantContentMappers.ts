import type { Service } from '../../shared/components/ServicesList'
import type { ProjectItem } from '../../shared/components/ProjectGallery'
import type { BusinessHours } from '../../shared/components/BusinessInfo'
import type { TenantHours, TenantProject, TenantService } from './tenantResources'

/** Spanish weekday names indexed by ISO day of week (1 = Monday … 7 = Sunday). */
const DAY_NAMES = ['', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']

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
    day: DAY_NAMES[day.dayOfWeek] ?? `Día ${day.dayOfWeek}`,
    open: day.morningOpen ?? day.afternoonOpen ?? '',
    close: day.afternoonClose ?? day.morningClose ?? '',
    closed: day.closed,
  }))
}
