class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = 'NotFoundError';
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ValidationError';
    }
}

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = 'AuthError';
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message)
        this.name = 'DatabaseError';
    }
}

module.exports = { NotFoundError, ValidationError, AuthError, DatabaseError };