module.exports.isAuth = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).render('pages/not_authorized_page', {
            title: 'Not Authorized',
        });
    }
};
