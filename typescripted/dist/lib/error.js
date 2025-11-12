"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpError extends Error {
    status;
    message;
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.default = HttpError;
//export const error_handler = (err: unknown,req:Request, res: Response, next:NextFunction) => {
//}
