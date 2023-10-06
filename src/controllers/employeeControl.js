// Importa os modelos Employee, User e Product
const Employee = require("../models/Employee");
const User = require("../models/User");
const Product = require("../models/Product");
// Importa as bibliotecas jwt (JSON Web Token) e bcrypt para autenticação e criptografia
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// Carrega as variáveis de ambiente do arquivo .env
require("dotenv").config();
const secret = process.env.SECRET;

// Função para gerar um token JWT
function tokenGenerator(params) {
  return jwt.sign({ id: params }, secret, {
    expiresIn: 86400, // Token expira em 24 horas
  });
}

// Controladores para as rotas relacionadas aos funcionários

// Cria um novo funcionário
exports.createEmployee = async (req, res) => {
  const newEmployee = req.body;

  if (!req.body.name) {
    return res.status(400).json({ message: "O nome não pode ser nulo!" });
  }
  if (!req.body.cpf) {
    return res.status(400).json({ message: "O campo matrícula não pode ser nulo!" });
  }
  if (!req.body.password) {
    return res.status(400).json({ message: "O campo senha não pode ser nulo!" });
  }
  if (!req.body.email) {
    return res.status(400).json({ message: "O campo email não pode ser nulo!" });

  }
  if (!req.body.lastName) {
    return res.status(400).json({ message: "O campo sobrenome é obrigatório!" });
  }
  const cpf = req.body.cpf;
  const email = req.body.email
  try {
    if (await Employee.findOne({ cpf: cpf })) {
      return res.status(400).json({ message: "Usuário já existe!" });
    }
    if (await Employee.findOne({ email: email })) {
      return res.status(400).json({ message: "o e-mail tem que ser único!" });

    }
    await Employee.create(newEmployee);
    newEmployee.password = undefined; // Remove a senha do objeto de resposta
    const token = tokenGenerator({ id: cpf })
    return res.status(201).json({ 'Access-Token': `${token}`, 'EmployeeData': newEmployee.cpf });
  } catch (error) {
   
    return res.status(500).send({ message: "O registro falhou" });
  }
};

// Efetua login de um funcionário
exports.loginEmployee = async (req, res) => {
  try {
    const { cpf, password } = req.body;
    if (!cpf) {
      return res.status(406).json({ message: "Digite um cpf" });
    }
    if (!password) {
      return res.status(406).json({ message: "Digite uma senha" });
    }

    const checkEmployee = await Employee.findOne({ cpf }).select("password");
    if (!checkEmployee) {
      return res.status(404).json({ message: "Usuário não localizado" });
    }
    if (!(await bcrypt.compare(password, checkEmployee.password))) {
      return res.status(400).json({ message: "Senha inválida" });
    }
    const data = await Employee.findOne({ cpf }).select('-password -__v -_id');

    const idEmployee = tokenGenerator({ id: req.cpf })


    res.json({ 'Access-Token': `${idEmployee}`, "EmployeeData": data.cpf });
  } catch (error) {

    res.status(500).json({ message: "Erro ao efetuar login do funcionário." });
  }
};

// Obtém um funcionário por ID
exports.getEmployeeById = async (req, res) => {
  const employeeId = req.body.value;
  try {
    
    const findEmployeeById = await Employee.findOne({cpf: employeeId})
    
    if (!findEmployeeById) {

      return res.status(404).json({ message: "Funcionário não encontrado." });

    }
    res.json(findEmployeeById);
  } catch (error) {

    res.status(500).json({ message: "Erro ao buscar o funcionário." });
  }
};

// Obtém todos os funcionários
exports.getEmployee = async (req, res) => {

  try {
    const findEmployee = await Employee.find().select(["-__v", "-_id"]);
    if (!findEmployee) {
      return res.status(404).json({ message: "Funcionário não encontrado." });
    }
    res.status(200).json({ "authorized": "Autorizado" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o funcionário." });
  }
};

// Atualiza um funcionário por ID
exports.updateEmployee = async (req, res) => {
  //aqui é para futuramente quando o funcionário tiver cargos, ai será bloqueado e apenas gerentes conseguirão alterar
  try {
    const employeeId = req.params.id;
    const filter = { register: employeeId };
    const dateEmployee = req.body;
    const updateEmployee = await Employee.findOneAndUpdate(
      filter,
      dateEmployee,
      {
        new: true,
      }
    );
    if (!updateEmployee) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json({ message: `Funcionário ${req.body.name} atualizado.` });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar o funcionário." });
  }
};

// Remove um funcionário por ID
exports.deleteEmployee = async (req, res) => {
  //aqui é para futuramente quando o funcionário tiver cargos, ai será bloqueado e apenas gerentes conseguirão excluir
  try {
    const employeeId = req.body.id;
    const filter = { register: employeeId };
    const deleteEmployee = await Employee.findOneAndRemove(filter);
    if (!deleteEmployee) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover o funcionário." });
  }
};

// Funções adicionais de funcionários para operar em outras classes (usuários e produtos)

// Remove um usuário por ID (para uso por funcionários)
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.body.cpf;
    const delUser = await User.findOneAndRemove({ cpf: userId });
    if (!delUser) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json({ message: "Usuário removido com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao remover o usuário." });
  }
};

// Obtém todos os usuários (para uso por funcionários)
exports.getUsers = async (req, res) => {
  try {
    const listUsers = await User.find().select(["-__v", "-_id"]);
    if (!listUsers) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(listUsers);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o usuário." });
  }
};

// Obtém um usuário por ID (para uso por funcionários)
exports.getUserID = async (req, res) => {
  try {
    const userID = req.body.cpf;
    if (!userID) {
      return res
        .status(406)
        .json({ message: " Digite o cpf para que a busca ocorra!" });
    }
    const newEmployee = await User.findOne({ cpf: userID }).select([
      "-__v",
      "-_id",
    ]);
    if (!newEmployee) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }
    res.json(newEmployee);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o usuário." });
  }
};

// Cria um novo produto
exports.createProduct = async (req, res) => {

  try {
    const productDate = req.body;
    const validationId = await Product.findOne({ cod: req.body.cod }).select(["-__v"])
    if (validationId) {
      validationId.amount += productDate.amount;
      validationId.save()
      return res.status(200).json({ "message": `Estoque do produto atualizado ${validationId.item + " " + validationId.amount}` });
    }
    await Product.create(productDate);
    return res.status(201).json({ "Confirme": ' Produto criado com sucesso' });

  } catch (error) {
    return res.status(500).json({ message: "Erro ao criar um novo produto." });
  }
};

// Obtém todos os produtos
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find().select(["-__v"]);
    if (!products) {
      return res.status(404).json({ message: "Produtos não encontrados." });
    }
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar os produtos." });
  }
};

// Obtém um produto por ID
exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).select(["-__v"]);
    if (!product) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar o produto pelo ID." });
  }
};

// Atualiza um produto por ID dependendo do que foi fornecido
exports.updateProduct = async (req, res) => {
  try {
    const productId = req.body.id;
    if (!productId) {
      return res.status(500).json({ message: "Erro ao atualizar o produto, pois não foi fornecido um id." });
      
    }
    const findProduct = await Product.findById(productId)
    if (!findProduct) {
      return res.status(500).json({ message: "Produto não localizado." });
      
    }
    
    
    if (req.body.amount) {
      findProduct.amount += req.body.amount;
      
      
      
    }
    else if (req.body.value) {
      findProduct.value = req.body.value;
      
    }
    else if (req.body.item) {
      findProduct.item = req.body.item;

    }
    else if (req.body.type) {
      findProduct.type = req.body.type;

    }
    await findProduct.save()

    return res.json({ "Confirmado": `O produto ${findProduct.item}, foi alterado.` });
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o produto." });
  }
};

// Remove um produto por ID
exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.body.id;
   
    const deleteProduct = await Product.findByIdAndRemove(productId);
    if (!deleteProduct) {
      return res.status(404).json({ message: "Produto não encontrado." });
    }
    res.json({ "confirme": `Produto ${deleteProduct.name} removido com sucesso.`});
  } catch (error) {
    res.status(500).json({ message: "Erro ao remover o produto." });
  }
};
