// External Imports
import express, { Router, RequestHandler } from "express";
import { BelongsToMany, HasMany } from "sequelize";
import { join } from "path";

// Internal Imports
import { listRoute, detailsRoute, createRoute, updateRoute, deleteRoute } from "./crudRoutes";
import {
  listManyRoute,
  listManyToManyRoute,
  setManyToManyRoute,
  addManyToManyRoute,
  removeManyToManyRoute,
} from "./relationshipRoutes";

type CrudRouteParams = {
  method: string;
  middleware?: RequestHandler | RequestHandler[];
  override?: RequestHandler;
  options?: object;
};

type HasManyRouteParams = {
  pathExtension: string;
  association: HasMany;
  middleware?: RequestHandler | RequestHandler[];
  override?: RequestHandler;
  options?: object;
};

type ManyToManyRouteParams = {
  pathExtension: string;
  association: BelongsToMany;
  middleware?: RequestHandler | RequestHandler[];
  override?: RequestHandler;
  options?: object;
};

type RouterParams = {
  mergeParams?: boolean;
};

const getMiddleware = (middleware?: RequestHandler | RequestHandler[]) => {
  if (!middleware) {
    return [];
  } else if (Array.isArray(middleware)) {
    return middleware;
  } else {
    return [middleware];
  }
};

const mountCrudRoute = (router: Router, routeParams: CrudRouteParams, model: any) => {
  const lowerMethod = routeParams.method.toLowerCase();
  switch (lowerMethod) {
    case "list":
      /**
       * @openapi
       * /admin/v0/{resource}:
       *   get:
       *     description: Retrieves a list of records of a given resource (Admin Only)
       */
      router.get(
        "",
        getMiddleware(routeParams.middleware),
        typeof routeParams.override === "function" ? routeParams.override : listRoute(model, routeParams.options)
      );

      break;

    case "retrieve":
      /**
       * @openapi
       * /admin/v0/{resource}/{id}:
       *   get:
       *     description: Retrieves a record by resource and id (Admin Only)
       */
      router.get(
        "/:id",
        getMiddleware(routeParams.middleware),
        typeof routeParams.override === "function" ? routeParams.override : detailsRoute(model, routeParams.options)
      );

      break;

    case "create":
      /**
       * @openapi
       * /admin/v0/{resource}:
       *   post:
       *     description: Create a record of the given resource (Admin Only)
       */
      router.post(
        "",
        getMiddleware(routeParams.middleware),
        typeof routeParams.override === "function" ? routeParams.override : createRoute(model, routeParams.options)
      );

      break;

    case "update":
      /**
       * @openapi
       * /admin/v0/{resource}/{id}:
       *   put:
       *     description: Update a record by resource and id (Admin Only)
       */
      router.put(
        "/:id",
        getMiddleware(routeParams.middleware),
        typeof routeParams.override === "function" ? routeParams.override : updateRoute(model, routeParams.options)
      );

      break;

    case "delete":
      /**
       * @openapi
       * /admin/v0/{resource}/{id}:
       *   delete:
       *     description: Delete a record by resource and id (Admin Only)
       */
      router.delete(
        "/:id",
        getMiddleware(routeParams.middleware),
        typeof routeParams.override === "function" ? routeParams.override : deleteRoute(model, routeParams.options)
      );

      break;

    default:
      throw Error(`Unknown method: ${routeParams.method}`);
  }
};

const mountHasManyRoute = (router: Router, path: string, routeParams: HasManyRouteParams) => {
  router.get(
    path,
    getMiddleware(routeParams.middleware),
    typeof routeParams.override === "function"
      ? routeParams.override
      : listManyRoute(routeParams.association, routeParams.options)
  );
};

const mountManyToManyRoute = (router: Router, path: string, routeParams: ManyToManyRouteParams) => {
  router.get(
    path,
    getMiddleware(routeParams.middleware),
    typeof routeParams.override === "function"
      ? routeParams.override
      : listManyToManyRoute(routeParams.association, routeParams.options)
  );

  router.post(
    `${path}/set`,
    getMiddleware(routeParams.middleware),
    typeof routeParams.override === "function"
      ? routeParams.override
      : setManyToManyRoute(routeParams.association, routeParams.options)
  );

  router.post(
    `${path}/add`,
    getMiddleware(routeParams.middleware),
    typeof routeParams.override === "function"
      ? routeParams.override
      : addManyToManyRoute(routeParams.association, routeParams.options)
  );

  router.post(
    `${path}/remove`,
    getMiddleware(routeParams.middleware),
    typeof routeParams.override === "function"
      ? routeParams.override
      : removeManyToManyRoute(routeParams.association, routeParams.options)
  );
};

export const buildRouter = (
  model: any,
  {
    crudRoutes,
    hasManyRoutes,
    manyToManyRoutes,
    routerParams,
  }: {
    crudRoutes?: CrudRouteParams[];
    hasManyRoutes?: HasManyRouteParams[];
    manyToManyRoutes?: ManyToManyRouteParams[];
    routerParams?: RouterParams;
  }
): Router => {
  const router: Router = express.Router(routerParams);

  if (Array.isArray(crudRoutes)) {
    crudRoutes.forEach((routeParams: CrudRouteParams) => mountCrudRoute(router, routeParams, model));
  }

  if (Array.isArray(hasManyRoutes)) {
    hasManyRoutes.forEach((routeParams: HasManyRouteParams) =>
      mountHasManyRoute(router, join("/:id", routeParams.pathExtension), routeParams)
    );
  }

  if (Array.isArray(manyToManyRoutes)) {
    manyToManyRoutes.forEach((routeParams: ManyToManyRouteParams) =>
      mountManyToManyRoute(router, join("/:id", routeParams.pathExtension), routeParams)
    );
  }

  return router;
};
