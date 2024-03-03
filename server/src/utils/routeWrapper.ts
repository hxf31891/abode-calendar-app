import { RequestHandler, Request, Response, NextFunction } from "express";

export const routeWrapper =
  (callback: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      return callback(req, res, next);
    } catch (err) {
      console.log(err);

      next(err);
      // const _errorMessage = errorMessage || "An unknown error occurred";
      // return res.status(500).send({ message: _errorMessage });
    }
  };
