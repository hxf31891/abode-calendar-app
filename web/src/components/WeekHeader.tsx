// external imports
import { format, addDays, startOfWeek } from "date-fns";
// internal imports
import { daysOfWeek } from "../constants/days";
import { useCal } from "pages/Calendar/context";
// types
import { WeekHeaderProps } from "types/ui";

/**
 * UI component that renders the names of the days of the week for week and month views
 * @param {boolean} spacer - creates space on left to account for hours display on week view
 * @returns {ReactNode}
 */
const WeekHeader = ({ spacer }: WeekHeaderProps) => {
  return (
    <div className="d-flex pt-2" style={{ borderBottom: "1px solid #dde2e5" }}>
      {spacer && <div style={{ width: 66 }}></div>}
      {daysOfWeek.map((day: string, idx: number) => (
        <div key={day} className="cal-select-header-item">
          {day}
          {spacer && <DayNumber idx={idx} />}
        </div>
      ))}
    </div>
  );
};

export default WeekHeader;

// adds month and day # i.e. 3/11 to weekly view
const DayNumber = ({ idx }: { idx: number }) => {
  const { selectedDay } = useCal();
  const firstOf = startOfWeek(selectedDay);
  return ` ${format(addDays(firstOf, idx), "M/dd")}`;
};
