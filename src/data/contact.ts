/** The external form endpoint is supplied through deployment configuration. */
export const formEndpoint = (import.meta.env.PUBLIC_FORM_ENDPOINT ?? "").trim();
