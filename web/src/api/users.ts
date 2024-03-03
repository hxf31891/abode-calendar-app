// External Imports
import { AxiosResponse } from "axios";

// Internal Imports
import { cleanValues, addUrlQuery } from "./utils";
import { Query } from "types/query";
import { client } from "./client";

export const getUser = async (id: string = "current", query?: Query) => {
  const url = addUrlQuery(`/users/${id}`, query);
  const res: AxiosResponse = await client.get(url);
  return {
    data: res.data,
  };
};

export const updateUser = async (
  id: string = "current",
  values: { [key: string]: any },
  query?: Query
) => {
  const url = addUrlQuery(`/users/${id}`, query);
  const cleanedValues = cleanValues(values);
  const res: AxiosResponse = await client.put(url, cleanedValues);
  return {
    data: res.data,
  };
};
