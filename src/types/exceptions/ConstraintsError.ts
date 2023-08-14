export class ConstraintsError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ConstraintsError.prototype);
  }
}