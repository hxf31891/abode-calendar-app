import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Auth: {
    region: "us-east-2",
    userPoolId: "us-east-2_pK8NDSuI2",
    userPoolWebClientId: "4460j0mldo93aoqfa3gd4lsijf",
    signUpVerificationMethod: "code",
    authenticationFlowType: "USER_SRP_AUTH",
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
