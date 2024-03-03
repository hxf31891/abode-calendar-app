// External Imports
import { Router, Request, Response } from "express";
import statusMonitor from "express-status-monitor";

export const healthRouter = (): Router => {
  const router = Router();

  router.get("/", (req: Request, res: Response) => {
    const date = new Date();
    const hours = date?.getHours();
    const minutes = date?.getMinutes();
    return res.status(200).send({ time: `${hours}:${minutes}` });
  });

  // health check route
  router.get("/health", (req: Request, res: Response) => {
    const healthcheck = {
      uptime: process.uptime(),
      responsetime: process.hrtime(),
      message: "OK",
      timestamp: Date.now(),
    };

    try {
      return res.status(200).send(healthcheck);
    } catch (err: any) {
      healthcheck.message = err;
      return res.status(503).send();
    }
  });

  // status check route
  router.use(
    statusMonitor({
      title: "Outsyde Server Status", // Default title
      theme: "default.css", // Default styles
      path: "/status",
      spans: [
        {
          interval: 1, // Every second
          retention: 60, // Keep 60 datapoints in memory
        },
        {
          interval: 5, // Every 5 seconds
          retention: 60,
        },
        {
          interval: 15, // Every 15 seconds
          retention: 60,
        },
      ],
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        heap: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
      healthChecks: [
        {
          protocol: process.env.NODE_ENV === "local" ? "http" : "https",
          host: process.env.CLIENT_DOMAIN || "localhost",
          path: "/health",
          port: process.env.SERVER_PORT || "8080",
        },
      ],
      ignoreStartsWith: "/admin",
    })
  );

  return router;
};
