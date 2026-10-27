/**
 * Public details live here so the rest of the site does not need editing.
 * Leave a field blank to hide the related link. Never invent a contact.
 */
export const site = {
  name: "mebus",

  // Optional. The connect section and footer show these only when set.
  linkedin: "",

  // Optional. Shown as a mailto link only when set.
  email: "",

  description:
    "mebus is building an AI operating layer for Indian bus and road-logistics operators: connect the tools, make the work visible, and keep a human in the loop.",
} as const;

export function hasValue(value: string): boolean {
  return value.trim().length > 0;
}
