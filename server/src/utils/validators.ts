// External Imports
import { version as uuidVersion, validate as uuidValidate } from "uuid";

export const isValidId = (uuid: string) => {
  return uuidValidate(uuid) && uuidVersion(uuid) === 4;
};
