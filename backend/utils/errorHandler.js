//Error Handler Class
class ErrorHandler extends Error {

    //Message: error message
    //Code: error code
    constructor(message, statusCode) {
        //super stands for the parent class constructor
        // In this case Error class constructor
        super(message)
        this.statusCode = statusCode

        // It will create
        Error.captureStackTrace(this , this.constructor)
    }
    
}

module.exports = ErrorHandler;