// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";
import { CognitoIdentityProviderClient, GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

// Internal Imports
import db from "../../../models";
const User = db.users;

const cognitoClient = new CognitoIdentityProviderClient({
  region: "us-east-2",
});

// Create a user (if user already exists, update with new email and phone number)
export const login: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.userId) {
    return res.status(400).send({ message: "Missing or invalid user" });
  }

  return User.details(req.userId, { attributes: ["id", "email", "firstName", "lastName"] })
    .then(async (user: any) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        const command = new GetUserCommand({ AccessToken: req.accessToken });
        const response = await cognitoClient.send(command);
        const email = response.UserAttributes?.find((attr) => attr.Name === "email")?.Value;
        const firstName = response.UserAttributes?.find((attr) => attr.Name === "given_name")?.Value;
        const lastName = response.UserAttributes?.find((attr) => attr.Name === "family_name")?.Value;

        const userData = {
          id: req.userId,
          firstName: firstName || null,
          lastName: lastName || null,
          acceptedTncAt: new Date(),
          acceptedTncVersion: process.env.CURRENT_TNC_VERSION,
        };

        return User.findAll({ where: { email: email }, include: ["events"] }).then((users: any) => {
          if (users?.length > 0) {
            const user = users[0];
            const oldUserId = user?.id;

            return User.update(userData, { where: { id: oldUserId } })
              .then(async () => {
                const existingEvents = user.events || [];
                await existingEvents.forEach((ev: any) => {
                  ev.removeUsers([oldUserId]);
                  ev.addUsers([userData?.id]);
                });
                return res.status(201).send({ ...userData, email });
              })
              .catch(next);
          } else {
            return User.insert({
              ...userData,
              email: email || null,
            })
              .then((user: any) => {
                return res.status(201).send(user);
              })
              .catch(next);
          }
        });
      }
    })
    .catch(next);
};
