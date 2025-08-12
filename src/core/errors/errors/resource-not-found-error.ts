import { ServiceError } from "../error.service";

export class ResourceNotFoundError extends Error implements ServiceError {
  constructor() {
    super("Resource not found");
  }
}
