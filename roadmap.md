# Roadmap — Port Bolt version into Lovable project

## Seamless website and admin review
- [ ] Audit customer journeys and all existing admin controls; repair confirmed defects without redesigning the site.
- [ ] Verify real admin access, account/settings save-and-read-back, public navigation, and narrow-screen behavior.
- [ ] Report editing limitations and optional improvements for the owner's decision; do not add optional features without approval.

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
- [x] Persist real checkout orders with price snapshots and delivery details.
- [x] Add admin order search, details, status updates, notes and archiving.
- [x] Add real account search, profile editing, suspension and role management.
- [x] Validate real account search/save/read-back, self-suspension rejection, signed-out server rejection, order filter controls and 320–430/768/1280px layouts.
- [ ] Validate order creation/status change with a real order: blocked because the store has no products or existing orders, and fabricated records were prohibited.
- [ ] Validate another customer's permissions/suspension: blocked because no designated customer test account is available.

## Full-site responsive audit
- [x] Audit all shared sections, shop routes, account pages, policies, and authenticated admin forms.
- [x] Fix narrow-screen navigation, touch targets, text wrapping, grids, RTL, and viewport-safe forms.
- [x] Validate 320, 360, 375, 390, 414, 430px, tablet, desktop, both languages, and reduced motion with browser checks.

## Official logo replacement
- [x] Verify and obtain the authentic official store logo from the owner's share link and matching store profile photo.
- [x] Replace header and opening-section marks with the same original asset, preserving static header and animated reveal.
- [x] Verify both placements, progressive reveal and reduced-motion fallback, clean build, and mobile layout without overflow.
