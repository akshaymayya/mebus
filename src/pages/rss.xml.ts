import type { APIRoute } from "astro";
import { site } from "../data/site";
import { getPublishedLogEntries, logPath } from "../lib/log";
import { escapeXml } from "../lib/xml";

export const GET: APIRoute = async ({ site: astroSite }) => {
  const base = astroSite ?? new URL("https://example.com");
  const entries = await getPublishedLogEntries();
  const feedUrl = new URL("/rss.xml", base);
  const channelUrl = new URL("/log/", base);

  const items = entries
    .map((entry) => {
      const url = new URL(logPath(entry), base).href;
      const categories = entry.data.tags
        .map((tag) => `<category>${escapeXml(tag)}</category>`)
        .join("");

      return `    <item>
      <title>${escapeXml(entry.data.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${entry.data.date.toUTCString()}</pubDate>
      <description>${escapeXml(entry.data.summary)}</description>${categories}
    </item>`;
    })
    .join("\n");

  const latestDate = entries[0]?.data.date;
  const lastBuildDate = latestDate
    ? `\n    <lastBuildDate>${latestDate.toUTCString()}</lastBuildDate>`
    : "";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(site.name)} — build log</title>
    <link>${escapeXml(channelUrl.href)}</link>
    <description>${escapeXml(site.description)}</description>
    <language>en</language>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(site.name)}</copyright>${lastBuildDate}
    <atom:link href="${escapeXml(feedUrl.href)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
};
