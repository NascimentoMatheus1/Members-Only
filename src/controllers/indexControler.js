const messagesDB = require('../db/messageQueries');

const getIndexPage = async (req, res) => {
    if (req.isAuthenticated()) {
        const { username, membership_status } = req.user;
        const messages = await messagesDB.selectAllMessagesInnerJoinUser();
        return res.render('pages/index', {
            title: 'Home Member',
            currentUser: { username, membership_status },
            posts: messages,
        });
    }
    const messages = await messagesDB.selectAllMessages();
    return res.render('pages/index', {
        title: 'Home',
        posts: messages,
    });
};

module.exports = { getIndexPage };
