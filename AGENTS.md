# AGENTS.md

This is a small static site for the mebus build-in-public log. Read the README before changing anything.

## Stack (do not add to it without asking)

- Astro with static output
- TypeScript
- Plain CSS
- GSAP 3 with ScrollTrigger for restrained motion (respect `prefers-reduced-motion`)
- Markdown content collections
- Formspree or Web3Forms for the contact form
- Optional Plausible or Cloudflare Web Analytics, off by default

No database, no custom backend, no client framework, no new dependencies.

## Rules

1. Do not invent facts, metrics, traction, testimonials, companies, or achievements. Use a clearly marked `[FILL: ...]` for anything real that is unknown.
2. Do not mention operator names, passenger data, customer data, or security-sensitive internals.
3. Keep personal details in `src/data/site.ts` and progress data in `src/data/roadmap.ts`. Do not hard-code them in templates.
4. Keep the form endpoint in an environment variable. Never commit `.env` or a real endpoint.
5. Preserve the static build. Do not add server rendering, a database, or an API route that stores data.
6. Keep the CSP strict. If a new external host is added, update both `public/_headers` and `vercel.json`.
7. Keep the site accessible: semantic HTML, visible focus states, labels, skip link, AA contrast, keyboard support.
8. Keep it fast and light: no heavy animations, carousels, stock photos, web fonts, or tracking cookies.
9. Every build-log entry is one Markdown file in `src/content/log/`. Drafts stay out of RSS, the sitemap, and search.
10. Make small, reviewable changes. Run `npm run build` before calling the work done.

## Where things live

- `src/data/site.ts` — name, LinkedIn, email, bio, project name
- `src/data/roadmap.ts` — goal, current stage, timeline statuses
- `src/content/log/` — build-log entries
- `src/pages/` — home, log pages, RSS, sitemap, robots, 404
- `src/styles/global.css` — all styling tokens and layout
- `public/` — favicon, `og.png`, security headers
- `templates/build-log-entry.md` — copy this to add an entry

## Before committing

- `npm run build` passes
- No new `[FILL]` appears without being added to `PLACEHOLDERS.md`
- No secrets, real passenger data, or operator exports
- Lighthouse and the existing accessibility behaviour are not worse
- The diff is small and the description is clear
