require('dotenv').config();
const { Client } = require('pg');

//   user    |  password
// alice_dev, senhaSegura123
// bruno_user, bruno@2024
// carla_mkt, mkt_pass_99

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

    ALTER TABLE users ADD COLUMN admin BOOL default false;

    INSERT INTO users (first_name, last_name, username, password, membership_status, admin)
    VALUES 
    ('Alice', 'Silva', 'alice_dev', '$2b$10$Nia96zrPzGpO92923MTYcuhq2neVgB2/6f1y8N2RPWJVdrnjY4X2i', true, true),
    ('Bruno', 'Souza', 'bruno_user', '$2b$10$PXvp7d2xmW/D.LsMS/sPSOmPReLDH.tHkkCuGz9S5NtC4XjhVTtqW', true, false),
    ('Carla', 'Oliveira', 'carla_mkt', '$2b$10$TyU9W.qcjCTSdb9Qy4Hw8em/kRNYQtyKOVnwM7evPQLZ6I9zihJMS', false, false)

    CREATE TABLE IF NOT EXISTS messages(
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        content TEXT NOT NULL,
        user_id INT REFERENCES users(id)
    );    

    INSERT INTO messages (title, content, user_id)
    VALUES 
    -- Mensagens do Usuário 1 (Alice)
    ('Bem-vindo ao fórum', 'Olá a todos! Este é o primeiro post do nosso novo sistema.', 1),
    ('Dúvida sobre Git', 'Alguém sabe a diferença real entre merge e rebase?', 1),
    ('Dica de SQL', 'Sempre use índices em colunas que você consulta muito no WHERE.', 1),
    ('Café da manhã', 'Nada como um café antes de começar a codar.', 1),

    -- Mensagens do Usuário 2 (Bruno)
    ('Erro no Node.js', 'Estou recebendo um erro de "Modules not found". Ajuda?', 2),
    ('Novo curso', 'Acabei de terminar o curso de PostgreSQL, muito bom!', 2),
    ('Setup novo', 'Finalmente comprei minha cadeira ergonômica.', 2),
    ('Dica de VS Code', 'O plugin "Prettier" salva vidas, pessoal.', 2),

    -- Mensagens do Usuário 3 (Carla)
    ('Campanha de Marketing', 'Lançamos a nova campanha hoje, confiram no site.', 3),
    ('Relatório Mensal', 'Os números de acesso subiram 20% este mês.', 3),
    ('Brainstorming', 'Ideias para o nome do novo produto? Mandem aqui.', 3),
    ('Reunião adiada', 'A call das 14h passou para as 16h.', 3)

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
