
export const isLogged = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        return res.json({
            message: 'You are not logged in',
            code: 'not_logged_in'
        });
    }
}

export const isAdmin = (req, res, next) => {
    if (req.isAuthenticated() && req.user.role === 'admin') {
        next();
    } else {
        return res.json({
            message: 'You are not an admin',
            code: 'not_admin'
        });
    }
}