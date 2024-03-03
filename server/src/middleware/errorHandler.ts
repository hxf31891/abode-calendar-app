// External Imports
import { Request, Response, NextFunction } from "express";

export const errorHandler = () => (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("** Uncaught Error **", err);

  if (res.headersSent) {
    return next(err);
  }

  if (process.env.NODE_ENV === "local") {
    // pass unhandled errors to default express error handler
    // in local dev mode to send error to client
    return next(err);
  } else {
    return res.status(500).send({ message: "An unknown error occured" });
  }
};
