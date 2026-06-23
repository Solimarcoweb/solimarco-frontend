import { Helmet } from 'react-helmet-async'

export interface SharedJsonLdProps {
  /** A schema.org object, including its `@context` and `@type` fields. */
  schema: Record<string, unknown>
}

/**
 * Injects a schema.org JSON-LD structured data block into the document head.
 * Accepts any schema.org object (Organization, LocalBusiness, Product, FAQPage...)
 * so each feature can describe its own content type for search engines and GEO
 * (Generative Engine Optimization) without a dedicated component per schema type.
 *
 * @param props.schema - The schema.org object to serialize and inject.
 */
export function SharedJsonLd({ schema }: SharedJsonLdProps) {
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
