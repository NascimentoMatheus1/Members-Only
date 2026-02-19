const pool = require('./pool');

async function getByUsername(username) {
    const { rows } = await pool.query(
        'SELECT * FROM users WHERE username = $1',
        [username],
    );

    return rows[0];
}

async function createUser(firstname, lastname, username, password_hash) {
    const { rows } = await pool.query(
        `
        INSERT INTO users (first_name, last_name, username, password)
        VALUES ($1, $2, $3, $4) RETURNING *
        `,
        [firstname, lastname, username, password_hash],
    );

    return rows[0];
}

async function updateUserBecomeMember(id) {
    const { rows } = await pool.query(
        `
        UPDATE users SET membership_status = true WHERE id = $1 RETURNING *;
        `,
    );
    return rows[0];
}

module.exports = {
    getByUsername,
    createUser,
    updateUserBecomeMember,
};
