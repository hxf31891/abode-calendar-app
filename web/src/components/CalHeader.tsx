// external imports
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";

// internal imports
import { useCal } from "pages/Calendar/context";

import Logo from "./Logo";

// types
import { ViewSelectorBtnProps } from "types/ui";

/**
 * UI component, header for calendar page
 * @returns {ReactNode}
 */
const CalHeader = () => {
  const { selectedDay, setAddEventModal } = useCal();

  return (
    <div className="header">
      <div className="d-flex align-items-center">
        <Logo animate={false} className="header-logo" />
        <h2>
          Easy<span className="fst-italic">Cal</span>
        </h2>
      </div>
      <div className="d-flex justidy-content-end">
        <div className="view-picker">
          {["day", "week", "month"].map((d) => (
            <ViewSelectorBtn key={d} label={d} />
          ))}
        </div>
        <button
          className="ms-3"
          onClick={() =>
            setAddEventModal({
              id: uuidv4(),
              startTime: selectedDay,
              endTime: addMinutes(selectedDay, 30),
            })
          }
        >
          Add Event
        </button>
      </div>
    </div>
  );
};

export default CalHeader;

/**
 * UI component, button to switch between different timeframe views
 * @param {string} label - button label, Day, Month, Year
 * @returns {ReactNode}
 */
const ViewSelectorBtn = ({ label }: ViewSelectorBtnProps) => {
  const { view, setView } = useCal();
  const isSelected = view === label;

  return (
    <div
      onClick={() => setView(label)}
      className={`view-picker-btn ${isSelected && "view-picker-btn-selected"}`}
    >
      {label}
    </div>
  );
};
