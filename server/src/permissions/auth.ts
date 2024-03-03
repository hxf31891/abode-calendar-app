// External Imports
import { Request } from "express";

export const isAuthenticated = (req: Request) => {
  return !!req.userId;
};

export const isAdmin = (req: Request) => {
  return req.userType === "admin";
};
