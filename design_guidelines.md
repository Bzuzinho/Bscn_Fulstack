# Design Guidelines: Swimming Club Management System

## Design Approach

**Selected Approach:** Design System - Material Design 3 with modern refinements
**Justification:** This is a utility-focused, information-dense management system requiring efficient data handling, clear hierarchy, and consistent patterns across multiple complex modules. Material Design 3 provides excellent components for tables, forms, and data visualization while maintaining a professional, trustworthy appearance suitable for sports administration.

**Key Design Principles:**
1. **Clarity First**: Every element serves a functional purpose; visual hierarchy guides users through complex workflows
2. **Consistent Patterns**: Reusable components across all 7 modules for intuitive navigation
3. **Data Density Balance**: Present comprehensive information without overwhelming users
4. **Role-Based UX**: Distinct experiences for administrators, coaches, and members while maintaining visual consistency

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 220 15% 12% (deep blue-gray)
- Surface: 220 12% 16% (elevated surfaces)
- Surface Variant: 220 10% 20% (cards, containers)
- Primary: 210 100% 60% (bright blue - swimming pool water)
- Primary Container: 210 80% 25% (darker blue states)
- On Surface: 220 10% 92% (primary text)
- On Surface Variant: 220 8% 70% (secondary text)
- Border: 220 12% 28% (subtle dividers)
- Success: 142 70% 45% (payments, confirmations)
- Warning: 38 92% 50% (alerts, pending states)
- Error: 0 72% 51% (overdue, critical)

**Light Mode:**
- Background: 220 15% 98%
- Surface: 0 0% 100%
- Surface Variant: 220 12% 96%
- Primary: 210 100% 50%
- Primary Container: 210 100% 92%
- On Surface: 220 15% 12%
- On Surface Variant: 220 8% 40%
- Border: 220 10% 88%

### B. Typography

**Font Families:**
- Primary: Inter (Google Fonts) - UI elements, body text, forms
- Data: JetBrains Mono (Google Fonts) - financial figures, athlete numbers, statistics

**Type Scale:**
- Display: 2.5rem/3rem, font-weight 700 (dashboard headers)
- Heading 1: 2rem/2.5rem, font-weight 600 (page titles)
- Heading 2: 1.5rem/2rem, font-weight 600 (section headers)
- Heading 3: 1.25rem/1.75rem, font-weight 600 (card titles)
- Body Large: 1rem/1.5rem, font-weight 400 (primary content)
- Body: 0.875rem/1.25rem, font-weight 400 (secondary content)
- Label: 0.875rem/1.25rem, font-weight 500 (form labels, buttons)
- Caption: 0.75rem/1rem, font-weight 400 (metadata, timestamps)

### C. Layout System

**Tailwind Spacing Primitives:** Consistent use of 4, 6, 8, 12, 16, 20, 24 units
- Component padding: p-6, p-8
- Section spacing: py-12, py-16
- Gap between elements: gap-4, gap-6, gap-8
- Container margins: mx-4 (mobile), mx-8 (desktop)

**Grid System:**
- Main container: max-w-[1440px] mx-auto
- Dashboard: 12-column grid with gap-6
- Forms: max-w-3xl for optimal readability
- Data tables: full-width with horizontal scroll on mobile

### D. Component Library

**Navigation:**
- Sidebar navigation (desktop): 280px fixed width, collapsible
- Top bar: 64px height with club logo, search, notifications, user menu
- Mobile: Bottom navigation bar for primary modules
- Breadcrumbs: Always visible for multi-level navigation

**Data Display:**
- Tables: Striped rows, sticky headers, sortable columns, row actions on hover
- Cards: rounded-xl with subtle shadow, hover elevation
- Stats cards: Large numbers with JetBrains Mono, trend indicators (↑↓)
- Timeline: Vertical for activity history, horizontal for event schedules

**Forms & Inputs:**
- Text fields: Outlined style with floating labels
- Dropdowns: Material Design select with search capability
- Date pickers: Inline calendar for schedule management
- File upload: Drag-and-drop zones with preview
- Multi-select: Chips for tags (escalões, grupos)

**Action Components:**
- Primary buttons: Filled, rounded-lg, px-6 py-3
- Secondary buttons: Outlined, same dimensions
- Icon buttons: 40px×40px touch targets
- FAB (Floating Action Button): Bottom-right for quick actions (Novo Atleta, Nova Atividade)

**Overlays:**
- Modals: max-w-2xl, backdrop blur, slide-up animation
- Sidepanels: 480px from right for details/edits
- Toast notifications: Top-right, auto-dismiss, action buttons
- Confirm dialogs: Centered, clear primary/secondary actions

### E. Animations

**Minimal, Purposeful Motion:**
- Page transitions: 200ms ease-out
- Dropdown/modal: 150ms cubic-bezier
- Hover states: 100ms ease
- Loading states: Skeleton screens, no spinners
- Avoid: Scroll animations, decorative motion

## Portal-Specific Design

**Public Landing (Pre-Auth):**
- Hero: 80vh with swimming pool imagery, club branding
- Single-column layout: Club info, features overview, login CTA
- Color: Primary blue with white overlays
- Typography: Large, confident headlines

**Member Portal (Post-Auth):**
- Dashboard: Personal stats, upcoming activities, payment status
- Card-based layout: 2-column on desktop (Personal Info | Quick Actions)
- Limited navigation: Only member-relevant sections
- Simplified color: Primary blue for positive states only

**Admin Interface:**
- Density: Compact tables, multi-column grids
- Advanced filters: Always accessible in sidepanel
- Bulk actions: Toolbar appears on row selection
- Export options: Prominent in every data view

## Images

**Strategic Image Use:**
- Club logo: Header (all pages), login page
- Hero section (landing): High-quality swimming pool/competition photo with brand overlay
- Athlete profiles: Square thumbnails (120px×120px) with fallback initials
- Event cards: 16:9 ratio banners for competitions/championships
- Dashboard: No decorative images; data visualization only
- Empty states: Simple illustrations (not photos) for "No data yet"

**Image Treatment:**
- All images: Subtle 2px border with border color
- Profile photos: Circular crop
- Event banners: Rounded corners (rounded-xl)
- Loading: Blur placeholder → sharp image transition