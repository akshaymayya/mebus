import { defineConfig } from "astro/config";
import { loadEnv } from "vite";

const env = loadEnv(process.env.NODE_ENV ?? "production", process.cwd(), "");
const site = env.SITE_URL || "https://example.com";

export default defineConfig({
  site,
  trailingSlash: "always",
  build: {
    // Keep CSS in external files so the production CSP can stay strict.
    inlineStylesheets: "never",
  },
  vite: {
    build: {
      // Keep the contact-form script external too. A strict CSP cannot allow
      // the inline module Astro would otherwise produce for small scripts.
      assetsInlineLimit: 0,
    },
  },
});
