// external imports
import React, { MouseEvent } from "react";

// internal imports
import { hours } from "constants/hours";
// types
import { Hour } from "types/hour";
import { HoursDisplayProps } from "types/ui";

/**
 * UI component - On days and weeks view, renders the vertically cascading boxes representing different hours of the day
 * @param {function} handleClick - callback to open add event modal
 */
export const HoursDisplay = ({ handleClick }: HoursDisplayProps) => {
  // this fuction takes the specific hour clicked within and uses the native event to calculate how far down that child the user clicked in order to determine the start time for the new event.
  // For example if the user clicks half way down the child representing 4pm the start time will be set to 16:30
  const calculatePosition = (h: Hour, e: MouseEvent<HTMLDivElement>) => {
    const minutes = ((e?.nativeEvent?.offsetY || 0) / 90) * 60;
    handleClick(h?.value, minutes);
  };

  return hours?.map((h: Hour) => (
    <div
      onClick={(e: any) => calculatePosition(h, e)}
      className="hour-item"
      key={h?.value}
    ></div>
  ));
};

export default HoursDisplay;
