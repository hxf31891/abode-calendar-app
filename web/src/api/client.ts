// External Imports
import { Auth } from "aws-amplify";
import axios from "axios";

// Error Classes
import {
  UserError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ServerError,
} from "./errors";

export const client = axios.create({
  withCredentials: true,
  baseURL: `http://localhost:8080/api/v0/`,
});

client.interceptors.request.use(
  (config: any) =>
    Auth.currentSession()
      .then((session: any) => {
        config.headers["Authorization"] =
          `Bearer ${session.accessToken.jwtToken}`;
        return config;
      })
      .catch(() => {
        return config;
      }),
  (error: any) => Promise.reject(error)
);

client.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;

    if (status === 401) {
      throw new UnauthorizedError(status, message || "Please login in");
    } else if (status === 403) {
      throw new ForbiddenError(
        status,
        message || "You do not have permission to do this"
      );
    } else if (status === 404) {
      throw new NotFoundError(
        status,
        message || "Oh oh.. We can't find what you are looking for"
      );
    } else if (status < 500) {
      throw new UserError(
        status,
        message || "Something doesn't look right.. Please try again"
      );
    } else {
      throw new ServerError(status, message || "Oh oh.. Something went wrong");
    }
  }
);

export default client;
