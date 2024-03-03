// External Imports
import { Router } from "express";

// Internal Imports
import { buildRouter } from "../../utils/routes/buildRouter";
import { permissions, isOwner } from "../../permissions";
import * as controller from "./controller";
import { getOwnerId } from "./utils";
import db from "../../models";
const Event = db.events;

const routerConfig = {
  crudRoutes: [
    {
      method: "LIST",
      middleware: [
        permissions({
          user: isOwner(getOwnerId),
          admin: true,
          anonymous: false,
        }),
      ],
      options: {
        include: [{ association: "users" }],
      },
    },
    {
      method: "RETRIEVE",
      middleware: [
        permissions({
          user: isOwner(getOwnerId),
          admin: true,
          anonymous: true,
        }),
      ],
      options: {
        include: [{ association: "users" }],
      },
    },
    {
      method: "CREATE",
      middleware: [
        permissions({
          user: true,
          admin: true,
          anonymous: false,
        }),
      ],
      override: controller.createEvent,
    },
    {
      method: "UPDATE",
      middleware: [
        permissions({
          user: isOwner(getOwnerId),
          admin: true,
          anonymous: false,
        }),
      ],
    },
    {
      method: "DELETE",
      middleware: [
        permissions({
          user: isOwner(getOwnerId),
          admin: true,
          anonymous: false,
        }),
      ],
    },
  ],
  hasManyRoutes: [],
  manyToManyRoutes: [],
};

const getRouter = () => {
  const router: Router = buildRouter(Event, routerConfig);
  return router;
};

export default {
  path: "/events",
  router: getRouter(),
};
