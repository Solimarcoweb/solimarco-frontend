import styles from './Footer.module.css'

/** A single legal link shown in the footer (privacy, cookies, legal notice...). */
export interface LegalLink {
  /** Visible link text, e.g. "Política de privacidad". */
  label: string
  /** Destination href of the legal page. */
  href: string
}

export interface FooterProps {
  /** Business display name, shown as the footer heading. */
  businessName: string
  /** Postal address of the business (single line or comma-separated). */
  address: string
  /** Contact phone number in human-readable form; also used to build the `tel:` link. */
  phone: string
  /** Contact email; also used to build the `mailto:` link. */
  email: string
  /** Legal pages to link (privacy, cookies, legal notice, sale terms...). */
  legalLinks: LegalLink[]
}

/**
 * Builds a `tel:` href from a human-readable phone string by stripping spaces
 * and any formatting, while keeping a leading `+` for the country code.
 */
function toTelHref(phone: string): string {
  const normalized = phone.replace(/[^\d+]/g, '')
  return `tel:${normalized}`
}

/**
 * Site footer block for the public per-tenant sites.
 * Renders the business contact details inside a semantic `<address>` and the
 * legal links as a navigation list. Mobile-first: a single column on small
 * screens that splits into multiple columns on desktop.
 *
 * @param props.businessName - Business display name (footer heading).
 * @param props.address - Postal address of the business.
 * @param props.phone - Contact phone (also used for the `tel:` link).
 * @param props.email - Contact email (also used for the `mailto:` link).
 * @param props.legalLinks - Legal pages to link.
 * @returns The footer element.
 */
export function Footer({ businessName, address, phone, email, legalLinks }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <section className={styles.contact} aria-labelledby="footer-business-name">
          <h2 id="footer-business-name" className={styles.businessName}>
            {businessName}
          </h2>
          {/* <address> is the correct semantic element for the contact details
              of its nearest section/article — here the business itself. */}
          <address className={styles.address}>
            <p className={styles.addressLine}>{address}</p>
            <a className={styles.contactLink} href={toTelHref(phone)}>
              {phone}
            </a>
            <a className={styles.contactLink} href={`mailto:${email}`}>
              {email}
            </a>
          </address>
        </section>

        <nav className={styles.legal} aria-label="Enlaces legales">
          <h2 className={styles.legalHeading}>Legal</h2>
          <ul className={styles.legalList}>
            {legalLinks.map((link) => (
              <li key={link.href}>
                <a className={styles.legalLink} href={link.href}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p className={styles.copyright}>
        © {currentYear} {businessName}. Todos los derechos reservados.
      </p>
    </footer>
  )
}
