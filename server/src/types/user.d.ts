import { Event } from "./event";

export type User = {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
  events?: Event[];
};

export type UserInsertValues = {
  id?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type UserEditValues = {
  firstName?: string;
  lastName?: string;
  email?: string;
};
