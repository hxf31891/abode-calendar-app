import {
  format,
  addDays,
  startOfWeek,
  getMonth,
  getDaysInMonth,
  startOfMonth,
  getDay,
  endOfMonth,
  getYear,
} from "date-fns";

/**
 * Creates array of days for the current week
 * @param {Date} selectedDay
 * @returns Day[]
 */
export const createWeekDaysArray = (selectedDay: Date) => {
  const first = startOfWeek(selectedDay);

  const createDay = (date: Date) => {
    const day = parseInt(format(date, "d"));
    return { day, date };
  };

  return [...Array(7).keys()].map((_, idx) => createDay(addDays(first, idx)));
};

/**
 * Creates array of days for the current month and the "padding" days, days from the last or next month needed to complete a week
 * @param {Date} selectedDay
 * @returns Day[]
 */
export const createDaysArray = (selectedDay: any) => {
  let firstOfMonth = startOfMonth(selectedDay);
  let selectedYear = getYear(firstOfMonth);
  let selectedMonth = getMonth(firstOfMonth) + 1;
  let daysInLastMonth = getDaysInMonth(
    new Date(selectedYear, selectedMonth - 2)
  );

  // last months days needed to populate first week if current months first day is not sunday
  let paddingDays = [...Array(getDay(firstOfMonth)).keys()]
    .map((_, idx) => ({
      date: new Date(
        `${selectedMonth - 1}/${daysInLastMonth - idx}/${selectedYear}`
      ),
      day: daysInLastMonth - idx,
      padding: true,
    }))
    .reverse();

  // days of the current month
  let daysToShow = getDaysInMonth(firstOfMonth);
  let days = [...Array(daysToShow).keys()].map((_, idx) => ({
    date: new Date(`${selectedMonth}/${idx + 1}/${selectedYear}`),
    day: idx + 1,
  }));

  // next months days needed to populate last week if current months last day is not saturday
  let lastDay = endOfMonth(firstOfMonth);
  let endPaddingDays = [...Array(6 - getDay(lastDay)).keys()].map((_, idx) => ({
    date: new Date(`${selectedMonth + 1}/${idx + 1}/${selectedYear}`),
    day: idx + 1,
    padding: true,
  }));

  return [...paddingDays, ...days, ...endPaddingDays];
};
