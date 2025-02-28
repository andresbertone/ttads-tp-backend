class ApiError {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }

    static badRequest(message) {
        return new ApiError(400, message);
    }
    
    static unauthorized(message) {
        return new ApiError(401, message);
    }
    
    static forbidden(message) {
        return new ApiError(403, message);
    }
    
    static notFound(message) {
        return new ApiError(404, message);
    }

}

module.exports = ApiError;