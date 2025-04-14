const AppError = require('./AppError');

const ErrorFactory = {
  // Users

  userAlreadyExists: (email) =>
    new AppError(`The user "${email}" is already registered`, 400, 'USER_ALREADY_EXISTS'),

  userNotFound: (email) =>
    new AppError(`User "${email}" not found`, 400, 'USER_NOT_FOUND'),

  incorrectPassword: () =>
    new AppError('Incorrect password', 400, 'INCORRECT_PASSWORD'),

  // Goals

  duplicateGoalInRange: (title, from, to) =>
    new AppError(`Goal "${title}" already exists from ${from} to ${to}`, 409, 'DUPLICATE_GOAL'),

  invalidDates: () =>
    new AppError('Invalid dates', 400, 'INVALID_DATE'),

  // Auth

  invalidToken: () =>
    new AppError('Invalid or expired token', 401, 'INVALID_TOKEN'),

  unauthorized: () =>
    new AppError('Unauthorized access', 403, 'UNAUTHORIZED'),

  notFound: (name = 'Resource') =>
    new AppError(`${name} not found`, 404, 'NOT_FOUND'),

};

module.exports = ErrorFactory;
