export class UnsupportedTypeError extends Error {
  constructor(msg: string) {
      super(msg);
      Object.setPrototypeOf(this, UnsupportedTypeError.prototype);
  }
}