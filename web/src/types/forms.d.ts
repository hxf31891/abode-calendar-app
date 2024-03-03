export type AddUpdateForm = {
  link: string;
  date: string;
  title: string;
  endTime: string;
  startTime: string;
  description: string;
};

export type RegisterForm = {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
};

export type LoginForm = {
  email: string;
  password: string;
};

export type VerifyForm = {
  code: string;
};
