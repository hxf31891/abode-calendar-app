// External Imports
import { format, subMinutes } from "date-fns";
import nodemailer from "nodemailer";

// types
import RedisRepo from "./redis/repo";
import { User } from "../types/user";
import { Event } from "../types/event";

// initialize node mailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "harrysnodetest@gmail.com",
    pass: "bwsztndujyvowxlx",
  },
});

/**
 *
 * @param {string[]} emailTo array of emails to send to
 * @param {string} subject subject of the email
 * @param {string} html content of the email
 */
export const sendEmail = async (emailTo: string[], subject: string, html?: string) => {
  await transporter.sendMail({
    from: '"EasyCal 📅" <harrysnodetest@gmail.com>',
    to: emailTo,
    subject: subject,
    html: html,
  });
};

/**
 * send initial emails to creator, invitees and schedule reminder noticication for thirty minues before event
 * @param {User} creator user object for event creator
 * @param {User[]} users user objects for invited users
 * @param {Event} event event object
 */
export const handleEventsComms = (creator: User, users: User[], event: Event) => {
  const inviteeAddresses = users?.map((u) => u?.email);
  const { title, startTime } = event;
  const date = format(new Date(startTime), "MM/dd/yyyy");
  const time = format(new Date(startTime), "HH:mm");

  // send email alerting invited users to event
  sendEmail(
    inviteeAddresses,
    "You have been invited to a new event through EasyCal!",
    `<div>${creator?.firstName} invited you to ${title} at ${time} UTC on ${date}<div><div>If this is your first time using EasyCal click here to create a free account: http://localhost:3000/register</div>`
  );

  // send confirmation to creator
  sendEmail([creator?.email], "New Event Confirmation", `Your event ${title} as been created`);

  // set a new entry in redis pubsub, this will notify our listener (see ./redis/events) and if the event is still valid we will send reminder emails
  const redisRepo = new RedisRepo();
  redisRepo.setReminder(event.id, subMinutes(new Date(startTime), 30));
};
