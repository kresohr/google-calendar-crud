import {
  format,
  startOfDay,
  addDays,
  startOfWeek,
  endOfWeek,
  isWithinInterval,
} from "date-fns";
import type { Event, DateFilter } from "../types";

type EventGroups = Record<string, Event[]>;

export const formatDate = (date: string) => format(new Date(date), "PPP");
export const formatTime = (date: string) => format(new Date(date), "h:mm a");

const sortGroupsByStartTime = (groups: EventGroups): void => {
  for (const key in groups) {
    groups[key].sort(
      (a, b) =>
        new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }
};

export const sortGroupKeys = (groups: EventGroups): string[] => {
  return Object.keys(groups).sort((a, b) => {
    const firstEventA = groups[a][0];
    const firstEventB = groups[b][0];
    return (
      new Date(firstEventA.startTime).getTime() -
      new Date(firstEventB.startTime).getTime()
    );
  });
};

export const filterEventsByDays = (
  events: Event[],
  days: DateFilter
): Event[] => {
  const today = startOfDay(new Date());
  const endDate = startOfDay(addDays(today, days));

  return events.filter((event) => {
    const eventStart = startOfDay(new Date(event.startTime));
    return isWithinInterval(eventStart, { start: today, end: endDate });
  });
};

export const groupEventsByDay = (events: Event[]) => {
  const groups: EventGroups = {};

  events.forEach((event) => {
    const dateKey = format(new Date(event.startTime), "yyyy-MM-dd");
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(event);
  });

  sortGroupsByStartTime(groups);

  return groups;
};

export const groupEventsByWeek = (events: Event[]) => {
  const groups: EventGroups = {};

  events.forEach((event) => {
    const eventDate = new Date(event.startTime);
    const weekStart = startOfWeek(eventDate, { weekStartsOn: 1 });
    const weekEnd = endOfWeek(eventDate, { weekStartsOn: 1 });
    const weekKey = `${format(weekStart, "MMM d")} - ${format(
      weekEnd,
      "MMM d, yyyy"
    )}`;

    if (!groups[weekKey]) {
      groups[weekKey] = [];
    }
    groups[weekKey].push(event);
  });

  sortGroupsByStartTime(groups);

  return groups;
};
