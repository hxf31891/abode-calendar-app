// External Imports
// import dotenv from "dotenv";
// import fs from "fs";

// const validNodeEnvs = ["local", "development", "staging", "production", "test"];

// const getConfigs = () => {
//   const _config = {
//     NODE_ENV: "test",
//     CURRENT_PRIVACY_POLICY_VERSION: 1,
//     CURRENT_TNC_VERSION: 1,
//     SERVER_PORT: 8080,
//     DB_USER: "postgres",
//     DB_DATABASE: "postgres",
//     DB_PASSWORD: "secret",
//     DB_PORT: 5432,
//     DB_DIALECT: "postgres",
//     DB_POOL_MAX: 5,
//     DB_POOL_MIN: 0,
//     DB_POOL_ACQUIRE: 30000,
//     DB_POOL_IDLE: 10000,
//     COGNITO_USER_POOL_ID: "us-east-2_pK8NDSuI2",
//     COGNITO_CLIENT_ID: "4460j0mldo93aoqfa3gd4lsijf",
//     COGNITO_REGION: "us-east-2",
//   };

//   return _config;
// };

export const configureEnv = async () => {
  // if (!validNodeEnvs.includes(process.env.NODE_ENV || "")) {
  //   throw new Error(
  //     `Invalid node env. Expected production, staging, development, test, or local but recieved ${process.env.NODE_ENV}`
  //   );
  // }

  // const configObj = getConfigs();
  // let secretObj = {};
  // if (process.env.NODE_ENV === "test") {
  //   const secretStr = fs.readFileSync(".env.test", { encoding: "utf8", flag: "r" });
  //   secretObj = dotenv.parse(secretStr);
  // } else {
  //   const secretStr = fs.readFileSync(".env.local", { encoding: "utf8", flag: "r" });
  //   secretObj = dotenv.parse(secretStr);
  // }

  // const envObj = { ...configObj, ...secretObj };
  // Object.assign(process.env, envObj);

  return {
    NODE_ENV: "test",
    CURRENT_PRIVACY_POLICY_VERSION: 1,
    CURRENT_TNC_VERSION: 1,
    SERVER_PORT: 8080,
    DB_USER: "postgres",
    DB_DATABASE: "postgres",
    DB_PASSWORD: "secret",
    DB_PORT: 5432,
    DB_DIALECT: "postgres",
    DB_POOL_MAX: 5,
    DB_POOL_MIN: 0,
    DB_POOL_ACQUIRE: 30000,
    DB_POOL_IDLE: 10000,
    COGNITO_USER_POOL_ID: "us-east-2_pK8NDSuI2",
    COGNITO_CLIENT_ID: "4460j0mldo93aoqfa3gd4lsijf",
    COGNITO_REGION: "us-east-2",
    REDIS_HOST: "localhost",
    REDIS_PORT: 6379,
    REDIS_DB: 0,
  };
};
