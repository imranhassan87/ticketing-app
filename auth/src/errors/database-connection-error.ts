import { ValidationError } from "express-validator";

import { CustomError } from './custom-error'

export class DatabaseConnectionError extends CustomError {
    reason = "error connecting to database"
    statusCode = 500
    constructor() {
        super('database error')

        Object.setPrototypeOf(this, DatabaseConnectionError.prototype)
    }
    serializeErrors() {
        return [{ message: this.reason }]
    }
}