// external imports
import React, { createContext, useContext, useState, useEffect } from "react";
import { format, formatISO, startOfMonth, lastDayOfMonth } from "date-fns";
import { useNavigate } from "react-router-dom";

// internal imports
import { getEvents } from "api/events";
import { createDaysArray } from "utils/days";
import { addEventsToDays } from "utils/events";
// types
import { CalEvent } from "types/event";
import { ContextWrapperProps, CalContextProps } from "types/context";

const CalContext = createContext<CalContextProps | null>(null);

/**
 * Wrapper that provides shared state to various components. Simple alternitive to Redux
 * @param {ReactNode} children
 */
export default function CalContextWrapper({ children }: ContextWrapperProps) {
  const [addEventModal, setAddEventModal] = useState<CalEvent>({});
  const [editEventModal, setEditEventModal] = useState<CalEvent>({});
  // current selected day, moving this to URL params might create better UX
  const [selectedDay, setSelectedDay] = useState(new Date());
  const firstOfMonth = format(startOfMonth(selectedDay), "MM/dd/yy");
  // current selected view i.e. day, week, month
  const [view, setView] = useState("week");
  // local events data
  const [events, setEvents] = useState<CalEvent[]>([]);
  // days needed to populate views
  const _days = createDaysArray(selectedDay);
  // formatted days with their events added
  const days = addEventsToDays(_days, [...events, addEventModal]);
  const navigate = useNavigate();

  // pull events from api route
  const handleEvents = async () => {
    try {
      const startIso = formatISO(firstOfMonth);
      const endIso = formatISO(lastDayOfMonth(selectedDay));
      let { data } = await getEvents({
        filter: { startTime: { _between: [startIso, endIso] } },
      });
      setEvents(data);
    } catch (err: any) {
      if (err.status === 403) {
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    handleEvents();
    //eslint-disable-next-line
  }, [firstOfMonth]);

  const updateEvents = (updated: CalEvent[], id?: string) => {
    if (id) {
      let others = events.filter((ev) => ev?.id !== id);
      setEvents([...others, ...updated]);
    } else {
      setEvents([...events, ...updated]);
    }
  };

  const calContext = {
    days,
    view,
    setView,
    selectedDay,
    updateEvents,
    addEventModal,
    editEventModal,
    setSelectedDay,
    setAddEventModal,
    setEditEventModal,
  };

  return (
    <CalContext.Provider value={calContext}>{children}</CalContext.Provider>
  );
}

/**
 * Hook to access context state
 * @returns {CalContextProps}
 */
export function useCal() {
  const calContext = useContext(CalContext);

  if (!calContext) {
    throw new Error("useCal has to be used within <CalContext.Provider>");
  }

  return calContext;
}
