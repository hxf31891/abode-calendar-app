// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";

type GetOwnerIdCallback = (req: Request, res: Response, next: NextFunction) => Promise<string>;

export const isOwner =
  (ownerId: string | GetOwnerIdCallback): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    let oId = "";

    if (!ownerId) {
      console.error("Missing or invalid ownerId, expected to be either a string or function");
      return res.status(500).send({ message: "Uh oh something went wrong" });
    } else if (typeof ownerId === "string") {
      oId = ownerId;
    } else if (typeof ownerId === "function") {
      try {
        oId = await ownerId(req, res, next);
      } catch (err: any) {
        return res.send({ message: err.message });
      }
    }

    if (oId === req.userId) {
      return next();
    } else {
      return res.status(403).send({ message: "You must be the owner to do this" });
    }
  };
