// External Imports
import express, { RequestHandler, Router, Request, Response, NextFunction } from "express";

type MethodOptions = string[]; //["list", "retrieve", "create", "update", "destroy"];

type MethodHandlers = {
  [key: string]: RequestHandler;
  // list?: RequestHandler;
  // retrieve?: RequestHandler;
  // create?: RequestHandler;
  // update?: RequestHandler;
  // destroy?: RequestHandler;
};

const getMiddleware = (method: string, validations: MethodHandlers, permissions: MethodHandlers): RequestHandler[] => {
  const middleware = [];

  if (validations[method]) {
    middleware.push(validations[method]);
  }

  if (permissions[method]) {
    middleware.push(permissions[method]);
  }

  return middleware;
};

export default (
  path: string,
  model: any,
  {
    methods = ["list", "retrieve", "create", "update", "destroy"],
    validations = {},
    permissions = {},
    overrides = {},
  }: {
    methods?: Partial<MethodOptions>;
    validations?: MethodHandlers;
    permissions?: MethodHandlers;
    overrides?: MethodHandlers;
  }
) => {
  const router: Router = express.Router();

  if (methods.includes("list")) {
    /**
     * @openapi
     * /admin/v0/{resource}:
     *   get:
     *     description: Retrieves a list of records of a given resource (Admin Only)
     */
    router.get(
      path,
      getMiddleware("list", validations, permissions),
      typeof overrides.list === "function"
        ? overrides.list
        : async (req: Request, res: Response, next: NextFunction) => {
            try {
              const { rows, count } = await model.listAndCount(req.sqlParams);
              const offset = req.sqlParams.offset || 0;

              res.header("Access-Control-Expose-Headers", "Content-Range, X-Total-Count");
              res.header("Content-Range", `${offset}-${offset + rows.length}/${count}`);
              res.header("X-Total-Count", `${count}`);

              return res.status(200).send(rows);
            } catch (err) {
              console.error("Failed to list records", err);
              return next(err);
            }
          }
    );
  }

  if (methods.includes("retrieve")) {
    /**
     * @openapi
     * /admin/v0/{resource}/{id}:
     *   get:
     *     description: Retrieves a record by resource and id (Admin Only)
     */
    router.get(
      `${path}/:id`,
      getMiddleware("retrieve", validations, permissions),
      typeof overrides.retrieve === "function"
        ? overrides.retrieve
        : async (req: Request, res: Response, next: NextFunction) => {
            try {
              const record = await model.findByPk(req.params.id);

              if (!record) {
                return res.status(404).json({ message: "Record not found" });
              }

              return res.status(200).send(record);
            } catch (err) {
              console.error("Failed to fetch record", err);
              return next(err);
            }
          }
    );
  }

  if (methods.includes("create")) {
    /**
     * @openapi
     * /admin/v0/{resource}:
     *   post:
     *     description: Create a record of the given resource (Admin Only)
     */
    router.post(
      path,
      getMiddleware("create", validations, permissions),
      typeof overrides.create === "function"
        ? overrides.create
        : async (req: Request, res: Response, next: NextFunction) => {
            try {
              const record = await model.create(req.body);
              return res.status(201).send(record);
            } catch (err) {
              console.error("Failed to create record", err);
              return next(err);
            }
          }
    );
  }

  if (methods.includes("update")) {
    /**
     * @openapi
     * /admin/v0/{resource}/{id}:
     *   put:
     *     description: Update a record by resource and id (Admin Only)
     */
    router.put(
      `${path}/:id`,
      getMiddleware("update", validations, permissions),
      typeof overrides.update === "function"
        ? overrides.update
        : async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;
            if (!id) {
              return res.status(400).send({ message: "Missing or invalid record id" });
            }

            return model
              .update(req.body, { where: { id } })
              .then((num: any) => {
                if (num == 1) {
                  return model
                    .findByPk(id)
                    .then((data: any) => res.status(200).send(data))
                    .catch(next);
                } else {
                  return res.status(404).send({ message: "Cannot update record. Was it deleted?" });
                }
              })
              .catch((err: any) => {
                console.error("Failed to update record", err);
                next(err);
              });
          }
    );
  }

  if (methods.includes("destroy")) {
    /**
     * @openapi
     * /admin/v0/{resource}/{id}:
     *   delete:
     *     description: Delete a record by resource and id (Admin Only)
     */
    router.delete(
      `${path}/:id`,
      getMiddleware("destroy", validations, permissions),
      typeof overrides.destroy === "function"
        ? overrides.destroy
        : async (req: Request, res: Response, next: NextFunction) => {
            const id = req.params.id;
            if (!id) {
              return res.status(400).send({ message: "Missing or invalid record id" });
            }

            return model
              .destroy(req.body, { where: { id } })
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
          }
    );
  }

  return router;
};
