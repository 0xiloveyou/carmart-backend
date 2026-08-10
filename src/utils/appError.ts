export class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const throwError = (statusCode: number, message: string): never => {
  throw new AppError(statusCode, message);
};
