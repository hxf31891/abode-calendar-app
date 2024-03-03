// External Imports
import { Sequelize } from "sequelize";

export const createSequalize = () =>
  new Sequelize("postgres", "postgres", "secret", {
    host: "127.0.0.1",
    port: 5432,
    dialect: "postgres",
    dialectOptions: { decimalNumbers: true },
    logging: false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  });
