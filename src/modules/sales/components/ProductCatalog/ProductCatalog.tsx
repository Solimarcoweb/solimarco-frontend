import { useRef } from 'react'
import styles from './ProductCatalog.module.css'
import type { ProductItem } from '../../models/product'
import { formatPrice } from '../../shared/formatPrice'
import { useScrollAnimation } from '../../../../shared/hooks/useScrollAnimation'

/** Stagger delay (ms) for the item at `index`: 0 / 80 / 160, then capped. */
const staggerDelay = (index: number) => Math.min(index, 2) * 80

export interface ProductCatalogProps {
  /** Products to display, grouped by their `category`. */
  products: ProductItem[]
  /** Called when the user adds a product to the cart. */
  onAddToCart: (product: ProductItem) => void
}

const LOW_STOCK_THRESHOLD = 5

interface ProductCardProps {
  product: ProductItem
  /** Whether this is the featured (larger) card in its category grid. */
  featured: boolean
  /** Position within its category grid, used for the stagger delay. */
  index: number
  onAddToCart: (product: ProductItem) => void
}

/** Single product card with image, price and add-to-cart action. */
function ProductCard({ product, featured, index, onAddToCart }: ProductCardProps) {
  const isLowStock = typeof product.stock === 'number' && product.stock <= LOW_STOCK_THRESHOLD
  const ref = useRef<HTMLLIElement>(null)
  useScrollAnimation(ref, staggerDelay(index))

  const base = featured ? `${styles.product} ${styles.featured}` : styles.product
  return (
    <li ref={ref} className={`${base} animate-on-scroll`}>
      {product.imageUrl && (
        <figure className={styles.media}>
          <img className={styles.image} src={product.imageUrl} alt={product.name} loading="lazy" />
        </figure>
      )}
      <div className={styles.body}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.description}>{product.description}</p>
        <p className={styles.meta}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.unit}> / {product.unit}</span>
        </p>
        {isLowStock && <span className={styles.lowStock}>Últimas {product.stock} uds.</span>}
        <button
          type="button"
          className={styles.addButton}
          aria-label={`Añadir ${product.name} al carrito`}
          onClick={() => onAddToCart(product)}
        >
          Añadir al carrito
        </button>
      </div>
    </li>
  )
}

/** Groups products by category, preserving first-seen order. */
function groupByCategory(products: ProductItem[]): Map<string, ProductItem[]> {
  const groups = new Map<string, ProductItem[]>()
  for (const product of products) {
    const current = groups.get(product.category) ?? []
    current.push(product)
    groups.set(product.category, current)
  }
  return groups
}

/**
 * Materials catalog for the construction/reform sector.
 * Renders one section per category with an asymmetric grid (the first product
 * of each category is featured larger), instead of three equal horizontal cards.
 *
 * @param props.products - Products to display, grouped by category.
 * @param props.onAddToCart - Add-to-cart handler (guest checkout, no login).
 * @returns The catalog section element.
 */
export function ProductCatalog({ products, onAddToCart }: ProductCatalogProps) {
  const groups = [...groupByCategory(products).entries()]

  return (
    <section className={styles.catalog}>
      {groups.map(([category, categoryProducts]) => (
        <div key={category} className={styles.group}>
          <h2 className={styles.category}>{category}</h2>
          <ul className={styles.grid}>
            {categoryProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                featured={index === 0}
                index={index}
                onAddToCart={onAddToCart}
              />
            ))}
          </ul>
        </div>
      ))}
    </section>
  )
}
