export class APIServerError {
  error: string;
  status: number;
  constructor(error: string, status: number = 500) {
    this.error = error;
    this.status = status;
  }
}

export class APIResponse<T> {
  message: string;
  status: number;
  success: boolean;
  body?: T;
  error?: string;
  constructor(success: boolean, status: number = 200, message: string = apiConstants.successMessage, body?: T, error?: string) {
    this.message = message;
    this.success = success;
    this.status = status;

    if (body) {
      this.body = body;
    }
    if (!success) {
      this.error = message;
    }
  }
}

export const apiConstants = {
  successMessage: "Successfully received the response",
  failedResponse: new APIResponse<void>(false, 400, "Failed to establish connection with the service"),
};
