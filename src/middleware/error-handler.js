const { NotFoundError, ValidationError, AuthError, DatabaseError } = require('../errors');

console.log('####### ERROR HANDLER FILE LOADED #######');

function errorHandler(err, req, res, next) {
    console.log('>>> errorHandler hit:', err.name);

    if(err instanceof NotFoundError) {
        return res.status(404).json({ error: err.message });
    }

    if(err instanceof ValidationError) {
        return res.status(400).json({ error: err.message });
    }
    
    if(err instanceof AuthError) {
        return res.status(401).json({ error: err.message });
    }

    if(err instanceof DatabaseError) {
        return res.status(500).json({ error: err.message });
    }

    console.error(err);
    return res.status(500).json({ error: 'internal server error' });
}

module.exports = { errorHandler }