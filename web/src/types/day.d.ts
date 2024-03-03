// types
import { CalEvent } from "types/event";

export type Day = {
  date: Date;
  day?: number;
  padding?: boolean;
  events?: CalEvent[];
};
