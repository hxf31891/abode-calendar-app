// external imports
import { format, addMinutes } from "date-fns";

// types
import { CalEvent } from "types/event";

export const validateTimes = (addEventModal: CalEvent) => {
  if (addEventModal.startTime !== undefined) {
    const { startTime } = addEventModal;
    return {
      start: format(startTime, "HH:mm"),
      end: format(addMinutes(startTime, 30), "HH:mm"),
    };
  } else {
    const now = new Date();
    return {
      start: format(now, "HH:mm"),
      end: format(addMinutes(now, 30), "HH:mm"),
    };
  }
};
