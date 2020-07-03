import { CustomError } from './custom-error'
import { errorHandler } from '../middlewares/error-handler'

export class NotFoundError extends CustomError {
    statusCode = 404
    constructor() {
        super('not found')
        Object.setPrototypeOf(this, NotFoundError.prototype)
    }
    serializeErrors() {
        return [{ message: 'not found' }]
    }
}