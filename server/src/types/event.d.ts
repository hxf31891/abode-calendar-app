import { User } from "./user";

export type Event = {
  id?: string;
  title: string;
  color: string;
  startTime: Date;
  endTime: Date;
  description: string;
  link: string;
  ownerId: string;
  owner?: User;
  updatedAt: Date;
  deletedAt?: Date;
  events: string;
};

export type EventInsertValues = {
  id?: string;
  title: string;
  color: string;
  startTime: Date;
  endTime: Date;
  description: string;
  link: string;
  ownerId: string;
};

export type EventEditValues = {
  title: string;
  color: string;
  startTime: Date;
  endTime: Date;
  description: string;
  ownerId: string;
  link: string;
};
