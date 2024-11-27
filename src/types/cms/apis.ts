export class APIServerError {
  error: string;
  status: number;
  constructor(error: string, status: number = 500) {
    this.error = error;
    this.status = status;
  }
}

export const apiConstants = {
  successMessage: "Successfully received the response",
};

export class APIResponse<T> {
  message: string;
  status: number;
  success: boolean;
  body?: T;
  constructor(success: boolean, status: number = 200, message: string = apiConstants.successMessage, body?: T) {
    this.message = message;
    this.success = success;
    this.status = status;
    if (body) {
      this.body = body;
    }
  }
}
