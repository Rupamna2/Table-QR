# UI Context

## Theme

Dark only. No light mode. The design language is a dark,
warm-but-modern restaurant tech surface — near-black navy
backgrounds, layered card surfaces, and a burnt-orange
accent for primary actions. Bento-grid layout for both the
owner dashboard and the customer menu landing.

## Colors

All components must use these tokens — no hardcoded hex
values.

| Role            | CSS Variable       | Value       |
| ---------------- | ------------------ | ----------- |
| Page background   | `--bg-base`         | `#1A1A2E`   |
| Surface (cards)    | `--bg-surface`      | `#16213E`   |
| Glass overlay      | `--bg-glass`        | `rgba(255,255,255,0.07)` |
| Primary text       | `--text-primary`    | `#F5F5F5`   |
| Muted text         | `--text-muted`      | `#8A8FA8`   |
| Primary accent     | `--accent-primary`  | `#FF4F00`   |
| Secondary accent   | `--accent-gold`     | `#FFD700`   |
| Border             | `--border-default`  | `#2A2F4A`   |
| Success            | `--state-success`   | `#00F5A0`   |
| Error              | `--state-error`     | `#FF5C5C`   |

## Typography

| Role      | Font        | Variable      |
| --------- | ----------- | ------------- |
| UI text   | Geist Sans  | `--font-sans` |
| Code/mono | Geist Mono  | `--font-mono` |

## Border Radius

| Context           | Class          |
| ------------------ | -------------- |
| Inline / small UI   | `rounded-md`   |
| Cards / bento tiles | `rounded-2xl`  |
| Modals / overlays   | `rounded-3xl`  |

## Component Library

shadcn/ui on top of Tailwind. Components live in
`components/ui/`. Use the shadcn CLI to add new base
components rather than writing them from scratch; this
folder is protected (see `ai-workflow-rules.md`).

## Layout Patterns

- **Customer menu landing**: bento grid — logo/table
  banner (full width) → today's special / must-try /
  active offer (3-tile row) → horizontal-scroll category
  filter → dish grid (2-col mobile) → sticky floating cart
  bar (bottom).
- **Owner dashboard**: bento grid — KPI row (revenue,
  orders today, avg rating, top dish) → wide revenue chart
  + wide AI/insight tile → live order board (tall) + recent
  customers (medium).
- **Sidebars** (owner shell only): fixed width with a
  right border separator, collapsible on mobile.
- **Modals**: centered overlay with backdrop blur, using
  `--bg-glass`.
- **Navbar**: top bar with bottom border, restaurant name +
  role indicator on the owner side.

## Icons

Lucide React. Stroke-based icons only. Sizes: `h-4 w-4`
for inline icons, `h-5 w-5` for buttons and bento tile
headers.
