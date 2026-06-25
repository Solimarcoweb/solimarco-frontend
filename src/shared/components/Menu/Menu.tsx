import { useRef } from 'react'
import styles from './Menu.module.css'
import { useScrollAnimation } from '../../hooks/useScrollAnimation'

/** Stagger delay (ms) for the item at `index`: 0 / 80 / 160, then capped. */
const staggerDelay = (index: number) => Math.min(index, 2) * 80

/** A single dish/product shown in the menu. */
export interface MenuItem {
  /** Stable unique id, used as React key. */
  id: string
  /** Item name. */
  name: string
  /** Short description of the item. */
  description: string
  /** Price in euros. */
  price: number
  /** Optional image URL of the item. */
  imageUrl?: string
  /** Optional list of allergens (e.g. "gluten", "lactosa"). */
  allergens?: string[]
}

/** A named group of menu items (e.g. "Tartas", "Cafés"). */
export interface MenuCategory {
  /** Stable unique id, used for the anchor link and React key. */
  id: string
  /** Category name, rendered as the section heading and tab label. */
  name: string
  /** Items belonging to this category. */
  items: MenuItem[]
}

export interface MenuProps {
  /** Menu categories to display, in order. */
  categories: MenuCategory[]
}

const priceFormatter = new Intl.NumberFormat('es-ES', {
  style: 'currency',
  currency: 'EUR',
})

/** Builds the DOM id of a category section from its id. */
function sectionId(categoryId: string): string {
  return `menu-cat-${categoryId}`
}

/** Single menu item card with optional image, price and allergens. */
function MenuItemCard({ item, index }: { item: MenuItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null)
  useScrollAnimation(ref, staggerDelay(index))
  return (
    <li ref={ref} className={`${styles.item} animate-on-scroll`}>
      {item.imageUrl && (
        <figure className={styles.media}>
          <img
            className={styles.image}
            src={item.imageUrl}
            alt={item.name}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      <div className={styles.body}>
        <div className={styles.heading}>
          <h4 className={styles.name}>{item.name}</h4>
          <span className={styles.price}>{priceFormatter.format(item.price)}</span>
        </div>
        <p className={styles.description}>{item.description}</p>
        {item.allergens && item.allergens.length > 0 && (
          <ul className={styles.allergens} aria-label="Alérgenos">
            {item.allergens.map((allergen) => (
              <li key={allergen} className={styles.allergen}>
                {allergen}
              </li>
            ))}
          </ul>
        )}
      </div>
    </li>
  )
}

/**
 * Visual menu/carta block for the public per-tenant sites.
 * Renders a category navigation (anchor tabs) plus one grid section per
 * category, mobile-first. Display only — no cart, no ordering.
 *
 * @param props.categories - Menu categories to display, in order.
 * @returns The menu section element.
 */
export function Menu({ categories }: MenuProps) {
  return (
    <section className={styles.menu}>
      <nav className={styles.tabs} aria-label="Categorías de la carta">
        <ul className={styles.tabList}>
          {categories.map((category) => (
            <li key={category.id}>
              <a className={styles.tab} href={`#${sectionId(category.id)}`}>
                {category.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {categories.map((category) => (
        <section
          key={category.id}
          id={sectionId(category.id)}
          className={styles.category}
          aria-labelledby={`${sectionId(category.id)}-title`}
        >
          <h3 id={`${sectionId(category.id)}-title`} className={styles.categoryTitle}>
            {category.name}
          </h3>
          <ul className={styles.grid}>
            {category.items.map((item, index) => (
              <MenuItemCard key={item.id} item={item} index={index} />
            ))}
          </ul>
        </section>
      ))}
    </section>
  )
}
