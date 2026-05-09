---
name: High-Fidelity Fintech System
colors:
  surface: '#fdf8f8'
  surface-dim: '#ddd9d9'
  surface-bright: '#fdf8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f7f3f2'
  surface-container: '#f1eded'
  surface-container-high: '#ebe7e7'
  surface-container-highest: '#e5e2e1'
  on-surface: '#1c1b1c'
  on-surface-variant: '#46464b'
  inverse-surface: '#313030'
  inverse-on-surface: '#f4f0ef'
  outline: '#77767b'
  outline-variant: '#c7c6cb'
  surface-tint: '#5f5e61'
  primary: '#131416'
  on-primary: '#ffffff'
  primary-container: '#28282b'
  on-primary-container: '#908f92'
  inverse-primary: '#c8c6c9'
  secondary: '#006a6a'
  on-secondary: '#ffffff'
  secondary-container: '#90efef'
  on-secondary-container: '#006e6e'
  tertiary: '#07151d'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c2a32'
  on-tertiary-container: '#83919b'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e4e1e5'
  primary-fixed-dim: '#c8c6c9'
  on-primary-fixed: '#1b1b1e'
  on-primary-fixed-variant: '#47464a'
  secondary-fixed: '#93f2f2'
  secondary-fixed-dim: '#76d6d5'
  on-secondary-fixed: '#002020'
  on-secondary-fixed-variant: '#004f4f'
  tertiary-fixed: '#d6e5ef'
  tertiary-fixed-dim: '#bac9d3'
  on-tertiary-fixed: '#0f1d25'
  on-tertiary-fixed-variant: '#3b4951'
  background: '#fdf8f8'
  on-background: '#1c1b1c'
  surface-variant: '#e5e2e1'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-bold:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  sidebar_width: 260px
  max_container: 1440px
---

## Brand & Style
The design system is engineered to instill confidence and clarity in the school fee payment process. The brand personality is **Professional, Systematic, and Secure**. It leverages a **Corporate Modern** aesthetic that prioritizes high-contrast information density and logical organization.

The visual narrative focuses on "Financial Calm"—reducing the stress of large transactions through a clean, dashboard-driven interface. By combining the authority of deep charcoals with the freshness of teal and light cyan, the system balances institutional trust with modern accessibility. The interface uses subtle depth and structured grids to guide users through complex billing cycles and payment histories without cognitive overload.

## Colors
The palette is rooted in high-contrast neutrality to ensure maximum readability for financial data.
- **Primary Dark (#28282B):** Used for primary text, sidebar backgrounds, and high-emphasis UI elements to provide a grounded, authoritative feel.
- **Teal / Light Cyan:** Teal serves as the primary action color for buttons and interactive states, while Light Cyan provides soft backgrounds for selected items or highlighted zones.
- **Supporting Light Blue (#E3F2FD):** Utilized for secondary information cards and subtle UI borders to maintain a "light" feel despite high data density.
- **Semantic Colors:** Strict adherence to Green (Paid), Amber (Partial), and Red (Overdue) ensures immediate status recognition in ledger views.

## Typography
The system employs **Hanken Grotesk** for large headings to provide a modern, sharp character, while **Inter** is used for all functional body and data text due to its exceptional legibility at small sizes. 

For the financial dashboard aspect, "tabular figures" (tnum) are enabled by default for all numerical data in tables, ensuring that columns of numbers align perfectly for easy visual scanning and comparison.

## Layout & Spacing
The layout follows a **Fixed Sidebar + Fluid Content** model. 
- **Sidebar:** Anchored to the left at 260px, using the primary dark color for high-contrast navigation.
- **Main Content:** A fluid area that uses a 12-column grid with 24px gutters.
- **Rhythm:** An 8px linear scale (with 4px increments for tight components) ensures consistent vertical rhythm.
- **Mobile Adaptivity:** On mobile, the sidebar collapses into a bottom navigation bar or a hamburger overlay, and the 12-column grid reflows to a single column with 16px horizontal margins.

## Elevation & Depth
Depth is achieved through **Tonal Layering** rather than aggressive shadows, maintaining a flat, professional financial aesthetic.
- **Level 0 (Surface):** White background for the main canvas.
- **Level 1 (Cards):** Subtle 1px borders in Light Blue or very soft 2% opacity black shadows to separate summary cards from the background.
- **Interactive Depth:** Only active buttons and dropdown menus receive a "Soft Ambient" shadow (10% opacity, 12px blur) to indicate they sit above the base UI.
- **Sidebar:** Uses a solid, dark fill to act as the primary structural anchor, effectively creating "negative depth."

## Shapes
This design system utilizes **Rounded** geometry. 
- Standard components (buttons, input fields) use a 0.5rem (8px) corner radius.
- Large container cards and summary sections use `rounded-lg` (16px) to soften the information-heavy environment.
- Status badges utilize a fully pill-shaped (rounded-full) radius to distinguish them clearly from interactive buttons.

## Components
- **Sidebar Navigation:** High-contrast dark background with teal active-state indicators (left-border or subtle background fill).
- **Data Tables:** Borderless rows with light grey dividers; headers in uppercase `label-bold`. The "Status" column uses color-coded badges.
- **Status Badges:** Low-saturation background fills with high-saturation text for readability (e.g., Light Green background with Dark Green text for "Paid").
- **Action Buttons:** Primary actions in Teal with white text; secondary actions in White with a 1px Primary Dark border.
- **Summary Cards:** Large-format cards displaying "Total Balance," "Next Due Date," and "Payment History" using `display-lg` for the primary figures.
- **Form Inputs:** Clean, 1px bordered boxes that turn Teal on focus, including clear error states in soft red.