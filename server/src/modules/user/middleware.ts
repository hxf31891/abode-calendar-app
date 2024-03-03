// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";

export const injectUserId = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  if (req.params.id === "current") {
    if (req.userId) {
      req.params.id = req.userId;
      return next();
    } else {
      return res.status(401).send({ message: "You must me logged in to do this" });
    }
  } else {
    return next();
  }
};

export const removeUserType = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  return next();
};
