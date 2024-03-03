// External Imports
import { Router } from "express";

// Internal Imports
import { buildRouter } from "../../utils/routes/buildRouter";
import { permissions, isAuthUser } from "../../permissions";
import { injectUserId, removeUserType } from "./middleware";
import db from "../../models";
const User = db.users;

const routerConfig = {
  crudRoutes: [
    {
      method: "LIST",
      middleware: [
        permissions({
          user: false,
          admin: true,
          anonymous: false,
        }),
      ],
    },
    {
      method: "RETRIEVE",
      middleware: [
        injectUserId(),
        permissions({
          user: isAuthUser(),
          admin: true,
          anonymous: false,
        }),
      ],
      options: {
        include: [{ association: "events" }],
      },
    },
    {
      method: "UPDATE",
      middleware: [
        removeUserType(),
        permissions({
          user: isAuthUser(),
          admin: true,
          anonymous: false,
        }),
      ],
    },
    {
      method: "DELETE",
      middleware: [
        permissions({
          user: isAuthUser(),
          admin: true,
          anonymous: false,
        }),
      ],
    },
  ],
  hasManyRoutes: [],
  manyToManyRoutes: [
    {
      pathExtension: "/events",
      association: User.EventsAssociation,
      middleware: [
        permissions({
          user: isAuthUser(),
          admin: true,
          anonymous: false,
        }),
      ],
    },
  ],
};

const getRouter = () => {
  const router: Router = buildRouter(User, routerConfig);

  return router;
};

export default {
  path: "/users",
  router: getRouter(),
};
