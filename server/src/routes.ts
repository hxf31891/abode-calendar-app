// External Imports
import { Router } from "express";
import path from "path";
import fs from "fs";

const apiRoutes = Router();

const mountRoutes = (dir: string) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      mountRoutes(fullPath);
    } else if (file.includes("routes.")) {
      const route = require(fullPath).default;
      apiRoutes.use(route.path, route.router);
    }
  });
};

const modulePath = path.join(__dirname, "modules");
mountRoutes(modulePath);

export default apiRoutes;
