export class NeedAppTokenError extends Error {}
export class UnexpectedResponseError extends Error {}
export class NoAPIKeys extends Error {}

export class HTTPResponseStatusError extends Error {
  constructor(response, message) {
    super(message);
    this.response = response;
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}
