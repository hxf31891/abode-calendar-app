// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";

// Internal Imports
import { routeWrapper } from "./routeWrapper";

export const listRoute = (model: any, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { rows, count } = await model.listAndCount({ ...options, ...req.sqlParams });
      const offset = req.sqlParams.offset || 0;

      res.header("Access-Control-Expose-Headers", "Content-Range, X-Total-Count");
      res.header("Content-Range", `${offset}-${offset + rows.length}/${count}`);
      res.header("X-Total-Count", `${count}`);

      return res.status(200).send(rows);
    } catch (err) {
      console.error("Failed to list records", err);
      return next(err);
    }
  });

export const detailsRoute = (model: any, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {

    try {
      const record = await model.details(req.params.id, options);

      if (!record) {
        return res.status(404).json({ message: "Record not found" });
      }

      return res.status(200).send(record);
    } catch (err) {
      console.error("Failed to fetch record", err);
      return next(err);
    }
  });

export const createRoute = (model: any, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await model.insert(req.body, options);
      return res.status(201).send(record);
    } catch (err) {
      console.error("Failed to create record", err);
      return next(err);
    }
  });

export const updateRoute = (model: any, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({ message: "Missing or invalid record id" });
    }

    return model
      .edit(req.body, { ...options, where: { id } })
      .then((num: any) => {
        return model
          .details(id)
          .then((data: any) => res.status(200).send(data))
          .catch(next);
        // if (num == 1) {
        // } else {
        //   return res.status(404).send({ message: "Cannot update record. Was it deleted?" });
        // }
      })
      .catch((err: any) => {
        console.error("Failed to update record", err);
        next(err);
      });
  });

export const deleteRoute = (model: any, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) {
      return res.status(400).send({ message: "Missing or invalid record id" });
    }

    return model
      .delete({ ...options, where: { id } })
      .then((num: any) => {
        if (num == 1) {
          return res.status(200).send();
        } else {
          return res.status(404).send({ message: "Cannot update record. Was it deleted?" });
        }
      })
      .catch((err: any) => {
        console.error("Failed to delete record", err);
        next(err);
      });
  });
