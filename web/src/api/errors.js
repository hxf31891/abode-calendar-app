class ResponseError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.name = "ResponseError";
    Object.setPrototypeOf(this, ResponseError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }
}

// 400 status
export class UserError extends ResponseError {
  constructor(status, message) {
    super(status, message);
    this.name = "UserError";
    Object.setPrototypeOf(this, UserError.prototype);
  }
}

// 401 status
export class UnauthorizedError extends ResponseError {
  constructor(status, message) {
    super(status, message);
    this.name = "UnauthorizedError";
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
}

// 403 status
export class ForbiddenError extends ResponseError {
  constructor(status, message) {
    super(status, message);
    this.name = "ForbiddenError";
    Object.setPrototypeOf(this, ForbiddenError.prototype);
  }
}

// 404 status
export class NotFoundError extends ResponseError {
  constructor(status, message) {
    super(status, message);
    this.name = "NotFoundError";
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

// 500 status
export class ServerError extends ResponseError {
  constructor(status, message) {
    super(status, message);
    this.name = "ServerError";
    Object.setPrototypeOf(this, ServerError.prototype);
  }
}

export class NotImplementedError extends Error {
  constructor(message) {
    super(message);
    this.name = "NotImplementedError";
    Object.setPrototypeOf(this, UserError.prototype);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError);
    }
  }
}
