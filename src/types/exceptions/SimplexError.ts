export class SimplexError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, SimplexError.prototype);
  }
}