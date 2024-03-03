// External Imports
import { AxiosResponse } from "axios";

// Internal Imports
import { cleanValues, addUrlQuery } from "./utils";
import { Query } from "types/query";
import { client } from "./client";

export const getEvents = async (query?: Query) => {
  const url = addUrlQuery(`/events`, query);
  const res: AxiosResponse = await client.get(url);
  return {
    data: res.data,
  };
};

export const getEvent = async (id: string = "current", query?: Query) => {
  const url = addUrlQuery(`/events/${id}`, query);
  const res: AxiosResponse = await client.get(url);
  return {
    data: res.data,
  };
};

export const createEvent = async (
  values: { [key: string]: any },
  query?: Query
) => {
  const url = addUrlQuery("/events", query);
  const cleanedValues = cleanValues(values);
  const res: AxiosResponse = await client.post(url, cleanedValues);
  return {
    data: res.data,
  };
};

export const updateEvent = async (
  id?: string,
  values?: { [key: string]: any },
  query?: Query
) => {
  if (id) {
    const url = addUrlQuery(`/events/${id}`, query);
    const cleanedValues = cleanValues(values);
    const res: AxiosResponse = await client.put(url, cleanedValues);
    return {
      data: res.data,
    };
  } else {
    return {};
  }
};

export const deleteEvent = async (id?: string, query?: Query) => {
  if (id) {
    const url = addUrlQuery(`/events/${id}`, query);
    const res: AxiosResponse = await client.delete(url);
    return {
      data: res.data,
    };
  } else {
    return {};
  }
};
