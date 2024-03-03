// External Imports
import express, { Router } from "express";

// Internal Imports
import { routeWrapper } from "../../../utils/routeWrapper";
import { permissions } from "../../../permissions";
import * as controller from "./controller";

const getRouter = () => {
  const router: Router = express.Router();

  /**
   * @openapi
   * /api/v0/auth/login:
   *   post:
   *     description: Fetch or create and fetch the professional following register or login
   */
  router.post(
    "/login",
    [
      permissions({
        user: true,
        admin: false,
        anonymous: true,
      }),
    ],
    routeWrapper(controller.login)
  );

  return router;
};

export default {
  path: "/auth",
  router: getRouter(),
};
