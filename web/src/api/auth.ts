// External Imports
import { AxiosResponse } from "axios";
import { Auth } from "aws-amplify";
import CryptoJS from "crypto-js";

// Internal Imports
// import { NotFoundError } from "../../errors";
import { cleanEmail } from "./utils";
import { client } from "./client";

const cognitoClientId = "4460j0mldo93aoqfa3gd4lsijf";

export const getCurrentAuth = async () => {
  return Auth.currentAuthenticatedUser()
    .then((user) => user)
    .catch(() => null);
};

export const refreshCurrentAuth = async () => {
  return Auth.currentAuthenticatedUser({ bypassCache: false })
    .then((user) => user)
    .catch(() => null);
};

export const signin = async (email: string, password: string) => {
  const _email = cleanEmail(email);
  await Auth.signIn(_email, password);

  // register login with backend
  const res: AxiosResponse = await client.post("/auth/login");
  return {
    data: res.data,
  };
};

export const signup = async (
  email: string,
  password: string,
  attrs: { phoneNumber?: string; firstName?: string; lastName?: string }
) => {
  const _email = cleanEmail(email);
  const attributes: {
    email: string;
    given_name?: string;
    family_name?: string;
  } = { email: _email };

  if (attrs) {
    if (attrs.firstName) attributes.given_name = attrs.firstName;
    if (attrs.lastName) attributes.family_name = attrs.lastName;
  }

  const { user } = await Auth.signUp({
    username: _email,
    password,
    attributes,
    autoSignIn: {
      enabled: true,
    },
  });

  // store credentials to save after user confirmation
  localStorage.setItem("pending-confirmation", "true");
  const credentials = CryptoJS.AES.encrypt(
    JSON.stringify({
      email: _email,
      password,
      phoneNumber: attrs.phoneNumber || "",
    }),
    cognitoClientId
  ).toString();
  localStorage.setItem("confirmation-credentials", credentials);
  return user;
};

export const verifyConfirmationCode = async (code: string) => {
  const encryptedCredential =
    localStorage.getItem("confirmation-credentials") || "";
  const credentialStr = CryptoJS.AES.decrypt(
    encryptedCredential,
    cognitoClientId
  ).toString(CryptoJS.enc.Utf8);

  const { email, password } = JSON.parse(credentialStr); // phoneNumber
  await Auth.confirmSignUp(email, code);
  await Auth.signIn(email, password);
  const res = await client.post("/auth/login");
  return {
    data: res.data,
  };
};

export const resendConfirmationCode = async () => {
  const encryptedCredential =
    localStorage.getItem("confirmation-credentials") || "";
  const credentialStr = CryptoJS.AES.decrypt(
    encryptedCredential,
    cognitoClientId
  ).toString(CryptoJS.enc.Utf8);

  const { email } = JSON.parse(credentialStr);
  return Auth.resendSignUp(email);
};

export const signout = async () => {
  await Auth.signOut();
  localStorage.removeItem("abodeCalUser");
};

// sendEmailVerificationCode() {
//   return Auth.verifyCurrentUserAttribute("email");
// },

// verifyEmail(code: string) {
//   return Auth.verifyCurrentUserAttributeSubmit("email", code);
// },
