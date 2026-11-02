<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep both logo placements in the shared ArabicLogo component using the official asset pointer and a reveal mask; this preserves identical artwork without redrawing the raster source.
- Orders are created atomically from the authenticated cart by checkout_cart, with immutable product/price snapshots; browser totals are never authoritative.
- Customer auth management uses authenticated server functions with an active-account and database admin-role check before privileged access; roles must never be automatically reclaimed from email.
- Orders are cancelled or archived rather than deleted to preserve transaction history; account suspension also gates data access for existing sessions.
- Create customer profiles from the Auth signup trigger without assigning roles; confirmation-required signups have no browser session for profile writes.
- Admin settings forms hydrate only from a completed settings query, never from temporary public fallbacks; this prevents overwriting saved details during loading.
- Guest cart selections live locally and are merged with the authenticated cart inside the same checkout transaction; retries cannot duplicate orders or stock deductions.
- Nullable product stock means untracked inventory; tracked stock is locked and deducted atomically at checkout, while cancellations do not automatically restock goods.
- Homepage and policy overrides use public-readable, admin-writable site_content rows with stable content keys and original defaults; the official logo is never content-editable.
- Phone OTP is the primary customer login; retain existing email identity access until owner phone linking is verified to avoid owner lockout.
