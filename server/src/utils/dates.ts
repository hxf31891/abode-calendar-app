export const getFutureDate = (
  timeDeltas: {
    milliseconds?: number;
    seconds?: number;
    minutes?: number;
    hours?: number;
    days?: number;
    weeks?: number;
    months?: number;
    years?: number;
  },
  startDate: Date = new Date()
): Date => {
  const futureDate = new Date(startDate.getTime());
  if (timeDeltas.years) {
    futureDate.setFullYear(futureDate.getFullYear() + timeDeltas.years);
  }

  if (timeDeltas.months) {
    futureDate.setMonth(futureDate.getMonth() + timeDeltas.months);
  }

  if (timeDeltas.weeks) {
    futureDate.setDate(futureDate.getDate() + 7 * timeDeltas.weeks);
  }

  if (timeDeltas.days) {
    futureDate.setDate(futureDate.getDate() + timeDeltas.days);
  }

  if (timeDeltas.hours) {
    futureDate.setHours(futureDate.getHours() + timeDeltas.hours);
  }

  if (timeDeltas.minutes) {
    futureDate.setMinutes(futureDate.getMinutes() + timeDeltas.minutes);
  }

  if (timeDeltas.seconds) {
    futureDate.setSeconds(futureDate.getSeconds() + timeDeltas.seconds);
  }

  if (timeDeltas.milliseconds) {
    futureDate.setMilliseconds(futureDate.getMilliseconds() + timeDeltas.milliseconds);
  }

  return futureDate;
};
