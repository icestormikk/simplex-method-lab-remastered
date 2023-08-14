export class ArtificialSimplexError extends Error {
  constructor(msg: string) {
    super(msg);
    Object.setPrototypeOf(this, ArtificialSimplexError.prototype);
  }
}