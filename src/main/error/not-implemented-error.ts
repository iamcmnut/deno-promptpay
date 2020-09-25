export class NotImplementedError extends Error {
  constructor(m: string = "Not implemented yet") {
    super(m);
  }
}
