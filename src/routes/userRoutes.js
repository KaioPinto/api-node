// Importa o módulo 'express' e cria um roteador usando 'express.Router()'
const userRouter = require('express').Router();

// Importa o controlador de usuários (userControl) que contém as funções de manipulação de usuários
const userControl = require('../controllers/userControl');

// Rota para registrar um novo usuário
userRouter.route('/user/register').post((req, res) => {
  userControl.createUser(req, res);
});

// Rota para realizar uma compra de produto pelo usuário
userRouter.route('/user/compra').post((req, res) => {
  userContro.productBuy(req, res);
});

// Rota para fazer login de usuário
userRouter.route('/user/login').post((req, res) => {
  userControl.loginUser(req, res);
});

// Rota para obter a lista de todos os usuários
userRouter
  .route('/user')
  // Leitura de todos os usuários
  .get((req, res) => {
    userControl.getUsers(req, res);
  });

// Rota para obter um usuário por ID, atualizar e deletar um usuário por ID
userRouter
  .route('/user/id')
  // Leitura de um usuário por ID
  .post((req, res) => {
    userControl.getUserById(req, res);
  })
  // Atualização de dados de um usuário por ID
  .patch((req, res) => {
    userControl.updateUser(req, res);
  })
  // Exclusão de um usuário por ID
  .delete((req, res) => {
    userControl.deleteUser(req, res);
  });

// Exporta o roteador 'userRouter' para ser usado em outras partes da aplicação
module.exports = userRouter;

// Rota para obter informações de promoção para um usuário específico com base no ID
userRouter.route('/user/promocao').post((req, res) => {
  userControl.getPromo(req, res);
});
