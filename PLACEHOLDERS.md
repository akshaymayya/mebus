# Placeholders

No visible `[FILL]` placeholders remain on the site. Search the repo for `[FILL` before publishing. Matches in this file, `AGENTS.md`, and `templates/build-log-entry.md` are documentation or template text, not rendered content.

## Optional contact details

| Value | Where | What to do |
| --- | --- | --- |
| LinkedIn profile URL | `src/data/site.ts` → `linkedin` | Add a full profile URL. The footer and the conditional connect section use it. Leave blank to hide it. |
| Email address | `src/data/site.ts` → `email` | Add a real address. It is shown as a `mailto:` link. Leave blank to hide it. |

The connect section and form are shown by default. `PUBLIC_FORM_ENDPOINT` can override the built-in Formspree endpoint.

## Progress

| Value | Where | What to do |
| --- | --- | --- |
| Plan stages | `src/data/roadmap.ts` → `roadmap` | These are stage numbers, not delivery dates or status claims. Update the copy when the real plan changes. |

## Deployment and services

| Value | Where | What to do |
| --- | --- | --- |
| Production URL (currently `https://example.com`) | `SITE_URL` in `.env` and the host's environment | Set the final URL. It feeds canonical tags, Open Graph, RSS, the sitemap, and `robots.txt`. |
| Form endpoint | `PUBLIC_FORM_ENDPOINT` | Optional override. The site ships with a built-in Formspree endpoint; set this only if you want a different form service. |
| Web3Forms access key | `PUBLIC_FORM_ACCESS_KEY` | Only for Web3Forms. It is public by design. |
| Analytics domain/token | `PUBLIC_ANALYTICS_DOMAIN` or `PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN` | Only if analytics is turned on. Leave `PUBLIC_ANALYTICS=off` to disable it. |

## Content

| Value | Where | What to do |
| --- | --- | --- |
| Build-log entries | `src/content/log/` | The collection is empty on purpose. The home-page log section stays hidden until a real entry exists; `/log/` shows an honest empty state. |
| Title, date, summary, tags, body | `templates/build-log-entry.md` | These are template values, not live content. Replace them when you copy the file. |
| Social preview image | `public/og.png` | Replace it if the name or one-line description changes. Keep it 1200 × 630. |

## Notes

- The RSS feed is valid but empty until you publish one entry with `draft: false`.
- The form has a honeypot (`_gotcha` and `botcheck`) and client-side limits. The form service handles spam on the server.
- The hero uses `public/hero.mp4` with `public/hero-poster.jpg` as its poster. The video is hidden and paused for reduced-motion visitors, so they see the poster instead.
