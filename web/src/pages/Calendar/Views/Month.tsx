// external imports
import { format, addMinutes } from "date-fns";

// internal imports
import { useCal } from "../context";
import CalItem from "components/CalItem";
import DaysOfWeekHeader from "components/WeekHeader";
// types
import { CalEvent } from "types/event";

/**
 * UI component, renders monthly calendar view
 * @returns {ReactNode}
 */
const MonthView = () => {
  const { days } = useCal();
  return (
    <>
      <DaysOfWeekHeader />
      <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
        {days?.map((day) => (
          <DayItem key={format(day?.date, "MM/dd/yy")} day={day} />
        ))}
      </div>
    </>
  );
};

/**
 * UI component, renders and individual day in the monthly view and its events
 * @returns {ReactNode}
 * @param {Day} day data of the individual day
 */
const DayItem = ({ day }: { day: any }) => {
  const { setAddEventModal } = useCal();
  // const isSelected = isSameDay(day?.date, selectedDay);

  const handleClick = () => {
    setAddEventModal({
      startTime: day?.date,
      endTime: addMinutes(day?.date, 30),
    });
  };

  return (
    <div
      onClick={handleClick}
      className={`monthly-day-item position-relative ${
        day?.padding && "cal-select-item-padding"
      }`}
    >
      {day?.day}
      {day?.events?.map((ev: CalEvent) => (
        <div className="position-relative" key={ev?.id}>
          <CalItem calEvent={ev} />
        </div>
      ))}
    </div>
  );
};

export default MonthView;
