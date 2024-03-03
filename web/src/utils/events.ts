// external imports
import { getHours, getMinutes, isSameDay, differenceInMinutes } from "date-fns";

// internal imports
import { alterColor } from "./colors";
// types
import { Day } from "types/day";
import { CalEvent } from "types/event";

/**
 * add events to days array using date-fns isSameDay function
 * @param {Day[]} days
 * @param {(NewEvent | CalEvent)[]} events
 * @returns {Day[]} formatted days
 */
export const addEventsToDays = (days: Day[], events: CalEvent[]) => {
  const formattedEvents = events?.map((ev) => formatEvent(ev));
  return days?.map((d: Day) => ({
    ...d,
    events: formattedEvents?.filter((ev: CalEvent) =>
      isSameDay(new Date(ev?.startTime || ""), d?.date)
    ),
  }));
};

const formatEvent = (calEvent: CalEvent) => {
  const { endTime: et, startTime: st } = calEvent;
  const duration = differenceInMinutes(et || "", st || "");
  const top = (getHours(st || "") + getMinutes(st || "") / 60) * 90;
  const height = duration * 1.5;
  const color = calEvent?.color || "#bed8fb";
  const borderColor = alterColor(color, -50);

  return { ...calEvent, top, height, borderColor };
};
