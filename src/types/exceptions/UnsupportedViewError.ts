export class UnsupportedViewError extends Error {
  constructor(msg: string) {
      super(msg);
      Object.setPrototypeOf(this, UnsupportedViewError.prototype);
  }
}