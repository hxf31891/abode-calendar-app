import { File } from "multer";

export {};

declare global {
  namespace Express {
    export interface Request {
      accessToken?: string;
      auth?: any;
      userType: string;
      userId: string | null;
      user?: any;
      adminId?: string;
      admin?: any;
      files?: File[];
      file?: File;
      token?: { [key: string]: any };
      rawBody?: any;
      sqlParams: {
        limit: number;
        offset: number;
        order: [string, string][];
        where: { [key: string]: any };
      };
    }
  }
}
