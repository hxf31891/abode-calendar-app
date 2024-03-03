// internal imports
import Day from "./Day";
import Week from "./Week";
import Month from "./Month";
import { useCal } from "../context";

/**
 *
 * @returns ReactNode
 * @desc UI component that returns current selected view
 */
const CalView = () => {
  const { view } = useCal();

  const getSelectedView = () => {
    switch (view) {
      case "day":
        return <Day />;
      case "week":
        return <Week />;
      case "month":
        return <Month />;
      default:
        return;
    }
  };

  return (
    <div className="cal">
      <div className="cal-container">{getSelectedView()}</div>
    </div>
  );
};

export default CalView;
