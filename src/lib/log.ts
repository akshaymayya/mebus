import { getCollection, type CollectionEntry } from "astro:content";

export type LogEntry = CollectionEntry<"log">;

/** All entries, newest first. Includes drafts so sample content can be reviewed. */
export async function getLogEntries(): Promise<LogEntry[]> {
  const entries = await getCollection("log");
  return entries.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Entries that should appear in RSS, the sitemap, and search results. */
export async function getPublishedLogEntries(): Promise<LogEntry[]> {
  return (await getLogEntries()).filter((entry) => !entry.data.draft);
}

export function logPath(entry: LogEntry): string {
  return `/log/${entry.id}/`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}
