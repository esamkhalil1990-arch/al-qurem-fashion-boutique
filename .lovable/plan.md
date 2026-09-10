# AL-Qurem Brand and Business Details Update

## What will change
- Add the verified phone number and weekly opening hours everywhere visitors expect them: contact actions, location details, footer, and search metadata.
- Create an original Arabic-only `القرم` SVG mark with a compact, flowing calligraphic composition and transparent background.
- Place the mark prominently in the opening section and animate its strokes over roughly 2.5 seconds, with a static fallback for reduced-motion visitors.
- Upgrade Arabic typography site-wide for clearer body text, stronger headings, better spacing, and balanced mobile sizing.
- Preserve every existing section, bilingual switch, navigation link, map, and responsive behavior.

## Technical details
- The logo will remain vector-based as a reusable React SVG component, using animated stroke masks and semantic color tokens.
- Business information will stay centralized so phone and hours remain consistent across the site.
- Arabic body and heading fonts will load from the existing document font setup; the logo artwork itself will not contain English text.
- Final checks will cover build health, Arabic and English rendering, desktop/mobile layout, phone links, and reduced-motion behavior.
