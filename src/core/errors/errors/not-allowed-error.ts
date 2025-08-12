import { ServiceError } from "../error.service";

export class NotAllowedError extends Error implements ServiceError {
  constructor() {
    super("Not allowed");
  }
}
