// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";
// @ts-expect-error TS(7016): Could not find a declaration file for module 'cogn... Remove this comment to see the full error message
import CognitoExpress from "cognito-express";

// Internal Imports
import { userMocks } from "../../models/mocks/user.mock";
// import { configureEnv } from "../utils/env";
import db from "../models";
const User = db.users;

// configure env variables
// configureEnv();
// Initializing CognitoExpress
const userCognitoExpress = new CognitoExpress({
  region: "us-east-2",
  cognitoUserPoolId: "us-east-2_pK8NDSuI2",
  tokenUse: "access",
  tokenExpiration: 3600000, // default expiration of 1 hour (3600000 ms)
});

// bypass cognito and use mocks for testing
const handleTestAuth = async (req: Request, token: string) => {
  const user = userMocks.find((um) => um?.id === token) || null;
  req.userId = token;
  req.user = user;
  if (user?.isAdmin) {
    req.userType = "admin";
  }
  return;
};

// verify accessToken using cognito and save user data to req to be used later in various controllers
const handleUserAuth = async (req: Request, accessToken: string) => {
  const response = await userCognitoExpress.validate(accessToken);
  req.accessToken = accessToken;
  req.auth = response;

  req.userId = response.sub;
  return User.findByPk(response.sub).then((user: any) => {
    if (user) {
      req.user = user;
    }
  });
};

export const verifyAuthToken = (): RequestHandler => async (req: Request, res: Response, next: NextFunction) => {
  const bearerToken = req.headers["authorization"];

  if (!bearerToken) {
    req.userType = "anonymous";
    req.userId = null;
    req.user = null;
    return next();
  }

  if (!bearerToken.includes("Bearer")) {
    req.userType = "anonymous";
    req.userId = null;
    req.user = null;
    return next();
  }

  const token = bearerToken.split(" ")[1];

  try {
    if (process.env.NODE_ENV === "test") {
      await handleTestAuth(req, token);
      next();
    } else {
      await handleUserAuth(req, token);
      return next();
    }
  } catch (err: any) {
    req.userType = "anonymous";
    req.userId = null;
    req.user = null;
    console.error(`Failed to verify auth token: ${err}`);
    return next();
  }
};
