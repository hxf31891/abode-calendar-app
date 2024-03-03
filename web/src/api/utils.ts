// Internal Imports
import { Query } from "types/query";

const isObject = (value: any): boolean =>
  typeof value === "object" && !Array.isArray(value) && value !== null;

const isEmpty = (
  value: any,
  { allowNull = false, allowUndefined = false, allowEmptyString = false }
): boolean =>
  (value === null && !Boolean(allowNull)) ||
  (value === undefined && !Boolean(allowUndefined)) ||
  (value === "" && !Boolean(allowEmptyString));

const isDate = (obj: any): boolean => {
  return typeof obj?.getMonth === "function";
};

export const cleanEmail = (email: string): string => email.trim().toLowerCase();

export const cleanValues = (
  values: any,
  config?: {
    allowNull: boolean;
    allowUndefined: boolean;
    allowEmptyString: boolean;
  }
): any => {
  let allowNull = config?.allowNull || true;
  let allowUndefined = config?.allowUndefined || false;
  let allowEmptyString = config?.allowEmptyString || true;

  if (Array.isArray(values)) {
    // handle arrays
    if (values.length > 0) {
      if (isObject(values[0])) {
        // handle array of objects
        return values.map((value) =>
          cleanValues(value, { allowNull, allowUndefined, allowEmptyString })
        );
      } else {
        // handle array of non object values
        return values.filter(
          (value) =>
            !isEmpty(value, { allowNull, allowUndefined, allowEmptyString })
        );
      }
    } else {
      // handle empty array
      return [];
    }
  } else if (!isObject(values)) {
    // handle non object values
    return values;
  } else {
    // handle object values
    const cleaned: { [key: string]: any } = {};

    Object.entries(values).forEach(([key, value]) => {
      if (
        !isEmpty(value, { allowNull, allowUndefined, allowEmptyString }) ||
        isDate(value)
      ) {
        if (isDate(value)) {
          cleaned[key] = value;
        } else if (Array.isArray(value) || isObject(value)) {
          cleaned[key] = cleanValues(value, {
            allowNull,
            allowUndefined,
            allowEmptyString,
          });
        } else {
          cleaned[key] = value;
        }
      }
    });

    return cleaned;
  }
};

export const addUrlQuery = (url: string, query?: Query): string => {
  if (!query || !isObject(query) || Object.keys(query).length === 0) {
    return url;
  }

  const { limit, offset, order, filter, token, ...rest } = query;

  var fullUrl = `${url}?`;
  if (rest && isObject(rest) && Object.keys(rest).length > 0) {
    Object.entries(rest).forEach(([key, value]) => {
      fullUrl += `${key}=${value}&`;
    });
  }

  if (limit) {
    fullUrl += `limit=${limit}&`;
  }

  if (offset) {
    fullUrl += `offset=${offset}&`;
  }

  if (order) {
    fullUrl += `sort_by=${JSON.stringify(order)}&`;
  }

  if (filter) {
    fullUrl += `filter=${JSON.stringify(filter)}&`;
  }

  if (token) {
    fullUrl += `token=${token}&`;
  }

  // remove trailing &
  return fullUrl.slice(0, -1);
};
