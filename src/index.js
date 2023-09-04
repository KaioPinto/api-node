// Importa o módulo 'express' e cria uma instância do aplicativo Express
const express = require('express');
const app = express();

// Define a porta em que o aplicativo será executado
const PORT = 3000;

// Importa o módulo 'mongoose' para se conectar ao MongoDB
const mongoose = require('mongoose');

// Carrega as variáveis de ambiente do arquivo .env
require('dotenv').config();

// Middleware para processar dados no formato JSON
app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());

// Importa o middleware de autenticação
const middleware = require('../src/middlewares/auth');
app.use(middleware);

// Importa as rotas relacionadas a usuários e funcionários
const userRoutes = require('./routes/userRoutes');
app.use(userRoutes);

const employeeRoutes = require('./routes/employeeRoutes');
app.use(employeeRoutes);

// Inicia o servidor Express e o faz ouvir na porta definida
app.listen(PORT, () => {
  console.log(`Está rodando na porta ${PORT}`);
});

// Obtém as credenciais do banco de dados a partir das variáveis de ambiente
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

// Conecta-se ao MongoDB usando as credenciais fornecidas
mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPass}@api-node.y24fu0u.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => {
    console.log(`Conectados ao MongoDB`);
  })
  .catch(err => console.log(err));
