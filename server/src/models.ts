// External Imports
import Sequelize from "sequelize";
import path from "path";
import fs from "fs";

// @ts-expect-error TS(2351): This expression is not constructable.
const sequelize = new Sequelize("postgres", "postgres", "secret", {
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

const db: { [key: string]: any } = {};
db.sequelize = sequelize;
db.Sequelize = Sequelize;

const mountModels = (dir: string) => {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      mountModels(fullPath);
    } else if (file.includes("model.")) {
      const model = require(fullPath).default;
      db[model.modelName] = model;
    }
  });
};

const modulePath = path.join(__dirname, "modules");
mountModels(modulePath);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].initialize) {
    db[modelName].initialize(sequelize);
  }
});

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// sequelize.sync({ force: true }).then(() => console.log("Tables force synced"));
// sequelize.sync({ alter: true, force: false }).then(() => console.log("Tables altered"));

export default db;
