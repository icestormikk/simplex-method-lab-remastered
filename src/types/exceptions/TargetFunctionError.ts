export class TargetFunctionError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, TargetFunctionError.prototype);
  }
}