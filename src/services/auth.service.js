const { supabase } = require('../util/supabase');
const { validateCredentials, checkSuccess, validateToken, checkUser } = require('../util/validate');

async function signUp(email, password) {
    const { data, error } = await supabase.auth.signUp({ email, password });
    checkSuccess(error);

    validateCredentials(email, password);

    return data;
}

async function login(email, password) {
    validateCredentials(email, password);

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    checkSuccess(error);

    const accessToken = data.session.access_token;
    const refreshToken = data.session.refresh_token;

    return {
        accessToken,
        refreshToken
    };
}

async function signOut() {
    const {error} = await supabase.auth.signOut();
    checkSuccess(error);
}

module.exports = { signUp, login, signOut };