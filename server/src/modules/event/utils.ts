// External Imports
import { Request, Response } from "express";

// Internal Imports
import { getNestedAttribute } from "../../utils/query";
import db from "../../models";

export const getOwnerId = (req: Request, res: Response): Promise<string> => {
  const { id } = req.params;
  if (!id) {
    res.status(400);
    throw new Error("Missing or invalid event");
  }

  return getNestedAttribute(db.events, id, "userId")
    .then((id: string) => id)
    .catch((err: Error) => {
      res.status(400);
      throw err;
    });
};
