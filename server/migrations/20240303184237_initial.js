const Sequelize = require("sequelize");

/**
 * Actions summary:
 *
 * createTable() => "events", deps: []
 * createTable() => "users", deps: []
 * createTable() => "event_invitations", deps: []
 *
 */

const info = {
  revision: 1,
  name: "noname",
  created: "2024-03-03T18:42:37.081Z",
  comment: "",
};

const migrationCommands = (transaction) => [
  {
    fn: "createTable",
    params: [
      "events",
      {
        id: {
          type: Sequelize.UUID,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        title: { type: Sequelize.STRING, field: "title", allowNull: false },
        color: { type: Sequelize.STRING, field: "color", allowNull: false },
        startTime: {
          type: Sequelize.DATE,
          field: "start_time",
          allowNull: false,
        },
        endTime: { type: Sequelize.DATE, field: "end_time", allowNull: false },
        description: {
          type: Sequelize.TEXT,
          field: "description",
          allowNull: true,
        },
        ownerId: { type: Sequelize.UUID, field: "owner_id", allowNull: false },
        link: { type: Sequelize.TEXT, field: "link", allowNull: true },
        createdAt: { type: Sequelize.DATE, field: "created_at" },
        updatedAt: { type: Sequelize.DATE, field: "updated_at" },
        deletedAt: {
          type: Sequelize.DATE,
          field: "deleted_at",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "users",
      {
        id: {
          type: Sequelize.STRING,
          field: "id",
          primaryKey: true,
          defaultValue: Sequelize.UUIDV4,
        },
        email: { type: Sequelize.STRING, field: "email", allowNull: false },
        firstName: {
          type: Sequelize.STRING,
          field: "first_name",
          allowNull: true,
        },
        lastName: {
          type: Sequelize.STRING,
          field: "last_name",
          allowNull: true,
        },
        createdAt: { type: Sequelize.DATE, field: "created_at" },
        updatedAt: { type: Sequelize.DATE, field: "updated_at" },
        deletedAt: {
          type: Sequelize.DATE,
          field: "deleted_at",
          allowNull: true,
        },
      },
      { transaction },
    ],
  },
  {
    fn: "createTable",
    params: [
      "event_invitations",
      {
        createdAt: {
          type: Sequelize.DATE,
          field: "created_at",
          allowNull: false,
        },
        updatedAt: {
          type: Sequelize.DATE,
          field: "updated_at",
          allowNull: false,
        },
        eventId: { type: Sequelize.UUID, field: "event_id", primaryKey: true },
        userId: { type: Sequelize.STRING, field: "user_id", primaryKey: true },
      },
      { transaction },
    ],
  },
];

const rollbackCommands = (transaction) => [
  {
    fn: "dropTable",
    params: ["events", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["users", { transaction }],
  },
  {
    fn: "dropTable",
    params: ["event_invitations", { transaction }],
  },
];

const pos = 0;
const useTransaction = true;

const execute = (queryInterface, sequelize, _commands) => {
  let index = pos;
  const run = (transaction) => {
    const commands = _commands(transaction);
    return new Promise((resolve, reject) => {
      const next = () => {
        if (index < commands.length) {
          const command = commands[index];
          console.log(`[#${index}] execute: ${command.fn}`);
          index++;
          queryInterface[command.fn](...command.params).then(next, reject);
        } else resolve();
      };
      next();
    });
  };
  if (useTransaction) return queryInterface.sequelize.transaction(run);
  return run(null);
};

module.exports = {
  pos,
  useTransaction,
  up: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, migrationCommands),
  down: (queryInterface, sequelize) =>
    execute(queryInterface, sequelize, rollbackCommands),
  info,
};
