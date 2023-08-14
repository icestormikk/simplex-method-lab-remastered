export class FileError extends Error {
  constructor(msg: string) {
      super(msg);
      Object.setPrototypeOf(this, FileError.prototype);
  }
}