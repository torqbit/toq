export class APIServerError {
    error: string;
    status: number;
    constructor(error: string, status: number = 500) {
        this.error = error;
        this.status = status;
    }
}