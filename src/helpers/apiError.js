class BadRequest extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
    this.name = BadRequest
  }
}
class InternalServerError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 500;
    this.name = InternalServerError
  }
}

class NotAcceptable extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 406;
    this.name = NotAcceptable
  }
}

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
    this.name = NotFound
  }
}






module.exports = {
  BadRequest,
  InternalServerError,
  NotAcceptable,
  NotFound
};