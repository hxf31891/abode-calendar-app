// External Imports
import express from "express";
import helmet from "helmet";
import cors from "cors";
import hpp from "hpp";

// Internal Imports
import { verifyAuthToken, queryParser, errorHandler } from "./middleware";
import listForEvents from "./services/redis/events";
import { healthRouter } from "./health/routes";
import apiRoutes from "./routes";

// initialize server app
const app = express();
app.disable("x-powered-by");
// mount health api routes before all middlewear
app.use("", healthRouter());
// security headers
app.use(helmet());
// allow ip to pass through ELB load balancers
if (process.env.NODE_ENV !== "local") {
  app.set("trust proxy", 2);
}
// configures cors to work with auth cookies from the client
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
    allowedHeaders: ["authorization", "content-type", "baggage", "sentry-trace", "x-total-count", "range"],
  })
);
// configures payload encoding and size limits
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "512mb", extended: true }));
// parses access token
app.use(verifyAuthToken());
// protect against polluted query (i.e. ?name=joe&name=james)
app.use(hpp());
// parse limit, offest, order, and filters from query params
app.use(queryParser());
// mount core api routes
app.use(`/api/v0`, apiRoutes);
// catch, log, and handle error responses
app.use(errorHandler());
// register redis listener for notification events
listForEvents();

export default app;
