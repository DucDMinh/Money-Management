/** Lỗi có mã HTTP — được errorHandler trả về cho client dưới dạng { error, details } */
export class HttpError extends Error {
  constructor(status, message, details) {
    super(message);
    this.status = status;
    this.details = details;
  }
}
