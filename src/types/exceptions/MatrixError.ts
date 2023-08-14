export class MatrixError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, MatrixError.prototype);
  }
}