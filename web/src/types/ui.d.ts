import { Dispatch, ReactNode, SetStateAction } from "react";

import { CalEvent } from "types/event";
import { Day } from "./day";

// components
export type ViewSelectorBtnProps = {
  label: string;
};

export type CalNavItemProps = {
  day: Day;
  setSelectedDay: Dispatch<SetStateAction<Date>>;
};

export type HoursDisplayProps = {
  handleClick: (arg0: number, arg1: number) => void;
};

export type ModalProps = {
  open: boolean;
  title: string;
  children: ReactNode;
  handleClose: () => void;
};

export type WeekHeaderProps = {
  spacer?: boolean;
};

// components/form
export type ColorPickerProps = {
  color: string;
  setColor: Dispatch<SetStateAction<string>>;
};

export type ColorPickerItemProps = {
  color: string;
  value: string;
  setColor: Dispatch<SetStateAction<string>>;
};

// modals
export type AddModalProps = {
  addEventModal: CalEvent;
  handleClose: () => void;
};

export type UpdateModalProps = {
  editEventModal: CalEvent;
  handleClose: () => void;
};
