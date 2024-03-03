// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";
import { Op, BelongsToMany, HasMany } from "sequelize";

// Internal Imports
import { routeWrapper } from "./routeWrapper";

export const listManyRoute = (association: HasMany, options: any): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).send({ message: `Missing or invalid ${association.source.name}` });
      }

      const optionWhere = options?.where || {};

      const { rows, count } = await (association.target as any).listAndCount({
        ...req.sqlParams,
        ...options,
        where: {
          ...req.sqlParams.where,
          ...optionWhere,
          [association.foreignKey]: id,
        },
      });

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

export const listManyToManyRoute = (association: BelongsToMany, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const sourceId = req.params.id;
    if (!sourceId) {
      return res.status(400).send({ message: "Missing or invalid record" });
    }

    const fnName = association.accessors.get;
    return association.source
      .findByPk(sourceId)
      .then((source: any) => {
        if (source) {
          return source[fnName]({ ...req.sqlParams, ...options, joinTableAttributes: [] })
            .then((targets: any) => {
              if (Array.isArray(targets)) {
                return res.status(200).send(targets);
              } else {
                return res.status(500).send("Unable to get records");
              }
            })
            .catch((err: Error) => {
              console.log("Failed to get many to many records", err);
              return res.status(500).send("Unable to get records");
            });
        } else {
          return res.status(404).send({ message: "Record not found" });
        }
      })
      .catch(next);
  });

export const setManyToManyRoute = (association: BelongsToMany, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const sourceId = req.params.id;
    const targetIds = req.body.ids;
    if (!sourceId) return res.status(400).send({ message: "Invalid source" });
    if (!targetIds) return res.status(400).send({ message: "Invalid targets" });

    try {
      const _targetIds = Array.isArray(targetIds) ? targetIds : [targetIds];

      const [source, targets] = await Promise.all([
        association.source.findByPk(sourceId),
        association.target.findAll({ where: { id: { [Op.in]: _targetIds } } }),
      ]);

      if (!source) {
        return res.status(404).send({ message: "Record not found" });
      }

      const fnName = association.accessors.set;
      return (source as any)
        [fnName](targets, options)
        .then(() => {
          source.reload();
          return res.status(200).send(source);
        })
        .catch((err: any) => {
          // failed to set targets, return as is without updates
          if (process.env.NODE_ENV === "local") console.error("Failed to set records", err);
          return res.status(500).send(source);
        });
    } catch (err) {
      return next(err);
    }
  });

export const addManyToManyRoute = (association: BelongsToMany, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const sourceId = req.params.id;
    const targetIds = req.body.ids;

    if (!sourceId) return res.status(400).send({ message: "Invalid source" });
    if (!targetIds) return res.status(400).send({ message: "Invalid targets" });

    try {
      const _targetIds = Array.isArray(targetIds) ? targetIds : [targetIds];

      const [source, targets] = await Promise.all([
        association.source.findByPk(sourceId),
        association.target.findAll({ where: { id: { [Op.in]: _targetIds } } }),
      ]);

      if (!source) {
        return res.status(404).send({ message: "Record not found" });
      }

      const fnName = association.accessors.addMultiple;
      return (source as any)
        [fnName](targets, options)
        .then(() => {
          source.reload();
          return res.status(200).send(source);
        })
        .catch((err: any) => {
          // failed to set targets, return as is without updates
          if (process.env.NODE_ENV === "local") console.error("Failed to add targets to source", err);
          return res.status(500).send(source);
        });
    } catch (err) {
      return next(err);
    }
  });

export const removeManyToManyRoute = (association: BelongsToMany, options: object = {}): RequestHandler =>
  routeWrapper(async (req: Request, res: Response, next: NextFunction) => {
    const sourceId = req.params.id;
    const targetIds = req.body.ids;
    if (!sourceId) return res.status(400).send({ message: "Invalid source" });
    if (!targetIds) return res.status(400).send({ message: "Invalid targets" });

    try {
      const _targetIds = Array.isArray(targetIds) ? targetIds : [targetIds];

      const [source, targets] = await Promise.all([
        association.source.findByPk(sourceId),
        association.target.findAll({ where: { id: { [Op.in]: _targetIds } } }),
      ]);

      if (!source) {
        return res.status(404).send({ message: "Record not found" });
      }

      const fnName = association.accessors.removeMultiple;
      return (source as any)
        [fnName](targets, options)
        .then(() => {
          source.reload();
          return res.status(200).send(source);
        })
        .catch((err: any) => {
          // failed to set targets, return as is without updates
          if (process.env.NODE_ENV === "local") console.error("Failed to remove targets from source", err);
          return res.status(500).send(source);
        });
    } catch (err) {
      return next(err);
    }
  });
