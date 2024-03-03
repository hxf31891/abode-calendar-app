// external imports'
// import { useState } from "react";

// internal imports
import { useCal } from "../pages/Calendar/context";
import { getUserInitials } from "utils/general";
// types
import { CalEvent } from "types/event";

/**
 * UI component that renders a single event onto the calendar, adjusts to fit various views.
 * @param {CalEvent} calEvent calendar event to populate item
 * @returns
 */
const CalItem = ({ calEvent }: { calEvent: CalEvent }) => {
  const { view, setEditEventModal } = useCal();
  const { title, top, height, color, users, borderColor } = calEvent;
  const _color = color || "#bed8fb";

  const handleClick = (e: any) => {
    setEditEventModal(calEvent);
    e.stopPropagation();
  };

  return (
    <div className={`cal-item-wrap cal-item-wrap-${view}`} style={{ top: top }}>
      <div
        className={`cal-item cal-item-${view}`}
        style={{
          height: height,
          background: _color,
          borderColor: borderColor,
        }}
        onClick={handleClick}
      >
        <div>{title || "Event Title"}</div>
        <div className="d-flex flex-wrap">
          {users?.map((user) => (
            <div key={user?.id} className="me-1 mt-1 user-icon user-icon-sm">{getUserInitials(user)}</div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalItem;
