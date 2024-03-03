// external imports
import React, { useState, useEffect } from "react";

// internal imports
import { hours } from "constants/hours";
// types
import { Hour } from "types/hour";

/**
 * UI component that renders vertical blocks representing the hours of a day
 * @returns {ReactNode}
 */
const HoursLabels = () => {
  var [time, setTime] = useState<number>(24);

  useEffect(() => {
    var timer = setInterval(() => {
      let date = new Date();
      let hours = date.getHours();
      let minutes = (date.getMinutes() / 60) * 100;
      setTime(parseFloat(`${hours}.${minutes}`));
    }, 1000);
    return function cleanup() {
      clearInterval(timer);
    };
  });

  return (
    <div style={{ width: 66 }}>
      {hours?.map((h: Hour) => (
        <div className="hour-item" key={h?.value}>
          <div className="hour-item-label">{h?.label}</div>
        </div>
      ))}
      <div className="current-time-line" style={{ top: 90 * time }} />
    </div>
  );
};

export default HoursLabels;
