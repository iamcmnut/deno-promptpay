export class NegativeAmountError extends Error {
  constructor(m: string = "Amount cannot be a negative value") {
    super(m);
    Object.setPrototypeOf(this, NegativeAmountError.prototype);
  }
}
