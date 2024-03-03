import { RequestHandler, Request, Response, NextFunction } from "express";

export const routeWrapper =
  (callback: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await callback(req, res, next);
    } catch (err) {
      next(err);
      // const _errorMessage = errorMessage || "An unknown error occurred";
      // return res.status(500).send({ message: _errorMessage });
    }
  };
