// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";
import { isAuthenticated, isAdmin } from "./auth";

export const permissions =
  (options: {
    user?: RequestHandler | boolean;
    admin?: RequestHandler | boolean;
    anonymous?: RequestHandler | boolean;
  }): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    if (isAdmin(req)) {
      if (options.admin) {
        return next();
      } else {
        return res.status(403).send({ message: "You are not allowed to do this" });
      }
    } else if (isAuthenticated(req)) {
      if (options.user) {
        return next();
      } else {
        return res.status(403).send({ message: "You are not allowed to do this" });
      }
    } else {
      if (options.anonymous) {
        return next();
      } else {
        return res.status(403).send({ message: "You are not allowed to do this" });
      }
    }
  };
