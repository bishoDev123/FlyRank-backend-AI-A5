const { ValidationError, NotFoundError, AuthError } = require('../errors');

function validateTitle(title) {
    if (!title) throw new ValidationError('Title is required');
    if (typeof title !== 'string') throw new ValidationError('Title must be a string');

    const trimmed = title.trim();

    if (trimmed.length === 0) throw new ValidationError('Title must not be empty');
    if (trimmed.length > 255) throw new ValidationError('Title must not exceed 255 characters');

    return trimmed;
}

function validateId(id) {
    if (!Number.isInteger(id) || id <= 0)
        throw new ValidationError(`Invalid task id: ${id}`);
}

function validateTask(task, id) {
    if (!task)
        throw new NotFoundError(`Couldn't find task with id: ${id}`);
}

function validateDone(done) {
    if (!typeof done !== "boolean")
        throw new ValidationError(`couldn't change task status`);
}

function validateCredentials(email, password) {
    if (!email || !password) {
        throw new ValidationError('invalid credentials');
    }
}

function checkSuccess(error) {
    if (error) throw new AuthError(error.message);
}

function checkUser(data) {
    if (!data?.user) throw new AuthError('Invalid or expired token');
}

function validateToken(authHeader) {
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.split(' ')[1];
    } else {    
        throw new AuthError('Access token required');
    }
}


module.exports = {
    validateTitle,
    validateId,
    validateTask,
    validateDone,
    validateCredentials,
    checkSuccess,
    checkUser,
    validateToken
};