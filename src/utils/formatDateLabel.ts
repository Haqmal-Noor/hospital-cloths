import { parse, format, startOfWeek, endOfWeek } from "date-fns";

type Granularity = "day" | "week" | "month";

export function formatDateLabel(
  dateStr: string,
  granularity: Granularity
): string {
  if (granularity === "day") {
    const date = parse(dateStr, "yyyy-MM-dd", new Date());
    return format(date, "MMM d, yyyy"); // → "Jan 23, 2025"
  }

  if (granularity === "month") {
    const date = parse(dateStr, "yyyy-MM", new Date());
    return format(date, "MMMM yyyy"); // → "January 2025"
  }

  if (granularity === "week") {
    const [yearStr, weekStr] = dateStr.split("-");
    const year = parseInt(yearStr, 10);
    const week = parseInt(weekStr, 10);

    // Week calculation (based on ISO-8601)
    const jan4 = new Date(year, 0, 4);
    const start = startOfWeek(jan4, { weekStartsOn: 1 });
    start.setDate(start.getDate() + (week - 1) * 7);
    const end = endOfWeek(start, { weekStartsOn: 1 });

    return `${format(start, "MMM d")} – ${format(end, "MMM d, yyyy")}`;
  }

  return dateStr; // fallback
}
