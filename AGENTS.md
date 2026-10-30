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
