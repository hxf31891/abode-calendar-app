// External Imports
import {
  Model,
  DataTypes,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
  Sequelize,
  BelongsToMany,
  NonAttribute,
} from "sequelize";

// Internal Imports
import { ListOptions, DetailsOptions, EditOptions, DeleteOptions } from "../../types/query";
// types
import { EventInsertValues, EventEditValues } from "../../types/event";

export default class Event extends Model<InferAttributes<Event>, InferCreationAttributes<Event>> {
  declare id: CreationOptional<string>;
  declare title: string | null;
  declare color: string | null;
  declare startTime: Date | null;
  declare endTime: Date | null;
  declare description: string | null;
  declare ownerId: string | null;
  declare link: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  static modelName = "events";
  static resourceName = "EVENT";
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          validate: {
            isUUID: 4,
          },
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        color: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        startTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        endTime: {
          type: DataTypes.DATE,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        ownerId: {
          type: DataTypes.UUID,
          allowNull: false,
        },
        link: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        createdAt: DataTypes.DATE,
        updatedAt: DataTypes.DATE,
        deletedAt: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "events",
        timestamps: true,
        paranoid: false,
        underscored: true,
      }
    );
  }

  static UsersAssociation: BelongsToMany;
  declare users?: NonAttribute<any[]>;
  declare getUsers: () => any[];
  declare setUsers: (users: any[]) => void;
  declare addUsers: (users: any[]) => void;
  declare removeUsers: (users: any[]) => void;

  static associate(models: any) {
    this.UsersAssociation = this.belongsToMany(models.users, {
      as: "users",
      constraints: false,
      foreignKey: "eventId",
      through: "event_invitations",
    });
  }

  // Query methods

  static list(options?: ListOptions) {
    return this.findAll(options);
  }

  static listAndCount(options?: ListOptions) {
    return this.findAndCountAll(options);
  }

  static async details(id: string, options?: DetailsOptions) {
    return this.findByPk(id, options);
  }

  static insert(values: EventInsertValues) {
    return this.create(values);
  }

  static edit(values: EventEditValues, options: EditOptions) {
    return this.update(values, options);
  }

  static async delete(options: DeleteOptions) {
    return this.destroy(options);
  }
}
