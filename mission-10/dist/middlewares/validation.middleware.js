import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { HttpError } from '../errors/http-error.js';
export const validationMiddleware = (type, skipMissingProperties = false) => {
    return async (req, res, next) => {
        const errors = await validate(plainToInstance(type, req.body), { skipMissingProperties });
        if (errors.length > 0) {
            const message = errors.map((error) => Object.values(error.constraints || {})).join(', ');
            next(new HttpError(400, message));
        }
        else {
            next();
        }
    };
};
