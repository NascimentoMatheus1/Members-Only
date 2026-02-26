const pool = require('./pool');

async function getByUsername(username) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username],
        );

        return rows[0];
    } catch (error) {
        console.log(error.message);
    }
}

async function createUser(firstname, lastname, username, password_hash) {
    try {
        const { rows } = await pool.query(
            `
        INSERT INTO users (first_name, last_name, username, password)
        VALUES ($1, $2, $3, $4) RETURNING *
        `,
            [firstname, lastname, username, password_hash],
        );

        return rows[0];
    } catch (error) {
        console.log(error.message);
    }
}

async function updateUserBecomeMember(id) {
    try {
        const { rows } = await pool.query(
            `
        UPDATE users SET membership_status = true WHERE id = $1 RETURNING *;
        `,
            [id],
        );
        return rows[0];
    } catch (error) {
        console.log(error.message);
    }
}

async function selectUserPosts(id) {
    try {
        const { rows } = await pool.query(
            `
        SELECT * FROM messages WHERE user_id = $1;
        `,
            [id],
        );
        return rows;
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = {
    getByUsername,
    createUser,
    updateUserBecomeMember,
    selectUserPosts,
};
