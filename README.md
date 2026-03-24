# 🕵️‍♂️ Apenas membros
- Um aplicativo de mensagens exclusivo onde a identidade dos autores é protegida por níveis de acesso. Apenas membros do clube podem ver quem escreveu o quê, e apenas administradores têm o poder de moderação.

# 🌐 Deploy (Hospedagem)
- Você pode explorar a aplicação no link 👉 [🔥 Live Demo](https://members-only-x8sh.onrender.com)
- Backend: Node.js/Express hospedado no Render (Plano Gratuito).
- Banco de Dados: PostgreSQL hospedado na plataforma Neon.
- **Nota: Este projeto está em um servidor gratuito que "hiberna" após períodos de inatividade. Aguarde cerca de um minuto para o carregamento inicial**

# Uso
- Cadastro – Crie uma nova conta (o status de membro começa como false).
- Login – Use suas credenciais para acessar.
- Clique no link para tornar-se membro.
- Criar um post – clique em “Novo Post” para enviar uma mensagem anônima.

# 🚀 Funcionalidades
- Autenticação de usuários: Cadastro, login e logout usando Passport.js e bcrypt.
- Entrar no clube: Torne-se membro digitando um código secreto.
- Criar posts – Usuários autenticados podem escrever novos posts (título, texto).
- Sistema de Autenticação: Registro e Login seguros utilizando Passport.js e bcrypt para hashing de senhas.
## Níveis de Acesso:
- Visitante: Pode ler as mensagens, mas o autor e a data são anônimos.
- Usuário Logado: Pode criar novas mensagens.
- Membro do Clube: Ao inserir um "código secreto", ganha o status de membro e passa a ver os autores e datas das postagens.
- Admin: Possui permissões totais, incluindo a capacidade de excluir qualquer mensagem.

# 📊 Estrutura do Banco de Dados
O projeto utiliza duas tabelas principais integradas:
### Tabela users
```SQL
id SERIAL PRIMARY KEY,
first_name VARCHAR(100),
last_name VARCHAR(100),
username VARCHAR(255) UNIQUE,
password VARCHAR(255),
membership_status BOOLEAN DEFAULT false,
admin BOOLEAN DEFAULT false
```
### Tabela messages
```SQL
id SERIAL PRIMARY KEY,
title VARCHAR(255),
content TEXT,
create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
user_id INT REFERENCES users(id)
```

# Variáveis de Ambiente
- DATABASE_URL	String de conexão com o PostgreSQL.
- SESSION_SECRET	Usada para assinar o cookie de sessão.

# 🛠️ Tecnologias Utilizadas
- Backend: Node.js com Express.
- Banco de Dados: PostgreSQL (Relacional).
- Autenticação: Passport.js (Estratégia Local).
- View Engine: EJS.
- Estilização: CSS3.

# 📝 Lições Aprendidas
Neste projeto, pratiquei intensamente:
- Configuração de estratégias de autenticação com Passport.js.
- Gerenciamento de sessões de usuário.
- Criação de Middlewares personalizados para controle de rotas baseado em permissões (ex: isAdmin, isMember).
- Modelagem de dados relacionais e proteção de informações sensíveis.
