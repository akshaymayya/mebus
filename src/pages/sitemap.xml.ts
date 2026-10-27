import type { APIRoute } from "astro";
import { getPublishedLogEntries, isoDate, logPath } from "../lib/log";
import { escapeXml } from "../lib/xml";

export const GET: APIRoute = async ({ site: astroSite }) => {
  const base = astroSite ?? new URL("https://example.com");
  const entries = await getPublishedLogEntries();

  const staticPages = [
    { loc: new URL("/", base).href, priority: "1.0" },
    { loc: new URL("/log/", base).href, priority: "0.8" },
  ];

  const entryPages = entries.map((entry) => ({
    loc: new URL(logPath(entry), base).href,
    lastmod: isoDate(entry.data.date),
    priority: "0.7",
  }));

  const urls = [...staticPages, ...entryPages]
    .map(
      (item) => `  <url>
    <loc>${escapeXml(item.loc)}</loc>${"lastmod" in item && item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : ""}
    <priority>${item.priority}</priority>
  </url>`,
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
};
