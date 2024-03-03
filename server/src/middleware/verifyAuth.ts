// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";

export const isAuthenticated = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  if (!!req.userId || !!req.adminId) {
    return next();
  } else {
    return res.status(401).send({ message: "You must be authenticated to do this" });
  }
};

export const isUser = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  if (!!req.userId) {
    return next();
  } else {
    return res.status(403).send({ message: "You must be an authenticated user to do this" });
  }
};

export const isAdmin = (): RequestHandler => (req: Request, res: Response, next: NextFunction) => {
  if (!!req.adminId) {
    return next();
  } else {
    return res.status(403).send({ message: "You must be an authenticated admin to do this" });
  }
};
