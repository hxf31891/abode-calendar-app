// external imports
import React from "react";
import { v4 as uuidv4 } from "uuid";
import { addMinutes, isSameWeek, setHours, setMinutes } from "date-fns";

// internal imports
import { useCal } from "../context";
import CalItem from "components/CalItem";
import HoursLabels from "components/HoursLabels";
import HoursDisplay from "components/HoursDisplay";
import DaysOfWeekHeader from "components/WeekHeader";
// types
import { Day } from "types/day";
import { CalEvent } from "types/event";

/**
 * UI component, renders weekley calendar view
 * @returns {ReactNode}
 */
const WeekView = () => {
  const { days, selectedDay, setAddEventModal } = useCal();
  const daysOfWeek = days?.filter((d) => isSameWeek(d.date, selectedDay));

  /**
   * Opens the add event modal by setting start and end time of addEventModal object
   * @param {Day} d
   * @param {number} hours
   * @param {number} minutes
   */
  const handleClick = (d: Day, hours: number, minutes: number) => {
    const withHours = setHours(d.date, hours);
    const withMinutes = setMinutes(withHours, minutes);
    setAddEventModal({
      id: uuidv4(),
      startTime: withMinutes,
      endTime: addMinutes(withMinutes, 30),
    });
  };

  return (
    <>
      <DaysOfWeekHeader spacer={true} />
      <div
        style={{ height: "calc(100% - 39px)" }}
        className="d-flex w-100 overflow-auto position-relative"
      >
        <HoursLabels />
        <div className="d-flex w-100" style={{ height: 90 * 24 }}>
          {daysOfWeek?.map((d: Day) => (
            <div key={d?.day} className="week-day position-relative">
              <HoursDisplay
                key={d?.day}
                handleClick={(h, m) => handleClick(d, h, m)}
              />
              {d?.events?.map((ev: CalEvent) => (
                <CalItem calEvent={ev} key={ev?.id} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default WeekView;
