import { User } from "./user";

export type CalEvent = {
  id?: string;
  date?: Date | string;
  top?: number;
  link?: string;
  color?: string;
  title?: string;
  hours?: number;
  height?: number;
  minutes?: number;
  invitees?: string[];
  description?: string;
  borderColor?: string;
  endTime?: string | Date;
  startTime?: string | Date;
  users?: User[];
};
