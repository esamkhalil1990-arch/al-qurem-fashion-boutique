# Roadmap — Port Bolt version into Lovable project

- [x] Enable Lovable Cloud
- [x] Enable email/password auth
- [x] Migration: products, cart_items, favorites, profiles tables + RLS + grants
- [x] site-data: add WhatsApp number (962782116684)
- [x] Header: cart, favorites, account, WhatsApp, Instagram icons
- [x] Floating WhatsApp bubble
- [x] Category shop pages /category/$slug with sorting + empty state
- [x] Cart page /cart (DB-backed, login required, WhatsApp checkout)
- [x] Favorites page /favorites (DB-backed, login required)
- [x] Login/signup page /login (email + password)
- [x] Policy pages /policy/$slug (exchange, return, delivery, privacy, terms)
- [x] Footer: policy links + WhatsApp
- [x] Verify: build OK, typecheck OK, Playwright smoke test all pages, no console errors

## Order and account management
- [ ] Persist real checkout orders with price snapshots and delivery details.
- [ ] Add admin order search, details, status updates, notes and archiving.
- [ ] Add real account search, profile editing, suspension and role management.
- [ ] Validate administrative permissions, live flows and narrow-screen layouts.

## Full-site responsive audit
- [x] Audit all shared sections, shop routes, account pages, policies, and authenticated admin forms.
- [x] Fix narrow-screen navigation, touch targets, text wrapping, grids, RTL, and viewport-safe forms.
- [x] Validate 320, 360, 375, 390, 414, 430px, tablet, desktop, both languages, and reduced motion with browser checks.

## Official logo replacement
- [x] Verify and obtain the authentic official store logo from the owner's share link and matching store profile photo.
- [x] Replace header and opening-section marks with the same original asset, preserving static header and animated reveal.
- [x] Verify both placements, progressive reveal and reduced-motion fallback, clean build, and mobile layout without overflow.
