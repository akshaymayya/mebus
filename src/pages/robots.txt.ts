import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site: astroSite }) => {
  const base = astroSite ?? new URL("https://example.com");
  const sitemap = new URL("/sitemap.xml", base);

  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap.href}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
