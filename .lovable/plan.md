## Scope

Add scalable navigation + Compare Queue + Foundry Directory to TypeMatch Studio without breaking existing features. Reuse existing components (Font Card, Badge, Search, Toolbar, sidebar). No logic changes to pairing/comparison engines.

## Deliverables

### 1. Compare Queue (persistent)
- New `src/lib/compare-queue.ts` — localStorage-backed hook (`useCompareQueue`) mirroring `saved-pairings.ts` pattern. API: `items`, `add(font)`, `remove(id)`, `clear()`, `has(id)`, `count`. Max 4 items.
- Toolbar chip in Library header ("Compare (N)") linking to `/compare`. Always visible; distinct state at 0 vs ≥1.
- Font card gets a secondary Quick Action next to `Analyze →`: `+ Compare` / `✓ Added` (toggle add/remove). Does not replace Analyze.
- `/compare` route reads the queue as the default seed set (still allows manual pick if the current route supports it). Non-destructive: existing compare logic untouched.

### 2. Foundry Directory (separate from Library)
- New route `src/routes/foundries.tsx` — grid of foundries derived from existing `fonts.ts` (`source` field). Each card: name, family count, dominant license, external link, "View foundry →".
- New route `src/routes/foundries.$slug.tsx` — foundry detail:
  - Hero (name, description if we have one, website, license type, family count).
  - Stats strip (Families / Variable / Open Source / Commercial / Free) computed from the same data.
  - Typography grid: reuses the exact same font-card component from Library, filtered to that foundry.
- No content duplication; only external links, no copyrighted history text unless already in data.
- The Library `Source` filter remains — it filters in-place, does not replace the directory.

### 3. Navigation update
- Update `src/components/typematch/header.tsx` nav order:
  `Library` (=/), `Foundries`, `Compare`, `Saved`, `Method`, `Licensing`.
- `Saved` = anchor to existing saved pairings section on Library, OR a small dedicated route if trivial (prefer anchor to avoid new surface).
- Keep the current visual identity (font, spacing, underline indicator, dark/light toggle).

### 4. Component reuse guardrails
- Extract the font card body from `font-library.tsx` into `src/components/typematch/font-card.tsx` (if not already) so Library + Foundry detail share one component. Includes the new Quick Actions row.
- No new badge system, no new search component.

### Non-goals
- No redesign of hero, pairing engine, comparison engine, licensing page, method page.
- No new data ingestion; foundries derive from existing `FontRecord.source`.
- No auth, no backend.

## Technical notes

- `compare-queue.ts` follows the exact event/storage pattern in `src/lib/saved-pairings.ts` (custom event + `storage` listener, SSR-safe `typeof window` guard).
- Foundry slug = `slugify(source)`. Detail route param `$slug` resolved by matching `slugify(font.source) === slug`.
- Stats in foundry hero are computed client-side from the filtered list; no new fields required on `FontRecord`. If a field (e.g. country, founded year) doesn't exist in data, omit it — never fabricate.
- Compare chip in Library toolbar is a `Link to="/compare"`; badge count updates from `useCompareQueue().count`.
- Quick Action button on the card uses the same `.btn-card-secondary` token as source links to stay in the design system.
- Header stays responsive; mobile dropdown gets the same 6 items.

## Out of scope for this pass
- Server-side pagination for 5k families (still client-filtered, but grid + infinite scroll already scales).
- Rich foundry bios (needs curated content; leave hooks in the layout for later).
