type AppErrorOptions = {
  statusCode: 400 | 401 | 403 | 404 | 409 | 422 | 500;
  code: string;
};

export class AppError extends Error {
  readonly statusCode: AppErrorOptions["statusCode"];
  readonly code: string;

  constructor(message: string, options: AppErrorOptions) {
    super(message);

    this.name = "AppError";
    this.statusCode = options.statusCode;
    this.code = options.code;

    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, AppError);
  }
}
