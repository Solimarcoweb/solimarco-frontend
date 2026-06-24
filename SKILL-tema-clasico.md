# SKILL-tema-clasico

Tema CSS: [`src/themes/theme-clasico.css`](src/themes/theme-clasico.css) (soporta dark; es el tema **fallback**). Base de diseño: **[SKILL-impeccable.md](SKILL-impeccable.md)** (contraste, legibilidad) + disciplina trust-first de [SKILL-taste.md](SKILL-taste.md).

Identidad: serif moderado, neutros, confianza. Sectores: construcción/reformas (sector piloto), despachos, clínicas, servicios establecidos.

## Tipografía
- `--font-heading` **serif Georgia** (autoridad), `--font-body` **sans** (legibilidad). Pesos moderados, nada estridente. Escala conservadora con `clamp()`.

## Color
- `--color-primary` (#1e3a5f navy) para titulares/elementos de confianza. `--color-accent` (#8c2f39 burdeos) **escaso**: un CTA, un dato, un sello. Nada de neón ni saturación juvenil.
- `--color-bg-alt` (#f6f8fa) para separar secciones con sobriedad. Neutros, sin tintes llamativos.

## Layout
- Densidad **media**, ordenada (clamp 3.5–7rem). Composición **simétrica y predecible**: la consistencia es la afordancia (transmite solvencia). Poca o ninguna ruptura de grid.

## Componentes
- **Hero**: foto real de obra/equipo con titular serif y subtítulo claro; CTA navy o burdeos sólido. Transmite "llevamos años haciendo esto".
- **Cards**: `--radius-md` (8px), `--shadow-sm/md` discretas. Rejilla regular y alineada (aquí sí cabe la regularidad sobria, evitando solo el "3 cards huecas" del raíz).
- **Botones**: relleno sólido navy/burdeos, esquinas modestas, foco bien visible.

## Prohibido
- Estética experimental o de agencia. Acentos saturados/neón. Esquinas muy redondeadas. Asimetría agresiva. Datos inventados (la confianza exige cifras reales: años, proyectos, reseñas).
