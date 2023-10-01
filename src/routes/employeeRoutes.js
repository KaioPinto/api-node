// Importa o módulo 'express' e cria um roteador usando 'express.Router()'
const employeeRouter = require("express").Router();

// Importa o controlador de funcionários (employeeControl) que contém as funções de manipulação de funcionários
const employeeControl = require("../controllers/employeeControl");

// Rota para obter a lista de funcionários
employeeRouter
  .route("/employee")
  // Leitura de todos os funcionários
  .get((req, res) => {
    employeeControl.getEmployee(req, res);
  });

// Rota para criar um novo funcionário
employeeRouter
  .route("/employee/register")
  // Criação de um novo funcionário
  .post((req, res) => {
    employeeControl.createEmployee(req, res);
  });

// Rota para login de funcionários
employeeRouter.route("/employee/login").post((req, res) => {
  employeeControl.loginEmployee(req, res);
});

// Rota para criar e obter produtos relacionados aos funcionários
employeeRouter
  .route("/employee/Product")
  // Criação de um novo produto
  .post((req, res) => {
    employeeControl.createProduct(req, res);
  })
  // Leitura de todos os produtos
  .get((req, res) => {
    employeeControl.getProdutos(req, res);
  });

// Rotas para produtos específicos com base no ID
employeeRouter
  .route("/employee/Product/id")
  // Leitura de um produto específico por ID
  .get((req, res) => {
    employeeControl.getProductById(req, res);
  })
  // Atualização de um produto por ID
  .patch((req, res) => {
    employeeControl.updateProduct(req, res);
  })
  // Exclusão de um produto por ID
  .delete((req, res) => {
    employeeControl.deleteProduct(req, res);
  });

// Rotas para manipulação de informações de usuários
employeeRouter
  .route("/employee/user/id")
  // Exclusão de um usuário por ID
  .delete((req, res) => {
    employeeControl.deleteUser(req, res);
  })
  // Leitura de um usuário por ID
  .post((req, res) => {
    employeeControl.getUserID(req, res);
  });

// Rota para obter a lista de todos os usuários
employeeRouter
  .route("/employee/user")
  .get((req, res) => employeeControl.getUsers(req, res));

// Rotas para manipulação de informações de funcionários com base no ID
employeeRouter
  .route("/employee/:id")
  // Leitura de um funcionário por ID
  .get((req, res) => {
    employeeControl.getEmployeeById(req, res);
  })
  // Atualização de dados de um funcionário por ID
  .patch((req, res) => {
    employeeControl.updateEmployee(req, res);
  })
  // Exclusão de um funcionário por ID
  .delete((req, res) => {
    employeeControl.deleteEmployee(req, res);
  });

// Exporta o roteador 'employeeRouter' para ser usado em outras partes da aplicação
module.exports = employeeRouter;
