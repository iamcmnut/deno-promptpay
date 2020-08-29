export class TargetMismatchError extends Error {
  constructor(m: string = "Accept only phone or citizen number") {
    super(m);
  }
}
