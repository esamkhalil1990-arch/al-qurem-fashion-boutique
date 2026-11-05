# Roadmap — Port Bolt version into Lovable project

## Twilio WhatsApp OTP
- [x] Link the owner's Twilio connection; preserve existing customer identities and email access.
- [x] Review official support: Twilio Verify provider is documented in Cloud phone settings, but WhatsApp delivery through Cloud Auth is not confirmed in Lovable documentation.
- [ ] Activate and verify WhatsApp login: blocked by unconfirmed Cloud Auth WhatsApp-channel support and required hosted provider setup; do not build a separate authentication system or claim connector linkage activates login.

## Sign-in refinement
- [x] Refine phone/email menus, visibility controls, validation, feedback and recovery navigation while preserving guest checkout and owner access.
- [x] Research free production phone OTP options: no supported ongoing free SMS service to Jordan verified; provider trials are not free production delivery. No new provider connected.
- [x] Verify sign-in transitions, password visibility, recovery navigation, invalid numbers and overflow at 320/384/430/768/1280px; simulated OTP responses verify code visibility, Arabic keypad, cooldown and expired-code errors. Six tests pass; build clean.
- [ ] Verify real SMS delivery and sign-in: blocked until owner configures a supported SMS provider and supplies a designated recipient; no unsolicited codes sent.

## Approved store improvements and guest shopping
- [x] Add bilingual homepage/photo/policy content editing with original defaults and protected admin writes.
- [x] Add audited delivery-detail corrections, customer order history/status timelines, stock quantities and dashboard low-stock alerts.
- [x] Allow guest cart additions and quantities; require verified sign-in only at checkout and preserve guest cart through sign-in using atomic checkout merge.
- [ ] Activate and verify phone SMS login: hosted settings confirm phone provider is disabled; owner must configure a paid SMS provider under Users → Settings → Phone. Existing email access retained to avoid owner lockout.
- [x] Verify isolated-browser guest add/quantity/checkout gate, real content unchanged save/read-back, 15 rule tests and public/admin mobile layouts. No sample products/orders inserted.
- [ ] Verify stock deduction, delivery corrections and customer tracking with real orders: no real products/orders exist, and no designated customer test account is available.

## Seamless website and admin review
- [x] Audit customer journeys and existing admin controls; fix settings hydration, size selection, action feedback, cart/favorites errors, account sign-out and recovery entry, and sensitive order confirmations.
- [x] Verify real admin access, unchanged account/settings save-and-read-back, sign-out denial, public pages at 320/360/375/384/390/414/430/768/1280px, and admin pages at 320/384/430/768/1280px; nine rule tests pass and build is clean.
- [x] Report editing limitations and optional improvements for the owner's decision; no optional content editor, inventory, or notification system added.
- [ ] Verify signup profile creation and recovery email end-to-end: requires a designated customer test account/mailbox; trigger presence and approved return URLs checked without fabricating customers or sending unsolicited emails.

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

## Password recovery confirmation
- [x] Show a clear confirmation with the addressed email after a reset link is requested.
- [x] Add a resend action with a 30-second cooldown and a new-link confirmation, plus a request-a-new-link route from the reset page.
- [x] Verify send, cooldown, resend, back-to-sign-in, both languages, and 320/384/430px layouts in the browser; four helper tests pass.
