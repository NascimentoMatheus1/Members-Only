module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).render('pages/error_page', {
            title: 'Not Authorized',
            status: 401,
            message: 'Access Denied / Not Authorized ',
            notice: `Sorry, you don't have permission to access this page. Please check your credentials.`,
        });
    }
};

module.exports.isMember = (req, res, next) => {
    if (req.isAuthenticated() && req.user.membership_status) {
        next();
    } else {
        res.status(403).render('pages/error_page', {
            title: 'Forbidden',
            status: 403,
            message: `Forbidden request – You don't have permission to access`,
            notice: `That's an error. We're sorry, but you do not have access to this page. `,
        });
    }
};
