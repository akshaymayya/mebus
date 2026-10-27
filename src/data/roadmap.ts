/**
 * The goal is a plan, not a claim. Keep it high level and update it as the work
 * changes.
 */
export const goal =
  "Get one bus operator to use this for two weeks on real trips, and show one mistake it caught before it got expensive.";

/**
 * Timeline order follows the build plan. The phases are stage numbers, not
 * promised delivery dates. No status is implied until it is confirmed.
 */
export interface RoadmapStage {
  phase: string;
  title: string;
  description: string;
}

export const roadmap: RoadmapStage[] = [
  {
    phase: "01",
    title: "Understand the problem",
    description:
      "Talk to operators, pick the first workflow, and collect real sample files.",
  },
  {
    phase: "02",
    title: "Build the foundation",
    description:
      "Set up the app, database, login, and the walls that keep each company's data separate.",
  },
  {
    phase: "03",
    title: "Bring the data in",
    description:
      "Import trips and bookings, then show a clear timeline for each booking.",
  },
  {
    phase: "04",
    title: "Make problems visible",
    description:
      "Track refunds and cancellations, and log every important change.",
  },
  {
    phase: "05",
    title: "Add a careful AI helper",
    description:
      "Read-only tools, evidence for every answer, and a fixed set of test cases.",
  },
  {
    phase: "06",
    title: "Put a human in the loop",
    description:
      "Proposals, an approval screen, and reminders that run exactly once.",
  },
  {
    phase: "07",
    title: "Run a real pilot",
    description:
      "Document reminders and expiry alerts. One operator uses it on real work for two weeks.",
  },
];
