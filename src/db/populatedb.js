require('dotenv').config();
const { Client } = require('pg');

const SQL = `
    CREATE TABLE IF NOT EXISTS users(
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        membership_status BOOLEAN DEFAULT false
    );

    CREATE TABLE IF NOT EXISTS messages(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL,
        user_id INT REFERENCES users(id)
    );

    INSERT INTO users (first_name, last_name, username, password) 
    VALUES 
    ('John', 'Doe', 'john.doe@email.com', '$2b$10$hashed_password_here'),
    ('Jane', 'Smith', 'jane.smith@email.com', '$2b$10$hashed_password_here'),
    ('Robert', 'Pattinson', 'rob.patt@email.com', '$2b$10$hashed_password_here');

    INSERT INTO messages (title, content, user_id) 
    VALUES 
    ('Hello World!', 'Welcome to our secret message board.', 1),
    ('Need help with Express', 'How do I handle errors in middleware?', 2),
    ('Maintenance Notice', 'The database will be down for upgrades tomorrow at 2:00 AM.', 1),
    ('Testing', 'Is this message showing up correctly?', 3);
`;

async function main() {
    console.log('sending...');
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });
    await client.connect();
    await client.query(SQL);
    await client.end();
    console.log('Done!');
}

main();
