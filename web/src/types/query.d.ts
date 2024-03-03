export type Query = {
  limit?: number;
  offset?: number;
  order?: string | string[];
  filter?: { [key: string]: any };
  token?: string;
};
