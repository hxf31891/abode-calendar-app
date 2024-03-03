export {};

declare global {
  namespace Sequelize {
    export interface Model {
      list: any;
      listAndCount: any;
      details: any;
      insert: any;
      edit: any;
      delete: any;
    }
  }
}
