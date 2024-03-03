// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";

export const isAuthUser = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === req.userId) {
    return next();
  } else {
    return res.status(403).send({ message: "You can only do this on your own profile" });
  }
};
