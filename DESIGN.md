# Design

## Direction

Quiet desk. The app should feel like a calm reading instrument, not a document management suite. The document is the subject; the shell recedes until asked for.

## Palette

- Desk: `#101412`
- Deep desk: `#0A0D0C`
- Paper: `#FBFAF6`
- Paper edge: `#E7E2D8`
- Ink: `#20231F`
- Muted ink: `#707871`
- UI surface: `#171C19`
- UI line: `rgba(255, 255, 255, 0.12)`
- Marker accent: `#E3C46A`
- Error: `#D87575`

## Typography

- UI: `Segoe UI Variable`, `Segoe UI`, sans-serif
- Reader sample: `Source Han Serif SC`, `Songti SC`, Georgia, serif
- Shortcut keys: `Cascadia Mono`, `Consolas`, monospace

## Layout

- Desktop-first. Primary reference viewport is 1440 x 900.
- PDF page is centered and fit to the available reading width.
- Hover controls occupy one thin top strip and disappear after pointer leave.
- Command panel is a lower-contrast sheet with a search field and shortcuts.
- Resize zones are invisible but show a faint marker accent while resizing.

## Motion

- Hover control strip: 160 ms fade and 8 px slide.
- Command panel: 180 ms fade and scale from 0.985.
- Reduced motion: opacity only.

## Accessibility

- All controls reachable by keyboard.
- Focus ring uses marker accent and remains visible on dark and light surfaces.
- Body text contrast target: WCAG AA.
- `Esc` closes overlays.
- Window move and resize have keyboard alternatives where practical.

## Anti-Patterns

- No full toolbar.
- No gradient decoration.
- No nested card stack.
- No glassmorphism as ornament.
- No heavy shadows.
- No emoji icons.
