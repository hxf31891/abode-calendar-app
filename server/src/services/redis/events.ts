import PubSub from "./pubsub";
import db from "../../models";
import { sendEmail } from "../emails";
import { User as UserProps } from "../../types/user";

const Event = db.events;

// This function listens for redis pubsub events, which fire when entries its expire.
// The entries are created to expire 30 minutes before an calendar event, thus alerting us to the need to send reminders to invited users.
export default function listForEvents() {
  PubSub.subscribe("__keyevent@0__:expired");
  PubSub.on("message", async (channel: any, message: any) => {
    const [type, key] = message.split(":");
    switch (type) {
      // if the type is reminder (thats the only one we are creating right now)
      case "reminder": {
        // find the event using the redis events key, which is set to the events id
        Event.findByPk(key, { include: ["users"] })
          .then((eventObj: any) => {
            const eventData = eventObj?.dataValues;
            // if the event is not cancelled
            if (eventData.canceledAt !== null) {
              const { users, title, link } = eventData;
              sendEmail(
                users?.map((iu: UserProps) => iu?.email),
                "Upcoming Event Reminder",
                `${title} starts in 30 minutes. ${link ? `Click here to join: ${link}` : ""}`
              );
            }
          })
          .catch(() => {});
        break;
      }
    }
  });
}
