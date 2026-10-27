const DEFAULT_FORM_ENDPOINT = "https://formspree.io/f/xppppnyy";

/**
 * The form endpoint is public by design. `PUBLIC_FORM_ENDPOINT` can override
 * the built-in Formspree form without editing the templates.
 */
export const formEndpoint =
  (import.meta.env.PUBLIC_FORM_ENDPOINT ?? "").trim() || DEFAULT_FORM_ENDPOINT;
