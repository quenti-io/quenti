export class HttpError<Code extends number = number> extends Error {
  public readonly message: string;
  public readonly cause?: Error;
  public readonly statusCode: Code;
  public readonly url?: string;
  public readonly method?: string;

  constructor(opts: {
    message?: string;
    url?: string;
    method?: string;
    statusCode: Code;
    cause?: Error;
  }) {
    super(opts.message || `HTTP Error ${opts.statusCode} `);

    Object.setPrototypeOf(this, HttpError.prototype);
    this.name = HttpError.prototype.constructor.name;

    this.cause = opts.cause;
    this.statusCode = opts.statusCode;
    this.url = opts.url;
    this.message = opts.message || `HTTP Error ${opts.statusCode}`;

    if (opts.cause instanceof Error && opts.cause.stack) {
      this.stack = opts.cause.stack;
    }
  }

  public static fromRequest(request: Request, response: Response) {
    return new HttpError({
      message: response.statusText,
      url: response.url,
      method: request.method,
      statusCode: response.status,
    });
  }
}
