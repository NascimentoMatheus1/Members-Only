const pool = require('./pool');

async function selectAllMessages() {
    try {
        const { rows } = await pool.query('SELECT * FROM messages ORDER BY create_at DESC;');
        return rows;
    } catch (error) {
        console.log(error.messages);
    }
}

async function selectAllMessagesInnerJoinUser() {
    try {
        const { rows } = await pool.query(`
            SELECT title, content, messages.create_at, 
            first_name, last_name, username FROM messages 
            INNER JOIN users 
            ON (messages.user_id = users.id)
            ORDER BY messages.create_at DESC;`);
        return rows;
    } catch (error) {
        console.log(error.messages);
    }
}

async function insertNewMessage(title, message, userId) {
    try {
        const { rows } = await pool.query(
            `
        INSERT INTO messages (title, content, user_id) 
        VALUES ($1, $2, $3) RETURNING *`,
            [title, message, userId],
        );
        return rows[0];
    } catch (error) {
        console.log(error.messages);
    }
}

module.exports = {
    selectAllMessages,
    selectAllMessagesInnerJoinUser,
    insertNewMessage,
};
