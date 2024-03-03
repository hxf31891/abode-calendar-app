// External Imports
import {
  Model,
  DataTypes,
  Sequelize,
  NonAttribute,
  BelongsToMany,
  InferAttributes,
  CreationOptional,
  InferCreationAttributes,
} from "sequelize";

// Internal Imports
import { ListOptions, DetailsOptions, EditOptions, DeleteOptions } from "../../types/query";
// types
import { UserInsertValues, UserEditValues } from "../../types/user";

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<string>;
  declare email: string | null;
  declare firstName?: string | null;
  declare lastName?: string | null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare deletedAt: Date | null;

  static modelName = "users";
  static resourceName = "USER";
  static initialize(sequelize: Sequelize) {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        firstName: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        lastName: {
          type: DataTypes.STRING,
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
        tableName: "users",
        timestamps: true,
        paranoid: true,
        underscored: true,
      }
    );
  }

  static EventsAssociation: BelongsToMany;
  declare events?: NonAttribute<any[]>;
  declare getEvents: () => any[];
  declare setEvents: (events: any[]) => void;
  declare addEvents: (events: any[]) => void;
  declare removeEvents: (events: any[]) => void;

  static associate(models: any) {
    this.EventsAssociation = this.belongsToMany(models.events, {
      through: "event_invitations",
      as: "events",
      foreignKey: "userId",
      constraints: false,
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

  static insert(values: UserInsertValues) {
    return this.create(values);
  }

  static edit(values: UserEditValues, options: EditOptions) {
    return this.update(values, options);
  }

  static async delete(options: DeleteOptions) {
    return this.findAll(options).then((records) => {
      if (Array.isArray(records) && records.length > 0) {
        return Promise.all([this.destroy(options)]).then((results: any[]) => results[0]);
      } else {
        return;
      }
    });
  }
}
