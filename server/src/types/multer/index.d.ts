export {};

declare global {
  namespace Express.Multer {
    export interface File {
      id: string;
      contentType: string;
      filename: string;
      filePath: string;
      thumbnailFilePath?: string;
      size: number;
    }
  }
}
