// External Imports
import { FindOptions } from "sequelize";

export type WhereOptions = {
  [key: string]: any;
};

export type IncludeOptions =
  | {
      [key: string]: any;
    }
  | {
      [key: string]: any;
    }[];

export type OrderOptions = "ASC" | "DESC";

export type LimitOptions = number;

export type OffsetOptions = number;

export type ListOptions = FindOptions;

export type DetailsOptions = {
  include?: IncludeOptions;
};

export type CreateOptions = object;

export type EditOptions = {
  where: WhereOptions;
};

export type DeleteOptions = {
  where: WhereOptions;
};
