module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'Please log in to use WardDB');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAdmin = (req, res, next) => {
    if (!req.user.isAdmin) {
        req.flash('error', 'You must be logged in as an admin to view that page');
        return res.redirect('/login');
    }
    next();
}
