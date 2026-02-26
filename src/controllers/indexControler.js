const messagesDB = require('../db/messageQueries');

const getIndexPage = (req, res) => {
    if (req.isAuthenticated()) {
        const { username, membership_status } = req.user;
        return res.render('pages/index', {
            title: 'Home Member',
            currentUser: { username, membership_status },
        });
    }
    return res.render('pages/index', {
        title: 'Home',
    });
};

module.exports = { getIndexPage };
