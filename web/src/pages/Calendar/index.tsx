// internal imports
import CalView from "./Views";
import CalNav from "components/CalNav";
import CalContextWrapper from "./context";
import AddEventModal from "modals/AddEvent";
import CalHeader from "components/CalHeader";
import UpdateEventModal from "modals/UpdateEvent";

/**
 * UI component - calendar page main
 * @returns {ReactNode}
 */
function CalendarPage() {
  return (
    <CalContextWrapper>
      <div className="page">
        <CalHeader />
        <div className="d-flex">
          <CalNav />
          <CalView />
        </div>
      </div>
      <AddEventModal />
      <UpdateEventModal />
    </CalContextWrapper>
  );
}

export default CalendarPage;
