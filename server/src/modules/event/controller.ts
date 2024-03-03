// External Imports
import { RequestHandler, Request, Response, NextFunction } from "express";

// Internal Imports
import { handleEventsComms } from "../../services/emails";
import db from "../../models";
const Event = db.events;
const User = db.users;

// Create an event accounts for any non existing invitees
export const createEvent: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
  const body = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(400).send({ message: "No user found" });
  }

  return Event.create({ ...body, ownerId: userId })
    .then((newEvent: any) => {
      const invitees = body.invitees || [];

      if (invitees?.length > 0) {
        User.findAll({ where: { email: invitees } })
          .then((existingUsers: any) => {
            const existingEmails = existingUsers?.map((ei: any) => ei?.dataValues?.email);
            const newUsers = invitees.filter((iu: any) => !existingEmails?.includes(iu));
            User.bulkCreate(newUsers?.map((nu: any) => ({ email: nu })))
              .then((createdUsers: any) => {
                newEvent
                  .setUsers([...existingUsers, ...createdUsers, req.user])
                  .then(() => {
                    Event.findByPk(newEvent.id, { include: ["users"] })
                      .then((completeEvent: any) => {
                        handleEventsComms(req.user, [...existingUsers, ...createdUsers], completeEvent);
                        res.status(201).send(completeEvent);
                      })
                      .catch(next);
                  })
                  .catch(next);
              })
              .catch(next);
          })
          .catch(next);
      } else {
        newEvent
          .setUsers([req.user])
          .then(() => {
            res.status(201).send({ ...newEvent, users: [req.user] });
          })
          .catch(next);
      }
    })
    .catch(next);
};
