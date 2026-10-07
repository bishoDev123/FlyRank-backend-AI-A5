const { supabase } = require('../util/supabase');
const { checkSuccess, checkUser, validateToken } = require('../util/validate');

async function requireAuth(req, res, next) {
    try {
        const token = validateToken(req.headers.authorization);

        const { data, error } = await supabase.auth.getUser(token);
        checkSuccess(error);
        checkUser(data);

        req.user = data.user;
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = requireAuth;