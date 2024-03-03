const config = {
  database: "postgres",
  username: "postgres",
  password: "secret",
  host: "127.0.0.1",
  port: 5432,
  dialect: "postgres",
  dialectOptions: {
    decimalNumbers: true,
  },
  migrationStorage: "sequelize",
  migrationStorageTableName: "migration_meta",
  seederStorage: "sequelize",
  seederStorageTableName: "seeder_meta",
};

// NODE_ENV = local | development | test | production share the same config
// as it is loaded from their respective .env files loaded at runtime
module.exports = {
  local: config,
  development: config,
  test: config,
  production: config,
};
