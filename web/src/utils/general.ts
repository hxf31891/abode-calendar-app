import { User } from "types/user";

export const getUserInitials = (user: User) => {
  if (user?.firstName && user?.lastName) {
    return `${user?.firstName[0]}${user?.lastName[0]}`;
  } else if (user?.email) {
    return `${user?.email[0]}`;
  } else {
    return "";
  }
};
