export default class ApiError extends Error {
    info?: any;
    status?: number;
    response?: any;
    headers?: any;

    constructor(message: string) {
        super(message);
    }
}