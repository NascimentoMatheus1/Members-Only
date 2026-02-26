const messagesDB = require('../db/messageQueries');

const getIndexPage = async (req, res) => {
    try {
        const currentUser = req.user
            ? {
                  username: req.user.username,
                  membership_status: req.user.membership_status,
              }
            : null;

        if (req.isAuthenticated() && req.user.membership_status) {
            const messages = await messagesDB.selectAllMessagesInnerJoinUser();
            return res.render('pages/index', {
                title: 'Home Member',
                currentUser,
                posts: messages,
            });
        }

        const messages = await messagesDB.selectAllMessages();
        
        return res.render('pages/index', {
            title: 'Home',
            currentUser,
            posts: messages,
        });
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = { getIndexPage };
