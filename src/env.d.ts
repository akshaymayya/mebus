/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly PUBLIC_FORM_ENDPOINT?: string;
  readonly PUBLIC_FORM_ACCESS_KEY?: string;
  readonly PUBLIC_ANALYTICS?: string;
  readonly PUBLIC_ANALYTICS_DOMAIN?: string;
  readonly PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
