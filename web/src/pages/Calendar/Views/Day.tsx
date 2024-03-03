// external imports
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { addMinutes, isSameDay, setHours, setMinutes } from "date-fns";

// internal imports
import { useCal } from "../context";
import CalItem from "components/CalItem";
import HoursLabels from "components/HoursLabels";
import HoursDisplay from "components/HoursDisplay";
// types
import { CalEvent } from "types/event";

/**
 * UI component, renders daily calendar view
 * @returns {ReactNode}
 */
const DayView = () => {
  const { days, selectedDay, setAddEventModal } = useCal();
  const day = days?.find((d) => isSameDay(d.date, selectedDay));
  const events = day?.events;

  const handleClick = (hours: number, minutes: number) => {
    const withHours = setHours(selectedDay, hours);
    const withMinutes = setMinutes(withHours, minutes);
    setAddEventModal({
      id: uuidv4(),
      startTime: withMinutes,
      endTime: addMinutes(withMinutes, 30),
    });
  };

  return (
    <div className="d-flex w-100 h-100 position-relative overflow-auto">
      <HoursLabels />
      <div className="w-100 position-relative">
        {events?.map((ev: CalEvent) => (
          <CalItem calEvent={ev} key={ev?.id} />
        ))}
        <HoursDisplay handleClick={handleClick} />
      </div>
    </div>
  );
};

export default DayView;
