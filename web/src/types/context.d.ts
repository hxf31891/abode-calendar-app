import { ReactNode, Dispatch, SetStateAction } from "react";
import { ErrorProps } from "./general";
import { CalEvent } from "./event";
import { User } from "./user";
import { Day } from "./day";

export type ContextWrapperProps = {
  children: ReactNode;
};

export type CalContextProps = {
  days: Day[];
  view: string;
  selectedDay: Date;
  addEventModal: CalEvent;
  editEventModal: CalEvent;
  setView: Dispatch<SetStateAction<string>>;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
  setAddEventModal: Dispatch<SetStateAction<CalEvent>>;
  setEditEventModal: Dispatch<SetStateAction<CalEvent>>;
  updateEvents: (arg0: CalEvent[], arg1?: string) => void;
};

export type AppWrapperProps = {
  children: ReactNode;
};

export type AppContextProps = {
  user: User;
  error: ErrorProps;
  loading: boolean;
  setUser: (arg0: User) => void;
  setError: Dispatch<SetStateAction<ErrorProps>>;
  setLoading: Dispatch<SetStateAction<boolean>>;
};
