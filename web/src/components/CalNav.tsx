// external imports
import React, { Dispatch, SetStateAction } from "react";
import { IoArrowBackOutline, IoArrowForwardOutline } from "react-icons/io5";
import { format, isSameDay, addMonths, subMonths } from "date-fns";
import { useNavigate } from "react-router-dom";
import { IoLogOutOutline } from "react-icons/io5";

// internal imports
import { useCal } from "../pages/Calendar/context";
import { getUserInitials } from "utils/general";
import { daysOfWeek } from "constants/days";
import { useApp } from "context/useApp";
import { signout } from "api/auth";

/**
 * Leftside "navigation" panel, renders components to easily/quickly switch between days
 * There is a small user details widget at the top, I envision this as having account and sessions functionality i.e. update account, logout etc
 * @returns {ReactNode}
 */
const CalNav = () => {
  const { user } = useApp();
  const navigate = useNavigate();
  const { days, selectedDay, setSelectedDay } = useCal();

  const handleSignout = async () => {
    try {
      signout();
      navigate("/login");
    } catch (err: any) {
      window.alert(err.message || "There was an issue signing you out");
    }
  };

  return (
    <div className="cal-nav">
      <div className="nav-box d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <div className="ms-1 me-2 user-icon">{getUserInitials(user)}</div>
          <div>
            <h2>
              {user?.firstName} {user?.lastName}
            </h2>
            <h4 style={{ fontSize: 10 }}>{user?.email}</h4>
          </div>
        </div>
        <div onClick={handleSignout}>
          <IoLogOutOutline />
        </div>
      </div>
      <div className="nav-box mt-3">
        <div className="mt-2 mb-3 pe-2 ps-2 d-flex align-items-center justify-content-between">
          <h2>{format(selectedDay, "MMMM")}</h2>
          <div className="d-flex">
            <IoArrowBackOutline
              className="me-2"
              onClick={() => setSelectedDay(subMonths(selectedDay, 1))}
            />
            <IoArrowForwardOutline
              onClick={() => setSelectedDay(addMonths(selectedDay, 1))}
            />
          </div>
        </div>
        <div style={{ width: "100%", display: "flex", flexWrap: "wrap" }}>
          {daysOfWeek.map((day, key) => (
            <div key={key} className="cal-select-header-item">
              {day[0]}
            </div>
          ))}
          {days?.map((day, key) => (
            <SelectDayItem
              day={day}
              key={key}
              setSelectedDay={setSelectedDay}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CalNav;

// renders a little circle for each day of the month
const SelectDayItem = ({
  day,
  setSelectedDay,
}: {
  day: any;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
}) => {
  const { selectedDay } = useCal();
  const isSelected = isSameDay(day?.date, selectedDay);

  return (
    <div
      onClick={() => setSelectedDay(day?.date)}
      className="cal-select-item-wrap"
    >
      <div
        className={`cal-select-item ${
          day?.padding && "cal-select-item-padding"
        }`}
        style={{
          color: isSelected ? "white" : "",
          background: isSelected ? "#5a64db" : "",
        }}
      >
        {day?.day}
      </div>
    </div>
  );
};
